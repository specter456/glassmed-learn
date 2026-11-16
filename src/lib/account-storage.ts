/**
 * Account-scoped browser storage.
 *
 * Guest data and signed-in data must NEVER touch the same keys.
 *
 *  - A guest gets a fresh, random `guest_session_id` the moment "Continue as
 *    Guest" is pressed. That id is stored in SESSION storage (per browser tab,
 *    gone when the tab closes) so it can never be picked up by the next person
 *    who opens the app on the same machine. The same id is minted every time a
 *    tab is reopened so refresh does not lose guest data mid-session.
 *  - All guest-local progress (flashcards, streaks, bookmarks) is written under
 *    `glassmed:guest:<guest_session_id>:<base>` so it is invisible to — and
 *    cannot collide with — an email account or another guest on the same
 *    browser.
 *  - A guest never writes to the shared Convex database: their progress lives
 *    only in this tab's session storage and disappears the moment they sign out
 *    or close the tab. (Signed-in students keep their cards, streaks and
 *    progress rows in Convex under their own `user_id`.)
 *  - The guest session is wiped completely — every key under its prefix plus
 *    the id itself — when the guest signs out. On load, a leftover anonymous
 *    account with no live session id is detected as a stale visitor and ended,
 *    so the next person always starts blank.
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

/**
 * A leftover anonymous account (from a previous visitor) without a live
 * session id in this tab is a stale visitor — it must not keep using their old
 * guest bucket.
 */
export const staleGuestState = { detected: true };

/**
 * In-memory stand-in for the per-tab guest id when session/local storage is
 * unavailable (sandboxed preview iframes throw on access). Guest progress then
 * lives only for this page session — still isolated, still wiped on sign-out.
 */
let volatileGuestId: string | null = null;

/* ---------------------------- session id ------------------------------- */

/** Per-tab guest session id, or null when no guest session is active.
 *
 * Session storage is used (not localStorage) so the id dies with the tab — two
 * different people on the same browser get two different ids.
 */
export function currentGuestSessionId(): string | null {
  try {
    return sessionStorage.getItem(GUEST_SESSION_ID_KEY);
  } catch {
    return volatileGuestId;
  }
}

function newSessionId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return `guest_${crypto.randomUUID()}`;
    }
  } catch {
    /* fall through */
  }
  return `guest_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Start a brand-new guest session: wipes any leftover guest data, mints a
 * fresh per-tab id, and resets the stale-account gate. Called when "Continue as
 * Guest" is pressed so every guest — and every reopen — starts with a clean
 * slate.
 */
export function beginGuestSession(): string {
  wipeGuestSession();
  const id = newSessionId();
  try {
    sessionStorage.setItem(GUEST_SESSION_ID_KEY, id);
    volatileGuestId = null;
    staleGuestState.detected = false;
  } catch {
    volatileGuestId = id;
    staleGuestState.detected = false;
  }
  return id;
}

/**
 * Refresh a tab's guest session id on reopen. If the tab had a session id from
 * the last session, reuse it (so refresh keeps working); otherwise mint a brand-
 * new one. Never ties the new tab to some old, stale id.
 */
export function ensureGuestSession(): string | null {
  const existing = currentGuestSessionId();
  if (existing) return existing;
  const id = newSessionId();
  try {
    sessionStorage.setItem(GUEST_SESSION_ID_KEY, id);
    volatileGuestId = null;
  } catch {
    volatileGuestId = id;
  }
  return id;
}

/**
 * Fully clear the active guest session: id + every namespaced guest key, from
 * both session storage and any legacy localStorage leftovers.
 *
 * Broad enough to also cover keys created under older key shapes, and under
 * both stores, so there is nothing left to collide.
 */
export function wipeGuestSession(): void {
  volatileGuestId = null;
  try {
    const doomedSession: string[] = [];
    const doomedLocal: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(GUEST_KEY_PREFIX)) doomedSession.push(key);
    }
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(GUEST_KEY_PREFIX)) doomedLocal.push(key);
    }
    for (const key of doomedSession) sessionStorage.removeItem(key);
    for (const key of doomedLocal) localStorage.removeItem(key);
    sessionStorage.removeItem(GUEST_SESSION_ID_KEY);
    localStorage.removeItem(GUEST_SESSION_ID_KEY);
  } catch {
    /* storage blocked */
  }
  for (const listener of [...wipeListeners]) {
    try {
      listener();
    } catch {
      /* a broken listener must never block the wipe */
    }
  }
      staleGuestState.detected = true;
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

/** Scope-aware store: session storage for the active guest, localStorage otherwise. */
export const scopedStorage = {
  getItem(base: string): string | null {
    const id = currentGuestSessionId();
    if (id) {
      try {
        return sessionStorage.getItem(`${GUEST_KEY_PREFIX}${id}:${base}`);
      } catch {
        return null;
      }
    }
    try {
      return localStorage.getItem(base);
    } catch {
      return null;
    }
  },
  setItem(base: string, value: string): void {
    const id = currentGuestSessionId();
    if (id) {
      try {
        sessionStorage.setItem(`${GUEST_KEY_PREFIX}${id}:${base}`, value);
      } catch {
        /* storage blocked */
      }
      return;
    }
    try {
      localStorage.setItem(base, value);
    } catch {
      /* storage blocked */
    }
  },
  removeItem(base: string): void {
    const id = currentGuestSessionId();
    if (id) {
      try {
        sessionStorage.removeItem(`${GUEST_KEY_PREFIX}${id}:${base}`);
      } catch {
        /* storage blocked */
      }
      return;
    }
    try {
      localStorage.removeItem(base);
    } catch {
      /* storage blocked */
    }
  },
};

/**
 * JSON helpers on top of {@link scopedStorage} — not exported; the consuming
 * modules inline the try/catch themselves.
 *
 * @(private)
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
function readScopedJSON<T>(base: string, fallback: T): T {
  try {
    const raw = scopedStorage.getItem(base);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeScopedJSON(base: string, value: unknown): void {
  try {
    scopedStorage.setItem(base, JSON.stringify(value));
  } catch {
    /* storage blocked */
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */
