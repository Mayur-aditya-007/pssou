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
 * Generates an institutional PSSOU HTML email template for OTP verification
 */
function generateEmailHtml(fullName: string, otp: string, programmeName?: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PSSOU Admission Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7f9; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f7f9; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
          
          <!-- Institutional Header Bar -->
          <tr>
            <td style="background-color: #1a5f7a; padding: 25px 30px; text-align: center; border-bottom: 4px solid #159895;">
              <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; line-height: 1.3;">
                Pt. Sundarlal Sharma (Open) University Chhattisgarh
              </h1>
              <p style="color: #5be6e3; margin: 6px 0 0 0; font-size: 13px; font-weight: 500;">
                पण्डित सुन्दरलाल शर्मा (मुक्त) विश्वविद्यालय छत्तीसगढ़, बिलासपुर
              </p>
              <p style="color: #ffffff; margin: 4px 0 0 0; font-size: 11px; opacity: 0.85; text-transform: uppercase; letter-spacing: 1px;">
                (Recognized by UGC & UGC-DEB | Estd. 2005)
              </p>
            </td>
          </tr>

          <!-- Email Content Body -->
          <tr>
            <td style="padding: 35px 35px 25px 35px; color: #1e293b;">
              <h2 style="font-size: 18px; color: #1a5f7a; margin: 0 0 15px 0; font-weight: 600;">
                Pre-Admission Verification Code / प्रवेश सत्यापन कोड
              </h2>
              <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 15px 0;">
                Dear <strong>${fullName}</strong>,
              </p>
              <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 20px 0;">
                Thank you for submitting your pre-admission inquiry for <strong>${programmeName || "Distance Education Programmes"}</strong> for the <strong>JULY-JUNE 2026-27</strong> session at PSSOU.
              </p>
              <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 25px 0;">
                Please use the following 6-digit One-Time Password (OTP) to complete your verification and proceed to the official university portal:
              </p>

              <!-- OTP Code Display Card -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px;">
                <tr>
                  <td align="center" style="background-color: #f8fafc; border: 2px dashed #159895; border-radius: 10px; padding: 20px;">
                    <span style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #1a5f7a; font-family: 'Courier New', Courier, monospace; display: inline-block;">
                      ${otp}
                    </span>
                    <div style="font-size: 12px; color: #64748b; margin-top: 8px; font-weight: 500;">
                      Valid for <strong>10 minutes</strong> | Max 5 attempts
                    </div>
                  </td>
                </tr>
              </table>

              <div style="background-color: #fffbeb; border-left: 4px solid #fb8500; padding: 12px 16px; border-radius: 6px; margin-bottom: 25px;">
                <p style="font-size: 12px; color: #92400e; margin: 0; line-height: 1.5;">
                  <strong>Important:</strong> If you did not initiate this inquiry, please disregard this email. Never share your verification OTP with unauthorized third parties.
                </p>
              </div>

              <p style="font-size: 13px; line-height: 1.5; color: #64748b; margin: 0;">
                Regards,<br>
                <strong>Admissions & Central Facilitation Cell</strong><br>
                Pt. Sundarlal Sharma (Open) University Chhattisgarh, Bilaspur
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; line-height: 1.5;">
              <p style="margin: 0 0 4px 0;">
                PSSOU Bilaspur Campus: Koni-Birkona Road, Bilaspur (C.G.) – 495009
              </p>
              <p style="margin: 0;">
                Official Website: <a href="https://pssou.net" target="_blank" style="color: #1a5f7a; text-decoration: none; font-weight: 600;">pssou.net</a> | Mirror: <a href="http://pssou.ac.in" target="_blank" style="color: #1a5f7a; text-decoration: none; font-weight: 600;">pssou.ac.in</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Sends branded OTP email using Nodemailer or falls back to console logging
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
    const fromAddress =
      process.env.SMTP_FROM || (user ? `"PSSOU Admissions" <${user}>` : '"PSSOU Admissions" <admissions@pssou.net>');

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
      subject: `PSSOU Admission Verification Code: ${otp} (JULY-JUNE 2026-27)`,
      text: `Dear ${fullName},\n\nYour 6-digit PSSOU Admission Verification OTP is: ${otp}\n\nThis code expires in 10 minutes.\n\nRegards,\nPSSOU Admissions Team`,
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
