/**
 * Text-to-speech for the web (the browser-native equivalent of expo-speech).
 * Uses `window.speechSynthesis` — zero dependencies, works in Chrome, Edge
 * and Safari on both desktop and mobile. All access is guarded so the app
 * never crashes in environments where speech is unavailable.
 *
 * Voice profiles:
 *  - Male    → a male voice, pitch 1.0 / rate 1.0
 *  - Female  → a female voice, pitch 1.0 / rate 1.0
 *  - Husky   → male voice, pitch 0.75 / rate 0.9 (deeper, rougher)
 *  - Smooth  → female voice, pitch 1.12 / rate 0.95 (softer, calming)
 *  - Custom  → any installed system voice the user picks
 */

export type VoiceProfileId = "male" | "female" | "husky" | "smooth" | "custom";

export interface VoiceProfile {
  id: VoiceProfileId;
  label: string;
  description: string;
  pitch: number;
  rate: number;
  /** Which installed voices to prefer; null lets the browser choose. */
  gender: "male" | "female" | null;
  /** For the "custom" profile — the exact name of the chosen installed voice. */
  customVoiceName?: string;
}

export const VOICE_PROFILES: VoiceProfile[] = [
  {
    id: "male",
    label: "Male",
    description: "Standard deep male voice",
    pitch: 1,
    rate: 1,
    gender: "male",
  },
  {
    id: "female",
    label: "Female",
    description: "Standard clear female voice",
    pitch: 1,
    rate: 1,
    gender: "female",
  },
  {
    id: "husky",
    label: "Husky",
    description: "Deeper, rougher tone — male voice, lowered pitch & rate",
    pitch: 0.75,
    rate: 0.9,
    gender: "male",
  },
  {
    id: "smooth",
    label: "Smooth",
    description: "Softer, calming tone — female voice, gently adjusted",
    pitch: 1.12,
    rate: 0.95,
    gender: "female",
  },
  {
    id: "custom",
    label: "Custom voice",
    description: "Pick any voice installed on this device",
    pitch: 1,
    rate: 1,
    gender: null,
  },
];

export function speechAvailable(): boolean {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    typeof SpeechSynthesisUtterance !== "undefined"
  );
}

/* ---------------- voice loading (async in Chrome) ---------------- */

let cachedVoices: SpeechSynthesisVoice[] | null = null;
const voiceSubscribers = new Set<() => void>();

/** Current installed voices (best-effort cache; may be empty until loaded). */
export function getInstalledVoices(): SpeechSynthesisVoice[] {
  if (!speechAvailable()) return [];
  try {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) cachedVoices = voices;
  } catch {
    /* some webviews throw until voices are ready — never crash the page */
  }
  return cachedVoices ?? [];
}

/** Subscribe to the moment the voice list becomes available. */
export function onVoicesReady(callback: () => void): () => void {
  voiceSubscribers.add(callback);
  if (!speechAvailable()) return () => voiceSubscribers.delete(callback);

  const announce = () => {
    try {
      cachedVoices = window.speechSynthesis.getVoices();
    } catch {
      cachedVoices = null;
    }
    voiceSubscribers.forEach((fn) => fn());
  };
  window.speechSynthesis.onvoiceschanged = announce;

  return () => {
    voiceSubscribers.delete(callback);
    if (voiceSubscribers.size === 0) {
      window.speechSynthesis.onvoiceschanged = null;
    }
  };
}

/* ------------------------------ voices ------------------------------ */

const MALE_HINTS = ["male", "david", "daniel", "george", "alex", "fred", "tom", "ryan"];
const FEMALE_HINTS = [
  "female",
  "samantha",
  "zira",
  "victoria",
  "karen",
  "moira",
  "susan",
  "serena",
];

function pickByGender(gender: "male" | "female"): SpeechSynthesisVoice | null {
  const voices = getInstalledVoices();
  if (voices.length === 0) return null;
  const en = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  const pool = en.length > 0 ? en : voices;
  const hints = gender === "male" ? MALE_HINTS : FEMALE_HINTS;
  const found = pool.find((v) => hints.some((h) => v.name.toLowerCase().includes(h)));
  return found ?? null;
}

/* ---------------------------- speak / stop --------------------------- */

export interface SpeakOptions {
  /** Called when this utterance finishes (or errors). */
  onEnd?: () => void;
}

/**
 * Speak `text` with the given profile. Always cancels anything currently
 * playing first (so sending a new message stops the previous narration).
 * Returns true if speech was started.
 */
export function speak(text: string, profile: VoiceProfile, options?: SpeakOptions): boolean {
  if (!speechAvailable() || !text.trim()) return false;

  const synth = window.speechSynthesis;
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = profile.pitch;
  utterance.rate = profile.rate;
  utterance.volume = 1;

  if (profile.id === "custom" && profile.customVoiceName) {
    const custom = getInstalledVoices().find((v) => v.name === profile.customVoiceName);
    if (custom) utterance.voice = custom;
  } else if (profile.gender) {
    const voice = pickByGender(profile.gender);
    if (voice) utterance.voice = voice;
  }

  if (options?.onEnd) {
    utterance.onend = options.onEnd;
    utterance.onerror = options.onEnd;
  }

  try {
    synth.speak(utterance);
  } catch {
    if (options?.onEnd) options.onEnd();
    return false;
  }
  return true;
}

/** Stop any narration immediately (leaving the screen, sending a message…). */
export function stopSpeaking(): void {
  if (!speechAvailable()) return;
  window.speechSynthesis.cancel();
}
