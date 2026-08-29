/**
 * Smart Shortcuts — 2-letter abbreviations for fast topic lookup.
 *
 * These are intentionally short (2 chars) so power-users can type them
 * in the Dashboard search bar and instantly jump to a topic.
 *
 * All keys are UPPER-CASE in the map; matching is case-insensitive.
 */

export interface ShortcutEntry {
  /** The 2-letter shortcut key (e.g. "CS") */
  shortcut: string;
  /** Human-readable name shown in search results */
  name: string;
  /** The article slug to navigate to */
  articleSlug: string;
  /** Optional path override (defaults to /basics?article=<slug>) */
  path?: string;
  /** Emoji icon for visual flair */
  emoji: string;
}

/**
 * The shortcut mapping — each key MUST be exactly 2 uppercase letters.
 * These do NOT overlap with any existing commands or navigation.
 */
export const SHORTCUT_MAP: Record<string, ShortcutEntry> = {
  CS: {
    shortcut: "CS",
    name: "Cardiac Cycle",
    articleSlug: "cardiac-cycle",
    emoji: "❤️",
  },
  AP: {
    shortcut: "AP",
    name: "Action Potential",
    articleSlug: "action-potential",
    emoji: "⚡",
  },
  BP: {
    shortcut: "BP",
    name: "Brachial Plexus",
    articleSlug: "brachial-plexus",
    emoji: "🧠",
  },
  KC: {
    shortcut: "KC",
    name: "Krebs (TCA) Cycle",
    articleSlug: "krebs-cycle",
    emoji: "🔄",
  },
  MC: {
    shortcut: "MC",
    name: "Muscle Contraction",
    articleSlug: "muscle-contraction",
    emoji: "💪",
  },
  RM: {
    shortcut: "RM",
    name: "Respiratory Mechanics",
    articleSlug: "respiratory-mechanics",
    emoji: "🫁",
  },
  RP: {
    shortcut: "RP",
    name: "Renal Physiology",
    articleSlug: "renal-physiology",
    emoji: "🫘",
  },
  DS: {
    shortcut: "DS",
    name: "Digestive System",
    articleSlug: "digestive-system",
    emoji: "🧪",
  },
  ES: {
    shortcut: "ES",
    name: "Endocrine System",
    articleSlug: "endocrine-system",
    emoji: "🧬",
  },
  BI: {
    shortcut: "BI",
    name: "Blood & Immunity",
    articleSlug: "blood-and-immunity",
    emoji: "🩸",
  },
  DR: {
    shortcut: "DR",
    name: "DNA Replication",
    articleSlug: "dna-replication",
    emoji: "🧬",
  },
  VN: {
    shortcut: "VN",
    name: "Vision & Hearing",
    articleSlug: "vision-and-hearing",
    emoji: "👁️",
  },
  SN: {
    shortcut: "SN",
    name: "Synapses & Neurotransmitters",
    articleSlug: "synapses-neurotransmitters",
    emoji: "🔬",
  },
  CN: {
    shortcut: "CN",
    name: "The 12 Cranial Nerves",
    articleSlug: "cranial-nerves",
    emoji: "🧠",
  },
};

/** All available shortcuts as an array, sorted alphabetically. */
export const SHORTCUT_LIST: ShortcutEntry[] = Object.values(SHORTCUT_MAP).sort(
  (a, b) => a.shortcut.localeCompare(b.shortcut),
);

/**
 * Check if a search query looks like a shortcut (exactly 2 uppercase letters).
 * Returns the matching entry or null.
 */
export function matchShortcut(query: string): ShortcutEntry | null {
  const trimmed = query.trim().toUpperCase();
  if (trimmed.length === 2 && /^[A-Z]{2}$/.test(trimmed)) {
    return SHORTCUT_MAP[trimmed] ?? null;
  }
  return null;
}
