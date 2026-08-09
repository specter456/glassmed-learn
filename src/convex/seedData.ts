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
    title: "DNA Replication",
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
];
