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
 * Called once per explicit sign-in (email OTP).
 *
 * Bumps `loginCount` on the user's own profile so the client can tell a
 * first-ever login (show the full Welcome screen) from a returning one
 * (skip it and show a quick "Welcome back!" toast instead). Guest sessions
 * are anonymous and never call this — their welcome logic lives client-side.
 */
export const recordLogin = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const user = await ctx.db.get(userId);
    if (!user || user.isAnonymous) return null;

    const loginCount = (user.loginCount ?? 0) + 1;
    await ctx.db.patch(userId, { loginCount });

    return {
      loginCount,
      isFirstLogin: loginCount === 1,
      hasCompletedOnboarding: user.hasCompletedOnboarding ?? false,
    };
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
