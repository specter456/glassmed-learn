import { describe, expect, it } from "bun:test";
import {
  matchShortcut,
  SHORTCUT_LIST,
  SHORTCUT_MAP,
} from "../src/lib/shortcuts";

describe("SHORTCUT_MAP", () => {
  it("has all keys as exactly 2 uppercase letters", () => {
    for (const key of Object.keys(SHORTCUT_MAP)) {
      expect(key).toMatch(/^[A-Z]{2}$/);
    }
  });

  it("has no duplicate article slugs", () => {
    const slugs = Object.values(SHORTCUT_MAP).map((e) => e.articleSlug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every entry has required fields", () => {
    for (const entry of Object.values(SHORTCUT_MAP)) {
      expect(entry.shortcut).toBeTruthy();
      expect(entry.name).toBeTruthy();
      expect(entry.articleSlug).toBeTruthy();
      expect(entry.emoji).toBeTruthy();
    }
  });
});

describe("matchShortcut", () => {
  it("matches a valid 2-letter shortcut (case-insensitive)", () => {
    expect(matchShortcut("CS")?.articleSlug).toBe("cardiac-cycle");
    expect(matchShortcut("cs")?.articleSlug).toBe("cardiac-cycle");
    expect(matchShortcut("Ap")?.articleSlug).toBe("action-potential");
  });

  it("returns null for non-shortcut queries", () => {
    expect(matchShortcut("heart")).toBeNull();
    expect(matchShortcut("C")).toBeNull();
    expect(matchShortcut("")).toBeNull();
    expect(matchShortcut("CSN")).toBeNull();
    expect(matchShortcut("12")).toBeNull();
  });

  it("returns null for unknown 2-letter combos", () => {
    expect(matchShortcut("ZZ")).toBeNull();
    expect(matchShortcut("XX")).toBeNull();
  });

  it("trims whitespace", () => {
    expect(matchShortcut("  CS  ")?.articleSlug).toBe("cardiac-cycle");
  });
});

describe("SHORTCUT_LIST", () => {
  it("is sorted alphabetically by shortcut", () => {
    const keys = SHORTCUT_LIST.map((e) => e.shortcut);
    expect(keys).toEqual([...keys].sort());
  });

  it("has the same length as SHORTCUT_MAP", () => {
    expect(SHORTCUT_LIST.length).toBe(Object.keys(SHORTCUT_MAP).length);
  });
});
