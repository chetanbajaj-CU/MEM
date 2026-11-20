import { useState, useEffect, useRef } from "react";
import { Play, Square, RotateCcw, Timer, Clock } from "lucide-react";

export function StopwatchTimer() {
  const [activeMode, setActiveMode] = useState<"stopwatch" | "interval">("stopwatch");
  
  // Stopwatch State
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const stopwatchRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Interval State
  const [workTime, setWorkTime] = useState(45);
  const [restTime, setRestTime] = useState(15);
  const [intervalTime, setIntervalTime] = useState(45);
  const [isWorkPhase, setIsWorkPhase] = useState(true);
  const [isIntervalRunning, setIsIntervalRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const isWorkPhaseRef = useRef(isWorkPhase);
  const workTimeRef = useRef(workTime);
  const restTimeRef = useRef(restTime);

  useEffect(() => {
    isWorkPhaseRef.current = isWorkPhase;
    workTimeRef.current = workTime;
    restTimeRef.current = restTime;
  }, [isWorkPhase, workTime, restTime]);

  useEffect(() => {
    if (isStopwatchRunning) {
      startTimeRef.current = Date.now() - stopwatchTime;
      stopwatchRef.current = window.setInterval(() => {
        setStopwatchTime(Date.now() - startTimeRef.current);
      }, 10);
    } else if (stopwatchRef.current) {
      clearInterval(stopwatchRef.current);
    }
    return () => {
      if (stopwatchRef.current) clearInterval(stopwatchRef.current);
    };
  }, [isStopwatchRunning]);

  useEffect(() => {
    if (isIntervalRunning) {
      intervalRef.current = window.setInterval(() => {
        setIntervalTime((prev) => {
          if (prev <= 1) {
            // Switch phase
            const nextPhaseIsWork = !isWorkPhaseRef.current;
            setIsWorkPhase(nextPhaseIsWork);
            return nextPhaseIsWork ? workTimeRef.current : restTimeRef.current;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isIntervalRunning]);

  const formatStopwatch = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const ms = Math.floor((time % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
  };

  const formatInterval = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const toggleStopwatch = () => setIsStopwatchRunning(!isStopwatchRunning);
  const resetStopwatch = () => {
    setIsStopwatchRunning(false);
    setStopwatchTime(0);
  };

  const toggleInterval = () => setIsIntervalRunning(!isIntervalRunning);
  const resetInterval = () => {
    setIsIntervalRunning(false);
    setIsWorkPhase(true);
    setIntervalTime(workTime);
  };

  return (
    <div className="bg-[#0A0A0A] border border-white/10 p-6 space-y-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-2">
        <Clock className="w-5 h-5 text-[#CCFF00]" />
        <h2 className="text-xl font-black uppercase tracking-tight text-white">Timer & Intervals</h2>
      </div>

      <div className="flex gap-4 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveMode("stopwatch")}
          className={`flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase transition-colors ${
            activeMode === "stopwatch" ? "text-[#CCFF00]" : "text-white/40 hover:text-white"
          }`}
        >
          <Clock className="w-4 h-4" /> Stopwatch
        </button>
        <button
          onClick={() => {
            setActiveMode("interval");
            resetInterval();
          }}
          className={`flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase transition-colors ${
            activeMode === "interval" ? "text-[#CCFF00]" : "text-white/40 hover:text-white"
          }`}
        >
          <Timer className="w-4 h-4" /> Interval
        </button>
      </div>

      {activeMode === "stopwatch" ? (
        <div className="flex flex-col items-center py-6">
          <div className="text-6xl md:text-7xl font-mono font-black text-white tracking-tighter mb-8">
            {formatStopwatch(stopwatchTime)}
          </div>
          <div className="flex gap-4">
            <button
              onClick={toggleStopwatch}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                isStopwatchRunning ? "bg-red-500 text-white" : "bg-[#CCFF00] text-black"
              }`}
            >
              {isStopwatchRunning ? <Square className="fill-current w-6 h-6" /> : <Play className="fill-current w-6 h-6 ml-1" />}
            </button>
            <button
              onClick={resetStopwatch}
              className="w-16 h-16 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="flex gap-8 mb-8 w-full justify-center">
            <div className="flex flex-col items-center">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Work (sec)</label>
              <input
                type="number"
                value={workTime}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setWorkTime(val);
                  if (isWorkPhase && !isIntervalRunning) setIntervalTime(val);
                }}
                className="w-20 bg-black border border-white/20 text-white text-center font-mono py-2 focus:outline-none focus:border-[#CCFF00]"
              />
            </div>
            <div className="flex flex-col items-center">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Rest (sec)</label>
              <input
                type="number"
                value={restTime}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setRestTime(val);
                  if (!isWorkPhase && !isIntervalRunning) setIntervalTime(val);
                }}
                className="w-20 bg-black border border-white/20 text-white text-center font-mono py-2 focus:outline-none focus:border-[#CCFF00]"
              />
            </div>
          </div>

          <div className={`text-sm font-bold uppercase tracking-widest mb-2 ${isWorkPhase ? "text-[#CCFF00]" : "text-[#3BB1FF]"}`}>
            {isWorkPhase ? "Work Phase" : "Rest Phase"}
          </div>
          <div className="text-6xl md:text-7xl font-mono font-black text-white tracking-tighter mb-8">
            {formatInterval(intervalTime)}
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={toggleInterval}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                isIntervalRunning ? "bg-red-500 text-white" : "bg-[#CCFF00] text-black"
              }`}
            >
              {isIntervalRunning ? <Square className="fill-current w-6 h-6" /> : <Play className="fill-current w-6 h-6 ml-1" />}
            </button>
            <button
              onClick={resetInterval}
              className="w-16 h-16 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
