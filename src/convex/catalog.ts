/**
 * Authoritative server-side catalog.
 *
 * The client has its own copy (`src/lib/catalog.ts`) purely for *display*.
 * Any mutation that records a purchase MUST derive the title and price from
 * THIS map — never from arguments supplied by the client. Otherwise a signed-in
 * user could call `checkout` directly with an arbitrary price (e.g. $0) and
 * self-grant premium packs.
 *
 * Keep this in sync with the display catalog when items change.
 */

export interface ServerCatalogItem {
  title: string;
  priceCents: number; // 0 = free
  currency: string;
}

export const SERVER_CATALOG: Record<string, ServerCatalogItem> = {
  "cardiac-cycle": { title: "Cardiac Cycle — Study Pack", priceCents: 0, currency: "usd" },
  "action-potential": { title: "Action Potential — Study Pack", priceCents: 0, currency: "usd" },
  "brachial-plexus": { title: "Brachial Plexus — Study Pack", priceCents: 0, currency: "usd" },
  "krebs-cycle": { title: "Krebs Cycle — Study Pack", priceCents: 0, currency: "usd" },
  "dna-replication": { title: "DNA Replication — Study Pack", priceCents: 0, currency: "usd" },
  "audio-pack": { title: "Focus Audio Pack", priceCents: 900, currency: "usd" },
  "quiz-pass": { title: "Quiz Arena Pass", priceCents: 1400, currency: "usd" },
  "mastery-bundle": { title: "Mastery Bundle", priceCents: 2900, currency: "usd" },
};

/** Look up an item; returns undefined for unknown slugs. */
export function catalogItemById(itemId: string): ServerCatalogItem | undefined {
  return SERVER_CATALOG[itemId];
}
