import { useState, useEffect } from "react";
import { Bell, Check, Mail, Phone, Sparkles, X, Shield, Clock, ExternalLink, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { AdminMessage, subscribeToUserMessages, markMessageAsRead, deleteNotificationForUser } from "../lib/adminMessages";
import { motion, AnimatePresence } from "motion/react";

export function MemberInbox() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");
  const [highlightMessageId, setHighlightMessageId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setMessages([]);
      return;
    }

    const unsubscribe = subscribeToUserMessages(user, (userMsgs) => {
      setMessages(userMsgs);
    });

    const onOpenInbox = (e: any) => {
      setIsOpen(true);
      if (e.detail?.messageId) {
        setHighlightMessageId(e.detail.messageId);
        setTimeout(() => setHighlightMessageId(null), 3000);
      }
    };
    window.addEventListener("mem_open_inbox", onOpenInbox);

    return () => {
      unsubscribe();
      window.removeEventListener("mem_open_inbox", onOpenInbox);
    };
  }, [user]);

  const unreadCount = messages.filter(m => !(m.readBy || []).includes(user?.uid || "")).length;

  const handleMarkAsRead = async (messageId: string) => {
    if (!user) return;
    await markMessageAsRead(messageId, user.uid);
    setMessages(prev => prev.map(m => {
      if (m.id === messageId) {
        return { ...m, readBy: [...(m.readBy || []), user.uid] };
      }
      return m;
    }));
  };

  const handleDeleteNotification = async (messageId: string) => {
    if (!user) return;
    setMessages(prev => prev.filter(m => m.id !== messageId));
    await deleteNotificationForUser(messageId, user.uid);
  };

  const handleMarkAllRead = async () => {
    if (!user) return;
    for (const msg of messages) {
      if (!(msg.readBy || []).includes(user.uid)) {
        await markMessageAsRead(msg.id, user.uid);
      }
    }
    setMessages(prev => prev.map(m => ({ ...m, readBy: [...(m.readBy || []), user.uid] })));
  };

  const filtered = messages.filter(m => {
    if (activeFilter === "unread") {
      return !(m.readBy || []).includes(user?.uid || "");
    }
    return true;
  });

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white/70 hover:text-white transition rounded-full hover:bg-white/5"
        title="Messages from MEM Fitness"
        aria-label="Messages from MEM Fitness"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-[#CCFF00] text-black text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Slide-over / Modal Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <div 
              className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-xs"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-3 w-[92vw] sm:w-[420px] max-w-[440px] z-50 bg-[#0c0c0c] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="p-4 bg-zinc-950 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#CCFF00] flex items-center justify-center text-black">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black uppercase tracking-wider text-white">MEM Fitness</span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-black bg-[#CCFF00] px-1.5 py-0.2 rounded">Official</span>
                    </div>
                    <span className="text-[10px] text-zinc-400">Athletic Announcements & Dispatches</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Filter Tabs & Quick Action */}
              <div className="px-4 py-2.5 bg-zinc-900/60 border-b border-white/5 flex items-center justify-between text-xs">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveFilter("all")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition ${
                      activeFilter === "all" ? "bg-white/15 text-white" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    All ({messages.length})
                  </button>
                  <button
                    onClick={() => setActiveFilter("unread")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition ${
                      activeFilter === "unread" ? "bg-[#CCFF00]/20 text-[#CCFF00]" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Unread ({unreadCount})
                  </button>
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-[#CCFF00] hover:underline font-bold uppercase tracking-wider"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Messages List */}
              <div className="p-3 space-y-2.5 overflow-y-auto flex-1">
                {filtered.length === 0 ? (
                  <div className="py-12 text-center text-zinc-500">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-zinc-400" />
                    <p className="text-xs font-semibold uppercase tracking-wider">No messages right now</p>
                    <p className="text-[11px] text-zinc-600 mt-1">Official dispatches from MEM Fitness will appear here.</p>
                  </div>
                ) : (
                  filtered.map((msg) => {
                    const isRead = (msg.readBy || []).includes(user?.uid || "");
                    const formattedDate = new Date(msg.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    });

                    return (
                      <div
                        key={msg.id}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isRead
                            ? "bg-zinc-900/40 border-white/5 opacity-80"
                            : "bg-zinc-900 border-[#CCFF00]/30 shadow-md shadow-[#CCFF00]/5"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-[#CCFF00] tracking-wider">
                              {msg.senderName}
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 uppercase text-zinc-300">
                              {msg.channel === "all" ? "Omni Dispatch" : msg.channel.toUpperCase()}
                            </span>
                          </div>
                          
                          <span className="text-[10px] text-zinc-500 shrink-0">{formattedDate}</span>
                        </div>

                        <h4 className="text-xs font-bold text-white mb-1.5 leading-snug">
                          {msg.subject}
                        </h4>

                        <p className="text-[11px] text-zinc-300 leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </p>

                        <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                          <span className="text-zinc-500 font-mono">
                            {msg.targetType === "all" ? "To: All Athletes" : "To: You"}
                          </span>

                          <div className="flex items-center gap-2">
                            {!isRead && (
                              <button
                                onClick={() => handleMarkAsRead(msg.id)}
                                className="text-[#CCFF00] hover:text-white flex items-center gap-1 font-bold cursor-pointer"
                              >
                                <Check className="w-3 h-3" /> Mark as read
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteNotification(msg.id)}
                              className="text-zinc-500 hover:text-red-400 p-0.5 rounded hover:bg-red-500/10 transition flex items-center gap-1 cursor-pointer"
                              title="Delete notification"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="p-3 bg-zinc-950 border-t border-white/10 text-center">
                <span className="text-[10px] text-zinc-500">
                  Broadcasts powered by Firebase Firestore & MEM Communication Engine
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
