import { motion } from "framer-motion";
import {
  AlertOctagon,
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Clock3,
  Lightbulb,
  ListChecks,
  Pause,
  Play,
  Search,
  Siren,
  Square,
  Stethoscope,
  Volume2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { GlassBackdrop } from "@/components/GlassBackdrop";
import { QueryErrorBoundary } from "@/components/QueryErrorBoundary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ARTICLE_CATEGORIES,
  ARTICLES,
  articleBySlug,
  articleToSpeech,
  totalSteps,
  type Article,
  type ArticleCallout,
} from "@/lib/articles";
import {
  VOICE_PROFILES,
  pauseSpeaking,
  resumeSpeaking,
  speak,
  speechAvailable,
  stopSpeaking,
  type VoiceProfile,
  type VoiceProfileId,
} from "@/lib/tts";

/* ------------------------- safe preferences ------------------------- */

function loadPref(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/* --------------------------- library grid --------------------------- */

function ResearchLibrary({
  onOpen,
}: {
  onOpen: (slug: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ARTICLES.filter((a) => {
      const matchesQuery =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q);
      const matchesCategory = !category || a.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-32 pt-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="tech-label">The library · emergency medicine you can use</span>
        <h1 className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-wistaria sm:text-4xl">
          Research like the patient is already there
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Ten professor-level guides to the emergencies that matter most — every
          one step-by-step, guideline-accurate, and readable aloud. Know what to
          do before the moment demands it.
        </p>
      </motion.div>

      {/* stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="mt-7 grid grid-cols-3 gap-4"
      >
        {[
          { icon: Stethoscope, label: "Emergency guides", value: ARTICLES.length },
          { icon: ListChecks, label: "Step-by-step instructions", value: totalSteps() },
          { icon: BookOpen, label: "Categories", value: ARTICLE_CATEGORIES.length },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 + i * 0.06 }}
              className="glass-chip flex flex-col items-center gap-1.5 rounded-2xl p-4 text-center"
            >
              <Icon className="size-4" style={{ color: "#6fb5b0" }} />
              <p className="text-xl font-extrabold tabular-nums">{s.value}</p>
              <p className="text-[11px] font-semibold text-muted-foreground">{s.label}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* search + category filter */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.16 }}
        className="mt-8"
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search emergencies, keywords…"
            className="glass-chip h-11 rounded-2xl pl-10"
            aria-label="Search the research library"
          />
        </div>
        <div className="nice-scroll mt-3 flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setCategory(null)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
              category === null
                ? "bg-wistaria/25 text-foreground"
                : "glass-chip text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {ARTICLE_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(category === c ? null : c)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                category === c
                  ? "bg-wistaria/25 text-foreground"
                  : "glass-chip text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </motion.div>

      {/* cards */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="glass-panel col-span-full flex flex-col items-center gap-3 rounded-3xl p-10 text-center">
            <Search className="size-8 text-muted-foreground" />
            <p className="text-sm font-bold">Nothing matches “{query}”</p>
            <p className="text-xs text-muted-foreground">
              Try a different emergency, keyword, or clear the category filter.
            </p>
          </div>
        ) : (
          filtered.map((a, i) => (
            <motion.button
              key={a.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onOpen(a.slug)}
              className="glass-panel shine group flex flex-col gap-4 rounded-3xl p-5 text-left"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-white/5 text-2xl transition-transform duration-300 group-hover:scale-110">
                  {a.emoji}
                </div>
                <span className="glass-chip px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {a.category}
                </span>
              </div>
              <div>
                <h2 className="text-base font-extrabold tracking-tight">{a.title}</h2>
                <p className="mt-2 line-clamp-3 text-[13px] leading-5 text-muted-foreground">
                  {a.summary}
                </p>
              </div>
              <div className="mt-auto flex items-center gap-3 text-[11px] font-semibold text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock3 className="size-3" />
                  {a.readMinutes} min
                </span>
                <span className="flex items-center gap-1">
                  <ListChecks className="size-3" />
                  {a.sections.reduce((s, sec) => s + (sec.steps?.length ?? 0), 0)} steps
                </span>
                <ChevronRight className="ml-auto size-4 text-wistaria transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </motion.button>
          ))
        )}
      </div>
    </main>
  );
}

/* --------------------------- article view --------------------------- */

function CalloutBox({ callout }: { callout: ArticleCallout }) {
  const styles = {
    danger: {
      border: "border-[#e2666f]/40",
      bg: "bg-[#e2666f]/10",
      icon: AlertOctagon,
      iconColor: "text-[#e2666f]",
      title: "text-[#ef8b93]",
    },
    warning: {
      border: "border-[#e0a458]/40",
      bg: "bg-[#e0a458]/10",
      icon: AlertTriangle,
      iconColor: "text-[#e0a458]",
      title: "text-[#eeb86b]",
    },
    tip: {
      border: "border-[#6fb5b0]/40",
      bg: "bg-[#6fb5b0]/10",
      icon: Lightbulb,
      iconColor: "text-[#6fb5b0]",
      title: "text-[#7fd0c9]",
    },
  }[callout.kind];
  const Icon = styles.icon;
  return (
    <div className={`mt-5 flex items-start gap-3 rounded-2xl border ${styles.border} ${styles.bg} p-4`}>
      <Icon className={`mt-0.5 size-4 shrink-0 ${styles.iconColor}`} />
      <div>
        <p className={`text-sm font-extrabold ${styles.title}`}>{callout.title}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{callout.text}</p>
      </div>
    </div>
  );
}

function ArticleReader({ article }: { article: Article }) {
  const [speakingSlug, setSpeakingSlug] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);

  // Reuse the voice the user picked in the Assistant (falls back to Smooth).
  const [profileId] = useState<VoiceProfileId>(
    () => (loadPref("medipro-tts-voice") as VoiceProfileId | null) ?? "smooth",
  );
  const [customVoiceName] = useState<string | null>(
    () => loadPref("medipro-tts-custom-voice") || null,
  );
  const profile: VoiceProfile = useMemo(() => {
    const base = VOICE_PROFILES.find((p) => p.id === profileId) ?? VOICE_PROFILES[3];
    return base.id === "custom" ? { ...base, customVoiceName: customVoiceName ?? undefined } : base;
  }, [profileId, customVoiceName]);

  // Stop any narration when leaving the article.
  useEffect(() => () => stopSpeaking(), []);

  const isReading = speakingSlug === article.slug;

  const toggleRead = () => {
    if (isReading) {
      if (paused) {
        resumeSpeaking();
        setPaused(false);
      } else {
        pauseSpeaking();
        setPaused(true);
      }
      return;
    }
    stopSpeaking();
    setPaused(false);
    setSpeakingSlug(article.slug);
    const started = speak(articleToSpeech(article), profile, {
      onEnd: () => {
        setSpeakingSlug(null);
        setPaused(false);
      },
    });
    if (!started) {
      setSpeakingSlug(null);
      toast.error("Speech isn't available in this browser.");
    }
  };

  const stopRead = () => {
    stopSpeaking();
    setSpeakingSlug(null);
    setPaused(false);
  };

  const stepCount = article.sections.reduce((s, sec) => s + (sec.steps?.length ?? 0), 0);

  return (
    <main className="mx-auto max-w-3xl px-4 pb-32 pt-8 sm:px-6">
      <a
        href="/research"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to the library
      </a>

      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mt-5"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-white/5 text-3xl">
            {article.emoji}
          </div>
          <div>
            <span className="glass-chip px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {article.category}
            </span>
            <p className="mt-1.5 flex items-center gap-3 text-[11px] font-semibold text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock3 className="size-3" />
                {article.readMinutes} min read
              </span>
              <span className="flex items-center gap-1">
                <ListChecks className="size-3" />
                {stepCount} steps
              </span>
            </p>
          </div>
        </div>
        <h1 className="mt-4 text-balance text-2xl font-extrabold tracking-tight text-wistaria sm:text-3xl">
          {article.title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{article.summary}</p>
      </motion.div>

      {/* read aloud */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        className="glass-strong mt-6 flex items-center gap-3 rounded-2xl p-4"
      >
        <Button
          onClick={toggleRead}
          className="gap-2 rounded-full px-5"
          aria-label={isReading ? (paused ? "Resume reading" : "Pause reading") : "Read article aloud"}
        >
          {isReading && !paused ? (
            <Pause className="size-4" />
          ) : (
            <Play className="size-4" />
          )}
          {isReading && !paused ? "Pause" : "Read aloud"}
        </Button>
        <button
          onClick={stopRead}
          className="flex size-9 items-center justify-center rounded-full bg-white/5 text-muted-foreground transition-colors hover:bg-[#e2666f]/15 hover:text-[#e2666f]"
          aria-label="Stop reading"
          title="Stop"
        >
          <Square className="size-3.5" />
        </button>
        <div className="ml-auto flex items-center gap-2 text-[11px] font-semibold">
          <Volume2 className="size-3.5 text-wistaria" />
          {isReading ? (paused ? "Paused" : "Reading…") : "Ready"}
          <span className="hidden text-muted-foreground sm:inline">
            · Voice: {profile.label}
          </span>
        </div>
      </motion.div>
      {!speechAvailable() && (
        <p className="mt-2 px-1 text-[11px] font-semibold text-[#e2666f]">
          Speech isn't supported in this browser, so Read Aloud is unavailable.
        </p>
      )}

      {/* sections */}
      <div className="mt-8 space-y-8">
        {article.sections.map((section, i) => (
          <motion.section
            key={section.heading}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.2) }}
          >
            <h2 className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-wistaria">
              <span className="h-5 w-1 rounded-full bg-wistaria/50" />
              {section.heading}
            </h2>

            {section.body?.map((p, j) => (
              <p key={j} className="mt-3 text-[15px] leading-7 text-muted-foreground">
                {p}
              </p>
            ))}

            {section.steps && (
              <ol className="mt-4 space-y-3">
                {section.steps.map((step, j) => (
                  <li key={j} className="flex gap-3">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-wistaria/20 text-xs font-extrabold text-wistaria">
                      {j + 1}
                    </span>
                    <p className="text-[15px] leading-7 text-foreground">{step}</p>
                  </li>
                ))}
              </ol>
            )}

            {section.bullets && (
              <ul className="mt-4 space-y-2.5">
                {section.bullets.map((b, j) => (
                  <li key={j} className="flex gap-2.5">
                    <ChevronRight className="mt-1.5 size-3.5 shrink-0 text-wistaria" />
                    <p className="text-[15px] leading-7 text-foreground">{b}</p>
                  </li>
                ))}
              </ul>
            )}

            {section.callout && <CalloutBox callout={section.callout} />}
          </motion.section>
        ))}
      </div>

      {/* key points */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="glass-panel mt-10 rounded-3xl p-6"
      >
        <p className="flex items-center gap-2 text-sm font-extrabold tracking-tight text-wistaria">
          <ListChecks className="size-4" />
          Key points to remember
        </p>
        <ul className="mt-3 space-y-2.5">
          {article.keyPoints.map((k, i) => (
            <li key={i} className="flex gap-2.5">
              <ChevronRight className="mt-1.5 size-3.5 shrink-0 text-wistaria" />
              <p className="text-sm leading-6 text-foreground">{k}</p>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* when to call */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mt-5 rounded-3xl border border-[#e2666f]/30 bg-[#e2666f]/10 p-6"
      >
        <p className="flex items-center gap-2 text-sm font-extrabold tracking-tight text-[#ef8b93]">
          <Siren className="size-4" />
          Call for emergency help when…
        </p>
        <ul className="mt-3 space-y-2.5">
          {article.whenToCall.map((w, i) => (
            <li key={i} className="flex gap-2.5">
              <ChevronRight className="mt-1.5 size-3.5 shrink-0 text-[#ef8b93]" />
              <p className="text-sm leading-6 text-foreground">{w}</p>
            </li>
          ))}
        </ul>
      </motion.div>

      <p className="mt-6 px-1 text-[11px] leading-5 text-muted-foreground">
        This guide is educational content and is not a substitute for professional
        medical care, training, or your local emergency services. In an emergency,
        call your local emergency number first. First-aid guidelines evolve — always
        follow current certified training (e.g., American Heart Association or your
        national equivalent).
      </p>
    </main>
  );
}

/* ------------------------------ page -------------------------------- */

function ResearchInner() {
  const [searchParams, setSearchParams] = useSearchParams();
  const slug = searchParams.get("article");
  const article = slug ? articleBySlug(slug) : undefined;

  const openArticle = (next: string) => {
    setSearchParams({ article: next }, { replace: true });
  };

  return (
    <div className="min-h-screen">
      <GlassBackdrop />
      <AppHeader title="Research" />
      {article ? (
        <ArticleReader key={article.slug} article={article} />
      ) : slug ? (
        <main className="mx-auto max-w-3xl px-4 pb-32 pt-16 text-center sm:px-6">
          <Siren className="mx-auto size-12 text-wistaria" />
          <h1 className="mt-4 text-2xl font-extrabold text-wistaria">Article not found</h1>
          <Button variant="outline" className="mt-6" onClick={() => setSearchParams({}, { replace: true })}>
            <ArrowLeft className="size-4" />
            Back to the library
          </Button>
        </main>
      ) : (
        <ResearchLibrary onOpen={openArticle} />
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
