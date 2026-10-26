import { useAuth } from "@/hooks/use-auth";
import {
  currentGuestSessionId,
  ensureGuestSession,
  wipeGuestSession,
} from "@/lib/account-storage";
import { useEffect, useState } from "react";

export interface StorageScope {
  /**
   * - `"guest"`  → isolated guest session (data lives under guest_session_id)
   * - `"account"`→ signed-in student (data lives under their own user_id)
   * - `null`     → auth not resolved yet (or signed out) — read nothing
   */
  scope: "guest" | "account" | null;
  /** The active guest session id — only set when `scope === "guest"`. */
  guestId: string | null;
}

const UNKNOWN: StorageScope = { scope: null, guestId: null };

/**
 * Resolves which storage bucket the current session may read and write.
 *
 * Guests get a `guest_session_id` namespace that is wiped on sign-out/close;
 * email accounts get their own bucket (and Convex rows under their user_id).
 * While auth is still loading this reports `null`, so callers can show their
 * loading state instead of flashing another account's numbers.
 */
export function useStorageScope(): StorageScope {
  const { isLoading, isAuthenticated, user } = useAuth();
  const [guestId, setGuestId] = useState<string | null>(() =>
    currentGuestSessionId(),
  );

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;
    if (user.isAnonymous) {
      // Guests always need an id — create one for accounts that signed in
      // before this key existed, but never rotate a live session.
      const id = ensureGuestSession();
      setGuestId((prev) => (prev === id ? prev : id));
      return;
    }
    // A signed-in account must never inherit leftover guest data.
    if (currentGuestSessionId()) {
      wipeGuestSession();
      setGuestId(null);
    }
  }, [isLoading, isAuthenticated, user]);

  if (isLoading || !isAuthenticated || !user) return UNKNOWN;

  if (user.isAnonymous) {
    // Don't report "guest" until the session id actually exists, so callers
    // keep showing their loading state instead of an empty bucket.
    return guestId ? { scope: "guest", guestId } : UNKNOWN;
  }

  return { scope: "account", guestId: null };
}
