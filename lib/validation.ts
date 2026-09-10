import { z } from "zod";

// Phone number regex for standard 10-digit Indian mobile numbers (starts with 6, 7, 8, or 9)
const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;

export const leadFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full Name must be at least 2 characters")
    .max(100, "Full Name must not exceed 100 characters")
    .regex(/^[a-zA-Z\s.'-]+$/, "Full Name contains invalid characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(120, "Email must not exceed 120 characters"),
  phone: z
    .string()
    .transform((val) => val.replace(/[\s-]/g, ""))
    .refine((val) => phoneRegex.test(val), {
      message: "Please enter a valid 10-digit Indian mobile number",
    }),
  programmeId: z
    .string()
    .min(1, "Please select a programme / course"),
  programmeName: z.string().optional(),
  state: z
    .string()
    .min(2, "Please select or enter your State")
    .max(60, "State name is too long"),
  city: z
    .string()
    .min(2, "Please enter your City")
    .max(60, "City name is too long"),
  consent: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must consent to be contacted by PSSOU regarding admissions",
    }),
  attribution: z
    .object({
      utm_source: z.string().optional(),
      utm_medium: z.string().optional(),
      utm_campaign: z.string().optional(),
      utm_term: z.string().optional(),
      utm_content: z.string().optional(),
      campaign_slug: z.string().optional(),
      gclid: z.string().optional(),
      fbclid: z.string().optional(),
      msclkid: z.string().optional(),
      referrer: z.string().optional(),
      landing_path: z.string().optional(),
      user_agent: z.string().optional(),
      ip_hash: z.string().optional(),
    })
    .optional(),
});

export const otpVerifySchema = z.object({
  leadId: z.string().min(1, "Lead ID is required"),
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
});

export const otpResendSchema = z.object({
  leadId: z.string().min(1, "Lead ID is required"),
});

export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const programmeSchema = z.object({
  code: z.string().min(2, "Code is required"),
  name: z.string().min(3, "Name is required"),
  level: z.enum(["UG", "PG", "Diploma", "Certificate"]),
  duration: z.string().optional(),
  eligibility: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;
export type OtpVerifyData = z.infer<typeof otpVerifySchema>;
export type OtpResendData = z.infer<typeof otpResendSchema>;
export type AdminLoginData = z.infer<typeof adminLoginSchema>;
export type ProgrammeFormData = z.infer<typeof programmeSchema>;
