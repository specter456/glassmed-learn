import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type BlobMood = "worried" | "happy" | "crying";

/**
 * The GlassMed farewell blob — a friendly purple companion who is worried about
 * you leaving, cheers up when you decide to stay, and cries a tiny tear when
 * you really do sign out. Pure inline SVG (no assets, loads instantly) with
 * transform/opacity-only animations for battery-friendliness.
 */
export function Blob({ mood = "worried", size = 120 }: { mood?: BlobMood; size?: number }) {
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
          <linearGradient id="glassmed-blob-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="55%" stopColor="#8b7cf6" />
            <stop offset="100%" stopColor="#6d5ae8" />
          </linearGradient>
        </defs>

        {/* Soft floor shadow */}
        <ellipse cx="70" cy="130" rx="34" ry="7" fill="oklch(0.2 0.05 285 / 0.35)" />

        {/* Blobby body */}
        <path
          d="M70 14
             C 96 14 116 32 122 58
             C 128 84 116 108 96 120
             C 76 132 48 130 30 114
             C 12 98 8 68 20 44
             C 30 24 52 14 70 14 Z"
          fill="url(#glassmed-blob-grad)"
        />
        {/* Gloss */}
        <ellipse
          cx="50"
          cy="42"
          rx="13"
          ry="8"
          fill="oklch(1 0 0 / 0.32)"
          transform="rotate(-24 50 42)"
        />

        {/* Face swaps per mood */}
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
                {/* Happy closed eyes (∪) */}
                <path
                  d="M42 66 Q 52 56 62 66"
                  fill="none"
                  stroke="#231640"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                <path
                  d="M78 66 Q 88 56 98 66"
                  fill="none"
                  stroke="#231640"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                {/* Big smile */}
                <path
                  d="M52 88 Q 70 106 88 88"
                  fill="none"
                  stroke="#231640"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                {/* Blush */}
                <ellipse cx="40" cy="84" rx="6" ry="3.5" fill="#ff9db8" opacity="0.6" />
                <ellipse cx="100" cy="84" rx="6" ry="3.5" fill="#ff9db8" opacity="0.6" />
              </>
            )}

            {mood === "crying" && (
              <>
                {/* Sad closed eyes (∩) + worried brows */}
                <path
                  d="M44 66 Q 52 74 60 66"
                  fill="none"
                  stroke="#231640"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                <path
                  d="M80 66 Q 88 74 96 66"
                  fill="none"
                  stroke="#231640"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                <path
                  d="M46 54 L 62 58"
                  stroke="#231640"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d="M78 58 L 94 54"
                  stroke="#231640"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Small frown */}
                <path
                  d="M60 90 Q 70 84 80 90"
                  fill="none"
                  stroke="#231640"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                {/* Falling tear */}
                <motion.path
                  d="M52 72 Q 55 79 52 84 Q 49 79 52 72 Z"
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
                {/* Big worried eyes */}
                <circle cx="52" cy="68" r="7" fill="#231640" />
                <circle cx="88" cy="68" r="7" fill="#231640" />
                <circle cx="54.5" cy="66" r="2.4" fill="oklch(1 0 0 / 0.85)" />
                <circle cx="90.5" cy="66" r="2.4" fill="oklch(1 0 0 / 0.85)" />
                {/* Worried brows (inner ends up) */}
                <path d="M43 58 L 59 52" stroke="#231640" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M81 52 L 97 58" stroke="#231640" strokeWidth="3.5" strokeLinecap="round" />
                {/* Small "o" mouth */}
                <ellipse cx="70" cy="92" rx="5" ry="6" fill="#231640" />
              </>
            )}
          </motion.g>
        </AnimatePresence>
      </svg>
    </motion.div>
  );
}

interface LogoutBlobModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

/** Playful confirmation modal — the blob reacts to whichever button you hover. */
export function LogoutBlobModal({ open, onClose, onConfirm }: LogoutBlobModalProps) {
  const [mood, setMood] = useState<BlobMood>("worried");
  const [confirming, setConfirming] = useState(false);

  // Every way out of the modal resets the blob's mood, so reopening it always
  // starts with the worried face (no state resets inside effects).
  const closeModal = useCallback(() => {
    setMood("worried");
    setConfirming(false);
    onClose();
  }, [onClose]);

  // Close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeModal]);

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await onConfirm();
    } finally {
      setConfirming(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Log out confirmation"
            className="glass-strong shine relative w-full max-w-sm rounded-3xl p-7 text-center"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
          >
            <button
              onClick={closeModal}
              disabled={confirming}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-white/10"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>

            <div className="flex justify-center">
              <Blob mood={mood} size={120} />
            </div>

            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-wistaria">
              Log Out?
            </h2>
            <p className="mx-auto mt-2 max-w-[22rem] text-sm leading-6 text-muted-foreground">
              You'll need to sign in again to access your account. Your progress
              is saved — we'll be right here waiting! 💙
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                disabled={confirming}
                onMouseEnter={() => setMood("happy")}
                onMouseLeave={() => setMood("worried")}
                onClick={closeModal}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="flex-1 border border-[#e2666f]/40 bg-[#e2666f]/15 text-[#e2666f] transition-colors hover:bg-[#e2666f]/25 hover:text-[#e2666f]"
                disabled={confirming}
                onMouseEnter={() => setMood("crying")}
                onMouseLeave={() => setMood("worried")}
                onClick={() => void handleConfirm()}
              >
                {confirming ? (
                  <span className="size-4 animate-spin rounded-full border-2 border-[#e2666f]/30 border-t-[#e2666f]" />
                ) : (
                  <>
                    <LogOut className="mr-2 size-4" />
                    Log Out
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
