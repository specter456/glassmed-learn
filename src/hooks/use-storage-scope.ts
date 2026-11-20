import { useAuth } from "@/hooks/use-auth";
import {
  currentGuestSessionId,
  ensureGuestSession,
  wipeGuestSession,
} from "@/lib/account-storage";
import { useEffect, useRef, useState } from "react";

export interface StorageScope {
  /** - `"guest"`  → isolated guest session (data lives under guest_session_id)
   * - `"account"`→ signed-in student (data lives under their own user_id)
   * - `null`      → auth not resolved yet (or signed out) — read nothing
   */
  scope: "guest" | "account" | null;
  /** The active guest session id — only set when `scope === "guest"`. */
  guestId: string | null;
}

const UNKNOWN: StorageScope = { scope: null, guestId: null };

/** Resolves which storage bucket the current session may read and write.

 * Guests get a `guest_session_id` namespace stored in session storage (per tab,
 * gone when the tab closes) so no two visitors can share a bucket; email
 * accounts keep the plain keys and their Convex rows under their own `user_id`.
 * While auth is still loading this reports `null`, so callers can show their
 * loading state instead of flashing another account's numbers.
 */
export function useStorageScope(): StorageScope {
  const { isLoading, isAuthenticated, user } = useAuth();
  const [guestId, setGuestId] = useState<string | null>(
    () => currentGuestSessionId(),
  );
  const didUpdate = useRef(false);

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) {
      if (didUpdate.current && guestId !== null) {
        setGuestId(null);
      }
      didUpdate.current = true;
      return;
    }

    let next: StorageScope = UNKNOWN;
    if (user.isAnonymous) {
      ensureGuestSession();
      next = {
        scope: "guest",
        guestId: currentGuestSessionId(),
      };
    } else {
      next = { scope: "account", guestId: null };
      if (currentGuestSessionId()) {
        wipeGuestSession();
      }
    }

    didUpdate.current = true;
    if (next.guestId !== guestId) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect -- state is
         written only when the computed next state diverges from the render; the
         effect only ever writes here, never elsewhere in this render cycle. */
      setGuestId(next.guestId);
    }
  }, [isLoading, isAuthenticated, user, guestId]);

  // Return the last-computed intent, mirroring what the effect is settling to.
  if (isLoading || !isAuthenticated || !user) {
    return UNKNOWN;
  }
  if (user.isAnonymous) {
    return { scope: "guest", guestId };
  }
  return { scope: "account", guestId: null };
}
