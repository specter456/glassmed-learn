import { api } from "@/convex/_generated/api";
import { signalAuthReady } from "@/components/SplashScreen";
import {
  currentGuestSessionId,
  staleGuestState,
  wipeGuestSession,
} from "@/lib/account-storage";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { useEffect, useRef, useSyncExternalStore } from "react";
import type { NavigateFunction } from "react-router";

/* ------------------------------------------------------------------ */
/* Sign-out gate                                                       */
/*                                                                     */
/* Flipped ON the instant "Sign out" is clicked and held until the     */
/* Welcome screen has been navigated to. While it is on, the app       */
/* shell renders the boot screen instead of any route, so the previous */
/* account's dashboard can never flash on screen while the session     */
/* teardown is still in flight.                                        */
/* ------------------------------------------------------------------ */

let signingOut = false;
const signOutListeners = new Set<() => void>();

function setSigningOut(next: boolean) {
  if (signingOut === next) return;
  signingOut = next;
  for (const listener of signOutListeners) listener();
}

function subscribeSignOut(listener: () => void) {
  signOutListeners.add(listener);
  return () => {
    signOutListeners.delete(listener);
  };
}

const getSigningOutSnapshot = () => signingOut;
const getSigningOutServerSnapshot = () => false;

/** True while a sign-out teardown is in progress. */
export function useSigningOut(): boolean {
  return useSyncExternalStore(
    subscribeSignOut,
    getSigningOutSnapshot,
    getSigningOutServerSnapshot,
  );
}

/** Wipe every local + session key so no data can bleed between accounts. */
function clearStorage() {
  // Kill the guest session first: this also notifies subscribers so no
  // component keeps rendering rows that are about to disappear.
  wipeGuestSession();
  try {
    localStorage.clear();
  } catch {
    /* storage blocked */
  }
  try {
    sessionStorage.clear();
  } catch {
    /* storage blocked */
  }
}

/**
 * Full sign-out. Gates the UI immediately, tears the Convex session
 * down (bounded so a hung request can never trap the user), wipes
 * localStorage + sessionStorage, then forces a redirect to the Welcome
 * screen. Never throws — a failed signOut still ends with cleared
 * storage and a redirect.
 */
export async function signOutAndReset(
  signOut: () => Promise<void>,
  navigate: NavigateFunction,
) {
  setSigningOut(true);

  let timer = 0;
  try {
    await Promise.race([
      signOut(),
      new Promise<void>((resolve) => {
        timer = window.setTimeout(resolve, 2000);
      }),
    ]).finally(() => {
      if (timer) window.clearTimeout(timer);
    });
  } catch (error) {
    console.warn("[GlassMed] signOut failed during teardown:", error);
  }

  clearStorage();
  navigate("/", { replace: true });

  // Release the gate only after the Welcome route is committed, so the
  // protected screen underneath can never repaint first.
  window.setTimeout(() => setSigningOut(false), 60);
}
export function useAuth() {
  const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.currentUser);
  const { signIn, signOut } = useAuthActions();

  // Derive isLoading directly from the dependencies instead of managing separate state
  const isLoading = isAuthLoading || user === undefined;

  // Signal the splash screen once auth resolves, so it can dismiss early
  // on fast connections instead of waiting for the full timer.
  const wasLoading = useRef(true);
  useEffect(() => {
    if (wasLoading.current && !isLoading) {
      wasLoading.current = false;
      signalAuthReady();
    }
  }, [isLoading]);

  // Stale guest detection: if the app boots into an anonymous account whose
  // session id is not present in THIS tab (it was wiped, or this is a fresh
  // browser), that anonymous row belongs to a previous visitor. End it now
  // instead of leasing it to whoever opens the app next.
  useEffect(() => {
    if (!isAuthenticated || !user || staleGuestState.detected) return;
    if (user.isAnonymous && !currentGuestSessionId()) {
      // Best-effort cleanup — fails silently if anything is missing.
      try {
        wipeGuestSession();
        void signOut();
      } catch {
        /* storage/auth unavailable */
      }
      staleGuestState.detected = true;
    }
  }, [isAuthenticated, user, signOut]);

  // Guest sessions are temporary: when a guest closes the tab we wipe their
  // session id so the next tab/website visitor cannot inherit it, and we sign
  // the anonymous Convex account out. Signed-in email sessions are preserved.
  useEffect(() => {
    if (!isAuthenticated) return;
    const handlePageHide = () => {
      // Only tear down anonymous visitors — authenticated users keep their session.
      try {
        const userIsGuest =
          user?.isAnonymous ?? localStorage.getItem("convex-auth:is-anonymous") === "true";
        if (userIsGuest) {
          wipeGuestSession();
          void signOut();
        }
      } catch {
        /* storage unavailable */
      }
    };
    window.addEventListener("pagehide", handlePageHide);
    return () => window.removeEventListener("pagehide", handlePageHide);
  }, [isAuthenticated, user?.isAnonymous, signOut]);

  return {
    isLoading,
    isAuthenticated,
    user,
    signIn,
    signOut,
  };
}
