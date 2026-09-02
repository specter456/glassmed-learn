import { AnimatePresence, motion } from "framer-motion";
import { Activity, Bone, Brain, Droplets, Eye, HeartPulse, Layers, MousePointerClick, Sparkles, Utensils, Wind, Zap } from "lucide-react";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { GlassBackdrop } from "@/components/GlassBackdrop";
import { QueryErrorBoundary } from "@/components/QueryErrorBoundary";
import { cn } from "@/lib/utils";
import { useHead } from "@/lib/seo";

/* Lazy-load every diagram so switching tabs never freezes the app.
   Each import becomes its own chunk — only the active diagram is downloaded. */
const BodyDiagram = React.lazy(() => import("@/components/BodyDiagram").then(m => ({ default: m.BodyDiagram })));
const BrainDiagram = React.lazy(() => import("@/components/BrainDiagram").then(m => ({ default: m.BrainDiagram })));
const DigestiveDiagram = React.lazy(() => import("@/components/DigestiveDiagram").then(m => ({ default: m.DigestiveDiagram })));
const HeartDiagram = React.lazy(() => import("@/components/HeartDiagram").then(m => ({ default: m.HeartDiagram })));
const LungsDiagram = React.lazy(() => import("@/components/LungsDiagram").then(m => ({ default: m.LungsDiagram })));
const EyeDiagram = React.lazy(() => import("@/components/EyeDiagram"));
const KidneyDiagram = React.lazy(() => import("@/components/KidneyDiagram"));
const PlexusDiagram = React.lazy(() => import("@/components/PlexusDiagram").then(m => ({ default: m.PlexusDiagram })));
const SkeletalSystem = React.lazy(() => import("@/components/SkeletalSystem"));
const EndocrineDiagram = React.lazy(() => import("@/components/EndocrineDiagram").then(m => ({ default: m.EndocrineDiagram })));
const EarDiagram = React.lazy(() => import("@/components/EarDiagram").then(m => ({ default: m.EarDiagram })));
const CellDiagram = React.lazy(() => import("@/components/CellDiagram").then(m => ({ default: m.CellDiagram })));
const CranialNervesDiagram = React.lazy(() => import("@/components/BrainstemCranialNerves").then(m => ({ default: m.BrainstemCranialNervesDiagram })));
const MitochondriaDiagram = React.lazy(() => import("@/components/MitochondriaDiagram").then(m => ({ default: m.MitochondriaDiagram })));


function DiagramFallback() {
  return (
    <div className="flex h-[420px] items-center justify-center">
      <div className="skeleton size-20 rounded-3xl" />
    </div>
  );
}

type DiagramId = "anatomy" | "heart" | "plexus" | "brain" | "lungs" | "digestive" | "kidney" | "eye" | "skeletal" | "endocrine" | "ear" | "cell" | "cranial-nerves" | "mitochondria";

const DIAGRAMS: Record<
  DiagramId,
  {
    kicker: string;
    title: string;
    blurb: string;
    parts: number;
    accent: string;
    label: string;
    tag: string;
    Component: React.ComponentType<{ className?: string }>;
  }
> = {
  anatomy: {
    kicker: "Diagram 00 · Human Anatomy",
    title: "The Whole You, Glowing",
    blurb:
      "One body, every system — from the brain's purple storm to the red-blue rivers of blood. Hover any organ to make it blaze, tap it for a quick breakdown of what it does.",
    parts: 12,
    accent: "#7dd3fc",
    label: "Human Anatomy",
    tag: "🧍",
    Component: BodyDiagram,
  },
  heart: {
    kicker: "Diagram 01 · The Human Heart",
    title: "Where Every Beat Glows",
    blurb:
      "A living blueprint, not a textbook page — every chamber and vessel pulses with the energy of the blood it carries. Glide your cursor over a part to make it glow, then tap it for a quick breakdown.",
    parts: 9,
    accent: "#ff5f7a",
    label: "Human Heart",
    tag: "🫀",
    Component: HeartDiagram,
  },
  plexus: {
    kicker: "Diagram 02 · The Brachial Plexus",
    title: "The Nerve Superhighway to Your Arm",
    blurb:
      "Five spinal roots become three trunks, six divisions, three cords and the nerves that move your whole upper limb — a live wire map from spine to fingertips. Hover to trace a nerve, tap it for its story.",
    parts: 18,
    accent: "#22d3ee",
    label: "Brachial Plexus",
    tag: "⚡",
    Component: PlexusDiagram,
  },
  brain: {
    kicker: "Diagram 03 · The Brain & Nervous System",
    title: "The Electric Storm Between Your Ears",
    blurb:
      "Four lobes, a cerebellum and a brainstem that never sleeps — wired together by glowing pathways of thought, with the spinal cord and its peripheral nerves carrying every signal to your body. Hover anything to make it blaze, tap it for its story.",
    parts: 10,
    accent: "#a78bfa",
    label: "Brain & Nervous System",
    tag: "🧠",
    Component: BrainDiagram,
  },
  lungs: {
    kicker: "Diagram 04 · The Lungs & Respiratory System",
    title: "The Breath of Life, Glowing",
    blurb:
      "From the larynx to the last bronchiole, the airway blazes cyan — and the alveoli pulse soft pink where oxygen meets blood. Hover any part to make it glow, tap it for a quick breakdown of what it does.",
    parts: 7,
    accent: "#67e8f9",
    label: "Lungs & Respiratory",
    tag: "🫁",
    Component: LungsDiagram,
  },
  digestive: {
    kicker: "Diagram 05 · The Digestive System",
    title: "The Fire of Digestion, Glowing",
    blurb:
      "From the esophagus's first squeeze to the colon's final pass — every organ blazes warm orange, yellow and gold as food becomes energy. Hover anything to make it glow, tap it for its story.",
    parts: 7,
    accent: "#f59e0b",
    label: "Digestive System",
    tag: "🍽️",
    Component: DigestiveDiagram,
  },
  kidney: {
    kicker: "Diagram 06 · The Kidney & Nephron",
    title: "The Body's Glowing Filter",
    blurb:
      "One million nephrons per kidney, each a tiny filtration machine — from the glomerulus's high-pressure sieve to the collecting duct's final concentrate. Hover any structure to make it glow, tap it for a quick breakdown of what it does.",
    parts: 8,
    accent: "#22d3ee",
    label: "Kidney & Nephron",
    tag: "🫘",
    Component: KidneyDiagram,
  },
  eye: {
    kicker: "Diagram 07 · The Human Eye",
    title: "Where Light Becomes Vision",
    blurb:
      "A cross-section of the eye's optical system — light enters through the cornea, is regulated by the iris, focused by the lens, and projected onto the retina where photons become neural signals. Hover any part to make it glow, tap it for its story.",
    parts: 7,
    accent: "#a78bfa",
    label: "Human Eye",
    tag: "👁️",
    Component: EyeDiagram,
  },
  skeletal: {
    kicker: "Diagram 08 · The Skeletal System",
    title: "The Framework That Glows Within",
    blurb:
      "206 bones form the living scaffolding that protects your organs, bears your weight, and lets you move — from the skull's cranial vault to the toes' intricate arches. Hover any bone to make it blaze, tap it for a quick breakdown of what it does.",
    parts: 12,
    accent: "#e0f2fe",
    label: "Skeletal System",
    tag: "🦴",
    Component: SkeletalSystem,
  },
  endocrine: {
    kicker: "Diagram 09 · The Endocrine System",
    title: "Hormones That Move Mountains",
    blurb:
      "Eight major glands secrete hormones that regulate metabolism, growth, stress, sleep, and reproduction — all through chemical messengers travelling in the bloodstream. Hover any gland to make it blaze, tap it for a quick breakdown.",
    parts: 8,
    accent: "#e879f9",
    label: "Endocrine System",
    tag: "🧬",
    Component: EndocrineDiagram,
  },
  ear: {
    kicker: "Diagram 10 · The Ear",
    title: "Sound Becomes Signal",
    blurb:
      "From the pinna catching sound waves to the cochlea converting them into neural impulses — 9 interactive parts that reveal how you hear the world. Hover any structure to make it blaze, tap it for a quick breakdown.",
    parts: 9,
    accent: "#60a5fa",
    label: "Ear & Hearing",
    tag: "👂",
    Component: EarDiagram,
  },
  cell: {
    kicker: "Diagram 11 · The Cell",
    title: "The Living Machine",
    blurb:
      "Every living thing is built from cells — the nucleus stores DNA, mitochondria generate ATP, ribosomes build proteins, and the Golgi ships them out. 8 interactive organelles reveal how a single cell powers an entire organism. Hover any structure to make it blaze, tap it for a quick breakdown.",
    parts: 8,
    accent: "#22d3ee",
    label: "Cell Biology",
    tag: "🔬",
    Component: CellDiagram,
  },
  "cranial-nerves": {
    kicker: "Diagram 12 · Brainstem & Cranial Nerves",
    title: "The Command Center, Glowing",
    blurb:
      "Midbrain, pons, and medulla — the brainstem that keeps you alive — with all 12 cranial nerves branching out in their signature colors: blue for sensory, red for motor, purple for mixed. Hover any nerve to make it blaze, tap it for its story.",
    parts: 15,
    accent: "#c084fc",
    label: "Cranial Nerves",
    tag: "🧠",
    Component: CranialNervesDiagram,
  },
  mitochondria: {
    kicker: "Diagram 13 · The Mitochondrion",
    title: "The Powerhouse, Glowing",
    blurb:
      "Double-membraned energy factories where glucose becomes ATP — the Krebs cycle spins in the matrix, protons cascade through the electron transport chain, and ATP synthase turbines hum at 130 revolutions per second. Hover any structure to make it blaze, tap it for its story.",
    parts: 7,
    accent: "#4ade80",
    label: "Cellular Energy",
    tag: "⚡",
    Component: MitochondriaDiagram,
  },
};

const COMING_SOON = ["DNA Replication Fork", "Cardiac Cycle ECG"];

function DiagramsInner() {
  const [active, setActive] = useState<DiagramId>("heart");
  const diagramRef = useRef<HTMLDivElement | null>(null);
  const firstRender = useRef(true);

  const meta = DIAGRAMS[active];
  const ActiveComponent = meta.Component;

  // After switching diagrams, glide to the diagram so the new one is in view.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    diagramRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [active]);

  return (
    <div className="min-h-screen">
      <GlassBackdrop />
      <AppHeader title="Diagrams" subtitle="Heatwave & Anatomy" />

      <main className="mx-auto max-w-5xl px-4 pb-40 pt-10 sm:px-6">
        {/* Header (swaps with the active diagram) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="flex size-11 items-center justify-center rounded-2xl"
                style={{ backgroundColor: meta.accent + "1f", color: meta.accent }}
              >
                {active === "anatomy" ? (
                  <Activity className="size-6" />
                ) : active === "heart" ? (
                  <HeartPulse className="size-6" />
                ) : active === "brain" ? (
                  <Brain className="size-6" />
                ) : active === "lungs" ? (
                  <Wind className="size-6" />
                ) : active === "digestive" ? (
                  <Utensils className="size-6" />
                ) : active === "kidney" ? (
                  <Droplets className="size-6" />
                ) : active === "eye" ? (
                  <Eye className="size-6" />
                ) : active === "skeletal" ? (
                  <Bone className="size-6" />
                ) : active === "endocrine" ? (
                  <Zap className="size-6" />
                ) : active === "ear" ? (
                  <Zap className="size-6" />
                ) : active === "cranial-nerves" ? (
                  <Brain className="size-6" />
                ) : active === "mitochondria" ? (
                  <Zap className="size-6" />
                ) : (
                  <Zap className="size-6" />
                )}
              </div>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground">
                  {meta.kicker}
                </p>
                <h1 className="glow-text mt-0.5 text-2xl font-extrabold tracking-tight text-wistaria sm:text-3xl">
                  {meta.title}
                </h1>
              </div>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              {meta.blurb}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="glass-chip flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-muted-foreground">
                <Sparkles className="size-3.5 text-wistaria" />
                {meta.parts} interactive parts
              </span>
              <span className="glass-chip flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-muted-foreground">
                <MousePointerClick className="size-3.5 text-wistaria" />
                Hover to glow · click to explore
              </span>
              <span className="glass-chip flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-muted-foreground">
                <Layers className="size-3.5 text-wistaria" />
                Heatwave rendering
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* The active diagram — fades/slides in place */}
        <div ref={diagramRef} className="scroll-mt-24 pt-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 26, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.985 }}
              transition={{ duration: 0.38, ease: "easeInOut" }}
            >
              <Suspense fallback={<DiagramFallback />}>
                <ActiveComponent />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Gallery — switch diagrams */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10"
        >
          <div className="glass-panel shine rounded-3xl p-5 sm:p-6">
            <p className="text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground">
              Heatwave & Anatomy gallery
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(Object.keys(DIAGRAMS) as DiagramId[]).map((id) => {
                const d = DIAGRAMS[id];
                const isActive = id === active;
                return (
                  <motion.button
                    key={id}
                    whileHover={{ y: -3, scale: 1.015 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActive(id)}
                    aria-pressed={isActive}
                    className={cn(
                      "group relative flex items-center gap-3 overflow-hidden rounded-2xl border p-4 text-left transition-colors",
                      isActive
                        ? "border-transparent"
                        : "border-white/10 hover:border-white/20",
                    )}
                    style={
                      isActive
                        ? {
                            background: `linear-gradient(135deg, ${d.accent}26, ${d.accent}0d)`,
                            boxShadow: `0 0 0 1px ${d.accent}66, 0 12px 30px -14px ${d.accent}cc`,
                          }
                        : undefined
                    }
                  >
                    <div
                      className="flex size-11 shrink-0 items-center justify-center rounded-2xl text-lg transition-transform duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: isActive ? d.accent + "22" : "rgba(255,255,255,0.06)",
                        color: d.accent,
                      }}
                    >
                      {d.tag}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold">{d.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {isActive ? "Showing now — beautiful, isn't it? ✨" : `Click to open ${d.label} diagram`}
                      </p>
                    </div>
                    {isActive && (
                      <span className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
                        <span className="size-1.5 animate-pulse rounded-full bg-white" />
                        Live
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2 border-t border-white/10 pt-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                On the bench:
              </span>
              {COMING_SOON.map((t) => (
                <span
                  key={t}
                  className="glass-chip rounded-full px-3.5 py-1.5 text-xs font-semibold text-muted-foreground"
                >
                  {t} — soon
                </span>
              ))}
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

export default function Diagrams() {
  useHead({ title: "Interactive Anatomy Diagrams", description: "Explore glowing, interactive anatomy diagrams of the heart, brain, lungs, skeleton, and more. Perfect for visual learners.", path: "/diagrams" });
  return (
    <QueryErrorBoundary title="Couldn't load the diagrams">
      <DiagramsInner />
    </QueryErrorBoundary>
  );
}
