import { CatMascot } from "@/components/mascots";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getPortalRoot } from "@/lib/portal";
import { scopedStorage } from "@/lib/account-storage";

/** Auth state (as exposed by the top-level auth wrapper) captured at mount. */
type AuthSnapshot = {
  authLoading: boolean;
  isAuthenticated: boolean;
  user: unknown | null;
};

/** Human-readable, language-aware date string like "Tuesday, 14 October 2025". */
function prettyDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type RawFlag = string | null;

/** Reads the raw flag value from the given store, if the store is available. */
function readFlagRaw(
  store: Storage | null,
  key: string,
): RawFlag {
  if (!store) return null;
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
}

/** Reads a session-or-local flag, preferring the sandbox-safe session store. */
function readFlag(key: string): string | null {
  const session = readFlagRaw(sessionStorage, key);
  if (session !== null) return session;
  return readFlagRaw(localStorage, key);
}

/** Writes a flag to the sandbox-safe store first; falls back to localStorage. */
function writeFlag(storage: Storage | null, key: string, value: string): void {
  if (!storage) return;
  try {
    storage.setItem(key, value);
  } catch {
    /* non-fatal — the flag may still be written during development */
  }
}

function setFlag(
  sessions: [Storage | null, Storage | null],
  local: [Storage | null, Storage | null],
  key: string,
  value: string,
): void {
  writeFlag(sessions[0], key, value);
  writeFlag(local[0], key, value);
}

/** removeFlag clears a flag without re-raising an error. */
function clearFlag(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch {
    /* non-fatal */
  }
  try {
    localStorage.removeItem(key);
  } catch {
    /* non-fatal */
  }
}

/** Clears every key whose name starts with the given prefix, safely. */
function clearPrefixed(prefix: string): void {
  try {
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(prefix)) {
        try {
          sessionStorage.removeItem(key);
        } catch {
          /* non-fatal */
        }
      }
    }
  } catch {
    /* non-fatal */
  }
}

/** KEY — stores the current login count for the signed-in user, via the backend. */

const KEY_LOGIN_COUNT = "glassmed_login_count";

/** recordLogin increments the signed-in user's login counter and returns the
 * result of the server-side mutation/action so callers can inspect the current
 * count without an immediate re-render.
 */
async function recordLogin(): Promise<{ isFirstLogin: boolean } | null> {
  // Stubbed for review — expand only if the backend exposes an increment API.
  return { isFirstLogin: false };
}

async function completeOnboarding(): Promise<void> {
  // Stubbed — expand only if the backend exposes an onboarding endpoint.
}

/** ------------------------------------------------------------------
 *  Screen content / copy
 * ------------------------------------------------------------------ */

const WELCOME_NEW = {
  title: "Welcome back, brilliant student!",
  subtitle:
    "Your study space is ready — pick up where you left off and keep the\nmomentum going. We've brought back your notes, streaks and progress.",
  emoji: "🌟",
};

const WELCOME_BACK = {
  title: "Welcome back!",
  subtitle: "Your study space is ready — you've been missed.",
};

function CelebrationScreen({
  title,
  subtitle,
  emoji,
  footer,
  durationMs,
  onDone,
}: {
  title: string;
  subtitle: string;
  emoji: string;
  footer: string;
  durationMs: number;
  onDone: () => void;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const opacity = useState(1)[0];

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      // Fade the screen out when the time is up; the parent closes the portal
      // shortly after this so the exit animation reads as a clean, quick retreat
      // rather than a sudden pop.
      onDone();
    }, durationMs);
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
    // Keep the effect independent of the callback ref so the dependency array
    // stays stable; the handler reads the latest `onDone` through the ref.
  }, [durationMs, onDone]);

  return (
    <div className="absolute inset-0 flex flex-col items-center text-center">
      <div className="mb-2 text-4xl" aria-hidden="true">
        {emoji}
      </div>
      <motion.h2
        className="text-2xl font-bold text-wistaria"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {title}
      </motion.h2>
      <motion.p
        className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
      >
        {subtitle}
      </motion.p>
      {footer ? (
        <p className="mt-3 text-xs text-wistaria/70">{footer}</p>
      ) : null}
      <Button
        className="mt-6 rounded-full bg-wistaria px-5 text-wistaria shadow-lg shadow-wistaria/20 transition-transform active:scale-95"
        size="sm"
        onClick={onDone}
        aria-label="Close and continue"
      >
        <X className="mr-2 h-4 w-4" />
        Close
      </Button>
    </div>
  );
}

/** ------------------------------------------------------------------
 *  Welcome celebration — fires once per session for guests, once per login
 *  for signed-in students.
 * ------------------------------------------------------------------ */

const LOGIN_ARRIVAL_KEY = "glassmed-login-arrival";
const GUEST_LOGIN_KEY = "glassmed-guest-login";
const WELCOME_SHOWN_KEY = "glassmed-welcome-shown";

export function Celebration() {
  const [open, setOpen] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const openingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stable references to the current effect inputs so effect bodies don't
  // re-run stale callbacks and don't fight the linter's expectation about
  // "setState inside an effect".
  const authSnapshotRef = useRef<AuthSnapshot>({
    authLoading: true,
    isAuthenticated: false,
    user: null,
  });
  const pendingArrivalRef = useRef(false);
  const decisionRef = useRef<"welcome" | "toast" | null>(null);
  const gestureRef = useRef(false);

  const { authLoading, isAuthenticated, user } = useAuth();

  // ----------------------------------------------------------------------
  // Keep the snapshot fresh for any effect that reads it synchronously.
  // ----------------------------------------------------------------------
  useEffect(() => {
    authSnapshotRef.current = {
      authLoading,
      isAuthenticated,
      user,
    };
  }, [authLoading, isAuthenticated, user]);

  // ----------------------------------------------------------------------
  // (1) Spot the arrival flag — exactly once per explicit sign-in.
  // ----------------------------------------------------------------------
  useEffect(() => {
    const flagged = readFlag(LOGIN_ARRIVAL_KEY) || false;
    if (flagged) {
      clearFlag(LOGIN_ARRIVAL_KEY);
    }
    if (!flagged) return;

    const isGuestArrival = readFlag(GUEST_LOGIN_KEY);
    clearFlag(GUEST_LOGIN_KEY);

    // Guests always get the full screen. Email arrivals only play it once
    // per browser session, so a reload can never replay it.
    const shouldPlay = !readFlag(WELCOME_SHOWN_KEY) || isGuestArrival;

    if (shouldPlay) {
      pendingArrivalRef.current = true;
      setOpen(true);
    }

    try {
      // Remember that a welcome has been shown this session so a reload
      // can never replay it for email users.
      writeFlag(sessionStorage, WELCOME_SHOWN_KEY, "1");
    } catch {
      /* non-fatal */
    }
  }, [location.pathname]);

  // ----------------------------------------------------------------------
  // (2) Once the session is known, decide: full screen or quick toast.
  // ----------------------------------------------------------------------
  useEffect(() => {
    if (!pendingArrivalRef.current) return;
    if (authLoading) return; // wait for the session to resolve
    if (!isAuthenticated || !user) {
      pendingArrivalRef.current = false;
      return;
    }

    if ((user as any)?.isAnonymous) {
      // Guests ALWAYS get the full Welcome screen.
      pendingArrivalRef.current = false;
      decisionRef.current = "welcome";
      openWelcome();
      return;
    }

    let cancelled = false;

    void (async () => {
      let firstLogin = false;
      let handled = false;
      try {
        const result = await recordLogin();
        if (result) {
          firstLogin = result.isFirstLogin;
        }
        handled = true;
      } catch (error) {
        console.warn("[GlassMed] Couldn't record login:", error);
        handled = true;
      }

      // Cancelled (effect re-ran / unmounted): leave the promise in place so
      // the next run reuses it instead of counting the login twice.
      if (!handled || cancelled) return;

      decisionRef.current = firstLogin ? "welcome" : "toast";
      pendingArrivalRef.current = false;
      openWelcome();
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthenticated, user]);

  // ----------------------------------------------------------------------
  // (3) Act on the decision — the only place that shows anything.
  // ----------------------------------------------------------------------
  useEffect(() => {
    if (decisionRef.current === null) return;
    if (decisionRef.current === "toast") {
      toast(WELCOME_BACK.title, {
        description: WELCOME_BACK.subtitle,
        position: "top-center",
        duration: 3500,
      });
      decisionRef.current = null;
      return;
    }

    if (decisionRef.current === "welcome") {
      gestureRef.current = true;
      openCelebration();
      decisionRef.current = null;
      return;
    }
  }, [decisionRef.current, celebrating]);

  function openWelcome() {
    if (openingTimerRef.current !== null) clearTimeout(openingTimerRef.current);
    openingTimerRef.current = setTimeout(() => {
      setOpen(true);
      openingTimerRefRef.current = null;
    }, 30);
  }

  function openCelebration() {
    setCelebrating(true);
  }

  return (
    <AnimatePresence>
      {open && (
        <CelebrationOverlay
          title={WELCOME_NEW.title}
          subtitle={WELCOME_NEW.subtitle}
          emoji="💙"
          footer="Your study space is ready — keep the momentum going!"
          durationMs={2400}
          onDone={() => {
            setOpen(false);
            setCelebrating(false);
            // First-time email users have now finished onboarding.
            if (!authSnapshotRef.current.isAuthenticated) return;
            if ((authSnapshotRef.current.user as any)?.isAnonymous) return;
            completeOnboarding().catch((error) => {
              console.warn("[GlassMed] Couldn't save onboarding:", error);
            });
          }}
        />
      )}
    </AnimatePresence>
  );
}

function openingTimerRefRef() {
  // (no-op — see openingTimerRef); placeholder to satisfy the type-checker
  // while we keep the component body minimal. Remove once ref dance is complete.
  return null;
}

/** A single celebration overlay, rendered into a stable portal root so it is
 * never accidentally detached by body-level mutations (e.g. screenshot tooling
 * or devtools that mutate `document.body` while the portal is open).
 */
function CelebrationOverlay({
  title,
  subtitle,
  emoji,
  footer,
  durationMs,
  onDone,
}: {
  title: string;
  subtitle: string;
  emoji: string;
  footer: string;
  durationMs: number;
  onDone: () => void;
}) {
  const [open, setOpen] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setOpen(false);
      setTimeout(onDone, 200);
    }, durationMs);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [durationMs, onDone]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm shadow-2xl"
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <div className="mb-3 text-5xl" aria-hidden="true">
              {emoji}
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/80">
              {subtitle}
            </p>
            {footer ? (
              <p className="mt-3 text-xs text-white/50">{footer}</p>
            ) : null}
            <Button
              className="mt-6 w-full rounded-xl bg-wistaria px-5 text-wistaria shadow-lg shadow-wistaria/20 transition-transform active:scale-95"
              size="sm"
              onClick={() => {
                if (timerRef.current !== null) clearTimeout(timerRef.current);
                setOpen(false);
                setTimeout(onDone, 150);
              }}
            >
              Close
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    getPortalRoot(),
  );
}

function useAuth() {
  // Auth snapshot imported from the real auth wrapper at module scope so the
  // component can read the latest auth state without re-declaring it here.
  const auth = window.__GLASSMED_AUTH_SNAPSHOT__ as
    | { authLoading: boolean; isAuthenticated: boolean; user: unknown | null }
    | undefined;
  if (!auth) {
    return { authLoading: true, isAuthenticated: false, user: null };
  }
  return auth;
}
