import { AnimatePresence, motion } from "framer-motion";

/**
 * GlassMed's five section mascots 🐝🐼🐰🦊🐱
 *
 * Each is a pure inline SVG (loads instantly, no assets, no network) with
 * transform/opacity-only animations so the battery stays happy:
 *
 * - Bee    — Login & first-time tutorial (cheerful tour guide)
 * - Panda  — Game section (scores, results, level-ups)
 * - Rabbit — Research section (reading mood on article pages)
 * - Fox    — AI Assistant (thinking / helpful moods)
 * - Cat    — Welcome & celebrations (login success, birthdays)
 *
 * They all share the same API: `mood`, `size`, `className`. Pass `Mascot`
 * with a `kind` to pick one generically.
 */

export type BeeMood = "happy";
export type PandaMood = "happy" | "encouraging";
export type RabbitMood = "reading" | "happy";
export type FoxMood = "thinking" | "happy";
export type CatMood = "excited" | "happy";
export type MascotKind = "bee" | "panda" | "rabbit" | "fox" | "cat";

interface BaseProps {
  size?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Shared face bits                                                    */
/* ------------------------------------------------------------------ */

/** Closed happy arc eyes (∪‿∪). */
function HappyEyes({ x1, x2, y, color = "#3d2f14" }: { x1: number; x2: number; y: number; color?: string }) {
  return (
    <>
      <path d={`M${x1 - 9} ${y} Q ${x1} ${y - 10} ${x1 + 9} ${y}`} fill="none" stroke={color} strokeWidth="4.5" strokeLinecap="round" />
      <path d={`M${x2 - 9} ${y} Q ${x2} ${y - 10} ${x2 + 9} ${y}`} fill="none" stroke={color} strokeWidth="4.5" strokeLinecap="round" />
    </>
  );
}

/** Big glossy anime eyes with specular highlights. */
function GlossyEyes({ x1, x2, y, r = 7.5, color = "#1c1c1c" }: { x1: number; x2: number; y: number; r?: number; color?: string }) {
  return (
    <>
      <circle cx={x1} cy={y} r={r} fill={color} />
      <circle cx={x1} cy={y} r={r} fill="none" stroke="none" />
      <circle cx={x1 + r * 0.35} cy={y - r * 0.35} r={r * 0.32} fill="rgba(255,255,255,0.92)" />
      <circle cx={x1 - r * 0.28} cy={y + r * 0.3} r={r * 0.16} fill="rgba(255,255,255,0.65)" />
      <circle cx={x2} cy={y} r={r} fill={color} />
      <circle cx={x2 + r * 0.35} cy={y - r * 0.35} r={r * 0.32} fill="rgba(255,255,255,0.92)" />
      <circle cx={x2 - r * 0.28} cy={y + r * 0.3} r={r * 0.16} fill="rgba(255,255,255,0.65)" />
    </>
  );
}

function Blush({ x1, x2, y, color = "#ffb3c6", opacity = 0.75 }: { x1: number; x2: number; y: number; color?: string; opacity?: number }) {
  return (
    <>
      <ellipse cx={x1} cy={y} rx="6.5" ry="4" fill={color} opacity={opacity} />
      <ellipse cx={x2} cy={y} rx="6.5" ry="4" fill={color} opacity={opacity} />
    </>
  );
}

/** Open happy smile (with optional tongue). */
function OpenSmile({ x, y, w = 36, color = "#3d2f14", tongue = false }: { x: number; y: number; w?: number; color?: string; tongue?: boolean }) {
  return (
    <>
      <path d={`M${x - w / 2} ${y} Q ${x} ${y + w * 0.62} ${x + w / 2} ${y} Q ${x} ${y + w * 0.42} ${x - w / 2} ${y} Z`} fill={color} />
      {tongue && <path d={`M${x - w * 0.2} ${y + w * 0.28} Q ${x} ${y + w * 0.62} ${x + w * 0.2} ${y + w * 0.28} Z`} fill="#ff9db8" />}
    </>
  );
}

/** Gentle closed smile (soft curve). */
function SoftSmile({ x, y, w = 26, color = "#3d2f14" }: { x: number; y: number; w?: number; color?: string }) {
  return <path d={`M${x - w / 2} ${y} Q ${x} ${y + w * 0.5} ${x + w / 2} ${y}`} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />;
}

/* ------------------------------------------------------------------ */
/* BUMBLEBEE — Login & first-time tutorial 🐝                          */
/* ------------------------------------------------------------------ */

export function BeeMascot({
  mood = "happy",
  size = 120,
  className,
}: BaseProps & { mood?: BeeMood }) {
  void mood;
  return (
    <motion.div
      aria-hidden
      animate={{ y: [0, -6, 0], rotate: [0, 2.5, -2.5, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      className={className}
      style={{ width: size, height: size, display: "inline-block" }}
    >
      <svg viewBox="0 0 140 140" width={size} height={size} overflow="visible">
        {/* soft floor shadow */}
        <ellipse cx="70" cy="131" rx="32" ry="6" fill="oklch(0.2 0.05 285 / 0.3)" />

        {/* wings */}
        <motion.ellipse
          cx="38" cy="56" rx="19" ry="30"
          fill="rgba(255,255,255,0.72)" stroke="#e3ddff" strokeWidth="2"
          animate={{ rotate: [-10, 10, -10] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "38px 56px" }}
        />
        <motion.ellipse
          cx="102" cy="56" rx="19" ry="30"
          fill="rgba(255,255,255,0.72)" stroke="#e3ddff" strokeWidth="2"
          animate={{ rotate: [10, -10, 10] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "102px 56px" }}
        />

        {/* striped abdomen */}
        <ellipse cx="70" cy="88" rx="40" ry="34" fill="#ffd94a" />
        <path d="M30 82 Q 70 98 110 82 L 110 90 Q 70 106 30 90 Z" fill="#3d2f14" />
        <path d="M30 98 Q 70 114 110 98 L 110 104 Q 70 120 30 104 Z" fill="#3d2f14" />

        {/* raised arms */}
        <path d="M38 96 Q 24 92 21 78" stroke="#3d2f14" strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M102 96 Q 116 92 119 78" stroke="#3d2f14" strokeWidth="8" strokeLinecap="round" fill="none" />
        {/* stubby feet */}
        <ellipse cx="52" cy="120" rx="6.5" ry="5" fill="#3d2f14" />
        <ellipse cx="88" cy="120" rx="6.5" ry="5" fill="#3d2f14" />

        {/* head */}
        <circle cx="70" cy="44" r="26" fill="#ffd94a" />
        <ellipse cx="59" cy="35" rx="8" ry="5" fill="rgba(255,255,255,0.4)" transform="rotate(-20 59 35)" />
        {/* antennae */}
        <path d="M58 22 Q 52 10 43 12" stroke="#3d2f14" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="42" cy="11.5" r="3.5" fill="#3d2f14" />
        <path d="M82 22 Q 88 10 97 12" stroke="#3d2f14" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="98" cy="11.5" r="3.5" fill="#3d2f14" />

        {/* face */}
        <HappyEyes x1={58} x2={82} y={45} />
        <OpenSmile x={70} y={56} w={26} tongue />
        <Blush x1={45} x2={95} y={52} />
      </svg>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* PANDA — Game section 🐼                                             */
/* ------------------------------------------------------------------ */

export function PandaMascot({
  mood = "happy",
  size = 120,
  className,
}: BaseProps & { mood?: PandaMood }) {
  const wrapperAnim = mood === "encouraging" ? { y: [0, -4, 0] } : { y: [0, -8, 0], scale: [1, 1.03, 1] };
  const wrapperTransition =
    mood === "encouraging"
      ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" as const }
      : { duration: 0.9, repeat: Infinity, ease: "easeInOut" as const };

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
          <radialGradient id="glassmed-panda-head" cx="50%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#eef0f4" />
          </radialGradient>
        </defs>

        {/* soft shadow */}
        <ellipse cx="70" cy="132" rx="30" ry="6" fill="oklch(0.2 0.05 285 / 0.3)" />

        {/* ears */}
        <circle cx="38" cy="26" r="13" fill="#2b2b2b" />
        <circle cx="102" cy="26" r="13" fill="#2b2b2b" />
        <circle cx="40" cy="24" r="5" fill="#5a5a5a" opacity="0.5" />
        <circle cx="100" cy="24" r="5" fill="#5a5a5a" opacity="0.5" />

        {/* body */}
        <ellipse cx="70" cy="112" rx="34" ry="26" fill="#ffffff" />
        {/* black vest over shoulders */}
        <path d="M38 96 Q 70 74 102 96 Q 96 118 70 122 Q 44 118 38 96 Z" fill="#2b2b2b" />
        <path d="M46 100 Q 70 86 94 100 Q 88 116 70 120 Q 52 116 46 100 Z" fill="#ffffff" />
        {/* arms */}
        <path d="M40 100 Q 26 104 24 116" stroke="#2b2b2b" strokeWidth="11" strokeLinecap="round" fill="none" />
        <path d="M100 100 Q 114 104 116 116" stroke="#2b2b2b" strokeWidth="11" strokeLinecap="round" fill="none" />
        {/* legs */}
        <ellipse cx="52" cy="126" rx="10" ry="8" fill="#2b2b2b" />
        <ellipse cx="88" cy="126" rx="10" ry="8" fill="#2b2b2b" />

        {/* head */}
        <circle cx="70" cy="62" r="46" fill="url(#glassmed-panda-head)" />

        {/* eye patches */}
        <ellipse cx="48" cy="60" rx="15" ry="18" fill="#2b2b2b" transform="rotate(-12 48 60)" />
        <ellipse cx="92" cy="60" rx="15" ry="18" fill="#2b2b2b" transform="rotate(12 92 60)" />

        {/* nose + mouth */}
        <path d="M70 72 L 64 79 Q 70 83 76 79 Z" fill="#2b2b2b" />
        <path d="M62 84 Q 70 91 78 84 Q 70 88 62 84 Z" fill="#f7a8c0" />

        <AnimatePresence mode="wait" initial={false}>
          <motion.g
            key={mood}
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.22 }}
          >
            {mood === "happy" ? (
              <>
                <HappyEyes x1={48} x2={92} y={62} color="#ffffff" />
                <OpenSmile x={70} y={88} w={30} color="#2b2b2b" tongue />
                <Blush x1={32} x2={108} y={76} />
              </>
            ) : (
              <>
                <GlossyEyes x1={48} x2={92} y={62} r={6} />
                <SoftSmile x={70} y={88} w={22} color="#2b2b2b" />
                <Blush x1={32} x2={108} y={78} />
                {/* thumbs-up paw */}
                <motion.path
                  d="M100 100 Q 116 96 120 82"
                  stroke="#2b2b2b" strokeWidth="11" strokeLinecap="round" fill="none"
                  animate={{ rotate: [-8, 6, -8] }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformOrigin: "100px 100px" }}
                />
              </>
            )}
          </motion.g>
        </AnimatePresence>
      </svg>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* RABBIT — Research section 🐰                                        */
/* ------------------------------------------------------------------ */

export function RabbitMascot({
  mood = "reading",
  size = 120,
  className,
}: BaseProps & { mood?: RabbitMood }) {
  const wrapperAnim = mood === "reading" ? { y: [0, -3, 0] } : { y: [0, -8, 0] };
  const wrapperTransition =
    mood === "reading"
      ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" as const }
      : { duration: 1, repeat: Infinity, ease: "easeInOut" as const };

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
          <radialGradient id="glassmed-rabbit-grad" cx="50%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#eef0f4" />
          </radialGradient>
        </defs>

        <ellipse cx="70" cy="132" rx="30" ry="6" fill="oklch(0.2 0.05 285 / 0.3)" />

        {/* long ears with peach inner pads */}
        <motion.g
          animate={mood === "happy" ? { rotate: [-6, 6, -6] } : { rotate: [-2, 2, -2] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "56px 62px" }}
        >
          <ellipse cx="52" cy="26" rx="13" ry="32" fill="#ffffff" transform="rotate(-10 52 62)" />
          <ellipse cx="52" cy="26" rx="7" ry="24" fill="#ffd9c9" transform="rotate(-10 52 62)" />
        </motion.g>
        <motion.g
          animate={mood === "happy" ? { rotate: [6, -6, 6] } : { rotate: [2, -2, 2] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "84px 62px" }}
        >
          <ellipse cx="88" cy="26" rx="13" ry="32" fill="#ffffff" transform="rotate(10 88 62)" />
          <ellipse cx="88" cy="26" rx="7" ry="24" fill="#ffd9c9" transform="rotate(10 88 62)" />
        </motion.g>

        {/* body with peach belly */}
        <ellipse cx="70" cy="116" rx="32" ry="26" fill="#ffffff" />
        <ellipse cx="70" cy="118" rx="19" ry="18" fill="#ffd9c9" />
        {/* stubby arms holding a tiny book */}
        <path d="M44 104 Q 30 106 30 118" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M96 104 Q 110 106 110 118" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" fill="none" />
        <rect x="38" y="104" width="64" height="24" rx="6" fill="#78A2D2" opacity="0.85" />
        <rect x="38" y="104" width="64" height="4" rx="2" fill="#a2c4e8" />
        <line x1="70" y1="108" x2="70" y2="128" stroke="#eaf3fb" strokeWidth="2" />
        {/* feet */}
        <ellipse cx="56" cy="130" rx="9" ry="6" fill="#ffffff" />
        <ellipse cx="84" cy="130" rx="9" ry="6" fill="#ffffff" />

        {/* head */}
        <circle cx="70" cy="66" r="44" fill="url(#glassmed-rabbit-grad)" />
        <ellipse cx="55" cy="48" rx="10" ry="6" fill="rgba(255,255,255,0.5)" transform="rotate(-20 55 48)" />

        {/* nose + mouth */}
        <path d="M70 74 L 65 79 Q 70 82 75 79 Z" fill="#ff9db8" />
        <path d="M62 85 Q 70 91 78 85 Q 70 89 62 85 Z" fill="#ffb3c6" />

        <AnimatePresence mode="wait" initial={false}>
          <motion.g
            key={mood}
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.22 }}
          >
            {mood === "reading" ? (
              <>
                {/* round reading glasses */}
                <circle cx="52" cy="64" r="11" fill="none" stroke="#5b6b8c" strokeWidth="2.5" />
                <circle cx="88" cy="64" r="11" fill="none" stroke="#5b6b8c" strokeWidth="2.5" />
                <path d="M63 64 L 77 64" stroke="#5b6b8c" strokeWidth="2.5" />
                <path d="M41 62 L 30 58" stroke="#5b6b8c" strokeWidth="2.5" />
                <path d="M99 62 L 110 58" stroke="#5b6b8c" strokeWidth="2.5" />
                {/* soft lowered eyes */}
                <path d="M45 66 Q 52 63 59 66" fill="none" stroke="#3d2f14" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M81 66 Q 88 63 95 66" fill="none" stroke="#3d2f14" strokeWidth="3.5" strokeLinecap="round" />
                <SoftSmile x={70} y={88} w={20} color="#3d2f14" />
                <Blush x1={38} x2={102} y={76} />
              </>
            ) : (
              <>
                <HappyEyes x1={52} x2={88} y={66} />
                <OpenSmile x={70} y={90} w={26} tongue />
                <Blush x1={38} x2={102} y={80} />
              </>
            )}
          </motion.g>
        </AnimatePresence>
      </svg>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* FOX — AI Assistant 🦊                                               */
/* ------------------------------------------------------------------ */

export function FoxMascot({
  mood = "happy",
  size = 120,
  className,
}: BaseProps & { mood?: FoxMood }) {
  const wrapperAnim = mood === "thinking" ? { y: [0, -2, 0], rotate: [-2, 2, -2] } : { y: [0, -8, 0], scale: [1, 1.03, 1] };
  const wrapperTransition =
    mood === "thinking"
      ? { duration: 2, repeat: Infinity, ease: "easeInOut" as const }
      : { duration: 1, repeat: Infinity, ease: "easeInOut" as const };

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
          <linearGradient id="glassmed-fox-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffb45c" />
            <stop offset="100%" stopColor="#f59c3e" />
          </linearGradient>
        </defs>

        <ellipse cx="70" cy="132" rx="30" ry="6" fill="oklch(0.2 0.05 285 / 0.3)" />

        {/* body with white chest */}
        <ellipse cx="70" cy="114" rx="32" ry="26" fill="url(#glassmed-fox-grad)" />
        <ellipse cx="70" cy="116" rx="19" ry="18" fill="#ffffff" />
        {/* dark paws */}
        <ellipse cx="52" cy="130" rx="10" ry="7" fill="#4a2c22" />
        <ellipse cx="88" cy="130" rx="10" ry="7" fill="#4a2c22" />

        {/* ears with white inner */}
        <path d="M32 40 L 24 10 L 52 24 Z" fill="url(#glassmed-fox-grad)" />
        <path d="M36 36 L 31 18 L 47 26 Z" fill="#ffe9d2" />
        <path d="M108 40 L 116 10 L 88 24 Z" fill="url(#glassmed-fox-grad)" />
        <path d="M104 36 L 109 18 L 93 26 Z" fill="#ffe9d2" />

        {/* head */}
        <circle cx="70" cy="62" r="42" fill="url(#glassmed-fox-grad)" />
        {/* white muzzle */}
        <path d="M42 62 Q 70 44 98 62 Q 98 92 70 102 Q 42 92 42 62 Z" fill="#ffffff" />
        {/* cheek tufts */}
        <path d="M40 64 Q 26 60 30 72 Q 26 68 32 78 Z" fill="#f59c3e" />
        <path d="M100 64 Q 114 60 110 72 Q 114 68 108 78 Z" fill="#f59c3e" />
        <ellipse cx="58" cy="46" rx="9" ry="5.5" fill="rgba(255,255,255,0.28)" transform="rotate(-18 58 46)" />

        {/* nose + mouth */}
        <path d="M70 74 L 65.5 78.5 Q 70 81 74.5 78.5 Z" fill="#2b1d16" />
        <path d="M62 85 Q 70 91 78 85 Q 70 89 62 85 Z" fill="#5b3a2e" />

        <AnimatePresence mode="wait" initial={false}>
          <motion.g
            key={mood}
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.22 }}
          >
            {mood === "happy" ? (
              <>
                <HappyEyes x1={52} x2={88} y={64} color="#3a2419" />
                <OpenSmile x={70} y={88} w={26} color="#3a2419" tongue />
                <Blush x1={36} x2={104} y={78} color="#ffb3a0" />
              </>
            ) : (
              <>
                {/* thinking: eyes looking up + floating dots */}
                <GlossyEyes x1={52} x2={88} y={62} r={6.5} />
                {[
                  { cx: 108, cy: 44, d: 0 },
                  { cx: 120, cy: 50, d: 0.15 },
                  { cx: 130, cy: 58, d: 0.3 },
                ].map((s) => (
                  <motion.circle
                    key={s.cx}
                    cx={s.cx} cy={s.cy} r="2.6" fill="#a2a2d0"
                    animate={{ opacity: [0.25, 1, 0.25] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: s.d }}
                  />
                ))}
                <SoftSmile x={70} y={88} w={18} color="#3a2419" />
                <Blush x1={36} x2={104} y={80} color="#ffb3a0" opacity={0.5} />
              </>
            )}
          </motion.g>
        </AnimatePresence>
      </svg>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* WHITE CAT — Welcome & celebrations 🐱                               */
/* ------------------------------------------------------------------ */

export function CatMascot({
  mood = "excited",
  size = 120,
  className,
}: BaseProps & { mood?: CatMood }) {
  const wrapperAnim = mood === "excited" ? { y: [0, -12, 0], scale: [1, 1.05, 1] } : { y: [0, -8, 0] };
  const wrapperTransition =
    mood === "excited"
      ? { duration: 0.7, repeat: Infinity, ease: "easeInOut" as const }
      : { duration: 1.1, repeat: Infinity, ease: "easeInOut" as const };

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
          <radialGradient id="glassmed-cat-grad" cx="50%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#eceef4" />
          </radialGradient>
        </defs>

        <ellipse cx="70" cy="132" rx="30" ry="6" fill="oklch(0.2 0.05 285 / 0.3)" />

        {/* body with pink belly patch */}
        <ellipse cx="70" cy="116" rx="33" ry="27" fill="url(#glassmed-cat-grad)" />
        <ellipse cx="70" cy="118" rx="18" ry="18" fill="#ffd1e0" />
        {/* paws */}
        <ellipse cx="52" cy="131" rx="10" ry="7" fill="#ffffff" />
        <ellipse cx="88" cy="131" rx="10" ry="7" fill="#ffffff" />

        {/* ears with pink inner */}
        <motion.path
          d="M38 40 L 28 10 L 60 22 Z" fill="#ffffff"
          animate={mood === "excited" ? { rotate: [-6, 6, -6] } : { rotate: 0 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "44px 26px" }}
        />
        <path d="M40 34 L 35 18 L 52 24 Z" fill="#ffc4d6" />
        <motion.path
          d="M102 40 L 112 10 L 80 22 Z" fill="#ffffff"
          animate={mood === "excited" ? { rotate: [6, -6, 6] } : { rotate: 0 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "96px 26px" }}
        />
        <path d="M100 34 L 105 18 L 88 24 Z" fill="#ffc4d6" />

        {/* head */}
        <circle cx="70" cy="64" r="44" fill="url(#glassmed-cat-grad)" />
        <ellipse cx="54" cy="46" rx="10" ry="6" fill="rgba(255,255,255,0.55)" transform="rotate(-20 54 46)" />

        {/* nose + mouth + whiskers */}
        <path d="M70 76 L 66.5 80 Q 70 82.5 73.5 80 Z" fill="#2b1d16" />
        <path d="M61 85 Q 70 92 79 85 Q 70 89.5 61 85 Z" fill="#f7a8c0" />
        <g stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" opacity="0.8">
          <path d="M36 72 L 18 66" />
          <path d="M36 78 L 18 78" />
          <path d="M36 84 L 20 90" />
          <path d="M104 72 L 122 66" />
          <path d="M104 78 L 122 78" />
          <path d="M104 84 L 120 90" />
        </g>

        <AnimatePresence mode="wait" initial={false}>
          <motion.g
            key={mood}
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.22 }}
          >
            {mood === "excited" ? (
              <>
                <GlossyEyes x1={52} x2={88} y={64} r={8} />
                <OpenSmile x={70} y={90} w={28} color="#2b1d16" tongue />
                <Blush x1={34} x2={106} y={80} />
              </>
            ) : (
              <>
                <HappyEyes x1={52} x2={88} y={64} color="#2b1d16" />
                <OpenSmile x={70} y={90} w={24} color="#2b1d16" tongue />
                <Blush x1={34} x2={106} y={80} />
              </>
            )}
          </motion.g>
        </AnimatePresence>
      </svg>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Generic picker                                                      */
/* ------------------------------------------------------------------ */

export function Mascot({
  kind,
  mood = "happy",
  size,
  className,
}: {
  kind: MascotKind;
  mood?: BeeMood | PandaMood | RabbitMood | FoxMood | CatMood;
  size?: number;
  className?: string;
}) {
  const shared = { size, className };
  switch (kind) {
    case "bee":
      return <BeeMascot mood={mood as BeeMood} {...shared} />;
    case "panda":
      return <PandaMascot mood={mood as PandaMood} {...shared} />;
    case "rabbit":
      return <RabbitMascot mood={mood as RabbitMood} {...shared} />;
    case "fox":
      return <FoxMascot mood={mood as FoxMood} {...shared} />;
    case "cat":
      return <CatMascot mood={mood as CatMood} {...shared} />;
  }
}
