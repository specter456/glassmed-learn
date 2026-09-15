import { useEffect, useRef } from "react";

/**
 * Manages browser notifications for spaced-repetition review reminders.
 *
 * - Requests notification permission once (stored in localStorage so we
 *   don't keep asking).
 * - Sends a notification when there are due reviews, but at most once per
 *   app session (tracked via an in-memory flag) to avoid spam.
 * - Uses the Visibility API to re-check when the user returns to the tab
 *   after being away.
 */

const NOTIFICATIONPermissionKey = "glassmed-notif-permission";
const NOTIFICATION_SENT_KEY = "glassmed-notif-sent-today";

function hasNotificationPermission(): boolean {
  return Notification.permission === "granted";
}

function alreadySentToday(): boolean {
  try {
    const sent = localStorage.getItem(NOTIFICATION_SENT_KEY);
    if (!sent) return false;
    const sentDate = new Date(sent);
    const today = new Date();
    return (
      sentDate.getFullYear() === today.getFullYear() &&
      sentDate.getMonth() === today.getMonth() &&
      sentDate.getDate() === today.getDate()
    );
  } catch {
    return false;
  }
}

function markSentToday(): void {
  try {
    localStorage.setItem(NOTIFICATION_SENT_KEY, new Date().toISOString());
  } catch {
    /* non-fatal */
  }
}

function sendNotification(title: string, body: string, tag: string): void {
  if (!hasNotificationPermission()) return;
  if (alreadySentToday()) return;

  try {
    const notif = new Notification(title, {
      body,
      icon: "/app-icon-192.png",
      badge: "/app-icon-192.png",
      tag,
      requireInteraction: false,
    });
    notif.onclick = () => {
      window.focus();
      notif.close();
    };
    markSentToday();
  } catch {
    /* Notification API unavailable or blocked */
  }
}

export function useReviewNotifications(dueCount: number) {
  const hasRequested = useRef(false);

  // Request permission once on mount (only if not already granted/denied)
  useEffect(() => {
    if (hasRequested.current) return;
    if (!("Notification" in window)) return;

    const stored = localStorage.getItem(NOTIFICATIONPermissionKey);
    if (stored === "granted" || stored === "denied") return;

    hasRequested.current = true;

    // Delay the request slightly so it doesn't block the initial render
    const timer = setTimeout(() => {
      Notification.requestPermission().then((result) => {
        try {
          localStorage.setItem(NOTIFICATIONPermissionKey, result);
        } catch {
          /* non-fatal */
        }
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Send notification when dueCount changes to > 0
  useEffect(() => {
    if (dueCount <= 0) return;
    if (!hasNotificationPermission()) return;
    if (alreadySentToday()) return;

    // Small delay so the app has time to load
    const timer = setTimeout(() => {
      const messages = [
        `You have ${dueCount} flashcard${dueCount !== 1 ? "s" : ""} due for review today!`,
        `Don't break your streak! ${dueCount} card${dueCount !== 1 ? "s" : ""} are waiting.`,
        `Time to review! ${dueCount} flashcard${dueCount !== 1 ? "s" : ""} due today.`,
      ];
      const msg = messages[Math.floor(Math.random() * messages.length)];
      sendNotification("GlassMed Review Reminder", msg, "glassmed-review-due");
    }, 5000);

    return () => clearTimeout(timer);
  }, [dueCount]);

  // Re-check when user returns to the tab (visibility change)
  useEffect(() => {
    if (dueCount <= 0) return;
    if (!hasNotificationPermission()) return;

    const handleVisibility = () => {
      if (document.visibilityState === "visible" && dueCount > 0) {
        // Only send if not already sent today
        if (!alreadySentToday()) {
          sendNotification(
            "GlassMed Review Reminder",
            `Welcome back! You have ${dueCount} flashcard${dueCount !== 1 ? "s" : ""} due.`,
            "glassmed-review-due-return",
          );
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [dueCount]);
}
