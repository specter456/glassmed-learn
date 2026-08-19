import { GlassBackdrop } from "@/components/GlassBackdrop";
import { AppHeader } from "@/components/AppHeader";
import {
  AudioLines,
  Clock,
  Mic,
  Pause,
  Play,
  RotateCcw,
  Save,
  ShieldCheck,
  Square,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  deleteVoiceNote,
  listVoiceNotes,
  saveVoiceNote,
  type VoiceNoteRecord,
} from "@/lib/voiceNotes";

/** Memo cap (seconds) — keeps recordings small and storage predictable. */
const MAX_SECONDS = 300;

function formatClock(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatStamp(ts: number): string {
  try {
    return new Date(ts).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

/** Best supported audio container on this browser (webm on Chrome, mp4 on Safari…). */
function pickMimeType(): string {
  if (typeof window === "undefined" || typeof window.MediaRecorder !== "function") return "";
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];
  return candidates.find((c) => window.MediaRecorder.isTypeSupported(c)) ?? "";
}

export default function VoiceNotes() {
  const [supported] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.MediaRecorder === "function" &&
      typeof navigator !== "undefined" &&
      !!navigator.mediaDevices?.getUserMedia,
  );

  const [phase, setPhase] = useState<"idle" | "recording" | "preview">("idle");
  const [elapsed, setElapsed] = useState(0);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [previewDuration, setPreviewDuration] = useState(0);
  const [notes, setNotes] = useState<VoiceNoteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const previewUrlRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlMapRef = useRef<Map<string, string>>(new Map());
  const mountedRef = useRef(true);

  // Load saved notes on mount.
  useEffect(() => {
    let cancelled = false;
    listVoiceNotes()
      .then((all) => {
        if (!cancelled) setNotes(all);
      })
      .catch(() => {
        /* non-fatal */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const stopEverything = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      try {
        recorderRef.current.stop();
      } catch {
        /* already stopped */
      }
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (timerRef.current != null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, []);

  /** Release all blob URLs and revoke media resources. Called once at unmount. */
  const releaseAll = useCallback(() => {
    for (const url of urlMapRef.current.values()) URL.revokeObjectURL(url);
    urlMapRef.current.clear();
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  }, []);

  // Full cleanup on unmount.
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopEverything();
      releaseAll();
    };
  }, [stopEverything, releaseAll]);

  /** Start recording via MediaRecorder. */
  const startRecording = async () => {
    if (!supported) {
      toast.error("Recording is not supported in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mountedRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      streamRef.current = stream;
      chunksRef.current = [];
      const mimeType = pickMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        if (!mountedRef.current) return;
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        setPreviewBlob(blob);
        setPreviewDuration(elapsedRef.current);
        setPhase("preview");

        // Compute duration from the blob via an off-screen audio element.
        const url = URL.createObjectURL(blob);
        previewUrlRef.current = url;
        const audio = new Audio(url);
        audio.addEventListener("loadedmetadata", () => {
          if (mountedRef.current && Number.isFinite(audio.duration)) {
            setPreviewDuration(Math.ceil(audio.duration));
          }
        });
      };

      recorder.start(250);
      elapsedRef.current = 0;
      setElapsed(0);
      setPhase("recording");

      timerRef.current = window.setInterval(() => {
        elapsedRef.current += 1;
        if (mountedRef.current) setElapsed(elapsedRef.current);
        if (elapsedRef.current >= MAX_SECONDS) {
          stopRecording();
        }
      }, 1000);
    } catch (err) {
      console.error("[VoiceNotes] getUserMedia error:", err);
      toast.error("Microphone access denied. Please allow microphone access in your browser settings.");
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (timerRef.current != null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const discardRecording = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewBlob(null);
    setPreviewDuration(0);
    setPhase("idle");
    setElapsed(0);
  };

  const saveRecording = async () => {
    if (!previewBlob) return;
    setSaving(true);
    try {
      const note: VoiceNoteRecord = {
        id: crypto.randomUUID(),
        name: `Memo ${formatStamp(Date.now())}`,
        blob: previewBlob,
        durationSec: previewDuration,
        createdAt: Date.now(),
      };
      await saveVoiceNote(note);
      setNotes((prev) => [note, ...prev]);
      toast.success("Voice note saved! 🎙️");
      discardRecording();
    } catch {
      toast.error("Failed to save voice note. Storage may be full.");
    } finally {
      setSaving(false);
    }
  };

  const playNote = (note: VoiceNoteRecord) => {
    if (playingId === note.id) {
      // Stop
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingId(null);
      return;
    }

    // Stop any currently playing.
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const url = urlMapRef.current.get(note.id) ?? URL.createObjectURL(note.blob);
    urlMapRef.current.set(note.id, url);
    const audio = new Audio(url);
    audioRef.current = audio;
    setPlayingId(note.id);

    audio.onended = () => {
      if (mountedRef.current) setPlayingId(null);
    };
    audio.play().catch(() => {
      if (mountedRef.current) setPlayingId(null);
    });
  };

  const deleteNote = async (note: VoiceNoteRecord) => {
    try {
      await deleteVoiceNote(note.id);
      const url = urlMapRef.current.get(note.id);
      if (url) {
        URL.revokeObjectURL(url);
        urlMapRef.current.delete(note.id);
      }
      setNotes((prev) => prev.filter((n) => n.id !== note.id));
      if (playingId === note.id) {
        if (audioRef.current) audioRef.current.pause();
        setPlayingId(null);
      }
      toast.success("Voice note deleted.");
    } catch {
      toast.error("Failed to delete voice note.");
    }
  };

  return (
    <div className="min-h-screen">
      <GlassBackdrop />
      <AppHeader title="Voice Notes" subtitle="Record & play back your study memos" />

      <main className="mx-auto max-w-2xl px-4 pb-40 pt-8 sm:px-6">
        {/* Recorder section */}
        <div className="glass-panel shine rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col items-center gap-5">
            {/* Big record button / timer */}
            {phase === "idle" && (
              <button
                onClick={startRecording}
                disabled={!supported}
                className="group flex size-28 items-center justify-center rounded-full border-2 border-[#e2666f]/40 bg-[#e2666f]/15 transition-all duration-300 hover:scale-105 hover:border-[#e2666f]/70 hover:bg-[#e2666f]/25 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Mic className="size-12 text-[#e2666f] transition-transform duration-300 group-hover:scale-110" />
              </button>
            )}

            {phase === "recording" && (
              <div className="flex flex-col items-center gap-3">
                <div className="relative flex size-28 items-center justify-center">
                  {/* Pulsing ring */}
                  <span className="absolute size-full animate-ping rounded-full border-2 border-[#e2666f]/30" />
                  <span className="absolute size-full rounded-full border-2 border-[#e2666f]/50" />
                  <button
                    onClick={stopRecording}
                    className="relative flex size-20 items-center justify-center rounded-full bg-[#e2666f] shadow-[0_0_30px_rgba(226,102,111,0.5)]"
                  >
                    <Square className="size-8 text-white" fill="white" />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-[#e2666f]">
                  <span className="size-2.5 animate-pulse rounded-full bg-[#e2666f]" />
                  <Clock className="size-4" />
                  <span className="font-mono text-lg font-bold">{formatClock(elapsed)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Recording… Tap the square to stop (max {Math.floor(MAX_SECONDS / 60)} min)
                </p>
              </div>
            )}

            {phase === "preview" && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (previewUrlRef.current) {
                        const audio = new Audio(previewUrlRef.current);
                        audioRef.current = audio;
                        audio.play().catch(() => {});
                      }
                    }}
                    className="flex size-14 items-center justify-center rounded-full border border-wistaria/30 bg-wistaria/15 text-wistaria transition-all hover:bg-wistaria/25"
                  >
                    <Play className="size-6 ml-0.5" />
                  </button>
                  <div className="text-center">
                    <p className="font-mono text-lg font-bold text-wistaria">
                      {formatClock(previewDuration)}
                    </p>
                    <p className="text-xs text-muted-foreground">Preview</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={discardRecording}
                    className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-all hover:bg-white/10"
                  >
                    <RotateCcw className="size-4" />
                    Discard
                  </button>
                  <button
                    onClick={saveRecording}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#78A2D2] to-wistaria px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_-6px_rgba(120,162,210,0.7)] transition-all hover:scale-105 disabled:opacity-50"
                  >
                    <Save className="size-4" />
                    {saving ? "Saving…" : "Save Note"}
                  </button>
                </div>
              </div>
            )}

            {!supported && (
              <p className="text-center text-sm text-muted-foreground">
                Recording is not supported in this browser. Try Chrome or Edge.
              </p>
            )}
          </div>
        </div>

        {/* Saved notes list */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <AudioLines className="size-4 text-wistaria" />
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-muted-foreground">
              My Voice Notes
            </h2>
            {notes.length > 0 && (
              <span className="ml-auto text-xs text-muted-foreground">
                {notes.length} note{notes.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {loading && (
            <div className="glass-panel flex items-center justify-center gap-2 rounded-2xl p-8 text-sm text-muted-foreground">
              <span className="size-4 animate-spin rounded-full border-2 border-wistaria border-t-transparent" />
              Loading notes…
            </div>
          )}

          {!loading && notes.length === 0 && (
            <div className="glass-panel flex flex-col items-center gap-2 rounded-2xl p-8 text-center">
              <Mic className="size-8 text-wistaria/40" />
              <p className="text-sm font-semibold text-muted-foreground">
                No voice notes yet
              </p>
              <p className="text-xs text-muted-foreground">
                Tap the mic above to record your first study memo!
              </p>
            </div>
          )}

          {!loading && notes.length > 0 && (
            <div className="flex flex-col gap-2">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="glass-chip flex items-center gap-3 rounded-2xl px-4 py-3 transition-transform hover:scale-[1.01]"
                >
                  <button
                    onClick={() => playNote(note)}
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                      playingId === note.id
                        ? "bg-wistaria/25 text-wistaria"
                        : "bg-white/5 text-muted-foreground hover:bg-white/10"
                    }`}
                  >
                    {playingId === note.id ? (
                      <Pause className="size-5" />
                    ) : (
                      <Play className="size-5 ml-0.5" />
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {note.name || "Voice Note"}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      <span>{formatClock(note.durationSec)}</span>
                      <span>·</span>
                      <span>{formatStamp(note.createdAt)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteNote(note)}
                    className="shrink-0 rounded-full p-2 text-muted-foreground transition-colors hover:bg-[#e2666f]/15 hover:text-[#e2666f]"
                    aria-label="Delete voice note"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Privacy note */}
        <div className="mt-6 flex items-start gap-2 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-wistaria/60" />
          <p>
            Your voice notes are stored locally on this device and never uploaded anywhere.
            Only you can access them.
          </p>
        </div>
      </main>
    </div>
  );
}
