import { describe, expect, test } from "bun:test";
import {
  looksLikeGoogle,
  looksLikeGroq,
  looksLikeSambaNova,
  resolveAiProvider,
} from "../src/convex/aiProvider";

const SAMBANOVA_KEY = "d9eab3d7-04ef-4e31-b16d-e7a0547b45b8";

describe("resolveAiProvider", () => {
  test("empty env resolves to no key and OpenAI defaults", () => {
    const r = resolveAiProvider({});
    expect(r.key).toBe("");
    expect(r.baseUrl).toBe("https://api.openai.com/v1");
    expect(r.model).toBe("gpt-4o");
    expect(r.provider).toBe("openai");
  });

  test("Google key (AQ.) routes to Gemini with gemini-2.0-flash", () => {
    const r = resolveAiProvider({ AI_API_KEY: "AQ.Ab8RN6JW5gN4SBAx36bNClNLK5H0fdZ" });
    expect(r.provider).toBe("google");
    expect(r.baseUrl).toBe("https://generativelanguage.googleapis.com/v1beta/openai");
    expect(r.model).toBe("gemini-2.0-flash");
  });

  test("Google key (AIza) routes to Gemini", () => {
    const r = resolveAiProvider({ AI_API_KEY: "AIzaSyDummyGoogleKeyValue" });
    expect(r.provider).toBe("google");
  });

  test("OpenAI sk- key routes to api.openai.com with gpt-4o", () => {
    const r = resolveAiProvider({ AI_API_KEY: "sk-proj-9FzZX2xycGtxXcXjq" });
    expect(r.provider).toBe("openai");
    expect(r.baseUrl).toBe("https://api.openai.com/v1");
    expect(r.model).toBe("gpt-4o");
  });

  test("SambaNova UUID key routes to api.sambanova.ai with Llama 3.3 70B", () => {
    const r = resolveAiProvider({ AI_API_KEY: SAMBANOVA_KEY });
    expect(r.provider).toBe("sambanova");
    expect(r.baseUrl).toBe("https://api.sambanova.ai/v1");
    expect(r.model).toBe("Meta-Llama-3.3-70B-Instruct");
  });

  test("Groq gsk_ key routes to api.groq.com with llama-3.3-70b-versatile", () => {
    const r = resolveAiProvider({ AI_API_KEY: "gsk_AbCdEf1234567890abcdef" });
    expect(r.provider).toBe("groq");
    expect(r.baseUrl).toBe("https://api.groq.com/openai/v1");
    expect(r.model).toBe("llama-3.3-70b-versatile");
  });

  test("GROQ_API_KEY env name routes any key to Groq", () => {
    const r = resolveAiProvider({ GROQ_API_KEY: "gsk_anything" });
    expect(r.provider).toBe("groq");
    expect(r.baseUrl).toBe("https://api.groq.com/openai/v1");
  });

  test("GROQ_AI_API_KEY env name routes any key to Groq", () => {
    const r = resolveAiProvider({ GROQ_AI_API_KEY: "gsk_anything" });
    expect(r.provider).toBe("groq");
    expect(r.baseUrl).toBe("https://api.groq.com/openai/v1");
    expect(r.model).toBe("llama-3.3-70b-versatile");
  });

  test("AI_MODEL overrides the Groq default", () => {
    const r = resolveAiProvider({
      AI_API_KEY: "gsk_AbCdEf1234567890abcdef",
      AI_MODEL: "llama-3.1-8b-instant",
    });
    expect(r.provider).toBe("groq");
    expect(r.model).toBe("llama-3.1-8b-instant");
  });

  test("SAMBANOVA_API_KEY env name routes any key to SambaNova", () => {
    const r = resolveAiProvider({ SAMBANOVA_API_KEY: "not-a-uuid-but-named" });
    expect(r.provider).toBe("sambanova");
    expect(r.baseUrl).toBe("https://api.sambanova.ai/v1");
  });

  test("stray whitespace/newlines in keys are trimmed", () => {
    const r = resolveAiProvider({ AI_API_KEY: `  ${SAMBANOVA_KEY}\n` });
    expect(r.key).toBe(SAMBANOVA_KEY);
    expect(r.provider).toBe("sambanova");
  });

  test("explicit AI_BASE_URL wins over provider guess", () => {
    const r = resolveAiProvider({
      AI_API_KEY: SAMBANOVA_KEY,
      AI_BASE_URL: "https://custom.example.com/v1",
    });
    expect(r.baseUrl).toBe("https://custom.example.com/v1");
    expect(r.provider).toBe("openai"); // unknown base falls back to OpenAI semantics
  });

  test("AI_MODEL overrides the provider default", () => {
    const r = resolveAiProvider({
      AI_API_KEY: SAMBANOVA_KEY,
      AI_MODEL: "Meta-Llama-3.1-8B-Instruct",
    });
    expect(r.model).toBe("Meta-Llama-3.1-8B-Instruct");
    expect(r.baseUrl).toBe("https://api.sambanova.ai/v1");
  });

  test("trailing slashes on AI_BASE_URL are normalized", () => {
    const r = resolveAiProvider({
      AI_API_KEY: SAMBANOVA_KEY,
      AI_BASE_URL: "https://api.sambanova.ai/v1///",
    });
    expect(r.baseUrl).toBe("https://api.sambanova.ai/v1");
  });
});

describe("key-shape helpers", () => {
  test("looksLikeGoogle", () => {
    expect(looksLikeGoogle("AIzaSyDummy")).toBe(true);
    expect(looksLikeGoogle("AQ.Ab8RN6J")).toBe(true);
    expect(looksLikeGoogle("sk-proj-x")).toBe(false);
    expect(looksLikeGoogle(SAMBANOVA_KEY)).toBe(false);
  });

  test("looksLikeSambaNova matches UUIDs only", () => {
    expect(looksLikeSambaNova(SAMBANOVA_KEY)).toBe(true);
    expect(looksLikeSambaNova("  d9eab3d7-04ef-4e31-b16d-e7a0547b45b8  ")).toBe(true);
    expect(looksLikeSambaNova("sk-proj-x")).toBe(false);
    expect(looksLikeSambaNova("AIzaSyDummy")).toBe(false);
    expect(looksLikeSambaNova("not-a-uuid")).toBe(false);
  });

  test("looksLikeGroq matches gsk_ keys only", () => {
    expect(looksLikeGroq("gsk_AbCdEf1234567890abcdef")).toBe(true);
    expect(looksLikeGroq("  GSK_anything  ")).toBe(true); // case + whitespace tolerant
    expect(looksLikeGroq(SAMBANOVA_KEY)).toBe(false);
    expect(looksLikeGroq("sk-proj-x")).toBe(false);
    expect(looksLikeGroq("AIzaSyDummy")).toBe(false);
  });
});
