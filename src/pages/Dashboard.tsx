import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Box,
  CalendarClock,
  CheckCircle2,
  Layers,
  Scissors,
  Search,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { useNavigate } from "react-router";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { AppHeader } from "@/components/AppHeader";
import { GlassBackdrop } from "@/components/GlassBackdrop";
import { Button } from "@/components/ui/button";
import { MusicPlayer } from "@/components/MusicPlayer";
import { QueryErrorBoundary } from "@/components/QueryErrorBoundary";
import { topicIcon } from "@/lib/medipro";
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

        {/* Learning path */}
        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-wistaria">
              <Sparkles className="size-5" />
              The basics-first path
            </h2>
            <button
              onClick={() => navigate("/basics")}
              className="flex items-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              All topics
              <ArrowRight className="size-4" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass-panel flex items-center gap-4 rounded-2xl p-4">
                  <div className="skeleton size-11 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-3.5 w-1/2 rounded-md" />
                    <div className="skeleton h-2 w-full rounded-full" />
                  </div>
                  <div className="skeleton h-6 w-16 rounded-full" />
                </div>
              ))
            ) : (
              (summary?.byTopic ?? []).map((t, i) => {
                const Icon = topicIcon(t.icon);
                const pct = t.total > 0 ? Math.round((t.mastered / t.total) * 100) : 0;
                return (
                  <motion.button
                    key={t.slug}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.06 }}
                    whileHover={{ x: 6 }}
                    onClick={() => navigate(`/basics?topic=${t.slug}`)}
                    className="glass-chip shine flex w-full items-center gap-4 rounded-2xl p-4 text-left"
                  >
                    <div
                      className="flex size-11 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: t.accent + "1f", color: t.accent }}
                    >
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="truncate text-sm font-bold">{t.title}</p>
                        <p className="shrink-0 text-[11px] font-semibold text-muted-foreground">
                          {t.done}/{t.total} reviewed
                        </p>
                      </div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, backgroundColor: t.accent }}
                        />
                      </div>
                    </div>
                    {t.due > 0 ? (
                      <span className="shrink-0 rounded-full bg-[#e2666f]/15 px-2.5 py-1 text-[11px] font-bold text-[#c2434d]">
                        {t.due} due
                      </span>
                    ) : (
                      <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                    )}
                  </motion.button>
                );
              })
            )}
          </div>
        </section>
      </main>

      <MusicPlayer />
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
