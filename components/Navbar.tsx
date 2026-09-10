"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Menu, X, Globe, User, BookOpen, Video, HelpCircle } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [studentServicesOpen, setStudentServicesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 shadow-md">
      {/* 1. Official WhatsApp Channel Continuous Scrolling Ticker */}
      <div className="bg-[#075E54] text-white h-11 relative overflow-hidden flex items-center shadow-inner text-sm border-b border-[#128C7E]">
        {/* Left Fixed Badge */}
        <div className="absolute left-0 top-0 bottom-0 bg-[#128C7E] px-3 sm:px-4 z-20 flex items-center gap-2 font-bold border-r-2 border-[#25D366] text-xs sm:text-sm whitespace-nowrap shadow-md">
          <MessageCircle className="w-4 h-4 text-[#25D366]" />
          <span>Official Channel</span>
        </div>

        {/* Continuous Marquee Text */}
        <div className="w-full overflow-hidden flex items-center pl-36 sm:pl-44 pr-32 sm:pr-36">
          <div className="animate-ticker text-xs sm:text-sm flex items-center">
            <div className="flex items-center gap-4 px-6 shrink-0">
              <span>विश्वविद्यालय की प्रत्येक महत्वपूर्ण सूचना अब सीधे आपके मोबाइल पर</span>
              <span className="text-[#5be6e3]">|</span>
              <span>प्रवेश, परीक्षा, परिणाम एवं समय-सारणी के नियमित अपडेट हेतु आधिकारिक WhatsApp चैनल से जुड़ें।</span>
              <span className="text-[#5be6e3]">|</span>
              <span>Pt. Sundarlal Sharma (Open) University Chhattisgarh Admission Session JULY-JUNE 2026-27</span>
            </div>
            <div className="flex items-center gap-4 px-6 shrink-0">
              <span>विश्वविद्यालय की प्रत्येक महत्वपूर्ण सूचना अब सीधे आपके मोबाइल पर</span>
              <span className="text-[#5be6e3]">|</span>
              <span>प्रवेश, परीक्षा, परिणाम एवं समय-सारणी के नियमित अपडेट हेतु आधिकारिक WhatsApp चैनल से जुड़ें।</span>
              <span className="text-[#5be6e3]">|</span>
              <span>Pt. Sundarlal Sharma (Open) University Chhattisgarh Admission Session JULY-JUNE 2026-27</span>
            </div>
          </div>
        </div>

        {/* Right Fixed Join Button */}
        <div className="absolute right-0 top-0 bottom-0 bg-[#075E54] px-2 sm:px-3 z-20 flex items-center">
          <a
            href="https://whatsapp.com/channel/0029VbCoQR2JJhzRVY4FZ926"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#128C7E] text-slate-900 hover:text-white text-xs font-bold px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1 shadow-sm"
          >
            <span>चैनल से जुड़ें</span>
          </a>
        </div>
      </div>

      {/* 2. Main Institutional Navbar */}
      <nav className="bg-[#1a5f7a] text-white border-b-[3px] border-[#159895] px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Official Emblem Logo & University Title */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative shrink-0 flex items-center">
              <Image
                src="/images/mono-nav.png"
                alt="PSSOU Emblem Crest"
                width={220}
                height={52}
                className="h-10 sm:h-12 w-auto object-contain"
                priority
              />
            </div>
            <div className="hidden md:flex flex-col">
              <span className="font-heading text-base lg:text-lg font-bold tracking-tight text-white leading-tight">
                Pt. Sundarlal Sharma (Open) University
              </span>
              <span className="text-xs text-[#5be6e3] font-condensed">
                पण्डित सुन्दरलाल शर्मा (मुक्त) विश्वविद्यालय छत्तीसगढ़, बिलासपुर
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Menu */}
          <div className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/"
              className="px-3 py-2 rounded-md hover:bg-[#13465b] transition-colors text-white flex items-center gap-1.5"
            >
              <span>Home</span>
            </Link>

            {/* Student Services Dropdown */}
            <div className="relative group">
              <button
                onClick={() => setStudentServicesOpen(!studentServicesOpen)}
                className="px-3 py-2 rounded-md hover:bg-[#13465b] transition-colors text-white flex items-center gap-1"
              >
                <span>Student Services</span>
                <span className="text-xs">▼</span>
              </button>

              <div className="absolute left-0 mt-1 w-56 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 hidden group-hover:block z-50 py-2">
                <a
                  href="https://pssou.net/portal/panel_student_login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 hover:bg-[#f1f5f9] flex items-center gap-2 text-sm text-slate-700 hover:text-[#1a5f7a] transition-colors"
                >
                  <User className="w-4 h-4 text-[#159895]" />
                  <span>Student Login</span>
                </a>
                <a
                  href="http://pssou.ac.in/index?page=ebook"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 hover:bg-[#f1f5f9] flex items-center gap-2 text-sm text-slate-700 hover:text-[#1a5f7a] transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-[#159895]" />
                  <span>Read Ebook (SLM)</span>
                </a>
                <a
                  href="https://pssou.net/portal/video_tutorials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 hover:bg-[#f1f5f9] flex items-center gap-2 text-sm text-slate-700 hover:text-[#1a5f7a] transition-colors"
                >
                  <Video className="w-4 h-4 text-[#159895]" />
                  <span>Video Tutorials</span>
                </a>
                <div className="border-t border-slate-100 my-1"></div>
                <a
                  href="http://pssou.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 hover:bg-[#f1f5f9] flex items-center gap-2 text-sm text-slate-700 hover:text-[#1a5f7a] transition-colors"
                >
                  <Globe className="w-4 h-4 text-[#159895]" />
                  <span>GoTo Main Website</span>
                </a>
              </div>
            </div>

            <a
              href="https://pssou.net/portal/panel_contact_us"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-md hover:bg-[#13465b] transition-colors text-white flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help Desk</span>
            </a>

            <a
              href="https://pssou.net/portal/panel_university_login"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-md bg-[#159895] hover:bg-[#107d7a] transition-colors text-white font-semibold flex items-center gap-1.5 shadow-sm ml-2"
            >
              <span>University User Login</span>
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-white hover:bg-[#13465b] focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-[#159895] space-y-2 pb-2 text-sm">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md hover:bg-[#13465b] text-white"
            >
              Home
            </Link>
            <a
              href="https://pssou.net/portal/panel_student_login"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 rounded-md hover:bg-[#13465b] text-white flex items-center gap-2"
            >
              <User className="w-4 h-4 text-[#5be6e3]" />
              <span>Student Login</span>
            </a>
            <a
              href="http://pssou.ac.in/index?page=ebook"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 rounded-md hover:bg-[#13465b] text-white flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-[#5be6e3]" />
              <span>Read Ebook (SLM)</span>
            </a>
            <a
              href="https://pssou.net/portal/panel_contact_us"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 rounded-md hover:bg-[#13465b] text-white flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-[#5be6e3]" />
              <span>Help Desk</span>
            </a>
            <a
              href="https://pssou.net/portal/panel_university_login"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 rounded-md bg-[#159895] text-white font-semibold text-center"
            >
              University User Login
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
