import { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { RabbitMascot } from "@/components/mascots";

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
  } catch {}
}

export function resetTour(): void {
  try {
    localStorage.removeItem(TOUR_DONE_KEY);
  } catch {}
}

interface TourStep {
  targetId?: string;
  title: string;
  message: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "Welcome! I'm Professor Rabbit 🐰",
    message:
      "I'll be your study guide! Let me show you around the app so you can start learning right away. Tap Next to begin!",
  },
  {
    targetId: "modules",
    title: "Your Study Hubs 📚",
    message:
      "These 4 boxes are your main study hubs! Flashcards for quick review, Basics for deep learning, Game for fun practice, and Research for clinical topics.",
  },
  {
    targetId: "search",
    title: "Smart Search ⚡",
    message:
      "Type any topic name to find it instantly. You can also use shortcut codes — look for the [CS], [AP] badges on the topic cards below!",
  },
  {
    targetId: "basics-first-path",
    title: "Your Learning Path 🧠",
    message:
      "This is your Basics-First Path — the most important topics for first-year students. I'll remind you to review flashcards right before you forget!",
  },
  {
    title: "Special Day Surprise 🎁",
    message:
      "Got a special day coming up? There's a hidden gift box somewhere in the app. Click it ON your special day for a surprise! 🎁",
  },
  {
    title: "You're All Set! 🎉",
    message:
      "Start with Flashcards or explore the Basics. Happy studying, future doctor! 🚀",
  },
];

interface TeacherTourProps {
  open: boolean;
  onClose: () => void;
}

export function TeacherTour({ open, onClose }: TeacherTourProps) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  // Animate in/out
  useEffect(() => {
    if (open) {
      setStep(0);
      // Small delay so CSS transition fires
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [open]);

  const handleNext = useCallback(() => {
    if (step >= TOUR_STEPS.length - 1) {
      markTourDone();
      onClose();
    } else {
      setStep((s) => s + 1);
    }
  }, [step, onClose]);

  const handleBack = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const handleClose = useCallback(() => {
    markTourDone();
    onClose();
  }, [onClose]);

  // Scroll target into view
  useEffect(() => {
    if (!open) return;
    const current = TOUR_STEPS[step];
    if (current.targetId) {
      const el = document.querySelector(
        `[data-tour-target="${current.targetId}"]`,
      );
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [open, step]);

  if (!open) return null;

  const current = TOUR_STEPS[step];
  const isLast = step === TOUR_STEPS.length - 1;

  return (
    <>
      {/* Dark overlay */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999990,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(3px)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: visible ? "auto" : "none",
        }}
      />

      {/* Neon spotlight glow */}
      {current.targetId && <Spotlight targetId={current.targetId} visible={visible} />}

      {/* Speech Bubble + Rabbit */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 999992,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: visible ? "auto" : "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          width: "min(360px, calc(100vw - 32px))",
        }}
      >
        {/* Mascot */}
        <div style={{ position: "relative" }}>
          <RabbitMascot mood="happy" size={44} />
          <span
            style={{
              position: "absolute",
              right: "-8px",
              bottom: "0px",
              fontSize: "16px",
              transform: "rotate(-20deg)",
            }}
          >
            🪄
          </span>
        </div>

        {/* Bubble card */}
        <div
          style={{
            width: "100%",
            borderRadius: "24px",
            padding: "16px",
            textAlign: "center",
            background: "rgba(17,20,55,0.92)",
            border: "1px solid rgba(120,162,210,0.25)",
            boxShadow: "0 20px 50px -10px rgba(10,14,45,0.7)",
            backdropFilter: "blur(18px)",
          }}
        >
          {/* Close */}
          <button
            onClick={handleClose}
            style={{
              position: "absolute",
              right: "10px",
              top: "10px",
              width: "44px",
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "12px",
              border: "none",
              background: "transparent",
              color: "#94a3b8",
              cursor: "pointer",
              fontSize: "16px",
            }}
            aria-label="Close tour"
          >
            <X size={16} />
          </button>

          <h3
            style={{
              fontSize: "clamp(0.875rem, 0.8rem + 0.3vw, 1.1rem)",
              fontWeight: 800,
              color: "#a2a2d0",
              paddingRight: "24px",
            }}
          >
            {current.title}
          </h3>
          <p
            style={{
              marginTop: "8px",
              fontSize: "clamp(0.8rem, 0.75rem + 0.25vw, 0.9rem)",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {current.message}
          </p>

          {/* Actions */}
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
            }}
          >
            {/* Dots */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {TOUR_STEPS.map((_, i) => (
                <span
                  key={i}
                  style={{
                    display: "block",
                    borderRadius: "50%",
                    width: i === step ? "8px" : "6px",
                    height: i === step ? "8px" : "6px",
                    background:
                      i === step
                        ? "#a2a2d0"
                        : i < step
                          ? "rgba(162,162,208,0.4)"
                          : "rgba(148,163,184,0.3)",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "6px" }}>
              {step > 0 && (
                <button
                  onClick={handleBack}
                  style={{
                    minWidth: "44px",
                    minHeight: "44px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "12px",
                    border: "none",
                    padding: "8px 12px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#94a3b8",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  <ChevronLeft size={16} />
                </button>
              )}
              <button
                onClick={handleClose}
                style={{
                  minWidth: "44px",
                  minHeight: "44px",
                  borderRadius: "12px",
                  border: "none",
                  padding: "8px 12px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#94a3b8",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                style={{
                  minWidth: "44px",
                  minHeight: "44px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  borderRadius: "12px",
                  border: "none",
                  padding: "8px 16px",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "white",
                  background: "#a2a2d0",
                  boxShadow: "0 8px 20px -4px rgba(162,162,208,0.3)",
                  cursor: "pointer",
                }}
              >
                {isLast ? "Let's Go! 🚀" : <>Next <ChevronRight size={14} /></>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* Spotlight helper — renders a fixed neon border around the target element */
function Spotlight({ targetId, visible }: { targetId: string; visible: boolean }) {
  const [rect, setRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  useEffect(() => {
    const measure = () => {
      const el = document.querySelector(`[data-tour-target="${targetId}"]`);
      if (el) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          setRect({ top: r.top - 10, left: r.left - 10, width: r.width + 20, height: r.height + 20 });
        }
      }
    };
    // Measure after scroll settles
    const t1 = setTimeout(measure, 100);
    const t2 = setTimeout(measure, 500);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", measure);
    };
  }, [targetId]);

  if (!rect) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        borderRadius: 16,
        border: "2.5px solid rgba(120,162,210,0.85)",
        boxShadow: "0 0 20px 6px rgba(120,162,210,0.4), 0 0 50px 12px rgba(120,162,210,0.15), inset 0 0 15px 3px rgba(120,162,210,0.12)",
        zIndex: 999991,
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease, top 0.4s ease, left 0.4s ease, width 0.4s ease, height 0.4s ease",
      }}
    />
  );
}
