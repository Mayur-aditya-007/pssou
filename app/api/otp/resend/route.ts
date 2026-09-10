import { NextRequest, NextResponse } from "next/server";
import { otpResendSchema } from "@/lib/validation";
import { dbGetLeadById, dbGetLatestOtp, dbSaveOtp } from "@/lib/supabase/db";
import { generateOtpCode, hashOtpCode, getOtpExpiresAt } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";

const RESEND_COOLDOWN_SECONDS = 45;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = otpResendSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Lead ID is required" },
        { status: 400 }
      );
    }

    const { leadId } = validation.data;

    // 1. Fetch Lead
    const lead = await dbGetLeadById(leadId);
    if (!lead) {
      return NextResponse.json(
        { success: false, error: "Lead record not found" },
        { status: 404 }
      );
    }

    if (lead.status === "verified") {
      return NextResponse.json(
        { success: false, error: "Application is already verified" },
        { status: 400 }
      );
    }

    // 2. Check Cooldown on latest OTP
    const latestOtp = await dbGetLatestOtp(leadId);
    if (latestOtp) {
      const createdTime = new Date(latestOtp.created_at).getTime();
      const elapsedSeconds = Math.floor((Date.now() - createdTime) / 1000);

      if (elapsedSeconds < RESEND_COOLDOWN_SECONDS) {
        const remainingCooldown = RESEND_COOLDOWN_SECONDS - elapsedSeconds;
        return NextResponse.json(
          {
            success: false,
            error: `Please wait ${remainingCooldown} seconds before requesting a new code`,
            cooldownRemaining: remainingCooldown,
          },
          { status: 429 }
        );
      }
    }

    // 3. Generate and Save New OTP
    const newOtpCode = generateOtpCode();
    const newOtpHash = hashOtpCode(newOtpCode);
    const expiresAt = getOtpExpiresAt();

    await dbSaveOtp(lead.id, newOtpHash, expiresAt);

    // 4. Send Email
    await sendOtpEmail({
      to: lead.email,
      fullName: lead.full_name,
      otp: newOtpCode,
      programmeName: lead.programme_name,
    });

    return NextResponse.json({
      success: true,
      message: "A fresh verification code has been dispatched to your email",
      devOtp: process.env.NODE_ENV === "development" || !process.env.SMTP_USER ? newOtpCode : undefined,
    });
  } catch (err) {
    console.error("Error resending OTP:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error occurred while resending code" },
      { status: 500 }
    );
  }
}
