import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { AppHeader } from "@/components/AppHeader";
import { GlassBackdrop } from "@/components/GlassBackdrop";
import { QueryErrorBoundary } from "@/components/QueryErrorBoundary";
import { TopicCardSkeleton } from "@/components/Skeletons";
import { TopicDetailView } from "@/components/TopicDetailView";
import { useEnsureSeeded } from "@/hooks/use-ensure-seeded";
import { topicIcon } from "@/lib/medipro";

function TopicPicker() {
  useEnsureSeeded();
  const navigate = useNavigate();
  const topics = useQuery(api.content.topics);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-32 pt-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="tech-label">Fundamentals</span>
        <h1 className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-wistaria sm:text-4xl">
          The five packs that matter first
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Five topics chosen because they trip up nearly every first-year.
          Each opens with a plain-language basics layer and one light diagram,
          then unlocks the full in-depth text.
        </p>
      </motion.div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {topics === undefined
          ? Array.from({ length: 5 }).map((_, i) => <TopicCardSkeleton key={i} />)
          : topics.map((t, i) => {
              const Icon = topicIcon(t.icon);
              return (
                <motion.button
                  key={t.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/basics?topic=${t.slug}`)}
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
                      FREE
                    </span>
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold tracking-tight">{t.title}</h2>
                    <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                      {t.subject}
                    </p>
                    <p className="mt-2 text-[13px] leading-5 text-muted-foreground">
                      {t.blurb}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center gap-1.5 text-[11px] font-semibold">
                    <span className="rounded-full bg-cloud/20 px-2 py-0.5">Basics</span>
                    <ArrowRight className="size-3" />
                    <span className="rounded-full bg-wistaria/20 px-2 py-0.5">In-depth</span>
                  </div>
                </motion.button>
              );
            })}
      </div>
    </main>
  );
}

function BasicsInner() {
  useEnsureSeeded();
  const [searchParams] = useSearchParams();
  const topicSlug = searchParams.get("topic");

  return (
    <div className="min-h-screen">
      <GlassBackdrop />
      <AppHeader title={topicSlug ? "Fundamentals" : undefined} />
      {topicSlug ? <TopicDetailView key={topicSlug} slug={topicSlug} /> : <TopicPicker />}
    </div>
  );
}

export default function Basics() {
  return (
    <QueryErrorBoundary title="Couldn't load the fundamentals">
      <BasicsInner />
    </QueryErrorBoundary>
  );
}
