import { AnimatePresence, motion } from "framer-motion";
import { Info, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Palette                                                             */
/* ------------------------------------------------------------------ */

const DEOXY = "#5fb6f5"; // cyan-blue — the deoxygenated (right) side
const DEOXY_BRIGHT = "#9fe8ff";
const OXY = "#ff5f7a"; // energetic red-pink — the oxygenated (left) side
const OXY_BRIGHT = "#ffb3c2";
const WIST = "#a2a2d0";

/* ------------------------------------------------------------------ */
/* Part definitions — every interactive part of the heart              */
/* ------------------------------------------------------------------ */

type PartId =
  | "ra"
  | "la"
  | "rv"
  | "lv"
  | "aorta"
  | "pulmonary"
  | "svc"
  | "ivc"
  | "pv";

interface HeartPart {
  id: PartId;
  name: string;
  role: string;
  blurb: string;
  color: string;
  bright: string;
}

const PARTS: Record<PartId, HeartPart> = {
  ra: {
    id: "ra",
    name: "Right Atrium",
    role: "Receives deoxygenated blood",
    color: DEOXY,
    bright: DEOXY_BRIGHT,
    blurb:
      "Collects deoxygenated blood from the superior vena cava (upper body), the inferior vena cava (lower body) and the coronary sinus, then pushes it through the tricuspid valve into the right ventricle.",
  },
  rv: {
    id: "rv",
    name: "Right Ventricle",
    role: "Pumps blood to the lungs",
    color: DEOXY,
    bright: DEOXY_BRIGHT,
    blurb:
      "A thin-walled pump that sends deoxygenated blood through the pulmonary valve and trunk to the lungs — where it drops off CO₂ and picks up fresh O₂.",
  },
  la: {
    id: "la",
    name: "Left Atrium",
    role: "Receives oxygenated blood",
    color: OXY,
    bright: OXY_BRIGHT,
    blurb:
      "Receives freshly oxygenated blood from the four pulmonary veins — the only oxygen-rich blood in the venous system — and passes it through the mitral valve into the left ventricle.",
  },
  lv: {
    id: "lv",
    name: "Left Ventricle",
    role: "Pumps blood to the whole body",
    color: OXY,
    bright: OXY_BRIGHT,
    blurb:
      "The heart's powerhouse. Its thick, muscular wall generates the high pressure that drives blood through the aorta to the entire body — this is the force you feel as a pulse.",
  },
  aorta: {
    id: "aorta",
    name: "Aorta",
    role: "The body's great highway",
    color: OXY,
    bright: OXY_BRIGHT,
    blurb:
      "The body's largest artery. It carries oxygenated blood from the left ventricle, arches over the heart, and branches to supply every organ — from the brain to the toes.",
  },
  pulmonary: {
    id: "pulmonary",
    name: "Pulmonary Trunk & Arteries",
    role: "The road to the lungs",
    color: DEOXY,
    bright: DEOXY_BRIGHT,
    blurb:
      "The pulmonary trunk leaves the right ventricle and splits into the left and right pulmonary arteries — the only arteries in the body that carry deoxygenated blood.",
  },
  svc: {
    id: "svc",
    name: "Superior Vena Cava",
    role: "Returns blood from the upper body",
    color: DEOXY,
    bright: DEOXY_BRIGHT,
    blurb:
      "A large vein draining deoxygenated blood from the head, neck, arms and upper chest straight into the right atrium.",
  },
  ivc: {
    id: "ivc",
    name: "Inferior Vena Cava",
    role: "Returns blood from the lower body",
    color: DEOXY,
    bright: DEOXY_BRIGHT,
    blurb:
      "The body's biggest vein. It returns deoxygenated blood from everything below the diaphragm — trunk, pelvis and legs — back to the right atrium.",
  },
  pv: {
    id: "pv",
    name: "Pulmonary Veins",
    role: "Fresh oxygen, home",
    color: OXY,
    bright: OXY_BRIGHT,
    blurb:
      "Four veins bringing oxygenated blood from the lungs into the left atrium — the only veins in the body that carry oxygen-rich blood.",
  },
};

const PART_ORDER: PartId[] = [
  "svc",
  "ivc",
  "pulmonary",
  "aorta",
  "pv",
  "ra",
  "la",
  "rv",
  "lv",
];

/* ------------------------------------------------------------------ */
/* Shared interactive SVG group — hover glows, click selects           */
/* ------------------------------------------------------------------ */

function useHeartSelection() {
  const [hover, setHover] = useState<PartId | null>(null);
  const [selected, setSelected] = useState<PartId | null>(null);
  return { hover, setHover, selected, setSelected };
}

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
/* Chambers — the four heart chambers                                  */
/* ------------------------------------------------------------------ */

function Chamber({
  id,
  d,
  fill,
  h,
}: {
  id: PartId;
  d: string;
  fill: string;
  h: PartHandlers;
}) {
  const part = PARTS[id];
  const active = h.hover === id || h.selected === id;

  return (
    <g {...partProps(id, h)}>
      {/* base fill + outline */}
      <path
        d={d}
        fill={fill}
        stroke={part.color}
        strokeWidth={active ? 3.2 : 2.2}
        opacity={active ? 1 : 0.85}
      />
      {/* hover/selected glow bloom */}
      <motion.path
        d={d}
        fill={part.color}
        stroke="none"
        initial={false}
        animate={{ opacity: active ? 0.4 : 0.1 }}
        transition={{ duration: 0.3 }}
        style={{ filter: `drop-shadow(0 0 ${active ? 20 : 10}px ${part.color})` }}
      />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Vessels — thick glowing tubes with flowing energy dashes            */
/* ------------------------------------------------------------------ */

function Vessel({
  id,
  d,
  width,
  arrow,
  h,
}: {
  id: PartId;
  d: string;
  width: number;
  arrow: string;
  h: PartHandlers;
}) {
  const part = PARTS[id];
  const active = h.hover === id || h.selected === id;

  return (
    <g {...partProps(id, h)}>
      {/* tube */}
      <path
        d={d}
        fill="none"
        stroke={part.color}
        strokeWidth={width}
        strokeLinecap="round"
        opacity={active ? 0.7 : 0.38}
        markerEnd={arrow}
      />
      {/* flowing energy — the "blood" moving through the vessel */}
      <motion.path
        d={d}
        fill="none"
        stroke={part.bright}
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeDasharray="2 11"
        animate={{ strokeDashoffset: [0, -52] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        opacity={0.95}
      />
      {/* hover bloom */}
      <motion.path
        d={d}
        fill="none"
        stroke={part.bright}
        strokeWidth={width}
        strokeLinecap="round"
        initial={false}
        animate={{ opacity: active ? 0.45 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ filter: `drop-shadow(0 0 10px ${part.color})` }}
      />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Main diagram                                                        */
/* ------------------------------------------------------------------ */

export function HeartDiagram({ className }: { className?: string }) {
  const { hover, setHover, selected, setSelected } = useHeartSelection();
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
      {/* ambient glows behind the heart */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#78A2D2]/15 blur-3xl" />
      <div className="pointer-events-none absolute right-8 top-10 h-40 w-40 rounded-full bg-[#ff5f7a]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-8 left-8 h-40 w-40 rounded-full bg-[#a2a2d0]/15 blur-3xl" />

      {/* hint + legend */}
      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <Info className="size-3.5 text-wistaria" />
          Hover to glow · click a part to learn what it does
        </p>
        <div className="flex items-center gap-3 text-[11px] font-bold">
          <span className="flex items-center gap-1.5 text-[#9fe8ff]">
            <span className="size-2.5 rounded-full bg-[#5fb6f5] shadow-[0_0_8px_#5fb6f5]" />
            Deoxygenated
          </span>
          <span className="flex items-center gap-1.5 text-[#ffb3c2]">
            <span className="size-2.5 rounded-full bg-[#ff5f7a] shadow-[0_0_8px_#ff5f7a]" />
            Oxygenated
          </span>
        </div>
      </div>

      {/* the heart */}
      <svg
        viewBox="0 0 520 560"
        className="relative mx-auto mt-2 block w-full max-w-[560px] select-none"
        role="img"
        aria-label="Interactive glowing Human Heart diagram"
      >
        <defs>
          <radialGradient id="heart-grad-deoxy" cx="50%" cy="40%" r="80%">
            <stop offset="0%" stopColor="#8fd8ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#2f6fae" stopOpacity="0.08" />
          </radialGradient>
          <radialGradient id="heart-grad-oxy" cx="50%" cy="40%" r="80%">
            <stop offset="0%" stopColor="#ff9db2" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#b23a55" stopOpacity="0.08" />
          </radialGradient>

          {/* subtle heatwave distortion */}
          <filter id="heart-heat" x="-8%" y="-8%" width="116%" height="116%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.028"
              numOctaves="2"
              seed="9"
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

          {/* flow arrows */}
          <marker
            id="heart-arrow-cyan"
            viewBox="0 0 10 10"
            refX="7"
            refY="5"
            markerWidth="9"
            markerHeight="9"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0 0 L10 5 L0 10 z" fill={DEOXY_BRIGHT} />
          </marker>
          <marker
            id="heart-arrow-red"
            viewBox="0 0 10 10"
            refX="7"
            refY="5"
            markerWidth="9"
            markerHeight="9"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0 0 L10 5 L0 10 z" fill={OXY_BRIGHT} />
          </marker>
        </defs>

        {/* slowly rotating energy ring */}
        <motion.circle
          cx="260"
          cy="300"
          r="212"
          fill="none"
          stroke={WIST}
          strokeWidth="1.2"
          strokeDasharray="3 16"
          opacity="0.35"
          animate={{ rotate: 360 }}
          transition={{ duration: 46, repeat: Infinity, ease: "linear" }}
          style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
        />

        {/* the beating, heat-hazed heart */}
        <motion.g
          filter="url(#heart-heat)"
          animate={{ scale: [1, 1.02, 1, 1.012, 1] }}
          transition={{
            duration: 1.15,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.15, 0.3, 0.45, 1],
          }}
          style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
        >
          {/* soft silhouette so it reads as one organ */}
          <path
            d="M 262 104 C 202 90, 132 100, 102 150 C 80 190, 84 240, 100 286 C 118 338, 146 386, 184 430 C 212 462, 242 490, 270 499 C 292 506, 314 498, 330 480 C 358 444, 392 402, 414 358 C 436 316, 446 264, 438 212 C 430 152, 360 100, 262 104 Z"
            fill="white"
            fillOpacity="0.04"
            stroke={WIST}
            strokeWidth="1.2"
            opacity="0.4"
          />

          {/* septum */}
          <path
            d="M 262 140 C 258 220, 254 340, 264 478"
            fill="none"
            stroke={WIST}
            strokeWidth="1.8"
            strokeDasharray="4 6"
            opacity="0.5"
          />

          {/* chambers */}
          <Chamber id="ra" fill="url(#heart-grad-deoxy)" d="M 70 185 A 70 84 0 1 0 210 185 A 70 84 0 1 0 70 185 Z" h={h} />
          <Chamber id="la" fill="url(#heart-grad-oxy)" d="M 316 185 A 64 84 0 1 0 444 185 A 64 84 0 1 0 316 185 Z" h={h} />
          <Chamber
            id="rv"
            fill="url(#heart-grad-deoxy)"
            d="M 92 292 C 92 378, 108 424, 148 426 C 186 428, 212 384, 214 312 C 215 262, 190 238, 152 238 C 114 238, 92 264, 92 292 Z"
            h={h}
          />
          <Chamber
            id="lv"
            fill="url(#heart-grad-oxy)"
            d="M 242 300 C 242 372, 258 458, 292 486 C 316 505, 342 502, 360 486 C 388 458, 420 420, 428 384 C 436 348, 438 296, 420 262 C 404 232, 364 222, 330 228 C 288 236, 242 258, 242 300 Z"
            h={h}
          />

          {/* papillary muscles + chordae in the LV */}
          <g opacity="0.35" stroke={OXY} strokeWidth="2" fill="none" strokeLinecap="round">
            <path d="M 320 372 Q 336 388 352 376" />
            <path d="M 306 392 Q 322 404 338 396" />
            <path d="M 286 414 Q 300 424 314 418" />
          </g>

          {/* valves */}
          <g>
            {/* tricuspid (RA → RV) */}
            <path d="M 138 240 Q 166 262 194 240" fill="none" stroke={DEOXY_BRIGHT} strokeWidth="2.4" opacity="0.9" />
            <text x="166" y="236" textAnchor="middle" fill={DEOXY_BRIGHT} fontSize="7" fontWeight="800" fontFamily="Manrope, sans-serif">
              TV
            </text>
            {/* mitral (LA → LV) */}
            <path d="M 300 244 Q 324 264 348 244" fill="none" stroke={OXY_BRIGHT} strokeWidth="2.4" opacity="0.9" />
            <text x="324" y="240" textAnchor="middle" fill={OXY_BRIGHT} fontSize="7" fontWeight="800" fontFamily="Manrope, sans-serif">
              MV
            </text>
            {/* pulmonary valve */}
            <path d="M 172 226 Q 186 238 200 226" fill="none" stroke={DEOXY_BRIGHT} strokeWidth="2.2" opacity="0.85" />
            <text x="186" y="220" textAnchor="middle" fill={DEOXY_BRIGHT} fontSize="6" fontWeight="800" fontFamily="Manrope, sans-serif">
              PULM
            </text>
            {/* aortic valve */}
            <path d="M 308 242 Q 322 254 336 242" fill="none" stroke={OXY_BRIGHT} strokeWidth="2.2" opacity="0.85" />
            <text x="322" y="238" textAnchor="middle" fill={OXY_BRIGHT} fontSize="6" fontWeight="800" fontFamily="Manrope, sans-serif">
              AV
            </text>
          </g>

          {/* vessels */}
          <Vessel
            id="svc"
            d="M 188 12 C 176 55, 162 88, 150 118"
            width={20}
            arrow="url(#heart-arrow-cyan)"
            h={h}
          />
          <Vessel
            id="ivc"
            d="M 132 548 C 124 470, 122 360, 128 252"
            width={22}
            arrow="url(#heart-arrow-cyan)"
            h={h}
          />
          <Vessel
            id="pulmonary"
            d="M 178 242 C 182 180, 186 138, 190 112 M 190 112 C 160 98, 122 88, 92 82 M 190 112 C 228 94, 266 86, 298 82"
            width={18}
            arrow="url(#heart-arrow-cyan)"
            h={h}
          />
          <Vessel
            id="aorta"
            d="M 330 248 C 322 180, 318 118, 322 66 C 336 32, 398 28, 430 46 C 458 62, 460 108, 452 148"
            width={22}
            arrow="url(#heart-arrow-red)"
            h={h}
          />
          <Vessel
            id="pv"
            d="M 502 150 C 480 150, 452 152, 438 158 M 502 208 C 478 206, 452 198, 436 192"
            width={14}
            arrow="url(#heart-arrow-red)"
            h={h}
          />

          {/* aorta arch branches */}
          <g stroke={OXY} strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.3">
            <path d="M 335 62 C 330 40, 340 25, 355 20" />
            <path d="M 365 42 C 368 25, 372 14, 378 8" />
            <path d="M 392 36 C 402 22, 408 14, 412 8" />
          </g>
        </motion.g>

        {/* crisp labels + leader lines (outside the heat haze) */}
        {LABELS.map((l) => {
          const part = PARTS[l.id];
          return (
            <g key={l.id}>
              <line
                x1={l.lx1}
                y1={l.ly1}
                x2={l.lx2}
                y2={l.ly2}
                stroke={part.color}
                strokeWidth="1.2"
                opacity="0.7"
              />
              <circle cx={l.lx1} cy={l.ly1} r="2.6" fill={part.bright} opacity="0.95" />
              <text
                x={l.x}
                y={l.y}
                textAnchor={l.anchor}
                fill={part.bright}
                fontSize="9"
                fontWeight="700"
                letterSpacing="0.8"
                fontFamily="Manrope, sans-serif"
                opacity="0.95"
              >
                {l.label}
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
                  style={{ backgroundColor: selectedPart.color, boxShadow: `0 0 10px ${selectedPart.color}` }}
                />
                <h3 className="text-sm font-extrabold" style={{ color: selectedPart.bright }}>
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
              Tap any glowing part above — atria, ventricles, aorta or the great
              veins — for a quick breakdown.
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
  id: PartId;
  label: string;
  x: number;
  y: number;
  anchor: "start" | "middle" | "end";
  lx1: number;
  ly1: number;
  lx2: number;
  ly2: number;
}[] = [
  { id: "svc", label: "SVC", x: 100, y: 26, anchor: "start", lx1: 158, ly1: 58, lx2: 108, ly2: 32 },
  { id: "pulmonary", label: "PULM. TRUNK", x: 14, y: 88, anchor: "start", lx1: 112, ly1: 104, lx2: 22, ly2: 86 },
  { id: "aorta", label: "AORTA", x: 500, y: 34, anchor: "end", lx1: 438, ly1: 52, lx2: 472, ly2: 40 },
  { id: "la", label: "L. ATRIUM", x: 500, y: 158, anchor: "end", lx1: 436, ly1: 166, lx2: 472, ly2: 158 },
  { id: "pv", label: "PULM. VEINS", x: 500, y: 212, anchor: "end", lx1: 438, ly1: 196, lx2: 472, ly2: 208 },
  { id: "ra", label: "R. ATRIUM", x: 14, y: 232, anchor: "start", lx1: 74, ly1: 206, lx2: 22, ly2: 228 },
  { id: "rv", label: "R. VENTRICLE", x: 14, y: 396, anchor: "start", lx1: 96, ly1: 372, lx2: 22, ly2: 392 },
  { id: "ivc", label: "IVC", x: 14, y: 516, anchor: "start", lx1: 130, ly1: 470, lx2: 22, ly2: 512 },
  { id: "lv", label: "L. VENTRICLE", x: 502, y: 418, anchor: "end", lx1: 424, ly1: 396, lx2: 472, ly2: 412 },
];

/** Convenience export so the page can list the interactive parts. */
export const HEART_PARTS = PART_ORDER.map((id) => PARTS[id]);
