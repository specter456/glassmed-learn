import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/** Maximum amount accepted (USD, cents) — defensive cap for any request. */
const MAX_AMOUNT_CENTS = 100_000; // $1,000

/**
 * Records a purchase of a catalog pack.
 *
 * Checkout is sandboxed today: orders are stored with status "demo" so the
 * full buy flow works end-to-end without secrets. When real card processing
 * is enabled (Stripe secret key present server-side), this mutation is the
 * place to create a Stripe Checkout Session and return its URL instead —
 * the client then redirects and a webhook marks the order "paid".
 *
 * Server-side validation: only signed-in users, item metadata is sanitized
 * and amounts are clamped before being stored.
 */
export const checkout = mutation({
  args: {
    itemId: v.string(),
    itemTitle: v.string(),
    amountCents: v.number(),
  },
  handler: async (ctx, { itemId, itemTitle, amountCents }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Sign in to check out.");

    const safeTitle = itemTitle.trim().slice(0, 120) || "GlassMed pack";
    const safeItemId = itemId.trim().slice(0, 80);
    const safeAmount = Math.min(Math.max(Math.round(amountCents), 0), MAX_AMOUNT_CENTS);

    // NOTE: with STRIPE_SECRET_KEY configured, create a Checkout Session here
    // and return { redirectUrl } instead of recording a demo order.
    const orderId = await ctx.db.insert("orders", {
      userId,
      itemId: safeItemId,
      itemTitle: safeTitle,
      amountCents: safeAmount,
      currency: "usd",
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
