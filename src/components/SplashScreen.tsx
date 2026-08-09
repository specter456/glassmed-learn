import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { GlassMedLogo } from "@/components/GlassMedLogo";

const SPLASH_MS = 2300;

/**
 * "Night Board" splash — deep navy→purple gradient, calligraphy logo,
 * crescent moon and three twinkling stars. Fades out automatically.
 * Shows once per browser session.
 */
export function SplashScreen() {
  const [visible, setVisible] = useState(
    () => !sessionStorage.getItem("medipro-splash-seen"),
  );

  useEffect(() => {
    if (!visible) return;
    sessionStorage.setItem("medipro-splash-seen", "1");
    const t = setTimeout(() => setVisible(false), SPLASH_MS);
    return () => clearTimeout(t);
  }, [visible]);

  if (!visible) return null;

  return (
    <motion.div
      key="splash"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center night-board"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      {/* faint inner orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-[12%] h-72 w-72 animate-orb rounded-full bg-cloud/20 blur-3xl" />
        <div className="absolute bottom-[-80px] right-[10%] h-80 w-80 animate-orb-slow rounded-full bg-wistaria/25 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
        className="relative flex flex-col items-center gap-6 px-6"
      >
        <GlassMedLogo variant="night" size="xl" />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-center text-sm font-medium uppercase tracking-[0.35em] text-wistaria"
        >
          Where medicine becomes energetic
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.4, 1, 0.5, 1] }}
        transition={{ duration: 1.8, delay: 0.4 }}
        className="absolute bottom-10 h-10 w-px bg-gradient-to-b from-transparent via-cloud/70 to-transparent"
      />
    </motion.div>
  );
}
