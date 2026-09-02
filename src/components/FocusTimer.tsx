import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, RotateCcw, Settings, Timer, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* ── localStorage helpers ────────────────────────────────────────────── */

const STORAGE_KEY = "glassmed-focus-timer";

interface TimerPrefs {
  focusMin: number;
  shortBreakMin: number;
  longBreakMin: number;
}

const DEFAULTS: TimerPrefs = { focusMin: 25, shortBreakMin: 5, longBreakMin: 15 };

function loadPrefs(): TimerPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<TimerPrefs>;
      return {
        focusMin: Math.max(1, Math.min(120, p.focusMin ?? DEFAULTS.focusMin)),
        shortBreakMin: Math.max(1, Math.min(60, p.shortBreakMin ?? DEFAULTS.shortBreakMin)),
        longBreakMin: Math.max(1, Math.min(60, p.longBreakMin ?? DEFAULTS.longBreakMin)),
      };
    }
  } catch { /* ignore */ }
  return { ...DEFAULTS };
}

function savePrefs(p: TimerPrefs): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch { /* ignore */ }
}

/* ── helpers ─────────────────────────────────────────────────────────── */

type Mode = "focus" | "shortBreak" | "longBreak";

const MODE_COLORS: Record<Mode, string> = {
  focus: "#78A2D2",
  shortBreak: "#4ade80",
  longBreak: "#a78bfa",
};

const MODE_LABELS: Record<Mode, string> = {
  focus: "Focus",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* ── Progress ring ───────────────────────────────────────────────────── */

function ProgressRing({
  progress,
  size = 64,
  stroke = 3.5,
  color = "#78A2D2",
}: {
  progress: number;
  size?: number;
  stroke?: number;
  color?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress);
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.5s ease" }}
      />
    </svg>
  );
}

/* ── Settings panel ──────────────────────────────────────────────────── */

function SettingsPanel({
  prefs,
  onPrefsChange,
  onClose,
}: {
  prefs: TimerPrefs;
  onPrefsChange: (p: TimerPrefs) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState(prefs);

  const update = (key: keyof TimerPrefs, val: string) => {
    const n = Math.max(1, Math.min(120, parseInt(val, 10) || 1));
    const next = { ...local, [key]: n };
    setLocal(next);
    onPrefsChange(next);
    savePrefs(next);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute bottom-full left-0 mb-2 w-56 rounded-2xl border border-white/10 p-3.5"
      style={{
        background: "linear-gradient(135deg, rgba(15,15,30,0.95), rgba(20,20,40,0.92))",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-wistaria">
          Timer Settings
        </span>
        <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors">
          <X className="size-3" />
        </button>
      </div>

      {([
        { key: "focusMin" as const, label: "Focus", color: MODE_COLORS.focus },
        { key: "shortBreakMin" as const, label: "Short Break", color: MODE_COLORS.shortBreak },
        { key: "longBreakMin" as const, label: "Long Break", color: MODE_COLORS.longBreak },
      ]).map(({ key, label, color }) => (
        <div key={key} className="mb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs text-white/70">{label}</span>
          </div>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min={1}
              max={120}
              value={local[key]}
              onChange={(e) => update(key, e.target.value)}
              className="w-12 rounded-lg border border-white/10 bg-white/5 px-1.5 py-0.5 text-center text-xs font-mono text-white outline-none focus:border-white/25 transition-colors"
            />
            <span className="text-[10px] text-muted-foreground">min</span>
          </div>
        </div>
      ))}

      <p className="mt-1 text-center text-[9px] text-muted-foreground/60">
        Changes save automatically
      </p>
    </motion.div>
  );
}

/* ── Main component ──────────────────────────────────────────────────── */

export function FocusTimer() {
  const [prefs, setPrefs] = useState<TimerPrefs>(loadPrefs);
  const [expanded, setExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<Mode>("focus");
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(prefs.focusMin * 60);
  const [totalSeconds, setTotalSeconds] = useState(prefs.focusMin * 60);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prefsRef = useRef(prefs);
  prefsRef.current = prefs;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Tick
  useEffect(() => {
    if (!running) {
      clearTimer();
      return;
    }
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setRunning(false);
          const p = prefsRef.current;

          if (mode === "focus") {
            const newSessions = sessionsCompleted + 1;
            setSessionsCompleted(newSessions);
            // Every 4 sessions → long break
            if (newSessions % 4 === 0) {
              toast("Time for a long break! 🎉", {
                description: `You completed ${newSessions} focus sessions. Rest for ${p.longBreakMin} minutes.`,
                duration: 8000,
              });
              setMode("longBreak");
              setSecondsLeft(p.longBreakMin * 60);
              setTotalSeconds(p.longBreakMin * 60);
            } else {
              toast("Time for a break! Great job. 🎉", {
                description: `You focused for ${p.focusMin} minutes. Rest for ${p.shortBreakMin}.`,
                duration: 8000,
              });
              setMode("shortBreak");
              setSecondsLeft(p.shortBreakMin * 60);
              setTotalSeconds(p.shortBreakMin * 60);
            }
          } else {
            toast("Break is over! Ready to focus? 💪", {
              description: `Start another ${p.focusMin}-minute session.`,
              duration: 6000,
            });
            setMode("focus");
            setSecondsLeft(p.focusMin * 60);
            setTotalSeconds(p.focusMin * 60);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return clearTimer;
  }, [running, mode, sessionsCompleted, clearTimer]);

  const handlePlayPause = () => setRunning((r) => !r);

  const handleReset = () => {
    clearTimer();
    setRunning(false);
    setMode("focus");
    setSessionsCompleted(0);
    setSecondsLeft(prefs.focusMin * 60);
    setTotalSeconds(prefs.focusMin * 60);
  };

  const handlePrefsChange = (p: TimerPrefs) => {
    setPrefs(p);
    // If not running, update the current display immediately
    if (!running) {
      if (mode === "focus") {
        setSecondsLeft(p.focusMin * 60);
        setTotalSeconds(p.focusMin * 60);
      } else if (mode === "shortBreak") {
        setSecondsLeft(p.shortBreakMin * 60);
        setTotalSeconds(p.shortBreakMin * 60);
      } else {
        setSecondsLeft(p.longBreakMin * 60);
        setTotalSeconds(p.longBreakMin * 60);
      }
    }
  };

  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;
  const accentColor = MODE_COLORS[mode];

  return (
    <>
      {/* ── Collapsed pill ─────────────────────────────────────── */}
      {!expanded && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setExpanded(true)}
          className={cn(
            "glass-chip fixed left-5 z-[80] flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold",
            "border border-white/10 text-white/80 transition-colors hover:border-white/20 hover:text-white",
          )}
          style={{ bottom: "5.6rem" }}
          title="Focus Timer"
        >
          <Timer className="size-4 text-wistaria" />
          <span className="font-mono">{formatTime(secondsLeft)}</span>
          {running && (
            <span className="size-1.5 animate-pulse rounded-full" style={{ backgroundColor: accentColor }} />
          )}
        </motion.button>
      )}

      {/* ── Expanded panel ─────────────────────────────────────── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            className={cn(
              "glass-strong fixed left-5 z-[80] w-56 rounded-2xl p-4",
              running && "ring-1",
            )}
            style={{
              bottom: "5.6rem",
              ...(running ? { ringColor: accentColor + "44" } : {}),
              boxShadow: running
                ? `0 0 20px ${accentColor}22, 0 8px 32px rgba(0,0,0,0.3)`
                : "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Timer className="size-3.5" style={{ color: accentColor }} />
                <span
                  className="text-[10px] font-extrabold uppercase tracking-wider"
                  style={{ color: accentColor }}
                >
                  {MODE_LABELS[mode]}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {/* Settings button */}
                <div className="relative">
                  <button
                    onClick={() => setShowSettings((s) => !s)}
                    className={cn(
                      "rounded-lg p-1 transition-colors",
                      showSettings ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white",
                    )}
                    title="Timer settings"
                  >
                    <Settings className="size-3" />
                  </button>
                  <AnimatePresence>
                    {showSettings && (
                      <SettingsPanel
                        prefs={prefs}
                        onPrefsChange={handlePrefsChange}
                        onClose={() => setShowSettings(false)}
                      />
                    )}
                  </AnimatePresence>
                </div>
                <button
                  onClick={() => { setExpanded(false); setShowSettings(false); }}
                  className="text-muted-foreground hover:text-white transition-colors"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Session counter */}
            <div className="mb-2 flex justify-center gap-1">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="size-1.5 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: i < (sessionsCompleted % 4 === 0 && sessionsCompleted > 0 ? 4 : sessionsCompleted % 4)
                      ? accentColor
                      : "rgba(255,255,255,0.12)",
                  }}
                />
              ))}
            </div>

            {/* Timer display */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <ProgressRing progress={progress} size={72} stroke={3.5} color={accentColor} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-xl font-bold text-white">
                    {formatTime(secondsLeft)}
                  </span>
                </div>
              </div>
            </div>

            {/* Mode selector */}
            <div className="mt-3 flex justify-center gap-1">
              {(["focus", "shortBreak", "longBreak"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    if (!running) {
                      setMode(m);
                      const secs = m === "focus"
                        ? prefs.focusMin * 60
                        : m === "shortBreak"
                        ? prefs.shortBreakMin * 60
                        : prefs.longBreakMin * 60;
                      setSecondsLeft(secs);
                      setTotalSeconds(secs);
                    }
                  }}
                  className={cn(
                    "rounded-lg px-2 py-1 text-[10px] font-semibold transition-all",
                    mode === m
                      ? "text-white"
                      : "text-muted-foreground hover:text-white/70",
                  )}
                  style={{
                    backgroundColor: mode === m ? MODE_COLORS[m] + "22" : "transparent",
                    color: mode === m ? MODE_COLORS[m] : undefined,
                  }}
                  disabled={running}
                >
                  {m === "focus" ? "Focus" : m === "shortBreak" ? "Short" : "Long"}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="mt-3 flex items-center justify-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePlayPause}
                className="flex size-9 items-center justify-center rounded-full transition-colors"
                style={{ backgroundColor: accentColor + "22", color: accentColor }}
              >
                {running ? <Pause className="size-4" /> : <Play className="size-4 ml-0.5" />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleReset}
                className="flex size-9 items-center justify-center rounded-full bg-white/5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-white"
              >
                <RotateCcw className="size-4" />
              </motion.button>
            </div>

            {/* Hint */}
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              {running
                ? `Session ${sessionsCompleted + 1} · ${mode === "focus" ? "deep work" : "resting"}`
                : `${prefs.focusMin}m focus · ${prefs.shortBreakMin}m break · ${prefs.longBreakMin}m long`}
            </p>

            {/* Pulsing glow overlay */}
            {running && (
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-2xl"
                animate={{ opacity: [0.08, 0.2, 0.08] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  border: `1px solid ${accentColor}33`,
                  boxShadow: `inset 0 0 30px ${accentColor}0d`,
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
