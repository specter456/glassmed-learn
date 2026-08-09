import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorModalProps {
  open: boolean;
  title?: string;
  message: string;
  onRetry?: () => void;
  onClose?: () => void;
}

/** Major-error state: centered dialog over a darkened, blurred backdrop. */
export function ErrorModal({
  open,
  title = "Something went wrong",
  message,
  onRetry,
  onClose,
}: ErrorModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-label={title}
            className="glass-strong relative w-full max-w-md rounded-3xl p-7"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            {onClose && (
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            )}

            <div className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <AlertTriangle className="size-6" />
            </div>

            <h2 className="mt-4 text-lg font-bold tracking-tight">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {message}
            </p>

            <div className="mt-6 flex items-center gap-3">
              {onRetry && (
                <Button onClick={onRetry} className="flex-1 gap-2">
                  <RotateCcw className="size-4" />
                  Retry
                </Button>
              )}
              {onClose && (
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Close
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
