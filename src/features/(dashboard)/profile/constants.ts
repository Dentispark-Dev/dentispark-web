import type { SelectOption } from "./types";

export const yearOptions: SelectOption[] = [
  { value: "year-10", label: "Year 10" },
  { value: "year-11", label: "Year 11" },
  { value: "year-12", label: "Year 12" },
  { value: "year-13", label: "Year 13" },
];

export const gradeOptions: SelectOption[] = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
];

export const gcseOptions: SelectOption[] = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
];

export const universityStatusOptions: SelectOption[] = [
  { value: "Interested", label: "Interested" },
  { value: "Applied", label: "Applied" },
  { value: "Interview", label: "Interview" },
  { value: "Offer", label: "Offer" },
  { value: "Rejected", label: "Rejected" },
];

export const defaultAcademicData = {
  yearOfStudy: "year-12",
  gcseResult: "7",
  ucatScore: "",
  ucatVerbal: "",
  ucatDecision: "",
  ucatQuant: "",
  ucatAbstract: "",
  ucatSituational: "",
  bmatSection1: "",
  bmatSection2: "",
  bmatSection3: "",
  casperScore: "",
  goals: "",
  biologyGrade: "A",
  chemistryGrade: "B",
  otherSubject: "Mathematics",
  otherSubjectGrade: "A",
  workExperience: [],
  universityShortlist: [],
};
