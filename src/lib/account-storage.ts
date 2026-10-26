/**
 * Account-scoped browser storage.
 *
 * Guest data and signed-in data must NEVER touch the same keys:
 *
 *  - Every guest gets a random `guest_session_id` in localStorage the moment
 *    "Continue as Guest" is pressed. All of that guest's local progress is
 *    written under `glassmed:guest:<guest_session_id>:<base>`, so it is
 *    invisible to (and cannot collide with) an email account on the same
 *    browser.
 *  - The guest session is wiped completely — every key under its prefix plus
 *    the id itself — when the guest signs out or closes the tab.
 *  - Signed-in users keep the plain `glassmed-…` keys (and their flashcards,
 *    streaks and progress rows live in Convex under their own `user_id`).
 *
 * This module is deliberately storage-only: no React, no auth imports, so any
 * hook or lib can depend on it without creating an import cycle.
 */

export const GUEST_SESSION_ID_KEY = "glassmed-guest-session-id";
export const GUEST_KEY_PREFIX = "glassmed:guest:";

/* ------------------------------ wipe hooks ------------------------------ */

type WipeListener = () => void;
const wipeListeners = new Set<WipeListener>();

/** Register a callback fired right after a guest session is wiped. */
export function onGuestSessionWiped(listener: WipeListener): () => void {
  wipeListeners.add(listener);
  return () => {
    wipeListeners.delete(listener);
  };
}

/* ---------------------------- session id ------------------------------- */

/**
 * In-memory stand-in for the session id when localStorage is unavailable
 * (sandboxed preview iframes throw SecurityError on access). Guest progress
 * then lives only for this page session — still isolated, still wiped on
 * sign-out — instead of stranding the guest on a loading screen.
 */
let volatileGuestId: string | null = null;

/** The current guest session id, or null when no guest session is active. */
export function currentGuestSessionId(): string | null {
  try {
    return localStorage.getItem(GUEST_SESSION_ID_KEY);
  } catch {
    return volatileGuestId;
  }
}

function newSessionId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through */
  }
  return `g-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Start a brand-new guest session: wipes whatever guest data is left over,
 * then mints a fresh id. Called when "Continue as Guest" is pressed so every
 * guest always begins with a clean slate.
 */
export function beginGuestSession(): string {
  wipeGuestSession();
  const id = newSessionId();
  try {
    localStorage.setItem(GUEST_SESSION_ID_KEY, id);
    volatileGuestId = null;
  } catch {
    // storage blocked — keep the session in memory for this page's lifetime
    volatileGuestId = id;
  }
  return id;
}

/**
 * Make sure an anonymous (guest) account has a session id, creating one only
 * if it is missing — used to upgrade guests that signed in before this key
 * existed, without ever rotating (and therefore losing) their live session.
 */
export function ensureGuestSession(): string | null {
  const existing = currentGuestSessionId();
  if (existing) return existing;
  const id = newSessionId();
  try {
    localStorage.setItem(GUEST_SESSION_ID_KEY, id);
    return id;
  } catch {
    volatileGuestId = id;
    return id;
  }
}

/** Remove the guest session id plus every key namespaced under it. */
export function wipeGuestSession(): void {
  const id = currentGuestSessionId();
  volatileGuestId = null;
  try {
    if (id) {
      const prefix = `${GUEST_KEY_PREFIX}${id}:`;
      const doomed: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) doomed.push(key);
      }
      for (const key of doomed) localStorage.removeItem(key);
    }
    localStorage.removeItem(GUEST_SESSION_ID_KEY);
  } catch {
    /* storage blocked — nothing persisted to wipe */
  }
  for (const listener of [...wipeListeners]) {
    try {
      listener();
    } catch {
      /* a broken listener must never block the wipe */
    }
  }
}

/* ------------------------------ scoped keys ---------------------------- */

/**
 * Resolve a logical progress key to its real storage key.
 * Guest active → namespaced under the guest session id; otherwise plain.
 */
export function scopedKey(base: string): string {
  const id = currentGuestSessionId();
  return id ? `${GUEST_KEY_PREFIX}${id}:${base}` : base;
}

/** localStorage wrapper that automatically isolates guest data. */
export const scopedStorage = {
  getItem(base: string): string | null {
    try {
      return localStorage.getItem(scopedKey(base));
    } catch {
      return null;
    }
  },
  setItem(base: string, value: string): void {
    try {
      localStorage.setItem(scopedKey(base), value);
    } catch {
      /* storage blocked */
    }
  },
  removeItem(base: string): void {
    try {
      localStorage.removeItem(scopedKey(base));
    } catch {
      /* storage blocked */
    }
  },
};

/** JSON helper on top of {@link scopedStorage} — never throws. */
export function readScopedJSON<T>(base: string, fallback: T): T {
  try {
    const raw = scopedStorage.getItem(base);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** JSON helper on top of {@link scopedStorage} — never throws. */
export function writeScopedJSON(base: string, value: unknown): void {
  try {
    scopedStorage.setItem(base, JSON.stringify(value));
  } catch {
    /* storage blocked */
  }
}
