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
    id: "kidney",
    label: "Kidney",
    role: "Filtration organ",
    desc: "Bean-shaped organ that filters ~180L of blood daily, producing 1-2L of urine. Contains ~1 million nephrons. The right kidney sits slightly lower due to the liver above it.",
    color: "#f472b6",
  },
  {
    id: "glomerulus",
    label: "Glomerulus",
    role: "Blood filter",
    desc: "A ball of capillaries where blood is filtered under high pressure. The fenestrated endothelium + basement membrane + podocytes form a 3-layer sieve that lets water, ions, and small molecules through while retaining cells and large proteins.",
    color: "#ef4444",
  },
  {
    id: "bowmans",
    label: "Bowman's Capsule",
    role: "Filtrate collector",
    desc: "A cup-shaped sac that surrounds the glomerulus and collects the filtrate (water, glucose, amino acids, urea, ions). This is where the renal corpuscle begins — the first step of urine formation.",
    color: "#22d3ee",
  },
  {
    id: "proximal",
    label: "Proximal Convoluted Tubule",
    role: "Major reabsorption site",
    desc: "Reabsorbs ~65% of filtered water, all glucose and amino acids, and most Na⁺/K⁺/Cl⁻ via active transport. Its brush border (microvilli) maximizes surface area — the busiest nephron segment.",
    color: "#10b981",
  },
  {
    id: "loop",
    label: "Loop of Henle",
    role: "Concentration gradient builder",
    desc: "U-shaped loop with a thin descending limb (water-permeable) and a thick ascending limb (impermeable to water, actively pumps Na⁺/K⁺/2Cl⁻). Creates the osmotic gradient in the medulla that allows concentrated urine.",
    color: "#a3e635",
  },
  {
    id: "distal",
    label: "Distal Convoluted Tubule",
    role: "Fine-tuning site",
    desc: "Fine-tunes reabsorption under hormonal control: Aldosterone increases Na⁺ reabsorption / K⁺ secretion. PTH increases Ca²⁺ reabsorption. Also contains the macula densa that senses NaCl and regulates GFR via tubuloglomerular feedback.",
    color: "#06b6d4",
  },
  {
    id: "collecting",
    label: "Collecting Duct",
    role: "Final concentration",
    desc: "Receives filtrate from multiple nephrons. ADH (vasopressin) inserts aquaporin-2 channels here to reabsorb water — producing concentrated urine. Without ADH, dilute urine is excreted. 'C3,4,5 keeps you alive' — but ADH keeps you concentrated.",
    color: "#8b5cf6",
  },
  {
    id: "artery",
    label: "Renal Artery/Vein",
    role: "Blood supply",
    desc: "The renal artery supplies 20-25% of cardiac output (~1.2L/min). Blood enters via segmental → interlobar → arcuate → interlobular arteries → afferent arterioles → glomerulus → efferent arterioles → peritubular capillaries → renal vein.",
    color: "#dc2626",
  },
];

const PARTNER_MAP: Record<string, string[]> = {
  glomerulus: ["bowmans", "artery"],
  bowmans: ["glomerulus", "proximal"],
  proximal: ["bowmans", "loop"],
  loop: ["proximal", "distal"],
  distal: ["loop", "collecting"],
  collecting: ["distal"],
  kidney: ["glomerulus", "bowmans", "proximal", "loop", "distal", "collecting", "artery"],
  artery: ["glomerulus"],
};

export default function KidneyDiagram() {
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const lit = new Set<string>();
  const current = active || hovered;
  if (current) {
    lit.add(current);
    (PARTNER_MAP[current] || []).forEach((p) => lit.add(p));
  }

  const isLit = (id: string) => lit.has(id);

  return (
    <div className="relative w-full flex flex-col items-center gap-3">
      <svg
        viewBox="0 0 520 540"
        className="w-full max-w-[520px]"
        style={{ filter: "drop-shadow(0 0 20px rgba(34,211,238,0.15))" }}
      >
        <defs>
          <filter id="kidney-haze">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" seed="40">
              <animate attributeName="seed" from="40" to="80" dur="8s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="2.5" />
          </filter>
          <filter id="kidney-glow">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="kidney-bg" cx="50%" cy="45%">
            <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0f0a1e" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="520" height="540" fill="url(#kidney-bg)" />

        {/* Energy ring */}
        <circle cx="260" cy="260" r="240" fill="none" stroke="#22d3ee" strokeWidth="0.6" strokeDasharray="4 8" opacity="0.2">
          <animateTransform attributeName="transform" type="rotate" from="0 260 260" to="360 260 260" dur="30s" repeatCount="indefinite" />
        </circle>
        <circle cx="260" cy="260" r="255" fill="none" stroke="#10b981" strokeWidth="0.4" strokeDasharray="2 12" opacity="0.15">
          <animateTransform attributeName="transform" type="rotate" from="360 260 260" to="0 260 260" dur="40s" repeatCount="indefinite" />
        </circle>

        {/* Ambient glow orbs */}
        <circle cx="140" cy="180" r="35" fill="#22d3ee" opacity="0.06">
          <animate attributeName="opacity" values="0.04;0.08;0.04" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="380" cy="340" r="28" fill="#10b981" opacity="0.05">
          <animate attributeName="opacity" values="0.03;0.07;0.03" dur="5s" repeatCount="indefinite" />
        </circle>

        <g filter="url(#kidney-haze)">
          {/* ===== KIDNEY OUTLINE ===== */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHovered("kidney")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(active === "kidney" ? null : "kidney")}
          >
            <ellipse
              cx="260" cy="240" rx="115" ry="155"
              fill="none"
              stroke={isLit("kidney") ? "#f472b6" : "#f472b644"}
              strokeWidth={isLit("kidney") ? 3.5 : 2}
              filter={isLit("kidney") ? "url(#kidney-glow)" : undefined}
            >
              <animate attributeName="rx" values="115;116;115" dur="4s" repeatCount="indefinite" />
            </ellipse>
            {/* Kidney hilum indentation */}
            <path d="M 145 230 Q 155 240 145 250" fill="none" stroke={isLit("kidney") ? "#f472b6" : "#f472b666"} strokeWidth="2" />
            {/* Cortex region */}
            <ellipse cx="260" cy="240" rx="95" ry="135" fill="none" stroke="#f472b611" strokeWidth="1" strokeDasharray="3 5" />
            {/* Medullary pyramids */}
            {[190, 260, 330].map((cx, i) => (
              <path
                key={`pyr-${i}`}
                d={`M ${cx - 18} 310 L ${cx} 280 L ${cx + 18} 310 Z`}
                fill="none"
                stroke="#f472b622"
                strokeWidth="1"
              />
            ))}
            <text x="260" y="160" textAnchor="middle" fill="#f472b6" fontSize="11" fontWeight="bold" opacity="0.7">KIDNEY</text>
          </g>

          {/* ===== RENAL ARTERY & VEIN ===== */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHovered("artery")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(active === "artery" ? null : "artery")}
          >
            {/* Renal artery */}
            <path
              d="M 50 225 Q 90 220 130 225 Q 140 226 145 230"
              fill="none"
              stroke={isLit("artery") ? "#ef4444" : "#ef444466"}
              strokeWidth={isLit("artery") ? 5 : 3.5}
              filter={isLit("artery") ? "url(#kidney-glow)" : undefined}
            >
              <animate attributeName="strokeOpacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
            </path>
            {/* Flow dashes - artery */}
            {[0, 0.25, 0.5, 0.75].map((o, i) => (
              <circle key={`af-${i}`} r="2" fill="#ef4444" opacity="0.8">
                <animateMotion dur="1.5s" begin={`${o * 1.5}s`} repeatCount="indefinite" path="M 50 225 Q 90 220 130 225 Q 140 226 145 230" />
              </circle>
            ))}
            {/* Renal vein */}
            <path
              d="M 50 245 Q 90 250 130 245 Q 140 244 145 250"
              fill="none"
              stroke={isLit("artery") ? "#3b82f6" : "#3b82f666"}
              strokeWidth={isLit("artery") ? 5 : 3.5}
              filter={isLit("artery") ? "url(#kidney-glow)" : undefined}
            >
              <animate attributeName="strokeOpacity" values="0.5;0.9;0.5" dur="2.2s" repeatCount="indefinite" />
            </path>
            {/* Flow dashes - vein */}
            {[0, 0.33, 0.66].map((o, i) => (
              <circle key={`vf-${i}`} r="2" fill="#3b82f6" opacity="0.7">
                <animateMotion dur="1.8s" begin={`${o * 1.8}s`} repeatCount="indefinite" path="M 145 250 Q 140 244 130 245 Q 90 250 50 245" />
              </circle>
            ))}
            <text x="35" y="218" fill="#ef4444" fontSize="9" fontWeight="bold" opacity="0.7">ARTERY</text>
            <text x="35" y="262" fill="#3b82f6" fontSize="9" fontWeight="bold" opacity="0.7">VEIN</text>
          </g>

          {/* ===== NEPHRON STRUCTURE (zoomed inside kidney) ===== */}
          {/* Tubule path drawing: glomerulus → Bowman's → PCT → Loop → DCT → Collecting duct */}

          {/* Collecting Duct (vertical, right side) */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHovered("collecting")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(active === "collecting" ? null : "collecting")}
          >
            <path
              d="M 345 195 L 345 400"
              fill="none"
              stroke={isLit("collecting") ? "#8b5cf6" : "#8b5cf644"}
              strokeWidth={isLit("collecting") ? 9 : 6}
              strokeLinecap="round"
              filter={isLit("collecting") ? "url(#kidney-glow)" : undefined}
            >
              <animate attributeName="strokeOpacity" values="0.5;0.9;0.5" dur="3s" repeatCount="indefinite" />
            </path>
            {/* Flow in collecting duct */}
            {[0, 0.2, 0.4, 0.6, 0.8].map((o, i) => (
              <circle key={`cd-${i}`} r="2.5" fill="#8b5cf6" opacity="0.7">
                <animateMotion dur="3s" begin={`${o * 3}s`} repeatCount="indefinite" path="M 345 195 L 345 400" />
              </circle>
            ))}
            <text x="365" y="300" fill="#8b5cf6" fontSize="9" fontWeight="bold" opacity="0.7">COLLECTING</text>
            <text x="365" y="312" fill="#8b5cf6" fontSize="9" fontWeight="bold" opacity="0.7">DUCT</text>
          </g>

          {/* Glomerulus → Bowman's Capsule */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHovered("glomerulus")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(active === "glomerulus" ? null : "glomerulus")}
          >
            {/* Bowman's capsule */}
            <circle
              cx="240" cy="210" r="28"
              fill="none"
              stroke={isLit("bowmans") ? "#22d3ee" : isLit("glomerulus") ? "#22d3ee88" : "#22d3ee33"}
              strokeWidth={isLit("bowmans") ? 3 : 2}
              filter={isLit("bowmans") ? "url(#kidney-glow)" : undefined}
              className="cursor-pointer"
              onMouseEnter={() => setHovered("bowmans")}
              onMouseLeave={() => setHovered(null)}
              onClick={(e) => { e.stopPropagation(); setActive(active === "bowmans" ? null : "bowmans"); }}
            />
            {/* Afferent arteriole in */}
            <path d="M 180 200 Q 200 205 215 208" fill="none" stroke="#ef444488" strokeWidth="2" />
            <path d="M 180 220 Q 200 215 215 212" fill="none" stroke="#3b82f688" strokeWidth="2" />
            {/* Glomerular capillary tuft */}
            <circle
              cx="240" cy="210" r="16"
              fill={isLit("glomerulus") ? "#ef444422" : "none"}
              stroke={isLit("glomerulus") ? "#ef4444" : "#ef444466"}
              strokeWidth={isLit("glomerulus") ? 3 : 2}
              filter={isLit("glomerulus") ? "url(#kidney-glow)" : undefined}
            />
            {/* Capillary loops */}
            <path d="M 232 202 Q 228 208 233 214 Q 238 208 232 202" fill="none" stroke={isLit("glomerulus") ? "#ef4444" : "#ef444466"} strokeWidth="1.5" />
            <path d="M 240 198 Q 237 205 240 212 Q 243 205 240 198" fill="none" stroke={isLit("glomerulus") ? "#ef4444" : "#ef444466"} strokeWidth="1.5" />
            <path d="M 248 202 Q 252 208 247 214 Q 242 208 248 202" fill="none" stroke={isLit("glomerulus") ? "#ef4444" : "#ef444466"} strokeWidth="1.5" />
            {/* Podocyte spikes on capsule */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              const x1 = 240 + Math.cos(angle) * 22;
              const y1 = 210 + Math.sin(angle) * 22;
              const x2 = 240 + Math.cos(angle) * 28;
              const y2 = 210 + Math.sin(angle) * 28;
              return <line key={`pod-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#22d3ee44" strokeWidth="0.8" />;
            })}
            <text x="240" y="182" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="bold">GLOMERULUS</text>
          </g>

          {/* Bowman's label (clickable on the circle already, add label) */}
          <text
            x="240" y="252"
            textAnchor="middle"
            fill="#22d3ee"
            fontSize="8"
            fontWeight="bold"
            className="cursor-pointer"
            onMouseEnter={() => setHovered("bowmans")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(active === "bowmans" ? null : "bowmans")}
          >
            BOWMAN&apos;S
          </text>

          {/* Proximal Convoluted Tubule */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHovered("proximal")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(active === "proximal" ? null : "proximal")}
          >
            <path
              d="M 255 235 Q 275 250 265 270 Q 255 285 270 295 Q 285 305 270 320"
              fill="none"
              stroke={isLit("proximal") ? "#10b981" : "#10b98144"}
              strokeWidth={isLit("proximal") ? 6 : 4}
              strokeLinecap="round"
              filter={isLit("proximal") ? "url(#kidney-glow)" : undefined}
            />
            {/* Flow dots */}
            {[0, 0.33, 0.66].map((o, i) => (
              <circle key={`pct-${i}`} r="2" fill="#10b981" opacity="0.7">
                <animateMotion dur="2s" begin={`${o * 2}s`} repeatCount="indefinite" path="M 255 235 Q 275 250 265 270 Q 255 285 270 295 Q 285 305 270 320" />
              </circle>
            ))}
            {/* Microvilli brush border hint */}
            {[260, 270, 280].map((y, i) => (
              <line key={`mv-${i}`} x1="272" y1={y} x2="280" y2={y} stroke="#10b98133" strokeWidth="0.8" />
            ))}
            <text x="298" y="278" fill="#10b981" fontSize="8" fontWeight="bold" opacity="0.7">PCT</text>
          </g>

          {/* Loop of Henle */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHovered("loop")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(active === "loop" ? null : "loop")}
          >
            {/* Descending limb (thin) */}
            <path
              d="M 270 320 L 270 395 Q 270 415 250 415"
              fill="none"
              stroke={isLit("loop") ? "#a3e635" : "#a3e63544"}
              strokeWidth={isLit("loop") ? 4 : 2.5}
              strokeLinecap="round"
              filter={isLit("loop") ? "url(#kidney-glow)" : undefined}
            />
            {/* Ascending limb (thick) */}
            <path
              d="M 250 415 Q 230 415 230 395 L 230 340"
              fill="none"
              stroke={isLit("loop") ? "#a3e635" : "#a3e63544"}
              strokeWidth={isLit("loop") ? 6 : 4}
              strokeLinecap="round"
              filter={isLit("loop") ? "url(#kidney-glow)" : undefined}
            />
            {/* Flow dots descending */}
            {[0, 0.33, 0.66].map((o, i) => (
              <circle key={`ld-${i}`} r="1.5" fill="#a3e635" opacity="0.7">
                <animateMotion dur="2.5s" begin={`${o * 2.5}s`} repeatCount="indefinite" path="M 270 320 L 270 395 Q 270 415 250 415" />
              </circle>
            ))}
            {/* Flow dots ascending */}
            {[0, 0.33, 0.66].map((o, i) => (
              <circle key={`lu-${i}`} r="1.5" fill="#a3e635" opacity="0.7">
                <animateMotion dur="2.5s" begin={`${o * 2.5}s`} repeatCount="indefinite" path="M 250 415 Q 230 415 230 395 L 230 340" />
              </circle>
            ))}
            {/* Labels */}
            <text x="280" y="365" fill="#a3e635" fontSize="7" fontWeight="bold" opacity="0.6">DESC</text>
            <text x="200" y="365" fill="#a3e635" fontSize="7" fontWeight="bold" opacity="0.6">ASC</text>
            <text x="250" y="435" textAnchor="middle" fill="#a3e635" fontSize="9" fontWeight="bold" opacity="0.8">LOOP OF HENLE</text>
            {/* Osmolarity gradient markers */}
            <text x="288" y="350" fill="#a3e63544" fontSize="6">300</text>
            <text x="288" y="400" fill="#a3e63544" fontSize="6">600</text>
            <text x="288" y="415" fill="#a3e63544" fontSize="6">1200</text>
          </g>

          {/* Distal Convoluted Tubule */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHovered("distal")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(active === "distal" ? null : "distal")}
          >
            <path
              d="M 230 340 Q 225 330 240 320 Q 255 310 250 295 Q 245 280 260 270 Q 270 260 280 265 Q 295 272 305 285 Q 315 298 310 310 Q 305 325 320 330 Q 335 335 335 340"
              fill="none"
              stroke={isLit("distal") ? "#06b6d4" : "#06b6d444"}
              strokeWidth={isLit("distal") ? 5 : 3}
              strokeLinecap="round"
              filter={isLit("distal") ? "url(#kidney-glow)" : undefined}
            />
            {/* Flow dots */}
            {[0, 0.25, 0.5, 0.75].map((o, i) => (
              <circle key={`dct-${i}`} r="1.8" fill="#06b6d4" opacity="0.7">
                <animateMotion dur="2.5s" begin={`${o * 2.5}s`} repeatCount="indefinite" path="M 230 340 Q 225 330 240 320 Q 255 310 250 295 Q 245 280 260 270 Q 270 260 280 265 Q 295 272 305 285 Q 315 298 310 310 Q 305 325 320 330 Q 335 335 335 340" />
              </circle>
            ))}
            {/* Macula densa near glomerulus */}
            <circle cx="252" cy="258" r="4" fill={isLit("distal") ? "#06b6d488" : "#06b6d433"} stroke="#06b6d466" strokeWidth="1" />
            <text x="340" y="325" fill="#06b6d4" fontSize="8" fontWeight="bold" opacity="0.7">DCT</text>
          </g>

          {/* Pulsing sparks along nephron */}
          {[
            { cx: 240, cy: 210, r: 3, c: "#ef4444" },
            { cx: 265, cy: 270, r: 2.5, c: "#10b981" },
            { cx: 270, cy: 395, r: 2.5, c: "#a3e635" },
            { cx: 290, cy: 290, r: 2, c: "#06b6d4" },
            { cx: 345, cy: 320, r: 2.5, c: "#8b5cf6" },
          ].map((s, i) => (
            <circle key={`spark-${i}`} cx={s.cx} cy={s.cy} r={s.r} fill={s.c} opacity="0">
              <animate attributeName="opacity" values="0;0.9;0" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
            </circle>
          ))}
        </g>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 justify-center mt-1">
        {PARTS.map((p) => (
          <span
            key={p.id}
            className={`text-[10px] px-2 py-0.5 rounded-full border transition-all duration-300 ${
              isLit(p.id) ? "scale-110" : "opacity-70"
            }`}
            style={{
              borderColor: p.color,
              color: p.color,
              backgroundColor: isLit(p.id) ? `${p.color}22` : "transparent",
              boxShadow: isLit(p.id) ? `0 0 8px ${p.color}44` : "none",
            }}
          >
            {p.label}
          </span>
        ))}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md rounded-2xl p-5 z-20"
            style={{
              background: "rgba(15, 10, 30, 0.85)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: `1px solid ${PARTS.find((p) => p.id === active)?.color}44`,
              boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${PARTS.find((p) => p.id === active)?.color}22`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: PARTS.find((p) => p.id === active)?.color }}
              />
              <h3 className="text-white font-semibold text-sm">
                {PARTS.find((p) => p.id === active)?.label}
              </h3>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full ml-auto"
                style={{
                  backgroundColor: `${PARTS.find((p) => p.id === active)?.color}22`,
                  color: PARTS.find((p) => p.id === active)?.color,
                }}
              >
                {PARTS.find((p) => p.id === active)?.role}
              </span>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed">
              {PARTS.find((p) => p.id === active)?.desc}
            </p>
            <button
              onClick={() => setActive(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
