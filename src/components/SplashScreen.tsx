import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const SPLASH_MS = 3000;

/**
 * App-launch splash — deep navy→purple gradient with the rabbit swinging
 * gently left to right and the "GlassMed" wordmark sliding in from the left.
 * Plays on EVERY page load (a smooth loading veil while the app mounts and
 * the route chunks hydrate underneath), then fades into the app. No storage
 * is consulted, so sandboxed preview iframes and repeated reloads behave
 * identically — the loading animation never randomly skips.
 */
export function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), SPLASH_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          className="night-board fixed inset-0 z-[100] flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          {/* faint inner orbs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="animate-orb absolute -top-24 left-[12%] h-72 w-72 rounded-full bg-cloud/20 blur-3xl" />
            <div className="animate-orb-slow absolute -bottom-20 right-[10%] h-80 w-80 rounded-full bg-wistaria/25 blur-3xl" />
          </div>

          <div className="relative flex flex-col items-center px-6">
            {/* the rabbit, swinging gently left to right */}
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative"
            >
              <div
                className="absolute left-1/2 top-1/2 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cloud/25 blur-3xl"
                aria-hidden
              />
              <motion.img
                src="/logo.png"
                alt=""
                aria-hidden
                draggable={false}
                className="relative h-56 w-56 object-contain drop-shadow-[0_0_34px_rgba(120,162,210,0.55)] sm:h-64 sm:w-64"
                style={{ transformOrigin: "top center" }}
                animate={{ rotate: [-6, 6, -6] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* the wordmark sliding in from left to right */}
            <motion.p
              initial={{ x: -90, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.35 }}
              className="mt-6 whitespace-nowrap font-calligraphy text-5xl tracking-wide text-wistaria drop-shadow-[0_0_18px_rgba(162,162,208,0.7)] sm:text-6xl"
            >
              GlassMed
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85, duration: 0.8 }}
              className="mt-3 text-center text-xs font-medium uppercase tracking-[0.35em] text-wistaria/80"
            >
              Where medicine becomes energetic
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
