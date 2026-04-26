import React from "react";
import { 
  Search, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  Zap, 
  AlertCircle, 
  Send, 
  Clock, 
  MessageSquare, 
  Sparkles, 
  Trophy
} from "lucide-react";

export interface Mission {
  id: number;
  title: string;
  timeframe: string;
  description: string;
  tip: string;
  icon?: any; // Using any for simplicity in shared constants, but Lucide components in practice
  color: string;
  actionLabel: string;
  actionHref: string;
  category: "Research" | "Preparation" | "Exams" | "Application" | "Interviews" | "Enrolment";
  subtasks: string[];
}

export const MISSIONS_DATA: Omit<Mission, 'icon'>[] = [
  {
    id: 1,
    title: "Research Schools & UCAS Strategy",
    timeframe: "Jan - Mar",
    category: "Research",
    description: "Identify your top 5 dental schools and plan your open day visits across the UK.",
    tip: "UK universities value students who understand the NHS constitution and clinical teaching styles.",
    color: "emerald",
    actionLabel: "Explore University Hub",
    actionHref: "/university-hub",
    subtasks: ["Shortlist top 5 UK schools", "Review NHS Constitution", "Check entry requirements"]
  },
  {
    id: 2,
    title: "UCAT Registration Window",
    timeframe: "Apr - May",
    category: "Preparation",
    description: "The UCAT booking window is critical. High-demand UK centers fill up instantly.",
    tip: "Set a reminder for the day UCAT booking opens. Slots are first-come, first-served.",
    color: "blue",
    actionLabel: "UCAT Booking Guide",
    actionHref: "/guidance-hub",
    subtasks: ["Create Pearson VUE account", "Identify nearest UK center", "Set booking reminder"]
  },
  {
    id: 3,
    title: "Mastering the Personal Statement",
    timeframe: "Apr - May",
    category: "Preparation",
    description: "Start your narrative for the UCAS application. Focus on UK clinical exposure.",
    tip: "Focus on your 'Manual Dexterity' and 'Reflective Practice'—traits highly prized by UK selectors.",
    color: "amber",
    actionLabel: "Analyze with AI Reviewer",
    actionHref: "/ai-hub/personal-statement",
    subtasks: ["Document UK work exp", "Draft 'Why Dentistry' section", "AI-check for NHS values"]
  },
  {
    id: 4,
    title: "Secure Academic References",
    timeframe: "Apr - May",
    category: "Preparation",
    description: "Ensure your UCAS references reflect your aptitude for rigorous science training.",
    tip: "Give your tutors a summary of your extracurriculars to help them write a comprehensive UCAS reference.",
    color: "indigo",
    actionLabel: "Reference Strategy",
    actionHref: "/guidance-hub",
    subtasks: ["Request UCAS references", "Provide achievement summary", "Verify referee progress"]
  },
  {
    id: 5,
    title: "The UCAT Entrance Exam",
    timeframe: "Jun - Jul",
    category: "Exams",
    description: "This is the most critical hurdle for UK Dental school entry.",
    tip: "Consistency is key. Use our UK-specific mocks to simulate the real testing environment.",
    color: "orange",
    actionLabel: "Intense Study Plan",
    actionHref: "/ai-hub/study-planner",
    subtasks: ["Daily abstract reasoning", "Complete 5 full mocks", "Finalize UCAT strategy"]
  },
  {
    id: 6,
    title: "Finalise UCAS Choices (4+1)",
    timeframe: "Aug",
    category: "Application",
    description: "Review your results and finalize your 4 + 1 dentistry choices for UCAS.",
    tip: "Strategize! Apply to UK schools where your UCAT score fits their specific decile requirements.",
    color: "rose",
    actionLabel: "Check Acceptance Odds",
    actionHref: "/ai-hub/acceptance-odds",
    subtasks: ["Choose 5th insurance choice", "Audit PS for character count", "Verify grade predictions"]
  },
  {
    id: 7,
    title: "Submit UCAS Application",
    timeframe: "Sept",
    category: "Application",
    description: "The primary window for UK Medical and Dental submissions.",
    tip: "UK schools track submission dates. Aim for mid-September to show organization.",
    color: "teal",
    actionLabel: "UCAS Track Portal",
    actionHref: "https://www.ucas.com/",
    subtasks: ["Pay UCAS fee (£27.50)", "Final PS proofread", "Submit Application"]
  },
  {
    id: 8,
    title: "THE HARD DEADLINE",
    timeframe: "Oct 15",
    category: "Application",
    description: "The absolute cutoff for all UK Dentistry and Medicine applications.",
    tip: "Missing this deadline means waiting another full year. Submit early.",
    color: "red",
    actionLabel: "Verify Track Status",
    actionHref: "/applications",
    subtasks: ["Confirm UCAS receipt", "Check spam for uni emails"]
  },
  {
    id: 9,
    title: "MMI & Panel Interviews",
    timeframe: "Oct - Nov",
    category: "Interviews",
    description: "Master the Multiple Mini Interview (MMI) stations used across UK dental schools.",
    tip: "UK interviews focus heavily on GDC Standards and Dental Ethics. Study them early.",
    color: "purple",
    actionLabel: "AI Mock Interview",
    actionHref: "/ai-hub/interview-prep",
    subtasks: ["Study GDC Standards", "Practise MMI stations", "Master NHS Ethics"]
  },
  {
    id: 10,
    title: "Offers & Firm Choices",
    timeframe: "Jan - Mar (2027)",
    category: "Interviews",
    description: "Receiving your offers and selecting your Firm and Insurance choices.",
    tip: "Decisions are almost always conditional on your final A-Level/IB results.",
    color: "cyan",
    actionLabel: "Manage Offers",
    actionHref: "/mentorship",
    subtasks: ["Compare offers", "Respond on UCAS Hub", "Final grade push"]
  },
  {
    id: 11,
    title: "Enrollment & Success",
    timeframe: "May - Sept",
    category: "Enrolment",
    description: "A-Level Results Day and starting your journey at a UK Dental School.",
    tip: "You've secured an offer in one of the UK's most competitive courses. Congratulations!",
    color: "emerald",
    actionLabel: "Student Portal",
    actionHref: "/guidance-hub",
    subtasks: ["Confirm results", "Complete uni enrollment", "Start pre-reading"]
  }
];
