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
  | "corpus-callosum"
  | "spinal-cord"
  | "peripheral-nerves"
  | "neural-pathways";

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
      "The life-support core — midbrain, pons and medulla. It runs breathing, heart rate and blood pressure, houses the cranial nerve nuclei, and carries every motor and sensory tract between brain and body. At its base, the medulla merges seamlessly into the spinal cord.",
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
  "spinal-cord": {
    id: "spinal-cord",
    name: "Spinal Cord",
    role: "Central nervous system highway",
    color: "#22d3ee",
    bright: "#a5f3fc",
    blurb:
      "Part of the CENTRAL nervous system — a ~45 cm column of grey and white matter carrying motor commands down and sensory signals up, with 31 pairs of spinal nerves attaching along its length. It runs reflexes on its own, reacting before the brain even knows. It tapers to the conus medullaris around L1; below that the roots fan out as the cauda equina, the 'horse's tail' you can see here.",
  },
  "peripheral-nerves": {
    id: "peripheral-nerves",
    name: "Peripheral Nerves",
    role: "Peripheral nervous system branches",
    color: "#fde047",
    bright: "#fef9c3",
    blurb:
      "The PERIPHERAL nervous system — 12 pairs of cranial and 31 pairs of spinal nerves branching to every muscle, organ and patch of skin. Sensory (afferent) fibres carry signals in, motor (efferent) fibres carry commands out. Touch, pain, reflexes and every voluntary movement travel along these live wires.",
  },
  "neural-pathways": {
    id: "neural-pathways",
    name: "Neural Pathways",
    role: "White-matter tracts",
    color: "#67e8f9",
    bright: "#ecfeff",
    blurb:
      "Bundles of myelinated axons — the brain's express lanes. The corticospinal tract carries voluntary movement commands from the motor cortex down through the brainstem and into the spinal cord; the spinothalamic tract carries pain and temperature up; the optic radiations carry vision from the occipital lobe onward. Myelin is what makes them fast.",
  },
};

/* ------------------------------------------------------------------ */
/* Shared interactivity                                                */
/*                                                                    */
/* Every region is INDEPENDENT: hovering or clicking one part never    */
/* lights up its neighbours. Each lobe/cord/nerve has its own closed   */
/* path, so the pointer hits exactly one part and only that one glows. */
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

/* Peripheral nerve strands radiating out from the cord */
const NERVES: { id: string; d: string; dur: number }[] = [
  { id: "l1", d: "M 222 376 C 182 372, 148 380, 126 398 C 114 410, 108 424, 104 440", dur: 1.5 },
  { id: "l2", d: "M 222 404 C 182 404, 146 414, 126 434 C 112 448, 104 464, 100 482", dur: 1.5 },
  { id: "l3", d: "M 221 434 C 186 438, 152 450, 132 472 C 118 488, 110 506, 106 526", dur: 1.6 },
  { id: "l4", d: "M 222 464 C 192 470, 164 486, 148 508 C 136 524, 128 542, 124 560", dur: 1.6 },
  { id: "l5", d: "M 224 490 C 200 500, 178 518, 166 540 C 158 556, 152 572, 150 588", dur: 1.7 },
  { id: "r1", d: "M 240 376 C 280 372, 314 380, 336 398 C 348 410, 354 424, 358 440", dur: 1.5 },
  { id: "r2", d: "M 240 404 C 280 404, 316 414, 336 434 C 350 448, 358 464, 362 482", dur: 1.5 },
  { id: "r3", d: "M 241 434 C 276 438, 310 450, 330 472 C 344 488, 352 506, 356 526", dur: 1.6 },
  { id: "r4", d: "M 240 464 C 270 470, 298 486, 314 508 C 326 524, 334 542, 338 560", dur: 1.6 },
  { id: "r5", d: "M 238 490 C 262 500, 284 518, 296 540 C 304 556, 310 572, 312 588", dur: 1.7 },
];

/* Cauda equina — the nerve root 'horse's tail' below the conus medullaris */
const CAUDA: string[] = [
  "M 228 506 C 216 530, 202 552, 188 580",
  "M 230 507 C 222 532, 212 556, 204 584",
  "M 231 508 C 228 534, 226 560, 225 588",
  "M 231 508 C 231 536, 231 562, 232 590",
  "M 232 508 C 234 534, 236 560, 238 588",
  "M 233 507 C 240 532, 246 556, 252 584",
  "M 235 506 C 244 530, 256 552, 268 580",
];

/* Where the spinal nerves attach to the cord */
const ROOTLETS = [376, 404, 434, 464, 490];

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
            strokeWidth={active ? 3 : 2}
            strokeOpacity={active ? 1 : 0.85}
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
            strokeWidth={active ? 3 : 2}
            strokeOpacity={active ? 1 : 0.85}
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
            strokeWidth={active ? 3 : 2}
            strokeOpacity={active ? 1 : 0.85}
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
            strokeWidth={active ? 3 : 2}
            strokeOpacity={active ? 1 : 0.85}
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
            strokeWidth={active ? 3 : 2}
            strokeOpacity={active ? 1 : 0.85}
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
            strokeWidth={active ? 3 : 2}
            strokeOpacity={active ? 1 : 0.85}
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
    case "spinal-cord":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 16px ${c})` : undefined }}>
          {/* cord body — merges out of the medulla, tapers at the conus */}
          <path
            d="M 231 356 L 231 408 C 228 432, 234 452, 230 476 C 228 490, 229 500, 231 508"
            fill="none"
            stroke={c}
            strokeWidth={active ? 19 : 16}
            strokeLinecap="round"
            opacity={active ? 0.95 : 0.6}
          />
          {/* inner highlight */}
          <path
            d="M 231 358 L 231 408 C 229 432, 233 452, 231 476 C 230 490, 230 500, 231 506"
            fill="none"
            stroke="#ecfeff"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.55"
          />
          {/* cauda equina — fanning nerve roots below the conus */}
          {CAUDA.map((d) => (
            <path
              key={d}
              d={d}
              fill="none"
              stroke={c}
              strokeWidth={active ? 3.5 : 2.6}
              strokeLinecap="round"
              opacity={active ? 0.9 : 0.45}
            />
          ))}
          {/* dorsal/ventral rootlets where each nerve attaches */}
          {ROOTLETS.map((y) => (
            <g key={y}>
              <circle cx="220" cy={y} r={active ? 3 : 2.2} fill="#a5f3fc" opacity={active ? 0.95 : 0.6} />
              <circle cx="242" cy={y} r={active ? 3 : 2.2} fill="#a5f3fc" opacity={active ? 0.95 : 0.6} />
            </g>
          ))}
        </g>
      );
    case "peripheral-nerves":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 14px ${c})` : undefined }}>
          {NERVES.map((n) => (
            <path
              key={n.id}
              d={n.d}
              fill="none"
              stroke={c}
              strokeWidth={active ? 4 : 3}
              strokeLinecap="round"
              opacity={active ? 0.95 : 0.6}
            />
          ))}
          {/* energy flowing outward along every nerve */}
          {NERVES.map((n) => (
            <motion.path
              key={n.id + "-flow"}
              d={n.d}
              fill="none"
              stroke="#fefce8"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeDasharray="2.5 12"
              opacity="0.9"
              animate={{ strokeDashoffset: [0, -29] }}
              transition={{ duration: n.dur, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </g>
      );
    case "neural-pathways":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 12px ${c})` : undefined }}>
          {/* motor strip along the central sulcus */}
          <motion.path
            d="M 252 48 C 248 110, 240 160, 236 202"
            fill="none"
            stroke="#67e8f9"
            strokeWidth={active ? 2.6 : 1.8}
            strokeLinecap="round"
            strokeDasharray="3 13"
            opacity={active ? 1 : 0.85}
            animate={{ strokeDashoffset: [0, -32] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: "linear" }}
          />
          {/* sensory strip along the central sulcus */}
          <motion.path
            d="M 258 50 C 254 112, 246 162, 242 204"
            fill="none"
            stroke="#a78bfa"
            strokeWidth={active ? 2.6 : 1.8}
            strokeLinecap="round"
            strokeDasharray="3 13"
            opacity={active ? 1 : 0.85}
            animate={{ strokeDashoffset: [0, -32] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: "linear" }}
          />
          {/* corticospinal tract: motor cortex → brainstem → spinal cord */}
          <motion.path
            d="M 234 118 C 242 180, 246 220, 242 268 C 240 300, 240 320, 242 350 L 238 500"
            fill="none"
            stroke="#60a5fa"
            strokeWidth={active ? 2.8 : 2.2}
            strokeLinecap="round"
            strokeDasharray="3 14"
            opacity={active ? 1 : 0.9}
            animate={{ strokeDashoffset: [0, -34] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          {/* ascending sensory: spinal cord → brainstem → parietal */}
          <motion.path
            d="M 232 480 C 230 404, 230 348, 228 300"
            fill="none"
            stroke="#a78bfa"
            strokeWidth={active ? 2.6 : 2}
            strokeLinecap="round"
            strokeDasharray="3 14"
            opacity={active ? 1 : 0.85}
            animate={{ strokeDashoffset: [0, -34] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          />
          {/* sensory pathway: brainstem → parietal */}
          <motion.path
            d="M 228 300 C 252 246, 266 200, 256 126"
            fill="none"
            stroke="#a78bfa"
            strokeWidth={active ? 2.8 : 2.2}
            strokeLinecap="round"
            strokeDasharray="3 14"
            opacity={active ? 1 : 0.9}
            animate={{ strokeDashoffset: [0, -34] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          />
          {/* visual arc: occipital → temporal */}
          <motion.path
            d="M 392 148 C 370 168, 352 178, 334 186"
            fill="none"
            stroke="#c4b5fd"
            strokeWidth={active ? 2.6 : 2}
            strokeLinecap="round"
            strokeDasharray="2.5 12"
            opacity={active ? 1 : 0.85}
            animate={{ strokeDashoffset: [0, -29] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
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
  { text: "NEURAL PATHWAYS", x: 150, y: 126, anchor: "start", color: "#67e8f9" },
  { text: "TEMPORAL LOBE", x: 100, y: 296, anchor: "start", color: "#8b5cf6" },
  { text: "OCCIPITAL", x: 428, y: 172, anchor: "start", color: "#a78bfa" },
  { text: "CEREBELLUM", x: 336, y: 352, anchor: "middle", color: "#818cf8" },
  { text: "BRAINSTEM", x: 168, y: 396, anchor: "end", color: "#38bdf8" },
  { text: "SPINAL CORD", x: 252, y: 362, anchor: "start", color: "#22d3ee" },
  { text: "PERIPHERAL NERVES", x: 231, y: 620, anchor: "middle", color: "#fde047" },
];

const LEGEND: { label: string; color: string }[] = [
  { label: "FRONTAL", color: "#60a5fa" },
  { label: "PARIETAL", color: "#22d3ee" },
  { label: "TEMPORAL", color: "#8b5cf6" },
  { label: "OCCIPITAL", color: "#a78bfa" },
  { label: "CEREBELLUM", color: "#818cf8" },
  { label: "BRAINSTEM", color: "#38bdf8" },
  { label: "NEURAL PATHWAYS", color: "#67e8f9" },
  { label: "SPINAL CORD", color: "#22d3ee" },
  { label: "PERIPHERAL NERVES", color: "#fde047" },
];

/* Pulsing synapse points along the pathways, cord and nerves */
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
  { x: 231, y: 382, delay: 1.1, color: "#22d3ee" },
  { x: 231, y: 442, delay: 1.5, color: "#22d3ee" },
  { x: 231, y: 496, delay: 1.9, color: "#22d3ee" },
  { x: 172, y: 470, delay: 1.3, color: "#fde047" },
  { x: 296, y: 472, delay: 1.7, color: "#fde047" },
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
  "spinal-cord",
  "peripheral-nerves",
  "neural-pathways",
];

function BrainPart({ id, h }: { id: PartId; h: PartHandlers }) {
  // Only the part under the pointer (or explicitly selected) glows.
  const active = h.hover === id || h.selected === id;

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

      {/* the brain + nervous system */}
      <svg
        viewBox="0 0 520 640"
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

        {/* slowly rotating energy ring around the whole nervous system */}
        <motion.circle
          cx="258"
          cy="320"
          r="258"
          fill="none"
          stroke="#a78bfa"
          strokeWidth="1.2"
          strokeDasharray="3 16"
          opacity="0.22"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
        />

        {/* the nervous system, gently breathing under the heat haze */}
        <motion.g
          filter="url(#brain-heat)"
          animate={{ scale: [1, 1.008, 1] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
        >
          {PARTS_ORDER.map((id) => (
            <BrainPart key={id} id={id} h={h} />
          ))}

          {/* pulsing synapse sparks (visual only) */}
          <g pointerEvents="none">
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
              Tap any lobe, the corpus callosum — or trace the spinal cord down to its peripheral nerves.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
