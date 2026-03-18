import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
    ArrowLeft, Star, Calendar, MessageSquare, Share2, 
    MoreHorizontal, CheckCircle2, Users, Video, Clock, 
    Award, ShieldCheck
} from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface MentorPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Mock Data structure for the cinematic layout
const MOCK_MENTORS: Record<string, any> = {
    "dt-marcus-thorne": {
        slug: "dt-marcus-thorne",
        name: "Dt. Marcus Thorne",
        title: "Orthodontist, Univ of Pennsylvania",
        credentials: "Elite Orthodontics | 12+ Years Experience",
        bio: "Specializing in advanced orthodontic procedures and guiding pre-dental students through the rigorous application process for specialized programs.",
        stats: { sessions: 1530, mentees: 512, rating: 4.9, reviews: 88 },
        services: ["Orthodontic Specialization Prep", "Personal Statement Review", "Clinical Research Advice"],
        availability: "Available tomorrow at 10:00 EST",
        hourlyRate: 175,
        image: "/images/premium/mentor-banner.png"
    },
    "dr-elena-rostova": {
        slug: "dr-elena-rostova",
        name: "Dr. Elena Rostova",
        title: "Oral Surgeon, Harvard School of Dental Medicine",
        credentials: "Chief of Surgery | Admissions Committee",
        bio: "I leverage my experience on the Harvard admissions committee to help driven students craft compelling narratives. I focus on surgical specialties and high-stakes interviews.",
        stats: { sessions: 980, mentees: 340, rating: 5.0, reviews: 62 },
        services: ["Surgical Residency Prep", "MMI Interview Prep", "Application Strategy"],
        availability: "Available Thursday at 14:00 GMT",
        hourlyRate: 210,
        image: "/images/premium/auth-landscape.png"
    },
    "dr-sarah-chen": {
        slug: "dr-sarah-chen",
        name: "Dr. Sarah Chen",
        title: "General Dentist, King's College London",
        credentials: "NHS Consultant | UCAT Specialist",
        bio: "Passionate about mentoring the next generation of UK dentists. I specialize in breaking down the UCAT and preparing students for the nuances of NHS-focused interviews.",
        stats: { sessions: 2100, mentees: 890, rating: 4.8, reviews: 145 },
        services: ["UCAT Strategy", "NHS Values Interview", "School Selection (UK)"],
        availability: "Available Today at 18:00 BST",
        hourlyRate: 120,
        image: "/images/premium/mentor-banner.png"
    },
    "dt-james-wilson": {
        slug: "dt-james-wilson",
        name: "Dt. James Wilson",
        title: "Pediatric Dentist, UCSF",
        credentials: "Pediatric Specialist | Former UCSF Admissions",
        bio: "Working with children requires patience and empathy—qualities I look for in future dentists. I help applicants highlight their soft skills and community impact.",
        stats: { sessions: 640, mentees: 210, rating: 4.9, reviews: 34 },
        services: ["Pediatric Dentistry Path", "Community Narrative", "Traditional Interview"],
        availability: "Available next Monday at 09:00 PST",
        hourlyRate: 160,
        image: "/images/premium/auth-landscape.png"
    },
    "dr-amira-patel": {
        slug: "dr-amira-patel",
        name: "Dr. Amira Patel",
        title: "Periodontist, UCL",
        credentials: "Top of Class UCL | Research Fellow",
        bio: "My focus is on helping students with strong academic and research backgrounds translate those achievements into a winning dental school application.",
        stats: { sessions: 420, mentees: 150, rating: 5.0, reviews: 29 },
        services: ["Research Portfolio Review", "Academic Strategy", "Personal Statement"],
        availability: "Available Wednesday at 11:00 BST",
        hourlyRate: 140,
        image: "/images/premium/mentor-banner.png"
    }
};

export default async function MentorPage({ params }: MentorPageProps) {
  const { slug } = await params;
  const mentor = MOCK_MENTORS[slug];

  if (!mentor) {
    notFound();
  }

  // Extract initials for the avatar if no profile picture is explicitly set as a discrete component
  const initials = mentor.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
        {/* --- Header --- */}
        <div className="relative h-64 md:h-80 w-full overflow-hidden bg-emerald-50">
            <Image 
                src={mentor.image}
                alt={`${mentor.name} Banner`}
                fill
                className="object-cover opacity-50 mix-blend-multiply"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-900/40 to-gray-900/20" />
            
            <Link 
                href="/become-a-mentor"
                className="absolute top-6 left-6 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:text-emerald-700 hover:bg-white transition-all shadow-sm z-10"
            >
                <ArrowLeft className="h-5 w-5" />
            </Link>

            <div className="absolute top-6 right-6 flex gap-2 z-10">
                <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:text-emerald-700 hover:bg-white transition-all shadow-sm">
                    <Share2 className="h-5 w-5" />
                </button>
                <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:text-emerald-700 hover:bg-white transition-all shadow-sm">
                    <MoreHorizontal className="h-5 w-5" />
                </button>
            </div>
        </div>

        {/* --- Profile Content Wrapper --- */}
        <div className="max-w-6xl mx-auto px-6 relative">
            {/* Floating Avatar Section */}
            <div className="flex flex-col md:flex-row items-end gap-6 -mt-16 relative z-20 mb-12">
                <div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-white overflow-hidden bg-emerald-100 flex items-center justify-center text-emerald-800 text-4xl md:text-5xl font-sora font-bold shadow-sm ring-1 ring-gray-100">
                    {initials}
                </div>
                
                <div className="flex-1 pb-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl md:text-4xl font-sora font-extrabold text-gray-900 tracking-tight">{mentor.name}</h1>
                                <CheckCircle2 className="h-6 w-6 text-emerald-500 fill-emerald-50" />
                            </div>
                            <p className="text-xl font-semibold text-gray-700 mt-1">{mentor.title}</p>
                            <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    <span className="font-semibold text-gray-900">{mentor.stats.rating}</span>
                                    <span className="text-gray-500 text-sm">({mentor.stats.reviews} reviews)</span>
                                </div>
                                <div className="h-1 w-1 bg-gray-300 rounded-full" />
                                <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md">
                                    <ShieldCheck className="h-4 w-4" />
                                    {mentor.credentials}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link href={`/login?redirect=/mentorship/${mentor.slug}`}>
                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 h-12 font-sora font-semibold gap-2 shadow-sm">
                                    Book Mentor
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Layout: Main | Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                {/* Left Column: Main Info */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                            <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                <Video className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-sora font-bold text-gray-900">{mentor.stats.sessions.toLocaleString()}</p>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Sessions Hosted</p>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                            <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-sora font-bold text-gray-900">{mentor.stats.mentees.toLocaleString()}</p>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Mentees Helped</p>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                            <div className="h-10 w-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-sora font-bold text-gray-900">45 min</p>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Avg. Session</p>
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-sora font-bold text-gray-900 tracking-tight">About {mentor.name.split(" ")[1]}</h2>
                        <p className="text-lg text-gray-700 leading-relaxed font-medium">
                            {mentor.bio}
                        </p>
                    </section>

                    {/* Support Offered */}
                    <section className="space-y-5">
                        <h2 className="text-2xl font-sora font-bold text-gray-900 tracking-tight">Expertise & Support</h2>
                        <div className="flex flex-wrap gap-2.5">
                            {mentor.services.map((service: string, i: number) => (
                                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm font-medium text-gray-700">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    <span>{service}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column: Booking Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-3xl p-6 lg:p-8 shadow-sm sticky top-24">
                        <div className="flex items-center justify-between mb-8">
                            <div className="text-gray-900">
                                <span className="text-4xl font-sora font-bold">${mentor.hourlyRate}</span>
                                <span className="text-gray-500 font-medium text-sm ml-1">/ hour</span>
                            </div>
                            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center">
                                <Award className="h-6 w-6 text-emerald-600" />
                            </div>
                        </div>
                        
                        <div className="space-y-5">
                            <div className="space-y-2.5">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Next Available Session</p>
                                <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                                    <Calendar className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">{mentor.availability}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">View full calendar on profile</p>
                                    </div>
                                </div>
                            </div>

                            <Link href={`/login?redirect=/mentorship/${mentor.slug}`}>
                                <Button className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-sora font-semibold text-base transition-all shadow-sm mt-2">
                                    View Full Mentorship
                                </Button>
                            </Link>
                            
                            <p className="text-center text-xs text-gray-400 font-medium pt-2 leading-relaxed">
                                You must be logged in to view complete calendar schedules or message mentors directly.
                            </p>
                        </div>

                        <hr className="my-6 border-gray-200" />

                        <div className="space-y-3.5">
                            <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                                <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
                                95%+ Student Success Rate
                            </div>
                            <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                                <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
                                Verified Background Check
                            </div>
                            <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                                <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
                                DentiSpark Elite Mentor
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
