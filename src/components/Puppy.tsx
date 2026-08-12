import { AnimatePresence, motion } from "framer-motion";

export type PuppyMood = "worried" | "happy" | "crying";

/**
 * The GlassMed puppy — the MediPro mascot. A warm cream puppy with big
 * sparkly eyes, pink inner ears, a wistaria-blue collar with a little medical
 * cross tag, and the same mood system as the farewell blob: worried by default
 * (big eyes), happy with a wagging tail when you hover Cancel, and a tiny
 * falling tear when you really log out. Pure inline SVG (loads instantly, no
 * assets) with transform/opacity-only animations for battery-friendliness.
 */
export function Puppy({
  mood = "worried",
  size = 120,
  className,
}: {
  mood?: PuppyMood;
  size?: number;
  className?: string;
}) {
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
      className={className}
      style={{ width: size, height: size, display: "inline-block" }}
    >
      <svg viewBox="0 0 140 140" width={size} height={size} overflow="visible">
        <defs>
          <linearGradient id="glassmed-puppy-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffe9c0" />
            <stop offset="55%" stopColor="#f8d29b" />
            <stop offset="100%" stopColor="#f0c184" />
          </linearGradient>
        </defs>

        {/* Soft floor shadow */}
        <ellipse cx="70" cy="133" rx="31" ry="6" fill="oklch(0.2 0.05 285 / 0.35)" />

        {/* Floppy ears with pink inner fluff (behind the head) */}
        <path
          d="M38 32 C 20 44 14 70 24 93 C 28 101 40 96 43 78 C 47 60 44 42 38 32 Z"
          fill="#8a5a33"
        />
        <path
          d="M36 46 C 26 54 24 71 30 84 C 32 88 38 84 39 73 C 41 62 40 52 36 46 Z"
          fill="#f7b6c9"
          opacity="0.9"
        />
        <path
          d="M102 32 C 120 44 126 70 116 93 C 112 101 100 96 97 78 C 93 60 96 42 102 32 Z"
          fill="#8a5a33"
        />
        <path
          d="M104 46 C 114 54 116 71 110 84 C 108 88 102 84 101 73 C 99 62 100 52 104 46 Z"
          fill="#f7b6c9"
          opacity="0.9"
        />

        {/* Round, big head */}
        <ellipse cx="70" cy="64" rx="48" ry="46" fill="url(#glassmed-puppy-grad)" />

        {/* Gloss */}
        <ellipse
          cx="46"
          cy="42"
          rx="12"
          ry="7"
          fill="oklch(1 0 0 / 0.32)"
          transform="rotate(-24 46 42)"
        />

        {/* Muzzle */}
        <ellipse cx="70" cy="86" rx="27" ry="18" fill="#fdf0dc" />
        {/* Nose with shine */}
        <ellipse cx="70" cy="78" rx="9" ry="6" fill="#4a3218" />
        <ellipse cx="66.5" cy="76" rx="3" ry="2" fill="oklch(1 0 0 / 0.55)" />

        {/* Collar with medical cross tag */}
        <path d="M42 104 Q 70 116 98 104 L 96 112 Q 70 124 44 112 Z" fill="#78A2D2" />
        <rect x="62" y="112" width="16" height="16" rx="4" fill="#ffffff" stroke="#bcd0ea" strokeWidth="1" />
        <path d="M68 115.5 h4 v2.5 h2.5 v4 H72 v2.5 h-4 v-2.5 h-2.5 v-4 H68 Z" fill="#e2555f" />

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
                  d="M104 86 Q 122 80 125 66"
                  fill="none"
                  stroke="#f3c98f"
                  strokeWidth="11"
                  strokeLinecap="round"
                  animate={{ rotate: [-18, 18, -18] }}
                  transition={{ duration: 0.45, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformOrigin: "104px 86px" }}
                />
                {/* Happy closed eyes (∪) */}
                <path
                  d="M43 63 Q 52 53 61 63"
                  fill="none"
                  stroke="#4a3218"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                <path
                  d="M79 63 Q 88 53 97 63"
                  fill="none"
                  stroke="#4a3218"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                {/* Open happy smile with tongue */}
                <path d="M50 88 Q 70 110 90 88 Q 70 99 50 88 Z" fill="#4a3218" />
                <path d="M58 95 Q 70 108 82 95 Z" fill="#ff9db8" />
                {/* Blush */}
                <ellipse cx="39" cy="86" rx="6.5" ry="4" fill="#ff9db8" opacity="0.75" />
                <ellipse cx="101" cy="86" rx="6.5" ry="4" fill="#ff9db8" opacity="0.75" />
              </>
            )}

            {mood === "crying" && (
              <>
                {/* Droopy tail */}
                <path
                  d="M104 86 Q 120 86 123 74"
                  fill="none"
                  stroke="#f3c98f"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
                {/* Sad closed eyes (∩) + worried brows */}
                <path
                  d="M45 63 Q 52 71 59 63"
                  fill="none"
                  stroke="#4a3218"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                <path
                  d="M81 63 Q 88 71 95 63"
                  fill="none"
                  stroke="#4a3218"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                <path d="M47 53 L 62 57" stroke="#4a3218" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M78 57 L 93 53" stroke="#4a3218" strokeWidth="3.5" strokeLinecap="round" />
                {/* Small frown */}
                <path d="M58 94 Q 70 88 82 94" fill="none" stroke="#4a3218" strokeWidth="4.5" strokeLinecap="round" />
                {/* Falling tear */}
                <motion.path
                  d="M49 76 Q 52 83 49 88 Q 46 83 49 76 Z"
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
                  d="M104 86 Q 122 82 125 68"
                  fill="none"
                  stroke="#f3c98f"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
                {/* Big sparkly eyes */}
                <circle cx="52" cy="64" r="8" fill="#4a3218" />
                <circle cx="88" cy="64" r="8" fill="#4a3218" />
                <circle cx="54.5" cy="61.5" r="3" fill="oklch(1 0 0 / 0.9)" />
                <circle cx="90.5" cy="61.5" r="3" fill="oklch(1 0 0 / 0.9)" />
                <circle cx="56.5" cy="67" r="1.3" fill="oklch(1 0 0 / 0.7)" />
                <circle cx="84.5" cy="67" r="1.3" fill="oklch(1 0 0 / 0.7)" />
                {/* Worried brows (inner ends up) */}
                <path d="M42 52 L 59 46" stroke="#4a3218" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M81 46 L 98 52" stroke="#4a3218" strokeWidth="3.5" strokeLinecap="round" />
                {/* Small "o" mouth */}
                <ellipse cx="70" cy="93" rx="4.5" ry="5.5" fill="#4a3218" />
                {/* Soft blush */}
                <ellipse cx="41" cy="88" rx="5.5" ry="3.5" fill="#ff9db8" opacity="0.4" />
                <ellipse cx="99" cy="88" rx="5.5" ry="3.5" fill="#ff9db8" opacity="0.4" />
              </>
            )}
          </motion.g>
        </AnimatePresence>
      </svg>
    </motion.div>
  );
}
