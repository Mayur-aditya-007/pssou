import { NextRequest, NextResponse } from "next/server";
import { leadFormSchema } from "@/lib/validation";
import { dbCreateLead, dbSaveOtp, dbMarkLeadWhatsAppNotified } from "@/lib/supabase/db";
import { generateOtpCode, hashOtpCode, getOtpExpiresAt } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";
import { notifyAdmissionsStaffOnWhatsApp } from "@/lib/whatsapp";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Server-side Zod Validation
    const validationResult = leadFormSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const payload = validationResult.data;

    // Extract client IP for secure hashing
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    // 1. Create Lead in Database (status: 'pending_otp')
    const lead = await dbCreateLead(payload, clientIp);

    // 2. Generate 6-digit numeric OTP and secure hash
    const otpCode = generateOtpCode();
    const otpHash = hashOtpCode(otpCode);
    const expiresAt = getOtpExpiresAt();

    // 3. Save OTP record
    await dbSaveOtp(lead.id, otpHash, expiresAt);

    // 4. Send Branded OTP Email via Nodemailer
    await sendOtpEmail({
      to: lead.email,
      fullName: lead.full_name,
      otp: otpCode,
      programmeName: lead.programme_name,
    });

    // 5. Asynchronous Staff Notification on WhatsApp (Non-blocking)
    notifyAdmissionsStaffOnWhatsApp({
      ...payload,
      leadId: lead.id,
      programmeName: lead.programme_name,
    })
      .then((res) => {
        if (res.success && !res.skipped) {
          dbMarkLeadWhatsAppNotified(lead.id);
        }
      })
      .catch((err) => console.warn("WhatsApp background notification error:", err));

    // Mask email for user privacy (e.g. j***e@example.com)
    const emailParts = lead.email.split("@");
    const maskedName =
      emailParts[0].length > 2
        ? emailParts[0][0] + "*".repeat(emailParts[0].length - 2) + emailParts[0].slice(-1)
        : emailParts[0][0] + "*";
    const maskedEmail = `${maskedName}@${emailParts[1]}`;

    return NextResponse.json({
      success: true,
      message: "Lead created and verification code dispatched",
      leadId: lead.id,
      maskedEmail,
      programmeName: lead.programme_name,
      // In development / demo when SMTP is not active, return devOtp for seamless testing
      devOtp: process.env.NODE_ENV === "development" || !process.env.SMTP_USER ? otpCode : undefined,
    });
  } catch (err) {
    console.error("Error creating lead:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error occurred while processing lead" },
      { status: 500 }
    );
  }
}
