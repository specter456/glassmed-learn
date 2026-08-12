import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Flame,
  Gamepad2,
  Heart,
  Medal,
  Play,
  RotateCcw,
  Siren,
  Skull,
  Sparkles,
  Star,
  Trophy,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import {
  ConfettiBurst,
  Mascot,
  QUIZ_PRAISE,
  ROUND_COMPLETE_TITLES,
  pickMessage,
} from "@/components/Celebration";
import { GlassBackdrop } from "@/components/GlassBackdrop";
import { QueryErrorBoundary } from "@/components/QueryErrorBoundary";
import { Button } from "@/components/ui/button";
import {
  levelFromXp,
  rankTitle,
  savePoints,
  shuffle,
  shuffleOptions,
  xpProgress,
} from "@/lib/medipro";

/* ----------------------------- data -------------------------------- */

interface Scenario {
  id: string;
  name: string;
  emoji: string;
  savedEmoji: string;
  patient: string;
  state: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  praise: string;
  sarcasm: string;
  proTip: string;
}

/** One shift = one run. All first-aid steps are guideline-accurate. */
const SCENARIOS: Scenario[] = [
  {
    id: "choking",
    name: "The Nacho Incident",
    emoji: "😱",
    savedEmoji: "😮‍💨",
    patient: "Your roommate",
    state: "TURNING PURPLE",
    prompt:
      "Your roommate inhaled a nacho. They're grabbing their throat and pointing at the cheese like it's a crime scene. What do you do?",
    options: [
      "Give 5 back blows, then 5 abdominal thrusts (Heimlich)",
      "Slap them on the back once and shrug",
      "Hand them a glass of water",
      "Start filming for the group chat",
    ],
    correctIndex: 0,
    praise:
      "Clean save! Back blows, then abdominal thrusts — the classic “please eject the nacho” maneuver.",
    sarcasm:
      "Water doesn't un-stick a nacho, and the group chat can't Heimlich anyone. Back blows, then abdominal thrusts. Now.",
    proTip:
      "For a choking adult: alternate 5 back blows and 5 abdominal thrusts until the airway clears — call emergency services if they go unconscious.",
  },
  {
    id: "cardiac",
    name: "The Mid-Bicep-Curl Collapse",
    emoji: "😵",
    savedEmoji: "🫡",
    patient: "Your gym buddy",
    state: "NO PULSE",
    prompt:
      "Your gym buddy collapses mid-bicep-curl. No response, no breathing. The treadmill keeps running like nothing happened. What's your move?",
    options: [
      "Call for help, start chest compressions (100–120/min), get an AED",
      "Give them a protein shake and a pep talk",
      "Slap them until they wake up",
      "Fan them with a towel and wait",
    ],
    correctIndex: 0,
    praise:
      "Textbook! Compressions before compliments — you just bought them a real chance.",
    sarcasm:
      "A protein shake isn't a defibrillator. Push hard and fast in the center of the chest, 100–120 per minute, and grab an AED.",
    proTip:
      "Hands-only CPR: push hard and fast in the center of the chest (~100–120 compressions/min). Send someone for an AED and call emergency services.",
  },
  {
    id: "bleeding",
    name: "The Jar-Lid Massacre",
    emoji: "🩸",
    savedEmoji: "😌",
    patient: "Your little brother",
    state: "DRAMATIC BLEEDING",
    prompt:
      "Your little brother sliced his hand open on a jar lid. Blood is doing that slow, dramatic movie crawl down his arm. He's fine. He's just also screaming. What do you do?",
    options: [
      "Apply firm, direct pressure with a clean cloth and elevate",
      "Pour turmeric on it (it's what grandma would do)",
      "Wrap it so tight his fingers turn blue",
      "Ask him to hold still while you Google it",
    ],
    correctIndex: 0,
    praise:
      "Direct pressure, no dramatics. You're basically an ER nurse now — don't let it go to your head.",
    sarcasm:
      "Turmeric is for cooking, not clotting. Firm, direct pressure with a clean cloth, then elevate. That's the whole secret.",
    proTip:
      "Firm, direct pressure with a clean cloth stops most bleeding. If it soaks through, add another layer — don't remove the first. Call emergency services for severe bleeds.",
  },
  {
    id: "burn",
    name: "The Canteen Tray Incident",
    emoji: "🥵",
    savedEmoji: "😅",
    patient: "You (yes, you)",
    state: "STINGING HAND",
    prompt:
      "You grabbed a hot tray in the canteen like a hero. Now your palm is red, stinging, and very personally offended. What do you do?",
    options: [
      "Cool it under running water for 10–20 minutes",
      "Press ice straight onto the burn",
      "Butter it. You heard it somewhere. It feels wrong.",
      "Pop the blister for a clean look",
    ],
    correctIndex: 0,
    praise:
      "Cool running water — the burn's kryptonite. Your palm already feels better, doesn't it?",
    sarcasm:
      "Ice directly on a burn? That's how you get frostbite on top of a burn. And please never butter a burn. Running water, 10–20 minutes.",
    proTip:
      "Cool a burn under running water for 10–20 minutes. No ice, no butter, no popping blisters — cover loosely with a clean cloth.",
  },
  {
    id: "faint",
    name: "The Statue of Liberty",
    emoji: "🧍",
    savedEmoji: "😪",
    patient: "Your friend",
    state: "FULL STATUE",
    prompt:
      "Your friend stood up too fast and went full statue — eyes rolled, knees gone, floor gained. They're breathing, just… visiting the ceiling. What do you do?",
    options: [
      "Lay them flat, elevate their legs, and check breathing",
      "Hold them upright and shake them awake",
      "Splash water on their face for the cinematic effect",
      "Feed them a biscuit while they're out cold",
    ],
    correctIndex: 0,
    praise:
      "Lay flat, legs up, problem solved. You just handled a syncope like a senior resident.",
    sarcasm:
      "Splash water? Were you trying to wake a cat? Lay them flat, elevate the legs, and let gravity do the doctoring.",
    proTip:
      "For fainting (syncope): lay the person flat, raise their legs to restore blood flow, and loosen tight clothing. Call emergency services if they don't wake quickly.",
  },
  {
    id: "anaphylaxis",
    name: "The Secret Peanut",
    emoji: "🥴",
    savedEmoji: "😮‍💨",
    patient: "Your cousin",
    state: "SWELLING FAST",
    prompt:
      "Your cousin ate a “secret ingredient” peanut cookie at a party. Now they have hives, their lips are puffing up, and they're wheezing. They carry an epi-pen. What do you do?",
    options: [
      "Use their epinephrine auto-injector and call emergency services",
      "Give them a glass of milk to wash it down",
      "Make them throw up the cookie",
      "Wait and see — allergies are a vibe",
    ],
    correctIndex: 0,
    praise:
      "Epi-pen, no hesitation. That's the difference between a story and a headline.",
    sarcasm:
      "Milk isn't an antidote — that's just a snack with extra steps. Use the epi-pen, call emergency services, and skip the “wait and see” strategy.",
    proTip:
      "Anaphylaxis is a medical emergency: use the auto-injector immediately (outer thigh), call emergency services, and lie them flat with legs raised.",
  },
  {
    id: "seizure",
    name: "The Library Seizure",
    emoji: "⚡",
    savedEmoji: "😴",
    patient: "Your classmate",
    state: "SEIZING",
    prompt:
      "Your classmate starts seizing in the library. Books are flying like it's a scene from a medical drama. What do you do?",
    options: [
      "Protect their head, clear hazards, time the seizure, don't restrain",
      "Hold them down so they don't hurt themselves",
      "Put a spoon in their mouth (classic, right?)",
      "Offer them water when you see the chance",
    ],
    correctIndex: 0,
    praise:
      "Clear the area, cushion the head, count the seconds. Textbook. The library thanks you.",
    sarcasm:
      "A spoon in the mouth is how you get broken teeth. Never restrain, never feed — protect the head, clear the area, and time it.",
    proTip:
      "During a seizure: cushion the head, move hazards away, never restrain or put anything in the mouth, and time it — call emergency services if it lasts more than 5 minutes.",
  },
  {
    id: "hypoglycemia",
    name: "The Skipped-Breakfast Meltdown",
    emoji: "🥶",
    savedEmoji: "🙂",
    patient: "Your study partner",
    state: "SHAKY & SWEATY",
    prompt:
      "Your study partner is shaky, sweaty, and squinting at flashcards like they're in hieroglyphs. They skipped breakfast. Again. What do you do?",
    options: [
      "Give fast-acting sugar — juice or glucose tabs — and check after 15 min",
      "Give them insulin. They're diabetic, right?",
      "A double espresso — caffeine fixes everything",
      "Have them do push-ups to burn off the drama",
    ],
    correctIndex: 0,
    praise:
      "Fast sugar, then reassess. You just averted a hangry meltdown and a hospital trip in one move.",
    sarcasm:
      "Insulin?! That's the one thing you never hand a shaky diabetic — you'd tank their sugar further. Juice or glucose tabs, then check again in 15 minutes.",
    proTip:
      "For hypoglycemia: give fast-acting sugar (juice, glucose tabs), then recheck in ~15 minutes. If still low or unconscious, call emergency services.",
  },
];

/* ------------------------- persistence ----------------------------- */

const KEY_LEVEL = "medipro-firstaid-level";
const KEY_XP = "medipro-firstaid-xp";
const KEY_HIGH = "medipro-firstaid-highscore";

interface SavedStats {
  level: number;
  xp: number;
  highScore: number;
}

function loadStats(): SavedStats {
  try {
    return {
      level: Number(localStorage.getItem(KEY_LEVEL)) || 1,
      xp: Number(localStorage.getItem(KEY_XP)) || 0,
      highScore: Number(localStorage.getItem(KEY_HIGH)) || 0,
    };
  } catch {
    return { level: 1, xp: 0, highScore: 0 };
  }
}

function saveStats(s: SavedStats): void {
  try {
    localStorage.setItem(KEY_LEVEL, String(s.level));
    localStorage.setItem(KEY_XP, String(s.xp));
    localStorage.setItem(KEY_HIGH, String(s.highScore));
  } catch {
    /* storage unavailable — progress just won't persist */
  }
}

/* ---------------------------- helpers ------------------------------ */

interface Outcome {
  wrong: boolean;
  points: number;
  chosen: string;
}

interface RunResult {
  score: number;
  saves: number;
  fails: number;
  bestCombo: number;
  newHigh: boolean;
  patientLost: boolean;
}

const MAX_LIVES = 3;
const ADVANCE_MS = 1900;

/* ------------------------------ lobby ------------------------------ */

function GameLobby({
  stats,
  onStart,
}: {
  stats: SavedStats;
  onStart: () => void;
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-32 pt-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <span className="tech-label">The game · first aid simulator</span>
        <h1 className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-wistaria sm:text-4xl">
          Save the day, one snack emergency at a time
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          Real emergencies, real first aid, zero mercy. Read the scene, pick the
          right move, and keep your patient breathing long enough to be grateful.
        </p>
      </motion.div>

      {/* stats card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="glass-strong shine mt-8 flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center"
      >
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#e896b4]/15 text-[#d96a8f]">
          <Medal className="size-7" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-extrabold tracking-tight">
              Level {stats.level}
            </p>
            <p className="text-sm font-bold text-wistaria">
              {rankTitle(stats.level)}
            </p>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#78A2D2] to-[#a2a2d0]"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress(stats.xp) * 100}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <p className="mt-1.5 text-[11px] font-semibold text-muted-foreground">
            {stats.xp.toLocaleString()} XP · {Math.round(xpProgress(stats.xp) * 100)}% to
            the next rank
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-2xl bg-white/5 px-4 py-3">
          <Star className="size-4 text-[#e0a458]" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              High score
            </p>
            <p className="text-lg font-extrabold tabular-nums">
              {stats.highScore.toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>

      {/* start */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.16 }}
        className="mt-8 text-center"
      >
        <Button
          onClick={onStart}
          className="h-14 gap-2.5 rounded-2xl px-10 text-base font-extrabold shadow-lg shadow-[#78A2D2]/20"
        >
          <Siren className="size-5" />
          Start the shift
        </Button>
        <p className="mt-2 text-[11px] font-semibold text-muted-foreground">
          {SCENARIOS.length} emergency shifts · 3 lives · 1 legend
        </p>
      </motion.div>

      {/* how to play */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.22 }}
        className="glass-panel mt-8 rounded-3xl p-6"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-wistaria">
          How the shift works
        </p>
        <ul className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
          {[
            ["Read the scene, pick the right first-aid move.", "Correct saves earn points — streak saves earn combo bonuses."],
            ["Wrong moves cost a life.", "Three lives, then the shift is over and the squad will never speak of it."],
            ["Every save earns XP.", "Level up to climb the ranks — from Band-Aid Apprentice to Legend of the ER."],
            ["Every scenario ends with a pro tip.", "It's basically free revision wearing a hero costume."],
          ].map(([title, desc]) => (
            <li key={title} className="flex gap-2.5">
              <Gamepad2 className="mt-0.5 size-4 shrink-0 text-wistaria" />
              <span>
                <span className="font-bold">{title}</span>{" "}
                <span className="text-muted-foreground">{desc}</span>
              </span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* tonight's lineup */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.28 }}
        className="mt-8"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-wistaria">
          Tonight's emergency lineup
        </p>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {SCENARIOS.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.3 + i * 0.04 }}
              className="glass-chip flex items-center gap-3 rounded-2xl px-4 py-3"
            >
              <span className="text-xl">{s.emoji}</span>
              <span className="min-w-0 flex-1 truncate text-sm font-bold">
                {s.name}
              </span>
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Shift {i + 1}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}

/* --------------------------- countdown ----------------------------- */

function Countdown({ count }: { count: number }) {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 text-center sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-wistaria">
        Get ready
      </p>
      <motion.p
        key={count}
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="mt-4 text-8xl font-extrabold tracking-tight text-wistaria"
      >
        {count > 0 ? count : "GO!"}
      </motion.p>
    </main>
  );
}

/* --------------------------- mission ------------------------------- */

function Mission({
  scenarios,
  stats,
  onFinish,
}: {
  scenarios: Scenario[];
  stats: SavedStats;
  onFinish: (result: RunResult, progress: { level: number; xp: number }) => void;
}) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [saves, setSaves] = useState(0);
  const [fails, setFails] = useState(0);
  const [xp, setXp] = useState(stats.xp);
  const [level, setLevel] = useState(stats.level);
  const [answered, setAnswered] = useState<Outcome | null>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const [levelUpTo, setLevelUpTo] = useState<number | null>(null);

  const scenario = scenarios[index];
  const total = scenarios.length;
  const last = index + 1 >= total;

  const answer = (optionIndex: number) => {
    if (answered || !scenario) return;
    const wrong = optionIndex !== scenario.correctIndex;
    const chosen = scenario.options[optionIndex];
    if (wrong) {
      setCombo(0);
      setLives((l) => Math.max(0, l - 1));
      setFails((f) => f + 1);
      setShakeKey((k) => k + 1);
      setAnswered({ wrong: true, points: 0, chosen });
    } else {
      const nextCombo = combo + 1;
      const pts = savePoints(nextCombo);
      const totalXp = xp + pts;
      const newLevel = levelFromXp(totalXp);
      setCombo(nextCombo);
      setBestCombo((b) => Math.max(b, nextCombo));
      setScore((s) => s + pts);
      setSaves((s) => s + 1);
      setXp(totalXp);
      setLevel(newLevel);
      if (newLevel > level) setLevelUpTo(newLevel);
      setAnswered({ wrong: false, points: pts, chosen });
    }
  };

  const finish = () => {
    onFinish(
      {
        score,
        saves,
        fails,
        bestCombo,
        newHigh: false,
        patientLost: lives <= 0,
      },
      { level, xp },
    );
  };

  // Auto-advance after the feedback moment (paused while the level-up
  // overlay is up). All state changes happen inside the timeout callback.
  useEffect(() => {
    if (!answered || levelUpTo !== null) return;
    const t = setTimeout(() => {
      if ((answered.wrong && lives <= 0) || last) {
        finish();
      } else {
        setIndex((i) => i + 1);
        setAnswered(null);
      }
    }, ADVANCE_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answered, levelUpTo, lives, last]);

  // Auto-dismiss the level-up overlay.
  useEffect(() => {
    if (levelUpTo === null) return;
    const t = setTimeout(() => setLevelUpTo(null), 2400);
    return () => clearTimeout(t);
  }, [levelUpTo]);

  if (!scenario) return null;

  return (
    <main className="relative mx-auto max-w-3xl px-4 pb-32 pt-6 sm:px-6">
      {/* HUD */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-wistaria">
            The golden hour
          </p>
          <p className="text-sm font-extrabold">
            Shift {index + 1}
            <span className="text-muted-foreground"> / {total}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* lives */}
          <div className="flex items-center gap-0.5 rounded-full bg-white/5 px-2.5 py-1.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{
                  scale: i < lives ? 1 : 0.8,
                  opacity: i < lives ? 1 : 0.25,
                }}
                transition={{ duration: 0.25 }}
              >
                <Heart
                  className={
                    i < lives
                      ? "size-4 fill-[#e2666f] text-[#e2666f]"
                      : "size-4 text-muted-foreground/40"
                  }
                />
              </motion.span>
            ))}
          </div>
          {/* combo */}
          {combo >= 2 && (
            <motion.span
              key={combo}
              initial={{ scale: 1.4 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 rounded-full bg-[#e896b4]/15 px-2.5 py-1.5 text-[11px] font-extrabold text-[#d96a8f]"
            >
              <Flame className="size-3.5" />
              x{combo}
            </motion.span>
          )}
          {/* score */}
          <div className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5">
            <motion.span
              key={score}
              initial={{ scale: 1.35, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-sm font-extrabold tabular-nums text-[#78A2D2]"
            >
              {score.toLocaleString()}
            </motion.span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              pts
            </span>
          </div>
        </div>
      </div>

      {/* XP bar */}
      <div className="mt-3 flex items-center gap-2.5">
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Lv {level}
        </span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#78A2D2] to-[#a2a2d0]"
            animate={{ width: `${xpProgress(xp) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="shrink-0 text-[10px] font-bold text-wistaria">
          {rankTitle(level)}
        </span>
      </div>

      {/* scenario card (shakes on a wrong call) */}
      <motion.div
        key={`${scenario.id}-${shakeKey}`}
        initial={{ opacity: 0, y: 16 }}
        animate={{
          opacity: 1,
          y: 0,
          x: answered?.wrong ? [0, -10, 10, -7, 7, -3, 0] : 0,
        }}
        transition={{ duration: answered?.wrong ? 0.45 : 0.4 }}
        className={`glass-panel relative mt-4 overflow-hidden rounded-3xl p-6 sm:p-8 ${
          answered && !answered.wrong ? "border-[#6fb5b0]/40" : ""
        } ${answered?.wrong ? "border-[#e2666f]/40" : ""}`}
      >
        {answered && !answered.wrong && <ConfettiBurst />}

        <div className="flex items-center gap-4">
          <motion.div
            key={answered ? (answered.wrong ? scenario.emoji : scenario.savedEmoji) : scenario.emoji}
            initial={{ scale: 0.6 }}
            animate={{ scale: 1, rotate: answered ? [0, -6, 6, 0] : 0 }}
            transition={{ duration: 0.4 }}
            className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-4xl"
          >
            {answered ? (answered.wrong ? scenario.emoji : scenario.savedEmoji) : scenario.emoji}
          </motion.div>
          <div className="min-w-0">
            <p className="text-sm font-extrabold">{scenario.patient}</p>
            <span
              className={`mt-1 inline-block rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${
                answered && !answered.wrong
                  ? "bg-[#6fb5b0]/15 text-[#7fd0c9]"
                  : "bg-[#e2666f]/12 text-[#e2666f]"
              }`}
            >
              {answered && !answered.wrong ? "SAVED!" : scenario.state}
            </span>
          </div>
        </div>

        <p className="mt-5 text-balance text-lg font-semibold leading-relaxed sm:text-xl">
          {scenario.prompt}
        </p>

        {/* options */}
        <div className="mt-6 space-y-2.5">
          {scenario.options.map((o, i) => {
            const isCorrect = i === scenario.correctIndex;
            const showCorrect = answered !== null && isCorrect;
            const showWrong = answered !== null && answered.chosen === o && !isCorrect;
            const dimmed = answered !== null && !showCorrect && !showWrong;
            return (
              <motion.button
                key={o}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                disabled={answered !== null}
                onClick={() => answer(i)}
                className={`flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-left text-sm font-semibold transition-all ${
                  showCorrect
                    ? "border-[#6fb5b0]/60 bg-[#6fb5b0]/15 text-[#7fd0c9]"
                    : showWrong
                      ? "border-[#e2666f]/60 bg-[#e2666f]/15 text-[#ef8b93]"
                      : dimmed
                        ? "border-white/5 opacity-40"
                        : "glass-chip border-white/10 hover:-translate-y-0.5 hover:border-white/25"
                }`}
              >
                <span>{o}</span>
                {showCorrect ? (
                  <Check className="size-4 shrink-0 text-[#6fb5b0]" />
                ) : showWrong ? (
                  <X className="size-4 shrink-0 text-[#e2666f]" />
                ) : null}
              </motion.button>
            );
          })}
        </div>

        {/* feedback */}
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-5"
          >
            <div className="h-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                key={shakeKey}
                className="h-full rounded-full bg-wistaria"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: ADVANCE_MS / 1000, ease: "linear" }}
              />
            </div>

            <div
              className={`mt-4 flex items-start gap-3 rounded-2xl border p-4 ${
                answered.wrong
                  ? "border-[#e2666f]/30 bg-[#e2666f]/10"
                  : "border-[#6fb5b0]/30 bg-[#6fb5b0]/10"
              }`}
            >
              <div
                className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
                  answered.wrong ? "bg-[#e2666f]/15 text-[#e2666f]" : "bg-[#6fb5b0]/15 text-[#6fb5b0]"
                }`}
              >
                {answered.wrong ? (
                  <Skull className="size-4" />
                ) : (
                  <Check className="size-4" />
                )}
              </div>
              <div className="min-w-0">
                <p
                  className={`text-sm font-extrabold ${
                    answered.wrong ? "text-[#ef8b93]" : "text-[#7fd0c9]"
                  }`}
                >
                  {answered.wrong
                    ? `Not great, not terrible. ${answered.points} pts.`
                    : `${pickMessage(QUIZ_PRAISE, saves)} · +${answered.points} pts`}
                </p>
                <p className="mt-1 text-sm leading-6">
                  {answered.wrong ? scenario.sarcasm : scenario.praise}
                </p>
                <p className="mt-2 rounded-xl bg-white/5 px-3 py-2 text-xs leading-5 text-muted-foreground">
                  <span className="font-bold text-foreground">Pro tip: </span>
                  {scenario.proTip}
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button onClick={finish} className="gap-1.5 rounded-full px-5">
                {last ? "See results" : "Next shift"}
                <Play className="size-3.5" />
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* level-up overlay */}
      {levelUpTo !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0e1233]/70 p-4 backdrop-blur-sm"
          onClick={() => setLevelUpTo(null)}
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="glass-strong w-full max-w-sm rounded-3xl p-8 text-center"
          >
            <motion.div
              animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#e0a458]/15 text-[#e0a458]"
            >
              <Sparkles className="size-8" />
            </motion.div>
            <Mascot size={64} className="mx-auto mt-3" />
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.3em] text-[#e0a458]">
              Level Up! 🚀 Keep going!
            </p>
            <p className="mt-1 text-5xl font-extrabold tracking-tight">
              {levelUpTo}
            </p>
            <p className="mt-2 text-sm font-bold text-wistaria">
              {rankTitle(levelUpTo)}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              The hospital grapevine has heard of you. Keep saving patients to
              climb further.
            </p>
            <Button
              onClick={() => setLevelUpTo(null)}
              className="mt-5 w-full rounded-full"
            >
              Keep going
            </Button>
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}

/* ---------------------------- results ------------------------------ */

function Results({
  result,
  stats,
  onRestart,
  onLobby,
}: {
  result: RunResult;
  stats: SavedStats;
  onRestart: () => void;
  onLobby: () => void;
}) {
  const accuracy =
    result.saves + result.fails > 0
      ? Math.round((result.saves / (result.saves + result.fails)) * 100)
      : 0;
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center px-4 pb-32 pt-12 text-center sm:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="glass-strong shine relative w-full max-w-md overflow-hidden rounded-3xl p-8 sm:p-10"
      >
        {!result.patientLost && <ConfettiBurst count={24} />}

        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="relative mx-auto flex size-16 items-center justify-center rounded-full bg-[#e896b4]/20 text-[#d96a8f]"
        >
          {result.patientLost ? (
            <Skull className="size-8" />
          ) : (
            <Trophy className="size-8" />
          )}
        </motion.div>

        {!result.patientLost && <Mascot size={72} className="relative -mt-2" />}

        <h1 className="relative mt-5 text-3xl font-extrabold tracking-tight text-wistaria">
          {result.patientLost
            ? "Shift over"
            : pickMessage(ROUND_COMPLETE_TITLES, result.score)}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {result.patientLost
            ? "The squad will never speak of this. Statistically, they forgive — but they don't forget."
            : "The streets are safe. For now. Go take a bow."}
        </p>

        <p className="mt-6 text-6xl font-extrabold tabular-nums tracking-tight">
          {result.score.toLocaleString()}
          <span className="text-lg font-semibold text-muted-foreground"> pts</span>
        </p>
        {result.newHigh && (
          <motion.span
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#e0a458]/15 px-3 py-1 text-xs font-extrabold text-[#e0a458]"
          >
            <Star className="size-3.5" />
            NEW HIGH SCORE!
          </motion.span>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
          <span className="rounded-full bg-[#6fb5b0]/15 px-3 py-1 text-[#7fd0c9]">
            {result.saves} saved
          </span>
          <span className="rounded-full bg-[#e2666f]/12 px-3 py-1 text-[#c2434d]">
            {result.fails} fumbled
          </span>
          <span className="flex items-center gap-1 rounded-full bg-[#e896b4]/15 px-3 py-1 text-[#d96a8f]">
            <Flame className="size-3.5" />
            best combo x{result.bestCombo}
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-muted-foreground">
            {accuracy}% accuracy
          </span>
        </div>

        <div className="mt-6 rounded-2xl bg-white/5 p-4 text-left">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Responder status
            </p>
            <p className="text-xs font-extrabold text-wistaria">
              Level {stats.level} · {rankTitle(stats.level)}
            </p>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#78A2D2] to-[#a2a2d0]"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress(stats.xp) * 100}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <p className="mt-1.5 text-[11px] font-semibold text-muted-foreground">
            {stats.xp.toLocaleString()} XP earned so far
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <Button onClick={onRestart} className="gap-2">
            <RotateCcw className="size-4" />
            Run it back
          </Button>
          <Button variant="outline" onClick={onLobby} className="gap-2">
            <ArrowLeft className="size-4" />
            Back to base
          </Button>
        </div>
      </motion.div>
    </main>
  );
}

/* ------------------------------ page ------------------------------- */

type Screen = "lobby" | "countdown" | "playing" | "results";

function GameInner() {
  const [stats, setStats] = useState<SavedStats>(loadStats);
  const [screen, setScreen] = useState<Screen>("lobby");
  const [count, setCount] = useState(3);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [result, setResult] = useState<RunResult | null>(null);

  // Persist responder progress (guarded — storage can throw in previews).
  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  const startRun = () => {
    // Randomize the shift order AND each scenario's answer options, so the
    // correct move is never predictably the first option.
    setScenarios(
      shuffle(SCENARIOS).map((s) => {
        const { options, correctIndex } = shuffleOptions(
          s.options,
          s.correctIndex,
        );
        return { ...s, options, correctIndex };
      }),
    );
    setCount(3);
    setScreen("countdown");
  };

  const finishRun = (r: RunResult, progress: { level: number; xp: number }) => {
    const newHigh = r.score > stats.highScore;
    setStats((s) => ({
      ...s,
      level: Math.max(s.level, progress.level),
      xp: Math.max(s.xp, progress.xp),
      highScore: Math.max(s.highScore, r.score),
    }));
    setResult({ ...r, newHigh });
    setScreen("results");
  };

  // 3-2-1-GO countdown, then the mission begins.
  useEffect(() => {
    if (screen !== "countdown") return;
    if (count <= 0) {
      const t = setTimeout(() => setScreen("playing"), 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCount((c) => c - 1), 800);
    return () => clearTimeout(t);
  }, [screen, count]);

  return (
    <div className="min-h-screen">
      <GlassBackdrop />
      <AppHeader title="Game" />
      {screen === "lobby" && <GameLobby stats={stats} onStart={startRun} />}
      {screen === "countdown" && <Countdown count={count} />}
      {screen === "playing" && (
        <Mission
          scenarios={scenarios}
          stats={stats}
          onFinish={finishRun}
        />
      )}
      {screen === "results" && result && (
        <Results
          result={result}
          stats={stats}
          onRestart={startRun}
          onLobby={() => setScreen("lobby")}
        />
      )}
    </div>
  );
}

export default function Game() {
  return (
    <QueryErrorBoundary title="Couldn't load the game">
      <GameInner />
    </QueryErrorBoundary>
  );
}
