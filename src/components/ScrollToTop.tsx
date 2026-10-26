import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * Scrolls the window back to the very top whenever the route changes.
 *
 * The app scrolls inside the window itself (page components are not
 * scroll containers), so a plain `window.scrollTo(0, 0)` is enough. The
 * `setTimeout` also covers lazy-loaded routes, whose content mounts a tick
 * after the pathname has already changed.
 */
export function ScrollToTop() {
  const { key, pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Re-run after lazy route chunks mount and change document height.
    const t = window.setTimeout(() => window.scrollTo(0, 0), 120);
    return () => window.clearTimeout(t);
  }, [key, pathname, search]);

  return null;
}
