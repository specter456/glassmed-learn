import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Timer } from "lucide-react";

interface ComingSoonProps {
  icon: LucideIcon;
  title: string;
  tagline: string;
  description: string;
  features: { icon: LucideIcon; label: string; desc: string }[];
  accent: string;
}

export function ComingSoon({
  icon: Icon,
  title,
  tagline,
  description,
  features,
  accent,
}: ComingSoonProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-32 pt-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-panel shine relative overflow-hidden rounded-3xl p-8 text-center sm:p-12"
      >
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: accent }}
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: "#7b9ee8" }}
        />

        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative mx-auto flex size-20 items-center justify-center rounded-3xl"
          style={{ backgroundColor: accent + "1f", color: accent }}
        >
          <Icon className="size-10" />
        </motion.div>

        <span className="glass-chip mt-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#5b5ba3]">
          <Timer className="size-3.5" />
          Under construction
        </span>

        <h1 className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-wistaria sm:text-4xl">
          {title}
        </h1>
        <p className="mt-1 text-base font-semibold text-foreground">{tagline}</p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {features.map((f, i) => {
            const FIcon = f.icon;
            return (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="glass-chip flex flex-col items-center gap-2 rounded-2xl p-4 text-center"
              >
                <FIcon className="size-5" style={{ color: accent }} />
                <p className="text-xs font-bold">{f.label}</p>
                <p className="text-[11px] leading-4 text-muted-foreground">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          The structure is ready — audio & interactive visuals plug straight in.
        </p>
      </motion.div>
    </main>
  );
}

