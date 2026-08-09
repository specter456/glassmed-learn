import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { api } from "./_generated/api";
import { action } from "./_generated/server";

/**
 * The strict system prompt. It lives ONLY here — server-side — so users can
 * never override it from the chat input (prompt-injection guard), and it
 * pushes hard against hallucination for medical education answers.
 */
const SYSTEM_PROMPT = `You are "MediPro", the study assistant inside GlassMed Learn, a medical education app for medical students and NEET aspirants.

Follow these rules strictly:

1. Accuracy first. If you are not certain about a fact, mechanism, number, or reference, say so explicitly ("I'm not fully certain — verify this in your textbook") instead of guessing. Never invent facts, mechanisms, drug doses, or citations.

2. Not medical advice. You are for education and exam preparation only, not diagnosis or treatment. If a question describes a person's symptoms, asks for treatment, or involves an emergency, state clearly that you cannot give personal medical advice and advise a qualified doctor (or emergency services, if urgent).

3. Structure. Prefer short, clear answers. Use bullet points for lists and step-by-step explanations for mechanisms. Match depth to the question: concise for definitions, more detail for "explain how/why".

4. Cite sources when you can. When a fact traces to a standard reference (e.g., Guyton & Hall, Ganong, Harper's Biochemistry, Robbins, Netter, or standard NEET review material), name the source ("per Guyton & Hall", "standard NEET review material"). Never fabricate page numbers, authors, or quotes.

5. Terminology. Use the standard term and give the common abbreviation on first use, e.g., "action potential (AP)".

6. Ambiguity. If a question is unclear or outside your knowledge, say so and ask a clarifying question instead of guessing.

7. Tone. Calm, professional, encouraging — the user is studying to become a doctor.`;

/** Keep the context window bounded and the prompt-size attack surface small. */
const MAX_HISTORY = 12;
const MAX_MESSAGE_CHARS = 2000;

export const askAssistant = action({
  args: {
    messages: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
      }),
    ),
  },
  handler: async (ctx, { messages }) => {
    // Must be a signed-in user: the OpenAI call costs money, so anonymous
    // callers (with the deployment URL) must not be able to burn the key.
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("AUTH_REQUIRED");

    // Cost-abuse guard: per-user sliding window, 10 calls / minute.
    await ctx.runMutation(api.rateLimit.checkRateLimit, {
      name: "assistant",
      key: userId,
      limit: 10,
    });

    // Provider-agnostic: any OpenAI-compatible chat completions endpoint works.
    //   OpenAI  → AI_API_KEY (or OPENAI_API_KEY), base https://api.openai.com/v1
    //   Google  → Gemini key from AI Studio, base
    //             https://generativelanguage.googleapis.com/v1beta/openai
    const key = process.env.AI_API_KEY ?? process.env.OPENAI_API_KEY;
    if (!key) throw new ConvexError("ASSISTANT_NOT_CONFIGURED");

    // If no base URL was configured, guess the provider from the key format:
    // Google Gemini keys start with AIza / AQ., OpenAI keys with sk-. This way
    // the user only needs to add AI_API_KEY and it just works.
    const configuredBase = (process.env.AI_BASE_URL ?? "").trim().replace(/\/+$/, "");
    const looksGoogle = key.startsWith("AIza") || key.startsWith("AQ.");
    const baseUrl =
      configuredBase ||
      (looksGoogle
        ? "https://generativelanguage.googleapis.com/v1beta/openai"
        : "https://api.openai.com/v1");
    // Sensible defaults per provider: OpenAI → gpt-4o, Google Gemini → the
    // widely available gemini-2.0-flash (2.5-flash is retired for new users).
    const isGoogle = baseUrl.includes("generativelanguage.googleapis.com");
    const model = process.env.AI_MODEL ?? (isGoogle ? "gemini-2.0-flash" : "gpt-4o");

    const safe = messages
      .filter((m) => m.content.trim().length > 0 && m.content.length <= MAX_MESSAGE_CHARS)
      .slice(-MAX_HISTORY);
    if (safe.length === 0) throw new ConvexError("ASSISTANT_EMPTY");

    let res: Response;
    try {
      res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          max_tokens: 700,
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...safe],
        }),
      });
    } catch (err) {
      // Network failure to OpenAI (no key content is logged).
      console.error("Assistant: network error reaching OpenAI", err);
      throw new ConvexError("ASSISTANT_UPSTREAM");
    }

    if (!res.ok) {
      console.error("Assistant: AI provider responded with", res.status);
      if (res.status === 401 || res.status === 403) {
        throw new ConvexError("ASSISTANT_BAD_KEY");
      }
      if (res.status === 429) {
        throw new ConvexError("AI_QUOTA_EXCEEDED");
      }
      if (res.status === 404) {
        throw new ConvexError("AI_MODEL_UNAVAILABLE");
      }
      throw new ConvexError("ASSISTANT_UPSTREAM");
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) throw new ConvexError("ASSISTANT_EMPTY_RESPONSE");

    return { content };
  },
});
