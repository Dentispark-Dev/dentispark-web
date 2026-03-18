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
        {/* --- Cinematic Header --- */}
        <div className="relative h-80 w-full overflow-hidden">
            <Image 
                src={mentor.image}
                alt={`${mentor.name} Banner`}
                fill
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent" />
            
            <Link 
                href="/become-a-mentor"
                className="absolute top-6 left-6 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all border border-white/10 z-10"
            >
                <ArrowLeft className="h-5 w-5" />
            </Link>

            <div className="absolute top-6 right-6 flex gap-2 z-10">
                <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all border border-white/10">
                    <Share2 className="h-5 w-5" />
                </button>
                <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all border border-white/10">
                    <MoreHorizontal className="h-5 w-5" />
                </button>
            </div>
        </div>

        {/* --- Profile Content Wrapper --- */}
        <div className="max-w-6xl mx-auto px-6 relative">
            {/* Floating Avatar Section */}
            <div className="flex flex-col md:flex-row items-end gap-6 -mt-16 relative z-20 mb-12">
                <div className="h-40 w-40 rounded-full border-8 border-gray-50 overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-5xl font-black shadow-xl ring-1 ring-black/5">
                    {initials}
                </div>
                
                <div className="flex-1 pb-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{mentor.name}</h1>
                                <CheckCircle2 className="h-6 w-6 text-emerald-500 fill-emerald-50" />
                            </div>
                            <p className="text-lg font-medium text-gray-600 mt-1">{mentor.title}</p>
                            <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-bold text-gray-900">{mentor.stats.rating}</span>
                                    <span className="text-gray-500 text-sm">({mentor.stats.reviews} reviews)</span>
                                </div>
                                <div className="h-1 w-1 bg-gray-300 rounded-full" />
                                <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    {mentor.credentials}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link href={`/login?redirect=/mentorship/${mentor.slug}`}>
                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 h-12 font-bold gap-2 shadow-lg shadow-emerald-600/20">
                                    Book Mentor
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Layout: Main | Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Main Info */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2 group hover:border-emerald-500/30 transition-all">
                            <div className="h-10 w-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                <Video className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-gray-900">{mentor.stats.sessions.toLocaleString()}</p>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sessions Hosted</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2 group hover:border-emerald-500/30 transition-all">
                            <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-gray-900">{mentor.stats.mentees.toLocaleString()}</p>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mentees Helped</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2 group hover:border-emerald-500/30 transition-all">
                            <div className="h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-gray-900">45 min</p>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Avg. Session</p>
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight italic uppercase">About {mentor.name.split(" ")[1]}</h2>
                        <p className="text-lg text-gray-600 leading-relaxed font-medium">
                            {mentor.bio}
                        </p>
                    </section>

                    {/* Support Offered */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight italic uppercase">Expertise & Support</h2>
                        <div className="flex flex-wrap gap-3">
                            {mentor.services.map((service: string, i: number) => (
                                <div key={i} className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-emerald-500/30 transition-all cursor-default group">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                                    <span className="font-bold text-gray-800 text-sm italic">{service}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column: Booking Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 sticky top-24">
                        <div className="flex items-center justify-between mb-8">
                            <div className="font-black text-gray-900">
                                <span className="text-4xl italic">${mentor.hourlyRate}</span>
                                <span className="text-gray-400 uppercase text-xs tracking-widest ml-1">/ hour</span>
                            </div>
                            <div className="p-3 bg-emerald-50 rounded-2xl">
                                <Award className="h-6 w-6 text-emerald-600" />
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Next Available Session</p>
                                <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                                    <Calendar className="h-5 w-5 text-emerald-600" />
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{mentor.availability}</p>
                                        <p className="text-xs text-gray-500">View full calendar on profile</p>
                                    </div>
                                </div>
                            </div>

                            <Link href={`/login?redirect=/mentorship/${mentor.slug}`}>
                                <Button className="w-full h-16 bg-gray-900 hover:bg-black text-white rounded-[1.5rem] font-black text-lg transition-all active:scale-95 shadow-lg shadow-gray-900/20 uppercase tracking-widest italic mt-2">
                                    View Full Mentorship
                                </Button>
                            </Link>
                            
                            <p className="text-center text-xs text-gray-400 font-medium pt-2">
                                You must be logged in to view complete calendar schedules or message mentors directly.
                            </p>
                        </div>

                        <hr className="my-8 border-gray-100" />

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                                <div className="h-2 w-2 bg-emerald-500 rounded-full" />
                                95%+ Student Success Rate
                            </div>
                            <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                                <div className="h-2 w-2 bg-emerald-500 rounded-full" />
                                Verified Background Check
                            </div>
                            <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                                <div className="h-2 w-2 bg-emerald-500 rounded-full" />
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
