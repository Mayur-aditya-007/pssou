"use client";

import React from "react";
import { ShieldCheck, Award, BookCheck, MapPin, Building2, Users } from "lucide-react";

export default function TrustMarkers() {
  const highlights = [
    {
      icon: <Building2 className="w-6 h-6 text-[#1a5f7a]" />,
      title: "State Open University",
      subtitle: "Established in 2005 by Chhattisgarh Legislature Act No. 26 of 2004",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#159895]" />,
      title: "UGC & DEB Recognized",
      subtitle: "Approved by Distance Education Bureau (DEB) & UGC under Section 2(f)",
    },
    {
      icon: <Award className="w-6 h-6 text-[#fb8500]" />,
      title: "100% Valid for Govt. Jobs",
      subtitle: "Equivalent to regular degrees for UPSC, CGPSC, SSC, Banking & Higher Education",
    },
    {
      icon: <MapPin className="w-6 h-6 text-[#10b981]" />,
      title: "100+ Study Centres",
      subtitle: "Extensive study centre network across all 33 districts of Chhattisgarh",
    },
    {
      icon: <BookCheck className="w-6 h-6 text-[#4f46e5]" />,
      title: "Self-Instructional Material",
      subtitle: "Printed & online SLM e-books in Hindi & English with dedicated student portal",
    },
    {
      icon: <Users className="w-6 h-6 text-[#dc3545]" />,
      title: "Affordable Fee Structure",
      subtitle: "Government-regulated fee with installment & concession support",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#1a5f7a] text-xs font-bold uppercase tracking-wider mb-2 border border-blue-200">
          Statutory Recognitions & Credentials
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1a5f7a]">
          Why Study at PSSOU Bilaspur?
        </h2>
        <p className="text-sm text-slate-600 font-condensed mt-1">
          पण्डित सुन्दरलाल शर्मा (मुक्त) विश्वविद्यालय छत्तीसगढ़ — दूरस्थ शिक्षा के माध्यम से उच्च शिक्षा आपके द्वार
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {highlights.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex items-start gap-4 border-l-4 border-l-[#1a5f7a]"
          >
            <div className="p-2.5 bg-slate-50 rounded-lg shrink-0 border border-slate-100">
              {item.icon}
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-slate-900 leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 font-condensed mt-1 leading-relaxed">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
