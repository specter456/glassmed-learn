import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { RabbitMascot } from "@/components/mascots";

/* ------------------------------------------------------------------ */
/* Tour persistence                                                    */
/* ------------------------------------------------------------------ */

const TOUR_DONE_KEY = "glassmed-teacher-tour-done";

export function isTourDone(): boolean {
  try {
    return localStorage.getItem(TOUR_DONE_KEY) === "1";
  } catch {
    return true;
  }
}

export function markTourDone(): void {
  try {
    localStorage.setItem(TOUR_DONE_KEY, "1");
  } catch {
    /* storage unavailable */
  }
}

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
  /** data-tour-target attribute value on the element to highlight */
  targetId?: string;
  /** Where to place the speech bubble when there's no target */
  position: "bottom-center" | "center";
  title: string;
  message: string;
  /** Scroll to this element before measuring (if targetId is below the fold) */
  scrollTarget?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    position: "center",
    title: "Welcome! I'm Professor Rabbit 🐰",
    message:
      "I'll be your study guide! Let me show you around the app so you can start learning right away. Tap Next to begin!",
  },
  {
    targetId: "modules",
    position: "bottom-center",
    title: "Your Study Hubs 📚",
    message:
      "These 4 boxes are your main study hubs! Flashcards for quick review, Basics for deep learning, Game for fun practice, and Research for clinical topics.",
  },
  {
    targetId: "search",
    position: "bottom-center",
    title: "Smart Search ⚡",
    message:
      "Type any topic name to find it instantly. You can also use shortcut codes — look for the [CS], [AP] badges on the topic cards below!",
  },
  {
    targetId: "basics-first-path",
    position: "bottom-center",
    scrollTarget: "basics-first-path",
    title: "Your Learning Path 🧠",
    message:
      "This is your Basics-First Path — the most important topics for first-year students. I'll remind you to review flashcards right before you forget!",
  },
  {
    position: "center",
    title: "Special Day Surprise 🎁",
    message:
      "Got a special day coming up? There's a hidden gift box somewhere in the app. Click it ON your special day for a surprise! 🎁",
  },
  {
    position: "center",
    title: "You're All Set! 🎉",
    message:
      "Start with Flashcards or explore the Basics. Happy studying, future doctor! 🚀",
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
/* Spotlight bounding box                                              */
/* ------------------------------------------------------------------ */

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const SPOTLIGHT_PADDING = 10;

/* ------------------------------------------------------------------ */
/* Teacher Tour                                                        */
/* ------------------------------------------------------------------ */

interface TeacherTourProps {
  open: boolean;
  onClose: () => void;
  rootSelector?: string;
}

export function TeacherTour({ open, onClose, rootSelector }: TeacherTourProps) {
  const [step, setStep] = useState(0);
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);
  const measureTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const scrollTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Reset step when tour re-opens
  useEffect(() => {
    if (open) {
      setStep(0);
      setSpotlight(null);
    }
  }, [open]);

  const current = TOUR_STEPS[step];
  const isLast = step === TOUR_STEPS.length - 1;
  const isFirst = step === 0;

  /** Find a tour target element in the DOM */
  const findTarget = useCallback(
    (targetId?: string): HTMLElement | null => {
      if (!targetId) return null;
      const root = rootSelector
        ? document.querySelector(rootSelector)
        : document;
      return root?.querySelector(
        `[data-tour-target="${targetId}"]`,
      ) as HTMLElement | null;
    },
    [rootSelector],
  );

  /** Measure the target element's bounding rect and set spotlight */
  const measureTarget = useCallback(
    (targetId?: string) => {
      if (measureTimer.current) clearTimeout(measureTimer.current);

      // Delay measurement to ensure scroll and animations have settled
      measureTimer.current = setTimeout(() => {
        const el = findTarget(targetId);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Only set spotlight if element is within or near the viewport
          if (rect.height > 0 && rect.width > 0) {
            setSpotlight({
              top: rect.top - SPOTLIGHT_PADDING,
              left: rect.left - SPOTLIGHT_PADDING,
              width: rect.width + SPOTLIGHT_PADDING * 2,
              height: rect.height + SPOTLIGHT_PADDING * 2,
            });
          } else {
            setSpotlight(null);
          }
        } else {
          setSpotlight(null);
        }
      }, 200); // 200ms — enough for scrollIntoView smooth animation to settle
    },
    [findTarget],
  );

  // Scroll target into view, then measure after scroll settles
  useEffect(() => {
    if (!open) return;

    // Clear any pending timers
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    if (measureTimer.current) clearTimeout(measureTimer.current);

    if (current.targetId) {
      // First scroll the element into view
      const el = findTarget(current.scrollTarget ?? current.targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      // Measure after scroll animation + settle time
      measureTarget(current.targetId);
    } else {
      // No target — clear spotlight (for center-positioned steps)
      setSpotlight(null);
      // Scroll to top for center steps
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return () => {
      if (measureTimer.current) clearTimeout(measureTimer.current);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, [open, current.targetId, current.scrollTarget, measureTarget, findTarget]);

  // Re-measure on resize
  useEffect(() => {
    if (!open) return;
    const onResize = () => measureTarget(current.targetId);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open, current.targetId, measureTarget]);

  const handleNext = () => {
    if (isLast) {
      markTourDone();
      onClose();
      return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (isFirst) return;
    setStep((s) => s - 1);
  };

  const handleClose = () => {
    markTourDone();
    onClose();
  };

  if (!open) return null;

  // --- Dynamic bubble positioning ---
  const vw = typeof window !== "undefined" ? window.innerWidth : 1024;
  const vh = typeof window !== "undefined" ? window.innerHeight : 768;
  const BUBBLE_MAX_W = Math.min(360, vw - 32);
  const BUBBLE_EST_H = 280;
  const MARGIN = 12;

  const clampedBubbleStyle = useMemo((): React.CSSProperties => {
    if (!spotlight) {
      // No target — center on screen
      return {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: BUBBLE_MAX_W,
        maxWidth: BUBBLE_MAX_W,
      };
    }

    const targetCenterX = spotlight.left + spotlight.width / 2;
    const spaceBelow = vh - (spotlight.top + spotlight.height);
    const spaceAbove = spotlight.top;

    // Prefer placing below, but flip above if not enough space
    const placeBelow =
      spaceBelow >= BUBBLE_EST_H + MARGIN || spaceBelow >= spaceAbove;

    let top: number;
    if (placeBelow) {
      top = spotlight.top + spotlight.height + MARGIN;
    } else {
      top = Math.max(MARGIN, spotlight.top - BUBBLE_EST_H - MARGIN);
    }

    // Clamp top so bubble never escapes viewport
    top = Math.max(MARGIN, Math.min(top, vh - BUBBLE_EST_H - MARGIN));

    // Horizontal: center on target, clamp to viewport
    let left = targetCenterX;
    const halfBubble = BUBBLE_MAX_W / 2;
    if (left - halfBubble < MARGIN) left = MARGIN + halfBubble;
    if (left + halfBubble > vw - MARGIN) left = vw - MARGIN - halfBubble;

    return {
      position: "fixed",
      top,
      left,
      transform: "translateX(-50%)",
      width: BUBBLE_MAX_W,
      maxWidth: BUBBLE_MAX_W,
    };
  }, [spotlight, vw, vh, BUBBLE_MAX_W, BUBBLE_EST_H, MARGIN]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* ── Dark overlay ── */}
          <motion.div
            className="fixed inset-0"
            style={{ zIndex: 200 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
          >
            {/* Spotlight cutout in the overlay */}
            <div
              className="absolute inset-0 transition-all duration-500"
              style={{
                background: spotlight
                  ? `radial-gradient(ellipse ${spotlight.width / 2 + 20}px ${spotlight.height / 2 + 20}px at ${spotlight.left + spotlight.width / 2}px ${spotlight.top + spotlight.height / 2}px, transparent 0%, transparent 65%, rgba(0,0,0,0.6) 100%)`
                  : "rgba(0,0,0,0.6)",
                backdropFilter: spotlight ? "none" : "blur(3px)",
              }}
            />
          </motion.div>

          {/* ── Neon spotlight glow border ── */}
          {spotlight && (
            <motion.div
              key={`spotlight-${step}`}
              className="pointer-events-none fixed"
              style={{
                zIndex: 201,
                top: spotlight.top,
                left: spotlight.left,
                width: spotlight.width,
                height: spotlight.height,
                borderRadius: 16,
                border: "2.5px solid rgba(120,162,210,0.85)",
                boxShadow: `
                  0 0 20px 6px rgba(120,162,210,0.4),
                  0 0 50px 12px rgba(120,162,210,0.15),
                  inset 0 0 15px 3px rgba(120,162,210,0.12)
                `,
                transition:
                  "top 0.5s cubic-bezier(0.4,0,0.2,1), left 0.5s cubic-bezier(0.4,0,0.2,1), width 0.5s cubic-bezier(0.4,0,0.2,1), height 0.5s cubic-bezier(0.4,0,0.2,1)",
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35 }}
            />
          )}

          {/* ── Speech Bubble + Rabbit ── */}
          <motion.div
            key={`bubble-${step}`}
            className="fixed flex flex-col items-center gap-2"
            style={{ ...clampedBubbleStyle, zIndex: 202 }}
            initial={{ opacity: 0, y: 14, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 26 }}
          >
            {/* Mascot */}
            <div className="relative">
              <RabbitMascot mood="happy" size={44} />
              <div
                className="absolute -right-2 bottom-0 text-base"
                style={{ transform: "rotate(-20deg)" }}
              >
                🪄
              </div>
            </div>

            {/* Bubble card */}
            <div
              className="glass-strong shine relative w-full rounded-3xl p-4 text-center shadow-[0_20px_50px_-10px_rgba(10,14,45,0.7)] sm:p-5"
              style={{ width: BUBBLE_MAX_W }}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute right-2.5 top-2.5 flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                style={{ cursor: "pointer", minWidth: 44, minHeight: 44 }}
                aria-label="Close tour"
              >
                <X className="size-4" />
              </button>

              <h3
                className="pr-6 font-extrabold text-wistaria"
                style={{
                  fontSize: "clamp(0.875rem, 0.8rem + 0.3vw, 1.1rem)",
                }}
              >
                {current.title}
              </h3>
              <p
                className="mt-2 leading-relaxed text-foreground/90"
                style={{
                  fontSize: "clamp(0.8rem, 0.75rem + 0.25vw, 0.9rem)",
                }}
              >
                {current.message}
              </p>

              {/* Actions */}
              <div className="mt-4 flex items-center justify-between gap-2">
                <StepDots current={step} total={TOUR_STEPS.length} />
                <div className="flex gap-1.5">
                  {!isFirst && (
                    <button
                      onClick={handleBack}
                      className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                      style={{ cursor: "pointer" }}
                      aria-label="Previous step"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                  )}
                  <button
                    onClick={handleClose}
                    className="min-h-[44px] min-w-[44px] rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                    style={{ cursor: "pointer" }}
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex min-h-[44px] min-w-[44px] items-center gap-1 rounded-xl bg-wistaria px-4 py-2 text-xs font-bold text-white shadow-lg shadow-wistaria/30 transition-all hover:bg-wistaria/90 hover:shadow-wistaria/50 active:scale-[0.97]"
                    style={{ cursor: "pointer" }}
                  >
                    {isLast ? (
                      "Let's Go! 🚀"
                    ) : (
                      <>
                        Next
                        <ChevronRight className="size-3.5" />
                      </>
                    )}
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
