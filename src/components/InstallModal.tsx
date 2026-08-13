import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Download, MonitorSmartphone, Smartphone, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

interface InstallPromptEventLike {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

type DeviceKind = "ios" | "android" | "desktop";

function detectDevice(): DeviceKind {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent;
  const isIOS =
    /iPhone|iPad|iPod/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (isIOS) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

function isStandalone(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(display-mode: standalone)").matches
  );
}

const DEVICE_STEPS: Record<DeviceKind, { title: string; icon: typeof Smartphone; steps: string[] }> = {
  ios: {
    title: "iPhone & iPad",
    icon: Smartphone,
    steps: [
      "Tap the Share button (the square with an arrow pointing up) in Safari.",
      "Scroll down and tap “Add to Home Screen”.",
      "Enjoy GlassMed as an app — right from your Home Screen!",
    ],
  },
  android: {
    title: "Android",
    icon: Smartphone,
    steps: [
      "Tap the 3-dot menu in the top-right of your browser.",
      "Tap “Add to Home Screen” or “Install app”.",
      "Enjoy GlassMed as an app — right from your home screen!",
    ],
  },
  desktop: {
    title: "Desktop",
    icon: MonitorSmartphone,
    steps: [
      "Click the install icon in your browser's address bar (or the menu → “Install GlassMed”).",
      "GlassMed opens in its own window — no tab clutter.",
      "Works offline and launches like a real app!",
    ],
  },
};

interface InstallModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * “Install GlassMed” helper modal.
 *
 * - Detects iPhone vs Android (vs desktop) automatically and shows only the
 *   relevant steps.
 * - If the browser offers a real install prompt (Android Chrome, Edge, …) it
 *   shows a big “Install now” button that triggers it directly.
 * - If the app is already running installed (standalone), it says so.
 */
export function InstallModal({ open, onClose }: InstallModalProps) {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEventLike | null>(null);
  const [installing, setInstalling] = useState(false);

  // Capture the browser's install prompt (Chrome/Edge on Android & desktop).
  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as unknown as InstallPromptEventLike);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  // Close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const device = detectDevice();
  const standalone = isStandalone();
  const info = DEVICE_STEPS[device];
  const DeviceIcon = info.icon;

  const handleInstallNow = async () => {
    if (!installPrompt) return;
    setInstalling(true);
    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice.catch(() => null);
      if (choice?.outcome === "accepted") {
        toast.success("GlassMed installed! 🎉");
        onClose();
      } else {
        toast.info("Installation cancelled — you can try again anytime.");
      }
    } finally {
      setInstalling(false);
      setInstallPrompt(null);
    }
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Install GlassMed"
            className="glass-strong shine relative w-full max-w-md overflow-hidden rounded-3xl p-6 sm:p-7"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
          >
            {/* decorative glow */}
            <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-[#78A2D2]/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-14 h-40 w-40 rounded-full bg-[#a2a2d0]/25 blur-3xl" />

            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-white/10"
              aria-label="Close install instructions"
            >
              <X className="size-4" />
            </button>

            {/* Header */}
            <div className="relative flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#78A2D2] to-[#a2a2d0] text-white shadow-[0_10px_24px_-10px_rgba(120,162,210,0.9)]">
                <Download className="size-6" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-wistaria">
                  Install GlassMed
                </h2>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Get the full app experience
                </p>
              </div>
            </div>

            {standalone ? (
              /* Already installed */
              <div className="relative mt-6 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#6fb5b0]/20 text-[#4c9a94]"
                >
                  <CheckCircle2 className="size-8" />
                </motion.div>
                <h3 className="mt-4 text-xl font-extrabold text-wistaria">
                  You're all set! 🎉
                </h3>
                <p className="mx-auto mt-2 max-w-[20rem] text-sm leading-6 text-muted-foreground">
                  GlassMed is running as a full app — fast, focused, and ready
                  when you are.
                </p>
                <Button onClick={onClose} className="mt-5 w-full rounded-full">
                  Back to studying
                </Button>
              </div>
            ) : (
              <>
                {/* Direct install button (when the browser supports it) */}
                {installPrompt && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative mt-6"
                  >
                    <Button
                      onClick={() => void handleInstallNow()}
                      disabled={installing}
                      className="w-full gap-2 rounded-full bg-gradient-to-r from-[#78A2D2] to-[#a2a2d0] py-6 text-base text-white shadow-[0_14px_30px_-12px_rgba(120,162,210,0.9)]"
                    >
                      {installing ? (
                        <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      ) : (
                        <>
                          <Download className="size-5" />
                          Install now
                        </>
                      )}
                    </Button>
                    <p className="mt-2 text-center text-[11px] font-medium text-muted-foreground">
                      One tap — no store, no sign-up.
                    </p>
                  </motion.div>
                )}

                {/* Device instructions */}
                <div className="glass-panel relative mt-5 rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-wistaria/15 text-wistaria">
                      <DeviceIcon className="size-4" />
                    </div>
                    <p className="text-sm font-bold">
                      How to install on {info.title}
                    </p>
                  </div>
                  <ol className="mt-3 space-y-2.5">
                    {info.steps.map((step, i) => (
                      <motion.li
                        key={step}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.12 }}
                        className="flex items-start gap-3 text-sm leading-6"
                      >
                        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#78A2D2]/20 text-[11px] font-extrabold text-[#3f5f8f]">
                          {i + 1}
                        </span>
                        <span className="text-muted-foreground">{step}</span>
                      </motion.li>
                    ))}
                  </ol>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55 }}
                  className="relative mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] font-medium text-muted-foreground"
                >
                  <Sparkles className="size-3.5 text-wistaria" />
                  Works offline — nothing is uploaded, everything stays yours.
                </motion.p>

                <div className="relative mt-5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="w-full rounded-full"
                  >
                    Got it
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
