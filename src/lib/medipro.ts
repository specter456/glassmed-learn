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
