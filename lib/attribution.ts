import { AttributionData } from "./types";

const COOKIE_NAME = "pssou_attr";
const COOKIE_EXPIRY_DAYS = 30;

/**
 * Parses query params and document context to extract marketing attribution
 */
export function captureAttribution(): AttributionData {
  if (typeof window === "undefined") return {};

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const existing = getStoredAttribution();

    // Check if new UTMs or Click IDs are present in the current URL
    const hasNewAttribution =
      urlParams.has("utm_source") ||
      urlParams.has("utm_campaign") ||
      urlParams.has("gclid") ||
      urlParams.has("fbclid") ||
      urlParams.has("msclkid");

    // If already stored and no new campaign in URL, preserve existing first-touch
    if (existing && !hasNewAttribution) {
      return existing;
    }

    const attribution: AttributionData = {
      utm_source: urlParams.get("utm_source") || existing?.utm_source || "direct",
      utm_medium: urlParams.get("utm_medium") || existing?.utm_medium || "organic",
      utm_campaign: urlParams.get("utm_campaign") || existing?.utm_campaign || "general_admission",
      utm_term: urlParams.get("utm_term") || existing?.utm_term || undefined,
      utm_content: urlParams.get("utm_content") || existing?.utm_content || undefined,
      campaign_slug: urlParams.get("variant") || urlParams.get("c") || existing?.campaign_slug || undefined,
      gclid: urlParams.get("gclid") || existing?.gclid || undefined,
      fbclid: urlParams.get("fbclid") || existing?.fbclid || undefined,
      msclkid: urlParams.get("msclkid") || existing?.msclkid || undefined,
      referrer: document.referrer || existing?.referrer || undefined,
      landing_path: window.location.pathname + window.location.search,
      user_agent: navigator.userAgent,
    };

    saveAttribution(attribution);
    return attribution;
  } catch {
    return { utm_source: "direct", utm_medium: "none" };
  }
}

/**
 * Retrieves persisted attribution from cookie or localStorage
 */
export function getStoredAttribution(): AttributionData | null {
  if (typeof window === "undefined") return null;

  try {
    // 1. Check Cookie first
    const cookieMatch = document.cookie.match(
      new RegExp("(^|; )" + COOKIE_NAME + "=([^;]*)")
    );
    if (cookieMatch && cookieMatch[2]) {
      const decoded = decodeURIComponent(cookieMatch[2]);
      return JSON.parse(decoded) as AttributionData;
    }

    // 2. Check localStorage fallback
    const local = localStorage.getItem(COOKIE_NAME);
    if (local) {
      return JSON.parse(local) as AttributionData;
    }
  } catch (err) {
    console.error("Error reading stored attribution:", err);
  }

  return null;
}

/**
 * Persists attribution bundle in 30-day cookie and localStorage
 */
export function saveAttribution(data: AttributionData): void {
  if (typeof window === "undefined") return;

  try {
    const jsonStr = JSON.stringify(data);

    // Save to localStorage
    localStorage.setItem(COOKIE_NAME, jsonStr);

    // Save to 30-day cookie
    const expires = new Date();
    expires.setTime(expires.getTime() + COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
      jsonStr
    )};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  } catch (err) {
    console.error("Error saving attribution:", err);
  }
}
