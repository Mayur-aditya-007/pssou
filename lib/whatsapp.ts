import { LeadSubmissionPayload } from "./types";

interface WhatsAppSendResult {
  success: boolean;
  skipped?: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Pluggable Meta WhatsApp Cloud API integration for notifying PSSOU Admissions staff
 * When env vars are not set, it gracefully no-ops and logs to console.
 */
export async function notifyAdmissionsStaffOnWhatsApp(
  lead: LeadSubmissionPayload & { leadId: string }
): Promise<WhatsAppSendResult> {
  const token = process.env.WHATSAPP_CLOUD_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const notifyRecipient = process.env.WHATSAPP_BUSINESS_NOTIFY_NUMBER;

  // If credentials are not configured, log and gracefully skip
  if (!token || !phoneNumberId || !notifyRecipient) {
    console.log("ℹ️ [WhatsApp Cloud API] Credentials not configured. Skipped live notification.");
    console.log(`[WhatsApp Staff Payload]: New Lead Received -> ${lead.fullName} (${lead.phone}, ${lead.email}), Programme: ${lead.programmeName || lead.programmeId}, City: ${lead.city}, State: ${lead.state}, Campaign: ${lead.attribution?.utm_campaign || 'direct'}`);
    return { success: true, skipped: true };
  }

  try {
    const messageBody = `🔔 *New PSSOU Admission Lead Alert*\n\n` +
      `👤 *Name:* ${lead.fullName}\n` +
      `📞 *Phone:* ${lead.phone}\n` +
      `📧 *Email:* ${lead.email}\n` +
      `🎓 *Programme:* ${lead.programmeName || lead.programmeId}\n` +
      `📍 *Location:* ${lead.city}, ${lead.state}\n` +
      `📊 *Campaign:* ${lead.attribution?.utm_campaign || 'Direct / Organic'}\n` +
      `🕒 *Timestamp:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n\n` +
      `_Status: OTP Sent to Applicant_`;

    const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: notifyRecipient.replace(/[^0-9]/g, ""),
        type: "text",
        text: {
          preview_url: false,
          body: messageBody,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.warn("WhatsApp Cloud API error response:", errorData);
      return { success: false, error: JSON.stringify(errorData) };
    }

    const data = await response.json();
    console.log("✅ WhatsApp staff notification dispatched successfully:", data?.messages?.[0]?.id);
    return { success: true, messageId: data?.messages?.[0]?.id };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "WhatsApp notification network failure";
    console.error("WhatsApp notification dispatch failed:", errorMsg);
    return { success: false, error: errorMsg };
  }
}
