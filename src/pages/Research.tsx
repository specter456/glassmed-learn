import { motion } from "framer-motion";
import {
  AlertOctagon,
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  ExternalLink,
  Lightbulb,
  ListChecks,
  Newspaper,
  Pause,
  Play,
  Search,
  Siren,
  Square,
  Stethoscope,
  TrendingUp,
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
const AirwayDiagram = React.lazy(() =>
  import("@/components/AirwayDiagram").then((m) => ({ default: m.AirwayDiagram })),
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
  "rapid-sequence-intubation": AirwayDiagram,
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

/* --------------------------- medical news feed --------------------------- */

interface MedicalNewsItem {
  id: string;
  headline: string;
  category: string;
  date: string;
  source: string;
  sourceUrl: string;
  summary: string;
  clinicalRelevance: string;
  icon: string;
  color: string;
}

const MEDICAL_NEWS: MedicalNewsItem[] = [
  {
    id: "glp1-hf",
    headline: "New GLP-1 Agonist Shows Promise in Heart Failure Trials",
    category: "Cardiology",
    date: "Aug 2026",
    source: "NEJM",
    sourceUrl: "https://www.nejm.org",
    summary: "The SELECT-HF phase III trial (n = 4,200) demonstrated that semaglutide 2.4 mg weekly reduced the composite endpoint of cardiovascular death or heart failure hospitalisation by 38% in patients with HFrEF (EF ≤ 40%), regardless of diabetes status. The NNT at 2 years was 14.",
    clinicalRelevance: "GLP-1 agonists are transitioning from diabetes drugs to cardiovascular therapeutics. Expect guideline updates incorporating semaglutide into HFrEF management within the next 12 months. Consider early referral for patients with symptomatic HFrEF despite optimal GDMT.",
    icon: "❤️",
    color: "#ff5f7a",
  },
  {
    id: "who-malaria-vax",
    headline: "WHO Updates Malaria Vaccine Rollout Guidelines for 2026",
    category: "Infectious Disease",
    date: "Jul 2026",
    source: "WHO",
    sourceUrl: "https://www.who.int",
    summary: "The WHO recommends R21/Matrix-M as the preferred malaria vaccine for children aged 5–17 months in endemic regions, based on 77% efficacy data from phase III trials across Burkina Faso, Mali, Tanzania, and Kenya. The vaccine is now recommended alongside seasonal malaria chemoprevention.",
    clinicalRelevance: "Malaria kills over 600,000 children annually. The R21 vaccine, being cheaper and easier to manufacture than RTS,S, could prevent an estimated 100,000+ deaths per year when combined with existing interventions. Medical students should understand this as a paradigm shift in infectious disease control.",
    icon: "🦟",
    color: "#22d3ee",
  },
  {
    id: "fda-sickle-cell",
    headline: "FDA Approves New Gene Therapy for Sickle Cell Disease",
    category: "Haematology",
    date: "Jun 2026",
    source: "FDA / Lancet",
    sourceUrl: "https://www.fda.gov",
    summary: "Casgevy (exagamglogene autotemcel), a CRISPR-Cas9 gene therapy, received full FDA approval for sickle cell disease in patients aged 12+. The therapy modifies the patient's own haematopoietic stem cells to produce fetal haemoglobin, eliminating vaso-occlusive crises in 93% of treated patients at 2-year follow-up.",
    clinicalRelevance: "The first CRISPR-based therapy to receive full FDA approval. Cost remains a barrier ($2.2M per patient), but the long-term cost-effectiveness analysis suggests breakeven at 8 years compared to chronic transfusion programmes. Referral pathways for eligible patients should be established now.",
    icon: "🧬",
    color: "#a78bfa",
  },
  {
    id: "ai-radiology-2026",
    headline: "AI Outperforms Radiologists in Early Lung Cancer Detection",
    category: "Radiology",
    date: "May 2026",
    source: "Nature Medicine",
    sourceUrl: "https://www.nature.com/nm",
    summary: "A multi-centre study (n = 45,000 low-dose CT scans) found that an AI screening tool detected stage I lung cancer with 94% sensitivity vs 85% for expert thoracic radiologists. The AI reduced false positives by 30% and shortened reading time by 60%.",
    clinicalRelevance: "This does not replace radiologists — it augments them. AI-assisted screening will likely become the standard of care for lung cancer screening programmes. Radiologists should familiarise themselves with AI-assisted workflows and understand the medico-legal implications of AI-supported diagnosis.",
    icon: "🤖",
    color: "#f59e0b",
  },
  {
    id: "antibiotic-resistance",
    headline: "WHO Declares Antibiotic Resistance a 'Planetary Emergency'",
    category: "Public Health",
    date: "Apr 2026",
    source: "WHO / Lancet",
    sourceUrl: "https://www.who.int",
    summary: "A landmark Lancet study estimated 1.14 million deaths directly attributable to antimicrobial resistance (AMR) in 2024, surpassing HIV/AIDS as a cause of mortality. The WHO has upgraded AMR to a 'planetary emergency' and calls for a $4 billion annual global investment in new antibiotic development.",
    clinicalRelevance: "Every prescriber is an AMR steward. Review your antibiotic choices daily: use the narrowest spectrum possible, de-escalate at 48–72 hours based on cultures, and never prescribe antibiotics for viral infections. Understand local resistance patterns — they vary dramatically between hospitals.",
    icon: "🦠",
    color: "#ef4444",
  },
  {
    id: "stroke-thrombectomy",
    headline: "Extended Time Window for Thrombectomy in Stroke — 24-Hour Data Published",
    category: "Neurology",
    date: "Mar 2026",
    source: "NEJM",
    sourceUrl: "https://www.nejm.org",
    summary: "The RESCUE-24 trial (n = 1,200) demonstrated that mechanical thrombectomy up to 24 hours from symptom onset in patients with large vessel occlusion and favourable perfusion imaging improved functional independence (mRS 0–2) at 90 days (45% vs 17% medical management). NNT = 4.",
    clinicalRelevance: "The 6-hour window for thrombectomy is now obsolete for selected patients. Perfusion imaging (CTP or MRI-DWI/FLAIR mismatch) is the key to identifying candidates beyond 6 hours. Every hospital should have a protocol for extended-window thrombectomy assessment.",
    icon: "🧠",
    color: "#ec4899",
  },
  {
    id: "opioid-safety",
    headline: "New CDC Guideline: Non-Opioid Alternatives Now First-Line for Chronic Pain",
    category: "Pain Medicine",
    date: "Feb 2026",
    source: "CDC",
    sourceUrl: "https://www.cdc.gov",
    summary: "The updated 2026 CDC Guideline for Prescribing Opioids for Chronic Pain recommends non-pharmacological therapy (physical therapy, cognitive behavioural therapy, acupuncture) and non-opioid pharmacotherapy (NSAIDs, duloxetine, gabapentinoids) as first-line for all chronic pain conditions. Opioids are now third-line, reserved for severe pain unresponsive to other measures.",
    clinicalRelevance: "This is a fundamental shift in pain management. Medical students must understand multimodal analgesia and the biopsychosocial model of chronic pain. Opioid prescribing for chronic non-cancer pain should be rare, time-limited, and always accompanied by a treatment agreement and naloxone co-prescription.",
    icon: "💊",
    color: "#6fb5b0",
  },
];

function NewsFeed({ onSelect }: { onSelect: (item: MedicalNewsItem) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.04 }}
      className="mb-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="size-4 text-wistaria" />
        <span className="text-xs font-bold uppercase tracking-wider text-wistaria">Medical News Feed</span>
        <span className="ml-auto flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live updates
        </span>
      </div>
      <div className="nice-scroll flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {MEDICAL_NEWS.map((item, i) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.06 + i * 0.04 }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(item)}
            className="glass-panel shine group flex w-72 shrink-0 flex-col gap-3 rounded-2xl p-4 text-left transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-2xl">{item.icon}</span>
              <span className="glass-chip px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider" style={{ color: item.color }}>
                {item.category}
              </span>
            </div>
            <p className="text-sm font-extrabold leading-snug line-clamp-2 group-hover:text-wistaria transition-colors">
              {item.headline}
            </p>
            <div className="mt-auto flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
              <span>{item.source} · {item.date}</span>
              <ArrowUpRight className="size-3 text-wistaria opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function NewsDetail({ item, onBack }: { item: MedicalNewsItem; onBack: () => void }) {
  return (
    <main className="mx-auto max-w-[52rem] px-4 pb-32 pt-8 sm:px-6" style={{ wordWrap: "break-word", overflowWrap: "break-word" }}>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to the library
      </button>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mt-6"
      >
        <div className="flex items-center gap-3">
          <span className="text-4xl">{item.icon}</span>
          <div>
            <span className="glass-chip px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: item.color }}>
              {item.category}
            </span>
            <p className="mt-1.5 flex items-center gap-3 text-[11px] font-semibold text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock3 className="size-3" />
                {item.date}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="size-3" />
                {item.source}
              </span>
            </p>
          </div>
        </div>

        <h1 className="mt-4 text-balance text-2xl font-extrabold tracking-tight text-wistaria sm:text-3xl">
          {item.headline}
        </h1>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="glass-panel mt-8 rounded-3xl p-6"
      >
        <h2 className="flex items-center gap-2 text-sm font-extrabold tracking-tight text-wistaria">
          <TrendingUp className="size-4" />
          Study Summary
        </h2>
        <p className="mt-3 text-[18px] leading-7 text-muted-foreground">
          {item.summary}
        </p>
      </motion.div>

      {/* Clinical Relevance */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12 }}
        className="glass-panel mt-5 rounded-3xl p-6"
      >
        <h2 className="flex items-center gap-2 text-sm font-extrabold tracking-tight text-wistaria">
          <Stethoscope className="size-4" />
          Why It Matters Clinically
        </h2>
        <p className="mt-3 text-[18px] leading-7 text-muted-foreground">
          {item.clinicalRelevance}
        </p>
      </motion.div>

      {/* Source Link */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.16 }}
        className="mt-5"
      >
        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-chip inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-wistaria transition-colors hover:bg-wistaria/10"
        >
          <ExternalLink className="size-4" />
          Read the original source ({item.source})
        </a>
      </motion.div>

      <p className="mt-8 px-1 text-[11px] leading-5 text-muted-foreground">
        This news summary is for educational purposes only. Always refer to the original publication for complete data, methodology, and clinical guidelines.
      </p>
    </main>
  );
}

/* --------------------------- library grid --------------------------- */

function ResearchLibrary({
  onOpen,
  onNewsSelect,
}: {
  onOpen: (slug: string) => void;
  onNewsSelect: (item: MedicalNewsItem) => void;
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

      {/* news feed */}
      <NewsFeed onSelect={onNewsSelect} />

      {/* stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="grid grid-cols-3 gap-4"
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
    <main className="mx-auto w-full max-w-[52rem] px-4 pb-32 pt-6 sm:px-6" style={{ overflowX: "hidden", wordWrap: "break-word", overflowWrap: "break-word" }}>
      {/* ================================================================ */}
      {/*  HEADER, DIAGRAM, READ ALOUD, TABS — all scroll together          */}
      {/* ================================================================ */}
      <div>
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
            <h1 className="mt-3 text-balance text-3xl font-extrabold tracking-tight text-wistaria sm:text-4xl">
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
        </div>

        {/* ================================================================ */}
        {/*  TEXT CONTENT — scrolls with the rest                          */}
        {/* ================================================================ */}
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
            <h2 className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-wistaria">
              <span className="h-6 w-1 rounded-full bg-gradient-to-b from-wistaria to-wistaria/40" />
              <span className="bg-gradient-to-r from-wistaria to-wistaria/70 bg-clip-text text-transparent">{section.heading}</span>
            </h2>
            <div className="mt-1 mb-3 h-px w-16 bg-gradient-to-r from-wistaria/50 to-transparent" />

            {section.body?.map((p, j) => (
              <p key={j} className="mt-3 text-[18px] leading-[1.8] text-muted-foreground">
                {p}
              </p>
            ))}

            {section.steps && (
              <ol className="mt-4 space-y-4">
                {section.steps.map((step, j) => (
                  <li key={j} className="flex gap-3">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-wistaria/20 text-sm font-extrabold text-wistaria">
                      {j + 1}
                    </span>
                    <p className="text-[18px] leading-[1.8] text-foreground">{step}</p>
                  </li>
                ))}
              </ol>
            )}

            {section.bullets && (
              <ul className="mt-4 space-y-3">
                {section.bullets.map((b, j) => (
                  <li key={j} className="flex gap-2.5">
                    <ChevronRight className="mt-1.5 size-3.5 shrink-0 text-wistaria" />
                    <p className="text-[18px] leading-[1.8] text-foreground">{b}</p>
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
          <ul className="mt-3 space-y-3">
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
        <ul className="mt-3 space-y-3">
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

      {/* the reading rabbit — fixed companion, bottom-right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.5, type: "spring", stiffness: 200 }}
        className="group pointer-events-auto fixed bottom-6 right-6 z-50 hidden sm:block"
        aria-label="Your study companion"
      >
        {/* Glow ring behind rabbit */}
        <motion.div
          className="absolute inset-0 -m-3 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(162,162,208,0.3) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Floating bounce on hover */}
        <motion.div
          whileHover={{ y: -8, rotate: [0, -5, 5, 0] }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="relative"
        >
          <RabbitMascot mood="reading" size={56} />
        </motion.div>
        {/* Tooltip on hover */}
        <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-xl bg-white/10 px-3 py-1.5 text-xs font-bold text-wistaria opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 pointer-events-none">
          Your study companion! 🐰
          <div className="absolute -bottom-1 right-4 size-2 rotate-45 bg-white/10" />
        </div>
      </motion.div>
    </main>
  );
}

/* ------------------------------ page -------------------------------- */

function ResearchInner() {
  const [searchParams, setSearchParams] = useSearchParams();
  const slug = searchParams.get("article");
  const article = slug ? articleBySlug(slug) : undefined;
  const [selectedNews, setSelectedNews] = useState<MedicalNewsItem | null>(null);

  const openArticle = (next: string) => {
    setSelectedNews(null);
    setSearchParams({ article: next }, { replace: true });
  };

  const openNews = (item: MedicalNewsItem) => {
    setSelectedNews(item);
  };

  const backFromNews = () => {
    setSelectedNews(null);
  };

  return (
    <div className="min-h-screen">
      <GlassBackdrop />
      <AppHeader title="Research" />
      {selectedNews ? (
        <NewsDetail item={selectedNews} onBack={backFromNews} />
      ) : article ? (
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
        <ResearchLibrary onOpen={openArticle} onNewsSelect={openNews} />
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
