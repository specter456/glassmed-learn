/**
 * Guest flashcard progress — the temporary, isolated copy of the 1-3-7
 * spaced-repetition ladder that guests earn while browsing as a guest.
 *
 * Signed-in students keep their rows in Convex under their own `user_id`
 * (see convex/progress.ts). Guests never write to the database: their rows
 * live in localStorage under their `guest_session_id`, and disappear the
 * moment the guest signs out or closes the tab.
 *
 * The ladder below mirrors `recordAnswer` in convex/progress.ts exactly, so
 * a guest and a signed-in student follow identical rules:
 *   correct -> advance one stage (0 → 1 → 2 = mastered)
 *   wrong   -> back to stage 0, due again in 1 day
 */

import {
  currentGuestSessionId,
  onGuestSessionWiped,
  scopedStorage,
} from "@/lib/account-storage";
import { INTERVAL_DAYS } from "@/lib/medipro";

const PROGRESS_BASE = "flashcard-progress";
const DAY_MS = 24 * 60 * 60 * 1000;

export interface GuestProgressRow {
  cardId: string;
  stage: number;
  correctCount: number;
  wrongCount: number;
  nextReviewAt: number;
  lastReviewedAt: number;
}

/* --------------------------- external store --------------------------- */

let cache: { id: string | null; rows: GuestProgressRow[] } | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of [...listeners]) listener();
}

function load(): GuestProgressRow[] {
  // No active guest session → there is no bucket to read from. Never fall
  // back to plain keys: that is exactly where signed-in data lives.
  const id = currentGuestSessionId();
  if (!id) {
    cache = null;
    return [];
  }
  if (cache && cache.id === id) return cache.rows;

  let rows: GuestProgressRow[] = [];
  try {
    const raw = scopedStorage.getItem(PROGRESS_BASE);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) rows = parsed as GuestProgressRow[];
    }
  } catch {
    rows = [];
  }
  cache = { id, rows };
  return rows;
}

function persist(rows: GuestProgressRow[]): void {
  cache = { id: currentGuestSessionId(), rows };
  writeRows(rows);
  emit();
}

function writeRows(rows: GuestProgressRow[]): void {
  try {
    scopedStorage.setItem(PROGRESS_BASE, JSON.stringify(rows));
  } catch {
    /* storage blocked — progress stays in memory for this session */
  }
}

// A wiped guest session must invalidate the cache and notify subscribers so
// no component keeps rendering the deleted rows.
onGuestSessionWiped(() => {
  cache = null;
  emit();
});

/* -------------------------------- API --------------------------------- */

/** Current guest rows (empty when no guest session is active). */
export function readGuestProgress(): GuestProgressRow[] {
  return load();
}

export function subscribeGuestProgress(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Apply one answer to the guest's local 1-3-7 ladder. */
export function recordGuestAnswer(cardId: string, correct: boolean): void {
  // Without a guest session there is no isolated bucket to write to — never
  // fall back to the shared (signed-in) keys.
  if (!currentGuestSessionId()) return;

  const rows = load();
  const existing = rows.find((row) => row.cardId === cardId);
  const now = Date.now();
  const stage = correct ? Math.min((existing?.stage ?? -1) + 1, 2) : 0;
  const nextReviewAt = now + INTERVAL_DAYS[stage] * DAY_MS;

  const next: GuestProgressRow[] = existing
    ? rows.map((row) =>
        row.cardId === cardId
          ? {
              ...row,
              stage,
              correctCount: row.correctCount + (correct ? 1 : 0),
              wrongCount: row.wrongCount + (correct ? 0 : 1),
              nextReviewAt,
              lastReviewedAt: now,
            }
          : row,
      )
    : [
        ...rows,
        {
          cardId,
          stage,
          correctCount: correct ? 1 : 0,
          wrongCount: correct ? 0 : 1,
          nextReviewAt,
          lastReviewedAt: now,
        },
      ];

  persist(next);
}
