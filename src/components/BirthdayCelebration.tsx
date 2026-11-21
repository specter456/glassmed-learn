import { CatMascot } from "@/components/mascots";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getPortalRoot } from "@/lib/portal";
import { scopedStorage } from "@/lib/account-storage";

/**
 * GlassMed's universal birthday celebration 🎂
 *
 * - Trigger: a gently pulsing 🎂 button in the header.
 * - Flow: name input → instant fireworks + confetti party with the white
 *   cat mascot jumping in the middle, then everything fades away by itself.
 * - Auto-fade: the party plays for ~9 seconds, then the modal and confetti
 *   fade out smoothly — hands-free. A tiny ✕ in the corner dismisses early.
 * - Memory: name + date are kept in localStorage, so re-opening on the same
 *   day skips straight to a quick "Happy Birthday again!" burst.
 *
 * All animations are transform/opacity-only (plus canvas-confetti's one-off
 * bursts), keeping with the app's battery-friendly policy.
 */

const BIRTHDAY_KEY = "glassmed-birthday";
const CELEBRATION_MS = 9000; // auto-fade after 9s of party

// ------------------------------------------------------------------
//  Firework sound (Web Audio API — no asset files, no dependencies)
// ------------------------------------------------------------------

let audioCtx: AudioContext | null = null;

/** Lazily create (and resume) a single shared AudioContext. */
function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx) {
      const Ctor =
        window.AudioContext ??
        (window as Window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return null;
      audioCtx = new Ctor();
    }
    if (audioCtx.state === "suspended") void audioCtx.resume();
    return audioCtx;
  } catch {
    // Audio is decorative — never let it break the celebration.
    return null;
  }
}

/** "Whoosh" — filtered noise sweeping upward as the rocket climbs. */
function playWhoosh(ctx: AudioContext | null): void {
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const frames = Math.floor(ctx.sampleRate * 0.36);
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 1.1;
    filter.frequency.setValueAtTime(420, now);
    filter.frequency.exponentialRampToValueAtTime(2600, now + 0.3);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.1, now + 0.07);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);

    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start(now);
    source.stop(now + 0.36);
  } catch {
    /* audio is best-effort */
  }
}

/** Soft "pop" — a falling tone with a fast decay for the shell burst. */
function playPop(ctx: AudioContext | null): void {
  if (!ctx) return;
  try {
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(760, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.22);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.14, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.32);
  } catch {
    /* audio is best-effort */
  }
}

// Birthday memory is personal — scoped under the guest/account session so two
// visitors on the same browser never share each other's.
function readMemory(): BirthdayMemory | null {
  try {
    const raw = scopedStorage.getItem(BIRTHDAY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BirthdayMemory;
    if (typeof parsed?.name === "string" && typeof parsed?.date === "string") return parsed;
  } catch {
    // Unreadable memory — treat as no birthday yet.
  }
  return null;
}

function saveMemory(visible: BirthdayMemory): void {
  try {
    scopedStorage.setItem(BIRTHDAY_KEY, JSON.stringify(visible));
  } catch {
    /* storage blocked */
  }
}

// GlassMed's neon party palette: cyan, purple, pink (+ a little sparkle).
const NEON_CYAN = "#22d3ee";
const NEON_PURPLE = "#a855f7";
const NEON_PINK = "#ec4899";

const FIREWORK_COLORS = [
  NEON_CYAN,
  NEON_PURPLE,
  NEON_PINK,
  "#67e8f9",
  "#c084fc",
  "#f9a8d4",
  "#FEFFAF",
  "#ffffff",
];

const AGAIN_MS = 6000; // the "again" card lingers long enough to enjoy

type Stage = "name" | "celebrating" | "again";

interface BirthdayMemory {
  name: string;
  date: string; // YYYY-MM-DD
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

/** Tiny swaying party hat for the mascot. */
function PartyHat() {
  return (
    <motion.svg
      viewBox="0 0 64 60"
      className="absolute -top-3 left-1/2 z-10 w-14 -translate-x-1/2"
      animate={{ rotate: [-4, 4, -4], y: [0, -3, 0] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    >
      <defs>
        <linearGradient id="birthday-hat-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6d5ae8" />
        </linearGradient>
      </defs>
      <path d="M32 2 L60 56 L4 56 Z" fill="url(#birthday-hat-grad)" />
      <path d="M20 36 L44 36 L49 46 L15 46 Z" fill="#feffaf" opacity="0.9" />
      <path d="M26 20 L38 20 L43 30 L21 30 Z" fill="#78A2D2" opacity="0.9" />
      <circle cx="32" cy="2" r="5" fill="#feffaf" />
      <path d="M4 56 Q 32 62 60 56 Z" fill="#231640" opacity="0.35" />
    </motion.svg>
  );
}

/** Big, always-visible emoji band that sits in normal flow (never clipped). */
function EmojiRow() {
  const emojis = ["🎂", "🎈", "🎉"];
  return (
    <div
      className="flex select-none items-center justify-center gap-1"
      style={{ fontSize: "4rem", lineHeight: 1 }}
      aria-hidden
    >
      {emojis.map((emoji, index) => (
        <motion.span
          key={emoji}
          animate={{ y: [0, -10, 0], rotate: [-6, 6, -6] }}
          transition={{
            duration: 2.6 + index * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.15,
          }}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
}

/**
 * A cute floating sticker: gentle bob + sway, forever.
 * Pure transform animation, so it stays GPU-cheap.
 */
function Sticker({
  emoji,
  className,
  delay = 0,
  duration = 4,
  rotate = 12,
  size = "text-3xl sm:text-4xl",
}: {
  emoji: string;
  className: string;
  delay?: number;
  duration?: number;
  rotate?: number;
  size?: string;
}) {
  return (
    <motion.span
      aria-hidden
      className={`pointer-events-none absolute select-none drop-shadow-[0_0_14px_rgba(168,85,247,0.55)] ${size} ${className}`}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -14, 0],
        rotate: [-rotate, rotate, -rotate],
      }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={{
        opacity: { duration: 0.35, delay },
        scale: { duration: 0.35, delay },
        y: { duration, repeat: Infinity, ease: "easeInOut", delay },
        rotate: { duration: duration * 1.4, repeat: Infinity, ease: "easeInOut", delay },
      }}
    >
      {emoji}
    </motion.span>
  );
}

export function BirthdayCelebration() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("name");
  const [name, setName] = useState("");
  const [celebrateName, setCelebrateName] = useState("");
  const [againName, setAgainName] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const autoCloseRef = useRef<number | null>(null);

  const clearAutoClose = () => {
    if (autoCloseRef.current !== null) {
      window.clearTimeout(autoCloseRef.current);
      autoCloseRef.current = null;
    }
  };

  const openModal = () => {
    const memory = readMemory();
    if (memory && memory.date === todayStr()) {
      setAgainName(memory.name);
      setStage("again");
    } else {
      setAgainName(null);
      setName("");
      setStage("name");
    }
    setOpen(true);
  };

  const closeModal = () => {
    clearAutoClose();
    setOpen(false);
    setName("");
    setStage("name");
  };

  // Clean up the auto-close timer if the component ever unmounts mid-party.
  useEffect(() => {
    return () => {
      if (autoCloseRef.current !== null) window.clearTimeout(autoCloseRef.current);
    };
  }, []);

  // Fireworks: exactly five rockets launch from the bottom edge (right above
  // the bottom navigation bar), each one bursting into a ring of colour at its
  // own apex height. `origin.y = 1` is the bottom of the viewport.
  useEffect(() => {
    if (!open) return;
    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const audio = reduceMotion ? null : getAudioContext();
    const timers: number[] = [];

    const shots = [
      { x: 0.2, flight: 560 },
      { x: 0.8, flight: 640 },
      { x: 0.35, flight: 600 },
      { x: 0.65, flight: 700 },
      { x: 0.5, flight: 780 },
    ];

    shots.forEach((shot, index) => {
      // Stagger the launches so they read as five separate rockets.
      timers.push(
        window.setTimeout(() => {
          playWhoosh(audio);

          // The rocket: a short, fast streak climbing from the bottom edge.
          confetti({
            particleCount: 6,
            angle: 90,
            spread: 8,
            startVelocity: 72,
            gravity: 0.9,
            decay: 0.9,
            ticks: 60,
            origin: { x: shot.x, y: 1 },
            colors: ["#ffffff", "#fef3c7"],
            scalar: 0.8,
            zIndex: 10000,
            disableForReducedMotion: true,
          });

          // The burst: a full circle that blooms where the rocket peaked.
          timers.push(
            window.setTimeout(() => {
              playPop(audio);
              confetti({
                particleCount: 130,
                angle: 90,
                spread: 360,
                startVelocity: 26,
                gravity: 0.75,
                decay: 0.92,
                ticks: 140,
                origin: { x: shot.x, y: 0.35 },
                colors: FIREWORK_COLORS,
                scalar: 1.05,
                zIndex: 10000,
                disableForReducedMotion: true,
              });
              // A smaller white core makes it read as a real shell.
              confetti({
                particleCount: 40,
                angle: 90,
                spread: 360,
                startVelocity: 12,
                gravity: 0.6,
                ticks: 110,
                origin: { x: shot.x, y: 0.35 },
                colors: ["#ffffff", "#fef3c7", "#ffffff"],
                scalar: 0.7,
                zIndex: 10000,
                disableForReducedMotion: true,
              });
            }, shot.flight),
          );
        }, 100 + index * 320),
      );
    });

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      confetti.reset();
    };
  }, [open]);

  // "Happy birthday again" — the entrance burst fires above, then the card
  // eases itself away.
  useEffect(() => {
    if (!open || stage !== "again") return;
    const t = window.setTimeout(() => {
      setOpen(false);
      setStage("name");
    }, AGAIN_MS);
    return () => {
      window.clearTimeout(t);
    };
  }, [open, stage]);

  // Focus the name input when the name stage appears.
  useEffect(() => {
    if (open && stage === "name") nameRef.current?.focus();
  }, [open, stage]);

  const celebrate = () => {
    const clean = name.trim().slice(0, 40);
    const finalName = clean || "Wonderful Student";
    setCelebrateName(finalName);
    saveMemory({ name: finalName, date: todayStr() });
    setStage("celebrating");
    clearAutoClose();
    autoCloseRef.current = window.setTimeout(closeModal, CELEBRATION_MS);
  };

  const isParty = stage === "celebrating";

  return (
    <>
      <motion.button
        onClick={openModal}
        className="relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg transition-colors hover:bg-white/20"
        aria-label="Birthday celebration"
        title="It's your birthday?"
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.94 }}
      >
        <span aria-hidden>🎂</span>
        <span className="absolute -right-0.5 -top-0.5 size-2 animate-pulse rounded-full bg-[#feffaf]" />
      </motion.button>

      {createPortal(
        <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.6 } }}
              onClick={isParty ? undefined : closeModal}
            />

            <div
              className="relative flex justify-center"
              style={{ width: "90%", maxWidth: 500 }}
            >
              {/* Pulsing neon halo, painted behind the card. */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[2.5rem]"
                style={{
                  background: `linear-gradient(120deg, ${NEON_CYAN}, ${NEON_PURPLE}, ${NEON_PINK}, ${NEON_CYAN})`,
                  filter: "blur(26px)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.75, 0.3] }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                }}
              />

              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Birthday celebration"
                className="glass-strong shine relative w-full border border-white/25 text-center shadow-[0_0_50px_-10px_rgba(168,85,247,0.85),0_30px_80px_-30px_rgba(0,0,0,0.8)]"
                style={{
                  padding: 40,
                  borderRadius: 28,
                  maxHeight: "calc(100dvh - 2rem)",
                  overflowY: "auto",
                }}
                initial={{ opacity: 0, y: 24, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.96, transition: { duration: 0.6 } }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
              >
                {/* A few gentle floaters, kept fully inside the card so they
                    can never be clipped by the viewport edge. */}
                <Sticker emoji="⭐" className="bottom-3 left-4" delay={0.5} duration={3.4} size="text-2xl" />
                <Sticker emoji="🎈" className="right-3 top-14" delay={0.2} duration={4.2} size="text-3xl" rotate={14} />
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-white/10"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>

              {stage === "name" && (
                <>
                  <div className="flex justify-center">
                    <CatMascot mood="excited" size={110} />
                  </div>
                  <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-wistaria">
                    What is your name? ✨
                  </h2>
                  <input
                    ref={nameRef}
                    value={name}
                    maxLength={40}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && name.trim()) celebrate();
                    }}
                    placeholder="Your name…"
                    className="mt-5 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-center text-lg font-semibold text-foreground placeholder:text-muted-foreground/70 focus:border-wistaria/60 focus:outline-none focus:ring-2 focus:ring-wistaria/30"
                  />
                  <Button
                    type="button"
                    disabled={!name.trim()}
                    className="mt-4 w-full bg-gradient-to-r from-[#78A2D2] to-[#A2A2D0] text-[#0e1233] hover:from-[#8db3de] hover:to-[#b0b0da] disabled:opacity-50"
                    onClick={celebrate}
                  >
                    Celebrate! 🎂
                  </Button>
                </>
              )}

              {stage === "again" && againName && (
                <>
                  <EmojiRow />
                  <motion.div
                    className="relative mx-auto flex h-32 w-40 items-end justify-center"
                    animate={{ y: [0, -14, 0], rotate: [-2, 2, -2] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <PartyHat />
                    <CatMascot mood="excited" size={112} />
                  </motion.div>
                  <h2 className="mt-1 break-words bg-[linear-gradient(100deg,#22d3ee,#a855f7,#ec4899)] bg-clip-text font-calligraphy text-4xl font-bold leading-[1.1] text-transparent drop-shadow-[0_0_20px_rgba(168,85,247,0.8)] sm:text-5xl">
                    Happy Birthday again, {againName}!
                  </h2>
                  <p className="mx-auto mt-3 text-base font-bold text-foreground sm:text-lg">
                    Take a break, you've earned it! 🌟
                  </p>
                </>
              )}

              {isParty && (
                <>
                  <EmojiRow />
                  <motion.div
                    className="relative mx-auto flex h-44 w-48 items-end justify-center"
                    animate={{ y: [0, -22, 0] }}
                    transition={{ duration: 0.85, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <PartyHat />
                    <CatMascot mood="excited" size={132} />
                  </motion.div>

                  <h2 className="mt-1 break-words bg-[linear-gradient(100deg,#22d3ee,#a855f7,#ec4899)] bg-clip-text font-calligraphy text-5xl font-bold leading-[1.05] text-transparent drop-shadow-[0_0_22px_rgba(236,72,153,0.8)] sm:text-6xl">
                    Happy Birthday, {celebrateName}!
                  </h2>
                  <p className="mx-auto mt-3 text-base font-bold text-foreground sm:text-lg">
                    Take a break, you've earned it! 🌟
                  </p>
                </>
              )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>,
        getPortalRoot(),
      )}
    </>
  );
}
