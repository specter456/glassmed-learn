import { CatMascot } from "@/components/mascots";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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
const FIREWORKS_MS = 8000; // rockets keep launching for the first 8s

const CONFETTI_COLORS = [
  "#78A2D2", // cloud blue
  "#FEFFAF", // butter yellow
  "#A2A2D0", // wistaria
  "#8be9c8", // mint
  "#ffb3c6", // soft pink
  "#FFD700", // gold
  "#e63946", // red
  "#3b82f6", // blue
  "#ffffff",
];

const FIREWORK_COLORS = ["#FFD700", "#e63946", "#3b82f6", "#ffffff"];

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

function readMemory(): BirthdayMemory | null {
  try {
    const raw = localStorage.getItem(BIRTHDAY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BirthdayMemory;
    if (typeof parsed?.name === "string" && typeof parsed?.date === "string") return parsed;
  } catch {
    // Unreadable memory — treat as no birthday yet.
  }
  return null;
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

  // Fireworks: rockets shoot up from the bottom and burst in mid-air.
  useEffect(() => {
    if (!open || stage !== "celebrating") return;
    const fireworksEnd = Date.now() + FIREWORKS_MS;
    const burstTimers: number[] = [];
    let raf = 0;

    const launchRocket = () => {
      const x = 0.12 + Math.random() * 0.76;
      const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
      confetti({
        particleCount: 4,
        angle: 90,
        spread: 14,
        startVelocity: 58,
        gravity: 1.25,
        ticks: 42,
        origin: { x, y: 1 },
        colors: [color, "#ffffff"],
        scalar: 1.05,
        zIndex: 10000,
        disableForReducedMotion: true,
      });
      burstTimers.push(
        window.setTimeout(() => {
          confetti({
            particleCount: 80,
            angle: 90,
            spread: 360,
            startVelocity: 24,
            gravity: 0.85,
            ticks: 85,
            origin: { x, y: 0.5 + Math.random() * 0.3 },
            colors: FIREWORK_COLORS,
            scalar: 0.9,
            zIndex: 10000,
            disableForReducedMotion: true,
          });
        }, 190),
      );
      if (Date.now() < fireworksEnd) raf = requestAnimationFrame(launchRocket);
    };

    raf = requestAnimationFrame(launchRocket);
    return () => {
      cancelAnimationFrame(raf);
      burstTimers.forEach((t) => window.clearTimeout(t));
      confetti.reset();
    };
  }, [open, stage]);

  // Confetti cannons from both sides while the celebration is up.
  useEffect(() => {
    if (!open || stage !== "celebrating") return;
    const end = Date.now() + CELEBRATION_MS;
    let raf = 0;
    const tick = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: CONFETTI_COLORS,
        zIndex: 10000,
        disableForReducedMotion: true,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: CONFETTI_COLORS,
        zIndex: 10000,
        disableForReducedMotion: true,
      });
      if (Date.now() < end) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      confetti.reset();
    };
  }, [open, stage]);

  // "Happy birthday again" — one quick burst, auto-closes.
  useEffect(() => {
    if (!open || stage !== "again") return;
    confetti({
      particleCount: 120,
      spread: 110,
      origin: { y: 0.6 },
      colors: CONFETTI_COLORS,
      disableForReducedMotion: true,
    });
    const t = window.setTimeout(() => {
      setOpen(false);
      setStage("name");
    }, 2600);
    return () => {
      window.clearTimeout(t);
      confetti.reset();
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
    try {
      localStorage.setItem(
        BIRTHDAY_KEY,
        JSON.stringify({ name: finalName, date: todayStr() }),
      );
    } catch {
      // Storage unavailable — the party still happens for this session.
    }
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

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Birthday celebration"
              className={`glass-strong shine relative w-full rounded-3xl p-7 text-center ${
                isParty ? "max-w-lg" : "max-w-md"
              }`}
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96, transition: { duration: 0.6 } }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
            >
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
                  <div className="flex justify-center">
                    <CatMascot mood="excited" size={110} />
                  </div>
                  <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-wistaria">
                    Happy Birthday again, {againName}! 🎂✨
                  </h2>
                  <p className="mx-auto mt-2 max-w-[22rem] text-sm leading-6 text-muted-foreground">
                    Hope your special day keeps getting better!
                  </p>
                </>
              )}

              {isParty && (
                <>
                  <motion.div
                    className="relative mx-auto flex h-44 w-48 items-end justify-center"
                    animate={{ y: [0, -22, 0] }}
                    transition={{ duration: 0.85, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <PartyHat />
                    <CatMascot mood="excited" size={128} />
                  </motion.div>

                  <h2 className="mt-3 bg-gradient-to-b from-[#FEFFAF] via-white to-[#A2A2D0] bg-clip-text text-4xl font-black tracking-tight text-transparent drop-shadow-[0_0_18px_rgba(162,162,208,0.65)] sm:text-5xl">
                    🎉 Happy Birthday, {celebrateName}! 🎂✨
                  </h2>
                  <p className="mx-auto mt-3 max-w-[24rem] text-sm leading-6 text-muted-foreground">
                    May your day be filled with joy, laughter, and all the things you
                    love most. You are amazing!
                  </p>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
