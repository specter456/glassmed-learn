import { AnimatePresence, motion } from "framer-motion";
import { Info, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Palette — a spectrum flowing from spine (cyan) to arm (pink)        */
/* ------------------------------------------------------------------ */

const LEVELS = {
  roots: { color: "#5fb6f5", bright: "#9fe8ff", label: "ROOTS" },
  trunks: { color: "#a2a2d0", bright: "#d9d2ff", label: "TRUNKS" },
  divisions: { color: "#5fd9c8", bright: "#b5f6ea", label: "DIVISIONS" },
  cords: { color: "#8a8ff0", bright: "#c3c6ff", label: "CORDS" },
  branches: { color: "#ff7fa5", bright: "#ffc2d5", label: "BRANCHES" },
  detail: { color: "#9aa3c7", bright: "#cdd3ea", label: "DETAIL NERVES" },
} as const;

type Level = keyof typeof LEVELS;

/* ------------------------------------------------------------------ */
/* Parts — everything you can hover and tap                            */
/* ------------------------------------------------------------------ */

type PartId =
  | "c5"
  | "c6"
  | "c7"
  | "c8"
  | "t1"
  | "trunk-upper"
  | "trunk-middle"
  | "trunk-lower"
  | "divisions"
  | "cord-lateral"
  | "cord-posterior"
  | "cord-medial"
  | "branch-musculocutaneous"
  | "branch-median"
  | "branch-ulnar"
  | "branch-radial"
  | "branch-axillary"
  | "suprascapular"
  | "long-thoracic";

interface PlexusPart {
  id: PartId;
  name: string;
  role: string;
  blurb: string;
  level: Level;
}

const PARTS: Record<PartId, PlexusPart> = {
  c5: {
    id: "c5",
    name: "C5 Root",
    role: "Ventral ramus of C5",
    level: "roots",
    blurb:
      "The first root of the plexus. It joins C6 to form the upper trunk, and contributes fibres to the dorsal scapular and long thoracic nerves.",
  },
  c6: {
    id: "c6",
    name: "C6 Root",
    role: "Joins C5 → upper trunk",
    level: "roots",
    blurb:
      "Joins C5 to form the upper trunk and contributes to the long thoracic nerve. Its fibres travel to the lateral and posterior cords.",
  },
  c7: {
    id: "c7",
    name: "C7 Root",
    role: "Continues alone as the middle trunk",
    level: "roots",
    blurb:
      "The largest root of the plexus, it continues as the middle trunk — the only trunk formed by a single root. It contributes to the posterior cord heavily (radial nerve).",
  },
  c8: {
    id: "c8",
    name: "C8 Root",
    role: "Joins T1 → lower trunk",
    level: "roots",
    blurb:
      "Joins T1 to form the lower trunk. Its fibres travel to the medial cord and give the ulnar nerve its C8–T1 supply.",
  },
  t1: {
    id: "t1",
    name: "T1 Root",
    role: "Joins C8 → lower trunk",
    level: "roots",
    blurb:
      "The last root, joining C8 to form the lower trunk. Carries sympathetic fibres to the eye — why an apical lung tumour can cause a drooping eyelid (Horner's).",
  },
  "trunk-upper": {
    id: "trunk-upper",
    name: "Upper Trunk",
    role: "C5 + C6",
    level: "trunks",
    blurb:
      "Formed by the union of C5 and C6. Gives off the suprascapular nerve and the nerve to subclavius, then splits into anterior and posterior divisions.",
  },
  "trunk-middle": {
    id: "trunk-middle",
    name: "Middle Trunk",
    role: "C7",
    level: "trunks",
    blurb:
      "Simply the continuation of C7. Splits into anterior and posterior divisions that feed the lateral and posterior cords.",
  },
  "trunk-lower": {
    id: "trunk-lower",
    name: "Lower Trunk",
    role: "C8 + T1",
    level: "trunks",
    blurb:
      "Formed by C8 and T1. Its anterior division becomes the medial cord, and its posterior division joins the posterior cord.",
  },
  divisions: {
    id: "divisions",
    name: "Divisions",
    role: "Each trunk splits in two",
    level: "divisions",
    blurb:
      "Every trunk divides into an anterior division (destined for the flexor/anterior compartments) and a posterior division (destined for the extensor/posterior compartments). The six divisions then reorganise to form the three cords.",
  },
  "cord-lateral": {
    id: "cord-lateral",
    name: "Lateral Cord",
    role: "Anterior divisions of upper + middle trunks",
    level: "cords",
    blurb:
      "Formed by the anterior divisions of the upper and middle trunks. Gives the lateral pectoral nerve, the musculocutaneous nerve, and the lateral root of the median nerve.",
  },
  "cord-posterior": {
    id: "cord-posterior",
    name: "Posterior Cord",
    role: "Posterior divisions of all three trunks",
    level: "cords",
    blurb:
      "Formed by the posterior divisions of all three trunks — the plexus's biggest cord. Gives the axillary and radial nerves, plus the thoracodorsal and subscapular nerves.",
  },
  "cord-medial": {
    id: "cord-medial",
    name: "Medial Cord",
    role: "Anterior division of the lower trunk",
    level: "cords",
    blurb:
      "The continuation of the lower trunk's anterior division. Gives the ulnar nerve, medial pectoral, medial cutaneous nerves of the arm and forearm, and the medial root of the median nerve.",
  },
  "branch-musculocutaneous": {
    id: "branch-musculocutaneous",
    name: "Musculocutaneous Nerve",
    role: "C5–C7 via the lateral cord",
    level: "branches",
    blurb:
      "Supplies coracobrachialis, biceps and brachialis (flexion at the elbow and shoulder), then continues beyond the elbow as the lateral cutaneous nerve of the forearm.",
  },
  "branch-median": {
    id: "branch-median",
    name: "Median Nerve",
    role: "C5–T1 via lateral + medial cords",
    level: "branches",
    blurb:
      "Formed where the lateral and medial roots meet in front of the axillary artery. Supplies most forearm flexors and the thenar muscles. Injury produces the 'ape hand' deformity.",
  },
  "branch-ulnar": {
    id: "branch-ulnar",
    name: "Ulnar Nerve",
    role: "C8–T1 via the medial cord",
    level: "branches",
    blurb:
      "The 'funny bone' nerve. Supplies flexor carpi ulnaris, the medial half of flexor digitorum profundus, and most of the small muscles of the hand — the nerve of the claw hand.",
  },
  "branch-radial": {
    id: "branch-radial",
    name: "Radial Nerve",
    role: "C5–T1 via the posterior cord",
    level: "branches",
    blurb:
      "The nerve of wrist drop. Supplies triceps, brachioradialis and every wrist and finger extensor, then continues to the back of the forearm and hand.",
  },
  "branch-axillary": {
    id: "branch-axillary",
    name: "Axillary Nerve",
    role: "C5–C6 via the posterior cord",
    level: "branches",
    blurb:
      "Winds around the surgical neck of the humerus to supply deltoid and teres minor. Injury — classically shoulder dislocation — causes loss of shoulder abduction.",
  },
  suprascapular: {
    id: "suprascapular",
    name: "Suprascapular Nerve",
    role: "From the upper trunk (C5–C6)",
    level: "detail",
    blurb:
      "Leaves the upper trunk and heads to the supraspinatus and infraspinatus — the muscles that start shoulder abduction and externally rotate the arm.",
  },
  "long-thoracic": {
    id: "long-thoracic",
    name: "Long Thoracic Nerve",
    role: "From C5–C7 roots",
    level: "detail",
    blurb:
      "Runs down behind the plexus to supply serratus anterior. Injury (classically after axillary node surgery or backpack straps) causes a 'winged scapula'.",
  },
};

/* ------------------------------------------------------------------ */
/* Geometry — node positions per part                                  */
/* ------------------------------------------------------------------ */

const NODES: Record<PartId, { x: number; y: number; r: number }[]> = {
  c5: [{ x: 86, y: 70, r: 15 }],
  c6: [{ x: 86, y: 120, r: 15 }],
  c7: [{ x: 86, y: 170, r: 15 }],
  c8: [{ x: 86, y: 220, r: 15 }],
  t1: [{ x: 86, y: 270, r: 15 }],
  "trunk-upper": [{ x: 206, y: 95, r: 14 }],
  "trunk-middle": [{ x: 206, y: 170, r: 14 }],
  "trunk-lower": [{ x: 206, y: 245, r: 14 }],
  divisions: [
    { x: 330, y: 72, r: 8 },
    { x: 330, y: 118, r: 8 },
    { x: 330, y: 148, r: 8 },
    { x: 330, y: 192, r: 8 },
    { x: 330, y: 222, r: 8 },
    { x: 330, y: 268, r: 8 },
  ],
  "cord-lateral": [{ x: 460, y: 95, r: 15 }],
  "cord-posterior": [{ x: 460, y: 170, r: 15 }],
  "cord-medial": [{ x: 460, y: 245, r: 15 }],
  "branch-axillary": [{ x: 588, y: 50, r: 12 }],
  "branch-musculocutaneous": [{ x: 588, y: 95, r: 12 }],
  "branch-median": [{ x: 588, y: 160, r: 12 }],
  "branch-radial": [{ x: 588, y: 240, r: 12 }],
  "branch-ulnar": [{ x: 588, y: 305, r: 12 }],
  suprascapular: [{ x: 280, y: 44, r: 8 }],
  "long-thoracic": [{ x: 165, y: 392, r: 8 }],
};

/* ------------------------------------------------------------------ */
/* Nerves — the glowing lines with flowing energy                      */
/* ------------------------------------------------------------------ */

interface NerveLine {
  id: string;
  d: string;
  a: PartId;
  b: PartId;
  level: Level;
}

const NERVES: NerveLine[] = [
  // roots → trunks
  { id: "c5-up", d: "M 86 70 L 206 95", a: "c5", b: "trunk-upper", level: "roots" },
  { id: "c6-up", d: "M 86 120 L 206 95", a: "c6", b: "trunk-upper", level: "roots" },
  { id: "c7-mid", d: "M 86 170 L 206 170", a: "c7", b: "trunk-middle", level: "roots" },
  { id: "c8-low", d: "M 86 220 L 206 245", a: "c8", b: "trunk-lower", level: "roots" },
  { id: "t1-low", d: "M 86 270 L 206 245", a: "t1", b: "trunk-lower", level: "roots" },
  // trunks → divisions
  { id: "up-ant", d: "M 206 95 L 330 72", a: "trunk-upper", b: "divisions", level: "trunks" },
  { id: "up-post", d: "M 206 95 L 330 118", a: "trunk-upper", b: "divisions", level: "trunks" },
  { id: "mid-ant", d: "M 206 170 L 330 148", a: "trunk-middle", b: "divisions", level: "trunks" },
  { id: "mid-post", d: "M 206 170 L 330 192", a: "trunk-middle", b: "divisions", level: "trunks" },
  { id: "low-ant", d: "M 206 245 L 330 222", a: "trunk-lower", b: "divisions", level: "trunks" },
  { id: "low-post", d: "M 206 245 L 330 268", a: "trunk-lower", b: "divisions", level: "trunks" },
  // divisions → cords
  { id: "upant-lat", d: "M 330 72 L 460 95", a: "divisions", b: "cord-lateral", level: "divisions" },
  { id: "uppost-post", d: "M 330 118 L 460 170", a: "divisions", b: "cord-posterior", level: "divisions" },
  { id: "midant-lat", d: "M 330 148 L 460 95", a: "divisions", b: "cord-lateral", level: "divisions" },
  { id: "midpost-post", d: "M 330 192 L 460 170", a: "divisions", b: "cord-posterior", level: "divisions" },
  { id: "lowant-med", d: "M 330 222 L 460 245", a: "divisions", b: "cord-medial", level: "divisions" },
  { id: "lowpost-post", d: "M 330 268 L 460 170", a: "divisions", b: "cord-posterior", level: "divisions" },
  // cords → branches
  { id: "lat-muscu", d: "M 460 95 L 588 95", a: "cord-lateral", b: "branch-musculocutaneous", level: "cords" },
  { id: "lat-median", d: "M 460 95 L 588 160", a: "cord-lateral", b: "branch-median", level: "cords" },
  { id: "post-axill", d: "M 460 170 L 588 50", a: "cord-posterior", b: "branch-axillary", level: "cords" },
  { id: "post-radial", d: "M 460 170 L 588 240", a: "cord-posterior", b: "branch-radial", level: "cords" },
  { id: "med-ulnar", d: "M 460 245 L 588 305", a: "cord-medial", b: "branch-ulnar", level: "cords" },
  { id: "med-median", d: "M 460 245 L 588 160", a: "cord-medial", b: "branch-median", level: "cords" },
  // detail nerves
  { id: "supra", d: "M 206 95 Q 240 55 280 44", a: "trunk-upper", b: "suprascapular", level: "detail" },
  { id: "long-thor", d: "M 86 145 Q 120 300 165 392", a: "c6", b: "long-thoracic", level: "detail" },
];

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

function partColor(id: PartId) {
  return LEVELS[PARTS[id].level];
}

/* ------------------------------------------------------------------ */
/* Nerve + node renderers                                              */
/* ------------------------------------------------------------------ */

function Nerve({ n, h }: { n: NerveLine; h: PartHandlers }) {
  const { color, bright } = LEVELS[n.level];
  const active =
    h.hover === n.a || h.hover === n.b || h.selected === n.a || h.selected === n.b;

  return (
    <g pointerEvents="none">
      {/* base line */}
      <path
        d={n.d}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        opacity={active ? 0.8 : 0.35}
      />
      {/* flowing energy */}
      <motion.path
        d={n.d}
        fill="none"
        stroke={bright}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeDasharray="2 10"
        animate={{ strokeDashoffset: [0, -48] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        opacity={0.9}
      />
      {/* hover/selected bloom */}
      <motion.path
        d={n.d}
        fill="none"
        stroke={bright}
        strokeWidth={6}
        strokeLinecap="round"
        initial={false}
        animate={{ opacity: active ? 0.45 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
      />
    </g>
  );
}

function PartNode({ id, h }: { id: PartId; h: PartHandlers }) {
  const { color, bright } = partColor(id);
  const active = h.hover === id || h.selected === id;
  const nodes = NODES[id];

  return (
    <g {...partProps(id, h)}>
      {nodes.map((n, i) => (
        <g key={i}>
          <circle
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill={color}
            fillOpacity={active ? 0.28 : 0.13}
            stroke={color}
            strokeWidth={active ? 3 : 1.8}
            opacity={active ? 1 : 0.85}
          />
          {/* gloss */}
          <circle
            cx={n.x - n.r * 0.3}
            cy={n.y - n.r * 0.3}
            r={n.r * 0.26}
            fill="white"
            opacity={active ? 0.4 : 0.2}
          />
          {/* glow bloom */}
          <motion.circle
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill={bright}
            initial={false}
            animate={{ opacity: active ? 0.5 : 0.12 }}
            transition={{ duration: 0.3 }}
            style={{ filter: `drop-shadow(0 0 ${active ? 16 : 8}px ${color})` }}
          />
        </g>
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Main diagram                                                        */
/* ------------------------------------------------------------------ */

export function PlexusDiagram({ className }: { className?: string }) {
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
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#a78bfa]/15 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-12 h-40 w-40 rounded-full bg-[#5fd9c8]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-8 left-8 h-40 w-40 rounded-full bg-[#8a8ff0]/15 blur-3xl" />

      {/* hint + legend */}
      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <Info className="size-3.5 text-wistaria" />
          Hover to glow · click a part to learn what it does
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-bold">
          {(Object.keys(LEVELS) as Level[]).map((level) => {
            const l = LEVELS[level];
            return (
              <span key={level} className="flex items-center gap-1.5" style={{ color: l.bright }}>
                <span className="size-2.5 rounded-full" style={{ backgroundColor: l.color, boxShadow: `0 0 8px ${l.color}` }} />
                {l.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* the plexus */}
      <svg
        viewBox="0 0 690 480"
        className="relative mx-auto mt-2 block w-full max-w-[700px] select-none"
        role="img"
        aria-label="Interactive glowing Brachial Plexus diagram"
      >
        <defs>
          {/* subtle heatwave distortion */}
          <filter id="plex-heat" x="-8%" y="-8%" width="116%" height="116%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.028"
              numOctaves="2"
              seed="4"
              result="heat"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="heat"
              scale="4"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        {/* slowly rotating energy ring */}
        <motion.circle
          cx="360"
          cy="220"
          r="188"
          fill="none"
          stroke="#a2a2d0"
          strokeWidth="1.2"
          strokeDasharray="3 16"
          opacity="0.3"
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
        />

        {/* the plexus, gently breathing under the heat haze */}
        <motion.g
          filter="url(#plex-heat)"
          animate={{ scale: [1, 1.012, 1] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
        >
          {/* cervical spine */}
          <rect
            x="20"
            y="44"
            width="24"
            height="252"
            rx="12"
            fill="white"
            fillOpacity="0.04"
            stroke="#a2a2d0"
            strokeWidth="1.2"
            opacity="0.5"
          />
          {[70, 120, 170, 220, 270].map((y) => (
            <g key={y}>
              <line x1="20" y1={y} x2="44" y2={y} stroke="#a2a2d0" strokeWidth="1" opacity="0.35" />
              <line x1="44" y1={y} x2="71" y2={y} stroke="#a2a2d0" strokeWidth="1.6" opacity="0.45" />
            </g>
          ))}

          {/* nerves */}
          {NERVES.map((n) => (
            <Nerve key={n.id} n={n} h={h} />
          ))}

          {/* nodes */}
          {(Object.keys(PARTS) as PartId[]).map((id) => (
            <PartNode key={id} id={id} h={h} />
          ))}
        </motion.g>

        {/* crisp labels (outside the heat haze) */}
        {LABELS.map((l) => {
          const color = l.level ? LEVELS[l.level].bright : "#9f9fd0";
          return (
            <g key={l.text}>
              <text
                x={l.x}
                y={l.y}
                textAnchor={l.anchor}
                fill={color}
                fontSize={l.size ?? 9}
                fontWeight={l.weight ?? 700}
                letterSpacing={l.spacing ?? 0.8}
                fontFamily="Manrope, sans-serif"
                opacity="0.95"
              >
                {l.text}
              </text>
            </g>
          );
        })}
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
                  style={{
                    backgroundColor: partColor(selectedPart.id).color,
                    boxShadow: `0 0 10px ${partColor(selectedPart.id).color}`,
                  }}
                />
                <h3 className="text-sm font-extrabold" style={{ color: partColor(selectedPart.id).bright }}>
                  {selectedPart.name}
                </h3>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                  {selectedPart.role}
                </span>
              </div>
              <p className="mt-2 text-[13px] leading-6 text-muted-foreground">
                {selectedPart.blurb}
              </p>
            </motion.div>
          ) : (
            <motion.p
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto max-w-lg text-center text-[11px] font-medium text-muted-foreground"
            >
              Tap any glowing node — roots, trunks, cords or the big terminal
              nerves — for a quick breakdown.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Labels                                                              */
/* ------------------------------------------------------------------ */

const LABELS: {
  text: string;
  x: number;
  y: number;
  anchor: "start" | "middle" | "end";
  level?: Level;
  size?: number;
  weight?: number;
  spacing?: number;
}[] = [
  // level headers
  { text: "ROOTS", x: 86, y: 26, anchor: "middle", size: 8, weight: 800, spacing: 2 },
  { text: "TRUNKS", x: 206, y: 26, anchor: "middle", size: 8, weight: 800, spacing: 2 },
  { text: "DIVISIONS", x: 330, y: 26, anchor: "middle", size: 8, weight: 800, spacing: 2 },
  { text: "CORDS", x: 460, y: 26, anchor: "middle", size: 8, weight: 800, spacing: 2 },
  { text: "BRANCHES", x: 588, y: 26, anchor: "middle", size: 8, weight: 800, spacing: 2 },
  // root labels
  { text: "C5", x: 58, y: 74, anchor: "end", level: "roots" },
  { text: "C6", x: 58, y: 124, anchor: "end", level: "roots" },
  { text: "C7", x: 58, y: 174, anchor: "end", level: "roots" },
  { text: "C8", x: 58, y: 224, anchor: "end", level: "roots" },
  { text: "T1", x: 58, y: 274, anchor: "end", level: "roots" },
  // trunk labels
  { text: "UPPER", x: 206, y: 116, anchor: "middle", level: "trunks" },
  { text: "MIDDLE", x: 206, y: 190, anchor: "middle", level: "trunks" },
  { text: "LOWER", x: 206, y: 266, anchor: "middle", level: "trunks" },
  // divisions side labels
  { text: "ANT", x: 344, y: 76, anchor: "start", level: "divisions", size: 8, weight: 800 },
  { text: "POST", x: 344, y: 272, anchor: "start", level: "divisions", size: 8, weight: 800 },
  // cord labels
  { text: "LATERAL", x: 444, y: 99, anchor: "end", level: "cords" },
  { text: "POSTERIOR", x: 444, y: 174, anchor: "end", level: "cords" },
  { text: "MEDIAL", x: 444, y: 249, anchor: "end", level: "cords" },
  // branch labels
  { text: "Axillary", x: 600, y: 54, anchor: "start", level: "branches" },
  { text: "Musculocutaneous", x: 600, y: 99, anchor: "start", level: "branches" },
  { text: "Median", x: 600, y: 164, anchor: "start", level: "branches" },
  { text: "Radial", x: 600, y: 244, anchor: "start", level: "branches" },
  { text: "Ulnar", x: 600, y: 309, anchor: "start", level: "branches" },
  // detail nerves
  { text: "Suprascapular", x: 292, y: 58, anchor: "start", level: "detail" },
  { text: "Long thoracic", x: 180, y: 400, anchor: "start", level: "detail" },
];
