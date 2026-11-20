import fs from 'fs';

let code = fs.readFileSync('src/components/NotificationSettings.tsx', 'utf-8');

// replace the handleTimeChange and input with custom selects
code = code.replace(
  /const handleTimeChange =.*?saveSettings\(enabled, emailEnabled, smsEnabled, newTime\);\s*};/s,
  `const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [_, min] = time.split(':');
    let h = parseInt(e.target.value);
    const isPM = parseInt(time.split(':')[0]) >= 12;
    if (isPM && h < 12) h += 12;
    if (!isPM && h === 12) h = 0;
    const newTime = \`\${h.toString().padStart(2, '0')}:\${min}\`;
    setTime(newTime);
    saveSettings(enabled, emailEnabled, smsEnabled, newTime);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [hr, _] = time.split(':');
    const newTime = \`\${hr}:\${e.target.value}\`;
    setTime(newTime);
    saveSettings(enabled, emailEnabled, smsEnabled, newTime);
  };

  const handleAmPmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let [hrStr, min] = time.split(':');
    let hr = parseInt(hrStr);
    const isPM = e.target.value === 'PM';
    
    if (isPM && hr < 12) hr += 12;
    else if (!isPM && hr >= 12) hr -= 12;
    
    const newTime = \`\${hr.toString().padStart(2, '0')}:\${min}\`;
    setTime(newTime);
    saveSettings(enabled, emailEnabled, smsEnabled, newTime);
  };`
);

code = code.replace(
  /<input\s+type="time".*?\/>/s,
  `{(() => {
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
             })()}`
);

fs.writeFileSync('src/components/NotificationSettings.tsx', code);
