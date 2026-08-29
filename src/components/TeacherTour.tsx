import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { BeeMascot } from "@/components/mascots";

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
  /** Highlight target selector (CSS) — null = no highlight ring */
  target: string | null;
  /** Position of the speech bubble relative to the viewport */
  position: "bottom-center" | "bottom-right" | "bottom-left" | "center";
  /** Title in the speech bubble */
  title: string;
  /** Body text */
  message: string;
  /** Optional list of shortcuts to display */
  shortcuts?: { shortcut: string; name: string; emoji: string }[];
  /** Optional navigation path after completing this step */
  navigateTo?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    target: null,
    position: "center",
    title: "Welcome to MediPro! 🐝",
    message:
      "Hi there! I'm Professor Bee, your study guide. Let me show you around the app so you can start learning right away!",
  },
  {
    target: ".glass-panel.shine.group",
    position: "bottom-center",
    title: "Your Study Hubs 📚",
    message:
      "These 4 boxes are your main study hubs. Flashcards for quick review, Basics for deep learning, Game for fun practice, and Research for clinical topics.",
  },
  {
    target: "nav[aria-label='Primary']",
    position: "bottom-center",
    title: "Navigation Bar 🧭",
    message:
      "Use the bottom bar to jump between Home, Diagrams, Voice Notes, and Settings. It's always here — no matter where you are!",
  },
  {
    target: null,
    position: "bottom-right",
    title: "Pro Tip: Smart Shortcuts ⚡",
    message:
      "Type 2-letter shortcuts in the search bar to jump to topics instantly!",
    shortcuts: [
      { shortcut: "CS", name: "Cardiac Cycle", emoji: "❤️" },
      { shortcut: "AP", name: "Action Potential", emoji: "⚡" },
      { shortcut: "BP", name: "Brachial Plexus", emoji: "🧠" },
      { shortcut: "KC", name: "Krebs Cycle", emoji: "🔄" },
      { shortcut: "MC", name: "Muscle Contraction", emoji: "💪" },
    ],
  },
  {
    target: null,
    position: "center",
    title: "You're All Set! 🎉",
    message:
      "That's it! Start with the Flashcards or explore the Basics. I'll be here if you need help. Happy studying!",
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
  /** Force-show the tour (e.g. from Settings reset) */
  forceShow?: boolean;
  /** Called when the tour is dismissed or completed */
  onDismiss?: () => void;
}

export function TeacherTour({ forceShow = false, onDismiss }: TeacherTourProps) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  // Decide whether to show the tour on mount
  useEffect(() => {
    if (forceShow) {
      setVisible(true);
      return;
    }
    if (!isTourDone()) {
      // Small delay so the page renders first
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, [forceShow]);

  const current = TOUR_STEPS[step];
  const isLast = step === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      markTourDone();
      setVisible(false);
      onDismiss?.();
      return;
    }
    // Navigate if the step requests it
    if (current.navigateTo) {
      navigate(current.navigateTo);
    }
    setStep((s) => s + 1);
  };

  const handleSkip = () => {
    markTourDone();
    setVisible(false);
    onDismiss?.();
  };

  if (!visible) return null;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSkip}
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
            {/* Mascot + pointer */}
            <div className="relative">
              <BeeMascot mood="happy" size={64} />
              {/* Pointer stick */}
              <div className="absolute -right-2 bottom-2 rotate-[-30deg] text-lg">
                🪄
              </div>
            </div>

            {/* Bubble card */}
            <div className="glass-strong shine rounded-3xl p-5 text-center shadow-[0_20px_50px_-10px_rgba(10,14,45,0.7)]">
              <h3 className="text-base font-extrabold text-wistaria">
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
                    onClick={handleSkip}
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
