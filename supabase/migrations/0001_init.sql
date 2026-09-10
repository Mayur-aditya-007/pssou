-- ====================================================================
-- PSSOU Lead Microsite Database Migration (0001_init.sql)
-- Pt. Sundarlal Sharma (Open) University Chhattisgarh
-- ====================================================================

-- Extensions
create extension if not exists "pgcrypto";

-- Enum for lead status
do $$
begin
  if not exists (select 1 from pg_type where typname = 'lead_status') then
    create type lead_status as enum ('pending_otp', 'verified', 'expired', 'abandoned');
  end if;
end$$;

-- Programmes reference table (UG, PG, Diploma, Certificate)
create table if not exists programmes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,          -- e.g. 'MCA', 'BCOM', 'BA', 'PGDCA'
  name text not null,                 -- e.g. 'Master of Computer Applications'
  level text not null,                -- 'UG' | 'PG' | 'Diploma' | 'Certificate'
  duration text,                      -- e.g. '3 Years', '2 Years', '1 Year'
  eligibility text,                   -- e.g. '10+2 in any stream'
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Leads / inquiries table with ad-attribution columns
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  programme_id uuid references programmes(id),
  programme_name text,                -- Denormalized for convenience
  state text not null,
  city text not null,
  consent boolean not null default false,
  status lead_status not null default 'pending_otp',

  -- Attribution & campaign analytics
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  campaign_slug text,
  gclid text,
  fbclid text,
  msclkid text,
  referrer text,
  landing_path text,
  user_agent text,
  ip_hash text,

  application_no text unique,         -- Generated on verification: e.g. PSSOUJUL2026UG00123
  whatsapp_notified boolean not null default false,
  whatsapp_notified_at timestamptz,

  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- OTP codes table (separate for auditability & rate limiting)
create table if not exists otp_codes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  code_hash text not null,            -- Hashed OTP (SHA-256 with pepper)
  expires_at timestamptz not null,
  attempts int not null default 0,
  max_attempts int not null default 5,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Staff & Admin Profiles
create table if not exists staff_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'staff',  -- 'admin' | 'staff'
  created_at timestamptz not null default now()
);

-- Trigger for updated_at
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_leads_updated_at on leads;
create trigger trg_leads_updated_at
before update on leads
for each row execute function set_updated_at();

-- Indexes for performance & reporting
create index if not exists idx_leads_status on leads(status);
create index if not exists idx_leads_created_at on leads(created_at desc);
create index if not exists idx_leads_utm_campaign on leads(utm_campaign);
create index if not exists idx_leads_utm_source on leads(utm_source);
create index if not exists idx_leads_email on leads(email);
create index if not exists idx_leads_phone on leads(phone);
create index if not exists idx_otp_lead_id on otp_codes(lead_id);

-- Row Level Security (RLS)
alter table leads enable row level security;
alter table otp_codes enable row level security;
alter table programmes enable row level security;
alter table staff_profiles enable row level security;

-- Lead RLS policies
drop policy if exists "anon can insert leads" on leads;
create policy "anon can insert leads"
on leads for insert
to anon
with check (true);

drop policy if exists "authenticated staff can select leads" on leads;
create policy "authenticated staff can select leads"
on leads for select
to authenticated
using (exists (select 1 from staff_profiles sp where sp.id = auth.uid()));

drop policy if exists "authenticated staff can update leads" on leads;
create policy "authenticated staff can update leads"
on leads for update
to authenticated
using (exists (select 1 from staff_profiles sp where sp.id = auth.uid()));

-- Programmes RLS policies
drop policy if exists "anon can select active programmes" on programmes;
create policy "anon can select active programmes"
on programmes for select
to anon
using (is_active = true);

drop policy if exists "staff can manage programmes" on programmes;
create policy "staff can manage programmes"
on programmes for all
to authenticated
using (exists (select 1 from staff_profiles sp where sp.id = auth.uid() and sp.role = 'admin'));

-- Staff Profiles RLS
drop policy if exists "staff can view own profile" on staff_profiles;
create policy "staff can view own profile"
on staff_profiles for select
to authenticated
using (id = auth.uid());

-- Seed initial recognized PSSOU programmes
insert into programmes (code, name, level, duration, eligibility, is_active)
values
  ('BA', 'Bachelor of Arts (B.A.)', 'UG', '3 Years', '10+2 or equivalent in any stream', true),
  ('BCOM', 'Bachelor of Commerce (B.Com.)', 'UG', '3 Years', '10+2 with Commerce or allied subject', true),
  ('BSC_BIO', 'Bachelor of Science (B.Sc. Biology)', 'UG', '3 Years', '10+2 with PCB (Physics, Chemistry, Biology)', true),
  ('BSC_MATH', 'Bachelor of Science (B.Sc. Mathematics)', 'UG', '3 Years', '10+2 with PCM (Physics, Chemistry, Math)', true),
  ('BBA', 'Bachelor of Business Administration (BBA)', 'UG', '3 Years', '10+2 in any stream with minimum 45%', true),
  ('BCA', 'Bachelor of Computer Applications (BCA)', 'UG', '3 Years', '10+2 with Mathematics or Computer', true),
  ('BLIB', 'Bachelor of Library & Information Science (B.Lib.I.Sc.)', 'UG', '1 Year', 'Graduation in any discipline', true),
  ('MA_HINDI', 'Master of Arts (M.A. Hindi)', 'PG', '2 Years', 'Graduation from a recognized University', true),
  ('MA_ENG', 'Master of Arts (M.A. English)', 'PG', '2 Years', 'Graduation with English or equivalent', true),
  ('MA_SOC', 'Master of Arts (M.A. Sociology)', 'PG', '2 Years', 'Graduation in any discipline', true),
  ('MA_POL', 'Master of Arts (M.A. Political Science)', 'PG', '2 Years', 'Graduation in any discipline', true),
  ('MA_HIST', 'Master of Arts (M.A. History)', 'PG', '2 Years', 'Graduation in any discipline', true),
  ('MA_ECON', 'Master of Arts (M.A. Economics)', 'PG', '2 Years', 'Graduation in any discipline', true),
  ('MA_CHH', 'Master of Arts (M.A. Chhattisgarhi)', 'PG', '2 Years', 'Graduation in any discipline', true),
  ('MCOM', 'Master of Commerce (M.Com.)', 'PG', '2 Years', 'B.Com. / BBA from a recognized University', true),
  ('MSC_MATH', 'Master of Science (M.Sc. Mathematics)', 'PG', '2 Years', 'B.Sc. with Mathematics', true),
  ('MSW', 'Master of Social Work (MSW)', 'PG', '2 Years', 'Graduation in any discipline', true),
  ('MLIB', 'Master of Library & Information Science (M.Lib.I.Sc.)', 'PG', '1 Year', 'B.Lib.I.Sc. with 50%', true),
  ('MCA', 'Master of Computer Applications (MCA)', 'PG', '2 Years', 'BCA / B.Sc. IT / Graduation with Math', true),
  ('PGDCA', 'Post Graduate Diploma in Computer Applications (PGDCA)', 'Diploma', '1 Year', 'Graduation in any discipline', true),
  ('PGDRD', 'Post Graduate Diploma in Rural Development (PGDRD)', 'Diploma', '1 Year', 'Graduation in any discipline', true),
  ('PGDJMC', 'Post Graduate Diploma in Journalism & Mass Communication', 'Diploma', '1 Year', 'Graduation in any discipline', true),
  ('PGDHRM', 'Post Graduate Diploma in Human Resource Management', 'Diploma', '1 Year', 'Graduation in any discipline', true),
  ('DYOGA', 'Diploma in Yoga Science', 'Diploma', '1 Year', '10+2 in any stream', true),
  ('DCA', 'Diploma in Computer Applications (DCA)', 'Diploma', '1 Year', '10+2 in any stream', true),
  ('CGST', 'Certificate in Goods and Services Tax (GST)', 'Certificate', '6 Months', '10+2 with Commerce or allied', true),
  ('CYOGA', 'Certificate in Yoga and Naturopathy', 'Certificate', '6 Months', '10+2 or equivalent', true)
on conflict (code) do nothing;
