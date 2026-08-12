import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { SEED_FLASHCARDS, SEED_TOPICS } from "./seedData";

/**
 * Idempotently seeds the content tables on first run.
 * Safe to call on every page load — it no-ops once topics exist.
 *
 * Each insert is individually guarded (by slug / by content) so that two
 * clients racing the very first run cannot double-seed the tables.
 */
export const ensureSeeded = mutation({
  args: {},
  handler: async (ctx) => {
    // Only signed-in users may write seed data — the tables are global, so an
    // unauthenticated caller must not be able to trigger writes at all.
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db.query("topics").first();
    if (existing) return { seeded: false, topics: 0, cards: 0 };

    let insertedTopics = 0;
    let insertedCards = 0;

    for (const topic of SEED_TOPICS) {
      const found = await ctx.db
        .query("topics")
        .withIndex("by_slug", (q) => q.eq("slug", topic.slug))
        .unique();
      if (!found) {
        await ctx.db.insert("topics", topic);
        insertedTopics += 1;
      }
    }

    const seenCards = new Set(
      (await ctx.db.query("flashcards").collect()).map(
        (c) => `${c.topicSlug}|${c.front}|${c.back}`,
      ),
    );
    for (const card of SEED_FLASHCARDS) {
      const key = `${card.topicSlug}|${card.front}|${card.back}`;
      if (!seenCards.has(key)) {
        await ctx.db.insert("flashcards", card);
        seenCards.add(key);
        insertedCards += 1;
      }
    }

    return {
      seeded: insertedTopics > 0 || insertedCards > 0,
      topics: insertedTopics,
      cards: insertedCards,
    };
  },
});

/** All topics in learning-path order (Basics first, then In-Depth). */
export const topics = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("topics").collect();
    return all.sort((a, b) => a.order - b.order);
  },
});

/** A single topic by slug. */
export const topicBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("topics")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
  },
});

/** A topic plus its flashcards — the study deck. */
export const deck = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const topic = await ctx.db
      .query("topics")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!topic) return null;

    const cards = await ctx.db
      .query("flashcards")
      .withIndex("by_topic", (q) => q.eq("topicSlug", slug))
      .collect();

    return { topic, cards: cards.sort((a, b) => a.order - b.order) };
  },
});
