import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

/**
 * Fixed ambient backdrop: deep-soft gradient wash with a few slow glowing
 * orbs (pure CSS blur — no canvas/WebGL, so no thermal impact). In light
 * mode the wash flips to the pale Cloud gradient and the orbs soften, so the
 * theme toggle never leaves a dark hole behind the light glass.
 */
export function GlassBackdrop({ className }: { className?: string }) {
  const { theme } = useTheme();
  const light = theme === "light";

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      {/* base wash — deep navy, cool (or pale Cloud in light mode) */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-b",
          light
            ? "from-[#eef3fb] via-[#e9eef8] to-[#ece7f5]"
            : "from-[#121830] via-[#10152b] to-[#151230]",
        )}
      />

      {/* aurora band — pale Cloud Blue shining across the top */}
      <div className="absolute -top-44 left-1/2 h-[360px] w-[min(120vw,1400px)] -translate-x-1/2 rounded-full bg-cloud/15 blur-[90px]" />

      {/* glowing orbs — blur-2xl instead of blur-3xl keeps the depth while
          cutting the GPU cost of large blurred layers (less overheating) */}
      <div
        className={cn(
          "absolute -top-32 right-[8%] h-[420px] w-[420px] animate-orb rounded-full blur-2xl",
          light ? "bg-cloud/15" : "bg-cloud/28",
        )}
      />
      <div
        className={cn(
          "absolute top-[30%] -left-40 h-[460px] w-[460px] animate-orb-slow rounded-full blur-2xl",
          light ? "bg-wistaria/12" : "bg-wistaria/24",
        )}
      />
      <div
        className={cn(
          "absolute bottom-[-140px] right-[20%] h-[380px] w-[380px] animate-orb rounded-full blur-2xl",
          light ? "bg-[#e8b7cf]/10" : "bg-[#e8b7cf]/20",
        )}
      />
      <div
        className={cn(
          "absolute top-[55%] right-[-120px] h-[320px] w-[320px] animate-orb-slow rounded-full blur-2xl",
          light ? "bg-cloud/12" : "bg-cloud/20",
        )}
      />
      <div
        className={cn(
          "absolute bottom-[12%] left-[6%] h-[280px] w-[280px] animate-orb rounded-full blur-2xl",
          light ? "bg-cloud/8" : "bg-cloud/12",
        )}
      />

      {/* faint dot grid for spatial depth */}
      <div
        className={cn("absolute inset-0", light ? "opacity-[0.18]" : "opacity-[0.4]")}
        style={{
          backgroundImage:
            "radial-gradient(oklch(0.6 0.06 275 / 0.16) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
    </div>
  );
}
