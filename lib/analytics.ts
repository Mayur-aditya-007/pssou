declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackLeadSubmitted(leadData: {
  leadId: string;
  programmeName?: string;
  programmeId?: string;
  city?: string;
  utmCampaign?: string;
}) {
  if (typeof window === "undefined") return;

  try {
    // 1. GTM dataLayer event
    if (window.dataLayer) {
      window.dataLayer.push({
        event: "lead_submitted",
        lead_id: leadData.leadId,
        programme_name: leadData.programmeName,
        programme_id: leadData.programmeId,
        city: leadData.city,
        utm_campaign: leadData.utmCampaign,
      });
    }

    // 2. Meta Pixel Lead event
    if (typeof window.fbq === "function") {
      window.fbq("track", "Lead", {
        content_name: leadData.programmeName,
        content_category: "Admission Inquiry",
        status: "pending_otp",
      });
    }

    // 3. Google Ads gtag event
    if (typeof window.gtag === "function") {
      window.gtag("event", "generate_lead", {
        event_category: "Admissions",
        event_label: leadData.programmeName,
        value: 1,
      });
    }
  } catch (err) {
    console.error("Analytics tracking error (lead_submitted):", err);
  }
}

export function trackOtpVerified(verifiedData: {
  leadId: string;
  applicationNo?: string;
  programmeName?: string;
}) {
  if (typeof window === "undefined") return;

  try {
    // 1. GTM dataLayer event
    if (window.dataLayer) {
      window.dataLayer.push({
        event: "otp_verified",
        lead_id: verifiedData.leadId,
        application_no: verifiedData.applicationNo,
        programme_name: verifiedData.programmeName,
      });
    }

    // 2. Meta Pixel CompleteRegistration event
    if (typeof window.fbq === "function") {
      window.fbq("track", "CompleteRegistration", {
        content_name: verifiedData.programmeName,
        status: "verified",
      });
    }

    // 3. Google Ads gtag conversion
    if (typeof window.gtag === "function") {
      window.gtag("event", "conversion", {
        event_category: "Admissions",
        event_label: "OTP Verified Lead",
        value: 1,
      });
    }
  } catch (err) {
    console.error("Analytics tracking error (otp_verified):", err);
  }
}
