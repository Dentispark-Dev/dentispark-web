export interface Scholarship {
  externalId: string;
  title: string;
  slug: string;
  description: string;
  amountValue: number;
  amountCurrency: string;
  deadline: string | null;
  eligibilityCriteriaJson: string;
  applicationLink: string;
  isSponsored: boolean;
  targetDegreeLevel: string;
  targetLocation: string;
  provider?: string;
  notes?: string;
  coversJson?: string;
}

export const REAL_SCHOLARSHIPS: Scholarship[] = [
  {
    externalId: "nhs-bursary",
    title: "NHS Bursary Scheme",
    slug: "nhs-bursary-scheme",
    description: "Financial support for medical and dental students in the later years of their course. Covers tuition fees and provides a means-tested bursary for living costs.",
    amountValue: 0, // Varies
    amountCurrency: "£",
    deadline: null,
    eligibilityCriteriaJson: JSON.stringify({ notes: "Means-tested; automatic eligibility for students in later years." }),
    applicationLink: "https://www.nhsbsa.nhs.uk/nhs-bursary-students",
    isSponsored: true,
    targetDegreeLevel: "BDS",
    targetLocation: "United Kingdom",
    provider: "NHS (England)"
  },
  {
    externalId: "nhs-lsf",
    title: "NHS Learning Support Fund",
    slug: "nhs-learning-support-fund",
    description: "Additional funding for healthcare students, including those in dental therapy and hygiene. Includes a training grant of £5,000 per year.",
    amountValue: 5000,
    amountCurrency: "£",
    deadline: null,
    eligibilityCriteriaJson: JSON.stringify({ notes: "Apply yearly after enrolment. For healthcare students incl. dentistry." }),
    applicationLink: "https://www.nhsbsa.nhs.uk/nhs-learning-support-fund-lsf",
    isSponsored: true,
    targetDegreeLevel: "BDS",
    targetLocation: "United Kingdom",
    provider: "NHS"
  },
  {
    externalId: "qmul-bursary",
    title: "Queen Mary Bursary",
    slug: "queen-mary-bursary",
    description: "Awards for undergraduate students from lower-income households. Medicine and dentistry students are eligible in years where they are not NHS-funded.",
    amountValue: 0, // Varies
    amountCurrency: "£",
    deadline: "2026-07-31",
    eligibilityCriteriaJson: JSON.stringify({ notes: "Auto-assessed based on Student Finance application." }),
    applicationLink: "https://www.qmul.ac.uk/undergraduate/fees-and-funding/bursaries-and-scholarships/queen-mary-bursary/",
    isSponsored: false,
    targetDegreeLevel: "BDS",
    targetLocation: "United Kingdom",
    provider: "QMUL"
  },
  {
    externalId: "ucas-dentistry",
    title: "UCAS Dentistry Application",
    slug: "ucas-dentistry-application",
    description: "The primary application route for all UK dentistry programs. Essential for entry and consideration for university-specific funding.",
    amountValue: 0,
    amountCurrency: "£",
    deadline: "2026-10-15",
    eligibilityCriteriaJson: JSON.stringify({ notes: "Early deadline requirement for all aspiring dental students." }),
    applicationLink: "https://www.ucas.com/",
    isSponsored: false,
    targetDegreeLevel: "BDS",
    targetLocation: "United Kingdom",
    provider: "All UK Universities"
  },
  {
    externalId: "ncl-opportunity",
    title: "Opportunity Scholarship",
    slug: "newcastle-opportunity-scholarship",
    description: "Awards for Newcastle University students from low-income backgrounds. Automatically assessed via your UCAS application.",
    amountValue: 1000,
    amountCurrency: "£",
    deadline: null,
    eligibilityCriteriaJson: JSON.stringify({ notes: "Income-based; no separate application required." }),
    applicationLink: "https://www.ncl.ac.uk/undergraduate/fees-funding/scholarships-bursaries/opportunity-scholarship/",
    isSponsored: false,
    targetDegreeLevel: "BDS",
    targetLocation: "United Kingdom",
    provider: "Newcastle University"
  },
  {
    externalId: "ncl-dental",
    title: "Dental Scholarships",
    slug: "newcastle-dental-scholarships",
    description: "Various alumni-funded and department-specific scholarships available to enrolled dental students at Newcastle University.",
    amountValue: 0, // Varies
    amountCurrency: "£",
    deadline: null,
    eligibilityCriteriaJson: JSON.stringify({ notes: "Course-specific funds for dental students." }),
    applicationLink: "https://www.ncl.ac.uk/dental/study/undergraduate/fees-funding/",
    isSponsored: false,
    targetDegreeLevel: "BDS",
    targetLocation: "United Kingdom",
    provider: "Newcastle University"
  },
  {
    externalId: "dundee-ruk",
    title: "RUK Bursary",
    slug: "dundee-ruk-bursary",
    description: "Financial support for students from the rest of the UK (non-Scottish) studying at the University of Dundee.",
    amountValue: 2000,
    amountCurrency: "£",
    deadline: "2026-08-27",
    eligibilityCriteriaJson: JSON.stringify({ notes: "Specifically for non-Scottish UK residents." }),
    applicationLink: "https://www.dundee.ac.uk/scholarships",
    isSponsored: false,
    targetDegreeLevel: "BDS",
    targetLocation: "United Kingdom",
    provider: "University of Dundee"
  },
  {
    externalId: "dundee-excellence",
    title: "Academic Excellence",
    slug: "dundee-academic-excellence",
    description: "Merit-based scholarships for students achieving high grades, offering significant tuition or living cost support.",
    amountValue: 3000,
    amountCurrency: "£",
    deadline: "2026-08-27",
    eligibilityCriteriaJson: JSON.stringify({ notes: "Grade-based award for high achievers." }),
    applicationLink: "https://www.dundee.ac.uk/scholarships",
    isSponsored: true,
    targetDegreeLevel: "BDS",
    targetLocation: "United Kingdom",
    provider: "University of Dundee"
  },
  {
    externalId: "uea-scholarship",
    title: "UEA Scholarship",
    slug: "uea-scholarship",
    description: "Competitive scholarships for students at the University of East Anglia, providing support based on merit and financial need.",
    amountValue: 1000,
    amountCurrency: "£",
    deadline: "2026-05-18",
    eligibilityCriteriaJson: JSON.stringify({ notes: "Competitive application process." }),
    applicationLink: "https://www.uea.ac.uk/study/fees-and-funding/scholarships-finder",
    isSponsored: false,
    targetDegreeLevel: "BDS",
    targetLocation: "United Kingdom",
    provider: "University of East Anglia"
  },
  {
    externalId: "kitchener",
    title: "Kitchener Scholarship",
    slug: "kitchener-scholarship",
    description: "A prestigious scholarship for the children or dependents of service personnel who have served in the British Armed Forces.",
    amountValue: 0, // Partial funding
    amountCurrency: "£",
    deadline: "2026-05-31",
    eligibilityCriteriaJson: JSON.stringify({ notes: "Exclusively for military families." }),
    applicationLink: "https://www.forfars.org.uk/kitchener-scholarships/",
    isSponsored: false,
    targetDegreeLevel: "BDS",
    targetLocation: "United Kingdom",
    provider: "External"
  },
  {
    externalId: "edu-future",
    title: "Education Future Scholarship",
    slug: "education-future-scholarship",
    description: "A global scholarship program aimed at supporting high-potential international students for studies abroad.",
    amountValue: 15000, // Up to
    amountCurrency: "$",
    deadline: "2026-04-10",
    eligibilityCriteriaJson: JSON.stringify({ notes: "Dedicated to international students." }),
    applicationLink: "https://www.education-future.org/",
    isSponsored: false,
    targetDegreeLevel: "BDS",
    targetLocation: "Global",
    provider: "External"
  },
  {
    externalId: "kingston",
    title: "Kingston Scholarship",
    slug: "kingston-scholarship",
    description: "Support for undergraduate students who have received an offer to study at Kingston University.",
    amountValue: 0, // Tuition support
    amountCurrency: "£",
    deadline: "2026-04-09",
    eligibilityCriteriaJson: JSON.stringify({ notes: "Offer of study required before application." }),
    applicationLink: "https://www.kingston.ac.uk/undergraduate/fees-and-funding/scholarships-and-bursaries/",
    isSponsored: false,
    targetDegreeLevel: "BDS",
    targetLocation: "United Kingdom",
    provider: "Kingston University"
  }
];
