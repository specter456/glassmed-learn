import { motion } from "framer-motion";
import { HeartPulse, Layers, MousePointerClick, Sparkles } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { GlassBackdrop } from "@/components/GlassBackdrop";
import { HeartDiagram } from "@/components/HeartDiagram";
import { QueryErrorBoundary } from "@/components/QueryErrorBoundary";

const UP_NEXT = ["Brachial Plexus", "Krebs Cycle", "DNA Replication Fork", "Cardiac Cycle ECG"];

function DiagramsInner() {
  return (
    <div className="min-h-screen">
      <GlassBackdrop />
      <AppHeader title="Diagrams" subtitle="Heatwave & Anatomy" />

      <main className="mx-auto max-w-5xl px-4 pb-40 pt-10 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-[#ff5f7a]/15 text-[#ff5f7a]">
              <HeartPulse className="size-6" />
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground">
                Diagram 01 · The Human Heart
              </p>
              <h1 className="glow-text mt-0.5 text-2xl font-extrabold tracking-tight text-wistaria sm:text-3xl">
                Where Every Beat Glows
              </h1>
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            A living blueprint, not a textbook page — every chamber and vessel
            pulses with the energy of the blood it carries. Glide your cursor
            over a part to make it glow, then tap it for a quick breakdown.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="glass-chip flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-muted-foreground">
              <Sparkles className="size-3.5 text-wistaria" />
              9 interactive parts
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

        {/* The heart */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mt-7"
        >
          <HeartDiagram />
        </motion.div>

        {/* Up next */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="mt-10"
        >
          <p className="text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground">
            Next heatwave diagrams on the bench
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {UP_NEXT.map((t) => (
              <span
                key={t}
                className="glass-chip rounded-full px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}

export default function Diagrams() {
  return (
    <QueryErrorBoundary title="Couldn't load the diagrams">
      <DiagramsInner />
    </QueryErrorBoundary>
  );
}
