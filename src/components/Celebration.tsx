import { CatMascot, PandaMascot } from "@/components/mascots";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { cn } from "@/lib/utils";

/* ------------------------- success messages ------------------------ */

export const LOGIN_MESSAGES = [
  { title: "Login Successful! 🎉", subtitle: "Yayyy! Welcome back!" },
  { title: "You're in! 🎊", subtitle: "So good to see you again!" },
  { title: "Welcome to GlassMed! 💙", subtitle: "Thank YOU for learning with us!" },
];

export const FLASHCARD_WINS = [
  "WON! 🎯",
  "Got it! You're a pro! 💪",
  "Nailed it! ⭐",
  "Brilliant! 🏆",
  "Correct! You're amazing! 🌟",
  "Mastered! 💙",
];

export const QUIZ_PRAISE = [
  "Correct! You're amazing! 🌟",
  "Nailed it! 🎯",
  "That's the move! 💪",
  "Perfect save! 🏆",
  "You're on fire! 🔥",
];

export const ROUND_COMPLETE_TITLES = [
  "Round Complete! 🏆",
  "Shift Complete! 🎉",
  "Mission Accomplished! ⭐",
];

/* ----------------------------- mascot ------------------------------ */

interface MascotProps {
  size?: number;
  className?: string;
  /** Which mascot celebrates here — the white cat by default (celebrations),
   * or the panda for game results. */
  variant?: "cat" | "panda";
}

/**
 * The celebration mascot — white cat for welcome/celebration moments
 * (login, flashcards, level-ups), panda for the Game section. Pure inline
 * SVG (no assets, no network) with its own happy bounce.
 */
export function Mascot({ size = 72, className, variant = "cat" }: MascotProps) {
  const glow = cn("drop-shadow-[0_10px_24px_rgba(120,162,210,0.45)]", className);
  return variant === "panda" ? (
    <PandaMascot mood="happy" size={size} className={glow} />
  ) : (
    <CatMascot mood="excited" size={size} className={glow} />
  );
}

/* --------------------------- confetti ------------------------------ */

interface ConfettiPiece {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  delay: number;
  duration: number;
  color: string;
  round: boolean;
}

const CONFETTI_COLORS = ["#78A2D2", "#FEFFAF", "#A2A2D0", "#6fb5b0", "#e896b4", "#ffffff"];

/** Deterministic confetti burst — pure CSS transforms, battery-friendly. */
export function ConfettiBurst({
  count = 26,
  className,
}: {
  count?: number;
  className?: string;
}) {
  const pieces = useMemo<ConfettiPiece[]>(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + (i % 3) * 0.25;
        const dist = 90 + (i % 6) * 30;
        return {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist * 0.85 - 20,
          rotate: (i * 47) % 360,
          scale: 0.5 + (i % 3) * 0.22,
          delay: (i % 5) * 0.03,
          duration: 0.9 + (i % 4) * 0.18,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          round: i % 4 === 0,
        };
      }),
    [count],
  );

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className={cn("absolute left-1/2 top-1/2", p.round ? "size-2.5 rounded-full" : "size-2 rounded-[2px]")}
          style={{ backgroundColor: p.color, boxShadow: `0 0 10px ${p.color}88` }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.4, rotate: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: p.scale, rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

/* --------------------------- overlay ------------------------------- */

interface CelebrationOverlayProps {
  title: string;
  subtitle?: string;
  /** Extra celebratory line, e.g. "Welcome back" */
  footer?: string;
  emoji?: string;
  showMascot?: boolean;
  onDone?: () => void;
  durationMs?: number;
}

/**
 * Full-screen celebration: confetti rain + mascot + glowing message.
 * Auto-dismisses after `durationMs` (default 2600ms) and calls onDone.
 */
export function CelebrationOverlay({
  title,
  subtitle,
  footer,
  emoji = "🎉",
  showMascot = true,
  onDone,
  durationMs = 2600,
}: CelebrationOverlayProps) {
  const sparks = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        top: 8 + (i * 9) % 88,
        left: 6 + (i * 13) % 88,
        delay: (i % 4) * 0.35,
        size: 10 + (i % 3) * 5,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      })),
    [],
  );

  return (
    <motion.div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[95] flex flex-col items-center justify-center overflow-hidden bg-[#0e1233]/45 px-6 text-center backdrop-blur-[2px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      onAnimationComplete={() => {
        if (onDone) setTimeout(onDone, durationMs);
      }}
    >
      {/* glow + confetti layer */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cloud/25 blur-[110px]" />
        <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-wistaria/20 blur-[80px]" />
        <ConfettiBurst count={34} />
        {sparks.map((s, i) => (
          <motion.span
            key={i}
            className="absolute"
            style={{ top: `${s.top}%`, left: `${s.left}%`, color: s.color, fontSize: s.size }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: [0, 1, 0.6, 0], scale: [0.3, 1.2, 0.9], y: [-14, 0] }}
            transition={{ duration: 2.6, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
          >
            {["✨", "💙", "⭐", "🎊", "💜", "🌟"][i % 6]}
          </motion.span>
        ))}
      </div>

      <div className="relative flex flex-col items-center">
        {showMascot && <Mascot size={104} className="mb-2" />}

        <motion.div
          initial={{ scale: 0, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.1 }}
          className="text-6xl"
        >
          {emoji}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="glow-text mt-3 text-balance text-3xl font-extrabold tracking-tight text-wistaria sm:text-4xl"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="mt-2 text-balance text-base font-semibold text-muted-foreground sm:text-lg"
          >
            {subtitle}
          </motion.p>
        )}

        {footer && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mt-3 text-sm font-semibold text-cloud"
          >
            {footer}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

/** Pick a playful variant for a repeating event (e.g. consecutive wins). */
export function pickMessage<T>(pool: T[], index: number): T {
  return pool[Math.abs(index) % pool.length];
}

/* --------------------- login arrival celebration -------------------
 * Plays ON TOP of the destination page (not as a separate screen): Auth sets
 * the flag below and navigates instantly, this component (mounted once in
 * main.tsx) fades the welcome celebration in over the freshly loaded page,
 * then fades it back out — the dashboard is visible beneath the whole time,
 * so login and landing feel like the same tab. */

export const LOGIN_ARRIVAL_KEY = "glassmed-login-just-arrived";
/** Records the last successful login so we can greet returning users. */
export const LAST_LOGIN_KEY = "glassmed-last-login";

const WELCOME_NEW = {
  title: "Welcome to GlassMed! 🎉",
  subtitle: "So happy you're here — where medicine becomes energetic! 💙",
};

const WELCOME_BACK = {
  title: "Welcome back! 👋",
  subtitle: "Yayyy! Great to see you again — let's keep going! 💪",
};

/** Welcome celebration shown once right after sign-in/guest entry. */
export function LoginCelebration() {
  const location = useLocation();
  const [celebrating, setCelebrating] = useState(false);
  const [message, setMessage] = useState(WELCOME_NEW);

  // Auth sets the flag right before navigating to the destination. This runs on
  // every pathname change (and on mount for a stale flag) and fades the welcome
  // overlay in over the freshly loaded page, then fades it back out — the
  // destination is visible underneath the whole time.
  useEffect(() => {
    let flagged = false;
    try {
      flagged = sessionStorage.getItem(LOGIN_ARRIVAL_KEY) === "1";
    } catch {
      return;
    }
    if (!flagged) return;
    try {
      sessionStorage.removeItem(LOGIN_ARRIVAL_KEY);
    } catch {
      // Non-fatal — consumed below anyway.
    }
    // Decide new vs returning BEFORE recording this login (otherwise a
    // first-ever login would already look like a returning one), then record it
    // so the next login says "Welcome back!".
    let returning = false;
    try {
      returning = localStorage.getItem(LAST_LOGIN_KEY) !== null;
      localStorage.setItem(LAST_LOGIN_KEY, String(Date.now()));
    } catch {
      // localStorage unavailable — treat as a brand-new arrival.
    }
    // Defer a tick so the destination paints first; the veil then fades in
    // over the same screen instead of a separate login-success screen.
    const t = setTimeout(() => {
      setMessage(returning ? WELCOME_BACK : WELCOME_NEW);
      setCelebrating(true);
    }, 120);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {celebrating && (
        <CelebrationOverlay
          title={message.title}
          subtitle={message.subtitle}
          emoji="💙"
          footer="Your study space is ready — keep the momentum going!"
          durationMs={2400}
          onDone={() => setCelebrating(false)}
        />
      )}
    </AnimatePresence>
  );
}
