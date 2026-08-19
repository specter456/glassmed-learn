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
    id: "cornea",
    label: "Cornea",
    role: "Light entry & refraction",
    desc: "The transparent front window that bends (refracts) incoming light — responsible for ~65% of the eye's focusing power. Avascular (no blood vessels) so it stays clear, fed by tears and aqueous humor. LASIK reshapes this layer.",
    color: "#e0f2fe",
  },
  {
    id: "iris",
    label: "Iris",
    role: "Light regulator",
    desc: "The colored diaphragm that controls pupil size. The sphincter pupillae (parasympathetic) constricts in bright light; the dilator pupillae (sympathetic) dilates in the dark or during fear. Drug use: tropicamide dilates, pilocarpine constricts.",
    color: "#60a5fa",
  },
  {
    id: "lens",
    label: "Lens",
    role: "Fine-focus accommodation",
    desc: "A transparent, biconvex structure that changes shape (accommodation) via the ciliary muscle and zonular fibers to focus near or far. Aging makes it stiffer → presbyopia (>40 yrs). When it clouds → cataract, the world's leading cause of blindness.",
    color: "#22d3ee",
  },
  {
    id: "retina",
    label: "Retina",
    role: "Light → neural signals",
    desc: "A 10-layer neural film lining the back of the eye. ~6 million cones (color, daylight, acuity) and ~120 million rods (night, motion). Photoreceptors convert photons into electrical signals via rhodopsin phototransduction, then relay them through bipolar → ganglion cells to the optic nerve.",
    color: "#a78bfa",
  },
  {
    id: "optic",
    label: "Optic Nerve",
    role: "Brain cable",
    desc: "~1.2 million axons of retinal ganglion cells bundled into Cranial Nerve II. They carry every visual signal from the retina to the lateral geniculate nucleus → primary visual cortex (V1). The blind spot is where it exits — no photoreceptors there.",
    color: "#818cf8",
  },
  {
    id: "fovea",
    label: "Fovea",
    role: "Peak acuity center",
    desc: "A tiny pit (1.5mm) at the center of the macula packed exclusively with cones and no rods. Blood vessels are pushed aside so light hits photoreceptors directly. This is where you read, recognize faces, and drive — the highest-resolution point in your entire visual field.",
    color: "#c084fc",
  },
  {
    id: "vitreous",
    label: "Vitreous Humor",
    role: "Structural filler",
    desc: "A clear, gel-like substance filling the large chamber behind the lens (80% of the eye's volume). It maintains the eye's spherical shape and keeps the retina pressed against the choroid. With age it can liquefy, causing 'floaters' — shadows cast on the retina.",
    color: "#67e8f9",
  },
];

export default function EyeDiagram() {
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const current = active || hovered;
  const isLit = (id: string) => current === id;

  return (
    <div className="relative w-full flex flex-col items-center gap-3">
      <svg
        viewBox="0 0 560 420"
        className="w-full max-w-[560px]"
        style={{ filter: "drop-shadow(0 0 20px rgba(34,211,238,0.12))" }}
      >
        <defs>
          <filter id="eye-haze">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="55">
              <animate attributeName="seed" from="55" to="95" dur="8s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="2" />
          </filter>
          <filter id="eye-glow">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="beam-glow">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="eye-bg" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0f0a1e" stopOpacity="0" />
          </radialGradient>
          <clipPath id="eyeball-clip">
            <circle cx="270" cy="210" r="148" />
          </clipPath>
        </defs>

        <rect width="560" height="420" fill="url(#eye-bg)" />

        {/* Energy ring */}
        <circle cx="270" cy="210" r="185" fill="none" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray="4 10" opacity="0.15">
          <animateTransform attributeName="transform" type="rotate" from="0 270 210" to="360 270 210" dur="35s" repeatCount="indefinite" />
        </circle>

        {/* Ambient orbs */}
        <circle cx="100" cy="150" r="30" fill="#a78bfa" opacity="0.05">
          <animate attributeName="opacity" values="0.03;0.07;0.03" dur="5s" repeatCount="indefinite" />
        </circle>
        <circle cx="440" cy="280" r="25" fill="#22d3ee" opacity="0.04">
          <animate attributeName="opacity" values="0.02;0.06;0.02" dur="4s" repeatCount="indefinite" />
        </circle>

        <g filter="url(#eye-haze)">

          {/* ===== EYE CROSS-SECTION (lateral/sagittal view, light enters from left) ===== */}

          {/* Sclera — the outer white shell */}
          <ellipse
            cx="270" cy="210" rx="155" ry="150"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="5"
          />

          {/* Choroid — middle vascular layer */}
          <ellipse
            cx="270" cy="210" rx="148" ry="143"
            fill="none"
            stroke="rgba(168,85,247,0.12)"
            strokeWidth="3"
          />

          {/* ===== VITREOUS HUMOR (fills back chamber) ===== */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHovered("vitreous")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(active === "vitreous" ? null : "vitreous")}
          >
            <ellipse
              cx="310" cy="210" rx="105" ry="120"
              fill={isLit("vitreous") ? "rgba(103,232,249,0.08)" : "rgba(103,232,249,0.03)"}
              stroke={isLit("vitreous") ? "#67e8f9" : "rgba(103,232,249,0.15)"}
              strokeWidth={isLit("vitreous") ? 2.5 : 1}
              filter={isLit("vitreous") ? "url(#eye-glow)" : undefined}
            />
            <text x="310" y="280" textAnchor="middle" fill="#67e8f9" fontSize="9" fontWeight="bold" opacity={isLit("vitreous") ? 0.8 : 0.35}>VITREOUS</text>
          </g>

          {/* ===== IRIS & PUPIL ===== */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHovered("iris")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(active === "iris" ? null : "iris")}
          >
            {/* Iris — two curved flaps above and below the pupil */}
            <path
              d="M 160 155 Q 175 140 195 148 Q 200 155 195 168"
              fill="none"
              stroke={isLit("iris") ? "#60a5fa" : "rgba(96,165,250,0.4)"}
              strokeWidth={isLit("iris") ? 5 : 3.5}
              strokeLinecap="round"
              filter={isLit("iris") ? "url(#eye-glow)" : undefined}
            />
            <path
              d="M 160 265 Q 175 280 195 272 Q 200 265 195 252"
              fill="none"
              stroke={isLit("iris") ? "#60a5fa" : "rgba(96,165,250,0.4)"}
              strokeWidth={isLit("iris") ? 5 : 3.5}
              strokeLinecap="round"
              filter={isLit("iris") ? "url(#eye-glow)" : undefined}
            />
            {/* Pupil opening */}
            <ellipse
              cx="178" cy="210" rx="8" ry="48"
              fill="rgba(0,0,0,0.7)"
              stroke={isLit("iris") ? "#60a5fa" : "transparent"}
              strokeWidth="1.5"
            />
            {/* Iris texture — radial lines */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = ((i - 3.5) / 8) * Math.PI * 0.7;
              return (
                <line
                  key={`iris-${i}`}
                  x1={178 + Math.cos(angle) * 12}
                  y1={210 - Math.sin(angle) * 40}
                  x2={178 + Math.cos(angle) * 22}
                  y2={210 - Math.sin(angle) * 55}
                  stroke={isLit("iris") ? "#60a5fa" : "rgba(96,165,250,0.2)"}
                  strokeWidth="0.8"
                />
              );
            })}
            <text x="178" y="125" textAnchor="middle" fill="#60a5fa" fontSize="9" fontWeight="bold" opacity={isLit("iris") ? 0.9 : 0.5}>IRIS</text>
          </g>

          {/* ===== CORNEA ===== */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHovered("cornea")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(active === "cornea" ? null : "cornea")}
          >
            {/* Corneal dome — bulges outward from the eyeball front */}
            <path
              d="M 155 145 Q 110 180 108 210 Q 110 240 155 275"
              fill="none"
              stroke={isLit("cornea") ? "#e0f2fe" : "rgba(224,242,254,0.35)"}
              strokeWidth={isLit("cornea") ? 5 : 3}
              strokeLinecap="round"
              filter={isLit("cornea") ? "url(#eye-glow)" : undefined}
            />
            {/* Inner corneal surface */}
            <path
              d="M 158 150 Q 120 180 118 210 Q 120 240 158 270"
              fill="none"
              stroke={isLit("cornea") ? "rgba(224,242,254,0.4)" : "rgba(224,242,254,0.12)"}
              strokeWidth="1.5"
              strokeDasharray="3 4"
            />
            <text x="105" y="150" textAnchor="middle" fill="#e0f2fe" fontSize="9" fontWeight="bold" opacity={isLit("cornea") ? 0.9 : 0.5}>CORNEA</text>
          </g>

          {/* ===== LENS ===== */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHovered("lens")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(active === "lens" ? null : "lens")}
          >
            {/* Biconvex lens */}
            <ellipse
              cx="178" cy="210" rx="16" ry="38"
              fill={isLit("lens") ? "rgba(34,211,238,0.12)" : "rgba(34,211,238,0.05)"}
              stroke={isLit("lens") ? "#22d3ee" : "rgba(34,211,238,0.4)"}
              strokeWidth={isLit("lens") ? 3 : 2}
              filter={isLit("lens") ? "url(#eye-glow)" : undefined}
            >
              <animate attributeName="ry" values="38;40;38" dur="4s" repeatCount="indefinite" />
            </ellipse>
            {/* Zonular fibers connecting lens to ciliary body */}
            <line x1="178" y1="168" x2="175" y2="152" stroke="rgba(34,211,238,0.2)" strokeWidth="0.8" />
            <line x1="178" y1="252" x2="175" y2="268" stroke="rgba(34,211,238,0.2)" strokeWidth="0.8" />
            <line x1="170" y1="172" x2="165" y2="155" stroke="rgba(34,211,238,0.15)" strokeWidth="0.6" />
            <line x1="170" y1="248" x2="165" y2="265" stroke="rgba(34,211,238,0.15)" strokeWidth="0.6" />
            {/* Ciliary body */}
            <path d="M 165 152 Q 160 158 158 168" fill="none" stroke="rgba(34,211,238,0.25)" strokeWidth="2" strokeLinecap="round" />
            <path d="M 165 268 Q 160 262 158 252" fill="none" stroke="rgba(34,211,238,0.25)" strokeWidth="2" strokeLinecap="round" />
            <text x="178" y="310" textAnchor="middle" fill="#22d3ee" fontSize="9" fontWeight="bold" opacity={isLit("lens") ? 0.9 : 0.5}>LENS</text>
          </g>

          {/* ===== LIGHT PATH BEAM ===== */}
          {/* Animated light entering the eye — white/cyan beam */}
          <g opacity={0.3}>
            {/* Main beam */}
            <path
              d="M 50 210 L 108 210 L 178 210 L 380 210"
              fill="none"
              stroke="#e0f2fe"
              strokeWidth="3"
              strokeDasharray="6 4"
              filter="url(#beam-glow)"
            >
              <animate attributeName="strokeDashoffset" from="0" to="-20" dur="1s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.15;0.35;0.15" dur="3s" repeatCount="indefinite" />
            </path>
            {/* Refracted rays diverging inside the eye */}
            <path d="M 178 210 L 380 185" fill="none" stroke="#a5f3fc" strokeWidth="1" strokeDasharray="4 6" opacity="0.2">
              <animate attributeName="strokeDashoffset" from="0" to="-10" dur="1.5s" repeatCount="indefinite" />
            </path>
            <path d="M 178 210 L 380 235" fill="none" stroke="#a5f3fc" strokeWidth="1" strokeDasharray="4 6" opacity="0.2">
              <animate attributeName="strokeDashoffset" from="0" to="-10" dur="1.5s" repeatCount="indefinite" />
            </path>
            <text x="55" y="200" fill="#e0f2fe" fontSize="8" fontWeight="bold" opacity="0.5">LIGHT →</text>
          </g>

          {/* ===== FOVEA ===== */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHovered("fovea")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(active === "fovea" ? null : "fovea")}
          >
            {/* Foveal pit — small depression on the retina */}
            <path
              d="M 370 198 Q 378 210 370 222"
              fill="none"
              stroke={isLit("fovea") ? "#c084fc" : "rgba(192,132,252,0.5)"}
              strokeWidth={isLit("fovea") ? 4 : 2.5}
              strokeLinecap="round"
              filter={isLit("fovea") ? "url(#eye-glow)" : undefined}
            />
            {/* Concentric glow rings */}
            <circle cx="378" cy="210" r="8" fill="none" stroke={isLit("fovea") ? "#c084fc" : "transparent"} strokeWidth="1" opacity="0.5">
              <animate attributeName="r" values="8;14;8" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite" />
            </circle>
            <text x="398" y="204" fill="#c084fc" fontSize="8" fontWeight="bold" opacity={isLit("fovea") ? 0.9 : 0.45}>FOVEA</text>
          </g>

          {/* ===== RETINA ===== */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHovered("retina")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(active === "retina" ? null : "retina")}
          >
            {/* Inner retina layer — curved along the back wall */}
            <path
              d="M 200 90 Q 350 85 400 130 Q 425 170 420 210 Q 425 250 400 290 Q 350 335 200 330"
              fill={isLit("retina") ? "rgba(167,139,250,0.12)" : "rgba(167,139,250,0.04)"}
              stroke={isLit("retina") ? "#a78bfa" : "rgba(167,139,250,0.3)"}
              strokeWidth={isLit("retina") ? 3.5 : 2}
              filter={isLit("retina") ? "url(#eye-glow)" : undefined}
            />
            {/* Photoreceptor cells — tiny rod/cone marks */}
            {Array.from({ length: 20 }).map((_, i) => {
              const t = i / 19;
              const angle = -Math.PI * 0.35 + t * Math.PI * 0.7;
              const cx = 310 + Math.cos(angle) * 110;
              const cy = 210 + Math.sin(angle) * 105;
              const isCone = i === 9 || i === 10 || i === 11;
              return (
                <line
                  key={`photo-${i}`}
                  x1={cx}
                  y1={cy}
                  x2={cx + Math.cos(angle) * (isCone ? 8 : 10)}
                  y2={cy + Math.sin(angle) * (isCone ? 8 : 10)}
                  stroke={isLit("retina") ? (isCone ? "#c084fc" : "#a78bfa") : "rgba(167,139,250,0.2)"}
                  strokeWidth={isCone ? 1.5 : 1}
                  strokeLinecap="round"
                />
              );
            })}
            <text x="420" y="165" fill="#a78bfa" fontSize="9" fontWeight="bold" opacity={isLit("retina") ? 0.9 : 0.5}>RETINA</text>
          </g>

          {/* ===== OPTIC NERVE ===== */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHovered("optic")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(active === "optic" ? null : "optic")}
          >
            {/* Optic nerve bundle exiting the back */}
            <path
              d="M 400 210 Q 430 210 455 210 Q 480 210 500 208"
              fill="none"
              stroke={isLit("optic") ? "#818cf8" : "rgba(129,140,248,0.35)"}
              strokeWidth={isLit("optic") ? 12 : 8}
              strokeLinecap="round"
              filter={isLit("optic") ? "url(#eye-glow)" : undefined}
            />
            {/* Inner axon fibers */}
            {[-3, -1, 1, 3].map((dy, i) => (
              <path
                key={`axon-${i}`}
                d={`M 405 ${210 + dy} Q 455 ${210 + dy * 1.2} 500 ${208 + dy}`}
                fill="none"
                stroke={isLit("optic") ? "#818cf8" : "rgba(129,140,248,0.15)"}
                strokeWidth="1"
              />
            ))}
            {/* Signal pulses traveling along the nerve */}
            {[0, 0.33, 0.66].map((o, i) => (
              <circle key={`sig-${i}`} r="2.5" fill="#818cf8" opacity="0.8">
                <animateMotion dur="1.2s" begin={`${o * 1.2}s`} repeatCount="indefinite" path="M 400 210 Q 430 210 455 210 Q 480 210 500 208" />
              </circle>
            ))}
            {/* Blind spot indicator */}
            <circle cx="400" cy="210" r="6" fill="none" stroke="rgba(129,140,248,0.3)" strokeWidth="1" strokeDasharray="2 2" />
            <text x="470" y="230" fill="#818cf8" fontSize="9" fontWeight="bold" opacity={isLit("optic") ? 0.9 : 0.5}>OPTIC NERVE</text>
            <text x="470" y="242" fill="#818cf8" fontSize="7" opacity={isLit("optic") ? 0.6 : 0.25}>to Brain →</text>
          </g>

          {/* Light-refraction focal point on retina */}
          <circle cx="378" cy="210" r="3" fill="#e0f2fe" opacity="0.4">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" />
            <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* Pulsing sparks */}
          {[
            { cx: 108, cy: 210, r: 3, c: "#e0f2fe" },
            { cx: 178, cy: 210, r: 3, c: "#22d3ee" },
            { cx: 378, cy: 210, r: 3, c: "#c084fc" },
            { cx: 440, cy: 210, r: 2.5, c: "#818cf8" },
          ].map((s, i) => (
            <circle key={`spark-${i}`} cx={s.cx} cy={s.cy} r={s.r} fill={s.c} opacity="0">
              <animate attributeName="opacity" values="0;0.8;0" dur={`${1.8 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.6}s`} />
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
