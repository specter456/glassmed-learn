import { describe, expect, it } from "bun:test";
import { buildStudyQueue, isDue, selectNextCard } from "../src/lib/medipro";

/** Minimal card shape used across the session tests. */
interface TestCard {
  _id: string;
  front: string;
}

type Progress = { nextReviewAt?: number } | null | undefined;

const CARDS: TestCard[] = ["a", "b", "c", "d", "e", "f"].map((id) => ({
  _id: id,
  front: `card ${id}`,
}));

function progressByCard(
  progress: Record<string, Progress>,
): Map<string, Progress> {
  return new Map(Object.entries(progress));
}

/**
 * Simulates one full study session the way the UI drives it:
 *  - the queue is rebuilt (reactively) after every answer, exactly like the
 *    Convex `progress` query re-sync does,
 *  - the next card is chosen by identity via `selectNextCard`,
 *  - answering "correct" makes the card not-due, which re-sorts it to the back
 *    of the rebuilt queue (the historical cause of skipped cards).
 *
 * Returns the order in which cards were presented.
 */
function simulateSession(
  cards: TestCard[],
  initialProgress: Record<string, Progress>,
  answers: boolean[],
): string[] {
  const answeredIds = new Set<string>();
  const order: string[] = [];
  let progress = progressByCard(initialProgress);

  while (order.length < answers.length) {
    const queue = buildStudyQueue(cards, progress);
    const current = selectNextCard(queue, answeredIds);
    if (!current) break;

    order.push(current.card._id);
    const correct = answers[order.length - 1];

    // Record the answer: a correct card becomes not-due (next review later).
    progress = progressByCard({
      ...Object.fromEntries(progress),
      [current.card._id]: correct
        ? { nextReviewAt: Date.now() + 86400000 }
        : { nextReviewAt: Date.now() },
    });
    answeredIds.add(current.card._id);
  }
  return order;
}

describe("buildStudyQueue", () => {
  it("orders due cards before not-due cards", () => {
    const queue = buildStudyQueue(CARDS, progressByCard({
      a: null, // never studied → due
      b: { nextReviewAt: Date.now() + 99999999 }, // future → not due
      c: { nextReviewAt: Date.now() - 1 }, // past → due
    }));

    // a & c are due; d, e, f have no progress (new cards → due); b is not due.
    expect(queue.map((e) => e.card._id)).toEqual(["a", "c", "d", "e", "f", "b"]);
    expect(queue.filter((e) => e.due).length).toBe(5);
    expect(queue.filter((e) => !e.due).length).toBe(1);
  });

  it("treats a card with no progress as due (new card)", () => {
    const queue = buildStudyQueue(CARDS, progressByCard({}));
    expect(queue.every((e) => e.due)).toBe(true);
  });
});

describe("isDue", () => {
  it("is due when progress is missing or nextReviewAt is in the past", () => {
    expect(isDue(null)).toBe(true);
    expect(isDue(undefined)).toBe(true);
    expect(isDue({ nextReviewAt: Date.now() - 1 })).toBe(true);
    expect(isDue({ nextReviewAt: Date.now() })).toBe(true);
  });

  it("is not due when nextReviewAt is in the future", () => {
    expect(isDue({ nextReviewAt: Date.now() + 1000 })).toBe(false);
  });
});

describe("selectNextCard (identity-based)", () => {
  it("returns the first unanswered entry", () => {
    const queue = buildStudyQueue(CARDS, progressByCard({}));
    const next = selectNextCard(queue, new Set(["a", "b"]));
    expect(next?.card._id).toBe("c");
  });

  it("returns null once every card is answered", () => {
    const queue = buildStudyQueue(CARDS, progressByCard({}));
    expect(selectNextCard(queue, new Set(CARDS.map((c) => c._id)))).toBeNull();
  });
});

describe("full session — no skipped or repeated cards", () => {
  it("visits every card exactly once when all answers are correct", () => {
    const order = simulateSession(CARDS, {}, CARDS.map(() => true));
    expect(order).toHaveLength(CARDS.length);
    expect(new Set(order).size).toBe(CARDS.length);
    expect(order.sort()).toEqual(CARDS.map((c) => c._id).sort());
  });

  it("visits every card exactly once with mixed correct/wrong answers", () => {
    const answers = [true, false, true, false, true, true];
    const order = simulateSession(CARDS, {}, answers);
    expect(order).toHaveLength(CARDS.length);
    expect(new Set(order).size).toBe(CARDS.length);
  });

  it("still covers every card when some cards start as not-due", () => {
    const initial: Record<string, Progress> = {
      b: { nextReviewAt: Date.now() + 99999999 },
      d: { nextReviewAt: Date.now() + 99999999 },
    };
    const order = simulateSession(CARDS, initial, CARDS.map(() => true));
    expect(order).toHaveLength(CARDS.length);
    expect(new Set(order).size).toBe(CARDS.length);
  });

  it("regression: reactive re-sort after each answer does not skip the next due card", () => {
    // The historical bug: an index-based cursor into the re-sorted queue would
    // skip cards after every answer. Identity-based selection must not.
    const order = simulateSession(CARDS, {}, [true, true, true, true, true, true]);
    expect(order).toEqual(["a", "b", "c", "d", "e", "f"]);
  });
});
