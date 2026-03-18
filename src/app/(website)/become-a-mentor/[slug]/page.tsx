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
    "dt-andy-j-pierce": {
        slug: "dt-andy-j-pierce",
        name: "Dt. Andy J. Pierce",
        title: "DDS, American Public University System",
        credentials: "Orthodontist | Graduate Admission Consultant",
        bio: "With ten years of experience in graduate admissions at Stanford University's School of Engineering and School of Education, I provide valuable insight into the application and review process. Specialized in complex cases and mentoring for dental sciences.",
        stats: {
            sessions: 840,
            mentees: 212,
            rating: 4.8,
            reviews: 26
        },
        services: [
            "Graduate Admission Consulting",
            "Complex Case Review",
            "Orthodontic Specialization Prep",
            "Personal Statement Review"
        ],
        availability: "Available tomorrow at 19:30 GMT",
        hourlyRate: 150,
        image: "/images/premium/mentor-banner.png"
    },
    "dr-baird-james": {
        slug: "dr-baird-james",
        name: "Dr. Baird James",
        title: "DMD, Harvard School of Dental Medicine",
        credentials: "Chief of Oral Surgery | Boston Medical Center",
        bio: "Building relationships with individuals from outside my typical circle, hearing about their paths and preparing them for careers is inspiring and motivating. My approach focuses on practical guidance combined with emotional support throughout the rigorous oral surgery application process.",
        stats: {
            sessions: 1240,
            mentees: 472,
            rating: 5.0,
            reviews: 34
        },
        services: [
            "Surgical Residency Prep",
            "Clinical Rotations Strategy",
            "Interview Prep (MMI & Traditional)",
            "Application Audit"
        ],
        availability: "Available today at 14:00 EST",
        hourlyRate: 200,
        image: "/images/premium/auth-landscape.png" 
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
