"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lead, Programme } from "@/lib/types";
import {
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  Download,
  Search,
  Filter,
  Eye,
  RefreshCw,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X,
  MessageSquare,
  Globe,
  Tag,
  Calendar,
  Layers,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const PIE_COLORS = ["#1a5f7a", "#159895", "#fb8500", "#10b981", "#4f46e5", "#dc3545"];

export default function AdminDashboardPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"leads" | "campaigns" | "programmes">("leads");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<{
    totalLeads: number;
    verifiedLeads: number;
    pendingOtpLeads: number;
    conversionRate: string;
    campaigns: { name: string; total: number; verified: number; rate: string }[];
    sources: { name: string; count: number }[];
    programmesBreakdown: { name: string; count: number }[];
  } | null>(null);

  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & Pagination
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [campaignFilter, setCampaignFilter] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Lead Detail Drawer State
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);

  // Fetch Dashboard Stats
  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // Fetch Leads with Filters
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
        status: statusFilter,
        campaign: campaignFilter,
      });

      if (search.trim()) {
        params.set("search", search.trim());
      }

      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.total || 0);
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Programmes list
  const fetchProgrammes = async () => {
    try {
      const res = await fetch("/api/programmes");
      const data = await res.json();
      if (data.success) {
        setProgrammes(data.data);
      }
    } catch (err) {
      console.error("Error fetching programmes:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchProgrammes();
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [page, statusFilter, campaignFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLeads();
  };

  const handleUpdateLeadStatus = async (leadId: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead({ ...selectedLead, status: newStatus as any });
        }
        fetchLeads();
        fetchStats();
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleLogout = () => {
    document.cookie = "pssou_staff_session=;path=/;max-age=0";
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col font-sans">
      
      {/* Top Admin Navbar */}
      <header className="bg-[#1a5f7a] text-white border-b-4 border-[#159895] px-4 sm:px-8 py-3 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <Image
                src="/images/mono-nav.png"
                alt="PSSOU Logo"
                width={160}
                height={38}
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </div>
            <div className="border-l border-white/20 pl-3 hidden sm:block">
              <span className="font-heading font-bold text-sm lg:text-base block leading-tight">
                Admission Lead & Campaign Admin Panel
              </span>
              <span className="text-[11px] text-[#5be6e3] block">
                Pt. Sundarlal Sharma (Open) University Chhattisgarh
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchStats();
                fetchLeads();
              }}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden md:inline">Refresh</span>
            </button>

            <a
              href="/api/admin/export"
              download
              className="bg-[#159895] hover:bg-[#107d7a] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </a>

            <button
              onClick={handleLogout}
              className="p-2 text-red-200 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1">
        
        {/* 1. Funnel Overview Metric Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Inquiries */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs border-l-4 border-l-[#1a5f7a] flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Total Leads Submitted
                </p>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                  {stats.totalLeads}
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">All campaign inquiries</span>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-[#1a5f7a] rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            {/* Pending OTP */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs border-l-4 border-l-[#fb8500] flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Pending Verification
                </p>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                  {stats.pendingOtpLeads}
                </h3>
                <span className="text-[11px] text-amber-600 font-medium">Awaiting OTP entry</span>
              </div>
              <div className="w-12 h-12 bg-amber-50 text-[#fb8500] rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            {/* Verified Leads */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs border-l-4 border-l-[#10b981] flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Verified Leads
                </p>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-emerald-800 mt-1">
                  {stats.verifiedLeads}
                </h3>
                <span className="text-[11px] text-emerald-600 font-medium">Redirected to Portal</span>
              </div>
              <div className="w-12 h-12 bg-emerald-50 text-[#10b981] rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            {/* Conversion Rate */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs border-l-4 border-l-[#4f46e5] flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Funnel Conversion Rate
                </p>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#4f46e5] mt-1">
                  {stats.conversionRate}%
                </h3>
                <span className="text-[11px] text-indigo-600 font-medium">Submit → Verified</span>
              </div>
              <div className="w-12 h-12 bg-indigo-50 text-[#4f46e5] rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

          </div>
        )}

        {/* 2. Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab("leads")}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "leads"
                ? "bg-[#1a5f7a] text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Leads Management ({totalCount})
          </button>
          <button
            onClick={() => setActiveTab("campaigns")}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "campaigns"
                ? "bg-[#1a5f7a] text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Ad Campaigns & Analytics
          </button>
          <button
            onClick={() => setActiveTab("programmes")}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "programmes"
                ? "bg-[#1a5f7a] text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Active Programmes ({programmes.length})
          </button>
        </div>

        {/* 3. Tab: Leads Management Table */}
        {activeTab === "leads" && (
          <div className="space-y-4">
            
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              
              <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search applicant name, email, phone, city, or application no..."
                    className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f7a] focus:bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#1a5f7a] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#13465b] transition-colors cursor-pointer"
                >
                  Search
                </button>
              </form>

              <div className="flex items-center gap-2">
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="all" className="text-slate-900 bg-white">All Statuses</option>
                  <option value="verified" className="text-slate-900 bg-white">Verified Only</option>
                  <option value="pending_otp" className="text-slate-900 bg-white">Pending OTP</option>
                  <option value="abandoned" className="text-slate-900 bg-white">Abandoned</option>
                </select>

                {/* Campaign Filter */}
                <select
                  value={campaignFilter}
                  onChange={(e) => {
                    setCampaignFilter(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="all" className="text-slate-900 bg-white">All Campaigns</option>
                  {stats?.campaigns.map((c) => (
                    <option key={c.name} value={c.name} className="text-slate-900 bg-white">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#f8fafc] text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Applicant</th>
                      <th className="py-3.5 px-4">Programme</th>
                      <th className="py-3.5 px-4">Location</th>
                      <th className="py-3.5 px-4">Campaign / Source</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Application No</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-slate-400">
                          Loading leads data...
                        </td>
                      </tr>
                    ) : leads.length > 0 ? (
                      leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <p className="font-bold text-slate-900">{lead.full_name}</p>
                            <p className="text-xs text-slate-500">{lead.email}</p>
                            <p className="text-xs text-slate-400 font-mono">{lead.phone}</p>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-medium text-slate-800 line-clamp-1">
                              {lead.programme_name || "General"}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {new Date(lead.created_at).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-slate-600">
                            <span className="block font-medium">{lead.city}</span>
                            <span className="text-xs text-slate-400">{lead.state}</span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                              {lead.utm_campaign || "Direct"}
                            </span>
                            <span className="block text-[11px] text-slate-400 mt-0.5">
                              Src: {lead.utm_source || "direct"} | {lead.utm_medium || "none"}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            {lead.status === "verified" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#059669] border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-[#10b981]" />
                                <span>Verified</span>
                              </span>
                            ) : lead.status === "pending_otp" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-[#b45309] border border-amber-200">
                                <Clock className="w-3 h-3 text-[#fb8500]" />
                                <span>Pending OTP</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                                {lead.status}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 font-mono text-xs font-bold text-[#1a5f7a]">
                            {lead.application_no || "—"}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-[#1a5f7a] text-[#1a5f7a] hover:text-white font-bold text-xs transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Details</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-slate-400">
                          No leads match the specified criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span>
                  Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalCount} total)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-100 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-100 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 4. Tab: Campaign Attribution & Analytics */}
        {activeTab === "campaigns" && stats && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Campaign Performance Breakdown */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#1a5f7a]" />
                  <span>Leads by Campaign & Conversion</span>
                </h3>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.campaigns}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="total" name="Total Inquiries" fill="#1a5f7a" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="verified" name="Verified Leads" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Source Distribution */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#159895]" />
                  <span>Traffic Source Distribution</span>
                </h3>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.sources}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                      >
                        {stats.sources.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Campaign Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <h4 className="font-heading font-bold text-slate-900 text-sm">
                  Ad Campaign Performance Attribution Matrix
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#f8fafc] text-slate-600 font-bold uppercase text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Campaign Name (utm_campaign)</th>
                      <th className="py-3 px-4">Total Submissions</th>
                      <th className="py-3 px-4">OTP Verified Leads</th>
                      <th className="py-3 px-4">Verification Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stats.campaigns.map((camp, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-bold text-slate-800">{camp.name}</td>
                        <td className="py-3 px-4 text-slate-700">{camp.total}</td>
                        <td className="py-3 px-4 font-semibold text-emerald-700">{camp.verified}</td>
                        <td className="py-3 px-4 font-bold text-[#1a5f7a]">{camp.rate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 5. Tab: Active Programmes Overview */}
        {activeTab === "programmes" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h4 className="font-heading font-bold text-slate-900 text-sm">
                Recognized PSSOU Academic Offerings Reference Table
              </h4>
              <span className="text-xs text-slate-500 font-medium">
                Total Active: {programmes.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#f8fafc] text-slate-600 font-bold uppercase text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Programme Full Title</th>
                    <th className="py-3 px-4">Level</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Eligibility Criteria</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {programmes.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono font-bold text-[#1a5f7a]">{p.code}</td>
                      <td className="py-3 px-4 font-medium text-slate-900">{p.name}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                          {p.level}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{p.duration || "N/A"}</td>
                      <td className="py-3 px-4 text-slate-600 text-xs">{p.eligibility || "Standard"}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* 6. Lead Detail Drawer / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl overflow-y-auto p-6 space-y-6 flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-200">
            
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <span className="text-xs text-[#159895] font-bold uppercase tracking-wider">
                    Lead Audit & Attribution
                  </span>
                  <h3 className="font-heading text-xl font-bold text-slate-900">
                    {selectedLead.full_name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status & Reference Header */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Verification Status:</span>
                  <span
                    className={`font-bold px-2.5 py-0.5 rounded-full ${
                      selectedLead.status === "verified"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {selectedLead.status.toUpperCase()}
                  </span>
                </div>
                {selectedLead.application_no && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-semibold">Generated Application No:</span>
                    <span className="font-mono font-bold text-[#1a5f7a] text-sm">
                      {selectedLead.application_no}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">WhatsApp Notified:</span>
                  <span className="font-medium text-slate-700">
                    {selectedLead.whatsapp_notified ? "✅ Yes (Logged)" : "❌ No"}
                  </span>
                </div>
              </div>

              {/* Submitted Details */}
              <div className="space-y-3 text-xs sm:text-sm">
                <h4 className="font-heading font-bold text-slate-900 text-sm border-b border-slate-100 pb-1">
                  Submitted Applicant Profile
                </h4>
                <div className="grid grid-cols-2 gap-3 text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-xs">Email Address</span>
                    <span className="font-medium">{selectedLead.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Mobile Number</span>
                    <span className="font-medium font-mono">+91 {selectedLead.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Selected Course</span>
                    <span className="font-medium">{selectedLead.programme_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">State / City</span>
                    <span className="font-medium">{selectedLead.city}, {selectedLead.state}</span>
                  </div>
                </div>
              </div>

              {/* Attribution Bundle */}
              <div className="space-y-3 text-xs bg-[#f8fafc] p-4 rounded-xl border border-slate-200">
                <h4 className="font-heading font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#1a5f7a]" />
                  <span>Marketing Attribution & Click IDs</span>
                </h4>
                
                <div className="space-y-1.5 text-slate-600 font-mono text-[11px]">
                  <div><strong>utm_source:</strong> {selectedLead.utm_source || "direct"}</div>
                  <div><strong>utm_medium:</strong> {selectedLead.utm_medium || "none"}</div>
                  <div><strong>utm_campaign:</strong> {selectedLead.utm_campaign || "general"}</div>
                  {selectedLead.utm_term && <div><strong>utm_term:</strong> {selectedLead.utm_term}</div>}
                  {selectedLead.utm_content && <div><strong>utm_content:</strong> {selectedLead.utm_content}</div>}
                  {selectedLead.gclid && <div><strong>gclid:</strong> {selectedLead.gclid}</div>}
                  {selectedLead.fbclid && <div><strong>fbclid:</strong> {selectedLead.fbclid}</div>}
                  {selectedLead.referrer && <div className="break-all"><strong>referrer:</strong> {selectedLead.referrer}</div>}
                  <div><strong>landing_path:</strong> {selectedLead.landing_path || "/"}</div>
                  {selectedLead.ip_hash && <div><strong>ip_hash:</strong> {selectedLead.ip_hash}</div>}
                </div>
              </div>
            </div>

            {/* Manual Status Action Buttons */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <span className="text-xs text-slate-500 font-semibold block">
                Manual Status Override:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  disabled={updatingStatus || selectedLead.status === "verified"}
                  onClick={() => handleUpdateLeadStatus(selectedLead.id, "verified")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-lg text-xs disabled:opacity-40 cursor-pointer"
                >
                  Mark as Verified
                </button>
                <button
                  disabled={updatingStatus || selectedLead.status === "abandoned"}
                  onClick={() => handleUpdateLeadStatus(selectedLead.id, "abandoned")}
                  className="bg-slate-700 hover:bg-slate-800 text-white font-bold py-2 px-3 rounded-lg text-xs disabled:opacity-40 cursor-pointer"
                >
                  Mark as Abandoned
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
