import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Part {
  id: string;
  label: string;
  role: string;
  desc: string;
  color: string;
}

const PARTS: Part[] = [
  {
    id: "pinna",
    label: "Pinna (Auricle)",
    role: "Sound collector",
    desc: "The visible, cartilaginous outer ear that funnels sound waves into the ear canal. Its ridges help localise where sounds come from — the shape creates direction-dependent filtering that the brain interprets to determine sound source elevation.",
    color: "#94a3b8",
  },
  {
    id: "canal",
    label: "Ear Canal",
    role: "Sound pathway",
    desc: "A ~2.5 cm tube leading from the pinna to the eardrum. It amplifies frequencies around 3,000 Hz (resonance) — important for speech clarity. Cerumen (earwax) produced by glands in the outer third traps debris and has antibacterial properties.",
    color: "#a1a1aa",
  },
  {
    id: "tympanic",
    label: "Tympanic Membrane",
    role: "Vibration converter",
    desc: "A thin, cone-shaped membrane separating the outer and middle ear. Sound waves cause it to vibrate — these vibrations are transmitted to the ossicles. Perforation (from infection, trauma, or pressure) causes conductive hearing loss.",
    color: "#60a5fa",
  },
  {
    id: "malleus",
    label: "Malleus (Hammer)",
    role: "First ossicle",
    desc: "Attached to the inner surface of the tympanic membrane. Vibrations from the eardrum swing the malleus, which transmits force to the incus. It is the largest of the three ossicles and acts as a lever to amplify sound pressure.",
    color: "#38bdf8",
  },
  {
    id: "incus",
    label: "Incus (Anvil)",
    role: "Middle ossicle",
    desc: "The bridge between the malleus and stapes. It further amplifies and transmits vibrations to the oval window. The incudostapedial joint is the weakest link — dislocation can occur from barotrauma or head trauma.",
    color: "#22d3ee",
  },
  {
    id: "stapes",
    label: "Stapes (Stirrup)",
    role: "Inner ear interface",
    desc: "The smallest bone in the body (~3 mm). Its footplate sits in the oval window of the cochlea. It converts mechanical vibrations into pressure waves in the cochlear fluid. Otosclerosis (abnormal bone growth fixing the stapes) causes progressive conductive hearing loss.",
    color: "#06b6d4",
  },
  {
    id: "cochlea",
    label: "Cochlea",
    role: "Sound → electrical signals",
    desc: "A snail-shaped, fluid-filled organ (~2.5 turns) that performs the critical transformation of mechanical vibrations into electrical nerve impulses. The basilar membrane inside resonates at different frequencies along its length — high frequencies at the base, low at the apex — creating a tonotopic map.",
    color: "#a78bfa",
  },
  {
    id: "cochlear-nerve",
    label: "Cochlear Nerve",
    role: "Auditory signal carrier",
    desc: "Part of Cranial Nerve VIII (Vestibulocochlear). ~30,000 nerve fibres carry frequency, intensity, and timing information from the organ of Corti to the cochlear nuclei in the brainstem → inferior colliculus → medial geniculate nucleus → primary auditory cortex (A1).",
    color: "#818cf8",
  },
  {
    id: "eustachian",
    label: "Eustachian Tube",
    role: "Pressure equaliser",
    desc: "Connects the middle ear to the nasopharynx. It opens during swallowing and yawning to equalise air pressure on both sides of the eardrum. Dysfunction (blocked by cold/allergies) → middle ear pressure imbalance → pain, fluid accumulation, and conductive hearing loss (glue ear).",
    color: "#f59e0b",
  },
];

/* ─── SVG Glow Effects ─── */
function GlowDot({ cx, cy, color, intensity = 1 }: { cx: number; cy: number; color: string; intensity?: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={18 * intensity} fill={color} opacity={0.05 * intensity}>
        <animate attributeName="r" values={`${14 * intensity};${22 * intensity};${14 * intensity}`} dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx={cx} cy={cy} r={8 * intensity} fill={color} opacity={0.12 * intensity}>
        <animate attributeName="r" values={`${6 * intensity};${10 * intensity};${6 * intensity}`} dur="3s" repeatCount="indefinite" />
      </circle>
    </>
  );
}

function SoundWave({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${x - 12 - i * 8} ${y - 10 - i * 4} Q${x - 6 - i * 8} ${y} ${x - 12 - i * 8} ${y + 10 + i * 4}`}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          opacity={0.3 - i * 0.08}
        >
          <animate
            attributeName="opacity"
            values={`${0.3 - i * 0.08};${0.1};${0.3 - i * 0.08}`}
            dur={`${1.5 + i * 0.3}s`}
            repeatCount="indefinite"
          />
        </path>
      ))}
    </>
  );
}

export function EarDiagram() {
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const activePart = PARTS.find((p) => p.id === active);

  return (
    <div className="relative w-full">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-8">
        {/* SVG Diagram */}
        <div className="flex-1">
          <svg viewBox="0 0 520 400" className="w-full max-w-lg mx-auto" style={{ filter: "drop-shadow(0 0 30px rgba(96, 165, 250, 0.12))" }}>
            <defs>
              {PARTS.map((p) => (
                <filter key={`glow-${p.id}`} id={`glow-${p.id}`} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation={active === p.id || hovered === p.id ? 8 : 3} result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              ))}
            </defs>

            {/* Title */}
            <text x="260" y="28" textAnchor="middle" fill="#60a5fa" fontSize="13" fontWeight="800" letterSpacing="0.15em" opacity={0.6}>
              AUDITORY SYSTEM
            </text>

            {/* Sound waves entering */}
            <SoundWave x={100} y={185} color="#60a5fa" />

            {/* ── Pinna ── */}
            <path
              d="M60 130 Q40 140 35 170 Q30 200 35 230 Q40 260 60 270 Q75 278 85 265 Q95 250 90 230 Q88 210 90 195 Q88 175 90 160 Q95 140 85 128 Z"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2.5"
              opacity={active === "pinna" || hovered === "pinna" ? 1 : 0.6}
              filter={active === "pinna" || hovered === "pinna" ? "url(#glow-pinna)" : undefined}
              style={{ transition: "all 0.3s" }}
            />
            <GlowDot cx={62} cy={200} color="#94a3b8" intensity={active === "pinna" || hovered === "pinna" ? 1.5 : 0.5} />

            {/* ── Ear Canal ── */}
            <path
              d="M90 185 L170 178 Q180 177 180 185 Q180 193 170 192 L90 198"
              fill="none"
              stroke="#a1a1aa"
              strokeWidth="2.5"
              opacity={active === "canal" || hovered === "canal" ? 1 : 0.6}
              filter={active === "canal" || hovered === "canal" ? "url(#glow-canal)" : undefined}
              style={{ transition: "all 0.3s" }}
            />
            <text x="130" y="214" textAnchor="middle" fill="#a1a1aa" fontSize="9" fontWeight="700" opacity={active === "canal" || hovered === "canal" ? 1 : 0.5}>
              Ear Canal
            </text>

            {/* ── Tympanic Membrane ── */}
            <ellipse
              cx="185"
              cy="188"
              rx="6"
              ry="28"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="2.5"
              opacity={active === "tympanic" || hovered === "tympanic" ? 1 : 0.6}
              filter={active === "tympanic" || hovered === "tympanic" ? "url(#glow-tympanic)" : undefined}
              style={{ transition: "all 0.3s" }}
            />
            <GlowDot cx={185} cy={188} color="#60a5fa" intensity={active === "tympanic" || hovered === "tympanic" ? 1.5 : 0.4} />

            {/* ── Malleus ── */}
            <line x1="191" y1="180" x2="210" y2="172" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round"
              opacity={active === "malleus" || hovered === "malleus" ? 1 : 0.6}
              filter={active === "malleus" || hovered === "malleus" ? "url(#glow-malleus)" : undefined}
              style={{ transition: "all 0.3s" }}
            />
            <circle cx="210" cy="172" r="4" fill="#38bdf8" opacity={active === "malleus" || hovered === "malleus" ? 0.9 : 0.5} />

            {/* ── Incus ── */}
            <line x1="210" y1="172" x2="240" y2="180" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round"
              opacity={active === "incus" || hovered === "incus" ? 1 : 0.6}
              filter={active === "incus" || hovered === "incus" ? "url(#glow-incus)" : undefined}
              style={{ transition: "all 0.3s" }}
            />
            <circle cx="240" cy="180" r="4" fill="#22d3ee" opacity={active === "incus" || hovered === "incus" ? 0.9 : 0.5} />

            {/* ── Stapes ── */}
            <path
              d="M240 180 L258 175 M240 180 L258 185 M258 175 L258 185"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity={active === "stapes" || hovered === "stapes" ? 1 : 0.6}
              filter={active === "stapes" || hovered === "stapes" ? "url(#glow-stapes)" : undefined}
              style={{ transition: "all 0.3s" }}
            />
            <GlowDot cx={258} cy={180} color="#06b6d4" intensity={active === "stapes" || hovered === "stapes" ? 1.5 : 0.4} />

            {/* ── Cochlea (snail shape) ── */}
            <path
              d="M262 180 Q280 140 310 150 Q340 160 340 190 Q340 220 310 230 Q285 238 275 220 Q268 205 280 195 Q290 188 295 195 Q298 200 295 205"
              fill="none"
              stroke="#a78bfa"
              strokeWidth="2.5"
              opacity={active === "cochlea" || hovered === "cochlea" ? 1 : 0.6}
              filter={active === "cochlea" || hovered === "cochlea" ? "url(#glow-cochlea)" : undefined}
              style={{ transition: "all 0.3s" }}
            />
            <GlowDot cx={300} cy={190} color="#a78bfa" intensity={active === "cochlea" || hovered === "cochlea" ? 1.5 : 0.5} />
            {/* Cochlea label */}
            <text x="300" y="252" textAnchor="middle" fill="#a78bfa" fontSize="9" fontWeight="700" opacity={active === "cochlea" || hovered === "cochlea" ? 1 : 0.5}>
              Cochlea
            </text>

            {/* ── Cochlear Nerve ── */}
            <path
              d="M310 210 Q340 240 370 260 Q400 278 430 280"
              fill="none"
              stroke="#818cf8"
              strokeWidth="2.5"
              strokeDasharray="6 3"
              opacity={active === "cochlear-nerve" || hovered === "cochlear-nerve" ? 1 : 0.5}
              filter={active === "cochlear-nerve" || hovered === "cochlear-nerve" ? "url(#glow-cochlear-nerve)" : undefined}
              style={{ transition: "all 0.3s" }}
            >
              <animate attributeName="stroke-dashoffset" values="0;18" dur="2s" repeatCount="indefinite" />
            </path>
            <text x="400" y="270" textAnchor="middle" fill="#818cf8" fontSize="9" fontWeight="700" opacity={active === "cochlear-nerve" || hovered === "cochlear-nerve" ? 1 : 0.5}>
              → Brain
            </text>

            {/* ── Eustachian Tube ── */}
            <path
              d="M195 210 Q210 240 230 265 Q245 280 260 290"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="5 3"
              opacity={active === "eustachian" || hovered === "eustachian" ? 1 : 0.4}
              filter={active === "eustachian" || hovered === "eustachian" ? "url(#glow-eustachian)" : undefined}
              style={{ transition: "all 0.3s" }}
            />
            <text x="235" y="300" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="700" opacity={active === "eustachian" || hovered === "eustachian" ? 1 : 0.4}>
              Eustachian Tube
            </text>

            {/* Labels for ossicles */}
            <text x="210" y="162" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="700" opacity={active === "malleus" || hovered === "malleus" ? 1 : 0.4}>
              Malleus
            </text>
            <text x="225" y="196" textAnchor="middle" fill="#22d3ee" fontSize="8" fontWeight="700" opacity={active === "incus" || hovered === "incus" ? 1 : 0.4}>
              Incus
            </text>
            <text x="260" y="165" textAnchor="middle" fill="#06b6d4" fontSize="8" fontWeight="700" opacity={active === "stapes" || hovered === "stapes" ? 1 : 0.4}>
              Stapes
            </text>

            {/* Outer/Middle/Inner ear labels */}
            <text x="95" y="330" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="700" opacity={0.5}>
              OUTER EAR
            </text>
            <text x="215" y="330" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="700" opacity={0.5}>
              MIDDLE EAR
            </text>
            <text x="310" y="330" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="700" opacity={0.5}>
              INNER EAR
            </text>

            {/* Divider lines */}
            <line x1="170" y1="120" x2="170" y2="310" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" opacity={0.3} />
            <line x1="260" y1="120" x2="260" y2="310" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" opacity={0.3} />

            {/* Hit areas */}
            {PARTS.map((p) => {
              let cx: number;
              let cy: number;
              switch (p.id) {
                case "pinna": cx = 62; cy = 200; break;
                case "canal": cx = 135; cy = 188; break;
                case "tympanic": cx = 185; cy = 188; break;
                case "malleus": cx = 200; cy = 176; break;
                case "incus": cx = 225; cy = 176; break;
                case "stapes": cx = 250; cy = 180; break;
                case "cochlea": cx = 300; cy = 190; break;
                case "cochlear-nerve": cx = 370; cy = 260; break;
                case "eustachian": cx = 235; cy = 270; break;
                default: cx = 260; cy = 200;
              }
              return (
                <circle
                  key={`hit-${p.id}`}
                  cx={cx}
                  cy={cy}
                  r={22}
                  fill="transparent"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHovered(p.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setActive(active === p.id ? null : p.id)}
                />
              );
            })}
          </svg>
        </div>

        {/* Tooltip panel */}
        <div className="w-full lg:w-80 shrink-0">
          <AnimatePresence mode="wait">
            {activePart ? (
              <motion.div
                key={activePart.id}
                initial={{ opacity: 0, x: 20, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="glass-panel shine rounded-3xl p-6"
                style={{ boxShadow: `0 0 0 1px ${activePart.color}33, 0 0 40px ${activePart.color}15` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl" style={{ backgroundColor: activePart.color + "22", color: activePart.color }}>
                      <div className="size-4 rounded-full" style={{ backgroundColor: activePart.color }} />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold">{activePart.label}</h3>
                      <p className="text-xs font-semibold" style={{ color: activePart.color }}>{activePart.role}</p>
                    </div>
                  </div>
                  <button onClick={() => setActive(null)} className="flex size-7 items-center justify-center rounded-lg bg-white/10 text-muted-foreground transition-colors hover:bg-white/20" style={{ cursor: "pointer" }}>
                    ✕
                  </button>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{activePart.desc}</p>
              </motion.div>
            ) : (
              <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-panel shine rounded-3xl p-6 text-center">
                <p className="text-sm font-semibold text-muted-foreground">Click any part to learn about it</p>
                <p className="mt-1 text-xs text-muted-foreground">{PARTS.length} interactive parts · Hover to glow · Click to explore</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {PARTS.map((p) => (
          <button
            key={p.id}
            onClick={() => setActive(active === p.id ? null : p.id)}
            onMouseEnter={() => setHovered(p.id)}
            onMouseLeave={() => setHovered(null)}
            className="glass-chip flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition-all"
            style={{ color: p.color, borderColor: active === p.id ? p.color + "66" : undefined, backgroundColor: active === p.id ? p.color + "15" : undefined, cursor: "pointer" }}
          >
            <span className="size-2 rounded-full" style={{ backgroundColor: p.color }} />
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
