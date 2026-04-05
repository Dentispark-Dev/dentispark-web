/**
 * Email Service - Direct Fetch implementation for Resend API
 * This avoids needing the SDK in the path-constrained environment.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY || "re_123456789";
const DEFAULT_FROM = "DentiSpark <notifications@dentispark.com>";

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
}

export const emailService = {
  /**
   * Send a general email via Resend
   */
  send: async ({ to, subject, html }: SendEmailParams) => {
    if (RESEND_API_KEY === "re_123456789") {
      console.warn("[Email Service] No RESEND_API_KEY set. Email simulated to:", to);
      return { success: true, id: "simulated-id" };
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: DEFAULT_FROM,
          to: Array.isArray(to) ? to : [to],
          subject,
          html,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("[Email Service] Resend Error:", errorData);
        throw new Error(errorData.message || "Failed to send email");
      }

      return await response.json();
    } catch (error) {
      console.error("[Email Service] Network Error:", error);
      throw error;
    }
  },

  /**
   * Template: Booking Confirmation
   */
  sendBookingConfirmation: async (studentEmail: string, mentorName: string, sessionTime: string) => {
    return emailService.send({
      to: studentEmail,
      subject: `Booking Confirmed: Session with ${mentorName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #334155;">
          <h1 style="color: #10b981; font-weight: 800;">Get Ready!</h1>
          <p>Your mentorship session with <strong>${mentorName}</strong> is confirmed for <strong>${sessionTime}</strong>.</p>
          <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin: 24px 0;">
             <p style="margin: 0; font-weight: bold;">Session Link:</p>
             <p style="margin: 8px 0;"><a href="https://dentispark.com/mentorship/session" style="color: #10b981;">Join Call</a></p>
          </div>
          <p>Please make sure you have your Personal Statement ready if this is a review session.</p>
        </div>
      `,
    });
  },

  /**
   * Template: Session Reminder (1h before)
   */
  sendSessionReminder: async (to: string, startTime: string) => {
    return emailService.send({
      to,
      subject: `Reminder: Session starts in 1 hour`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #334155;">
          <h2 style="font-weight: 800;">Friendly Reminder 🔔</h2>
          <p>Your DentiSpark mentorship session starts at <strong>${startTime}</strong>.</p>
          <p>Stable internet and a quiet space are recommended for the best experience.</p>
          <p><a href="https://dentispark.com/mentorship/session" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; border-radius: 8px; text-decoration: none; font-weight: bold;">Join Meeting</a></p>
        </div>
      `,
    });
  }
};
