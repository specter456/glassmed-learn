import { useCallback, useEffect, useState } from "react";

/**
 * Tiny dark/light theme control for GlassMed.
 *
 * The app is dark by default (see src/index.css `:root`), and the dark tokens
 * are the design system — so "light" is an opt-in override applied by toggling
 * the `.light` class on <html>. The choice is persisted so it survives reloads.
 *
 * `next-themes` is installed but never wired to a provider, so this small hook
 * keeps the same mental model (theme string + setTheme) without touching the
 * provider tree in main.tsx.
 */

export type ThemeMode = "dark" | "light";

const THEME_KEY = "glassmed-theme";

function readTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // localStorage unavailable — fall through to the default.
  }
  return "dark";
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(readTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("light", theme === "light");
    root.style.colorScheme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Non-fatal — the in-memory theme still applies for this session.
    }
  }, [theme]);

  const setTheme = useCallback((next: ThemeMode) => setThemeState(next), []);
  const toggle = useCallback(
    () => setThemeState((current) => (current === "dark" ? "light" : "dark")),
    [],
  );

  return { theme, setTheme, toggle };
}
