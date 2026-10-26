import { useEffect, useId, useMemo, useState } from "react";
import { Pause, Play, Square, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  getInstalledVoices,
  onVoicesReady,
  pauseSpeaking,
  resumeSpeaking,
  speak,
  speechAvailable,
  stopSpeaking,
  toSpeechText,
  type VoiceProfile,
} from "@/lib/tts";
import { cn } from "@/lib/utils";

/* ----------------------------- preferences ---------------------------- */

function loadPref(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function savePref(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable (private mode) — nothing to do */
  }
}

/* ------------------------------- speed -------------------------------- */

const RATE_MIN = 0.8;
const RATE_MAX = 1.5;
const RATE_STEP = 0.1;

function readRate(raw: string | null): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n < RATE_MIN || n > RATE_MAX) return 1;
  return Math.round(Math.round(n / RATE_STEP) * RATE_STEP * 100) / 100;
}

/* ------------------------------ component ----------------------------- */

export interface ReadAloudProps {
  /**
   * The content to read. Markdown and HTML are allowed — everything is
   * stripped to plain text before it reaches the speech engine.
   */
  text: string;
  /** Short context shown in the status line, e.g. "Basics" or "In-Depth". */
  label?: string;
  /** localStorage prefix so the chosen voice + speed persist. */
  storageKey?: string;
  className?: string;
}

/**
 * Read Aloud — browser-native text-to-speech (Web Speech API).
 *
 * Play/Pause/Resume/Stop, a voice dropdown fed by the async
 * `speechSynthesis.getVoices()` list, and a 0.8×–1.5× speed slider.
 * The Play handler calls `speechSynthesis.speak()` synchronously inside the
 * click, which is what iOS Safari requires to allow audio at all.
 */
export function ReadAloud({ text, label, storageKey = "medipro-read-aloud", className }: ReadAloudProps) {
  const listId = useId();
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState<string>(() => loadPref(`${storageKey}-voice`) ?? "");
  const [rate, setRate] = useState<number>(() => readRate(loadPref(`${storageKey}-rate`)));

  const speech = useMemo(() => toSpeechText(text), [text]);
  const chosenVoice = useMemo(
    () => voices.find((v) => v.voiceURI === voiceURI) ?? null,
    [voices, voiceURI],
  );

  /* ---- voices: async in Chrome, so listen for onvoiceschanged ---- */
  useEffect(() => {
    if (!speechAvailable()) return;
    let alive = true;
    const refresh = () => {
      if (alive) setVoices(getInstalledVoices());
    };
    refresh();
    const unsubscribe = onVoicesReady(refresh);
    // Chrome sometimes reports an empty list for a moment after load.
    const t1 = window.setTimeout(refresh, 300);
    const t2 = window.setTimeout(refresh, 1500);
    return () => {
      alive = false;
      unsubscribe();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  /* ---- content changed (e.g. the Basics tab switched): drop the old
         narration and reset the controls during render, per React's
         "adjusting state when props change" pattern ---- */
  const [spokenText, setSpokenText] = useState(speech);
  if (spokenText !== speech) {
    setSpokenText(speech);
    setSpeaking(false);
    setPaused(false);
  }

  /* ---- cancelling audio is an external-system update ---- */
  useEffect(() => {
    stopSpeaking();
  }, [speech]);

  /* ---- stop narration on unmount (no orphaned audio) ---- */
  useEffect(() => () => stopSpeaking(), []);

  useEffect(() => savePref(`${storageKey}-voice`, voiceURI), [storageKey, voiceURI]);
  useEffect(() => savePref(`${storageKey}-rate`, String(rate)), [storageKey, rate]);

  /** Play / pause / resume — called straight from the click handler. */
  const handleToggle = () => {
    if (speaking) {
      if (paused) {
        resumeSpeaking();
        setPaused(false);
      } else {
        pauseSpeaking();
        setPaused(true);
      }
      return;
    }

    if (!speechAvailable()) {
      toast.error("Read aloud needs a browser with speech support — try Chrome, Edge or Safari.");
      return;
    }
    if (!speech) {
      toast.error("There is nothing to read on this page yet.");
      return;
    }

    const profile: VoiceProfile = {
      id: "custom",
      label: chosenVoice?.name ?? "Default voice",
      description: "",
      pitch: 1,
      rate,
      gender: null,
      customVoiceName: chosenVoice?.name,
      customVoiceURI: chosenVoice?.voiceURI,
    };

    setPaused(false);
    const started = speak(speech, profile, {
      onEnd: () => {
        setSpeaking(false);
        setPaused(false);
      },
    });
    if (started) {
      setSpeaking(true);
    } else {
      setSpeaking(false);
      toast.error("Reading couldn't start — tap Play once more.");
    }
  };

  const handleStop = () => {
    stopSpeaking();
    setSpeaking(false);
    setPaused(false);
  };

  const status = speaking ? (paused ? "Paused" : "Reading…") : "Ready";

  return (
    <div
      className={cn(
        "glass-strong flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl p-3",
        className,
      )}
    >
      <Button
        onClick={handleToggle}
        className="gap-2 rounded-full px-4 text-sm"
        size="sm"
        aria-label={speaking ? (paused ? "Resume reading" : "Pause reading") : "Read aloud"}
      >
        {speaking && !paused ? (
          <Pause className="size-3.5" />
        ) : (
          <Play className="size-3.5" />
        )}
        {speaking ? (paused ? "Resume" : "Pause") : "Read aloud"}
      </Button>

      <button
        type="button"
        onClick={handleStop}
        disabled={!speaking}
        className="flex size-8 items-center justify-center rounded-full bg-white/5 text-muted-foreground transition-colors hover:bg-[#e2666f]/15 hover:text-[#e2666f] disabled:pointer-events-none disabled:opacity-40"
        aria-label="Stop reading"
        title="Stop"
      >
        <Square className="size-3" />
      </button>

      {/* voice dropdown — populated as soon as the async voice list lands */}
      <label htmlFor={listId} className="sr-only">
        Voice
      </label>
      <select
        id={listId}
        value={voiceURI}
        onChange={(e) => setVoiceURI(e.target.value)}
        className="glass-chip h-8 max-w-[9.5rem] cursor-pointer truncate rounded-full px-3 text-[11px] font-bold text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground"
        title={chosenVoice ? `${chosenVoice.name} (${chosenVoice.lang})` : "Default device voice"}
      >
        <option value="">
          {voices.length > 0 ? "Default voice" : "Loading voices…"}
        </option>
        {voices.map((v) => (
          <option key={v.voiceURI} value={v.voiceURI}>
            {v.name}
            {v.lang ? ` · ${v.lang}` : ""}
          </option>
        ))}
      </select>

      {/* speed: 0.8× – 1.5× */}
      <div className="flex items-center gap-2" role="group" aria-label="Speaking speed">
        <span aria-hidden="true" className="text-[11px] font-bold text-muted-foreground">
          Speed
        </span>
        <Slider
          value={[rate]}
          onValueChange={(v) => setRate(readRate(String(v[0] ?? RATE_MIN)))}
          min={RATE_MIN}
          max={RATE_MAX}
          step={RATE_STEP}
          className="w-24 sm:w-28"
          aria-label="Speaking speed"
        />
        <span className="w-8 text-[11px] font-bold tabular-nums text-wistaria">
          {rate.toFixed(1)}×
        </span>
      </div>

      <div className="ml-auto flex items-center gap-1.5 text-[11px] font-semibold">
        <Volume2 className="size-3.5 text-wistaria" />
        <span>{status}</span>
        {label && <span className="hidden text-muted-foreground sm:inline">· {label}</span>}
      </div>
    </div>
  );
}

export default ReadAloud;
