import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MitochondriaPart {
  id: string;
  label: string;
  color: string;
  desc: string;
}

const PARTS: MitochondriaPart[] = [
  {
    id: "outer-membrane",
    label: "Outer Membrane",
    color: "#4ade80",
    desc: "The smooth, phospholipid bilayer that encloses the entire organelle. Contains porins (voltage-dependent anion channels, VDACs) that allow molecules up to ~5 kDa to pass freely. Separates the mitochondrion from the cytoplasm.",
  },
  {
    id: "inner-membrane",
    label: "Inner Membrane",
    color: "#facc15",
    desc: "Highly folded into cristae to maximise surface area. Houses the Electron Transport Chain (Complexes I–IV) and ATP synthase (Complex V). Far less permeable than the outer membrane — most molecules need specific transporters. Cardiolipin-rich, making it exceptionally tight.",
  },
  {
    id: "cristae",
    label: "Cristae",
    color: "#fb923c",
    desc: "Deep folds of the inner membrane that dramatically increase surface area for ATP production. Cristae density correlates with metabolic activity — heart muscle cells have thousands. The electron transport chain and ATP synthase are embedded here, generating ~34 of the 36 ATP per glucose.",
  },
  {
    id: "matrix",
    label: "Matrix",
    color: "#a78bfa",
    desc: "The innermost compartment, enclosed by the inner membrane. Contains enzymes for the Krebs (TCA) cycle, pyruvate dehydrogenase complex, and fatty acid β-oxidation. Also houses mitochondrial DNA (16.5 kb circular, encodes 13 ETC subunits), tRNAs, and ribosomes (70S, like bacteria).",
  },
  {
    id: "intermembrane-space",
    label: "Intermembrane Space",
    color: "#22d3ee",
    desc: "The narrow gap between the outer and inner membranes. Protons (H⁺) are pumped here by the ETC, creating the electrochemical gradient that drives ATP synthase. Also contains cytochrome c — when released into the cytoplasm, it triggers apoptosis (programmed cell death).",
  },
  {
    id: "et-chain",
    label: "Electron Transport Chain",
    color: "#f472b6",
    desc: "Four protein complexes (I–IV) embedded in the inner membrane that transfer electrons from NADH and FADH₂ to O₂, pumping H⁺ into the intermembrane space. Complex I (NADH dehydrogenase), II (succinate dehydrogenase), III (cytochrome bc₁), IV (cytochrome c oxidase). The final electron acceptor is oxygen — this is why you breathe.",
  },
  {
    id: "atp-synthase",
    label: "ATP Synthase (Complex V)",
    color: "#34d399",
    desc: "A molecular turbine that uses the proton gradient (H⁺ flowing back through it) to catalyse ADP + Pi → ATP. Rotates at ~130 revolutions per second, producing ~100 ATP molecules per second per complex. One of the most elegant molecular machines in biology.",
  },
];

export function MitochondriaDiagram({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const part = PARTS.find((p) => p.id === active);

  return (
    <div className={className}>
      {/* SVG Diagram */}
      <div className="relative mx-auto w-full max-w-2xl">
        <svg
          viewBox="0 0 600 400"
          className="w-full drop-shadow-lg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Glow filters for each color */}
            <filter id="gGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="yGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="oGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="pGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="cGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="pinkGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="tealGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Radial gradient for matrix */}
            <radialGradient id="matrixGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.03" />
            </radialGradient>
          </defs>

          {/* Background pulse */}
          <ellipse
            cx="300"
            cy="200"
            rx="230"
            ry="130"
            fill="none"
            stroke="rgba(74,222,128,0.08)"
            strokeWidth="2"
          >
            <animate
              attributeName="rx"
              values="225;235;225"
              dur="4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="ry"
              values="125;135;125"
              dur="4s"
              repeatCount="indefinite"
            />
          </ellipse>

          {/* === OUTER MEMBRANE === */}
          <ellipse
            cx="300"
            cy="200"
            rx="220"
            ry="120"
            fill="none"
            stroke={hover === "outer-membrane" ? "#4ade80" : "rgba(74,222,128,0.5)"}
            strokeWidth={hover === "outer-membrane" ? 3.5 : 2.5}
            filter="url(#gGlow)"
            style={{ cursor: "pointer", transition: "stroke 0.3s, stroke-width 0.3s" }}
            onMouseEnter={() => setHover("outer-membrane")}
            onMouseLeave={() => setHover(null)}
            onClick={() => setActive(active === "outer-membrane" ? null : "outer-membrane")}
          />

          {/* === INTERMEMBRANE SPACE === */}
          <ellipse
            cx="300"
            cy="200"
            rx="195"
            ry="100"
            fill="none"
            stroke={hover === "intermembrane-space" ? "#22d3ee" : "rgba(34,211,238,0.3)"}
            strokeWidth={hover === "intermembrane-space" ? 3 : 1.5}
            strokeDasharray="8 4"
            filter="url(#tealGlow)"
            style={{ cursor: "pointer", transition: "stroke 0.3s, stroke-width 0.3s" }}
            onMouseEnter={() => setHover("intermembrane-space")}
            onMouseLeave={() => setHover(null)}
            onClick={() => setActive(active === "intermembrane-space" ? null : "intermembrane-space")}
          />

          {/* === INNER MEMBRANE === */}
          <ellipse
            cx="300"
            cy="200"
            rx="175"
            ry="85"
            fill="none"
            stroke={hover === "inner-membrane" ? "#facc15" : "rgba(250,204,21,0.5)"}
            strokeWidth={hover === "inner-membrane" ? 3.5 : 2.5}
            filter="url(#yGlow)"
            style={{ cursor: "pointer", transition: "stroke 0.3s, stroke-width 0.3s" }}
            onMouseEnter={() => setHover("inner-membrane")}
            onMouseLeave={() => setHover(null)}
            onClick={() => setActive(active === "inner-membrane" ? null : "inner-membrane")}
          />

          {/* === MATRIX (filled area) === */}
          <ellipse
            cx="300"
            cy="200"
            rx="165"
            ry="75"
            fill="url(#matrixGrad)"
            stroke={hover === "matrix" ? "#a78bfa" : "rgba(167,139,250,0.15)"}
            strokeWidth={hover === "matrix" ? 2.5 : 1}
            style={{ cursor: "pointer", transition: "stroke 0.3s" }}
            onMouseEnter={() => setHover("matrix")}
            onMouseLeave={() => setHover(null)}
            onClick={() => setActive(active === "matrix" ? null : "matrix")}
          />

          {/* === CRISTAE (folded inner membrane) === */}
          {/* Crista 1 - left */}
          <path
            d="M180 200 Q210 140, 240 200 Q210 260, 180 200"
            fill="none"
            stroke={hover === "cristae" ? "#fb923c" : "rgba(251,146,60,0.5)"}
            strokeWidth={hover === "cristae" ? 3 : 2}
            filter="url(#oGlow)"
            style={{ cursor: "pointer", transition: "stroke 0.3s, stroke-width 0.3s" }}
            onMouseEnter={() => setHover("cristae")}
            onMouseLeave={() => setHover(null)}
            onClick={() => setActive(active === "cristae" ? null : "cristae")}
          />
          {/* Crista 2 - center-left */}
          <path
            d="M260 200 Q290 130, 320 200 Q290 270, 260 200"
            fill="none"
            stroke={hover === "cristae" ? "#fb923c" : "rgba(251,146,60,0.5)"}
            strokeWidth={hover === "cristae" ? 3 : 2}
            filter="url(#oGlow)"
            style={{ cursor: "pointer", transition: "stroke 0.3s, stroke-width 0.3s" }}
            onMouseEnter={() => setHover("cristae")}
            onMouseLeave={() => setHover(null)}
            onClick={() => setActive(active === "cristae" ? null : "cristae")}
          />
          {/* Crista 3 - center-right */}
          <path
            d="M340 200 Q370 135, 400 200 Q370 265, 340 200"
            fill="none"
            stroke={hover === "cristae" ? "#fb923c" : "rgba(251,146,60,0.5)"}
            strokeWidth={hover === "cristae" ? 3 : 2}
            filter="url(#oGlow)"
            style={{ cursor: "pointer", transition: "stroke 0.3s, stroke-width 0.3s" }}
            onMouseEnter={() => setHover("cristae")}
            onMouseLeave={() => setHover(null)}
            onClick={() => setActive(active === "cristae" ? null : "cristae")}
          />
          {/* Crista 4 - right */}
          <path
            d="M410 200 Q440 145, 470 200 Q440 255, 410 200"
            fill="none"
            stroke={hover === "cristae" ? "#fb923c" : "rgba(251,146,60,0.5)"}
            strokeWidth={hover === "cristae" ? 3 : 2}
            filter="url(#oGlow)"
            style={{ cursor: "pointer", transition: "stroke 0.3s, stroke-width 0.3s" }}
            onMouseEnter={() => setHover("cristae")}
            onMouseLeave={() => setHover(null)}
            onClick={() => setActive(active === "cristae" ? null : "cristae")}
          />

          {/* === ELECTRON TRANSPORT CHAIN (dots along inner membrane) === */}
          {[195, 225, 255, 345, 375, 405].map((cx, i) => {
            const cy = 200 + (i % 2 === 0 ? -85 : 85) * (i < 3 ? 1 : 1);
            const ry2 = 85;
            const yPos = i < 3 ? 200 - ry2 + 12 : 200 + ry2 - 12;
            return (
              <g key={`etc-${i}`}>
                <circle
                  cx={cx}
                  cy={yPos}
                  r={hover === "et-chain" ? 6 : 4.5}
                  fill={hover === "et-chain" ? "#f472b6" : "rgba(244,114,182,0.7)"}
                  filter="url(#pinkGlow)"
                  style={{ cursor: "pointer", transition: "r 0.3s" }}
                  onMouseEnter={() => setHover("et-chain")}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => setActive(active === "et-chain" ? null : "et-chain")}
                />
                {/* Animated spark */}
                <circle r="2" fill="#f472b6" opacity="0.8">
                  <animateMotion
                    dur={`${1.5 + i * 0.3}s`}
                    repeatCount="indefinite"
                    path={
                      i < 3
                        ? `M${cx - 20},${yPos} Q${cx},${yPos - 12}, ${cx + 20},${yPos}`
                        : `M${cx - 20},${yPos} Q${cx},${yPos + 12}, ${cx + 20},${yPos}`
                    }
                  />
                </circle>
              </g>
            );
          })}

          {/* === ATP SYNTHASE (turquoise turbine shapes) === */}
          {[210, 300, 390].map((cx, i) => {
            const yPos = i === 1 ? 200 - 85 + 12 : 200 + 85 - 12;
            return (
              <g key={`atp-${i}`}>
                <polygon
                  points={`${cx - 7},${yPos - 5} ${cx + 7},${yPos - 5} ${cx + 4},${yPos + 5} ${cx - 4},${yPos + 5}`}
                  fill={hover === "atp-synthase" ? "#34d399" : "rgba(52,211,153,0.6)"}
                  stroke={hover === "atp-synthase" ? "#34d399" : "rgba(52,211,153,0.8)"}
                  strokeWidth="1"
                  filter="url(#cGlow)"
                  style={{ cursor: "pointer", transition: "fill 0.3s" }}
                  onMouseEnter={() => setHover("atp-synthase")}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => setActive(active === "atp-synthase" ? null : "atp-synthase")}
                />
                {/* Rotating ATP spark */}
                <circle r="1.5" fill="#34d399">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={`0 ${cx} ${yPos}`}
                    to={`360 ${cx} ${yPos}`}
                    dur="1.2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="cx"
                    values={`${cx - 6};${cx + 6};${cx - 6}`}
                    dur="1.2s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}

          {/* === DNA (small circle in matrix) === */}
          <circle
            cx="300"
            cy="215"
            r="8"
            fill="none"
            stroke="rgba(167,139,250,0.5)"
            strokeWidth="1.5"
            strokeDasharray="3 2"
          />
          <text
            x="300"
            y="218"
            textAnchor="middle"
            fill="rgba(167,139,250,0.6)"
            fontSize="6"
            fontFamily="monospace"
          >
            mtDNA
          </text>

          {/* === Energy flow animation (proton gradient) === */}
          {[0, 1, 2, 3, 4].map((i) => (
            <circle
              key={`proton-${i}`}
              r="2"
              fill="#facc15"
              opacity="0.7"
            >
              <animateMotion
                dur={`${2 + i * 0.4}s`}
                repeatCount="indefinite"
                begin={`${i * 0.5}s`}
                path="M300 115 L300 200"
              />
              <animate
                attributeName="opacity"
                values="0.2;0.8;0.2"
                dur={`${2 + i * 0.4}s`}
                repeatCount="indefinite"
                begin={`${i * 0.5}s`}
              />
            </circle>
          ))}

          {/* Labels */}
          <text x="300" y="68" textAnchor="middle" fill="#4ade80" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
            Outer Membrane
          </text>
          <text x="300" y="350" textAnchor="middle" fill="#facc15" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
            Inner Membrane
          </text>
          <text x="300" y="205" textAnchor="middle" fill="rgba(167,139,250,0.7)" fontSize="10" fontFamily="sans-serif">
            Matrix
          </text>
          <text x="130" y="200" textAnchor="middle" fill="#fb923c" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
            Cristae
          </text>
          <text x="480" y="200" textAnchor="middle" fill="#f472b6" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
            ETC
          </text>
        </svg>

        {/* Tooltip panel */}
        <AnimatePresence>
          {part && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="absolute right-0 top-0 z-10 w-72 rounded-2xl border border-white/15 p-4 sm:w-80"
              style={{
                background:
                  "linear-gradient(135deg, rgba(15,15,30,0.92), rgba(20,20,40,0.88))",
                backdropFilter: "blur(20px)",
                boxShadow: `0 0 25px ${part.color}33, 0 8px 32px rgba(0,0,0,0.4)`,
              }}
            >
              <div className="mb-2 flex items-center justify-between">
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider"
                  style={{ backgroundColor: part.color + "22", color: part.color }}
                >
                  {part.label}
                </span>
                <button
                  onClick={() => setActive(null)}
                  className="text-muted-foreground hover:text-white transition-colors text-sm"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm leading-6 text-white/80">{part.desc}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {PARTS.map((p) => (
          <button
            key={p.id}
            onClick={() => setActive(active === p.id ? null : p.id)}
            onMouseEnter={() => setHover(p.id)}
            onMouseLeave={() => setHover(null)}
            className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all hover:scale-105"
            style={{
              borderColor: active === p.id ? p.color : "rgba(255,255,255,0.1)",
              color: active === p.id ? p.color : "rgba(255,255,255,0.6)",
              backgroundColor: active === p.id ? p.color + "15" : "transparent",
            }}
          >
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
