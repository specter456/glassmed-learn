import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
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
/* Tour steps — each with a targetId that matches a data-tour-target   */
/* ------------------------------------------------------------------ */

interface TourStep {
  /** data-tour-target attribute value on the element to highlight */
  targetId?: string;
  /** Where to place the speech bubble when there's no target */
  position: "bottom-center" | "bottom-right" | "bottom-left" | "center";
  title: string;
  message: string;
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
    targetId: "modules",
    position: "bottom-center",
    title: "Your Study Hubs 📚",
    message:
      "These 4 boxes are your main study hubs! Tap any to begin — Flashcards for quick review, Basics for deep learning, Game for fun practice, and Research for clinical topics.",
  },
  {
    targetId: "search",
    position: "bottom-center",
    title: "Smart Search ⚡",
    message:
      "Type any topic name to find it instantly. You can also type shortcut codes like 'CS' for Cardiac Cycle or 'AP' for Action Potential — look for the badge codes on the topic cards below!",
  },
  {
    targetId: "basics-first-path",
    position: "bottom-center",
    title: "Spaced Repetition 🧠",
    message:
      "This is your Basics-First Path — the most important topics for first-year students. I'll remind you to review flashcards right before you forget! The more you get right, the longer I wait. It's science — and it works!",
  },
  {
    position: "center",
    title: "Special Day Surprise 🎁",
    message:
      "Got a special day coming up? There's a hidden gift box somewhere in the app. Click it ON your special day for a surprise! I won't tell you what it is yet…",
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
/* Spotlight bounding box                                              */
/* ------------------------------------------------------------------ */

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/** Offset the spotlight outward so it frames the element nicely */
const SPOTLIGHT_PADDING = 8;

/* ------------------------------------------------------------------ */
/* Teacher Tour                                                        */
/* ------------------------------------------------------------------ */

interface TeacherTourProps {
  open: boolean;
  onClose: () => void;
  /** Optional root selector to limit element lookup scope */
  rootSelector?: string;
}

export function TeacherTour({ open, onClose, rootSelector }: TeacherTourProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);
  const measureTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Reset step when tour re-opens
  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  const current = TOUR_STEPS[step];
  const isLast = step === TOUR_STEPS.length - 1;

  // Measure the target element's bounding rect
  const measureTarget = useCallback(
    (targetId?: string) => {
      if (!targetId) {
        setSpotlight(null);
        return;
      }
      // Small delay so the DOM has settled after animation
      if (measureTimer.current) clearTimeout(measureTimer.current);
      measureTimer.current = setTimeout(() => {
        const root = rootSelector ? document.querySelector(rootSelector) : document;
        const el = root?.querySelector(`[data-tour-target="${targetId}"]`);
        if (el) {
          const rect = el.getBoundingClientRect();
          setSpotlight({
            top: rect.top - SPOTLIGHT_PADDING,
            left: rect.left - SPOTLIGHT_PADDING,
            width: rect.width + SPOTLIGHT_PADDING * 2,
            height: rect.height + SPOTLIGHT_PADDING * 2,
          });
        } else {
          setSpotlight(null);
        }
      }, 50);
    },
    [rootSelector],
  );

  // Measure on step change and on resize
  useEffect(() => {
    if (!open) return;
    measureTarget(current.targetId);

    const onResize = () => measureTarget(current.targetId);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (measureTimer.current) clearTimeout(measureTimer.current);
    };
  }, [open, current.targetId, measureTarget]);

  // Scroll the target into view if needed
  useEffect(() => {
    if (!open || !current.targetId) return;
    const root = rootSelector ? document.querySelector(rootSelector) : document;
    const el = root?.querySelector(`[data-tour-target="${current.targetId}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [open, current.targetId, rootSelector]);

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

  // Bubble dimensions (approximate, used for viewport collision checks)
  const BUBBLE_MAX_W = 384; // max-w-sm ≈ 384px
  const BUBBLE_EST_H = 320; // rough estimate of bubble height
  const MARGIN = 16; // min gap from viewport edges

  // Fully dynamic bubble positioning — never goes off-screen
  const getBubbleStyle = (): React.CSSProperties => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (!spotlight) {
      // No target — center on screen (used for welcome/closing steps)
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        maxWidth: `min(${BUBBLE_MAX_W}px, ${vw - MARGIN * 2}px)`,
      };
    }

    const targetCenterX = spotlight.left + spotlight.width / 2;
    const spaceBelow = vh - (spotlight.top + spotlight.height);
    const spaceAbove = spotlight.top;
    const spaceRight = vw - (spotlight.left + spotlight.width);
    const spaceLeft = spotlight.left;

    // Decide vertical placement: above or below
    const placeBelow = spaceBelow >= BUBBLE_EST_H + MARGIN || spaceBelow >= spaceAbove;

    let top: number | string;
    if (placeBelow) {
      top = spotlight.top + spotlight.height + MARGIN;
    } else {
      // Place above the target
      const desiredTop = spotlight.top - BUBBLE_EST_H - MARGIN;
      top = Math.max(MARGIN, desiredTop);
    }

    // Decide horizontal: try center, then shift left or right to stay in view
    const halfBubble = Math.min(BUBBLE_MAX_W / 2, (vw - MARGIN * 2) / 2);
    let left = targetCenterX;
    let translateX = "-50%";

    // Check if centered bubble overflows right edge
    if (targetCenterX + halfBubble > vw - MARGIN) {
      left = vw - MARGIN - halfBubble;
    }
    // Check if centered bubble overflows left edge
    if (targetCenterX - halfBubble < MARGIN) {
      left = MARGIN + halfBubble;
    }

    // If the target is near the left or right edge, prefer aligning to that edge
    if (spaceRight < 120 && spaceLeft > spaceRight) {
      // Target is near right edge — align bubble to right of viewport
      left = Math.min(vw - MARGIN - halfBubble, targetCenterX + spotlight.width / 2 - halfBubble + 20);
      if (left < MARGIN + halfBubble) left = MARGIN + halfBubble;
    } else if (spaceLeft < 120) {
      // Target is near left edge — align bubble to left of viewport
      left = Math.max(MARGIN + halfBubble, targetCenterX - spotlight.width / 2 - 20 + halfBubble);
      if (left > vw - MARGIN - halfBubble) left = vw - MARGIN - halfBubble;
    }

    return {
      top: typeof top === "number" ? Math.max(MARGIN, Math.min(top, vh - MARGIN - 100)) : top,
      left,
      transform: `translateX(${translateX})`,
      maxWidth: `min(${BUBBLE_MAX_W}px, ${vw - MARGIN * 2}px)`,
    };
  };

  // Clamp bubble to never escape viewport (safety net applied via CSS + inline style)
  const clampedBubbleStyle = useMemo(() => {
    const style = getBubbleStyle();
    const vw = typeof window !== "undefined" ? window.innerWidth : 1024;
    const vh = typeof window !== "undefined" ? window.innerHeight : 768;

    // Extra safety: if top is somehow negative, clamp it
    if (typeof style.top === "number" && style.top < 0) style.top = MARGIN;
    // If left is somehow negative, clamp it
    if (typeof style.left === "number" && style.left < 0) style.left = MARGIN;

    return style;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotlight, step]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* ── Dark overlay with spotlight cutout ── */}
          <motion.div
            className="fixed inset-0 z-[200]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: spotlight
                ? `radial-gradient(
                    ellipse ${spotlight.width / 2 + 12}px ${spotlight.height / 2 + 12}px at ${spotlight.left + spotlight.width / 2}px ${spotlight.top + spotlight.height / 2}px,
                    transparent 0%,
                    transparent 70%,
                    rgba(0,0,0,0.65) 100%
                  )`
                : "rgba(0,0,0,0.65)",
              transition: "background 0.4s ease-in-out",
              backdropFilter: spotlight ? "none" : "blur(2px)",
            }}
            onClick={handleClose}
          />

          {/* ── Neon spotlight glow border ── */}
          <AnimatePresence mode="wait">
            {spotlight && (
              <motion.div
                key={current.targetId}
                className="pointer-events-none fixed z-[201]"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                style={{
                  top: spotlight.top,
                  left: spotlight.left,
                  width: spotlight.width,
                  height: spotlight.height,
                  borderRadius: 16,
                  border: "2.5px solid rgba(120,162,210,0.8)",
                  boxShadow: `
                    0 0 18px 4px rgba(120,162,210,0.35),
                    0 0 40px 8px rgba(120,162,210,0.15),
                    inset 0 0 12px 2px rgba(120,162,210,0.1)
                  `,
                  transition: "top 0.4s ease-in-out, left 0.4s ease-in-out, width 0.4s ease-in-out, height 0.4s ease-in-out",
                }}
              />
            )}
          </AnimatePresence>

          {/* ── Speech Bubble + Rabbit ── */}
          <motion.div
            className="fixed z-[202] flex flex-col items-center gap-3"
            style={clampedBubbleStyle}
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
          >
            {/* Mascot + pointer stick */}
            <div className="relative">
              <RabbitMascot mood="happy" size={48} />
              <div
                className="absolute -right-3 bottom-1 text-lg sm:block"
                style={{ transform: "rotate(-25deg)" }}
              >
                🪄
              </div>
            </div>

            {/* Bubble card */}
            <div className="glass-strong shine relative rounded-3xl p-4 text-center shadow-[0_20px_50px_-10px_rgba(10,14,45,0.7)] sm:p-5">
              {/* X close button */}
              <button
                onClick={handleClose}
                className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                style={{ cursor: "pointer" }}
                aria-label="Close tour"
              >
                <X className="size-4" />
              </button>

              <h3 className="pr-6 text-[clamp(0.875rem,0.8rem+0.25vw,1.125rem)] font-extrabold text-wistaria">
                {current.title}
              </h3>
              <p className="mt-2 text-[clamp(0.8125rem,0.75rem+0.25vw,0.9375rem)] leading-relaxed text-foreground/90">
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
                    className="min-h-[44px] min-w-[44px] rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                    style={{ cursor: "pointer" }}
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleNext}
                    className="min-h-[44px] min-w-[44px] rounded-xl bg-wistaria px-4 py-2 text-xs font-bold text-white shadow-lg shadow-wistaria/30 transition-all hover:bg-wistaria/90 hover:shadow-wistaria/50 active:scale-[0.97]"
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
