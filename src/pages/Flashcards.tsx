import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Check,
  Flame,
  Layers,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { GlassBackdrop } from "@/components/GlassBackdrop";
import { QueryErrorBoundary } from "@/components/QueryErrorBoundary";
import { DeckGridSkeleton, FlashcardSkeleton } from "@/components/Skeletons";
import { Button } from "@/components/ui/button";
import { useEnsureSeeded } from "@/hooks/use-ensure-seeded";
import { isDue, randomQuote, topicIcon } from "@/lib/medipro";

/* ---------------------------- deck list ---------------------------- */

function DeckList() {
  useEnsureSeeded();
  const navigate = useNavigate();
  const topics = useQuery(api.content.topics);
  const summary = useQuery(api.progress.summary);
  const loading = topics === undefined || summary === undefined;

  const byTopic = useMemo(() => {
    const map = new Map((summary?.byTopic ?? []).map((t) => [t.slug, t]));
    return map;
  }, [summary]);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-32 pt-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm font-semibold text-muted-foreground">
          Spaced repetition · 1 → 3 → 7 days
        </p>
        <h1 className="mt-1 text-balance text-3xl font-extrabold tracking-tight text-wistaria sm:text-4xl">
          Choose a deck
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Flip the card, recall the answer, then be honest. Get it right and
          it returns in 1 day — then 3, then 7. Get it wrong and it's back
          tomorrow.
        </p>
      </motion.div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <DeckGridSkeleton />
        ) : (
          (topics ?? []).map((t, i) => {
            const Icon = topicIcon(t.icon);
            const stat = byTopic.get(t.slug);
            const pct =
              stat && stat.total > 0 ? Math.round((stat.mastered / stat.total) * 100) : 0;
            return (
              <motion.button
                key={t.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/flashcards?topic=${t.slug}`)}
                className="glass-panel group flex flex-col gap-4 rounded-3xl p-5 text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="flex size-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: t.accent + "1f", color: t.accent }}
                  >
                    <Icon className="size-6" />
                  </div>
                  {stat && stat.due > 0 ? (
                    <span className="flex items-center gap-1 rounded-full bg-[#e2666f]/15 px-2.5 py-1 text-[11px] font-bold text-[#c2434d]">
                      <Flame className="size-3" />
                      {stat.due} due
                    </span>
                  ) : (
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                      {stat ? `${stat.done}/${stat.total}` : "—"} reviewed
                    </span>
                  )}
                </div>

                <div>
                  <h2 className="text-base font-extrabold tracking-tight">{t.title}</h2>
                  <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                    {t.subject}
                  </p>
                </div>

                <div className="mt-auto space-y-2">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: t.accent }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-muted-foreground">
                      {stat?.total ?? 6} cards
                    </span>
                    <span className="flex items-center gap-1 font-bold" style={{ color: t.accent }}>
                      Study
                      <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })
        )}
      </div>
    </main>
  );
}

/* ------------------------- study session --------------------------- */

const WIN_SPARKS = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2;
  const dist = 60 + (i % 4) * 26;
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist - 18,
    delay: i * 0.03,
    color: ["#7b9ee8", "#a2a2d0", "#feffaf", "#e896b4", "#6fb5b0"][i % 5],
  };
});

function StudySession({ slug }: { slug: string }) {
  const navigate = useNavigate();
  const deck = useQuery(api.content.deck, { slug });
  const progress = useQuery(api.progress.myProgress);
  const recordAnswer = useMutation(api.progress.recordAnswer);

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [result, setResult] = useState<"won" | "missed" | null>(null);
  const [quote, setQuote] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [finished, setFinished] = useState(false);

  const queue = useMemo(() => {
    if (!deck || !progress) return null;
    const progressByCard = new Map(progress.map((p) => [p.cardId, p]));
    const withDue = deck.cards.map((c) => ({
      card: c,
      due: isDue(progressByCard.get(c._id)),
    }));
    return [...withDue.filter((c) => c.due), ...withDue.filter((c) => !c.due)];
  }, [deck, progress]);

  const loading = deck === undefined || progress === undefined;

  const handleAnswer = useCallback(
    async (correct: boolean) => {
      if (!queue || !queue[index]) return;
      const { card } = queue[index];
      setFlipped(false);
      setResult(correct ? "won" : "missed");
      setAnswered((a) => a + 1);
      if (correct) setCorrectCount((c) => c + 1);
      else setQuote(randomQuote());

      // Fire-and-forget persistence; toast on failure.
      recordAnswer({ cardId: card._id, correct }).catch(() => {
        toast.error("Couldn't save your progress — check your connection.");
      });
    },
    [queue, index, recordAnswer],
  );

  const advance = useCallback(() => {
    setResult(null);
    if (index + 1 >= (queue?.length ?? 0)) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
  }, [index, queue]);

  const restart = () => {
    setIndex(0);
    setFlipped(false);
    setResult(null);
    setCorrectCount(0);
    setAnswered(0);
    setFinished(false);
  };

  if (!loading && queue && queue.length === 0) {
    return (
      <main className="mx-auto max-w-6xl px-4 pb-32 pt-10 text-center sm:px-6">
        <BookOpenCheck className="mx-auto size-12 text-wistaria" />
        <h1 className="mt-4 text-2xl font-extrabold text-wistaria">No cards yet</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This deck has no flashcards yet. Check back soon.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => navigate("/flashcards")}>
          <ArrowLeft className="size-4" />
          Back to decks
        </Button>
      </main>
    );
  }

  if (finished && queue) {
    const total = queue.length;
    const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    return (
      <main className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-32 pt-16 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-strong w-full max-w-md rounded-3xl p-10"
        >
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#6fb5b0]/20 text-[#3e8f88]">
            <BookOpenCheck className="size-8" />
          </div>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-wistaria">
            Session complete!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You answered {total} cards with {pct}% accuracy.
          </p>
          <p className="mt-4 text-4xl font-extrabold tracking-tight">
            {correctCount}
            <span className="text-lg font-semibold text-muted-foreground"> / {total} correct</span>
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button onClick={restart} className="gap-2">
              <RotateCcw className="size-4" />
              Study again
            </Button>
            <Button variant="outline" onClick={() => navigate("/flashcards")}>
              Back to decks
            </Button>
          </div>
        </motion.div>
      </main>
    );
  }

  const current = queue?.[index]?.card;
  const total = queue?.length ?? 0;

  return (
    <main className="mx-auto max-w-3xl px-4 pb-32 pt-10 sm:px-6">
      {/* session header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/flashcards")}
          className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Decks
        </button>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-[#e2666f]/12 px-2.5 py-1 text-[11px] font-bold text-[#c2434d]">
            <Flame className="size-3" />
            streak {correctCount}
          </span>
        </div>
      </div>

      {/* progress */}
      <div className="mt-5 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cloud to-wistaria"
            animate={{ width: `${total > 0 ? (answered / total) * 100 : 0}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
        <span className="text-xs font-bold tabular-nums text-muted-foreground">
          {answered}/{total}
        </span>
      </div>

      {loading ? (
        <div className="mt-8">
          <FlashcardSkeleton />
        </div>
      ) : current ? (
        <>
          <p className="mt-6 text-center text-xs font-bold uppercase tracking-[0.25em] text-wistaria">
            {deck?.topic.title} · {deck?.topic.subject}
          </p>

          {/* 3D flip card — Butter face, dark blue-gray ink */}
          <div className="mx-auto mt-4 max-w-xl [perspective:1600px]">
            <motion.div
              className="relative h-[22rem] w-full cursor-pointer [transform-style:preserve-3d]"
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.55, ease: [0.4, 0.2, 0.2, 1] }}
              onClick={() => setFlipped((f) => !f)}
              role="button"
              aria-label={flipped ? "Show question" : "Show answer"}
            >
              {/* front — question */}
              <div className="absolute inset-0 flex flex-col rounded-3xl border border-butter/60 bg-butter p-8 text-[#33415c] shadow-[0_24px_60px_-20px_rgba(120,162,210,0.55)] [backface-visibility:hidden]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#5c7aa8]">
                    <Layers className="size-3.5" />
                    Question
                  </span>
                  <span className="text-[11px] font-bold text-[#8a93b5]">
                    {index + 1} / {total}
                  </span>
                </div>
                <div className="flex flex-1 items-center justify-center">
                  <p className="text-balance text-center text-xl font-semibold leading-relaxed sm:text-2xl">
                    {current.front}
                  </p>
                </div>
                <p className="text-center text-xs font-semibold text-[#8a93b5]">
                  Tap to reveal the answer
                </p>
              </div>

              {/* back — answer */}
              <div className="absolute inset-0 flex flex-col rounded-3xl border border-butter/60 bg-butter p-8 text-[#33415c] shadow-[0_24px_60px_-20px_rgba(120,162,210,0.55)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#5c7aa8]">
                    <Sparkles className="size-3.5" />
                    Answer
                  </span>
                  <span className="text-[11px] font-bold text-[#8a93b5]">
                    {index + 1} / {total}
                  </span>
                </div>
                <div className="flex flex-1 flex-col items-center justify-center gap-5">
                  <p className="text-balance text-center text-lg font-semibold leading-relaxed">
                    {current.back}
                  </p>
                  <p className="rounded-2xl bg-cloud/15 px-4 py-2.5 text-center text-xs font-medium leading-5 text-[#4a5c86]">
                    {current.fact}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* verdict buttons */}
          <AnimatePresence mode="wait">
            {flipped && !result ? (
              <motion.div
                key="verdict"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mx-auto mt-6 flex max-w-xl items-center gap-3"
              >
                <Button
                  variant="outline"
                  className="h-14 flex-1 gap-2 rounded-2xl border-[#e2666f]/40 bg-white/5 text-[#e2666f] hover:bg-[#e2666f]/10"
                  onClick={() => void handleAnswer(false)}
                >
                  <X className="size-5" />
                  I missed it
                </Button>
                <Button
                  className="h-14 flex-1 gap-2 rounded-2xl bg-[#6fb5b0] text-white shadow-[0_12px_28px_-10px_rgba(111,181,176,0.7)] hover:bg-[#5ba39e]"
                  onClick={() => void handleAnswer(true)}
                >
                  <Check className="size-5" />
                  I knew it
                </Button>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* WON! celebration */}
          <AnimatePresence>
            {result === "won" && (
              <motion.div
                key="won"
                className="pointer-events-none fixed inset-0 z-[85] flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.h2
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: [0.4, 1.15, 1], opacity: 1 }}
                  exit={{ scale: 1.3, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-7xl font-extrabold tracking-tight text-wistaria drop-shadow-[0_10px_30px_rgba(162,162,208,0.6)]"
                >
                  WON!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="mt-2 text-sm font-semibold text-muted-foreground"
                >
                  Back in {1} day · then 3 · then 7
                </motion.p>
                {WIN_SPARKS.map((s, i) => (
                  <motion.span
                    key={i}
                    className="absolute left-1/2 top-1/2 size-2.5 rounded-full"
                    style={{ backgroundColor: s.color }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
                    animate={{
                      x: s.x,
                      y: s.y,
                      opacity: 0,
                      scale: 1,
                      rotate: 180,
                    }}
                    transition={{
                      duration: 0.9,
                      delay: 0.15 + s.delay,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* missed — motivational quote */}
          <AnimatePresence>
            {result === "missed" && (
              <motion.div
                key="missed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-strong mx-auto mt-6 max-w-xl rounded-3xl p-6 text-center"
              >
                <p className="text-balance text-base font-semibold leading-7 text-foreground">
                  "{quote}"
                </p>
                <p className="mt-2 text-xs font-semibold text-muted-foreground">
                  This card returns tomorrow — that's the point.
                </p>
                <Button className="mt-4 gap-2" onClick={advance}>
                  Keep going
                  <ArrowRight className="size-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* auto-advance after WON */}
          {result === "won" && (
            <motion.div
              key="advance-timer"
              className="mx-auto mt-6 flex max-w-xl justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Button
                variant="ghost"
                className="gap-2 text-muted-foreground"
                onClick={advance}
              >
                Next card
                <ArrowRight className="size-4" />
              </Button>
            </motion.div>
          )}
        </>
      ) : null}
    </main>
  );
}

/* ------------------------------ page ------------------------------- */

function FlashcardsInner() {
  useEnsureSeeded();
  const [searchParams] = useSearchParams();
  const topicSlug = searchParams.get("topic");

  return (
    <div className="min-h-screen">
      <GlassBackdrop />
      <AppHeader title={topicSlug ? "Flashcards" : undefined} />
      {topicSlug ? (
        <StudySession key={topicSlug} slug={topicSlug} />
      ) : (
        <DeckList />
      )}
    </div>
  );
}

export default function Flashcards() {
  return (
    <QueryErrorBoundary title="Couldn't load your flashcards">
      <FlashcardsInner />
    </QueryErrorBoundary>
  );
}
