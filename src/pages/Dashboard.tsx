import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Bot,
  Box,
  CalendarClock,
  CheckCircle2,
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
} from "lucide-react";
import { useNavigate } from "react-router";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { AppHeader } from "@/components/AppHeader";
import { GlassBackdrop } from "@/components/GlassBackdrop";
import { Button } from "@/components/ui/button";
import { QueryErrorBoundary } from "@/components/QueryErrorBoundary";
import { articleBySlug } from "@/lib/articles";
import { useEnsureSeeded } from "@/hooks/use-ensure-seeded";
import { useAuth } from "@/hooks/use-auth";

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

function DashboardInner() {
  useEnsureSeeded();

  const navigate = useNavigate();
  const { user } = useAuth();
  const topics = useQuery(api.content.topics);
  const summary = useQuery(api.progress.summary);

  const loading = topics === undefined || summary === undefined;

  const firstName = user?.name?.split(" ")[0] ?? (user?.isAnonymous ? "Guest" : "future doctor");
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening";

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
            Your 1-3-7 spaced-repetition path through the five trickiest
            first-year topics. A few focused minutes today beats a cram later.
          </p>
          <div className="mt-5">
            <Button onClick={() => navigate("/flashcards")} className="gap-2 rounded-full">
              Start today's review
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </motion.div>

        {/* Ask MediPro — AI study assistant */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="glass-strong shine relative mt-10 overflow-hidden rounded-3xl p-6 sm:p-8"
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
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {MODULES.map((m, i) => {
            const Icon = m.icon;
            const dueBadge = m.badge === "due" && !loading && (summary?.dueToday ?? 0) > 0;
            return (
              <motion.button
                key={m.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
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
        <section className="mt-12">
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

        {/* The Basics-First Path — all 10 core topics */}
        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-wistaria">
              <Sparkles className="size-5" />
              The Basics-First Path
            </h2>
            <button
              onClick={() => navigate("/research")}
              className="flex items-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              All topics
              <ArrowRight className="size-4" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {BASICS_FIRST_PATH.map((topic, i) => {
              const article = topic.articleSlug ? articleBySlug(topic.articleSlug) : undefined;
              const isAvailable = Boolean(article);
              return (
                <motion.button
                  key={topic.slug}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.06 }}
                  whileHover={{ x: 6 }}
                  onClick={() => {
                    if (isAvailable) {
                      navigate(`/research?article=${topic.articleSlug}`);
                    } else {
                      navigate("/research");
                    }
                  }}
                  className="glass-chip shine flex w-full items-center gap-4 rounded-2xl p-4 text-left"
                >
                  <div
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: topic.color + "1f", color: topic.color }}
                  >
                    <topic.icon className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate text-sm font-bold">
                        <span className="mr-1.5 text-[11px] font-extrabold text-muted-foreground">
                          {topic.num}.
                        </span>
                        {topic.title}
                      </p>
                      {isAvailable ? (
                        <span className="shrink-0 rounded-full bg-wistaria/15 px-2.5 py-1 text-[11px] font-bold text-wistaria">
                          Basics & In-Depth
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-full bg-white/8 px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{topic.desc}</p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                </motion.button>
              );
            })}
          </div>
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
