import { AnimatePresence, motion } from "framer-motion";
import {
  Disc3,
  FolderOpen,
  Pause,
  Play,
  Volume2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Floating low-impact local music player (the web stand-in for Expo-AV).
 * - Plays audio files picked from the user's device (nothing is uploaded).
 * - Auto-pauses when the tab is hidden (mirrors "pause when not visible").
 * - Revokes the object URL and releases the audio element on unmount.
 */
export function MusicPlayer() {
  const [collapsed, setCollapsed] = useState(true);
  const [fileName, setFileName] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const stopAndCleanup = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = "";
      audio.load();
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    setPlaying(false);
    setTime(0);
    setDuration(0);
  }, []);

  // Cleanup on unmount: no leaked object URLs, no lingering playback.
  useEffect(() => {
    return stopAndCleanup;
  }, [stopAndCleanup]);

  // Auto-pause when the tab is hidden (battery-friendly).
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) audioRef.current?.pause();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const handlePick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("audio/")) {
      toast.error("Please choose an audio file (MP3, M4A, WAV, OGG…)");
      return;
    }

    stopAndCleanup();
    const url = URL.createObjectURL(file);
    urlRef.current = url;
    setFileName(file.name);

    const audio = new Audio();
    audio.preload = "metadata";
    audio.src = url;
    audio.volume = volume;
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    audio.addEventListener("timeupdate", () => setTime(audio.currentTime));
    audio.addEventListener("ended", () => setPlaying(false));
    audio.addEventListener("play", () => setPlaying(true));
    audio.addEventListener("pause", () => setPlaying(false));
    audio.addEventListener("error", () => {
      stopAndCleanup();
      setFileName(null);
      toast.error("That audio file couldn't be played on this device.");
    });

    void audio.play().catch(() => {
      toast.error("Autoplay was blocked — press play to start.");
    });
    setCollapsed(false);
    toast.success(`Now playing: ${file.name}`);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void audio.play().catch(() => undefined);
    else audio.pause();
  };

  const seek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setTime(value);
  };

  const changeVolume = (value: number) => {
    setVolume(value);
    if (audioRef.current) audioRef.current.volume = value;
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handlePick}
        aria-hidden
      />

      <AnimatePresence>
        {collapsed ? (
          <motion.button
            key="fab"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            whileHover={{ y: -4, scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setCollapsed(false)}
            className="glass-chip fixed bottom-5 right-5 z-[80] flex size-14 items-center justify-center rounded-full text-wistaria"
            aria-label="Open music player"
          >
            <Disc3 className="size-6" />
          </motion.button>
        ) : (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="glass-strong fixed bottom-5 right-5 z-[80] w-[min(92vw,340px)] rounded-3xl p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-cloud/25 text-cloud">
                  <Disc3 className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {fileName ?? "Local study music"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {fileName ? "Playing from your device" : "Plays offline — nothing uploads"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCollapsed(true)}
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted"
                aria-label="Collapse player"
              >
                <X className="size-4" />
              </button>
            </div>

            {fileName && audioRef.current && (
              <>
                <div className="mt-3 flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={Math.max(duration, 1)}
                    step={0.5}
                    value={time}
                    onChange={(e) => seek(Number(e.target.value))}
                    className="h-1.5 flex-1 cursor-pointer accent-[#7b9ee8]"
                    aria-label="Seek"
                  />
                </div>
                <div className="mt-1 flex justify-between text-[11px] font-medium tabular-nums text-muted-foreground">
                  <span>{formatTime(time)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </>
            )}

            <div className="mt-3 flex items-center justify-between">
              <button
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-full bg-cloud/20 px-3 py-1.5 text-xs font-semibold text-[#3f5f8f] transition-colors hover:bg-cloud/30"
              >
                <FolderOpen className="size-3.5" />
                Load music
              </button>

              <button
                onClick={togglePlay}
                disabled={!fileName}
                className={cn(
                  "flex size-11 items-center justify-center rounded-full transition-all disabled:opacity-40",
                  playing
                    ? "bg-[#7b9ee8] text-white shadow-[0_8px_20px_-6px_rgba(123,158,232,0.6)]"
                    : "glass-chip text-wistaria",
                )}
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? (
                  <Pause className="size-5" />
                ) : (
                  <Play className="ml-0.5 size-5" />
                )}
              </button>

              <div className="flex items-center gap-1.5">
                <Volume2 className="size-4 text-muted-foreground" />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={(e) => changeVolume(Number(e.target.value))}
                  className="h-1.5 w-16 cursor-pointer accent-[#7b9ee8]"
                  aria-label="Volume"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
