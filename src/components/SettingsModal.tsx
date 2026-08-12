import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/lib/theme";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Mail, Moon, Settings2, Sun, X } from "lucide-react";
import { useEffect } from "react";

function formatMemberSince(ts?: number): string {
  if (!ts || !Number.isFinite(ts)) return "Unknown";
  try {
    return new Date(ts).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
    });
  } catch {
    return "Unknown";
  }
}

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  onRequestLogout: () => void;
}

/** Playful animated Dark/Light switch. */
function ThemeSwitch() {
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label="Toggle dark mode / light mode"
      onClick={toggle}
      className={`relative h-9 w-[4.25rem] shrink-0 rounded-full border transition-colors duration-300 ${
        isLight
          ? "border-cloud/50 bg-cloud/30"
          : "border-wistaria/50 bg-wistaria/25"
      }`}
    >
      <span
        className={`pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 ${
          isLight ? "text-cloud" : "text-wistaria/70"
        }`}
      >
        <Moon className="size-3.5" />
      </span>
      <span
        className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 ${
          isLight ? "text-butter" : "text-cloud"
        }`}
      >
        <Sun className="size-3.5" />
      </span>
      <motion.span
        animate={{ x: isLight ? 34 : 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        className="absolute left-1 top-1 flex size-7 items-center justify-center rounded-full bg-white text-[#6d5ae8] shadow-[0_2px_10px_-2px_oklch(0.3_0.1_285/0.5)]"
      >
        {isLight ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
      </motion.span>
    </button>
  );
}

export function SettingsModal({ open, onClose, onRequestLogout }: SettingsModalProps) {
  const { user } = useAuth();
  const { theme } = useTheme();

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const displayName = user?.name?.trim() || (user?.isAnonymous ? "Guest" : "");
  const email = user?.email ?? (user?.isAnonymous ? "Guest account" : "No email on file");
  const initial = (user?.name?.[0] ?? user?.email?.[0] ?? "G").toUpperCase();
  const memberSince = formatMemberSince(user?._creationTime);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
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
            aria-label="Settings"
            className="glass-strong shine relative w-full max-w-md rounded-3xl p-6 sm:p-7"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-wistaria/15 text-wistaria">
                  <Settings2 className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold tracking-tight text-wistaria">
                    Settings
                  </h2>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    General
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-white/10"
                aria-label="Close settings"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Profile */}
            <div className="glass-panel mt-5 flex items-center gap-3.5 rounded-2xl p-4">
              <Avatar className="size-12 rounded-2xl">
                <AvatarFallback className="bg-gradient-to-br from-[#a78bfa] to-[#6d5ae8] text-base font-extrabold text-white">
                  {initial}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">
                  {displayName || "MediPro student"}
                </p>
                <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                  <Mail className="size-3 shrink-0" />
                  <span className="truncate">{email}</span>
                </p>
                <p className="mt-0.5 text-[11px] font-medium text-wistaria">
                  Member since {memberSince}
                </p>
              </div>
            </div>

            {/* Appearance */}
            <div className="glass-chip mt-3 flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5">
              <div>
                <p className="text-sm font-bold">Appearance</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {theme === "light"
                    ? "Light glass — bright & breezy"
                    : "Dark glass — calm night board"}
                </p>
              </div>
              <ThemeSwitch />
            </div>

            {/* Account */}
            <div className="mt-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onRequestLogout}
                className="w-full gap-2 border border-[#e2666f]/30 bg-[#e2666f]/10 text-[#e2666f] transition-colors hover:bg-[#e2666f]/20 hover:text-[#e2666f]"
              >
                <LogOut className="size-4" />
                Log Out
              </Button>
              <p className="mt-2.5 text-center text-[11px] leading-4 text-muted-foreground">
                Your study data stays private to your account — every topic,
                guide, and tool on GlassMed is free.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
