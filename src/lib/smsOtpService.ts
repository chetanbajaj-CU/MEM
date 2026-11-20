// MEM Fitness SMS & OTP Provider Client Library

export interface OtpSendResult {
  success: boolean;
  provider: "sms" | "email" | "phone";
  destination: string;
  expiresInSeconds: number;
  messageId: string;
  simulatedOtp?: string; // provided for development / preview test flows
  notice?: string;
  shareableText?: string;
}

export interface OtpVerifyResult {
  success: boolean;
  message?: string;
  uid?: string;
}

/**
 * Sends a real or development OTP via SMS or Email provider
 */
export async function sendOtpCode(
  destination: string,
  channel: "sms" | "email" | "phone" = "sms"
): Promise<OtpSendResult> {
  const response = await fetch("/api/auth/send-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      destination,
      channel,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to dispatch verification code");
  }

  return data;
}

/**
 * Verifies a 6-digit OTP code against server
 */
export async function verifyOtpCode(
  destination: string,
  code: string,
  channel: "sms" | "email" | "phone" = "sms"
): Promise<OtpVerifyResult> {
  const response = await fetch("/api/auth/verify-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      destination,
      code,
      channel,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Invalid verification code");
  }

  return data;
}

/**
 * Generates ready-to-share message text for SMS, Email or Phone WhatsApp / Messages
 */
export function generateShareableLoginMessage(
  type: "sms" | "email" | "phone",
  destination: string,
  code?: string
): { subject: string; body: string; shareUrl?: string } {
  const appName = "MEM Fitness (Mind. Energy. Motion)";
  const currentAppUrl = typeof window !== "undefined" ? window.location.origin : "https://mem-mind-energy-motion.ai.studio";
  
  if (type === "sms") {
    const body = code
      ? `[${appName}] Your one-time verification code is ${code}. Valid for 10 minutes. Sign in at: ${currentAppUrl}/login`
      : `[${appName}] Sign in to your athletic profile at ${currentAppUrl}/login using your phone: ${destination}`;
    return {
      subject: "MEM Fitness SMS Verification Code",
      body,
      shareUrl: `sms:${encodeURIComponent(destination)}?body=${encodeURIComponent(body)}`
    };
  }

  if (type === "phone") {
    const body = code
      ? `🏆 *MEM Fitness Athlete Pass*\nYour secure verification code is: *${code}*\n\nAccess your workouts & nutrition: ${currentAppUrl}/login\nPhone: ${destination}`
      : `🏆 *MEM Fitness Athlete Account*\nSign in to your MEM account with ${destination}: ${currentAppUrl}/login`;
    return {
      subject: "MEM Fitness Athlete Code",
      body,
      shareUrl: `https://api.whatsapp.com/send?phone=${encodeURIComponent(destination.replace(/[^0-9]/g, ""))}&text=${encodeURIComponent(body)}`
    };
  }

  // Email
  const subject = code
    ? `MEM Fitness: Your Sign-In Code is ${code}`
    : `MEM Fitness: Athlete Sign-In Link`;
  const body = code
    ? `Hello Athlete,\n\nYour one-time sign-in code for MEM Fitness is: ${code}\n\nThis verification code expires in 10 minutes.\nSign in here: ${currentAppUrl}/login?email=${encodeURIComponent(destination)}\n\nStay disciplined,\nMEM Fitness Team`
    : `Hello Athlete,\n\nSign in to your MEM Fitness account (${destination}):\n${currentAppUrl}/login\n\nStay disciplined,\nMEM Fitness Team`;

  return {
    subject,
    body,
    shareUrl: `mailto:${encodeURIComponent(destination)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  };
}
