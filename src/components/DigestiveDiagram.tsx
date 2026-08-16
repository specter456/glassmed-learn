import { AnimatePresence, motion } from "framer-motion";
import { Info, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Parts — everything you can hover and tap                            */
/* ------------------------------------------------------------------ */

type PartId =
  | "esophagus"
  | "stomach"
  | "liver"
  | "gallbladder"
  | "pancreas"
  | "small-intestine"
  | "large-intestine";

interface DigestivePart {
  id: PartId;
  name: string;
  role: string;
  blurb: string;
  color: string;
  bright: string;
}

const PARTS: Record<PartId, DigestivePart> = {
  esophagus: {
    id: "esophagus",
    name: "Esophagus",
    role: "The food expressway",
    color: "#fdba74",
    bright: "#ffedd5",
    blurb:
      "Your 25 cm food expressway. Wave-like contractions called peristalsis squeeze each bolus from the throat to the stomach in about 5-10 seconds. It pierces the diaphragm through the esophageal hiatus, and the lower esophageal sphincter at its end clamps shut to keep stomach acid from splashing back up — heartburn is what happens when that clamp fails.",
  },
  stomach: {
    id: "stomach",
    name: "Stomach",
    role: "Acid & enzyme blender",
    color: "#f97316",
    bright: "#fed7aa",
    blurb:
      "An expandable J-shaped sac that holds up to ~2 litres. Hydrochloric acid and the enzyme pepsin start breaking proteins down while rhythmic churning grinds food into a thick soup called chyme. Its rugae folds let it balloon out, and it releases chyme slowly through the pylorus so the small intestine isn't flooded. It also makes intrinsic factor — without it, vitamin B12 can't be absorbed.",
  },
  liver: {
    id: "liver",
    name: "Liver",
    role: "The body's chemical factory",
    color: "#f59e0b",
    bright: "#fde68a",
    blurb:
      "Your largest internal organ, ~1.5 kg, quietly running 500+ jobs: it makes bile for fat digestion, detoxifies alcohol and drugs, stores glycogen as an energy reserve, and manufactures blood proteins like albumin and clotting factors. It's the only organ that can regenerate — it can regrow after losing up to 70% of itself.",
  },
  gallbladder: {
    id: "gallbladder",
    name: "Gallbladder",
    role: "The bile reservoir",
    color: "#fbbf24",
    bright: "#fef3c7",
    blurb:
      "A small pear-shaped pouch tucked beneath the liver that stores and concentrates bile. When a fatty meal arrives, it contracts and squirts bile through the cystic duct into the duodenum to emulsify the fat. Gallstones are crystallised cholesterol or bile pigment that form when bile lingers too long.",
  },
  pancreas: {
    id: "pancreas",
    name: "Pancreas",
    role: "Enzyme & insulin maker",
    color: "#facc15",
    bright: "#fef9c3",
    blurb:
      "A dual-purpose gland lying behind the stomach. Its exocrine part pours digestive enzymes — lipase for fats, amylase for carbs, trypsin for proteins — through the pancreatic duct into the duodenum. Its endocrine part, the islets of Langerhans, releases insulin and glucagon straight into the blood to control sugar. The head nestles snugly inside the duodenum's C-shaped curve.",
  },
  "small-intestine": {
    id: "small-intestine",
    name: "Small Intestine",
    role: "Where absorption happens",
    color: "#fde047",
    bright: "#fefce8",
    blurb:
      "Where digestion finishes and absorption really happens — about 6 metres long (duodenum, jejunum, ileum). Its walls are lined with villi and microvilli that give it a surface area of roughly 250 m² — a tennis court — so nutrients can pour into the bloodstream. Food spends 3-5 hours here being dismantled and absorbed.",
  },
  "large-intestine": {
    id: "large-intestine",
    name: "Large Intestine",
    role: "Water recycler & waste handler",
    color: "#fb923c",
    bright: "#ffedd5",
    blurb:
      "Your ~1.5 m water recycler: cecum, ascending, transverse, descending and sigmoid colon, then the rectum. It absorbs water and electrolytes back into the body and hosts trillions of gut bacteria that ferment leftover fibre — making vitamin K and other useful compounds along the way. The appendix, a small lymphoid sac on the cecum, is a safe-house for good bacteria. What's left becomes faeces.",
  },
};

/* ------------------------------------------------------------------ */
/* Shared interactivity                                                */
/*                                                                    */
/* Every organ is INDEPENDENT: hovering or clicking one part never     */
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

/* Small-intestine coils — the coiled jejunum/ileum mass */
const COILS: { id: string; d: string; dur: number }[] = [
  { id: "c1", d: "M 250 532 C 268 528, 284 532, 290 542 C 296 552, 288 560, 274 562", dur: 1.5 },
  { id: "c2", d: "M 274 562 C 260 564, 248 558, 246 546", dur: 1.4 },
  { id: "c3", d: "M 246 546 C 244 556, 250 566, 264 572", dur: 1.6 },
  { id: "c4", d: "M 264 572 C 278 578, 294 576, 302 566", dur: 1.5 },
  { id: "c5", d: "M 302 566 C 310 556, 310 542, 302 534", dur: 1.4 },
  { id: "c6", d: "M 302 534 C 294 526, 282 524, 272 528", dur: 1.5 },
  { id: "c7", d: "M 250 534 C 234 538, 224 548, 226 560", dur: 1.6 },
  { id: "c8", d: "M 226 560 C 228 572, 240 580, 254 582", dur: 1.5 },
  { id: "c9", d: "M 254 582 C 242 588, 228 590, 218 582", dur: 1.6 },
  { id: "c10", d: "M 218 582 C 210 574, 212 562, 222 554", dur: 1.4 },
  { id: "c11", d: "M 222 554 C 232 546, 244 542, 256 544", dur: 1.5 },
  { id: "c12", d: "M 290 542 C 298 550, 296 560, 288 566", dur: 1.5 },
  { id: "c13", d: "M 260 582 C 272 588, 286 588, 296 582", dur: 1.6 },
  { id: "c14", d: "M 296 582 C 306 576, 312 566, 310 554", dur: 1.4 },
  { id: "c15", d: "M 254 592 C 244 596, 232 596, 224 590", dur: 1.5 },
  { id: "c16", d: "M 224 590 C 218 586, 218 578, 224 574", dur: 1.4 },
  { id: "c17", d: "M 306 592 C 316 596, 326 596, 332 590", dur: 1.5 },
  { id: "c18", d: "M 200 560 C 194 566, 194 574, 200 578", dur: 1.4 },
  { id: "c19", d: "M 236 570 C 230 576, 232 584, 238 588", dur: 1.5 },
];

/* Haustra — the sacculation notches along the colon */
const HAUSTRA: { id: string; d: string }[] = [
  { id: "a1", d: "M 352 470 L 372 476" },
  { id: "a2", d: "M 352 500 L 372 506" },
  { id: "a3", d: "M 354 530 L 372 536" },
  { id: "t1", d: "M 320 380 L 324 400" },
  { id: "t2", d: "M 280 378 L 282 398" },
  { id: "t3", d: "M 240 378 L 240 398" },
  { id: "t4", d: "M 200 384 L 198 404" },
  { id: "t5", d: "M 170 396 L 164 412" },
  { id: "d1", d: "M 130 460 L 152 464" },
  { id: "d2", d: "M 130 490 L 152 494" },
];

/* The colon's picture-frame route around the small intestine */
const COLON_D =
  "M 350 560 C 360 520, 374 480, 382 440 C 388 410, 380 396, 358 392 C 320 386, 240 384, 200 392 C 168 398, 150 406, 146 424 C 142 460, 140 490, 140 520 C 140 540, 150 556, 170 560 C 200 566, 220 570, 232 584 C 240 596, 240 606, 240 616";

/* The duodenum's C-loop wrapping the pancreatic head */
const DUODENUM_D = "M 264 504 C 278 508, 284 524, 278 538 C 272 552, 256 556, 242 552 C 228 548, 222 536, 224 524";

/* Warm energy sparks riding along the tract */
const SPARKS: { x: number; y: number; delay: number; color: string }[] = [
  { x: 260, y: 190, delay: 0, color: "#fde047" },
  { x: 260, y: 240, delay: 0.4, color: "#fde047" },
  { x: 260, y: 290, delay: 0.8, color: "#fde047" },
  { x: 262, y: 322, delay: 1.2, color: "#fde047" },
  { x: 226, y: 372, delay: 0.6, color: "#fde047" },
  { x: 184, y: 430, delay: 1.0, color: "#fde047" },
  { x: 210, y: 500, delay: 1.4, color: "#fde047" },
  { x: 356, y: 500, delay: 0.8, color: "#fde047" },
  { x: 300, y: 392, delay: 1.2, color: "#fde047" },
  { x: 146, y: 470, delay: 1.6, color: "#fde047" },
];

/* ------------------------------------------------------------------ */
/* Per-part SVG shapes                                                 */
/* ------------------------------------------------------------------ */

function PartShape({ id, active }: { id: PartId; active: boolean }) {
  const c = PARTS[id].color;

  switch (id) {
    case "esophagus":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 16px ${c})` : undefined }}>
          <path
            d="M 260 148 C 258 210, 259 270, 262 336"
            fill="none"
            stroke={c}
            strokeWidth={active ? 13 : 10}
            strokeLinecap="round"
            opacity={active ? 0.95 : 0.7}
          />
          <path
            d="M 260 152 C 258 212, 259 270, 262 332"
            fill="none"
            stroke="#ffedd5"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.5"
          />
        </g>
      );
    case "liver":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 16px ${c})` : undefined }}>
          <path
            d="M 236 332 C 240 296, 262 262, 296 250 C 330 238, 392 240, 426 258 C 456 274, 462 310, 452 340 C 442 366, 414 378, 380 380 C 344 382, 308 376, 282 366 C 258 356, 240 344, 236 332 Z"
            fill={c}
            fillOpacity={active ? 0.45 : 0.2}
            stroke={c}
            strokeWidth={active ? 3 : 2}
            strokeOpacity={active ? 1 : 0.85}
            strokeLinejoin="round"
          />
          <path d="M 262 340 C 290 320, 320 300, 352 288" fill="none" stroke="#fef3c7" strokeWidth="1.2" strokeLinecap="round" opacity={active ? 0.7 : 0.4} />
          <path d="M 300 340 C 320 326, 344 316, 368 310" fill="none" stroke="#fef3c7" strokeWidth="1" strokeLinecap="round" opacity={active ? 0.6 : 0.3} />
          <path d="M 286 360 C 310 350, 336 344, 360 340" fill="none" stroke="#fef3c7" strokeWidth="1" strokeLinecap="round" opacity={active ? 0.6 : 0.3} />
        </g>
      );
    case "gallbladder":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 14px ${c})` : undefined }}>
          <path
            d="M 322 380 C 332 374, 344 374, 350 382 C 354 390, 352 402, 344 410 C 338 416, 328 418, 322 412 C 314 404, 314 390, 322 380 Z"
            fill={c}
            fillOpacity={active ? 0.5 : 0.22}
            stroke={c}
            strokeWidth={active ? 3 : 2}
            strokeOpacity={active ? 1 : 0.85}
            strokeLinejoin="round"
          />
          <path d="M 336 376 C 336 370, 336 366, 338 362" fill="none" stroke={c} strokeWidth={active ? 3 : 2.2} strokeLinecap="round" opacity={active ? 0.9 : 0.5} />
        </g>
      );
    case "pancreas":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 14px ${c})` : undefined }}>
          <path
            d="M 240 480 C 262 482, 268 498, 260 514 C 254 526, 240 530, 230 524 C 220 518, 214 506, 210 494 C 196 486, 180 476, 164 470 C 146 462, 132 454, 126 444 C 122 436, 130 430, 142 432 C 158 434, 174 442, 190 450 C 208 458, 226 470, 240 480 Z"
            fill={c}
            fillOpacity={active ? 0.5 : 0.22}
            stroke={c}
            strokeWidth={active ? 3 : 2}
            strokeOpacity={active ? 1 : 0.85}
            strokeLinejoin="round"
          />
          <path d="M 132 448 C 160 456, 190 466, 218 482" fill="none" stroke="#fefce8" strokeWidth="1.3" strokeLinecap="round" opacity={active ? 0.8 : 0.5} />
        </g>
      );
    case "stomach":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 16px ${c})` : undefined }}>
          <path
            d="M 262 338 C 266 324, 250 322, 238 326 C 226 330, 220 340, 218 352 C 214 376, 198 404, 178 434 C 162 458, 156 482, 166 504 C 174 520, 200 528, 228 524 C 246 521, 258 514, 264 504 C 258 488, 246 464, 240 436 C 234 408, 234 380, 242 356 C 246 346, 254 342, 262 338 Z"
            fill={c}
            fillOpacity={active ? 0.45 : 0.2}
            stroke={c}
            strokeWidth={active ? 3 : 2}
            strokeOpacity={active ? 1 : 0.85}
            strokeLinejoin="round"
          />
          <path d="M 240 360 C 228 380, 220 400, 222 420" fill="none" stroke="#ffedd5" strokeWidth="1.2" strokeLinecap="round" opacity={active ? 0.8 : 0.45} />
          <path d="M 248 352 C 238 372, 230 394, 232 414" fill="none" stroke="#ffedd5" strokeWidth="1.2" strokeLinecap="round" opacity={active ? 0.8 : 0.45} />
          <path d="M 220 430 C 208 448, 200 462, 204 480" fill="none" stroke="#ffedd5" strokeWidth="1.2" strokeLinecap="round" opacity={active ? 0.8 : 0.45} />
        </g>
      );
    case "small-intestine":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 12px ${c})` : undefined }}>
          {/* coils */}
          {COILS.map((coil) => (
            <path
              key={coil.id}
              d={coil.d}
              fill="none"
              stroke={c}
              strokeWidth={active ? 3 : 2.2}
              strokeLinecap="round"
              opacity={active ? 0.95 : 0.6}
            />
          ))}
          {/* duodenum C-loop on top of the coils */}
          <path d={DUODENUM_D} fill="none" stroke={c} strokeWidth={active ? 11 : 9} strokeLinecap="round" opacity={active ? 0.95 : 0.7} />
          {/* flow */}
          <motion.path
            d={DUODENUM_D}
            fill="none"
            stroke="#fefce8"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="3 13"
            opacity="0.9"
            animate={{ strokeDashoffset: [0, -32] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          />
          {COILS.map((coil) => (
            <motion.path
              key={coil.id + "-flow"}
              d={coil.d}
              fill="none"
              stroke="#fefce8"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeDasharray="2.5 12"
              opacity="0.85"
              animate={{ strokeDashoffset: [0, -29] }}
              transition={{ duration: coil.dur, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </g>
      );
    case "large-intestine":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 14px ${c})` : undefined }}>
          {/* cecum + appendix */}
          <circle
            cx="350"
            cy="560"
            r={active ? 16 : 13}
            fill={c}
            fillOpacity={active ? 0.55 : 0.3}
            stroke={c}
            strokeWidth={active ? 3 : 2}
            strokeOpacity={active ? 1 : 0.85}
          />
          <path d="M 350 572 C 358 586, 352 598, 342 604" fill="none" stroke={c} strokeWidth={active ? 7 : 5.5} strokeLinecap="round" opacity={active ? 0.95 : 0.7} />
          {/* colon frame */}
          <path
            d={COLON_D}
            fill="none"
            stroke={c}
            strokeWidth={active ? 22 : 18}
            strokeLinecap="round"
            opacity={active ? 0.95 : 0.7}
          />
          <path d={COLON_D} fill="none" stroke="#ffedd5" strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
          {/* haustra */}
          {HAUSTRA.map((t) => (
            <path
              key={t.id}
              d={t.d}
              fill="none"
              stroke="#fef3c7"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity={active ? 0.6 : 0.35}
            />
          ))}
          {/* flow */}
          <motion.path
            d={COLON_D}
            fill="none"
            stroke="#fefce8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="3 15"
            opacity="0.9"
            animate={{ strokeDashoffset: [0, -36] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
          />
        </g>
      );
  }
}

/* ------------------------------------------------------------------ */
/* Labels & legend                                                     */
/* ------------------------------------------------------------------ */

const LABELS: { text: string; x: number; y: number; anchor: "start" | "middle" | "end"; color: string }[] = [
  { text: "ESOPHAGUS", x: 288, y: 200, anchor: "start", color: "#fdba74" },
  { text: "LIVER", x: 366, y: 300, anchor: "middle", color: "#f59e0b" },
  { text: "GALLBLADDER", x: 362, y: 398, anchor: "start", color: "#fbbf24" },
  { text: "STOMACH", x: 196, y: 438, anchor: "middle", color: "#f97316" },
  { text: "PANCREAS", x: 108, y: 436, anchor: "end", color: "#facc15" },
  { text: "SMALL INTESTINE", x: 248, y: 568, anchor: "middle", color: "#fde047" },
  { text: "LARGE INTESTINE", x: 392, y: 520, anchor: "start", color: "#fb923c" },
];

const LEGEND: { label: string; color: string }[] = [
  { label: "ESOPHAGUS", color: "#fdba74" },
  { label: "STOMACH", color: "#f97316" },
  { label: "LIVER", color: "#f59e0b" },
  { label: "GALLBLADDER", color: "#fbbf24" },
  { label: "PANCREAS", color: "#facc15" },
  { label: "SMALL INTESTINE", color: "#fde047" },
  { label: "LARGE INTESTINE", color: "#fb923c" },
];

/* ------------------------------------------------------------------ */
/* Main diagram                                                        */
/* ------------------------------------------------------------------ */

const PARTS_ORDER: PartId[] = [
  "pancreas",
  "esophagus",
  "liver",
  "gallbladder",
  "stomach",
  "small-intestine",
  "large-intestine",
];

function DigestivePart({ id, h }: { id: PartId; h: PartHandlers }) {
  // Only the part under the pointer (or explicitly selected) glows.
  const active = h.hover === id || h.selected === id;

  return (
    <g {...partProps(id, h)}>
      <PartShape id={id} active={active} />
    </g>
  );
}

export function DigestiveDiagram({ className }: { className?: string }) {
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
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f59e0b]/10 blur-3xl" />
      <div className="pointer-events-none absolute left-10 top-16 h-44 w-44 rounded-full bg-[#fb923c]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-8 right-10 h-44 w-44 rounded-full bg-[#fde047]/10 blur-3xl" />

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

      {/* the digestive system */}
      <svg
        viewBox="0 0 520 640"
        className="relative mx-auto mt-2 block w-full max-w-[540px] select-none"
        role="img"
        aria-label="Interactive glowing digestive system diagram"
      >
        <defs>
          {/* subtle heatwave distortion */}
          <filter id="digestive-heat" x="-6%" y="-6%" width="112%" height="112%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.024" numOctaves="2" seed="37" result="heat" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="heat"
              scale="5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        {/* faint head & torso silhouette framing the tract */}
        <g pointerEvents="none" opacity="0.3">
          <ellipse cx="260" cy="104" rx="54" ry="62" fill="none" stroke="#cbd5e1" strokeOpacity="0.16" strokeWidth="1.5" />
          <path d="M 260 52 L 250 76 Q 260 84 270 76 Z" fill="none" stroke="#cbd5e1" strokeOpacity="0.14" strokeWidth="1.3" />
          <path d="M 244 158 L 244 200 L 276 200 L 276 158 Z" fill="none" stroke="#cbd5e1" strokeOpacity="0.14" strokeWidth="1.3" />
          <path
            d="M 244 206 C 190 212, 142 252, 130 322 L 130 624 C 150 634, 370 634, 390 624 L 390 322 C 378 252, 330 212, 276 206 Z"
            fill="none"
            stroke="#cbd5e1"
            strokeOpacity="0.13"
            strokeWidth="1.4"
          />
        </g>

        {/* slowly rotating energy ring */}
        <motion.circle
          cx="260"
          cy="430"
          r="245"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="1.2"
          strokeDasharray="3 16"
          opacity="0.22"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
        />

        {/* the digestive system, pulsing under the heat haze */}
        <motion.g
          filter="url(#digestive-heat)"
          animate={{ scale: [1, 1.008, 1] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
        >
          {/* faint diaphragm dome (visual only) */}
          <g pointerEvents="none">
            <path
              d="M 120 356 C 160 336, 220 326, 260 326 C 300 326, 360 336, 400 356 C 380 372, 340 380, 260 380 C 180 380, 140 372, 120 356 Z"
              fill="#fb923c"
              fillOpacity="0.04"
              stroke="#fb923c"
              strokeOpacity="0.12"
              strokeWidth="1"
            />
          </g>

          {PARTS_ORDER.map((id) => (
            <DigestivePart key={id} id={id} h={h} />
          ))}

          {/* warm energy sparks along the tract (visual only) */}
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
              Tap the stomach, the liver, or the pancreas — or follow the glow from the esophagus to the colon.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
