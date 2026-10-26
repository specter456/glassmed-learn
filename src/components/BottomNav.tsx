import { motion } from "framer-motion";
import { HeartPulse, House, Mic } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

interface NavItem {
  id: string;
  label: string;
  icon: typeof House;
  path: string;
  /** The center, slightly larger highlighted button. */
  center?: boolean;
}

/** Three-item bottom bar: Home, Diagrams, Voice Notes. Settings lives only in
 *  the top header (AppHeader) so it isn't duplicated here. */
const ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: House, path: "/dashboard" },
  { id: "diagrams", label: "Diagrams", icon: HeartPulse, path: "/diagrams", center: true },
  { id: "voice", label: "Voice Notes", icon: Mic, path: "/voice-notes" },
];

export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const activeId = pathname.startsWith("/diagrams")
    ? "diagrams"
    : pathname.startsWith("/voice-notes")
      ? "voice"
      : pathname.startsWith("/dashboard")
        ? "home"
        : null;

  /** Tapping the tab you're already on must NOT push a duplicate history
   *  entry (that's what makes Back feel like it's looping). It just scrolls
   *  the current page back to the top instead. */
  const go = (item: NavItem) => {
    if (activeId === item.id) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    navigate(item.path);
  };

  return (
    <nav
      className="fixed inset-x-0 z-[1000] px-3 sm:px-6"
      aria-label="Primary"
      style={{ bottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="glass-strong mx-auto flex max-w-sm items-end justify-between gap-2 rounded-3xl border border-white/10 px-3 pb-2 pt-2.5 shadow-[0_18px_50px_-14px_rgba(10,14,45,0.6)]">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activeId === item.id;

          if (item.center) {
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.9 }}
                whileHover={{ y: -2 }}
                onClick={() => go(item)}
                className="group relative -mt-8 flex flex-col items-center gap-1"
                aria-label="Anatomy Diagrams"
                aria-current={active ? "page" : undefined}
              >
                <span
                  className={`flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-cloud to-wistaria text-white shadow-[0_12px_30px_-8px_rgba(120,162,210,0.9)] ring-4 ring-background/80 transition-transform duration-300 group-hover:scale-105 ${
                    active ? "brightness-110" : ""
                  }`}
                >
                  <Icon className="size-6" />
                </span>
                <span
                  className={`text-[10px] font-bold transition-colors ${
                    active ? "text-wistaria" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          }

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.92 }}
              onClick={() => go(item)}
              className="flex flex-1 flex-col items-center gap-1 rounded-2xl px-1.5 py-1"
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
            >
              <span
                className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors ${
                  active ? "bg-wistaria/15 text-wistaria" : "text-muted-foreground"
                }`}
              >
                <Icon className="size-5" />
              </span>
              <span
                className={`text-[10px] font-bold transition-colors ${
                  active ? "text-wistaria" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
