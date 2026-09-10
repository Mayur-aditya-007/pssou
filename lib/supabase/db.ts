import { createAdminClient } from "./server";
import { Lead, Programme, OtpRecord, LeadSubmissionPayload, LeadStatus } from "../types";
import { generateApplicationNumber } from "../otp";
import crypto from "crypto";

// Default seed programmes matching official PSSOU offerings
export const INITIAL_PROGRAMMES: Programme[] = [
  { id: "p1", code: "BA", name: "Bachelor of Arts (B.A.)", level: "UG", duration: "3 Years", eligibility: "10+2 or equivalent in any stream", is_active: true },
  { id: "p2", code: "BCOM", name: "Bachelor of Commerce (B.Com.)", level: "UG", duration: "3 Years", eligibility: "10+2 with Commerce or allied subject", is_active: true },
  { id: "p3", code: "BSC_BIO", name: "Bachelor of Science (B.Sc. Biology)", level: "UG", duration: "3 Years", eligibility: "10+2 with PCB", is_active: true },
  { id: "p4", code: "BSC_MATH", name: "Bachelor of Science (B.Sc. Mathematics)", level: "UG", duration: "3 Years", eligibility: "10+2 with PCM", is_active: true },
  { id: "p5", code: "BBA", name: "Bachelor of Business Administration (BBA)", level: "UG", duration: "3 Years", eligibility: "10+2 in any stream", is_active: true },
  { id: "p6", code: "BCA", name: "Bachelor of Computer Applications (BCA)", level: "UG", duration: "3 Years", eligibility: "10+2 with Math or Computer", is_active: true },
  { id: "p7", code: "BLIB", name: "Bachelor of Library & Info Science (B.Lib.I.Sc.)", level: "UG", duration: "1 Year", eligibility: "Graduation in any stream", is_active: true },
  
  { id: "p8", code: "MA_HINDI", name: "Master of Arts (M.A. Hindi)", level: "PG", duration: "2 Years", eligibility: "Graduation from a recognized University", is_active: true },
  { id: "p9", code: "MA_ENG", name: "Master of Arts (M.A. English)", level: "PG", duration: "2 Years", eligibility: "Graduation with English", is_active: true },
  { id: "p10", code: "MA_SOC", name: "Master of Arts (M.A. Sociology)", level: "PG", duration: "2 Years", eligibility: "Graduation in any discipline", is_active: true },
  { id: "p11", code: "MA_POL", name: "Master of Arts (M.A. Political Science)", level: "PG", duration: "2 Years", eligibility: "Graduation in any discipline", is_active: true },
  { id: "p12", code: "MA_HIST", name: "Master of Arts (M.A. History)", level: "PG", duration: "2 Years", eligibility: "Graduation in any discipline", is_active: true },
  { id: "p13", code: "MA_ECON", name: "Master of Arts (M.A. Economics)", level: "PG", duration: "2 Years", eligibility: "Graduation in any discipline", is_active: true },
  { id: "p14", code: "MA_CHH", name: "Master of Arts (M.A. Chhattisgarhi)", level: "PG", duration: "2 Years", eligibility: "Graduation in any discipline", is_active: true },
  { id: "p15", code: "MCOM", name: "Master of Commerce (M.Com.)", level: "PG", duration: "2 Years", eligibility: "B.Com / BBA", is_active: true },
  { id: "p16", code: "MSC_MATH", name: "Master of Science (M.Sc. Mathematics)", level: "PG", duration: "2 Years", eligibility: "B.Sc with Mathematics", is_active: true },
  { id: "p17", code: "MSW", name: "Master of Social Work (MSW)", level: "PG", duration: "2 Years", eligibility: "Graduation in any discipline", is_active: true },
  { id: "p18", code: "MLIB", name: "Master of Library & Info Science (M.Lib.I.Sc.)", level: "PG", duration: "1 Year", eligibility: "B.Lib.I.Sc. with 50%", is_active: true },
  { id: "p19", code: "MCA", name: "Master of Computer Applications (MCA)", level: "PG", duration: "2 Years", eligibility: "BCA / B.Sc. IT / Graduation with Math", is_active: true },

  { id: "p20", code: "PGDCA", name: "Post Graduate Diploma in Computer Applications (PGDCA)", level: "Diploma", duration: "1 Year", eligibility: "Graduation in any discipline", is_active: true },
  { id: "p21", code: "PGDRD", name: "PG Diploma in Rural Development (PGDRD)", level: "Diploma", duration: "1 Year", eligibility: "Graduation in any discipline", is_active: true },
  { id: "p22", code: "PGDJMC", name: "PG Diploma in Journalism & Mass Communication", level: "Diploma", duration: "1 Year", eligibility: "Graduation in any discipline", is_active: true },
  { id: "p23", code: "DYOGA", name: "Diploma in Yoga Science", level: "Diploma", duration: "1 Year", eligibility: "10+2 in any stream", is_active: true },
  { id: "p24", code: "DCA", name: "Diploma in Computer Applications (DCA)", level: "Diploma", duration: "1 Year", eligibility: "10+2 in any stream", is_active: true },

  { id: "p25", code: "CGST", name: "Certificate in Goods and Services Tax (GST)", level: "Certificate", duration: "6 Months", eligibility: "10+2 with Commerce / allied", is_active: true },
  { id: "p26", code: "CYOGA", name: "Certificate in Yoga and Naturopathy", level: "Certificate", duration: "6 Months", eligibility: "10+2 or equivalent", is_active: true },
];

// Fallback in-memory state for local testing when Supabase keys are not provided
const memoryStore = {
  programmes: [...INITIAL_PROGRAMMES],
  leads: [] as Lead[],
  otpCodes: [] as OtpRecord[],
};

// Seed sample leads for admin demo analytics if empty
if (memoryStore.leads.length === 0) {
  const sampleCampaigns = ["summer_meta_ug", "google_search_pg", "bilaspur_local_ads", "general_admission"];
  const sampleSources = ["meta", "google", "meta", "direct"];
  const sampleProgrammes = [INITIAL_PROGRAMMES[0], INITIAL_PROGRAMMES[5], INITIAL_PROGRAMMES[14], INITIAL_PROGRAMMES[19]];
  
  for (let i = 1; i <= 12; i++) {
    const prog = sampleProgrammes[i % sampleProgrammes.length];
    const isVerified = i > 3;
    const createdAt = new Date(Date.now() - (12 - i) * 86400000 * 0.8).toISOString();
    
    memoryStore.leads.push({
      id: `lead-demo-${i}`,
      full_name: `Student Applicant ${i}`,
      email: `applicant${i}@example.com`,
      phone: `9826${100000 + i}`,
      programme_id: prog.id,
      programme_name: prog.name,
      state: i % 2 === 0 ? "Chhattisgarh" : "Madhya Pradesh",
      city: i % 2 === 0 ? (i % 4 === 0 ? "Bilaspur" : "Raipur") : "Jabalpur",
      consent: true,
      status: isVerified ? "verified" : "pending_otp",
      utm_source: sampleSources[i % sampleSources.length],
      utm_medium: "cpc",
      utm_campaign: sampleCampaigns[i % sampleCampaigns.length],
      gclid: i % 2 === 0 ? `gclid_demo_${i}` : undefined,
      fbclid: i % 2 !== 0 ? `fbclid_demo_${i}` : undefined,
      landing_path: "/",
      application_no: isVerified ? generateApplicationNumber(prog.level) : undefined,
      whatsapp_notified: true,
      whatsapp_notified_at: createdAt,
      verified_at: isVerified ? new Date(new Date(createdAt).getTime() + 180000).toISOString() : undefined,
      created_at: createdAt,
      updated_at: createdAt,
    });
  }
}

/**
 * Get all active programmes
 */
export async function dbGetProgrammes(): Promise<Programme[]> {
  const supabase = createAdminClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("programmes")
        .select("*")
        .eq("is_active", true)
        .order("level", { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Programme[];
      }
    } catch (err) {
      console.warn("Supabase query error, falling back to local programmes store:", err);
    }
  }

  return memoryStore.programmes.filter((p) => p.is_active);
}

/**
 * Find programme by ID or Code
 */
export async function dbGetProgrammeById(idOrCode: string): Promise<Programme | null> {
  const supabase = createAdminClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("programmes")
        .select("*")
        .or(`id.eq.${idOrCode},code.eq.${idOrCode}`)
        .single();

      if (!error && data) return data as Programme;
    } catch {
      // Fallback
    }
  }

  return memoryStore.programmes.find((p) => p.id === idOrCode || p.code === idOrCode) || null;
}

/**
 * Create a new lead inquiry
 */
export async function dbCreateLead(
  payload: LeadSubmissionPayload,
  clientIp?: string
): Promise<Lead> {
  const programme = await dbGetProgrammeById(payload.programmeId);
  const programmeName = payload.programmeName || programme?.name || "General Admission";

  const ipHash = clientIp
    ? crypto.createHash("sha256").update(clientIp + "pssou_ip_salt").digest("hex").slice(0, 16)
    : undefined;

  const newLead: Lead = {
    id: crypto.randomUUID(),
    full_name: payload.fullName,
    email: payload.email.toLowerCase().trim(),
    phone: payload.phone.trim(),
    programme_id: programme?.id || payload.programmeId,
    programme_name: programmeName,
    state: payload.state.trim(),
    city: payload.city.trim(),
    consent: payload.consent,
    status: "pending_otp",
    utm_source: payload.attribution?.utm_source,
    utm_medium: payload.attribution?.utm_medium,
    utm_campaign: payload.attribution?.utm_campaign,
    utm_term: payload.attribution?.utm_term,
    utm_content: payload.attribution?.utm_content,
    campaign_slug: payload.attribution?.campaign_slug,
    gclid: payload.attribution?.gclid,
    fbclid: payload.attribution?.fbclid,
    msclkid: payload.attribution?.msclkid,
    referrer: payload.attribution?.referrer,
    landing_path: payload.attribution?.landing_path,
    user_agent: payload.attribution?.user_agent,
    ip_hash: ipHash,
    whatsapp_notified: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const supabase = createAdminClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("leads")
        .insert({
          id: newLead.id,
          full_name: newLead.full_name,
          email: newLead.email,
          phone: newLead.phone,
          programme_id: newLead.programme_id,
          programme_name: newLead.programme_name,
          state: newLead.state,
          city: newLead.city,
          consent: newLead.consent,
          status: newLead.status,
          utm_source: newLead.utm_source,
          utm_medium: newLead.utm_medium,
          utm_campaign: newLead.utm_campaign,
          utm_term: newLead.utm_term,
          utm_content: newLead.utm_content,
          campaign_slug: newLead.campaign_slug,
          gclid: newLead.gclid,
          fbclid: newLead.fbclid,
          msclkid: newLead.msclkid,
          referrer: newLead.referrer,
          landing_path: newLead.landing_path,
          user_agent: newLead.user_agent,
          ip_hash: newLead.ip_hash,
          whatsapp_notified: false,
        })
        .select()
        .single();

      if (!error && data) {
        return data as Lead;
      }
    } catch (err) {
      console.warn("Supabase lead insert failed, persisting to memory store:", err);
    }
  }

  memoryStore.leads.unshift(newLead);
  return newLead;
}

/**
 * Get lead by ID
 */
export async function dbGetLeadById(id: string): Promise<Lead | null> {
  const supabase = createAdminClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) return data as Lead;
    } catch {
      // Fallback
    }
  }

  return memoryStore.leads.find((l) => l.id === id) || null;
}

/**
 * Save OTP code record for a lead
 */
export async function dbSaveOtp(
  leadId: string,
  codeHash: string,
  expiresAt: Date
): Promise<OtpRecord> {
  const newOtp: OtpRecord = {
    id: crypto.randomUUID(),
    lead_id: leadId,
    code_hash: codeHash,
    expires_at: expiresAt.toISOString(),
    attempts: 0,
    max_attempts: 5,
    created_at: new Date().toISOString(),
  };

  const supabase = createAdminClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("otp_codes")
        .insert({
          id: newOtp.id,
          lead_id: newOtp.lead_id,
          code_hash: newOtp.code_hash,
          expires_at: newOtp.expires_at,
          attempts: 0,
          max_attempts: 5,
        })
        .select()
        .single();

      if (!error && data) return data as OtpRecord;
    } catch (err) {
      console.warn("Supabase OTP save error:", err);
    }
  }

  memoryStore.otpCodes.push(newOtp);
  return newOtp;
}

/**
 * Get latest non-consumed OTP record for lead
 */
export async function dbGetLatestOtp(leadId: string): Promise<OtpRecord | null> {
  const supabase = createAdminClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("otp_codes")
        .select("*")
        .eq("lead_id", leadId)
        .is("consumed_at", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) return data as OtpRecord;
    } catch {
      // Fallback
    }
  }

  const matches = memoryStore.otpCodes
    .filter((o) => o.lead_id === leadId && !o.consumed_at)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return matches[0] || null;
}

/**
 * Increment OTP attempts count
 */
export async function dbIncrementOtpAttempts(otpId: string): Promise<number> {
  const supabase = createAdminClient();
  if (supabase) {
    try {
      const { data: current } = await supabase
        .from("otp_codes")
        .select("attempts")
        .eq("id", otpId)
        .single();

      const newAttempts = (current?.attempts || 0) + 1;

      await supabase
        .from("otp_codes")
        .update({ attempts: newAttempts })
        .eq("id", otpId);

      return newAttempts;
    } catch {
      // Fallback
    }
  }

  const record = memoryStore.otpCodes.find((o) => o.id === otpId);
  if (record) {
    record.attempts += 1;
    return record.attempts;
  }
  return 1;
}

/**
 * Mark lead verified, generate application number, and consume OTP
 */
export async function dbMarkLeadVerified(
  leadId: string,
  otpId: string,
  programmeLevel: string = "UG"
): Promise<{ success: boolean; applicationNo: string }> {
  const applicationNo = generateApplicationNumber(programmeLevel);
  const now = new Date().toISOString();

  const supabase = createAdminClient();
  if (supabase) {
    try {
      await supabase
        .from("otp_codes")
        .update({ consumed_at: now })
        .eq("id", otpId);

      await supabase
        .from("leads")
        .update({
          status: "verified",
          application_no: applicationNo,
          verified_at: now,
        })
        .eq("id", leadId);

      return { success: true, applicationNo };
    } catch (err) {
      console.warn("Supabase lead verification update failed:", err);
    }
  }

  const otp = memoryStore.otpCodes.find((o) => o.id === otpId);
  if (otp) otp.consumed_at = now;

  const lead = memoryStore.leads.find((l) => l.id === leadId);
  if (lead) {
    lead.status = "verified";
    lead.application_no = applicationNo;
    lead.verified_at = now;
    lead.updated_at = now;
  }

  return { success: true, applicationNo };
}

/**
 * Mark lead as notified via WhatsApp
 */
export async function dbMarkLeadWhatsAppNotified(leadId: string): Promise<void> {
  const now = new Date().toISOString();
  const supabase = createAdminClient();
  if (supabase) {
    try {
      await supabase
        .from("leads")
        .update({
          whatsapp_notified: true,
          whatsapp_notified_at: now,
        })
        .eq("id", leadId);
    } catch {
      // Fallback
    }
  }

  const lead = memoryStore.leads.find((l) => l.id === leadId);
  if (lead) {
    lead.whatsapp_notified = true;
    lead.whatsapp_notified_at = now;
  }
}

/**
 * Admin: Get filtered, searchable and paginated leads
 */
export async function dbGetAdminLeads(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  programmeId?: string;
  campaign?: string;
  source?: string;
  startDate?: string;
  endDate?: string;
}) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, Math.min(100, params.limit || 20));
  const offset = (page - 1) * limit;

  let filtered = [...memoryStore.leads];

  if (params.search) {
    const q = params.search.toLowerCase().trim();
    filtered = filtered.filter(
      (l) =>
        l.full_name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        (l.application_no && l.application_no.toLowerCase().includes(q)) ||
        (l.city && l.city.toLowerCase().includes(q))
    );
  }

  if (params.status && params.status !== "all") {
    filtered = filtered.filter((l) => l.status === params.status);
  }

  if (params.programmeId && params.programmeId !== "all") {
    filtered = filtered.filter((l) => l.programme_id === params.programmeId);
  }

  if (params.campaign && params.campaign !== "all") {
    filtered = filtered.filter((l) => l.utm_campaign === params.campaign);
  }

  if (params.source && params.source !== "all") {
    filtered = filtered.filter((l) => l.utm_source === params.source);
  }

  if (params.startDate) {
    const start = new Date(params.startDate).getTime();
    filtered = filtered.filter((l) => new Date(l.created_at).getTime() >= start);
  }

  if (params.endDate) {
    const end = new Date(params.endDate).getTime() + 86400000;
    filtered = filtered.filter((l) => new Date(l.created_at).getTime() <= end);
  }

  // Sort newest first
  filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const total = filtered.length;
  const leads = filtered.slice(offset, offset + limit);

  return {
    leads,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Admin: Get funnel stats & campaign breakdown
 */
export async function dbGetAdminStats() {
  const leads = memoryStore.leads;
  const totalLeads = leads.length;
  const verifiedLeads = leads.filter((l) => l.status === "verified").length;
  const pendingOtpLeads = leads.filter((l) => l.status === "pending_otp").length;
  const conversionRate = totalLeads > 0 ? ((verifiedLeads / totalLeads) * 100).toFixed(1) : "0";

  // Group by campaign
  const campaignMap: Record<string, { total: number; verified: number }> = {};
  leads.forEach((l) => {
    const campaign = l.utm_campaign || "Direct / Organic";
    if (!campaignMap[campaign]) campaignMap[campaign] = { total: 0, verified: 0 };
    campaignMap[campaign].total += 1;
    if (l.status === "verified") campaignMap[campaign].verified += 1;
  });

  const campaigns = Object.entries(campaignMap).map(([name, data]) => ({
    name,
    total: data.total,
    verified: data.verified,
    rate: data.total > 0 ? ((data.verified / data.total) * 100).toFixed(1) : "0",
  }));

  // Group by source
  const sourceMap: Record<string, number> = {};
  leads.forEach((l) => {
    const src = l.utm_source || "direct";
    sourceMap[src] = (sourceMap[src] || 0) + 1;
  });

  const sources = Object.entries(sourceMap).map(([name, count]) => ({
    name,
    count,
  }));

  // Group by programme
  const progMap: Record<string, number> = {};
  leads.forEach((l) => {
    const prog = l.programme_name || "General";
    progMap[prog] = (progMap[prog] || 0) + 1;
  });

  const programmesBreakdown = Object.entries(progMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);

  return {
    totalLeads,
    verifiedLeads,
    pendingOtpLeads,
    conversionRate,
    campaigns,
    sources,
    programmesBreakdown,
  };
}

/**
 * Admin: Update lead status manually (e.g. mark 'abandoned' or 'expired')
 */
export async function dbUpdateLeadStatus(leadId: string, status: LeadStatus): Promise<boolean> {
  const lead = memoryStore.leads.find((l) => l.id === leadId);
  if (lead) {
    lead.status = status;
    lead.updated_at = new Date().toISOString();
    return true;
  }
  return false;
}
