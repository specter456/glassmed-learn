import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // ---------- GlassMed Learn content tables ----------

    // Foundational topics with a "Basics first, then In-Depth" learning path
    topics: defineTable({
      slug: v.string(), // unique identifier, e.g. "cardiac-cycle"
      title: v.string(),
      subject: v.string(), // e.g. Physiology, Anatomy, Biochemistry
      blurb: v.string(), // one-line description
      accent: v.string(), // theme color hex used across the UI
      icon: v.string(), // lucide icon key
      diagram: v.string(), // which SVG diagram to render
      order: v.number(), // learning order (Basics-first path)
      keyPoints: v.array(v.string()),
      basicBlocks: v.array(
        v.object({ heading: v.string(), body: v.string() }),
      ),
      inDepthBlocks: v.array(
        v.object({ heading: v.string(), body: v.string() }),
      ),
    }).index("by_slug", ["slug"]),

    // Flashcards for spaced-repetition study (1-3-7 day ladder)
    flashcards: defineTable({
      topicSlug: v.string(),
      front: v.string(),
      back: v.string(),
      fact: v.string(), // extra context shown after answering
      order: v.number(),
    }).index("by_topic", ["topicSlug"]),

    // Per-user spaced repetition state for each flashcard
    cardProgress: defineTable({
      userId: v.id("users"),
      cardId: v.id("flashcards"),
      stage: v.number(), // 0 -> review in 1d, 1 -> 3d, 2 -> 7d (mastered)
      correctCount: v.number(),
      wrongCount: v.number(),
      nextReviewAt: v.number(),
      lastReviewedAt: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_user_card", ["userId", "cardId"]),

    // Sliding-window rate-limit counters (see convex/rateLimit.ts).
    // One document per (name, key) pair; counts reset when the window passes.
    rateLimits: defineTable({
      name: v.string(), // allow-listed limiter name
      key: v.string(), // usually the user id
      windowStart: v.number(),
      windowMs: v.number(),
      count: v.number(),
    }).index("by_name_key", ["name", "key"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
