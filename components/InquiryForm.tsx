"use client";

import React, { useState, useEffect } from "react";
import { Programme, AttributionData } from "@/lib/types";
import { captureAttribution } from "@/lib/attribution";
import { trackLeadSubmitted } from "@/lib/analytics";
import { leadFormSchema } from "@/lib/validation";
import WhatsAppNoticeModal from "./WhatsAppNoticeModal";
import { User, Mail, Phone, GraduationCap, MapPin, Send, Loader2, CheckCircle } from "lucide-react";

interface InquiryFormProps {
  programmes: Programme[];
  selectedProgrammeId?: string;
  onProgrammeChange?: (id: string) => void;
}

export const INDIAN_STATES = [
  "Chhattisgarh",
  "Madhya Pradesh",
  "Odisha",
  "Maharashtra",
  "Uttar Pradesh",
  "Jharkhand",
  "Bihar",
  "Andhra Pradesh",
  "Telangana",
  "Delhi NCR",
  "West Bengal",
  "Rajasthan",
  "Other State",
];

export default function InquiryForm({
  programmes,
  selectedProgrammeId,
  onProgrammeChange,
}: InquiryFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    programmeId: selectedProgrammeId || "",
    state: "Chhattisgarh",
    city: "",
    consent: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [attribution, setAttribution] = useState<AttributionData>({});

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [createdLeadId, setCreatedLeadId] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [devOtp, setDevOtp] = useState<string | undefined>(undefined);

  // Capture Attribution & preselect course on load
  useEffect(() => {
    const attr = captureAttribution();
    setAttribution(attr);

    if (selectedProgrammeId) {
      setFormData((prev) => ({ ...prev, programmeId: selectedProgrammeId }));
    } else if (programmes.length > 0 && !formData.programmeId) {
      setFormData((prev) => ({ ...prev, programmeId: programmes[0].id }));
    }
  }, [programmes, selectedProgrammeId]);

  // Group programmes by level for clean dropdown display
  const ugCourses = programmes.filter((p) => p.level === "UG");
  const pgCourses = programmes.filter((p) => p.level === "PG");
  const diplomaCourses = programmes.filter((p) => p.level === "Diploma");
  const certCourses = programmes.filter((p) => p.level === "Certificate");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({ ...prev, [name]: val }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setServerError(null);

    if (name === "programmeId" && onProgrammeChange) {
      onProgrammeChange(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Selected programme details
    const chosenProg = programmes.find((p) => p.id === formData.programmeId || p.code === formData.programmeId);

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      programmeId: chosenProg?.id || formData.programmeId,
      programmeName: chosenProg?.name,
      state: formData.state,
      city: formData.city,
      consent: formData.consent,
      attribution,
    };

    // Client-side Zod validation
    const validation = leadFormSchema.safeParse(payload);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setServerError(data.error || "Failed to submit inquiry. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Track conversion event for GTM, Meta Pixel & Google Ads
      trackLeadSubmitted({
        leadId: data.leadId,
        programmeName: chosenProg?.name,
        programmeId: chosenProg?.id,
        city: formData.city,
        utmCampaign: attribution.utm_campaign,
      });

      // Show confirmation modal
      setCreatedLeadId(data.leadId);
      setMaskedEmail(data.maskedEmail);
      setDevOtp(data.devOtp);
      setModalOpen(true);
      setIsSubmitting(false);
    } catch (err) {
      console.error("Submission error:", err);
      setServerError("A network error occurred. Please check your connection and retry.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div id="inquiry-form" className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Form Institutional Header */}
        <div className="bg-[#1a5f7a] text-white p-5 sm:p-6 border-b-4 border-[#159895]">
          <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#159895] text-white text-xs font-bold uppercase tracking-wider mb-2">
            Session JULY-JUNE 2026-27
          </div>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-white leading-snug">
            Pre-Admission Inquiry Form
          </h3>
          <p className="text-xs sm:text-sm text-[#5be6e3] mt-1">
            प्रवेश पूर्व पूछताछ फॉर्म | Fill details to receive instant verification code
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          
          {serverError && (
            <div className="p-3.5 bg-red-50 border-l-4 border-red-500 rounded-md text-red-800 text-xs sm:text-sm">
              {serverError}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Full Name / पूरा नाम <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Ramesh Kumar Sharma"
                className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-all text-slate-900 font-medium ${
                  errors.fullName
                    ? "border-red-400 focus:ring-red-200"
                    : "border-slate-300 focus:border-[#1a5f7a] focus:ring-blue-100"
                }`}
                disabled={isSubmitting}
              />
            </div>
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Email Address / ईमेल <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ramesh.sharma@example.com"
                className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-all text-slate-900 font-medium ${
                  errors.email
                    ? "border-red-400 focus:ring-red-200"
                    : "border-slate-300 focus:border-[#1a5f7a] focus:ring-blue-100"
                }`}
                disabled={isSubmitting}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Your 6-digit OTP verification code will be sent to this email.
            </p>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Phone Number (+91) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Phone Number / मोबाइल नंबर <span className="text-red-500">*</span>
            </label>
            <div className="relative flex">
              <span className="inline-flex items-center px-3.5 text-sm text-slate-700 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg font-mono font-bold">
                +91
              </span>
              <input
                type="tel"
                name="phone"
                maxLength={10}
                value={formData.phone}
                onChange={handleChange}
                placeholder="9826123456"
                className={`w-full pl-3 pr-3.5 py-2.5 text-sm bg-slate-50 border rounded-r-lg focus:outline-none focus:ring-2 focus:bg-white font-mono font-medium transition-all text-slate-900 ${
                  errors.phone
                    ? "border-red-400 focus:ring-red-200"
                    : "border-slate-300 focus:border-[#1a5f7a] focus:ring-blue-100"
                }`}
                disabled={isSubmitting}
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Programme / Course Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Programme / Course (पाठ्यक्रम) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <GraduationCap className="w-4 h-4" />
              </div>
              <select
                name="programmeId"
                value={formData.programmeId}
                onChange={handleChange}
                className={`w-full pl-10 pr-8 py-2.5 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white appearance-none transition-all text-slate-900 font-semibold cursor-pointer ${
                  errors.programmeId
                    ? "border-red-400 focus:ring-red-200"
                    : "border-slate-300 focus:border-[#1a5f7a] focus:ring-blue-100"
                }`}
                disabled={isSubmitting}
              >
                <option value="" className="text-slate-900 bg-white font-medium">-- Select Degree / Programme --</option>
                
                {ugCourses.length > 0 && (
                  <optgroup label="--- UNDERGRADUATE (UG) DEGREE ---" className="text-slate-900 bg-white font-bold">
                    {ugCourses.map((prog) => (
                      <option key={prog.id} value={prog.id} className="text-slate-900 bg-white font-medium py-1">
                        {prog.name} ({prog.duration})
                      </option>
                    ))}
                  </optgroup>
                )}

                {pgCourses.length > 0 && (
                  <optgroup label="--- POSTGRADUATE (PG) DEGREE ---" className="text-slate-900 bg-white font-bold">
                    {pgCourses.map((prog) => (
                      <option key={prog.id} value={prog.id} className="text-slate-900 bg-white font-medium py-1">
                        {prog.name} ({prog.duration})
                      </option>
                    ))}
                  </optgroup>
                )}

                {diplomaCourses.length > 0 && (
                  <optgroup label="--- DIPLOMA & PG DIPLOMA ---" className="text-slate-900 bg-white font-bold">
                    {diplomaCourses.map((prog) => (
                      <option key={prog.id} value={prog.id} className="text-slate-900 bg-white font-medium py-1">
                        {prog.name} ({prog.duration})
                      </option>
                    ))}
                  </optgroup>
                )}

                {certCourses.length > 0 && (
                  <optgroup label="--- CERTIFICATE PROGRAMMES ---" className="text-slate-900 bg-white font-bold">
                    {certCourses.map((prog) => (
                      <option key={prog.id} value={prog.id} className="text-slate-900 bg-white font-medium py-1">
                        {prog.name} ({prog.duration})
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-600 text-xs font-bold">
                ▼
              </div>
            </div>
            {errors.programmeId && <p className="text-red-500 text-xs mt-1">{errors.programmeId}</p>}
          </div>

          {/* State & City in 2 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* State */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                State / राज्य <span className="text-red-500">*</span>
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:border-[#1a5f7a] focus:ring-blue-100 text-slate-900 font-medium cursor-pointer"
                disabled={isSubmitting}
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st} className="text-slate-900 bg-white font-medium">
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                City / शहर <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Bilaspur / Raipur"
                  className={`w-full pl-8 pr-3 py-2.5 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-all text-slate-900 font-medium ${
                    errors.city
                      ? "border-red-400 focus:ring-red-200"
                      : "border-slate-300 focus:border-[#1a5f7a] focus:ring-blue-100"
                  }`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
                className="mt-1 w-4 h-4 rounded-sm text-[#1a5f7a] focus:ring-[#1a5f7a] border-slate-300 cursor-pointer"
                disabled={isSubmitting}
              />
              <span className="text-xs text-slate-600 leading-snug">
                I consent to be contacted by PSSOU regarding admissions via Email, SMS, WhatsApp, or Call.
              </span>
            </label>
            {errors.consent && <p className="text-red-500 text-xs mt-1">{errors.consent}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1a5f7a] hover:bg-[#13465b] text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 text-sm sm:text-base cursor-pointer mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Application...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit & Get Verification Code</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-500">
            Official Pre-Admission Portal | Pt. Sundarlal Sharma (Open) University Chhattisgarh
          </p>
        </form>

      </div>

      {/* WhatsApp Notification Modal */}
      <WhatsAppNoticeModal
        isOpen={modalOpen}
        leadId={createdLeadId}
        maskedEmail={maskedEmail}
        devOtp={devOtp}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
