/**
 * Smart MediPro — Local AI Fallback
 *
 * When no AI_API_KEY is configured, the assistant falls back to this
 * knowledge base built from our own article content. Zero API calls,
 * instant answers, typing animation built into the caller.
 */

import { ARTICLES, type Article } from "@/lib/articles";

/* ------------------------------------------------------------------ */
/*  Knowledge-base entry: one searchable chunk with topic context      */
/* ------------------------------------------------------------------ */

interface KnowledgeChunk {
  topic: string;
  slug: string;
  heading: string;
  body: string;
}

/* ------------------------------------------------------------------ */
/*  Build the knowledge base from our articles                         */
/* ------------------------------------------------------------------ */

function extractChunks(articles: Article[]): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];
  for (const article of articles) {
    // Articles with tabs (e.g. Basics/In-Depth tabs)
    if (article.tabs) {
      for (const tab of article.tabs) {
        for (const section of tab.sections) {
          chunks.push({
            topic: article.title,
            slug: article.slug,
            heading: section.heading,
            body: [section.body, section.steps, section.bullets]
              .filter(Boolean)
              .flat()
              .join(" "),
          });
        }
      }
    }
    // Articles with flat sections
    for (const section of article.sections) {
      chunks.push({
        topic: article.title,
        slug: article.slug,
        heading: section.heading,
        body: [section.body, section.steps, section.bullets]
          .filter(Boolean)
          .flat()
          .join(" "),
      });
    }
  }
  return chunks;
}

const CHUNKS = extractChunks(ARTICLES);

/* ------------------------------------------------------------------ */
/*  Keyword aliases for common medical queries                         */
/* ------------------------------------------------------------------ */

const ALIASES: Record<string, string[]> = {
  heart: ["cardiac", "cardiology", "heart cycle", "cardiac cycle"],
  ecg: ["electrocardiogram", "ecg", "ekg", "qrs complex", "t wave"],
  nerve: ["neuron", "neurotransmitter", "synapse", "cranial nerve", "action potential"],
  brain: ["cerebrum", "cerebellum", "brainstem", "cranial nerve", "neuron"],
  kidney: ["renal", "nephron", "glomerulus", "filtration"],
  stomach: ["digestion", "pepsin", "gastric", "ulcer", "gastrointestinal"],
  muscle: ["contraction", "actin", "myosin", "sarcomere", "skeletal"],
  blood: ["haemoglobin", "hemoglobin", "rbc", "wbc", "platelet", "anemia", "anaemia"],
  bone: ["skeletal", "skeleton", "fracture", "calcium"],
  lung: ["respiratory", "breathing", "alveoli", "surfactant", "asthma"],
  sugar: ["glucose", "glycolysis", "diabetes", "insulin", "blood sugar"],
  energy: ["atp", "mitochondria", "krebs", "glycolysis", "electron transport"],
  dna: ["genetics", "chromosome", "replication", "gene", "rna"],
  vitamin: ["vitamin", "deficiency", "scurvy", "beriberi"],
  enzyme: ["catalyst", "substrate", "active site", "inhibition"],
  hormone: ["endocrine", "thyroid", "insulin", "cortisol", "adrenal"],
  immunity: ["immune", "antibody", "antigen", "vaccine", "white blood cell"],
  fever: ["temperature", "hypothalamus", "pyrexia", "pyrogen"],
  pain: ["analgesic", "nociceptor", "pain pathway"],
  "potassium": ["k+", "hyperkalaemia", "hypokalaemia"],
  sodium: ["na+", "hyponatraemia", "hypernatraemia"],
  calcium: ["ca2+", "parathyroid", "vitamin d", "bone"],
  oxygen: ["haemoglobin", "spo2", "pulse oximetry"],
  insulin: ["diabetes", "pancreas", "beta cell", "blood sugar", "glucose"],
  cortisol: ["stress hormone", "adrenal", "cushing", "addison"],
  adrenaline: ["epinephrine", "fight or flight", "sympathetic"],
};

/* ------------------------------------------------------------------ */
/*  Score a chunk against a user query                                 */
/* ------------------------------------------------------------------ */

function scoreChunk(chunk: KnowledgeChunk, queryWords: string[]): number {
  let score = 0;
  const topicLower = chunk.topic.toLowerCase();
  const bodyLower = chunk.body.toLowerCase();
  const headingLower = chunk.heading.toLowerCase();

  for (const word of queryWords) {
    if (topicLower.includes(word)) score += 10;
    if (headingLower.includes(word)) score += 5;
    if (bodyLower.includes(word)) score += 3;

    for (const [alias, expansions] of Object.entries(ALIASES)) {
      if (word.includes(alias) || alias.includes(word)) {
        for (const exp of expansions) {
          if (topicLower.includes(exp)) score += 4;
          if (headingLower.includes(exp)) score += 2;
          if (bodyLower.includes(exp)) score += 1;
        }
      }
    }
  }

  const matchCount = queryWords.filter(
    (w) => topicLower.includes(w) || headingLower.includes(w) || bodyLower.includes(w),
  ).length;
  score += matchCount * 2;

  return score;
}

/* ------------------------------------------------------------------ */
/*  General pattern-matched answers                                    */
/* ------------------------------------------------------------------ */

const GENERAL_ANSWERS: { patterns: string[]; answer: string }[] = [
  {
    patterns: ["hello", "hi there", "hey", "who are you", "what are you", "what can you do"],
    answer:
      "Hello! I'm **MediPro**, your medical study assistant built into GlassMed Learn.\n\nI can help you with:\n• Understanding core medical concepts (cardiac cycle, action potential, etc.)\n• Explaining mechanisms and pathways step-by-step\n• Providing clinical correlations and mnemonics\n• Clarifying definitions and terminology\n\nI draw from our course content to give you accurate, source-based answers. What would you like to study today?",
  },
  {
    patterns: ["thank", "thanks", "great job", "awesome", "perfect", "helpful"],
    answer:
      "You're welcome! Keep up the great studying — consistency is the key to mastering medicine. 💪\n\nFeel free to ask me anything else about your topics!",
  },
  {
    patterns: ["mnemonic", "memory hack", "how to remember", "memorize"],
    answer:
      "Here are some popular mnemonics from our content:\n\n• **Brachial Plexus**: \"Robert Taylor Drinks Cold Beer\" (Roots → Trunks → Divisions → Cords → Branches)\n• **Cranial Nerves**: \"On Old Olympus' Towering Tops, A Finn And German Viewed Some Hops\"\n• **Sensory/Motor**: \"Some Say Marry Money But My Brother Says Big Brains Matter More\" → S,S,M,M,B,M,B,S,B,B,M,M\n• **Krebs Cycle**: \"Citrate Is Succinyl-CoA's Substrate — First Make Oxaloacetate\"\n• **Glycolysis regulation**: \"Good Friends Prefer Pizza Tonight\" (Glucokinase, PFK-1, Pyruvate Kinase)\n• **Cranial Nerve 10 (Vagus)**: Remember it's the \"Wanderer\" — parasympathetic supply from brainstem to abdomen.\n\nWould you like me to explain any of these in detail?",
  },
  {
    patterns: ["exam tips", "how to study", "study strategy", "revision tips", "exam prep"],
    answer:
      "Here are evidence-based study tips for medical students:\n\n1. **Spaced Repetition**: Use the Flashcards section — it schedules reviews right before you forget (1-3-7 day ladder).\n2. **Active Recall**: Don't just re-read — close the book and try to explain the concept out loud.\n3. **Feynman Technique**: Explain it to someone else (or pretend to). If you can't explain it simply, you don't understand it yet.\n4. **Practice Questions**: After reading a topic, test yourself with clinical scenarios (check out the Game section!).\n5. **Connect Concepts**: Link basic science to clinical applications — it makes everything stick.\n\nThe Basics-First Path on the dashboard gives you the strongest foundation. Start there!",
  },
];

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export interface SmartAiResponse {
  content: string;
  sourceTopics?: string[];
}

/**
 * Generate an answer from the local knowledge base.
 * Returns null only if the query is completely empty.
 */
export function smartAiAnswer(query: string): SmartAiResponse {
  const queryLower = query.toLowerCase().trim();

  // 1. Check general pattern matches
  for (const entry of GENERAL_ANSWERS) {
    if (entry.patterns.some((p) => queryLower.includes(p))) {
      return { content: entry.answer };
    }
  }

  // 2. Tokenize the query
  const words = queryLower
    .replace(/[?!.:,;()]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);

  if (words.length === 0) {
    return {
      content:
        "Could you rephrase your question? I can help with topics like cardiac cycle, action potential, brachial plexus, Krebs cycle, and more.",
    };
  }

  // 3. Score all chunks
  const scored = CHUNKS.map((chunk) => ({ chunk, score: scoreChunk(chunk, words) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return {
      content:
        "I don't have a specific answer for that in my knowledge base yet, but I can help with:\n\n" +
        "• **Cardiac Cycle** — heart chambers, valves, pressure changes\n" +
        "• **Action Potential** — depolarization, repolarization, sodium/potassium\n" +
        "• **Brachial Plexus** — roots, trunks, cords, branches\n" +
        "• **Krebs Cycle** — mitochondrial energy production\n" +
        "• **Muscle Contraction** — actin, myosin, sliding filament\n" +
        "• **Respiratory Mechanics** — breathing, Boyle's law, gas exchange\n" +
        "• **Renal Physiology** — filtration, RAAS, nephron\n" +
        "• **Digestive System** — enzymes, peristalsis, absorption\n" +
        "• **Endocrine System** — hormones, feedback loops\n" +
        "• **Blood & Immunity** — clotting, antibodies, blood types\n" +
        "• **DNA Replication** — helicase, polymerase, leading/lagging strand\n" +
        "• **Synapses & Neurotransmitters** — dopamine, serotonin, GABA\n" +
        "• **Cranial Nerves** — I to XII, functions, mnemonics\n" +
        "• **Glycolysis** — ATP yield, regulation, anaerobic vs aerobic\n\n" +
        "Try asking something like: \"What is the cardiac cycle?\" or \"Explain the Krebs cycle\"",
      sourceTopics: [],
    };
  }

  // 4. Pick top chunks and compose answer
  const topChunks = scored.slice(0, 3);
  const sourceTopics = [...new Set(topChunks.map((s) => s.chunk.topic))];

  let answer = "";
  for (const { chunk } of topChunks) {
    answer += `**${chunk.heading}** _(${chunk.topic})_\n\n`;
    const body = chunk.body;
    answer += body.length > 500 ? body.slice(0, 500).trim() + "…" : body;
    answer += "\n\n";
  }

  answer +=
    "_💡 From GlassMed's knowledge base. For more detail, open the full article in the Basics section._";

  return { content: answer.trim(), sourceTopics };
}
