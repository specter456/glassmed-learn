import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Box,
  Brain,
  HeartPulse,
  Layers,
  Music2,
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
import { MediProLogo } from "@/components/MediProLogo";
import { SplashScreen } from "@/components/SplashScreen";

const MODULES = [
  {
    title: "FLASHCARDS",
    icon: Layers,
    desc: "3D flip cards with a 1-3-7 spaced-repetition ladder. Get it right and the card schedules itself.",
    color: "#7b9ee8",
    soft: "bg-[#7b9ee8]/15",
    path: "/flashcards",
  },
  {
    title: "BASICS",
    icon: Box,
    desc: "The 5 topics every med student stumbles on first — with light visuals and a Basics→In-Depth path.",
    color: "#a88bd4",
    soft: "bg-[#a88bd4]/15",
    path: "/basics",
  },
  {
    title: "GAME",
    icon: Scissors,
    desc: "Quick-fire challenges in the OR. Under construction — structured for audio & interactive rounds.",
    color: "#e896b4",
    soft: "bg-[#e896b4]/15",
    path: "/game",
  },
  {
    title: "RESEARCH",
    icon: Search,
    desc: "Dive deeper into the literature. Under construction — built for rich 3D & audio later.",
    color: "#6fb5b0",
    soft: "bg-[#6fb5b0]/15",
    path: "/research",
  },
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

  const pathTopics = [
    { icon: HeartPulse, title: "The Cardiac Cycle", subject: "Physiology", color: "#e2666f" },
    { icon: Zap, title: "The Action Potential", subject: "Neurophysiology", color: "#7b9ee8" },
    { icon: Box, title: "The Brachial Plexus", subject: "Anatomy", color: "#e0a458" },
    { icon: Sparkles, title: "The Krebs Cycle", subject: "Biochemistry", color: "#5fa88b" },
    { icon: Brain, title: "DNA Replication", subject: "Genetics", color: "#8f7bc4" },
  ];

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <GlassBackdrop />
      <AnimatePresence>
        <SplashScreen />
      </AnimatePresence>

      {/* Nav */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="sticky top-0 z-[60] px-4 pt-4"
      >
        <div className="glass-panel mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5">
          <MediProLogo variant="day" size="sm" />
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
              Get started
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="relative mx-auto max-w-6xl px-4 pb-24">
        {/* Hero */}
        <section className="flex flex-col items-center pb-20 pt-16 text-center sm:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="glass-chip mb-6 flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-[#5b5ba3]"
          >
            <Sparkles className="size-3.5" />
            Built for NEET & 1st-year MBBS
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <MediProLogo variant="day" size="xl" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-8 max-w-3xl text-balance text-4xl font-extrabold leading-tight tracking-tight text-wistaria sm:text-5xl"
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
            The five topics that trip up every first-year — Cardiac Cycle, Action
            Potential, Brachial Plexus, Krebs Cycle, DNA Replication — taught
            basics-first, then taken in-depth. Flip cards, trace the diagrams,
            and let a 1-3-7 rhythm lock them in.
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
              className="gap-2 rounded-full px-8 shadow-[0_16px_36px_-12px_rgba(107,107,179,0.55)]"
            >
              Start learning free
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => goAuth("/basics")}
              className="rounded-full px-8"
            >
              Explore the basics
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-[#6fb5b0]" /> Your progress is private
            </span>
            <span className="flex items-center gap-1.5">
              <Timer className="size-3.5 text-[#7b9ee8]" /> 5–10 min daily sessions
            </span>
            <span className="flex items-center gap-1.5">
              <Music2 className="size-3.5 text-[#e896b4]" /> Study with your own music
            </span>
          </motion.div>
        </section>

        {/* Modules */}
        <section className="pb-24">
          <motion.div {...reveal(0)} className="mb-10 text-center">
            <h2 className="text-balance text-2xl font-extrabold tracking-tight text-wistaria sm:text-3xl">
              Four ways to learn
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              Everything runs on hardware-accelerated animation — smooth on low-end
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
                  className="glass-panel group flex flex-col items-start gap-4 rounded-3xl p-6 text-left"
                >
                  <div
                    className={`flex size-14 items-center justify-center rounded-2xl ${m.soft} text-white transition-transform duration-300 group-hover:scale-110`}
                    style={{ backgroundColor: m.color + "22", color: m.color }}
                  >
                    <Icon className="size-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold tracking-wide text-foreground">
                      {m.title}
                    </h3>
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
          <motion.div {...reveal(0)} className="glass-panel relative overflow-hidden rounded-3xl p-8 sm:p-12">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cloud/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#e8b7cf]/25 blur-3xl" />

            <div className="relative grid items-center gap-10 lg:grid-cols-2">
              <div>
                <span className="glass-chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#5b5ba3]">
                  <Zap className="size-3.5" />
                  Basics first, then in-depth
                </span>
                <h2 className="mt-5 text-balance text-2xl font-extrabold tracking-tight text-wistaria sm:text-3xl">
                  The 5 topics everyone gets wrong first
                </h2>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  Every topic opens with a plain-language basics layer — one
                  diagram, a handful of memory hooks — and only then unlocks the
                  full in-depth text. Learn the skeleton first; the detail
                  sticks to it.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {pathTopics.map((t) => {
                    const Icon = t.icon;
                    return (
                      <span
                        key={t.title}
                        className="glass-chip flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
                      >
                        <span className="size-2 rounded-full" style={{ backgroundColor: t.color }} />
                        {t.title}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                {pathTopics.map((t, i) => {
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
            <h2 className="text-balance text-2xl font-extrabold tracking-tight text-wistaria sm:text-3xl">
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
              { day: "Day 1", label: "First review", desc: "New card → review tomorrow", color: "#7b9ee8" },
              { day: "Day 3", label: "Lock it in", desc: "Correct again → see it in 3 days", color: "#a88bd4" },
              { day: "Day 7", label: "Mastered", desc: "Third straight correct → 7-day cycle", color: "#6fb5b0" },
            ].map((s, i) => (
              <motion.div
                key={s.day}
                {...reveal(i * 0.1)}
                className="glass-panel flex flex-col items-center gap-3 rounded-3xl p-7 text-center"
              >
                <div
                  className="flex size-14 items-center justify-center rounded-full text-lg font-extrabold text-white"
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
          <figure className="glass-panel relative mx-auto max-w-3xl rounded-3xl p-8 text-center sm:p-10">
            <Quote className="mx-auto size-8 text-wistaria/60" />
            <blockquote className="mt-4 text-balance text-lg font-medium leading-8 text-foreground sm:text-xl">
              "The cardiac cycle, the action potential, the brachial plexus — the
              topics that separate the toppers from the crammers."
            </blockquote>
            <figcaption className="mt-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              — The 1st-year survival list
            </figcaption>
          </figure>
        </motion.section>

        {/* Final CTA */}
        <section className="pb-10">
          <motion.div
            {...reveal(0)}
            className="glass-strong relative overflow-hidden rounded-3xl p-10 text-center sm:p-14"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-16 top-0 h-48 w-48 animate-orb rounded-full bg-cloud/25 blur-3xl" />
              <div className="absolute -right-16 bottom-0 h-48 w-48 animate-orb-slow rounded-full bg-[#e8b7cf]/30 blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="text-balance text-3xl font-extrabold tracking-tight text-wistaria sm:text-4xl">
                Your first 5 minutes start here
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
                Sign up free with your email — or jump straight in as a guest.
                Your spaced-repetition schedule is created the moment you flip
                your first card.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  onClick={() => goAuth("/dashboard")}
                  className="gap-2 rounded-full px-10 shadow-[0_16px_36px_-12px_rgba(107,107,179,0.55)]"
                >
                  Create free account
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-white/40 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <MediProLogo variant="day" size="sm" />
          <p className="text-xs text-muted-foreground">
            Made for medical students & NEET aspirants. Learn well, rest well.
          </p>
        </div>
      </footer>
    </div>
  );
}
