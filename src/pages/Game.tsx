import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Clock3,
  Flame,
  Gamepad2,
  RotateCcw,
  Scissors,
  Trophy,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { GlassBackdrop } from "@/components/GlassBackdrop";
import { QueryErrorBoundary } from "@/components/QueryErrorBoundary";
import { FlashcardSkeleton, TopicCardSkeleton } from "@/components/Skeletons";
import { Button } from "@/components/ui/button";
import { useEnsureSeeded } from "@/hooks/use-ensure-seeded";
import { topicIcon } from "@/lib/medipro";

const QUESTION_SECONDS = 15;
const ANSWER_PAUSE_MS = 1000;

/** Fisher–Yates shuffle (returns a new array). */
function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Question {
  cardId: Id<"flashcards">;
  prompt: string;
  correct: string;
  options: { text: string; isCorrect: boolean }[];
}

/** One multiple-choice question per flashcard: the front is the prompt, the
 *  back is the correct answer, and up to three other answers are distractors. */
function buildQuestions(
  cards: readonly { _id: Id<"flashcards">; front: string; back: string }[],
): Question[] {
  return cards.map((card) => {
    const distractors = shuffle(
      cards.filter((c) => c._id !== card._id && c.back !== card.back),
    ).slice(0, 3);
    const options = shuffle([card.back, ...distractors.map((c) => c.back)]);
    return {
      cardId: card._id,
      prompt: card.front,
      correct: card.back,
      options: options.map((text) => ({ text, isCorrect: text === card.back })),
    };
  });
}

/* --------------------------- topic picker ---------------------------- */

function GameLobby() {
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
        <span className="tech-label">The OR · quick-fire rounds</span>
        <h1 className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-wistaria sm:text-4xl">
          Pick a topic, beat the clock
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Fifteen seconds per question, drawn from the same card bank as your
          flashcards. Every answer feeds your 1-3-7 schedule — so the game and
          the revision agree with each other.
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
                  onClick={() => navigate(`/game?topic=${t.slug}`)}
                  className="glass-panel shine group flex flex-col gap-4 rounded-3xl p-5 text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="flex size-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: t.accent + "1f", color: t.accent }}
                    >
                      <Icon className="size-6" />
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-[#e896b4]/15 px-2.5 py-1 text-[11px] font-bold text-[#d96a8f]">
                      <Gamepad2 className="size-3" />
                      PLAY
                    </span>
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold tracking-tight">{t.title}</h2>
                    <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                      {t.subject}
                    </p>
                  </div>
                  <p className="mt-auto flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <Clock3 className="size-3.5" />
                    {QUESTION_SECONDS}s per question · streak scoring
                  </p>
                </motion.button>
              );
            })}
      </div>
    </main>
  );
}

/* ----------------------------- quiz round ---------------------------- */

interface Answered {
  option: string | null; // null = ran out of time
  correct: boolean;
}

function QuizRound({ slug }: { slug: string }) {
  const navigate = useNavigate();
  const deck = useQuery(api.content.deck, { slug });
  const recordAnswer = useMutation(api.progress.recordAnswer);

  const questions = useMemo(
    () => (deck ? buildQuestions(deck.cards) : null),
    [deck],
  );

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [answered, setAnswered] = useState<Answered | null>(null);
  const [timeLeft, setTimeLeft] = useState(QUESTION_SECONDS);
  const [finished, setFinished] = useState(false);

  const loading = deck === undefined;
  const total = questions?.length ?? 0;
  const q = questions?.[index];

  const pick = useCallback(
    (option: string | null) => {
      if (answered !== null || !questions || index >= questions.length) return;
      const question = questions[index];
      const correct = option !== null && option === question.correct;
      setAnswered({ option, correct });
      if (correct) {
        const next = streak + 1;
        setScore((s) => s + 1);
        setStreak(next);
        setBestStreak((b) => Math.max(b, next));
      } else {
        setStreak(0);
      }
      recordAnswer({ cardId: question.cardId, correct }).catch(() => {
        toast.error("Couldn't save your answers to the schedule.");
      });
    },
    [answered, questions, index, streak, recordAnswer],
  );

  // One-second countdown while a question is live.
  useEffect(() => {
    if (finished || answered !== null || timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [finished, answered, timeLeft]);

  // Ran out of time — score it as a miss. (Deferred so the state update
  // happens in the timeout callback, not synchronously inside the effect.)
  useEffect(() => {
    if (finished || answered !== null || timeLeft > 0) return;
    const t = setTimeout(() => pick(null), 0);
    return () => clearTimeout(t);
  }, [finished, answered, timeLeft, pick]);

  // Brief pause after an answer, then the next question (or results).
  useEffect(() => {
    if (answered === null) return;
    const t = setTimeout(() => {
      if (!questions || index + 1 >= questions.length) {
        setFinished(true);
      } else {
        setIndex((i) => i + 1);
        setAnswered(null);
        setTimeLeft(QUESTION_SECONDS);
      }
    }, ANSWER_PAUSE_MS);
    return () => clearTimeout(t);
  }, [answered, questions, index]);

  const restart = () => {
    setIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setAnswered(null);
    setTimeLeft(QUESTION_SECONDS);
    setFinished(false);
  };

  if (!loading && !deck) {
    return (
      <main className="mx-auto max-w-6xl px-4 pb-32 pt-10 text-center sm:px-6">
        <Scissors className="mx-auto size-12 text-wistaria" />
        <h1 className="mt-4 text-2xl font-extrabold text-wistaria">Topic not found</h1>
        <Button variant="outline" className="mt-6" onClick={() => navigate("/game")}>
          <ArrowLeft className="size-4" />
          Back to topics
        </Button>
      </main>
    );
  }

  if (finished && questions) {
    const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
    return (
      <main className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-32 pt-16 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-strong shine w-full max-w-md rounded-3xl p-10"
        >
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [0, 4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#e896b4]/20 text-[#d96a8f]"
          >
            <Trophy className="size-8" />
          </motion.div>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-wistaria">
            Round over!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {deck?.topic.title} · {total} questions
          </p>
          <p className="mt-5 text-5xl font-extrabold tracking-tight">
            {score}
            <span className="text-lg font-semibold text-muted-foreground"> / {total}</span>
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold">
            <span className="rounded-full bg-[#e896b4]/15 px-3 py-1 text-[#d96a8f]">
              {accuracy}% accuracy
            </span>
            <span className="flex items-center gap-1 rounded-full bg-[#e2666f]/12 px-3 py-1 text-[#c2434d]">
              <Flame className="size-3.5" />
              best streak {bestStreak}
            </span>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Correct answers moved up your 1-3-7 ladder; misses are back tomorrow.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button onClick={restart} className="gap-2">
              <RotateCcw className="size-4" />
              Play again
            </Button>
            <Button variant="outline" onClick={() => navigate("/game")}>
              Choose another topic
            </Button>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pb-32 pt-10 sm:px-6">
      {/* round header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/game")}
          className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Topics
        </button>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-[#e896b4]/15 px-2.5 py-1 text-[11px] font-bold text-[#d96a8f]">
            <Gamepad2 className="size-3" />
            {deck?.topic.title}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-[#e2666f]/12 px-2.5 py-1 text-[11px] font-bold text-[#c2434d]">
            <Flame className="size-3.5" />
            {streak}
          </span>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold tabular-nums text-muted-foreground">
            {score} pts
          </span>
        </div>
      </div>

      {/* timer */}
      <div className="mt-5 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full"
            style={{
              backgroundColor:
                timeLeft > 8 ? "#6fb5b0" : timeLeft > 4 ? "#e0a458" : "#e2666f",
            }}
            animate={{ width: `${total > 0 ? (timeLeft / QUESTION_SECONDS) * 100 : 0}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="flex items-center gap-1 text-xs font-bold tabular-nums text-muted-foreground">
          <Clock3 className="size-3.5" />
          {timeLeft}s
        </span>
      </div>

      {loading || !q ? (
        <div className="mt-8">
          <FlashcardSkeleton />
        </div>
      ) : (
        <>
          <p className="mt-6 text-center text-xs font-bold uppercase tracking-[0.25em] text-wistaria">
            Question {index + 1} of {total}
          </p>

          {/* question card */}
          <motion.div
            key={q.cardId}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass-panel shine mt-4 flex min-h-[11rem] items-center justify-center rounded-3xl p-8"
          >
            <p className="text-balance text-center text-xl font-semibold leading-relaxed sm:text-2xl">
              {q.prompt}
            </p>
          </motion.div>

          {/* options */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {q.options.map((o) => {
              const showCorrect = answered !== null && o.isCorrect;
              const showWrong = answered !== null && answered.option === o.text && !o.isCorrect;
              const dimmed = answered !== null && !showCorrect && !showWrong;
              return (
                <motion.button
                  key={o.text}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  disabled={answered !== null}
                  onClick={() => pick(o.text)}
                  className={`glass-chip flex min-h-14 items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left text-sm font-semibold transition-all ${
                    showCorrect
                      ? "border-[#6fb5b0]/60 bg-[#6fb5b0]/15 text-[#7fd0c9]"
                      : showWrong
                        ? "border-[#e2666f]/60 bg-[#e2666f]/15 text-[#ef8b93]"
                        : dimmed
                          ? "opacity-45"
                          : "hover:-translate-y-0.5 hover:border-white/25"
                  }`}
                >
                  <span>{o.text}</span>
                  {showCorrect ? (
                    <Check className="size-4 shrink-0 text-[#6fb5b0]" />
                  ) : showWrong ? (
                    <X className="size-4 shrink-0 text-[#e2666f]" />
                  ) : null}
                </motion.button>
              );
            })}
          </div>

          {answered !== null && !answered.correct && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 text-center text-sm font-semibold text-muted-foreground"
            >
              {answered.option === null
                ? "Time's up — the correct answer is highlighted above. It's back tomorrow."
                : "Not this time — the correct answer is highlighted. Review beats regret."}
            </motion.p>
          )}
        </>
      )}
    </main>
  );
}

/* ------------------------------ page -------------------------------- */

function GameInner() {
  useEnsureSeeded();
  const [searchParams] = useSearchParams();
  const topicSlug = searchParams.get("topic");

  return (
    <div className="min-h-screen">
      <GlassBackdrop />
      <AppHeader title={topicSlug ? "Game" : undefined} />
      {topicSlug ? (
        <QuizRound key={topicSlug} slug={topicSlug} />
      ) : (
        <GameLobby />
      )}
    </div>
  );
}

export default function Game() {
  return (
    <QueryErrorBoundary title="Couldn't load the game">
      <GameInner />
    </QueryErrorBoundary>
  );
}
