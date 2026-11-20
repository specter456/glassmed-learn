import { Button } from "@/components/ui/button";
import { CatMascot } from "@/components/mascots";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router";
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
    "Your study space is ready — pick up where you left off and keep\nthe momentum going. We've brought back your notes, streaks and progress.",
  emoji: "🌟",
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
  const [open, setOpen] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<(() => void) | null>(null);
  const closingRef = useRef(false);

  // Keep the latest trigger callback available to effects without
  // re-running them when the ref is refreshed.
  useEffect(() => {
    triggerRef.current = () => {
      if (closingRef.current) return;
      closingRef.current = true;
      openTimerRef.current = setTimeout(() => {
        closingRef.current = false;
        setOpen(true);
      }, 30);
    };
  }, []);

  // Spot an arrival flag and open the celebration once per sign-in.
  useEffect(() => {
    const arrival = readFlag(LOGIN_ARRIVAL_KEY);
    if (!arrival) return;
    clearFlag(LOGIN_ARRIVAL_KEY);

    const isGuest = readFlag(GUEST_LOGIN_KEY);
    clearFlag(GUEST_LOGIN_KEY);

    const shouldPlay = !readFlag(WELCOME_SHOWN_KEY) || isGuest;
    if (!shouldPlay) return;

    triggerRef.current?.();
  }, [location.pathname]);

  // Present the overlay after it has settled in.
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      setOpen(false);
      setCelebrating(true);
    }, 280);
    return () => clearTimeout(timer);
  }, [open]);

  // Once the celebration overlay has animated in, clear the open gate.
  useEffect(() => {
    if (!celebrating) return;
    const timer = setTimeout(() => {
      setOpen(false);
      setCelebrating(false);

      try {
        completeOnboarding().catch((error) => {
          console.warn(
            "[GlassMed] Couldn't save onboarding:",
            error,
          );
        });
      } catch {
        /* non-fatal */
      }
    }, 2200);
    return () => clearTimeout(timer);
  }, [celebrating]);

  if (!open && !celebrating) return null;

  return createPortal(
    <AnimatePresence>
      {open && <LoginCelebrationOverlay open={open} />}
      {celebrating && <LoginCelebrationOverlay open={celebrating} />}
    </AnimatePresence>,
    getPortalRoot(),
  );
}

function LoginCelebrationOverlay({
  open,
}: {
  open: boolean;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const onEndRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    onEndRef.current = () => {
      /* no-op — close is driven by the parent's open state */
    };
  }, [open]);

  useEffect(() => {
    if (!overlayRef.current) return;
    const node = overlayRef.current;
    const handler = () => onEndRef.current?.();
    node.addEventListener("animationend", handler);
    return () => node.removeEventListener("animationend", handler);
  }, [open]);

  return (
    <motion.div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: open ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <motion.div
        className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm shadow-2xl"
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: open ? 1 : 0.94, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="mb-3 text-5xl" aria-hidden="true">
          🌟
        </div>
        <h3 className="text-xl font-bold text-white">
          {WELCOME_WITH_GUEST.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-white/80">
          {WELCOME_WITH_GUEST.subtitle}
        </p>
        <p className="mt-3 text-xs text-white/50">
          Your study space is ready — keep the momentum going!
        </p>
        <Button
          className="mt-6 w-full rounded-xl bg-wistaria px-5 text-wistaria shadow-lg shadow-wistaria/20 transition-transform active:scale-95"
          size="sm"
          onClick={() => {
            /* parent-driven close */
          }}
        >
          <X className="mr-2 h-4 w-4" />
          Close
        </Button>
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
