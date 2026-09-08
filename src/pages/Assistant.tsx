import { motion } from "framer-motion";
import {
  Bot,
  Check,
  Mic,
  Pause,
  Play,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Square,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { api } from "@/convex/_generated/api";
import { ConvexError } from "convex/values";
import { useAction } from "convex/react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { GlassBackdrop } from "@/components/GlassBackdrop";
import { FoxMascot } from "@/components/mascots";
import { QueryErrorBoundary } from "@/components/QueryErrorBoundary";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  VOICE_PROFILES,
  VOICE_QUALITIES,
  applyQuality,
  getInstalledVoices,
  onVoicesReady,
  pauseSpeaking,
  qualityById,
  resumeSpeaking,
  speak,
  speechAvailable,
  stopSpeaking,
  type VoiceProfile,
  type VoiceProfileId,
  type VoiceQualityId,
} from "@/lib/tts";
import {
  createSpeechRecognizer,
  speechRecognitionSupported,
  type SpeechRecognizer,
} from "@/lib/speech";
import { cn } from "@/lib/utils";
import { smartAiAnswer } from "@/lib/smartAi";

/* ------------------------- safe preferences ------------------------- */
/* localStorage can throw in sandboxed previews — never let it crash the page. */

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
    /* storage unavailable — voice choice just won't persist */
  }
}

/* ------------------------------ chat -------------------------------- */

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Explain the cardiac cycle in simple terms",
  "Why does the QRS complex come before the T wave?",
  "What is the difference between systole and diastole?",
  "A mnemonic for the brachial plexus roots",
  "Walk me through the Krebs cycle step by step",
];

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5" aria-label="MediPro is thinking">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-2 rounded-full bg-wistaria"
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -4, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

function AssistantInner() {
  const [searchParams] = useSearchParams();
  const askAssistant = useAction(api.assistant.askAssistant);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm **MediPro** \uD83D\uDC30, your medical study assistant!\n\nI can help you with:\n\u2022 Understanding core concepts (cardiac cycle, action potential, Krebs cycle, etc.)\n\u2022 Explaining mechanisms step-by-step\n\u2022 Clinical correlations and mnemonics\n\u2022 Definitions and terminology\n\nTry asking something like \"What is the cardiac cycle?\" or pick a suggestion below!\n\n_\u26A0\uFE0F For study purposes only \u2014 always verify with your textbooks._",
    },
  ]);
  const [input, setInput] = useState(() => searchParams.get("q") ?? "");
  const [busy, setBusy] = useState(false);
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const [speechPaused, setSpeechPaused] = useState(false);
  // True when the last answer failed because no API key is configured — shows
  // a persistent setup banner instead of a toast that disappears.
  const [setupNeeded, setSetupNeeded] = useState(false);
  // Transient inline error note (visible, unlike a toast that auto-dismisses).
  const [lastError, setLastError] = useState<string | null>(null);

  const [profileId, setProfileId] = useState<VoiceProfileId>(
    () => (loadPref("medipro-tts-voice") as VoiceProfileId | null) ?? "smooth",
  );
  const [customVoiceName, setCustomVoiceName] = useState<string | null>(
    () => loadPref("medipro-tts-custom-voice") || null,
  );
  const [qualityId, setQualityId] = useState<VoiceQualityId>(
    () => (loadPref("medipro-tts-quality") as VoiceQualityId | null) ?? "smooth-calm",
  );
  const [installedVoices, setInstalledVoices] = useState<SpeechSynthesisVoice[]>(() =>
    getInstalledVoices(),
  );

  // Voice-to-text in the composer (Web Speech API — free, browser-native,
  // audio never leaves the device). Separate from the TTS read-aloud feature.
  const [listening, setListening] = useState(false);
  const recognizerRef = useRef<SpeechRecognizer | null>(null);
  const speechPrefixRef = useRef("");
  const speechFinalRef = useRef("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const profile: VoiceProfile = useMemo(() => {
    const base = VOICE_PROFILES.find((p) => p.id === profileId) ?? VOICE_PROFILES[3];
    return base.id === "custom" ? { ...base, customVoiceName: customVoiceName ?? undefined } : base;
  }, [profileId, customVoiceName]);
  const quality = useMemo(() => qualityById(qualityId), [qualityId]);

  // Load installed voices (Chrome fills them in asynchronously).
  useEffect(
    () => onVoicesReady(() => setInstalledVoices(getInstalledVoices())),
    [],
  );

  // Persist voice preferences.
  useEffect(() => savePref("medipro-tts-voice", profileId), [profileId]);
  useEffect(() => savePref("medipro-tts-custom-voice", customVoiceName ?? ""), [customVoiceName]);
  useEffect(() => savePref("medipro-tts-quality", qualityId), [qualityId]);

  // Stop narration + free the microphone when leaving the page.
  useEffect(
    () => () => {
      stopSpeaking();
      const recognizer = recognizerRef.current;
      if (recognizer) {
        try {
          recognizer.abort();
        } catch {
          /* already stopped */
        }
      }
    },
    [],
  );

  // Keep the newest message in view.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  const stopListening = useCallback(() => {
    const recognizer = recognizerRef.current;
    recognizerRef.current = null;
    setListening(false);
    if (recognizer) {
      try {
        // stop() (not abort()) commits any pending final transcript first.
        recognizer.stop();
      } catch {
        /* already stopped */
      }
    }
  }, []);

  const startListening = useCallback(() => {
    if (listening) return;
    if (!speechRecognitionSupported()) {
      toast.error("Voice input isn't supported in this browser — try Chrome, Edge, or Safari.");
      return;
    }

    // Don't record while the assistant is reading an answer aloud — the
    // speaker would get transcribed into the question.
    stopSpeaking();
    setSpeakingId(null);
    setSpeechPaused(false);

    const recognizer = createSpeechRecognizer({
      onResult: (finalDelta, interim) => {
        speechFinalRef.current += finalDelta;
        const prefix = speechPrefixRef.current;
        const finalPart = speechFinalRef.current.trim();
        const interimPart = interim.trim();
        const base =
          prefix + (finalPart ? (prefix && !prefix.endsWith(" ") ? " " : "") + finalPart : "");
        setInput(base + (interimPart ? (base ? " " : "") + interimPart : ""));
      },
      onError: (error) => {
        if (error === "not-allowed" || error === "service-not-allowed") {
          toast.error(
            "Microphone access was denied — allow it in your browser to use voice input.",
          );
        } else if (error === "network") {
          toast.error(
            "Speech recognition needs a connection right now — check yours and try again.",
          );
        }
        // "no-speech" and "aborted" end quietly.
      },
      onEnd: () => {
        // Only the current recognizer may clear the listening state, so a
        // stale onend from a manually-stopped session can't clobber a new one.
        if (recognizerRef.current !== null) {
          recognizerRef.current = null;
          setListening(false);
        }
      },
    });

    if (!recognizer) {
      toast.error("Voice input isn't supported in this browser — try Chrome, Edge, or Safari.");
      return;
    }

    recognizerRef.current = recognizer;
    // Preserve anything already typed in the box, then append the dictation.
    speechPrefixRef.current = input.trim() ? `${input.trim()} ` : "";
    speechFinalRef.current = "";
    setListening(true);
    try {
      recognizer.start();
    } catch {
      recognizerRef.current = null;
      setListening(false);
      toast.error("Couldn't start the microphone. Please try again.");
    }
  }, [input, listening]);

  const send = useCallback(
    async (textOverride?: string) => {
      if (listening) stopListening();
      const text = (textOverride ?? input).trim().slice(0, 2000);
      if (!text || busy) return;

      stopSpeaking();
      setSpeakingId(null);
      setSpeechPaused(false);
      setInput("");

      const history: ChatMessage[] = [...messages, { role: "user", content: text }];
      setMessages(history);
      setBusy(true);
      try {
        const { content } = await askAssistant({
          messages: history.map((m) => ({ role: m.role, content: m.content })),
        });
        setMessages((prev) => [...prev, { role: "assistant", content }]);
        setSetupNeeded(false);
        setLastError(null);
      } catch (err) {
        const data = err instanceof ConvexError ? err.data : undefined;
        const message =
          typeof data === "string"
            ? data
            : err instanceof Error
              ? err.message
              : String(err);
        if (
          message.includes("ASSISTANT_NOT_CONFIGURED") ||
          message.includes("AUTH_REQUIRED")
        ) {
          // No API key or guest user — fall back to the local Smart AI knowledge base.
          // Smart AI runs entirely client-side from our article content, so no API
          // key or server auth is needed.
          const smartResponse = smartAiAnswer(text);
          // Simulate typing delay for a natural feel
          await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));
          setMessages((prev) => [...prev, { role: "assistant", content: smartResponse.content }]);
          setSetupNeeded(false);
          setLastError(null);
          return; // skip the rest of the catch block
        } else if (message.includes("RATE_LIMITED")) {
          setLastError("You're sending questions very fast — give it a minute, then try again.");
        } else if (message.includes("ASSISTANT_BAD_KEY")) {
          setSetupNeeded(true);
          setLastError(
            "The AI key looks invalid — double-check AI_API_KEY (and AI_BASE_URL if set) in the Keys tab.",
          );
        } else if (message.includes("AI_QUOTA_EXCEEDED")) {
          setLastError(
            "Your AI key's free quota is currently exhausted. Check your provider's rate limits (Groq / SambaNova / Google free tiers, or OpenAI credits), then try again.",
          );
        } else if (message.includes("AI_MODEL_UNAVAILABLE")) {
          setLastError(
            "That AI model isn't available on this key — check the AI_MODEL value in your Keys tab (try gemini-2.0-flash).",
          );
        } else {
          setLastError("The AI couldn't answer right now. Please try again in a moment.");
        }
        toast.error("MediPro couldn't answer this time.");
      } finally {
        setBusy(false);
      }
    },
    [input, busy, messages, askAssistant, listening, stopListening],
  );

  // Privacy in action: everything the user typed lives only in this component's
  // state — clearing it wipes the whole conversation from this tab immediately.
  const clearChat = useCallback(() => {
    stopSpeaking();
    stopListening();
    setSpeakingId(null);
    setSpeechPaused(false);
    setMessages([]);
    setLastError(null);
  }, [stopListening]);

  const toggleSpeak = useCallback(
    (index: number, text: string) => {
      // Same message: toggle pause/resume (true pause — position is kept).
      if (speakingId === index) {
        if (speechPaused) {
          resumeSpeaking();
          setSpeechPaused(false);
        } else {
          pauseSpeaking();
          setSpeechPaused(true);
        }
        return;
      }
      stopSpeaking();
      setSpeechPaused(false);
      setSpeakingId(index);
      const started = speak(text, applyQuality(profile, quality), {
        onEnd: () => {
          setSpeakingId((cur) => (cur === index ? null : cur));
          setSpeechPaused(false);
        },
      });
      if (!started) {
        setSpeakingId(null);
        toast.error("Speech isn't available in this browser.");
      }
    },
    [speakingId, speechPaused, profile, quality],
  );

  const voicesLoading = speechAvailable() && installedVoices.length === 0;

  return (
    <div className="min-h-screen">
      <GlassBackdrop />
      <AppHeader title="Assistant" />

      <main
        className="mx-auto flex w-full max-w-3xl flex-col px-4 pb-6 pt-6 sm:px-6"
        style={{ height: "calc(100dvh - 5.5rem)" }}
      >
        {/* top row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5">
            <FoxMascot mood="happy" size={40} />
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-wistaria">MediPro Assistant</h1>
              <p className="text-xs text-muted-foreground">Accurate study answers · read aloud</p>
            </div>
          </div>

          {messages.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="gap-1.5 text-muted-foreground"
              title="Erase this conversation from this browser"
            >
              <Trash2 className="size-3.5" />
              Clear
            </Button>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
                <Settings2 className="size-3.5" />
                Voice
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="glass-strong w-[19rem] border-white/10">
              <p className="text-sm font-extrabold tracking-tight">Reading voice</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                How the AI reads answers aloud. TTS needs no API key — it uses this device's voices.
              </p>

              <div className="mt-3 space-y-1.5">
                {VOICE_PROFILES.map((p) => {
                  const active = profileId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setProfileId(p.id)}
                      className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left transition-colors ${
                        active
                          ? "border-wistaria/40 bg-wistaria/10"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <span>
                        <span className="block text-sm font-bold">{p.label}</span>
                        <span className="block text-[11px] leading-4 text-muted-foreground">
                          {p.description}
                        </span>
                      </span>
                      {active && <Check className="size-4 shrink-0 text-wistaria" />}
                    </button>
                  );
                })}
              </div>

              <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Voice quality
              </p>
              <div className="mt-1.5 space-y-1.5">
                {VOICE_QUALITIES.map((q) => {
                  const active = qualityId === q.id;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setQualityId(q.id)}
                      className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left transition-colors ${
                        active
                          ? "border-wistaria/40 bg-wistaria/10"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <span>
                        <span className="block text-sm font-bold">{q.label}</span>
                        <span className="block text-[11px] leading-4 text-muted-foreground">
                          {q.description}
                        </span>
                      </span>
                      {active && <Check className="size-4 shrink-0 text-wistaria" />}
                    </button>
                  );
                })}
              </div>

              {profileId === "custom" && (
                <div className="mt-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Voices installed on this device
                  </p>
                  {voicesLoading ? (
                    <div className="flex items-center gap-2 rounded-xl bg-white/5 p-3 text-xs text-muted-foreground">
                      <Spinner className="size-3.5" />
                      Loading voices…
                    </div>
                  ) : installedVoices.length === 0 ? (
                    <p className="rounded-xl bg-white/5 p-3 text-xs text-muted-foreground">
                      No voices found on this device. (Browsers don't allow importing voice files —
                      the closest option is any voice listed here.)
                    </p>
                  ) : (
                    <div className="nice-scroll mt-1 max-h-40 space-y-1 overflow-y-auto pr-1">
                      {installedVoices.map((v) => {
                        const active = customVoiceName === v.name;
                        return (
                          <button
                            key={v.name + v.lang}
                            onClick={() => setCustomVoiceName(v.name)}
                            className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
                              active ? "bg-wistaria/10 text-wistaria" : "text-muted-foreground hover:bg-white/5"
                            }`}
                          >
                            <span className="truncate font-semibold">{v.name}</span>
                            <span className="shrink-0 font-mono text-[10px] opacity-70">{v.lang}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {!speechAvailable() && (
                <p className="mt-3 text-xs font-semibold text-[#e2666f]">
                  Speech isn't supported in this browser.
                </p>
              )}
            </PopoverContent>
          </Popover>
        </motion.div>

        {/* chat area */}
        <div className="nice-scroll mt-4 flex-1 space-y-4 overflow-y-auto rounded-3xl">
          {messages.length === 0 && !busy ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-4 text-center">
              <FoxMascot mood="happy" size={84} />
              <div className="glass-chip flex size-12 items-center justify-center rounded-2xl text-wistaria">
                <Sparkles className="size-6" />
              </div>
              <div>
                <p className="text-base font-extrabold text-wistaria">
                  Ask me anything about the basics
                </p>
                <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
                  The five high-yield topics — cardiac cycle, action potential,
                  brachial plexus, Krebs cycle, DNA replication — or any first-year
                  question. Answers are for study; always verify in your textbooks.
                </p>
              </div>
              <div className="flex max-w-md flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => void send(s)}
                    className="glass-chip rounded-full px-3.5 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-wistaria/40 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Show suggestions after welcome message (only 1 message = welcome) */}
              {messages.length === 1 && !busy && (
                <div className="flex flex-col items-center gap-3 px-4 pt-2 text-center">
                  <div className="flex max-w-md flex-wrap justify-center gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => void send(s)}
                        className="glass-chip rounded-full px-3.5 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-wistaria/40 hover:text-foreground"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="ml-auto max-w-[85%] rounded-2xl rounded-br-md border border-[#7b9ee8]/30 bg-[#7b9ee8]/15 px-4 py-3 text-sm leading-6"
                  >
                    {m.content}
                  </motion.div>
                ) : (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-chip mr-auto max-w-[85%] rounded-2xl rounded-bl-md p-4"
                  >
                    <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-wistaria">
                      <Bot className="size-3.5" />
                      MediPro
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">
                      {m.content}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => toggleSpeak(i, m.content)}
                        className={`flex h-8 items-center gap-1.5 rounded-full px-3.5 text-xs font-bold transition-colors ${
                          speakingId === i
                            ? "bg-cloud/30 text-cloud"
                            : "bg-cloud/20 text-cloud hover:bg-cloud/30"
                        }`}
                        aria-label={
                          speakingId === i
                            ? speechPaused
                              ? "Resume reading"
                              : "Pause reading"
                            : "Read answer aloud"
                        }
                      >
                        {speakingId === i && !speechPaused ? (
                          <Pause className="size-3.5" />
                        ) : (
                          <Play className="size-3.5" />
                        )}
                        {speakingId === i && !speechPaused ? "Pause" : "Play"}
                      </button>
                      <button
                        onClick={() => {
                          stopSpeaking();
                          setSpeakingId(null);
                          setSpeechPaused(false);
                        }}
                        className="flex size-8 items-center justify-center rounded-full bg-white/5 text-muted-foreground transition-colors hover:bg-[#e2666f]/15 hover:text-[#e2666f]"
                        aria-label="Stop reading"
                        title="Stop"
                      >
                        <Square className="size-3" />
                      </button>
                      <span className="ml-auto text-[10px] font-medium text-muted-foreground">
                        {speakingId === i
                          ? speechPaused
                            ? "Paused"
                            : "Reading…"
                          : `Voice: ${profile.label} · ${quality.label}`}
                      </span>
                    </div>
                  </motion.div>
                ),
              )}
              {busy && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-chip mr-auto flex items-center gap-3 rounded-2xl rounded-bl-md p-4"
                >
                  <FoxMascot mood="thinking" size={30} />
                  <ThinkingDots />
                </motion.div>
              )}
            </>
          )}
          <div ref={bottomRef} />
        </div>

        {/* persistent setup banner — the AI will not answer without a key */}
        {setupNeeded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong mt-3 flex flex-col gap-3 rounded-2xl border border-[#e0a458]/30 p-4 sm:flex-row sm:items-center"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#e0a458]/15 text-[#e0a458]">
                <Bot className="size-4" />
              </div>
              <div>
                <p className="text-sm font-bold">One step to switch me on</p>
                <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                  Add an AI key in the project's{" "}
                  <span className="font-semibold text-foreground">Keys tab</span> —{" "}
                  <code className="rounded bg-white/10 px-1 font-mono text-[10px]">AI_API_KEY</code>{" "}
                  (works for OpenAI, Google Gemini, SambaNova, or Groq). It's read server-side
                  only — never shipped to the browser.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#e0a458] px-4 text-xs font-bold text-[#191922] transition-colors hover:bg-[#eeb86b]"
              >
                Get a free Groq key
              </a>
              <button
                onClick={() => setSetupNeeded(false)}
                className="rounded-full px-2 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}

        {/* inline error note — visible until the next message */}
        {lastError && !setupNeeded && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 px-1 text-xs font-semibold text-[#e0a458]"
          >
            {lastError}
          </motion.p>
        )}

        {/* composer */}
        <div className="glass-panel shine mt-4 rounded-2xl p-3">
          <div className="flex items-end gap-2">
            <div className="relative flex-1">
              <Textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  // A manual edit ends any live listening session so the
                  // recognizer can't overwrite what the user typed.
                  if (listening) stopListening();
                }}
                aria-invalid={lastError !== null && !setupNeeded}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
                placeholder={
                  listening
                    ? "Listening… speak your question 🎤"
                    : "Ask a question… (Enter to send, Shift+Enter for a new line)"
                }
                maxLength={2000}
                rows={1}
                className="nice-scroll max-h-32 min-h-0 w-full resize-none rounded-xl border-white/10 bg-white/5 pb-7 pr-11"
                aria-label="Ask the assistant"
              />
              <button
                type="button"
                onClick={listening ? stopListening : startListening}
                aria-label={listening ? "Stop voice input" : "Speak your question"}
                title={
                  listening
                    ? "Stop listening"
                    : "Voice input — speak your question (free, browser-native)"
                }
                className={cn(
                  "absolute bottom-1.5 right-1.5 flex size-8 items-center justify-center rounded-full transition-colors",
                  listening
                    ? "bg-[#e2666f]/20 text-[#e2666f]"
                    : "text-muted-foreground hover:bg-white/10 hover:text-foreground",
                )}
              >
                {listening && (
                  <motion.span
                    className="absolute inset-0 rounded-full border-2 border-[#e2666f]"
                    animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                    aria-hidden
                  />
                )}
                <Mic className="size-4" />
              </button>
            </div>
            <Button
              onClick={() => void send()}
              disabled={busy || !input.trim()}
              className="h-10 shrink-0 gap-1.5 rounded-xl px-4"
            >
              {busy ? <Spinner className="size-4" /> : <Send className="size-4" />}
              Send
            </Button>
          </div>
          <p className="mt-2 px-1 text-[10px] leading-4 text-muted-foreground">
            AI answers can be wrong — always verify with your textbooks. Not a substitute for medical advice.
          </p>
          <p className="mt-1 flex items-start gap-1.5 px-1 text-[10px] leading-4 text-muted-foreground">
            <ShieldCheck className="mt-px size-3 shrink-0 text-[#6fb5b0]" />
            Privacy: your question is sent only to the AI provider to answer it — never your name
            or email. We don't store your conversations, and the AI provider doesn't train on your
            questions.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function Assistant() {
  return (
    <QueryErrorBoundary title="Couldn't load the assistant">
      <AssistantInner />
    </QueryErrorBoundary>
  );
}
