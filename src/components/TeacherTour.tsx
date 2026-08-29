import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useNavigate } from "react-router";
import { RabbitMascot } from "@/components/mascots";

/* ------------------------------------------------------------------ */
/* Tour persistence                                                    */
/* ------------------------------------------------------------------ */

const TOUR_DONE_KEY = "glassmed-teacher-tour-done";

export function isTourDone(): boolean {
  try {
    return localStorage.getItem(TOUR_DONE_KEY) === "1";
  } catch {
    return true; // storage unavailable — don't show tour
  }
}

export function markTourDone(): void {
  try {
    localStorage.setItem(TOUR_DONE_KEY, "1");
  } catch {
    /* storage unavailable */
  }
}

/** Allow Settings to reset the tour for re-testing. */
export function resetTour(): void {
  try {
    localStorage.removeItem(TOUR_DONE_KEY);
  } catch {
    /* storage unavailable */
  }
}

/* ------------------------------------------------------------------ */
/* Tour steps                                                          */
/* ------------------------------------------------------------------ */

interface TourStep {
  /** Position of the speech bubble relative to the viewport */
  position: "bottom-center" | "bottom-right" | "bottom-left" | "center";
  /** Title in the speech bubble */
  title: string;
  /** Body text */
  message: string;
  /** Optional list of shortcuts to display */
  shortcuts?: { shortcut: string; name: string; emoji: string }[];
}

const TOUR_STEPS: TourStep[] = [
  {
    position: "center",
    title: "Welcome! I'm Professor Rabbit 🐰",
    message:
      "I'll be your study guide! Let me show you around the app so you can start learning right away. Tap Next to begin!",
  },
  {
    position: "bottom-center",
    title: "Your Study Hubs 📚",
    message:
      "These 4 boxes are your main study hubs! Tap any to begin — Flashcards for quick review, Basics for deep learning, Game for fun practice, and Research for clinical topics.",
  },
  {
    position: "bottom-right",
    title: "Study Music Player 🎵",
    message:
      "Need focus? This music player floats at the bottom of every screen. It plays lo-fi beats while you study — and never stops when you switch pages!",
  },
  {
    position: "bottom-center",
    title: "Spaced Repetition 🧠",
    message:
      "I'll remind you to review flashcards right before you forget! The more you get right, the longer I wait. It's science — and it works!",
  },
  {
    position: "center",
    title: "Special Day Surprise 🎁",
    message:
      "Got a special day coming up? There's a hidden gift box somewhere in the app. Click it ON your special day for a surprise! I won't tell you what it is yet…",
  },
  {
    position: "bottom-center",
    title: "Smart Shortcuts ⚡",
    message:
      "See this little code on the topic card? Type 'CS' in the search bar to jump straight to this topic instantly! Each card has its own shortcut code — it's the fastest way to review.\u2728",
  },
  {
    position: "center",
    title: "You're All Set! 🎉",
    message:
      "That's it! Start with the Flashcards or explore the Basics. I'll be here if you need help. Happy studying, future doctor!",
  },
];

/* ------------------------------------------------------------------ */
/* Step indicator dots                                                 */
/* ------------------------------------------------------------------ */

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`block rounded-full transition-all duration-300 ${
            i === current
              ? "h-2 w-2 bg-wistaria"
              : i < current
                ? "h-2 w-2 bg-wistaria/40"
                : "h-1.5 w-1.5 bg-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Teacher Tour                                                        */
/* ------------------------------------------------------------------ */

interface TeacherTourProps {
  /** Whether the tour overlay is visible (controlled by parent) */
  open: boolean;
  /** Called when the tour is dismissed or completed */
  onClose: () => void;
}

export function TeacherTour({ open, onClose }: TeacherTourProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  // Reset step when tour re-opens
  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  const current = TOUR_STEPS[step];
  const isLast = step === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      markTourDone();
      onClose();
      return;
    }
    setStep((s) => s + 1);
  };

  const handleClose = () => {
    markTourDone();
    onClose();
  };

  if (!open) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* ── Speech Bubble ── */}
          <motion.div
            className={`fixed z-[201] flex max-w-sm flex-col items-center gap-3 ${
              current.position === "center"
                ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                : current.position === "bottom-right"
                  ? "bottom-28 right-4 sm:right-8"
                  : current.position === "bottom-left"
                    ? "bottom-28 left-4 sm:left-8"
                    : "bottom-28 left-1/2 -translate-x-1/2"
            }`}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 340, damping: 26 }}
          >
            {/* Mascot + pointer stick */}
            <div className="relative">
              <RabbitMascot mood="happy" size={64} />
              {/* Teacher pointer stick */}
              <div
                className="absolute -right-3 bottom-1 text-lg"
                style={{ transform: "rotate(-25deg)" }}
              >
                🪄
              </div>
            </div>

            {/* Bubble card */}
            <div className="glass-strong shine relative rounded-3xl p-5 text-center shadow-[0_20px_50px_-10px_rgba(10,14,45,0.7)]">
              {/* X close button */}
              <button
                onClick={handleClose}
                className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                style={{ cursor: "pointer" }}
                aria-label="Close tour"
              >
                <X className="size-4" />
              </button>

              <h3 className="pr-6 text-base font-extrabold text-wistaria">
                {current.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                {current.message}
              </p>

              {/* Shortcuts grid */}
              {current.shortcuts && (
                <div className="mt-3 grid grid-cols-1 gap-1.5">
                  {current.shortcuts.map((sc) => (
                    <div
                      key={sc.shortcut}
                      className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-1.5 text-left"
                    >
                      <span className="font-mono text-xs font-bold text-cloud">
                        {sc.emoji} {sc.shortcut}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        → {sc.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 flex items-center justify-between gap-3">
                <StepDots current={step} total={TOUR_STEPS.length} />
                <div className="flex gap-2">
                  <button
                    onClick={handleClose}
                    className="rounded-xl px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                    style={{ cursor: "pointer" }}
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleNext}
                    className="rounded-xl bg-wistaria px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-wistaria/30 transition-all hover:bg-wistaria/90 hover:shadow-wistaria/50 active:scale-[0.97]"
                    style={{ cursor: "pointer" }}
                  >
                    {isLast ? "Let's Go! 🚀" : "Next →"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
