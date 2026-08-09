import { cn } from "@/lib/utils";

interface MediProLogoProps {
  /** Tonal variant — night (on dark splash) or day (on light glass). */
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
        "animate-twinkle drop-shadow-[0_0_8px_rgba(254,255,175,0.9)]",
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

/** The crescent moon that wraps around "Pro". */
function CrescentMoon({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("drop-shadow-[0_0_14px_rgba(120,162,210,0.85)]", className)}
      style={style}
      aria-hidden
    >
      <path
        d="M 58 6
           A 44 44 0 1 0 58 94
           A 36 36 0 1 1 58 6 Z"
        fill="#78A2D2"
      />
    </svg>
  );
}

export function MediProLogo({
  variant = "night",
  className,
  size = "md",
}: MediProLogoProps) {
  const night = variant === "night";
  const textClass = night ? "text-olean" : "text-[#4a4a8f]";
  const proColor = night ? "#FEFFAF" : "#6e6eb3";
  const starColor = night ? "#FEFFAF" : "#8f9bd8";
  const starScale =
    size === "xl" ? 26 : size === "lg" ? 20 : size === "md" ? 15 : 11;

  return (
    <div
      className={cn(
        "relative inline-flex items-baseline select-none",
        className,
      )}
      aria-label="MediPro"
    >
      {/* Three twinkling stars above "Medi" */}
      <div
        className="pointer-events-none absolute -top-1 left-0 flex items-end gap-1.5 sm:gap-2"
        style={{ transform: "translateY(-45%)" }}
        aria-hidden
      >
        <Sparkle size={starScale * 0.7} delay="0s" className={starColor} />
        <Sparkle size={starScale} delay="0.8s" className={starColor} />
        <Sparkle size={starScale * 0.55} delay="1.6s" className={starColor} />
      </div>

      <span
        className={cn(
          "font-calligraphy leading-none tracking-wide",
          SIZE_CLASSES[size],
          textClass,
        )}
      >
        Medi
      </span>

      {/* "Pro" wrapped by the crescent moon */}
      <span className="relative ml-[0.06em] inline-block">
        <span
          className={cn(
            "relative z-10 font-calligraphy leading-none tracking-wide",
            SIZE_CLASSES[size],
          )}
          style={{ color: proColor }}
        >
          Pro
        </span>
        <CrescentMoon
          className={cn(
            "absolute z-0",
            size === "xl"
              ? "h-[1.7em] w-[1.7em] -bottom-[0.42em] -right-[0.5em]"
              : size === "lg"
                ? "h-[1.75em] w-[1.75em] -bottom-[0.4em] -right-[0.48em]"
                : size === "md"
                  ? "h-[1.8em] w-[1.8em] -bottom-[0.38em] -right-[0.44em]"
                  : "h-[1.85em] w-[1.85em] -bottom-[0.36em] -right-[0.4em]",
          )}
          style={{ transform: "rotate(24deg)" }}
        />
      </span>
    </div>
  );
}

/** Compact horizontal lockup used in headers and footers. */
export function MediProLockup({
  variant = "day",
  className,
}: {
  variant?: "night" | "day";
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex size-9 items-center justify-center rounded-xl",
          variant === "night" ? "night-board" : "glass-chip",
        )}
      >
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M14 1.5 A 10.5 10.5 0 1 0 14 22.5 A 8.5 8.5 0 1 1 14 1.5 Z"
            fill="#78A2D2"
          />
        </svg>
      </div>
      <MediProLogo variant={variant} size="sm" />
    </div>
  );
}
