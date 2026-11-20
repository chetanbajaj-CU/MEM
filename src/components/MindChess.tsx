import React, { useState, useEffect, useRef, useMemo } from "react";
import { Chess, Square } from "chess.js";
import { 
  RotateCcw, 
  Sparkles, 
  Trophy, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Brain, 
  Swords, 
  BookOpen, 
  CheckCircle, 
  AlertCircle, 
  HelpCircle,
  Clock,
  ShieldAlert,
  Play,
  Square as SquareIcon
} from "lucide-react";

// --- Clean SVG Chess Pieces ---
const ChessPieceIcon: React.FC<{ type: string; color: "w" | "b"; className?: string }> = ({ type, color, className = "w-9 h-9" }) => {
  const isWhite = color === "w";
  const fill = isWhite ? "#FFFFFF" : "#18181B";
  const stroke = isWhite ? "#27272A" : "#D4D4D8";

  switch (type) {
    case "p":
      return (
        <svg viewBox="0 0 45 45" className={className} fill="none">
          <path
            d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "r":
      return (
        <svg viewBox="0 0 45 45" className={className} fill="none">
          <path
            d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5c0 3-2 5-2 5h-18s-2-2-2-5zM14 19l2 13h13l2-13H14z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "n":
      return (
        <svg viewBox="0 0 45 45" className={className} fill="none">
          <path
            d="M22 10c-3 0-5 2-6 4-2 0-3 1-4 3-1 2-1 4 0 6 1 1 2 2 2 3-1 2-2 4-2 7 0 2 1 3 2 4l1 1h16l1-1c1-1 1-3 1-5 0-3-1-6-2-8 1-2 2-3 2-5 0-3-2-6-5-8-2-1-4-1-6-1z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "b":
      return (
        <svg viewBox="0 0 45 45" className={className} fill="none">
          <path
            d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2zM15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2zM25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "q":
      return (
        <svg viewBox="0 0 45 45" className={className} fill="none">
          <path
            d="M8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM16 8.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM32 8.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM9 26c8.5-1.5 21-1.5 27 0l2-12-7 5-8.5-8.5L14 19l-7-5 2 12zM9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5h23s2-1 .5-2.5c0 0 0-1.5-1.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4H9z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "k":
      return (
        <svg viewBox="0 0 45 45" className={className} fill="none">
          <path
            d="M22.5 11.63V6M20 8h5M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-8 2-8 2s-2-7-8-7-8 7-8 7-4-3-8-2c-3 6 6 10.5 6 10.5v7z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
};

// --- Mindful Chess Reflections ---
const MINDFUL_REFLECTIONS = [
  "Take a deep breath before touching any piece. Emotional composure is superior to hasty reaction.",
  "In chess as in life, when you see a good move, pause and look for an even better one.",
  "Accept every move on the board without panic. Adapt your strategy with calm neutrality.",
  "Impulse control is the bedrock of mental clarity. Never move immediately from adrenaline.",
  "Quiet the mind. Broaden your awareness across all 64 squares instead of fixating on one threat.",
  "A blunder is not defeat—it is a lesson in resilience. Center yourself and play the position as it is."
];

// --- Tactical Focus Puzzles ---
interface ChessPuzzle {
  id: number;
  title: string;
  theme: string;
  instruction: string;
  fen: string;
  playerColor: "w" | "b";
  solutionMoves: string[]; // e.g. ["e2e4", "e7e5"]
  mindLesson: string;
}

const PUZZLES: ChessPuzzle[] = [
  {
    id: 1,
    title: "The Smothered Masterpiece",
    theme: "Sacrifice for Harmony",
    instruction: "White to move. Deliver checkmate using your knight's unique jumping agility.",
    fen: "6k1/5ppp/8/8/8/8/5QPP/4N1K1 w - - 0 1",
    playerColor: "w",
    solutionMoves: ["f2f7", "g8h8", "f7f8"],
    mindLesson: "When you channel calm geometry, obstacles become stepping stones."
  },
  {
    id: 2,
    title: "The Royal Fork of Clarity",
    theme: "Impulse Control & Vision",
    instruction: "White to move. Find the knight leap that simultaneously attacks the King and Queen.",
    fen: "r1b1k2r/pppp1ppp/8/4q3/1bP5/2N1P3/PP3PPP/R2QKB1R w KQkq - 0 1",
    playerColor: "w",
    solutionMoves: ["d1d4"],
    mindLesson: "Great moves emerge not from rush, but from patiently surveying every intersection."
  },
  {
    id: 3,
    title: "Back-Rank Meditation",
    theme: "Laser Focus",
    instruction: "White to move. Exploit Black's trapped king behind its own defensive pawns.",
    fen: "3r2k1/5ppp/8/8/8/8/4QPPP/6K1 w - - 0 1",
    playerColor: "w",
    solutionMoves: ["e2e8", "d8e8"],
    mindLesson: "Awareness of boundaries allows you to navigate life's locked corridors with grace."
  },
  {
    id: 4,
    title: "The Queen's Deflection",
    theme: "Emotional Equilibrium",
    instruction: "White to move. Calmly dismantle the defender protecting the critical back row.",
    fen: "5rk1/5ppp/8/8/1q6/8/5PPP/3Q2K1 w - - 0 1",
    playerColor: "w",
    solutionMoves: ["d1d8", "f8d8"],
    mindLesson: "True mental stability means observing what guards the goal and removing distraction."
  }
];

// --- Web Audio Sound Generator ---
const playChessSound = (type: "move" | "capture" | "check" | "victory") => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === "move") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === "capture") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === "check") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(680, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === "victory") {
      [440, 554, 659, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.35);
      });
    }
  } catch (e) {
    // Ignore audio failures if restricted
  }
};

export const MindChess: React.FC = () => {
  // Game Modes: "play" (vs AI), "puzzles" (tactical focus), "principles" (mental wisdom)
  const [mode, setMode] = useState<"play" | "puzzles" | "principles">("play");
  const [difficulty, setDifficulty] = useState<"calm" | "balanced" | "master">("calm");
  
  // Game instance
  const gameRef = useRef(new Chess());
  const [board, setBoard] = useState<( { square: Square; type: string; color: "w" | "b" } | null )[][]>([]);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<Square[]>([]);
  const [turn, setTurn] = useState<"w" | "b">("w");
  const [gameStatus, setGameStatus] = useState<string>("In progress");
  const [isCheck, setIsCheck] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Captured pieces
  const [capturedWhite, setCapturedWhite] = useState<string[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<string[]>([]);
  
  // Play Mode Lifecycle: "start" | "active" | "ended"
  const [playSessionState, setPlaySessionState] = useState<"start" | "active" | "ended">("start");
  const [matchOutcome, setMatchOutcome] = useState<string>("");

  // Mindful focus timer
  const [focusSeconds, setFocusSeconds] = useState(0);
  const [moveCount, setMoveCount] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Puzzle State
  const [activePuzzleIndex, setActivePuzzleIndex] = useState(0);
  const [puzzleMoveStep, setPuzzleMoveStep] = useState(0);
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);
  const [puzzleError, setPuzzleError] = useState(false);

  // Synchronize board UI state
  const refreshBoard = () => {
    const chess = gameRef.current;
    const b = chess.board();
    setBoard(b);
    setTurn(chess.turn());
    setIsCheck(chess.inCheck());

    if (chess.isCheckmate()) {
      const winner = chess.turn() === "w" ? "Black" : "White";
      const statusText = `Checkmate! ${winner} triumphs in mindful clarity.`;
      setGameStatus(statusText);
      setMatchOutcome(statusText);
      if (soundEnabled) playChessSound("victory");
      setTimeout(() => setPlaySessionState("ended"), 1400);
    } else if (chess.isDraw()) {
      setGameStatus("Peaceful Equilibrium (Draw by rule)");
      setMatchOutcome("Draw by rule: Equilibrium achieved");
      setTimeout(() => setPlaySessionState("ended"), 1400);
    } else if (chess.isStalemate()) {
      setGameStatus("Stalemate: Perfect stillness");
      setMatchOutcome("Stalemate: Stillness");
      setTimeout(() => setPlaySessionState("ended"), 1400);
    } else if (chess.inCheck()) {
      setGameStatus("Check! Breathe and calmly evaluate defenses.");
      if (soundEnabled) playChessSound("check");
    } else {
      setGameStatus(chess.turn() === "w" ? "Your turn (White)" : "Mind Coach calculating...");
    }

    // Update captured pieces
    calculateCapturedPieces();
  };

  // Tally captured pieces
  const calculateCapturedPieces = () => {
    const history = gameRef.current.history({ verbose: true });
    const capW: string[] = [];
    const capB: string[] = [];
    history.forEach((m) => {
      if (m.captured) {
        if (m.color === "w") {
          capB.push(m.captured);
        } else {
          capW.push(m.captured);
        }
      }
    });
    setCapturedWhite(capW);
    setCapturedBlack(capB);
  };

  // Initial load
  useEffect(() => {
    refreshBoard();
  }, []);

  // Timer effect for mindful focus
  useEffect(() => {
    const interval = setInterval(() => {
      setFocusSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // AI Move Engine with 3 difficulties
  const triggerAiMove = () => {
    setIsAiThinking(true);
    setTimeout(() => {
      const chess = gameRef.current;
      if (chess.isGameOver() || chess.turn() !== "b") {
        setIsAiThinking(false);
        return;
      }

      const moves = chess.moves({ verbose: true });
      if (moves.length === 0) {
        setIsAiThinking(false);
        return;
      }

      let chosenMove = moves[0];

      if (difficulty === "calm") {
        // Calm mode: prioritizes safe captures or random peaceful development
        const captures = moves.filter((m) => m.captured);
        if (captures.length > 0 && Math.random() > 0.4) {
          chosenMove = captures[Math.floor(Math.random() * captures.length)];
        } else {
          chosenMove = moves[Math.floor(Math.random() * moves.length)];
        }
      } else if (difficulty === "balanced") {
        // Balanced: Evaluates 1-ply piece values
        let bestScore = -99999;
        const pieceValues: Record<string, number> = { p: 10, n: 30, b: 32, r: 50, q: 90, k: 900 };

        for (const m of moves) {
          let score = 0;
          if (m.captured) {
            score += pieceValues[m.captured] * 10;
          }
          // Center control bonus
          if (["d4", "d5", "e4", "e5"].includes(m.to)) score += 3;
          if (score > bestScore) {
            bestScore = score;
            chosenMove = m;
          }
        }
      } else {
        // Master: Positional evaluation
        let bestScore = -99999;
        const pieceValues: Record<string, number> = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

        for (const m of moves) {
          chess.move(m);
          let evaluation = 0;
          if (m.captured) evaluation += pieceValues[m.captured];
          if (chess.inCheck()) evaluation += 25;
          if (chess.isCheckmate()) evaluation += 10000;
          
          chess.undo();

          if (evaluation > bestScore) {
            bestScore = evaluation;
            chosenMove = m;
          }
        }
      }

      const moveRes = chess.move(chosenMove);
      if (soundEnabled) {
        if (moveRes.captured) playChessSound("capture");
        else playChessSound("move");
      }

      setMoveCount((c) => c + 1);
      setIsAiThinking(false);
      refreshBoard();
    }, 600);
  };

  // Handle Square Selection and Move Execution
  const handleSquareClick = (square: Square) => {
    const chess = gameRef.current;
    if (chess.isGameOver() || isAiThinking) return;

    if (mode === "play") {
      // Human plays White
      if (chess.turn() !== "w") return;

      if (!selectedSquare) {
        const piece = chess.get(square);
        if (piece && piece.color === "w") {
          setSelectedSquare(square);
          const legal = chess.moves({ square, verbose: true }).map((m) => m.to as Square);
          setValidMoves(legal);
        }
      } else {
        // Clicking same square unselects
        if (selectedSquare === square) {
          setSelectedSquare(null);
          setValidMoves([]);
          return;
        }

        // Try to execute move
        try {
          const move = chess.move({
            from: selectedSquare,
            to: square,
            promotion: "q" // auto queen for simplicity
          });

          if (move) {
            if (soundEnabled) {
              if (move.captured) playChessSound("capture");
              else playChessSound("move");
            }
            setSelectedSquare(null);
            setValidMoves([]);
            setMoveCount((c) => c + 1);
            refreshBoard();

            // AI countermove
            if (!chess.isGameOver()) {
              triggerAiMove();
            }
            return;
          }
        } catch (err) {
          // If clicked another own piece, switch selection
          const piece = chess.get(square);
          if (piece && piece.color === "w") {
            setSelectedSquare(square);
            const legal = chess.moves({ square, verbose: true }).map((m) => m.to as Square);
            setValidMoves(legal);
            return;
          }
        }

        setSelectedSquare(null);
        setValidMoves([]);
      }
    } else if (mode === "puzzles") {
      const currentPuzzle = PUZZLES[activePuzzleIndex];
      if (puzzleCompleted) return;

      if (!selectedSquare) {
        const piece = chess.get(square);
        if (piece && piece.color === currentPuzzle.playerColor) {
          setSelectedSquare(square);
          const legal = chess.moves({ square, verbose: true }).map((m) => m.to as Square);
          setValidMoves(legal);
        }
      } else {
        const moveUci = `${selectedSquare}${square}`;
        const expectedMove = currentPuzzle.solutionMoves[puzzleMoveStep];

        try {
          const move = chess.move({
            from: selectedSquare,
            to: square,
            promotion: "q"
          });

          if (move) {
            if (moveUci === expectedMove || move.san === expectedMove) {
              setPuzzleError(false);
              if (soundEnabled) playChessSound("capture");

              const nextStep = puzzleMoveStep + 1;
              setPuzzleMoveStep(nextStep);

              if (nextStep >= currentPuzzle.solutionMoves.length) {
                setPuzzleCompleted(true);
                if (soundEnabled) playChessSound("victory");
              } else {
                // Auto reply for opponent in puzzle
                setTimeout(() => {
                  const oppMove = currentPuzzle.solutionMoves[nextStep];
                  if (oppMove) {
                    const fromSq = oppMove.slice(0, 2) as Square;
                    const toSq = oppMove.slice(2, 4) as Square;
                    chess.move({ from: fromSq, to: toSq });
                    setPuzzleMoveStep(nextStep + 1);
                    refreshBoard();
                  }
                }, 500);
              }
            } else {
              // Incorrect puzzle move - undo
              setPuzzleError(true);
              setTimeout(() => {
                chess.undo();
                refreshBoard();
              }, 400);
            }
          }
        } catch (e) {
          // invalid move
        }

        setSelectedSquare(null);
        setValidMoves([]);
        refreshBoard();
      }
    }
  };

  // Reset Game
  const resetGame = () => {
    gameRef.current = new Chess();
    setSelectedSquare(null);
    setValidMoves([]);
    setCapturedWhite([]);
    setCapturedBlack([]);
    setMoveCount(0);
    setFocusSeconds(0);
    setMatchOutcome("");
    refreshBoard();
  };

  // Timer loop for active play session
  useEffect(() => {
    if (mode !== "play" || playSessionState !== "active") return;
    const interval = setInterval(() => {
      setFocusSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [mode, playSessionState]);

  // Undo Move
  const undoMove = () => {
    if (isAiThinking) return;
    const chess = gameRef.current;
    chess.undo(); // undo AI
    chess.undo(); // undo Player
    setSelectedSquare(null);
    setValidMoves([]);
    refreshBoard();
  };

  // Load Puzzle
  const loadPuzzle = (index: number) => {
    setActivePuzzleIndex(index);
    setPuzzleMoveStep(0);
    setPuzzleCompleted(false);
    setPuzzleError(false);
    setSelectedSquare(null);
    setValidMoves([]);
    const p = PUZZLES[index];
    gameRef.current = new Chess(p.fen);
    refreshBoard();
  };

  // Format timer
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Captured pieces value calculation
  const materialAdvantage = useMemo(() => {
    const vals: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9 };
    const wScore = capturedBlack.reduce((acc, p) => acc + (vals[p] || 0), 0);
    const bScore = capturedWhite.reduce((acc, p) => acc + (vals[p] || 0), 0);
    return wScore - bScore;
  }, [capturedWhite, capturedBlack]);

  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/5 border border-white/10 p-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#CCFF00]/10 border border-[#CCFF00]/30 flex items-center justify-center">
            <Brain className="w-6 h-6 text-[#CCFF00]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black uppercase tracking-tight text-white">
                Mind Chess
              </h2>
              <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-[#CCFF00] text-black">
                Mental Stability
              </span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/50">
              Calm foresight • Impulse control • Strategic composure
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-black/40 border border-white/10 p-1 overflow-x-auto no-scrollbar w-full sm:w-auto rounded-lg">
          <button
            onClick={() => {
              setMode("play");
              resetGame();
            }}
            className={`px-3 sm:px-4 py-2 text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap rounded ${
              mode === "play" ? "bg-[#CCFF00] text-black" : "text-white/60 hover:text-white"
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            Play Coach
          </button>
          <button
            onClick={() => {
              setMode("puzzles");
              loadPuzzle(0);
            }}
            className={`px-3 sm:px-4 py-2 text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap rounded ${
              mode === "puzzles" ? "bg-[#3BB1FF] text-black" : "text-white/60 hover:text-white"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            Focus Puzzles
          </button>
          <button
            onClick={() => setMode("principles")}
            className={`px-3 sm:px-4 py-2 text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap rounded ${
              mode === "principles" ? "bg-[#9D4EDD] text-white" : "text-white/60 hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Principles
          </button>
        </div>
      </div>

      {/* Main Content Area: 1. Mind Chess Start Screen */}
      {mode === "play" && playSessionState === "start" && (
        <div className="w-full bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden shadow-2xl space-y-8">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(204,255,0,0.2) 0%, transparent 70%)" }}
          />

          <div className="relative z-10 max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#CCFF00] text-[10px] font-mono font-bold uppercase tracking-widest">
              <Swords className="w-3.5 h-3.5 text-[#CCFF00]" />
              Cognitive Decision Simulator
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Mind Chess vs AI Coach
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 font-medium">
              Train emotional equilibrium, impulse control, and 64-square spatial awareness. Slow your breath before each move.
            </p>
          </div>

          {/* Coach Temperament Selection */}
          <div className="relative z-10 max-w-md mx-auto space-y-2">
            <div className="text-[10px] font-mono font-bold uppercase text-zinc-400">
              Select AI Coach Temperament:
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "calm", label: "Calm", desc: "Gentle focus" },
                { id: "balanced", label: "Balanced", desc: "Solid clarity" },
                { id: "master", label: "Master", desc: "Deep rigor" },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id as any)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    difficulty === d.id
                      ? "bg-[#CCFF00] text-black border-[#CCFF00] font-black shadow-[0_0_15px_rgba(204,255,0,0.3)]"
                      : "bg-black/50 border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  <div className="text-[11px] uppercase tracking-wider">{d.label}</div>
                  <div className="text-[8px] opacity-80">{d.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* The 3-Second Rule Tip */}
          <div className="relative z-10 max-w-lg mx-auto bg-white/5 border border-white/10 p-4 rounded-2xl text-xs space-y-1.5 text-left">
            <div className="font-black uppercase tracking-wider text-[#CCFF00] flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> The 3-Second Composure Rule
            </div>
            <p className="text-zinc-300 leading-relaxed text-[11px]">
              Before clicking any piece, take 3 seconds to inhale slowly. Check if your opponent has an immediate check or capture. This simple habit rewires impulsive stress responses.
            </p>
          </div>

          {/* Big START CHESS GAME button */}
          <div className="relative z-10 pt-2 flex justify-center">
            <button
              onClick={() => {
                resetGame();
                setPlaySessionState("active");
              }}
              className="px-8 py-4 bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black text-sm uppercase tracking-wider rounded-2xl shadow-[0_0_30px_rgba(204,255,0,0.45)] hover:shadow-[0_0_45px_rgba(204,255,0,0.7)] active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-full bg-black/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 fill-black text-black ml-0.5" />
              </div>
              <span>Start Chess Game</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Mind Chess Play Mode - End Screen */}
      {mode === "play" && playSessionState === "ended" && (
        <div className="w-full bg-zinc-950 border border-white/10 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl space-y-6 flex flex-col items-center justify-center min-h-[440px]">
          <div className="w-20 h-20 rounded-full bg-[#CCFF00]/20 border border-[#CCFF00]/40 flex items-center justify-center text-[#CCFF00] shadow-[0_0_30px_rgba(204,255,0,0.4)]">
            <Trophy className="w-10 h-10 text-[#CCFF00]" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Match Concluded
            </h2>
            <p className="text-zinc-300 font-medium max-w-md text-xs sm:text-sm mt-1">
              {matchOutcome || gameStatus}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-md">
            <div className="bg-black/60 border border-white/10 p-3 rounded-2xl text-center">
              <div className="text-[9px] font-mono uppercase text-zinc-400">Moves</div>
              <div className="text-lg font-mono font-black text-[#CCFF00]">{moveCount}</div>
            </div>
            <div className="bg-black/60 border border-white/10 p-3 rounded-2xl text-center">
              <div className="text-[9px] font-mono uppercase text-zinc-400">Focus Time</div>
              <div className="text-lg font-mono font-black text-[#3BB1FF]">{formatTime(focusSeconds)}</div>
            </div>
            <div className="bg-black/60 border border-white/10 p-3 rounded-2xl text-center col-span-2 sm:col-span-1">
              <div className="text-[9px] font-mono uppercase text-zinc-400">Temperament</div>
              <div className="text-lg font-mono font-black text-[#00E676]">{difficulty.toUpperCase()}</div>
            </div>
          </div>

          <div className="max-w-md p-4 bg-white/5 border border-white/10 rounded-2xl text-xs italic text-zinc-300">
            "{MINDFUL_REFLECTIONS[quoteIndex]}"
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                resetGame();
                setPlaySessionState("active");
              }}
              className="px-6 py-3 bg-[#CCFF00] hover:bg-[#b8e600] text-black text-xs font-black uppercase tracking-wider rounded-xl active:scale-95 transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black" />
              Start Game Again
            </button>
            <button
              onClick={() => {
                resetGame();
                setPlaySessionState("start");
              }}
              className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white text-xs font-black uppercase tracking-wider rounded-xl active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Back to Start Screen
            </button>
          </div>
        </div>
      )}

      {/* 3. Mind Chess Play Mode - Active Board */}
      {mode === "play" && playSessionState === "active" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Chess Board */}
          <div className="lg:col-span-8 flex flex-col items-center w-full">

            {/* Top Bar: Opponent Info (Mind Coach) */}
            <div className="w-full max-w-[min(100vw-2.5rem,420px)] flex items-center justify-between py-2 px-3 bg-white/5 border-t border-x border-white/10 text-xs font-bold uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-400"></span>
                <span className="text-white text-[11px] sm:text-xs">Mind Coach ({difficulty.toUpperCase()})</span>
                {isAiThinking && (
                  <span className="text-[9px] text-[#CCFF00] animate-pulse">Calculating...</span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {capturedWhite.map((p, i) => (
                  <span key={i} className="text-xs text-white/50 font-serif">
                    {p.toUpperCase()}
                  </span>
                ))}
                {materialAdvantage < 0 && (
                  <span className="text-[10px] font-mono text-zinc-400">+{Math.abs(materialAdvantage)}</span>
                )}
              </div>
            </div>

            {/* The 8x8 Chessboard */}
            <div className="w-full max-w-[min(100vw-2.5rem,420px)] aspect-square border-2 border-white/20 shadow-2xl bg-[#141416] select-none mx-auto">
              <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
                {board.map((row, rIdx) =>
                  row.map((col, cIdx) => {
                    const file = String.fromCharCode(97 + cIdx);
                    const rank = 8 - rIdx;
                    const sq = `${file}${rank}` as Square;
                    const isDark = (rIdx + cIdx) % 2 === 1;
                    const isSelected = selectedSquare === sq;
                    const isValidTarget = validMoves.includes(sq);
                    const isPieceInCheck = isCheck && col?.type === "k" && col?.color === turn;

                    return (
                      <button
                        key={sq}
                        onClick={() => handleSquareClick(sq)}
                        aria-label={`Square ${sq}`}
                        className={`relative flex items-center justify-center transition-colors ${
                          isDark ? "bg-[#27272A]" : "bg-[#3F3F46]"
                        } ${isSelected ? "!bg-[#CCFF00]/40 ring-2 ring-[#CCFF00]" : ""} ${
                          isPieceInCheck ? "!bg-red-500/50 ring-2 ring-red-500 animate-pulse" : ""
                        }`}
                      >
                        {/* Piece Icon */}
                        {col && (
                          <div className="relative z-10 transform transition-transform active:scale-95">
                            <ChessPieceIcon type={col.type} color={col.color} className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 drop-shadow-md" />
                          </div>
                        )}

                        {/* Move Indicator Dots */}
                        {isValidTarget && !col && (
                          <div className="w-3.5 h-3.5 rounded-full bg-[#CCFF00] shadow-[0_0_8px_#CCFF00] opacity-80" />
                        )}
                        {isValidTarget && col && (
                          <div className="absolute inset-1 rounded-full border-2 border-[#CCFF00] bg-[#CCFF00]/20 pointer-events-none" />
                        )}

                        {/* Coordinates labels */}
                        {cIdx === 0 && (
                          <span className="absolute top-0.5 left-1 text-[8px] font-mono font-bold text-white/30 pointer-events-none">
                            {rank}
                          </span>
                        )}
                        {rIdx === 7 && (
                          <span className="absolute bottom-0.5 right-1 text-[8px] font-mono font-bold text-white/30 pointer-events-none">
                            {file}
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Bottom Bar: Player Info */}
            <div className="w-full max-w-[480px] flex items-center justify-between py-2 px-3 bg-white/5 border-b border-x border-white/10 text-xs font-bold uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#CCFF00]"></span>
                <span className="text-white">You (White)</span>
                {turn === "w" && !isAiThinking && (
                  <span className="text-[10px] text-[#CCFF00]">Your Move</span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {capturedBlack.map((p, i) => (
                  <span key={i} className="text-xs text-[#CCFF00]/70 font-serif">
                    {p.toUpperCase()}
                  </span>
                ))}
                {materialAdvantage > 0 && (
                  <span className="text-[10px] font-mono text-[#CCFF00]">+{materialAdvantage}</span>
                )}
              </div>
            </div>

            {/* Quick Action Controls with END GAME Button */}
            <div className="w-full max-w-[480px] flex items-center justify-between gap-2 mt-4">
              <button
                onClick={resetGame}
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition rounded-xl cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#CCFF00]" />
                Restart
              </button>
              <button
                onClick={undoMove}
                disabled={moveCount === 0 || isAiThinking}
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition disabled:opacity-40 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#3BB1FF]" />
                Undo
              </button>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="px-3.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] font-bold uppercase tracking-widest flex items-center justify-center transition cursor-pointer"
                title={soundEnabled ? "Mute sound" : "Enable sound"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-[#CCFF00]" /> : <VolumeX className="w-4 h-4 text-white/40" />}
              </button>
              <button
                onClick={() => {
                  setMatchOutcome("Concluded by Player");
                  setPlaySessionState("ended");
                }}
                className="flex-1 py-2.5 bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-400 hover:text-red-300 text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition rounded-xl cursor-pointer"
                title="Conclude match and view summary"
              >
                <SquareIcon className="w-3.5 h-3.5 fill-current" />
                End Game
              </button>
            </div>
          </div>

          {/* Right Column: Mental Dashboard & Coach */}
          <div className="lg:col-span-4 space-y-4">
            {/* Mindful Anchor Card */}
            <div className="bg-white/5 border border-white/10 p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white/50">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#CCFF00]" />
                  Mindfulness Anchor
                </span>
                <button
                  onClick={() => setQuoteIndex((i) => (i + 1) % MINDFUL_REFLECTIONS.length)}
                  className="hover:text-white transition"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
              <p className="text-sm font-medium italic text-white/90 leading-relaxed">
                "{MINDFUL_REFLECTIONS[quoteIndex]}"
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#3BB1FF]" /> Focus Time: {formatTime(focusSeconds)}
                </span>
                <span>Moves: {moveCount}</span>
              </div>
            </div>

            {/* Status & Check Notice */}
            <div className={`p-4 border transition-all ${
              isCheck ? "bg-red-500/10 border-red-500/40 text-red-300" : "bg-white/5 border-white/10 text-white"
            }`}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">
                Live Composure Status
              </div>
              <div className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                {isCheck && <ShieldAlert className="w-4 h-4 text-red-400" />}
                {gameStatus}
              </div>
            </div>

            {/* Difficulty Selector */}
            <div className="bg-white/5 border border-white/10 p-4 space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                Mind Coach Temperament
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "calm", label: "Calm", desc: "Gentle focus" },
                  { id: "balanced", label: "Balanced", desc: "Solid clarity" },
                  { id: "master", label: "Master", desc: "Deep rigor" }
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDifficulty(d.id as any)}
                    className={`py-2 px-1 text-center transition-all border ${
                      difficulty === d.id
                        ? "bg-[#CCFF00] text-black border-[#CCFF00] font-black"
                        : "bg-black/30 border-white/10 text-white/70 hover:bg-white/10 font-bold"
                    }`}
                  >
                    <div className="text-[11px] uppercase tracking-wider">{d.label}</div>
                    <div className="text-[8px] opacity-70">{d.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mental Stability Takeaway */}
            <div className="bg-[#CCFF00]/5 border border-[#CCFF00]/20 p-4 text-xs space-y-2">
              <div className="font-black uppercase tracking-wider text-[#CCFF00] flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> The 3-Second Rule
              </div>
              <p className="text-white/70 leading-relaxed">
                Before releasing your hand from any piece, take 3 seconds to inhale slowly. Check if your opponent has an immediate check or capture. This simple habit rewires impulsive stress responses.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mode: Tactical Focus Puzzles */}
      {mode === "puzzles" && (
        <div className="space-y-6">
          {/* Puzzle selector ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PUZZLES.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => loadPuzzle(idx)}
                className={`p-3 text-left border transition-all ${
                  activePuzzleIndex === idx
                    ? "bg-[#3BB1FF]/10 border-[#3BB1FF] text-white"
                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                }`}
              >
                <div className="text-[9px] font-black uppercase text-[#3BB1FF] mb-1">
                  Puzzle {p.id}
                </div>
                <div className="text-xs font-black uppercase tracking-tight line-clamp-1">
                  {p.title}
                </div>
                <div className="text-[10px] text-white/40 mt-1">{p.theme}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Puzzle Chessboard */}
            <div className="lg:col-span-8 flex flex-col items-center w-full">
              <div className="w-full max-w-[min(100vw-2.5rem,420px)] aspect-square border-2 border-white/20 shadow-2xl bg-[#141416] select-none mx-auto">
                <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
                  {board.map((row, rIdx) =>
                    row.map((col, cIdx) => {
                      const file = String.fromCharCode(97 + cIdx);
                      const rank = 8 - rIdx;
                      const sq = `${file}${rank}` as Square;
                      const isDark = (rIdx + cIdx) % 2 === 1;
                      const isSelected = selectedSquare === sq;
                      const isValidTarget = validMoves.includes(sq);

                      return (
                        <button
                          key={sq}
                          onClick={() => handleSquareClick(sq)}
                          className={`relative flex items-center justify-center transition-colors ${
                            isDark ? "bg-[#27272A]" : "bg-[#3F3F46]"
                          } ${isSelected ? "!bg-[#3BB1FF]/40 ring-2 ring-[#3BB1FF]" : ""}`}
                        >
                          {col && (
                            <ChessPieceIcon type={col.type} color={col.color} className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 drop-shadow-md" />
                          )}
                          {isValidTarget && !col && (
                            <div className="w-3.5 h-3.5 rounded-full bg-[#3BB1FF] shadow-[0_0_8px_#3BB1FF] opacity-80" />
                          )}
                          {isValidTarget && col && (
                            <div className="absolute inset-1 rounded-full border-2 border-[#3BB1FF] bg-[#3BB1FF]/20" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="w-full max-w-[min(100vw-2.5rem,420px)] flex items-center justify-between mt-3 sm:mt-4">
                <button
                  onClick={() => loadPuzzle(activePuzzleIndex)}
                  className="px-4 sm:px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition rounded"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#3BB1FF]" />
                  Reset
                </button>
                {activePuzzleIndex < PUZZLES.length - 1 && puzzleCompleted && (
                  <button
                    onClick={() => loadPuzzle(activePuzzleIndex + 1)}
                    className="px-4 sm:px-6 py-2.5 bg-[#3BB1FF] hover:bg-[#3298dc] text-black text-[10px] sm:text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 transition rounded"
                  >
                    Next <Sparkles className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Puzzle Objective & Mental Takeaway */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white/5 border border-white/10 p-5 space-y-3">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#3BB1FF]">
                  Mindful Objective
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-white">
                  {PUZZLES[activePuzzleIndex].title}
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  {PUZZLES[activePuzzleIndex].instruction}
                </p>

                {puzzleError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Take a deep breath and look again. There is a more precise path.
                  </div>
                )}

                {puzzleCompleted && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-2">
                    <div className="font-black uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" /> Solved with Clarity!
                    </div>
                    <p className="text-xs leading-relaxed text-white/80">
                      "{PUZZLES[activePuzzleIndex].mindLesson}"
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white/5 border border-white/10 p-4 text-xs space-y-2">
                <div className="font-bold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-[#CCFF00]" />
                  Cognitive Tip
                </div>
                <p className="text-white/70 leading-relaxed">
                  Look for checks, captures, and threats in that specific order. Structured problem solving prevents mental paralysis under uncertainty.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode: Mental Stability Principles */}
      {mode === "principles" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
          {[
            {
              title: "1. The Sit-on-Your-Hands Principle",
              tagline: "Overcoming Reactive Impulses",
              color: "#CCFF00",
              desc: "Grandmasters literally sit on their hands during training to prevent reflexive moves. When stress hits your central nervous system, stop and count to three before acting."
            },
            {
              title: "2. The Post-Blunder Equilibrium",
              tagline: "Resetting Emotional Sunk Costs",
              color: "#3BB1FF",
              desc: "The most destructive chess move is never the blunder—it is the rushed, emotional move made immediately after. Accept mistakes as objective reality and start fresh from the new position."
            },
            {
              title: "3. Broad Awareness vs Tunnel Vision",
              tagline: "Neuroplastic Perspective",
              color: "#9D4EDD",
              desc: "Anxiety causes tunnel vision, focusing intensely on one corner of the board while a bishop attacks from across the field. Consciously expand your peripheral view to all 64 squares."
            },
            {
              title: "4. The Harmony of Pieces",
              tagline: "Integrating Mind & Body",
              color: "#FF4081",
              desc: "No single piece wins alone. True mental resilience comes from synchronizing nutrition, sleep, breathwork, and physical movement into one unified defense."
            }
          ].map((principle, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 p-6 space-y-3 relative overflow-hidden">
              <div 
                className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10"
                style={{ backgroundColor: principle.color }}
              />
              <div 
                className="text-xs font-black uppercase tracking-widest"
                style={{ color: principle.color }}
              >
                {principle.tagline}
              </div>
              <h3 className="text-lg font-black uppercase text-white tracking-tight">
                {principle.title}
              </h3>
              <p className="text-xs font-normal text-white/70 leading-relaxed">
                {principle.desc}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
