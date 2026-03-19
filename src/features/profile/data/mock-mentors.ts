// Mock Data structure for the cinematic mentor profile layout
export const MOCK_MENTORS: Record<string, any> = {
    "dt-marcus-thorne": {
        id: "dt-marcus-thorne",
        slug: "dt-marcus-thorne",
        name: "Dt. Marcus Thorne",
        title: "Orthodontist, Univ of Pennsylvania",
        credentials: "Elite Orthodontics | 12+ Years Experience",
        bio: "Specializing in advanced orthodontic procedures and guiding pre-dental students through the rigorous application process for specialized programs.",
        stats: { sessions: 1530, mentees: 512, rating: 4.9, reviews: 88 },
        services: [
            { name: "Orthodontic Specialization Prep", desc: "Expert guidance for specialized program entries." },
            { name: "Personal Statement Review", desc: "Crafting narratives that move admissions committees." },
            { name: "Clinical Research Advice", desc: "Positioning your research for maximum impact." }
        ],
        availability: "Available tomorrow at 10:00 EST",
        hourlyRate: 175,
        image: "/images/premium/mentor-banner.png"
    },
    "dr-elena-rostova": {
        id: "dr-elena-rostova",
        slug: "dr-elena-rostova",
        name: "Dr. Elena Rostova",
        title: "Oral Surgeon, Harvard School of Dental Medicine",
        credentials: "Chief of Surgery | Admissions Committee",
        bio: "I leverage my experience on the Harvard admissions committee to help driven students craft compelling narratives. I focus on surgical specialties and high-stakes interviews.",
        stats: { sessions: 980, mentees: 340, rating: 5.0, reviews: 62 },
        services: [
            { name: "Surgical Residency Prep", desc: "Preparing for high-stakes surgical applications." },
            { name: "MMI Interview Prep", desc: "Mastering the Multiple Mini Interview format." },
            { name: "Application Strategy", desc: "Long-term planning for dental school success." }
        ],
        availability: "Available Thursday at 14:00 GMT",
        hourlyRate: 210,
        image: "/images/premium/auth-landscape.png"
    },
    "dr-sarah-chen": {
        id: "dr-sarah-chen",
        slug: "dr-sarah-chen",
        name: "Dr. Sarah Chen",
        title: "General Dentist, King's College London",
        credentials: "NHS Consultant | UCAT Specialist",
        bio: "Passionate about mentoring the next generation of UK dentists. I specialize in breaking down the UCAT and preparing students for the nuances of NHS-focused interviews.",
        stats: { sessions: 2100, mentees: 890, rating: 4.8, reviews: 145 },
        services: [
            { name: "UCAT Strategy", desc: "Score-boosting techniques for the UK dental exam." },
            { name: "NHS Values Interview", desc: "Aligning your narrative with public health values." },
            { name: "School Selection (UK)", desc: "Applying strategically to UK dental schools." }
        ],
        availability: "Available Today at 18:00 BST",
        hourlyRate: 120,
        image: "/images/premium/mentor-banner.png"
    },
    "dt-james-wilson": {
        id: "dt-james-wilson",
        slug: "dt-james-wilson",
        name: "Dt. James Wilson",
        title: "Pediatric Dentist, UCSF",
        credentials: "Pediatric Specialist | Former UCSF Admissions",
        bio: "Working with children requires patience and empathy—qualities I look for in future dentists. I help applicants highlight their soft skills and community impact.",
        stats: { sessions: 640, mentees: 210, rating: 4.9, reviews: 34 },
        services: [
            { name: "Pediatric Dentistry Path", desc: "Specializing in the care of younger patients." },
            { name: "Community Narrative", desc: "Highlighting your impact on local communities." },
            { name: "Traditional Interview", desc: "Classic interview techniques for U.S. schools." }
        ],
        availability: "Available next Monday at 09:00 PST",
        hourlyRate: 160,
        image: "/images/premium/auth-landscape.png"
    },
    "dr-amira-patel": {
        id: "dr-amira-patel",
        slug: "dr-amira-patel",
        name: "Dr. Amira Patel",
        title: "Periodontist, UCL",
        credentials: "Top of Class UCL | Research Fellow",
        bio: "My focus is on helping students with strong academic and research backgrounds translate those achievements into a winning dental school application.",
        stats: { sessions: 420, mentees: 150, rating: 5.0, reviews: 29 },
        services: [
            { name: "Research Portfolio Review", desc: "Optimizing your research findings for display." },
            { name: "Academic Strategy", desc: "Leveraging high grades into top-tier offers." },
            { name: "Personal Statement", desc: "Polished and professional statement writing." }
        ],
        availability: "Available Wednesday at 11:00 BST",
        hourlyRate: 140,
        image: "/images/premium/mentor-banner.png"
    }
};
