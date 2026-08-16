import { AnimatePresence, motion } from "framer-motion";
import { Info, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Parts — everything you can hover and tap                            */
/* ------------------------------------------------------------------ */

type PartId =
  | "larynx"
  | "trachea"
  | "right-bronchus"
  | "left-bronchus"
  | "bronchioles"
  | "alveoli"
  | "diaphragm";

interface LungsPart {
  id: PartId;
  name: string;
  role: string;
  blurb: string;
  color: string;
  bright: string;
}

const PARTS: Record<PartId, LungsPart> = {
  larynx: {
    id: "larynx",
    name: "Larynx",
    role: "Voice box & airway guard",
    color: "#38bdf8",
    bright: "#bae6fd",
    blurb:
      "The cartilaginous voice box at the top of the windpipe. Its vocal folds vibrate to produce sound, and the leaf-shaped epiglottis above it snaps shut during swallowing so food goes down the esophagus instead of the trachea. The thyroid notch you can feel in the front of your neck is its 'Adam's apple'.",
  },
  trachea: {
    id: "trachea",
    name: "Trachea",
    role: "The windpipe",
    color: "#22d3ee",
    bright: "#a5f3fc",
    blurb:
      "A 10-12 cm tube of C-shaped cartilage rings running from the larynx down to the carina — the split point around T4-T5. The rings are open at the back so the esophagus can bulge into the trachea when you swallow. Its lining, ciliated cells with mucus glands, forms the 'mucociliary escalator' that sweeps inhaled dust and germs up and out of the lungs.",
  },
  "right-bronchus": {
    id: "right-bronchus",
    name: "Right Main Bronchus",
    role: "Wider, shorter, more vertical",
    color: "#67e8f9",
    bright: "#ecfeff",
    blurb:
      "The first branch off the carina. It's wider, shorter and more vertical than the left — which is exactly why inhaled foreign bodies (like a peanut) almost always end up in the RIGHT lung. It divides into three lobar bronchi for the right lung's three lobes: superior, middle and inferior.",
  },
  "left-bronchus": {
    id: "left-bronchus",
    name: "Left Main Bronchus",
    role: "Longer, more horizontal",
    color: "#0ea5e9",
    bright: "#bae6fd",
    blurb:
      "The second branch of the carina — longer and more horizontal, passing beneath the aortic arch before reaching the left lung's hilum. It divides into two lobar bronchi for the left lung's two lobes (superior and inferior), because the heart claims a third of that side's space — the cardiac notch you can see in the lung's inner edge is where it sits.",
  },
  bronchioles: {
    id: "bronchioles",
    name: "Bronchioles",
    role: "The branching small airways",
    color: "#7dd3fc",
    bright: "#e0f2fe",
    blurb:
      "The narrowing airway tree — no cartilage, just smooth muscle — so they can widen (bronchodilate) or clamp down (bronchoconstrict) on demand. In asthma that muscle spasms and the airways narrow, making every breath wheezy. The last generations, the respiratory bronchioles, sprout the first alveoli and begin gas exchange.",
  },
  alveoli: {
    id: "alveoli",
    name: "Alveoli",
    role: "Where oxygen meets blood",
    color: "#f472b6",
    bright: "#fbcfe8",
    blurb:
      "Tiny air sacs — about 300-500 million of them, with a total surface area of 70-100 m², roughly the size of a tennis court. Their walls are one cell thick and wrapped in a dense capillary mesh, so oxygen diffuses into the blood and carbon dioxide diffuses out across a barrier just half a micrometre wide. Surfactant lines them so they don't collapse on every breath out.",
  },
  diaphragm: {
    id: "diaphragm",
    name: "Diaphragm",
    role: "The main breathing muscle",
    color: "#fb7185",
    bright: "#fecdd3",
    blurb:
      "The dome-shaped muscle separating chest from abdomen that drives ~75% of every breath you take. When it contracts it flattens, enlarging the thoracic cavity and sucking air in; when it relaxes it domes back up and air flows out. It's powered by the phrenic nerve from C3-C5 — the rule of thumb 'C3, 4, 5 keeps you alive.'",
  },
};

/* ------------------------------------------------------------------ */
/* Shared interactivity                                                */
/*                                                                    */
/* Every region is INDEPENDENT: hovering or clicking one part never    */
/* lights up its neighbours. Each structure has its own path, so the   */
/* pointer hits exactly one part and only that one glows.              */
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
/* Geometry                                                            */
/* ------------------------------------------------------------------ */

/* Cartilage rings across the trachea */
const RINGS = [188, 204, 220, 236, 252, 268, 284];

/* The branching airway tree inside both lungs */
const BRONCHIOLES: { id: string; d: string; dur: number }[] = [
  // right lung (hilum at 334,340)
  { id: "rb1", d: "M 334 340 C 352 348, 370 350, 392 348 C 406 346, 418 342, 428 336", dur: 1.4 },
  { id: "rb1s", d: "M 392 348 C 402 356, 408 366, 412 378", dur: 1.5 },
  { id: "rb2", d: "M 334 340 C 344 360, 350 380, 352 402", dur: 1.5 },
  { id: "rb2s", d: "M 352 402 C 366 414, 376 428, 382 444", dur: 1.6 },
  { id: "rb3", d: "M 334 340 C 356 372, 372 400, 382 432", dur: 1.6 },
  { id: "rb3s", d: "M 382 432 C 394 450, 402 468, 408 488", dur: 1.7 },
  { id: "rb4", d: "M 334 340 C 344 368, 346 396, 344 424", dur: 1.5 },
  { id: "rb4s", d: "M 344 424 C 332 440, 324 458, 320 476", dur: 1.6 },
  { id: "rb5", d: "M 334 340 C 366 356, 396 366, 424 372", dur: 1.4 },
  { id: "rb5s", d: "M 420 374 C 426 384, 428 392, 428 400", dur: 1.5 },
  { id: "rb6", d: "M 334 340 C 362 392, 388 440, 406 484", dur: 1.7 },
  { id: "rb7", d: "M 334 340 C 340 420, 342 460, 340 500", dur: 1.8 },
  { id: "rb7s", d: "M 340 500 C 352 510, 362 516, 372 524", dur: 1.5 },
  { id: "rb8", d: "M 334 340 C 372 410, 396 452, 416 492", dur: 1.7 },
  // left lung (hilum at 188,342)
  { id: "lb1", d: "M 188 342 C 170 350, 152 352, 130 350 C 114 348, 102 344, 92 338", dur: 1.4 },
  { id: "lb1s", d: "M 130 350 C 118 358, 110 368, 106 380", dur: 1.5 },
  { id: "lb2", d: "M 188 342 C 178 362, 172 382, 170 404", dur: 1.5 },
  { id: "lb2s", d: "M 170 404 C 154 418, 144 434, 138 450", dur: 1.6 },
  { id: "lb3", d: "M 188 342 C 166 374, 150 402, 140 434", dur: 1.6 },
  { id: "lb3s", d: "M 140 434 C 126 454, 116 476, 110 496", dur: 1.7 },
  { id: "lb4", d: "M 188 342 C 178 370, 176 398, 178 426", dur: 1.5 },
  { id: "lb4s", d: "M 178 426 C 190 442, 198 460, 200 478", dur: 1.6 },
  { id: "lb5", d: "M 188 342 C 156 358, 126 368, 98 374", dur: 1.4 },
  { id: "lb5s", d: "M 98 374 C 90 382, 86 392, 86 402", dur: 1.5 },
  { id: "lb6", d: "M 188 342 C 160 394, 134 442, 116 486", dur: 1.7 },
  { id: "lb7", d: "M 188 342 C 182 422, 180 462, 182 502", dur: 1.8 },
  { id: "lb7s", d: "M 182 502 C 170 512, 160 518, 150 528", dur: 1.5 },
  { id: "lb8", d: "M 188 342 C 150 412, 126 454, 106 494", dur: 1.7 },
];

/* Alveoli — grape-like sacs at the branch ends (pink/purple pulse) */
const ALVEOLI: { x: number; y: number; delay: number }[] = [
  // right lung
  { x: 428, y: 336, delay: 0 },
  { x: 421, y: 341, delay: 0.4 },
  { x: 434, y: 342, delay: 0.8 },
  { x: 412, y: 378, delay: 0.3 },
  { x: 405, y: 384, delay: 0.7 },
  { x: 418, y: 385, delay: 1.1 },
  { x: 382, y: 444, delay: 0.6 },
  { x: 375, y: 450, delay: 1.0 },
  { x: 388, y: 451, delay: 1.4 },
  { x: 404, y: 486, delay: 0.9 },
  { x: 397, y: 492, delay: 1.3 },
  { x: 410, y: 493, delay: 1.7 },
  { x: 320, y: 476, delay: 1.2 },
  { x: 313, y: 482, delay: 1.6 },
  { x: 326, y: 483, delay: 0.2 },
  { x: 424, y: 372, delay: 0.5 },
  { x: 417, y: 378, delay: 0.9 },
  { x: 430, y: 379, delay: 1.3 },
  { x: 372, y: 524, delay: 1.1 },
  { x: 365, y: 530, delay: 1.5 },
  { x: 378, y: 531, delay: 0.1 },
  // left lung
  { x: 92, y: 338, delay: 0.4 },
  { x: 85, y: 344, delay: 0.8 },
  { x: 98, y: 345, delay: 1.2 },
  { x: 106, y: 380, delay: 0.7 },
  { x: 99, y: 386, delay: 1.1 },
  { x: 112, y: 387, delay: 1.5 },
  { x: 138, y: 450, delay: 1.0 },
  { x: 131, y: 456, delay: 1.4 },
  { x: 144, y: 457, delay: 0.3 },
  { x: 110, y: 496, delay: 1.3 },
  { x: 103, y: 502, delay: 1.7 },
  { x: 116, y: 503, delay: 0.6 },
  { x: 200, y: 478, delay: 0.2 },
  { x: 193, y: 484, delay: 0.6 },
  { x: 206, y: 485, delay: 1.0 },
  { x: 86, y: 402, delay: 0.9 },
  { x: 79, y: 408, delay: 1.3 },
  { x: 92, y: 409, delay: 1.7 },
  { x: 150, y: 528, delay: 0.5 },
  { x: 143, y: 534, delay: 0.9 },
  { x: 156, y: 535, delay: 1.3 },
];

const ALVEOLI_COLORS = ["#f472b6", "#f0abfc", "#c084fc"];

/* Small energy sparks riding down the airways */
const SPARKS: { x: number; y: number; delay: number; color: string }[] = [
  { x: 260, y: 192, delay: 0, color: "#67e8f9" },
  { x: 260, y: 226, delay: 0.4, color: "#67e8f9" },
  { x: 260, y: 260, delay: 0.8, color: "#67e8f9" },
  { x: 260, y: 288, delay: 1.2, color: "#67e8f9" },
  { x: 280, y: 308, delay: 0.6, color: "#7dd3fc" },
  { x: 300, y: 322, delay: 1.0, color: "#7dd3fc" },
  { x: 318, y: 331, delay: 1.4, color: "#7dd3fc" },
  { x: 240, y: 312, delay: 0.8, color: "#7dd3fc" },
  { x: 220, y: 324, delay: 1.2, color: "#7dd3fc" },
  { x: 202, y: 334, delay: 1.6, color: "#7dd3fc" },
];

/* ------------------------------------------------------------------ */
/* Per-part SVG shapes                                                 */
/* ------------------------------------------------------------------ */

function PartShape({ id, active }: { id: PartId; active: boolean }) {
  const c = PARTS[id].color;

  switch (id) {
    case "larynx":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 14px ${c})` : undefined }}>
          {/* epiglottis flap */}
          <path
            d="M 258 138 C 251 128, 251 118, 259 112 C 265 118, 266 128, 262 138"
            fill="none"
            stroke={c}
            strokeWidth="2"
            strokeLinecap="round"
            opacity={active ? 0.95 : 0.6}
          />
          {/* thyroid cartilage box */}
          <path
            d="M 260 136 C 248 136, 242 144, 242 152 L 241 164 C 241 170, 245 175, 251 176 C 255 177, 265 177, 269 175 C 275 172, 279 167, 279 160 L 279 150 C 279 143, 272 136, 260 136 Z"
            fill={c}
            fillOpacity={active ? 0.45 : 0.2}
            stroke={c}
            strokeWidth={active ? 3 : 2}
            strokeOpacity={active ? 1 : 0.85}
            strokeLinejoin="round"
          />
          {/* thyroid notch */}
          <path d="M 254 136 C 257 142, 263 142, 266 136" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
          {/* vocal folds */}
          <path d="M 248 158 L 272 158" stroke="#ecfeff" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="2 3" opacity="0.6" />
        </g>
      );
    case "trachea":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 16px ${c})` : undefined }}>
          <path
            d="M 260 178 C 258 222, 258 260, 260 296"
            fill="none"
            stroke={c}
            strokeWidth={active ? 20 : 16}
            strokeLinecap="round"
            opacity={active ? 0.95 : 0.65}
          />
          <path
            d="M 260 180 C 258 222, 258 260, 260 294"
            fill="none"
            stroke="#ecfeff"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.5"
          />
          {RINGS.map((y) => (
            <path
              key={y}
              d={`M 251 ${y} L 269 ${y}`}
              stroke="#ecfeff"
              strokeWidth="2.4"
              strokeLinecap="round"
              opacity={active ? 0.7 : 0.45}
            />
          ))}
        </g>
      );
    case "right-bronchus":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 14px ${c})` : undefined }}>
          <path
            d="M 260 296 C 286 306, 308 318, 330 332"
            fill="none"
            stroke={c}
            strokeWidth={active ? 14 : 11}
            strokeLinecap="round"
            opacity={active ? 0.95 : 0.65}
          />
          <path
            d="M 261 298 C 286 308, 307 320, 328 331"
            fill="none"
            stroke="#ecfeff"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.45"
          />
          {/* lobar bronchus stubs */}
          <path d="M 330 332 C 340 338, 348 342, 354 345" fill="none" stroke={c} strokeWidth={active ? 5 : 4} strokeLinecap="round" opacity={active ? 0.9 : 0.55} />
          <path d="M 330 332 C 334 342, 336 352, 336 360" fill="none" stroke={c} strokeWidth={active ? 5 : 4} strokeLinecap="round" opacity={active ? 0.9 : 0.55} />
          <path d="M 330 332 C 332 344, 330 356, 328 366" fill="none" stroke={c} strokeWidth={active ? 5 : 4} strokeLinecap="round" opacity={active ? 0.9 : 0.55} />
        </g>
      );
    case "left-bronchus":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 14px ${c})` : undefined }}>
          <path
            d="M 260 296 C 234 308, 208 322, 188 338"
            fill="none"
            stroke={c}
            strokeWidth={active ? 12 : 9}
            strokeLinecap="round"
            opacity={active ? 0.95 : 0.65}
          />
          <path
            d="M 259 298 C 234 309, 209 322, 189 337"
            fill="none"
            stroke="#ecfeff"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.45"
          />
          {/* lobar bronchus stubs */}
          <path d="M 188 338 C 180 344, 174 348, 168 351" fill="none" stroke={c} strokeWidth={active ? 5 : 4} strokeLinecap="round" opacity={active ? 0.9 : 0.55} />
          <path d="M 188 338 C 186 348, 184 358, 184 366" fill="none" stroke={c} strokeWidth={active ? 5 : 4} strokeLinecap="round" opacity={active ? 0.9 : 0.55} />
        </g>
      );
    case "bronchioles":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 12px ${c})` : undefined }}>
          {BRONCHIOLES.map((b) => (
            <path
              key={b.id}
              d={b.d}
              fill="none"
              stroke={c}
              strokeWidth={active ? 3 : 2.2}
              strokeLinecap="round"
              opacity={active ? 0.95 : 0.55}
            />
          ))}
          {BRONCHIOLES.map((b) => (
            <motion.path
              key={b.id + "-flow"}
              d={b.d}
              fill="none"
              stroke="#e0f2fe"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeDasharray="2.5 12"
              opacity="0.85"
              animate={{ strokeDashoffset: [0, -29] }}
              transition={{ duration: b.dur, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </g>
      );
    case "alveoli":
      return (
        <g style={{ filter: active ? "drop-shadow(0 0 14px #f472b6)" : undefined }}>
          {ALVEOLI.map((a, i) => {
            const col = ALVEOLI_COLORS[i % ALVEOLI_COLORS.length];
            return (
              <motion.circle
                key={i}
                cx={a.x}
                cy={a.y}
                fill={col}
                stroke={active ? "#fdf2f8" : col}
                strokeWidth={active ? 1.2 : 0.7}
                animate={{ opacity: [0.4, active ? 1 : 0.85, 0.4], r: [3.4, active ? 5.6 : 4.3, 3.4] }}
                transition={{ duration: 2.8, repeat: Infinity, delay: a.delay, ease: "easeInOut" }}
              />
            );
          })}
        </g>
      );
    case "diaphragm":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 14px ${c})` : undefined }}>
          <path
            d="M 120 548 C 150 528, 200 514, 260 512 C 320 514, 370 528, 400 548 C 378 566, 338 578, 260 580 C 182 578, 142 566, 120 548 Z"
            fill={c}
            fillOpacity={active ? 0.4 : 0.16}
            stroke={c}
            strokeWidth={active ? 3 : 2}
            strokeOpacity={active ? 1 : 0.8}
            strokeLinejoin="round"
          />
          <path d="M 160 546 C 190 532, 230 524, 262 524" fill="none" stroke="#ffe4e6" strokeWidth="1.3" strokeLinecap="round" opacity={active ? 0.8 : 0.45} />
          <path d="M 186 562 C 216 550, 260 544, 300 546" fill="none" stroke="#ffe4e6" strokeWidth="1.3" strokeLinecap="round" opacity={active ? 0.8 : 0.45} />
          <ellipse cx="260" cy="518" rx="26" ry="7" fill="none" stroke="#ffe4e6" strokeWidth="1.3" strokeDasharray="2 3" opacity={active ? 0.8 : 0.4} />
        </g>
      );
  }
}

/* ------------------------------------------------------------------ */
/* Labels & legend                                                     */
/* ------------------------------------------------------------------ */

const LABELS: { text: string; x: number; y: number; anchor: "start" | "middle" | "end"; color: string }[] = [
  { text: "LARYNX", x: 302, y: 154, anchor: "start", color: "#38bdf8" },
  { text: "TRACHEA", x: 224, y: 240, anchor: "end", color: "#22d3ee" },
  { text: "RIGHT BRONCHUS", x: 346, y: 300, anchor: "start", color: "#67e8f9" },
  { text: "LEFT BRONCHUS", x: 146, y: 304, anchor: "end", color: "#0ea5e9" },
  { text: "BRONCHIOLES", x: 118, y: 428, anchor: "middle", color: "#7dd3fc" },
  { text: "ALVEOLI", x: 406, y: 448, anchor: "middle", color: "#f472b6" },
  { text: "DIAPHRAGM", x: 260, y: 604, anchor: "middle", color: "#fb7185" },
];

const LEGEND: { label: string; color: string }[] = [
  { label: "LARYNX", color: "#38bdf8" },
  { label: "TRACHEA", color: "#22d3ee" },
  { label: "RIGHT BRONCHUS", color: "#67e8f9" },
  { label: "LEFT BRONCHUS", color: "#0ea5e9" },
  { label: "BRONCHIOLES", color: "#7dd3fc" },
  { label: "ALVEOLI", color: "#f472b6" },
  { label: "DIAPHRAGM", color: "#fb7185" },
];

/* ------------------------------------------------------------------ */
/* Main diagram                                                        */
/* ------------------------------------------------------------------ */

const PARTS_ORDER: PartId[] = [
  "diaphragm",
  "larynx",
  "trachea",
  "right-bronchus",
  "left-bronchus",
  "bronchioles",
  "alveoli",
];

function LungsPart({ id, h }: { id: PartId; h: PartHandlers }) {
  // Only the part under the pointer (or explicitly selected) glows.
  const active = h.hover === id || h.selected === id;

  return (
    <g {...partProps(id, h)}>
      <PartShape id={id} active={active} />
    </g>
  );
}

export function LungsDiagram({ className }: { className?: string }) {
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
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#22d3ee]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-16 h-44 w-44 rounded-full bg-[#67e8f9]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-8 left-8 h-44 w-44 rounded-full bg-[#f472b6]/10 blur-3xl" />

      {/* hint + legend */}
      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <Info className="size-3.5 text-wistaria" />
          Hover to glow · click a part to learn what it does
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

      {/* the respiratory system */}
      <svg
        viewBox="0 0 520 640"
        className="relative mx-auto mt-2 block w-full max-w-[540px] select-none"
        role="img"
        aria-label="Interactive glowing lungs and respiratory system diagram"
      >
        <defs>
          {/* subtle heatwave distortion */}
          <filter id="lungs-heat" x="-6%" y="-6%" width="112%" height="112%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.024" numOctaves="2" seed="23" result="heat" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="heat"
              scale="5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        {/* faint head & thorax silhouette framing the airway */}
        <g pointerEvents="none" opacity="0.3">
          <ellipse cx="260" cy="104" rx="54" ry="62" fill="none" stroke="#cbd5e1" strokeOpacity="0.16" strokeWidth="1.5" />
          <path d="M 260 52 L 250 76 Q 260 84 270 76 Z" fill="none" stroke="#cbd5e1" strokeOpacity="0.14" strokeWidth="1.3" />
          <path d="M 244 158 L 244 200 L 276 200 L 276 158 Z" fill="none" stroke="#cbd5e1" strokeOpacity="0.14" strokeWidth="1.3" />
          <path
            d="M 244 206 C 190 212, 142 252, 130 322 L 130 606 C 150 616, 370 616, 390 606 L 390 322 C 378 252, 330 212, 276 206 Z"
            fill="none"
            stroke="#cbd5e1"
            strokeOpacity="0.13"
            strokeWidth="1.4"
          />
        </g>

        {/* slowly rotating energy ring */}
        <motion.circle
          cx="260"
          cy="390"
          r="285"
          fill="none"
          stroke="#67e8f9"
          strokeWidth="1.2"
          strokeDasharray="3 16"
          opacity="0.22"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
        />

        {/* the respiratory system, breathing under the heat haze */}
        <motion.g
          filter="url(#lungs-heat)"
          animate={{ scale: [1, 1.01, 1] }}
          transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
        >
          {/* lung silhouettes + lobe fissures + heart (visual only) */}
          <g pointerEvents="none">
            {/* right lung — three lobes */}
            <path
              d="M 312 268 C 352 258, 400 262, 424 280 C 448 300, 450 340, 442 380 C 436 420, 424 470, 402 500 C 384 524, 352 536, 326 528 C 306 522, 300 500, 300 470 C 300 430, 302 380, 304 340 C 305 310, 306 285, 312 268 Z"
              fill="#bae6fd"
              fillOpacity="0.05"
              stroke="#bae6fd"
              strokeOpacity="0.22"
              strokeWidth="1.4"
            />
            {/* left lung — two lobes + cardiac notch */}
            <path
              d="M 208 272 C 168 262, 120 266, 96 284 C 72 304, 70 344, 78 384 C 84 424, 96 474, 118 504 C 136 528, 168 540, 194 532 C 212 526, 219 508, 222 488 C 224 468, 226 440, 224 420 C 222 400, 216 380, 214 360 C 213 330, 211 300, 208 272 Z"
              fill="#bae6fd"
              fillOpacity="0.05"
              stroke="#bae6fd"
              strokeOpacity="0.22"
              strokeWidth="1.4"
            />
            {/* fissure lines */}
            <path d="M 302 342 C 336 336, 376 340, 420 352" fill="none" stroke="#7dd3fc" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 5" />
            <path d="M 316 296 C 362 330, 414 380, 432 462" fill="none" stroke="#7dd3fc" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="2 5" />
            <path d="M 206 298 C 158 330, 104 380, 86 464" fill="none" stroke="#7dd3fc" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="2 5" />
            {/* faint heart in the mediastinum, tucked under the left lung's notch */}
            <path
              d="M 262 412 C 260 402, 250 392, 240 395 C 231 398, 228 408, 231 417 C 235 429, 250 437, 262 441 C 274 437, 289 429, 293 417 C 296 408, 293 398, 284 395 C 274 392, 264 402, 262 412 Z"
              fill="#fb7185"
              fillOpacity="0.35"
              stroke="#fb7185"
              strokeOpacity="0.5"
              strokeWidth="1.2"
            />
            {/* carina ridge */}
            <path d="M 253 296 C 257 302, 263 302, 267 296" fill="none" stroke="#e0f2fe" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          </g>

          {PARTS_ORDER.map((id) => (
            <LungsPart key={id} id={id} h={h} />
          ))}

          {/* airway energy sparks (visual only) */}
          <g pointerEvents="none">
            {SPARKS.map((s, i) => (
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
              Tap the trachea, the bronchi, the bronchioles — or the pink alveoli where oxygen meets blood.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
