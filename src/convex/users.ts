import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query, QueryCtx } from "./_generated/server";

/**
 * Get the current signed in user. Returns null if the user is not signed in.
 * Usage: const signedInUser = await ctx.runQuery(api.authHelpers.currentUser);
 * THIS FUNCTION IS READ-ONLY. DO NOT MODIFY.
 */
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (user === null) {
      return null;
    }

    return user;
  },
});

/**
 * Use this function internally to get the current user data. Remember to handle the null user case.
 * @param ctx
 * @returns
 */
export const getCurrentUser = async (ctx: QueryCtx) => {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    return null;
  }
  return await ctx.db.get(userId);
};

/**
 * Advance the profile's login counter once the student has finished the
 * Welcome card ("Start Studying" / "Continue Studying").
 *
 * The counter is a plain arrival tally the client reads on the NEXT sign-in:
 *
 *   unset or 1  → 2   first welcome finished
 *   2           → 3   "welcome back" finished
 *   3+          → +1  card is never shown again
 *
 * So the stored value means "how many popups this account is allowed to see":
 * below 2 → full Welcome, exactly 2 → "Welcome back!", 3 or more → none.
 *
 * Guests are anonymous and never reach here — their card is always the fresh
 * Welcome, decided client-side.
 */
export const acknowledgeWelcome = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const user = await ctx.db.get(userId);
    if (!user || user.isAnonymous) return null;

    // A brand-new profile has no count yet → treat it as the first arrival.
    const next = Math.max(user.loginCount ?? 1, 1) + 1;
    await ctx.db.patch(userId, { loginCount: next, hasCompletedOnboarding: true });
    return next;
  },
});

/** Marks the profile once the user has finished the full Welcome screen. */
export const completeOnboarding = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return;
    const user = await ctx.db.get(userId);
    if (!user) return;
    await ctx.db.patch(userId, { hasCompletedOnboarding: true });
  },
});

/**
 * Clears the onboarding markers so the Welcome screen can be replayed
 * (used by "Reset first-time tutorial" in Settings).
 */
export const resetOnboarding = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return;
    const user = await ctx.db.get(userId);
    if (!user) return;
    await ctx.db.patch(userId, { loginCount: 0, hasCompletedOnboarding: false });
  },
});
