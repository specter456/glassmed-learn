/**
 * Bookmark system — persists to localStorage so bookmarks survive refreshes.
 */

const STORAGE_KEY = "glassmed-bookmarks";

/** Bookmark types we support. */
export type BookmarkKind = "article" | "deck";

export interface Bookmark {
  /** Unique identifier: "article:slug" or "deck:topicSlug" */
  id: string;
  kind: BookmarkKind;
  slug: string;
  title: string;
  emoji: string;
  /** When it was bookmarked (ISO string) */
  addedAt: string;
}

/* ── localStorage helpers ─────────────────────────────────────────── */

function readAll(): Bookmark[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Bookmark[]) : [];
  } catch {
    return [];
  }
}

function writeAll(bookmarks: Bookmark[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch {
    /* storage unavailable */
  }
}

/* ── Public API ───────────────────────────────────────────────────── */

function makeId(kind: BookmarkKind, slug: string): string {
  return `${kind}:${slug}`;
}

/** Check if a topic is bookmarked. */
export function isBookmarked(kind: BookmarkKind, slug: string): boolean {
  return readAll().some((b) => b.id === makeId(kind, slug));
}

/** Toggle a bookmark on/off. Returns the new state (true = bookmarked). */
export function toggleBookmark(
  kind: BookmarkKind,
  slug: string,
  title: string,
  emoji: string,
): boolean {
  const bookmarks = readAll();
  const id = makeId(kind, slug);
  const idx = bookmarks.findIndex((b) => b.id === id);

  if (idx >= 0) {
    bookmarks.splice(idx, 1);
    writeAll(bookmarks);
    return false;
  }

  bookmarks.push({
    id,
    kind,
    slug,
    title,
    emoji,
    addedAt: new Date().toISOString(),
  });
  writeAll(bookmarks);
  return true;
}

/** Get all bookmarks, most recently added first. */
export function getAllBookmarks(): Bookmark[] {
  return readAll().sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
  );
}

/** Get bookmarks filtered by kind. */
export function getBookmarks(kind: BookmarkKind): Bookmark[] {
  return getAllBookmarks().filter((b) => b.kind === kind);
}
