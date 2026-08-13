import { motion } from "framer-motion";
import { HeartPulse, House, User } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { LogoutBlobModal } from "@/components/LogoutBlob";
import { SettingsModal } from "@/components/SettingsModal";
import { useAuth } from "@/hooks/use-auth";

interface NavItem {
  id: string;
  label: string;
  icon: typeof House;
  path?: string;
  /** Opens the settings/profile modal instead of navigating. */
  action?: "settings";
  /** The center, slightly larger highlighted button. */
  center?: boolean;
}

const ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: House, path: "/dashboard" },
  { id: "diagrams", label: "Diagrams", icon: HeartPulse, path: "/diagrams", center: true },
  { id: "profile", label: "Settings", icon: User, action: "settings" },
];

export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { signOut } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleClick = (item: NavItem) => {
    if (item.action === "settings") {
      setSettingsOpen(true);
      return;
    }
    if (item.path) navigate(item.path);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const activeId = pathname.startsWith("/diagrams")
    ? "diagrams"
    : pathname.startsWith("/dashboard")
      ? "home"
      : null;

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-[70] px-3 pb-3 sm:px-6 sm:pb-5"
        aria-label="Primary"
      >
        <div className="glass-strong mx-auto flex max-w-md items-end justify-between gap-1 rounded-3xl border border-white/10 px-2.5 pb-2 pt-2.5 shadow-[0_18px_50px_-14px_rgba(10,14,45,0.6)]">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            const active = item.action === "settings" ? settingsOpen : activeId === item.id;

            if (item.center) {
              return (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ y: -2 }}
                  onClick={() => handleClick(item)}
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
                onClick={() => handleClick(item)}
                className="flex flex-1 flex-col items-center gap-1 rounded-2xl px-1.5 py-1"
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
              >
                <span
                  className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors ${
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

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onRequestLogout={() => {
          setSettingsOpen(false);
          setLogoutOpen(true);
        }}
      />
      <LogoutBlobModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleSignOut}
      />
    </>
  );
}
