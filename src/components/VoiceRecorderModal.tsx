import { AnimatePresence, motion } from "framer-motion";
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
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
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

interface VoiceRecorderModalProps {
  open: boolean;
  onClose: () => void;
}

export function VoiceRecorderModal({ open, onClose }: VoiceRecorderModalProps) {
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

  // Load saved notes whenever the modal opens. (No synchronous setState here
  // — `loading` starts true for the first open, and later reopens show the
  // existing list instantly while this refreshes it in the background.)
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    listVoiceNotes()
      .then((all) => {
        if (!cancelled) setNotes(all.sort((a, b) => b.createdAt - a.createdAt));
      })
      .catch(() => {
        if (!cancelled) {
          setNotes([]);
          toast.error("Couldn't load your saved notes in this browser.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  // Object URLs for saved notes — created when the list changes, revoked when
  // a note is deleted or the component unmounts.
  useEffect(() => {
    const map = urlMapRef.current;
    for (const [id, url] of [...map]) {
      if (!notes.some((n) => n.id === id)) {
        URL.revokeObjectURL(url);
        map.delete(id);
      }
    }
    for (const note of notes) {
      if (!map.has(note.id)) map.set(note.id, URL.createObjectURL(note.blob));
    }
  }, [notes]);

  // Full cleanup on unmount (page navigation etc.). The ref reads live in a
  // stable callback rather than the effect cleanup, so they always see the
  // latest values — the recorder/stream/timer refs are reassigned while
  // recording, so capturing them when the effect runs would leak the mic.
  const stopEverything = useCallback(() => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    const recorder = recorderRef.current;
    recorderRef.current = null;
    if (recorder && recorder.state !== "inactive") {
      try {
        recorder.stop();
      } catch {
        /* already stopped */
      }
    }
    for (const url of urlMapRef.current.values()) URL.revokeObjectURL(url);
    urlMapRef.current.clear();
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopEverything();
    };
  }, [stopEverything]);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const discard = useCallback(() => {
    audioRef.current?.pause();
    setPlayingId(null);
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewBlob(null);
    setPreviewDuration(0);
    setElapsed(0);
    elapsedRef.current = 0;
    setPhase("idle");
  }, []);

  const stopRecording = useCallback(() => {
    clearTimer();
    const recorder = recorderRef.current;
    recorderRef.current = null;
    const stream = streamRef.current;
    streamRef.current = null;
    if (stream) stream.getTracks().forEach((t) => t.stop());
    if (recorder && recorder.state !== "inactive") {
      try {
        recorder.stop(); // fires onstop → assembles the blob
      } catch {
        /* already stopped */
      }
    }
  }, [clearTimer]);

  const startRecording = useCallback(async () => {
    if (!supported || phase === "recording") return;
    // Re-recording: throw away any unsaved preview first.
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
      setPreviewBlob(null);
      setPreviewDuration(0);
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = pickMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        chunksRef.current = [];
        if (!mountedRef.current) return;
        if (blob.size > 0) {
          previewUrlRef.current = URL.createObjectURL(blob);
          setPreviewBlob(blob);
          setPreviewDuration(elapsedRef.current);
          setPhase("preview");
        } else {
          setPhase("idle");
        }
      };

      streamRef.current = stream;
      recorderRef.current = recorder;
      elapsedRef.current = 0;
      setElapsed(0);
      setPhase("recording");
      recorder.start();
      timerRef.current = window.setInterval(() => {
        elapsedRef.current += 1;
        setElapsed(elapsedRef.current);
        if (elapsedRef.current >= MAX_SECONDS) {
          stopRecording();
          toast.info("Reached the 5-minute memo limit — recording stopped.");
        }
      }, 1000);
    } catch {
      toast.error(
        "Microphone access was denied — allow it in your browser to record voice notes.",
      );
    }
  }, [supported, phase, stopRecording]);

  const togglePreview = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !previewUrlRef.current) return;
    if (playingId === "preview") {
      audio.pause();
      setPlayingId(null);
      return;
    }
    audio.src = previewUrlRef.current;
    void audio.play().catch(() => {
      toast.error("Couldn't play the recording.");
      setPlayingId(null);
    });
    setPlayingId("preview");
  }, [playingId]);

  const save = useCallback(async () => {
    if (!previewBlob || saving) return;
    setSaving(true);
    const now = Date.now();
    const note: VoiceNoteRecord = {
      id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
      name: `Voice note • ${formatStamp(now)}`,
      durationSec: previewDuration,
      createdAt: now,
      blob: previewBlob,
    };
    try {
      await saveVoiceNote(note);
      setNotes((prev) => [note, ...prev]);
      discard();
      toast.success("Note saved to My Voice Notes ✨");
    } catch {
      toast.error("Couldn't save this note — storage isn't available in this browser.");
    } finally {
      setSaving(false);
    }
  }, [previewBlob, previewDuration, saving, discard]);

  const togglePlay = useCallback(
    (id: string) => {
      const audio = audioRef.current;
      if (!audio) return;
      if (playingId === id) {
        audio.pause();
        setPlayingId(null);
        return;
      }
      const url = urlMapRef.current.get(id);
      if (!url) return;
      audio.src = url;
      void audio.play().catch(() => {
        toast.error("Couldn't play this note.");
        setPlayingId(null);
      });
      setPlayingId(id);
    },
    [playingId],
  );

  const removeNote = useCallback(
    (id: string) => {
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (playingId === id) {
        audioRef.current?.pause();
        setPlayingId(null);
      }
      void deleteVoiceNote(id).catch(() => {
        toast.error("Couldn't delete that note.");
      });
    },
    [playingId],
  );

  const handleClose = useCallback(() => {
    stopRecording();
    discard();
    audioRef.current?.pause();
    setPlayingId(null);
    onClose();
  }, [stopRecording, discard, onClose]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  return (
    <>
      {createPortal(
        <AnimatePresence>
          {open && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div
                className="absolute inset-0 bg-black/55 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleClose}
              />
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Voice Notes"
                className="glass-strong shine relative max-h-[88dvh] w-full max-w-md overflow-y-auto rounded-3xl p-6 sm:p-7"
                initial={{ opacity: 0, y: 24, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-[#e2666f]/15 text-[#e2666f]">
                      <Mic className="size-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold tracking-tight text-wistaria">
                        Voice Notes
                      </h2>
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Record your own study memos
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-white/10"
                    aria-label="Close voice notes"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                {/* Recorder */}
                <div className="glass-panel mt-5 flex flex-col items-center gap-4 rounded-2xl p-6 text-center">
                  {!supported ? (
                    <div className="py-2">
                      <p className="text-sm font-extrabold text-[#e2666f]">
                        Recording isn't supported in this browser
                      </p>
                      <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
                        Try Chrome, Edge, or Safari. Your memos stay on this device — nothing is
                        uploaded.
                      </p>
                    </div>
                  ) : phase === "idle" ? (
                    <>
                      <div className="relative">
                        <motion.span
                          className="pointer-events-none absolute -inset-3 rounded-full bg-[#e2666f]/20 blur-xl"
                          animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
                          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                          aria-hidden
                        />
                        <button
                          type="button"
                          onClick={() => void startRecording()}
                          className="relative flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-[#e2666f] to-[#b94a5e] text-white shadow-[0_14px_30px_-12px_rgba(226,102,111,0.8)] transition-transform duration-200 hover:scale-105 active:scale-95"
                          aria-label="Start recording"
                        >
                          <Mic className="size-8" />
                        </button>
                      </div>
                      <div>
                        <p className="text-sm font-extrabold">Tap to start recording</p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          Speak your study memo — capped at 5 minutes. Audio never leaves your
                          device.
                        </p>
                      </div>
                    </>
                  ) : phase === "recording" ? (
                    <>
                      <div className="flex items-center gap-3">
                        <motion.span
                          className="size-3 shrink-0 rounded-full bg-[#e2666f]"
                          animate={{ opacity: [1, 0.25, 1], scale: [1, 1.3, 1] }}
                          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                          aria-hidden
                        />
                        <span className="font-mono text-2xl font-extrabold tabular-nums text-[#e2666f]">
                          {formatClock(elapsed)}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-muted-foreground">
                        Recording… speak your memo
                      </p>
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="inline-flex h-11 items-center gap-2 rounded-full border border-[#e2666f]/40 bg-[#e2666f]/15 px-6 text-sm font-extrabold text-[#e2666f] transition-colors hover:bg-[#e2666f]/25"
                      >
                        <Square className="size-4" />
                        Stop Recording
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={togglePreview}
                        className="relative flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-[#6fb5b0] to-[#4f8f8a] text-white shadow-[0_14px_30px_-12px_rgba(111,181,176,0.8)] transition-transform duration-200 hover:scale-105 active:scale-95"
                        aria-label={playingId === "preview" ? "Pause recording" : "Play recording"}
                      >
                        {playingId === "preview" ? (
                          <Pause className="size-8" />
                        ) : (
                          <Play className="size-8 translate-x-0.5" />
                        )}
                      </button>
                      <div>
                        <p className="text-sm font-extrabold">Ready — listen back</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatClock(previewDuration)} captured
                        </p>
                      </div>
                      <div className="flex w-full flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => void save()}
                          disabled={saving}
                          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#78A2D2] to-[#a2a2d0] px-5 text-sm font-extrabold text-white shadow-[0_10px_24px_-10px_rgba(120,162,210,0.9)] transition-all hover:brightness-110 disabled:opacity-60"
                        >
                          <Save className="size-4" />
                          {saving ? "Saving…" : "Save Note"}
                        </button>
                        <button
                          type="button"
                          onClick={discard}
                          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 text-sm font-bold text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                        >
                          <RotateCcw className="size-4" />
                          Discard
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* My Voice Notes */}
                <div className="mt-5">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    <AudioLines className="size-3.5" />
                    My Voice Notes
                  </p>
                  {loading ? (
                    <div className="mt-2 flex items-center gap-2 rounded-xl bg-white/5 p-4 text-xs text-muted-foreground">
                      <Spinner className="size-3.5" />
                      Loading your notes…
                    </div>
                  ) : notes.length === 0 ? (
                    <div className="mt-2 rounded-xl border border-dashed border-white/15 p-5 text-center">
                      <p className="text-xs font-semibold text-muted-foreground">
                        No notes yet — record your first study memo above!
                      </p>
                    </div>
                  ) : (
                    <div className="nice-scroll mt-2 max-h-56 space-y-2 overflow-y-auto pr-1">
                      {notes.map((n) => (
                        <div
                          key={n.id}
                          className="glass-chip flex items-center gap-3 rounded-2xl px-3.5 py-3"
                        >
                          <button
                            type="button"
                            onClick={() => togglePlay(n.id)}
                            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-wistaria/15 text-wistaria transition-colors hover:bg-wistaria/25"
                            aria-label={playingId === n.id ? "Pause note" : "Play note"}
                          >
                            {playingId === n.id ? (
                              <Pause className="size-4" />
                            ) : (
                              <Play className="size-4 translate-x-px" />
                            )}
                          </button>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold">{n.name}</p>
                            <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                              <Clock className="size-3" />
                              {formatClock(n.durationSec)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeNote(n.id)}
                            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-[#e2666f]/15 hover:text-[#e2666f]"
                            aria-label="Delete note"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <p className="mt-4 flex items-start gap-1.5 text-[10px] leading-4 text-muted-foreground">
                  <ShieldCheck className="mt-px size-3 shrink-0 text-[#6fb5b0]" />
                  Privacy: your voice memos are recorded and stored only on this device — nothing
                  is uploaded or sent to the AI.
                </p>

                {/* One shared audio element plays previews + saved notes */}
                <audio
                  ref={audioRef}
                  className="hidden"
                  onEnded={() => setPlayingId(null)}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
