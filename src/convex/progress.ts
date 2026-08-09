import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

/** Spaced-repetition ladder in days: 1 → 3 → 7, then mastered. */
export const INTERVAL_DAYS = [1, 3, 7];

/**
 * Record the user's answer to a flashcard and advance (or reset) their
 * position on the 1-3-7 spaced-repetition ladder.
 *  - correct: move up one stage (capped at stage 2 = mastered)
 *  - wrong:   drop back to stage 0 (review again in 1 day)
 */
export const recordAnswer = mutation({
  args: { cardId: v.id("flashcards"), correct: v.boolean() },
  handler: async (ctx, { cardId, correct }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("cardProgress")
      .withIndex("by_user_card", (q) => q.eq("userId", userId).eq("cardId", cardId))
      .unique();

    const now = Date.now();
    const stage = correct ? Math.min((existing?.stage ?? -1) + 1, 2) : 0;
    const nextReviewAt = now + INTERVAL_DAYS[stage] * 24 * 60 * 60 * 1000;

    if (existing) {
      await ctx.db.patch(existing._id, {
        stage,
        correctCount: existing.correctCount + (correct ? 1 : 0),
        wrongCount: existing.wrongCount + (correct ? 0 : 1),
        nextReviewAt,
        lastReviewedAt: now,
      });
    } else {
      await ctx.db.insert("cardProgress", {
        userId,
        cardId,
        stage,
        correctCount: correct ? 1 : 0,
        wrongCount: correct ? 0 : 1,
        nextReviewAt,
        lastReviewedAt: now,
      });
    }
  },
});

/** All of the signed-in user's flashcard progress. */
export const myProgress = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const rows = await ctx.db
      .query("cardProgress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return rows;
  },
});

/**
 * Study summary for the home screen:
 * due count (1-3-7 ladder), mastered count, accuracy, and per-topic breakdown.
 */
export const summary = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const [topics, cards, rows] = await Promise.all([
      ctx.db.query("topics").collect(),
      ctx.db.query("flashcards").collect(),
      ctx.db
        .query("cardProgress")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect(),
    ]);

    const now = Date.now();
    const cardByTopic = new Map<string, Id<"flashcards">[]>();
    for (const card of cards) {
      const list = cardByTopic.get(card.topicSlug) ?? [];
      list.push(card._id);
      cardByTopic.set(card.topicSlug, list);
    }

    const progressByCard = new Map(rows.map((r) => [r.cardId, r]));

    let dueCount = 0;
    let mastered = 0;
    let correctAnswers = 0;
    let totalAnswers = 0;

    const byTopic = topics
      .sort((a, b) => a.order - b.order)
      .map((topic) => {
        const ids = cardByTopic.get(topic.slug) ?? [];
        let due = 0;
        let done = 0;
        for (const id of ids) {
          const p = progressByCard.get(id);
          if (!p || p.nextReviewAt <= now) due += 1;
          if (p) done += 1;
        }
        dueCount += due;
        return {
          slug: topic.slug,
          title: topic.title,
          subject: topic.subject,
          accent: topic.accent,
          icon: topic.icon,
          total: ids.length,
          due,
          done,
          mastered: 0,
        };
      });

    for (const row of rows) {
      if (row.stage === 2) mastered += 1;
      correctAnswers += row.correctCount;
      totalAnswers += row.correctCount + row.wrongCount;
    }

    const byTopicWithMastered = byTopic.map((t) => {
      let m = 0;
      for (const id of cardByTopic.get(t.slug) ?? []) {
        const p = progressByCard.get(id);
        if (p && p.stage === 2) m += 1;
      }
      return { ...t, mastered: m };
    });

    return {
      dueToday: dueCount,
      mastered,
      totalCards: cards.length,
      totalAnswers,
      accuracy: totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0,
      byTopic: byTopicWithMastered,
    };
  },
});
