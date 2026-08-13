import { describe, expect, it } from "bun:test";
import {
  createSpeechRecognizer,
  speechRecognitionSupported,
} from "../src/lib/speech";

describe("speech recognition helper (voice-to-text)", () => {
  it("reports unsupported outside a browser", () => {
    expect(speechRecognitionSupported()).toBe(false);
  });

  it("returns null when the browser has no SpeechRecognition", () => {
    const recognizer = createSpeechRecognizer({
      onResult: () => {},
      onEnd: () => {},
    });
    expect(recognizer).toBeNull();
  });
});
