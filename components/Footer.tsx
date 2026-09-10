"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Globe, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#111827] text-slate-300 pt-12 pb-6 border-t-4 border-[#159895] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Col 1: University Identity */}
          <div className="space-y-4">
            <div className="inline-block">
              <Image
                src="/images/mono-nav.png"
                alt="PSSOU Logo"
                width={200}
                height={48}
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-condensed">
              Pt. Sundarlal Sharma (Open) University Chhattisgarh (PSSOU) is a state open university established by the Chhattisgarh Legislature Act No. 26 of 2004, recognized by UGC and UGC-DEB.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#5be6e3] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#25D366]" />
              <span>UGC & UGC-DEB Approved</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-heading text-base font-bold text-white uppercase tracking-wider text-[#5be6e3]">
              Quick Links (त्वरित लिंक)
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a
                  href="https://pssou.net/portal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5 text-[#159895]" />
                  <span>University Online Portal</span>
                </a>
              </li>
              <li>
                <a
                  href="http://pssou.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5 text-[#159895]" />
                  <span>Main Official Website (pssou.ac.in)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://pssou.net/portal/panel_student_login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5 text-[#159895]" />
                  <span>Student Self-Service Login</span>
                </a>
              </li>
              <li>
                <a
                  href="https://pssou.net/portal/notice_board/admission_prerequisite.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5 text-[#159895]" />
                  <span>Admission Guidelines (PDF)</span>
                </a>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-slate-500 hover:text-[#5be6e3]"
                >
                  <span>Staff / Admin Login</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Programmes Overview */}
          <div className="space-y-3">
            <h4 className="font-heading text-base font-bold text-white uppercase tracking-wider text-[#5be6e3]">
              Programmes (पाठ्यक्रम)
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>Bachelor of Arts (B.A.) / B.Com.</li>
              <li>Bachelor of Science (B.Sc. Bio/Math)</li>
              <li>BBA / BCA / B.Lib.I.Sc.</li>
              <li>Master of Arts (M.A.) / M.Com. / MSW</li>
              <li>Master of Computer Applications (MCA)</li>
              <li>PGDCA / DCA / Diploma in Yoga</li>
            </ul>
          </div>

          {/* Col 4: Campus & Help Desk */}
          <div className="space-y-3">
            <h4 className="font-heading text-base font-bold text-white uppercase tracking-wider text-[#5be6e3]">
              University Campus
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#159895] shrink-0 mt-0.5" />
                <span>
                  Pt. Sundarlal Sharma (Open) University Chhattisgarh, Koni-Birkona Road, Bilaspur (C.G.) – 495009
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#159895] shrink-0" />
                <span>Help Desk: +91 7752 240212</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#159895] shrink-0" />
                <span>Email: admissions@pssou.net</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Pt. Sundarlal Sharma (Open) University Chhattisgarh, Bilaspur. All rights reserved.
          </p>
          <div className="text-slate-400 text-center sm:text-right">
            Designed by Web Cell, Pandit Sundarlal Sharma (Open) University, Chhattisgarh
          </div>
        </div>

      </div>
    </footer>
  );
}
