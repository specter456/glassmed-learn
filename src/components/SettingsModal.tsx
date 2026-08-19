import { InstallModal } from "@/components/InstallModal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Puppy, type PuppyMood } from "@/components/Puppy";
import { VoiceRecorderModal } from "@/components/VoiceRecorderModal";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/lib/theme";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Download,
  Headphones,
  LogOut,
  Mail,
  Moon,
  RotateCcw,
  Settings2,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

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

/** Which settings row is currently hovered — drives the puppy's reaction. */
type HoverKey = "profile" | "appearance" | "voice" | "install" | "reset" | "logout";

const HOVER_MOOD: Record<HoverKey, PuppyMood> = {
  profile: "happy",
  appearance: "curious",
  voice: "listening",
  install: "excited",
  reset: "happy",
  logout: "crying",
};

const HOVER_CAPTION: Record<HoverKey, string> = {
  profile: "That's you — my favorite student! ✨",
  appearance: "Ooh, curious about a brighter glass? 😮",
  voice: "Shh… I'm all ears! 🎧",
  install: "Yes! Take me everywhere! 📲",
  reset: "A fresh start — the bee will visit again! 🐝",
  logout: "Don't leave me… 🥺",
};

const WELCOME_CAPTION = "Hey there! 👋 Manage your settings here!";

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

/** A settings row — hovering it makes the puppy react. */
function SettingsRow({
  icon,
  title,
  subtitle,
  onHover,
  onLeave,
  onClick,
  right,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onHover: () => void;
  onLeave: () => void;
  onClick?: () => void;
  right?: React.ReactNode;
}) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      className="glass-chip flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-left transition-transform duration-200 hover:scale-[1.015]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-wistaria/15 text-wistaria">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold">{title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {right}
    </Comp>
  );
}

export function SettingsModal({ open, onClose, onRequestLogout }: SettingsModalProps) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [hover, setHover] = useState<HoverKey | null>(null);
  const [installOpen, setInstallOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);

  // Every way out of the modal resets the puppy to its welcome state, so
  // reopening always starts fresh (no setState inside an effect).
  const handleClose = useCallback(() => {
    setHover(null);
    setInstallOpen(false);
    setVoiceOpen(false);
    onClose();
  }, [onClose]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  /** Clear the first-time onboarding markers so the bee tour, splash screen and
   *  welcome celebration can be experienced again (for testing / re-onboarding).
   *  Storage can throw in sandboxed preview iframes — clear what we can. */
  const handleResetTutorial = () => {
    const keys = [
      "glassmed-bee-tutorial-done", // localStorage — bee tour
      "glassmed-last-login", // localStorage — "Welcome" vs "Welcome back"
      "medipro-splash-seen", // sessionStorage — splash (legacy)
      "glassmed-welcome-shown", // sessionStorage — welcome once-per-session
      "glassmed-login-just-arrived", // sessionStorage + localStorage — arrival flag
    ];
    for (const key of keys) {
      try {
        localStorage.removeItem(key);
      } catch {
        /* ignore */
      }
      try {
        sessionStorage.removeItem(key);
      } catch {
        /* ignore */
      }
    }
    toast("First-time tutorial reset 🐝", {
      description:
        "Log out, then open the login page again to meet the bee and replay the welcome.",
    });
  };

  const mood = hover ? HOVER_MOOD[hover] : "worried";
  const caption = hover ? HOVER_CAPTION[hover] : WELCOME_CAPTION;

  const displayName = user?.name?.trim() || (user?.isAnonymous ? "Guest" : "");
  const email = user?.email ?? (user?.isAnonymous ? "Guest account" : "No email on file");
  const initial = (user?.name?.[0] ?? user?.email?.[0] ?? "G").toUpperCase();
  const memberSince = formatMemberSince(user?._creationTime);

  return (
    <>
      {createPortal(
        <AnimatePresence>
          {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Settings"
            className="glass-strong shine relative w-full max-w-md overflow-y-auto rounded-3xl p-6 sm:p-7"
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
                onClick={handleClose}
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-white/10"
                aria-label="Close settings"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Mascot — the puppy greets you and reacts to every row */}
            <div className="glass-panel mt-5 flex flex-col items-center rounded-2xl px-4 pb-4 pt-5 text-center">
              <div
                className="relative"
                role="img"
                aria-label="GlassMed puppy mascot"
              >
                {/* soft glow behind the puppy */}
                <div className="pointer-events-none absolute -inset-4 rounded-full bg-[#a78bfa]/25 blur-2xl" />
                <Puppy mood={mood} size={112} />
              </div>

              {/* Speech bubble */}
              <div className="relative mt-3 w-full max-w-[19rem]">
                <div className="pointer-events-none absolute -top-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 bg-white/10" />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={caption}
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.97 }}
                    transition={{ duration: 0.22 }}
                    className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-semibold leading-5 text-foreground"
                  >
                    {caption}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Install App — prominent, right at the top so it's seen immediately */}
            <button
              onClick={() => setInstallOpen(true)}
              onMouseEnter={() => setHover("install")}
              onMouseLeave={() => setHover(null)}
              className="group relative mt-5 flex w-full items-center justify-between gap-3 overflow-hidden rounded-2xl border border-[#78A2D2]/30 bg-gradient-to-r from-[#78A2D2]/20 via-[#a2a2d0]/20 to-[#feffaf]/15 px-4 py-4 text-left transition-transform duration-200 hover:scale-[1.015]"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#78A2D2]/25 blur-2xl" />
              <div className="relative flex items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#78A2D2] to-[#a2a2d0] text-white shadow-[0_10px_22px_-10px_rgba(120,162,210,0.9)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Download className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-extrabold">Install App</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Add to Home Screen — works offline
                  </p>
                </div>
              </div>
              <ArrowRight className="relative size-4 shrink-0 text-wistaria transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            {/* Profile */}
            <div
              className="glass-panel mt-3 flex items-center gap-3.5 rounded-2xl p-4 transition-transform duration-200 hover:scale-[1.015]"
              onMouseEnter={() => setHover("profile")}
              onMouseLeave={() => setHover(null)}
            >
              <Avatar className="size-12 rounded-2xl">
                <AvatarFallback className="bg-gradient-to-br from-[#a78bfa] to-[#6d5ae8] text-base font-extrabold text-white">
                  {initial}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 truncate text-sm font-bold">
                  <UserRound className="size-3.5 shrink-0 text-wistaria" />
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
            <div className="mt-3">
              <SettingsRow
                icon={<Moon className="size-4" />}
                title="Appearance"
                subtitle={
                  theme === "light"
                    ? "Light glass — bright & breezy"
                    : "Dark glass — calm night board"
                }
                onHover={() => setHover("appearance")}
                onLeave={() => setHover(null)}
                right={<ThemeSwitch />}
              />
            </div>

            {/* Voice notes — a real audio recorder, fully separate from the AI chat */}
            <div className="mt-3">
              <SettingsRow
                icon={<Headphones className="size-4" />}
                title="Voice Notes"
                subtitle="Record & play back your study memos"
                onHover={() => setHover("voice")}
                onLeave={() => setHover(null)}
                onClick={() => setVoiceOpen(true)}
              />
            </div>

            {/* Reset first-time tutorial — lets you replay the bee welcome tour */}
            <div className="mt-3">
              <SettingsRow
                icon={<RotateCcw className="size-4" />}
                title="Reset First-Time Tutorial"
                subtitle="Replay the bee welcome tour & splash"
                onHover={() => setHover("reset")}
                onLeave={() => setHover(null)}
                onClick={handleResetTutorial}
              />
            </div>

            {/* Account */}
            <div className="mt-3">
              <Button
                type="button"
                variant="ghost"
                onMouseEnter={() => setHover("logout")}
                onMouseLeave={() => setHover(null)}
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
        </AnimatePresence>,
        document.body,
      )}
      <InstallModal open={installOpen} onClose={() => setInstallOpen(false)} />
      <VoiceRecorderModal open={voiceOpen} onClose={() => setVoiceOpen(false)} />
    </>
  );
}
