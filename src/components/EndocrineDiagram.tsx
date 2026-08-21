import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Gland {
  id: string;
  label: string;
  role: string;
  desc: string;
  color: string;
  glowColor: string;
  /** SVG coordinates (cx, cy) for position on the body outline */
  cx: number;
  cy: number;
  /** SVG hit area radius */
  r: number;
}

const GLANDS: Gland[] = [
  {
    id: "hypothalamus",
    label: "Hypothalamus",
    role: "Master regulator",
    desc: "The command centre linking the nervous and endocrine systems. It senses blood temperature, osmolality, and hormone levels, then secretes releasing/inhibiting hormones that control the pituitary. It also governs hunger, thirst, sleep, and body temperature.",
    color: "#c084fc",
    glowColor: "#a855f7",
    cx: 250,
    cy: 95,
    r: 18,
  },
  {
    id: "pineal",
    label: "Pineal Gland",
    role: "Sleep-wake cycle",
    desc: "A tiny pine-cone-shaped gland deep in the brain that secretes melatonin in response to darkness. It synchronises the circadian rhythm — melatonin levels rise at night and fall during daylight. Jet lag occurs when this cycle is disrupted.",
    color: "#818cf8",
    glowColor: "#6366f1",
    cx: 265,
    cy: 80,
    r: 12,
  },
  {
    id: "pituitary",
    label: "Pituitary Gland",
    role: "The master gland",
    desc: "A pea-sized structure in the sella turcica beneath the hypothalamus. The anterior lobe secretes GH, TSH, ACTH, FSH, LH, and prolactin; the posterior lobe stores and releases ADH and oxytocin made by the hypothalamus. It orchestrates growth, reproduction, metabolism, and stress responses.",
    color: "#e879f9",
    glowColor: "#d946ef",
    cx: 250,
    cy: 108,
    r: 14,
  },
  {
    id: "thyroid",
    label: "Thyroid Gland",
    role: "Metabolism control",
    desc: "A butterfly-shaped gland wrapping the trachea below the larynx. It produces T₄ (thyroxine) and T₃ (triiodothyronine), which regulate basal metabolic rate, heat production, heart rate, and nervous system development. Calcitonin lowers blood calcium.",
    color: "#f59e0b",
    glowColor: "#d97706",
    cx: 250,
    cy: 155,
    r: 18,
  },
  {
    id: "thymus",
    label: "Thymus",
    role: "T-cell maturation",
    desc: "A bilobed organ behind the sternum, most active during childhood. It is where T-lymphocytes mature and undergo positive/negative selection to distinguish self from non-self. It involutes (shrinks) after puberty as the immune system matures.",
    color: "#fb923c",
    glowColor: "#f97316",
    cx: 250,
    cy: 210,
    r: 16,
  },
  {
    id: "adrenals",
    label: "Adrenal Glands",
    role: "Stress response",
    desc: "Triangular glands sitting atop each kidney. The outer cortex produces cortisol (stress metabolism), aldosterone (Na⁺/K⁺ balance), and sex steroids. The inner medulla secretes adrenaline and noradrenaline for the fight-or-flight response. The HPA axis controls cortisol release.",
    color: "#ef4444",
    glowColor: "#dc2626",
    cx: 250,
    cy: 305,
    r: 14,
  },
  {
    id: "pancreas",
    label: "Pancreas",
    role: "Blood sugar control",
    desc: "A dual-function organ behind the stomach. The exocrine portion secretes digestive enzymes; the endocrine Islets of Langerhans contain β-cells (insulin — lowers blood glucose) and α-cells (glucagon — raises blood glucose). Failure of β-cells → diabetes mellitus.",
    color: "#22d3ee",
    glowColor: "#06b6d4",
    cx: 250,
    cy: 340,
    r: 18,
  },
  {
    id: "ovaries-testes",
    label: "Gonads",
    role: "Reproduction & sex hormones",
    desc: "Ovaries produce oestrogen and progesterone, regulating the menstrual cycle and supporting pregnancy. Testes produce testosterone, driving spermatogenesis and male secondary sexual characteristics. Both are controlled by FSH and LH from the pituitary.",
    color: "#f472b6",
    glowColor: "#ec4899",
    cx: 250,
    cy: 400,
    r: 14,
  },
];

/* ─── Animated glow pulse on the body outline ─── */
function GlowPulse({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={40} fill={color} opacity={0.06}>
        <animate attributeName="r" values="35;48;35" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.04;0.10;0.04" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx={cx} cy={cy} r={22} fill={color} opacity={0.1}>
        <animate attributeName="r" values="18;26;18" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.08;0.16;0.08" dur="3s" repeatCount="indefinite" />
      </circle>
    </>
  );
}

/* ─── Pulsing connection lines between glands ─── */
function ConnectionLine({
  x1, y1, x2, y2, color,
}: {
  x1: number; y1: number; x2: number; y2: number; color: string;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={1.5}
      strokeDasharray="4 4"
      opacity={0.25}
    >
      <animate
        attributeName="stroke-dashoffset"
        values="0;16"
        dur="2s"
        repeatCount="indefinite"
      />
    </line>
  );
}

export function EndocrineDiagram() {
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const activeGland = GLANDS.find((g) => g.id === active);

  return (
    <div className="relative w-full">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-8">
        {/* SVG Diagram */}
        <div className="flex-1">
          <svg
            viewBox="0 0 500 520"
            className="w-full max-w-md mx-auto"
            style={{ filter: "drop-shadow(0 0 40px rgba(168, 85, 247, 0.15))" }}
          >
            <defs>
              {GLANDS.map((g) => (
                <filter key={`glow-${g.id}`} id={`glow-${g.id}`} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation={hovered === g.id || active === g.id ? 10 : 4} result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              ))}
              <radialGradient id="bodyGlow" cx="50%" cy="40%" r="55%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.08" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background glow */}
            <ellipse cx="250" cy="260" rx="160" ry="240" fill="url(#bodyGlow)" />

            {/* ── Body outline ── */}
            {/* Head */}
            <ellipse cx="250" cy="85" rx="48" ry="55" fill="none" stroke="#a855f7" strokeWidth="2" opacity={0.35} />
            {/* Neck */}
            <rect x="238" y="135" width="24" height="30" rx="6" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity={0.3} />
            {/* Torso */}
            <path
              d="M200 165 Q190 165 180 180 L170 250 Q168 280 175 320 L185 380 Q190 400 200 420 L210 460 Q220 480 250 485 Q280 480 290 460 L300 420 Q310 400 315 380 L325 320 Q332 280 330 250 L320 180 Q310 165 300 165 Z"
              fill="none"
              stroke="#a855f7"
              strokeWidth="2"
              opacity={0.35}
            />
            {/* Arms (simplified) */}
            <path d="M180 180 Q140 200 120 260 Q110 300 100 340" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity={0.25} />
            <path d="M320 180 Q360 200 380 260 Q390 300 400 340" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity={0.25} />
            {/* Legs */}
            <path d="M220 460 Q215 480 210 510" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity={0.25} />
            <path d="M280 460 Q285 480 290 510" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity={0.25} />

            {/* ── Connection lines (hormonal axes) ── */}
            <ConnectionLine x1={250} y1={108} x2={250} y2={95} color="#c084fc" />
            <ConnectionLine x1={250} y1={108} x2={250} y2={155} color="#e879f9" />
            <ConnectionLine x1={250} y1={108} x2={250} y2={305} color="#ef4444" />
            <ConnectionLine x1={250} y1={155} x2={250} y2={340} color="#22d3ee" />
            <ConnectionLine x1={250} y1={108} x2={250} y2={400} color="#f472b6" />

            {/* ── Glow pulses ── */}
            {GLANDS.map((g) => (
              <GlowPulse key={`pulse-${g.id}`} cx={g.cx} cy={g.cy} color={g.glowColor} />
            ))}

            {/* ── Gland nodes ── */}
            {GLANDS.map((g) => {
              const isHl = active === g.id || hovered === g.id;
              const size = isHl ? g.r + 4 : g.r;
              return (
                <g key={g.id}>
                  {/* Hit area */}
                  <circle
                    cx={g.cx}
                    cy={g.cy}
                    r={g.r + 12}
                    fill="transparent"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHovered(g.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setActive(active === g.id ? null : g.id)}
                  />
                  {/* Outer glow ring */}
                  <circle
                    cx={g.cx}
                    cy={g.cy}
                    r={size + 3}
                    fill="none"
                    stroke={g.color}
                    strokeWidth={1}
                    opacity={isHl ? 0.6 : 0.2}
                    filter={isHl ? `url(#glow-${g.id})` : undefined}
                    style={{ transition: "all 0.3s ease" }}
                  />
                  {/* Core dot */}
                  <circle
                    cx={g.cx}
                    cy={g.cy}
                    r={size * 0.45}
                    fill={g.color}
                    opacity={isHl ? 1 : 0.7}
                    filter={isHl ? `url(#glow-${g.id})` : undefined}
                    style={{ transition: "all 0.3s ease" }}
                  />
                  {/* Inner bright core */}
                  <circle
                    cx={g.cx}
                    cy={g.cy}
                    r={size * 0.18}
                    fill="white"
                    opacity={isHl ? 0.9 : 0.4}
                    style={{ transition: "all 0.3s ease" }}
                  />
                  {/* Label */}
                  <text
                    x={g.cx + size + 14}
                    y={g.cy + 4}
                    fill={g.color}
                    fontSize={isHl ? 12 : 10}
                    fontWeight={isHl ? 800 : 600}
                    opacity={isHl ? 1 : 0.7}
                    style={{ transition: "all 0.3s ease", userSelect: "none" }}
                  >
                    {g.label}
                  </text>
                </g>
              );
            })}

            {/* Title label */}
            <text x="250" y="30" textAnchor="middle" fill="#a855f7" fontSize="14" fontWeight="800" letterSpacing="0.15em" opacity={0.6}>
              ENDOCRINE SYSTEM
            </text>
          </svg>
        </div>

        {/* Tooltip panel */}
        <div className="w-full lg:w-80 shrink-0">
          <AnimatePresence mode="wait">
            {activeGland ? (
              <motion.div
                key={activeGland.id}
                initial={{ opacity: 0, x: 20, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="glass-panel shine rounded-3xl p-6"
                style={{
                  boxShadow: `0 0 0 1px ${activeGland.color}33, 0 0 40px ${activeGland.color}15`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex size-10 items-center justify-center rounded-xl"
                      style={{ backgroundColor: activeGland.color + "22", color: activeGland.color }}
                    >
                      <div className="size-4 rounded-full" style={{ backgroundColor: activeGland.color }} />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold">{activeGland.label}</h3>
                      <p className="text-xs font-semibold" style={{ color: activeGland.color }}>
                        {activeGland.role}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActive(null)}
                    className="flex size-7 items-center justify-center rounded-lg bg-white/10 text-muted-foreground transition-colors hover:bg-white/20"
                    style={{ cursor: "pointer" }}
                  >
                    ✕
                  </button>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {activeGland.desc}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-panel shine rounded-3xl p-6 text-center"
              >
                <p className="text-sm font-semibold text-muted-foreground">
                  Click any gland to learn about it
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {GLANDS.length} interactive glands · Hover to glow · Click to explore
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {GLANDS.map((g) => (
          <button
            key={g.id}
            onClick={() => setActive(active === g.id ? null : g.id)}
            onMouseEnter={() => setHovered(g.id)}
            onMouseLeave={() => setHovered(null)}
            className="glass-chip flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition-all"
            style={{
              color: g.color,
              borderColor: active === g.id ? g.color + "66" : undefined,
              backgroundColor: active === g.id ? g.color + "15" : undefined,
              cursor: "pointer",
            }}
          >
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: g.color }}
            />
            {g.label}
          </button>
        ))}
      </div>
    </div>
  );
}
