import { motion } from "framer-motion";
import { HeartPulse, Hourglass } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { GlassBackdrop } from "@/components/GlassBackdrop";
import { QueryErrorBoundary } from "@/components/QueryErrorBoundary";

function DiagramsInner() {
  return (
    <div className="min-h-screen">
      <GlassBackdrop />
      <AppHeader title="Diagrams" />
      <main className="mx-auto flex max-w-3xl flex-col items-center px-4 pb-40 pt-16 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-wistaria/25 blur-2xl" aria-hidden />
            <div className="relative flex size-20 items-center justify-center rounded-3xl bg-wistaria/15 text-wistaria">
              <HeartPulse className="size-10" />
            </div>
          </div>

          <h1 className="glow-text mt-7 text-balance text-3xl font-extrabold tracking-tight text-wistaria sm:text-4xl">
            Anatomy Diagrams — Coming Soon
          </h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Ultra-light, labelled diagrams for every fundamentals topic are on
            their way — from the cardiac cycle to the brachial plexus. Tap one
            to rotate, pinch to zoom, and study the structure the way it really
            looks.
          </p>

          <span className="glass-chip mt-7 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-muted-foreground">
            <Hourglass className="size-3.5 text-wistaria" />
            Under construction — check back soon
          </span>
        </motion.div>
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
