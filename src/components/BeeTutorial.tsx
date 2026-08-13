import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BeeMascot } from "@/components/mascots";

/**
 * The bumblebee welcome tour 🐝 — shown ONLY to first-time users, floating
 * near the bottom of the login page. It says hi, points at the two ways in,
 * then flies away and never returns (remembered in localStorage).
 */

const TUTORIAL_KEY = "glassmed-bee-tutorial-done";

const STEPS = [
  "Happy to see you! 🐝 Let me show you around!",
  "Type your email above to get in — or hit “Continue as Guest” to explore! 🐾",
];

export function BeeTutorial() {
  // First-time check happens lazily so no setState fires inside an effect.
  const [visible, setVisible] = useState(() => {
    let done = false;
    try {
      done = localStorage.getItem(TUTORIAL_KEY) === "1";
    } catch {
      // Storage unavailable — show the tutorial anyway.
    }
    return !done;
  });
  const [step, setStep] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const timers = useRef<number[]>([]);

  const flyAway = () => {
    if (leaving) return;
    setLeaving(true);
    timers.current.push(
      window.setTimeout(() => {
        try {
          localStorage.setItem(TUTORIAL_KEY, "1");
        } catch {
          // Storage unavailable — the tutorial simply won't be remembered.
        }
        setVisible(false);
      }, 950),
    );
  };

  useEffect(() => {
    const t = timers.current;
    t.push(window.setTimeout(() => setStep(1), 4000));
    t.push(window.setTimeout(flyAway, 8500));
    return () => t.forEach((id) => window.clearTimeout(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none fixed inset-x-0 bottom-24 z-[80] flex justify-center px-4"
          initial={{ opacity: 0, y: 40 }}
          animate={
            leaving
              ? { opacity: 0, y: -120, x: 80 }
              : { opacity: 1, y: 0, x: 0 }
          }
          exit={{ opacity: 0, y: -90 }}
          transition={
            leaving
              ? { duration: 0.9, ease: "easeIn" }
              : { type: "spring", stiffness: 220, damping: 20, delay: 0.5 }
          }
        >
          <div className="pointer-events-auto flex flex-col items-center">
            {/* speech bubble */}
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.92, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="glass-strong relative max-w-xs rounded-2xl rounded-br-md px-4 py-3 text-center text-sm font-semibold leading-5 shadow-[0_16px_40px_-16px_rgba(120,162,210,0.5)]"
            >
              {STEPS[step]}
              {/* tail */}
              <span
                aria-hidden
                className="absolute -bottom-1.5 left-1/2 size-3.5 -translate-x-1/2 rotate-45 rounded-sm bg-white/10 backdrop-blur-md"
              />
              <button
                onClick={flyAway}
                className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-muted-foreground transition-colors hover:bg-white/20 hover:text-foreground"
                aria-label="Dismiss the welcome tutorial"
              >
                ✕
              </button>
            </motion.div>

            {/* the bee, flying below the bubble */}
            <motion.button
              onClick={flyAway}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="mt-1 cursor-pointer"
              aria-label="Dismiss the welcome tutorial"
            >
              <BeeMascot size={86} />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
