import { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Send,
  Bot,
  User,
  Loader2,
  Mic,
  ExternalLink,
  Volume2,
  VolumeX,
  Languages,
  ChevronDown,
  Check,
  Copy,
  RotateCcw,
  Zap,
  Apple,
  Dumbbell,
  HeartPulse,
  Headphones,
  Sparkles
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";
import Markdown from "react-markdown";

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  voicePrefix: string;
  greeting: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en-US", name: "English", nativeName: "English (US)", flag: "🇺🇸", voicePrefix: "en", greeting: "Hi! I'm MEM, your personal fitness and wellness AI coach. How can I help you crush your goals today?" },
  { code: "es-ES", name: "Spanish", nativeName: "Español", flag: "🇪🇸", voicePrefix: "es", greeting: "¡Hola! Soy MEM, tu asistente de fitness y bienestar. ¿Cómo puedo ayudarte a alcanzar tus metas hoy?" },
  { code: "fr-FR", name: "French", nativeName: "Français", flag: "🇫🇷", voicePrefix: "fr", greeting: "Bonjour ! Je suis MEM, ton coach de fitness et bien-être. Comment puis-je t'aider aujourd'hui ?" },
  { code: "de-DE", name: "German", nativeName: "Deutsch", flag: "🇩🇪", voicePrefix: "de", greeting: "Hallo! Ich bin MEM, dein persönlicher Fitness- und Wellness-Assistent. Wie kann ich dir heute helfen?" },
  { code: "hi-IN", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", voicePrefix: "hi", greeting: "नमस्ते! मैं MEM हूँ, आपका फिटनेस और वेलनेस AI कोच। आज मैं आपकी क्या मदद कर सकता हूँ?" },
  { code: "pt-BR", name: "Portuguese", nativeName: "Português", flag: "🇧🇷", voicePrefix: "pt", greeting: "Olá! Sou o MEM, seu assistente de fitness e bem-estar. Como posso ajudar você a atingir seus objetivos hoje?" },
  { code: "it-IT", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", voicePrefix: "it", greeting: "Ciao! Sono MEM, il tuo coach di fitness e benessere. Come posso aiutarti a raggiungere i tuoi obiettivi oggi?" },
  { code: "ja-JP", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", voicePrefix: "ja", greeting: "こんにちは！MEMです。あなたの専属フィットネス＆ウェルネスAIコーチです。本日の目標は何ですか？" },
  { code: "zh-CN", name: "Chinese", nativeName: "简体中文", flag: "🇨🇳", voicePrefix: "zh", greeting: "你好！我是MEM，你的专属健身与健康AI助手。今天有什么我可以帮你的？" },
  { code: "ko-KR", name: "Korean", nativeName: "한국어", flag: "🇰🇷", voicePrefix: "ko", greeting: "안녕하세요! 저는 피트니스 & 웰니스 AI 코치 MEM입니다. 오늘 어떤 목표를 함께 달성해볼까요?" },
  { code: "ar-SA", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", voicePrefix: "ar", greeting: "مرحباً! أنا MEM، مدربك الذكي للياقة البدنية والصحة. كيف يمكنني مساعدتك اليوم؟" },
  { code: "ru-RU", name: "Russian", nativeName: "Русский", flag: "🇷🇺", voicePrefix: "ru", greeting: "Привет! Я MEM, твой персональный AI-тренер по фитнесу и здоровью. Чем я могу помочь тебе сегодня?" },
  { code: "nl-NL", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱", voicePrefix: "nl", greeting: "Hallo! Ik ben MEM, je persoonlijke fitness- en wellnesscoach. Waar kan ik je vandaag mee helpen?" },
  { code: "tr-TR", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷", voicePrefix: "tr", greeting: "Merhaba! Ben MEM, kişisel fitness ve sağlık koçun. Bugün hedeflerine ulaşman için ne yapabiliriz?" },
];

type GroundingChunk = {
  title?: string;
  uri?: string;
  web?: { uri: string; title: string };
};

type Message = {
  id?: string;
  role: "user" | "model";
  parts: { text: string }[];
  groundingChunks?: GroundingChunk[];
  timestamp?: string;
};

// Clean, curated question suggestions
const QUICK_PROMPTS = [
  { icon: Zap, text: "15-minute fat-burning HIIT home workout" },
  { icon: Apple, text: "Calculate my daily calories and protein target" },
  { icon: Dumbbell, text: "Push day gym routine for chest and triceps" },
  { icon: HeartPulse, text: "Relieve lower back tightness and stiff hips" },
];

function cleanMarkdownForSpeech(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_#`~>]/g, "")
    .replace(/[-+*]\s+/g, ". ")
    .replace(/\n+/g, ". ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatCurrentTime(): string {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<LanguageOption>(() => {
    const saved = localStorage.getItem("mem_voice_lang");
    if (saved) {
      const found = SUPPORTED_LANGUAGES.find(l => l.code === saved);
      if (found) return found;
    }
    return SUPPORTED_LANGUAGES[0];
  });

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [searchLang, setSearchLang] = useState("");
  const [viewMode, setViewMode] = useState<"chat" | "voice-hud">("chat");
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-greeting",
      role: "model",
      parts: [{ text: "Hi! I'm MEM, your personal fitness and wellness AI coach. How can I help you crush your goals today?" }],
      timestamp: formatCurrentTime()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Voice Recognition State
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState("");
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Speech Synthesis State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSpeakingMsgId, setActiveSpeakingMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, speechTranscript, isLoading]);

  const handleSelectLanguage = (lang: LanguageOption) => {
    setSelectedLang(lang);
    localStorage.setItem("mem_voice_lang", lang.code);
    setIsLangMenuOpen(false);
    setSearchLang("");

    if (messages.length <= 1) {
      setMessages([
        {
          id: `greet-${lang.code}-${Date.now()}`,
          role: "model",
          parts: [{ text: lang.greeting }],
          timestamp: formatCurrentTime()
        }
      ]);
    } else {
      setMessages(prev => [
        ...prev,
        {
          id: `lang-switched-${Date.now()}`,
          role: "model",
          parts: [{ text: `🌐 Language switched to **${lang.flag} ${lang.name}**.` }],
          timestamp: formatCurrentTime()
        }
      ]);
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setActiveSpeakingMsgId(null);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => {
      setCopiedMsgId(null);
    }, 2000);
  };

  const handleClearConversation = () => {
    stopSpeaking();
    stopListening();
    setMessages([
      {
        id: `greet-${selectedLang.code}-${Date.now()}`,
        role: "model",
        parts: [{ text: selectedLang.greeting }],
        timestamp: formatCurrentTime()
      }
    ]);
  };

  // TTS Speech Logic
  const speakText = useCallback((text: string, msgId?: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    if (isSpeaking && activeSpeakingMsgId === msgId) {
      setIsSpeaking(false);
      setActiveSpeakingMsgId(null);
      return;
    }

    const cleanText = cleanMarkdownForSpeech(text);
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = selectedLang.code;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => 
      v.lang.toLowerCase() === selectedLang.code.toLowerCase() ||
      v.lang.toLowerCase().startsWith(selectedLang.voicePrefix.toLowerCase())
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      if (msgId) setActiveSpeakingMsgId(msgId);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setActiveSpeakingMsgId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setActiveSpeakingMsgId(null);
    };

    window.speechSynthesis.speak(utterance);
  }, [selectedLang, isSpeaking, activeSpeakingMsgId]);

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setActiveSpeakingMsgId(null);
  };

  // Submit Message to Backend API
  const handleSubmitMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isLoading) return;

    stopSpeaking();

    const userMsg: Message = { 
      id: `user-${Date.now()}`, 
      role: "user", 
      parts: [{ text }],
      timestamp: formatCurrentTime()
    };
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    setInput("");
    setSpeechTranscript("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          language: selectedLang.name
        }),
      });
      
      const data = await response.json();
      const replyMsgId = `model-${Date.now()}`;
      
      if (data && data.text) {
        setMessages([...newMessages, { 
          id: replyMsgId, 
          role: "model", 
          parts: [{ text: data.text }], 
          groundingChunks: data.groundingChunks,
          timestamp: formatCurrentTime()
        }]);
        if (autoSpeak || viewMode === "voice-hud") {
          speakText(data.text, replyMsgId);
        }
      } else if (data && data.error) {
        const errorText = `I am momentarily recalibrating. Please try asking again in a moment.`;
        setMessages([...newMessages, { 
          id: replyMsgId, 
          role: "model", 
          parts: [{ text: errorText }],
          timestamp: formatCurrentTime()
        }]);
      } else {
        const fallbackText = "I'm ready to help you optimize your training and recovery! Please ask your question again.";
        setMessages([...newMessages, { 
          id: replyMsgId, 
          role: "model", 
          parts: [{ text: fallbackText }],
          timestamp: formatCurrentTime()
        }]);
      }
    } catch (error) {
      console.warn("Chat error:", error);
      const connErrText = `I'm having trouble connecting right now. Please check your connection and try again.`;
      setMessages([...newMessages, { 
        id: `err-${Date.now()}`, 
        role: "model", 
        parts: [{ text: connErrText }],
        timestamp: formatCurrentTime()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    handleSubmitMessage(input);
  };

  // Voice Recognition
  const startListening = () => {
    stopSpeaking();
    setSpeechError(null);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError("Speech recognition is not supported in this browser.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLang.code;
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechTranscript("");
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setSpeechTranscript(currentTranscript);
        setInput(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        if (event.error !== "no-speech") {
          setSpeechError(`Voice error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setSpeechError("Could not access microphone.");
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      if (speechTranscript.trim()) {
        handleSubmitMessage(speechTranscript);
      }
    } else {
      startListening();
    }
  };

  useEffect(() => {
    return () => {
      stopListening();
      stopSpeaking();
    };
  }, []);

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(
    l => l.name.toLowerCase().includes(searchLang.toLowerCase()) ||
         l.nativeName.toLowerCase().includes(searchLang.toLowerCase())
  );

  return (
    <>
      {/* FLOATING TRIGGER BUTTON - ATTRACTIVE WITH MOTION GESTURES */}
      <div className={cn(
        "fixed bottom-6 right-6 z-50 transition-all duration-300",
        isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
      )}>
        <motion.button
          onClick={() => setIsOpen(true)}
          animate={{ y: [0, -5, 0] }}
          transition={{
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
          whileHover={{
            scale: 1.12,
            y: -7,
            transition: { type: "spring", stiffness: 450, damping: 17 }
          }}
          whileTap={{
            scale: 0.9,
            y: 1,
            transition: { type: "spring", stiffness: 500, damping: 20 }
          }}
          className="relative group w-13 h-13 sm:w-14 sm:h-14 p-[2.5px] rounded-full bg-gradient-to-br from-[#CCFF00] via-emerald-400 to-[#CCFF00] shadow-[0_4px_25px_rgba(0,0,0,0.8),0_0_20px_rgba(204,255,0,0.4)] hover:shadow-[0_6px_35px_rgba(204,255,0,0.7)] transition-shadow duration-300 cursor-pointer select-none flex items-center justify-center"
          title="Open MEM AI Coach"
          aria-label="Open MEM AI Coach"
        >
          {/* Ambient Glowing Halo */}
          <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#CCFF00]/40 to-emerald-400/30 blur-md opacity-70 group-hover:opacity-100 group-hover:blur-lg transition-all duration-300 pointer-events-none"></span>

          {/* Button Core - Just Face Icon */}
          <div className="relative z-10 w-full h-full rounded-full bg-zinc-950/95 border border-white/10 flex items-center justify-center overflow-hidden">
            {/* Shimmer Light Reflection Sweep */}
            <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />

            {/* Coach Bot Face */}
            <div className="relative flex items-center justify-center group-hover:rotate-6 transition-transform duration-200">
              <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-[#CCFF00] stroke-[2.3]" />
            </div>

            {/* Online Pulse Beacon Dot */}
            <span className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full bg-black border border-[#CCFF00] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-ping"></span>
            </span>
          </div>
        </motion.button>
      </div>

      {/* CHAT MODAL - ORGANIZED, SIMPLE & PRESENTABLE */}
      <div
        className={cn(
          "fixed bottom-4 sm:bottom-6 right-3 sm:right-6 w-[calc(100vw-24px)] sm:w-[420px] h-[580px] max-h-[85vh] bg-[#0E1015] border border-white/10 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right z-50 overflow-hidden",
          isOpen ? "scale-100 opacity-100" : "scale-50 opacity-0 pointer-events-none"
        )}
      >
        {/* CSS SELECTOR 1 TARGET: TOP HEADER (Clean single-tier header) */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-zinc-950/80 backdrop-blur-md">
          {/* Coach Identity */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-lg bg-zinc-900 border border-white/15 flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#CCFF00]" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#CCFF00]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <h3 className="text-sm font-bold text-white">MEM Coach</h3>
                <span className="text-[9px] font-bold text-[#CCFF00] bg-[#CCFF00]/10 px-1 py-0.5 rounded">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 leading-none">
                {isListening ? "Listening..." : isSpeaking ? "Speaking..." : "Fitness & Wellness"}
              </p>
            </div>
          </div>

          {/* Clean Action Toolbar */}
          <div className="flex items-center gap-1">
            {/* Hands-free Voice HUD Toggle */}
            <button
              onClick={() => {
                if (viewMode === "chat") {
                  setViewMode("voice-hud");
                  if (!isListening) startListening();
                } else {
                  setViewMode("chat");
                }
              }}
              className={cn(
                "p-1.5 rounded-lg text-xs transition-colors cursor-pointer",
                viewMode === "voice-hud"
                  ? "bg-[#CCFF00] text-black font-bold"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
              title={viewMode === "voice-hud" ? "Return to chat" : "Voice HUD"}
            >
              <Headphones className="w-4 h-4" />
            </button>

            {/* Audio Readout Switcher */}
            <button
              onClick={() => {
                const nextVal = !autoSpeak;
                setAutoSpeak(nextVal);
                if (!nextVal) stopSpeaking();
              }}
              className={cn(
                "p-1.5 rounded-lg text-xs transition-colors cursor-pointer",
                autoSpeak ? "text-[#CCFF00] hover:bg-white/5" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
              )}
              title={autoSpeak ? "Audio readout: ON" : "Audio readout: OFF"}
            >
              {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Compact Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="px-2 py-1.5 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-white/5 flex items-center gap-1 transition-colors cursor-pointer"
                title="Change language"
              >
                <span>{selectedLang.flag}</span>
                <span className="text-[10px] font-bold uppercase">{selectedLang.code.split("-")[0]}</span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-zinc-950 border border-white/15 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <input
                    type="text"
                    value={searchLang}
                    onChange={(e) => setSearchLang(e.target.value)}
                    placeholder="Search language..."
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#CCFF00] mb-1.5"
                    autoFocus
                  />
                  <div className="max-h-48 overflow-y-auto space-y-0.5 no-scrollbar">
                    {filteredLanguages.map((lang) => {
                      const isCurrent = lang.code === selectedLang.code;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => handleSelectLanguage(lang)}
                          className={cn(
                            "w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left text-xs transition-colors cursor-pointer",
                            isCurrent
                              ? "bg-[#CCFF00] text-black font-bold"
                              : "text-zinc-300 hover:bg-white/10 hover:text-white"
                          )}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span>{lang.flag}</span>
                            <span className="truncate">{lang.name}</span>
                          </div>
                          {isCurrent && <Check className="w-3.5 h-3.5 text-black" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Clear Conversation */}
            <button
              onClick={handleClearConversation}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              title="Clear conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={() => {
                setIsOpen(false);
                stopSpeaking();
                stopListening();
              }}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              title="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* FULLSCREEN VOICE HUD MODE */}
        {viewMode === "voice-hud" ? (
          <div className="flex-1 flex flex-col bg-zinc-950 p-6 items-center justify-between">
            <div className="w-full flex items-center justify-between">
              <button
                onClick={() => setViewMode("chat")}
                className="text-xs font-semibold text-zinc-400 hover:text-white transition cursor-pointer"
              >
                &larr; Back to text
              </button>
              <span className="text-xs font-medium text-zinc-400">
                {selectedLang.flag} {selectedLang.name}
              </span>
            </div>

            <div className="flex flex-col items-center my-auto text-center">
              <button
                onClick={toggleListening}
                className={cn(
                  "w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer border-2",
                  isListening
                    ? "bg-[#CCFF00] border-white text-black scale-105 shadow-[0_0_40px_rgba(204,255,0,0.6)]"
                    : isSpeaking
                    ? "bg-cyan-400 border-white text-black scale-105 shadow-[0_0_40px_rgba(34,211,238,0.6)]"
                    : "bg-zinc-900 border-[#CCFF00]/40 text-[#CCFF00] hover:scale-105"
                )}
              >
                {isListening ? (
                  <span className="text-xs font-bold uppercase tracking-wider">Listening...</span>
                ) : isSpeaking ? (
                  <Volume2 className="w-8 h-8 animate-pulse" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </button>

              <div className="mt-6 space-y-1">
                <h4 className="text-sm font-bold text-white">
                  {isListening ? "Listening..." : isSpeaking ? "Responding..." : "Tap to speak"}
                </h4>
                <p className="text-xs text-zinc-400 max-w-xs">
                  Ask any fitness, nutrition, or workout question.
                </p>
              </div>

              {(speechTranscript || speechError) && (
                <div className="mt-4 p-3 rounded-xl bg-zinc-900 border border-white/10 max-w-xs w-full text-xs text-zinc-300">
                  {speechError ? (
                    <span className="text-red-400">{speechError}</span>
                  ) : (
                    <p className="italic">"{speechTranscript}"</p>
                  )}
                </div>
              )}
            </div>

            <div className="w-full flex items-center justify-between pt-3 border-t border-white/10 text-xs">
              <button
                onClick={() => {
                  stopSpeaking();
                  stopListening();
                }}
                className="text-zinc-400 hover:text-white transition cursor-pointer"
              >
                Mute
              </button>
              <button
                onClick={() => {
                  const lastModelMsg = [...messages].reverse().find(m => m.role === "model");
                  if (lastModelMsg?.parts[0]?.text) {
                    speakText(lastModelMsg.parts[0].text, lastModelMsg.id);
                  }
                }}
                disabled={isSpeaking}
                className="text-[#CCFF00] hover:underline disabled:opacity-40 transition cursor-pointer font-medium"
              >
                Replay Answer
              </button>
            </div>
          </div>
        ) : (
          /* STANDARD CHAT MODE */
          <>
            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
              {messages.map((msg, i) => {
                const isModel = msg.role === "model";
                const isCurrentlyPlaying = isSpeaking && activeSpeakingMsgId === msg.id;
                const isCopied = copiedMsgId === msg.id;

                return (
                  <div
                    key={msg.id || i}
                    className={cn(
                      "flex gap-2.5 max-w-[90%]",
                      msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                    )}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold",
                        msg.role === "user"
                          ? "bg-zinc-800 text-zinc-300 border border-white/10"
                          : "bg-[#CCFF00] text-black"
                      )}
                    >
                      {msg.role === "user" ? (
                        <User className="w-3.5 h-3.5" />
                      ) : (
                        <Bot className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div className="flex flex-col space-y-1">
                      <div
                        className={cn(
                          "px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed",
                          msg.role === "user"
                            ? "bg-[#CCFF00] text-black font-semibold rounded-tr-xs"
                            : "bg-zinc-900 border border-white/10 text-zinc-100 rounded-tl-xs markdown-body"
                        )}
                      >
                        <Markdown>{msg.parts[0].text}</Markdown>

                        {/* Grounded Web Sources */}
                        {msg.groundingChunks && msg.groundingChunks.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap gap-1">
                            {msg.groundingChunks.map((chunk, cIdx) => {
                              const url = chunk.uri || chunk.web?.uri || "#";
                              const title = chunk.title || chunk.web?.title || `Source ${cIdx + 1}`;
                              return (
                                <a
                                  key={cIdx}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 text-[10px] text-zinc-400 hover:text-[#CCFF00] transition truncate max-w-[200px]"
                                >
                                  <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                  <span className="truncate">{title}</span>
                                </a>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Quiet, clean message footer */}
                      {isModel && (
                        <div className="flex items-center gap-2 px-1 text-[10px] text-zinc-500">
                          <button
                            onClick={() => speakText(msg.parts[0].text, msg.id)}
                            className="flex items-center gap-1 hover:text-white transition cursor-pointer"
                            title="Listen"
                          >
                            {isCurrentlyPlaying ? (
                              <>
                                <VolumeX className="w-3 h-3 text-[#CCFF00]" />
                                <span className="text-[#CCFF00]">Stop</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3" />
                                <span>Listen</span>
                              </>
                            )}
                          </button>

                          <span>•</span>

                          <button
                            onClick={() => handleCopyText(msg.parts[0].text, msg.id || `${i}`)}
                            className="flex items-center gap-1 hover:text-white transition cursor-pointer"
                            title="Copy"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3 h-3 text-[#CCFF00]" />
                                <span className="text-[#CCFF00]">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          {msg.timestamp && (
                            <span className="ml-auto text-[9px] text-zinc-600">{msg.timestamp}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Loading State */}
              {isLoading && (
                <div className="flex gap-2.5 max-w-[85%]">
                  <div className="w-6 h-6 rounded-md bg-[#CCFF00] text-black flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-xs bg-zinc-900 border border-white/10 text-white flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#CCFF00]" />
                    <span className="text-xs text-zinc-400">Thinking...</span>
                  </div>
                </div>
              )}

              {/* CSS SELECTOR 2 TARGET: PROMPTS AREA (Organized, clean, simple vertical list) */}
              {messages.length <= 1 && (
                <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                  <p className="text-[11px] font-semibold text-zinc-400 px-1">
                    Suggested questions
                  </p>

                  <div className="flex flex-col gap-1.5">
                    {QUICK_PROMPTS.map((prompt, idx) => {
                      const IconComponent = prompt.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSubmitMessage(prompt.text)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/5 hover:border-[#CCFF00]/40 transition text-left group cursor-pointer"
                        >
                          <div className="w-6 h-6 rounded-md bg-black/40 flex items-center justify-center text-[#CCFF00] shrink-0">
                            <IconComponent className="w-3 h-3" />
                          </div>
                          <span className="text-xs text-zinc-300 group-hover:text-white transition-colors truncate">
                            {prompt.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Listening Banner */}
            {isListening && (
              <div className="px-3 py-1.5 bg-zinc-900 border-t border-[#CCFF00]/30 flex items-center justify-between text-xs">
                <span className="text-[#CCFF00] truncate">
                  Listening ({selectedLang.name}): {speechTranscript || "..."}
                </span>
                <button
                  onClick={() => {
                    stopListening();
                    setSpeechTranscript("");
                  }}
                  className="text-zinc-400 hover:text-white text-[10px] uppercase font-bold"
                >
                  Cancel
                </button>
              </div>
            )}

            {speechError && (
              <div className="px-3 py-1 bg-red-950/80 border-t border-red-500/30 text-[11px] text-red-300 flex items-center justify-between">
                <span>{speechError}</span>
                <button onClick={() => setSpeechError(null)} className="text-xs text-red-400">✕</button>
              </div>
            )}

            {/* CSS SELECTOR 3 TARGET: BOTTOM FORM (Unified, simple & presentable input) */}
            <form onSubmit={handleFormSubmit} className="p-3 border-t border-white/10 bg-zinc-950">
              <div className="flex items-center gap-1.5 bg-zinc-900 border border-white/10 focus-within:border-[#CCFF00]/60 rounded-xl px-2 py-1 transition-all">
                {/* Voice Input Mic */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={cn(
                    "p-2 rounded-lg transition-colors cursor-pointer shrink-0",
                    isListening
                      ? "bg-[#CCFF00] text-black"
                      : "text-zinc-400 hover:text-[#CCFF00]"
                  )}
                  title={isListening ? "Stop listening" : "Voice input"}
                >
                  <Mic className={cn("w-4 h-4", isListening && "animate-pulse")} />
                </button>

                {/* Input Text Box */}
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask MEM Coach in ${selectedLang.name}...`}
                  className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none py-1.5 px-1"
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-[#CCFF00] text-black rounded-lg disabled:opacity-20 disabled:cursor-not-allowed hover:bg-[#b3ff00] transition-colors cursor-pointer shrink-0"
                  title="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
}
