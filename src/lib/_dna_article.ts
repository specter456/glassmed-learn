  // ---- Genetics ----
  {
    slug: "dna-replication",
    title: "DNA Replication & The Central Dogma",
    emoji: "🧬",
    category: "Genetics",
    summary:
      "Every cell in your body carries 3 billion base pairs of DNA — and copies them all with astonishing accuracy every time it divides. Master the Central Dogma, the replication machinery, and the clinical consequences when it goes wrong.",
    readMinutes: 9,
    tabs: [
      {
        id: "basics",
        label: "Basics",
        icon: "📖",
        sections: [
          {
            heading: "What is DNA?",
            body: [
              "DNA (deoxyribonucleic acid) is the molecule of heredity — it stores the instructions for building every protein in your body. Think of it as a **3-billion-letter instruction manual** that gets photocopied every time a cell divides.",
              "The structure is the famous **double helix**: two antiparallel strands wound around each other, like a twisted ladder. The rails are sugar-phosphate backbones; the rungs are **base pairs** held together by hydrogen bonds.",
            ],
            bullets: [
              "**Adenine (A)** pairs with **Thymine (T)** — 2 hydrogen bonds.",
              "**Guanine (G)** pairs with **Cytosine (C)** — 3 hydrogen bonds (stronger).",
              "Each strand runs **5' → 3'** (the direction of synthesis), but the two strands are **antiparallel** — one runs 5'→3', the other 3'→5'.",
              "One complete set of DNA = 46 chromosomes (23 pairs) = ~3.2 billion base pairs = ~20,000–25,000 genes.",
            ],
          },
          {
            heading: "The Central Dogma",
            body: [
              "The **Central Dogma of Molecular Biology** (Francis Crick, 1958) describes the flow of genetic information:",
            ],
            bullets: [
              "**DNA → RNA → Protein**",
              "**Replication**: DNA makes a copy of itself (DNA → DNA). Happens before cell division.",
              "**Transcription**: DNA is copied into messenger RNA (DNA → mRNA). Happens in the nucleus.",
              "**Translation**: mRNA is read by ribosomes to build a protein (mRNA → Protein). Happens in the cytoplasm.",
              "In short: DNA holds the master plan → mRNA is the working copy → Protein does the actual work.",
            ],
            callout: {
              kind: "tip",
              title: "Memory Hook",
              text: "Central Dogma = \"DNA makes RNA makes Protein.\" Think: D-R-P = \"Do Restaurants Prepare\" food — the kitchen (DNA) writes the recipe (RNA) for the waiter (Protein) to serve.",
            },
          },
          {
            heading: "Transcription (Simplified)",
            body: [
              "Transcription = copying a gene from DNA into mRNA. It happens in the **nucleus**.",
            ],
            bullets: [
              "**RNA Polymerase** binds to the **promoter** region of a gene.",
              "It unwinds the DNA and reads the **template strand** (3'→5').",
              "It builds the mRNA in the **5'→3' direction** using complementary bases (A→U, T→A, G→C, C→G).",
              "The mRNA is then **processed** (5' cap, poly-A tail, intron splicing) and exported to the cytoplasm.",
            ],
          },
          {
            heading: "Translation (Simplified)",
            body: [
              "Translation = reading mRNA to build a protein. It happens on **ribosomes** in the cytoplasm (or rough ER).",
            ],
            bullets: [
              "Every 3 bases on mRNA = one **codon** = one amino acid. There are 64 codons coding for 20 amino acids + stop signals.",
              "**tRNA** molecules bring the matching amino acid to the ribosome (the anticodon on tRNA pairs with the codon on mRNA).",
              "The ribosome links amino acids together into a **polypeptide chain** until it hits a **stop codon** (UAA, UAG, or UGA).",
              "The protein then folds into its 3D shape and goes to work.",
            ],
          },
          {
            heading: "Memory Hooks",
            body: [
              "The Central Dogma: **DNA → RNA → Protein**. Information flows one way (with exceptions like reverse transcriptase in retroviruses).",
              "Base pairing: **A-T** (2 bonds), **G-C** (3 bonds). Think: \"**A**pples in **T**rees, **G**rass in **C**ompound.\"",
              "Codons: **AUG** = Start (methionine). **UAA, UAG, UGA** = Stop. Think: \"**U** **A**re **A**ll **U**nique **A**nd **G**reat.\"",
            ],
          },
        ],
        keyPoints: [
          "DNA: double helix, antiparallel strands, A-T and G-C base pairs.",
          "Central Dogma: DNA → RNA → Protein (replication, transcription, translation).",
          "Transcription: RNA polymerase reads DNA template, builds mRNA 5'→3'.",
          "Translation: ribosomes read mRNA codons (3 bases = 1 amino acid) via tRNA.",
        ],
      },
      {
        id: "in-depth",
        label: "In-Depth",
        icon: "🔬",
        sections: [
          {
            heading: "DNA Replication — The Full Process",
            body: [
              "DNA replication is **semi-conservative**: each new double helix keeps one old strand and builds one new one. This was proven by the **Meselson-Stahl experiment** (1958) using heavy nitrogen (¹⁵N).",
              "Replication happens at structures called **replication forks** — Y-shaped regions where the double helix is being unwound. A human chromosome can have **multiple origins of replication** firing simultaneously.",
            ],
            steps: [
              "**1. Initiation — ORC and Licensing**: The Origin Recognition Complex (ORC) binds to origins of replication. During G1 phase, the MCM helicase is loaded onto DNA (licensing). In S phase, CDK and DDK kinases activate the helicase.",
              "**2. Unwinding — Helicase**: The **MCM2-7 helicase** (in eukaryotes) or **DnaB helicase** (in bacteria) uses ATP to unwind the double helix, creating the replication fork. **Single-strand binding proteins (SSB/RPA)** stabilize the unwound single strands and prevent re-annealing.",
              "**3. Priming — Primase**: DNA polymerase cannot start from scratch — it needs a 3'-OH group. **Primase** (DnaG in bacteria) synthesises a short **RNA primer** (10–12 nucleotides) to provide this starting point.",
              "**4. Elongation — DNA Polymerase III (bacteria) / Pol ε and Pol δ (eukaryotes)**: The polymerase adds nucleotides to the 3' end of the primer, reading the template 3'→5' and synthesising 5'→3'. It has **proofreading** ability: 3'→5' exonuclease activity removes mismatched bases.",
              "**5. Leading vs Lagging Strand**: The **leading strand** is synthesised continuously toward the fork. The **lagging strand** is synthesised **away from the fork** in short discontinuous pieces called **Okazaki fragments** (100–200 bp in eukaryotes, 1000–2000 in bacteria).",
              "**6. Primer Removal and Joining**: **RNase H** or **FEN1** removes RNA primers. **DNA Polymerase δ** fills the gaps. **DNA Ligase** seals the nicks between Okazaki fragments by forming phosphodiester bonds.",
              "**7. Termination**: Replication forks meet and merge. In eukaryotes, the **end-replication problem** means chromosome ends (telomeres) shorten with each division. **Telomerase** (active in stem cells and cancer) extends telomeres using its own RNA template.",
            ],
          },
          {
            heading: "Leading vs Lagging Strand — Why the Difference?",
            body: [
              "DNA polymerase can ONLY synthesise in the **5'→3' direction**. But the two template strands run antiparallel.",
            ],
            bullets: [
              "**Leading strand**: Template runs 3'→5' toward the fork → polymerase follows the fork continuously. ONE primer, ONE long piece.",
              "**Lagging strand**: Template runs 5'→3' toward the fork → polymerase must work AWAY from the fork in short bursts. Multiple primers, multiple Okazaki fragments, all stitched together by ligase.",
              "Think of it like two people painting a wall from the same starting point but in opposite directions — one can paint continuously, the other must keep repositioning.",
            ],
            callout: {
              kind: "tip",
              title: "Exam Tip",
              text: "Leading = continuous, ONE primer. Lagging = discontinuous (Okazaki fragments), MANY primers. Both use the same polymerase — it's the template orientation that forces the difference.",
            },
          },
          {
            heading: "Replication Fidelity — Three Layers of Error Correction",
            body: [
              "The error rate after all three layers is approximately **1 error per 10⁹–10¹⁰ base pairs** — astonishingly accurate for a process that copies 6.4 billion bases per cell division.",
            ],
            bullets: [
              "**Layer 1 — Base Selection**: DNA polymerase's active site geometrically favours correct Watson-Crick pairs. Wrong pairs don't fit. Error rate: ~1 in 10⁵.",
              "**Layer 2 — Proofreading**: The 3'→5' exonuclease domain of the polymerase detects and removes mismatched bases immediately. Error rate drops to ~1 in 10⁷.",
              "**Layer 3 — Mismatch Repair (MMR)**: Post-replication surveillance system (MutS/MutL in bacteria; **hMSH2/hMLH1** in humans) scans for mismatches, excises the error, and resynthesises correctly. Error rate drops to ~1 in 10⁹–10¹⁰.",
            ],
          },
          {
            heading: "Clinical Relevance",
            bullets: [
              "**Lynch Syndrome (HNPCC)**: Inherited deficiency in mismatch repair genes (hMLH1, hMSH2). Leads to microsatellite instability and dramatically increased risk of colorectal, endometrial, and ovarian cancer. Diagnosed by microsatellite instability (MSI) testing or immunohistochemistry for MMR proteins.",
              "**Cancer and Telomerase**: Most somatic cells lack telomerase → telomeres shorten → cells eventually enter senescence (Hayflick limit). Cancer cells reactivate **telomerase** (or use ALT pathway) to achieve replicative immortality. Telomerase is a therapeutic target.",
              "**PCR (Polymerase Chain Reaction)**: Exploits the replication machinery in vitro. Denaturation (95°C) → Annealing (55–65°C) → Extension (72°C). Uses **Taq polymerase** (thermostable, from Thermus aquaticus). Foundation of COVID testing, forensic DNA, and genetic diagnosis.",
              "**Mutations**: Single nucleotide changes (point mutations) can be silent (no amino acid change), missense (wrong amino acid), or nonsense (premature stop codon). Frameshift mutations (insertions/deletions not in multiples of 3) are often catastrophic.",
              "**Sickle Cell Disease**: A single point mutation (GAG → GTG) in the β-globin gene changes glutamic acid to valine at position 6. This causes haemoglobin S to polymerise under low oxygen, distorting RBCs into a sickle shape.",
            ],
            callout: {
              kind: "warning",
              title: "NEET/MBBS Exam Classics",
              text: "Semi-conservative replication (Meselson-Stahl). Leading = continuous, Lagging = Okazaki fragments. Telomerase = cancer immortality. PCR steps: Denature → Anneal → Extend. Mismatch repair deficiency = Lynch syndrome = colorectal cancer.",
            },
          },
        ],
        keyPoints: [
          "Semi-conservative: each new DNA keeps one old strand, builds one new one.",
          "Leading strand = continuous; Lagging strand = Okazaki fragments + ligase.",
          "Three fidelity layers: base selection + proofreading + mismatch repair.",
          "Telomerase enables cancer immortality; PCR exploits replication in vitro.",
        ],
      },
    ],
    sections: [],
    keyPoints: [
      "DNA: double helix, A-T (2 bonds), G-C (3 bonds), antiparallel strands.",
      "Central Dogma: DNA → RNA → Protein.",
      "Leading strand: continuous. Lagging strand: Okazaki fragments joined by ligase.",
      "Mismatch repair deficiency → Lynch syndrome → colorectal cancer.",
    ],
    whenToCall: [],
  },