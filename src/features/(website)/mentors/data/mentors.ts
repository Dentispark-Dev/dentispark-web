export interface MentorService {
    name: string;
    desc: string;
}

export interface Mentor {
    id: string;
    slug: string;
    name: string;
    title: string;
    credentials: string;
    bio: string;
    worksAt: string;
    field: string;
    specialty: string;
    hourlyRate: number;
    currency: string;
    rating: number;
    reviewCount: number;
    available: string;
    verified: boolean;
    introCall: boolean;
    tags: string[];
    image?: string;
    stats?: {
        sessions: number;
        mentees: number;
        rating: number;
        reviews: number;
    };
    services?: MentorService[];
}

export const MENTOR_CATEGORIES = [
    { key: "all", label: "All Mentors" },
    { key: "dental", label: "🦷 Dental School" },
    { key: "medicine-md", label: "🩺 Medicine — MD" },
    { key: "medicine-do", label: "🩺 Medicine — DO" },
    { key: "nursing", label: "🏥 Nursing" },
    { key: "pa", label: "💊 Physician Assistant" },
    { key: "test-prep", label: "📚 Test Prep (DAT/MCAT)" },
    { key: "personal-statement", label: "✍️ Personal Statement" },
    { key: "interview-prep", label: "🎤 Interview Prep" },
];

export const REAL_MENTORS: Mentor[] = [
    {
        id: "dt-marcus-thorne",
        slug: "dt-marcus-thorne",
        name: "Dt. Marcus Thorne",
        title: "Orthodontist, Univ of Pennsylvania",
        credentials: "Elite Orthodontics | 12+ Years Experience",
        bio: "Specializing in advanced orthodontic procedures and guiding pre-dental students through the application process.",
        worksAt: "Univ of Pennsylvania",
        field: "dental",
        specialty: "Orthodontics, Program Strategy",
        hourlyRate: 175,
        currency: "US$",
        rating: 4.9,
        reviewCount: 88,
        available: "Available tomorrow",
        verified: true,
        introCall: true,
        tags: ["dental", "specialization"],
        image: "/images/premium/mentor-banner.png",
        stats: { sessions: 1530, mentees: 512, rating: 4.9, reviews: 88 },
        services: [
            { name: "Orthodontic Specialization Prep", desc: "Expert guidance for specialized program entries." },
            { name: "Personal Statement Review", desc: "Crafting narratives that move admissions committees." },
            { name: "Clinical Research Advice", desc: "Positioning your research for maximum impact." }
        ],
    },
    {
        id: "dr-elena-rostova",
        slug: "dr-elena-rostova",
        name: "Dr. Elena Rostova",
        title: "Oral Surgeon, Harvard School of Dental Medicine",
        credentials: "Chief of Surgery | Admissions Committee Member",
        bio: "I leverage my experience on the Harvard admissions committee to help driven students craft compelling narratives.",
        worksAt: "Harvard Medicine",
        field: "medicine-md",
        specialty: "Surgery, MMI Prep",
        hourlyRate: 210,
        currency: "US$",
        rating: 5.0,
        reviewCount: 62,
        available: "Available Thurs",
        verified: true,
        introCall: true,
        tags: ["medicine-md", "surgery"],
        image: "/images/premium/auth-landscape.png",
        stats: { sessions: 980, mentees: 340, rating: 5.0, reviews: 62 },
        services: [
            { name: "Surgical Residency Prep", desc: "Preparing for high-stakes surgical applications." },
            { name: "MMI Interview Prep", desc: "Mastering the Multiple Mini Interview format." },
            { name: "Application Strategy", desc: "Long-term planning for dental school success." }
        ],
    },
    {
        id: "dr-sarah-chen",
        slug: "dr-sarah-chen",
        name: "Dr. Sarah Chen",
        title: "General Dentist, King's College London",
        credentials: "NHS Consultant | UCAT Specialist",
        bio: "Passionate about mentoring the next generation of UK dentists. I specialize in breaking down the UCAT requirements.",
        worksAt: "King's College London",
        field: "dental",
        specialty: "UCAT, UK Dental Schools",
        hourlyRate: 120,
        currency: "US$",
        rating: 4.8,
        reviewCount: 145,
        available: "Available today",
        verified: true,
        introCall: true,
        tags: ["dental", "test-prep"],
        image: "/images/premium/mentor-banner.png",
        stats: { sessions: 2100, mentees: 890, rating: 4.8, reviews: 145 },
        services: [
            { name: "UCAT Strategy", desc: "Score-boosting techniques for the UK dental exam." },
            { name: "NHS Values Interview", desc: "Aligning your narrative with public health values." },
            { name: "School Selection (UK)", desc: "Applying strategically to UK dental schools." }
        ],
    },
    {
        id: "dt-james-wilson",
        slug: "dt-james-wilson",
        name: "Dt. James Wilson",
        title: "Pediatric Dentist, UCSF",
        credentials: "Pediatric Specialist | Former UCSF Admissions",
        bio: "I help applicants highlight their soft skills and community impact to stand out in the competitive landscape.",
        worksAt: "UCSF Pediatric Dentistry",
        field: "dental",
        specialty: "Pediatrics, soft-skills",
        hourlyRate: 160,
        currency: "US$",
        rating: 4.9,
        reviewCount: 34,
        available: "Available Mon",
        verified: true,
        introCall: false,
        tags: ["dental", "interview-prep"],
        image: "/images/premium/auth-landscape.png",
        stats: { sessions: 640, mentees: 210, rating: 4.9, reviews: 34 },
        services: [
            { name: "Pediatric Dentistry Path", desc: "Specializing in the care of younger patients." },
            { name: "Community Narrative", desc: "Highlighting your impact on local communities." },
            { name: "Traditional Interview", desc: "Classic interview techniques for U.S. schools." }
        ],
    },
    {
        id: "dr-amira-patel",
        slug: "dr-amira-patel",
        name: "Dr. Amira Patel",
        title: "Periodontist, UCL",
        credentials: "Top of Class UCL | Research Fellow",
        bio: "My focus is on helping students with strong academic and research backgrounds translate those achievements into offers.",
        worksAt: "UCL / NHS Consultant",
        field: "nursing",
        specialty: "Research, Academic Strategy",
        hourlyRate: 140,
        currency: "US$",
        rating: 5.0,
        reviewCount: 29,
        available: "Available Wed",
        verified: true,
        introCall: true,
        tags: ["nursing", "research"],
        image: "/images/premium/mentor-banner.png",
        stats: { sessions: 420, mentees: 150, rating: 5.0, reviews: 29 },
        services: [
            { name: "Research Portfolio Review", desc: "Optimizing your research findings for display." },
            { name: "Academic Strategy", desc: "Leveraging high grades into top-tier offers." },
            { name: "Personal Statement", desc: "Polished and professional statement writing." }
        ],
    },
];

export const MENTORS_BY_SLUG: Record<string, Mentor> = REAL_MENTORS.reduce((acc, mentor) => {
    acc[mentor.slug] = mentor;
    return acc;
}, {} as Record<string, Mentor>);
