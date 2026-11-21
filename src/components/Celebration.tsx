import { Button } from "@/components/ui/button";
import { CatMascot } from "@/components/mascots";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router";
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import {
  GUEST_LOGIN_KEY,
  LOGIN_ARRIVAL_KEY,
  WELCOME_FIRST_TIME,
  WELCOME_RETURNING,
  WELCOME_RETURNING_AT,
  WELCOME_SILENT_FROM,
  type WelcomeCopy,
} from "@/lib/celebration-copy";
import { getPortalRoot } from "@/lib/portal";

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

/** Which card is up, and whether the arrival was a guest. */
type ArrivalCard = { copy: WelcomeCopy; guest: boolean };

export function LoginCelebration() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useConvexAuth();
  // The signed-in profile carries `loginCount`, the card selector for email
  // students. Guests never read it — anonymous rows have no count.
  const profile = useQuery(api.users.currentUser);
  const acknowledgeWelcome = useMutation(api.users.acknowledgeWelcome);

  const [card, setCard] = useState<ArrivalCard | null>(null);
  // An email arrival is waiting for its profile before we can pick a card.
  const [awaitingProfile, setAwaitingProfile] = useState(false);

  // 1. Read the arrival flag the auth screen set just before navigating.
  //    State updates happen on the next animation frame, never synchronously
  //    in the effect body.
  useEffect(() => {
    const arrival = readFlag(LOGIN_ARRIVAL_KEY);
    if (!arrival) return;
    clearFlag(LOGIN_ARRIVAL_KEY);

    const isGuest = readFlag(GUEST_LOGIN_KEY) === "1";
    clearFlag(GUEST_LOGIN_KEY);

    const raf = requestAnimationFrame(() => {
      if (isGuest) {
        // Guests have no history to come "back" to: always a fresh Welcome.
        setCard({ copy: WELCOME_FIRST_TIME, guest: true });
      } else {
        setAwaitingProfile(true);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [location.pathname]);

  // 2. Email arrivals: loginCount picks the card.
  //      1st login (unset or 1) → full Welcome
  //      2nd login (2)          → "Welcome back!"
  //      3rd login onwards      → no card at all
  useEffect(() => {
    if (!awaitingProfile || !isAuthenticated || !profile) return;

    const count = profile.loginCount ?? 0;
    const next: ArrivalCard | null =
      count >= WELCOME_SILENT_FROM
        ? null
        : {
            copy:
              count === WELCOME_RETURNING_AT
                ? WELCOME_RETURNING
                : WELCOME_FIRST_TIME,
            guest: false,
          };

    const raf = requestAnimationFrame(() => {
      setAwaitingProfile(false);
      setCard(next);
    });
    return () => cancelAnimationFrame(raf);
  }, [awaitingProfile, isAuthenticated, profile]);

  const dismiss = () => setCard(null);

  const handleContinue = () => {
    const wasGuest = card?.guest ?? false;
    // Close first (AnimatePresence plays the fade-out), then go straight to
    // the dashboard. One click, no second tap needed.
    setCard(null);
    if (!wasGuest) {
      // Email students only: advance the counter so the card is gone by the
      // third sign-in. The mutation also marks onboarding complete.
      void acknowledgeWelcome().catch((error) => {
        console.warn("[GlassMed] Couldn't save login count:", error);
      });
    }
    navigate("/dashboard");
  };

  // The portal renders unconditionally so AnimatePresence can play the
  // fade-out after `card` clears.
  return createPortal(
    <AnimatePresence>
      {card && (
        <LoginCelebrationOverlay
          key={card.copy.title}
          copy={card.copy}
          onContinue={handleContinue}
          onDismiss={dismiss}
        />
      )}
    </AnimatePresence>,
    getPortalRoot(),
  );
}

function LoginCelebrationOverlay({
  copy,
  onContinue,
  onDismiss,
}: {
  copy: WelcomeCopy;
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
          {copy.emoji}
        </div>
        <h2
          id="glassmed-welcome-title"
          className="text-xl font-extrabold tracking-tight"
          style={{ position: "relative", color: "#ffffff" }}
        >
          {copy.title}
        </h2>
        <p
          className="mx-auto mt-2 max-w-sm text-sm leading-relaxed"
          style={{ position: "relative", color: "rgba(255, 255, 255, 0.8)" }}
        >
          {copy.subtitle}
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
          {copy.cta}
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
