import { AnimatePresence, motion } from "framer-motion";
import { Info, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Parts — everything you can hover and tap                            */
/* ------------------------------------------------------------------ */

type PartId =
  | "frontal"
  | "parietal"
  | "temporal"
  | "occipital"
  | "cerebellum"
  | "brainstem"
  | "corpus-callosum";

interface BrainPart {
  id: PartId;
  name: string;
  role: string;
  blurb: string;
  color: string;
  bright: string;
}

const PARTS: Record<PartId, BrainPart> = {
  frontal: {
    id: "frontal",
    name: "Frontal Lobe",
    role: "Higher cognition & motor control",
    color: "#60a5fa",
    bright: "#dbeafe",
    blurb:
      "The CEO of your brain — reasoning, planning, personality, working memory and voluntary movement. The precentral gyrus at its back edge is the primary motor cortex, firing in a precise body map (the motor homunculus). Damage here can change personality itself.",
  },
  parietal: {
    id: "parietal",
    name: "Parietal Lobe",
    role: "Sensation & spatial awareness",
    color: "#22d3ee",
    bright: "#cffafe",
    blurb:
      "The spatial integrator — touch, pressure, pain and temperature all converge here. Its postcentral gyrus is the primary somatosensory cortex (the sensory homunculus), and it builds your body image, guides reaching and helps you do mental math.",
  },
  temporal: {
    id: "temporal",
    name: "Temporal Lobe",
    role: "Hearing, memory & language",
    color: "#8b5cf6",
    bright: "#ede9fe",
    blurb:
      "The archivist — hearing, language comprehension (Wernicke's area), face recognition (fusiform gyrus) and the hippocampus, the gateway that turns experience into lasting memory. Tinnitus, Wernicke's aphasia and prosopagnosia all trace here.",
  },
  occipital: {
    id: "occipital",
    name: "Occipital Lobe",
    role: "Vision",
    color: "#a78bfa",
    bright: "#f3e8ff",
    blurb:
      "The visual cortex — the smallest lobe, but the heavyweight of sight. V1 maps your visual field upside-down and back-to-front, then the dorsal 'where' and ventral 'what' streams carry the picture onward to the rest of the brain.",
  },
  cerebellum: {
    id: "cerebellum",
    name: "Cerebellum",
    role: "Coordination & balance",
    color: "#818cf8",
    bright: "#e0e7ff",
    blurb:
      "The coordination engine — about 10% of brain volume but over half of its neurons. It fine-tunes movement, balance and posture by comparing intended motion with actual motion; its folia folds are what pack all that circuitry in.",
  },
  brainstem: {
    id: "brainstem",
    name: "Brainstem",
    role: "Life-support & relay",
    color: "#38bdf8",
    bright: "#e0f2fe",
    blurb:
      "The life-support core — midbrain, pons and medulla. It runs breathing, heart rate and blood pressure, houses the cranial nerve nuclei, and carries every motor and sensory tract between brain and body. Consciousness itself depends on it.",
  },
  "corpus-callosum": {
    id: "corpus-callosum",
    name: "Corpus Callosum",
    role: "Hemisphere bridge",
    color: "#67e8f9",
    bright: "#ecfeff",
    blurb:
      "The bridge — roughly 200 million commissural axons shuttling information between the left and right hemispheres so the two halves of your brain act as one. Split-brain patients reveal just how dramatically it coordinates thought.",
  },
};

/* Connected parts — hovering or selecting one brightens its partners */
const LINKS: Partial<Record<PartId, PartId[]>> = {
  frontal: ["parietal", "corpus-callosum", "temporal"],
  parietal: ["frontal", "occipital", "corpus-callosum"],
  temporal: ["occipital", "frontal", "corpus-callosum"],
  occipital: ["parietal", "temporal", "cerebellum", "corpus-callosum"],
  cerebellum: ["brainstem", "occipital"],
  brainstem: ["cerebellum", "frontal", "parietal"],
  "corpus-callosum": ["frontal", "parietal", "temporal", "occipital"],
};

/* ------------------------------------------------------------------ */
/* Shared interactivity                                                */
/* ------------------------------------------------------------------ */

interface PartHandlers {
  hover: PartId | null;
  selected: PartId | null;
  onHover: (id: PartId) => void;
  onLeave: () => void;
  onSelect: (id: PartId) => void;
}

function partProps(id: PartId, h: PartHandlers) {
  return {
    role: "button",
    tabIndex: 0,
    "aria-label": PARTS[id].name,
    className: "cursor-pointer outline-none",
    onMouseEnter: () => h.onHover(id),
    onMouseLeave: h.onLeave,
    onClick: () => h.onSelect(id),
    onKeyDown: (e: React.KeyboardEvent<SVGGElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        h.onSelect(id);
      }
    },
  } as const;
}

/* ------------------------------------------------------------------ */
/* Per-part SVG shapes                                                 */
/* ------------------------------------------------------------------ */

function PartShape({ id, active }: { id: PartId; active: boolean }) {
  const c = PARTS[id].color;

  switch (id) {
    case "frontal":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 16px ${c})` : undefined }}>
          <path
            d="M 106 148 C 98 92, 158 46, 250 48 C 256 84, 249 122, 237 166 C 227 202, 200 220, 160 226 C 126 230, 100 214, 100 190 C 99 172, 100 160, 106 148 Z"
            fill={c}
            fillOpacity={active ? 0.5 : 0.22}
            stroke={c}
            strokeWidth={active ? 2.5 : 1.6}
            strokeLinejoin="round"
          />
          <path d="M 116 96 C 128 88, 146 86, 158 92" stroke={c} strokeWidth="1.5" fill="none" opacity="0.55" />
          <path d="M 116 132 C 132 124, 152 122, 168 128" stroke={c} strokeWidth="1.5" fill="none" opacity="0.55" />
          <path d="M 116 172 C 130 164, 148 162, 162 170" stroke={c} strokeWidth="1.5" fill="none" opacity="0.5" />
        </g>
      );
    case "parietal":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 16px ${c})` : undefined }}>
          <path
            d="M 250 48 C 318 44, 378 56, 394 96 C 403 118, 399 150, 385 176 C 375 196, 357 208, 331 214 C 298 220, 262 226, 240 222 C 238 184, 243 148, 250 118 C 254 94, 252 70, 250 48 Z"
            fill={c}
            fillOpacity={active ? 0.5 : 0.22}
            stroke={c}
            strokeWidth={active ? 2.5 : 1.6}
            strokeLinejoin="round"
          />
          <path d="M 268 84 C 284 78, 302 78, 316 84" stroke={c} strokeWidth="1.5" fill="none" opacity="0.55" />
          <path d="M 268 124 C 286 118, 304 118, 320 124" stroke={c} strokeWidth="1.5" fill="none" opacity="0.55" />
          <path d="M 272 168 C 290 162, 306 162, 320 168" stroke={c} strokeWidth="1.5" fill="none" opacity="0.5" />
        </g>
      );
    case "temporal":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 16px ${c})` : undefined }}>
          <path
            d="M 100 206 C 96 240, 122 262, 162 266 C 222 272, 282 262, 320 250 C 337 244, 344 234, 340 222 C 320 216, 270 224, 218 226 C 178 228, 150 220, 136 214 C 120 208, 108 204, 100 206 Z"
            fill={c}
            fillOpacity={active ? 0.5 : 0.22}
            stroke={c}
            strokeWidth={active ? 2.5 : 1.6}
            strokeLinejoin="round"
          />
          <path d="M 128 232 C 150 228, 176 228, 200 232" stroke={c} strokeWidth="1.5" fill="none" opacity="0.55" />
          <path d="M 124 248 C 150 244, 180 244, 208 250" stroke={c} strokeWidth="1.5" fill="none" opacity="0.55" />
        </g>
      );
    case "occipital":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 16px ${c})` : undefined }}>
          <path
            d="M 390 92 C 412 112, 417 158, 405 194 C 397 218, 381 234, 358 242 C 350 238, 346 228, 348 218 C 354 202, 363 188, 367 172 C 373 150, 373 118, 390 92 Z"
            fill={c}
            fillOpacity={active ? 0.5 : 0.22}
            stroke={c}
            strokeWidth={active ? 2.5 : 1.6}
            strokeLinejoin="round"
          />
          <path d="M 378 118 C 388 126, 394 138, 396 150" stroke={c} strokeWidth="1.5" fill="none" opacity="0.55" />
          <path d="M 366 148 C 376 156, 382 166, 384 178" stroke={c} strokeWidth="1.5" fill="none" opacity="0.55" />
        </g>
      );
    case "cerebellum":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 16px ${c})` : undefined }}>
          <path
            d="M 300 252 C 330 240, 380 240, 402 262 C 418 280, 412 306, 392 318 C 366 332, 330 330, 312 316 C 296 304, 292 274, 300 252 Z"
            fill={c}
            fillOpacity={active ? 0.5 : 0.22}
            stroke={c}
            strokeWidth={active ? 2.5 : 1.6}
            strokeLinejoin="round"
          />
          <path d="M 318 268 C 336 260, 356 260, 376 268" stroke={c} strokeWidth="1.5" fill="none" opacity="0.55" />
          <path d="M 314 284 C 334 276, 356 276, 380 284" stroke={c} strokeWidth="1.5" fill="none" opacity="0.55" />
          <path d="M 312 300 C 330 294, 352 294, 372 300" stroke={c} strokeWidth="1.5" fill="none" opacity="0.5" />
        </g>
      );
    case "brainstem":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 16px ${c})` : undefined }}>
          <path
            d="M 216 254 C 236 246, 258 250, 264 264 C 268 278, 264 296, 262 310 C 266 322, 264 336, 256 344 C 250 352, 234 356, 226 350 C 216 344, 212 330, 214 318 C 210 304, 210 290, 214 278 C 208 268, 210 258, 216 254 Z"
            fill={c}
            fillOpacity={active ? 0.5 : 0.22}
            stroke={c}
            strokeWidth={active ? 2.5 : 1.6}
            strokeLinejoin="round"
          />
          <path d="M 220 272 C 232 268, 248 268, 258 274" stroke={c} strokeWidth="1.5" fill="none" opacity="0.55" />
          <path d="M 216 296 C 228 292, 244 292, 256 298" stroke={c} strokeWidth="1.5" fill="none" opacity="0.55" />
        </g>
      );
    case "corpus-callosum":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 16px ${c})` : undefined }}>
          <path
            d="M 242 150 C 266 106, 336 96, 374 132"
            fill="none"
            stroke={c}
            strokeWidth={active ? 17 : 14}
            strokeLinecap="round"
            opacity={active ? 0.92 : 0.55}
          />
          <path
            d="M 246 146 C 268 110, 330 102, 366 130"
            fill="none"
            stroke="#ecfeff"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
          />
        </g>
      );
  }
}

/* ------------------------------------------------------------------ */
/* Labels & legend                                                     */
/* ------------------------------------------------------------------ */

const LABELS: { text: string; x: number; y: number; anchor: "start" | "middle" | "end"; color: string }[] = [
  { text: "FRONTAL LOBE", x: 116, y: 32, anchor: "start", color: "#60a5fa" },
  { text: "PARIETAL LOBE", x: 336, y: 32, anchor: "middle", color: "#22d3ee" },
  { text: "CORPUS CALLOSUM", x: 298, y: 62, anchor: "middle", color: "#67e8f9" },
  { text: "TEMPORAL LOBE", x: 100, y: 296, anchor: "start", color: "#8b5cf6" },
  { text: "OCCIPITAL", x: 428, y: 172, anchor: "start", color: "#a78bfa" },
  { text: "CEREBELLUM", x: 336, y: 352, anchor: "middle", color: "#818cf8" },
  { text: "BRAINSTEM", x: 168, y: 396, anchor: "end", color: "#38bdf8" },
];

const LEGEND: { label: string; color: string }[] = [
  { label: "FRONTAL", color: "#60a5fa" },
  { label: "PARIETAL", color: "#22d3ee" },
  { label: "TEMPORAL", color: "#8b5cf6" },
  { label: "OCCIPITAL", color: "#a78bfa" },
  { label: "CEREBELLUM", color: "#818cf8" },
  { label: "BRAINSTEM", color: "#38bdf8" },
  { label: "PATHWAYS", color: "#67e8f9" },
];

/* Pulsing synapse points along the pathways */
const SYNAPSES: { x: number; y: number; delay: number; color: string }[] = [
  { x: 262, y: 128, delay: 0, color: "#67e8f9" },
  { x: 300, y: 110, delay: 0.35, color: "#67e8f9" },
  { x: 340, y: 110, delay: 0.7, color: "#67e8f9" },
  { x: 368, y: 136, delay: 1.05, color: "#67e8f9" },
  { x: 238, y: 152, delay: 0.2, color: "#60a5fa" },
  { x: 242, y: 206, delay: 0.6, color: "#60a5fa" },
  { x: 241, y: 262, delay: 1.0, color: "#38bdf8" },
  { x: 241, y: 320, delay: 1.4, color: "#38bdf8" },
  { x: 258, y: 168, delay: 0.5, color: "#a78bfa" },
  { x: 252, y: 214, delay: 0.9, color: "#a78bfa" },
  { x: 352, y: 168, delay: 0.8, color: "#c4b5fd" },
  { x: 366, y: 182, delay: 1.2, color: "#c4b5fd" },
];

/* ------------------------------------------------------------------ */
/* Main diagram                                                        */
/* ------------------------------------------------------------------ */

const PARTS_ORDER: PartId[] = [
  "brainstem",
  "cerebellum",
  "occipital",
  "temporal",
  "parietal",
  "frontal",
  "corpus-callosum",
];

function BrainPart({ id, h }: { id: PartId; h: PartHandlers }) {
  const active =
    h.hover === id ||
    h.selected === id ||
    (h.hover !== null && (LINKS[h.hover]?.includes(id) ?? false)) ||
    (h.selected !== null && (LINKS[h.selected]?.includes(id) ?? false));

  return (
    <g {...partProps(id, h)}>
      <PartShape id={id} active={active} />
    </g>
  );
}

export function BrainDiagram({ className }: { className?: string }) {
  const [hover, setHover] = useState<PartId | null>(null);
  const [selected, setSelected] = useState<PartId | null>(null);

  const h: PartHandlers = {
    hover,
    selected,
    onHover: setHover,
    onLeave: () => setHover(null),
    onSelect: (id) => setSelected((prev) => (prev === id ? null : id)),
  };

  const selectedPart = selected ? PARTS[selected] : null;

  return (
    <div className={cn("glass-panel shine relative overflow-hidden rounded-3xl p-4 sm:p-6", className)}>
      {/* ambient glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#a78bfa]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-16 h-44 w-44 rounded-full bg-[#22d3ee]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-8 left-8 h-44 w-44 rounded-full bg-[#60a5fa]/10 blur-3xl" />

      {/* hint + legend */}
      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <Info className="size-3.5 text-wistaria" />
          Hover to glow · click a region to learn what it does
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-bold">
          {LEGEND.map((l) => (
            <span key={l.label} className="flex items-center gap-1.5" style={{ color: l.color }}>
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: l.color, boxShadow: `0 0 8px ${l.color}` }}
              />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      {/* the brain */}
      <svg
        viewBox="0 0 520 460"
        className="relative mx-auto mt-2 block w-full max-w-[540px] select-none"
        role="img"
        aria-label="Interactive glowing brain and nervous system diagram"
      >
        <defs>
          {/* subtle heatwave distortion */}
          <filter id="brain-heat" x="-6%" y="-6%" width="112%" height="112%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.024" numOctaves="2" seed="11" result="heat" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="heat"
              scale="5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        {/* faint cranium behind the brain */}
        <g pointerEvents="none" opacity="0.35">
          <ellipse
            cx="258"
            cy="188"
            rx="204"
            ry="160"
            fill="none"
            stroke="#cbd5e1"
            strokeOpacity="0.18"
            strokeWidth="1.5"
          />
          <circle cx="126" cy="196" r="20" fill="none" stroke="#cbd5e1" strokeOpacity="0.14" strokeWidth="1.5" />
        </g>

        {/* slowly rotating energy ring */}
        <motion.circle
          cx="258"
          cy="196"
          r="196"
          fill="none"
          stroke="#a78bfa"
          strokeWidth="1.2"
          strokeDasharray="3 16"
          opacity="0.22"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
        />

        {/* the brain, gently breathing under the heat haze */}
        <motion.g
          filter="url(#brain-heat)"
          animate={{ scale: [1, 1.008, 1] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
        >
          {PARTS_ORDER.map((id) => (
            <BrainPart key={id} id={id} h={h} />
          ))}

          {/* glowing neural pathways + synapse sparks (visual only) */}
          <g pointerEvents="none">
            {/* motor strip along the central sulcus */}
            <motion.path
              d="M 252 48 C 248 110, 240 160, 236 202"
              fill="none"
              stroke="#67e8f9"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeDasharray="3 13"
              opacity="0.85"
              animate={{ strokeDashoffset: [0, -32] }}
              transition={{ duration: 1.3, repeat: Infinity, ease: "linear" }}
            />
            {/* sensory strip along the central sulcus */}
            <motion.path
              d="M 258 50 C 254 112, 246 162, 242 204"
              fill="none"
              stroke="#a78bfa"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeDasharray="3 13"
              opacity="0.85"
              animate={{ strokeDashoffset: [0, -32] }}
              transition={{ duration: 1.3, repeat: Infinity, ease: "linear" }}
            />
            {/* corticospinal tract: motor cortex → brainstem → spinal cord */}
            <motion.path
              d="M 234 118 C 242 180, 246 220, 242 268 C 240 300, 240 320, 244 346"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeDasharray="3 14"
              opacity="0.9"
              animate={{ strokeDashoffset: [0, -34] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            {/* sensory pathway: brainstem → parietal */}
            <motion.path
              d="M 228 300 C 252 246, 266 200, 256 126"
              fill="none"
              stroke="#a78bfa"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeDasharray="3 14"
              opacity="0.9"
              animate={{ strokeDashoffset: [0, -34] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
            />
            {/* visual arc: occipital → temporal */}
            <motion.path
              d="M 392 148 C 370 168, 352 178, 334 186"
              fill="none"
              stroke="#c4b5fd"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="2.5 12"
              opacity="0.85"
              animate={{ strokeDashoffset: [0, -29] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            {/* pulsing synapse sparks */}
            {SYNAPSES.map((s, i) => (
              <motion.circle
                key={i}
                cx={s.x}
                cy={s.y}
                r={2.6}
                fill={s.color}
                animate={{ opacity: [0.25, 1, 0.25], r: [2.2, 4.2, 2.2] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
              />
            ))}
          </g>
        </motion.g>

        {/* crisp labels (outside the heat haze) */}
        {LABELS.map((l) => (
          <text
            key={l.text}
            x={l.x}
            y={l.y}
            textAnchor={l.anchor}
            fill={l.color}
            fontSize="9"
            fontWeight="800"
            letterSpacing="0.8"
            fontFamily="Manrope, sans-serif"
            opacity="0.95"
          >
            {l.text}
          </text>
        ))}
      </svg>

      {/* selected part tooltip */}
      <div className="relative mt-2">
        <AnimatePresence mode="wait" initial={false}>
          {selectedPart ? (
            <motion.div
              key={selectedPart.id}
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="glass-strong relative mx-auto max-w-lg rounded-2xl p-4 pr-10"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground transition-colors hover:bg-white/10"
                aria-label="Close explanation"
              >
                <X className="size-4" />
              </button>
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: selectedPart.color, boxShadow: `0 0 10px ${selectedPart.color}` }}
                />
                <h3 className="text-sm font-extrabold" style={{ color: selectedPart.bright }}>
                  {selectedPart.name}
                </h3>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                  {selectedPart.role}
                </span>
              </div>
              <p className="mt-2 text-[13px] leading-6 text-muted-foreground">{selectedPart.blurb}</p>
            </motion.div>
          ) : (
            <motion.p
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto max-w-lg text-center text-[11px] font-medium text-muted-foreground"
            >
              Tap any lobe — or the corpus callosum bridging them — for a quick breakdown.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
