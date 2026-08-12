import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronDown,
  GraduationCap,
  Layers,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { RichText } from "@/components/RichText";
import { TextBlockSkeleton } from "@/components/Skeletons";
import { TopicDiagram } from "@/components/TopicDiagram";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TOPIC_ICONS } from "@/lib/medipro";

export function TopicDetailView({
  slug,
  backTo = "/basics",
  backLabel = "All topics",
}: {
  slug: string;
  backTo?: string;
  backLabel?: string;
}) {
  const navigate = useNavigate();
  const topic = useQuery(api.content.topicBySlug, { slug });
  const [mode, setMode] = useState<"basics" | "inDepth">("basics");

  // When the user switches between Basics and In-depth, glide back to the very
  // top of the article so the new section starts fresh — smooth, no jump, no
  // reload, no white flash. (Skips the first render: opening a topic shouldn't
  // trigger an unnecessary scroll.)
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [mode]);

  if (topic === undefined) {
    return (
      <main className="mx-auto max-w-3xl space-y-6 px-4 pb-32 pt-10 sm:px-6">
        <div className="skeleton h-5 w-28 rounded-md" />
        <div className="glass-panel space-y-4 p-6">
          <div className="flex items-center gap-3">
            <div className="skeleton size-12 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-1/2 rounded-md" />
              <div className="skeleton h-3 w-1/3 rounded-md" />
            </div>
          </div>
          <TextBlockSkeleton />
          <TextBlockSkeleton />
        </div>
      </main>
    );
  }

  if (!topic) {
    return (
      <main className="mx-auto max-w-3xl px-4 pb-32 pt-10 text-center sm:px-6">
        <p className="text-lg font-bold text-wistaria">Topic not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(backTo)}>
          <ArrowLeft className="size-4" />
          {backLabel}
        </Button>
      </main>
    );
  }

  const Icon = TOPIC_ICONS[topic.icon] ?? Layers;

  return (
    <main className="mx-auto max-w-4xl px-4 pb-32 pt-8 sm:px-6">
      <button
        onClick={() => navigate(backTo)}
        className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {backLabel}
      </button>

      {/* topic hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel shine relative mt-4 overflow-hidden rounded-3xl p-6 sm:p-8"
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: topic.accent }}
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
          <div
            className="flex size-16 shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: topic.accent + "1f", color: topic.accent }}
          >
            <Icon className="size-8" />
          </div>
          <div>
            <span className="glass-chip inline-flex items-center gap-1.5 rounded-full px-3 py-1">
              <GraduationCap className="size-3.5 text-wistaria" />
              <span className="tech-label text-[0.6rem]">{topic.subject}</span>
            </span>
            <h1 className="mt-3 text-balance text-3xl font-extrabold tracking-tight text-wistaria">
              {topic.title}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              {topic.blurb}
            </p>
          </div>
        </div>
      </motion.div>

      {/* mode toggle */}
      <Tabs
        value={mode}
        onValueChange={(v) => setMode(v as "basics" | "inDepth")}
        className="mt-6"
      >
        <TabsList className="glass-chip grid w-full grid-cols-2 gap-1 rounded-2xl p-1">
          <TabsTrigger value="basics" className="gap-1.5 rounded-xl py-2.5 font-bold">
            <Lightbulb className="size-4" />
            Basics first
          </TabsTrigger>
          <TabsTrigger value="inDepth" className="gap-1.5 rounded-xl py-2.5 font-bold">
            <BookOpen className="size-4" />
            In-depth
          </TabsTrigger>
        </TabsList>

        {mode === "basics" ? (
          <div className="mt-6 space-y-6">
            <TopicDiagram diagram={topic.diagram} accent={topic.accent} />

            <div className="glass-panel shine rounded-3xl p-6">
              <h2 className="flex items-center gap-2 text-base font-extrabold tracking-tight">
                <Sparkles className="size-4" style={{ color: topic.accent }} />
                Key points to remember
              </h2>
              <ul className="mt-4 space-y-2.5">
                {topic.keyPoints.map((k, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-2.5 text-sm leading-6 text-muted-foreground"
                  >
                    <span
                      className="mt-2 size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: topic.accent }}
                    />
                    {k}
                  </motion.li>
                ))}
              </ul>
            </div>

            {topic.basicBlocks.map((b, i) => (
              <motion.div
                key={b.heading}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.05 }}
                className="glass-panel shine rounded-3xl p-6"
              >
                <h2 className="text-lg font-extrabold tracking-tight text-wistaria">
                  {i + 1}. {b.heading}
                </h2>
                <RichText text={b.body} className="mt-3 text-[15px]" />
              </motion.div>
            ))}

            <div className="glass-chip flex flex-col items-center gap-3 rounded-3xl p-6 text-center sm:flex-row sm:justify-between sm:text-left">
              <div>
                <p className="text-sm font-extrabold">Ready to go deeper?</p>
                <p className="text-xs text-muted-foreground">
                  The full detail — enzymes, pressures, waveforms and exam traps.
                </p>
              </div>
              <Button onClick={() => setMode("inDepth")} className="gap-2">
                In-depth lesson
                <ChevronDown className="size-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <div className="glass-chip flex items-center gap-3 rounded-3xl p-5 text-sm text-muted-foreground">
              <Layers className="size-5 shrink-0 text-wistaria" />
              You're on the advanced layer. If anything feels heavy, switch back
              to Basics — the skeleton is still there.
            </div>
            {topic.inDepthBlocks.map((b, i) => (
              <motion.div
                key={b.heading}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.05 }}
                className="glass-panel shine rounded-3xl p-6"
              >
                <h2 className="text-lg font-extrabold tracking-tight text-wistaria">
                  {b.heading}
                </h2>
                <RichText text={b.body} className="mt-3 text-[15px]" />
              </motion.div>
            ))}
          </div>
        )}
      </Tabs>

      <div className="glass-strong shine mt-8 flex flex-col items-center gap-3 rounded-3xl p-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="text-base font-extrabold">Now lock it in</p>
          <p className="text-sm text-muted-foreground">
            Six flashcards for this topic, scheduled on the 1-3-7 ladder.
          </p>
        </div>
        <Button onClick={() => navigate(`/flashcards?topic=${slug}`)} className="gap-2">
          Practice flashcards
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </main>
  );
}
