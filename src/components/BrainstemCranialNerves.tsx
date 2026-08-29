import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

interface Nerve {
  id: string;
  num: string;
  name: string;
  type: "Sensory" | "Motor" | "Mixed";
  function: string;
  exit: string;
  color: string;
  /** SVG path or line coords — x1,y1 → x2,y2 */
  path: string;
}

const NERVES: Nerve[] = [
  { id: "cn1", num: "I", name: "Olfactory", type: "Sensory", function: "Smell — carries sensory signals from the nasal mucosa to the olfactory bulb.", exit: "Cribriform plate", color: "#60a5fa", path: "M280,115 Q240,75 200,50" },
  { id: "cn2", num: "II", name: "Optic", type: "Sensory", function: "Vision — transmits visual information from the retina to the brain.", exit: "Optic canal", color: "#60a5fa", path: "M300,120 Q350,80 400,55" },
  { id: "cn3", num: "III", name: "Oculomotor", type: "Motor", function: "Eye movement — controls most extraocular muscles, pupillary constriction, and accommodation.", exit: "Superior orbital fissure", color: "#f87171", path: "M270,155 Q230,130 185,110" },
  { id: "cn4", num: "IV", name: "Trochlear", type: "Motor", function: "Eye movement — innervates the superior oblique muscle (intorsion, depression, abduction).", exit: "Superior orbital fissure", color: "#f87171", path: "M280,145 Q310,120 360,100" },
  { id: "cn5", num: "V", name: "Trigeminal", type: "Mixed", function: "Face sensation (V1-V3) and mastication (V3) — the largest cranial nerve with 3 divisions.", exit: "Superior orbital fissure / Foramen rotundum / ovale", color: "#c084fc", path: "M250,165 Q190,140 140,125" },
  { id: "cn6", num: "VI", name: "Abducens", type: "Motor", function: "Eye movement — innervates the lateral rectus muscle (abducts the eye).", exit: "Superior orbital fissure", color: "#f87171", path: "M310,175 Q370,150 420,135" },
  { id: "cn7", num: "VII", name: "Facial", type: "Mixed", function: "Facial expression, taste (anterior 2/3 tongue), lacrimation, salivation.", exit: "Internal acoustic meatus → Stylomastoid foramen", color: "#c084fc", path: "M240,200 Q180,185 120,175" },
  { id: "cn8", num: "VIII", name: "Vestibulocochlear", type: "Sensory", function: "Hearing (cochlear) and balance (vestibular) — carries audio and spatial signals.", exit: "Internal acoustic meatus", color: "#60a5fa", path: "M320,200 Q380,185 440,170" },
  { id: "cn9", num: "IX", name: "Glossopharyngeal", type: "Mixed", function: "Taste (posterior 1/3 tongue), swallowing, salivation (parotid), baroreceptor reflexes.", exit: "Jugular foramen", color: "#c084fc", path: "M250,240 Q185,230 125,225" },
  { id: "cn10", num: "X", name: "Vagus", type: "Mixed", function: "Parasympathetic powerhouse — heart rate, digestion (to splenic flexure), larynx, cough reflex.", exit: "Jugular foramen", color: "#c084fc", path: "M310,245 Q385,235 450,228" },
  { id: "cn11", num: "XI", name: "Accessory", type: "Motor", function: "Trapezius and sternocleidomastoid — shrugs shoulders and turns head.", exit: "Jugular foramen", color: "#f87171", path: "M260,280 Q200,275 135,270" },
  { id: "cn12", num: "XII", name: "Hypoglossal", type: "Motor", function: "Tongue movement — all intrinsic and most extrinsic tongue muscles for speech and swallowing.", exit: "Hypoglossal canal", color: "#f87171", path: "M300,290 Q365,285 430,280" },
];

/* ------------------------------------------------------------------ */
/* Brainstem regions                                                   */
/* ------------------------------------------------------------------ */

interface Region {
  id: string;
  label: string;
  desc: string;
  path: string;
  color: string;
}

const REGIONS: Region[] = [
  {
    id: "midbrain",
    label: "Midbrain",
    desc: "The smallest brainstem division. Contains the superior/inferior colliculi (visual/auditory reflexes), cerebral aqueduct, and red nucleus. CN III and IV emerge here.",
    path: "M250,115 Q280,100 310,115 L305,155 Q280,145 255,155 Z",
    color: "#a78bfa",
  },
  {
    id: "pons",
    label: "Pons",
    desc: "The 'bridge' between cerebrum and cerebellum. Contains respiratory pneumotaxic center and CN V, VI, VII, VIII origins. Major relay station for sleep and arousal.",
    path: "M240,155 Q280,140 320,155 L320,230 Q280,220 240,230 Z",
    color: "#c084fc",
  },
  {
    id: "medulla",
    label: "Medulla Oblongata",
    desc: "The vital center — controls heart rate, blood pressure, breathing, and reflexes (cough, sneeze, swallow, vomiting). Contains the pyramids (motor decussation) and the gracile/cuneate nuclei (sensory).",
    path: "M245,230 Q280,220 315,230 L310,320 Q280,310 250,320 Z",
    color: "#818cf8",
  },
];

const TYPE_COLORS: Record<string, string> = {
  Sensory: "#60a5fa",
  Motor: "#f87171",
  Mixed: "#c084fc",
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function BrainstemCranialNervesDiagram() {
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const current = active ?? hovered;
  const isLit = (id: string) => current === id;
  const isRegion = (id: string) => REGIONS.some((r) => r.id === id);

  const activeNerve = NERVES.find((n) => n.id === current);
  const activeRegion = REGIONS.find((r) => r.id === current);
  const tooltip = activeNerve ?? activeRegion;

  return (
    <div className="relative flex flex-col items-center gap-4">
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {(["Sensory", "Motor", "Mixed"] as const).map((t) => (
          <span
            key={t}
            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold"
            style={{ backgroundColor: TYPE_COLORS[t] + "18", color: TYPE_COLORS[t] }}
          >
            <span className="size-2 rounded-full" style={{ background: TYPE_COLORS[t] }} />
            {t}
          </span>
        ))}
      </div>

      <div className="flex w-full items-start gap-4">
        {/* SVG */}
        <div className="flex-1 overflow-hidden rounded-2xl" style={{ background: "linear-gradient(180deg, rgba(30,27,75,0.3) 0%, rgba(88,28,135,0.15) 100%)" }}>
          <svg viewBox="0 0 560 380" className="w-full h-auto" style={{ maxHeight: 460 }}>
            <defs>
              <filter id="cn-glow">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="cn-glow-intense">
                <feGaussianBlur stdDeviation="7" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <radialGradient id="cn-bg-glow" cx="50%" cy="45%">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background glow */}
            <ellipse cx="280" cy="200" rx="160" ry="140" fill="url(#cn-bg-glow)" />

            {/* Brain regions */}
            {REGIONS.map((r) => (
              <motion.path
                key={r.id}
                d={r.path}
                fill={isLit(r.id) ? r.color : r.color + "30"}
                stroke={r.color}
                strokeWidth={isLit(r.id) ? 2.5 : 1.5}
                filter={isLit(r.id) ? "url(#cn-glow-intense)" : "url(#cn-glow)"}
                className="cursor-pointer"
                onClick={() => setActive(active === r.id ? null : r.id)}
                onMouseEnter={() => setHovered(r.id)}
                onMouseLeave={() => setHovered(null)}
                animate={isLit(r.id) ? { opacity: [0.75, 1, 0.75] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            ))}

            {/* Region labels */}
            <text x="280" y="138" textAnchor="middle" className="fill-white/70 text-[11px] font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>Midbrain</text>
            <text x="280" y="195" textAnchor="middle" className="fill-white/70 text-[11px] font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>Pons</text>
            <text x="280" y="275" textAnchor="middle" className="fill-white/70 text-[11px] font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>Medulla</text>

            {/* Cranial nerves */}
            {NERVES.map((n) => {
              const lit = isLit(n.id);
              return (
                <g key={n.id}>
                  <motion.path
                    d={n.path}
                    fill="none"
                    stroke={lit ? n.color : n.color + "60"}
                    strokeWidth={lit ? 3.5 : 2}
                    strokeLinecap="round"
                    filter={lit ? "url(#cn-glow-intense)" : "url(#cn-glow)"}
                    className="cursor-pointer"
                    onClick={() => setActive(active === n.id ? null : n.id)}
                    onMouseEnter={() => setHovered(n.id)}
                    onMouseLeave={() => setHovered(null)}
                    animate={lit ? { opacity: [0.7, 1, 0.7] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  {/* Nerve dot at the tip */}
                  <motion.circle
                    cx={n.path.split(" ").pop()?.split(",")[0]}
                    cy={n.path.split(" ").pop()?.split(",")[1]}
                    r={lit ? 6 : 4}
                    fill={lit ? n.color : n.color + "80"}
                    stroke={n.color}
                    strokeWidth={1.5}
                    filter={lit ? "url(#cn-glow-intense)" : "url(#cn-glow)"}
                    className="cursor-pointer"
                    onClick={() => setActive(active === n.id ? null : n.id)}
                    onMouseEnter={() => setHovered(n.id)}
                    onMouseLeave={() => setHovered(null)}
                  />
                  {/* Number label near the tip */}
                  <text
                    x={parseFloat(n.path.split(" ").pop()?.split(",")[0] ?? "0") + (parseFloat(n.path.split(" ").pop()?.split(",")[0] ?? "0") > 280 ? 12 : -12)}
                    y={parseFloat(n.path.split(" ").pop()?.split(",")[1] ?? "0") + 4}
                    textAnchor={parseFloat(n.path.split(" ").pop()?.split(",")[0] ?? "0") > 280 ? "start" : "end"}
                    className="text-[9px] font-bold"
                    fill={lit ? n.color : n.color + "aa"}
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    {n.num}
                  </text>
                </g>
              );
            })}

            {/* Animated pulse along the brainstem */}
            <motion.circle
              cx="280"
              cy="120"
              r="3"
              fill="#a78bfa"
              filter="url(#cn-glow-intense)"
              animate={{ cy: [120, 300], opacity: [0.7, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </div>

        {/* Tooltip panel */}
        <AnimatePresence mode="wait">
          {tooltip && (
            <motion.div
              key={tooltip.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              className="glass-panel flex-shrink-0 w-64 rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ background: "color" in tooltip ? tooltip.color : "#a78bfa" }} />
                  <span className="text-sm font-extrabold text-wistaria">
                    {"num" in tooltip ? `CN ${tooltip.num} — ${tooltip.name}` : tooltip.label}
                  </span>
                </div>
                <button onClick={() => setActive(null)} className="text-muted-foreground hover:text-foreground" style={{ cursor: "pointer" }}>
                  ✕
                </button>
              </div>
              {"type" in tooltip && (
                <span
                  className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold mb-2"
                  style={{ backgroundColor: TYPE_COLORS[tooltip.type] + "20", color: TYPE_COLORS[tooltip.type] }}
                >
                  {tooltip.type}
                </span>
              )}
              <p className="text-xs leading-5 text-muted-foreground">
                {"function" in tooltip ? tooltip.function : tooltip.desc}
              </p>
              {"exit" in tooltip && (
                <p className="mt-2 text-[10px] font-bold text-wistaria/60">
                  Exits via: {tooltip.exit}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Clinical pearl */}
      <div className="w-full mt-1 flex items-start gap-2 rounded-xl bg-[#c084fc]/10 border border-[#c084fc]/20 px-3 py-2">
        <span className="text-[11px] mt-0.5 shrink-0 text-[#c084fc]">⚡</span>
        <p className="text-[11px] leading-4 text-[#e9d5ff]">
          <span className="font-extrabold">Clinical Pearl:</span> Remember — CN I, II, and VIII are purely sensory (Some Say Marry Money), CN III, IV, VI, XI, XII are purely motor (But My Brother Says Big), and CN V, VII, IX, X are mixed (Brains Matter More).
        </p>
      </div>
    </div>
  );
}

export default BrainstemCranialNervesDiagram;
