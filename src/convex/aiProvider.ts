/**
 * Provider resolution for the AI assistant.
 *
 * The assistant speaks any OpenAI-compatible chat-completions endpoint, so the
 * user only has to paste one key in the Keys tab. We guess the provider from
 * the key format so nothing else needs configuring:
 *   - Google Gemini keys start with "AIza" or "AQ."
 *   - SambaNova Cloud keys are UUIDs (8-4-4-4-12 hex)
 *   - Groq keys start with "gsk_" (genuine free tier, no credit card)
 *   - OpenAI keys start with "sk-"
 * An explicit AI_BASE_URL (and AI_MODEL) always wins over the guess.
 */

export type AiProvider = "openai" | "google" | "sambanova" | "groq";

const SAMBANOVA_UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function looksLikeGoogle(key: string): boolean {
  return key.startsWith("AIza") || key.startsWith("AQ.");
}

export function looksLikeSambaNova(key: string): boolean {
  return SAMBANOVA_UUID_RE.test(key.trim());
}

export function looksLikeGroq(key: string): boolean {
  return key.trim().toLowerCase().startsWith("gsk_");
}

export interface ResolvedAiProvider {
  provider: AiProvider;
  key: string;
  baseUrl: string;
  model: string;
}

export function resolveAiProvider(
  env: Record<string, string | undefined>,
): ResolvedAiProvider {
  const key = (
    env.AI_API_KEY ??
    env.SAMBANOVA_API_KEY ??
    env.GROQ_API_KEY ??
    env.GEMINI_API_KEY ??
    env.GOOGLE_API_KEY ??
    env.OPENAI_API_KEY ??
    ""
  ).trim();

  const configuredBase = (env.AI_BASE_URL ?? "").trim().replace(/\/+$/, "");
  const google =
    looksLikeGoogle(key) || !!env.GEMINI_API_KEY || !!env.GOOGLE_API_KEY;
  const sambanova =
    !google && (!!env.SAMBANOVA_API_KEY || looksLikeSambaNova(key));
  const groq = !google && !sambanova && (!!env.GROQ_API_KEY || looksLikeGroq(key));

  const baseUrl =
    configuredBase ||
    (sambanova
      ? "https://api.sambanova.ai/v1"
      : groq
        ? "https://api.groq.com/openai/v1"
        : google
          ? "https://generativelanguage.googleapis.com/v1beta/openai"
          : "https://api.openai.com/v1");

  const isSambaNova = baseUrl.includes("sambanova.ai");
  const isGroq = baseUrl.includes("groq.com");
  const isGoogle = baseUrl.includes("generativelanguage.googleapis.com");

  const model =
    env.AI_MODEL?.trim() ||
    (isSambaNova
      ? "Meta-Llama-3.3-70B-Instruct"
      : isGroq
        ? "llama-3.3-70b-versatile"
        : isGoogle
          ? "gemini-2.0-flash"
          : "gpt-4o");

  const provider: AiProvider = isSambaNova
    ? "sambanova"
    : isGroq
      ? "groq"
      : isGoogle
        ? "google"
        : "openai";

  return { provider, key, baseUrl, model };
}
