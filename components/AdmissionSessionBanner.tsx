"use client";

import React from "react";
import { Calendar, AlertCircle, CheckCircle2, FileText } from "lucide-react";

export default function AdmissionSessionBanner() {
  return (
    <div className="space-y-4">
      {/* 1. Admission Session Highlight Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 overflow-hidden relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-[#059669] border border-emerald-200 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
              Admissions Open | ODL & Online Mode
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#1a5f7a] leading-tight">
              NEW/OLD STUDENT APPLY FOR ADMISSION
            </h2>
            <p className="text-sm text-slate-600 font-condensed mt-0.5">
              Apply for admission for the session of <strong className="text-slate-900 font-bold">JULY-JUNE 2026-27</strong>
            </p>
          </div>
        </div>

        {/* 2. Start & Last Date Split Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {/* Start Date */}
          <div className="flex items-center border border-emerald-500 rounded-lg overflow-hidden bg-white shadow-xs">
            <div className="w-1/2 bg-emerald-50 text-emerald-800 font-bold px-3 py-2 text-xs sm:text-sm flex items-center gap-1.5 border-r border-emerald-400">
              <Calendar className="w-4 h-4 text-[#10b981]" />
              <span>Start Date / प्रारंभ</span>
            </div>
            <div className="w-1/2 bg-[#10b981] text-white font-bold px-3 py-2 text-xs sm:text-sm text-center">
              01-07-2026
            </div>
          </div>

          {/* Last Date */}
          <div className="flex items-center border border-[#1a5f7a] rounded-lg overflow-hidden bg-white shadow-xs">
            <div className="w-1/2 bg-blue-50 text-[#1a5f7a] font-bold px-3 py-2 text-xs sm:text-sm flex items-center gap-1.5 border-r border-blue-300">
              <Calendar className="w-4 h-4 text-[#1a5f7a]" />
              <span>Last Date / अंतिम</span>
            </div>
            <div className="w-1/2 bg-[#1a5f7a] text-white font-bold px-3 py-2 text-xs sm:text-sm text-center">
              15-09-2026
            </div>
          </div>
        </div>
      </div>

      {/* 3. Important University Instructions (आवश्यक निर्देश) */}
      <div className="bg-[#f8fafc] border-l-4 border-[#159895] rounded-r-xl p-4 sm:p-5 shadow-xs border border-y-slate-200 border-r-slate-200 text-sm">
        <div className="flex items-center gap-2 text-[#1a5f7a] font-bold mb-2">
          <AlertCircle className="w-4 h-4 text-[#fb8500]" />
          <h3 className="font-heading text-base font-semibold">आवश्यक निर्देश (Important Instructions)</h3>
        </div>
        <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 leading-relaxed list-disc list-inside">
          <li>
            विश्वविद्यालय ऑनलाइन पोर्टल पर आपका स्वागत है। आवेदन फॉर्म भरने से पूर्व अपनी पात्रता व आवश्यक दस्तावेजों की जांच कर लें।
          </li>
          <li>
            विद्यार्थी ऑनलाइन शुल्क भुगतान के उपरांत प्रदत्त <strong>Application ID</strong> अवश्य नोट कर लेवें।
          </li>
          <li>
            वि. वि. में अध्ययनरत छात्र जो प्रथम/द्वितीय वर्ष में अनुत्तीर्ण हैं अथवा परीक्षा परिणाम की प्रतीक्षा कर रहे हैं, वे भी अगली कक्षा में प्रवेश हेतु पात्र हैं।
          </li>
          <li>
            यूजीसी दिशानिर्देशानुसार दूरस्थ शिक्षा (ODL) पाठ्यक्रमों में प्रवेश हेतु <strong>ABC ID</strong> एवं <strong>DEB ID</strong> अनिवार्य है।
          </li>
        </ul>
      </div>
    </div>
  );
}
