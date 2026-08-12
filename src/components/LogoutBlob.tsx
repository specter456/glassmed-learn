import { Puppy, type PuppyMood } from "@/components/Puppy";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface LogoutBlobModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

/** Playful confirmation modal — the puppy reacts to whichever button you hover. */
export function LogoutBlobModal({ open, onClose, onConfirm }: LogoutBlobModalProps) {
  const [mood, setMood] = useState<PuppyMood>("worried");
  const [confirming, setConfirming] = useState(false);

  // Every way out of the modal resets the puppy's mood, so reopening it always
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
              <Puppy mood={mood} size={120} />
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
