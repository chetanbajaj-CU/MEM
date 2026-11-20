import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { 
  Shield, 
  Send, 
  Users, 
  Mail, 
  Smartphone, 
  Bell, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Search, 
  RotateCw, 
  Layers, 
  Database,
  ArrowRight,
  Flame,
  UserCheck,
  Trash2,
  AlertTriangle,
  X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { 
  AdminMessage, 
  RegisteredMember, 
  getRegisteredMembers, 
  getAdminMessages, 
  sendAdminMessage,
  deleteRegisteredMember,
  deleteAdminMessage
} from "../lib/adminMessages";

const ATHLETIC_TEMPLATES = [
  {
    name: "🏋️ Weekly Periodized Split",
    subject: "MEM Fitness: Your New Weekly Training Split Is Ready",
    channel: "all" as const,
    content: "Team MEM: Your updated periodized training routines are now live in the Programs section. Focus on progressive overload, strict form, and log each completed set to preserve your streak."
  },
  {
    name: "🥗 Daily Nutrition & Macros",
    subject: "MEM Fitness: Nutrition Check-in & Hydration Goals",
    channel: "email" as const,
    content: "Coach Check-in: Don't forget to scan or log your macronutrient targets before the day ends. Prioritize 2.0g protein/kg bodyweight and at least 3 liters of electrolyte hydration."
  },
  {
    name: "🧠 Mind & Recovery Focus",
    subject: "MEM Fitness: Impulse Control & Breathwork Reset",
    channel: "in-app" as const,
    content: "Physical power requires mental stability. Take 5 minutes today for grounding box breathing or test your cognitive patience with a 10-minute game of Mind Chess."
  },
  {
    name: "🏆 Athletic Streak Praise",
    subject: "MEM Fitness: Phenomenal Consistency — Keep The Fire Lit",
    channel: "phone" as const,
    content: "MEM Fitness Alert: Incredible discipline on maintaining your streak. True athletes show up when motivation fades. See you tomorrow on the gym floor."
  },
  {
    name: "📢 Gym Facility Notice",
    subject: "MEM Fitness: Upcoming Athletic Conditioning Testing Session",
    channel: "all" as const,
    content: "Attention all members: Saturday morning features our quarterly VO2 max and compound lift testing block. Check your Gym Chart and come prepared."
  }
];

export function AdminMessages() {
  const { user, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#CCFF00] border-t-transparent rounded-full animate-spin"></div></div>;
  }
  
  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  const [activeTab, setActiveTab] = useState<"compose" | "members" | "history">("compose");
  const [members, setMembers] = useState<RegisteredMember[]>([]);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  
  // Composer Form
  const [senderName] = useState("MEM Fitness");
  const [adminEmail] = useState("chetanbajaj9a22@gmail.com");
  
  const [targetType, setTargetType] = useState<"all" | "specific" | "custom">("all");
  const [selectedMemberUid, setSelectedMemberUid] = useState<string>("");
  const [customEmail, setCustomEmail] = useState("");
  const [customPhone, setCustomPhone] = useState("");
  
  const [channel, setChannel] = useState<"all" | "email" | "phone" | "in-app">("all");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const refreshData = async () => {
    setLoadingMembers(true);
    try {
      const [mems, msgs] = await Promise.all([
        getRegisteredMembers(),
        getAdminMessages()
      ]);
      setMembers(mems);
      setMessages(msgs);
    } catch (e) {
      console.warn("Could not refresh admin data", e);
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleApplyTemplate = (tpl: typeof ATHLETIC_TEMPLATES[0]) => {
    setSubject(tpl.subject);
    setContent(tpl.content);
    setChannel(tpl.channel);
  };

  const handleSelectMember = (mem: RegisteredMember) => {
    setTargetType("specific");
    setSelectedMemberUid(mem.uid);
    setActiveTab("compose");
  };

  const selectedMember = members.find(m => m.uid === selectedMemberUid);

  // Delete Member State
  const [memberToDelete, setMemberToDelete] = useState<RegisteredMember | null>(null);
  const [isDeletingMember, setIsDeletingMember] = useState(false);
  const [deleteSuccessToast, setDeleteSuccessToast] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;
    if (memberToDelete.email?.toLowerCase() === "chetanbajaj9a22@gmail.com" || memberToDelete.uid === "admin-chetan") {
      setDeleteError("Cannot delete primary administrator account.");
      return;
    }

    setIsDeletingMember(true);
    setDeleteError(null);
    try {
      await deleteRegisteredMember(memberToDelete.uid);
      setMembers(prev => prev.filter(m => m.uid !== memberToDelete.uid));
      if (selectedMemberUid === memberToDelete.uid) {
        setSelectedMemberUid("");
      }
      const memberName = memberToDelete.displayName || memberToDelete.email || memberToDelete.phoneNumber || "Guest Athlete";
      setDeleteSuccessToast(`Account for ${memberName} (${memberToDelete.authProvider || "athlete"}) permanently deleted & removed from console.`);
      setTimeout(() => setDeleteSuccessToast(null), 4000);
      setMemberToDelete(null);
    } catch (err: any) {
      console.error("Delete account error:", err);
      setDeleteError(err.message || "Failed to delete account");
    } finally {
      setIsDeletingMember(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) return;

    setSending(true);
    setSentSuccess(null);

    let recipientEmail: string | undefined;
    let recipientPhone: string | undefined;
    let recipientName: string | undefined;
    let recipientUid: string | undefined;

    if (targetType === "specific" && selectedMember) {
      recipientEmail = selectedMember.email || undefined;
      recipientPhone = selectedMember.phoneNumber || undefined;
      recipientName = selectedMember.displayName || undefined;
      recipientUid = selectedMember.uid || undefined;
    } else if (targetType === "custom") {
      recipientEmail = customEmail || undefined;
      recipientPhone = customPhone || undefined;
      recipientName = "Custom Recipient";
    }

    try {
      const dispatched = await sendAdminMessage({
        adminEmail,
        channel,
        targetType: targetType === "all" ? "all" : "specific",
        recipientEmail,
        recipientPhone,
        recipientName,
        recipientUid,
        subject,
        content
      });

      setMessages(prev => [dispatched, ...prev]);
      setSentSuccess(`Message successfully sent from "${senderName}" to ${targetType === "all" ? "All Registered Athletes" : (recipientEmail || recipientPhone || recipientName)}!`);
      
      // Reset fields
      setSubject("");
      setContent("");
      
      setTimeout(() => {
        setSentSuccess(null);
      }, 5000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteDispatchedMessage = async (messageId: string) => {
    try {
      setMessages(prev => prev.filter(m => m.id !== messageId));
      await deleteAdminMessage(messageId);
      setDeleteSuccessToast("Dispatched message permanently removed from records");
      setTimeout(() => setDeleteSuccessToast(null), 4000);
    } catch (e) {
      console.error("Could not delete message:", e);
    }
  };

  const emailCount = members.filter(m => !!m.email).length;
  const phoneCount = members.filter(m => !!m.phoneNumber).length;

  const filteredMembers = members.filter(m => {
    const q = searchQuery.toLowerCase();
    return (
      (m.displayName || "").toLowerCase().includes(q) ||
      (m.email || "").toLowerCase().includes(q) ||
      (m.phoneNumber || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-300 pb-16 select-auto">
      
      {/* Top Banner: Firebase Console & Official Sender Status */}
      <div className="border border-white/10 bg-zinc-950 p-6 md:p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#CCFF00]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#CCFF00] flex items-center justify-center text-black shadow-lg shadow-[#CCFF00]/20">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                    MEM Fitness <span className="text-[#CCFF00]">Admin Center</span>
                  </h1>
                  <span className="bg-[#CCFF00]/20 text-[#CCFF00] border border-[#CCFF00]/30 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                    Active Sender
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Official Communication Engine • Multi-channel broadcasts to registered email, phone & devices.
                </p>
              </div>
            </div>
            
            {/* Firebase Project Metadata Pill */}
            <div className="flex flex-wrap items-center gap-2 mt-4 text-[11px] font-mono">
              <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-zinc-300 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#CCFF00]" />
                Project: <strong className="text-white">famous-aloe-kn50x</strong>
              </span>
              <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-zinc-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                Sender Identity: <strong className="text-[#CCFF00]">MEM Fitness</strong>
              </span>
              <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-zinc-300">
                Admin: <strong className="text-white">chetanbajaj9a22@gmail.com</strong>
              </span>
            </div>
          </div>

          {/* Firebase Console Direct Action Button */}
          <div className="flex items-center gap-3">
            <a
              href="https://console.firebase.google.com/project/famous-aloe-kn50x"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-[#CCFF00] hover:bg-[#b3ff00] text-black font-black uppercase text-xs tracking-wider rounded-xl transition flex items-center gap-2 shadow-lg shadow-[#CCFF00]/20"
            >
              <span>Open Firebase Console</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={refreshData}
              disabled={loadingMembers}
              className="p-3 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white rounded-xl transition"
              title="Refresh Members & Messages"
            >
              <RotateCw className={`w-4 h-4 ${loadingMembers ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-zinc-950 border border-white/10 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Registered Contacts</span>
            <Users className="w-4 h-4 text-[#CCFF00]" />
          </div>
          <div className="text-3xl font-black text-white">{members.length}</div>
          <div className="text-[10px] text-zinc-500 mt-1">Total active profiles</div>
        </div>

        <div className="p-5 bg-zinc-950 border border-white/10 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Registered Emails</span>
            <Mail className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white">{emailCount}</div>
          <div className="text-[10px] text-zinc-500 mt-1">Email dispatch ready</div>
        </div>

        <div className="p-5 bg-zinc-950 border border-white/10 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Registered Phones</span>
            <Smartphone className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">{phoneCount}</div>
          <div className="text-[10px] text-zinc-500 mt-1">SMS alert ready</div>
        </div>

        <div className="p-5 bg-zinc-950 border border-white/10 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Dispatched Messages</span>
            <Send className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white">{messages.length}</div>
          <div className="text-[10px] text-zinc-500 mt-1">MEM Fitness broadcasts</div>
        </div>
      </div>

      {/* Main Tabs Navigation: Horizontally Scrollable on Mobile */}
      <div className="flex border-b border-white/10 gap-3 text-xs font-bold uppercase tracking-wider overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveTab("compose")}
          className={`pb-2.5 border-b-2 transition flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
            activeTab === "compose"
              ? "border-[#CCFF00] text-[#CCFF00]"
              : "border-transparent text-zinc-500 hover:text-white"
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Compose</span>
        </button>

        <button
          onClick={() => setActiveTab("members")}
          className={`pb-2.5 border-b-2 transition flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
            activeTab === "members"
              ? "border-[#CCFF00] text-[#CCFF00]"
              : "border-transparent text-zinc-500 hover:text-white"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Athletes ({members.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`pb-2.5 border-b-2 transition flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
            activeTab === "history"
              ? "border-[#CCFF00] text-[#CCFF00]"
              : "border-transparent text-zinc-500 hover:text-white"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>History ({messages.length})</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {sentSuccess && (
        <div className="p-4 bg-[#CCFF00]/10 border border-[#CCFF00]/30 rounded-xl text-xs text-[#CCFF00] flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="font-bold">{sentSuccess}</p>
        </div>
      )}

      {/* TAB 1: COMPOSE MESSAGE */}
      {activeTab === "compose" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: The Dispatch Form */}
          <div className="lg:col-span-2 space-y-6 bg-zinc-950 border border-white/10 p-6 md:p-8 rounded-2xl">
            
            {/* Quick Templates Picker */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#CCFF00]" />
                Load Athletic Quick Template:
              </label>
              <div className="flex flex-wrap gap-2">
                {ATHLETIC_TEMPLATES.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleApplyTemplate(tpl)}
                    className="px-3 py-1.5 bg-zinc-900 border border-white/10 rounded-lg text-[11px] font-medium text-zinc-300 hover:text-[#CCFF00] hover:border-[#CCFF00]/40 transition"
                  >
                    {tpl.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-6">
              
              {/* Sender Badge */}
              <div className="p-3 bg-zinc-900/80 border border-white/10 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">Sender Name</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black uppercase text-[#CCFF00]">{senderName}</span>
                    <span className="text-[10px] text-zinc-400">({adminEmail})</span>
                  </div>
                </div>
                <div className="text-[10px] font-mono font-bold bg-[#CCFF00]/10 border border-[#CCFF00]/20 text-[#CCFF00] px-2.5 py-1 rounded">
                  VERIFIED ADMIN
                </div>
              </div>

              {/* Target Selection */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                  Target Recipient
                </label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setTargetType("all")}
                    className={`py-2 px-3 text-xs font-bold rounded-lg uppercase tracking-wider border transition ${
                      targetType === "all"
                        ? "bg-[#CCFF00] text-black border-[#CCFF00]"
                        : "bg-zinc-900 text-zinc-400 border-white/10 hover:text-white"
                    }`}
                  >
                    All Athletes ({members.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetType("specific")}
                    className={`py-2 px-3 text-xs font-bold rounded-lg uppercase tracking-wider border transition ${
                      targetType === "specific"
                        ? "bg-[#CCFF00] text-black border-[#CCFF00]"
                        : "bg-zinc-900 text-zinc-400 border-white/10 hover:text-white"
                    }`}
                  >
                    Select Member
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetType("custom")}
                    className={`py-2 px-3 text-xs font-bold rounded-lg uppercase tracking-wider border transition ${
                      targetType === "custom"
                        ? "bg-[#CCFF00] text-black border-[#CCFF00]"
                        : "bg-zinc-900 text-zinc-400 border-white/10 hover:text-white"
                    }`}
                  >
                    Custom Input
                  </button>
                </div>

                {targetType === "specific" && (
                  <div className="mt-2">
                    <select
                      value={selectedMemberUid}
                      onChange={(e) => setSelectedMemberUid(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#CCFF00] outline-none"
                    >
                      <option value="">-- Choose a registered member --</option>
                      {members.map(m => (
                        <option key={m.uid} value={m.uid}>
                          {m.displayName || "Athlete"} • {m.email || m.phoneNumber || m.uid}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {targetType === "custom" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    <div>
                      <input
                        type="email"
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        placeholder="recipient@example.com"
                        className="w-full bg-zinc-900 border border-white/15 rounded-xl px-4 py-2 text-xs text-white focus:border-[#CCFF00] outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        value={customPhone}
                        onChange={(e) => setCustomPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-zinc-900 border border-white/15 rounded-xl px-4 py-2 text-xs text-white focus:border-[#CCFF00] outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Channel */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                  Dispatch Channel
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setChannel("all")}
                    className={`py-2 px-3 text-xs font-bold rounded-lg uppercase tracking-wider border flex items-center justify-center gap-1.5 transition ${
                      channel === "all"
                        ? "bg-white text-black border-white"
                        : "bg-zinc-900 text-zinc-400 border-white/10 hover:text-white"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>All Channels</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel("email")}
                    className={`py-2 px-3 text-xs font-bold rounded-lg uppercase tracking-wider border flex items-center justify-center gap-1.5 transition ${
                      channel === "email"
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-zinc-900 text-zinc-400 border-white/10 hover:text-white"
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel("phone")}
                    className={`py-2 px-3 text-xs font-bold rounded-lg uppercase tracking-wider border flex items-center justify-center gap-1.5 transition ${
                      channel === "phone"
                        ? "bg-emerald-500 text-black border-emerald-500"
                        : "bg-zinc-900 text-zinc-400 border-white/10 hover:text-white"
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Phone SMS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel("in-app")}
                    className={`py-2 px-3 text-xs font-bold rounded-lg uppercase tracking-wider border flex items-center justify-center gap-1.5 transition ${
                      channel === "in-app"
                        ? "bg-[#CCFF00] text-black border-[#CCFF00]"
                        : "bg-zinc-900 text-zinc-400 border-white/10 hover:text-white"
                    }`}
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>In-App Alert</span>
                  </button>
                </div>
              </div>

              {/* Subject Line */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. MEM Fitness: Weekly Periodized Split Update"
                  required
                  className="w-full bg-zinc-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#CCFF00] outline-none"
                />
              </div>

              {/* Message Body */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Message Content
                </label>
                <textarea
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type your athletic instruction, workout schedule adjustment, or motivation here..."
                  required
                  className="w-full bg-zinc-900 border border-white/15 rounded-xl p-4 text-xs text-white focus:border-[#CCFF00] outline-none leading-relaxed"
                />
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={sending || !subject.trim() || !content.trim()}
                className="w-full py-3.5 bg-[#CCFF00] hover:bg-[#b3ff00] text-black font-black uppercase text-xs tracking-wider rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-[#CCFF00]/10"
              >
                {sending ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Dispatching from MEM Fitness...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message as MEM Fitness</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right 1 Col: Live Athlete Preview */}
          <div className="space-y-4">
            <div className="p-4 bg-zinc-950 border border-white/10 rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-3">
                Live Athlete Dispatch Preview
              </span>

              {/* Card Preview */}
              <div className="p-5 bg-zinc-900 border border-[#CCFF00]/30 rounded-xl space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#CCFF00] flex items-center justify-center text-black">
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase text-white tracking-wider block">MEM Fitness</span>
                      <span className="text-[9px] text-zinc-400">Official Athletic Notice</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 uppercase text-zinc-300">
                    {channel.toUpperCase()}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white mb-1">
                    {subject || "Subject line will appear here"}
                  </h4>
                  <p className="text-[11px] text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {content || "Message body preview will appear here as you type in the composer."}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 text-[9px] text-zinc-500 flex justify-between">
                  <span>To: {targetType === "all" ? "All Registered Athletes" : (selectedMember?.displayName || customEmail || customPhone || "Target Member")}</span>
                  <span>Just now</span>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="p-5 bg-zinc-950/60 border border-white/10 rounded-2xl text-xs text-zinc-400 space-y-2.5">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                <Shield className="w-4 h-4 text-[#CCFF00]" />
                Communication Policy
              </div>
              <p className="text-[11px] leading-relaxed">
                Messages dispatched from this console arrive under the official <strong>MEM Fitness</strong> verified identity directly into athlete in-app inboxes, email records, and notification banners.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REGISTERED MEMBERS DIRECTORY */}
      {activeTab === "members" && (
        <div className="space-y-4 bg-zinc-950 border border-white/10 p-6 md:p-8 rounded-2xl">
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight text-white">
                Registered Athletes Directory
              </h2>
              <p className="text-xs text-zinc-400">
                All athletes signed in with Email, Phone Number, Google, or local athlete profile.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, phone..."
                className="w-full bg-zinc-900 border border-white/15 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:border-[#CCFF00] outline-none"
              />
            </div>
          </div>

          {/* Mobile View: Athlete Cards for Phone Screens */}
          <div className="md:hidden space-y-2.5">
            {filteredMembers.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 text-xs">
                No members matching "{searchQuery}"
              </div>
            ) : (
              filteredMembers.map((m) => (
                <div key={m.uid} className="p-3 bg-zinc-900 border border-white/10 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] flex items-center justify-center font-black text-xs">
                        {(m.displayName || "A").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">{m.displayName || "Athlete"}</div>
                        <span className="text-[9px] font-mono text-zinc-500 uppercase">{m.authProvider || "account"}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleSelectMember(m)}
                        className="px-2.5 py-1 bg-[#CCFF00] text-black text-[10px] font-black uppercase rounded transition flex items-center gap-1 active:scale-95 shadow"
                      >
                        <span>Message</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      {m.email?.toLowerCase() !== "chetanbajaj9a22@gmail.com" && m.uid !== "admin-chetan" && (
                        <button
                          onClick={() => setMemberToDelete(m)}
                          className="p-1 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 border border-red-500/20 rounded transition active:scale-95"
                          title="Delete account from console"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] pt-1.5 border-t border-white/5 font-mono">
                    <div className="overflow-hidden">
                      <span className="text-[8px] text-zinc-500 block uppercase font-sans">Email</span>
                      <span className="text-blue-400 truncate block">{m.email || "—"}</span>
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[8px] text-zinc-500 block uppercase font-sans">Phone</span>
                      <span className="text-[#CCFF00] truncate block">{m.phoneNumber || "—"}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop View: Full Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  <th className="py-3 px-4">Athlete</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone Number</th>
                  <th className="py-3 px-4">Provider</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-zinc-500 text-xs">
                      No members matching "{searchQuery}"
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((m) => (
                    <tr key={m.uid} className="hover:bg-white/[0.02] transition">
                      <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] flex items-center justify-center font-black text-xs">
                          {(m.displayName || "A").charAt(0).toUpperCase()}
                        </div>
                        <span>{m.displayName || "Athlete"}</span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-zinc-300">
                        {m.email ? (
                          <span className="text-blue-400">{m.email}</span>
                        ) : (
                          <span className="text-zinc-600">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-zinc-300">
                        {m.phoneNumber ? (
                          <span className="text-[#CCFF00]">{m.phoneNumber}</span>
                        ) : (
                          <span className="text-zinc-600">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-zinc-400 uppercase">
                          {m.authProvider || "account"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleSelectMember(m)}
                            className="px-3 py-1 bg-white/10 hover:bg-[#CCFF00] hover:text-black text-white text-[11px] font-bold rounded-lg transition inline-flex items-center gap-1"
                          >
                            <span>Message</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                          {m.email?.toLowerCase() !== "chetanbajaj9a22@gmail.com" && m.uid !== "admin-chetan" ? (
                            <button
                              onClick={() => setMemberToDelete(m)}
                              className="p-1.5 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 border border-red-500/20 rounded-lg transition"
                              title="Permanently delete user account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <span className="text-[9px] font-mono text-zinc-600 uppercase px-2 py-1">Admin</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DISPATCH HISTORY */}
      {activeTab === "history" && (
        <div className="space-y-4 bg-zinc-950 border border-white/10 p-6 md:p-8 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight text-white">
                Dispatch History & Audit Log
              </h2>
              <p className="text-xs text-zinc-400">
                Log of all broadcast notifications sent under the name MEM Fitness.
              </p>
            </div>
            
            <button
              onClick={refreshData}
              className="text-xs text-[#CCFF00] hover:underline font-bold flex items-center gap-1"
            >
              <RotateCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 text-xs">
                No messages dispatched yet.
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-4 bg-zinc-900 border border-white/10 rounded-xl space-y-2 hover:border-[#CCFF00]/40 transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase text-[#CCFF00]">{msg.senderName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 uppercase text-zinc-300">
                        {msg.channel.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        To: <strong>{msg.targetType === "all" ? "All Athletes" : (msg.recipientEmail || msg.recipientPhone || msg.recipientName)}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 text-[10px] text-zinc-500">
                      <span>{new Date(msg.createdAt).toLocaleString()}</span>
                      <span className="text-[#CCFF00] flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
                      </span>
                      <button
                        onClick={() => handleDeleteDispatchedMessage(msg.id)}
                        className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition border border-transparent hover:border-red-500/20 cursor-pointer"
                        title="Delete dispatched notification from system"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-white">{msg.subject}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Delete Success Toast */}
      {deleteSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#CCFF00] text-black px-4 py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-2xl flex items-center gap-2 border border-black/20 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
          <span>{deleteSuccessToast}</span>
        </div>
      )}

      {/* Delete Member Confirmation Modal */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-[#121212] border border-red-500/40 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-red-500/20 flex items-center justify-between bg-red-500/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">Delete User Account</h3>
                  <p className="text-[10px] text-red-400 font-mono">Irreversible Admin Action</p>
                </div>
              </div>
              <button 
                onClick={() => setMemberToDelete(null)}
                disabled={isDeletingMember}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div className="bg-zinc-900 border border-white/10 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Target Athlete</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-white/10 uppercase text-zinc-300">
                    {memberToDelete.authProvider || "account"}
                  </span>
                </div>
                <div className="text-sm font-black text-white uppercase">
                  {memberToDelete.displayName || "Guest Athlete"}
                </div>
                <div className="text-xs font-mono text-zinc-400 space-y-0.5">
                  {memberToDelete.email && <div>Email: <span className="text-blue-400">{memberToDelete.email}</span></div>}
                  {memberToDelete.phoneNumber && <div>Phone: <span className="text-[#CCFF00]">{memberToDelete.phoneNumber}</span></div>}
                  <div className="text-[9px] text-zinc-600 truncate">UID: {memberToDelete.uid}</div>
                </div>
              </div>

              <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl text-xs text-zinc-300 space-y-1">
                <p className="text-red-400 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  Permanent Deletion Notice
                </p>
                <p className="text-[11px] leading-relaxed text-zinc-400">
                  Deleting this user will permanently remove them from the registered athletes directory, delete their Firestore user document, wipe workout streak logs, and clear guest sessions.
                </p>
              </div>

              {deleteError && (
                <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 font-bold">
                  {deleteError}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-white/10 bg-zinc-950 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                disabled={isDeletingMember}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteMember}
                disabled={isDeletingMember}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-red-900/30"
              >
                {isDeletingMember ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
