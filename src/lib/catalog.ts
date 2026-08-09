import type { LucideIcon } from "lucide-react";
import {
  Box,
  Dna,
  Gamepad2,
  HeartPulse,
  Headphones,
  Network,
  Package,
  RefreshCw,
  Zap,
} from "lucide-react";

export interface CatalogItem {
  slug: string;
  kind: "pack" | "audio" | "pass" | "bundle";
  title: string;
  category: string; // e.g. Physiology, Tools, Passes
  description: string;
  features: string[];
  priceCents: number; // 0 = free
  accent: string;
  icon: LucideIcon;
  /** Set for study packs: the learning topic this item unlocks. */
  topicSlug?: string;
}

export const CATALOG_ITEMS: CatalogItem[] = [
  // ----- Free study packs (the five fundamentals) -----
  {
    slug: "cardiac-cycle",
    kind: "pack",
    title: "Cardiac Cycle — Study Pack",
    category: "Physiology",
    description:
      "One heartbeat, eight phases, two pumps. Interactive phase diagram, plain-language basics, and a 6-card flip deck on the 1-3-7 schedule.",
    features: ["Animated phase diagram", "Basics → in-depth lesson", "6 flashcards + spaced repetition"],
    priceCents: 0,
    accent: "#e2666f",
    icon: HeartPulse,
    topicSlug: "cardiac-cycle",
  },
  {
    slug: "action-potential",
    kind: "pack",
    title: "Action Potential — Study Pack",
    category: "Neurophysiology",
    description:
      "The nerve's electric spike, traced curve by curve. Understand why it's all-or-none and why a nerve can't fire twice.",
    features: ["Animated spike curve", "Basics → in-depth lesson", "6 flashcards + spaced repetition"],
    priceCents: 0,
    accent: "#7b9ee8",
    icon: Zap,
    topicSlug: "action-potential",
  },
  {
    slug: "brachial-plexus",
    kind: "pack",
    title: "Brachial Plexus — Study Pack",
    category: "Anatomy",
    description:
      "Five roots, one messy ladder, the whole upper limb. Root-to-branch wiring with Erb's and Klumpke's palsy built in.",
    features: ["Animated plexus ladder", "Basics → in-depth lesson", "6 flashcards + spaced repetition"],
    priceCents: 0,
    accent: "#e0a458",
    icon: Network,
    topicSlug: "brachial-plexus",
  },
  {
    slug: "krebs-cycle",
    kind: "pack",
    title: "Krebs Cycle — Study Pack",
    category: "Biochemistry",
    description:
      "The metabolic roundabout. Every enzyme, every cofactor, and the 3-1-1-2 energy tally — drawn as one rotating cycle.",
    features: ["Animated 8-stop cycle", "Basics → in-depth lesson", "6 flashcards + spaced repetition"],
    priceCents: 0,
    accent: "#5fa88b",
    icon: RefreshCw,
    topicSlug: "krebs-cycle",
  },
  {
    slug: "dna-replication",
    kind: "pack",
    title: "DNA Replication — Study Pack",
    category: "Genetics",
    description:
      "How a cell copies three billion base pairs in hours. Leading, lagging, Okazaki fragments and telomerase, fork by fork.",
    features: ["Animated replication fork", "Basics → in-depth lesson", "6 flashcards + spaced repetition"],
    priceCents: 0,
    accent: "#8f7bc4",
    icon: Dna,
    topicSlug: "dna-replication",
  },

  // ----- Premium offerings -----
  {
    slug: "audio-pack",
    kind: "audio",
    title: "Focus Audio Pack",
    category: "Tools",
    description:
      "Lo-fi study loops and narrated walkthroughs of all five fundamentals, designed to play behind your flashcards. Loaded straight into the floating player.",
    features: ["5 narrated topic walkthroughs", "Lo-fi focus loops", "Plays in the built-in player"],
    priceCents: 900,
    accent: "#e896b4",
    icon: Headphones,
  },
  {
    slug: "quiz-pass",
    kind: "pass",
    title: "Quiz Arena Pass",
    category: "Passes",
    description:
      "Timed rounds, streak multipliers and score tables built on the same card bank. The fast lane between flashcards and exam day.",
    features: ["Timed quiz rounds", "Streak multipliers", "Per-topic leaderboards"],
    priceCents: 1400,
    accent: "#6fb5b0",
    icon: Gamepad2,
  },
  {
    slug: "mastery-bundle",
    kind: "bundle",
    title: "Mastery Bundle",
    category: "Bundles",
    description:
      "Everything on GlassMed Learn, today and in the future — every study pack, the audio pack, the quiz pass, and every pack we ship next.",
    features: ["All current packs", "All future packs included", "Audio pack + quiz pass inside"],
    priceCents: 2900,
    accent: "#a2a2d0",
    icon: Package,
  },
];

/** Pretty USD price from cents. */
export function formatPrice(cents: number): string {
  if (cents === 0) return "Free";
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

export function catalogItem(slug: string | null | undefined): CatalogItem | undefined {
  if (!slug) return undefined;
  return CATALOG_ITEMS.find((i) => i.slug === slug);
}

/** Case-insensitive search across title, category, kind and description. */
export function searchCatalog(query: string): CatalogItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return CATALOG_ITEMS;
  return CATALOG_ITEMS.filter((item) =>
    [item.title, item.category, item.description, item.kind]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}

export const FREE_PACKS = CATALOG_ITEMS.filter((i) => i.priceCents === 0);
export const PREMIUM_ITEMS = CATALOG_ITEMS.filter((i) => i.priceCents > 0);

/** Icon used for a topic pack card. */
export function packIcon(item: CatalogItem): LucideIcon {
  return item.icon ?? Box;
}
