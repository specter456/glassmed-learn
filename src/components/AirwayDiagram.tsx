import { motion } from "framer-motion";
import { Info, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AirwayPart {
  id: string;
  label: string;
  description: string;
  color: string;
}

const PARTS: AirwayPart[] = [
  {
    id: "oral-cavity",
    label: "Oral Cavity",
    description: "The mouth serves as the primary entry point for the laryngoscope blade. The tongue is displaced to the left to visualise the glottis.",
    color: "#f97316",
  },
  {
    id: "epiglottis",
    label: "Epiglottis",
    description: "A leaf-shaped flap of cartilage that covers the larynx during swallowing. In RSI, the laryngoscope blade (Miller or MAC) displaces the epiglottis to expose the vocal cords.",
    color: "#ef4444",
  },
  {
    id: "vocal-cords",
    label: "Vocal Cords (Glottis)",
    description: "The V-shaped opening between the vocal cords is the target for endotracheal tube placement. The tube must pass between the cords — not in front of or behind them. This is the most critical step in intubation.",
    color: "#dc2626",
  },
  {
    id: "trachea",
    label: "Trachea",
    description: "The cartilaginous tube extending from the larynx to the carina (bifurcation into left and right main bronchi). The endotracheal tube tip should sit 2–5 cm above the carina. Contains 16–20 C-shaped cartilage rings.",
    color: "#b91c1c",
  },
  {
    id: "cricoid-cartilage",
    label: "Cricoid Cartilage",
    description: "The only complete cartilaginous ring of the airway. Located at C6 level. Sellick's manoeuvre applies pressure here to occlude the oesophagus and reduce aspiration risk during RSI.",
    color: "#f59e0b",
  },
  {
    id: "arytenoid-cartilages",
    label: "Arytenoid Cartilages",
    description: "Small pyramid-shaped cartilages posterior to the vocal cords. Important landmark: the arytenoids must be visible to confirm the tube has passed through the glottis. The Cormack-Lehane grading system is based on visibility of these structures.",
    color: "#fb923c",
  },
  {
    id: "oesophagus",
    label: "Oesophagus",
    description: "The muscular tube posterior to the trachea. Accidental oesophageal intubation is a life-threatening complication. End-tidal CO₂ capnography is the gold standard for confirming tracheal (not oesophageal) placement.",
    color: "#78716c",
  },
  {
    id: "right-main-bronchus",
    label: "Right Main Bronchus",
    description: "The right main bronchus is shorter, wider, and more vertical than the left — making it the more common site for accidental mainstem intubation. The ETT tip can easily enter the right bronchus if advanced too far.",
    color: "#dc2626",
  },
];

export function AirwayDiagram({ className }: { className?: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const active = selected ?? hovered;
  const activePart = PARTS.find((p) => p.id === active);

  return (
    <div className={cn("relative w-full", className)}>
      {/* Legend */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {PARTS.filter((p) => p.id !== "oesophagus").map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(selected === p.id ? null : p.id)}
            onMouseEnter={() => setHovered(p.id)}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold transition-all",
              active === p.id
                ? "bg-white/15 text-white scale-105"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
            )}
          >
            <span className="size-1.5 rounded-full" style={{ background: p.color }} />
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex gap-3 items-start">
        {/* SVG Diagram */}
        <div className="flex-1 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(185,28,28,0.08) 0%, rgba(249,115,22,0.05) 100%)" }}>
          <svg viewBox="0 0 320 600" className="w-full h-auto" style={{ maxHeight: 420 }}>
            <defs>
              <filter id="glow-airway" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-intense" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="trachea-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.7" />
              </linearGradient>
              <radialGradient id="glottis-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background glow */}
            <motion.ellipse
              cx="160" cy="280" rx="80" ry="200"
              fill="url(#glottis-glow)"
              animate={{ opacity: [0.3, 0.5, 0.3], rx: [75, 85, 75] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Oral Cavity / Mouth */}
            <motion.path
              d="M100 60 Q160 40 220 60 L215 100 Q160 90 105 100 Z"
              fill={active === "oral-cavity" ? "#f97316" : "rgba(249,115,22,0.2)"}
              stroke="#f97316"
              strokeWidth={active === "oral-cavity" ? 2.5 : 1.5}
              filter={active === "oral-cavity" ? "url(#glow-intense)" : "url(#glow-airway)"}
              className="cursor-pointer"
              onClick={() => setSelected("oral-cavity")}
              onMouseEnter={() => setHovered("oral-cavity")}
              onMouseLeave={() => setHovered(null)}
              animate={active === "oral-cavity" ? { opacity: [0.8, 1, 0.8] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <text x="160" y="85" textAnchor="middle" className="fill-white/70 text-[10px] font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>Oral Cavity</text>

            {/* Tongue outline */}
            <path d="M120 95 Q160 110 200 95 Q195 125 160 130 Q125 125 120 95" fill="rgba(249,115,22,0.1)" stroke="rgba(249,115,22,0.3)" strokeWidth="1" />

            {/* Epiglottis */}
            <motion.path
              d="M130 140 Q160 120 190 140 Q175 170 160 175 Q145 170 130 140"
              fill={active === "epiglottis" ? "#ef4444" : "rgba(239,68,68,0.25)"}
              stroke="#ef4444"
              strokeWidth={active === "epiglottis" ? 2.5 : 1.5}
              filter={active === "epiglottis" ? "url(#glow-intense)" : "url(#glow-airway)"}
              className="cursor-pointer"
              onClick={() => setSelected("epiglottis")}
              onMouseEnter={() => setHovered("epiglottis")}
              onMouseLeave={() => setHovered(null)}
              animate={active === "epiglottis" ? { opacity: [0.7, 1, 0.7] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <text x="210" y="162" textAnchor="start" className="fill-white/70 text-[9px] font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>Epiglottis</text>
            <line x1="188" y1="155" x2="208" y2="158" stroke="rgba(239,68,68,0.4)" strokeWidth="1" />

            {/* Arytenoid Cartilages */}
            <motion.circle
              cx="142" cy="210" r="6"
              fill={active === "arytenoid-cartilages" ? "#fb923c" : "rgba(251,146,60,0.3)"}
              stroke="#fb923c"
              strokeWidth={active === "arytenoid-cartilages" ? 2 : 1}
              filter={active === "arytenoid-cartilages" ? "url(#glow-intense)" : "url(#glow-airway)"}
              className="cursor-pointer"
              onClick={() => setSelected("arytenoid-cartilages")}
              onMouseEnter={() => setHovered("arytenoid-cartilages")}
              onMouseLeave={() => setHovered(null)}
            />
            <motion.circle
              cx="178" cy="210" r="6"
              fill={active === "arytenoid-cartilages" ? "#fb923c" : "rgba(251,146,60,0.3)"}
              stroke="#fb923c"
              strokeWidth={active === "arytenoid-cartilages" ? 2 : 1}
              filter={active === "arytenoid-cartilages" ? "url(#glow-intense)" : "url(#glow-airway)"}
              className="cursor-pointer"
              onClick={() => setSelected("arytenoid-cartilages")}
              onMouseEnter={() => setHovered("arytenoid-cartilages")}
              onMouseLeave={() => setHovered(null)}
            />

            {/* Vocal Cords / Glottis - V-shape */}
            <motion.path
              d="M142 200 L155 240 L160 250 L165 240 L178 200"
              fill="none"
              stroke={active === "vocal-cords" ? "#dc2626" : "rgba(220,38,38,0.6)"}
              strokeWidth={active === "vocal-cords" ? 3 : 2}
              filter={active === "vocal-cords" ? "url(#glow-intense)" : "url(#glow-airway)"}
              className="cursor-pointer"
              onClick={() => setSelected("vocal-cords")}
              onMouseEnter={() => setHovered("vocal-cords")}
              onMouseLeave={() => setHovered(null)}
              animate={active === "vocal-cords" ? { opacity: [0.6, 1, 0.6] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
            {/* Glottis opening glow */}
            <motion.ellipse
              cx="160" cy="230" rx="8" ry="15"
              fill={active === "vocal-cords" ? "rgba(220,38,38,0.4)" : "rgba(220,38,38,0.15)"}
              animate={{ ry: [12, 18, 12], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <text x="210" y="230" textAnchor="start" className="fill-white/80 text-[10px] font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>Vocal Cords</text>
            <line x1="178" y1="225" x2="208" y2="228" stroke="rgba(220,38,38,0.4)" strokeWidth="1" />

            {/* Cricoid Cartilage */}
            <motion.path
              d="M135 260 Q160 255 185 260 L183 275 Q160 278 137 275 Z"
              fill={active === "cricoid-cartilage" ? "#f59e0b" : "rgba(245,158,11,0.2)"}
              stroke="#f59e0b"
              strokeWidth={active === "cricoid-cartilage" ? 2 : 1}
              filter={active === "cricoid-cartilage" ? "url(#glow-intense)" : "url(#glow-airway)"}
              className="cursor-pointer"
              onClick={() => setSelected("cricoid-cartilage")}
              onMouseEnter={() => setHovered("cricoid-cartilage")}
              onMouseLeave={() => setHovered(null)}
            />
            <text x="60" y="272" textAnchor="end" className="fill-white/60 text-[9px] font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>Cricoid</text>
            <line x1="65" y1="268" x2="133" y2="268" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />

            {/* Trachea - cartilage rings */}
            <motion.rect
              x="138" y="280" width="44" height="140" rx="8"
              fill={active === "trachea" ? "url(#trachea-grad)" : "rgba(185,28,28,0.15)"}
              stroke={active === "trachea" ? "#dc2626" : "rgba(185,28,28,0.4)"}
              strokeWidth={active === "trachea" ? 2 : 1}
              filter={active === "trachea" ? "url(#glow-intense)" : "url(#glow-airway)"}
              className="cursor-pointer"
              onClick={() => setSelected("trachea")}
              onMouseEnter={() => setHovered("trachea")}
              onMouseLeave={() => setHovered(null)}
            />
            {/* Cartilage rings */}
            {[295, 310, 325, 340, 355, 370, 385, 400].map((y) => (
              <line key={y} x1="140" y1={y} x2="180" y2={y} stroke="rgba(220,38,38,0.25)" strokeWidth="1" />
            ))}
            <text x="210" y="355" textAnchor="start" className="fill-white/70 text-[10px] font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>Trachea</text>
            <line x1="183" y1="350" x2="208" y2="352" stroke="rgba(220,38,38,0.3)" strokeWidth="1" />

            {/* Oesophagus - behind trachea */}
            <motion.path
              d="M195 280 Q210 280 215 285 L215 420 Q210 425 195 425 Q185 425 185 420 L185 285 Q185 280 195 280"
              fill={active === "oesophagus" ? "rgba(120,113,108,0.3)" : "rgba(120,113,108,0.1)"}
              stroke="rgba(120,113,108,0.3)"
              strokeWidth="1"
              strokeDasharray="4 3"
              className="cursor-pointer"
              onClick={() => setSelected("oesophagus")}
              onMouseEnter={() => setHovered("oesophagus")}
              onMouseLeave={() => setHovered(null)}
            />
            <text x="235" y="355" textAnchor="start" className="fill-white/40 text-[8px] font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>Oesophagus</text>
            <line x1="217" y1="350" x2="233" y2="352" stroke="rgba(120,113,108,0.2)" strokeWidth="1" />

            {/* Carina / bifurcation */}
            <path d="M148 420 L130 460" stroke="rgba(220,38,38,0.5)" strokeWidth="2" fill="none" filter="url(#glow-airway)" />
            <path d="M172 420 L190 460" stroke="rgba(220,38,38,0.5)" strokeWidth="2" fill="none" filter="url(#glow-airway)" />
            <text x="160" y="435" textAnchor="middle" className="fill-white/40 text-[8px] font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>Carina</text>

            {/* Right Main Bronchus */}
            <motion.path
              d="M172 420 Q180 440 190 460 Q195 480 185 510"
              fill="none"
              stroke={active === "right-main-bronchus" ? "#dc2626" : "rgba(220,38,38,0.4)"}
              strokeWidth={active === "right-main-bronchus" ? 3 : 2}
              filter={active === "right-main-bronchus" ? "url(#glow-intense)" : "url(#glow-airway)"}
              className="cursor-pointer"
              onClick={() => setSelected("right-main-bronchus")}
              onMouseEnter={() => setHovered("right-main-bronchus")}
              onMouseLeave={() => setHovered(null)}
            />
            <text x="210" y="490" textAnchor="start" className="fill-white/50 text-[8px] font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>R. Main</text>

            {/* Left Main Bronchus */}
            <path d="M148 420 Q140 440 130 460 Q125 480 135 510" fill="none" stroke="rgba(220,38,38,0.3)" strokeWidth="2" filter="url(#glow-airway)" />
            <text x="80" y="490" textAnchor="end" className="fill-white/40 text-[8px] font-bold" style={{ fontFamily: "Manrope, sans-serif" }}>L. Main</text>

            {/* Animated pulse along trachea */}
            <motion.circle
              cx="160" cy="280" r="3"
              fill="#ef4444"
              filter="url(#glow-intense)"
              animate={{ cy: [280, 420], opacity: [0.8, 0], r: [3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </div>

        {/* Info Panel */}
        {activePart && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel flex-shrink-0 w-64 rounded-2xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full" style={{ background: activePart.color }} />
                <span className="text-sm font-extrabold text-wistaria">{activePart.label}</span>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                <X className="size-3.5" />
              </button>
            </div>
            <p className="text-xs leading-5 text-muted-foreground">{activePart.description}</p>
          </motion.div>
        )}
      </div>

      {/* Clinical Pearl */}
      <div className="mt-3 flex items-start gap-2 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/20 px-3 py-2">
        <Info className="size-3.5 mt-0.5 shrink-0 text-[#ef4444]" />
        <p className="text-[11px] leading-4 text-[#fca5a5]">
          <span className="font-extrabold">RSI Pearl:</span> The key landmarks for intubation are the epiglottis, arytenoid cartilages, and vocal cords. If you can see the arytenoids, you can intubate.
        </p>
      </div>
    </div>
  );
}
