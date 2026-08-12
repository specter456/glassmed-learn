import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

/**
 * Minimal sliding-window rate limiter, stored in the `rateLimits` table.
 *
 * Why a table and not the built-in limiter: this needs zero config files and
 * zero extra dependencies, and the logic is fully under our control. Each
 * check is a single-document read-modify-write inside ONE mutation, and Convex
 * runs each mutation as a transaction — concurrent mutations touching the same
 * document retry instead of interleaving — so the count is race-safe.
 *
 * Only allow-listed `name` values are accepted (an attacker must not be able
 * to grow the table with arbitrary keys), and every arg is clamped.
 */

const KNOWN_LIMITERS = new Set(["assistant", "recordAnswer"]);
const DEFAULT_WINDOW_MS = 60_000;
const MAX_LIMIT = 1000;
const MIN_WINDOW_MS = 1000;
const MAX_WINDOW_MS = 3_600_000;
const MAX_KEY_LENGTH = 128;

export const checkRateLimit = mutation({
  args: {
    name: v.string(),
    key: v.string(),
    limit: v.number(),
    windowMs: v.optional(v.number()),
  },
  handler: async (ctx, { name, key, limit, windowMs }) => {
    if (!KNOWN_LIMITERS.has(name)) throw new ConvexError("RATE_LIMIT_UNKNOWN_NAME");

    const safeKey = key.slice(0, MAX_KEY_LENGTH);
    if (!safeKey) throw new ConvexError("RATE_LIMIT_BAD_KEY");

    const safeLimit = Math.min(Math.max(Math.round(limit), 1), MAX_LIMIT);
    const window = Math.min(
      Math.max(Math.round(windowMs ?? DEFAULT_WINDOW_MS), MIN_WINDOW_MS),
      MAX_WINDOW_MS,
    );

    const doc = await ctx.db
      .query("rateLimits")
      .withIndex("by_name_key", (q) => q.eq("name", name).eq("key", safeKey))
      .unique();

    const now = Date.now();

    if (doc) {
      // Window expired — start a fresh one.
      if (doc.windowStart + doc.windowMs <= now) {
        await ctx.db.patch(doc._id, { windowStart: now, windowMs: window, count: 1 });
        return { allowed: true, remaining: safeLimit - 1 };
      }
      if (doc.count >= safeLimit) throw new ConvexError("RATE_LIMITED");
      await ctx.db.patch(doc._id, { count: doc.count + 1 });
      return { allowed: true, remaining: safeLimit - doc.count - 1 };
    }

    await ctx.db.insert("rateLimits", {
      name,
      key: safeKey,
      windowStart: now,
      windowMs: window,
      count: 1,
    });
    return { allowed: true, remaining: safeLimit - 1 };
  },
});
