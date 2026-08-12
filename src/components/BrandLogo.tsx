import { GlassMedLogo } from "@/components/GlassMedLogo";
import { cn } from "@/lib/utils";
import { useState } from "react";

/**
 * Brand logo image (`/public/logo.png`).
 *
 * If the PNG isn't present yet (e.g. upload still syncing), it gracefully
 * falls back to the inline SVG wordmark so the UI never shows a broken image.
 * The moment `public/logo.png` exists, every place using <BrandLogo> switches
 * over automatically with no further code changes.
 */
export function BrandLogo({
  height = 32,
  fallback = "sm",
  className,
}: {
  /** Rendered height of the PNG in pixels (width auto, keeps aspect). */
  height?: number;
  /** Wordmark size used while the PNG is unavailable. */
  fallback?: "sm" | "md" | "lg";
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <GlassMedLogo size={fallback} className={className} />;
  }

  return (
    <img
      src="/logo.png"
      alt="GlassMed Learn"
      onError={() => setFailed(true)}
      className={cn("w-auto select-none object-contain", className)}
      style={{ height, maxWidth: "min(60vw, 480px)" }}
      draggable={false}
    />
  );
}
