import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Bot,
  Box,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Cross,
  Droplets,
  HeartPulse,
  Layers,
  Network,
  RefreshCw,
  Scissors,
  Search,
  ShieldPlus,
  Sparkles,
  Target,
  Trophy,
  Utensils,
  Wind,
  Zap,
  Eye,
  Brain,
  Bone,
  Stethoscope,
} from "lucide-react";
import { useNavigate } from "react-router";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { AppHeader } from "@/components/AppHeader";
import { GlassBackdrop } from "@/components/GlassBackdrop";
import { Button } from "@/components/ui/button";
import { QueryErrorBoundary } from "@/components/QueryErrorBoundary";
import { ARTICLES, articleBySlug } from "@/lib/articles";
import { useEnsureSeeded } from "@/hooks/use-ensure-seeded";
import { useAuth } from "@/hooks/use-auth";

/* ─── Main module buttons ─── */
const MODULES = [
  {
    title: "FLASHCARDS",
    icon: Layers,
    desc: "Flip, recall, schedule",
    color: "#7b9ee8",
    path: "/flashcards",
    badge: "due",
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

/* ─── Basics-First Path ─── */
const BASICS_FIRST_PATH = [
  { num: 1, slug: "cardiac-cycle", title: "The Cardiac Cycle", desc: "Systole, diastole, and the pressure changes that drive every heartbeat.", articleSlug: "cardiac-cycle", icon: HeartPulse, color: "#ff5f7a" },
  { num: 2, slug: "action-potential", title: "The Action Potential", desc: "The electrical impulse that lets neurons and muscles communicate.", articleSlug: "action-potential", icon: Zap, color: "#a78bfa" },
  { num: 3, slug: "brachial-plexus", title: "The Brachial Plexus", desc: "The nerve superhighway from spine to fingertips — roots, trunks, cords, branches.", articleSlug: "brachial-plexus", icon: Network, color: "#22d3ee" },
  { num: 4, slug: "krebs-cycle", title: "The Krebs (TCA) Cycle", desc: "How cells extract energy from glucose — the central metabolic hub.", articleSlug: "krebs-cycle", icon: RefreshCw, color: "#f59e0b" },
  { num: 5, slug: "muscle-contraction", title: "Muscle Contraction", desc: "Actin, myosin, and the sliding filament theory — how muscles generate force.", articleSlug: "muscle-contraction", icon: Activity, color: "#e879f9" },
  { num: 6, slug: "respiratory-mechanics", title: "Respiratory Mechanics", desc: "Ventilation, gas exchange, and the physics of breathing.", articleSlug: "respiratory-mechanics", icon: Wind, color: "#67e8f9" },
  { num: 7, slug: "renal-physiology", title: "Renal Physiology", desc: "Filtration, reabsorption, and the nephron — how the kidney balances the body.", articleSlug: undefined, icon: Droplets, color: "#22d3ee" },
  { num: 8, slug: "gi-system", title: "Gastrointestinal System", desc: "From ingestion to absorption — the organs and enzymes of digestion.", articleSlug: undefined, icon: Utensils, color: "#f59e0b" },
  { num: 9, slug: "endocrine-system", title: "Endocrine System", desc: "Hormones, feedback loops, and how glands regulate the body.", articleSlug: undefined, icon: Cross, color: "#a78bfa" },
  { num: 10, slug: "blood-immunity", title: "Blood & Immunity", desc: "Blood cells, clotting, and the immune defences that keep you alive.", articleSlug: undefined, icon: ShieldPlus, color: "#e2666f" },
];

/* ─── Categories with topics ─── */
interface CategoryTopic {
  id: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  link: string;
  tags: string[];
}

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  topics: CategoryTopic[];
}

const CATEGORIES: Category[] = [
  {
    id: "anatomy",
    name: "Anatomy",
    icon: Bone,
    color: "#22d3ee",
    topics: [
      { id: "heart-diag", title: "Human Heart", desc: "Chambers, valves, and blood flow through the cardiac muscle.", icon: HeartPulse, color: "#ff5f7a", link: "/diagrams", tags: ["heart", "cardiac", "valves"] },
      { id: "brain-diag", title: "Brain & Nervous System", desc: "Lobes, cerebellum, brainstem, and neural pathways.", icon: Brain, color: "#a78bfa", link: "/diagrams", tags: ["brain", "nervous", "neural", "lobes"] },
      { id: "skeleton-diag", title: "Skeletal System", desc: "Bones, joints, and the structural framework of the body.", icon: Bone, color: "#e0f2fe", link: "/diagrams", tags: ["skeleton", "bones", "skull", "femur", "spine"] },
      { id: "eye-diag", title: "Human Eye", desc: "Cornea, lens, retina, and the pathway of vision.", icon: Eye, color: "#c084fc", link: "/diagrams", tags: ["eye", "retina", "vision", "optic"] },
      { id: "brachial-plexus-art", title: "The Brachial Plexus", desc: "Roots, trunks, cords, and branches — the nerve network to your arm.", icon: Network, color: "#22d3ee", link: "/research?article=brachial-plexus", tags: ["brachial", "plexus", "nerves", "arm", "c5", "t1"] },
    ],
  },
  {
    id: "physiology",
    name: "Physiology",
    icon: Activity,
    color: "#a78bfa",
    topics: [
      { id: "cardiac-cycle-art", title: "The Cardiac Cycle", desc: "Systole, diastole, pressure changes, and heart sounds.", icon: HeartPulse, color: "#ff5f7a", link: "/research?article=cardiac-cycle", tags: ["cardiac", "cycle", "systole", "diastole", "heartbeat"] },
      { id: "action-potential-art", title: "The Action Potential", desc: "Depolarisation, repolarisation, and the all-or-nothing principle.", icon: Zap, color: "#a78bfa", link: "/research?article=action-potential", tags: ["action", "potential", "neuron", "depolarisation", "sodium"] },
      { id: "muscle-contraction-art", title: "Muscle Contraction", desc: "Sliding filament theory, cross-bridge cycle, and Ca²⁺ regulation.", icon: Activity, color: "#e879f9", link: "/research?article=muscle-contraction", tags: ["muscle", "contraction", "actin", "myosin", "sarcomere"] },
      { id: "respiratory-art", title: "Respiratory Mechanics", desc: "Boyle's Law, lung compliance, gas exchange, and ventilation.", icon: Wind, color: "#67e8f9", link: "/research?article=respiratory-mechanics", tags: ["respiratory", "lungs", "breathing", "ventilation", "boyle"] },
      { id: "lungs-diag", title: "Lungs & Respiratory", desc: "Trachea, bronchi, bronchioles, and alveoli — the breathing tree.", icon: Wind, color: "#67e8f9", link: "/diagrams", tags: ["lungs", "trachea", "alveoli", "bronchi"] },
    ],
  },
  {
    id: "biochemistry",
    name: "Biochemistry",
    icon: RefreshCw,
    color: "#f59e0b",
    topics: [
      { id: "krebs-art", title: "The Krebs (TCA) Cycle", desc: "The 8-step enzymatic engine inside mitochondria.", icon: RefreshCw, color: "#f59e0b", link: "/research?article=krebs-cycle", tags: ["krebs", "tca", "cycle", "mitochondria", "acetyl-coa", "energy"] },
      { id: "digestive-diag", title: "Digestive System", desc: "Esophagus, stomach, intestines, liver, and pancreas.", icon: Utensils, color: "#f59e0b", link: "/diagrams", tags: ["digestive", "stomach", "intestines", "liver", "pancreas"] },
    ],
  },
  {
    id: "systems",
    name: "Systems",
    icon: Stethoscope,
    color: "#6fb5b0",
    topics: [
      { id: "human-body-diag", title: "Human Anatomy Overview", desc: "All major organ systems in one glowing full-body view.", icon: Stethoscope, color: "#22d3ee", link: "/diagrams", tags: ["body", "anatomy", "overview", "organs", "systems"] },
      { id: "kidney-diag", title: "Kidney & Nephron", desc: "Glomerulus, tubules, Loop of Henle — the body's filter.", icon: Droplets, color: "#22d3ee", link: "/diagrams", tags: ["kidney", "nephron", "glomerulus", "renal", "filtration"] },
      { id: "gi-diag", title: "Gastrointestinal System", desc: "Digestion, absorption, and the gut-brain axis.", icon: Utensils, color: "#f59e0b", link: "/diagrams", tags: ["gi", "gastrointestinal", "digestion", "gut", "stomach"] },
      { id: "renal-art", title: "Renal Physiology", desc: "Filtration, reabsorption, and acid-base balance.", icon: Droplets, color: "#22d3ee", link: "/research", tags: ["renal", "kidney", "filtration", "nephron"] },
      { id: "endocrine-art", title: "Endocrine System", desc: "Hormones, feedback loops, and gland regulation.", icon: Cross, color: "#a78bfa", link: "/research", tags: ["endocrine", "hormones", "glands", "thyroid", "insulin"] },
      { id: "blood-art", title: "Blood & Immunity", desc: "Blood cells, clotting cascades, and immune defences.", icon: ShieldPlus, color: "#e2666f", link: "/research", tags: ["blood", "immunity", "white blood cells", "clotting"] },
    ],
  },
];

/* ─── Helpers ─── */
function getSearchableItems() {
  const items: { id: string; title: string; desc: string; link: string; tags: string[]; type: "diagram" | "article" | "category-topic" }[] = [];

  // Articles from the library
  for (const a of ARTICLES) {
    items.push({
      id: a.slug,
      title: a.title,
      desc: a.summary,
      link: `/research?article=${a.slug}`,
      tags: [a.category.toLowerCase(), a.title.toLowerCase(), a.slug],
      type: "article",
    });
  }

  // Category topics
  for (const cat of CATEGORIES) {
    for (const t of cat.topics) {
      items.push({
        id: t.id,
        title: t.title,
        desc: t.desc,
        link: t.link,
        tags: [...t.tags, cat.name.toLowerCase()],
        type: "category-topic",
      });
    }
  }

  // Diagrams
  const diagramNames = ["Human Anatomy", "Human Heart", "Brachial Plexus", "Brain & Nervous System", "Lungs & Respiratory", "Digestive System", "Kidney & Nephron", "Human Eye", "Skeletal System"];
  const diagramTags = [
    ["human", "anatomy", "body", "organs", "overview"],
    ["heart", "cardiac", "chambers", "valves", "blood flow"],
    ["brachial", "plexus", "nerves", "arm", "c5", "t1"],
    ["brain", "nervous", "system", "lobes", "cerebellum"],
    ["lungs", "respiratory", "trachea", "bronchi", "alveoli"],
    ["digestive", "system", "stomach", "intestines", "liver"],
    ["kidney", "nephron", "glomerulus", "renal", "filtration"],
    ["eye", "retina", "cornea", "lens", "vision", "optic"],
    ["skeleton", "bones", "skull", "spine", "femur", "ribcage"],
  ];
  for (let i = 0; i < diagramNames.length; i++) {
    items.push({
      id: `diag-${i}`,
      title: diagramNames[i],
      desc: `Interactive heatwave diagram`,
      link: "/diagrams",
      tags: diagramTags[i] ?? [],
      type: "diagram",
    });
  }

  return items;
}

/* ─── Collapsible Category Section ─── */
function CategorySection({
  category,
  isExpanded,
  onToggle,
  searchQuery,
}: {
  category: Category;
  isExpanded: boolean;
  onToggle: () => void;
  searchQuery: string;
}) {
  const navigate = useNavigate();

  const filteredTopics = useMemo(() => {
    if (!searchQuery) return category.topics;
    const q = searchQuery.toLowerCase();
    return category.topics.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.includes(q))
    );
  }, [category.topics, searchQuery]);

  if (filteredTopics.length === 0 && searchQuery) return null;

  const previewTopics = isExpanded ? filteredTopics : filteredTopics.slice(0, 2);
  const hasMore = filteredTopics.length > 2;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-panel shine overflow-hidden rounded-3xl"
    >
      {/* Category header */}
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 p-5 text-left transition-colors hover:bg-white/5"
      >
        <div className="flex items-center gap-3">
          <div
            className="flex size-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: category.color + "1f", color: category.color }}
          >
            <category.icon className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold tracking-tight">{category.name}</h3>
            <p className="text-xs text-muted-foreground">
              {filteredTopics.length} topic{filteredTopics.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="size-5 text-muted-foreground" />
        </motion.div>
      </button>

      {/* Topic grid */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-3 px-5 pb-5 sm:grid-cols-2">
              {previewTopics.map((topic) => (
                <motion.button
                  key={topic.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(topic.link)}
                  className="glass-chip shine group flex items-start gap-3 rounded-2xl p-4 text-left transition-shadow hover:shadow-lg hover:shadow-black/10"
                >
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{ backgroundColor: topic.color + "1f", color: topic.color }}
                  >
                    <topic.icon className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{topic.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{topic.desc}</p>
                  </div>
                  <ArrowRight className="mt-1 size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </motion.button>
              ))}
            </div>

            {/* View All button */}
            {!searchQuery && hasMore && (
              <div className="border-t border-white/5 px-5 py-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle();
                  }}
                  className="flex items-center gap-1.5 text-sm font-semibold text-wistaria transition-colors hover:text-foreground"
                >
                  {isExpanded ? "Show less" : `View all ${filteredTopics.length} topics`}
                  <ChevronRight className="size-4" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed preview (always show 2 when not expanded and no search) */}
      {!isExpanded && !searchQuery && hasMore && (
        <div className="grid grid-cols-1 gap-3 px-5 pb-5 sm:grid-cols-2">
          {previewTopics.map((topic) => (
            <motion.button
              key={topic.id}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(topic.link)}
              className="glass-chip shine group flex items-start gap-3 rounded-2xl p-4 text-left transition-shadow hover:shadow-lg hover:shadow-black/10"
            >
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                style={{ backgroundColor: topic.color + "1f", color: topic.color }}
              >
                <topic.icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{topic.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{topic.desc}</p>
              </div>
              <ArrowRight className="mt-1 size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.button>
          ))}
        </div>
      )}

      {!isExpanded && !searchQuery && hasMore && (
        <div className="border-t border-white/5 px-5 py-3">
          <button
            onClick={onToggle}
            className="flex items-center gap-1.5 text-sm font-semibold text-wistaria transition-colors hover:text-foreground"
          >
            View all {filteredTopics.length} topics
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </motion.section>
  );
}

/* ─── Main Dashboard ─── */
function DashboardInner() {
  useEnsureSeeded();

  const navigate = useNavigate();
  const { user } = useAuth();
  const topics = useQuery(api.content.topics);
  const summary = useQuery(api.progress.summary);

  const loading = topics === undefined || summary === undefined;

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const firstName = user?.name?.split(" ")[0] ?? (user?.isAnonymous ? "Guest" : "future doctor");
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening";

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Search results for global search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const allItems = getSearchableItems();
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.includes(q))
    );
  }, [searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen">
      <GlassBackdrop />
      <AppHeader />

      <main className="mx-auto max-w-6xl px-4 pb-32 pt-10 sm:px-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-semibold text-muted-foreground">
            {greeting}, {firstName}
          </p>
          <h1 className="glow-text mt-1 text-balance text-3xl font-extrabold tracking-tight text-wistaria sm:text-4xl">
            Where Medicine Becomes Energetic
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Your 1-3-7 spaced-repetition path through the trickiest
            first-year topics. A few focused minutes today beats a cram later.
          </p>
          <div className="mt-5">
            <Button onClick={() => navigate("/flashcards")} className="gap-2 rounded-full">
              Start today's review
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative mt-8"
        >
          <div className="glass-panel shine flex items-center gap-3 rounded-2xl px-5 py-3.5">
            <Search className="size-5 shrink-0 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search topics, diagrams, articles…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
              style={{ cursor: "text" }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="rounded-lg bg-white/10 px-2 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:bg-white/20 hover:text-foreground"
                style={{ cursor: "pointer" }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {isSearching && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="glass-panel shine absolute left-0 right-0 z-50 mt-2 max-h-[60vh] overflow-y-auto rounded-2xl p-3"
              >
                {searchResults.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-sm font-semibold text-muted-foreground">No results found</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Try "heart", "brain", "krebs", or "skeleton"
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {searchResults.slice(0, 8).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          navigate(item.link);
                          setSearchQuery("");
                        }}
                        className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-white/10"
                        style={{ cursor: "pointer" }}
                      >
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-wistaria/15 text-wistaria">
                          {item.type === "diagram" ? (
                            <Eye className="size-4" />
                          ) : (
                            <Search className="size-4" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold">{item.title}</p>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                        <span className="shrink-0 rounded-full bg-white/8 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          {item.type === "diagram" ? "Diagram" : "Article"}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Ask MediPro — AI study assistant */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="glass-strong shine relative mt-8 overflow-hidden rounded-3xl p-6 sm:p-8"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-wistaria/20 blur-3xl" />
          <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#a2a2d0]/15 text-wistaria">
                <Bot className="size-6" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-wistaria">Ask MediPro</h2>
                <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
                  Stuck on a concept? Get an accurate, source-minded study answer —
                  then have it read aloud in a voice that helps it stick.
                </p>
              </div>
            </div>
            <Button onClick={() => navigate("/assistant")} className="gap-2 rounded-full">
              Open assistant
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </motion.div>

        {/* The four floating module buttons */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {MODULES.map((m, i) => {
            const Icon = m.icon;
            const dueBadge = m.badge === "due" && !loading && (summary?.dueToday ?? 0) > 0;
            return (
              <motion.button
                key={m.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                whileHover={{ y: -8, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate(m.path)}
                className="glass-panel shine group relative flex flex-col items-start gap-4 overflow-hidden rounded-3xl p-5 text-left sm:p-6"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-60 blur-2xl transition-opacity duration-300 group-hover:opacity-100" style={{ backgroundColor: m.color + "55" }} />

                {dueBadge && (
                  <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-[#e2666f]/15 px-2.5 py-1 text-[11px] font-bold text-[#c2434d]">
                    <CalendarClock className="size-3" />
                    {summary?.dueToday} due
                  </span>
                )}

                <div
                  className="flex size-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{ backgroundColor: m.color + "1f", color: m.color }}
                >
                  <Icon className="size-7" />
                </div>

                <div className="mt-auto">
                  <h2 className="text-base font-extrabold tracking-wide">{m.title}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">{m.desc}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Stats */}
        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-wistaria">
            <Target className="size-5" />
            Today at a glance
          </h2>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {[
              {
                label: "Due today",
                value: summary?.dueToday,
                icon: CalendarClock,
                color: "#7b9ee8",
              },
              {
                label: "Mastered",
                value: summary?.mastered,
                icon: Trophy,
                color: "#6fb5b0",
              },
              {
                label: "Accuracy",
                value: summary ? `${summary.accuracy}%` : undefined,
                icon: CheckCircle2,
                color: "#a88bd4",
              },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 + i * 0.08 }}
                  className="glass-panel shine rounded-3xl p-5"
                >
                  {loading ? (
                    <div className="flex flex-col gap-3">
                      <div className="skeleton h-3 w-20 rounded-md" />
                      <div className="skeleton h-8 w-16 rounded-lg" />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <Icon className="size-4" style={{ color: s.color }} />
                        <span className="text-xs font-semibold text-muted-foreground">{s.label}</span>
                      </div>
                      <p className="mt-2 text-3xl font-extrabold tracking-tight">{s.value ?? 0}</p>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* The Basics-First Path — horizontal scroll */}
        {!isSearching && (
          <section className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-wistaria">
                <Sparkles className="size-5" />
                The Basics-First Path
              </h2>
              <button
                onClick={() => navigate("/research")}
                className="flex items-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                style={{ cursor: "pointer" }}
              >
                All topics
                <ArrowRight className="size-4" />
              </button>
            </div>

            <div className="mt-4 flex gap-3 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollSnapType: "x mandatory" }}>
              {BASICS_FIRST_PATH.map((topic, i) => {
                const article = topic.articleSlug ? articleBySlug(topic.articleSlug) : undefined;
                const isAvailable = Boolean(article);
                return (
                  <motion.button
                    key={topic.slug}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      if (isAvailable) {
                        navigate(`/research?article=${topic.articleSlug}`);
                      } else {
                        navigate("/research");
                      }
                    }}
                    className="glass-chip shine flex min-w-[260px] shrink-0 flex-col gap-3 p-5 text-left"
                    style={{ scrollSnapAlign: "start" }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex size-11 shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: topic.color + "1f", color: topic.color }}
                      >
                        <topic.icon className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">
                          <span className="mr-1 text-[11px] font-extrabold text-muted-foreground">
                            {topic.num}.
                          </span>
                          {topic.title}
                        </p>
                      </div>
                    </div>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{topic.desc}</p>
                    <div className="mt-auto">
                      {isAvailable ? (
                        <span className="inline-block rounded-full bg-wistaria/15 px-2.5 py-1 text-[11px] font-bold text-wistaria">
                          Basics & In-Depth
                        </span>
                      ) : (
                        <span className="inline-block rounded-full bg-white/8 px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </section>
        )}

        {/* Topic Categories — Grid with collapsible sections */}
        {!isSearching && (
          <section className="mt-10 space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-wistaria">
              <Layers className="size-5" />
              Browse by Topic
            </h2>
            {CATEGORIES.map((cat) => (
              <CategorySection
                key={cat.id}
                category={cat}
                isExpanded={expandedCategories[cat.id] ?? false}
                onToggle={() => toggleCategory(cat.id)}
                searchQuery=""
              />
            ))}
          </section>
        )}
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
