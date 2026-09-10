"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trackOtpVerified } from "@/lib/analytics";
import confetti from "canvas-confetti";
import {
  ShieldCheck,
  Mail,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Loader2,
} from "lucide-react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const leadId = searchParams.get("lead") || "";
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [maskedEmail, setMaskedEmail] = useState<string>("your registered email");
  const [cooldown, setCooldown] = useState<number>(45);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [verifiedAppNo, setVerifiedAppNo] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState<boolean>(false);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  // Countdown timer for 45s resend cooldown
  useEffect(() => {
    if (cooldown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  // Handle individual digit input
  const handleInputChange = (index: number, value: string) => {
    if (redirecting) return;

    // Handle single character
    const cleaned = value.replace(/[^0-9]/g, "");

    const newOtp = [...otpValues];
    newOtp[index] = cleaned.slice(-1); // Only keep the last entered character
    setOtpValues(newOtp);
    setErrorMessage(null);

    // Auto-advance to next input
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all 6 digits entered
    if (cleaned && index === 5 && newOtp.every((d) => d !== "")) {
      const fullOtp = newOtp.join("");
      executeVerification(fullOtp);
    }
  };

  // Handle Backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Paste event for whole 6-digit code
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);

    if (pastedData.length > 0) {
      const newOtp = ["", "", "", "", "", ""];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtpValues(newOtp);
      setErrorMessage(null);

      const nextFocus = Math.min(pastedData.length, 5);
      inputRefs.current[nextFocus]?.focus();

      if (pastedData.length === 6) {
        executeVerification(pastedData);
      }
    }
  };

  // Execute verification API call
  const executeVerification = async (codeToVerify: string) => {
    if (!leadId) {
      setErrorMessage("Missing application session. Please submit the form again from the homepage.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, otp: codeToVerify }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setIsLoading(false);
        setErrorMessage(data.error || "Verification failed. Please check the code.");
        if (data.remainingAttempts !== undefined) {
          setAttemptsRemaining(data.remainingAttempts);
        }
        return;
      }

      // Verification Success
      setIsLoading(false);
      setVerifiedAppNo(data.applicationNo);
      setSuccessMessage(`Verified successfully! Application Ref: ${data.applicationNo}`);
      setRedirecting(true);

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#1a5f7a", "#159895", "#25D366", "#fb8500"],
        });
      } catch {
        // Confetti fallback
      }

      // Track OTP Verified conversion event
      trackOtpVerified({
        leadId,
        applicationNo: data.applicationNo,
      });

      // 1.5s hard redirect to official parent portal
      const targetUrl = data.redirectUrl || "https://pssou.net/portal/";
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 1800);
    } catch (err) {
      console.error("Verification network error:", err);
      setIsLoading(false);
      setErrorMessage("Network error during verification. Please check your connection.");
    }
  };

  // Resend OTP API Call
  const handleResend = async () => {
    if (!canResend || isResending || redirecting) return;

    if (!leadId) {
      setErrorMessage("Cannot resend code without active lead session.");
      return;
    }

    setIsResending(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/otp/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setIsResending(false);
        setErrorMessage(data.error || "Failed to resend code.");
        return;
      }

      setIsResending(false);
      setCooldown(45);
      setCanResend(false);
      setOtpValues(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setErrorMessage(null);
      alert("A fresh 6-digit verification code has been dispatched to your email.");
    } catch (err) {
      console.error("Resend error:", err);
      setIsResending(false);
      setErrorMessage("Network error while requesting new code.");
    }
  };

  const isFormComplete = otpValues.every((d) => d !== "");

  return (
    <div className="max-w-md mx-auto my-8 sm:my-12 px-4">
      
      {/* Verification Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-[#1a5f7a] text-white p-6 text-center border-b-4 border-[#159895]">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-white/20">
            <ShieldCheck className="w-6 h-6 text-[#5be6e3]" />
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
            Pre-Admission Verification
          </h2>
          <p className="text-xs text-[#5be6e3] font-condensed mt-1">
            प्रवेश पूर्व सत्यापन कोड | Pt. Sundarlal Sharma (Open) University
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {!redirecting ? (
            <>
              <div className="text-center space-y-1">
                <p className="text-xs sm:text-sm text-slate-600">
                  Please enter the 6-digit code sent to your email
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a5f7a] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  <Mail className="w-3.5 h-3.5 text-[#159895]" />
                  <span>Check Inbox & Spam Folders</span>
                </div>
              </div>

              {/* 6 Digit Input Boxes */}
              <div className="flex justify-center gap-2 sm:gap-3 py-2">
                {otpValues.map((val, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={handlePaste}
                    disabled={isLoading || redirecting}
                    className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold font-mono rounded-xl border-2 transition-all focus:outline-none ${
                      val
                        ? "border-[#1a5f7a] bg-blue-50/50 text-[#1a5f7a]"
                        : "border-slate-300 bg-slate-50 text-slate-800 focus:border-[#159895] focus:bg-white"
                    } ${errorMessage ? "border-red-400 bg-red-50/30" : ""}`}
                  />
                ))}
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-md text-red-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">{errorMessage}</p>
                    {attemptsRemaining !== null && (
                      <p className="text-[11px] mt-0.5">
                        Remaining attempts: <strong>{attemptsRemaining} of 5</strong>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Verification Button */}
              <button
                onClick={() => executeVerification(otpValues.join(""))}
                disabled={!isFormComplete || isLoading || redirecting}
                className="w-full bg-[#1a5f7a] hover:bg-[#13465b] text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 text-sm sm:text-base cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Continue to Portal</span>
                  </>
                )}
              </button>

              {/* Resend Code Section */}
              <div className="pt-2 text-center border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Valid for 10 min</span>
                </div>

                {canResend ? (
                  <button
                    onClick={handleResend}
                    disabled={isResending}
                    className="text-[#1a5f7a] hover:text-[#13465b] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`} />
                    <span>{isResending ? "Sending..." : "Resend Code"}</span>
                  </button>
                ) : (
                  <span className="text-slate-400 font-mono">
                    Resend in <strong>{cooldown}s</strong>
                  </span>
                )}
              </div>
            </>
          ) : (
            /* Success & Redirect State */
            <div className="text-center py-6 space-y-4 animate-in fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-[#10b981] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="font-heading text-xl font-bold text-slate-900">
                  Verification Successful!
                </h3>
                <p className="text-xs text-slate-600 font-condensed">
                  Your pre-admission inquiry is verified and recorded with PSSOU.
                </p>
              </div>

              {verifiedAppNo && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                  <span className="text-xs text-slate-500 uppercase tracking-wide block">
                    Application Reference No.
                  </span>
                  <span className="font-mono text-base font-bold text-[#1a5f7a]">
                    {verifiedAppNo}
                  </span>
                </div>
              )}

              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-[#1a5f7a]">
                <Loader2 className="w-4 h-4 animate-spin text-[#159895]" />
                <span>Redirecting you to official PSSOU Portal...</span>
              </div>

              <p className="text-[11px] text-slate-400">
                If not redirected automatically,{" "}
                <a
                  href="https://pssou.net/portal/"
                  className="text-[#1a5f7a] font-bold underline"
                >
                  click here to go to pssou.net/portal/
                </a>
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-6">
        <Suspense
          fallback={
            <div className="text-center py-20 text-slate-500 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-[#1a5f7a]" />
              <span>Loading verification screen...</span>
            </div>
          }
        >
          <VerifyContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
