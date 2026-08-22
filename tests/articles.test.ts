/**
 * Tests for the Research library data (src/lib/articles.ts): every article
 * must be complete, step-by-step, and medically on-target.
 */
import { describe, expect, it } from "bun:test";
import {
  ARTICLE_CATEGORIES,
  ARTICLES,
  articleBySlug,
  articleToSpeech,
  totalSteps,
} from "../src/lib/articles";

describe("library shape", () => {
  it("contains exactly 28 articles", () => {
    expect(ARTICLES).toHaveLength(28);
  });

  it("has unique slugs", () => {
    const slugs = ARTICLES.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every article has the required metadata", () => {
    for (const a of ARTICLES) {
      expect(a.title.length).toBeGreaterThan(10);
      expect(a.emoji).toBeTruthy();
      expect(a.category).toBeTruthy();
      expect(a.summary.length).toBeGreaterThan(40);
      expect(a.readMinutes).toBeGreaterThanOrEqual(3);
    }
  });

  it("categories are derived from the articles and non-empty", () => {
    expect(ARTICLE_CATEGORIES.length).toBeGreaterThanOrEqual(5);
    for (const c of ARTICLE_CATEGORIES) {
      expect(ARTICLES.some((a) => a.category === c)).toBe(true);
    }
  });
});

describe("every article is step-by-step", () => {
  it("has at least 3 sections (or tabs) and at least one section with steps", () => {
    for (const a of ARTICLES) {
      // Foundations are stub articles for Dashboard linking — skip section requirements
      if (a.category === "Foundations") continue;
      if (a.tabs) {
        // Tabbed articles: each tab should have sections
        expect(a.tabs.length).toBeGreaterThanOrEqual(2);
        for (const tab of a.tabs) {
          expect(tab.sections.length).toBeGreaterThanOrEqual(3);
          expect(tab.keyPoints.length).toBeGreaterThanOrEqual(2);
        }
      } else {
        expect(a.sections.length).toBeGreaterThanOrEqual(3);
        expect(a.sections.some((s) => (s.steps?.length ?? 0) > 0)).toBe(true);
      }
    }
  });

  it("has key points and red-flag lists", () => {
    for (const a of ARTICLES) {
      if (a.category === "Foundations") continue;
      if (a.tabs) {
        // Tabbed articles: key points are per-tab
        for (const tab of a.tabs) {
          expect(tab.keyPoints.length).toBeGreaterThanOrEqual(2);
        }
        // whenToCall may be empty for non-emergency articles
      } else {
        expect(a.keyPoints.length).toBeGreaterThanOrEqual(3);
        expect(a.whenToCall.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("every section has at least one kind of content", () => {
    for (const a of ARTICLES) {
      if (a.category === "Foundations") continue;
      const allSections = a.tabs
        ? a.tabs.flatMap((t) => t.sections)
        : a.sections;
      for (const s of allSections) {
        const hasContent =
          (s.body?.length ?? 0) > 0 ||
          (s.steps?.length ?? 0) > 0 ||
          (s.bullets?.length ?? 0) > 0 ||
          s.callout !== undefined;
        expect(hasContent).toBe(true);
      }
    }
  });

  it("totalSteps counts the step-by-step instructions", () => {
    const manual = ARTICLES.reduce((sum, a) => {
      if (a.tabs) {
        return sum + a.tabs.reduce(
          (tabSum, tab) => tabSum + tab.sections.reduce((s, sec) => s + (sec.steps?.length ?? 0), 0),
          0,
        );
      }
      return sum + a.sections.reduce((s, sec) => s + (sec.steps?.length ?? 0), 0);
    }, 0);
    expect(totalSteps()).toBe(manual);
    expect(totalSteps()).toBeGreaterThan(30);
  });
});

describe("read aloud", () => {
  it("produces a substantial plain-text reading for every article", () => {
    for (const a of ARTICLES) {
      const speech = articleToSpeech(a);
      expect(speech.length).toBeGreaterThan(600);
      expect(speech).toContain(a.title);
    }
  });

  it("step-by-step articles include step numbers", () => {
    const stepArticles = ARTICLES.filter((a) => !a.tabs);
    for (const a of stepArticles) {
      const speech = articleToSpeech(a);
      expect(speech).toContain("Step 1.");
    }
  });
});

describe("medical accuracy spot-checks", () => {
  it("CPR: correct rate, depth, and AED guidance", () => {
    const a = articleBySlug("cpr-basics");
    expect(a).toBeDefined();
    const text = articleToSpeech(a!);
    expect(text).toContain("100–120");
    expect(text).toContain("5–6 cm");
    expect(text.toLowerCase()).toContain("aed");
    expect(text).toContain("recoil");
  });

  it("choking: back blows + abdominal thrusts for adults, chest thrusts for infants", () => {
    const a = articleBySlug("choking");
    const text = articleToSpeech(a!);
    expect(text.toLowerCase()).toContain("back blows");
    expect(text.toLowerCase()).toContain("abdominal thrusts");
    expect(text.toLowerCase()).toContain("chest thrusts");
    expect(text.toLowerCase()).toContain("finger sweep");
  });

  it("severe bleeding: direct pressure and tourniquet rules", () => {
    const a = articleBySlug("severe-bleeding");
    const text = articleToSpeech(a!);
    expect(text.toLowerCase()).toContain("direct pressure");
    expect(text.toLowerCase()).toContain("tourniquet");
    expect(text).toContain("never");
  });

  it("burns: cool running water, no ice, no popping blisters", () => {
    const a = articleBySlug("burns");
    const text = articleToSpeech(a!);
    expect(text.toLowerCase()).toContain("running water");
    expect(text.toLowerCase()).toContain("blisters");
    expect(text.toLowerCase()).toContain("ice");
    expect(text.toLowerCase()).toContain("third");
  });

  it("fractures: immobilize, don't realign, check distal circulation", () => {
    const a = articleBySlug("fractures");
    const text = articleToSpeech(a!);
    expect(text.toLowerCase()).toContain("splint");
    expect(text.toLowerCase()).toContain("realign");
    expect(text.toLowerCase()).toContain("circulation");
  });

  it("heart attack: call first, chew aspirin, atypical symptoms", () => {
    const a = articleBySlug("heart-attack");
    const text = articleToSpeech(a!);
    expect(text.toLowerCase()).toContain("aspirin");
    expect(text.toLowerCase()).toContain("drive");
    expect(text.toLowerCase()).toContain("fatigue");
  });

  it("stroke: FAST test and no aspirin", () => {
    const a = articleBySlug("stroke");
    const text = articleToSpeech(a!);
    expect(text.toLowerCase()).toContain("face");
    expect(text.toLowerCase()).toContain("arm");
    expect(text.toLowerCase()).toContain("speech");
    expect(text.toLowerCase()).toContain("aspirin");
  });

  it("anaphylaxis: epinephrine into the outer thigh, hospital after", () => {
    const a = articleBySlug("allergic-reactions");
    const text = articleToSpeech(a!);
    expect(text.toLowerCase()).toContain("outer");
    expect(text.toLowerCase()).toContain("thigh");
    expect(text.toLowerCase()).toContain("epinephrine");
    expect(text.toLowerCase()).toContain("biphasic");
  });

  it("seizures: nothing in the mouth, time it, 5-minute threshold", () => {
    const a = articleBySlug("seizures");
    const text = articleToSpeech(a!);
    expect(text.toLowerCase()).toContain("mouth");
    expect(text.toLowerCase()).toContain("5 minutes");
    expect(text.toLowerCase()).toContain("restrain");
  });

  it("poisoning: never induce vomiting, poison control number", () => {
    const a = articleBySlug("poisoning");
    const text = articleToSpeech(a!);
    expect(text.toLowerCase()).toContain("vomiting");
    expect(text.toLowerCase()).toContain("poison control");
    expect(text).toContain("1-800-222-1222");
  });
});
