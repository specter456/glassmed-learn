import { motion } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { GlassBackdrop } from "@/components/GlassBackdrop";
import { useHead } from "@/lib/seo";
import { ARTICLES } from "@/lib/articles";

/** Sad Professor Rabbit SVG — a cute crying rabbit mascot */
function SadRabbit() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative"
    >
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Glow backdrop */}
        <circle cx="60" cy="65" r="50" fill="url(#rabbit-glow)" opacity="0.25" />

        {/* Ears */}
        <ellipse cx="42" cy="28" rx="10" ry="24" fill="#c084fc" opacity="0.9" />
        <ellipse cx="42" cy="28" rx="6" ry="18" fill="#e9d5ff" opacity="0.6" />
        <ellipse cx="78" cy="28" rx="10" ry="24" fill="#c084fc" opacity="0.9" />
        <ellipse cx="78" cy="28" rx="6" ry="18" fill="#e9d5ff" opacity="0.6" />

        {/* Head */}
        <circle cx="60" cy="65" r="34" fill="#c084fc" />
        <circle cx="60" cy="65" r="31" fill="#ddd6fe" opacity="0.9" />

        {/* Eyes — sad */}
        <circle cx="48" cy="60" r="4" fill="#1e1b4b" />
        <circle cx="72" cy="60" r="4" fill="#1e1b4b" />
        <circle cx="49" cy="58.5" r="1.2" fill="white" />
        <circle cx="73" cy="58.5" r="1.2" fill="white" />

        {/* Sad eyebrows */}
        <line x1="43" y1="53" x2="51" y2="55" stroke="#1e1b4b" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="77" y1="53" x2="69" y2="55" stroke="#1e1b4b" strokeWidth="1.5" strokeLinecap="round" />

        {/* Tear drops */}
        <motion.path
          d="M43 66 Q44 72 43 76"
          stroke="#78A2D2"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.path
          d="M77 66 Q76 72 77 76"
          stroke="#78A2D2"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />

        {/* Nose */}
        <ellipse cx="60" cy="68" rx="2.5" ry="1.8" fill="#a78bfa" />

        {/* Sad mouth */}
        <path d="M52 74 Q60 70 68 74" stroke="#1e1b4b" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Whiskers */}
        <line x1="34" y1="66" x2="46" y2="68" stroke="#a78bfa" strokeWidth="0.8" opacity="0.5" />
        <line x1="34" y1="70" x2="46" y2="70" stroke="#a78bfa" strokeWidth="0.8" opacity="0.5" />
        <line x1="74" y1="68" x2="86" y2="66" stroke="#a78bfa" strokeWidth="0.8" opacity="0.5" />
        <line x1="74" y1="70" x2="86" y2="70" stroke="#a78bfa" strokeWidth="0.8" opacity="0.5" />

        <defs>
          <radialGradient id="rabbit-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#78A2D2" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

const QUICK_LINKS = [
  { label: "Dashboard", path: "/dashboard", icon: "🏠" },
  { label: "Flashcards", path: "/flashcards", icon: "📚" },
  { label: "Research", path: "/research", icon: "🔬" },
  { label: "Diagrams", path: "/diagrams", icon: "🫀" },
];

export default function NotFound() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  useHead({
    title: "Page Not Found",
    description: "This page doesn't exist yet. Let's get you back to studying with GlassMed!",
    noIndex: true,
  });

  const results = useMemo(() => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    return ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q),
    ).slice(0, 5);
  }, [query]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative flex min-h-screen flex-col"
    >
      <GlassBackdrop />

      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="flex w-full max-w-md flex-col items-center text-center">
          <SadRabbit />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-strong mt-4 w-full rounded-3xl p-8"
          >
            <p className="text-5xl font-extrabold tracking-tight text-wistaria">404</p>
            <p className="mt-2 text-lg font-semibold text-foreground">Page Not Found</p>
            <p className="mt-2 text-sm text-muted-foreground">
              This page slipped out of the anatomy atlas. 😢
            </p>

            {/* Search */}
            <div className="relative mt-5">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search topics..."
                className="glass-chip w-full rounded-xl py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-wistaria/40"
              />
            </div>

            {/* Search results */}
            {results.length > 0 && (
              <div className="mt-3 flex flex-col gap-1.5">
                {results.map((a) => (
                  <button
                    key={a.slug}
                    onClick={() => navigate(`/research?article=${a.slug}`)}
                    className="glass-chip flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition-all hover:scale-[1.02]"
                  >
                    <span>{a.emoji}</span>
                    <span className="font-medium text-foreground">{a.title}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{a.category}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Quick links */}
            <div className="mt-5 grid grid-cols-2 gap-2">
              {QUICK_LINKS.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="glass-chip flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-all hover:scale-[1.02] hover:text-wistaria"
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </button>
              ))}
            </div>

            <Button onClick={() => navigate("/dashboard")} className="mt-5 gap-2">
              <ArrowLeft className="size-4" />
              Back to Dashboard
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
