import * as z from "zod";

// Form validation schemas
export const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  emailAddress: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().optional(),
  country: z.string().optional(),
  education: z.string().optional(),
  linkedinUrl: z.string().optional(),
  biography: z.string().optional(),
  whyDentistry: z.string().optional(),
  // Mentor Specific Fields
  gdcNumber: z.string().optional(),
  professionalTier: z.enum(["student", "associate", "specialist"]).optional(),
  teachingTags: z.array(z.string()).optional(),
});

export const academicSchema = z.object({
  yearOfStudy: z.string().min(1, "Please select your year of study"),
  gcseResult: z.string().min(1, "Please enter your GCSE result"),
  // UCAT Sub-scores
  ucatScore: z.string().optional(), // Total
  ucatVerbal: z.string().optional(),
  ucatDecision: z.string().optional(),
  ucatQuant: z.string().optional(),
  ucatAbstract: z.string().optional(),
  ucatSituational: z.string().optional(),
  // BMAT Sections
  bmatSection1: z.string().optional(),
  bmatSection2: z.string().optional(),
  bmatSection3: z.string().optional(),

  casperScore: z.string().optional(),
  goals: z.string().optional(),
  biologyGrade: z.string().min(1, "Please select Biology grade"),
  chemistryGrade: z.string().min(1, "Please select Chemistry grade"),
  otherSubject: z.string().optional(),
  otherSubjectGrade: z.string().optional(),

  // Structured Lists (JSON strings or Objects for API)
  workExperience: z.array(z.object({
    id: z.string(),
    company: z.string(),
    role: z.string(),
    duration: z.string(),
    reflection: z.string(),
  })).optional(),
  
  universityShortlist: z.array(z.object({
    id: z.string(),
    university: z.string(),
    course: z.string(),
    status: z.enum(["Interested", "Applied", "Interview", "Offer", "Rejected"]),
  })).optional(),
});

// Type definitions
export type ProfileFormData = z.infer<typeof profileSchema>;
export type AcademicFormData = z.infer<typeof academicSchema>;

// Option types
export interface SelectOption {
  value: string;
  label: string;
}

export interface ProfileData {
  fullName: string;
  email: string;
  phoneNumber?: string;
  country?: string;
  education?: string;
  linkedinUrl?: string;
  biography?: string;
  whyDentistry?: string;
  gdcNumber?: string;
  professionalTier?: "student" | "associate" | "specialist";
  teachingTags?: string[];
}

export interface AcademicData {
  yearOfStudy: string;
  gcseResult: string;
  ucatScore?: string;
  ucatVerbal?: string;
  ucatDecision?: string;
  ucatQuant?: string;
  ucatAbstract?: string;
  ucatSituational?: string;
  bmatSection1?: string;
  bmatSection2?: string;
  bmatSection3?: string;
  casperScore?: string;
  goals?: string;
  biologyGrade: string;
  chemistryGrade: string;
  otherSubject?: string;
  otherSubjectGrade?: string;
  workExperience?: Array<{
    id: string;
    company: string;
    role: string;
    duration: string;
    reflection: string;
  }>;
  universityShortlist?: Array<{
    id: string;
    university: string;
    course: string;
    status: "Interested" | "Applied" | "Interview" | "Offer" | "Rejected";
  }>;
}

// API Response types
export interface AcademicProfileResponse {
  yearOfStudy: string;
  gcseResult: string;
  ucatScore?: string;
  ucatVerbal?: string;
  ucatDecision?: string;
  ucatQuant?: string;
  ucatAbstract?: string;
  ucatSituational?: string;
  casperScore: string;
  aLevelGrades: Array<{
    subject: string;
    grade: string;
  }>;
  workExperience?: any[];
  universityShortlist?: any[];
}
