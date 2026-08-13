import { motion } from "framer-motion";
import {
  ArrowRight,
  Box,
  Brain,
  Headphones,
  HeartPulse,
  Layers,
  Quote,
  Scissors,
  Search,
  ShieldCheck,
  Sparkles,
  Timer,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { GlassBackdrop } from "@/components/GlassBackdrop";
import { GlassMedLogo, MedicalEmblems } from "@/components/GlassMedLogo";

const MODULES = [
  {
    title: "FLASHCARDS",
    icon: Layers,
    desc: "3D flip cards scheduled on a 1-3-7 spacing ladder.",
    color: "#7b9ee8",
    path: "/flashcards",
  },
  {
    title: "FUNDAMENTALS",
    icon: Box,
    desc: "The five high-yield topics, basics first, then in-depth.",
    color: "#a88bd4",
    path: "/basics",
  },
  {
    title: "GAME",
    icon: Scissors,
    desc: "First Aid Simulator — save the patient, earn the points, level up.",
    color: "#e896b4",
    path: "/game",
  },
  {
    title: "RESEARCH",
    icon: Search,
    desc: "Ten professor-level first-aid guides, readable aloud.",
    color: "#6fb5b0",
    path: "/research",
  },
];

const PATH_TOPICS = [
  { icon: HeartPulse, title: "The Cardiac Cycle", subject: "Physiology", color: "#e2666f" },
  { icon: Zap, title: "The Action Potential", subject: "Neurophysiology", color: "#7b9ee8" },
  { icon: Box, title: "The Brachial Plexus", subject: "Anatomy", color: "#e0a458" },
  { icon: Sparkles, title: "The Krebs Cycle", subject: "Biochemistry", color: "#5fa88b" },
  { icon: Brain, title: "DNA Replication", subject: "Genetics", color: "#8f7bc4" },
];

function reveal(delay: number) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.6, delay, ease: "easeOut" as const },
  };
}

export default function Landing() {
  const navigate = useNavigate();

  const goAuth = (returnTo?: string) => {
    navigate(returnTo ? `/auth?returnTo=${encodeURIComponent(returnTo)}` : "/auth");
  };

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <GlassBackdrop />

      {/* Nav */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="sticky top-0 z-[60] px-4 pt-4"
      >
        <div className="glass-panel mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5">
          <GlassMedLogo size="sm" />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goAuth()}
              className="text-muted-foreground"
            >
              Sign in
            </Button>
            <Button size="sm" onClick={() => goAuth("/dashboard")} className="gap-1.5">
              Start
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="relative mx-auto max-w-6xl px-4 pb-24">
        {/* Hero */}
        <section className="relative flex flex-col items-center pb-20 pt-16 text-center sm:pt-24">
          <div className="tech-grid pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(60%_50%_at_50%_30%,black,transparent)]" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="glass-chip mb-6 flex items-center gap-2 rounded-full px-4 py-1.5"
          >
            <Sparkles className="size-3.5 text-wistaria" />
            <span className="tech-label text-[0.62rem]">
              Precision study · 5 topics · 30 flashcards
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <GlassMedLogo size="lg" />
            <MedicalEmblems compact />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="glow-text mt-8 max-w-3xl text-balance text-4xl font-extrabold leading-tight tracking-tight text-wistaria sm:text-5xl"
          >
            Where Medicine Becomes{" "}
            <span className="relative inline-block">
              Energetic
              <motion.span
                className="absolute -bottom-1 left-0 h-1.5 w-full rounded-full bg-butter"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                style={{ originX: 0 }}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-6 max-w-2xl text-balance text-base leading-7 text-muted-foreground sm:text-lg"
          >
            GlassMed Learn turns the topics that trip up every first-year into
            an exact study system — animated diagrams, 3D-flip flashcards on a
            1-3-7 schedule, and focus audio, all in one clean workspace.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button
              size="lg"
              onClick={() => goAuth("/dashboard")}
              className="gap-2 rounded-full px-10 shadow-[0_16px_40px_-12px_rgba(122,122,216,0.5)]"
            >
              Start
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => goAuth("/flashcards")}
              className="rounded-full px-8"
            >
              Explore flashcards
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-[#6fb5b0]" /> Private per-account progress
            </span>
            <span className="flex items-center gap-1.5">
              <Timer className="size-3.5 text-[#7b9ee8]" /> 5–10 minute daily sessions
            </span>
            <span className="flex items-center gap-1.5">
              <Headphones className="size-3.5 text-[#e896b4]" /> Study with focus audio
            </span>
          </motion.div>
        </section>

        {/* Modules */}
        <section className="pb-24">
          <motion.div {...reveal(0)} className="mb-10 text-center">
            <span className="tech-label">The workspace</span>
            <h2 className="mt-2 text-balance text-2xl font-extrabold tracking-tight text-wistaria sm:text-3xl">
              Four tools, one rhythm
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              Every animation is hardware-accelerated — smooth on low-end
              devices, gentle on the battery.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {MODULES.map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.button
                  key={m.title}
                  {...reveal(i * 0.08)}
                  onClick={() => goAuth(m.path)}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="glass-panel shine group flex flex-col items-start gap-4 rounded-3xl p-6 text-left"
                >
                  <div
                    className="flex size-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: m.color + "1f", color: m.color }}
                  >
                    <Icon className="size-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold tracking-wide">{m.title}</h3>
                    <p className="mt-2 text-[13px] leading-5 text-muted-foreground">{m.desc}</p>
                  </div>
                  <ArrowRight className="mt-auto size-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Learning path */}
        <section className="pb-24">
          <motion.div
            {...reveal(0)}
            className="glass-panel shine relative overflow-hidden rounded-3xl p-8 sm:p-12"
          >
            <div className="tech-grid pointer-events-none absolute inset-0 opacity-30" />
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cloud/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#e8b7cf]/15 blur-3xl" />

            <div className="relative grid items-center gap-10 lg:grid-cols-2">
              <div>
                <span className="glass-chip inline-flex items-center gap-2 rounded-full px-3 py-1">
                  <Zap className="size-3.5 text-wistaria" />
                  <span className="tech-label text-[0.6rem]">Method · basics first</span>
                </span>
                <h2 className="mt-5 text-balance text-2xl font-extrabold tracking-tight text-wistaria sm:text-3xl">
                  The five topics everyone gets wrong first
                </h2>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  Every topic opens with a plain-language basics layer — one
                  diagram, a handful of memory hooks — and only then unlocks the
                  full in-depth text. Learn the skeleton first; the detail
                  sticks to it.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {PATH_TOPICS.map((t) => (
                    <span
                      key={t.title}
                      className="glass-chip flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
                    >
                      <span className="size-2 rounded-full" style={{ backgroundColor: t.color }} />
                      {t.title}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {PATH_TOPICS.map((t, i) => {
                  const Icon = t.icon;
                  return (
                    <motion.div
                      key={t.title}
                      initial={{ opacity: 0, x: 24 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="glass-chip flex items-center gap-4 rounded-2xl p-4"
                    >
                      <div
                        className="flex size-11 shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: t.color + "1f", color: t.color }}
                      >
                        <Icon className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">{t.title}</p>
                        <p className="text-xs text-muted-foreground">{t.subject}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                        <span className="rounded-full bg-cloud/20 px-2 py-0.5">Basics</span>
                        <ArrowRight className="size-3" />
                        <span className="rounded-full bg-wistaria/20 px-2 py-0.5">In-depth</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Spaced repetition */}
        <section className="pb-24">
          <motion.div {...reveal(0)} className="mb-10 text-center">
            <span className="tech-label">Method · retention</span>
            <h2 className="mt-2 text-balance text-2xl font-extrabold tracking-tight text-wistaria sm:text-3xl">
              The 1-3-7 rhythm
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              Answer a card right and it returns in 1 day, then 3, then 7 — right
              when your memory is about to slip. Get it wrong and it's back
              tomorrow. No schedules, no settings.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { day: "Day 1", desc: "First review of a new card", color: "#7b9ee8" },
              { day: "Day 3", desc: "Correct again — card returns in 3 days", color: "#a88bd4" },
              { day: "Day 7", desc: "Third straight correct — mastered", color: "#6fb5b0" },
            ].map((s, i) => (
              <motion.div
                key={s.day}
                {...reveal(i * 0.1)}
                className="glass-panel shine flex flex-col items-center gap-3 rounded-3xl p-7 text-center"
              >
                <div
                  className="flex size-14 items-center justify-center rounded-full font-mono text-lg font-extrabold text-white"
                  style={{ backgroundColor: s.color }}
                >
                  {i + 1}
                </div>
                <h3 className="text-base font-extrabold">{s.day}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Quote strip */}
        <motion.section {...reveal(0)} className="pb-24">
          <figure className="glass-panel shine relative mx-auto max-w-3xl rounded-3xl p-8 text-center sm:p-10">
            <Quote className="mx-auto size-8 text-wistaria/60" />
            <blockquote className="mt-4 text-balance text-lg font-medium leading-8 text-foreground sm:text-xl">
              "Medicine is a mountain of facts. GlassMed builds the path — one
              diagram, one card, one honest answer at a time."
            </blockquote>
            <figcaption className="tech-label mt-4">The GlassMed promise</figcaption>
          </figure>
        </motion.section>

        {/* Final CTA */}
        <section className="pb-10">
          <motion.div
            {...reveal(0)}
            className="glass-strong shine relative overflow-hidden rounded-3xl p-10 text-center sm:p-14"
          >
            <div className="tech-grid pointer-events-none absolute inset-0 opacity-30" />
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-16 top-0 h-48 w-48 animate-orb rounded-full bg-cloud/20 blur-3xl" />
              <div className="absolute -right-16 bottom-0 h-48 w-48 animate-orb-slow rounded-full bg-[#e8b7cf]/20 blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="text-balance text-3xl font-extrabold tracking-tight text-wistaria sm:text-4xl">
                Everything on GlassMed is free
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
                All five topics, ten first-aid guides, the simulator, and the
                assistant — free for every student. Sign up with your email, or
                jump straight in as a guest, and your 1-3-7 schedule is created
                the moment you flip your first card.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  onClick={() => goAuth("/dashboard")}
                  className="gap-2 rounded-full px-10 shadow-[0_16px_40px_-12px_rgba(122,122,216,0.5)]"
                >
                  Start
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => goAuth("/flashcards")}
                  className="rounded-full px-8"
                >
                  Explore flashcards
                </Button>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <GlassMedLogo size="sm" />
            <span className="tech-label hidden sm:inline">Learn</span>
          </div>
          <p className="text-xs text-muted-foreground">
            GlassMed Learn — precision study tools for future physicians.
          </p>
        </div>
      </footer>
    </div>
  );
}
