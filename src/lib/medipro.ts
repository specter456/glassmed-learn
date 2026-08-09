import type { LucideIcon } from "lucide-react";
import {
  AudioLines,
  Box,
  Dna,
  HeartPulse,
  Layers,
  Mic2,
  Network,
  RefreshCw,
  Zap,
} from "lucide-react";

/** Motivational quotes shown when a flashcard answer is wrong. */
export const MOTIVATIONAL_QUOTES = [
  "Mistakes are proof that you are trying.",
  "The expert in anything was once a beginner.",
  "Study while others are sleeping; work while others are loafing.",
  "It always seems impossible until it's done.",
  "Your brain learns best right after an error — this is the moment it counts.",
  "Fall seven times, stand up eight.",
  "Slow progress is still progress. Review it again tomorrow.",
  "Every master was once a disaster at the same subject.",
];

export function randomQuote(): string {
  return MOTIVATIONAL_QUOTES[
    Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)
  ];
}

/** Map a stored icon key to a lucide icon component. */
export const TOPIC_ICONS: Record<string, LucideIcon> = {
  "heart-pulse": HeartPulse,
  zap: Zap,
  network: Network,
  "refresh-cw": RefreshCw,
  dna: Dna,
  layers: Layers,
};

export function topicIcon(key: string): LucideIcon {
  return TOPIC_ICONS[key] ?? Layers;
}

/** 1-3-7 day spaced-repetition ladder (mirrors the server). */
export const INTERVAL_DAYS = [1, 3, 7];

export function isDue(progress?: { nextReviewAt?: number } | null): boolean {
  if (!progress || progress.nextReviewAt == null) return true;
  return progress.nextReviewAt <= Date.now();
}

/** One flashcard paired with its due status, used for session ordering. */
export interface StudyCardEntry<C> {
  card: C;
  due: boolean;
}

/**
 * Build the study-session order: cards that are due now first, then the rest.
 * Kept as a pure function so the ordering rules can be unit-tested.
 */
export function buildStudyQueue<C extends { _id: string }>(
  cards: readonly C[],
  progressByCard: Map<string, { nextReviewAt?: number } | null | undefined>,
): StudyCardEntry<C>[] {
  const withDue = cards.map((card) => ({
    card,
    due: isDue(progressByCard.get(card._id)),
  }));
  return [...withDue.filter((c) => c.due), ...withDue.filter((c) => !c.due)];
}

/**
 * Pick the next card to study: the first not-yet-answered entry in the queue.
 * Because selection is based on card identity (not an index), the queue can
 * re-sort reactively (e.g. after an answer updates progress) without ever
 * skipping or repeating a card.
 */
export function selectNextCard<C extends { _id: string }>(
  queue: StudyCardEntry<C>[],
  answeredIds: ReadonlySet<string>,
): StudyCardEntry<C> | null {
  return queue.find((entry) => !answeredIds.has(entry.card._id)) ?? null;
}

/** Feature set shared by the placeholders (structured for audio + 3D). */
export const AUDIO_3D_FEATURES = [
  {
    icon: Mic2,
    label: "Audio rounds",
    desc: "Narration & sound cues",
  },
  {
    icon: Box,
    label: "3D models",
    desc: "Lightweight, capped at 30fps",
  },
  {
    icon: AudioLines,
    label: "Voice feedback",
    desc: "Instant spoken answers",
  },
];

/** Human-friendly "time to read" label for content blocks. */
export function wordsToRead(words: number): string {
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

export function pluralize(n: number, singular: string, plural?: string): string {
  return `${n} ${n === 1 ? singular : (plural ?? singular + "s")}`;
}

/* ------------------- First Aid Simulator (game) ------------------- */

/** Ranks earned as a responder levels up. Index = level (1-based, capped). */
export const FIRST_AID_RANKS = [
  "Band-Aid Apprentice",
  "Scraped-Knee Specialist",
  "Triple-A Responder",
  "Sterile Field Rookie",
  "Ambulance Sidekick",
  "Chest-Compression Machine",
  "Trauma Team Operative",
  "Golden Hour Guardian",
  "First-Aid Commander",
  "Legend of the ER",
];

/**
 * Cumulative XP required to *reach* a level (1-based): the sum of
 * 250, 500, 750, … (level 1 → 2 at 250 XP, 2 → 3 at 750 XP, …).
 */
export function xpForLevel(level: number): number {
  const l = Math.max(1, Math.floor(level));
  return (250 * (l - 1) * l) / 2;
}

/** The level a given amount of cumulative XP puts you at. */
export function levelFromXp(xp: number): number {
  const x = Math.max(0, Math.floor(xp));
  return Math.max(1, Math.floor((125 + Math.sqrt(15625 + 500 * x)) / 250));
}

/** The rank title shown for a level (caps at the top title). */
export function rankTitle(level: number): string {
  return FIRST_AID_RANKS[Math.min(FIRST_AID_RANKS.length, level) - 1];
}

/** XP progress (0–1) through the current level, for the XP bar. */
export function xpProgress(xp: number): number {
  const level = levelFromXp(xp);
  const base = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const span = next - base;
  return span > 0 ? Math.min(1, Math.max(0, (xp - base) / span)) : 1;
}

/** Points for saving a patient: 100 base, +25 for each combo step beyond 1. */
export function savePoints(combo: number): number {
  return 100 + 25 * Math.max(0, combo - 1);
}

/** Fisher–Yates shuffle — returns a new array, never mutates the input. */
export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Shuffle a scenario's answer options into a random order and report where
 * the correct answer landed, so it's never predictably the first option.
 */
export function shuffleOptions<T>(
  options: readonly T[],
  correctIndex: number,
): { options: T[]; correctIndex: number } {
  const correct = options[correctIndex];
  const shuffled = shuffle(options);
  return { options: shuffled, correctIndex: shuffled.indexOf(correct) };
}
