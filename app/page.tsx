import React from "react";
import Navbar from "@/components/Navbar";
import AdmissionSessionBanner from "@/components/AdmissionSessionBanner";
import InquiryForm from "@/components/InquiryForm";
import ProgrammeExplorer from "@/components/ProgrammeExplorer";
import TrustMarkers from "@/components/TrustMarkers";
import Footer from "@/components/Footer";
import { dbGetProgrammes } from "@/lib/supabase/db";
import { ShieldCheck, CheckCircle2, Award, BookOpen, Clock, Users, ArrowDown, ChevronRight, HelpCircle } from "lucide-react";

export const revalidate = 60; // ISR cache 1 minute

export default async function HomePage() {
  const programmes = await dbGetProgrammes();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      {/* 1. Official Institutional Header & WhatsApp Channel Ticker */}
      <Navbar />

      {/* 2. Hero Section with PSSOU Institutional Visuals */}
      <section className="relative bg-[#1a5f7a] text-white overflow-hidden py-10 lg:py-14 border-b-4 border-[#159895]">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 cute-dark-bg opacity-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left Hero Column: Institutional Intro & Value Props (7 Cols on desktop) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Institutional Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-xs sm:text-sm font-semibold text-[#5be6e3]">
                <ShieldCheck className="w-4 h-4 text-[#25D366]" />
                <span>Chhattisgarh State Open University | UGC & UGC-DEB Approved</span>
              </div>

              {/* Bilingual Main Headline */}
              <div className="space-y-2">
                <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  Admission Open <br />
                  <span className="text-[#5be6e3]">JULY-JUNE 2026-27</span>
                </h1>
                <p className="text-base sm:text-lg text-slate-200 font-condensed">
                  पण्डित सुन्दरलाल शर्मा (मुक्त) विश्वविद्यालय छत्तीसगढ़, बिलासपुर — दूरस्थ शिक्षा के माध्यम से स्नातक (UG), स्नातकोत्तर (PG), डिप्लोमा एवं सर्टिफिकेट पाठ्यक्रमों में प्रवेश प्रारंभ।
                </p>
              </div>

              {/* Key Quick Bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm">
                <div className="flex items-center gap-2.5 bg-white/10 p-3 rounded-xl backdrop-blur-xs border border-white/10">
                  <CheckCircle2 className="w-5 h-5 text-[#25D366] shrink-0" />
                  <span className="text-white font-medium">100% Recognized for Govt Jobs & PSC</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/10 p-3 rounded-xl backdrop-blur-xs border border-white/10">
                  <CheckCircle2 className="w-5 h-5 text-[#25D366] shrink-0" />
                  <span className="text-white font-medium">Self-Paced Learning with Printed SLM</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/10 p-3 rounded-xl backdrop-blur-xs border border-white/10">
                  <CheckCircle2 className="w-5 h-5 text-[#25D366] shrink-0" />
                  <span className="text-white font-medium">100+ Regional Centres in CG</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/10 p-3 rounded-xl backdrop-blur-xs border border-white/10">
                  <CheckCircle2 className="w-5 h-5 text-[#25D366] shrink-0" />
                  <span className="text-white font-medium">Affordable State-Regulated Fees</span>
                </div>
              </div>

              {/* Session Banner in Left Column */}
              <div className="pt-2">
                <AdmissionSessionBanner />
              </div>

            </div>

            {/* Right Hero Column: Sticky Inquiry Form (5 Cols on desktop) */}
            <div className="lg:col-span-5 lg:sticky lg:top-20">
              <InquiryForm programmes={programmes} />
            </div>

          </div>
        </div>
      </section>

      {/* 3. Statutory Recognition & Trust Section */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustMarkers />
        </div>
      </section>

      {/* 4. Programme Explorer Section */}
      <section className="py-12 bg-[#f8f9fa] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProgrammeExplorer programmes={programmes} />
        </div>
      </section>

      {/* 5. 4-Step Admission Process Section */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#1a5f7a] text-xs font-bold uppercase tracking-wider mb-2 border border-blue-200">
              Step-by-Step Flow
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1a5f7a]">
              Simple 4-Step Pre-Admission Flow
            </h2>
            <p className="text-sm text-slate-600 font-condensed mt-1">
              प्रवेश प्रक्रिया — सरल, पारदर्शी और त्वरित
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-6 text-center relative flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#1a5f7a] text-white font-bold flex items-center justify-center text-lg mb-4 shadow-sm">
                1
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900 mb-2">
                Submit Inquiry Form
              </h3>
              <p className="text-xs text-slate-600 font-condensed leading-relaxed">
                Fill in your contact details, select desired degree/programme, and submit the inquiry form.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-6 text-center relative flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#159895] text-white font-bold flex items-center justify-center text-lg mb-4 shadow-sm">
                2
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900 mb-2">
                Verify Email OTP
              </h3>
              <p className="text-xs text-slate-600 font-condensed leading-relaxed">
                Receive an instant 6-digit verification code on your registered email address and confirm.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-6 text-center relative flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#fb8500] text-white font-bold flex items-center justify-center text-lg mb-4 shadow-sm">
                3
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900 mb-2">
                Admissions Desk WhatsApp Notice
              </h3>
              <p className="text-xs text-slate-600 font-condensed leading-relaxed">
                Your pre-admission details are logged and forwarded to the PSSOU admissions desk on WhatsApp.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-6 text-center relative flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#10b981] text-white font-bold flex items-center justify-center text-lg mb-4 shadow-sm">
                4
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900 mb-2">
                Direct Portal Redirect
              </h3>
              <p className="text-xs text-slate-600 font-condensed leading-relaxed">
                Hard redirect to the official PSSOU student portal (<code>pssou.net/portal/</code>) to finalize documents.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Frequently Asked Questions (FAQ) */}
      <section className="py-12 bg-[#f8f9fa] border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1a5f7a]">
              Frequently Asked Questions (अक्सर पूछे जाने वाले प्रश्न)
            </h2>
          </div>

          <div className="space-y-3 text-sm">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h4 className="font-heading font-bold text-slate-900 text-base mb-1">
                Q1: Are PSSOU distance degrees valid for Government jobs and UPSC exams?
              </h4>
              <p className="text-slate-600 font-condensed text-xs sm:text-sm">
                <strong>Yes, 100%.</strong> PSSOU is a statutory State Open University created under Act No. 26 of 2004 of the Chhattisgarh Legislative Assembly. All degrees are recognized by UGC & DEB and are equivalent to regular degrees for all Government, PSC, SSC, UPSC, and private recruitment.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h4 className="font-heading font-bold text-slate-900 text-base mb-1">
                Q2: What is the last date to apply for JULY-JUNE 2026-27 session?
              </h4>
              <p className="text-slate-600 font-condensed text-xs sm:text-sm">
                The standard application window begins on <strong>01-07-2026</strong> and closes on <strong>15-09-2026</strong> (subject to extension with late fee as notified by the university).
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h4 className="font-heading font-bold text-slate-900 text-base mb-1">
                Q3: Are ABC ID and DEB ID mandatory for admission?
              </h4>
              <p className="text-slate-600 font-condensed text-xs sm:text-sm">
                Yes. As per UGC regulations for Open & Distance Learning (ODL), students must generate an <strong>ABC ID</strong> (Academic Bank of Credits) via Digilocker and create a <strong>DEB ID</strong> on the UGC-DEB student portal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Institutional Footer */}
      <Footer />
    </div>
  );
}
