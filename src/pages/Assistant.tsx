import { motion } from "framer-motion";
import { Bot, Check, Pause, Play, Send, Settings2, Square, Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { api } from "@/convex/_generated/api";
import { ConvexError } from "convex/values";
import { useAction } from "convex/react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { GlassBackdrop } from "@/components/GlassBackdrop";
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
  getInstalledVoices,
  onVoicesReady,
  speak,
  speechAvailable,
  stopSpeaking,
  type VoiceProfile,
  type VoiceProfileId,
} from "@/lib/tts";

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

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState(() => searchParams.get("q") ?? "");
  const [busy, setBusy] = useState(false);
  const [speakingId, setSpeakingId] = useState<number | null>(null);
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
  const [installedVoices, setInstalledVoices] = useState<SpeechSynthesisVoice[]>(() =>
    getInstalledVoices(),
  );

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const profile: VoiceProfile = useMemo(() => {
    const base = VOICE_PROFILES.find((p) => p.id === profileId) ?? VOICE_PROFILES[3];
    return base.id === "custom" ? { ...base, customVoiceName: customVoiceName ?? undefined } : base;
  }, [profileId, customVoiceName]);

  // Load installed voices (Chrome fills them in asynchronously).
  useEffect(
    () => onVoicesReady(() => setInstalledVoices(getInstalledVoices())),
    [],
  );

  // Persist voice preferences.
  useEffect(() => savePref("medipro-tts-voice", profileId), [profileId]);
  useEffect(() => savePref("medipro-tts-custom-voice", customVoiceName ?? ""), [customVoiceName]);

  // Stop any narration when leaving the page.
  useEffect(() => () => stopSpeaking(), []);

  // Keep the newest message in view.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  const send = useCallback(
    async (textOverride?: string) => {
      const text = (textOverride ?? input).trim().slice(0, 2000);
      if (!text || busy) return;

      stopSpeaking();
      setSpeakingId(null);
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
        if (message.includes("ASSISTANT_NOT_CONFIGURED")) {
          setSetupNeeded(true);
          setLastError(
            "The assistant needs an OpenAI API key before it can answer — see the banner below.",
          );
        } else if (message.includes("RATE_LIMITED")) {
          setLastError("You're sending questions very fast — give it a minute, then try again.");
        } else if (message.includes("ASSISTANT_BAD_KEY")) {
          setSetupNeeded(true);
          setLastError(
            "The AI key looks invalid — double-check AI_API_KEY (and AI_BASE_URL if set) in the Keys tab.",
          );
        } else if (message.includes("AI_QUOTA_EXCEEDED")) {
          setLastError(
            "Your AI key's quota is currently 0/exhausted. Enable billing or free-tier quota at ai.google.dev/gemini-api/docs/rate-limits, then try again.",
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
    [input, busy, messages, askAssistant],
  );

  const toggleSpeak = useCallback(
    (index: number, text: string) => {
      if (speakingId === index) {
        stopSpeaking();
        setSpeakingId(null);
        return;
      }
      stopSpeaking();
      setSpeakingId(index);
      const started = speak(text, profile, {
        onEnd: () => setSpeakingId((cur) => (cur === index ? null : cur)),
      });
      if (!started) {
        setSpeakingId(null);
        toast.error("Speech isn't available in this browser.");
      }
    },
    [speakingId, profile],
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
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[#a2a2d0]/15 text-wistaria">
              <Bot className="size-5" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-wistaria">MediPro Assistant</h1>
              <p className="text-xs text-muted-foreground">Accurate study answers · read aloud</p>
            </div>
          </div>

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
            <div className="flex h-full flex-col items-center justify-center gap-5 px-4 text-center">
              <div className="glass-chip flex size-14 items-center justify-center rounded-2xl text-wistaria">
                <Sparkles className="size-7" />
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
                        aria-label={speakingId === i ? "Pause reading" : "Read answer aloud"}
                      >
                        {speakingId === i ? (
                          <Pause className="size-3.5" />
                        ) : (
                          <Play className="size-3.5" />
                        )}
                        {speakingId === i ? "Pause" : "Play"}
                      </button>
                      <button
                        onClick={() => {
                          stopSpeaking();
                          setSpeakingId(null);
                        }}
                        className="flex size-8 items-center justify-center rounded-full bg-white/5 text-muted-foreground transition-colors hover:bg-[#e2666f]/15 hover:text-[#e2666f]"
                        aria-label="Stop reading"
                        title="Stop"
                      >
                        <Square className="size-3" />
                      </button>
                      <span className="ml-auto text-[10px] font-medium text-muted-foreground">
                        {speakingId === i ? "Reading…" : `Voice: ${profile.label}`}
                      </span>
                    </div>
                  </motion.div>
                ),
              )}
              {busy && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-chip mr-auto flex items-center gap-2.5 rounded-2xl rounded-bl-md p-4"
                >
                  <Bot className="size-4 text-wistaria" />
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
                  (works for OpenAI or Google Gemini). It's read server-side only — never
                  shipped to the browser.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <a
                href="https://index.trygravity.ai/go/50733258-e7d6-4b52-aaea-c11c2a67d2d8"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#e0a458] px-4 text-xs font-bold text-[#191922] transition-colors hover:bg-[#eeb86b]"
              >
                Get an OpenAI key
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
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-invalid={lastError !== null && !setupNeeded}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              placeholder="Ask a question… (Enter to send, Shift+Enter for a new line)"
              maxLength={2000}
              rows={1}
              className="nice-scroll max-h-32 min-h-0 flex-1 resize-none rounded-xl border-white/10 bg-white/5"
              aria-label="Ask the assistant"
            />
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
