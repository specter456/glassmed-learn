/**
 * Text-to-speech for the web (the browser-native equivalent of expo-speech).
 * Uses `window.speechSynthesis` — zero dependencies, works in Chrome, Edge
 * and Safari on both desktop and mobile. All access is guarded so the app
 * never crashes in environments where speech is unavailable.
 *
 * Voice profiles — each has its own character so the profiles sound clearly
 *  different even on devices that only expose a single English voice (where
 *  gender-based voice picking has nothing to choose from, the pitch/rate still
 *  separates them):
 *  - Male    → a male voice, pitch 0.9 / rate 0.98 (deeper)
 *  - Female  → a female voice, pitch 1.12 / rate 1.0 (brighter)
 *  - Husky   → male voice, pitch 0.75 / rate 0.9 (deepest, roughest)
 *  - Smooth  → female voice, pitch 1.18 / rate 0.95 (softest, calming)
 *  - Custom  → any installed system voice the user picks
 *
 * Reliability notes:
 *  - Chrome stops speaking long utterances after ~15 seconds (a well-known
 *    browser bug). A keep-alive timer nudges `resume()` while speaking so
 *    long medical answers read to the end.
 *  - Pause/resume is true pause (utterance position is kept), not a restart.
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
    pitch: 0.9,
    rate: 0.98,
    gender: "male",
  },
  {
    id: "female",
    label: "Female",
    description: "Standard clear female voice",
    pitch: 1.12,
    rate: 1,
    gender: "female",
  },
  {
    id: "husky",
    label: "Husky",
    description: "Deep, gravelly male voice",
    pitch: 0.75,
    rate: 0.9,
    gender: "male",
  },
  {
    id: "smooth",
    label: "Smooth",
    description: "Soft, gentle female voice",
    pitch: 1.18,
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
  "aria",
  "jenny",
  "natasha",
];

/** Does the voice name signal the requested gender? */
function voiceMatchesGender(name: string, gender: "male" | "female"): boolean {
  if (/\b(male|female)\b/i.test(name)) return name.toLowerCase().includes(gender);
  const hints = gender === "male" ? MALE_HINTS : FEMALE_HINTS;
  return hints.some((h) => name.toLowerCase().includes(h));
}

/**
 * Naturalness score for a voice name. Network/neural voices (Google, Microsoft
 * neural, enhanced, online) sound far less robotic than local system voices,
 * so they rank above the browser's built-in ones.
 */
function voiceQualityScore(name: string): number {
  const n = name.toLowerCase();
  if (/(natural|neural|premium|enhanced|online|wavenet|cloud|highquality)/.test(n)) return 30;
  if (/(google|microsoft|siri|apple|amazon)/.test(n)) return 20;
  if (/(david|samantha|zira|karen|moira|victoria|daniel|alex|serena|susan|jenny|aria|natasha)/.test(n)) return 10;
  return 0;
}

/**
 * Pick the best available voice for a gender. Always prefers a voice that
 * matches the requested gender first, then ranks by naturalness (neural and
 * network voices over local robotic ones), then the browser's default voice.
 */
function pickByGender(gender: "male" | "female"): SpeechSynthesisVoice | null {
  const voices = getInstalledVoices();
  if (voices.length === 0) return null;
  const en = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  const pool = en.length > 0 ? en : voices;

  const gendered = pool.filter((v) => voiceMatchesGender(v.name, gender));
  const candidates = gendered.length > 0 ? gendered : pool;

  let best: SpeechSynthesisVoice | null = null;
  let bestScore = -1;
  for (const v of candidates) {
    const score = voiceQualityScore(v.name) * 100 + (v.default ? 5 : 0);
    if (score > bestScore) {
      bestScore = score;
      best = v;
    }
  }
  return best;
}

/* ------------------------- active utterance ------------------------- */

interface ActiveSpeech {
  paused: boolean;
  keepAlive: ReturnType<typeof setInterval> | null;
}

let active: ActiveSpeech | null = null;

function clearActive(): void {
  if (active?.keepAlive) clearInterval(active.keepAlive);
  active = null;
}

/* --------------------------- voice quality -------------------------- */

/**
 * Voice-quality presets that tune pitch + rate on top of the chosen voice.
 * These make narration sound smooth and calm, professionally clear, or
 * energetic — instead of robotic.
 */
export type VoiceQualityId = "smooth-calm" | "professional" | "energetic";

export interface VoiceQuality {
  id: VoiceQualityId;
  label: string;
  description: string;
  pitch: number;
  rate: number;
}

export const VOICE_QUALITIES: VoiceQuality[] = [
  {
    id: "smooth-calm",
    label: "Smooth & Calm",
    description: "Pleasant, relaxed listening · rate 0.85",
    pitch: 1.0,
    rate: 0.85,
  },
  {
    id: "professional",
    label: "Professional",
    description: "Clear, composed narration · rate 0.95",
    pitch: 0.95,
    rate: 0.95,
  },
  {
    id: "energetic",
    label: "Energetic",
    description: "Lively and engaging · rate 1.1",
    pitch: 1.05,
    rate: 1.1,
  },
];

export function qualityById(id: string | null | undefined): VoiceQuality {
  return VOICE_QUALITIES.find((q) => q.id === id) ?? VOICE_QUALITIES[0];
}

/** Round to two decimals so combined pitch/rate stay clean. */
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Overlay a voice-quality preset onto a voice profile. The preset tunes ON TOP
 * of the profile's own character (combined, not replaced) — so a male voice
 * stays deeper than a female one even when the same quality is selected, which
 * keeps every profile audibly distinct on devices with very few voices.
 */
export function applyQuality(
  profile: VoiceProfile,
  quality: VoiceQuality | null | undefined,
): VoiceProfile {
  if (!quality) return profile;
  return {
    ...profile,
    pitch: round2(profile.pitch * quality.pitch),
    rate: round2(profile.rate * quality.rate),
  };
}

/** Interval (ms) for the Chrome long-utterance keep-alive nudge. */
const KEEP_ALIVE_MS = 10_000;

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
  try {
    synth.cancel();
  } catch {
    /* ignore */
  }
  clearActive();

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

  const onDone = () => {
    clearActive();
    if (options?.onEnd) options.onEnd();
  };
  utterance.onend = onDone;
  utterance.onerror = onDone;

  active = { paused: false, keepAlive: null };
  // Chrome bug workaround: long utterances silently stop after ~15s. A gentle
  // periodic resume() keeps them going — and never runs while explicitly
  // paused, so it can't fight the user.
  active.keepAlive = setInterval(() => {
    const current = active;
    if (current && !current.paused) {
      try {
        window.speechSynthesis.resume();
      } catch {
        /* ignore */
      }
    }
  }, KEEP_ALIVE_MS);

  try {
    synth.speak(utterance);
  } catch {
    clearActive();
    if (options?.onEnd) options.onEnd();
    return false;
  }
  return true;
}

/** Pause the current narration (position is kept — Play resumes it). */
export function pauseSpeaking(): void {
  if (!speechAvailable() || !active || active.paused) return;
  active.paused = true;
  try {
    window.speechSynthesis.pause();
  } catch {
    /* ignore */
  }
}

/** Resume a paused narration. */
export function resumeSpeaking(): void {
  if (!speechAvailable() || !active || !active.paused) return;
  active.paused = false;
  try {
    window.speechSynthesis.resume();
  } catch {
    /* ignore */
  }
}

/** Stop any narration immediately (leaving the screen, sending a message…). */
export function stopSpeaking(): void {
  if (!speechAvailable()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* ignore */
  }
  clearActive();
}
