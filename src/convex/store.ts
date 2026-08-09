import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { catalogItemById } from "./catalog";

/**
 * Records a purchase of a catalog pack.
 *
 * Checkout is sandboxed today: orders are stored with status "demo" so the
 * full buy flow works end-to-end without secrets. When real card processing
 * is enabled (Stripe secret key present server-side), this mutation is the
 * place to create a Stripe Checkout Session and return its URL instead —
 * the client then redirects and a webhook marks the order "paid".
 *
 * Security: the client only tells us WHICH item it wants. Title, price and
 * currency are derived from the server-side catalog, never from the client —
 * so a user cannot self-grant a premium pack at $0 by calling the mutation
 * directly. Also rate-limited per user, and requires a signed-in user.
 */
export const checkout = mutation({
  args: {
    itemId: v.string(),
  },
  handler: async (ctx, { itemId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Sign in to check out.");

    await ctx.runMutation(api.rateLimit.checkRateLimit, {
      name: "checkout",
      key: userId,
      limit: 10,
    });

    const safeItemId = itemId.trim().slice(0, 80);
    const item = catalogItemById(safeItemId);
    if (!item) throw new Error("Unknown catalog item.");

    // NOTE: with STRIPE_SECRET_KEY configured, create a Checkout Session here
    // and return { redirectUrl } instead of recording a demo order.
    const orderId = await ctx.db.insert("orders", {
      userId,
      itemId: safeItemId,
      itemTitle: item.title,
      amountCents: item.priceCents,
      currency: item.currency,
      status: "demo",
      createdAt: Date.now(),
    });

    return { orderId, demo: true };
  },
});

/** All of the signed-in user's orders (their library). */
export const myOrders = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const rows = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return rows.sort((a, b) => b.createdAt - a.createdAt);
  },
});
