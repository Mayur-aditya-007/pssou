import nodemailer from "nodemailer";

interface SendOtpEmailParams {
  to: string;
  fullName: string;
  otp: string;
  programmeName?: string;
}

/**
 * Constructs a Nodemailer transporter using SMTP env vars
 */
function createTransporter() {
  const host = process.env.SMTP_HOST?.trim();
  const port = parseInt(process.env.SMTP_PORT?.trim() || "587", 10);
  const user = process.env.SMTP_USER?.trim();
  const rawPass = process.env.SMTP_PASS?.trim();
  const pass = rawPass?.replace(/\s+/g, "");

  if (!host || !user || !pass) {
    console.log("ℹ️ [SMTP Status] Incomplete SMTP env vars:", {
      SMTP_HOST: host ? "configured" : "MISSING",
      SMTP_USER: user ? user : "MISSING",
      SMTP_PASS: pass ? "********" : "MISSING",
      SMTP_PORT: port,
    });
    return null;
  }

  // If using Gmail, configure with service: 'gmail' for best reliability
  if (host.includes("gmail")) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * Generates a clean, lightweight HTML email template without heavy phishing triggers
 */
function generateEmailHtml(fullName: string, otp: string, programmeName?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Verification Code</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f9fafb;">
  <div style="max-width: 500px; margin: 0 auto; background: #ffffff; padding: 25px; border-radius: 8px; border: 1px solid #e5e7eb;">
    <h2 style="color: #111827; margin-top: 0; font-size: 18px;">Verification Code</h2>
    <p>Hello ${fullName},</p>
    <p>Your verification code for ${programmeName ? programmeName : "admission inquiry"} is:</p>
    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
      <span style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #1e40af;">${otp}</span>
    </div>
    <p style="font-size: 13px; color: #6b7280; margin-bottom: 0;">This code will expire in 10 minutes. If you did not request this, you can safely ignore this email.</p>
  </div>
</body>
</html>
  `;
}

/**
 * Sends OTP email using Nodemailer or falls back to console logging
 */
export async function sendOtpEmail({
  to,
  fullName,
  otp,
  programmeName,
}: SendOtpEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createTransporter();
    const user = process.env.SMTP_USER?.trim();
    const host = process.env.SMTP_HOST?.trim() || "";

    // When using Gmail SMTP, the 'from' address MUST match SMTP_USER to avoid SPF/DMARC spam penalties
    let fromAddress = process.env.SMTP_FROM?.trim();
    if (!fromAddress || host.includes("gmail")) {
      fromAddress = user ? `"Admissions Verification" <${user}>` : '"Admissions Verification" <admissions@pssou.net>';
    }

    const htmlContent = generateEmailHtml(fullName, otp, programmeName);

    if (!transporter) {
      console.log("=================================================");
      console.log("📧 [DEMO / DEV EMAIL OTP NOTIFICATION]");
      console.log(`To: ${fullName} <${to}>`);
      console.log(`Course: ${programmeName || "General"}`);
      console.log(`6-Digit Verification Code: [ ${otp} ]`);
      console.log(`Expires in: 10 minutes`);
      console.log("=================================================");
      return { success: true };
    }

    console.log(`📡 Sending OTP email from: ${fromAddress} to: ${to}...`);

    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject: `Your verification code is ${otp}`,
      text: `Hello ${fullName},\n\nYour verification code is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you did not request this, please ignore this email.`,
      html: htmlContent,
    });

    console.log(`✅ Email dispatched successfully to ${to}. MessageId: ${info.messageId}, Response: ${info.response}`);
    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to send email";
    console.error("❌ Nodemailer send error:", errorMessage);
    // Return gracefully so flow can continue with fallback logging
    return { success: false, error: errorMessage };
  }
}
