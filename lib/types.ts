export type LeadStatus = 'pending_otp' | 'verified' | 'expired' | 'abandoned';
export type ProgrammeLevel = 'UG' | 'PG' | 'Diploma' | 'Certificate';
export type StaffRole = 'admin' | 'staff';

export interface Programme {
  id: string;
  code: string;
  name: string;
  level: ProgrammeLevel;
  duration?: string;
  eligibility?: string;
  is_active: boolean;
  created_at?: string;
}

export interface AttributionData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  campaign_slug?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  referrer?: string;
  landing_path?: string;
  user_agent?: string;
  ip_hash?: string;
}

export interface Lead extends AttributionData {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  programme_id?: string;
  programme_name?: string;
  state: string;
  city: string;
  consent: boolean;
  status: LeadStatus;
  application_no?: string;
  whatsapp_notified: boolean;
  whatsapp_notified_at?: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface OtpRecord {
  id: string;
  lead_id: string;
  code_hash: string;
  expires_at: string;
  attempts: number;
  max_attempts: number;
  consumed_at?: string;
  created_at: string;
}

export interface StaffProfile {
  id: string;
  full_name: string;
  role: StaffRole;
  created_at: string;
}

export interface LeadSubmissionPayload {
  fullName: string;
  email: string;
  phone: string;
  programmeId: string;
  programmeName?: string;
  state: string;
  city: string;
  consent: boolean;
  attribution?: AttributionData;
}
