import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export function useDailyReminder() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // We check the time every minute
    const interval = setInterval(() => {
      const settingsStr = localStorage.getItem(`reminder_settings_${user.uid}`);
      if (!settingsStr) return;

      try {
        const settings = JSON.parse(settingsStr);
        if (!settings.enabled && !settings.emailEnabled && !settings.smsEnabled) return;
        if (!settings.time) return;

        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const [remindHours, remindMinutes] = settings.time.split(':').map(Number);

        if (currentHours === remindHours && currentMinutes === remindMinutes) {
          // Check if we already notified today
          const todayStr = now.toLocaleDateString();
          const lastNotified = localStorage.getItem(`reminder_last_notified_${user.uid}`);

          if (lastNotified !== todayStr) {
            // Trigger browser notification
            if (settings.enabled && Notification.permission === 'granted') {
              new Notification('MEM Daily Fitness', {
                body: "It's time to complete your daily fitness goals! Stay on track.",
                icon: '/vite.svg',
              });
            }
            
            // Simulate Email/SMS notification via backend
            if (settings.emailEnabled || settings.smsEnabled) {
              fetch('/api/test-notification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: settings.emailEnabled ? user.email : null,
                  phone: settings.smsEnabled ? user.phoneNumber : null,
                  browser: false,
                  message: "It's time to complete your daily fitness goals! Stay on track."
                })
              }).catch(err => console.error("Simulated email/SMS failed", err));
            }

            localStorage.setItem(`reminder_last_notified_${user.uid}`, todayStr);
          }
        }
      } catch (error) {
        console.error('Error parsing reminder settings', error);
      }
    }, 10000); // Check every 10 seconds for more reliable triggering in test environment

    return () => clearInterval(interval);
  }, [user]);
}
