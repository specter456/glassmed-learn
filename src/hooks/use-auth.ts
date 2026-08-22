import { api } from "@/convex/_generated/api";
import { signalAuthReady } from "@/components/SplashScreen";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { useEffect, useRef } from "react";

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
