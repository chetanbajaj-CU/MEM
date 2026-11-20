import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  AdminMessage, 
  subscribeToUserMessages, 
  markMessageAsRead, 
  deleteNotificationForUser,
  openMemberInboxModal 
} from "../lib/adminMessages";
import { 
  Bell, 
  X, 
  Shield, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  ExternalLink,
  Sparkles,
  Volume2,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function NotificationBar() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedModalMessage, setSelectedModalMessage] = useState<AdminMessage | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [hasNewAlert, setHasNewAlert] = useState(false);

  useEffect(() => {
    if (!user) {
      setMessages([]);
      return;
    }

    let prevCount = -1;

    const unsubscribe = subscribeToUserMessages(user, (userMsgs) => {
      // Filter for unread messages only
      const unread = userMsgs.filter(m => !(m.readBy || []).includes(user.uid));
      
      // If a brand new message just arrived, trigger alert flash and un-dismiss
      if (prevCount !== -1 && unread.length > prevCount) {
        setHasNewAlert(true);
        setIsDismissed(false);
        setTimeout(() => setHasNewAlert(false), 5000);
      }
      prevCount = unread.length;

      setMessages(unread);
      setCurrentIndex((prev) => (prev >= unread.length ? Math.max(0, unread.length - 1) : prev));
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  // If no user, or no unread messages, or user dismissed current batch, do not render
  if (!user || messages.length === 0 || isDismissed) {
    return null;
  }

  const currentMsg = messages[currentIndex] || messages[0];
  if (!currentMsg) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % messages.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + messages.length) % messages.length);
  };

  const handleMarkCurrentAsRead = async () => {
    if (!user || !currentMsg) return;
    await markMessageAsRead(currentMsg.id, user.uid);
  };

  const handleDeleteCurrent = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!user || !currentMsg) return;
    const msgId = currentMsg.id;

    // Instant optimistic update so bar updates with zero lag
    const nextList = messages.filter((m) => m.id !== msgId);
    setMessages(nextList);
    setCurrentIndex((prev) => (prev >= nextList.length ? Math.max(0, nextList.length - 1) : prev));

    try {
      await deleteNotificationForUser(msgId, user.uid);
    } catch (err) {
      console.warn("Could not delete notification:", err);
    }
  };

  const handleOpenDetail = (msg: AdminMessage) => {
    setSelectedModalMessage(msg);
  };

  const handleModalMarkAsRead = async () => {
    if (!user || !selectedModalMessage) return;
    await markMessageAsRead(selectedModalMessage.id, user.uid);
    setSelectedModalMessage(null);
  };

  const handleModalDelete = async () => {
    if (!user || !selectedModalMessage) return;
    const msgId = selectedModalMessage.id;
    setSelectedModalMessage(null);

    const nextList = messages.filter((m) => m.id !== msgId);
    setMessages(nextList);
    setCurrentIndex((prev) => (prev >= nextList.length ? Math.max(0, nextList.length - 1) : prev));

    try {
      await deleteNotificationForUser(msgId, user.uid);
    } catch (err) {
      console.warn("Could not delete modal notification:", err);
    }
  };

  const formattedTime = new Date(currentMsg.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <>
      {/* Top Athletic Notification Bar */}
      <aside 
        aria-label="MEM Fitness Announcements"
        className={`w-full border-b transition-all duration-300 relative z-40 select-none ${
          hasNewAlert
            ? "bg-[#CCFF00]/15 border-[#CCFF00] shadow-[0_0_20px_rgba(204,255,0,0.25)]"
            : "bg-[#0d0d0d] border-[#CCFF00]/30 shadow-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Brand Badge & Message Content Preview */}
          <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto min-w-0 flex-1">
            {/* Official MEM Fitness Badge */}
            <div className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded bg-[#CCFF00] text-black">
              <Shield className="w-3.5 h-3.5 fill-black" />
              <span className="text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
                {currentMsg.senderName}
              </span>
            </div>

            {/* Target indicator tag */}
            <span className="hidden md:inline-flex text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-[#CCFF00] uppercase font-bold shrink-0">
              {currentMsg.targetType === "all" ? "All Athletes" : "Direct To You"}
            </span>

            {/* Subject and Snippet */}
            <div 
              onClick={() => handleOpenDetail(currentMsg)}
              className="min-w-0 flex-1 flex items-center gap-1.5 cursor-pointer group"
            >
              <span className="text-xs font-bold text-white group-hover:text-[#CCFF00] transition-colors truncate">
                {currentMsg.subject}
              </span>
              <span className="hidden lg:inline text-xs text-zinc-400 truncate">
                — {currentMsg.content.substring(0, 90)}...
              </span>
              <span className="text-[10px] text-[#CCFF00] font-bold group-hover:underline whitespace-nowrap hidden sm:inline flex items-center">
                Read <ChevronRight className="w-3 h-3 inline" />
              </span>
            </div>
          </div>

          {/* Right: Controls & Pagination */}
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-white/10 pt-1.5 sm:pt-0">
            
            {/* Multiple Messages Stepper */}
            {messages.length > 1 && (
              <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                <button 
                  onClick={handlePrev}
                  className="p-0.5 hover:text-white transition"
                  title="Previous message"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <span className="font-bold text-white">
                  {currentIndex + 1}/{messages.length}
                </span>
                <button 
                  onClick={handleNext}
                  className="p-0.5 hover:text-white transition"
                  title="Next message"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Read Button for mobile */}
            <button
              onClick={() => handleOpenDetail(currentMsg)}
              className="sm:hidden text-[10px] font-black uppercase text-black bg-[#CCFF00] hover:bg-[#b3ff00] px-2.5 py-1 rounded transition flex items-center gap-1"
            >
              <span>View</span>
              <ChevronRight className="w-3 h-3" />
            </button>

            {/* Quick Mark Read Button */}
            <button
              onClick={handleMarkCurrentAsRead}
              className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-[#CCFF00] px-2 py-1 rounded hover:bg-white/5 transition flex items-center gap-1"
              title="Mark as read"
            >
              <Check className="w-3 h-3 text-[#CCFF00]" />
              <span className="hidden sm:inline">Mark Read</span>
            </button>

            {/* Delete Notification Button */}
            <button
              onClick={handleDeleteCurrent}
              className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-red-400 px-2 py-1 rounded hover:bg-red-500/10 transition flex items-center gap-1 group border border-transparent hover:border-red-500/20 cursor-pointer"
              title="Delete notification"
              aria-label="Delete notification"
            >
              <Trash2 className="w-3 h-3 text-zinc-400 group-hover:text-red-400 transition-colors" />
              <span className="inline text-zinc-400 group-hover:text-red-400">Delete</span>
            </button>

            {/* Dismiss Bar Button */}
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 text-zinc-400 hover:text-white rounded hover:bg-white/10 transition"
              title="Dismiss notification bar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Full Message Detail Modal */}
      <AnimatePresence>
        {selectedModalMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-[#111111] border border-[#CCFF00]/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 bg-zinc-950 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#CCFF00] text-black flex items-center justify-center shadow-lg shadow-[#CCFF00]/20">
                    <Shield className="w-5 h-5 fill-black" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black uppercase text-white tracking-wider">
                        {selectedModalMessage.senderName}
                      </h3>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-black bg-[#CCFF00] px-1.5 py-0.5 rounded">
                        Verified Dispatch
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {selectedModalMessage.channel === "all" ? "Omni Channel" : selectedModalMessage.channel.toUpperCase()} • {new Date(selectedModalMessage.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedModalMessage(null)}
                  className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Target context banner */}
                <div className="p-2.5 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Recipient:</span>
                  <span className="text-[#CCFF00] font-bold">
                    {selectedModalMessage.targetType === "all" ? "All Registered Athletes" : "Personal Message To You"}
                  </span>
                </div>

                <div>
                  <h2 className="text-base sm:text-lg font-black text-white uppercase leading-snug">
                    {selectedModalMessage.subject}
                  </h2>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5">
                  <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
                    {selectedModalMessage.content}
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-zinc-950 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setSelectedModalMessage(null);
                    openMemberInboxModal(selectedModalMessage.id);
                  }}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-bold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Full Inbox</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleModalDelete}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition flex items-center gap-1.5 cursor-pointer"
                    title="Delete notification"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    <span>Delete</span>
                  </button>
                  <button
                    onClick={() => setSelectedModalMessage(null)}
                    className="px-3 sm:px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleModalMarkAsRead}
                    className="px-3 sm:px-4 py-2 bg-[#CCFF00] hover:bg-[#b3ff00] text-black text-xs font-black uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-[#CCFF00]/10 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark as Read</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
