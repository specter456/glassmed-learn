import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useEffect, useRef } from "react";

/**
 * Seeds the MediPro content tables on first run (no-op afterwards).
 * Pages that display topics/decks call this once on mount.
 */
export function useEnsureSeeded() {
  const ensureSeeded = useMutation(api.content.ensureSeeded);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    ensureSeeded().catch((err) => {
      console.warn("Seeding skipped (content may already exist):", err);
    });
  }, [ensureSeeded]);
}
