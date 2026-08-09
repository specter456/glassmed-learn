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

export function formatNextReview(timestamp: number): string {
  const diff = timestamp - Date.now();
  const hours = Math.round(diff / (60 * 60 * 1000));
  if (hours <= 0) return "due now";
  if (hours < 24) return `in ${hours}h`;
  const days = Math.round(hours / 24);
  return days === 1 ? "tomorrow" : `in ${days} days`;
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
