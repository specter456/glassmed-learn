import { AnimatePresence, motion } from "framer-motion";

export type PuppyMood = "worried" | "happy" | "crying";

/**
 * The GlassMed puppy — the MediPro mascot. A warm cream puppy with floppy
 * ears, a wistaria-blue collar with a little medical cross tag, and the same
 * mood system as the farewell blob: worried by default (big eyes), happy with
 * a wagging tail when you hover Cancel, and a tiny falling tear when you
 * really log out. Pure inline SVG (loads instantly, no assets) with
 * transform/opacity-only animations for battery-friendliness.
 */
export function Puppy({ mood = "worried", size = 120 }: { mood?: PuppyMood; size?: number }) {
  const wrapperAnim =
    mood === "happy"
      ? { y: [0, -10, 0], scale: [1, 1.04, 1] }
      : mood === "crying"
        ? { y: [0, 2, 0], rotate: [-1.5, 0, -1.5] }
        : { scale: [1, 1.025, 1] };

  const wrapperTransition =
    mood === "happy"
      ? { duration: 0.55, repeat: Infinity, ease: "easeInOut" as const }
      : mood === "crying"
        ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" as const }
        : { duration: 2.8, repeat: Infinity, ease: "easeInOut" as const };

  return (
    <motion.div
      aria-hidden
      animate={wrapperAnim}
      transition={wrapperTransition}
      style={{ width: size, height: size, display: "inline-block" }}
    >
      <svg viewBox="0 0 140 140" width={size} height={size} overflow="visible">
        <defs>
          <linearGradient id="glassmed-puppy-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffe6b8" />
            <stop offset="55%" stopColor="#f7cf94" />
            <stop offset="100%" stopColor="#efbd7d" />
          </linearGradient>
        </defs>

        {/* Soft floor shadow */}
        <ellipse cx="70" cy="132" rx="30" ry="6" fill="oklch(0.2 0.05 285 / 0.35)" />

        {/* Floppy ears (behind the head) */}
        <path
          d="M40 34 C 24 44 18 68 27 90 C 31 98 42 93 45 77 C 48 60 46 43 40 34 Z"
          fill="#8a5a33"
        />
        <path
          d="M100 34 C 116 44 122 68 113 90 C 109 98 98 93 95 77 C 92 60 94 43 100 34 Z"
          fill="#8a5a33"
        />

        {/* Head */}
        <ellipse cx="70" cy="62" rx="46" ry="44" fill="url(#glassmed-puppy-grad)" />

        {/* Gloss */}
        <ellipse
          cx="47"
          cy="40"
          rx="11"
          ry="6.5"
          fill="oklch(1 0 0 / 0.3)"
          transform="rotate(-24 47 40)"
        />

        {/* Muzzle */}
        <ellipse cx="70" cy="84" rx="26" ry="17" fill="#fdf0dc" />
        {/* Nose */}
        <ellipse cx="70" cy="77" rx="8" ry="5.5" fill="#4a3218" />
        <ellipse cx="67.5" cy="75.5" rx="2.6" ry="1.8" fill="oklch(1 0 0 / 0.5)" />

        {/* Collar with medical cross tag */}
        <path d="M44 103 Q 70 115 96 103 L 94 110 Q 70 122 46 110 Z" fill="#78A2D2" />
        <rect x="62" y="111" width="16" height="16" rx="4" fill="#ffffff" stroke="#bcd0ea" strokeWidth="1" />
        <path d="M68 114.5 h4 v2.5 h2.5 v4 H72 v2.5 h-4 v-2.5 h-2.5 v-4 H68 Z" fill="#e2555f" />

        {/* Mood-driven face + tail */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.g
            key={mood}
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.22 }}
          >
            {mood === "happy" && (
              <>
                {/* Wagging tail */}
                <motion.path
                  d="M104 84 Q 122 78 124 64"
                  fill="none"
                  stroke="#f3c98f"
                  strokeWidth="11"
                  strokeLinecap="round"
                  animate={{ rotate: [-16, 16, -16] }}
                  transition={{ duration: 0.45, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformOrigin: "104px 84px" }}
                />
                {/* Happy closed eyes (∪) */}
                <path
                  d="M44 62 Q 52 53 60 62"
                  fill="none"
                  stroke="#4a3218"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                <path
                  d="M80 62 Q 88 53 96 62"
                  fill="none"
                  stroke="#4a3218"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                {/* Open happy smile with tongue */}
                <path d="M52 88 Q 70 108 88 88 Q 70 98 52 88 Z" fill="#4a3218" />
                <path d="M60 94 Q 70 106 80 94 Z" fill="#ff9db8" />
                {/* Blush */}
                <ellipse cx="40" cy="84" rx="6" ry="3.5" fill="#ff9db8" opacity="0.65" />
                <ellipse cx="100" cy="84" rx="6" ry="3.5" fill="#ff9db8" opacity="0.65" />
              </>
            )}

            {mood === "crying" && (
              <>
                {/* Droopy tail */}
                <path
                  d="M104 84 Q 120 84 122 72"
                  fill="none"
                  stroke="#f3c98f"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
                {/* Sad closed eyes (∩) + worried brows */}
                <path
                  d="M46 62 Q 52 70 58 62"
                  fill="none"
                  stroke="#4a3218"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                <path
                  d="M82 62 Q 88 70 94 62"
                  fill="none"
                  stroke="#4a3218"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                <path d="M48 53 L 62 57" stroke="#4a3218" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M78 57 L 92 53" stroke="#4a3218" strokeWidth="3.5" strokeLinecap="round" />
                {/* Small frown */}
                <path d="M60 92 Q 70 87 80 92" fill="none" stroke="#4a3218" strokeWidth="4.5" strokeLinecap="round" />
                {/* Falling tear */}
                <motion.path
                  d="M50 74 Q 53 81 50 86 Q 47 81 50 74 Z"
                  fill="#9cc9ff"
                  stroke="#6da9e8"
                  strokeWidth="1"
                  animate={{ y: [0, 16], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, times: [0, 0.25, 0.75, 1] }}
                />
              </>
            )}

            {mood === "worried" && (
              <>
                {/* Still tail */}
                <path
                  d="M104 84 Q 122 80 124 66"
                  fill="none"
                  stroke="#f3c98f"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
                {/* Big worried eyes */}
                <circle cx="52" cy="62" r="7" fill="#4a3218" />
                <circle cx="88" cy="62" r="7" fill="#4a3218" />
                <circle cx="54.5" cy="60" r="2.4" fill="oklch(1 0 0 / 0.85)" />
                <circle cx="90.5" cy="60" r="2.4" fill="oklch(1 0 0 / 0.85)" />
                {/* Worried brows (inner ends up) */}
                <path d="M43 52 L 59 46" stroke="#4a3218" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M81 46 L 97 52" stroke="#4a3218" strokeWidth="3.5" strokeLinecap="round" />
                {/* Small "o" mouth */}
                <ellipse cx="70" cy="91" rx="4.5" ry="5.5" fill="#4a3218" />
              </>
            )}
          </motion.g>
        </AnimatePresence>
      </svg>
    </motion.div>
  );
}
