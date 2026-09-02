import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Dna,
  HeartPulse,
  Layers,
  Network,
  RefreshCw,
  Search,
  ShieldPlus,
  Stethoscope,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router";
import { AppHeader } from "@/components/AppHeader";
import { GlassBackdrop } from "@/components/GlassBackdrop";
import { QueryErrorBoundary } from "@/components/QueryErrorBoundary";
import { ARTICLES, ARTICLE_CATEGORIES } from "@/lib/articles";
import type { LucideIcon } from "lucide-react";
import { useHead } from "@/lib/seo";

/* ─── Category metadata for the Basics page ─── */
const CATEGORY_META: Record<
  string,
  { label: string; color: string; icon: LucideIcon; desc: string }
> = {
  "Cardiac Emergency": {
    label: "Cardiac Emergency",
    color: "#ff5f7a",
    icon: HeartPulse,
    desc: "Life-saving first-aid for heart emergencies",
  },
  "Airway Emergency": {
    label: "Airway Emergency",
    color: "#e879f9",
    icon: Stethoscope,
    desc: "Choking response and airway management",
  },
  Trauma: {
    label: "Trauma",
    color: "#f59e0b",
    icon: ShieldPlus,
    desc: "Bleeding, burns, and fracture care",
  },
  "Neurological Emergency": {
    label: "Neurological Emergency",
    color: "#a78bfa",
    icon: Zap,
    desc: "Stroke recognition and seizure care",
  },
  "Medical Emergency": {
    label: "Medical Emergency",
    color: "#22d3ee",
    icon: Layers,
    desc: "Anaphylaxis, poisoning, and acute care",
  },
  Physiology: {
    label: "Physiology",
    color: "#6fb5b0",
    icon: HeartPulse,
    desc: "How the body's systems work",
  },
  Anatomy: {
    label: "Anatomy",
    color: "#22d3ee",
    icon: Network,
    desc: "Structure and organisation of the body",
  },
  Biochemistry: {
    label: "Biochemistry",
    color: "#f59e0b",
    icon: RefreshCw,
    desc: "Molecular processes and metabolism",
  },
  Genetics: {
    label: "Genetics",
    color: "#a78bfa",
    icon: Dna,
    desc: "DNA, replication, and heredity",
  },
};

/* ─── Research-only articles (first-aid articles excluded) ─── */
const FIRST_AID_SLUGS = new Set([
  "cpr-basics",
  "choking",
  "severe-bleeding",
  "burns",
  "fractures",
  "heart-attack",
  "stroke",
  "allergic-reactions",
  "seizures",
  "poisoning",
]);

const RESEARCH_ARTICLES = ARTICLES.filter(
  (a) => !FIRST_AID_SLUGS.has(a.slug)
);

/* ─── Basics Page ─── */
function BasicsInner() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(ARTICLE_CATEGORIES)
  );

  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return RESEARCH_ARTICLES;
    return RESEARCH_ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.slug.includes(q)
    );
  }, [q]);

  /* Group by category */
  const grouped = useMemo(() => {
    const map = new Map<string, typeof RESEARCH_ARTICLES>();
    for (const a of filtered) {
      const list = map.get(a.category) ?? [];
      list.push(a);
      map.set(a.category, list);
    }
    return map;
  }, [filtered]);

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <div className="min-h-screen">
      <GlassBackdrop />
      <AppHeader title="Fundamentals" />

      <main className="mx-auto max-w-5xl px-4 pb-32 pt-10 sm:px-6">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="tech-label">Full Library</span>
          <h1 className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-wistaria sm:text-4xl">
            All Research Topics
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Browse every topic in the curriculum — from first-aid fundamentals
            to advanced physiology, anatomy, and biochemistry. Each topic has a
            Basics tab for beginners and an In-Depth tab for detailed study.
          </p>
        </motion.div>

        {/* ── Search Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="relative mt-6"
        >
          <div className="glass-panel shine flex items-center gap-3 rounded-2xl px-5 py-3.5">
            <Search className="size-5 shrink-0 text-muted-foreground" />
            <input
              type="text"
              placeholder='Search all topics… try "cardiac", "krebs", "DNA"'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
              style={{ cursor: "text" }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:bg-white/20 hover:text-foreground"
                style={{ cursor: "pointer" }}
              >
                Clear
              </button>
            )}
          </div>
          {q && (
            <p className="mt-2 text-xs text-muted-foreground">
              {filtered.length} topic{filtered.length !== 1 ? "s" : ""} found
            </p>
          )}
        </motion.div>

        {/* ── Categories ── */}
        <div className="mt-8 space-y-6">
          {grouped.size === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <BookOpen className="mx-auto size-8 text-muted-foreground/50" />
              <p className="mt-3 text-sm font-semibold text-muted-foreground">
                No topics match "{query}"
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try "heart", "krebs", "breathing", or "DNA"
              </p>
            </motion.div>
          )}

          {Array.from(grouped.entries()).map(([category, articles], catIdx) => {
            const meta = CATEGORY_META[category] ?? {
              label: category,
              color: "#888",
              icon: BookOpen,
              desc: "",
            };
            const Icon = meta.icon;
            const isExpanded = expandedCategories.has(category);

            return (
              <motion.section
                key={category}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + catIdx * 0.05 }}
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/5"
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className="flex size-9 items-center justify-center rounded-xl"
                    style={{ backgroundColor: meta.color + "1f", color: meta.color }}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <h2 className="text-sm font-extrabold tracking-tight">
                      {meta.label}
                    </h2>
                    <p className="text-[11px] text-muted-foreground">{meta.desc}</p>
                  </div>
                  <span className="rounded-full bg-white/8 px-2.5 py-1 text-[10px] font-bold text-muted-foreground">
                    {articles.length}
                  </span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="size-4 text-muted-foreground" />
                  </motion.div>
                </button>

                {/* Article Cards */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 gap-3 pl-12 pt-2 sm:grid-cols-2">
                        {articles.map((article, i) => (
                          <motion.button
                            key={article.slug}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: i * 0.03 }}
                            whileHover={{ y: -3, scale: 1.01 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() =>
                              navigate(`/research?article=${article.slug}`)
                            }
                            className="glass-chip shine group flex items-start gap-3 p-4 text-left"
                            style={{ cursor: "pointer" }}
                          >
                            <span className="mt-0.5 text-xl">
                              {article.emoji}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="truncate text-sm font-bold">
                                  {article.title}
                                </p>
                                {article.tabs && (
                                  <span className="shrink-0 rounded-full bg-wistaria/15 px-2 py-0.5 text-[10px] font-bold text-wistaria">
                                    Basics & In-Depth
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                {article.summary}
                              </p>
                              <div className="mt-1.5 flex items-center gap-2">
                                <span
                                  className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold"
                                  style={{
                                    backgroundColor: meta.color + "18",
                                    color: meta.color,
                                  }}
                                >
                                  {article.category}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {article.readMinutes} min read
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="mt-1 size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.section>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default function Basics() {
  useHead({ title: "The Basics", description: "Interactive medical flashcards and study guides for first-year MBBS and NEET students. Master anatomy, physiology, and biochemistry.", path: "/basics" });
  return (
    <QueryErrorBoundary title="Couldn't load the fundamentals">
      <BasicsInner />
    </QueryErrorBoundary>
  );
}
