/**
 * Headless tests for the TTS engine (src/lib/tts.ts).
 *
 * The Play/Pause/Stop buttons and the voice settings in the Assistant page all
 * call this engine, so we exercise the full contract against a mocked Web
 * Speech API: profile → pitch/rate/voice resolution, true pause/resume,
 * stop, cancel-before-speak, onEnd, custom voice, and graceful fallback when
 * speech is unavailable. No browser required.
 */
import { describe, expect, it, beforeEach, afterEach } from "bun:test";
import {
  VOICE_PROFILES,
  getInstalledVoices,
  onVoicesReady,
  pauseSpeaking,
  resumeSpeaking,
  speak,
  speechAvailable,
  stopSpeaking,
  type VoiceProfile,
} from "../src/lib/tts";

/* ------------------------- Web Speech mock ------------------------- */

const VOICES: SpeechSynthesisVoice[] = [
  { name: "David", lang: "en-US", default: false, localService: true, voiceURI: "david" },
  { name: "Samantha", lang: "en-US", default: true, localService: true, voiceURI: "samantha" },
  { name: "Zira", lang: "en-US", default: false, localService: false, voiceURI: "zira" },
  { name: "Google US English", lang: "en-US", default: false, localService: false, voiceURI: "google-us" },
];

/** Runtime stand-in for SpeechSynthesisUtterance. */
class MockUtterance {
  text: string;
  pitch = 1;
  rate = 1;
  volume = 1;
  lang = "";
  voice: SpeechSynthesisVoice | null = null;
  onend: ((ev: SpeechSynthesisEvent) => void) | null = null;
  onerror: ((ev: SpeechSynthesisEvent) => void) | null = null;
  constructor(text: string) {
    this.text = text;
  }
}

const synth = {
  speaking: false,
  paused: false,
  pending: false,
  onvoiceschanged: null as (() => void) | null,
  utterances: [] as MockUtterance[],
  speakCalls: 0,
  cancelCalls: 0,
  pauseCalls: 0,
  resumeCalls: 0,
  getVoices: () => VOICES,
  speak(u: SpeechSynthesisUtterance) {
    this.utterances.push(u as unknown as MockUtterance);
    this.speakCalls += 1;
  },
  cancel() {
    this.cancelCalls += 1;
    this.utterances = [];
  },
  pause() {
    this.pauseCalls += 1;
  },
  resume() {
    this.resumeCalls += 1;
  },
};

/** Last utterance the engine queued (type-safe accessor into the mock). */
function lastUtterance(): MockUtterance {
  const u = synth.utterances[synth.utterances.length - 1];
  if (!u) throw new Error("no utterance was spoken");
  return u;
}

function profile(id: string): VoiceProfile {
  const p = VOICE_PROFILES.find((v) => v.id === id);
  if (!p) throw new Error(`unknown profile ${id}`);
  return p;
}

function installSpeech(): void {
  (globalThis as Record<string, unknown>).window = globalThis;
  (globalThis as Record<string, unknown>).SpeechSynthesisUtterance = MockUtterance;
  (globalThis as { window: unknown }).window = Object.assign(
    globalThis,
    { speechSynthesis: synth },
  );
}

function removeSpeech(): void {
  (globalThis as Record<string, unknown>).window = undefined;
  (globalThis as Record<string, unknown>).SpeechSynthesisUtterance = undefined;
}

beforeEach(() => {
  synth.speaking = false;
  synth.paused = false;
  synth.pending = false;
  synth.onvoiceschanged = null;
  synth.utterances = [];
  synth.speakCalls = 0;
  synth.cancelCalls = 0;
  synth.pauseCalls = 0;
  synth.resumeCalls = 0;
  installSpeech();
});

afterEach(() => {
  stopSpeaking(); // also clears the keep-alive timer so the test process exits
});

describe("speech availability", () => {
  it("reports available when speechSynthesis + utterance constructor exist", () => {
    expect(speechAvailable()).toBe(true);
  });

  it("reports unavailable and returns false from speak when speech is missing", () => {
    removeSpeech();
    expect(speechAvailable()).toBe(false);
    expect(speak("hello", profile("male"))).toBe(false);
    expect(getInstalledVoices()).toEqual([]);
  });

  it("lists installed voices once speech is available", () => {
    expect(getInstalledVoices().map((v) => v.name)).toEqual(
      VOICES.map((v) => v.name),
    );
  });
});

describe("voice profiles", () => {
  it("male → pitch 1.0, rate 1.0, and a male-named voice", () => {
    speak("text", profile("male"));
    const u = lastUtterance();
    expect(u.pitch).toBe(1);
    expect(u.rate).toBe(1);
    expect(u.voice?.name).toBe("David");
  });

  it("female → pitch 1.0, rate 1.0, and a female-named voice", () => {
    speak("text", profile("female"));
    const u = lastUtterance();
    expect(u.pitch).toBe(1);
    expect(u.rate).toBe(1);
    expect(u.voice?.name).toBe("Samantha");
  });

  it("husky → male voice with pitch 0.8 and slower rate (per spec)", () => {
    speak("text", profile("husky"));
    const u = lastUtterance();
    expect(u.pitch).toBe(0.8);
    expect(u.rate).toBe(0.9);
    expect(u.voice?.name).toBe("David");
  });

  it("smooth → female voice with pitch 1.1 and slower rate (per spec)", () => {
    speak("text", profile("smooth"));
    const u = lastUtterance();
    expect(u.pitch).toBe(1.1);
    expect(u.rate).toBe(0.95);
    expect(u.voice?.name).toBe("Samantha");
  });

  it("custom → uses the exact chosen installed voice", () => {
    speak("text", { ...profile("custom"), customVoiceName: "Google US English" });
    expect(lastUtterance().voice?.name).toBe("Google US English");
  });

  it("custom → falls back to the browser default when the chosen voice is gone", () => {
    speak("text", { ...profile("custom"), customVoiceName: "Some removed voice" });
    expect(lastUtterance().voice).toBeNull();
  });
});

describe("speak lifecycle", () => {
  it("cancels any previous narration before starting a new one", () => {
    speak("first", profile("male"));
    expect(synth.speakCalls).toBe(1);
    speak("second", profile("male"));
    expect(synth.cancelCalls).toBeGreaterThanOrEqual(1);
    expect(synth.speakCalls).toBe(2);
    // the new utterance is the only one queued (old one was cancelled)
    expect(synth.utterances).toHaveLength(1);
    expect(lastUtterance().text).toBe("second");
  });

  it("returns false and never throws for empty text", () => {
    expect(speak("", profile("male"))).toBe(false);
    expect(speak("   ", profile("male"))).toBe(false);
    expect(synth.speakCalls).toBe(0);
  });

  it("fires onEnd when the utterance finishes", () => {
    let ended = 0;
    speak("long answer", profile("smooth"), { onEnd: () => (ended += 1) });
    lastUtterance().onend?.({} as SpeechSynthesisEvent);
    expect(ended).toBe(1);
  });

  it("fires onEnd when the utterance errors", () => {
    let ended = 0;
    speak("long answer", profile("male"), { onEnd: () => (ended += 1) });
    lastUtterance().onerror?.({} as SpeechSynthesisEvent);
    expect(ended).toBe(1);
  });
});

describe("pause / resume / stop", () => {
  it("pauses and resumes the same utterance (true pause, position kept)", () => {
    speak("hello", profile("male"));
    pauseSpeaking();
    expect(synth.pauseCalls).toBe(1);
    resumeSpeaking();
    expect(synth.resumeCalls).toBe(1);
  });

  it("second pause while already paused is a no-op", () => {
    speak("hello", profile("male"));
    pauseSpeaking();
    pauseSpeaking();
    expect(synth.pauseCalls).toBe(1);
  });

  it("resume before a pause is a no-op", () => {
    speak("hello", profile("male"));
    resumeSpeaking();
    expect(synth.resumeCalls).toBe(0);
  });

  it("stop cancels and leaves nothing to pause or resume", () => {
    speak("hello", profile("male"));
    stopSpeaking();
    expect(synth.cancelCalls).toBeGreaterThanOrEqual(1);
    pauseSpeaking();
    resumeSpeaking();
    expect(synth.pauseCalls).toBe(0);
    expect(synth.resumeCalls).toBe(0);
  });

  it("stop with nothing playing never throws", () => {
    stopSpeaking();
    stopSpeaking();
  });
});

describe("onVoicesReady", () => {
  it("notifies subscribers when the voice list arrives and unsubscribes cleanly", () => {
    let notified = 0;
    const off = onVoicesReady(() => (notified += 1));
    synth.onvoiceschanged?.();
    expect(notified).toBe(1);
    off();
    synth.onvoiceschanged?.();
    expect(notified).toBe(1);
  });
});
