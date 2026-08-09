import { motion } from "framer-motion";
import React, { Component, useEffect, useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const INK = "#5b5ba3"; // dark periwinkle line
const SOFT = "#a2a2d0"; // wistaria
const CLOUD = "#78a2d2";
const FILL = "oklch(1 0 0 / 0.55)";
const PINK = "#e8b7cf";

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

const LABEL_PROPS = {
  fill: INK,
  fontSize: 11,
  fontWeight: 600,
  fontFamily: "Manrope, sans-serif",
} as const;

function Label({
  x,
  y,
  children,
  anchor = "middle",
  className,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  anchor?: "start" | "middle" | "end";
  className?: string;
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} {...LABEL_PROPS} className={className}>
      {children}
    </text>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Cardiac cycle — beating heart + phase loop + ECG strip           */
/* ------------------------------------------------------------------ */

function CardiacDiagram({ accent }: { accent: string }) {
  const loopPoints = useMemo(() => {
    // ellipse-ish loop around which the pulse dot travels
    const cx = 250,
      cy = 150,
      rx = 118,
      ry = 74;
    return Array.from({ length: 40 }, (_, i) => {
      const t = (i / 40) * Math.PI * 2;
      return [cx + rx * Math.cos(t), cy + ry * Math.sin(t)] as const;
    });
  }, []);

  const [dot, setDot] = useState<{ x: number; y: number }>({
    x: loopPoints[0][0],
    y: loopPoints[0][1],
  });

  // Steady loop: advance the pulse dot around the phase ring.
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % loopPoints.length;
      setDot({ x: loopPoints[i][0], y: loopPoints[i][1] });
    }, 110);
    return () => clearInterval(id);
  }, [loopPoints]);

  const phases = [
    { label: "Atrial\nsystole", x: 250, y: 66 },
    { label: "Isovolumetric\ncontraction", x: 375, y: 150 },
    { label: "Ejection", x: 250, y: 236 },
    { label: "Relaxation &\nfilling", x: 125, y: 150 },
  ];

  return (
    <svg viewBox="0 0 500 300" className="w-full" role="img" aria-label="Cardiac cycle phases">
      {/* heart */}
      <motion.path
        d="M 250 66 C 190 18, 118 52, 118 106 C 118 152, 250 212, 250 236 C 250 212, 382 152, 382 106 C 382 52, 310 18, 250 66 Z"
        fill="oklch(0.93 0.05 350 / 0.35)"
        stroke={PINK}
        strokeWidth={2.5}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "250px", originY: "150px" }}
      />
      <Label x={250} y={148} className="fill-[#b06a86]">
        ♥ heart
      </Label>

      {/* phase loop */}
      <ellipse
        cx={250}
        cy={150}
        rx={118}
        ry={74}
        fill="none"
        stroke={SOFT}
        strokeWidth={1.6}
        strokeDasharray="5 6"
        opacity={0.9}
      />
      {phases.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={5} fill={accent} opacity={0.85} />
          <text
            x={p.x}
            y={i % 2 === 0 ? p.y - 12 : p.y + 26}
            textAnchor="middle"
            fill={INK}
            fontSize={9.5}
            fontWeight={700}
            fontFamily="Manrope, sans-serif"
          >
            {p.label.split("\n")[0]}
          </text>
          <text
            x={p.x}
            y={i % 2 === 0 ? p.y - 2 : p.y + 36}
            textAnchor="middle"
            fill="#7b7bb5"
            fontSize={8.5}
            fontFamily="Manrope, sans-serif"
          >
            {p.label.split("\n")[1]}
          </text>
        </g>
      ))}

      {/* traveling pulse dot */}
      <circle cx={dot.x} cy={dot.y} r={7} fill={CLOUD} opacity={0.95} />
      <circle cx={dot.x} cy={dot.y} r={12} fill={CLOUD} opacity={0.25}>
        <animate attributeName="r" values="8;16;8" dur="1.1s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.05;0.3" dur="1.1s" repeatCount="indefinite" />
      </circle>

      {/* ECG strip */}
      <g transform="translate(24 256)">
        <polyline
          points="0,16 40,16 52,16 60,8 64,16 78,16 88,4 98,16 112,16 118,14 130,16 170,16 182,16 190,8 194,16 208,16 218,4 228,16 242,16 248,14 260,16 300,16 312,16 320,8 324,16 338,16 348,4 358,16 372,16 378,14 390,16 452,16"
          fill="none"
          stroke={accent}
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
      </g>
      <text x={24} y={288} fill="#7b7bb5" fontSize={9} fontFamily="Manrope, sans-serif">
        ECG: P → QRS → T, once per cycle
      </text>
      <text x={476} y={288} textAnchor="end" fill="#7b7bb5" fontSize={9} fontFamily="Manrope, sans-serif">
        0.8 s per beat @ 75 bpm
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Action potential — the classic spike curve                       */
/* ------------------------------------------------------------------ */

function PotentialDiagram({ accent }: { accent: string }) {
  const spikePath =
    "M 20 200 L 78 200 C 96 200, 108 194, 120 183 " + // to threshold
    "C 138 164, 148 108, 172 92 " + // up to peak +30
    "C 196 96, 206 138, 220 158 " + // down
    "C 232 176, 242 192, 254 204 " + // repolarisation
    "C 264 216, 276 224, 290 220 " + // undershoot
    "C 302 214, 312 208, 332 200"; // back to rest

  const levels = [
    { y: 92, label: "+30 mV", dash: true },
    { y: 134, label: "0 mV", dash: true },
    { y: 183, label: "−55 mV threshold", dash: true },
    { y: 200, label: "−70 mV rest", dash: true },
    { y: 220, label: "−90 mV undershoot", dash: true },
  ];

  return (
    <svg viewBox="0 0 480 250" className="w-full" role="img" aria-label="Action potential curve">
      {/* grid + levels */}
      {levels.map((l, i) => (
        <g key={i}>
          <line
            x1={20}
            y1={l.y}
            x2={450}
            y2={l.y}
            stroke={i === 3 ? INK : SOFT}
            strokeWidth={i === 3 ? 1.2 : 0.8}
            strokeDasharray={l.dash ? "3 4" : undefined}
            opacity={0.55}
          />
          <text x={452} y={l.y + 3} fill="#7b7bb5" fontSize={8.5} fontFamily="Manrope, sans-serif">
            {l.label}
          </text>
        </g>
      ))}

      {/* the spike — draws itself once */}
      <motion.path
        d={spikePath}
        fill="none"
        stroke={accent}
        strokeWidth={3}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.6, ease: "easeInOut" }}
      />
      {/* soft fill under curve */}
      <motion.path
        d={`${spikePath} L 332 250 L 20 250 Z`}
        fill={accent}
        opacity={0.08}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
      />

      {/* ion arrows */}
      <g>
        <motion.g
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          <path d="M 150 40 l 10 12 m -2 -10 l -10 12" stroke={CLOUD} strokeWidth={2} fill="none" />
          <text x={168} y={56} fill={CLOUD} fontSize={9.5} fontWeight={700} fontFamily="Manrope, sans-serif">
            Na⁺ in
          </text>
        </motion.g>
        <motion.g
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: 0.9 }}
        >
          <path d="M 252 240 l 10 -12 m -2 10 l -10 -12" stroke={SOFT} strokeWidth={2} fill="none" />
          <text x={268} y={244} fill={SOFT} fontSize={9.5} fontWeight={700} fontFamily="Manrope, sans-serif">
            K⁺ out
          </text>
        </motion.g>
      </g>

      {/* phase captions */}
      <text x={88} y={176} fill={INK} fontSize={9} fontWeight={700} fontFamily="Manrope, sans-serif">
        Depolarisation
      </text>
      <text x={262} y={244} fill={INK} fontSize={9} fontWeight={700} fontFamily="Manrope, sans-serif">
        Repolarisation
      </text>
      <text x={20} y={26} fill="#7b7bb5" fontSize={9} fontFamily="Manrope, sans-serif">
        membrane potential (mV) vs time (ms)
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Brachial plexus — the five-level ladder                          */
/* ------------------------------------------------------------------ */

function PlexusDiagram({ accent }: { accent: string }) {
  const roots = [
    { id: "C5", y: 44 },
    { id: "C6", y: 78 },
    { id: "C7", y: 112 },
    { id: "C8", y: 146 },
    { id: "T1", y: 180 },
  ];
  const trunks = [
    { id: "Upper", y: 61, from: [44, 78] },
    { id: "Middle", y: 112, from: [112] },
    { id: "Lower", y: 163, from: [146, 180] },
  ];
  const divisions = [
    { y: 46 },
    { y: 76 },
    { y: 97 },
    { y: 127 },
    { y: 148 },
    { y: 178 },
  ];
  const cords = [
    { id: "Lateral", y: 61 },
    { id: "Posterior", y: 112 },
    { id: "Medial", y: 163 },
  ];
  const branches = [
    { id: "Musculocut.", y: 42 },
    { id: "Median", y: 78 },
    { id: "Radial", y: 112 },
    { id: "Ulnar", y: 146 },
    { id: "Axillary", y: 180 },
  ];

  const x = { roots: 56, trunks: 130, divisions: 210, cords: 290, branches: 380 };

  const stagger = (i: number) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { duration: 0.5, delay: 0.1 + i * 0.12 },
  });

  return (
    <svg viewBox="0 0 470 230" className="w-full" role="img" aria-label="Brachial plexus ladder">
      {/* root lines */}
      {roots.map((r, i) => (
        <motion.line
          key={r.id}
          x1={x.roots - 18}
          y1={r.y}
          x2={x.roots}
          y2={r.y}
          stroke={SOFT}
          strokeWidth={2}
          {...stagger(i)}
        />
      ))}
      {/* root → trunk lines */}
      {trunks.flatMap((t, ti) =>
        t.from.map((fy, fi) => (
          <motion.line
            key={`t${ti}-${fi}`}
            x1={x.roots}
            y1={fy}
            x2={x.trunks}
            y2={t.y}
            stroke={CLOUD}
            strokeWidth={2}
            {...stagger(ti * 2 + fi)}
          />
        )),
      )}
      {/* trunk → division lines */}
      {divisions.map((d, i) => {
        const from = trunks[i < 2 ? 0 : i < 4 ? 1 : 2];
        return (
          <motion.line
            key={`d${i}`}
            x1={x.trunks}
            y1={from.y}
            x2={x.divisions}
            y2={d.y}
            stroke={SOFT}
            strokeWidth={1.8}
            {...stagger(i + 2)}
          />
        );
      })}
      {/* division → cord lines */}
      {cords.map((c, i) => {
        const from = divisions.slice(i * 2, i * 2 + 2);
        return from.map((d, di) => (
          <motion.line
            key={`c${i}-${di}`}
            x1={x.divisions}
            y1={d.y}
            x2={x.cords}
            y2={c.y}
            stroke={accent}
            strokeWidth={2}
            {...stagger(i + 6)}
          />
        ));
      })}
      {/* cord → branch lines */}
      {branches.map((b, i) => {
        const from = cords[i < 2 ? 0 : i === 2 ? 1 : 2];
        return (
          <motion.line
            key={`b${i}`}
            x1={x.cords}
            y1={from.y}
            x2={x.branches}
            y2={b.y}
            stroke={SOFT}
            strokeWidth={1.8}
            {...stagger(i + 8)}
          />
        );
      })}

      {/* labels */}
      {roots.map((r, i) => (
        <text key={r.id} x={x.roots - 24} y={r.y + 3.5} textAnchor="middle" fill={INK} fontSize={9.5} fontWeight={700} fontFamily="Manrope, sans-serif">
          {r.id}
        </text>
      ))}
      {trunks.map((t) => (
        <text key={t.id} x={x.trunks + 6} y={t.y - 6} fill={INK} fontSize={8} fontFamily="Manrope, sans-serif">
          {t.id}
        </text>
      ))}
      {cords.map((c) => (
        <text key={c.id} x={x.cords + 6} y={c.y + 3.5} fill={accent} fontSize={8.5} fontWeight={700} fontFamily="Manrope, sans-serif">
          {c.id}
        </text>
      ))}
      {branches.map((b) => (
        <text key={b.id} x={x.branches + 6} y={b.y + 3.5} fill={INK} fontSize={8.5} fontWeight={600} fontFamily="Manrope, sans-serif">
          {b.id}
        </text>
      ))}

      {/* level headers */}
      {[
        { label: "ROOTS", x: x.roots },
        { label: "TRUNKS", x: x.trunks },
        { label: "DIVISIONS", x: x.divisions },
        { label: "CORDS", x: x.cords },
        { label: "BRANCHES", x: x.branches + 24 },
      ].map((h, i) => (
        <text key={i} x={h.x} y={18} textAnchor="middle" fill="#8f8fc4" fontSize={8.5} fontWeight={800} letterSpacing={1} fontFamily="Manrope, sans-serif">
          {h.label}
        </text>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Krebs cycle — the 8-stop roundabout                              */
/* ------------------------------------------------------------------ */

function KrebsDiagram({ accent }: { accent: string }) {
  const nodes = [
    "Oxaloacetate",
    "Citrate",
    "Isocitrate",
    "α-Ketoglutarate",
    "Succinyl-CoA",
    "Succinate",
    "Fumarate",
    "Malate",
  ];
  const cx = 240,
    cy = 150,
    R = 108;
  const pos = nodes.map((_, i) => {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2; // start at top, clockwise
    return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) };
  });
  const co2 = [2, 3]; // isocitrate & α-KG release CO₂

  return (
    <svg viewBox="0 0 480 300" className="w-full" role="img" aria-label="Krebs cycle roundabout">
      {/* ring */}
      <circle cx={cx} cy={cy} r={R + 14} fill="none" stroke={SOFT} strokeWidth={1.4} strokeDasharray="4 5" opacity={0.7} />

      {/* arrows between nodes */}
      {nodes.map((_, i) => {
        const a = pos[i];
        const b = pos[(i + 1) % 8];
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        const ang = Math.atan2(b.y - a.y, b.x - a.x);
        const ex = mx + (Math.cos(ang) * 16);
        const ey = my + (Math.sin(ang) * 16);
        return (
          <g key={i}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#b9b9e0" strokeWidth={1.4} />
            <polygon
              points={`${ex},${ey} ${ex - Math.cos(ang - 0.5) * 7},${ey - Math.sin(ang - 0.5) * 7} ${ex - Math.cos(ang + 0.5) * 7},${ey - Math.sin(ang + 0.5) * 7}`}
              fill="#b9b9e0"
            />
          </g>
        );
      })}

      {/* node circles with sequential glow */}
      {nodes.map((n, i) => (
        <motion.g
          key={n}
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.35 }}
        >
          <circle cx={pos[i].x} cy={pos[i].y} r={30} fill={FILL} stroke={i === 0 ? accent : CLOUD} strokeWidth={2} />
          <circle cx={pos[i].x} cy={pos[i].y} r={22} fill={accent} opacity={0.12} />
          <text x={pos[i].x} y={pos[i].y - 1} textAnchor="middle" fill={INK} fontSize={8.8} fontWeight={700} fontFamily="Manrope, sans-serif">
            {n.split("-")[0]}
          </text>
          {co2.includes(i) && (
            <text x={pos[i].x} y={pos[i].y + 12} textAnchor="middle" fill="#d97c8c" fontSize={8} fontWeight={800} fontFamily="Manrope, sans-serif">
              −CO₂
            </text>
          )}
        </motion.g>
      ))}

      {/* center */}
      <circle cx={cx} cy={cy} r={46} fill="oklch(1 0 0 / 0.6)" stroke={SOFT} strokeWidth={1.5} />
      <text x={cx} y={cy - 8} textAnchor="middle" fill={INK} fontSize={9.5} fontWeight={800} fontFamily="Manrope, sans-serif">
        MITOCHONDRIAL
      </text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill={INK} fontSize={9.5} fontWeight={800} fontFamily="Manrope, sans-serif">
        MATRIX
      </text>

      {/* tally */}
      <g fontSize={9.5} fontWeight={700} fontFamily="Manrope, sans-serif">
        <text x={24} y={36} fill={CLOUD}>3 NADH → 9 ATP</text>
        <text x={24} y={54} fill={SOFT}>1 FADH₂ → 2 ATP</text>
        <text x={24} y={72} fill={accent}>1 GTP → 1 ATP</text>
        <text x={24} y={90} fill="#d97c8c">2 CO₂ exhaled</text>
        <text x={24} y={116} fill={INK} fontWeight={800}>≈ 10 ATP / turn</text>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 5. DNA replication — the fork                                       */
/* ------------------------------------------------------------------ */

function DnaDiagram({ accent }: { accent: string }) {
  const strand = (offset: number, color: string, dash?: string) => (
    <path
      d={`M ${180 + offset} 30 C ${200 + offset} 44, ${160 + offset} 58, ${180 + offset} 72 C ${200 + offset} 86, ${160 + offset} 100, ${180 + offset} 114 C ${200 + offset} 128, ${170 + offset} 138, ${168 + offset} 146`}
      fill="none"
      stroke={color}
      strokeWidth={2.4}
      strokeDasharray={dash}
    />
  );

  return (
    <svg viewBox="0 0 480 250" className="w-full" role="img" aria-label="DNA replication fork">
      {/* parent double helix — two strands */}
      {strand(-8, SOFT)}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {strand(8, CLOUD, "6 4")}
      </motion.g>

      {/* fork */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <path d="M 168 146 L 120 226" stroke={SOFT} strokeWidth={2.4} fill="none" />
        <path d="M 168 146 L 216 226" stroke={CLOUD} strokeWidth={2.4} fill="none" />
      </motion.g>

      {/* helicase */}
      <motion.g
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M 168 146 l -10 -12 l 20 0 Z" fill={accent} opacity={0.85} />
        <text x={196} y={140} fill={INK} fontSize={9} fontWeight={700} fontFamily="Manrope, sans-serif">
          helicase
        </text>
      </motion.g>

      {/* leading strand */}
      <motion.path
        d="M 120 226 L 96 226"
        stroke={accent}
        strokeWidth={3}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse", repeatDelay: 0.8 }}
      />
      <text x={60} y={228} fill={accent} fontSize={9} fontWeight={800} fontFamily="Manrope, sans-serif">
        LEADING (continuous)
      </text>

      {/* lagging strand — Okazaki fragments appear sequentially */}
      {[
        { y: 178 },
        { y: 196 },
        { y: 214 },
      ].map((frag, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, times: [0, 0.3, 1], delay: i * 0.8 }}
        >
          <path
            d={`M 216 226 L ${200 + i * 14} ${frag.y}`}
            stroke={accent}
            strokeWidth={2.6}
            fill="none"
          />
          <text x={226} y={frag.y + 3} fill={INK} fontSize={8.5} fontFamily="Manrope, sans-serif">
            {i === 0 ? "Okazaki" : ""}
          </text>
        </motion.g>
      ))}
      <text x={228} y={238} fill={INK} fontSize={9} fontWeight={800} fontFamily="Manrope, sans-serif">
        LAGGING (fragments)
      </text>

      {/* enzyme chips */}
      {[
        { label: "primase — RNA primer", x: 44, y: 96 },
        { label: "polymerase — extends 5′→3′", x: 44, y: 118 },
        { label: "ligase — stitches nicks", x: 44, y: 140 },
      ].map((e, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 + i * 0.25 }}
        >
          <rect x={e.x - 8} y={e.y - 12} width={208} height={19} rx={9.5} fill={FILL} stroke="#d5d5ee" strokeWidth={1} />
          <text x={e.x} y={e.y + 1} fill={INK} fontSize={8.8} fontWeight={600} fontFamily="Manrope, sans-serif">
            {e.label}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Wrapper with graceful fallback                                      */
/* ------------------------------------------------------------------ */

const DIAGRAMS: Record<string, (props: { accent: string }) => React.ReactElement> = {
  cardiac: CardiacDiagram,
  potential: PotentialDiagram,
  plexus: PlexusDiagram,
  krebs: KrebsDiagram,
  dna: DnaDiagram,
};

/** Error boundary: if a diagram ever fails to render, show the friendly fallback. */
class DiagramErrorBoundary extends Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function FallbackVisual({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-wistaria/40 bg-white/5 p-6 text-center",
        className,
      )}
    >
      <AlertCircle className="size-6 text-wistaria" />
      <p className="text-sm text-muted-foreground">
        This visual is unavailable on your device right now — the text below covers everything you
        need.
      </p>
    </div>
  );
}

export function TopicDiagram({
  diagram,
  accent,
  className,
}: {
  diagram: string;
  accent: string;
  className?: string;
}) {
  const Diagram = DIAGRAMS[diagram];

  const fallback = <FallbackVisual className={className} />;

  if (!Diagram) return fallback;

  return (
    <DiagramErrorBoundary fallback={fallback}>
      <div className={cn("glass-panel rounded-2xl p-4", className)}>
        <Diagram accent={accent} />
      </div>
    </DiagramErrorBoundary>
  );
}
