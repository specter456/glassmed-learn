import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DNAStructure {
  id: string;
  label: string;
  color: string;
  desc: string;
}

const PARTS: DNAStructure[] = [
  {
    id: "parent-dna",
    label: "Parent DNA (Double Helix)",
    color: "#a78bfa",
    desc: "The original double-stranded DNA before replication. Two antiparallel strands (5'→3' and 3'→5') held together by hydrogen bonds between complementary base pairs: A-T (2 bonds) and G-C (3 bonds). The entire molecule is ~2 metres long if uncoiled, yet fits inside a nucleus just 6 μm across.",
  },
  {
    id: "helicase",
    label: "Helicase",
    color: "#f472b6",
    desc: "The 'zipper opener' — an enzyme that uses ATP hydrolysis to break hydrogen bonds between base pairs, unwinding the double helix ahead of the replication fork. In eukaryotes, the MCM2-7 complex loads during G1 and fires in S phase. Creates topological stress (supercoiling) that topoisomerase relieves.",
  },
  {
    id: "leading-strand",
    label: "Leading Strand",
    color: "#22d3ee",
    desc: "Synthesised CONTINUOUSLY in the 5'→3' direction, following the replication fork. Requires only ONE RNA primer (laid by primase). The template strand runs 3'→5' toward the fork, so DNA polymerase can chase the unwinding helicase without stopping. Pol ε (eukaryotes) or Pol III (bacteria) does the heavy lifting.",
  },
  {
    id: "lagging-strand",
    label: "Lagging Strand",
    color: "#fb923c",
    desc: "Synthesised DISCONTINUOUSLY in short Okazaki fragments (100–200 bp in eukaryotes), each starting with its own RNA primer. The template runs 5'→3' toward the fork, so polymerase must work BACKWARD away from the fork, then leap forward. Multiple primers → multiple fragments → all stitched by DNA ligase.",
  },
  {
    id: "okazaki",
    label: "Okazaki Fragments",
    color: "#fbbf24",
    desc: "Short, discontinuous pieces of newly synthesised DNA on the lagging strand (named after Reiji and Tsuneko Okazaki, 1968). Each is 100–200 bp in eukaryotes, 1000–2000 bp in bacteria. RNA primers at the start of each fragment are removed by RNase H/FEN1, gaps filled by Pol δ, and nicks sealed by DNA ligase.",
  },
  {
    id: "dna-polymerase",
    label: "DNA Polymerase",
    color: "#34d399",
    desc: "The master builder — reads the template strand 3'→5' and adds complementary nucleotides to the growing strand 5'→3'. Has proofreading ability (3'→5' exonuclease) that removes mismatched bases. Eukaryotes use Pol ε (leading) and Pol δ (lagging). Error rate after proofreading: ~1 in 10⁷.",
  },
  {
    id: "primase",
    label: "Primase",
    color: "#e879f9",
    desc: "Synthesises short RNA primers (10–12 nt) that provide the 3'-OH start point DNA polymerase needs. On the leading strand: ONE primer. On the lagging strand: a NEW primer for EVERY Okazaki fragment. Primase is later removed and the RNA replaced with DNA by polymerase and ligase.",
  },
  {
    id: "ssb-proteins",
    label: "SSB Proteins",
    color: "#60a5fa",
    desc: "Single-Strand Binding proteins coat the unwound single-stranded DNA to prevent it from re-annealing (snapping back together) or being degraded by nucleases. In eukaryotes, the heterotrimeric RPA (Replication Protein A) performs this role. They are essential for keeping the template accessible to polymerase.",
  },
];

export function DNAReplicationDiagram({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const part = PARTS.find((p) => p.id === active);

  const isLit = (id: string) => hover === id || active === id;

  return (
    <div className={className}>
      <div className="relative mx-auto w-full max-w-2xl">
        <svg viewBox="0 0 600 420" className="w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="dna-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="dna-glow-strong" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Background pulse */}
          <ellipse cx="300" cy="210" rx="280" ry="190" fill="none" stroke="rgba(167,139,250,0.06)" strokeWidth="1">
            <animate attributeName="rx" values="275;285;275" dur="5s" repeatCount="indefinite" />
          </ellipse>

          {/* ===== PARENT DNA (double helix, left side) ===== */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHover("parent-dna")}
            onMouseLeave={() => setHover(null)}
            onClick={() => setActive(active === "parent-dna" ? null : "parent-dna")}
          >
            {/* Strand 1 (top) */}
            <path
              d="M 40 120 C 80 100, 120 140, 160 120 C 200 100, 240 140, 280 130"
              fill="none"
              stroke={isLit("parent-dna") ? "#a78bfa" : "rgba(167,139,250,0.6)"}
              strokeWidth={isLit("parent-dna") ? 4 : 3}
              filter="url(#dna-glow)"
              strokeLinecap="round"
            />
            {/* Strand 2 (bottom) */}
            <path
              d="M 40 180 C 80 200, 120 160, 160 180 C 200 200, 240 160, 280 170"
              fill="none"
              stroke={isLit("parent-dna") ? "#a78bfa" : "rgba(167,139,250,0.6)"}
              strokeWidth={isLit("parent-dna") ? 4 : 3}
              filter="url(#dna-glow)"
              strokeLinecap="round"
            />
            {/* Base pair rungs */}
            {[60, 90, 120, 150, 180, 210, 240, 260].map((x, i) => {
              const y1 = 120 + Math.sin((x / 40)) * 15 + (x < 200 ? 0 : (x - 200) * -0.08);
              const y2 = 180 - Math.sin((x / 40)) * 15 + (x < 200 ? 0 : (x - 200) * 0.08);
              const colors = ["#22d3ee", "#f472b6", "#fbbf24", "#34d399"];
              return (
                <line key={`bp-${i}`} x1={x} y1={y1} x2={x} y2={y2}
                  stroke={colors[i % 4]} strokeWidth="2" opacity={isLit("parent-dna") ? 0.8 : 0.4}
                  filter={isLit("parent-dna") ? "url(#dna-glow)" : undefined}
                />
              );
            })}
            <text x="150" y="95" textAnchor="middle" fill="#a78bfa" fontSize="10" fontWeight="bold" opacity="0.7">Parent DNA</text>
          </g>

          {/* ===== HELICASE (at the fork) ===== */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHover("helicase")}
            onMouseLeave={() => setHover(null)}
            onClick={() => setActive(active === "helicase" ? null : "helicase")}
          >
            <circle
              cx="285" cy="150" r={isLit("helicase") ? 18 : 15}
              fill={isLit("helicase") ? "rgba(244,114,182,0.2)" : "rgba(244,114,182,0.1)"}
              stroke={isLit("helicase") ? "#f472b6" : "rgba(244,114,182,0.5)"}
              strokeWidth={isLit("helicase") ? 3 : 2}
              filter={isLit("helicase") ? "url(#dna-glow-strong)" : "url(#dna-glow)"}
            />
            <text x="285" y="147" textAnchor="middle" fill="#f472b6" fontSize="7" fontWeight="bold">🌀</text>
            <text x="285" y="157" textAnchor="middle" fill="#f472b6" fontSize="6" fontWeight="bold">HELICASE</text>
            {/* Rotation animation */}
            <animateTransform attributeName="transform" type="rotate" from="0 285 150" to="360 285 150" dur="3s" repeatCount="indefinite" />
          </g>

          {/* ===== SSB PROTEINS (on single strands near fork) ===== */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHover("ssb-proteins")}
            onMouseLeave={() => setHover(null)}
            onClick={() => setActive(active === "ssb-proteins" ? null : "ssb-proteins")}
          >
            {[305, 325, 345].map((x, i) => (
              <circle key={`ssb-${i}`} cx={x} cy={i % 2 === 0 ? 108 : 192} r={isLit("ssb-proteins") ? 5 : 4}
                fill={isLit("ssb-proteins") ? "#60a5fa" : "rgba(96,165,250,0.4)"}
                filter={isLit("ssb-proteins") ? "url(#dna-glow)" : undefined}
                style={{ cursor: "pointer", transition: "r 0.3s" }}
              />
            ))}
            <text x="325" y="80" textAnchor="middle" fill="#60a5fa" fontSize="7" fontWeight="bold">SSB</text>
          </g>

          {/* ===== LEADING STRAND (top, continuous) ===== */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHover("leading-strand")}
            onMouseLeave={() => setHover(null)}
            onClick={() => setActive(active === "leading-strand" ? null : "leading-strand")}
          >
            {/* Template strand */}
            <path
              d="M 280 130 C 310 115, 350 100, 400 95 C 440 90, 480 88, 530 85"
              fill="none"
              stroke={isLit("leading-strand") ? "rgba(167,139,250,0.7)" : "rgba(167,139,250,0.3)"}
              strokeWidth="2" strokeDasharray="4 3"
            />
            {/* New leading strand */}
            <path
              d="M 310 118 C 340 108, 380 100, 420 96 C 460 92, 500 90, 540 88"
              fill="none"
              stroke={isLit("leading-strand") ? "#22d3ee" : "rgba(34,211,238,0.5)"}
              strokeWidth={isLit("leading-strand") ? 4 : 3}
              filter={isLit("leading-strand") ? "url(#dna-glow-strong)" : "url(#dna-glow)"}
              strokeLinecap="round"
            />
            {/* Flowing synthesis dots */}
            {[0, 0.3, 0.6].map((o, i) => (
              <circle key={`lead-${i}`} r="2.5" fill="#22d3ee" opacity="0.8">
                <animateMotion dur="2s" begin={`${o * 2}s`} repeatCount="indefinite"
                  path="M 310 118 C 340 108, 380 100, 420 96 C 460 92, 500 90, 540 88"
                />
              </circle>
            ))}
            <text x="440" y="75" textAnchor="middle" fill="#22d3ee" fontSize="9" fontWeight="bold" opacity="0.8">LEADING STRAND →</text>
            <text x="440" y="66" textAnchor="middle" fill="#22d3ee" fontSize="7" opacity="0.5">(continuous 5'→3')</text>
          </g>

          {/* ===== LAGGING STRAND (bottom, discontinuous) ===== */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHover("lagging-strand")}
            onMouseLeave={() => setHover(null)}
            onClick={() => setActive(active === "lagging-strand" ? null : "lagging-strand")}
          >
            {/* Template strand */}
            <path
              d="M 280 170 C 310 185, 350 200, 400 205 C 440 210, 480 212, 530 215"
              fill="none"
              stroke={isLit("lagging-strand") ? "rgba(167,139,250,0.7)" : "rgba(167,139,250,0.3)"}
              strokeWidth="2" strokeDasharray="4 3"
            />
            {/* Okazaki fragment 1 */}
            <path
              d="M 320 175 C 340 183, 360 188, 380 190"
              fill="none"
              stroke={isLit("lagging-strand") ? "#fb923c" : "rgba(251,146,60,0.5)"}
              strokeWidth={isLit("lagging-strand") ? 3.5 : 2.5}
              filter={isLit("lagging-strand") ? "url(#dna-glow)" : undefined}
              strokeLinecap="round"
            />
            {/* Okazaki fragment 2 */}
            <path
              d="M 400 194 C 420 198, 440 202, 460 204"
              fill="none"
              stroke={isLit("lagging-strand") ? "#fb923c" : "rgba(251,146,60,0.5)"}
              strokeWidth={isLit("lagging-strand") ? 3.5 : 2.5}
              filter={isLit("lagging-strand") ? "url(#dna-glow)" : undefined}
              strokeLinecap="round"
            />
            {/* Okazaki fragment 3 */}
            <path
              d="M 480 206 C 500 210, 520 212, 540 214"
              fill="none"
              stroke={isLit("lagging-strand") ? "#fb923c" : "rgba(251,146,60,0.5)"}
              strokeWidth={isLit("lagging-strand") ? 3.5 : 2.5}
              filter={isLit("lagging-strand") ? "url(#dna-glow)" : undefined}
              strokeLinecap="round"
            />
            {/* Gaps between fragments */}
            <text x="390" y="198" textAnchor="middle" fill="rgba(251,146,60,0.4)" fontSize="6">gap</text>
            <text x="470" y="208" textAnchor="middle" fill="rgba(251,146,60,0.4)" fontSize="6">gap</text>
            <text x="440" y="240" textAnchor="middle" fill="#fb923c" fontSize="9" fontWeight="bold" opacity="0.8">← LAGGING STRAND</text>
            <text x="440" y="250" textAnchor="middle" fill="#fb923c" fontSize="7" opacity="0.5">(Okazaki fragments)</text>
          </g>

          {/* ===== OKAZAKI FRAGMENTS (highlight) ===== */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHover("okazaki")}
            onMouseLeave={() => setHover(null)}
            onClick={() => setActive(active === "okazaki" ? null : "okazaki")}
          >
            {[340, 420, 500].map((cx, i) => (
              <rect key={`ok-${i}`} x={cx - 12} y={183 + (i % 2) * 3} width="24" height="6" rx="3"
                fill={isLit("okazaki") ? "#fbbf24" : "rgba(251,191,36,0.3)"}
                filter={isLit("okazaki") ? "url(#dna-glow)" : undefined}
                style={{ cursor: "pointer", transition: "fill 0.3s" }}
              />
            ))}
            {isLit("okazaki") && (
              <text x="420" y="270" textAnchor="middle" fill="#fbbf24" fontSize="7" fontWeight="bold">Okazaki fragments (100-200 bp each)</text>
            )}
          </g>

          {/* ===== DNA POLYMERASE (on leading strand) ===== */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHover("dna-polymerase")}
            onMouseLeave={() => setHover(null)}
            onClick={() => setActive(active === "dna-polymerase" ? null : "dna-polymerase")}
          >
            <ellipse
              cx="365" cy="107" rx={isLit("dna-polymerase") ? 20 : 17} ry={isLit("dna-polymerase") ? 12 : 10}
              fill={isLit("dna-polymerase") ? "rgba(52,211,153,0.2)" : "rgba(52,211,153,0.1)"}
              stroke={isLit("dna-polymerase") ? "#34d399" : "rgba(52,211,153,0.5)"}
              strokeWidth={isLit("dna-polymerase") ? 2.5 : 1.5}
              filter={isLit("dna-polymerase") ? "url(#dna-glow-strong)" : "url(#dna-glow)"}
            />
            <text x="365" y="104" textAnchor="middle" fill="#34d399" fontSize="6" fontWeight="bold">POL</text>
            <text x="365" y="113" textAnchor="middle" fill="#34d399" fontSize="5">ε/III</text>
          </g>

          {/* ===== PRIMASE (on lagging strand) ===== */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHover("primase")}
            onMouseLeave={() => setHover(null)}
            onClick={() => setActive(active === "primase" ? null : "primase")}
          >
            <circle
              cx="310" cy="175" r={isLit("primase") ? 10 : 8}
              fill={isLit("primase") ? "rgba(232,121,249,0.2)" : "rgba(232,121,249,0.1)"}
              stroke={isLit("primase") ? "#e879f9" : "rgba(232,121,249,0.5)"}
              strokeWidth={isLit("primase") ? 2 : 1.5}
              filter={isLit("primase") ? "url(#dna-glow)" : undefined}
            />
            <text x="310" y="178" textAnchor="middle" fill="#e879f9" fontSize="6" fontWeight="bold">PRIMASE</text>
          </g>

          {/* ===== Direction arrows ===== */}
          <g opacity="0.4">
            {/* Fork movement direction */}
            <path d="M 270 295 L 230 295" fill="none" stroke="white" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <text x="250" y="310" textAnchor="middle" fill="white" fontSize="7">Fork direction →</text>
          </g>

          {/* ===== Labels for base pairs ===== */}
          <g opacity="0.5">
            <text x="60" y="205" fill="#22d3ee" fontSize="7">A─T</text>
            <text x="90" y="205" fill="#f472b6" fontSize="7">G─C</text>
            <text x="120" y="205" fill="#fbbf24" fontSize="7">T─A</text>
            <text x="150" y="205" fill="#34d399" fontSize="7">C─G</text>
          </g>

          {/* 5' and 3' direction labels */}
          <text x="30" y="115" fill="#a78bfa" fontSize="8" fontWeight="bold" opacity="0.6">5'</text>
          <text x="30" y="185" fill="#a78bfa" fontSize="8" fontWeight="bold" opacity="0.6">3'</text>
          <text x="550" y="80" fill="#22d3ee" fontSize="8" fontWeight="bold" opacity="0.6">5'</text>
          <text x="550" y="220" fill="#fb923c" fontSize="8" fontWeight="bold" opacity="0.6">3'</text>
        </svg>

        {/* Tooltip panel */}
        <AnimatePresence>
          {part && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="absolute right-0 top-0 z-10 w-72 rounded-2xl border border-white/15 p-4 sm:w-80"
              style={{
                background: "linear-gradient(135deg, rgba(15,15,30,0.92), rgba(20,20,40,0.88))",
                backdropFilter: "blur(20px)",
                boxShadow: `0 0 25px ${part.color}33, 0 8px 32px rgba(0,0,0,0.4)`,
              }}
            >
              <div className="mb-2 flex items-center justify-between">
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider"
                  style={{ backgroundColor: part.color + "22", color: part.color }}
                >
                  {part.label}
                </span>
                <button onClick={() => setActive(null)} className="text-muted-foreground hover:text-white transition-colors text-sm">✕</button>
              </div>
              <p className="text-sm leading-6 text-white/80">{part.desc}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {PARTS.map((p) => (
          <button
            key={p.id}
            onClick={() => setActive(active === p.id ? null : p.id)}
            onMouseEnter={() => setHover(p.id)}
            onMouseLeave={() => setHover(null)}
            className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all hover:scale-105"
            style={{
              borderColor: active === p.id ? p.color : "rgba(255,255,255,0.1)",
              color: active === p.id ? p.color : "rgba(255,255,255,0.6)",
              backgroundColor: active === p.id ? p.color + "15" : "transparent",
            }}
          >
            <span className="size-2 rounded-full" style={{ backgroundColor: p.color }} />
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
