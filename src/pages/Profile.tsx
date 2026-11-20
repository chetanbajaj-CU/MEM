import { Trophy, Flame, Target, Zap, Dumbbell, Apple, Clock, BookOpen, LogOut, Edit2, Check, X, Camera, Download, Shield, Activity, ChevronRight, Upload, Sparkles, RefreshCw, CheckCircle2, AlertCircle, Trash2, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState, useRef, ChangeEvent } from "react";
import { getUserStats, UserStats, DEFAULT_STATS } from "../lib/userStats";
import { NotificationSettings } from "../components/NotificationSettings";
import { PRESET_AVATARS, processProfileImageFile, PresetAvatar } from "../lib/profileImageUtils";

export function Profile() {
  const { user, isAdmin, logout, updateUserName, updateUserPhoto, deleteAccount } = useAuth();
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [reflections, setReflections] = useState<{date: string, reflection: string}[]>([]);
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState("");

  // Profile Image Customizer State
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoSuccessToast, setPhotoSuccessToast] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [avatarTab, setAvatarTab] = useState<"upload" | "presets">("upload");

  // Delete Account State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setEditNameValue((user.displayName || user.phoneNumber || user.email?.split("@")[0]) || "Athlete");
    }
  }, [user]);

  const handleSaveName = async () => {
    if (editNameValue.trim() && user) {
      await updateUserName(editNameValue.trim());
    }
    setIsEditingName(false);
  };

  const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploadingPhoto(true);
    setPhotoError("");
    try {
      // Process & compress client-side for rapid, lightweight persistence across all login methods
      const compressedDataUrl = await processProfileImageFile(file);
      await updateUserPhoto(compressedDataUrl);
      setPhotoSuccessToast("Profile image updated successfully!");
      setTimeout(() => setPhotoSuccessToast(""), 3500);
      setIsAvatarModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setPhotoError(err.message || "Failed to process image file");
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSelectPresetAvatar = async (preset: PresetAvatar) => {
    if (!user) return;
    setIsUploadingPhoto(true);
    setPhotoError("");
    try {
      await updateUserPhoto(preset.image);
      setPhotoSuccessToast(`Equipped ${preset.name} avatar!`);
      setTimeout(() => setPhotoSuccessToast(""), 3500);
      setIsAvatarModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setPhotoError("Failed to apply avatar preset");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!user) return;
    setIsUploadingPhoto(true);
    setPhotoError("");
    try {
      await updateUserPhoto(null);
      setPhotoSuccessToast("Profile image reset to monogram");
      setTimeout(() => setPhotoSuccessToast(""), 3500);
      setIsAvatarModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setPhotoError("Failed to remove profile image");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const getAuthProviderBadge = () => {
    if (!user) return null;
    if (user.isAnonymous || user.uid.startsWith("local-guest-")) {
      return { label: "Guest Account", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" };
    }
    if (user.phoneNumber) {
      return { label: "Phone Account", color: "text-[#3BB1FF] border-[#3BB1FF]/30 bg-[#3BB1FF]/10" };
    }
    if (user.email) {
      const isGoogle = user.photoURL?.includes("googleusercontent.com") || user.photoURL?.includes("google");
      return { 
        label: isGoogle ? "Google Account" : "Email Account", 
        color: "text-[#CCFF00] border-[#CCFF00]/30 bg-[#CCFF00]/10" 
      };
    }
    return { label: "Athlete Account", color: "text-zinc-400 border-white/10 bg-white/5" };
  };

  const handleDeleteSelfAccount = async () => {
    if (!user) return;
    if (isAdmin) {
      setDeleteAccountError("Administrator account cannot be deleted from athlete profile.");
      return;
    }
    setIsDeletingAccount(true);
    setDeleteAccountError("");
    try {
      await deleteAccount();
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      console.error("Account delete error:", err);
      setDeleteAccountError(err.message || "Failed to delete account");
      setIsDeletingAccount(false);
    }
  };

  const handleExportData = () => {
    if (!user) return;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "--- USER STATS ---\nMetric,Value\n";
    csvContent += `Current Streak,${stats.currentStreak}\n`;
    csvContent += `Longest Streak,${stats.longestStreak}\n`;
    csvContent += `Total Workouts,${stats.totalWorkouts}\n`;
    csvContent += `Perfect Diet Days,${stats.perfectNutritionDays}\n\n`;
    csvContent += "--- REFLECTIONS ARCHIVE ---\nDate,Reflection\n";
    reflections.forEach(item => {
      const escapedReflection = item.reflection.replace(/"/g, '""');
      csvContent += `${item.date},"${escapedReflection}"\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fitness_progress_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    async function loadStats() {
      if (user) {
        setLoading(true);
        try {
          const fetchedStats = await getUserStats(user.uid);
          setStats(fetchedStats);
          
          if (user.uid.startsWith("local-")) {
            const loadedReflections: {date: string, reflection: string}[] = [];
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key && key.startsWith(`daily_data_${user.uid}_`)) {
                try {
                  const data = JSON.parse(localStorage.getItem(key) || "{}");
                  if (data.date && data.reflection && data.reflectionSubmitted) {
                    loadedReflections.push({ date: data.date, reflection: data.reflection });
                  }
                } catch(e) {}
              }
            }
            loadedReflections.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setReflections(loadedReflections);
          } else {
            // Fetch reflections from Firestore
            import("firebase/firestore").then(({ collection, query, where, getDocs }) => {
              import("../lib/firebase").then(({ db }) => {
                 const q = query(collection(db, "dailyData"), where("userId", "==", user.uid));
                 getDocs(q).then((snapshot) => {
                   const loadedReflections: {date: string, reflection: string}[] = [];
                   snapshot.forEach((doc) => {
                     const data = doc.data();
                     if (data.date && data.reflection && data.reflectionSubmitted) {
                       loadedReflections.push({
                         date: data.date,
                         reflection: data.reflection
                       });
                     }
                   });
                   loadedReflections.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                   setReflections(loadedReflections);
                 });
              });
            });
          }
          
        } catch (error) {
          console.error("Failed to load stats", error);
        } finally {
          setLoading(false);
        }
      }
    }
    loadStats();
  }, [user]);
  
  const badgeDefinitions = [
    { id: 1, name: "First Step", description: "First workout completed", icon: Target, color: "text-[#3BB1FF]" },
    { id: 2, name: "7-Day Streak", description: "7 days in a row", icon: Flame, color: "text-[#FF8C00]" },
    { id: 3, name: "Iron Will", description: "50 workouts logged", icon: Dumbbell, color: "text-[#CCFF00]" },
    { id: 4, name: "Nutrition Pro", description: "10 days target macros", icon: Apple, color: "text-zinc-500" },
    { id: 5, name: "Early Bird", description: "5 morning sessions", icon: Clock, color: "text-[#9D4EDD]" },
    { id: 6, name: "Consistency", description: "30-Day streak", icon: Zap, color: "text-zinc-500" },
  ];
  
  const badges = badgeDefinitions.map(b => ({
    ...b,
    earned: (stats.badges || []).includes(b.id)
  }));

  const authBadge = getAuthProviderBadge();

  return (
    <div className="space-y-4 pb-12 select-auto relative">
      {/* Photo Success Toast */}
      {photoSuccessToast && (
        <div className="fixed top-20 right-4 z-50 bg-[#CCFF00] text-black px-4 py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-2xl flex items-center gap-2 border border-black/20 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
          <span>{photoSuccessToast}</span>
        </div>
      )}

      {/* 1. Athlete ID Card */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-black border border-white/10 p-4 rounded-2xl relative overflow-hidden shadow-xl">
        <div className="flex items-center gap-4">
          {/* Avatar with photo changer */}
          <div className="relative group shrink-0">
            <button 
              type="button"
              className="relative w-16 h-16 sm:w-20 sm:h-20 bg-zinc-800/90 border-2 border-[#CCFF00]/50 hover:border-[#CCFF00] flex items-center justify-center rounded-2xl text-2xl font-black text-[#CCFF00] cursor-pointer overflow-hidden shadow-lg transition-all group-hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#CCFF00]/50"
              onClick={() => setIsAvatarModalOpen(true)}
              title="Click to change profile picture"
            >
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user?.displayName?.charAt(0) || "A"
              )}
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-white" />
                <span className="text-[8px] font-black uppercase tracking-wider text-[#CCFF00] mt-0.5">Edit</span>
              </div>
            </button>

            {user?.photoURL ? (
              <button 
                onClick={handleRemovePhoto}
                className="absolute -bottom-1 -right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition-colors"
                title="Remove photo & reset to monogram"
              >
                <X className="w-3 h-3" />
              </button>
            ) : (
              <button
                onClick={() => setIsAvatarModalOpen(true)}
                className="absolute -bottom-1 -right-1 p-1 bg-[#CCFF00] text-black rounded-full shadow-md hover:bg-white transition-colors"
                title="Add profile photo"
              >
                <Camera className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Athlete Info */}
          <div className="flex-1 min-w-0">
            {isEditingName ? (
              <div className="flex items-center gap-1.5 mb-1">
                <input
                  type="text"
                  value={editNameValue}
                  onChange={(e) => setEditNameValue(e.target.value)}
                  className="bg-black border border-[#CCFF00] text-white text-sm font-black uppercase px-2 py-1 rounded outline-none w-full"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName();
                    if (e.key === 'Escape') setIsEditingName(false);
                  }}
                />
                <button onClick={handleSaveName} className="p-1 bg-[#CCFF00] text-black rounded">
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setIsEditingName(false)} className="p-1 bg-zinc-800 text-zinc-400 rounded">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-base sm:text-lg font-black tracking-tight uppercase text-white truncate">
                  {(user?.displayName || user?.phoneNumber || user?.email?.split("@")[0]) || "Athlete"}
                </h1>
                <button onClick={() => setIsEditingName(true)} className="p-1 text-zinc-400 hover:text-[#CCFF00]">
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Badges & Identity */}
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {authBadge && (
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${authBadge.color}`}>
                  {authBadge.label}
                </span>
              )}
              {user?.email && (
                <span className="text-[9px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/5 truncate max-w-[170px]">
                  {user.email}
                </span>
              )}
              {user?.phoneNumber && (
                <span className="text-[9px] font-mono text-[#CCFF00] bg-[#CCFF00]/10 px-2 py-0.5 rounded border border-[#CCFF00]/20">
                  {user.phoneNumber}
                </span>
              )}
            </div>

            {/* Change Profile Image Trigger Button */}
            <button
              onClick={() => setIsAvatarModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 hover:bg-[#CCFF00] text-zinc-300 hover:text-black border border-white/10 hover:border-[#CCFF00] rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
            >
              <Camera className="w-3 h-3 text-[#CCFF00] group-hover:text-black" />
              <span>Change Profile Image</span>
            </button>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className={`grid ${isAdmin ? "grid-cols-3" : "grid-cols-2"} gap-1.5 mt-3 pt-3 border-t border-white/10 text-center`}>
          {isAdmin && (
            <Link 
              to="/admin"
              className="py-1.5 px-2 bg-white/5 hover:bg-[#CCFF00] hover:text-black text-white rounded-xl text-[9px] font-black uppercase tracking-wider transition flex items-center justify-center gap-1 border border-white/5"
            >
              <Shield className="w-3 h-3 text-[#CCFF00]" />
              Admin
            </Link>
          )}
          <button 
            onClick={handleExportData}
            className="py-1.5 px-2 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-xl text-[9px] font-black uppercase tracking-wider transition flex items-center justify-center gap-1 border border-white/5"
          >
            <Download className="w-3 h-3" />
            Export
          </button>
          <button 
            onClick={logout}
            className="py-1.5 px-2 bg-white/5 hover:bg-red-500/20 text-red-400 rounded-xl text-[9px] font-black uppercase tracking-wider transition flex items-center justify-center gap-1 border border-white/5"
          >
            <LogOut className="w-3 h-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Grid (4 compact mobile tiles) */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-zinc-950 border border-white/10 p-3 rounded-2xl flex items-center gap-3 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-[#FF8C00]/15 flex items-center justify-center text-[#FF8C00] shrink-0">
            <Flame className="w-4 h-4 fill-current" />
          </div>
          <div>
            <div className="text-base font-black text-white">{stats.currentStreak}</div>
            <div className="text-[9px] font-mono uppercase text-zinc-400">Current Streak</div>
          </div>
        </div>

        <div className="bg-zinc-950 border border-white/10 p-3 rounded-2xl flex items-center gap-3 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-[#CCFF00]/15 flex items-center justify-center text-[#CCFF00] shrink-0">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-black text-white">{stats.longestStreak}</div>
            <div className="text-[9px] font-mono uppercase text-zinc-400">Best Streak</div>
          </div>
        </div>

        <div className="bg-zinc-950 border border-white/10 p-3 rounded-2xl flex items-center gap-3 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-[#3BB1FF]/15 flex items-center justify-center text-[#3BB1FF] shrink-0">
            <Dumbbell className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-black text-white">{stats.totalWorkouts}</div>
            <div className="text-[9px] font-mono uppercase text-zinc-400">Workouts</div>
          </div>
        </div>

        <div className="bg-zinc-950 border border-white/10 p-3 rounded-2xl flex items-center gap-3 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-[#9D4EDD]/15 flex items-center justify-center text-[#9D4EDD] shrink-0">
            <Apple className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-black text-white">{stats.perfectNutritionDays}</div>
            <div className="text-[9px] font-mono uppercase text-zinc-400">Perfect Diet</div>
          </div>
        </div>
      </div>

      {/* 3. Notification Settings Pill */}
      <NotificationSettings />

      {/* 4. Link to Health & Body Tools */}
      <Link
        to="/health-tools"
        className="w-full p-3.5 bg-zinc-950 border border-white/10 rounded-2xl flex items-center justify-between hover:border-[#CCFF00]/40 transition active:scale-95 group shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#CCFF00]/10 border border-[#CCFF00]/30 flex items-center justify-center text-[#CCFF00]">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-white group-hover:text-[#CCFF00] transition-colors">
              Health & Vitals Calculator
            </h3>
            <p className="text-[9px] text-zinc-400">BMI, Body Fat, BMR, TDEE & Hydration Calculator</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
      </Link>

      {/* 5. Badges & Achievements */}
      <div className="bg-zinc-950 border border-white/10 p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-[#CCFF00]" />
            Athlete Badges
          </h2>
          <span className="text-[9px] font-mono text-zinc-400">
            {badges.filter(b => b.earned).length} / {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {badges.map((badge) => (
            <div 
              key={badge.id}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                badge.earned 
                  ? 'border-[#CCFF00]/30 bg-[#CCFF00]/5' 
                  : 'border-white/5 bg-black/40 opacity-40 grayscale'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-1.5">
                <badge.icon className={`w-4 h-4 ${badge.color}`} />
              </div>
              <h3 className="text-[10px] font-black uppercase text-white truncate leading-tight">{badge.name}</h3>
              <p className="text-[8px] text-zinc-400 truncate mt-0.5">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Reflection Archive */}
      <div className="bg-zinc-950 border border-white/10 p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#3BB1FF]" />
            Reflection Journal
          </h2>
          <span className="text-[9px] font-mono text-zinc-400">{reflections.length} Entries</span>
        </div>

        {reflections.length === 0 ? (
          <div className="p-4 text-center bg-black/40 rounded-xl border border-white/5">
            <p className="text-xs text-zinc-400">No reflections saved yet.</p>
            <p className="text-[9px] text-zinc-600 mt-1">Complete daily habits on Home to log your mindset.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
            {reflections.map((item, i) => (
              <div key={i} className="p-2.5 bg-black/40 rounded-xl border border-white/5 text-xs">
                <span className="text-[8px] font-mono uppercase text-[#3BB1FF] block mb-0.5">{item.date}</span>
                <p className="text-zinc-200 italic font-medium leading-snug">"{item.reflection}"</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. Danger Zone: Delete Account */}
      <div className="bg-red-950/20 border border-red-500/20 p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
              <Trash2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-black uppercase text-red-400 tracking-wider">Account Deletion</h3>
              <p className="text-[9px] text-zinc-400 truncate">Permanently erase athlete profile, streaks & workout logs</p>
            </div>
          </div>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 rounded-xl text-[10px] font-black uppercase tracking-wider transition active:scale-95 shadow shrink-0"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Hidden File Input for Direct Uploads */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handlePhotoUpload}
      />

      {/* 7. Avatar Customizer Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-zinc-900/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#CCFF00]/10 border border-[#CCFF00]/30 flex items-center justify-center">
                  <Camera className="w-4 h-4 text-[#CCFF00]" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">Customize Profile Image</h3>
                  <p className="text-[10px] text-zinc-400">Google, Email, Phone & Guest accounts supported</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAvatarModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Avatar Summary Bar */}
            <div className="p-4 bg-black/40 border-b border-white/5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-[#CCFF00]/40 flex items-center justify-center text-lg font-black text-[#CCFF00] overflow-hidden shrink-0 shadow-inner">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Current Avatar" className="w-full h-full object-cover" />
                  ) : (
                    user?.displayName?.charAt(0) || "A"
                  )}
                </div>
                <div>
                  <div className="text-xs font-black uppercase text-white truncate max-w-[180px]">
                    {user?.displayName || "Athlete Profile"}
                  </div>
                  {authBadge && (
                    <span className={`inline-block mt-0.5 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${authBadge.color}`}>
                      {authBadge.label}
                    </span>
                  )}
                </div>
              </div>

              {user?.photoURL && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  disabled={isUploadingPhoto}
                  className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors"
                >
                  Reset to Letter
                </button>
              )}
            </div>

            {/* Error Message */}
            {photoError && (
              <div className="mx-4 mt-3 p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="text-[10px] leading-tight">{photoError}</span>
              </div>
            )}

            {/* Tabs Header */}
            <div className="flex border-b border-white/10 bg-zinc-950 px-4 pt-2">
              <button
                type="button"
                onClick={() => setAvatarTab("upload")}
                className={`flex-1 py-2 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                  avatarTab === "upload" 
                    ? "border-[#CCFF00] text-[#CCFF00]" 
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>
              <button
                type="button"
                onClick={() => setAvatarTab("presets")}
                className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                  avatarTab === "presets" 
                    ? "border-[#CCFF00] text-[#CCFF00]" 
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Athletic Personas</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-4 sm:p-5 overflow-y-auto max-h-[55vh] no-scrollbar">
              {/* TAB 1: UPLOAD */}
              {avatarTab === "upload" && (
                <div className="space-y-4">
                  <div 
                    onClick={() => !isUploadingPhoto && fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/15 hover:border-[#CCFF00]/60 bg-black/40 hover:bg-black/60 rounded-2xl p-6 text-center cursor-pointer transition-all group flex flex-col items-center justify-center gap-2.5"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-[#CCFF00]/10 flex items-center justify-center text-zinc-400 group-hover:text-[#CCFF00] transition-colors">
                      {isUploadingPhoto ? (
                        <RefreshCw className="w-6 h-6 animate-spin text-[#CCFF00]" />
                      ) : (
                        <Upload className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-white group-hover:text-[#CCFF00] transition-colors">
                        {isUploadingPhoto ? "Processing photo..." : "Choose Photo or Take Picture"}
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-1">
                        PNG, JPG, HEIC, or WebP. Auto-square cropped & optimized.
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={isUploadingPhoto}
                      className="mt-1 px-4 py-2 bg-[#CCFF00] hover:bg-[#b3e600] text-black font-black text-[10px] uppercase tracking-wider rounded-xl transition shadow-lg flex items-center gap-1.5"
                    >
                      <Camera className="w-3 h-3" />
                      <span>Browse Files / Camera</span>
                    </button>
                  </div>

                  <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-start gap-2.5 text-zinc-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#CCFF00] shrink-0 mt-0.5" />
                    <p className="text-[10px] leading-relaxed">
                      Your chosen avatar persists on this device, across reloads, and in the app header for your session.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: PRESET PERSONAS */}
              {avatarTab === "presets" && (
                <div className="space-y-3">
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">
                    Select a distinctive athletic avatar:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {PRESET_AVATARS.map((preset) => {
                      const isSelected = user?.photoURL === preset.image;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          disabled={isUploadingPhoto}
                          onClick={() => handleSelectPresetAvatar(preset)}
                          className={`relative p-2 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all group ${
                            isSelected
                              ? "border-[#CCFF00] bg-[#CCFF00]/10 shadow-lg scale-[1.02]"
                              : "border-white/10 bg-black/40 hover:border-white/30 hover:bg-white/5"
                          }`}
                        >
                          <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 group-hover:scale-105 transition-transform bg-zinc-800">
                            <img 
                              src={preset.image} 
                              alt={preset.name} 
                              className="w-full h-full object-cover" 
                              loading="lazy"
                            />
                          </div>
                          <span className="text-[10px] font-black uppercase text-white truncate w-full">
                            {preset.name}
                          </span>
                          <span className="text-[8px] font-mono text-zinc-400">
                            {preset.tag}
                          </span>
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#CCFF00] text-black flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-white/10 bg-zinc-950 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="px-4 py-1.5 text-xs font-black uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
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
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">Delete My Account</h3>
                  <p className="text-[10px] text-red-400 font-mono">Irreversible Action</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeletingAccount}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4">
              <div className="bg-zinc-900 border border-white/10 rounded-xl p-3.5 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Account to be purged</span>
                <div className="text-sm font-black text-white uppercase">
                  {user?.displayName || user?.email || user?.phoneNumber || "Current Athlete"}
                </div>
                <div className="text-xs font-mono text-zinc-400">
                  {user?.email && <div>{user.email}</div>}
                  {user?.phoneNumber && <div>{user.phoneNumber}</div>}
                  <div className="text-[9px] text-zinc-600 truncate mt-0.5">UID: {user?.uid}</div>
                </div>
              </div>

              <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl text-xs text-zinc-300 space-y-1.5">
                <p className="text-red-400 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  What will be erased:
                </p>
                <ul className="text-[11px] space-y-1 text-zinc-400 list-disc list-inside">
                  <li>Your athletic streak records and longest streaks</li>
                  <li>All saved workout, nutrition, and daily reflections</li>
                  <li>Custom profile avatar & persona equipment</li>
                  <li>Removal from the MEM Fitness registered athletes registry</li>
                </ul>
              </div>

              {deleteAccountError && (
                <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 font-bold">
                  {deleteAccountError}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-white/10 bg-zinc-950 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeletingAccount}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition"
              >
                Keep My Account
              </button>
              <button
                type="button"
                onClick={handleDeleteSelfAccount}
                disabled={isDeletingAccount}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-red-900/30"
              >
                {isDeletingAccount ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Permanently Delete</span>
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
