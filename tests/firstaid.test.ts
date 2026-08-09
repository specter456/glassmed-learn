/**
 * Tests for the First Aid Simulator's progression helpers in src/lib/medipro.ts
 * (XP thresholds, levels, rank titles, combo point scoring).
 */
import { describe, expect, it } from "bun:test";
import {
  levelFromXp,
  rankTitle,
  savePoints,
  shuffleOptions,
  xpForLevel,
  xpProgress,
} from "../src/lib/medipro";

describe("xpForLevel", () => {
  it("starts at level 1 with 0 XP", () => {
    expect(xpForLevel(1)).toBe(0);
  });

  it("adds 250 per extra level (250, 500, 750, …)", () => {
    expect(xpForLevel(2)).toBe(250);
    expect(xpForLevel(3)).toBe(750);
    expect(xpForLevel(4)).toBe(1500);
    expect(xpForLevel(5)).toBe(2500);
  });

  it("clamps degenerate input to level 1", () => {
    expect(xpForLevel(0)).toBe(0);
    expect(xpForLevel(-3)).toBe(0);
  });
});

describe("levelFromXp", () => {
  it("maps cumulative XP to the right level", () => {
    expect(levelFromXp(0)).toBe(1);
    expect(levelFromXp(249)).toBe(1);
    expect(levelFromXp(250)).toBe(2);
    expect(levelFromXp(749)).toBe(2);
    expect(levelFromXp(750)).toBe(3);
    expect(levelFromXp(1500)).toBe(4);
    expect(levelFromXp(2500)).toBe(5);
  });

  it("clamps negative XP to level 1", () => {
    expect(levelFromXp(-50)).toBe(1);
  });

  it("is the inverse of xpForLevel at every threshold", () => {
    for (let level = 1; level <= 30; level++) {
      expect(levelFromXp(xpForLevel(level))).toBe(level);
    }
  });
});

describe("rankTitle", () => {
  it("returns the rank for a level", () => {
    expect(rankTitle(1)).toBe("Band-Aid Apprentice");
    expect(rankTitle(3)).toBe("Triple-A Responder");
  });

  it("caps at the top title", () => {
    expect(rankTitle(10)).toBe("Legend of the ER");
    expect(rankTitle(99)).toBe("Legend of the ER");
  });
});

describe("xpProgress", () => {
  it("reports 0 at the start of a level and 1 at the threshold", () => {
    expect(xpProgress(0)).toBe(0);
    expect(xpProgress(250)).toBe(0); // start of level 2
    expect(xpProgress(750)).toBe(0); // start of level 3
  });

  it("reports the fraction through the current level", () => {
    expect(xpProgress(125)).toBe(0.5); // halfway through level 1
    expect(xpProgress(749)).toBeCloseTo(0.998, 3); // nearly level 3
  });

  it("stays within [0, 1] even at very high XP", () => {
    for (const xp of [10_000, 12_000, 100_000, 1_000_000]) {
      const p = xpProgress(xp);
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(1);
    }
  });

  it("reports the fraction through later levels too", () => {
    expect(xpProgress(12_000)).toBeCloseTo(0.3, 5); // 30% through level 10
  });
});

describe("savePoints (combo scoring)", () => {
  it("awards 100 base, +25 per combo step beyond 1", () => {
    expect(savePoints(1)).toBe(100);
    expect(savePoints(2)).toBe(125);
    expect(savePoints(3)).toBe(150);
    expect(savePoints(5)).toBe(200);
  });

  it("clamps a zero combo to the base points", () => {
    expect(savePoints(0)).toBe(100);
  });
});

describe("a perfect 8-shift run", () => {
  it("earns 1500 XP from combos and reaches level 4", () => {
    let combo = 0;
    let xp = 0;
    for (let i = 0; i < 8; i++) {
      combo += 1;
      xp += savePoints(combo);
    }
    expect(xp).toBe(1500);
    expect(levelFromXp(xp)).toBe(4);
    expect(rankTitle(levelFromXp(xp))).toBe("Sterile Field Rookie");
  });

  it("a shaky run (1 save, then 3 fails) earns only the base save", () => {
    let combo = 0;
    let xp = 0;
    combo += 1;
    xp += savePoints(combo); // first save
    combo = 0; // three fails reset the streak
    combo = 0;
    combo = 0;
    expect(xp).toBe(100);
    expect(levelFromXp(xp)).toBe(1);
  });
});

describe("shuffleOptions (randomized answer order)", () => {
  const OPTIONS = [
    "Give 5 back blows, then 5 abdominal thrusts (Heimlich)",
    "Slap them on the back once and shrug",
    "Hand them a glass of water",
    "Start filming for the group chat",
  ];

  it("keeps all four options, with no additions or losses", () => {
    const { options } = shuffleOptions(OPTIONS, 0);
    expect([...options].sort()).toEqual([...OPTIONS].sort());
    expect(new Set(options).size).toBe(4);
  });

  it("always points correctIndex at the correct option text", () => {
    for (let run = 0; run < 50; run++) {
      const { options, correctIndex } = shuffleOptions(OPTIONS, 0);
      expect(options[correctIndex]).toBe(OPTIONS[0]);
      expect(correctIndex).toBeGreaterThanOrEqual(0);
      expect(correctIndex).toBeLessThan(4);
    }
  });

  it("does not always put the correct answer first", () => {
    const positions = new Set<number>();
    for (let run = 0; run < 120; run++) {
      positions.add(shuffleOptions(OPTIONS, 0).correctIndex);
    }
    // With four options, all four positions should occur within 120 shuffles
    // (P(missing one position) ~ (3/4)^120, effectively zero).
    expect(positions.size).toBe(4);
  });

  it("handles a correct answer that starts mid-list", () => {
    const { options, correctIndex } = shuffleOptions(OPTIONS, 2);
    expect(options[correctIndex]).toBe(OPTIONS[2]);
  });

  it("does not mutate the input array", () => {
    const copy = [...OPTIONS];
    shuffleOptions(OPTIONS, 0);
    expect(OPTIONS).toEqual(copy);
  });
});
