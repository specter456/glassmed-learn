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
  // Escape closes the card, so it can never trap someone in the overlay.
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onDismiss]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        zIndex: 1000,
        background: "rgba(8, 12, 30, 0.55)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
        pointerEvents: "auto",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      onClick={onDismiss}
      role="dialog"
      aria-modal="true"
      aria-labelledby="glassmed-welcome-title"
    >
      <motion.div
        className="relative text-center"
        style={{
          width: "90%",
          maxWidth: 400,
          borderRadius: 24,
          background: "rgba(30, 30, 40, 0.85)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          padding: 28,
          color: "#ffffff",
          pointerEvents: "auto",
          boxShadow:
            "0 24px 80px -20px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        }}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="mb-3 text-5xl"
          aria-hidden="true"
          style={{ position: "relative" }}
        >
          {WELCOME_WITH_GUEST.emoji}
        </div>
        <h2
          id="glassmed-welcome-title"
          className="text-xl font-extrabold tracking-tight"
          style={{ position: "relative", color: "#ffffff" }}
        >
          {WELCOME_WITH_GUEST.title}
        </h2>
        <p
          className="mx-auto mt-2 max-w-sm text-sm leading-relaxed"
          style={{ position: "relative", color: "rgba(255, 255, 255, 0.8)" }}
        >
          {WELCOME_WITH_GUEST.subtitle}
        </p>
        <Button
          type="button"
          onClick={onContinue}
          className="mt-6 w-full rounded-xl px-5 text-sm font-bold transition-transform hover:brightness-110 active:scale-[0.97]"
          style={{
            position: "relative",
            minHeight: 44,
            color: "#ffffff",
            background: "linear-gradient(90deg, #78A2D2 0%, #a2a2d0 100%)",
            boxShadow: "0 10px 24px -10px rgba(120, 162, 210, 0.9)",
          }}
        >
          {WELCOME_WITH_GUEST.cta}
        </Button>
        <button
          type="button"
          onClick={onDismiss}
          className="mt-2 w-full rounded-xl px-4 py-2 text-xs font-semibold transition-colors"
          style={{ position: "relative", color: "rgba(255, 255, 255, 0.65)" }}
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
