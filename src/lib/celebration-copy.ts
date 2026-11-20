/**
 * Shared copy + flag helpers for the celebration screens.
 *
 * Kept out of `components/Celebration.tsx` so that module only exports React
 * components (React Fast Refresh requires that), while these values can be
 * imported by any page.
 */

export const WELCOME_SIGNIN = {
  title: "Welcome back!",
  subtitle: "Your study space is ready — you've been missed.",
  emoji: "📚",
};

export const ROUND_COMPLETE_TITLES: Record<string, string> = {
  Low: "Shift over",
  Mid: "Shift over",
  High: "Shift over",
  Max: "Perfect shift",
};

export function pickMessage<T extends string[] | Record<string, string>>(
  collection: T,
  index: number,
): string {
  if (Array.isArray(collection)) {
    return collection[index % collection.length] ?? collection[0] ?? "";
  }
  const keys = Object.keys(collection);
  return collection[keys[index % keys.length]] ?? collection[keys[0]] ?? "";
}

export const QUIZ_PRAISE: Record<string, string> = {
  Zero: "Careful — the patient doesn't forgive, and neither does this score.",
  One: "One down. Try not to make it a highlight reel.",
  Two: "Decent. Your patient is grateful and mildly impressed.",
  Three: "Solid. You didn't kill anyone today.",
  Four: "Getting sharp. Your patient is now loyal to you.",
  Five: "Patient saved, squad impressed. You're basically a rookie hero.",
};

export const FLASHCARD_WINS: Record<string, string> = {
  Zero: "Cards mastered: 0. The deck is winning today.",
  One: "One card tamed. The deck notices.",
  Two: "Two cards — the deck is starting to respect you.",
  Three: "Three mastered. The deck is nervous.",
  Four: "Four. The deck has officially met its match.",
  Five: "Five? The deck is filing a complaint.",
  Six: "Six cards — the deck is drafting your biography.",
  Seven: "Seven. The deck is considering a promotion for you.",
  Eight: "Eight mastered. The deck is losing sleep.",
  Nine: "Nine — the deck is drafting your retirement speech.",
  Ten: "Ten cards. That's not a study session, that's a takeover.",
};

/* ------------------------ login arrival flags ------------------------ */

export const LOGIN_ARRIVAL_KEY = "glassmed-login-arrival";
export const GUEST_LOGIN_KEY = "glassmed-guest-login";
export const WELCOME_SHOWN_KEY = "glassmed-welcome-shown";

/** Flag the upcoming route change as a fresh sign-in (guest or email). */
export function markLoginArrival(isGuest: boolean) {
  try {
    sessionStorage.setItem(LOGIN_ARRIVAL_KEY, "1");
    if (isGuest) {
      try {
        sessionStorage.setItem(GUEST_LOGIN_KEY, "1");
      } catch {
        /* non-fatal */
      }
    } else {
      try {
        sessionStorage.removeItem(GUEST_LOGIN_KEY);
      } catch {
        /* non-fatal */
      }
    }
  } catch {
    /* non-fatal */
  }
}
