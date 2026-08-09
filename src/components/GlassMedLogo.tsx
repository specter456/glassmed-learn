import { motion } from "framer-motion";
import { Cross, HeartPulse, Shirt, Stethoscope, Syringe } from "lucide-react";
import { cn } from "@/lib/utils";

interface GlassMedLogoProps {
  /** Tonal variant — night (on dark splash) or day (on dark glass). */
  variant?: "night" | "day";
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const SIZE_CLASSES = {
  sm: "text-2xl",
  md: "text-3xl",
  lg: "text-5xl sm:text-6xl",
  xl: "text-6xl sm:text-8xl",
} as const;

/** Crescent size relative to the wordmark font size (em). */
const MARK_EM = { sm: 1.15, md: 1.1, lg: 1, xl: 0.9 } as const;

/** Small 4-point sparkle used for the twinkling stars. */
function Sparkle({
  className,
  delay = "0s",
  size = 18,
}: {
  className?: string;
  delay?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn(
        "animate-twinkle drop-shadow-[0_0_8px_rgba(254,255,175,0.8)]",
        className,
      )}
      style={{ animationDelay: delay }}
      aria-hidden
    >
      <path
        d="M12 0 C12.8 6.8 17.2 11.2 24 12 C17.2 12.8 12.8 17.2 12 24 C11.2 17.2 6.8 12.8 0 12 C6.8 11.2 11.2 6.8 12 0 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** A tiny 4-point sparkle used for the star inside the crescent moon. */
function MoonStar({
  x,
  y,
  scale,
  delay,
}: {
  x: number;
  y: number;
  scale: number;
  delay: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <motion.g
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay }}
      >
        <path
          d="M12 0 C12.8 6.8 17.2 11.2 24 12 C17.2 12.8 12.8 17.2 12 24 C11.2 17.2 6.8 12.8 0 12 C6.8 11.2 11.2 6.8 12 0 Z"
          fill="#FEFFAF"
        />
      </motion.g>
    </g>
  );
}

/**
 * The crescent moon mark, drawn at a fixed size next to the name. It carries
 * one tiny twinkling "hope" star inside its bowl. Rendered inline (not
 * absolutely behind text) so it can never be clipped by a parent panel.
 */
function CrescentMark({ em }: { em: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="shrink-0 drop-shadow-[0_0_10px_rgba(120,162,210,0.7)]"
      style={{ width: `${em}em`, height: `${em}em` }}
      aria-hidden
    >
      <path
        d="M 58 6
           A 44 44 0 1 0 58 94
           A 36 36 0 1 1 58 6 Z"
        fill="#78A2D2"
      />
      <MoonStar x={24} y={50} scale={0.3} delay={0.5} />
    </svg>
  );
}

export function GlassMedLogo({
  variant = "night",
  className,
  size = "md",
}: GlassMedLogoProps) {
  const night = variant === "night";
  const starScale =
    size === "xl" ? 22 : size === "lg" ? 16 : size === "md" ? 12 : 9;

  return (
    <div
      className={cn(
        "relative inline-flex select-none items-center gap-2 sm:gap-2.5",
        className,
      )}
      aria-label="GlassMed"
    >
      {/* the crescent moon diagram, beside the name */}
      <CrescentMark em={MARK_EM[size]} />

      {/* wordmark with three twinkling stars above */}
      <span className="relative">
        <span
          className={cn(
            "font-calligraphy leading-none tracking-wide",
            SIZE_CLASSES[size],
            night ? "text-olean" : "text-olean",
          )}
        >
          GlassMed
        </span>
        <div
          className="pointer-events-none absolute -top-1 left-0 flex items-end gap-1.5 sm:gap-2"
          style={{ transform: "translateY(-55%)" }}
          aria-hidden
        >
          <Sparkle size={starScale * 0.6} delay="0s" className="text-butter" />
          <Sparkle size={starScale} delay="0.8s" className="text-butter" />
          <Sparkle size={starScale * 0.5} delay="1.6s" className="text-butter" />
        </div>
      </span>
    </div>
  );
}

/** Compact horizontal lockup used in headers, navs and footers. */
export function GlassMedLockup({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <GlassMedLogo size="sm" />
      <span className="tech-label hidden sm:inline">Learn</span>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Floating medical emblems — small attractive "gif-like" accents that     */
/* drift around the logo (first aid, white coat, stethoscope, syringe).    */
/* Pure CSS/Framer motion — no real GIFs, so battery stays happy.          */
/* ----------------------------------------------------------------------- */

const EMBLEM_LAYOUT = [
  { Icon: Stethoscope, pos: "-top-9 -left-10", color: "#a2a2d0", delay: 0, duration: 6 },
  { Icon: Cross, pos: "-top-8 -right-9", color: "#feffaf", delay: 0.9, duration: 7 },
  { Icon: Shirt, pos: "-bottom-8 -right-10", color: "#feffaf", delay: 0.4, duration: 7.2 },
  { Icon: Syringe, pos: "-bottom-9 -left-8", color: "#78a2d2", delay: 1.6, duration: 6.4 },
  { Icon: HeartPulse, pos: "top-1/2 -right-16 -translate-y-1/2", color: "#e896b4", delay: 2.1, duration: 5.6 },
];

/**
 * A scatter of small frosted medical icons that gently float around the
 * logo. Pass `compact` for a quieter look (3 icons instead of 5) so the
 * hero stays clear rather than overloaded.
 */
export function MedicalEmblems({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const layout = compact ? EMBLEM_LAYOUT.slice(0, 3) : EMBLEM_LAYOUT;
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      {layout.map(({ Icon, pos, color, delay, duration }) => (
        <motion.span
          key={pos}
          className={cn("absolute", pos)}
          animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }}
          transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
        >
          <motion.span
            className="flex size-11 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/15 backdrop-blur-sm"
            style={{ color, boxShadow: `0 0 22px ${color}59, inset 0 1px 0 rgba(255,255,255,0.12)` }}
            animate={{ opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay }}
          >
            <Icon className="size-5" />
          </motion.span>
        </motion.span>
      ))}
    </div>
  );
}
