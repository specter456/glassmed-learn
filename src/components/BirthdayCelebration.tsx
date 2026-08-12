import { Blob } from "@/components/LogoutBlob";
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
 * - Flow: "Is today your special day?" → name → full-screen confetti party with
 *   the purple blob in a party hat, a candle to blow out, and a Make a Wish.
 * - Memory: name + date are kept in localStorage, so re-opening on the same day
 *   skips straight to a quick "Happy Birthday again!" message.
 *
 * All animations are transform/opacity-only (plus canvas-confetti's one-off
 * bursts), keeping with the app's battery-friendly policy.
 */

const BIRTHDAY_KEY = "glassmed-birthday";
const CONFETTI_COLORS = [
  "#78A2D2", // cloud blue
  "#FEFFAF", // butter yellow
  "#A2A2D0", // wistaria
  "#8be9c8", // mint
  "#ffb3c6", // soft pink
  "#ffffff",
];

type Stage = "ask" | "name" | "celebrating" | "wished" | "again";

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

/** Tiny swaying party hat for the blob. */
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

/** Candle with a flickering flame that goes out (with a puff of smoke) on wish. */
function Candle({ lit }: { lit: boolean }) {
  return (
    <motion.div
      className="absolute -right-2 bottom-6 z-10"
      animate={{ rotate: [0, 3, -3, 0], y: [0, -2, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    >
      <svg viewBox="0 0 36 56" className="w-9">
        <defs>
          <linearGradient id="birthday-candle-body" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffe9a8" />
            <stop offset="100%" stopColor="#ffcf5e" />
          </linearGradient>
        </defs>
        <rect x="12" y="18" width="12" height="34" rx="4" fill="url(#birthday-candle-body)" />
        <rect x="12" y="18" width="12" height="10" rx="4" fill="#ffffff" opacity="0.25" />
        <line x1="18" y1="18" x2="18" y2="12" stroke="#5b4a2e" strokeWidth="2" strokeLinecap="round" />
        <AnimatePresence>
          {lit && (
            <motion.path
              d="M18 4 C 22 10 22 14 18 16 C 14 14 14 10 18 4 Z"
              fill="#ffb347"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [1, 1.18, 0.94, 1], opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0, y: -6, transition: { duration: 0.5 } }}
              transition={{
                scale: { duration: 0.45, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 0.2 },
              }}
              style={{ transformOrigin: "18px 16px" }}
            />
          )}
        </AnimatePresence>
        {!lit && (
          <motion.circle
            cx="18"
            cy="8"
            r="2"
            fill="#9aa7b5"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0], y: [-2, -9] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
        )}
      </svg>
    </motion.div>
  );
}

export function BirthdayCelebration() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("ask");
  const [name, setName] = useState("");
  const [celebrateName, setCelebrateName] = useState("");
  const [againName, setAgainName] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const openModal = () => {
    const memory = readMemory();
    if (memory && memory.date === todayStr()) {
      setAgainName(memory.name);
      setStage("again");
    } else {
      setAgainName(null);
      setStage("ask");
    }
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setName("");
    setStage("ask");
  };

  // Side cannons rain confetti while the full celebration is up.
  useEffect(() => {
    if (!open || (stage !== "celebrating" && stage !== "wished")) return;
    const end = Date.now() + 3200;
    let raf = 0;
    const tick = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: CONFETTI_COLORS,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: CONFETTI_COLORS,
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
    confetti({ particleCount: 120, spread: 110, origin: { y: 0.6 }, colors: CONFETTI_COLORS });
    const t = setTimeout(() => {
      setOpen(false);
      setStage("ask");
    }, 2600);
    return () => {
      clearTimeout(t);
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
      localStorage.setItem(BIRTHDAY_KEY, JSON.stringify({ name: finalName, date: todayStr() }));
    } catch {
      // Storage unavailable — the party still happens for this session.
    }
    setStage("celebrating");
  };

  const makeAWish = () => {
    setStage("wished");
    confetti({ particleCount: 180, spread: 120, startVelocity: 42, origin: { y: 0.6 }, colors: CONFETTI_COLORS });
    confetti({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors: CONFETTI_COLORS });
    confetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors: CONFETTI_COLORS });
  };

  const isParty = stage === "celebrating" || stage === "wished";
  const isQuick = stage === "again";

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
              exit={{ opacity: 0 }}
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
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
            >
              {!isParty && !isQuick && (
                <button
                  onClick={closeModal}
                  className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-white/10"
                  aria-label="Close"
                >
                  <X className="size-4" />
                </button>
              )}

              {stage === "ask" && (
                <>
                  <div className="flex justify-center">
                    <Blob mood="happy" size={120} />
                  </div>
                  <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-wistaria">
                    Is today your special day? 🎂
                  </h2>
                  <p className="mx-auto mt-2 max-w-[22rem] text-sm leading-6 text-muted-foreground">
                    If it is, we have a little celebration waiting just for you!
                  </p>
                  <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex-1 border border-white/15"
                      onClick={closeModal}
                    >
                      Not today
                    </Button>
                    <Button
                      type="button"
                      className="flex-1 bg-gradient-to-r from-[#78A2D2] to-[#A2A2D0] text-[#0e1233] hover:from-[#8db3de] hover:to-[#b0b0da]"
                      onClick={() => setStage("name")}
                    >
                      Yes, it's my birthday! 🎉
                    </Button>
                  </div>
                </>
              )}

              {stage === "name" && (
                <>
                  <div className="flex justify-center">
                    <Blob mood="happy" size={110} />
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
                    Celebrate Me! 🎂
                  </Button>
                </>
              )}

              {stage === "again" && againName && (
                <>
                  <div className="flex justify-center">
                    <Blob mood="happy" size={110} />
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
                  <div className="relative mx-auto flex h-40 w-44 items-end justify-center">
                    <PartyHat />
                    <Candle lit={stage === "celebrating"} />
                    <Blob mood="happy" size={120} />
                  </div>

                  <h2 className="mt-3 text-3xl font-black tracking-tight text-wistaria sm:text-4xl">
                    Happy Birthday, {celebrateName}! 🎂✨
                  </h2>
                  <p className="mx-auto mt-3 max-w-[24rem] text-sm leading-6 text-muted-foreground">
                    May your day be filled with joy, laughter, and all the things you
                    love most. You are amazing!
                  </p>

                  <AnimatePresence mode="wait">
                    {stage === "celebrating" ? (
                      <motion.div
                        key="wish"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ delay: 0.3, duration: 0.35 }}
                      >
                        <Button
                          type="button"
                          className="mt-6 w-full bg-gradient-to-r from-[#feffaf] via-[#ffd98a] to-[#ffb98a] text-[#5a4a1f] hover:from-[#ffffc4] hover:to-[#ffc9a0]"
                          onClick={makeAWish}
                        >
                          Make a Wish 🌠
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="granted"
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="mt-6"
                      >
                        <p className="text-lg font-extrabold text-cloud">
                          Wish granted! Have the best year ever! 💫
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          className="mt-3 border border-white/15"
                          onClick={closeModal}
                        >
                          Keep celebrating 🥳
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
