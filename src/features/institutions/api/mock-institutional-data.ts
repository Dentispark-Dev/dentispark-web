export interface Cohort {
  id: string;
  name: string;
  institution: string;
  studentCount: number;
  mentorCount: number;
  averageProgress: number;
  lastActive: string;
}

export interface InstitutionalLicense {
  id: string;
  name: string;
  totalSeats: number;
  usedSeats: number;
  expiryDate: string;
  status: "active" | "expiring" | "renewal-pending";
}

export const INSTITUTIONAL_COHORTS: Cohort[] = [
  {
    id: "c-1",
    name: "London Dental Academy 2024",
    institution: "LDA",
    studentCount: 124,
    mentorCount: 12,
    averageProgress: 78,
    lastActive: "2 hours ago",
  },
  {
    id: "c-2",
    name: "Northwest Pre-Dent Cohort",
    institution: "NWPD",
    studentCount: 45,
    mentorCount: 5,
    averageProgress: 62,
    lastActive: "5 mins ago",
  },
  {
    id: "c-3",
    name: "Manchester Gateway Students",
    institution: "UoM",
    studentCount: 210,
    mentorCount: 18,
    averageProgress: 45,
    lastActive: "1 day ago",
  },
];

export const MOCK_LICENSES: InstitutionalLicense[] = [
  {
    id: "l-1",
    name: "Enterprise Hub Pro",
    totalSeats: 500,
    usedSeats: 379,
    expiryDate: "Dec 31, 2024",
    status: "active",
  },
];
