import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Box, Layers, Microscope, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { AppHeader } from "@/components/AppHeader";
import { GlassBackdrop } from "@/components/GlassBackdrop";
import { QueryErrorBoundary } from "@/components/QueryErrorBoundary";
import { TopicCardSkeleton } from "@/components/Skeletons";
import { TopicDetailView } from "@/components/TopicDetailView";
import { Input } from "@/components/ui/input";
import { useEnsureSeeded } from "@/hooks/use-ensure-seeded";
import { topicIcon } from "@/lib/medipro";

/* --------------------------- library grid --------------------------- */

function ResearchLibrary() {
  useEnsureSeeded();
  const navigate = useNavigate();
  const topics = useQuery(api.content.topics);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return topics ?? [];
    return (topics ?? []).filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.blurb.toLowerCase().includes(q),
    );
  }, [topics, query]);

  const loading = topics === undefined;

  return (
    <main className="mx-auto max-w-6xl px-4 pb-32 pt-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="tech-label">The library · from foundations to frontiers</span>
        <h1 className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-wistaria sm:text-4xl">
          Research the basics until they break
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Every fundamentals topic arrives with a lightweight 3D diagram and a
          full in-depth lesson. Open a deep-dive below — the model rotates, the
          text goes as deep as you want.
        </p>
      </motion.div>

      {/* stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-7 grid grid-cols-3 gap-4"
      >
        {[
          { icon: Microscope, label: "Topics", value: loading ? "—" : (topics?.length ?? 0) },
          { icon: Box, label: "3D diagrams", value: loading ? "—" : (topics?.length ?? 0) },
          { icon: BookOpen, label: "In-depth lessons", value: loading ? "—" : (topics?.length ?? 0) },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.07 }}
              className="glass-chip flex flex-col items-center gap-1.5 rounded-2xl p-4 text-center"
            >
              <Icon className="size-4" style={{ color: "#6fb5b0" }} />
              <p className="text-xl font-extrabold tabular-nums">{s.value}</p>
              <p className="text-[11px] font-semibold text-muted-foreground">{s.label}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* search */}
      <div className="relative mt-8 max-w-md">
        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics, subjects…"
          className="glass-chip h-11 rounded-2xl pl-10"
          aria-label="Search the research library"
        />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <TopicCardSkeleton key={i} />)
        ) : filtered.length === 0 ? (
          <div className="glass-panel col-span-full flex flex-col items-center gap-3 rounded-3xl p-10 text-center">
            <Search className="size-8 text-muted-foreground" />
            <p className="text-sm font-bold">Nothing matches “{query}”</p>
            <p className="text-xs text-muted-foreground">
              Try a different topic, subject, or a shorter phrase.
            </p>
          </div>
        ) : (
          filtered.map((t, i) => {
            const Icon = topicIcon(t.icon);
            return (
              <motion.button
                key={t.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/research?topic=${t.slug}`)}
                className="glass-panel shine group flex flex-col gap-4 rounded-3xl p-5 text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="flex size-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: t.accent + "1f", color: t.accent }}
                  >
                    <Icon className="size-6" />
                  </div>
                  <span className="glass-chip px-2.5 py-1 font-mono text-[10px] font-semibold text-muted-foreground">
                    DEEP-DIVE
                  </span>
                </div>
                <div>
                  <h2 className="text-base font-extrabold tracking-tight">{t.title}</h2>
                  <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                    {t.subject}
                  </p>
                  <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-muted-foreground">
                    {t.blurb}
                  </p>
                </div>
                <div className="mt-auto flex items-center gap-1.5 text-[11px] font-semibold">
                  <span className="flex items-center gap-1 rounded-full bg-cloud/20 px-2 py-0.5">
                    <Box className="size-3" />
                    3D diagram
                  </span>
                  <ArrowRight className="size-3" />
                  <span className="flex items-center gap-1 rounded-full bg-wistaria/20 px-2 py-0.5">
                    <BookOpen className="size-3" />
                    In-depth
                  </span>
                </div>
              </motion.button>
            );
          })
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-chip mt-10 flex flex-col items-center gap-2 rounded-3xl p-6 text-center sm:flex-row sm:justify-between sm:text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#6fb5b0]/15 text-[#6fb5b0]">
            <Layers className="size-5" />
          </div>
          <div>
            <p className="text-sm font-extrabold">Want to lock the research in?</p>
            <p className="text-xs text-muted-foreground">
              Each topic's cards are waiting on the 1-3-7 ladder.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/flashcards")}
          className="flex items-center gap-1.5 text-sm font-bold text-wistaria transition-colors hover:text-cloud"
        >
          Open flashcards
          <ArrowRight className="size-4" />
        </button>
      </motion.div>
    </main>
  );
}

/* ------------------------------ page -------------------------------- */

function ResearchInner() {
  useEnsureSeeded();
  const [searchParams] = useSearchParams();
  const topicSlug = searchParams.get("topic");

  return (
    <div className="min-h-screen">
      <GlassBackdrop />
      <AppHeader title={topicSlug ? "Research" : undefined} />
      {topicSlug ? (
        <TopicDetailView
          key={topicSlug}
          slug={topicSlug}
          backTo="/research"
          backLabel="Back to the library"
        />
      ) : (
        <ResearchLibrary />
      )}
    </div>
  );
}

export default function Research() {
  return (
    <QueryErrorBoundary title="Couldn't load the research library">
      <ResearchInner />
    </QueryErrorBoundary>
  );
}
