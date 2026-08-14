import { AnimatePresence, motion } from "framer-motion";
import { Info, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Parts — everything you can hover and tap                            */
/* ------------------------------------------------------------------ */

type PartId =
  | "brain"
  | "skull"
  | "lungs"
  | "heart"
  | "aorta"
  | "vena-cava"
  | "liver"
  | "stomach"
  | "intestines"
  | "ribcage"
  | "spine"
  | "limbs";

interface BodyPart {
  id: PartId;
  name: string;
  role: string;
  blurb: string;
  color: string;
  bright: string;
}

const PARTS: Record<PartId, BodyPart> = {
  brain: {
    id: "brain",
    name: "Brain",
    role: "Central nervous system",
    color: "#a78bfa",
    bright: "#d8ccff",
    blurb:
      "The command center — around 86 billion neurons. It uses about 20% of the body's oxygen despite being only 2% of its weight; every thought, heartbeat and breath starts here.",
  },
  skull: {
    id: "skull",
    name: "Skull",
    role: "Bony armour of the brain",
    color: "#e2e8f0",
    bright: "#ffffff",
    blurb:
      "Eight cranial bones fused into a vault that shields the brain. Its sutures allow slight movement at birth, and the foramen magnum lets the spinal cord pass through.",
  },
  lungs: {
    id: "lungs",
    name: "Lungs",
    role: "Gas exchange",
    color: "#7dd3fc",
    bright: "#d9f4ff",
    blurb:
      "The trachea splits into two bronchi feeding each lung. Inside, millions of alveoli — with a combined surface area roughly the size of a tennis court — swap oxygen for carbon dioxide.",
  },
  heart: {
    id: "heart",
    name: "Heart",
    role: "Muscular pump",
    color: "#ff5f7a",
    bright: "#ffb9c6",
    blurb:
      "Four chambers push blood through roughly 100,000 km of vessels. The right side sends deoxygenated blood to the lungs; the left side pumps oxygenated blood to the whole body — about 100,000 beats every day.",
  },
  aorta: {
    id: "aorta",
    name: "Aorta & Arteries",
    role: "High-pressure outflow",
    color: "#f43f5e",
    bright: "#ff9aa8",
    blurb:
      "The body's largest artery. Its elastic recoil smooths the pulse wave between beats, and it arches over the heart before descending to feed every organ — with carotid branches carrying oxygen to the brain.",
  },
  "vena-cava": {
    id: "vena-cava",
    name: "Vena Cava & Veins",
    role: "Venous return",
    color: "#38bdf8",
    bright: "#bae6fd",
    blurb:
      "The superior and inferior vena cavae pour deoxygenated blood back into the right atrium. Veins hold around 60% of your blood and rely on one-way valves plus muscle pumps to push it uphill.",
  },
  liver: {
    id: "liver",
    name: "Liver",
    role: "Chemical factory",
    color: "#fb923c",
    bright: "#ffd7ae",
    blurb:
      "Roughly 500 functions — detoxifying drugs and alcohol, making bile, storing glycogen, and producing most plasma proteins. It's the largest internal organ and can regenerate even after losing 70% of itself.",
  },
  stomach: {
    id: "stomach",
    name: "Stomach",
    role: "Acid digestion",
    color: "#f97316",
    bright: "#ffc28f",
    blurb:
      "A J-shaped pouch that churns food with hydrochloric acid and pepsin, breaking protein into chyme. Its mucus lining renews fast — otherwise it would digest itself.",
  },
  intestines: {
    id: "intestines",
    name: "Intestines",
    role: "Absorption",
    color: "#fde047",
    bright: "#fef9c3",
    blurb:
      "The small intestine (about 6 m) absorbs nutrients through finger-like villi; the large intestine reabsorbs water and salts and hosts the gut microbiome that shapes immunity and even mood.",
  },
  ribcage: {
    id: "ribcage",
    name: "Ribcage",
    role: "Breathing & protection",
    color: "#cbd5e1",
    bright: "#f4f7fb",
    blurb:
      "12 pairs of ribs hinge at the spine and sternum. They shield the heart and lungs, and their muscles lift and lower them roughly 20,000 times a day.",
  },
  spine: {
    id: "spine",
    name: "Spine",
    role: "Central support column",
    color: "#cbd5e1",
    bright: "#f4f7fb",
    blurb:
      "33 vertebrae stack into a shock-absorbing S-curve. It protects the spinal cord and gives every rib, organ and limb its anchor point.",
  },
  limbs: {
    id: "limbs",
    name: "Limb Bones",
    role: "Locomotion",
    color: "#cbd5e1",
    bright: "#f4f7fb",
    blurb:
      "The humerus, radius and ulna form the arm; the femur — the body's longest and strongest bone — plus tibia and fibula form the leg. Together they act as levers for muscles to move you.",
  },
};

/* Connected parts — hovering or selecting one brightens its partners */
const LINKS: Partial<Record<PartId, PartId[]>> = {
  heart: ["aorta", "vena-cava", "lungs"],
  aorta: ["heart", "vena-cava"],
  "vena-cava": ["heart", "aorta"],
  lungs: ["heart"],
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
    case "brain":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 14px ${c})` : undefined }}>
          <path
            d="M 208 80 C 206 56 252 54 252 80 C 256 100 246 112 230 112 C 214 112 204 100 208 80 Z"
            fill={c}
            fillOpacity={active ? 0.65 : 0.35}
            stroke={c}
            strokeWidth={active ? 2.5 : 1.8}
          />
          <path d="M 217 70 C 221 62 229 61 234 65" stroke={c} strokeWidth="1.6" fill="none" opacity="0.75" />
          <path d="M 218 86 C 224 80 233 80 240 85" stroke={c} strokeWidth="1.6" fill="none" opacity="0.75" />
          <path d="M 216 99 C 222 94 231 94 238 98" stroke={c} strokeWidth="1.6" fill="none" opacity="0.6" />
        </g>
      );
    case "skull":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 12px ${c})` : undefined }}>
          <circle
            cx="230"
            cy="82"
            r="44"
            fill="none"
            stroke={c}
            strokeWidth={active ? 3.5 : 2.5}
            opacity={active ? 0.95 : 0.55}
          />
          <path
            d="M 196 96 C 198 116 214 126 230 126 C 246 126 262 116 264 96"
            fill="none"
            stroke={c}
            strokeWidth={active ? 3 : 2}
            opacity={active ? 0.8 : 0.4}
          />
        </g>
      );
    case "lungs":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 14px ${c})` : undefined }}>
          <path d="M 230 168 L 230 200" stroke={c} strokeWidth="4" opacity="0.6" fill="none" />
          <path d="M 230 200 Q 206 212 198 230" stroke={c} strokeWidth="4" opacity="0.6" fill="none" />
          <path d="M 230 200 Q 254 212 262 230" stroke={c} strokeWidth="4" opacity="0.6" fill="none" />
          <ellipse
            cx="178"
            cy="268"
            rx="27"
            ry="52"
            fill={c}
            fillOpacity={active ? 0.55 : 0.26}
            stroke={c}
            strokeWidth={active ? 2.5 : 1.6}
            opacity={active ? 0.95 : 0.75}
          />
          <ellipse
            cx="274"
            cy="268"
            rx="27"
            ry="52"
            fill={c}
            fillOpacity={active ? 0.55 : 0.26}
            stroke={c}
            strokeWidth={active ? 2.5 : 1.6}
            opacity={active ? 0.95 : 0.75}
          />
          <path d="M 198 236 Q 190 258 186 280" stroke="#bde8ff" strokeWidth="1.4" fill="none" opacity="0.5" />
          <path d="M 262 236 Q 270 258 274 280" stroke="#bde8ff" strokeWidth="1.4" fill="none" opacity="0.5" />
        </g>
      );
    case "heart":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 16px ${c})` : undefined }}>
          {/* cyan aura behind the pink heart (blue/pink glow) */}
          <circle cx="228" cy="302" r="27" fill="#38bdf8" opacity={active ? 0.28 : 0.09} />
          <circle cx="248" cy="300" r="5.5" fill="#38bdf8" opacity={active ? 0.9 : 0.45} />
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            transform="translate(204 288) scale(1.55)"
            fill={c}
            fillOpacity={active ? 0.75 : 0.45}
            stroke="#ff8fa3"
            strokeWidth="2.5"
          />
        </g>
      );
    case "aorta":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 14px ${c})` : undefined }}>
          <path
            d="M 218 288 L 210 240 C 208 228 198 220 188 224 C 180 227 176 234 178 242 L 180 442 C 180 456 172 464 164 472 M 180 442 C 186 456 194 464 202 472"
            fill="none"
            stroke={c}
            strokeWidth={active ? 5.5 : 4}
            strokeLinecap="round"
            opacity={active ? 0.9 : 0.5}
          />
          <path
            d="M 206 228 C 210 216 213 206 214 196"
            fill="none"
            stroke={c}
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity={active ? 0.8 : 0.4}
          />
          <path
            d="M 190 230 C 198 216 202 204 204 196"
            fill="none"
            stroke={c}
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity={active ? 0.8 : 0.4}
          />
          <motion.path
            d="M 218 288 L 210 240 C 208 228 198 220 188 224 C 180 227 176 234 178 242 L 180 442"
            fill="none"
            stroke="#ffd7dd"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="2 12"
            animate={{ strokeDashoffset: [0, -56] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
            opacity="0.9"
          />
        </g>
      );
    case "vena-cava":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 14px ${c})` : undefined }}>
          <path
            d="M 252 268 L 252 244 C 252 236 236 230 216 228 M 252 244 C 252 236 268 230 286 228"
            fill="none"
            stroke={c}
            strokeWidth={active ? 4.5 : 3.2}
            strokeLinecap="round"
            opacity={active ? 0.9 : 0.5}
          />
          <path
            d="M 252 272 L 250 300 L 250 420 C 250 436 250 450 248 462"
            fill="none"
            stroke={c}
            strokeWidth={active ? 4.5 : 3.2}
            strokeLinecap="round"
            opacity={active ? 0.9 : 0.5}
          />
          <motion.path
            d="M 252 268 L 252 244 L 250 420 L 248 462"
            fill="none"
            stroke="#d9f2ff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="2 12"
            animate={{ strokeDashoffset: [0, -56] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
            opacity="0.9"
          />
        </g>
      );
    case "liver":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 14px ${c})` : undefined }}>
          <ellipse
            cx="274"
            cy="340"
            rx="26"
            ry="16"
            fill={c}
            fillOpacity={active ? 0.65 : 0.32}
            stroke={c}
            strokeWidth={active ? 2.5 : 1.6}
            opacity={active ? 0.95 : 0.75}
          />
          <ellipse
            cx="252"
            cy="346"
            rx="12"
            ry="8"
            fill={c}
            fillOpacity={active ? 0.65 : 0.32}
            stroke={c}
            strokeWidth={active ? 2 : 1.3}
            opacity={active ? 0.95 : 0.75}
          />
        </g>
      );
    case "stomach":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 14px ${c})` : undefined }}>
          <path
            d="M 224 326 C 206 330 194 342 196 360 C 198 380 214 390 234 388 C 246 386 252 378 250 368"
            fill="none"
            stroke={c}
            strokeWidth={active ? 18 : 15}
            strokeLinecap="round"
            opacity={active ? 0.85 : 0.5}
          />
          <path
            d="M 224 326 C 206 330 194 342 196 360 C 198 380 214 390 234 388"
            fill="none"
            stroke="#ffd9b3"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.6"
          />
        </g>
      );
    case "intestines":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 14px ${c})` : undefined }}>
          <path
            d="M 198 396 C 190 420 192 448 206 464 C 222 480 252 474 264 460 C 274 448 270 430 258 428"
            fill="none"
            stroke={c}
            strokeWidth="5.5"
            strokeLinecap="round"
            opacity={active ? 0.8 : 0.45}
          />
          <path d="M 206 402 C 224 392 244 396 252 410" fill="none" stroke={c} strokeWidth="9" strokeLinecap="round" opacity={active ? 0.7 : 0.4} />
          <path d="M 210 420 C 228 412 248 416 256 430" fill="none" stroke={c} strokeWidth="9" strokeLinecap="round" opacity={active ? 0.7 : 0.4} />
          <path d="M 214 438 C 230 430 248 434 256 448" fill="none" stroke={c} strokeWidth="9" strokeLinecap="round" opacity={active ? 0.7 : 0.4} />
        </g>
      );
    case "ribcage":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 12px ${c})` : undefined }}>
          <path d="M 230 210 L 230 330" fill="none" stroke={c} strokeWidth="6" opacity={active ? 0.75 : 0.35} />
          {[216, 238, 260, 282, 304, 326].map((y0) => (
            <g key={y0}>
              <path
                d={`M 230 ${y0} Q 200 ${y0 - 14} 178 ${y0 + 8}`}
                fill="none"
                stroke={c}
                strokeWidth={active ? 4 : 3}
                strokeLinecap="round"
                opacity={active ? 0.85 : 0.4}
              />
              <path
                d={`M 230 ${y0} Q 260 ${y0 - 14} 282 ${y0 + 8}`}
                fill="none"
                stroke={c}
                strokeWidth={active ? 4 : 3}
                strokeLinecap="round"
                opacity={active ? 0.85 : 0.4}
              />
            </g>
          ))}
        </g>
      );
    case "spine":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 12px ${c})` : undefined }}>
          <path d="M 230 168 L 230 520" fill="none" stroke={c} strokeWidth="4.5" opacity={active ? 0.8 : 0.4} />
          {Array.from({ length: 16 }, (_, i) => 180 + i * 22).map((y) => (
            <ellipse
              key={y}
              cx="230"
              cy={y}
              rx="8.5"
              ry="4.5"
              fill="none"
              stroke={c}
              strokeWidth="1.8"
              opacity={active ? 0.7 : 0.3}
            />
          ))}
        </g>
      );
    case "limbs":
      return (
        <g style={{ filter: active ? `drop-shadow(0 0 12px ${c})` : undefined }}>
          {/* arms */}
          <path d="M 150 226 L 136 314 L 128 396" fill="none" stroke={c} strokeWidth="5" strokeLinecap="round" opacity={active ? 0.85 : 0.45} />
          <path d="M 310 226 L 324 314 L 332 396" fill="none" stroke={c} strokeWidth="5" strokeLinecap="round" opacity={active ? 0.85 : 0.45} />
          <circle cx="126" cy="408" r="7" fill={c} opacity={active ? 0.9 : 0.5} />
          <circle cx="334" cy="408" r="7" fill={c} opacity={active ? 0.9 : 0.5} />
          {/* legs */}
          <path d="M 204 532 L 204 650 L 204 742" fill="none" stroke={c} strokeWidth="5.5" strokeLinecap="round" opacity={active ? 0.85 : 0.45} />
          <path d="M 256 532 L 256 650 L 256 742" fill="none" stroke={c} strokeWidth="5.5" strokeLinecap="round" opacity={active ? 0.85 : 0.45} />
          <path d="M 204 650 L 200 738" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" opacity={active ? 0.6 : 0.3} />
          <path d="M 256 650 L 260 738" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" opacity={active ? 0.6 : 0.3} />
          <ellipse cx="188" cy="754" rx="26" ry="10" fill="none" stroke={c} strokeWidth="4" opacity={active ? 0.8 : 0.4} />
          <ellipse cx="272" cy="754" rx="26" ry="10" fill="none" stroke={c} strokeWidth="4" opacity={active ? 0.8 : 0.4} />
        </g>
      );
  }
}

/* ------------------------------------------------------------------ */
/* Labels & legend                                                     */
/* ------------------------------------------------------------------ */

const LABELS: { text: string; x: number; y: number; anchor: "start" | "middle" | "end"; color: string }[] = [
  { text: "BRAIN", x: 230, y: 20, anchor: "middle", color: "#a78bfa" },
  { text: "LUNGS", x: 140, y: 256, anchor: "end", color: "#7dd3fc" },
  { text: "HEART", x: 140, y: 302, anchor: "end", color: "#ff5f7a" },
  { text: "STOMACH", x: 140, y: 356, anchor: "end", color: "#f97316" },
  { text: "AORTA", x: 140, y: 474, anchor: "end", color: "#f43f5e" },
  { text: "VENA CAVA", x: 302, y: 308, anchor: "start", color: "#38bdf8" },
  { text: "LIVER", x: 312, y: 344, anchor: "start", color: "#fb923c" },
  { text: "INTESTINES", x: 296, y: 456, anchor: "start", color: "#fde047" },
];

const LEGEND: { label: string; color: string; dots?: [string, string] }[] = [
  { label: "BRAIN", color: "#a78bfa" },
  { label: "HEART", color: "#ff5f7a" },
  { label: "LUNGS", color: "#7dd3fc" },
  { label: "DIGESTIVE", color: "#f97316" },
  { label: "VESSELS", color: "#f43f5e", dots: ["#f43f5e", "#38bdf8"] },
  { label: "SKELETON", color: "#cbd5e1" },
];

/* ------------------------------------------------------------------ */
/* Main diagram                                                        */
/* ------------------------------------------------------------------ */

const PARTS_ORDER: PartId[] = [
  "spine",
  "ribcage",
  "limbs",
  "brain",
  "skull",
  "aorta",
  "vena-cava",
  "lungs",
  "heart",
  "liver",
  "stomach",
  "intestines",
];

function BodyPart({ id, h }: { id: PartId; h: PartHandlers }) {
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

export function BodyDiagram({ className }: { className?: string }) {
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
      <div className="pointer-events-none absolute right-8 top-24 h-44 w-44 rounded-full bg-[#7dd3fc]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-8 h-44 w-44 rounded-full bg-[#f97316]/10 blur-3xl" />

      {/* hint + legend */}
      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <Info className="size-3.5 text-wistaria" />
          Hover to glow · click a part to learn what it does
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-bold">
          {LEGEND.map((l) => (
            <span key={l.label} className="flex items-center gap-1.5" style={{ color: l.color }}>
              {l.dots ? (
                <>
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: l.dots[0], boxShadow: `0 0 8px ${l.dots[0]}` }}
                  />
                  <span
                    className="-ml-1 size-2.5 rounded-full border border-white/40"
                    style={{ backgroundColor: l.dots[1], boxShadow: `0 0 8px ${l.dots[1]}` }}
                  />
                </>
              ) : (
                <span className="size-2.5 rounded-full" style={{ backgroundColor: l.color, boxShadow: `0 0 8px ${l.color}` }} />
              )}
              {l.label}
            </span>
          ))}
        </div>
      </div>

      {/* the body */}
      <svg
        viewBox="0 0 460 800"
        className="relative mx-auto mt-2 block w-full max-w-[440px] select-none"
        role="img"
        aria-label="Interactive glowing human anatomy diagram"
      >
        <defs>
          {/* subtle heatwave distortion */}
          <filter id="body-heat" x="-6%" y="-6%" width="112%" height="112%">
            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.022" numOctaves="2" seed="7" result="heat" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="heat"
              scale="5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        {/* slowly rotating energy ring */}
        <motion.circle
          cx="230"
          cy="420"
          r="262"
          fill="none"
          stroke="#7dd3fc"
          strokeWidth="1.2"
          strokeDasharray="3 16"
          opacity="0.22"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
        />

        {/* the body, gently breathing under the heat haze */}
        <motion.g
          filter="url(#body-heat)"
          animate={{ scale: [1, 1.01, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
        >
          {/* soft full-body silhouette */}
          <g pointerEvents="none" opacity="0.5">
            <path
              d="M 216 124 L 244 124 L 248 168 L 212 168 Z"
              fill="white"
              fillOpacity="0.03"
              stroke="#cbd5e1"
              strokeOpacity="0.25"
              strokeWidth="1.5"
            />
            <path
              d="M 152 205 C 142 300 140 400 154 468 C 164 512 198 530 230 530 C 262 530 296 512 306 468 C 320 400 318 300 308 205 C 294 174 262 166 230 166 C 198 166 166 174 152 205 Z"
              fill="white"
              fillOpacity="0.03"
              stroke="#cbd5e1"
              strokeOpacity="0.25"
              strokeWidth="1.5"
            />
            <path d="M 150 212 C 130 260 120 340 124 416" fill="none" stroke="white" strokeOpacity="0.04" strokeWidth="24" strokeLinecap="round" />
            <path d="M 310 212 C 330 260 340 340 336 416" fill="none" stroke="white" strokeOpacity="0.04" strokeWidth="24" strokeLinecap="round" />
            <path d="M 206 528 L 204 660 L 208 748" fill="none" stroke="white" strokeOpacity="0.04" strokeWidth="26" strokeLinecap="round" />
            <path d="M 254 528 L 256 660 L 252 748" fill="none" stroke="white" strokeOpacity="0.04" strokeWidth="26" strokeLinecap="round" />
            <ellipse cx="186" cy="756" rx="30" ry="12" fill="white" fillOpacity="0.04" />
            <ellipse cx="274" cy="756" rx="30" ry="12" fill="white" fillOpacity="0.04" />
          </g>

          {/* interactive parts (skeleton first, then vessels, then organs) */}
          {PARTS_ORDER.map((id) => (
            <BodyPart key={id} id={id} h={h} />
          ))}
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
              Tap any glowing organ — the brain, heart, lungs or the coiled gut — for a quick breakdown.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
