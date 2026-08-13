import { AnimatePresence, motion } from "framer-motion";

export type PuppyMood =
  | "worried"
  | "happy"
  | "crying"
  | "curious"
  | "listening"
  | "excited";

/**
 * The GlassMed puppy — the MediPro mascot. A warm cream puppy with big
 * sparkly eyes, pink inner ears, a wistaria-blue collar with a little medical
 * cross tag, and a mood system that drives the whole app:
 *
 * - worried   — default (big sparkly eyes), e.g. the logout question
 * - happy     — smiling with a wagging tail (hover "Cancel")
 * - crying    — tiny falling tear (hover "Log Out")
 * - curious   — head tilt + raised brow (hovering settings options)
 * - listening — perked ears + twitch (voice / audio features)
 * - excited   — bouncing, sparkles, fast wag (celebrations, install)
 *
 * Pure inline SVG (loads instantly, no assets) with transform/opacity-only
 * animations for battery-friendliness.
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
  const wrapper =
    mood === "excited"
      ? {
          animate: { y: [0, -14, 0], scale: [1, 1.08, 1] },
          transition: { duration: 0.45, repeat: Infinity, ease: "easeInOut" as const },
        }
      : mood === "happy"
        ? {
            animate: { y: [0, -10, 0], scale: [1, 1.05, 1] },
            transition: { duration: 0.55, repeat: Infinity, ease: "easeInOut" as const },
          }
        : mood === "crying"
          ? {
              animate: { y: [0, 2, 0], rotate: [-1.5, 0, -1.5] },
              transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" as const },
            }
          : mood === "curious"
            ? {
                animate: { rotate: [-5, 5, -5], y: [0, -2, 0] },
                transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" as const },
              }
            : mood === "listening"
              ? {
                  animate: { y: [0, -4, 0] },
                  transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut" as const },
                }
              : {
                  animate: { scale: [1, 1.03, 1] },
                  transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut" as const },
                };

  const tailWag =
    mood === "excited"
      ? { rotate: [-26, 26, -26], duration: 0.3 }
      : mood === "happy"
        ? { rotate: [-18, 18, -18], duration: 0.45 }
        : mood === "curious"
          ? { rotate: [-8, 8, -8], duration: 1.2 }
          : null;

  return (
    <motion.div
      aria-hidden
      animate={wrapper.animate}
      transition={wrapper.transition}
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

        {/* Sparkles (excited) */}
        {mood === "excited" && (
          <>
            <Sparkle x={18} y={34} delay={0} />
            <Sparkle x={124} y={28} delay={0.25} />
            <Sparkle x={116} y={112} delay={0.45} />
            <Sparkle x={22} y={106} delay={0.12} />
          </>
        )}

        {/* Ears — perked upright when listening, floppy otherwise */}
        {mood === "listening" ? (
          <>
            <motion.g
              animate={{ rotate: [-3, 3, -3] }}
              transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "40px 34px" }}
            >
              <path d="M40 34 L 28 6 L 58 18 Z" fill="#8a5a33" />
              <path d="M41 29 L 35 15 L 51 21 Z" fill="#f7b6c9" />
            </motion.g>
            <motion.g
              animate={{ rotate: [3, -3, 3] }}
              transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "100px 34px" }}
            >
              <path d="M100 34 L 112 6 L 82 18 Z" fill="#8a5a33" />
              <path d="M99 29 L 105 15 L 89 21 Z" fill="#f7b6c9" />
            </motion.g>
          </>
        ) : (
          <>
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
          </>
        )}

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
                <WaggingTail {...(tailWag ?? { rotate: [-18, 18, -18], duration: 0.45 })} />
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
                <Blush x1={39} x2={101} y={86} />
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

            {mood === "curious" && (
              <>
                <WaggingTail {...(tailWag ?? { rotate: [-8, 8, -8], duration: 1.2 })} />
                {/* Big glossy eyes */}
                <circle cx="52" cy="64" r="8" fill="#4a3218" />
                <circle cx="88" cy="64" r="8" fill="#4a3218" />
                <circle cx="54.5" cy="61.5" r="3" fill="oklch(1 0 0 / 0.9)" />
                <circle cx="90.5" cy="61.5" r="3" fill="oklch(1 0 0 / 0.9)" />
                <circle cx="56.5" cy="67" r="1.3" fill="oklch(1 0 0 / 0.7)" />
                <circle cx="84.5" cy="67" r="1.3" fill="oklch(1 0 0 / 0.7)" />
                {/* One brow raised (classic curious) */}
                <path d="M42 52 L 59 56" stroke="#4a3218" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M80 44 L 97 51" stroke="#4a3218" strokeWidth="3.5" strokeLinecap="round" />
                {/* Small open "o" mouth */}
                <ellipse cx="70" cy="93" rx="4.5" ry="5.5" fill="#4a3218" />
                <Blush x1={41} x2={99} y={88} opacity={0.5} />
              </>
            )}

            {mood === "listening" && (
              <>
                {/* Still tail */}
                <path
                  d="M104 86 Q 122 82 125 68"
                  fill="none"
                  stroke="#f3c98f"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
                {/* Big glossy eyes looking up */}
                <circle cx="52" cy="62" r="8" fill="#4a3218" />
                <circle cx="88" cy="62" r="8" fill="#4a3218" />
                <circle cx="54" cy="59" r="3" fill="oklch(1 0 0 / 0.9)" />
                <circle cx="90" cy="59" r="3" fill="oklch(1 0 0 / 0.9)" />
                {/* Gentle soft smile */}
                <path d="M58 92 Q 70 99 82 92" fill="none" stroke="#4a3218" strokeWidth="4.5" strokeLinecap="round" />
                <Blush x1={41} x2={99} y={88} opacity={0.55} />
              </>
            )}

            {mood === "excited" && (
              <>
                <WaggingTail {...(tailWag ?? { rotate: [-26, 26, -26], duration: 0.3 })} />
                {/* Excited closed happy eyes */}
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
                {/* Big open smile with tongue */}
                <path d="M50 88 Q 70 114 90 88 Q 70 98 50 88 Z" fill="#4a3218" />
                <path d="M58 96 Q 70 110 82 96 Z" fill="#ff9db8" />
                <Blush x1={39} x2={101} y={86} />
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
                <Blush x1={41} x2={99} y={88} opacity={0.4} />
              </>
            )}
          </motion.g>
        </AnimatePresence>
      </svg>
    </motion.div>
  );
}

/* --------------------------- small helpers --------------------------- */

function WaggingTail({
  rotate,
  duration,
}: {
  rotate: number[];
  duration: number;
}) {
  return (
    <motion.path
      d="M104 86 Q 122 80 125 66"
      fill="none"
      stroke="#f3c98f"
      strokeWidth="11"
      strokeLinecap="round"
      animate={{ rotate }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "104px 86px" }}
    />
  );
}

function Blush({
  x1,
  x2,
  y,
  opacity = 0.75,
}: {
  x1: number;
  x2: number;
  y: number;
  opacity?: number;
}) {
  return (
    <>
      <ellipse cx={x1} cy={y} rx="6.5" ry="4" fill="#ff9db8" opacity={opacity} />
      <ellipse cx={x2} cy={y} rx="6.5" ry="4" fill="#ff9db8" opacity={opacity} />
    </>
  );
}

function Sparkle({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.path
      d={`M${x} ${y - 6} L${x + 1.8} ${y - 1.8} L${x + 6} ${y} L${x + 1.8} ${y + 1.8} L${x} ${y + 6} L${x - 1.8} ${y + 1.8} L${x - 6} ${y} L${x - 1.8} ${y - 1.8} Z`}
      fill="#ffe08a"
      animate={{ scale: [0.6, 1.15, 0.6], opacity: [0.35, 1, 0.35], rotate: [0, 30, 0] }}
      transition={{ duration: 1.1, repeat: Infinity, delay, ease: "easeInOut" }}
      style={{ transformOrigin: `${x}px ${y}px` }}
    />
  );
}
