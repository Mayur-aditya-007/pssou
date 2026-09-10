"use client";

import React, { useState } from "react";
import { Programme, ProgrammeLevel } from "@/lib/types";
import { Search, GraduationCap, Clock, Award, ArrowRight, Check } from "lucide-react";

interface ProgrammeExplorerProps {
  programmes: Programme[];
  onSelectProgramme?: (programmeId: string) => void;
}

export default function ProgrammeExplorer({
  programmes,
  onSelectProgramme,
}: ProgrammeExplorerProps) {
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const levels: { label: string; value: string }[] = [
    { label: "All Programmes", value: "ALL" },
    { label: "Undergraduate (UG)", value: "UG" },
    { label: "Postgraduate (PG)", value: "PG" },
    { label: "Diploma / PG Diploma", value: "Diploma" },
    { label: "Certificates", value: "Certificate" },
  ];

  const filtered = programmes.filter((prog) => {
    const matchesLevel = selectedLevel === "ALL" || prog.level === selectedLevel;
    const matchesSearch =
      prog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const handleApplyClick = (progId: string) => {
    if (onSelectProgramme) {
      onSelectProgramme(progId);
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("pssou:select-course", { detail: { programmeId: progId } })
      );
    }
    const formElement = document.getElementById("inquiry-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1a5f7a]">
            Offered Programmes (पाठ्यक्रम सूची)
          </h2>
          <p className="text-sm text-slate-600 font-condensed mt-1">
            UGC-DEB recognized Distance & Online Learning programmes for Session 2026-27
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search B.A., MBA, BCA, PGDCA..."
            className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f7a] focus:border-[#1a5f7a]"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {levels.map((lvl) => (
          <button
            key={lvl.value}
            onClick={() => setSelectedLevel(lvl.value)}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              selectedLevel === lvl.value
                ? "bg-[#1a5f7a] text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {lvl.label}
          </button>
        ))}
      </div>

      {/* Grid of Programmes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length > 0 ? (
          filtered.map((prog) => (
            <div
              key={prog.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-[#159895] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-[#1a5f7a] border border-blue-200">
                    {prog.code}
                  </span>
                  <span className="text-xs font-semibold text-[#159895] uppercase">
                    {prog.level} Mode
                  </span>
                </div>

                <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-[#1a5f7a] transition-colors leading-snug">
                  {prog.name}
                </h3>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  {prog.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#159895] shrink-0" />
                      <span>Duration: <strong>{prog.duration}</strong></span>
                    </div>
                  )}
                  {prog.eligibility && (
                    <div className="flex items-start gap-2">
                      <Award className="w-3.5 h-3.5 text-[#159895] shrink-0 mt-0.5" />
                      <span className="line-clamp-2">Eligibility: {prog.eligibility}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>UGC-DEB Approved</span>
                </span>
                <button
                  onClick={() => handleApplyClick(prog.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1a5f7a] group-hover:text-[#13465b] group-hover:translate-x-0.5 transition-all cursor-pointer bg-slate-50 group-hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-slate-200"
                >
                  <span>Select & Apply</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-10 bg-white rounded-xl border border-slate-200 text-slate-500 text-sm">
            No courses found matching &quot;{searchQuery}&quot;. Please try a different search.
          </div>
        )}
      </div>
    </div>
  );
}
