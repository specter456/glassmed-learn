import { describe, expect, test } from "bun:test";
import {
  FLASHCARD_WINS,
  LOGIN_MESSAGES,
  QUIZ_PRAISE,
  pickMessage,
} from "../src/components/Celebration";

describe("celebration message pools", () => {
  test("login pool has several fun variants with title + subtitle", () => {
    expect(LOGIN_MESSAGES.length).toBeGreaterThanOrEqual(3);
    for (const m of LOGIN_MESSAGES) {
      expect(m.title.length).toBeGreaterThan(0);
      expect(m.subtitle.length).toBeGreaterThan(0);
    }
  });

  test("flashcard win pool is non-empty and playful", () => {
    expect(FLASHCARD_WINS.length).toBeGreaterThanOrEqual(5);
    expect(FLASHCARD_WINS.some((w) => w.includes("WON"))).toBe(true);
  });

  test("quiz praise pool is non-empty", () => {
    expect(QUIZ_PRAISE.length).toBeGreaterThanOrEqual(4);
  });
});

describe("pickMessage rotation", () => {
  test("cycles through the pool deterministically", () => {
    expect(pickMessage(["a", "b", "c"], 0)).toBe("a");
    expect(pickMessage(["a", "b", "c"], 1)).toBe("b");
    expect(pickMessage(["a", "b", "c"], 2)).toBe("c");
    expect(pickMessage(["a", "b", "c"], 3)).toBe("a");
  });

  test("wraps around for larger indices and negatives", () => {
    expect(pickMessage(["a", "b"], 7)).toBe("b"); // 7 % 2 === 1
    expect(pickMessage(["a", "b"], -1)).toBe("b"); // abs(-1) % 2 === 1
    expect(pickMessage(["a", "b"], -2)).toBe("a"); // abs(-2) % 2 === 0
  });
});
