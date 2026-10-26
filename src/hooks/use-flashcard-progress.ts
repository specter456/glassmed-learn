import { useStorageScope } from "@/hooks/use-storage-scope";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  readGuestProgress,
  recordGuestAnswer,
  subscribeGuestProgress,
} from "@/lib/guest-progress";
import { useMutation, useQuery } from "convex/react";
import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * Scope-aware flashcard progress.
 *
 * The UI should never know whether it is talking to Convex or to the local
 * guest session — these hooks pick the right source and hand back identical
 * shapes, so a guest and a signed-in student see the exact same screens while
 * their data stays in completely separate buckets:
 *
 *  - signed-in → rows live in the `cardProgress` table under their `user_id`
 *  - guest     → rows live in localStorage under their `guest_session_id`
 */

export interface ProgressRow {
  cardId: string;
  stage: number;
  correctCount: number;
  wrongCount: number;
  nextReviewAt: number;
  lastReviewedAt: number;
}

export interface TopicSummary {
  slug: string;
  title: string;
  subject: string;
  accent: string;
  icon: string;
  total: number;
  due: number;
  done: number;
  mastered: number;
}

export interface ProgressSummary {
  dueToday: number;
  mastered: number;
  totalCards: number;
  totalAnswers: number;
  accuracy: number;
  byTopic: TopicSummary[];
}

/* --------------------------- guest rows hook -------------------------- */

const NO_GUEST_ROWS: ProgressRow[] = [];

/** Subscribes to the guest session's local rows (empty when signed in). */
function useGuestRows(active: boolean): ProgressRow[] {
  const subscribe = useCallback(
    (onChange: () => void) => (active ? subscribeGuestProgress(onChange) : () => {}),
    [active],
  );
  const getSnapshot = useCallback(
    () => (active ? readGuestProgress() : NO_GUEST_ROWS),
    [active],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/* ------------------------------ rows hook ----------------------------- */

/** All of the current session's flashcard progress (undefined = loading). */
export function useProgressRows(): ProgressRow[] | undefined {
  const { scope } = useStorageScope();
  const remote = useQuery(api.progress.myProgress);
  const guestRows = useGuestRows(scope === "guest");

  if (scope === null) return undefined;
  if (scope === "guest") return guestRows;
  return remote ?? undefined;
}

/* ---------------------------- answer hook ----------------------------- */

/**
 * Record one answer on the 1-3-7 ladder — remotely for signed-in students,
 * locally (isolated guest session) for guests. Never throws for guests.
 */
export function useRecordAnswer(): (args: {
  cardId: string;
  correct: boolean;
}) => Promise<void> {
  const { scope } = useStorageScope();
  const recordRemote = useMutation(api.progress.recordAnswer);

  return useCallback(
    async ({ cardId, correct }) => {
      if (scope === "guest") {
        recordGuestAnswer(cardId, correct);
        return;
      }
      if (scope === null) throw new Error("Not signed in yet");
      await recordRemote({ cardId: cardId as Id<"flashcards">, correct });
    },
    [scope, recordRemote],
  );
}

/* ---------------------------- summary hook ---------------------------- */

/**
 * Study summary for the home screen and deck list. Identical shape whether
 * it was computed from the database (signed-in) or from the guest session.
 * Returns undefined while auth or content is still loading.
 */
export function useProgressSummary(): ProgressSummary | undefined {
  const { scope } = useStorageScope();
  const remote = useQuery(api.progress.summary);
  const topics = useQuery(api.content.topics);
  const cards = useQuery(api.content.cardIndex);
  const guestRows = useGuestRows(scope === "guest");

  return useMemo(() => {
    if (scope === "account") return (remote ?? undefined) as
      | ProgressSummary
      | undefined;
    if (scope !== "guest" || !topics || !cards) return undefined;
    return computeGuestSummary(topics, cards, guestRows);
  }, [scope, remote, topics, cards, guestRows]);
}

/**
 * Mirrors `summary` in convex/progress.ts, but over the guest's own rows.
 * Kept as a plain function (like `isDue` in lib/medipro) so the clock is
 * read outside of render.
 */
function computeGuestSummary(
  topics: Array<{
    slug: string;
    title: string;
    subject: string;
    accent: string;
    icon: string;
    order: number;
  }>,
  cards: Array<{ _id: string; topicSlug: string }>,
  rows: ProgressRow[],
): ProgressSummary {
  const now = Date.now();
  const cardsByTopic = new Map<string, string[]>();
  for (const card of cards) {
    const list = cardsByTopic.get(card.topicSlug) ?? [];
    list.push(card._id);
    cardsByTopic.set(card.topicSlug, list);
  }
  const progressByCard = new Map(rows.map((row) => [row.cardId, row]));

  let dueToday = 0;
  let mastered = 0;
  let correctAnswers = 0;
  let totalAnswers = 0;

  const byTopic = [...topics]
    .sort((a, b) => a.order - b.order)
    .map((topic) => {
      const ids = cardsByTopic.get(topic.slug) ?? [];
      let due = 0;
      let done = 0;
      let topicMastered = 0;
      for (const id of ids) {
        const row = progressByCard.get(id);
        if (!row || row.nextReviewAt <= now) due += 1;
        if (row) done += 1;
        if (row && row.stage === 2) topicMastered += 1;
      }
      dueToday += due;
      mastered += topicMastered;
      return {
        slug: topic.slug,
        title: topic.title,
        subject: topic.subject,
        accent: topic.accent,
        icon: topic.icon,
        total: ids.length,
        due,
        done,
        mastered: topicMastered,
      };
    });

  for (const row of rows) {
    correctAnswers += row.correctCount;
    totalAnswers += row.correctCount + row.wrongCount;
  }

  return {
    dueToday,
    mastered,
    totalCards: cards.length,
    totalAnswers,
    accuracy:
      totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0,
    byTopic,
  };
}
