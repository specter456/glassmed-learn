import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { SEED_FLASHCARDS, SEED_TOPICS } from "./seedData";

/**
 * Idempotently seeds the content tables on first run.
 * Safe to call on every page load — it no-ops once topics exist.
 */
export const ensureSeeded = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("topics").first();
    if (existing) return { seeded: false, topics: 0, cards: 0 };

    for (const topic of SEED_TOPICS) {
      await ctx.db.insert("topics", topic);
    }
    for (const card of SEED_FLASHCARDS) {
      await ctx.db.insert("flashcards", card);
    }
    return {
      seeded: true,
      topics: SEED_TOPICS.length,
      cards: SEED_FLASHCARDS.length,
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
