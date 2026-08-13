/**
 * Tiny typed wrapper around the browser's native Web Speech API
 * (`window.SpeechRecognition` / `window.webkitSpeechRecognition`).
 *
 * 100% free and private: the browser ships the recognizer — no API key,
 * no server, no third-party SDK. Audio never leaves the device.
 */

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

/** The subset of the native SpeechRecognition object that we rely on. */
export interface SpeechRecognizer {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionCtor {
  new (): SpeechRecognizer;
}

export interface RecognitionHandlers {
  /**
   * Called for every speech event.
   * `final` is the newly-finalized text since the last event (callers should
   * accumulate it); `interim` is the live, not-yet-final guess.
   */
  onResult: (final: string, interim: string) => void;
  /** Called when recognition ends — automatically after silence, or on stop/abort. */
  onEnd: () => void;
  /** Optional error hook. Common codes: no-speech, not-allowed, service-not-allowed, network, aborted. */
  onError?: (error: string) => void;
}

/** True when this browser exposes SpeechRecognition (Chrome/Edge/Safari). */
export function speechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as unknown as Record<string, unknown>;
  return (
    typeof w.SpeechRecognition === "function" ||
    typeof w.webkitSpeechRecognition === "function"
  );
}

function getCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/**
 * Creates a wired-up recognizer, or returns null when the browser has no
 * SpeechRecognition support. The recognizer auto-stops after the speaker
 * pauses (continuous = false), and interim results stream live.
 */
export function createSpeechRecognizer(
  handlers: RecognitionHandlers,
): SpeechRecognizer | null {
  const Ctor = getCtor();
  if (!Ctor) return null;

  const recognizer = new Ctor();
  recognizer.lang = "en-US";
  recognizer.continuous = false; // stop by itself once the user stops talking
  recognizer.interimResults = true; // live text while talking
  recognizer.maxAlternatives = 1;

  recognizer.onresult = (event) => {
    let finalDelta = "";
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      const transcript = result[0]?.transcript ?? "";
      if (result.isFinal) {
        finalDelta += transcript;
      } else {
        interim += transcript;
      }
    }
    handlers.onResult(finalDelta, interim);
  };

  recognizer.onerror = (event) => {
    handlers.onError?.(event.error);
  };

  recognizer.onend = () => handlers.onEnd();

  return recognizer;
}
