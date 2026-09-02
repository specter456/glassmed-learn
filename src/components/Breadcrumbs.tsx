import { ChevronRight, Home } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

/**
 * Glassmorphism breadcrumb navigation.
 * Renders: Home > Section > Topic
 * Only the last item is non-clickable (current page).
 */
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      aria-label="Breadcrumb"
      className="glass-chip flex items-center gap-1 rounded-full px-3 py-1.5 text-xs"
    >
      {/* Home */}
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-1 rounded-full px-1.5 py-0.5 text-muted-foreground transition-colors hover:text-wistaria"
      >
        <Home className="size-3" />
        <span className="hidden sm:inline">Home</span>
      </button>

      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="size-3 text-muted-foreground/40" />
          {item.path && i < items.length - 1 ? (
            <button
              onClick={() => navigate(item.path!)}
              className="rounded-full px-1.5 py-0.5 text-muted-foreground transition-colors hover:text-wistaria"
            >
              {item.label}
            </button>
          ) : (
            <span className="rounded-full bg-wistaria/10 px-2 py-0.5 font-medium text-wistaria">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </motion.nav>
  );
}
