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

  return {
    isLoading,
    isAuthenticated,
    user,
    signIn,
    signOut,
  };
}
