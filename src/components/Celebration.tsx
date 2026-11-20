import { Button } from "@/components/ui/button";
import { CatMascot } from "@/components/mascots";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router";
import {
  GUEST_LOGIN_KEY,
  LOGIN_ARRIVAL_KEY,
  WELCOME_SHOWN_KEY,
} from "@/lib/celebration-copy";
import { getPortalRoot } from "@/lib/portal";

// ------------------------------------------------------------------
//  Reusable copy / data
// ------------------------------------------------------------------

const WELCOME_WITH_GUEST = {
  title: "Welcome back, brilliant student!",
  subtitle:
    "Your study space is ready — your notes, streaks and progress are right where you left them.",
  emoji: "🌟",
  cta: "Start Studying",
};

// ------------------------------------------------------------------
//  Confetti burst
// ------------------------------------------------------------------

function ConfettiBurstImpl({ count = 20 }: { count?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    if (!ref.current || fired.current) return;
    fired.current = true;
    try {
      confetti({
        particleCount: count,
        spread: 60,
        origin: { y: 0.6 },
        startVelocity: 32,
        ticks: 180,
        gravity: 0.9,
        scalar: 0.9,
      });
    } catch {
      /* non-fatal */
    }
  }, [count]);

  return (
    <span
      ref={ref}
      style={{
        position: "relative",
        display: "inline-block",
        width: 0,
        height: 0,
      }}
      aria-hidden="true"
    />
  );
}

// ------------------------------------------------------------------
//  Mascot (re-exported for consumers who already import it here)
// ------------------------------------------------------------------

function Mascot({
  variant,
  size,
  className,
  mood,
}: {
  variant?: "panda" | "fox" | "rabbit" | "cat" | "bee";
  size?: number;
  className?: string;
  mood?: string;
}) {
  const m = (mood as import("@/components/mascots").CatMood) ?? undefined;
  switch (variant) {
    case "fox":
      return <CatMascot mood={m} size={size} className={className} />;
    default:
      return <CatMascot mood={m} size={size} className={className} />;
  }
}

// ------------------------------------------------------------------
//  Login celebration component (mounted by main.tsx)
// ------------------------------------------------------------------

export function LoginCelebration() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Spot an arrival flag and open the welcome card once per sign-in. The DOM
  // side effect (setting state) happens on the next frame, never synchronously
  // in the effect body.
  useEffect(() => {
    const arrival = readFlag(LOGIN_ARRIVAL_KEY);
    if (!arrival) return;
    clearFlag(LOGIN_ARRIVAL_KEY);

    const isGuest = readFlag(GUEST_LOGIN_KEY);
    clearFlag(GUEST_LOGIN_KEY);

    const shouldPlay = !readFlag(WELCOME_SHOWN_KEY) || isGuest;
    if (!shouldPlay) return;

    try {
      sessionStorage.setItem(WELCOME_SHOWN_KEY, "1");
    } catch {
      /* non-fatal */
    }

    const raf = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(raf);
  }, [location.pathname]);

  const close = () => setOpen(false);

  const handleStartStudying = () => {
    // Close first (AnimatePresence plays the fade-out), then go straight to
    // the dashboard. One click, no second tap needed.
    setOpen(false);
    void completeOnboarding().catch((error) => {
      console.warn("[GlassMed] Couldn't save onboarding:", error);
    });
    navigate("/dashboard");
  };

  // Render the portal unconditionally so AnimatePresence can play the
  // fade-out after `open` flips to false.
  return createPortal(
    <AnimatePresence>
      {open && (
        <LoginCelebrationOverlay
          key="welcome-back"
          onContinue={handleStartStudying}
          onDismiss={close}
        />
      )}
    </AnimatePresence>,
    getPortalRoot(),
  );
}

function LoginCelebrationOverlay({
  onContinue,
  onDismiss,
}: {
  onContinue: () => void;
  onDismiss: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{
        background: "rgba(8, 12, 30, 0.45)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={onDismiss}
      role="dialog"
      aria-modal="true"
      aria-labelledby="glassmed-welcome-title"
    >
      <motion.div
        className="relative w-full max-w-md rounded-3xl p-8 text-center"
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow:
            "0 24px 80px -20px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
        }}
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 text-5xl" aria-hidden="true">
          {WELCOME_WITH_GUEST.emoji}
        </div>
        <h2
          id="glassmed-welcome-title"
          className="text-xl font-extrabold tracking-tight text-white"
          style={{ textShadow: "0 1px 12px rgba(8, 12, 30, 0.45)" }}
        >
          {WELCOME_WITH_GUEST.title}
        </h2>
        <p
          className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/85"
          style={{ textShadow: "0 1px 10px rgba(8, 12, 30, 0.4)" }}
        >
          {WELCOME_WITH_GUEST.subtitle}
        </p>
        <Button
          type="button"
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#78A2D2] to-[#a2a2d0] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#78A2D2]/30 transition-transform hover:brightness-110 active:scale-[0.97]"
          onClick={onContinue}
        >
          {WELCOME_WITH_GUEST.cta}
        </Button>
        <button
          type="button"
          onClick={onDismiss}
          className="mt-3 w-full rounded-xl px-4 py-2 text-xs font-semibold text-white/60 transition-colors hover:text-white/90"
        >
          Maybe later
        </button>
      </motion.div>
    </motion.div>
  );
}

// ------------------------------------------------------------------
//  Public API
// ------------------------------------------------------------------

export { ConfettiBurstImpl as ConfettiBurst, Mascot };

// ------------------------------------------------------------------
//  Helpers (kept small so they don't pull in anything new)
// ------------------------------------------------------------------

function readFlag(key: string): string | null {
  try {
    return sessionStorage.getItem(key) ?? localStorage.getItem(key);
  } catch {
    return null;
  }
}

function clearFlag(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch {
    /* non-fatal */
  }
  try {
    localStorage.removeItem(key);
  } catch {
    /* non-fatal */
  }
}

async function completeOnboarding(): Promise<void> {
  // Stub — expand only if the backend exposes an onboarding endpoint.
}
