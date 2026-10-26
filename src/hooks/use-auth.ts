import { api } from "@/convex/_generated/api";
import { signalAuthReady } from "@/components/SplashScreen";
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

  // Sign out guest users when they close the browser so anonymous sessions
  // don't persist across visits. Username/email sessions are preserved.
  useEffect(() => {
    if (!isAuthenticated) return;
    const handleBeforeUnload = () => {
      // Only sign out anonymous users — authenticated users keep their session
      try {
        const isAnonymous = localStorage.getItem("convex-auth:is-anonymous");
        if (isAnonymous === "true") {
          // Best-effort signout on unload — may not complete but clears local state
          signOut();
        }
      } catch {
        /* storage unavailable */
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isAuthenticated, signOut]);

  return {
    isLoading,
    isAuthenticated,
    user,
    signIn,
    signOut,
  };
}
