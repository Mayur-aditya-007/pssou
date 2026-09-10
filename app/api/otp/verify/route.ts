import { NextRequest, NextResponse } from "next/server";
import { otpVerifySchema } from "@/lib/validation";
import {
  dbGetLeadById,
  dbGetLatestOtp,
  dbIncrementOtpAttempts,
  dbMarkLeadVerified,
  dbGetProgrammeById,
} from "@/lib/supabase/db";
import { verifyOtpCode } from "@/lib/otp";

const DEFAULT_REDIRECT_URL =
  process.env.NEXT_PUBLIC_PORTAL_REDIRECT_URL || "https://pssou.net/portal/";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = otpVerifySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid verification code format",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { leadId, otp } = validation.data;

    // 1. Fetch Lead
    const lead = await dbGetLeadById(leadId);
    if (!lead) {
      return NextResponse.json(
        { success: false, error: "Lead application record not found" },
        { status: 404 }
      );
    }

    if (lead.status === "verified") {
      return NextResponse.json({
        success: true,
        message: "Application is already verified",
        applicationNo: lead.application_no,
        redirectUrl: DEFAULT_REDIRECT_URL,
      });
    }

    // 2. Fetch Latest OTP Record
    const otpRecord = await dbGetLatestOtp(leadId);
    if (!otpRecord) {
      return NextResponse.json(
        {
          success: false,
          error: "No active verification code found. Please request a new OTP.",
        },
        { status: 400 }
      );
    }

    // 3. Check Attempt Limit
    if (otpRecord.attempts >= otpRecord.max_attempts) {
      return NextResponse.json(
        {
          success: false,
          error: "Maximum verification attempts exceeded. Please click Resend Code to receive a new OTP.",
          maxAttemptsReached: true,
        },
        { status: 429 }
      );
    }

    // 4. Check Expiry
    if (new Date() > new Date(otpRecord.expires_at)) {
      return NextResponse.json(
        {
          success: false,
          error: "Verification code has expired. Please request a new OTP.",
          expired: true,
        },
        { status: 400 }
      );
    }

    // 5. Verify OTP Hash
    const isValid = verifyOtpCode(otp, otpRecord.code_hash);

    if (!isValid) {
      const currentAttempts = await dbIncrementOtpAttempts(otpRecord.id);
      const remainingAttempts = Math.max(0, otpRecord.max_attempts - currentAttempts);

      return NextResponse.json(
        {
          success: false,
          error: `Incorrect verification code. ${remainingAttempts} attempts remaining.`,
          remainingAttempts,
        },
        { status: 400 }
      );
    }

    // 6. Successful Verification: Mark lead and generate application reference
    const programme = lead.programme_id ? await dbGetProgrammeById(lead.programme_id) : null;
    const programmeLevel = programme?.level || "UG";

    const result = await dbMarkLeadVerified(leadId, otpRecord.id, programmeLevel);

    return NextResponse.json({
      success: true,
      message: "Lead verified successfully",
      applicationNo: result.applicationNo,
      redirectUrl: DEFAULT_REDIRECT_URL,
    });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error occurred during verification" },
      { status: 500 }
    );
  }
}
