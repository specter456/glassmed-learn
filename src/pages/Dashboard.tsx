import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  Bot,
  Box,
  CalendarClock,
  CheckCircle2,
  HeartPulse,
  Layers,
  Network,
  RefreshCw,
  Scissors,
  Search,
  Sparkles,
  Trophy,
  Zap,
  Zap as ZapIcon,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router";
import { matchShortcut, SHORTCUT_MAP } from "@/lib/shortcuts";

/** Reverse lookup: articleSlug → shortcut code (e.g. "cardiac-cycle" → "CS") */
const SLUG_TO_SHORTCUT: Record<string, string> = Object.fromEntries(
  Object.values(SHORTCUT_MAP).map((s) => [s.articleSlug, s.shortcut])
);
import { TeacherTour, isTourDone } from "@/components/TeacherTour";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { AppHeader } from "@/components/AppHeader";
import { GlassBackdrop } from "@/components/GlassBackdrop";
import { Button } from "@/components/ui/button";
import { QueryErrorBoundary } from "@/components/QueryErrorBoundary";
import { articleBySlug } from "@/lib/articles";
import { useEnsureSeeded } from "@/hooks/use-ensure-seeded";
import { useAuth } from "@/hooks/use-auth";
import { useHead } from "@/lib/seo";

/* ─── Main module buttons ─── */
const MODULES = [
  {
    title: "FLASHCARDS",
    icon: Layers,
    desc: "Flip, recall, schedule",
    color: "#7b9ee8",
    path: "/flashcards",
    badge: "due" as const,
  },
  {
    title: "BASICS",
    icon: Box,
    desc: "Fundamentals with visuals",
    color: "#a88bd4",
    path: "/basics",
  },
  {
    title: "GAME",
    icon: Scissors,
    desc: "First Aid Simulator",
    color: "#e896b4",
    path: "/game",
  },
  {
    title: "RESEARCH",
    icon: Search,
    desc: "First-aid library",
    color: "#6fb5b0",
    path: "/research",
  },
];

/* ─── Topic categories for badge colors ─── */
const CATEGORY_COLORS: Record<string, string> = {
  Physiology: "#a78bfa",
  Anatomy: "#22d3ee",
  Biochemistry: "#f59e0b",
  Systems: "#6fb5b0",
};

/* ─── Basics-First Path — Top 5 essential topics for first-year students ─── */
const BASICS_FIRST_PATH = [
  { num: 1, slug: "cardiac-cycle", title: "The Cardiac Cycle", desc: "Systole, diastole, and the pressure changes that drive every heartbeat.", articleSlug: "cardiac-cycle", icon: HeartPulse, color: "#ff5f7a", category: "Physiology" },
  { num: 2, slug: "action-potential", title: "The Action Potential", desc: "The electrical impulse that lets neurons and muscles communicate.", articleSlug: "action-potential", icon: Zap, color: "#a78bfa", category: "Physiology" },
  { num: 3, slug: "brachial-plexus", title: "The Brachial Plexus", desc: "The nerve superhighway from spine to fingertips — roots, trunks, cords, branches.", articleSlug: "brachial-plexus", icon: Network, color: "#22d3ee", category: "Anatomy" },
  { num: 4, slug: "krebs-cycle", title: "The Krebs (TCA) Cycle", desc: "How cells extract energy from glucose — the central metabolic hub.", articleSlug: "krebs-cycle", icon: RefreshCw, color: "#f59e0b", category: "Biochemistry" },
  { num: 5, slug: "muscle-contraction", title: "Muscle Contraction", desc: "Actin, myosin, and the sliding filament theory — how muscles generate force.", articleSlug: "muscle-contraction", icon: Activity, color: "#e879f9", category: "Physiology" },
];

/* ─── Search index ─── */
function buildSearchIndex() {
  const items: {
    slug: string;
    title: string;
    desc: string;
    category: string;
    tags: string[];
  }[] = [];
  for (const t of BASICS_FIRST_PATH) {
    items.push({
      slug: t.slug,
      title: t.title,
      desc: t.desc,
      category: t.category,
      tags: [t.title.toLowerCase(), t.category.toLowerCase(), t.slug, t.desc.toLowerCase()],
    });
  }
  return items;
}

/* ─── Dashboard ─── */
function DashboardInner() {
  useEnsureSeeded();
  useHead({
    title: "Dashboard",
    description: "Your personalized medical study dashboard. Track flashcard progress, review topics, and explore anatomy diagrams.",
    path: "/dashboard",
    keywords: "medical dashboard, study progress, flashcard review, medical education",
  });
  const navigate = useNavigate();
  const { user } = useAuth();
  const summary = useQuery(api.progress.summary);
  const topics = useQuery(api.content.topics);
  const loading = topics === undefined || summary === undefined;

  const [rawQuery, setRawQuery] = useState("");
  const [query, setQuery] = useState("");
  const [tourOpen, setTourOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const firstName = user?.name?.split(" ")[0] ?? (user?.isAnonymous ? "Guest" : "future doctor");
  const greeting =
    new Date().getHours() < 12
      ? "Good morning"
      : new Date().getHours() < 17
        ? "Good afternoon"
        : "Good evening";

  const searchIndex = useMemo(buildSearchIndex, []);

  // Debounced search — wait 300ms after typing stops
  const handleRawChange = useCallback((value: string) => {
    setRawQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setQuery(value), 300);
  }, []);

  // Clean up debounce on unmount
  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  // "Did you mean?" shortcut suggestion — only when input EXACTLY matches a 2-letter shortcut
  const shortcutSuggestion = useMemo(() => matchShortcut(query), [query]);

  // Normal text search — ALWAYS runs, never suppressed by shortcuts
  const filteredTopics = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return BASICS_FIRST_PATH;
    return BASICS_FIRST_PATH.filter((t) =>
      searchIndex
        .find((s) => s.slug === t.slug)
        ?.tags.some((tag) => tag.includes(q))
    );
  }, [query, searchIndex]);

  const isSearching = query.trim().length > 0;

  return (
    <div className="min-h-screen">
      <GlassBackdrop />
      <AppHeader />

      <main className="mx-auto max-w-6xl px-4 pb-32 pt-8 sm:px-6">
        {/* ── Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold text-muted-foreground">
            {greeting}, {firstName}
          </p>
          <h1 className="glow-text mt-1 text-balance text-3xl font-extrabold tracking-tight text-wistaria sm:text-4xl">
            Where Medicine Becomes Energetic
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Your spaced-repetition path through the trickiest first-year topics.
          </p>
          <div className="mt-4">
            <Button onClick={() => navigate("/flashcards")} className="gap-2 rounded-full">
              Start today's review
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </motion.div>

        {/* ── Search Bar ── */}
        <motion.div
          data-tour-target="search"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="relative mt-7"
        >
          {/* ── Search Bar ── */}
          <div className="glass-panel shine flex items-center gap-3 rounded-2xl px-5 py-3.5">
            <Search className="size-5 shrink-0 text-muted-foreground" />
            <input
              type="text"
              placeholder='Search topics… try "heart", "krebs", "nerves"'
              value={rawQuery}
              onChange={(e) => handleRawChange(e.target.value)}
              onKeyDown={(e) => {
                // Enter on exact 2-letter shortcut → navigate directly
                if (e.key === "Enter" && shortcutSuggestion) {
                  navigate(`/basics?article=${shortcutSuggestion.articleSlug}`);
                  setRawQuery("");
                  setQuery("");
                }
              }}
              className="flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
              style={{ cursor: "text" }}
            />
            {rawQuery && (
              <button
                onClick={() => { setRawQuery(""); setQuery(""); }}
                className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:bg-white/20 hover:text-foreground"
                style={{ cursor: "pointer" }}
              >
                Clear
              </button>
            )}
          </div>

          {/* ── "Did you mean?" shortcut suggestion ── */}
          <AnimatePresence>
            {shortcutSuggestion && (
              <motion.button
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.18 }}
                onClick={() => navigate(`/basics?article=${shortcutSuggestion.articleSlug}`)}
                className="glass-panel shine mt-2 flex w-full items-center gap-3 rounded-2xl border border-wistaria/20 px-5 py-3 text-left transition-all hover:scale-[1.01] hover:shadow-[0_10px_25px_-8px_rgba(120,162,210,0.35)]"
                style={{ cursor: "pointer" }}
              >
                <span className="flex size-9 items-center justify-center rounded-xl bg-wistaria/15 text-base">
                  {shortcutSuggestion.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-wistaria/70">
                    ⚡ Shortcut match
                  </p>
                  <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
                    {shortcutSuggestion.name}
                  </p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Guided Tour Button ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
          className="mt-5"
        >
          <button
            onClick={() => setTourOpen(true)}
            className="glass-panel shine group flex w-full items-center gap-3 rounded-2xl px-5 py-3.5 text-left transition-all hover:scale-[1.015] hover:shadow-[0_12px_30px_-8px_rgba(120,162,210,0.4)]"
            style={{ cursor: "pointer" }}
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-wistaria/15 text-wistaria transition-transform duration-300 group-hover:scale-110">
              <GraduationCap className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-foreground">Start Guided Tour</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Professor Rabbit will show you around the app 🐰</p>
            </div>
            <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </motion.div>

        {/* Teacher Tour Overlay */}
        <TeacherTour open={tourOpen} onClose={() => setTourOpen(false)} rootSelector=".min-h-screen" />

        {/* ── Stats Row ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.14 }}
          className="mt-6 grid grid-cols-3 gap-3"
        >
          {[
            { label: "Due today", value: summary?.dueToday, icon: CalendarClock, color: "#7b9ee8" },
            { label: "Mastered", value: summary?.mastered, icon: Trophy, color: "#6fb5b0" },
            { label: "Accuracy", value: summary ? `${summary.accuracy}%` : undefined, icon: CheckCircle2, color: "#a88bd4" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="glass-panel shine rounded-2xl p-4">
                {loading ? (
                  <div className="flex flex-col gap-2">
                    <div className="skeleton h-3 w-16 rounded-md" />
                    <div className="skeleton h-7 w-12 rounded-lg" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5">
                      <Icon className="size-3.5" style={{ color: s.color }} />
                      <span className="text-[11px] font-semibold text-muted-foreground">{s.label}</span>
                    </div>
                    <p className="mt-1.5 text-2xl font-extrabold tracking-tight">{s.value ?? 0}</p>
                  </>
                )}
              </div>
            );
          })}
        </motion.div>

        {/* ── Quick Access Modules ── */}
        <div data-tour-target="modules" className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {MODULES.map((m, i) => {
            const Icon = m.icon;
            const dueBadge = m.badge === "due" && !loading && (summary?.dueToday ?? 0) > 0;
            return (
              <motion.button
                key={m.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.18 + i * 0.06 }}
                whileHover={{ y: -6, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate(m.path)}
                className="glass-panel shine group relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl p-4 text-left sm:p-5"
              >
                <div
                  className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-50 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                  style={{ backgroundColor: m.color + "55" }}
                />
                {dueBadge && (
                  <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[#e2666f]/15 px-2 py-0.5 text-[10px] font-bold text-[#c2434d]">
                    <CalendarClock className="size-2.5" />
                    {summary?.dueToday} due
                  </span>
                )}
                <div
                  className="flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{ backgroundColor: m.color + "1f", color: m.color }}
                >
                  <Icon className="size-6" />
                </div>
                <div className="mt-auto">
                  <h3 className="text-sm font-extrabold tracking-wide">{m.title}</h3>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{m.desc}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* ── Ask MediPro ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="glass-strong shine relative mt-6 overflow-hidden rounded-2xl p-5 sm:p-6"
        >
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-wistaria/15 blur-3xl" />
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#a2a2d0]/15 text-wistaria">
                <Bot className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold tracking-tight text-wistaria">Ask MediPro</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Stuck on a concept? Get a source-minded study answer.
                </p>
              </div>
            </div>
            <Button onClick={() => navigate("/assistant")} size="sm" className="gap-1.5 rounded-full text-xs">
              Open
              <ArrowRight className="size-3" />
            </Button>
          </div>
        </motion.div>

        {/* ── Basics-First Path Grid ── */}
        <section data-tour-target="basics-first-path" className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-wistaria">
              <Sparkles className="size-5" />
              The Basics-First Path
            </h2>
            <button
              onClick={() => navigate("/basics")}
              className="flex items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
              style={{ cursor: "pointer" }}
            >
              View all
              <ArrowRight className="size-3.5" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {filteredTopics.map((topic, i) => {
                const article = topic.articleSlug
                  ? articleBySlug(topic.articleSlug)
                  : undefined;
                const isAvailable = Boolean(article);
                return (
                  <motion.button
                    key={topic.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, delay: isSearching ? 0 : i * 0.03 }}
                    whileHover={{ y: -3, scale: 1.015 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      if (isAvailable) {
                        navigate(`/research?article=${topic.articleSlug}`);
                      } else {
                        navigate("/research");
                      }
                    }}
                    className="glass-chip shine group flex items-start gap-3.5 p-4 text-left"
                  >
                    <div
                      className="flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                      style={{
                        backgroundColor: topic.color + "1f",
                        color: topic.color,
                      }}
                    >
                      <topic.icon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-bold">{topic.title}</p>
                        {SLUG_TO_SHORTCUT[topic.articleSlug ?? ""] && (
                          <span className="shrink-0 rounded-md bg-wistaria/15 px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-wistaria/80">
                            {SLUG_TO_SHORTCUT[topic.articleSlug!]}
                          </span>
                        )}
                        {isAvailable ? (
                          <span className="shrink-0 rounded-full bg-wistaria/15 px-2 py-0.5 text-[10px] font-bold text-wistaria">
                            Basics & In-Depth
                          </span>
                        ) : (
                          <span className="shrink-0 rounded-full bg-white/8 px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {topic.desc}
                      </p>
                      <span
                        className="mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold"
                        style={{
                          backgroundColor: (CATEGORY_COLORS[topic.category] ?? "#888") + "18",
                          color: CATEGORY_COLORS[topic.category] ?? "#888",
                        }}
                      >
                        {topic.category}
                      </span>
                    </div>
                    <ArrowRight className="mt-1 size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          {isSearching && filteredTopics.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <p className="text-sm font-semibold text-muted-foreground">
                No topics match "{query}"
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try "heart", "krebs", "nerves", or "breathing"
              </p>
            </motion.div>
          )}

          {/* View All Topics CTA */}
          {!isSearching && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/basics")}
              className="glass-chip shine mt-4 flex w-full items-center justify-center gap-2 rounded-2xl p-4 text-center text-sm font-bold text-wistaria"
              style={{ cursor: "pointer" }}
            >
              View All Topics
              <ArrowRight className="size-4" />
            </motion.button>
          )}
        </section>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <QueryErrorBoundary title="Couldn't load your dashboard">
      <DashboardInner />
    </QueryErrorBoundary>
  );
}
