"use client";

import React from "react";
import { MessageSquare, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

interface WhatsAppNoticeModalProps {
  isOpen: boolean;
  leadId: string;
  maskedEmail: string;
  devOtp?: string;
  onClose?: () => void;
}

export default function WhatsAppNoticeModal({
  isOpen,
  leadId,
  maskedEmail,
  devOtp,
}: WhatsAppNoticeModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleProceed = () => {
    router.push(`/verify?lead=${encodeURIComponent(leadId)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-[#075E54] text-white p-5 text-center relative border-b-4 border-[#25D366]">
          <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-white/20">
            <MessageSquare className="w-7 h-7 text-[#25D366]" />
          </div>
          <h3 className="font-heading text-xl font-bold text-white">
            Application Received!
          </h3>
          <p className="text-xs text-[#5be6e3] font-medium mt-1">
            Pt. Sundarlal Sharma (Open) University Chhattisgarh
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-slate-800">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
            <p className="text-sm font-semibold text-emerald-900 leading-snug">
              Your details have been received and forwarded to the PSSOU admissions team on WhatsApp.
            </p>
          </div>

          <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm">
            <Mail className="w-5 h-5 text-[#1a5f7a] shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-700 font-medium">
                A 6-digit verification code has been dispatched to:
              </p>
              <p className="text-[#1a5f7a] font-bold text-sm mt-0.5 font-mono">
                {maskedEmail}
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Please check your inbox (and spam/junk folder) to complete verification.
              </p>
            </div>
          </div>

          {/* Dev/Demo helper when SMTP is local */}
          {devOtp && (
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-2.5 text-xs text-amber-800 text-center font-mono">
              ⚡ Demo OTP: <strong>{devOtp}</strong> (Valid for 10 min)
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-slate-500 justify-center">
            <ShieldCheck className="w-4 h-4 text-[#10b981]" />
            <span>Secure 256-Bit Encrypted Verification</span>
          </div>

          {/* Action Button */}
          <button
            onClick={handleProceed}
            className="w-full bg-[#1a5f7a] hover:bg-[#13465b] text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-sm sm:text-base group cursor-pointer"
          >
            <span>Proceed to Email Verification</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
}
