import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Organelle {
  id: string;
  label: string;
  role: string;
  desc: string;
  color: string;
}

const ORGANELLES: Organelle[] = [
  {
    id: "nucleus",
    label: "Nucleus",
    role: "Control centre — stores DNA",
    desc: "The largest organelle, enclosed by a double membrane (nuclear envelope) with nuclear pores. Houses the cell's genetic material (DNA) organised into chromosomes. The nucleolus inside produces ribosomal RNA. During mitosis, the nuclear envelope breaks down so chromosomes can separate.",
    color: "#a78bfa",
  },
  {
    id: "mitochondria",
    label: "Mitochondria",
    role: "Powerhouse — produces ATP",
    desc: "Double-membraned organelles that generate ~90% of the cell's ATP through oxidative phosphorylation. The inner membrane folds into cristae to maximise surface area for the electron transport chain. They have their own DNA (mtDNA) inherited maternally — evidence for the endosymbiotic theory.",
    color: "#22d3ee",
  },
  {
    id: "er",
    label: "Endoplasmic Reticulum",
    role: "Protein & lipid factory",
    desc: "A vast membrane network continuous with the nuclear envelope. Rough ER (studded with ribosomes) synthesises and folds secretory and membrane proteins. Smooth ER detoxifies drugs, stores Ca²⁺, and synthesises lipids and steroids. In liver cells, smooth ER can comprise over half the membrane.",
    color: "#34d399",
  },
  {
    id: "ribosomes",
    label: "Ribosomes",
    role: "Protein synthesis machines",
    desc: "Tiny ribonucleoprotein complexes (20–30 nm) that translate mRNA into polypeptide chains. Free ribosomes make cytoplasmic proteins; bound ribosomes (on rough ER) make membrane, secretory, and lysosomal proteins. Each ribosome has a large and small subunit that clamp around the mRNA.",
    color: "#fbbf24",
  },
  {
    id: "golgi",
    label: "Golgi Apparatus",
    role: "Post office — modifies & ships proteins",
    desc: "A stack of flattened membrane sacs (cisternae) that receives proteins from the ER, modifies them (glycosylation, phosphorylation), sorts them, and packages them into vesicles for delivery to the plasma membrane, lysosomes, or secretion. The cis face receives; the trans face ships.",
    color: "#f472b6",
  },
  {
    id: "lysosome",
    label: "Lysosomes",
    role: "Recycling centre — digestion",
    desc: "Membrane-bound vesicles containing ~60 hydrolytic enzymes (proteases, lipases, nucleases) active at pH ~5. They digest endocytosed material, worn-out organelles (autophagy), and invading pathogens. Defects cause lysosomal storage diseases (e.g., Tay-Sachs, Gaucher's).",
    color: "#ef4444",
  },
  {
    id: "membrane",
    label: "Cell Membrane",
    role: "Selective barrier — phospholipid bilayer",
    desc: "A 7–8 nm phospholipid bilayer embedded with proteins (integral, peripheral), cholesterol, and glycolipids. The fluid mosaic model describes its dynamic structure. It controls what enters and leaves (selective permeability), houses receptors for cell signalling, and maintains the electrochemical gradient.",
    color: "#60a5fa",
  },
  {
    id: "centrosome",
    label: "Centrosome",
    role: "Microtubule organiser — mitosis spindle",
    desc: "A pair of centrioles (barrel-shaped microtubule arrays) surrounded by pericentriolar material. During mitosis, the centrosomes duplicate and migrate to opposite poles, nucleating the mitotic spindle that pulls chromosomes apart. Animal cells have centrosomes; plant cells do not.",
    color: "#c084fc",
  },
];

function GlowDot({ cx, cy, color, intensity }: { cx: number; cy: number; color: string; intensity: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={4 * intensity} fill={color} opacity={0.3 * intensity}>
        <animate attributeName="r" values={`${3 * intensity};${6 * intensity};${3 * intensity}`} dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx={cx} cy={cy} r={8 * intensity} fill={color} opacity={0.1 * intensity}>
        <animate attributeName="r" values={`${6 * intensity};${10 * intensity};${6 * intensity}`} dur="3s" repeatCount="indefinite" />
      </circle>
    </>
  );
}

function ChromosomeAnimation({ active }: { active: boolean }) {
  return (
    <g opacity={active ? 0.9 : 0.4}>
      {/* Left chromosome pair */}
      <g>
        <path d="M230 195 Q225 185 230 175 Q235 185 230 195" fill="none" stroke="#a78bfa" strokeWidth="2.5" opacity={0.8}>
          <animate attributeName="d" values="M230 195 Q225 185 230 175 Q235 185 230 195;M230 195 Q222 182 225 172 Q228 182 230 195;M230 195 Q225 185 230 175 Q235 185 230 195" dur="4s" repeatCount="indefinite" />
        </path>
        <line x1="230" y1="185" x2="230" y2="185" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="2 2">
          <animate attributeName="y2" values="185;180;185" dur="4s" repeatCount="indefinite" />
        </line>
      </g>
      {/* Right chromosome pair */}
      <g>
        <path d="M260 195 Q255 185 260 175 Q265 185 260 195" fill="none" stroke="#a78bfa" strokeWidth="2.5" opacity={0.8}>
          <animate attributeName="d" values="M260 195 Q255 185 260 175 Q265 185 260 195;M260 195 Q252 182 255 172 Q258 182 260 195;M260 195 Q255 185 260 175 Q265 185 260 195" dur="4s" repeatCount="indefinite" />
        </path>
        <line x1="260" y1="185" x2="260" y2="185" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="2 2">
          <animate attributeName="y2" values="185;180;185" dur="4s" repeatCount="indefinite" />
        </line>
      </g>
      {/* Spindle fibers */}
      <line x1="195" y1="200" x2="235" y2="188" stroke="#c084fc" strokeWidth="0.8" strokeDasharray="3 3" opacity={0.4}>
        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite" />
      </line>
      <line x1="295" y1="200" x2="255" y2="188" stroke="#c084fc" strokeWidth="0.8" strokeDasharray="3 3" opacity={0.4}>
        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite" />
      </line>
    </g>
  );
}

export function CellDiagram() {
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const activePart = ORGANELLES.find((o) => o.id === active);

  return (
    <div className="relative w-full">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-8">
        {/* SVG Diagram */}
        <div className="flex-1">
          <svg viewBox="0 0 520 420" className="w-full max-w-lg mx-auto" style={{ filter: "drop-shadow(0 0 30px rgba(34, 211, 238, 0.12))" }}>
            <defs>
              {ORGANELLES.map((o) => (
                <filter key={`glow-${o.id}`} id={`glow-${o.id}`} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation={active === o.id || hovered === o.id ? 8 : 3} result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              ))}
            </defs>

            {/* Title */}
            <text x="260" y="28" textAnchor="middle" fill="#22d3ee" fontSize="13" fontWeight="800" letterSpacing="0.15em" opacity={0.6}>
              ANIMAL CELL
            </text>

            {/* ── Cell Membrane (outer boundary) ── */}
            <ellipse
              cx="260" cy="220" rx="195" ry="170"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="3"
              strokeDasharray="8 4"
              opacity={active === "membrane" || hovered === "membrane" ? 1 : 0.5}
              filter={active === "membrane" || hovered === "membrane" ? "url(#glow-membrane)" : undefined}
              style={{ transition: "all 0.3s" }}
            />
            <ellipse cx="260" cy="220" rx="185" ry="160" fill="none" stroke="#60a5fa" strokeWidth="1" opacity={0.2} />
            <text x="260" y="400" textAnchor="middle" fill="#60a5fa" fontSize="9" fontWeight="700" opacity={active === "membrane" || hovered === "membrane" ? 1 : 0.4}>
              Cell Membrane
            </text>

            {/* ── Cytoplasm glow ── */}
            <ellipse cx="260" cy="220" rx="180" ry="155" fill="url(#cytoGrad)" opacity={0.08} />
            <defs>
              <radialGradient id="cytoGrad" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
              </radialGradient>
            </defs>

            {/* ── Nucleus ── */}
            <ellipse
              cx="260" cy="210" rx="55" ry="48"
              fill="none"
              stroke="#a78bfa"
              strokeWidth="2.5"
              opacity={active === "nucleus" || hovered === "nucleus" ? 1 : 0.6}
              filter={active === "nucleus" || hovered === "nucleus" ? "url(#glow-nucleus)" : undefined}
              style={{ transition: "all 0.3s" }}
            />
            <ellipse cx="260" cy="210" rx="45" ry="38" fill="none" stroke="#a78bfa" strokeWidth="1" opacity={0.3} strokeDasharray="3 3" />
            {/* Nucleolus */}
            <circle cx="268" cy="205" r="12" fill="none" stroke="#c084fc" strokeWidth="2" opacity={active === "nucleus" || hovered === "nucleus" ? 0.8 : 0.4} />
            <GlowDot cx={268} cy={205} color="#c084fc" intensity={active === "nucleus" || hovered === "nucleus" ? 1.5 : 0.3} />
            {/* Nuclear pores */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              const px = 260 + 55 * Math.cos(rad);
              const py = 210 + 48 * Math.sin(rad);
              return <circle key={angle} cx={px} cy={py} r="2" fill="#a78bfa" opacity={0.5} />;
            })}
            <text x="260" y="168" textAnchor="middle" fill="#a78bfa" fontSize="9" fontWeight="700" opacity={active === "nucleus" || hovered === "nucleus" ? 1 : 0.5}>
              Nucleus
            </text>
            <ChromosomeAnimation active={active === "nucleus" || hovered === "nucleus"} />

            {/* ── Mitochondria (3 instances) ── */}
            {[
              { cx: 160, cy: 180, rx: 28, ry: 14, rot: -20 },
              { cx: 370, cy: 250, rx: 25, ry: 12, rot: 15 },
              { cx: 200, cy: 310, rx: 22, ry: 11, rot: -10 },
            ].map((m, i) => (
              <g key={`mito-${i}`}>
                <ellipse
                  cx={m.cx} cy={m.cy} rx={m.rx} ry={m.ry}
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2"
                  transform={`rotate(${m.rot} ${m.cx} ${m.cy})`}
                  opacity={active === "mitochondria" || hovered === "mitochondria" ? 1 : 0.6}
                  filter={active === "mitochondria" || hovered === "mitochondria" ? "url(#glow-mitochondria)" : undefined}
                  style={{ transition: "all 0.3s" }}
                />
                {/* Cristae folds */}
                <path
                  d={`M${m.cx - m.rx * 0.5} ${m.cy} Q${m.cx} ${m.cy - m.ry * 0.6} ${m.cx + m.rx * 0.5} ${m.cy}`}
                  fill="none" stroke="#22d3ee" strokeWidth="1" opacity={0.3}
                  transform={`rotate(${m.rot} ${m.cx} ${m.cy})`}
                />
                <path
                  d={`M${m.cx - m.rx * 0.3} ${m.cy + 2} Q${m.cx} ${m.cy + m.ry * 0.5} ${m.cx + m.rx * 0.3} ${m.cy + 2}`}
                  fill="none" stroke="#22d3ee" strokeWidth="1" opacity={0.3}
                  transform={`rotate(${m.rot} ${m.cx} ${m.cy})`}
                />
                <GlowDot cx={m.cx} cy={m.cy} color="#22d3ee" intensity={active === "mitochondria" || hovered === "mitochondria" ? 1 : 0.3} />
              </g>
            ))}
            <text x="160" y="158" textAnchor="middle" fill="#22d3ee" fontSize="9" fontWeight="700" opacity={active === "mitochondria" || hovered === "mitochondria" ? 1 : 0.5}>
              Mitochondria
            </text>

            {/* ── Endoplasmic Reticulum (rough + smooth) ── */}
            <g>
              {/* Rough ER — left side, near nucleus */}
              <path
                d="M200 165 Q190 170 185 185 Q180 200 185 215 Q190 230 200 235"
                fill="none" stroke="#34d399" strokeWidth="2"
                opacity={active === "er" || hovered === "er" ? 1 : 0.5}
                filter={active === "er" || hovered === "er" ? "url(#glow-er)" : undefined}
                style={{ transition: "all 0.3s" }}
              />
              <path
                d="M205 160 Q195 165 190 180 Q185 195 190 210 Q195 225 205 230"
                fill="none" stroke="#34d399" strokeWidth="1.5" opacity={0.4}
              />
              {/* Ribosomes on rough ER */}
              {[170, 180, 190, 200, 210, 220].map((y) => (
                <circle key={`rer-${y}`} cx={188 + (y < 190 ? -3 : 3)} cy={y} r="2" fill="#fbbf24" opacity={0.6} />
              ))}
              {/* Smooth ER — right side */}
              <path
                d="M315 180 Q325 190 320 205 Q315 220 325 230 Q335 240 330 250"
                fill="none" stroke="#34d399" strokeWidth="1.5" opacity={0.4}
                strokeDasharray="4 3"
              />
            </g>
            <text x="175" y="250" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="700" opacity={active === "er" || hovered === "er" ? 1 : 0.5}>
              ER
            </text>

            {/* ── Ribosomes (scattered) ── */}
            {[
              [215, 150], [245, 145], [290, 160], [310, 175],
              [340, 200], [350, 280], [320, 330], [230, 340],
              [170, 280], [150, 230], [380, 300], [395, 220],
            ].map(([x, y], i) => (
              <circle key={`ribo-${i}`} cx={x} cy={y} r="3" fill="#fbbf24"
                opacity={active === "ribosomes" || hovered === "ribosomes" ? 0.9 : 0.4}
                filter={active === "ribosomes" || hovered === "ribosomes" ? "url(#glow-ribosomes)" : undefined}
                style={{ transition: "all 0.3s" }}
              />
            ))}
            <text x="395" y="198" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="700" opacity={active === "ribosomes" || hovered === "ribosomes" ? 1 : 0.5}>
              Ribosomes
            </text>

            {/* ── Golgi Apparatus (right side) ── */}
            <g>
              {[0, 1, 2, 3, 4].map((i) => (
                <path
                  key={`golgi-${i}`}
                  d={`M${330 + i * 2} ${265 + i * 8} Q${345 + i * 2} ${260 + i * 8} ${360 + i * 2} ${265 + i * 8}`}
                  fill="none"
                  stroke="#f472b6"
                  strokeWidth={2 - i * 0.2}
                  opacity={active === "golgi" || hovered === "golgi" ? 0.9 - i * 0.1 : 0.4 - i * 0.05}
                  filter={active === "golgi" || hovered === "golgi" ? "url(#glow-golgi)" : undefined}
                  style={{ transition: "all 0.3s" }}
                />
              ))}
              {/* Vesicles budding off */}
              <circle cx="375" cy="275" r="4" fill="none" stroke="#f472b6" strokeWidth="1.5" opacity={0.5}>
                <animate attributeName="cx" values="375;380;375" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="380" cy="290" r="3" fill="none" stroke="#f472b6" strokeWidth="1" opacity={0.4}>
                <animate attributeName="cy" values="290;296;290" dur="4s" repeatCount="indefinite" />
              </circle>
            </g>
            <text x="355" y="255" textAnchor="middle" fill="#f472b6" fontSize="9" fontWeight="700" opacity={active === "golgi" || hovered === "golgi" ? 1 : 0.5}>
              Golgi
            </text>

            {/* ── Lysosomes ── */}
            {[
              { cx: 150, cy: 320, r: 10 },
              { cx: 380, cy: 170, r: 8 },
              { cx: 340, cy: 350, r: 9 },
            ].map((l, i) => (
              <g key={`lyso-${i}`}>
                <circle
                  cx={l.cx} cy={l.cy} r={l.r}
                  fill="none" stroke="#ef4444" strokeWidth="2"
                  opacity={active === "lysosome" || hovered === "lysosome" ? 1 : 0.5}
                  filter={active === "lysosome" || hovered === "lysosome" ? "url(#glow-lysosome)" : undefined}
                  style={{ transition: "all 0.3s" }}
                />
                <circle cx={l.cx} cy={l.cy} r={l.r * 0.5} fill="#ef4444" opacity={0.15} />
                <GlowDot cx={l.cx} cy={l.cy} color="#ef4444" intensity={active === "lysosome" || hovered === "lysosome" ? 1 : 0.3} />
              </g>
            ))}
            <text x="150" y="342" textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="700" opacity={active === "lysosome" || hovered === "lysosome" ? 1 : 0.5}>
              Lysosomes
            </text>

            {/* ── Centrosome (top) ── */}
            <g>
              <circle cx="260" cy="140" r="10" fill="none" stroke="#c084fc" strokeWidth="2"
                opacity={active === "centrosome" || hovered === "centrosome" ? 1 : 0.5}
                filter={active === "centrosome" || hovered === "centrosome" ? "url(#glow-centrosome)" : undefined}
                style={{ transition: "all 0.3s" }}
              />
              {/* Centriole pair */}
              <rect x="255" y="135" width="4" height="10" rx="1" fill="#c084fc" opacity={0.6} transform="rotate(15 257 140)" />
              <rect x="261" y="135" width="4" height="10" rx="1" fill="#c084fc" opacity={0.6} transform="rotate(-15 263 140)" />
              {/* Radiating microtubules */}
              {[0, 60, 120, 180, 240, 300].map((angle) => {
                const rad = (angle * Math.PI) / 180;
                const x2 = 260 + 22 * Math.cos(rad);
                const y2 = 140 + 22 * Math.sin(rad);
                return (
                  <line key={`cent-${angle}`} x1="260" y1="140" x2={x2} y2={y2}
                    stroke="#c084fc" strokeWidth="0.8" strokeDasharray="2 2" opacity={0.3}>
                    <animate attributeName="opacity" values="0.15;0.5;0.15" dur="2s" repeatCount="indefinite" />
                  </line>
                );
              })}
            </g>
            <text x="260" y="120" textAnchor="middle" fill="#c084fc" fontSize="9" fontWeight="700" opacity={active === "centrosome" || hovered === "centrosome" ? 1 : 0.5}>
              Centrosome
            </text>

            {/* Hit areas for organelles */}
            {[
              { id: "nucleus", cx: 260, cy: 210, r: 45 },
              { id: "mitochondria", cx: 160, cy: 180, r: 25 },
              { id: "er", cx: 195, cy: 200, r: 25 },
              { id: "ribosomes", cx: 300, cy: 180, r: 30 },
              { id: "golgi", cx: 350, cy: 280, r: 25 },
              { id: "lysosome", cx: 150, cy: 320, r: 15 },
              { id: "membrane", cx: 400, cy: 220, r: 30 },
              { id: "centrosome", cx: 260, cy: 140, r: 15 },
            ].map((h) => (
              <circle
                key={`hit-${h.id}`}
                cx={h.cx} cy={h.cy} r={h.r}
                fill="transparent"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovered(h.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setActive(active === h.id ? null : h.id)}
              />
            ))}
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
                <p className="text-sm font-semibold text-muted-foreground">Click any organelle to learn about it</p>
                <p className="mt-1 text-xs text-muted-foreground">{ORGANELLES.length} interactive organelles · Hover to glow · Click to explore</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {ORGANELLES.map((o) => (
          <button
            key={o.id}
            onClick={() => setActive(active === o.id ? null : o.id)}
            onMouseEnter={() => setHovered(o.id)}
            onMouseLeave={() => setHovered(null)}
            className="glass-chip flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition-all"
            style={{ color: o.color, borderColor: active === o.id ? o.color + "66" : undefined, backgroundColor: active === o.id ? o.color + "15" : undefined, cursor: "pointer" }}
          >
            <span className="size-2 rounded-full" style={{ backgroundColor: o.color }} />
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
