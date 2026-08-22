import { motion } from "framer-motion";
import {
  AlertOctagon,
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Check,
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
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { GlassBackdrop } from "@/components/GlassBackdrop";
import { RabbitMascot } from "@/components/mascots";
import { QueryErrorBoundary } from "@/components/QueryErrorBoundary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  VOICE_QUALITIES,
  applyQuality,
  pauseSpeaking,
  qualityById,
  resumeSpeaking,
  speak,
  speechAvailable,
  stopSpeaking,
  type VoiceProfile,
  type VoiceProfileId,
  type VoiceQualityId,
} from "@/lib/tts";

/* ------------------------------------------------------------------ */
/* Lazy-loaded diagram components                                      */
/* ------------------------------------------------------------------ */

const HeartDiagram = React.lazy(() =>
  import("@/components/HeartDiagram").then((m) => ({ default: m.HeartDiagram })),
);
const BrainDiagram = React.lazy(() =>
  import("@/components/BrainDiagram").then((m) => ({ default: m.BrainDiagram })),
);
const PlexusDiagram = React.lazy(() =>
  import("@/components/PlexusDiagram").then((m) => ({ default: m.PlexusDiagram })),
);
const CellDiagram = React.lazy(() =>
  import("@/components/CellDiagram").then((m) => ({ default: m.CellDiagram })),
);
const LungsDiagram = React.lazy(() =>
  import("@/components/LungsDiagram").then((m) => ({ default: m.LungsDiagram })),
);
const DigestiveDiagram = React.lazy(() =>
  import("@/components/DigestiveDiagram").then((m) => ({ default: m.DigestiveDiagram })),
);
const KidneyDiagram = React.lazy(() =>
  import("@/components/KidneyDiagram"),
);
const EndocrineDiagram = React.lazy(() =>
  import("@/components/EndocrineDiagram").then((m) => ({ default: m.EndocrineDiagram })),
);
const EyeDiagram = React.lazy(() =>
  import("@/components/EyeDiagram"),
);
const BodyDiagram = React.lazy(() =>
  import("@/components/BodyDiagram").then((m) => ({ default: m.BodyDiagram })),
);

/** Maps each article slug to its matching diagram component (or null). */
const DIAGRAM_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  // Cardiology
  "cardiac-cycle": HeartDiagram,
  "heart-attack": HeartDiagram,
  "cpr-basics": HeartDiagram,
  // Neurology
  "action-potential": BrainDiagram,
  stroke: BrainDiagram,
  seizures: BrainDiagram,
  // Anatomy
  "brachial-plexus": PlexusDiagram,
  // Cell biology
  "krebs-cycle": CellDiagram,
  "dna-replication": CellDiagram,
  "blood-immunity": CellDiagram,
  // Respiratory
  "respiratory-mechanics": LungsDiagram,
  // Digestive
  "digestive-system": DigestiveDiagram,
  // Renal
  "renal-physiology": KidneyDiagram,
  // Endocrine
  "endocrine-system": EndocrineDiagram,
  // Sensory
  "vision-hearing": EyeDiagram,
  // Musculoskeletal
  "muscle-contraction": BodyDiagram,
  fractures: BodyDiagram,
  burns: BodyDiagram,
  choking: BodyDiagram,
  "severe-bleeding": BodyDiagram,
  "allergic-reactions": BodyDiagram,
  poisoning: BodyDiagram,
};

/** Animated placeholder shown when no specific diagram exists. */
function DiagramPlaceholder({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(120,162,210,0.15) 0%, rgba(162,162,208,0.1) 50%, rgba(232,183,207,0.08) 100%)" }}>
      {/* Animated glow rings */}
      <motion.div
        className="absolute size-40 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(120,162,210,0.2) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute size-28 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(232,183,207,0.15) 0%, transparent 70%)" }}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      {/* Pulsing orbit dots */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute size-1.5 rounded-full bg-wistaria/40"
          animate={{
            rotate: [0, 360],
            x: [0, 60, 0, -60, 0],
            y: [0, -60, 0, 60, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: i * 1.5 }}
          style={{ originX: "50%", originY: "50%" }}
        />
      ))}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <motion.span
          className="text-5xl"
          animate={{ scale: [1, 1.08, 1], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {emoji}
        </motion.span>
        <p className="text-center text-sm font-bold text-muted-foreground/70">{title}</p>
      </div>
    </div>
  );
}

/** Wraps the diagram in a Suspense fallback. */
function DiagramView({ slug, emoji, title }: { slug: string; emoji: string; title: string }) {
  const Diagram = DIAGRAM_MAP[slug];
  return (
    <div className="glass-panel relative w-full overflow-hidden rounded-2xl" style={{ minHeight: 280, maxHeight: 400 }}>
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center" style={{ minHeight: 280 }}>
            <motion.div
              className="size-6 rounded-full border-2 border-wistaria/30 border-t-wistaria"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        }
      >
        {Diagram ? (
          <div className="flex w-full items-center justify-center p-4" style={{ minHeight: 280 }}>
            <Diagram className="w-full max-w-md" />
          </div>
        ) : (
          <DiagramPlaceholder emoji={emoji} title={title} />
        )}
      </Suspense>
    </div>
  );
}

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
      // Foundations are educational content — shown in Basics, not Research
      if (a.category === "Foundations") return false;
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
          { icon: Stethoscope, label: "Clinical guides", value: ARTICLES.filter((a) => a.category !== "Foundations").length },
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
          {ARTICLE_CATEGORIES.filter((c) => c !== "Foundations").map((c) => (
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
                  {a.tabs
                  ? a.tabs.reduce((ts, tab) => ts + tab.sections.reduce((s, sec) => s + (sec.steps?.length ?? 0), 0), 0)
                  : a.sections.reduce((s, sec) => s + (sec.steps?.length ?? 0), 0)} steps
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
  const [activeTab, setActiveTab] = useState<string | null>(
    () => article.tabs?.[0]?.id ?? null,
  );
  const [speakingSlug, setSpeakingSlug] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);

  // Reuse the voice the user picked in the Assistant (falls back to Smooth).
  const [profileId] = useState<VoiceProfileId>(
    () => (loadPref("medipro-tts-voice") as VoiceProfileId | null) ?? "smooth",
  );
  const [customVoiceName] = useState<string | null>(
    () => loadPref("medipro-tts-custom-voice") || null,
  );
  const [qualityId, setQualityId] = useState<VoiceQualityId>(
    () => (loadPref("medipro-tts-quality") as VoiceQualityId | null) ?? "smooth-calm",
  );
  const profile: VoiceProfile = useMemo(() => {
    const base = VOICE_PROFILES.find((p) => p.id === profileId) ?? VOICE_PROFILES[3];
    return base.id === "custom" ? { ...base, customVoiceName: customVoiceName ?? undefined } : base;
  }, [profileId, customVoiceName]);
  const quality = useMemo(() => qualityById(qualityId), [qualityId]);

  // Persist the quality choice (shared with the Assistant via the same key).
  useEffect(() => {
    try {
      localStorage.setItem("medipro-tts-quality", qualityId);
    } catch {
      /* storage unavailable */
    }
  }, [qualityId]);

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
    const started = speak(articleToSpeech(article), applyQuality(profile, quality), {
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

  const hasTabs = Boolean(article.tabs);
  const activeTabData = hasTabs ? article.tabs?.find((t) => t.id === activeTab) : undefined;
  const displaySections = activeTabData?.sections ?? article.sections;
  const displayKeyPoints = activeTabData?.keyPoints ?? article.keyPoints;
  const displayWhenToCall = article.whenToCall;

  const stepCount = displaySections.reduce((s, sec) => s + (sec.steps?.length ?? 0), 0);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* ================================================================ */}
      {/*  STICKY HEADER: diagram + read aloud + tabs                      */}
      {/* ================================================================ */}
      <div className="sticky top-0 z-40 border-b border-white/5" style={{ background: "linear-gradient(180deg, rgba(15,15,30,0.97) 0%, rgba(15,15,30,0.92) 80%, rgba(15,15,30,0) 100%)" }}>
        <main className="mx-auto max-w-3xl px-4 pt-6 pb-4 sm:px-6">
          {/* back link */}
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
            className="mt-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-white/5 text-2xl">
                {article.emoji}
              </div>
              <div>
                <span className="glass-chip px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {article.category}
                </span>
                <p className="mt-1 flex items-center gap-3 text-[11px] font-semibold text-muted-foreground">
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
            <h1 className="mt-3 text-balance text-xl font-extrabold tracking-tight text-wistaria sm:text-2xl">
              {article.title}
            </h1>
          </motion.div>

          {/* diagram */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.06 }}
            className="mt-4"
          >
            <DiagramView slug={article.slug} emoji={article.emoji} title={article.title} />
          </motion.div>

          {/* read aloud */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="glass-strong mt-4 flex items-center gap-3 rounded-2xl p-3"
          >
            <Button
              onClick={toggleRead}
              className="gap-2 rounded-full px-4 text-sm"
              size="sm"
              aria-label={isReading ? (paused ? "Resume reading" : "Pause reading") : "Read article aloud"}
            >
              {isReading && !paused ? (
                <Pause className="size-3.5" />
              ) : (
                <Play className="size-3.5" />
              )}
              {isReading && !paused ? "Pause" : "Read aloud"}
            </Button>
            <button
              onClick={stopRead}
              className="flex size-8 items-center justify-center rounded-full bg-white/5 text-muted-foreground transition-colors hover:bg-[#e2666f]/15 hover:text-[#e2666f]"
              aria-label="Stop reading"
              title="Stop"
            >
              <Square className="size-3" />
            </button>
            <Popover>
              <PopoverTrigger asChild>
                <button className="glass-chip flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold text-muted-foreground transition-colors hover:text-foreground">
                  {quality.label}
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="glass-strong w-64 border-white/10">
                <p className="text-sm font-extrabold tracking-tight">Voice quality</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Tunes pitch and speed so narration sounds natural, not robotic.
                </p>
                <div className="mt-3 space-y-1.5">
                  {VOICE_QUALITIES.map((q) => {
                    const active = qualityId === q.id;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setQualityId(q.id)}
                        className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left transition-colors ${
                          active
                            ? "border-wistaria/40 bg-wistaria/10"
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        <span>
                          <span className="block text-sm font-bold">{q.label}</span>
                          <span className="block text-[11px] leading-4 text-muted-foreground">
                            {q.description}
                          </span>
                        </span>
                        {active && <Check className="size-4 shrink-0 text-wistaria" />}
                      </button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
            <div className="ml-auto flex items-center gap-2 text-[11px] font-semibold">
              <Volume2 className="size-3.5 text-wistaria" />
              {isReading ? (paused ? "Paused" : "Reading…") : "Ready"}
              <span className="hidden text-muted-foreground sm:inline">
                · {profile.label} · {quality.label}
              </span>
            </div>
          </motion.div>
          {!speechAvailable() && (
            <p className="mt-1 px-1 text-[10px] font-semibold text-[#e2666f]">
              Speech isn't supported in this browser, so Read Aloud is unavailable.
            </p>
          )}

          {/* tab bar for tabbed articles */}
          {hasTabs && article.tabs && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.14 }}
              className="glass-strong mt-4 flex items-center gap-2 rounded-2xl p-1.5"
            >
              {article.tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? "text-wistaria"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabBg"
                        className="absolute inset-0 rounded-xl bg-wistaria/15 border border-wistaria/20"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{tab.icon}</span>
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </main>
      </div>

      {/* ================================================================ */}
      {/*  SCROLLABLE CONTENT                                              */}
      {/* ================================================================ */}
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-32 pt-6 sm:px-6">
        {/* summary */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-8 text-sm leading-6 text-muted-foreground"
        >
          {article.summary}
        </motion.p>

        {/* sections */}
        <div className="space-y-8">
        {displaySections.map((section, i) => (
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
      {displayKeyPoints.length > 0 && (
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
            {displayKeyPoints.map((k, i) => (
              <li key={i} className="flex gap-2.5">
                <ChevronRight className="mt-1.5 size-3.5 shrink-0 text-wistaria" />
                <p className="text-sm leading-6 text-foreground">{k}</p>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* when to call */}
      {displayWhenToCall.length > 0 && (
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
          {displayWhenToCall.map((w, i) => (
            <li key={i} className="flex gap-2.5">
              <ChevronRight className="mt-1.5 size-3.5 shrink-0 text-[#ef8b93]" />
              <p className="text-sm leading-6 text-foreground">{w}</p>
            </li>
          ))}
        </ul>
      </motion.div>
      )}

      <p className="mt-6 px-1 text-[11px] leading-5 text-muted-foreground">
        This guide is educational content and is not a substitute for professional
        medical care, training, or your local emergency services. In an emergency,
        call your local emergency number first. First-aid guidelines evolve — always
        follow current certified training (e.g., American Heart Association or your
        national equivalent).
      </p>
      </main>

      {/* the reading rabbit, tucked into the corner of every article */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="pointer-events-none fixed bottom-24 right-5 z-30 hidden sm:block"
        aria-hidden
      >
        <RabbitMascot mood="reading" size={62} />
      </motion.div>
    </div>
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
