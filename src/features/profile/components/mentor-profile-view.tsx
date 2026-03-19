"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ArrowLeft, Star, Calendar, MessageSquare, Share2, 
    MoreHorizontal, CheckCircle2, Users, Video, Clock, 
    Award, ShieldCheck, ChevronRight, PlayCircle
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

interface MentorProfileViewProps {
  mentor: any;
  isDashboard?: boolean;
  onBack?: () => void;
}

const AnimatedCounter = ({ value, duration = 2 }: { value: number, duration?: number }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = value;
        if (start === end) return;
        
        let totalMiliseconds = duration * 1000;
        let incrementTime = (totalMiliseconds / end) > 10 ? (totalMiliseconds / end) : 10;
        
        let timer = setInterval(() => {
            start += Math.ceil(end / (totalMiliseconds / incrementTime));
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, incrementTime);
        
        return () => clearInterval(timer);
    }, [value, duration]);
    
    return <>{count.toLocaleString()}</>;
};

export function MentorProfileView({ mentor, isDashboard, onBack }: MentorProfileViewProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "services" | "reviews">("overview");
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyHeader(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mentor) return null;

  const initials = mentor.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { staggerChildren: 0.1, duration: 0.4 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={cn("min-h-screen pb-20 font-inter", isDashboard ? "" : "bg-gray-50/50")}>
        {/* --- Sticky Mini-Header --- */}
        <AnimatePresence>
            {showStickyHeader && (
                <motion.div 
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    exit={{ y: -100 }}
                    className={cn(
                        "fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-3 shadow-sm",
                        isDashboard ? "lg:left-[300px]" : ""
                    )}
                >
                    <div className="max-w-6xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-sora font-bold text-sm">
                                {initials}
                            </div>
                            <div>
                                <h4 className="font-sora font-bold text-gray-900 text-sm leading-none">{mentor.name}</h4>
                                <div className="flex items-center gap-1 mt-1">
                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                    <span className="text-[10px] font-bold text-gray-500">{mentor.stats.rating} rating</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="hidden md:block text-sm font-sora font-bold text-emerald-700">${mentor.hourlyRate}/hr</span>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-9 px-6 font-sora font-bold text-xs shadow-sm shadow-emerald-200">
                                {isDashboard ? "Book Session" : "Book Now"}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* --- Header Hero --- */}
        <div className="relative h-72 md:h-[400px] w-full overflow-hidden">
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0"
            >
                <Image 
                    src={mentor.image}
                    alt={`${mentor.name} Banner`}
                    fill
                    className="object-cover opacity-50 mix-blend-multiply"
                    priority
                />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-950/20 to-gray-950/40" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-10">
                <motion.button 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-sora font-bold hover:bg-white/20 transition-all hover:scale-105"
                >
                    <PlayCircle className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300" />
                    Watch Intro Video
                </motion.button>
            </div>

            {onBack && (
                <button 
                    onClick={onBack}
                    className="absolute top-8 left-8 p-3 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:text-emerald-700 hover:bg-white transition-all shadow-sm z-10"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
            )}

            <div className="absolute top-8 right-8 flex gap-3 z-10">
                <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:text-emerald-700 hover:bg-white transition-all shadow-sm">
                    <Share2 className="h-5 w-5" />
                </button>
            </div>
        </div>

        {/* --- Profile Content Wrapper --- */}
        <div className="max-w-6xl mx-auto px-6 relative">
            {/* Floating Profile Info Section */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row items-end gap-8 -mt-24 relative z-20 mb-12"
            >
                <div className="relative group">
                    <div className="h-40 w-40 md:h-52 md:w-52 rounded-3xl border-[8px] border-gray-50 overflow-hidden bg-emerald-100 flex items-center justify-center text-emerald-800 text-5xl md:text-6xl font-sora font-bold shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                        {initials}
                    </div>
                </div>
                
                <div className="flex-1 pb-4">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl md:text-5xl font-sora font-extrabold text-gray-900 tracking-tight">{mentor.name}</h1>
                            <CheckCircle2 className="h-8 w-8 text-emerald-500 fill-emerald-50" />
                        </div>
                        <p className="text-2xl font-sora font-bold text-gray-600 tracking-tight">{mentor.title}</p>
                        
                        <div className="flex flex-wrap items-center gap-6 mt-4">
                            <div className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 rounded-2xl border border-amber-100">
                                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                                <span className="font-sora font-extrabold text-amber-700">{mentor.stats.rating}</span>
                                <span className="text-amber-600/60 text-[10px] font-bold uppercase tracking-wider ml-1">Overall Rating</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100">
                                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                                <span className="text-xs font-sora font-extrabold text-emerald-700 uppercase tracking-widest">{mentor.credentials.split("|")[0]}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Navigation Tabs */}
            <div className="flex items-center gap-8 border-b border-gray-200 mb-10 overflow-x-auto no-scrollbar">
                {["overview", "services", "reviews"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={cn(
                            "pb-4 text-sm font-sora font-bold uppercase tracking-[0.2em] transition-all relative whitespace-nowrap",
                            activeTab === tab ? "text-emerald-700" : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        {tab}
                        {activeTab === tab && (
                            <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600" />
                        )}
                    </button>
                ))}
            </div>

            {/* Grid Layout: Main | Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Content Area */}
                <div className="lg:col-span-2 space-y-12">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div 
                                key="overview"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="space-y-12"
                            >
                                {/* Stats Interaction */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[
                                        { label: "Sessions Hosted", value: mentor.stats.sessions, icon: <Video />, color: "text-emerald-600", bg: "bg-emerald-50" },
                                        { label: "Mentees Helped", value: mentor.stats.mentees, icon: <Users />, color: "text-blue-600", bg: "bg-blue-50" },
                                        { label: "Avg. Response", value: "2 hr", icon: <Clock />, color: "text-purple-600", bg: "bg-purple-50" },
                                    ].map((stat, i) => (
                                        <motion.div 
                                            key={i}
                                            variants={itemVariants}
                                            whileHover={{ y: -5 }}
                                            className="p-6 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm transition-all hover:shadow-xl group"
                                        >
                                            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", stat.bg, stat.color)}>
                                                {stat.icon}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-3xl font-sora font-extrabold text-gray-900">
                                                    <AnimatedCounter value={typeof stat.value === 'number' ? stat.value : parseInt(stat.value)} />
                                                    {typeof stat.value === 'string' && !parseInt(stat.value) && stat.value}
                                                </p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* About Section */}
                                <motion.section variants={itemVariants} className="space-y-6">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest">
                                        Mentorship Philosophy
                                    </div>
                                    <h2 className="text-3xl font-sora font-bold text-gray-900 tracking-tight">Guiding the Next Generation of Dentists</h2>
                                    <p className="text-xl text-gray-600 leading-relaxed font-medium">
                                        {mentor.bio}
                                    </p>
                                </motion.section>
                            </motion.div>
                        )}

                        {activeTab === 'services' && (
                            <motion.div 
                                key="services"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="grid grid-cols-1 gap-6"
                            >
                                {mentor.services.map((service: any, i: number) => (
                                    <motion.div 
                                        key={i}
                                        variants={itemVariants}
                                        whileHover={{ x: 10 }}
                                        className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="h-14 w-14 rounded-[1.25rem] bg-emerald-50 flex items-center justify-center text-emerald-600 text-xl font-bold group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                                0{i + 1}
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-xl font-sora font-bold text-gray-900">{typeof service === 'string' ? service : service.name}</h3>
                                                <p className="text-gray-500 text-sm font-medium">{typeof service === 'string' ? "Expert mentorship and guidance." : service.desc}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-emerald-600 transition-colors" />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {activeTab === 'reviews' && (
                            <motion.div 
                                key="reviews"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-6"
                            >
                                {[1, 2, 3].map((r) => (
                                    <div key={r} className="p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-gray-100" />
                                                <div>
                                                    <h5 className="font-sora font-bold text-gray-900">Student User {r}</h5>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">DentiSpark Member</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed font-medium">
                                            "Working with {mentor.name.split(" ")[1]} was a game changer. The insight provided was invaluable for my application journey."
                                        </p>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Column: Premium Booking Sidebar */}
                <div className="space-y-8">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/80 backdrop-blur-xl border border-white rounded-[3rem] p-8 lg:p-10 shadow-2xl relative overflow-hidden group sticky top-24"
                    >
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 blur-[60px] rounded-full group-hover:bg-emerald-500/20 transition-colors duration-1000" />
                        
                        <div className="relative z-10 space-y-10">
                            <div className="flex items-center justify-between">
                                <div className="text-gray-900 border-l-4 border-emerald-500 pl-4">
                                    <span className="text-5xl font-sora font-extrabold tracking-tighter">${mentor.hourlyRate}</span>
                                    <span className="text-gray-400 font-bold text-xs uppercase tracking-widest ml-2">per hour</span>
                                </div>
                                <div className="p-4 bg-emerald-50 rounded-2xl">
                                    <Award className="h-8 w-8 text-emerald-600" />
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Operational Status</p>
                                    <div className="flex items-center gap-4 p-5 bg-gray-50/50 backdrop-blur-sm border border-gray-100 rounded-3xl group/slot hover:bg-emerald-50/50 transition-colors cursor-pointer">
                                        <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600 animate-pulse">
                                            <Calendar className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-sora font-extrabold text-gray-900 text-sm">{mentor.availability}</p>
                                            <p className="text-xs text-gray-500 font-semibold mt-0.5">Quick booking enabled</p>
                                        </div>
                                    </div>
                                </div>

                                {isDashboard ? (
                                    <Button className="w-full h-16 bg-gray-950 hover:bg-emerald-700 text-white rounded-[1.5rem] font-sora font-extrabold text-lg transition-all shadow-xl hover:-translate-y-1 active:translate-y-0 group">
                                        Request Partnership
                                        <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                ) : (
                                    <Link href={`/login?redirect=/mentor/${mentor.slug}`} className="block">
                                        <Button className="w-full h-16 bg-gray-950 hover:bg-emerald-700 text-white rounded-[1.5rem] font-sora font-extrabold text-lg transition-all shadow-xl hover:-translate-y-1 active:translate-y-0 group">
                                            Secure This Slot
                                            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                )}
                                
                                <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-2">
                                    Satisfaction Guaranteed
                                </p>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-gray-100">
                                {[
                                    { text: "95%+ Success Rate" },
                                    { text: "Verified Identity" },
                                    { text: "Elite Tier Mentor" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-xs font-bold text-gray-600">
                                        <div className="h-2 w-2 bg-emerald-500 rounded-full" />
                                        {item.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    </div>
  );
}
