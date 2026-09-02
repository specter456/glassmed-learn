import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, RotateCcw, Timer, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const FOCUS_MINUTES = 25;
const BREAK_MINUTES = 5;

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Progress ring SVG helper */
function ProgressRing({
  progress,
  size = 48,
  stroke = 3,
  color = "#78A2D2",
}: {
  progress: number;
  size?: number;
  stroke?: number;
  color?: string;
}) {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - progress);

  return (
    <svg width={size} height={size} className="shrink-0">
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={stroke}
      />
      {/* Progress */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.5s ease" }}
      />
    </svg>
  );
}

export function FocusTimer() {
  const [expanded, setExpanded] = useState(false);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_MINUTES * 60);
  const [totalSeconds, setTotalSeconds] = useState(FOCUS_MINUTES * 60);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
          // Timer finished
          setRunning(false);
          if (mode === "focus") {
            toast("Time for a break! Great job. 🎉", {
              description: `You focused for ${FOCUS_MINUTES} minutes. Rest for ${BREAK_MINUTES}.`,
              duration: 8000,
            });
            setMode("break");
            setSecondsLeft(BREAK_MINUTES * 60);
            setTotalSeconds(BREAK_MINUTES * 60);
          } else {
            toast("Break is over! Ready to focus? 💪", {
              description: "Start another 25-minute session.",
              duration: 6000,
            });
            setMode("focus");
            setSecondsLeft(FOCUS_MINUTES * 60);
            setTotalSeconds(FOCUS_MINUTES * 60);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return clearTimer;
  }, [running, mode, clearTimer]);

  const handlePlayPause = () => setRunning((r) => !r);

  const handleReset = () => {
    clearTimer();
    setRunning(false);
    setMode("focus");
    setSecondsLeft(FOCUS_MINUTES * 60);
    setTotalSeconds(FOCUS_MINUTES * 60);
  };

  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;
  const isFocus = mode === "focus";
  const accentColor = isFocus ? "#78A2D2" : "#4ade80";

  return (
    <>
      {/* Collapsed: floating pill button */}
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
            <span className="size-1.5 animate-pulse rounded-full bg-green-400" />
          )}
        </motion.button>
      )}

      {/* Expanded panel */}
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
                  {isFocus ? "Focus" : "Break"}
                </span>
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="text-muted-foreground hover:text-white transition-colors"
              >
                <X className="size-3.5" />
              </button>
            </div>

            {/* Timer display */}
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <ProgressRing
                  progress={progress}
                  size={64}
                  stroke={3.5}
                  color={accentColor}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-lg font-bold text-white">
                    {formatTime(secondsLeft)}
                  </span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-3 flex items-center justify-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePlayPause}
                className="flex size-9 items-center justify-center rounded-full transition-colors"
                style={{
                  backgroundColor: accentColor + "22",
                  color: accentColor,
                }}
              >
                {running ? (
                  <Pause className="size-4" />
                ) : (
                  <Play className="size-4 ml-0.5" />
                )}
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

            {/* Mode hint */}
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              {isFocus
                ? `${FOCUS_MINUTES} min focus · ${BREAK_MINUTES} min break`
                : `${BREAK_MINUTES} min break · tap play when ready`}
            </p>

            {/* Pulsing glow overlay when running */}
            {running && (
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-2xl"
                animate={{ opacity: [0.1, 0.25, 0.1] }}
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
