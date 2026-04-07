export interface ResourceSection {
  title: string;
  content: string;
}

export interface Resource {
  id: string;
  title: string;
  date: string;
  sections: ResourceSection[];
}

// Mock data for resources - in a real app this would come from an API or database
export const resourcesData: Record<string, Resource> = {
  "ucat-guide": {
    id: "ucat-guide",
    title: "DentiSpark UCAT Prep Guide",
    date: "March 15, 2024",
    sections: [
      { title: "Introduction: The Clinical Aptitude Test", content: "Master the UCAT with DentiSpark's proprietary strategic roadmap. This guide covers all five subtests: Verbal Reasoning, Decision Making, Quantitative Reasoning, Abstract Reasoning, and Situational Judgement." },
      { title: "Verbal Reasoning Strategies", content: "Learn how to skim critical passages and identify keywords under intense time pressure. We recommend starting with the hardest passages first to maximize your focus." },
      { title: "Quantitative Reasoning: High-Speed Math", content: "Dentistry requires precision. This subtest measures your ability to solve numerical problems quickly. Focus on mental arithmetic and estimating data." }
    ]
  },
  "dental-booklet": {
    id: "dental-booklet",
    title: "Dental Schools Council Yearbook",
    date: "January 10, 2024",
    sections: [
      { title: "Official Entry Requirements 2025", content: "Your official, curated guide to UK Dental education requirements. Includes entry requirements for all UK dental schools, A-level/IB targets, and UCAT/BMAT thresholds." },
      { title: "Widening Participation & POLAR4", content: "Understand how your postcode and school context affect your application. Many UK dental schools offer adjusted entry requirements for students from specific backgrounds." },
      { title: "School Specific Deadlines", content: "October 15th is the critical UCAS deadline for all dental schools. Ensure your reference and personal statement are locked in before the portal closes." }
    ]
  },
  "ps-template": {
    id: "ps-template",
    title: "Personal Statement Template",
    date: "February 20, 2024",
    sections: [
      { title: "The Anatomy of a Dental PS", content: "DentiSpark-specific template reflective of actual UK dental school requirements. Learn how to structure your clinical observations, volunteering, and manual dexterity evidence." },
      { title: "Evidencing Manual Dexterity", content: "Whether it's model making, playing an instrument, or jewelry design—demonstrating fine motor control is essential for prospective dentists." },
      { title: "Reflection over Description", content: "Admissions tutors don't want a list of what you did. They want to see what you learned from it. Reflective practice is a core GDC requirement." }
    ]
  },
  "financial-guide": {
    id: "financial-guide",
    title: "Financial Support Guide",
    date: "April 05, 2024",
    sections: [
      { title: "Funding Your Dental Degree", content: "Strategic funding options for your dental academic journey. Detailed breakdown of NHS bursaries, student finance England, and regional scholarships for dental students." },
      { title: "NHS Bursaries Explained", content: "Dental students in the UK often qualify for NHS bursaries in their 5th and 6th years of study. Learn how to apply and what the eligibility criteria are." },
      { title: "Scholarships & Maintenance Loans", content: "Beyond the NHS, most students rely on a combination of maintenance loans and family support. We detail how to maximize your 'Widening Access' bursaries if eligible." }
    ]
  },
  "nursing-guide": {
    id: "nursing-guide",
    title: "Dental Nursing Apprenticeship Guide",
    date: "May 12, 2024",
    sections: [
      { title: "Roadmap to Nursing Qualification", content: "Step-by-Step roadmap to becoming a qualified Dental Nurse. Covers the Level 3 Diploma in Dental Nursing, apprenticeship standards, and career progression routes." },
      { title: "Theory & Practice Balance", content: "As an apprentice, your time is split between a paid practice role and your academic studies. This guide details how to manage both while preparing for your GDC registration." },
      { title: "Clinical Standards & Ethics", content: "Infection control, patient confidentiality, and chairside assistance are the foundations of your apprenticeship. We break down the core standards you'll need to master." }
    ]
  },
};

export function getResourceById(id: string): Resource | null {
  return resourcesData[id] || null;
}
