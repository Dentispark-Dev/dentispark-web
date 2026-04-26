export interface InterviewQuestion {
  id: string;
  text: string;
  category: "Scenario" | "Ethics" | "Personal" | "Motivation" | "RolePlay";
  field: "DENTAL" | "MEDICINE_MD" | "BOTH";
  style: "MMI" | "PANEL" | "ETHICS";
}

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // Motivation
  {
    id: "m1",
    text: "Why do you want to pursue a career in dentistry? What specific aspect of the clinical curriculum draws you to our school?",
    category: "Motivation",
    field: "DENTAL",
    style: "MMI"
  },
  {
    id: "m2",
    text: "Medicine is a demanding and stressful career. How have you prepared yourself for the emotional challenges of clinical practice?",
    category: "Motivation",
    field: "MEDICINE_MD",
    style: "PANEL"
  },
  
  // Ethics
  {
    id: "e1",
    text: "A 16-year-old patient requests a confidential treatment without their parents' knowledge. How would you determine their competence to consent (Gillick Competence)?",
    category: "Ethics",
    field: "BOTH",
    style: "ETHICS"
  },
  {
    id: "e2",
    text: "You witness a senior colleague making a clinical error but they ask you to keep it quiet. What is your 'Duty of Candour' in this situation?",
    category: "Ethics",
    field: "BOTH",
    style: "ETHICS"
  },
  
  // Scenario
  {
    id: "s1",
    text: "A patient is visibly upset and complaining about the long waiting times in the clinic. How do you approach them while maintaining a professional environment?",
    category: "Scenario",
    field: "BOTH",
    style: "MMI"
  },
  {
    id: "s2",
    text: "You are part of a team where one member is consistently not contributing to a project. How do you handle this to ensure the best outcome for the team?",
    category: "Scenario",
    field: "BOTH",
    style: "PANEL"
  },
  
  // Personal / Role Play
  {
    id: "p1",
    text: "Describe a time when you had to adapt your communication style to effectively convey a message to someone with a different background or perspective.",
    category: "Personal",
    field: "BOTH",
    style: "PANEL"
  },
  {
    id: "r1",
    text: "ROLE PLAY: You are a junior doctor/dentist. Explain the importance of oral hygiene (or smoking cessation) to a patient who has been non-compliant with previous advice.",
    category: "RolePlay",
    field: "BOTH",
    style: "MMI"
  }
];
