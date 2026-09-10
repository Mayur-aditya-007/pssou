import crypto from "crypto";

const OTP_PEPPER = process.env.OTP_PEPPER || "pssou_admission_portal_secure_pepper_2026";
const OTP_EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 5;

/**
 * Generates a random 6-digit numeric OTP string
 */
export function generateOtpCode(): string {
  const num = crypto.randomInt(100000, 1000000);
  return num.toString();
}

/**
 * Creates a SHA-256 hash of the OTP code with salt/pepper
 */
export function hashOtpCode(otp: string): string {
  return crypto
    .createHmac("sha256", OTP_PEPPER)
    .update(otp)
    .digest("hex");
}

/**
 * Verifies if plain OTP matches the stored hash
 */
export function verifyOtpCode(plainOtp: string, storedHash: string): boolean {
  const calculatedHash = hashOtpCode(plainOtp);
  try {
    return crypto.timingSafeEqual(
      Buffer.from(calculatedHash),
      Buffer.from(storedHash)
    );
  } catch {
    return false;
  }
}

/**
 * Calculates OTP expiration timestamp (10 minutes from now)
 */
export function getOtpExpiresAt(): Date {
  const date = new Date();
  date.setMinutes(date.getMinutes() + OTP_EXPIRY_MINUTES);
  return date;
}

export { MAX_ATTEMPTS, OTP_EXPIRY_MINUTES };

/**
 * Generates a consistent, institutional PSSOU Application Reference Number
 * Pattern: PSSOUJUL2026 + Level code + 5-digit sequence (e.g. PSSOUJUL2026UG00123)
 */
export function generateApplicationNumber(level: string = "UG"): string {
  const cleanLevel = (level || "UG").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3);
  const randomSeq = crypto.randomInt(10000, 99999).toString();
  return `PSSOUJUL2026${cleanLevel}${randomSeq}`;
}
