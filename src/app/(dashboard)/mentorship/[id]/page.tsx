"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
    ArrowLeft, Star, Calendar, MessageSquare, Share2, 
    MoreHorizontal, Link as LinkIcon, CheckCircle2,
    Users, Video, Clock, Award, ShieldCheck
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { motion } from "framer-motion";

// --- Mock Data (matches the mentorship list) ---
const MOCK_MENTORS = [
    {
        id: "dt-marcus-thorne",
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
    {
        id: "dr-elena-rostova",
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
    {
        id: "dr-sarah-chen",
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
    {
        id: "dt-james-wilson",
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
    {
        id: "dr-amira-patel",
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
];

export default function MentorProfilePage() {
    const params = useParams();
    const router = useRouter();
    const [isFollowed, setIsFollowed] = useState(false);
    
    // In a real app, fetch mentor by params.id
    const mentor = MOCK_MENTORS.find(m => m.id === params.id) || MOCK_MENTORS[0];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* --- Header --- */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden bg-emerald-50">
                {/* Banner Image */}
                <Image 
                    src={mentor.image}
                    alt="Mentor Banner"
                    fill
                    className="object-cover opacity-80 mix-blend-multiply"
                    priority
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent" />
                
                {/* Back Button */}
                <button 
                    onClick={() => router.back()}
                    className="absolute top-6 left-6 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:text-emerald-700 hover:bg-white transition-all shadow-sm z-10"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>

                {/* Header Actions */}
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
                        {mentor.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    
                    <div className="flex-1 pb-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-3xl md:text-4xl font-sora font-bold text-gray-900 tracking-tight">{mentor.name}</h1>
                                    <CheckCircle2 className="h-6 w-6 text-emerald-500 fill-emerald-50" />
                                </div>
                                <p className="text-lg font-medium text-gray-600 mt-1">{mentor.title}</p>
                                <div className="flex items-center gap-4 mt-3">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                        <span className="font-semibold text-gray-900">{mentor.stats.rating}</span>
                                        <span className="text-gray-500 text-sm">({mentor.stats.reviews} reviews)</span>
                                    </div>
                                    <div className="h-1 w-1 bg-gray-300 rounded-full" />
                                    <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md">
                                        <ShieldCheck className="h-4 w-4" />
                                        Admissions Expert
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button 
                                    variant="outline"
                                    onClick={() => setIsFollowed(!isFollowed)}
                                    className={`rounded-xl px-6 h-12 font-sora font-semibold transition-all ${isFollowed ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100' : 'border-gray-200 text-gray-700 hover:bg-gray-50 bg-white shadow-sm'}`}
                                >
                                    {isFollowed ? "Following" : "Follow"}
                                </Button>
                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 h-12 font-sora font-semibold gap-2 shadow-sm">
                                    <MessageSquare className="h-5 w-5" />
                                    Message
                                </Button>
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
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sessions Hosted</p>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                                <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-sora font-bold text-gray-900">{mentor.stats.mentees.toLocaleString()}</p>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mentees Helped</p>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                                <div className="h-10 w-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-sora font-bold text-gray-900">45 min</p>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg. Session</p>
                                </div>
                            </div>
                        </div>

                        {/* About Section */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-sora font-bold text-gray-900 tracking-tight">About {mentor.name.split(" ")[1]}</h2>
                            <p className="text-base text-gray-600 leading-relaxed">
                                {mentor.bio}
                            </p>
                        </section>

                        {/* Support Offered */}
                        <section className="space-y-5">
                            <h2 className="text-2xl font-sora font-bold text-gray-900 tracking-tight">Support Offered</h2>
                            <div className="flex flex-wrap gap-2.5">
                                {mentor.services.map((service, i) => (
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
                        <div className="bg-white border border-gray-200 rounded-3xl p-6 lg:p-8 shadow-sm">
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
                                            <p className="text-xs text-gray-500 mt-0.5">10:00 AM - 11:00 AM EST</p>
                                        </div>
                                    </div>
                                </div>

                                <Button className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-sora font-semibold text-base transition-all shadow-sm mt-2">
                                    Request Session
                                </Button>
                                
                                <p className="text-center text-xs text-gray-400 font-medium leading-relaxed">
                                    Free intro calls available upon request
                                </p>
                            </div>

                            <hr className="my-6 border-gray-200" />

                            <div className="space-y-3.5">
                                <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                                    <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
                                    94% Student Success Rate
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
