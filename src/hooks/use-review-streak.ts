import { useCallback, useEffect, useState } from "react";

/**
 * Tracks the user's daily review streak using localStorage.
 *
 * - A "day" is counted if the user reviews at least one flashcard that day.
 * - Streak resets if the user misses more than 1 day (i.e., last review was
 *   2+ days ago).
 * - Works for both logged-in and guest users (localStorage-based).
 */

const STREAK_KEY = "glassmed-review-streak";
const LAST_REVIEW_KEY = "glassmed-last-review-date";

interface StreakData {
  count: number;
  lastDate: string; // YYYY-MM-DD
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return Math.round((db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24));
}

function loadStreak(): StreakData {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* storage unavailable */
  }
  return { count: 0, lastDate: "" };
}

function saveStreak(data: StreakData): void {
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable */
  }
}

export function useReviewStreak() {
  const [streak, setStreak] = useState<StreakData>(loadStreak);

  // Check on mount if the streak should be reset (missed >1 day)
  useEffect(() => {
    const data = loadStreak();
    if (data.lastDate) {
      const gap = daysBetween(data.lastDate, todayStr());
      if (gap > 1) {
        // Missed a day — reset streak
        const reset = { count: 0, lastDate: data.lastDate };
        saveStreak(reset);
        setStreak(reset);
      }
    }
  }, []);

  /**
   * Call this after the user completes a flashcard review.
   * If today is already counted, this is a no-op.
   */
  const recordReview = useCallback(() => {
    const today = todayStr();
    setStreak((prev) => {
      if (prev.lastDate === today) {
        // Already counted today
        return prev;
      }
      const gap = prev.lastDate ? daysBetween(prev.lastDate, today) : 999;
      let newCount: number;
      if (gap === 1) {
        // Consecutive day — extend streak
        newCount = prev.count + 1;
      } else if (gap === 0) {
        // Same day (shouldn't happen due to early return, but safety)
        newCount = prev.count;
      } else {
        // Missed a day or first review — start fresh
        newCount = 1;
      }
      const next = { count: newCount, lastDate: today };
      saveStreak(next);
      return next;
    });
  }, []);

  /** Whether the user has reviewed today */
  const reviewedToday = streak.lastDate === todayStr();

  return {
    streak: streak.count,
    reviewedToday,
    recordReview,
  };
}
