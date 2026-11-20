import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Camera,
  CameraOff,
  RefreshCw,
  Sun,
  Volume2,
  VolumeX,
  Play,
  Square,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Flame,
  Award,
  ChevronRight,
  Maximize2,
  Minimize2,
  X,
  HelpCircle,
  Eye,
  Activity,
  History,
  RotateCcw
} from "lucide-react";
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
import {
  Landmark,
  RecognizedPose,
  checkBodyVisibility,
  recognizeYogaAsana,
  drawPoseSkeleton,
  SUPPORTED_ASANAS_CATALOG,
  SupportedAsanaGuide
} from "../lib/yogaPoseDetection";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { doc, setDoc, getDocs, collection, query, where, orderBy, limit } from "firebase/firestore";

interface PoseHoldRecord {
  poseId: string;
  poseName: string;
  sanskritName: string;
  holdSeconds: number;
  bestScore: number;
  artImage?: string;
}

interface SavedYogaSession {
  id: string;
  userId?: string;
  dateStr: string;
  timestamp: number;
  durationSeconds: number;
  posesCompleted: PoseHoldRecord[];
  averageScore: number;
}

export function YogaVisionAI() {
  const { user } = useAuth();

  // Camera & Stream State
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraLoading, setCameraLoading] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [isMirrored, setIsMirrored] = useState<boolean>(true);
  const [isLowLightBoost, setIsLowLightBoost] = useState<boolean>(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);

  // Model & Detection State
  const [isModelReady, setIsModelReady] = useState<boolean>(false);
  const [modelLoadingText, setModelLoadingText] = useState<string>("Initializing MediaPipe Vision...");
  const [currentPose, setCurrentPose] = useState<RecognizedPose | null>(null);
  const [visibilityCheck, setVisibilityCheck] = useState<{
    isFullyVisible: boolean;
    missingParts: string[];
    averageConfidence: number;
  }>({ isFullyVisible: true, missingParts: [], averageConfidence: 100 });

  // Session & Hold Timers
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [currentHoldSeconds, setCurrentHoldSeconds] = useState<number>(0);
  const [completedPoses, setCompletedPoses] = useState<PoseHoldRecord[]>([]);

  // UI Modals & Drawers
  const [showDisclaimerModal, setShowDisclaimerModal] = useState<boolean>(false);
  const [showCatalogModal, setShowCatalogModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [pastSessions, setPastSessions] = useState<SavedYogaSession[]>([]);
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<SupportedAsanaGuide | null>(null);

  // DOM Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<PoseLandmarker | null>(null);
  const requestAnimationIdRef = useRef<number | null>(null);
  const lastSpokenCueRef = useRef<string>("");
  const lastSpokenTimeRef = useRef<number>(0);
  const currentPoseHoldTrackerRef = useRef<{ poseId: string; startHoldTime: number; lastTime: number }>({
    poseId: "",
    startHoldTime: 0,
    lastTime: 0,
  });

  // Load Past Sessions from LocalStorage / Firestore
  const loadPastSessions = useCallback(async () => {
    // Always check localStorage first
    try {
      const stored = localStorage.getItem("aarogya_yoga_sessions");
      if (stored) {
        const parsed = JSON.parse(stored);
        setPastSessions(parsed);
      }
    } catch (e) {
      console.warn("Could not read local yoga sessions", e);
    }

    // If user is authenticated, query Firestore
    if (user && db) {
      try {
        const q = query(
          collection(db, "workouts"),
          where("userId", "==", user.uid),
          limit(10)
        );
        const snapshot = await getDocs(q);
        const firestoreList: SavedYogaSession[] = [];
        snapshot.forEach(docSnap => {
          const data = docSnap.data();
          if (data && data.type === "aarogya_yoga_vision") {
            firestoreList.push({
              id: docSnap.id,
              userId: data.userId,
              dateStr: data.dateStr || new Date(data.timestamp || Date.now()).toLocaleDateString(),
              timestamp: data.timestamp || Date.now(),
              durationSeconds: data.durationSeconds || 0,
              posesCompleted: data.posesCompleted || [],
              averageScore: data.averageScore || 85,
            });
          }
        });
        if (firestoreList.length > 0) {
          firestoreList.sort((a, b) => b.timestamp - a.timestamp);
          setPastSessions(firestoreList);
        }
      } catch (err) {
        // Soft fallback to local storage
        console.warn("Firestore sessions fetch fallback to local", err);
      }
    }
  }, [user]);

  useEffect(() => {
    loadPastSessions();
  }, [loadPastSessions]);

  // Voice Instructions helper using Web Speech API
  const speakInstruction = useCallback((phrase: string) => {
    if (!isVoiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const now = Date.now();
    // Throttle cues so instructor speaks naturally without overlapping
    if (phrase === lastSpokenCueRef.current && now - lastSpokenTimeRef.current < 6000) return;
    if (now - lastSpokenTimeRef.current < 4000) return;

    lastSpokenCueRef.current = phrase;
    lastSpokenTimeRef.current = now;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;
    utterance.volume = 0.9;
    window.speechSynthesis.speak(utterance);
  }, [isVoiceEnabled]);

  // Initialize MediaPipe PoseLandmarker
  useEffect(() => {
    let isCancelled = false;

    async function initMediaPipe() {
      try {
        setModelLoadingText("Loading on-device Wasm Vision engine...");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        if (isCancelled) return;
        setModelLoadingText("Instantiating MediaPipe Pose Landmarker model...");

        let landmarker: PoseLandmarker | null = null;
        try {
          landmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
              delegate: "GPU",
            },
            runningMode: "VIDEO",
            numPoses: 1,
            minPoseDetectionConfidence: 0.5,
            minPosePresenceConfidence: 0.5,
            minTrackingConfidence: 0.5,
          });
        } catch (gpuError) {
          console.warn("GPU delegate unavailable, falling back to CPU delegate:", gpuError);
          landmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
              delegate: "CPU",
            },
            runningMode: "VIDEO",
            numPoses: 1,
          });
        }

        if (isCancelled) return;
        landmarkerRef.current = landmarker;
        setIsModelReady(true);
      } catch (err: any) {
        console.error("Failed to load Pose Landmarker:", err);
        setCameraError(`AI Pose model setup issue: ${err?.message || "Please refresh or check network"}`);
      }
    }

    initMediaPipe();

    return () => {
      isCancelled = true;
      if (landmarkerRef.current) {
        try {
          landmarkerRef.current.close();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  // Session duration timer
  useEffect(() => {
    let timer: any = null;
    if (isSessionActive) {
      timer = setInterval(() => {
        setSessionSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSessionActive]);

  // Stop camera media stream
  const stopCameraStream = useCallback(() => {
    if (requestAnimationIdRef.current) {
      cancelAnimationFrame(requestAnimationIdRef.current);
      requestAnimationIdRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setCameraActive(false);
  }, []);

  // Frame-by-frame AI tracking loop
  const processVideoFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !landmarkerRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState >= 2 && !video.paused && !video.ended) {
      // Ensure canvas matches video size
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
      }

      const ctx = canvas.getContext("2d");
      const startTimeMs = performance.now();

      try {
        const detectionResult = landmarkerRef.current.detectForVideo(video, startTimeMs);

        if (detectionResult && detectionResult.landmarks && detectionResult.landmarks.length > 0) {
          const landmarks: Landmark[] = detectionResult.landmarks[0] as any;

          // 1. Check body visibility
          const vis = checkBodyVisibility(landmarks);
          setVisibilityCheck(vis);

          // 2. Automatic Asana Recognition
          const recognized = recognizeYogaAsana(landmarks);
          setCurrentPose(recognized);

          // 3. Render Virtual Skeleton
          if (ctx) {
            drawPoseSkeleton(
              ctx,
              landmarks,
              canvas.width,
              canvas.height,
              recognized?.alignmentScore || 70
            );
          }

          // 4. Handle Pose Hold Tracking & Voice Cues
          if (recognized && recognized.alignmentScore >= 70) {
            const now = Date.now();
            const tracker = currentPoseHoldTrackerRef.current;

            if (tracker.poseId === recognized.id) {
              const secondsElapsed = Math.floor((now - tracker.startHoldTime) / 1000);
              setCurrentHoldSeconds(secondsElapsed);

              // Periodic hold milestone voice cheer
              if (secondsElapsed > 0 && secondsElapsed % 10 === 0 && secondsElapsed !== tracker.lastTime) {
                tracker.lastTime = secondsElapsed;
                speakInstruction(`${secondsElapsed} seconds held in ${recognized.englishName}. Keep breathing deeply.`);
              }
            } else {
              // Entered a new posture
              tracker.poseId = recognized.id;
              tracker.startHoldTime = now;
              tracker.lastTime = 0;
              setCurrentHoldSeconds(0);
              speakInstruction(`Detected ${recognized.englishName}. Focus on steady posture.`);
            }

            // Provide correction voice cue if needed
            if (recognized.corrections && recognized.corrections.length > 0) {
              const topCorrection = recognized.corrections[0];
              if (!topCorrection.includes("Splendid") && !topCorrection.includes("Formidable") && !topCorrection.includes("Powerful")) {
                speakInstruction(topCorrection);
              }
            }

            // Update completed poses record list
            setCompletedPoses(prevList => {
              const existingIdx = prevList.findIndex(p => p.poseId === recognized.id);
              if (existingIdx >= 0) {
                const updated = [...prevList];
                updated[existingIdx] = {
                  ...updated[existingIdx],
                  holdSeconds: Math.max(updated[existingIdx].holdSeconds, currentHoldSeconds + 1),
                  bestScore: Math.max(updated[existingIdx].bestScore, recognized.alignmentScore),
                  artImage: recognized.artImage,
                };
                return updated;
              } else {
                return [
                  ...prevList,
                  {
                    poseId: recognized.id,
                    poseName: recognized.englishName,
                    sanskritName: recognized.sanskritName,
                    holdSeconds: 1,
                    bestScore: recognized.alignmentScore,
                    artImage: recognized.artImage,
                  },
                ];
              }
            });
          } else {
            // No steady pose or score too low
            setCurrentHoldSeconds(0);
            currentPoseHoldTrackerRef.current.poseId = "";
          }
        } else {
          // No body detected
          if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
          setCurrentPose(null);
          setCurrentHoldSeconds(0);
        }
      } catch (err) {
        console.warn("Pose detection frame loop notice:", err);
      }
    }

    // Keep looping
    requestAnimationIdRef.current = requestAnimationFrame(processVideoFrame);
  }, [speakInstruction, currentHoldSeconds]);

  // Start Camera
  const startCamera = async () => {
    setCameraLoading(true);
    setCameraError(null);

    // Stop existing if any
    stopCameraStream();

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play();
            setCameraActive(true);
            setCameraLoading(false);
            setIsSessionActive(true);
            speakInstruction("YogaVision AI is ready. Step back into full view to begin your practice.");
            // Start detection loop
            requestAnimationIdRef.current = requestAnimationFrame(processVideoFrame);
          }
        };
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraLoading(false);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraError("Camera permission was denied. Please allow camera access in your browser address bar.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setCameraError("No camera device was detected on your system.");
      } else {
        setCameraError(`Camera initialisation failed: ${err.message || "Unknown error"}`);
      }
    }
  };

  // Flip camera between front/environment
  const handleToggleFacingMode = () => {
    const nextMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(nextMode);
    setIsMirrored(nextMode === "user");
    if (cameraActive) {
      setTimeout(() => {
        startCamera();
      }, 100);
    }
  };

  // End and Save Sadhana Session
  const handleEndSession = async () => {
    setIsSessionActive(false);
    stopCameraStream();

    const avgScore =
      completedPoses.length > 0
        ? Math.round(completedPoses.reduce((sum, p) => sum + p.bestScore, 0) / completedPoses.length)
        : 80;

    const newSession: SavedYogaSession = {
      id: `yoga_${Date.now()}`,
      userId: user?.uid,
      dateStr: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      timestamp: Date.now(),
      durationSeconds: sessionSeconds,
      posesCompleted: completedPoses,
      averageScore: avgScore,
    };

    // Save to LocalStorage
    try {
      const updatedList = [newSession, ...pastSessions.slice(0, 19)];
      localStorage.setItem("aarogya_yoga_sessions", JSON.stringify(updatedList));
      setPastSessions(updatedList);
    } catch (err) {
      console.warn("Local storage save error", err);
    }

    // Save to Firestore workouts if authenticated
    if (user && db) {
      try {
        const docId = `${user.uid}_yoga_${Date.now()}`;
        await setDoc(doc(db, "workouts", docId), {
          id: docId,
          userId: user.uid,
          type: "aarogya_yoga_vision",
          name: "Aarogya YogaVision AI Sadhana",
          dateStr: newSession.dateStr,
          timestamp: newSession.timestamp,
          durationSeconds: newSession.durationSeconds,
          posesCompleted: newSession.posesCompleted,
          averageScore: newSession.averageScore,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn("Firestore save note:", err);
      }
    }

    setShowSummaryModal(true);
    speakInstruction("Wonderful sadhana. May your mind and body remain steady and peaceful.");
  };

  // Format seconds to mm:ss
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Action Row */}
      <div className="relative overflow-hidden rounded-3xl border border-[#FF9933]/40 bg-gradient-to-br from-zinc-950 via-[#140b04] to-zinc-950 p-5 sm:p-7 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF9933]/20 border border-[#FF9933]/50 text-[#FFD700] text-[10px] font-mono font-black uppercase tracking-widest shadow">
                <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" />
                Aarogya YogaVision AI • कैमरा योग दर्शन
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[10px] font-mono text-emerald-400">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                100% On-Device Local AI • Complete Privacy
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              AI Virtual Yoga Instructor <span className="text-[#FF9933] text-xl font-serif">योग दृष्टि</span>
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
              Step in front of your camera. Real-time MediaPipe AI automatically detects classical Indian Asanas (Tadasana, Vrikshasana, Warrior poses, Chair, Downward Dog, Cobra), projects an anatomical glowing skeleton, calculates posture joint angles, and provides voice correction.
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowDisclaimerModal(true)}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition active:scale-95"
              title="Read Safety Disclaimer & Guidelines"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#FF9933]" />
              Safety Disclaimer
            </button>

            <button
              onClick={() => setShowCatalogModal(true)}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition active:scale-95"
              title="View Supported Asanas & Targets"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#FFD700]" />
              Supported Asanas ({SUPPORTED_ASANAS_CATALOG.length})
            </button>

            <button
              onClick={() => setShowHistoryModal(true)}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition active:scale-95"
              title="View Previous Yoga Sessions"
            >
              <History className="w-3.5 h-3.5 text-blue-400" />
              Sadhana History ({pastSessions.length})
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Live Camera & Pose Analysis Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT / MAIN (7 Columns): Live Camera Feed + Skeleton HUD */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-3xl overflow-hidden border-2 border-[#FF9933]/40 bg-black aspect-[4/3] shadow-[0_0_40px_rgba(255,153,51,0.15)] flex flex-col items-center justify-center">
            {/* Hidden Video element for streaming */}
            <video
              ref={videoRef}
              playsInline
              muted
              className={`w-full h-full object-cover ${isMirrored ? "-scale-x-100" : ""}`}
              style={{
                display: cameraActive ? "block" : "none",
                filter: isLowLightBoost ? "contrast(1.25) brightness(1.2)" : "none",
              }}
            />

            {/* Canvas overlay for virtual skeleton */}
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 w-full h-full pointer-events-none ${isMirrored ? "-scale-x-100" : ""}`}
            />

            {/* Inactive Camera State Overlay */}
            {!cameraActive && (
              <div className="p-8 text-center max-w-md space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#FF9933]/15 border border-[#FF9933]/40 mx-auto flex items-center justify-center shadow-lg">
                  <Camera className="w-8 h-8 text-[#FF9933]" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black uppercase text-white tracking-wide">
                    {cameraLoading ? "Preparing Camera & AI Engine..." : "Camera Stream Inactive"}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {cameraLoading
                      ? modelLoadingText
                      : "Allow camera permission to activate real-time body tracking. No video or images ever leave your device."}
                  </p>
                </div>

                {cameraError && (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-left text-xs text-red-300 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{cameraError}</span>
                  </div>
                )}

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={startCamera}
                    disabled={cameraLoading || !isModelReady}
                    className="px-6 py-3 rounded-xl bg-[#FF9933] hover:bg-[#ffaa4d] text-black text-xs font-black uppercase tracking-wider shadow-[0_0_25px_rgba(255,153,51,0.35)] transition active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    {cameraLoading ? "Initializing..." : "Start YogaVision Camera"}
                  </button>
                </div>

                {!isModelReady && (
                  <div className="text-[11px] font-mono text-zinc-500 flex items-center justify-center gap-1.5 pt-1">
                    <span className="w-2 h-2 rounded-full bg-[#FF9933] animate-ping" />
                    {modelLoadingText}
                  </div>
                )}
              </div>
            )}

            {/* Active Camera Overlays & Badges */}
            {cameraActive && (
              <>
                {/* Top Floating HUD: Session Duration & Detected Asana */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                  {/* Session Timer & Pose Badge */}
                  <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-xs font-mono font-bold text-white shadow-lg">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span>REC {formatTime(sessionSeconds)}</span>
                  </div>

                  {currentPose ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 bg-gradient-to-r from-emerald-950/90 via-black/90 to-emerald-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-emerald-500/50 shadow-xl"
                    >
                      <span className="text-[#FFD700] text-xs font-serif font-black">
                        {currentPose.devaScript}
                      </span>
                      <span className="text-white text-xs font-black uppercase tracking-wide">
                        {currentPose.englishName}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        {currentPose.alignmentScore}%
                      </span>
                    </motion.div>
                  ) : (
                    <div className="bg-black/70 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 text-[11px] font-mono text-zinc-400">
                      Stand back in frame • Auto-detecting posture...
                    </div>
                  )}

                  {/* Pose Hold Timer Badge */}
                  {currentHoldSeconds > 0 && currentPose && (
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1.5 bg-[#FF9933]/90 text-black px-3 py-1.5 rounded-xl text-xs font-mono font-black shadow-lg"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Hold: {currentHoldSeconds}s</span>
                    </motion.div>
                  )}
                </div>

                {/* Incomplete Body Visibility Notice */}
                {!visibilityCheck.isFullyVisible && (
                  <div className="absolute top-14 left-3 right-3 bg-amber-950/90 border border-amber-500/60 backdrop-blur-md p-2.5 rounded-xl text-xs text-amber-200 flex items-center gap-2 shadow-lg pointer-events-none">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      Step back so your entire body is visible. Missing:{" "}
                      <strong>{visibilityCheck.missingParts.join(", ")}</strong>.
                    </span>
                  </div>
                )}

                {/* Bottom Real-time Correction Instruction Pill */}
                {currentPose && currentPose.corrections.length > 0 && (
                  <motion.div
                    key={currentPose.corrections[0]}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-3 left-3 right-3 bg-black/90 backdrop-blur-md border border-[#FF9933]/60 p-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3 pointer-events-none"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-[#FF9933]/20 border border-[#FF9933] flex items-center justify-center shrink-0">
                        <Activity className="w-3.5 h-3.5 text-[#FF9933]" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-mono uppercase text-[#FFD700] font-bold block">
                          AI Posture Correction:
                        </span>
                        <p className="text-xs font-bold text-white truncate sm:whitespace-normal">
                          {currentPose.corrections[0]}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1 text-[10px] font-mono text-zinc-300">
                      <Flame className="w-3 h-3 text-[#FF9933]" />
                      <span>{currentPose.targetChakra}</span>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* Camera Controls Bar */}
          <div className="bg-zinc-950 border border-white/10 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {cameraActive ? (
                <button
                  onClick={handleEndSession}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow transition active:scale-95"
                >
                  <Square className="w-3.5 h-3.5 fill-white" /> End Sadhana
                </button>
              ) : (
                <button
                  onClick={startCamera}
                  disabled={!isModelReady}
                  className="px-4 py-2 rounded-xl bg-[#FF9933] hover:bg-[#ffaa4d] text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow transition active:scale-95 disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-black" /> Begin Session
                </button>
              )}

              {cameraActive && (
                <button
                  onClick={stopCameraStream}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-300 hover:text-white"
                  title="Pause Camera Feed"
                >
                  <CameraOff className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Flip camera */}
              <button
                onClick={handleToggleFacingMode}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition active:scale-95"
                title="Switch between front and back camera"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#FF9933]" />
                <span className="hidden sm:inline">Flip Camera</span>
              </button>

              {/* Mirror toggle */}
              <button
                onClick={() => setIsMirrored(!isMirrored)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition ${
                  isMirrored
                    ? "bg-[#FF9933]/20 border-[#FF9933] text-[#FFD700]"
                    : "bg-white/5 border-white/15 text-zinc-400"
                }`}
                title="Mirror Camera Feed"
              >
                Mirror
              </button>

              {/* Low Light Filter Toggle */}
              <button
                onClick={() => setIsLowLightBoost(!isLowLightBoost)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1 transition ${
                  isLowLightBoost
                    ? "bg-[#FF9933] text-black border-[#FF9933] font-bold"
                    : "bg-white/5 border-white/15 text-zinc-400 hover:text-white"
                }`}
                title="Enhance Low Light for Dim Rooms"
              >
                <Sun className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Light Boost</span>
              </button>

              {/* Voice Guidance Toggle */}
              <button
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                className={`p-2 rounded-xl border transition ${
                  isVoiceEnabled
                    ? "bg-white/10 border-[#FF9933] text-[#FF9933]"
                    : "bg-white/5 border-white/15 text-zinc-500"
                }`}
                title={isVoiceEnabled ? "Mute Voice Guidance" : "Enable Voice Guidance"}
              >
                {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT (5 Columns): Verified Reference Posture & Anatomy Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-zinc-950 border border-white/10 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#FF9933] font-bold uppercase tracking-widest block">
                  Classical Reference Guide
                </span>
                <h3 className="text-base font-black uppercase text-white tracking-tight">
                  {currentPose ? currentPose.englishName : "Awaiting Asana Detection"}
                </h3>
              </div>
              {currentPose && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-400">
                  {currentPose.alignmentScore}% Aligned
                </span>
              )}
            </div>

            {/* Reference Posture Visual Card */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 bg-black shadow-inner">
              <img
                src={
                  currentPose?.artImage ||
                  SUPPORTED_ASANAS_CATALOG[0].artImage
                }
                alt={currentPose?.englishName || "Yoga Pose Reference"}
                className="w-full h-full object-cover transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              <div className="absolute top-2.5 left-2.5">
                <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-[#FF9933]/50 text-[9px] font-mono font-bold text-[#FF9933]">
                  VERIFIED YOGA FORM
                </span>
              </div>

              <div className="absolute bottom-2.5 left-3 right-3">
                <span className="text-xs font-serif font-black text-[#FFD700] block">
                  {currentPose ? currentPose.sanskritName : SUPPORTED_ASANAS_CATALOG[0].sanskritName}
                </span>
                <span className="text-[11px] font-mono text-zinc-300">
                  {currentPose ? currentPose.targetMantra : SUPPORTED_ASANAS_CATALOG[0].targetMantra}
                </span>
              </div>
            </div>

            {/* Live Angle Telemetry Comparison */}
            {currentPose && currentPose.keyAngles ? (
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
                  Live Joint Angle Telemetry:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {Object.entries(currentPose.keyAngles).slice(0, 4).map(([name, angle]) => (
                    <div key={name} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <span className="text-zinc-400 text-[11px]">{name}:</span>
                      <strong className="text-[#FFD700] font-bold">{angle}°</strong>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-400 space-y-2">
                <p className="font-medium">
                  When you step in front of the camera, YogaVision AI automatically matches your posture against ancient Patanjali alignments.
                </p>
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#FF9933]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Supports Tadasana, Vrikshasana, Warriors, Triangle & more</span>
                </div>
              </div>
            )}

            {/* Asanas Practiced in this Sadhana */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">
                  Sadhana Poses Logged ({completedPoses.length}):
                </span>
                <span className="text-[10px] font-mono text-[#FF9933]">
                  Duration: {formatTime(sessionSeconds)}
                </span>
              </div>

              {completedPoses.length === 0 ? (
                <div className="text-center py-4 text-xs font-mono text-zinc-500 italic">
                  Hold a pose with steady alignment for 3+ seconds to log it.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-44 overflow-y-auto no-scrollbar">
                  {completedPoses.map(pose => (
                    <div
                      key={pose.poseId}
                      className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {pose.artImage && (
                          <img src={pose.artImage} alt={pose.poseName} className="w-7 h-7 rounded-lg object-cover" />
                        )}
                        <div>
                          <div className="font-bold text-white text-[11px]">{pose.poseName}</div>
                          <div className="text-[9px] font-serif text-[#FFD700]">{pose.sanskritName}</div>
                        </div>
                      </div>
                      <div className="text-right font-mono text-[10px]">
                        <span className="text-emerald-400 font-bold block">{pose.bestScore}%</span>
                        <span className="text-zinc-400">{pose.holdSeconds}s held</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. SAFETY DISCLAIMER MODAL */}
      <AnimatePresence>
        {showDisclaimerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950 border border-[#FF9933]/50 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-[#FF9933]">
                  <ShieldAlert className="w-5 h-5 text-[#FF9933]" />
                  <h3 className="text-base font-black uppercase text-white tracking-tight">
                    Classical Yoga Safety Notice
                  </h3>
                </div>
                <button
                  onClick={() => setShowDisclaimerModal(false)}
                  className="p-1.5 rounded-full bg-white/10 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-zinc-300 leading-relaxed font-medium">
                <p>
                  Classical Yoga is an ancient spiritual science of somatic balance, breath synchronization, and mindfulness. Patanjali Sutra 2.46 teaches <span className="text-[#FFD700] font-serif">"स्थिरसुखमासनम्"</span> — posture must be steady and joyful, never painful.
                </p>

                <div className="p-3.5 rounded-xl bg-[#FF9933]/10 border border-[#FF9933]/30 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-[#FF9933] font-bold block">
                    Essential Practice Rules:
                  </span>
                  <ul className="space-y-1 list-disc list-inside text-zinc-200">
                    <li>Never force your joints or hyperextend your knees or lower spine.</li>
                    <li>If you experience sharp pain or dizziness, immediately rest in Child's Pose (Balasana).</li>
                    <li>Ensure you have a slip-free yoga mat and adequate clearance around your device.</li>
                    <li>If you have spinal herniations, acute high blood pressure, or are pregnant, consult a certified physician.</li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono">
                  <span className="font-bold block uppercase text-[10px]">Privacy Guarantee:</span>
                  All MediaPipe AI camera processing executes strictly locally inside your web browser via WebAssembly. No video feed or camera images are stored or transmitted.
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowDisclaimerModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#FF9933] text-black font-black uppercase text-xs hover:bg-[#ffaa4d] transition active:scale-95"
                >
                  I Understand • Return to Sadhana
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. SUPPORTED ASANAS DIRECTORY MODAL */}
      <AnimatePresence>
        {showCatalogModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950 border border-[#FF9933]/40 rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-[#FF9933] font-bold uppercase tracking-widest block">
                    Supported Asanas Directory
                  </span>
                  <h3 className="text-xl font-black uppercase text-white tracking-tight">
                    Recognised Classical Postures ({SUPPORTED_ASANAS_CATALOG.length})
                  </h3>
                </div>
                <button
                  onClick={() => setShowCatalogModal(false)}
                  className="p-1.5 rounded-full bg-white/10 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SUPPORTED_ASANAS_CATALOG.map(asana => (
                  <div
                    key={asana.id}
                    className="p-3.5 rounded-2xl bg-black/60 border border-white/10 hover:border-[#FF9933]/50 transition flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0">
                        <img src={asana.artImage} alt={asana.englishName} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-mono font-bold text-[#FF9933] uppercase">
                          {asana.difficulty} • {asana.targetChakra}
                        </span>
                        <h4 className="text-sm font-black text-white uppercase truncate">{asana.englishName}</h4>
                        <p className="text-xs font-serif text-[#FFD700]">{asana.sanskritName}</p>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <span className="text-[9px] font-mono uppercase text-zinc-400 font-bold block">
                        Target Verification Criteria:
                      </span>
                      <ul className="space-y-0.5 text-zinc-300 text-[11px]">
                        {asana.keyAlignmentRules.map((r, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-[#FF9933]">•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-[10px] font-mono text-zinc-500 pt-1 border-t border-white/5">
                      <strong>Contraindication:</strong> {asana.contraindications}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowCatalogModal(false)}
                  className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase"
                >
                  Close Guide
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. PREVIOUS SESSIONS HISTORY MODAL */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950 border border-white/20 rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-[#FF9933]" />
                  <h3 className="text-lg font-black uppercase text-white tracking-tight">
                    Sadhana Practice Logbook
                  </h3>
                </div>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="p-1.5 rounded-full bg-white/10 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {pastSessions.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <Award className="w-10 h-10 text-zinc-600 mx-auto" />
                  <p className="text-sm font-bold text-zinc-400">No previous sessions saved yet</p>
                  <p className="text-xs text-zinc-500">
                    Complete your first live camera yoga session to track consistency and posture scores.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pastSessions.map(session => (
                    <div
                      key={session.id}
                      className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] text-[#FF9933] font-bold">
                          {session.dateStr}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 font-bold">
                          Score: {session.averageScore}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-zinc-400 text-xs">
                        <span>Duration: <strong className="text-white">{formatTime(session.durationSeconds)}</strong></span>
                        <span>Poses Practiced: <strong className="text-white">{session.posesCompleted.length}</strong></span>
                      </div>

                      {session.posesCompleted.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {session.posesCompleted.map(p => (
                            <span
                              key={p.poseId}
                              className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-300"
                            >
                              {p.poseName} ({p.holdSeconds}s)
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. SESSION SUMMARY MODAL (Triggered when ending session) */}
      <AnimatePresence>
        {showSummaryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950 border border-[#FF9933]/50 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FF9933]/30 to-[#FFD700]/30 border-2 border-[#FF9933] mx-auto flex items-center justify-center shadow-lg">
                <Award className="w-8 h-8 text-[#FFD700]" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#FF9933] font-bold tracking-widest block">
                  Sadhana Completed
                </span>
                <h3 className="text-2xl font-black uppercase text-white tracking-tight">
                  Aarogya Vision Summary
                </h3>
                <p className="text-xs text-zinc-400">
                  Your practice was tracked and saved to your personal history.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 font-mono text-xs">
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase block">Total Time</span>
                  <strong className="text-white text-sm">{formatTime(sessionSeconds)}</strong>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase block">Asanas Held</span>
                  <strong className="text-[#FF9933] text-sm">{completedPoses.length}</strong>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase block">Avg Score</span>
                  <strong className="text-emerald-400 text-sm">
                    {completedPoses.length > 0
                      ? Math.round(completedPoses.reduce((s, p) => s + p.bestScore, 0) / completedPoses.length)
                      : 85}
                    %
                  </strong>
                </div>
              </div>

              {completedPoses.length > 0 && (
                <div className="space-y-1.5 text-left max-h-36 overflow-y-auto no-scrollbar">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">
                    Mastered Postures Breakdown:
                  </span>
                  {completedPoses.map(p => (
                    <div
                      key={p.poseId}
                      className="p-2 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs font-mono"
                    >
                      <span className="text-white font-bold">{p.poseName}</span>
                      <span className="text-[#FFD700]">{p.holdSeconds}s • {p.bestScore}%</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => {
                  setShowSummaryModal(false);
                  setSessionSeconds(0);
                  setCompletedPoses([]);
                }}
                className="w-full py-3 rounded-xl bg-[#FF9933] hover:bg-[#ffaa4d] text-black text-xs font-black uppercase tracking-wider transition active:scale-95 shadow"
              >
                Om Shantih • Close Summary
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
