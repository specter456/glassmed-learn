/**
 * MediPro seed content.
 *
 * The learning path is deliberately "Basics first, then In-Depth":
 * every topic ships a `basicBlocks` layer (the high-yield foundation)
 * linked to an `inDepthBlocks` layer (full conceptual detail).
 */

export const SEED_TOPICS = [
  {
    slug: "cardiac-cycle",
    title: "The Cardiac Cycle",
    subject: "Physiology",
    blurb:
      "One heartbeat, eight phases, two pumps — the engine of circulation made simple.",
    accent: "#E2666F",
    icon: "heart-pulse",
    diagram: "cardiac",
    order: 1,
    keyPoints: [
      "One cycle ≈ 0.8 s at a resting rate of 75 bpm.",
      "Systole = contraction & ejection; diastole = relaxation & filling.",
      '"Lub" (S1) = AV valve closure; "dub" (S2) = semilunar valve closure.',
      "Aortic pressure peaks near 120 mmHg; LVEDP is ~8 mmHg.",
    ],
    basicBlocks: [
      {
        heading: "The big picture",
        body:
          "The cardiac cycle is everything the heart does in ONE heartbeat. It has two halves:\n\n**Systole** — the heart squeezes blood out. **Diastole** — the heart relaxes and fills back up.\n\nThink of the heart as TWO pumps side by side (right → lungs, left → body) beating in perfect sync. Whatever happens on the left also happens on the right — only the pressures differ.",
      },
      {
        heading: "The 5 phases that matter",
        body:
          "1. **Atrial systole** — atria squeeze the last ~20% of blood into the ventricles.\n2. **Isovolumetric contraction** — ventricles squeeze, all valves shut, pressure rockets with no blood leaving yet.\n3. **Ventricular ejection** — aortic valve opens, blood fires into the aorta. First a fast spurt, then a slow trickle.\n4. **Isovolumetric relaxation** — ventricles relax, all valves shut again, pressure crashes.\n5. **Ventricular filling** — AV valves open, blood pours in passively (~80% fills without the atria doing anything!).",
      },
      {
        heading: "The two sounds: lub-dub",
        body:
          "**Lub (S1)** = AV valves (mitral + tricuspid) slamming shut at the start of systole.\n**Dub (S2)** = semilunar valves (aortic + pulmonary) slamming shut at the start of diastole.\n\nIf you ever hear an extra whoosh between them, that's a murmur — a leaky or narrow valve.",
      },
      {
        heading: "Memory hooks",
        body:
          "Phases in order: **A**trial systole, **I**sovolumetric contraction, **E**jection, **I**sovolumetric relaxation, **F**illing.\n\nMnemonic: \"**A**ll **I**nsects **E**at **I**ce-cream **F**irst.\"\n\nValves: AV valves are **Atrio-Ventricular** (between atria & ventricles); semilunar valves are the **exit doors** to arteries.",
      },
    ],
    inDepthBlocks: [
      {
        heading: "The complete 8-phase cycle",
        body:
          "Textbooks split the cycle into 8 phases. Clinically you only need the 5 big ones, but knowing the full ladder explains the pressure curves:\n\n1. Atrial systole — the \"atrial kick\" adds 15–20% of ventricular filling.\n2. Isovolumetric contraction — ventricular pressure exceeds atrial pressure, so AV valves close (S1).\n3. Rapid ejection — aortic valve opens once LV pressure > aortic pressure (~80 mmHg); ~70% of stroke volume leaves in the first third of systole.\n4. Reduced ejection — flow slows, aortic pressure peaks (~120 mmHg systolic).\n5. Protodiastole — ventricles relax; aortic pressure now exceeds LV pressure, so the aortic valve closes (S2). The brief backflow before closure creates the **dicrotic notch** on the aortic pressure trace.\n6. Isovolumetric relaxation — all 4 valves closed; pressure plummets.\n7. Rapid filling — AV valves open; ~80% of ventricular filling is purely passive.\n8. Reduced filling (diastasis) — slow top-up before the next atrial kick.",
      },
      {
        heading: "Pressure, volume & the Wiggers diagram",
        body:
          "**Left ventricular pressure**: rises to ~120 mmHg in systole, falls to ~5 mmHg in diastole.\n**Aortic pressure**: 120/80 mmHg. The dicrotic notch marks aortic valve closure.\n**Left atrial pressure**: 8–10 mmHg with three little waves — **a** (atrial contraction), **c** (bulging AV valve during isovolumetric contraction), **v** (atrial filling against a closed AV valve).\n**End-diastolic volume (EDV)** ≈ 120–130 mL; **end-systolic volume (ESV)** ≈ 50 mL; **stroke volume = EDV − ESV** ≈ 70 mL.",
      },
      {
        heading: "ECG correlation",
        body:
          "**P wave** = atrial depolarisation → triggers atrial systole.\n**QRS complex** = ventricular depolarisation → triggers ventricular systole (atrial repolarisation hides inside it).\n**T wave** = ventricular repolarisation → just before the ventricle relaxes fully.\n\nSo the sequence is: P … then QRS starts systole … then T, then diastole. The PR interval (~0.16 s) is the time the impulse takes to cross the AV node — that's the built-in delay that lets atria finish before ventricles fire.",
      },
      {
        heading: "Why this is high-yield",
        body:
          "NEET loves: which valve closes at S1 (AV valves) vs S2 (semilunar), the order of phases, and which phase has the highest/lowest pressure. MBBS exams love the Wiggers diagram and the dicrotic notch. Master the 5-phase version first — the 8-phase version then writes itself.",
      },
    ],
  },
  {
    slug: "action-potential",
    title: "The Action Potential",
    subject: "Neurophysiology",
    blurb:
      "The nerve's electric spike — how a neuron fires and why it can't fire twice.",
    accent: "#7B9EE8",
    icon: "zap",
    diagram: "potential",
    order: 2,
    keyPoints: [
      "Resting membrane potential ≈ −70 mV (inside negative).",
      "Threshold ≈ −55 mV — all-or-none firing point.",
      "Depolarisation = Na⁺ floods in; repolarisation = K⁺ floods out.",
      "Absolute refractory period stops re-firing; relative period needs a stronger stimulus.",
    ],
    basicBlocks: [
      {
        heading: "The set-up: a polarized neuron",
        body:
          "At rest, the inside of a neuron is **−70 mV** relative to outside. Two forces build this:\n\n- The **Na⁺/K⁺ ATPase pump** pushes 3 Na⁺ out for every 2 K⁺ in.\n- The membrane is leaky to K⁺, which carries positive charge out — dragging the inside negative.\n\nThink of the membrane as a battery charged at −70 mV.",
      },
      {
        heading: "The spike in 4 steps",
        body:
          "1. **Stimulus** — something pushes the membrane toward 0.\n2. **Depolarisation** — at **−55 mV (threshold)** voltage-gated **Na⁺ channels** slam open. Na⁺ floods in, the inside shoots up to **+30 mV**.\n3. **Repolarisation** — Na⁺ channels snap shut; voltage-gated **K⁺ channels** open, K⁺ floods out, the voltage crashes back down.\n4. **Undershoot** — K⁺ overshoots, dipping to about **−90 mV** before the pump restores −70 mV.\n\nResult: a single, all-or-none spike that travels down the axon.",
      },
      {
        heading: "Why it's all-or-none",
        body:
          "Below threshold, nothing happens — the stimulus dies away. At or above threshold, the FULL spike always fires. A neuron doesn't fire 'a bit' — it fires or it doesn't.\n\nSo how does the brain sense intensity? **Frequency coding**: a stronger stimulus makes the neuron fire MORE OFTEN, not harder.",
      },
      {
        heading: "Memory hooks",
        body:
          "The story of every spike: **Na⁺ in, K⁺ out, pump fixes it**.\n\nThreshold −55 mV: \"**Five-five** is where the **Na⁺** channels **dive**.\"\n\nRefractory periods: **A**bsolute = can't fire at all (Na⁺ channels locked); **R**elative = needs a **R**einforced stimulus.",
      },
    ],
    inDepthBlocks: [
      {
        heading: "Ionic basis, step by step",
        body:
          "**Resting (−70 mV)**: dominated by the K⁺ equilibrium potential (≈ −90 mV) with a small Na⁺ leak pulling it up to −70. The Na⁺/K⁺ pump maintains the gradients.\n\n**Depolarisation**: once threshold (−55 mV) is hit, Na⁺ channel activation gates open within ~0.1 ms. Na⁺ conductance rises ~500-fold. The membrane races toward the Na⁺ equilibrium potential (+60 mV) but peaks around **+30 mV** because Na⁺ channels start inactivating (ball-and-chain block) before the peak.\n\n**Repolarisation**: Na⁺ inactivation closes the floodgates; delayed K⁺ channels open and K⁺ conductance dominates, dragging the membrane back toward −90 mV.\n\n**Hyperpolarisation/undershoot**: K⁺ channels close slowly, so the membrane overshoots to ≈ −90 mV before the pump and leak currents restore −70 mV.",
      },
      {
        heading: "Refractory periods — why a nerve can't race itself",
        body:
          "**Absolute refractory period** (from threshold to ~⅓ of repolarisation): Na⁺ channels are inactivated — NO stimulus, however huge, can trigger a new spike. This guarantees one-way, unidirectional propagation and sets an upper firing limit.\n\n**Relative refractory period** (rest of repolarisation): some Na⁺ channels have recovered; a NEW spike is possible but only with a stronger-than-normal stimulus because the membrane is hyperpolarised.\n\nClinical echo: in cardiac muscle these periods prevent tetanus and allow the heart to re-fill between beats.",
      },
      {
        heading: "Propagation & saltation",
        body:
          "The spike at one patch of membrane depolarises the next patch to threshold, so the signal marches along like a wave of falling dominoes — **regenerative conduction**.\n\nIn myelinated axons the current 'jumps' between Nodes of Ranvier where Na⁺ channels cluster — **saltatory conduction**. It's faster (up to 120 m/s vs ~1 m/s in unmyelinated fibres) AND cheaper (fewer ions move per distance).\n\nDemyelination (e.g. multiple sclerosis) slows or blocks conduction — that's why symptoms appear abruptly.",
      },
      {
        heading: "Why this is high-yield",
        body:
          "NEET/MBBS classic: order of channel events, what threshold means, why the spike peaks at +30 not +60, and the difference between absolute and relative refractory periods. Link it to the cardiac action potential later — phase 0 is Na⁺, phase 2 is Ca²⁺ — and physiology suddenly feels connected.",
      },
    ],
  },
  {
    slug: "brachial-plexus",
    title: "The Brachial Plexus",
    subject: "Anatomy",
    blurb:
      "Five nerve roots, one messy ladder — the wiring of the whole upper limb.",
    accent: "#E0A458",
    icon: "network",
    diagram: "plexus",
    order: 3,
    keyPoints: [
      "Made of: Roots (C5–T1) → Trunks → Divisions → Cords → Branches.",
      "Roots: C5, C6, C7, C8, T1 — remember the mnemonics.",
      "Two divisions (anterior/posterior) per trunk; three cords wrap the axillary artery.",
      "Erb's palsy (C5–C6) = \"waiter's tip\"; Klumpke's palsy (C8–T1) = claw hand.",
    ],
    basicBlocks: [
      {
        heading: "The 5-letter ladder",
        body:
          "The plexus is just a wiring diagram with 5 levels, top to bottom:\n\n**R**oots → **T**runks → **D**ivisions → **C**ords → **B**ranches\n\nMnemonic: \"**R**andy **T**ravis **D**rinks **C**old **B**eer.\"\n\nIt starts from the spinal cord (roots) and ends as the named nerves of the arm (branches).",
      },
      {
        heading: "Who's in the ladder",
        body:
          "**Roots**: C5, C6, C7, C8, T1 — the five nerve 'cables' leaving the neck.\n\n**Trunks**: upper (C5+C6), middle (C7), lower (C8+T1).\n\n**Divisions**: each trunk splits into an anterior and posterior division.\n\n**Cords**: the divisions re-sort into lateral, medial and posterior cords — named by their position around the axillary artery.\n\n**Branches**: the final named nerves — musculocutaneous, median, ulnar, radial, axillary.",
      },
      {
        heading: "The 5 nerves you must know",
        body:
          "**Musculocutaneous** (lateral cord) — flexes the elbow (biceps).\n**Median** (lateral + medial cords) — flexes the wrist & thumb opposition; the 'LOAF' muscles.\n**Ulnar** (medial cord) — intrinsic hand muscles; 'funny bone' nerve.\n**Radial** (posterior cord) — extends the wrist & fingers; 'Saturday night palsy'.\n**Axillary** (posterior cord) — abducts the shoulder (deltoid).",
      },
      {
        heading: "Memory hooks",
        body:
          "Roots: \"**3 C's, then 8, 1**\" — C5, C6, C7, C8, T1.\n\nCords: **L**ateral, **M**edial, **P**osterior = \"**L**ittle **M**en **P**arty.\"\n\nMedian nerve hand muscles: **LOAF** — Lumbricals (lateral two), Opponens pollicis, Abductor pollicis brevis, Flexor pollicis brevis.",
      },
    ],
    inDepthBlocks: [
      {
        heading: "Complete root-to-branch breakdown",
        body:
          "**Roots (C5–T1)** emerge between the scalenus anterior and medius. They give off dorsal scapular (C5) and long thoracic (C5–C7) nerves.\n\n**Trunks**: upper (C5, C6), middle (C7), lower (C8, T1) — each lies behind the clavicle.\n\n**Divisions**: each trunk divides into an **anterior** (flexor compartment) and **posterior** (extensor compartment) division. This is the key embryological split: anterior = flexors, posterior = extensors.\n\n**Cords**: anterior divisions of upper+middle trunks join to form the **lateral cord**; the anterior division of the lower trunk alone forms the **medial cord**; all three posterior divisions join to form the **posterior cord**.\n\n**Branches** — lateral cord: lateral pectoral, musculocutaneous, lateral root of median. Medial cord: medial pectoral, medial cutaneous of arm & forearm, ulnar, medial root of median. Posterior cord: upper & lower subscapular, thoracodorsal, axillary, radial.",
      },
      {
        heading: "The two classic injuries",
        body:
          "**Erb's palsy (C5–C6)** — from birth trauma (shoulder dystocia) or a hard fall on the shoulder. Rootlets of C5–C6 tear. Result: adducted & internally rotated shoulder, extended elbow, pronated forearm — the **\"waiter's tip\"** position. Affected nerves: musculocutaneous, axillary, suprascapular.\n\n**Klumpke's palsy (C8–T1)** — from grabbing something during a fall or arm traction. Result: **claw hand** (ulnar nerve effects) + ipsilateral **Horner's syndrome** if T1 sympathetic fibres tear (ptosis, miosis, anhidrosis).",
      },
      {
        heading: "Branches & the muscles they feed",
        body:
          "**Musculocutaneous** → coracobrachialis, biceps, brachialis; ends as lateral cutaneous nerve of forearm.\n**Median** → all forearm flexors except flexor carpi ulnaris & medial half of flexor digitorum profundus (those are ulnar); then the LOAF muscles in the hand.\n**Ulnar** → flexor carpi ulnaris, medial half of FDP, all intrinsic hand muscles except the LOAF trio.\n**Radial** → triceps, brachioradialis, wrist/finger extensors; sensory to the dorsum of the hand (thumb side).\n**Axillary** → deltoid & teres minor; sensory 'regimental badge' patch.",
      },
      {
        heading: "Why this is high-yield",
        body:
          "Anatomy viva favourite: 'Trace the median nerve from root to hand.' NEET favourite: Erb vs Klumpke palsy matching, and which nerve supplies which muscle. Draw the ladder once a day from memory — five lines, then branch them — and it becomes permanent.",
      },
    ],
  },
  {
    slug: "krebs-cycle",
    title: "The Krebs (TCA) Cycle",
    subject: "Biochemistry",
    blurb:
      "The metabolic roundabout where carbs, fats and proteins all hand over their energy.",
    accent: "#5FA88B",
    icon: "refresh-cw",
    diagram: "krebs",
    order: 4,
    keyPoints: [
      "Occurs in the mitochondrial matrix; oxidises acetyl-CoA (2C).",
      "One turn: 3 NADH, 1 FADH₂, 1 GTP (ATP), 2 CO₂.",
      "Net energy: ~10 ATP per acetyl-CoA via the ETC.",
      "It's a cycle — oxaloacetate (4C) is regenerated each turn.",
    ],
    basicBlocks: [
      {
        heading: "What feeds the cycle",
        body:
          "Everything that burns for energy funnels into **acetyl-CoA** (a 2-carbon molecule):\n\n- Glucose → pyruvate → acetyl-CoA (glycolysis bridge)\n- Fatty acids → β-oxidation → acetyl-CoA\n- Some amino acids → acetyl-CoA or TCA intermediates\n\nThe Krebs cycle is the **roundabout** where all these 2C units get completely dismantled.",
      },
      {
        heading: "The 8 stops on the roundabout",
        body:
          "Citrate → Isocitrate → α-Ketoglutarate → Succinyl-CoA → Succinate → Fumarate → Malate → Oxaloacetate → (back to citrate)\n\nMnemonic: \"**C**itrate **I**s **S**uccinyl-**C**oA's **S**ubstrate — **F**irst **M**ake **O**xaloacetate.\"\n\nEach stop is an enzyme; the two CO₂'s fly off at the **Isocitrate** and **α-Ketoglutarate** steps.",
      },
      {
        heading: "The energy tally (per acetyl-CoA)",
        body:
          "**3 NADH** (→ 9 ATP), **1 FADH₂** (→ 2 ATP), **1 GTP/ATP** (→ 1 ATP), and **2 CO₂** exhaled.\n\nSo: **3 + 2 + 1 = ~10 ATP** per turn once the electron transport chain does its work. The cycle itself makes almost no ATP directly — it makes the **reduced carriers** (NADH, FADH₂) that power the chain.",
      },
      {
        heading: "Memory hooks",
        body:
          "Energy per turn: \"**3–1–1–2**\" — 3 NADH, 1 FADH₂, 1 GTP, 2 CO₂.\n\nThe two decarboxylation steps (CO₂ out) are the ones with the **α** in the name… plus isocitrate: \"**I**socitrate & **α**-KG **L**ose **C**arbon.\"\n\nWhere does it happen? \"**Mitochondrial matrix** — the middle of the powerhouse.\"",
      },
    ],
    inDepthBlocks: [
      {
        heading: "Step-by-step enzyme tour",
        body:
          "1. **Citrate synthase** — acetyl-CoA (2C) + oxaloacetate (4C) → citrate (6C). Irreversible; the cycle's committed step.\n2. **Aconitase** — citrate → isocitrate (via cis-aconitate). Aconitase is poisoned by **fluoroacetate** — a classic exam toxin.\n3. **Isocitrate dehydrogenase** — isocitrate → α-ketoglutarate. First CO₂, first NADH. Rate-limiting; activated by ADP, inhibited by ATP & NADH.\n4. **α-Ketoglutarate dehydrogenase** — α-KG → succinyl-CoA. Second CO₂, second NADH. Needs 5 cofactors: **B1 (thiamine), B2, B3, B5, lipoate** — the same machinery as pyruvate dehydrogenase.\n5. **Succinyl-CoA synthetase** — substrate-level phosphorylation: GTP (or ATP in some tissues). The only direct ATP of the cycle.\n6. **Succinate dehydrogenase** — succinate → fumarate; FADH₂. This enzyme IS Complex II of the electron transport chain, anchored in the inner membrane.\n7. **Fumarase** — fumarate → malate (stereospecific — only L-malate forms).\n8. **Malate dehydrogenase** — malate → oxaloacetate; third NADH. Oxaloacetate is now ready to greet another acetyl-CoA.",
      },
      {
        heading: "Regulation: when the roundabout slows",
        body:
          "The cycle runs on demand. High **ATP/NADH** → inhibits isocitrate dehydrogenase and α-ketoglutarate dehydrogenase (and citrate synthase via citrate). High **ADP/Ca²⁺** → activates it (Ca²⁺ signals 'work harder, muscles').\n\nThis is negative feedback at its cleanest: when the cell is full of energy, the roundabout idles; when it's hungry, it spins fast.",
      },
      {
        heading: "Anaplerosis & amphibolic nature",
        body:
          "The cycle is **amphibolic** — it builds as well as burns. Intermediates leak out to make:\n- Oxaloacetate → gluconeogenesis (fasting glucose!)\n- α-KG → glutamate → other amino acids\n- Succinyl-CoA → heme synthesis\n- Citrate → fatty acid synthesis (also shuttles acetyl-CoA to the cytoplasm)\n\n**Anaplerotic reactions** refill the pool, most importantly **pyruvate carboxylase**: pyruvate + CO₂ → oxaloacetate. Without this, every amino acid drawn off for building would starve the cycle.",
      },
      {
        heading: "Why this is high-yield",
        body:
          "NEET repeats: the enzyme list, which steps make CO₂/NADH/FADH₂/GTP, fluoroacetate poisoning, and the 5-cofactor α-KG dehydrogenase. MBBS adds: B1 deficiency → Wernicke's encephalopathy via PDH/α-KGDH failure. Learn the tally and the two decarboxylation steps cold, then the rest hangs off them.",
      },
    ],
  },
  {
    slug: "dna-replication",
    title: "DNA Replication & The Central Dogma",
    subject: "Genetics",
    blurb:
      "How a cell copies 3 billion base pairs in hours — accurately, once per division.",
    accent: "#8F7BC4",
    icon: "dna",
    diagram: "dna",
    order: 5,
    keyPoints: [
      "Semi-conservative: each new double helix keeps one old strand.",
      "DNA polymerase adds 5′→3′ only; the lagging strand works in Okazaki fragments.",
      "Helicase unwinds, primase primes, polymerase extends, ligase stitches.",
      "One error in ~10⁹ bases after proofreading & mismatch repair.",
    ],
    basicBlocks: [
      {
        heading: "The golden rule: 5′ → 3′",
        body:
          "DNA is read and built in one direction only — **5′ to 3′**. The enzyme (DNA polymerase) can only add new letters onto the 3′ end of an existing strand.\n\nThis single rule explains the whole replication fork, including why one strand is built in annoying little pieces.",
      },
      {
        heading: "The four workers",
        body:
          "**Helicase** — unzips the double helix (breaks the H-bonds).\n**Primase** — lays down a short RNA primer so polymerase has somewhere to start.\n**DNA polymerase** — reads the template and adds complementary bases, 5′→3′.\n**Ligase** — stitches the gaps between pieces.\n\nMnemonic: \"**H**elicase **P**rimase **P**olymerase **L**igase\" = \"**H**el**P** **PL**ease.\"",
      },
      {
        heading: "Leading vs lagging",
        body:
          "The two template strands run in opposite directions, but polymerase only works 5′→3′. So:\n\n**Leading strand** — built continuously toward the fork, one smooth ribbon.\n**Lagging strand** — built away from the fork in short **Okazaki fragments**, each needing its own primer.\n\n**Ligase** then glues the fragments together. This is why the lagging strand is 'behind' — it's always playing catch-up.",
      },
      {
        heading: "Memory hooks",
        body:
          "Direction: \"**Polymerase never goes 3′→5′** — it's a one-way street.\"\n\nOkazaki = Okazaki fragments are **Ok**ay **a**s **z**ig-zag **i**n pieces.\n\nProofreading: polymerase has a built-in **eraser** (3′→5′ exonuclease) — \"reads, writes, and checks its own homework.\"",
      },
    ],
    inDepthBlocks: [
      {
        heading: "Initiation & the origin",
        body:
          "Replication starts at **origins of replication** (AT-rich — easier to melt). **Origin recognition complex (ORC)** recruits the helicase, which unwinds the duplex into two forks moving in opposite directions (bidirectional).\n\nIn bacteria there's ONE origin and a circular chromosome; in humans there are thousands of origins so the whole genome copies in a few hours, not weeks. A **replicon** is the DNA segment served by one origin.",
      },
      {
        heading: "Elongation & the replisome",
        body:
          "The whole machine — helicase, primase, polymerases, sliding clamp, ligase — is one giant team called the **replisome**.\n\n**DNA polymerase III** (prokaryote) / **polymerase δ & ε** (eukaryote) extend strands. The **sliding clamp** holds polymerase onto the DNA like a seatbelt, boosting processivity from ~10 to ~1000+ bases per binding event.\n\n**Single-strand binding proteins** coat the unwound template so it doesn't re-anneal or get chewed up.\n\nThe lagging strand loops around so its polymerase can work 5′→3′ while still moving with the fork — the **trombone model**.",
      },
      {
        heading: "Termination & the end-replication problem",
        body:
          "When the fork meets a terminator, replication halts. But the lagging strand's last Okazaki fragment can't be primed at the very tip of the chromosome — so **every replication shortens the ends**.\n\nThe solution: **telomeres** — repetitive (TTAGGG) caps — and the enzyme **telomerase**, which extends the template so the ends don't erode. Telomerase is active in stem cells, germ cells, and ~85% of cancers (one reason tumours are 'immortal'). This is an exam favourite.",
      },
      {
        heading: "Fidelity: how cells keep 10⁹ accuracy",
        body:
          "Three layers of quality control:\n1. **Base selection** — polymerase picks the right base using hydrogen-bond geometry (~1 in 10⁴–10⁵ error).\n2. **Proofreading** — 3′→5′ exonuclease chews back a mispaired base the moment it's added (~100× improvement).\n3. **Mismatch repair** — after replication, a separate patrol (MutS/MutL; hMSH2/hMLH1 in humans) finds remaining errors and fixes the NEW strand (it knows which is new by methylation in bacteria).\n\nWhen mismatch repair fails (e.g. Lynch syndrome), colorectal cancer risk soars — proof that this machinery keeps us alive.",
      },
      {
        heading: "Why this is high-yield",
        body:
          "NEET staples: semi-conservative nature (Meselson–Stahl), Okazaki fragments & why they exist, 5′→3′ rule, and the enzyme roles. MBBS adds: telomerase & cancer, mismatch repair defects, and the replisome. Draw the fork once — leading smooth, lagging in pieces — and every enzyme falls into place.",
      },
    ],
  },
  {
    slug: "muscle-contraction",
    title: "Muscle Contraction",
    subject: "Physiology",
    blurb: "The sliding filament theory — how actin and myosin generate force.",
    accent: "#e879f9",
    icon: "activity",
    diagram: "muscle",
    order: 6,
    keyPoints: [
      "Muscle contraction is driven by actin-myosin cross-bridge cycling.",
      "Calcium released from the sarcoplasmic reticulum triggers contraction.",
      "ATP is required for both cross-bridge detachment and power stroke.",
      "A sarcomere is the functional unit — from Z-disc to Z-disc.",
    ],
    basicBlocks: [
      { heading: "The Sliding Filament Theory", body: "Muscle contraction occurs when thin filaments (actin) slide over thick filaments (myosin), shortening the sarcomere without the filaments themselves changing length.\n\nThe key players:\n- **Actin** (thin filament) — the track that myosin walks along.\n- **Myosin** (thick filament) — the motor protein with heads that grab actin.\n- **Troponin & Tropomyosin** — the regulatory proteins that block myosin binding at rest.\n- **Calcium (Ca²⁺)** — the trigger that removes the block." },
      { heading: "Step-by-Step: How a Muscle Contracts", body: "1. **Nerve signal arrives** at the neuromuscular junction → ACh released.\n2. **Action potential spreads** across the sarcolemma and into T-tubules.\n3. **Calcium floods out** of the sarcoplasmic reticulum.\n4. **Ca²⁺ binds troponin** → tropomyosin shifts → myosin-binding sites exposed.\n5. **Cross-bridge cycle**: myosin head attaches → power stroke → ADP released → ATP binds → detachment → re-cocking.\n6. **Repeated cycling** generates sustained contraction." },
      { heading: "ATP: The Unsung Hero", body: "ATP is needed for THREE things in muscle:\n1. **Power stroke** — ATP hydrolysis cocks the myosin head.\n2. **Cross-bridge detachment** — ATP binding releases myosin from actin.\n3. **Calcium reuptake** — ATP powers the SERCA pump to pump Ca²⁺ back into the SR.\n\nWithout ATP, myosin stays locked to actin → this is **rigor mortis**." },
    ],
    inDepthBlocks: [
      { heading: "Excitation-Contraction Coupling", body: "The link between the nerve impulse and the mechanical contraction:\n\n1. ACh binds nicotinic receptors at the NMJ → end-plate potential → muscle AP.\n2. AP travels along sarcolemma and down T-tubules.\n3. Dihydropyridine receptors (DHPR) on T-tubules mechanically open ryanodine receptors (RyR1) on the SR.\n4. Ca²⁺ floods into the sarcoplasm (from ~0.1 µM to ~10 µM).\n5. Ca²⁺ binds troponin C → conformational change → tropomyosin shifts → cross-bridge cycling begins.\n\nClinical: Malignant hyperthermia = mutations in RyR1 → uncontrolled Ca²⁺ release → sustained contraction + heat." },
      { heading: "Skeletal vs Cardiac vs Smooth Muscle", body: "**Skeletal**: Voluntary, striated, multinucleated, fatigue-prone, all-or-none per fibre.\n\n**Cardiac**: Involuntary, striated, intercalated discs (gap junctions), autorhythmic, resistant to fatigue.\n\n**Smooth**: Involuntary, non-striated, spindle-shaped, sustains prolonged contractions (tone), found in hollow organs.\n\nKey difference: Smooth muscle uses calmodulin (not troponin) and myosin light-chain kinase (MLCK) for regulation." },
      { heading: "Clinical Relevance", body: "**Myasthenia gravis**: Autoimmune destruction of ACh receptors → fatigable weakness → worse with use, better with rest. Treatment: Pyridostigmine (AChE inhibitor).\n\n**Rigor mortis**: ATP depletion after death → permanent cross-bridge attachment → stiffening.\n\n**Muscle fatigue**: Not ATP depletion — it's accumulation of H⁺, Pi, and ADP impairing cross-bridge function and Ca²⁺ release." },
    ],
  },
  {
    slug: "respiratory-mechanics",
    title: "Respiratory Mechanics",
    subject: "Physiology",
    blurb: "How breathing works — from Boyle's Law to gas exchange at the alveoli.",
    accent: "#38bdf8",
    icon: "wind",
    diagram: "lungs",
    order: 7,
    keyPoints: [
      "Breathing is driven by pressure gradients created by the diaphragm.",
      "Boyle's Law: as volume increases, pressure decreases — air flows in.",
      "Tidal volume is ~500 mL per breath at rest.",
      "Gas exchange occurs by simple diffusion across the alveolar membrane.",
    ],
    basicBlocks: [
      { heading: "How Breathing Works", body: "Breathing is entirely about creating pressure differences.\n\n**Inhalation**: The diaphragm contracts and flattens → thoracic volume increases → intrapleural pressure drops → lungs expand → alveolar pressure drops below atmospheric → air rushes in.\n\n**Exhalation** (at rest): Passive. Diaphragm relaxes → elastic recoil of lungs → volume decreases → pressure rises above atmospheric → air flows out.\n\n**Forced exhalation**: Internal intercostals and abdominal muscles actively compress the chest." },
      { heading: "Key Lung Volumes", body: "**Tidal Volume (TV)**: ~500 mL — normal quiet breath.\n**Inspiratory Reserve Volume (IRV)**: ~3000 mL — max extra you can breathe in.\n**Expiratory Reserve Volume (ERV)**: ~1100 mL — max extra you can breathe out.\n**Residual Volume (RV)**: ~1200 mL — air left after max exhalation (can't be emptied).\n\n**Vital Capacity (VC)** = IRV + TV + ERV ≈ 4600 mL.\n**Total Lung Capacity (TLC)** = VC + RV ≈ 5800 mL." },
      { heading: "Gas Exchange", body: "Gas exchange occurs at two levels:\n\n**External respiration** (lungs): O₂ diffuses from alveoli (PO₂ ~104 mmHg) into pulmonary capillary blood (PO₂ ~40 mmHg). CO₂ diffuses in the opposite direction.\n\n**Internal respiration** (tissues): O₂ diffuses from arterial blood (PO₂ ~100 mmHg) into cells (PO₂ ~40 mmHg). CO₂ diffuses out of cells into blood.\n\nBoth driven by partial pressure gradients — no energy required." },
    ],
    inDepthBlocks: [
      { heading: "Boyle's Law and Compliance", body: "**Boyle's Law**: P₁V₁ = P₂V₂ (at constant temperature). Doubling volume halves pressure.\n\n**Lung compliance**: How easily the lung expands. High compliance = easy to inflate (emphysema). Low compliance = stiff, hard to inflate (pulmonary fibrosis).\n\n**Surface tension**: Alveolar fluid creates surface tension that tends to collapse alveoli. **Surfactant** (produced by Type II pneumocytes) reduces this tension, preventing collapse and increasing compliance.\n\nClinical: Premature infants lack surfactant → Respiratory Distress Syndrome (RDS)." },
      { heading: "Ventilation-Perfusion (V/Q) Matching", body: "**V/Q ratio** = ventilation / perfusion. Normal ≈ 0.8.\n\n**Dead space** (V/Q → ∞): Ventilated but not perfused (e.g., pulmonary embolism).\n**Shunt** (V/Q → 0): Perfused but not ventilated (e.g., pneumonia, atelectasis).\n\nThe body auto-matches V/Q: hypoxic pulmonary vasoconstriction diverts blood away from poorly ventilated areas." },
      { heading: "Clinical: Asthma and COPD", body: "**Asthma**: Reversible bronchoconstriction + inflammation + mucus hypersecretion. Triggered by allergens, cold air, exercise. Treatment: bronchodilators (salbutamol) + inhaled corticosteroids.\n\n**COPD**: Irreversible airflow limitation. Two types:\n- Chronic bronchitis: productive cough >3 months/year → mucus gland hypertrophy.\n- Emphysema: alveolar wall destruction → loss of elastic recoil → air trapping.\n\nBoth: smoking is the #1 cause." },
    ],
  },
  {
    slug: "renal-physiology",
    title: "Renal Physiology",
    subject: "Physiology",
    blurb: "The kidney's filtration, reabsorption, and secretion — and how it maintains homeostasis.",
    accent: "#f97316",
    icon: "droplets",
    diagram: "kidney",
    order: 8,
    keyPoints: [
      "The nephron is the functional unit of the kidney (~1 million per kidney).",
      "Glomerular filtration rate (GFR) is ~125 mL/min or 180 L/day.",
      "Most filtrate is reabsorbed — only ~1-2 L becomes urine.",
      "The Loop of Henle creates the concentration gradient for water reabsorption.",
    ],
    basicBlocks: [
      { heading: "The Three Renal Processes", body: "1. **Filtration** — Blood pressure forces plasma through the glomerular capillaries into Bowman's capsule. Free of cells and large proteins.\n\n2. **Reabsorption** — Useful substances (glucose, amino acids, Na⁺, water) are reclaimed from the filtrate back into the blood. 99% of filtrate is reabsorbed!\n\n3. **Secretion** — Additional waste (H⁺, K⁺, drugs, creatinine) is actively moved from blood into the filtrate for excretion." },
      { heading: "The Nephron Tour", body: "**Glomerulus** → filtration (180 L/day).\n**Proximal Convoluted Tubule (PCT)**: Reabsorbs 65% of Na⁺, water, glucose, amino acids. The workhorse.\n**Loop of Henle**: Creates the concentration gradient. Descending limb is permeable to water; ascending limb pumps Na⁺/K⁺/Cl⁻ out.\n**Distal Convoluted Tubule (DCT)**: Fine-tuning — aldosterone increases Na⁺ reabsorption.\n**Collecting Duct**: ADH controls water reabsorption — determines urine concentration." },
      { heading: "The Countercurrent Multiplier", body: "The Loop of Henle creates a progressively increasing osmotic gradient from cortex (300 mOsm/L) to medulla (1200 mOsm/L).\n\n- Descending limb: water leaves → filtrate gets concentrated.\n- Ascending limb: Na⁺/K⁺/2Cl⁻ pumped out → filtrate gets dilute, interstitium gets concentrated.\n- This multiplier effect allows the collecting duct to concentrate urine when ADH is present." },
    ],
    inDepthBlocks: [
      { heading: "RAAS — Blood Pressure Control", body: "**Renin-Angiotensin-Aldosterone System (RAAS)**:\n\n1. Low blood pressure → Juxtaglomerular cells release **renin**.\n2. Renin converts angiotensinogen → **angiotensin I**.\n3. ACE (in lungs) converts angiotensin I → **angiotensin II**.\n4. Angiotensin II: vasoconstriction + stimulates **aldosterone** release from adrenal cortex.\n5. Aldosterone: increases Na⁺ reabsorption in DCT → water follows → blood volume ↑ → BP ↑.\n\nClinical: ACE inhibitors (ramipril) block this system → treat hypertension + heart failure." },
      { heading: "Acid-Base Balance", body: "The kidney maintains blood pH (7.35–7.45) by:\n\n1. **Reabsorbing filtered HCO₃⁻** — mainly in PCT (80-90%).\n2. **Secreting H⁺** — via H⁺-ATPase in collecting duct (intercalated cells).\n3. **Producing new HCO₃⁻** — by combining H⁺ with NH₃ (ammoniagenesis) in the PCT.\n\nIn acidosis: kidney excretes more H⁺, retains more HCO₃⁻.\nIn alkalosis: kidney excretes HCO₃⁻, retains H⁺." },
      { heading: "Clinical: Kidney Stones and Diuretics", body: "**Kidney stones (nephrolithiasis)**: Most common = calcium oxalate. Risk: dehydration, hypercalciuria, low citrate. Treatment: lithotripsy (ESWL), ureteroscopy, or PCNL.\n\n**Diuretics**:\n- Loop (furosemide): blocks Na⁺/K⁺/2Cl⁻ in ascending loop → powerful diuresis.\n- Thiazide (hydrochlorothiazide): blocks Na⁺/Cl⁻ in DCT → mild diuresis.\n- K⁺-sparing (spironolactone): blocks aldosterone in DCT → conserves K⁺." },
    ],
  },
  {
    slug: "digestive-system",
    title: "Digestive System",
    subject: "Systems",
    blurb: "The journey of food — from mouth to anus, and the organs that make it happen.",
    accent: "#facc15",
    icon: "utensils",
    diagram: "digestive",
    order: 9,
    keyPoints: [
      "Digestion is both mechanical (churning) and chemical (enzymes).",
      "The stomach uses HCl (pH 1.5–3.5) and pepsin to break down protein.",
      "The small intestine is where 90% of absorption occurs.",
      "The liver produces bile, which emulsifies fats for absorption.",
    ],
    basicBlocks: [
      { heading: "The Journey of Food", body: "**Mouth**: Mechanical chewing + salivary amylase starts starch digestion.\n\n**Oesophagus**: Peristaltic waves push food to the stomach (no digestion here).\n\n**Stomach**: HCl (pH 1.5–3.5) + pepsin → protein digestion. Gastric lipase starts fat digestion. Food becomes chyme.\n\n**Small Intestine**: The real workhorse. Duodenum receives bile (liver/gallbladder) and pancreatic enzymes. Jejunum absorbs nutrients. Ileum absorbs B₁₂ and bile salts.\n\n**Large Intestine**: Water absorption, bacterial fermentation, formation of faeces." },
      { heading: "Key Enzymes", body: "**Salivary amylase** — starch → maltose (mouth)\n**Pepsin** — protein → peptides (stomach, pH 1.5–2.5)\n**Pancreatic lipase** — triglycerides → fatty acids + glycerol (small intestine)\n**Trypsin/Chymotrypsin** — proteins → peptides (small intestine)\n**Maltase/Sucrase/Lactase** — disaccharides → monosaccharides (brush border)\n\nAll pancreatic enzymes are secreted as inactive zymogens (trypsinogen, chymotrypsinogen) to prevent autodigestion." },
      { heading: "The Liver's Role", body: "**Bile production**: The liver produces 600–1000 mL of bile daily. Bile emulsifies fats (breaks large fat globules into smaller micelles for lipase action).\n\n**Metabolic hub**: The liver processes absorbed nutrients, detoxifies drugs, stores glycogen, synthesises plasma proteins (albumin, clotting factors), and metabolises hormones.\n\n**First-pass metabolism**: Orally absorbed drugs go directly to the liver via the portal vein before reaching systemic circulation." },
    ],
    inDepthBlocks: [
      { heading: "Peristalsis and Motility", body: "**Peristalsis**: Coordinated smooth muscle contractions that propel food forward. The migrating motor complex (MMC) sweeps residual food during fasting.\n\n**Gastric emptying**: Controlled by the pyloric sphincter. Fat delays emptying (ileal brake mechanism) — this is why fatty meals keep you full longer.\n\n**Segmentation**: Mixing contractions in the small intestine that increase contact time between chyme and absorptive surface.\n\nClinical: Gastroparesis = delayed gastric emptying (common in diabetes) → nausea, bloating, early satiety." },
      { heading: "Clinical: Ulcers and GERD", body: "**Peptic ulcer disease**: Erosion of the gastric/duodenal mucosa. 90% of duodenal ulcers caused by H. pylori. Treatment: PPIs (omeprazole) + H. pylori eradication (triple therapy).\n\n**GERD**: Gastric acid refluxes into oesophagus → heartburn, regurgitation. Chronic GERD → Barrett's oesophagus → increased oesophageal cancer risk. Treatment: Lifestyle changes + PPIs.\n\n**Liver cirrhosis**: End-stage liver disease from chronic hepatitis, alcohol, or NAFLD → portal hypertension, ascites, hepatic encephalopathy." },
    ],
  },
  {
    slug: "endocrine-system",
    title: "Endocrine System",
    subject: "Systems",
    blurb: "Hormones, glands, and feedback loops — the chemical messengers of the body.",
    accent: "#a78bfa",
    icon: "zap",
    diagram: "endocrine",
    order: 10,
    keyPoints: [
      "Hormones travel through the blood to act on distant target organs.",
      "Most endocrine axes use negative feedback to maintain homeostasis.",
      "Insulin lowers blood glucose; glucagon raises it.",
      "The hypothalamus is the master controller linking the nervous and endocrine systems.",
    ],
    basicBlocks: [
      { heading: "What Are Hormones?", body: "Hormones are chemical messengers released by endocrine glands directly into the bloodstream. They travel to distant target organs and exert their effects by binding to specific receptors.\n\n**Types**:\n- **Peptide hormones** (insulin, growth hormone) — water-soluble, bind cell surface receptors.\n- **Steroid hormones** (cortisol, aldosterone, oestrogen) — lipid-soluble, cross cell membranes, bind intracellular receptors.\n- **Amine hormones** (thyroxine, adrenaline) — derived from amino acids." },
      { heading: "The Major Glands", body: "**Hypothalamus**: Master controller — produces releasing/inhibiting hormones that control the pituitary.\n\n**Pituitary (anterior)**: TSH, ACTH, FSH, LH, GH, Prolactin.\n**Pituitary (posterior)**: Stores ADH and Oxytocin (made in hypothalamus).\n\n**Thyroid**: T3/T4 (metabolism), Calcitonin (lowers Ca²⁺).\n**Adrenals**: Cortisol (stress), Aldosterone (Na⁺ balance), Adrenaline (fight-or-flight).\n**Pancreas**: Insulin (lowers glucose), Glucagon (raises glucose)." },
      { heading: "Negative Feedback", body: "Most hormone systems work on negative feedback:\n\nExample — Thyroid axis:\nHypothalamus releases TRH → Pituitary releases TSH → Thyroid releases T3/T4.\nWhen T3/T4 levels rise, they suppress TRH and TSH → less T3/T4 produced.\nThis keeps hormone levels in a narrow, optimal range.\n\nPositive feedback is rare — the best example is the LH surge during ovulation." },
    ],
    inDepthBlocks: [
      { heading: "The HPA Axis", body: "**Hypothalamic-Pituitary-Adrenal (HPA) Axis**:\n\n1. Hypothalamus releases **CRH** (corticotropin-releasing hormone).\n2. Anterior pituitary releases **ACTH** (adrenocorticotropic hormone).\n3. Adrenal cortex releases **cortisol**.\n4. Cortisol feeds back to suppress CRH and ACTH.\n\nCortisol effects: Increases blood glucose (gluconeogenesis), suppresses immune system, maintains BP, mobilises fats and proteins.\n\nClinical: Cushing's syndrome = excess cortisol. Addison's disease = cortisol deficiency." },
      { heading: "Diabetes Mellitus", body: "**Type 1**: Autoimmune destruction of pancreatic β-cells → absolute insulin deficiency → ketoacidosis. Treatment: insulin injections.\n\n**Type 2**: Insulin resistance + relative insulin deficiency → hyperglycaemia. Associated with obesity. Treatment: lifestyle changes + metformin + other agents.\n\n**Key differences**:\n- DKA (Type 1): fruity breath, Kussmaul breathing, pH < 7.3.\n- HHS (Type 2): extreme hyperglycaemia (>600 mg/dL), no ketosis, severe dehydration.\n\nHbA1c: reflects average glucose over 2–3 months. Target < 7% for most adults." },
      { heading: "Clinical: Thyroid Disorders", body: "**Hypothyroidism**: Fatigue, weight gain, cold intolerance, constipation. Most common cause: Hashimoto's thyroiditis (autoimmune). Treatment: levothyroxine.\n\n**Hyperthyroidism**: Weight loss, heat intolerance, tremor, palpitations. Most common cause: Graves' disease (autoimmune — TSH receptor antibodies). Treatment: carbimazole, radioactive iodine, or surgery.\n\n**Thyroid storm**: Life-threatening thyrotoxicosis → high fever, tachycardia, delirium. Treatment: propylthiouracil (PTU) + beta-blockers + iodine + steroids." },
    ],
  },
  {
    slug: "blood-and-immunity",
    title: "Blood & Immunity",
    subject: "Systems",
    blurb: "The components of blood and the immune system's defence lines.",
    accent: "#ef4444",
    icon: "droplet",
    diagram: "blood",
    order: 11,
    keyPoints: [
      "Red blood cells carry oxygen (haemoglobin); white blood cells fight infection.",
      "Blood types are determined by antigens on RBC surfaces (A, B, Rh).",
      "Innate immunity is fast but non-specific; adaptive immunity is slow but targeted.",
      "Antibodies are produced by B cells and bind specific antigens.",
    ],
    basicBlocks: [
      { heading: "Blood Components", body: "**Plasma** (55%): Water + proteins (albumin, globulins, fibrinogen) + dissolved substances.\n\n**Red Blood Cells** (44%): Carry O₂ via haemoglobin. No nucleus → can't divide. Live ~120 days. Produced in red bone marrow by erythropoietin (EPO).\n\n**White Blood Cells** (<1%): Fight infection. Two types:\n- Granulocytes: Neutrophils (first responders, phagocytosis), Eosinophils (parasites, allergies), Basophils (histamine).\n- Agranulocytes: Lymphocytes (B cells + T cells), Monocytes (become macrophages).\n\n**Platelets**: Cell fragments for clotting. Live ~8–10 days." },
      { heading: "Blood Types", body: "**ABO system**: Based on antigens A and B on RBC surfaces.\n- Type A: A antigens, anti-B antibodies.\n- Type B: B antigens, anti-A antibodies.\n- Type AB: Both antigens, no antibodies (universal recipient).\n- Type O: No antigens, both antibodies (universal donor).\n\n**Rh system**: Rh+ (has D antigen) or Rh− (no D antigen). Rh− mother carrying Rh+ baby → risk of haemolytic disease of the newborn (HDN) → prevent with anti-D immunoglobulin." },
      { heading: "Innate vs Adaptive Immunity", body: "**Innate** (first line): Fast (minutes-hours), non-specific. Includes physical barriers (skin, mucous membranes), phagocytes (neutrophils, macrophages), complement system, inflammation.\n\n**Adaptive** (second line): Slow (days-weeks), highly specific. Includes:\n- **B cells**: Produce antibodies (humoral immunity).\n- **T cells**: CD4+ helper T cells coordinate immune response; CD8+ cytotoxic T cells kill infected cells (cell-mediated immunity).\n- **Memory cells**: Provide long-lasting immunity after infection or vaccination." },
    ],
    inDepthBlocks: [
      { heading: "The Coagulation Cascade", body: "**Two pathways converge on a common pathway**:\n\n**Intrinsic pathway**: Triggered by contact with damaged surface (Factor XII → XI → IX → VIII). Measured by PTT.\n\n**Extrinsic pathway**: Triggered by tissue factor (Factor VII + TF). Measured by PT/INR.\n\n**Common pathway**: Factor X → Factor II (prothrombin) → Thrombin → Fibrinogen → Fibrin → Clot.\n\nVitamin K is essential for Factors II, VII, IX, X (and protein C & S). Warfarin blocks vitamin K → anticoagulant." },
      { heading: "How Vaccines Work", body: "Vaccines expose the immune system to a harmless form of a pathogen (antigen) to stimulate adaptive immunity without causing disease.\n\n**Types**:\n- Live attenuated (MMR, BCG): weakened pathogen → strong, long-lasting immunity.\n- Inactivated (polio, flu): killed pathogen → weaker immunity, needs boosters.\n- Subunit (hepatitis B): purified protein antigen → safe, no live component.\n- mRNA (COVID-19): instructs cells to make spike protein → immune response.\n\nMemory B and T cells persist for years, enabling a rapid response on re-exposure." },
      { heading: "Clinical: Anaemia and Leukaemia", body: "**Anaemia** (low haemoglobin):\n- Iron deficiency: most common worldwide. Microcytic, hypochromic. Treat with iron supplementation.\n- B₁₂/folate deficiency: megaloblastic. Macrocytic. B₁₂ = pernicious anaemia (autoimmune gastritis).\n- Sickle cell: HbS mutation → sickling in low O₂. Vaso-occlusive crises, pain, stroke.\n\n**Leukaemia**: Cancer of WBCs.\n- Acute lymphoblastic (ALL): most common childhood cancer.\n- Acute myeloid (AML): most common acute leukaemia in adults.\n- Chronic lymphocytic (CLL): most common adult leukaemia.\n- Chronic myeloid (CML): Philadelphia chromosome (BCR-ABL fusion)." },
    ],
  },
  {
    slug: "synapses-neurotransmitters",
    title: "Synapses & Neurotransmitters",
    subject: "Neuroscience",
    blurb: "The chemical messengers that make neurons talk to each other.",
    accent: "#22d3ee",
    icon: "brain",
    diagram: "brain",
    order: 12,
    keyPoints: [
      "Synapses are the gaps between neurons where signals are transmitted chemically.",
      "Neurotransmitters are released from vesicles and bind to postsynaptic receptors.",
      "Excitatory (glutamate) and inhibitory (GABA) signals balance each other.",
      "Many drugs work by modifying neurotransmitter levels (SSRIs, L-DOPA).",
    ],
    basicBlocks: [
      { heading: "What Is a Synapse?", body: "A synapse is the junction between two neurons (or a neuron and a target cell). It has three parts:\n\n1. **Presynaptic terminal**: Contains synaptic vesicles filled with neurotransmitter.\n2. **Synaptic cleft**: A 20–40 nm gap between the cells.\n3. **Postsynaptic membrane**: Contains receptors that respond to the neurotransmitter.\n\nChemical synapses use neurotransmitters; electrical synapses use gap junctions (faster, less common in adults)." },
      { heading: "Key Neurotransmitters", body: "**Glutamate**: Main excitatory NT in the brain. Binds AMPA and NMDA receptors. Essential for learning (LTP). Too much → excitotoxicity.\n\n**GABA**: Main inhibitory NT. Binds GABA-A (ionotropic) and GABA-B (metabotropic) receptors. Benzodiazepines enhance GABA-A → sedation.\n\n**Acetylcholine (ACh)**: At NMJ (muscle contraction), in brain (memory). Degraded by AChE. Alzheimer's = low ACh → treat with AChE inhibitors.\n\n**Dopamine**: Reward, motivation, motor control. 4 pathways. Low in Parkinson's; high in schizophrenia.\n\n**Serotonin (5-HT)**: Mood, sleep, appetite. Low in depression → SSRIs block reuptake." },
      { heading: "How a Signal Crosses", body: "1. Action potential arrives at presynaptic terminal.\n2. Voltage-gated Ca²⁺ channels open → Ca²⁺ floods in.\n3. Ca²⁺ triggers vesicle fusion with presynaptic membrane (SNARE complex).\n4. Neurotransmitter released into the synaptic cleft.\n5. NT binds to postsynaptic receptors → opens ion channels or activates second messengers.\n6. Signal terminated by: reuptake, enzymatic degradation, or diffusion." },
    ],
    inDepthBlocks: [
      { heading: "Synaptic Plasticity — LTP and LTD", body: "**Long-Term Potentiation (LTP)**: Repeated stimulation strengthens the synapse — the basis of learning and memory.\n- Hebb's rule: \"Neurons that fire together wire together.\"\n- NMDA receptor is the coincidence detector: needs both glutamate binding AND postsynaptic depolarisation.\n\n**Long-Term Depression (LTD)**: Weak stimulation weakens the synapse — important for forgetting and refining neural circuits.\n\nBoth require gene expression changes for long-lasting effects." },
      { heading: "Clinical: Depression, Parkinson's, Schizophrenia", body: "**Depression**: Monoamine hypothesis — low serotonin/noradrenaline. Treatment: SSRIs (fluoxetine) block serotonin reuptake. SNRIs (venlafaxine) block both.\n\n**Parkinson's**: Loss of dopaminergic neurons in substantia nigra → tremor, rigidity, bradykinesia. Treatment: L-DOPA + carbidopa (dopamine precursor that crosses BBB).\n\n**Schizophrenia**: Dopamine hypothesis — excess dopamine in mesolimbic pathway (positive symptoms). Treatment: D2 receptor antagonists (haloperidol, olanzapine)." },
      { heading: "Clinical Relevance — Drug Mechanisms", body: "**Benzodiazepines**: Enhance GABA-A receptor function → increased Cl⁻ influx → neuronal inhibition → sedation.\n\n**SSRIs**: Block serotonin reuptake transporter (SERT) → more 5-HT in synaptic cleft → improved mood.\n\n**Botulinum toxin**: Cleaves SNARE proteins → prevents ACh release → muscle paralysis (used therapeutically for dystonia, migraines).\n\n**Organophosphates (nerve agents)**: Inhibit AChE → ACh accumulates → cholinergic crisis → treated with atropine + pralidoxime." },
    ],
  },
  {
    slug: "cranial-nerves",
    title: "The 12 Cranial Nerves",
    subject: "Anatomy",
    blurb: "Know their numbers, names, functions, and the mnemonics that make them stick.",
    accent: "#f472b6",
    icon: "brain",
    diagram: "brain",
    order: 13,
    keyPoints: [
      "12 cranial nerves emerge from the brainstem — know their S/M/B classification.",
      "\"Some Say Marry Money\" gives you the pattern: S, S, M, M, B, M, B, S, B, B, M, M.",
      "Vagus (X) is the parasympathetic powerhouse — heart, lungs, GI tract.",
      "Bell's palsy (LMN) affects the whole face; stroke (UMN) spares the forehead.",
    ],
    basicBlocks: [
      { heading: "The Complete List", body: "I — **Olfactory**: Smell (Sensory)\nII — **Optic**: Vision (Sensory)\nIII — **Oculomotor**: Eye movement, pupil constriction (Motor)\nIV — **Trochlear**: Eye movement — downward/inward (Motor)\nV — **Trigeminal**: Facial sensation + chewing (Mixed)\nVI — **Abducens**: Lateral gaze (Motor)\nVII — **Facial**: Facial expression, taste anterior 2/3 tongue (Mixed)\nVIII — **Vestibulocochlear**: Hearing + balance (Sensory)\nIX — **Glossopharyngeal**: Taste posterior 1/3, swallowing (Mixed)\nX — **Vagus**: Parasympathetic to heart/lungs/GI (Mixed)\nXI — **Accessory**: Shoulder shrug, head turning (Motor)\nXII — **Hypoglossal**: Tongue movement (Motor)" },
      { heading: "The Mnemonics", body: "**Names in order**: \"On Old Olympus' Towering Tops, A Finn And German Viewed Some Hops\"\n→ O, O, O, T, T, A, F, G, V, S, H\n\n**Sensory/Motor/Both**: \"Some Say Marry Money But My Brother Says Big Brains Matter More\"\n→ S, S, M, M, B, M, B, S, B, B, M, M\n\n**Classification**: 4 sensory, 5 motor, 3 mixed — a useful exam ratio." },
      { heading: "Quick Classification", body: "**Sensory only**: I (Olfactory), II (Optic), VIII (Vestibulocochlear)\n**Motor only**: III (Oculomotor), IV (Trochlear), VI (Abducens), XI (Accessory), XII (Hypoglossal)\n**Mixed**: V (Trigeminal), VII (Facial), IX (Glossopharyngeal), X (Vagus)\n\n**Foramina**: III/IV/VI/V1 → superior orbital fissure. V2 → foramen rotundum. V3 → foramen ovale. IX/X/XI → jugular foramen. XII → hypoglossal canal." },
    ],
    inDepthBlocks: [
      { heading: "Vagus Nerve (X) — The Wandering Nerve", body: "The longest cranial nerve. Parasympathetic supply to heart (slows HR), lungs (bronchoconstriction), and GI tract up to splenic flexure.\n\nAlso carries: taste from epiglottis, muscles of pharynx/larynx (speech, swallowing), and the gag reflex (efferent limb).\n\n**Clinical**: Vagus nerve stimulation (VNS) treats drug-resistant epilepsy and depression. Recurrent laryngeal nerve (branch of X) loops under the aortic arch — left vocal cord palsy is common in thoracic disease." },
      { heading: "Facial Nerve (VII) — Motor vs Sensory", body: "Four branches after stylomastoid foramen: **T**emporal, **Z**ygomatic, **B**uccal, **M**andibular (\"To Zanzibar By Motorcar\").\n\n**Motor**: All muscles of facial expression + stapedius + stylohyoid.\n**Sensory**: Taste from anterior 2/3 tongue (chorda tympani).\n**Parasympathetic**: Lacrimation, submandibular salivation.\n\n**Bell's palsy**: LMN lesion → entire ipsilateral face affected (can't raise eyebrow). Treatment: prednisolone within 72h. ~85% recover fully." },
      { heading: "Clinical: Bell's Palsy vs Stroke", body: "**Bell's palsy (LMN)**: Forehead IS affected (can't wrinkle brow). Entire half of face is weak.\n\n**Stroke (UMN)**: Forehead is SPARED (bilateral cortical innervation). Only lower face is weak on contralateral side.\n\nThis is THE most tested distinction in cranial nerve exams.\n\nOther key tests:\n- Gag reflex: IX (afferent) + X (efferent).\n- Trigeminal neuralgia: electric-shock pain in V2/V3 → carbamazepine first-line." },
    ],
  },
];

export const SEED_FLASHCARDS = [
  // Cardiac cycle
  {
    topicSlug: "cardiac-cycle",
    front: "What is the duration of one cardiac cycle at a resting heart rate of 75 bpm?",
    back: "0.8 seconds (60 ÷ 75 = 0.8 s). Systole ≈ 0.3 s, diastole ≈ 0.5 s.",
    fact: "Diastole is longer — that's when the coronary arteries fill with blood.",
    order: 1,
  },
  {
    topicSlug: "cardiac-cycle",
    front: "Which valves close to produce the 'lub' (S1) and 'dub' (S2) sounds?",
    back: "S1 'lub' = AV valves (mitral + tricuspid) closing at start of systole. S2 'dub' = semilunar valves (aortic + pulmonary) closing at start of diastole.",
    fact: "Murmurs occur between S1 and S2 when blood flows through a narrow or leaky valve.",
    order: 2,
  },
  {
    topicSlug: "cardiac-cycle",
    front: "Arrange in order: ventricular ejection, atrial systole, isovolumetric contraction, isovolumetric relaxation, ventricular filling.",
    back: "1. Atrial systole → 2. Isovolumetric contraction → 3. Ventricular ejection → 4. Isovolumetric relaxation → 5. Ventricular filling.",
    fact: "Mnemonic: All Insects Eat Ice-cream First.",
    order: 3,
  },
  {
    topicSlug: "cardiac-cycle",
    front: "During which phase are all four heart valves closed?",
    back: "Isovolumetric contraction and isovolumetric relaxation — pressure changes dramatically but no blood moves, because every valve is shut.",
    fact: "This is why ventricular pressure can shoot from 8 to 80 mmHg with zero volume change.",
    order: 4,
  },
  {
    topicSlug: "cardiac-cycle",
    front: "What percentage of ventricular filling is passive (without atrial contraction)?",
    back: "About 80%. The 'atrial kick' (atrial systole) adds only the last ~20%.",
    fact: "Losing atrial kick (e.g. atrial fibrillation) reduces cardiac output noticeably — up to 20%.",
    order: 5,
  },
  {
    topicSlug: "cardiac-cycle",
    front: "What is the dicrotic notch and what causes it?",
    back: "A small dip in the aortic pressure trace caused by brief backflow of blood as the aortic valve closes at the end of systole.",
    fact: "It marks the start of diastole on the aortic pressure curve.",
    order: 6,
  },

  // Action potential
  {
    topicSlug: "action-potential",
    front: "What is the resting membrane potential of a typical neuron?",
    back: "Approximately −70 mV (inside negative relative to outside).",
    fact: "Maintained by the Na⁺/K⁺ ATPase pump and the leak of K⁺ out of the cell.",
    order: 1,
  },
  {
    topicSlug: "action-potential",
    front: "What is threshold and what happens at it?",
    back: "Threshold ≈ −55 mV. At threshold, voltage-gated Na⁺ channels open and the all-or-none action potential fires.",
    fact: "Subthreshold stimuli produce only local graded potentials that decay with distance.",
    order: 2,
  },
  {
    topicSlug: "action-potential",
    front: "Which ions drive depolarisation and repolarisation?",
    back: "Depolarisation: Na⁺ floods in (making the inside positive, up to ~+30 mV). Repolarisation: K⁺ floods out, restoring negativity.",
    fact: "The peak is +30 mV, not the Na⁺ equilibrium +60 mV, because Na⁺ channels inactivate before the peak.",
    order: 3,
  },
  {
    topicSlug: "action-potential",
    front: "What is the difference between absolute and relative refractory periods?",
    back: "Absolute: no stimulus can fire a new spike (Na⁺ channels inactivated). Relative: a stronger-than-normal stimulus can fire one.",
    fact: "The absolute refractory period guarantees one-way propagation of the impulse.",
    order: 4,
  },
  {
    topicSlug: "action-potential",
    front: "How does a neuron encode a stronger stimulus if the spike is all-or-none?",
    back: "By frequency coding — a stronger stimulus makes the neuron fire more action potentials per second, not bigger ones.",
    fact: "Amplitude of the spike is constant; intensity is encoded in firing rate.",
    order: 5,
  },
  {
    topicSlug: "action-potential",
    front: "Why is conduction faster in myelinated axons?",
    back: "Saltatory conduction — the impulse jumps between Nodes of Ranvier where Na⁺ channels cluster, so fewer ions move and conduction speeds up (up to ~120 m/s).",
    fact: "Unmyelinated fibres conduct at only ~1 m/s.",
    order: 6,
  },

  // Brachial plexus
  {
    topicSlug: "brachial-plexus",
    front: "What are the five levels of the brachial plexus, in order?",
    back: "Roots (C5–T1) → Trunks → Divisions → Cords → Branches.",
    fact: "Mnemonic: Randy Travis Drinks Cold Beer.",
    order: 1,
  },
  {
    topicSlug: "brachial-plexus",
    front: "Which spinal roots form the upper, middle and lower trunks?",
    back: "Upper trunk: C5 + C6. Middle trunk: C7. Lower trunk: C8 + T1.",
    fact: "The middle trunk has no sister root — it stands alone.",
    order: 2,
  },
  {
    topicSlug: "brachial-plexus",
    front: "The median nerve is formed by which cords?",
    back: "The lateral cord (lateral root) + medial cord (medial root), which join around the axillary artery.",
    fact: "The ulnar nerve comes only from the medial cord.",
    order: 3,
  },
  {
    topicSlug: "brachial-plexus",
    front: "What is the 'waiter's tip' position and which roots are damaged?",
    back: "Erb's palsy — C5–C6 injury (birth trauma or fall on shoulder): adducted internally rotated shoulder, extended elbow, pronated forearm.",
    fact: "Affected nerves include axillary, musculocutaneous and suprascapular.",
    order: 4,
  },
  {
    topicSlug: "brachial-plexus",
    front: "Which lesion causes claw hand, and which roots are involved?",
    back: "Klumpke's palsy — C8–T1 injury: ulnar nerve paralysis → claw hand, often with Horner's syndrome (ptosis, miosis, anhidrosis).",
    fact: "Horner's syndrome appears when the T1 sympathetic outflow is also torn.",
    order: 5,
  },
  {
    topicSlug: "brachial-plexus",
    front: "Name the LOAF muscles supplied by the median nerve in the hand.",
    back: "Lateral two Lumbricals, Opponens pollicis, Abductor pollicis brevis, Flexor pollicis brevis.",
    fact: "Everything else in the hand is ulnar nerve territory.",
    order: 6,
  },

  // Krebs cycle
  {
    topicSlug: "krebs-cycle",
    front: "Where does the Krebs cycle occur in the cell?",
    back: "In the mitochondrial matrix (except succinate dehydrogenase, which sits in the inner mitochondrial membrane as Complex II).",
    fact: "Succinate dehydrogenase doubles as Complex II of the electron transport chain.",
    order: 1,
  },
  {
    topicSlug: "krebs-cycle",
    front: "What is the net yield of ONE turn of the Krebs cycle per acetyl-CoA?",
    back: "3 NADH, 1 FADH₂, 1 GTP (≈1 ATP), and 2 CO₂.",
    fact: "Through the electron transport chain that's ~10 ATP per turn.",
    order: 2,
  },
  {
    topicSlug: "krebs-cycle",
    front: "List the 8 intermediates of the Krebs cycle in order.",
    back: "Citrate → Isocitrate → α-Ketoglutarate → Succinyl-CoA → Succinate → Fumarate → Malate → Oxaloacetate.",
    fact: "Mnemonic: Citrate Is Succinyl-CoA's Substrate — First Make Oxaloacetate.",
    order: 3,
  },
  {
    topicSlug: "krebs-cycle",
    front: "Which two steps release CO₂?",
    back: "Isocitrate dehydrogenase (isocitrate → α-KG) and α-ketoglutarate dehydrogenase (α-KG → succinyl-CoA).",
    fact: "Both are oxidative decarboxylations producing NADH.",
    order: 4,
  },
  {
    topicSlug: "krebs-cycle",
    front: "Name the enzyme poisoned by fluoroacetate.",
    back: "Aconitase — the enzyme that converts citrate to isocitrate (via cis-aconitate).",
    fact: "Fluoroacetate is converted to fluorocitrate, a 'suicide' inhibitor of aconitase.",
    order: 5,
  },
  {
    topicSlug: "krebs-cycle",
    front: "How is the cycle regulated by energy status?",
    back: "High ATP/NADH inhibits isocitrate dehydrogenase and α-KG dehydrogenase. High ADP and Ca²⁺ activate them.",
    fact: "This negative feedback links the cycle directly to the cell's energy demand.",
    order: 6,
  },

  // DNA replication
  {
    topicSlug: "dna-replication",
    front: "Why is DNA replication called semi-conservative?",
    back: "Each new double helix contains one original (parental) strand and one newly synthesised strand.",
    fact: "Proven by the Meselson–Stahl experiment with heavy (¹⁵N) and light (¹⁴N) nitrogen.",
    order: 1,
  },
  {
    topicSlug: "dna-replication",
    front: "In which direction does DNA polymerase synthesise DNA?",
    back: "Only 5′ → 3′, adding nucleotides to the 3′ end of the growing strand.",
    fact: "Its 3′→5′ exonuclease activity proofreads and removes errors.",
    order: 2,
  },
  {
    topicSlug: "dna-replication",
    front: "What are Okazaki fragments and on which strand do they form?",
    back: "Short, discontinuous pieces of newly synthesised DNA on the lagging strand, each started by its own RNA primer and later joined by ligase.",
    fact: "They form because polymerase works 5′→3′ away from the fork on the lagging strand.",
    order: 3,
  },
  {
    topicSlug: "dna-replication",
    front: "Match the enzymes: helicase, primase, polymerase, ligase.",
    back: "Helicase unzips DNA; primase lays RNA primers; polymerase extends the strand; ligase seals the nicks between Okazaki fragments.",
    fact: "Single-strand binding proteins keep the unwound template stable.",
    order: 4,
  },
  {
    topicSlug: "dna-replication",
    front: "Why do chromosomes get shorter with each replication, and what prevents it?",
    back: "The lagging strand's very end can't be primed, so ends erode. Telomerase extends the telomeric repeats (TTAGGG) to protect chromosome ends.",
    fact: "Telomerase is active in stem/germ cells and most cancers — giving tumours their immortality.",
    order: 5,
  },
  {
    topicSlug: "dna-replication",
    front: "What three layers of proofreading keep replication accurate to ~1 error in 10⁹?",
    back: "1) Base selection by polymerase geometry, 2) 3′→5′ exonuclease proofreading, 3) post-replication mismatch repair (MutS/MutL in bacteria, hMSH2/hMLH1 in humans).",
    fact: "Defective mismatch repair underlies Lynch syndrome and high colorectal cancer risk.",
    order: 6,
  },

  // Muscle Contraction (topic 6)
  { topicSlug: "muscle-contraction", front: "What are the four key proteins in the sarcomere and their roles?", back: "Actin (thin filament — track), Myosin (thick filament — motor), Troponin (Ca²⁺ sensor), Tropomyosin (blocks binding at rest).", fact: "A sarcomere extends from Z-disc to Z-disc.", order: 1 },
  { topicSlug: "muscle-contraction", front: "What triggers the release of calcium from the sarcoplasmic reticulum?", back: "An action potential travels down T-tubules → activates DHPR (dihydropyridine receptors) → mechanically opens RyR1 (ryanodine receptors) on the SR → Ca²⁺ floods out.", fact: "Malignant hyperthermia = RyR1 mutation → uncontrolled Ca²⁺ release.", order: 2 },
  { topicSlug: "muscle-contraction", front: "What are the three things ATP is required for in muscle contraction?", back: "1) Power stroke (cocks myosin head), 2) Cross-bridge detachment (releases myosin from actin), 3) Ca²⁺ reuptake (powers SERCA pump).", fact: "Rigor mortis occurs because ATP depletion prevents cross-bridge detachment.", order: 3 },
  { topicSlug: "muscle-contraction", front: "What is the difference between skeletal, cardiac, and smooth muscle?", back: "Skeletal: voluntary, striated, multinucleated. Cardiac: involuntary, striated, intercalated discs, autorhythmic. Smooth: involuntary, non-striated, uses calmodulin (not troponin).", fact: "Smooth muscle uses MLCK (myosin light-chain kinase) for regulation.", order: 4 },
  { topicSlug: "muscle-contraction", front: "What is myasthenia gravis and how is it treated?", back: "Autoimmune destruction of ACh receptors at the NMJ → fatigable weakness (worse with use, better with rest). Treatment: Pyridostigmine (AChE inhibitor).", fact: "Ice pack test: cooling the eyelid improves ptosis in myasthenia.", order: 5 },
  // Respiratory Mechanics (topic 7)
  { topicSlug: "respiratory-mechanics", front: "What is Boyle's Law and how does it apply to breathing?", back: "P₁V₁ = P₂V₂. During inhalation, diaphragm contracts → thoracic volume increases → intrapleural pressure drops → air rushes in.", fact: "At rest, exhalation is passive — just elastic recoil.", order: 1 },
  { topicSlug: "respiratory-mechanics", front: "What is tidal volume and what is vital capacity?", back: "Tidal volume: ~500 mL (normal quiet breath). Vital capacity: IRV + TV + ERV ≈ 4600 mL (max air you can exhale after max inhalation).", fact: "Residual volume (~1200 mL) can never be exhaled.", order: 2 },
  { topicSlug: "respiratory-mechanics", front: "What is the role of surfactant and who produces it?", back: "Surfactant reduces alveolar surface tension, preventing collapse and increasing compliance. Produced by Type II pneumocytes.", fact: "Premature infants lack surfactant → Respiratory Distress Syndrome (RDS).", order: 3 },
  { topicSlug: "respiratory-mechanics", front: "What is a V/Q mismatch and give two clinical examples?", back: "V/Q ratio mismatch between ventilation and perfusion. Dead space (V/Q → ∞): pulmonary embolism. Shunt (V/Q → 0): pneumonia, atelectasis.", fact: "The body auto-adjusts: hypoxic pulmonary vasoconstriction diverts blood from poorly ventilated areas.", order: 4 },
  { topicSlug: "respiratory-mechanics", front: "How does asthma differ from COPD?", back: "Asthma: reversible bronchoconstriction + inflammation. COPD: irreversible airflow limitation (chronic bronchitis + emphysema). Both: smoking is #1 risk factor for COPD.", fact: "Emphysema = alveolar wall destruction → loss of elastic recoil → air trapping.", order: 5 },
  // Renal Physiology (topic 8)
  { topicSlug: "renal-physiology", front: "What is the normal GFR and how much filtrate is produced daily?", back: "GFR ≈ 125 mL/min = 180 L/day. But only 1–2 L becomes urine — 99% is reabsorbed.", fact: "The kidney receives 20-25% of cardiac output.", order: 1 },
  { topicSlug: "renal-physiology", front: "What are the three processes of urine formation?", back: "1) Filtration (glomerulus → Bowman's capsule), 2) Reabsorption (PCT, loop, DCT — reclaim useful substances), 3) Secretion (move waste from blood into filtrate).", fact: "The PCT reabsorbs 65% of filtered Na⁺ and water.", order: 2 },
  { topicSlug: "renal-physiology", front: "How does the Loop of Henle create a concentration gradient?", back: "Descending limb: permeable to water → water leaves → filtrate concentrates. Ascending limb: pumps Na⁺/K⁺/2Cl⁻ out → filtrate dilutes, interstitium concentrates. Countercurrent multiplier.", fact: "Medullary osmolality reaches 1200 mOsm/L at the papilla.", order: 3 },
  { topicSlug: "renal-physiology", front: "What is the RAAS and what does it do?", back: "Renin → Angiotensin I → (ACE) → Angiotensin II → vasoconstriction + aldosterone → Na⁺ reabsorption → blood volume ↑ → BP ↑.", fact: "ACE inhibitors (ramipril) block this system → treat hypertension.", order: 4 },
  { topicSlug: "renal-physiology", front: "What are the three main classes of diuretics and where do they act?", back: "Loop (furosemide): ascending loop of Henle — powerful. Thiazide (HCTZ): DCT — mild. K⁺-sparing (spironolactone): collecting duct — conserves K⁺.", fact: "Loop diuretics are the most potent — used in acute pulmonary oedema.", order: 5 },
  // Digestive System (topic 9)
  { topicSlug: "digestive-system", front: "What is the journey of food through the GI tract?", back: "Mouth (amylase) → Oesophagus (peristalsis) → Stomach (HCl + pepsin) → Small intestine (bile + pancreatic enzymes) → Large intestine (water absorption) → Rectum/Anus.", fact: "90% of nutrient absorption occurs in the small intestine.", order: 1 },
  { topicSlug: "digestive-system", front: "What are the key digestive enzymes and where are they active?", back: "Salivary amylase (starch, mouth), Pepsin (protein, stomach pH 1.5), Trypsin (protein, small intestine), Pancreatic lipase (fat, small intestine), Brush border enzymes (disaccharides).", fact: "Pancreatic enzymes are secreted as inactive zymogens to prevent autodigestion.", order: 2 },
  { topicSlug: "digestive-system", front: "What role does the liver play in digestion?", back: "Produces bile (600–1000 mL/day) which emulsifies fats. Also: metabolic hub, detoxifies drugs, stores glycogen, synthesises albumin and clotting factors.", fact: "Bile is stored and concentrated in the gallbladder.", order: 3 },
  { topicSlug: "digestive-system", front: "What is peptic ulcer disease and how is it treated?", back: "Erosion of gastric/duodenal mucosa. 90% duodenal ulcers = H. pylori. Treatment: PPIs (omeprazole) + H. pylori eradication (triple therapy: PPI + amoxicillin + clarithromycin).", fact: "Gastric ulcers: pain worse with eating. Duodenal ulcers: pain better with eating.", order: 4 },
  { topicSlug: "digestive-system", front: "What is GERD and what complication should you worry about?", back: "Gastric acid refluxes into oesophagus → heartburn. Chronic GERD → Barrett's oesophagus (intestinal metaplasia) → increased oesophageal adenocarcinoma risk.", fact: "Treatment: lifestyle changes + PPIs. Barrett's requires surveillance endoscopy.", order: 5 },
  // Endocrine System (topic 10)
  { topicSlug: "endocrine-system", front: "What are the three types of hormones and how do they differ?", back: "Peptide (insulin, GH): water-soluble, bind cell surface receptors. Steroid (cortisol, oestrogen): lipid-soluble, cross membranes, bind intracellular receptors. Amine (T3, adrenaline): derived from amino acids.", fact: "Steroid hormones can cross the nuclear membrane to directly affect gene expression.", order: 1 },
  { topicSlug: "endocrine-system", front: "What is the HPA axis?", back: "Hypothalamus (CRH) → Anterior pituitary (ACTH) → Adrenal cortex (Cortisol). Cortisol feeds back to suppress CRH and ACTH → negative feedback loop.", fact: "Cushing's = excess cortisol. Addison's = cortisol deficiency.", order: 2 },
  { topicSlug: "endocrine-system", front: "What is the difference between Type 1 and Type 2 diabetes?", back: "Type 1: autoimmune β-cell destruction → absolute insulin deficiency → DKA. Type 2: insulin resistance + relative deficiency → hyperglycaemia → HHS. Type 1 treated with insulin; Type 2 with metformin + lifestyle.", fact: "HbA1c reflects average glucose over 2–3 months. Target < 7%.", order: 3 },
  { topicSlug: "endocrine-system", front: "How does negative feedback maintain hormone levels?", back: "When hormone levels rise, they suppress the releasing hormones upstream. Example: high T3/T4 suppresses TRH and TSH → less T3/T4 produced → levels stay in optimal range.", fact: "Positive feedback is rare — the LH surge during ovulation is the classic example.", order: 4 },
  { topicSlug: "endocrine-system", front: "What are the symptoms of hypothyroidism vs hyperthyroidism?", back: "Hypo: fatigue, weight gain, cold intolerance, constipation (Hashimoto's). Hyper: weight loss, heat intolerance, tremor, palpitations (Graves' disease). Both are autoimmune.", fact: "Thyroid storm = life-threatening hyperthyroidism → PTU + beta-blockers + iodine + steroids.", order: 5 },
  // Blood & Immunity (topic 11)
  { topicSlug: "blood-and-immunity", front: "What are the main blood components and their functions?", back: "Plasma (55%): proteins + dissolved substances. RBCs (44%): carry O₂ via haemoglobin. WBCs (<1%): fight infection. Platelets: clotting.", fact: "RBCs live ~120 days. Platelets live ~8–10 days.", order: 1 },
  { topicSlug: "blood-and-immunity", front: "Explain the ABO blood type system.", back: "Type A: A antigens, anti-B antibodies. Type B: B antigens, anti-A. Type AB: both antigens, no antibodies (universal recipient). Type O: no antigens, both antibodies (universal donor).", fact: "Rh− mother + Rh+ baby → risk of HDN → prevent with anti-D immunoglobulin.", order: 2 },
  { topicSlug: "blood-and-immunity", front: "What is the difference between innate and adaptive immunity?", back: "Innate: fast (minutes), non-specific (skin, phagocytes, complement). Adaptive: slow (days), specific (B cells = antibodies, T cells = cell-mediated). Adaptive has memory.", fact: "Memory B and T cells enable rapid response on re-exposure (vaccination principle).", order: 3 },
  { topicSlug: "blood-and-immunity", front: "What are the two pathways of the coagulation cascade?", back: "Intrinsic (PTT): triggered by contact with damaged surface (XII → XI → IX → VIII). Extrinsic (PT/INR): triggered by tissue factor (VII + TF). Both converge on Factor X → common pathway.", fact: "Vitamin K is essential for Factors II, VII, IX, X. Warfarin blocks vitamin K.", order: 4 },
  { topicSlug: "blood-and-immunity", front: "What are the main types of anaemia and their causes?", back: "Iron deficiency (microcytic): most common. B₁₂/folate deficiency (megaloblastic): pernicious anaemia. Sickle cell (HbS mutation): vaso-occlusive crises. Thalassaemia: reduced globin chain synthesis.", fact: "Iron deficiency is the most common nutritional deficiency worldwide.", order: 5 },
  // Synapses & Neurotransmitters (topic 12)
  { topicSlug: "synapses-neurotransmitters", front: "What are the three parts of a chemical synapse?", back: "1) Presynaptic terminal (vesicles with NT), 2) Synaptic cleft (20–40 nm gap), 3) Postsynaptic membrane (receptors). Signal: AP → Ca²⁺ influx → vesicle fusion → NT release → receptor binding.", fact: "The SNARE complex (syntaxin, SNAP-25, synaptobrevin) mediates vesicle fusion.", order: 1 },
  { topicSlug: "synapses-neurotransmitters", front: "Name the four most important neurotransmitters and their primary roles.", back: "Glutamate: main excitatory (learning, LTP). GABA: main inhibitory (calming). ACh: NMJ + memory. Dopamine: reward + motor control. Serotonin: mood + sleep.", fact: "Too much glutamate → excitotoxicity → neuronal death.", order: 2 },
  { topicSlug: "synapses-neurotransmitters", front: "How do SSRIs work and what conditions do they treat?", back: "SSRIs (fluoxetine) block the serotonin reuptake transporter (SERT) → more 5-HT in the synaptic cleft → improved mood. Treat depression, anxiety, OCD.", fact: "SSRIs take 2–4 weeks to work because downstream gene expression changes are needed.", order: 3 },
  { topicSlug: "synapses-neurotransmitters", front: "What is Long-Term Potentiation (LTP) and why is it important?", back: "Repeated stimulation strengthens the synapse — the cellular basis of learning and memory. NMDA receptor is the coincidence detector: needs glutamate + postsynaptic depolarisation.", fact: "Hebb's rule: Neurons that fire together wire together.", order: 4 },
  { topicSlug: "synapses-neurotransmitters", front: "How does L-DOPA treat Parkinson's disease?", back: "Parkinson's = loss of dopaminergic neurons in substantia nigra. L-DOPA is a dopamine precursor that crosses the BBB → converted to dopamine → replenishes supply. Given with carbidopa (prevents peripheral conversion).", fact: "Carbidopa doesn't cross the BBB, so it only blocks peripheral L-DOPA → more reaches the brain.", order: 5 },
  // Cranial Nerves (topic 13)
  { topicSlug: "cranial-nerves", front: "List the 12 cranial nerves with their numbers and sensory/motor classification.", back: "I Olfactory (S), II Optic (S), III Oculomotor (M), IV Trochlear (M), V Trigeminal (B), VI Abducens (M), VII Facial (B), VIII Vestibulocochlear (S), IX Glossopharyngeal (B), X Vagus (B), XI Accessory (M), XII Hypoglossal (M).", fact: "\"Some Say Marry Money But My Brother Says Big Brains Matter More\" → S,S,M,M,B,M,B,S,B,B,M,M.", order: 1 },
  { topicSlug: "cranial-nerves", front: "Which mnemonic helps remember the cranial nerve names in order?", back: "\"On Old Olympus' Towering Tops, A Finn And German Viewed Some Hops\" → Olfactory, Optic, Oculomotor, Trochlear, Trigeminal, Abducens, Facial, Glossopharyngeal, Vagus, Spinal Accessory, Hypoglossal.", fact: "CN IV (Trochlear) is the only cranial nerve to exit posteriorly and fully decussate.", order: 2 },
  { topicSlug: "cranial-nerves", front: "What does the vagus nerve (X) control and why is it called 'the wanderer'?", back: "Parasympathetic supply to heart (slows HR), lungs (bronchoconstriction), GI tract (up to splenic flexure). Also: taste (epiglottis), speech (larynx muscles), gag reflex. 'Wanders' from brainstem to abdomen.", fact: "VNS (vagus nerve stimulation) is FDA-approved for drug-resistant epilepsy.", order: 3 },
  { topicSlug: "cranial-nerves", front: "How do you distinguish Bell's palsy from a stroke on examination?", back: "Bell's palsy (LMN): forehead IS affected (can't raise eyebrow). Stroke (UMN): forehead is SPARED (bilateral cortical innervation). This is the most tested cranial nerve distinction.", fact: "Bell's palsy: ~85% recover fully. Treatment: prednisolone within 72 hours.", order: 4 },
  { topicSlug: "cranial-nerves", front: "What is trigeminal neuralgia and how is it treated?", back: "Excruciating, electric-shock-like facial pain in V2/V3 distribution. Often caused by vascular compression of the nerve root. First-line treatment: carbamazepine.", fact: "The trigeminal nerve has 3 divisions: V1 (ophthalmic), V2 (maxillary), V3 (mandibular).", order: 5 },
  // Glycolysis & Gluconeogenesis (topic 15)
  { topicSlug: "glycolysis-gluconeogenesis", front: "What is the net ATP yield of glycolysis per glucose molecule?", back: "Net 2 ATP (4 ATP produced minus 2 ATP invested in the energy investment phase). Plus 2 NADH that can generate more ATP in the electron transport chain.", fact: "PFK-1 (Phosphofructokinase-1) is the rate-limiting enzyme and master regulator of glycolysis.", order: 1 },
  { topicSlug: "glycolysis-gluconeogenesis", front: "What is the rate-limiting enzyme of glycolysis and what regulates it?", back: "PFK-1 (Phosphofructokinase-1). Activated by AMP and fructose-2,6-bisphosphate. Inhibited by ATP and citrate. This is the master switch where insulin and glucagon exert control.", fact: "Fructose-2,6-bisphosphate is the most potent activator of PFK-1 and links glycolysis to hormonal control.", order: 2 },
  { topicSlug: "glycolysis-gluconeogenesis", front: "Can the human body make glucose from fatty acids? Why or why not?", back: "No. Humans lack the glyoxylate cycle enzymes (isocitrate lyase and malate synthase) that plants and bacteria use. Gluconeogenesis substrates are limited to lactate, amino acids (alanine, glutamine), glycerol, and propionate.", fact: "This is why prolonged starvation leads to muscle wasting: the body breaks down protein to make glucose for the brain.", order: 3 },
  { topicSlug: "glycolysis-gluconeogenesis", front: "What is Pyruvate Kinase Deficiency and how does it present?", back: "The most common glycolytic enzyme deficiency. RBCs depend entirely on glycolysis (no mitochondria). Without PK, they cannot make enough ATP to maintain membrane integrity -> hemolysis. Presents with jaundice, splenomegaly, and reticulocytosis.", fact: "Hereditary spherocytosis is another cause of extravascular hemolytic anemia with splenomegaly.", order: 4 },
  { topicSlug: "glycolysis-gluconeogenesis", front: "What is the Warburg Effect and why does it matter clinically?", back: "Cancer cells preferentially use glycolysis -> lactate even when oxygen is available (aerobic glycolysis). Inefficient for ATP but provides rapid building blocks for cell growth. This is exploited clinically by PET scans using 18F-FDG: tumors gobble up the radioactive glucose.", fact: "Metformin, a diabetes drug, is being studied for anti-cancer properties partly because it inhibits complex I and may counter the Warburg effect.", order: 5 },
];;
