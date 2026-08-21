import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Bone {
  id: string;
  label: string;
  role: string;
  desc: string;
  color: string;
}

const BONES: Bone[] = [
  {
    id: "skull",
    label: "Skull",
    role: "Brain protection",
    desc: "The skull encases and protects the brain. It is composed of 22 bones — 8 cranial bones form the vault and base, while 14 facial bones form the jaw, orbits, and nasal cavity. The mandible is the only movable bone. Sutures (fibrous joints) fuse cranial bones by adulthood.",
    color: "#e0f2fe",
  },
  {
    id: "clavicle",
    label: "Clavicle",
    role: "Shoulder strut",
    desc: "The collarbone acts as a horizontal strut between the shoulder and the sternum, keeping the arm laterally positioned. It is the most commonly fractured bone in the body — often from falls onto an outstretched hand (FOOSH injuries). It transmits forces from the arm to the axial skeleton.",
    color: "#93c5fd",
  },
  {
    id: "scapula",
    label: "Scapula",
    role: "Shoulder platform",
    desc: "The shoulder blade is a flat, triangular bone that provides attachment for 17 muscles controlling the shoulder and arm. Its glenoid fossa articulates with the humerus to form the glenohumeral (shoulder) joint — the most mobile joint in the body. The acromion protects the rotator cuff tendons.",
    color: "#67e8f9",
  },
  {
    id: "ribcage",
    label: "Ribcage",
    role: "Vital organ shield",
    desc: "12 pairs of ribs form a protective cage around the heart, lungs, and major vessels. Ribs 1–7 attach directly to the sternum (true ribs), 8–10 connect via costal cartilage (false ribs), and 11–12 float freely (floating ribs). During breathing, intercostal muscles elevate and depress the ribs to expand the thoracic cavity.",
    color: "#22d3ee",
  },
  {
    id: "spine",
    label: "Vertebral Column",
    role: "Central support & neural conduit",
    desc: "33 vertebrae (7 cervical, 12 thoracic, 5 lumbar, 5 sacral fused, 4 coccygeal fused) stack to form the spine. It bears weight, allows movement, and protects the spinal cord within the vertebral canal. The four natural curves (cervical lordosis, thoracic kyphosis, lumbar lordosis, sacral kyphosis) optimise balance and shock absorption.",
    color: "#38bdf8",
  },
  {
    id: "humerus",
    label: "Humerus",
    role: "Upper-arm lever",
    desc: "The single bone of the upper arm. Its rounded head fits into the glenoid fossa of the scapula. The surgical neck is a common fracture site. The radial groove (spiral groove) on its posterior shaft houses the radial nerve — a fracture here can cause wrist drop. The trochlea and capitulum at the distal end articulate with the ulna and radius.",
    color: "#a5b4fc",
  },
  {
    id: "radius_ulna",
    label: "Radius & Ulna",
    role: "Forearm rotation",
    desc: "The radius (lateral/thumb side) and ulna (medial/pinky side) work together to allow pronation and supination — rotating the palm up or down. The ulna forms the elbow hinge (olecranon), while the radius bears ~80% of the load at the wrist. The interosseous membrane between them distributes force and provides muscle attachment.",
    color: "#818cf8",
  },
  {
    id: "pelvis",
    label: "Pelvis",
    role: "Weight transfer & organ support",
    desc: "The pelvic girdle (two hip bones) transmits upper-body weight to the lower limbs and protects the bladder, reproductive organs, and lower intestines. The acetabulum of each hip bone articulates with the femoral head to form the hip joint — a deep ball-and-socket joint designed for weight-bearing stability.",
    color: "#c084fc",
  },
  {
    id: "femur",
    label: "Femur",
    role: "Longest & strongest bone",
    desc: "The thigh bone is the longest, heaviest, and strongest bone in the body. It bears 2–3× body weight during walking and up to 5–8× during running. The femoral neck is a frequent fracture site in elderly osteoporotic patients. The linea aspera on its posterior shaft is a major muscle attachment site.",
    color: "#e879f9",
  },
  {
    id: "patella",
    label: "Patella",
    role: "Knee fulcrum",
    desc: "The kneecap is the largest sesamoid bone — embedded within the quadriceps tendon. It increases the leverage of the quadriceps muscle by acting as a pulley, improving knee extension force by ~30%. It also protects the anterior knee joint. Dislocation or fracture can severely impair walking.",
    color: "#f0abfc",
  },
  {
    id: "tibia_fibula",
    label: "Tibia & Fibula",
    role: "Lower-leg pillars",
    desc: "The tibia (shinbone) is the main weight-bearing bone of the lower leg — it transmits body weight from the knee to the ankle. The fibula, lateral and thinner, primarily provides muscle attachment and stabilises the ankle. The tibial tuberosity is where the patellar ligament inserts. A blow here (shin kick) is extremely painful due to periosteal nerve density.",
    color: "#fb923c",
  },
  {
    id: "hand_foot",
    label: "Hands & Feet",
    role: "Manipulation & locomotion",
    desc: "Each hand has 27 bones (8 carpals, 5 metacarpals, 14 phalanges) enabling fine motor control. Each foot has 26 bones (7 tarsals, 5 metatarsals, 14 phalanges) and 33 joints — the arch system acts as a shock absorber and spring. The foot's 26 bones are roughly 25% of all bones in the body.",
    color: "#fb7185",
  },
];

export default function SkeletalSystem() {
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const current = active || hovered;
  const isLit = (id: string) => current === id;

  const boneColor = (id: string) => BONES.find((b) => b.id === id)?.color ?? "#e0f2fe";

  return (
    <div className="relative w-full flex flex-col items-center gap-3">
      <svg
        viewBox="0 0 440 700"
        className="w-full max-w-[440px]"
        style={{ filter: "drop-shadow(0 0 20px rgba(224,242,254,0.08))" }}
      >
        <defs>
          <filter id="sk-haze">
            <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="2" seed="33">
              <animate attributeName="seed" from="33" to="73" dur="10s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="1.5" />
          </filter>
          <filter id="sk-glow">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="sk-glow-strong">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="sk-bg" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0f0a1e" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="440" height="700" fill="url(#sk-bg)" />

        {/* Energy rings */}
        <ellipse cx="220" cy="340" rx="210" ry="320" fill="none" stroke="#e0f2fe" strokeWidth="0.4" strokeDasharray="4 12" opacity="0.1">
          <animateTransform attributeName="transform" type="rotate" from="0 220 340" to="360 220 340" dur="40s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="220" cy="340" rx="180" ry="280" fill="none" stroke="#67e8f9" strokeWidth="0.3" strokeDasharray="6 14" opacity="0.08">
          <animateTransform attributeName="transform" type="rotate" from="360 220 340" to="0 220 340" dur="35s" repeatCount="indefinite" />
        </ellipse>

        {/* Ambient orbs */}
        <circle cx="80" cy="180" r="28" fill="#67e8f9" opacity="0.04">
          <animate attributeName="opacity" values="0.02;0.06;0.02" dur="5s" repeatCount="indefinite" />
        </circle>
        <circle cx="360" cy="500" r="22" fill="#a78bfa" opacity="0.03">
          <animate attributeName="opacity" values="0.02;0.05;0.02" dur="4s" repeatCount="indefinite" />
        </circle>

        <g filter="url(#sk-haze)">

          {/* ========== SKULL ========== */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHovered("skull")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(active === "skull" ? null : "skull")}
          >
            {/* Cranium */}
            <ellipse
              cx="220" cy="72" rx="52" ry="55"
              fill={isLit("skull") ? "rgba(224,242,254,0.08)" : "rgba(224,242,254,0.03)"}
              stroke={isLit("skull") ? "#e0f2fe" : "rgba(224,242,254,0.35)"}
              strokeWidth={isLit("skull") ? 3 : 2}
              filter={isLit("skull") ? "url(#sk-glow)" : undefined}
            />
            {/* Eye sockets */}
            <ellipse cx="205" cy="70" rx="12" ry="10" fill="rgba(0,0,0,0.6)" stroke="rgba(224,242,254,0.15)" strokeWidth="1" />
            <ellipse cx="235" cy="70" rx="12" ry="10" fill="rgba(0,0,0,0.6)" stroke="rgba(224,242,254,0.15)" strokeWidth="1" />
            {/* Nose aperture */}
            <path d="M 217 80 L 220 90 L 223 80" fill="none" stroke="rgba(224,242,254,0.2)" strokeWidth="1" />
            {/* Mandible */}
            <path
              d="M 185 88 Q 180 90 178 100 Q 176 112 185 118 Q 195 122 210 123 L 220 125 L 230 123 Q 245 122 255 118 Q 264 112 262 100 Q 260 90 255 88"
              fill={isLit("skull") ? "rgba(224,242,254,0.06)" : "rgba(224,242,254,0.02)"}
              stroke={isLit("skull") ? "#e0f2fe" : "rgba(224,242,254,0.3)"}
              strokeWidth={isLit("skull") ? 2.5 : 1.5}
              filter={isLit("skull") ? "url(#sk-glow)" : undefined}
            />
            {/* Teeth hint */}
            <line x1="200" y1="118" x2="240" y2="118" stroke="rgba(224,242,254,0.15)" strokeWidth="0.6" />
            <text x="220" y="40" textAnchor="middle" fill="#e0f2fe" fontSize="9" fontWeight="bold" opacity={isLit("skull") ? 0.9 : 0.45}>SKULL</text>
          </g>

          {/* ========== CLAVICLES ========== */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHovered("clavicle")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(active === "clavicle" ? null : "clavicle")}
          >
            {/* Left clavicle */}
            <path
              d="M 220 138 Q 200 133 170 138 Q 158 141 152 145"
              fill="none"
              stroke={isLit("clavicle") ? "#93c5fd" : "rgba(147,197,253,0.35)"}
              strokeWidth={isLit("clavicle") ? 4 : 2.5}
              strokeLinecap="round"
              filter={isLit("clavicle") ? "url(#sk-glow)" : undefined}
            />
            {/* Right clavicle */}
            <path
              d="M 220 138 Q 240 133 270 138 Q 282 141 288 145"
              fill="none"
              stroke={isLit("clavicle") ? "#93c5fd" : "rgba(147,197,253,0.35)"}
              strokeWidth={isLit("clavicle") ? 4 : 2.5}
              strokeLinecap="round"
              filter={isLit("clavicle") ? "url(#sk-glow)" : undefined}
            />
            <text x="220" y="128" textAnchor="middle" fill="#93c5fd" fontSize="8" fontWeight="bold" opacity={isLit("clavicle") ? 0.9 : 0.4}>CLAVICLES</text>
          </g>

          {/* ========== SCAPULAE ========== */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHovered("scapula")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(active === "scapula" ? null : "scapula")}
          >
            {/* Left scapula */}
            <path
              d="M 152 148 L 130 170 L 125 210 L 155 220 L 165 180 Z"
              fill={isLit("scapula") ? "rgba(103,232,249,0.08)" : "rgba(103,232,249,0.03)"}
              stroke={isLit("scapula") ? "#67e8f9" : "rgba(103,232,249,0.25)"}
              strokeWidth={isLit("scapula") ? 2.5 : 1.5}
              filter={isLit("scapula") ? "url(#sk-glow)" : undefined}
            />
            {/* Right scapula */}
            <path
              d="M 288 148 L 310 170 L 315 210 L 285 220 L 275 180 Z"
              fill={isLit("scapula") ? "rgba(103,232,249,0.08)" : "rgba(103,232,249,0.03)"}
              stroke={isLit("scapula") ? "#67e8f9" : "rgba(103,232,249,0.25)"}
              strokeWidth={isLit("scapula") ? 2.5 : 1.5}
              filter={isLit("scapula") ? "url(#sk-glow)" : undefined}
            />
            <text x="100" y="195" textAnchor="middle" fill="#67e8f9" fontSize="8" fontWeight="bold" opacity={isLit("scapula") ? 0.9 : 0.35}>SCAPULA</text>
          </g>

          {/* ========== SPINE (Vertebral Column) ========== */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHovered("spine")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(active === "spine" ? null : "spine")}
          >
            {/* Cervical vertebrae */}
            {[145, 153, 161, 169, 177, 185, 193].map((y, i) => (
              <g key={`cerv-${i}`}>
                <ellipse
                  cx="220" cy={y} rx="14" ry="3.5"
                  fill={isLit("spine") ? "rgba(56,189,248,0.15)" : "rgba(56,189,248,0.06)"}
                  stroke={isLit("spine") ? "#38bdf8" : "rgba(56,189,248,0.3)"}
                  strokeWidth={isLit("spine") ? 1.5 : 0.8}
                />
                {/* Spinous process */}
                <line x1="220" y1={y - 3.5} x2="220" y2={y - 7} stroke={isLit("spine") ? "#38bdf8" : "rgba(56,189,248,0.2)"} strokeWidth="1" />
              </g>
            ))}
            {/* Thoracic vertebrae */}
            {[205, 217, 229, 241, 253, 265, 277, 289, 301, 313, 325, 337].map((y, i) => (
              <g key={`thor-${i}`}>
                <ellipse
                  cx="220" cy={y} rx="16" ry="4"
                  fill={isLit("spine") ? "rgba(56,189,248,0.15)" : "rgba(56,189,248,0.06)"}
                  stroke={isLit("spine") ? "#38bdf8" : "rgba(56,189,248,0.25)"}
                  strokeWidth={isLit("spine") ? 1.5 : 0.8}
                />
                <line x1="220" y1={y - 4} x2="220" y2={y - 8} stroke={isLit("spine") ? "#38bdf8" : "rgba(56,189,248,0.15)"} strokeWidth="1" />
              </g>
            ))}
            {/* Lumbar vertebrae */}
            {[355, 370, 385, 400, 415].map((y, i) => (
              <g key={`lum-${i}`}>
                <ellipse
                  cx="220" cy={y} rx="18" ry="5"
                  fill={isLit("spine") ? "rgba(56,189,248,0.18)" : "rgba(56,189,248,0.07)"}
                  stroke={isLit("spine") ? "#38bdf8" : "rgba(56,189,248,0.3)"}
                  strokeWidth={isLit("spine") ? 1.5 : 0.8}
                />
                <line x1="220" y1={y - 5} x2="220" y2={y - 10} stroke={isLit("spine") ? "#38bdf8" : "rgba(56,189,248,0.15)"} strokeWidth="1.2" />
              </g>
            ))}
            {/* Sacrum */}
            <path
              d="M 208 425 L 220 480 L 232 425 Z"
              fill={isLit("spine") ? "rgba(56,189,248,0.12)" : "rgba(56,189,248,0.05)"}
              stroke={isLit("spine") ? "#38bdf8" : "rgba(56,189,248,0.3)"}
              strokeWidth={isLit("spine") ? 2 : 1}
              filter={isLit("spine") ? "url(#sk-glow)" : undefined}
            />
            {/* Coccyx */}
            <path
              d="M 216 480 L 220 498 L 224 480"
              fill="none"
              stroke={isLit("spine") ? "#38bdf8" : "rgba(56,189,248,0.25)"}
              strokeWidth={isLit("spine") ? 2 : 1}
              strokeLinecap="round"
            />
            {/* Neural pulses */}
            <circle r="2" fill="#38bdf8" opacity="0.7">
              <animateMotion dur="2s" repeatCount="indefinite" path="M 220 145 L 220 480" />
            </circle>
            <text x="190" y="300" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold" opacity={isLit("spine") ? 0.9 : 0.4}>SPINE</text>
          </g>

          {/* ========== RIBCAGE ========== */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHovered("ribcage")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(active === "ribcage" ? null : "ribcage")}
          >
            {/* Sternum */}
            <line
              x1="220" y1="145" x2="220" y2="340"
              stroke={isLit("ribcage") ? "#22d3ee" : "rgba(34,211,238,0.25)"}
              strokeWidth={isLit("ribcage") ? 3 : 2}
              strokeLinecap="round"
              filter={isLit("ribcage") ? "url(#sk-glow)" : undefined}
            />
            {/* Left ribs */}
            {[160, 178, 196, 214, 232, 250, 268, 286, 304, 322].map((y, i) => {
              const width = 65 - i * 3;
              return (
                <path
                  key={`lr-${i}`}
                  d={`M 220 ${y} Q ${220 - width} ${y + 8} ${220 - width - 10} ${y + 20}`}
                  fill="none"
                  stroke={isLit("ribcage") ? "#22d3ee" : "rgba(34,211,238,0.2)"}
                  strokeWidth={isLit("ribcage") ? 2 : 1}
                  strokeLinecap="round"
                  filter={isLit("ribcage") ? "url(#sk-glow)" : undefined}
                />
              );
            })}
            {/* Right ribs */}
            {[160, 178, 196, 214, 232, 250, 268, 286, 304, 322].map((y, i) => {
              const width = 65 - i * 3;
              return (
                <path
                  key={`rr-${i}`}
                  d={`M 220 ${y} Q ${220 + width} ${y + 8} ${220 + width + 10} ${y + 20}`}
                  fill="none"
                  stroke={isLit("ribcage") ? "#22d3ee" : "rgba(34,211,238,0.2)"}
                  strokeWidth={isLit("ribcage") ? 2 : 1}
                  strokeLinecap="round"
                  filter={isLit("ribcage") ? "url(#sk-glow)" : undefined}
                />
              );
            })}
            <text x="220" y="345" textAnchor="middle" fill="#22d3ee" fontSize="8" fontWeight="bold" opacity={isLit("ribcage") ? 0.9 : 0.4}>RIBCAGE</text>
          </g>

          {/* ========== HUMERUS ========== */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHovered("humerus")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(active === "humerus" ? null : "humerus")}
          >
            {/* Left humerus */}
            <line
              x1="148" y1="155" x2="130" y2="280"
              stroke={isLit("humerus") ? "#a5b4fc" : "rgba(165,180,252,0.35)"}
              strokeWidth={isLit("humerus") ? 5 : 3}
              strokeLinecap="round"
              filter={isLit("humerus") ? "url(#sk-glow)" : undefined}
            />
            {/* Right humerus */}
            <line
              x1="292" y1="155" x2="310" y2="280"
              stroke={isLit("humerus") ? "#a5b4fc" : "rgba(165,180,252,0.35)"}
              strokeWidth={isLit("humerus") ? 5 : 3}
              strokeLinecap="round"
              filter={isLit("humerus") ? "url(#sk-glow)" : undefined}
            />
            {/* Humeral heads */}
            <circle cx="148" cy="155" r="8" fill={isLit("humerus") ? "rgba(165,180,252,0.15)" : "rgba(165,180,252,0.05)"} stroke={isLit("humerus") ? "#a5b4fc" : "rgba(165,180,252,0.3)"} strokeWidth="1.5" />
            <circle cx="292" cy="155" r="8" fill={isLit("humerus") ? "rgba(165,180,252,0.15)" : "rgba(165,180,252,0.05)"} stroke={isLit("humerus") ? "#a5b4fc" : "rgba(165,180,252,0.3)"} strokeWidth="1.5" />
            <text x="98" y="225" textAnchor="middle" fill="#a5b4fc" fontSize="8" fontWeight="bold" opacity={isLit("humerus") ? 0.9 : 0.35}>HUMERUS</text>
          </g>

          {/* ========== RADIUS & ULNA ========== */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHovered("radius_ulna")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(active === "radius_ulna" ? null : "radius_ulna")}
          >
            {/* Left forearm */}
            <line x1="130" y1="285" x2="115" y2="400" stroke={isLit("radius_ulna") ? "#818cf8" : "rgba(129,140,248,0.3)"} strokeWidth={isLit("radius_ulna") ? 3.5 : 2} strokeLinecap="round" filter={isLit("radius_ulna") ? "url(#sk-glow)" : undefined} />
            <line x1="135" y1="285" x2="108" y2="400" stroke={isLit("radius_ulna") ? "#818cf8" : "rgba(129,140,248,0.3)"} strokeWidth={isLit("radius_ulna") ? 3.5 : 2} strokeLinecap="round" filter={isLit("radius_ulna") ? "url(#sk-glow)" : undefined} />
            {/* Right forearm */}
            <line x1="310" y1="285" x2="325" y2="400" stroke={isLit("radius_ulna") ? "#818cf8" : "rgba(129,140,248,0.3)"} strokeWidth={isLit("radius_ulna") ? 3.5 : 2} strokeLinecap="round" filter={isLit("radius_ulna") ? "url(#sk-glow)" : undefined} />
            <line x1="305" y1="285" x2="332" y2="400" stroke={isLit("radius_ulna") ? "#818cf8" : "rgba(129,140,248,0.3)"} strokeWidth={isLit("radius_ulna") ? 3.5 : 2} strokeLinecap="round" filter={isLit("radius_ulna") ? "url(#sk-glow)" : undefined} />
            <text x="78" y="350" textAnchor="middle" fill="#818cf8" fontSize="7" fontWeight="bold" opacity={isLit("radius_ulna") ? 0.9 : 0.35}>RADIUS/ULNA</text>
          </g>

          {/* ========== HANDS ========== */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHovered("hand_foot")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(active === "hand_foot" ? null : "hand_foot")}
          >
            {/* Left hand */}
            {[-15, -7, 0, 7, 15].map((dx, i) => (
              <line key={`lh-${i}`} x1={112 + dx * 0.3} y1="400" x2={105 + dx} y2={425 + (i === 2 ? 5 : 0)} stroke={isLit("hand_foot") ? "#fb7185" : "rgba(251,113,133,0.3)"} strokeWidth={isLit("hand_foot") ? 2 : 1.2} strokeLinecap="round" filter={isLit("hand_foot") ? "url(#sk-glow)" : undefined} />
            ))}
            {/* Palm */}
            <ellipse cx="110" cy="410" rx="12" ry="10" fill="none" stroke={isLit("hand_foot") ? "#fb7185" : "rgba(251,113,133,0.2)"} strokeWidth={isLit("hand_foot") ? 1.5 : 0.8} />
            {/* Right hand */}
            {[-15, -7, 0, 7, 15].map((dx, i) => (
              <line key={`rh-${i}`} x1={328 - dx * 0.3} y1="400" x2={335 - dx} y2={425 + (i === 2 ? 5 : 0)} stroke={isLit("hand_foot") ? "#fb7185" : "rgba(251,113,133,0.3)"} strokeWidth={isLit("hand_foot") ? 2 : 1.2} strokeLinecap="round" filter={isLit("hand_foot") ? "url(#sk-glow)" : undefined} />
            ))}
            <ellipse cx="330" cy="410" rx="12" ry="10" fill="none" stroke={isLit("hand_foot") ? "#fb7185" : "rgba(251,113,133,0.2)"} strokeWidth={isLit("hand_foot") ? 1.5 : 0.8} />
            <text x="110" y="445" textAnchor="middle" fill="#fb7185" fontSize="7" fontWeight="bold" opacity={isLit("hand_foot") ? 0.9 : 0.3}>HANDS</text>
          </g>

          {/* ========== PELVIS ========== */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHovered("pelvis")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(active === "pelvis" ? null : "pelvis")}
          >
            {/* Left ilium */}
            <path
              d="M 210 425 Q 175 430 155 445 Q 140 460 150 485 Q 160 500 185 505 Q 200 506 210 500"
              fill={isLit("pelvis") ? "rgba(192,132,252,0.1)" : "rgba(192,132,252,0.04)"}
              stroke={isLit("pelvis") ? "#c084fc" : "rgba(192,132,252,0.3)"}
              strokeWidth={isLit("pelvis") ? 2.5 : 1.5}
              filter={isLit("pelvis") ? "url(#sk-glow)" : undefined}
            />
            {/* Right ilium */}
            <path
              d="M 230 425 Q 265 430 285 445 Q 300 460 290 485 Q 280 500 255 505 Q 240 506 230 500"
              fill={isLit("pelvis") ? "rgba(192,132,252,0.1)" : "rgba(192,132,252,0.04)"}
              stroke={isLit("pelvis") ? "#c084fc" : "rgba(192,132,252,0.3)"}
              strokeWidth={isLit("pelvis") ? 2.5 : 1.5}
              filter={isLit("pelvis") ? "url(#sk-glow)" : undefined}
            />
            {/* Acetabulum (hip sockets) */}
            <circle cx="175" cy="495" r="12" fill="none" stroke={isLit("pelvis") ? "#c084fc" : "rgba(192,132,252,0.25)"} strokeWidth={isLit("pelvis") ? 2 : 1} />
            <circle cx="265" cy="495" r="12" fill="none" stroke={isLit("pelvis") ? "#c084fc" : "rgba(192,132,252,0.25)"} strokeWidth={isLit("pelvis") ? 2 : 1} />
            <text x="220" y="475" textAnchor="middle" fill="#c084fc" fontSize="8" fontWeight="bold" opacity={isLit("pelvis") ? 0.9 : 0.4}>PELVIS</text>
          </g>

          {/* ========== FEMUR ========== */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHovered("femur")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(active === "femur" ? null : "femur")}
          >
            {/* Left femur */}
            <line
              x1="175" y1="505" x2="185" y2="610"
              stroke={isLit("femur") ? "#e879f9" : "rgba(232,121,249,0.35)"}
              strokeWidth={isLit("femur") ? 7 : 4.5}
              strokeLinecap="round"
              filter={isLit("femur") ? "url(#sk-glow)" : undefined}
            />
            {/* Right femur */}
            <line
              x1="265" y1="505" x2="255" y2="610"
              stroke={isLit("femur") ? "#e879f9" : "rgba(232,121,249,0.35)"}
              strokeWidth={isLit("femur") ? 7 : 4.5}
              strokeLinecap="round"
              filter={isLit("femur") ? "url(#sk-glow)" : undefined}
            />
            {/* Femoral heads */}
            <circle cx="175" cy="495" r="11" fill={isLit("femur") ? "rgba(232,121,249,0.15)" : "rgba(232,121,249,0.05)"} stroke={isLit("femur") ? "#e879f9" : "rgba(232,121,249,0.3)"} strokeWidth="2" />
            <circle cx="265" cy="495" r="11" fill={isLit("femur") ? "rgba(232,121,249,0.15)" : "rgba(232,121,249,0.05)"} stroke={isLit("femur") ? "#e879f9" : "rgba(232,121,249,0.3)"} strokeWidth="2" />
            <text x="140" y="565" textAnchor="middle" fill="#e879f9" fontSize="8" fontWeight="bold" opacity={isLit("femur") ? 0.9 : 0.4}>FEMUR</text>
          </g>

          {/* ========== PATELLA ========== */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHovered("patella")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(active === "patella" ? null : "patella")}
          >
            <ellipse
              cx="185" cy="612" rx="8" ry="7"
              fill={isLit("patella") ? "rgba(240,171,252,0.15)" : "rgba(240,171,252,0.05)"}
              stroke={isLit("patella") ? "#f0abfc" : "rgba(240,171,252,0.35)"}
              strokeWidth={isLit("patella") ? 2.5 : 1.5}
              filter={isLit("patella") ? "url(#sk-glow)" : undefined}
            />
            <ellipse
              cx="255" cy="612" rx="8" ry="7"
              fill={isLit("patella") ? "rgba(240,171,252,0.15)" : "rgba(240,171,252,0.05)"}
              stroke={isLit("patella") ? "#f0abfc" : "rgba(240,171,252,0.35)"}
              strokeWidth={isLit("patella") ? 2.5 : 1.5}
              filter={isLit("patella") ? "url(#sk-glow)" : undefined}
            />
            <text x="220" y="610" textAnchor="middle" fill="#f0abfc" fontSize="7" fontWeight="bold" opacity={isLit("patella") ? 0.9 : 0.35}>PATELLA</text>
          </g>

          {/* ========== TIBIA & FIBULA ========== */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHovered("tibia_fibula")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(active === "tibia_fibula" ? null : "tibia_fibula")}
          >
            {/* Left tibia + fibula */}
            <line x1="183" y1="618" x2="180" y2="678" stroke={isLit("tibia_fibula") ? "#fb923c" : "rgba(251,146,60,0.35)"} strokeWidth={isLit("tibia_fibula") ? 5 : 3} strokeLinecap="round" filter={isLit("tibia_fibula") ? "url(#sk-glow)" : undefined} />
            <line x1="190" y1="618" x2="193" y2="678" stroke={isLit("tibia_fibula") ? "#fb923c" : "rgba(251,146,60,0.3)"} strokeWidth={isLit("tibia_fibula") ? 2.5 : 1.5} strokeLinecap="round" filter={isLit("tibia_fibula") ? "url(#sk-glow)" : undefined} />
            {/* Right tibia + fibula */}
            <line x1="257" y1="618" x2="260" y2="678" stroke={isLit("tibia_fibula") ? "#fb923c" : "rgba(251,146,60,0.35)"} strokeWidth={isLit("tibia_fibula") ? 5 : 3} strokeLinecap="round" filter={isLit("tibia_fibula") ? "url(#sk-glow)" : undefined} />
            <line x1="250" y1="618" x2="247" y2="678" stroke={isLit("tibia_fibula") ? "#fb923c" : "rgba(251,146,60,0.3)"} strokeWidth={isLit("tibia_fibula") ? 2.5 : 1.5} strokeLinecap="round" filter={isLit("tibia_fibula") ? "url(#sk-glow)" : undefined} />
            <text x="310" y="650" textAnchor="middle" fill="#fb923c" fontSize="7" fontWeight="bold" opacity={isLit("tibia_fibula") ? 0.9 : 0.35}>TIBIA/FIBULA</text>
          </g>

          {/* ========== FEET ========== */}
          <g
            role="button"
            tabIndex={0}
            className="cursor-pointer"
            onMouseEnter={() => setHovered("hand_foot")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActive(active === "hand_foot" ? null : "hand_foot")}
          >
            {/* Left foot */}
            <path
              d="M 180 678 Q 170 688 155 690 Q 145 691 140 688"
              fill="none"
              stroke={isLit("hand_foot") ? "#fb7185" : "rgba(251,113,133,0.3)"}
              strokeWidth={isLit("hand_foot") ? 3 : 2}
              strokeLinecap="round"
              filter={isLit("hand_foot") ? "url(#sk-glow)" : undefined}
            />
            {/* Right foot */}
            <path
              d="M 260 678 Q 270 688 285 690 Q 295 691 300 688"
              fill="none"
              stroke={isLit("hand_foot") ? "#fb7185" : "rgba(251,113,133,0.3)"}
              strokeWidth={isLit("hand_foot") ? 3 : 2}
              strokeLinecap="round"
              filter={isLit("hand_foot") ? "url(#sk-glow)" : undefined}
            />
            {/* Toe hints */}
            {[-8, -4, 0, 4, 8].map((dx, i) => (
              <circle key={`lt-${i}`} cx={140 + dx * 0.8} cy="688" r="1.2" fill={isLit("hand_foot") ? "#fb7185" : "rgba(251,113,133,0.25)"} />
            ))}
            {[-8, -4, 0, 4, 8].map((dx, i) => (
              <circle key={`rt-${i}`} cx={300 + dx * 0.8} cy="688" r="1.2" fill={isLit("hand_foot") ? "#fb7185" : "rgba(251,113,133,0.25)"} />
            ))}
            <text x="220" y="698" textAnchor="middle" fill="#fb7185" fontSize="7" fontWeight="bold" opacity={isLit("hand_foot") ? 0.9 : 0.3}>FEET</text>
          </g>

          {/* Pulsing energy sparks */}
          {[
            { cx: 220, cy: 72, r: 3, c: "#e0f2fe" },
            { cx: 220, cy: 240, r: 2.5, c: "#38bdf8" },
            { cx: 220, cy: 465, r: 2.5, c: "#c084fc" },
            { cx: 220, cy: 555, r: 3, c: "#e879f9" },
          ].map((s, i) => (
            <circle key={`spark-${i}`} cx={s.cx} cy={s.cy} r={s.r} fill={s.c} opacity="0">
              <animate attributeName="opacity" values="0;0.7;0" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.7}s`} />
            </circle>
          ))}
        </g>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 justify-center mt-1">
        {BONES.map((b) => (
          <span
            key={b.id}
            className={`text-[10px] px-2 py-0.5 rounded-full border transition-all duration-300 ${
              isLit(b.id) ? "scale-110" : "opacity-70"
            }`}
            style={{
              borderColor: b.color,
              color: b.color,
              backgroundColor: isLit(b.id) ? `${b.color}22` : "transparent",
              boxShadow: isLit(b.id) ? `0 0 8px ${b.color}44` : "none",
            }}
          >
            {b.label}
          </span>
        ))}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed bottom-6 right-6 w-80 max-w-[calc(100vw-3rem)] rounded-2xl p-5 z-50"
            style={{
              background: "rgba(15, 10, 30, 0.85)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: `1px solid ${boneColor(active)}44`,
              boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${boneColor(active)}22`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: boneColor(active) }}
              />
              <h3 className="text-white font-semibold text-sm">
                {BONES.find((b) => b.id === active)?.label}
              </h3>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full ml-auto"
                style={{
                  backgroundColor: `${boneColor(active)}22`,
                  color: boneColor(active),
                }}
              >
                {BONES.find((b) => b.id === active)?.role}
              </span>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed">
              {BONES.find((b) => b.id === active)?.desc}
            </p>
            <button
              onClick={() => setActive(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
