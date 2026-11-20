import { useState, useEffect } from "react";
import { Bell, BellOff, Clock, Mail, Smartphone, Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function NotificationSettings() {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [time, setTime] = useState("09:00");
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isTesting, setIsTesting] = useState(false);
  const [testMessage, setTestMessage] = useState("");

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }

    if (user) {
      const settingsStr = localStorage.getItem(`reminder_settings_${user.uid}`);
      if (settingsStr) {
        try {
          const settings = JSON.parse(settingsStr);
          setEnabled(settings.enabled || false);
          setEmailEnabled(settings.emailEnabled || false);
          setSmsEnabled(settings.smsEnabled || false);
          setTime(settings.time || "09:00");
        } catch (e) {
          console.error("Failed to parse reminder settings", e);
        }
      }
    }
  }, [user]);

  const saveSettings = (newEnabled: boolean, newEmailEnabled: boolean, newSmsEnabled: boolean, newTime: string) => {
    if (!user) return;
    localStorage.setItem(
      `reminder_settings_${user.uid}`,
      JSON.stringify({ enabled: newEnabled, emailEnabled: newEmailEnabled, smsEnabled: newSmsEnabled, time: newTime })
    );
  };

  const handleToggle = async () => {
    if (!enabled) {
      if ("Notification" in window) {
        try {
          if (Notification.permission === "granted") {
            setEnabled(true);
            saveSettings(true, emailEnabled, smsEnabled, time);
            return;
          }
          
          if (Notification.permission === "denied") {
            setPermission("denied");
            return;
          }

          const result = await Notification.requestPermission().catch(() => "default" as NotificationPermission);
          setPermission(result);
          if (result === "granted") {
            setEnabled(true);
            saveSettings(true, emailEnabled, smsEnabled, time);
          }
        } catch (err) {
          console.warn("Notification permission prompt dismissed or unsupported:", err);
        }
      }
    } else {
      setEnabled(false);
      saveSettings(false, emailEnabled, smsEnabled, time);
    }
  };

  const handleEmailToggle = () => {
    if (!user?.email && !emailEnabled) {
      alert("No email address registered. Please add an email to your account.");
      return;
    }
    const newVal = !emailEnabled;
    setEmailEnabled(newVal);
    saveSettings(enabled, newVal, smsEnabled, time);
  };

  const handleSmsToggle = () => {
    if (!user?.phoneNumber && !smsEnabled) {
      alert("No phone number registered. Please add a phone number to your account.");
      return;
    }
    const newVal = !smsEnabled;
    setSmsEnabled(newVal);
    saveSettings(enabled, emailEnabled, newVal, time);
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [_, min] = time.split(':');
    let h = parseInt(e.target.value);
    const isPM = parseInt(time.split(':')[0]) >= 12;
    if (isPM && h < 12) h += 12;
    if (!isPM && h === 12) h = 0;
    const newTime = `${h.toString().padStart(2, '0')}:${min}`;
    setTime(newTime);
    saveSettings(enabled, emailEnabled, smsEnabled, newTime);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [hr, _] = time.split(':');
    const newTime = `${hr}:${e.target.value}`;
    setTime(newTime);
    saveSettings(enabled, emailEnabled, smsEnabled, newTime);
  };

  const handleAmPmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let [hrStr, min] = time.split(':');
    let hr = parseInt(hrStr);
    const isPM = e.target.value === 'PM';
    
    if (isPM && hr < 12) hr += 12;
    else if (!isPM && hr >= 12) hr -= 12;
    
    const newTime = `${hr.toString().padStart(2, '0')}:${min}`;
    setTime(newTime);
    saveSettings(enabled, emailEnabled, smsEnabled, newTime);
  };

  const handleTestNotification = async () => {
    setIsTesting(true);
    setTestMessage("");
    
    try {
      const response = await fetch("/api/test-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: emailEnabled ? user?.email : null,
          phone: smsEnabled ? user?.phoneNumber : null,
          browser: enabled
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setTestMessage("Test notification sent successfully!");
        if (enabled && "Notification" in window && Notification.permission === "granted") {
          new Notification("MEM Test Notification", {
            body: "Your notifications are working perfectly!",
            icon: "/icon.png"
          });
        }
      } else {
        setTestMessage(`Failed: ${data.error}`);
      }
    } catch (err) {
      setTestMessage("Failed to send test notification.");
    } finally {
      setIsTesting(false);
      setTimeout(() => setTestMessage(""), 5000);
    }
  };

  return (
    <div className="bg-[#0A0A0A] border border-white/10 p-6 flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <Bell className="w-5 h-5 md:w-6 md:h-6 text-[#CCFF00]" />
        <h2 className="text-2xl font-black uppercase tracking-tight text-white">Daily Reminders</h2>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold tracking-widest uppercase text-white mb-1">
            Browser Notifications
          </div>
          <div className="text-[10px] uppercase tracking-widest text-white/50">
            Get reminded to complete your daily fitness goal.
          </div>
          {permission === "denied" && (
             <div className="text-xs font-bold text-red-500 mt-2">
               Notifications are blocked. Please enable them in your browser settings.
             </div>
          )}
        </div>

        <button
          onClick={handleToggle}
          className={`px-6 py-3 font-black uppercase tracking-widest text-[10px] transition-colors flex items-center gap-2 ${
            enabled
              ? "bg-[#CCFF00] text-black hover:bg-[#b3e600]"
              : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/20"
          }`}
        >
          {enabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          {enabled ? "Enabled" : "Disabled"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-white/5 pt-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-white mb-1">
            <Mail className="w-4 h-4" /> Email Notifications
          </div>
          <div className="text-[10px] uppercase tracking-widest text-white/50">
            {user?.email ? `Send to: ${user.email}` : "No email registered."}
          </div>
        </div>

        <button
          onClick={handleEmailToggle}
          className={`px-6 py-3 font-black uppercase tracking-widest text-[10px] transition-colors flex items-center gap-2 ${
            emailEnabled
              ? "bg-[#CCFF00] text-black hover:bg-[#b3e600]"
              : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/20"
          }`}
        >
          {emailEnabled ? "Enabled" : "Disabled"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-white/5 pt-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-white mb-1">
            <Smartphone className="w-4 h-4" /> SMS Notifications
          </div>
          <div className="text-[10px] uppercase tracking-widest text-white/50">
            {user?.phoneNumber ? `Send to: ${user.phoneNumber}` : "No phone number registered."}
          </div>
        </div>

        <button
          onClick={handleSmsToggle}
          className={`px-6 py-3 font-black uppercase tracking-widest text-[10px] transition-colors flex items-center gap-2 ${
            smsEnabled
              ? "bg-[#CCFF00] text-black hover:bg-[#b3e600]"
              : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/20"
          }`}
        >
          {smsEnabled ? "Enabled" : "Disabled"}
        </button>
      </div>

      <div className={`transition-opacity duration-300 ${(enabled || emailEnabled || smsEnabled) ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
         <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-white/5 pt-4">
          <div className="flex items-center gap-2">
             <Clock className="w-4 h-4 text-white/40" />
             <div className="text-sm font-bold tracking-widest uppercase text-white">
               Reminder Time
             </div>
          </div>
          <div className="flex items-center gap-4">
             {(() => {
               const [hrStr, minStr] = time.split(':');
               const hr = parseInt(hrStr);
               const displayHr = hr % 12 || 12;
               const amPm = hr >= 12 ? 'PM' : 'AM';
               return (
                 <div className="flex items-center gap-2 bg-black border border-white/20 p-1">
                   <select 
                     value={displayHr.toString().padStart(2, '0')} 
                     onChange={handleHourChange}
                     disabled={!(enabled || emailEnabled || smsEnabled)}
                     className="bg-transparent text-white font-mono px-2 py-1 outline-none appearance-none text-center disabled:opacity-50"
                   >
                     {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                       <option key={h} value={h.toString().padStart(2, '0')} className="bg-[#0A0A0A]">{h.toString().padStart(2, '0')}</option>
                     ))}
                   </select>
                   <span className="text-white/60 font-mono">:</span>
                   <select 
                     value={minStr} 
                     onChange={handleMinuteChange}
                     disabled={!(enabled || emailEnabled || smsEnabled)}
                     className="bg-transparent text-white font-mono px-2 py-1 outline-none appearance-none text-center disabled:opacity-50"
                   >
                     {Array.from({ length: 60 }, (_, i) => i).map(m => (
                       <option key={m} value={m.toString().padStart(2, '0')} className="bg-[#0A0A0A]">{m.toString().padStart(2, '0')}</option>
                     ))}
                   </select>
                   <select 
                     value={amPm} 
                     onChange={handleAmPmChange}
                     disabled={!(enabled || emailEnabled || smsEnabled)}
                     className="bg-transparent text-[#CCFF00] font-black uppercase tracking-widest px-2 py-1 outline-none appearance-none text-center disabled:opacity-50 ml-2"
                   >
                     <option value="AM" className="bg-[#0A0A0A]">AM</option>
                     <option value="PM" className="bg-[#0A0A0A]">PM</option>
                   </select>
                 </div>
               );
             })()}
             <button
                onClick={handleTestNotification}
                disabled={isTesting || !(enabled || emailEnabled || smsEnabled)}
                className="p-2 border border-white/20 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Send Test Notification"
             >
                <Send className="w-5 h-5" />
             </button>
          </div>
         </div>
         {testMessage && (
           <div className={`mt-4 text-[10px] font-bold uppercase tracking-widest ${testMessage.includes('Failed') ? 'text-red-500' : 'text-[#CCFF00]'}`}>
             {testMessage}
           </div>
         )}
      </div>
    </div>
  );
}
