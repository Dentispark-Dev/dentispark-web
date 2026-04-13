"use client";

import { useState } from "react";
import Container from "@/src/components/layouts/container";
import { Button } from "@/src/components/ui/button";
import { 
    Star, Quote, Users, 
    ArrowRight, CheckCircle2, 
    Trophy, GraduationCap,
    Sparkles, TrendingUp, Play
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface SuccessStory {
    id: string;
    name: string;
    university: string;
    program: string;
    achievement: string;
    quote: string;
    image?: string;
    category: "dental" | "medicine" | "test-prep";
    year: string;
    stats?: { label: string, value: string }[];
}

const SUCCESS_STORIES: SuccessStory[] = [
    {
        id: "1",
        name: "Neil Sims",
        university: "King's College London",
        program: "BDS Dentistry",
        achievement: "Scored 2700+ in UCAT",
        quote: "DentiSpark's free UCAT guide and mockMMIs were a complete game changer. I felt so much more confident going into my actual interviews than I ever did before.",
        category: "dental",
        year: "2024",
        stats: [
            { label: "UCAT Score", value: "2840" },
            { label: "Offers", value: "3" }
        ]
    },
    {
        id: "2",
        name: "Sarah Jenkins",
        university: "Queen Mary University",
        program: "BDS Dentistry",
        achievement: "Secured 3 Offers",
        quote: "The personalized feedback from mentors on my personal statement helped me stand out. I honestly don't think I would have secured my QMUL offer without DentiSpark.",
        category: "dental",
        year: "2023",
        stats: [
            { label: "Prep Time", value: "4 Mo" },
            { label: "Confidence", value: "10/10" }
        ]
    },
    {
        id: "3",
        name: "David Chen",
        university: "Harvard Medical School",
        program: "MD Program",
        achievement: "Mastered MMI Interviews",
        quote: "Coming from an underprivileged background, I didn't have much guidance. DentiSpark gave me the tools and the network to compete with the very best.",
        category: "medicine",
        year: "2024",
        stats: [
            { label: "MCAT Score", value: "522" },
            { label: "Research", value: "2 Pubs" }
        ]
    },
    {
        id: "4",
        name: "Amara Okoro",
        university: "University of Birmingham",
        program: "BDS Dentistry",
        achievement: "First Gen Dental Student",
        quote: "The community here is amazing. Seeing others succeed and sharing tips made the stressful application season so much more manageable.",
        category: "dental",
        year: "2024"
    },
    {
        id: "5",
        name: "James Wilson",
        university: "UCSF Dental",
        program: "DDS Program",
        achievement: "DAT Specialist",
        quote: "The DAT practice materials are incredibly high quality. They mirror the actual exam perfectly, helping me jump from a 21 to a 25 AA.",
        category: "test-prep",
        year: "2023",
        stats: [
            { label: "DAT Score", value: "25" },
            { label: "Increase", value: "+4 pts" }
        ]
    },
    {
        id: "6",
        name: "Elena Rostova",
        university: "UCL Dental Institute",
        program: "BDS Dentistry",
        achievement: "International Student Success",
        quote: "Navigating the UK application process as an international student was daunting. DentiSpark's mentorship provided the clarity I needed.",
        category: "dental",
        year: "2024"
    }
];

export default function SuccessStoriesPage() {
    const [activeFilter, setActiveFilter] = useState("all");

    const filteredStories = SUCCESS_STORIES.filter(s => activeFilter === "all" || s.category === activeFilter);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="bg-[#fcfcfd] min-h-screen font-inter pb-20">
            {/* Hero Section */}
            <div className="bg-white border-b border-slate-100 py-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500 rounded-full blur-[120px]" />
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-[120px]" />
                </div>
                
                <Container className="relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-extrabold uppercase tracking-widest mb-8"
                    >
                        <Trophy className="w-3.5 h-3.5 fill-emerald-600" />
                        Student Spotlight
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1] mb-8"
                    >
                        Real Stories. <br />
                        <span className="text-emerald-600">Real Success.</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-2xl mx-auto text-xl text-slate-500 font-medium leading-relaxed mb-12"
                    >
                        See how hundreds of students have transformed their dental and medical school applications with DentiSpark.
                    </motion.p>

                    {/* Impact Stats */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap items-center justify-center gap-12 pt-8 border-t border-slate-50"
                    >
                        {[
                            { label: "Offers Secured", value: "2,400+", icon: <GraduationCap className="text-emerald-500" /> },
                            { label: "Avg. UCAT Increase", value: "350+", icon: <TrendingUp className="text-blue-500" /> },
                            { label: "Verified Students", value: "10k+", icon: <CheckCircle2 className="text-purple-500" /> }
                        ].map((stat, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white shadow-lg shadow-slate-200/50 flex items-center justify-center">
                                    {stat.icon}
                                </div>
                                <div className="text-left">
                                    <p className="text-2xl font-extrabold text-slate-900 leading-none">{stat.value}</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </Container>
            </div>

            {/* Stories Grid */}
            <Container className="py-24">
                {/* Filter Tabs */}
                <div className="flex items-center justify-center gap-2 mb-16 overflow-x-auto no-scrollbar scroll-smooth">
                    {["all", "dental", "medicine", "test-prep"].map(f => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-8 py-3 rounded-2xl text-sm font-extrabold transition-all whitespace-nowrap ${
                                activeFilter === f 
                                    ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20 scale-105" 
                                    : "bg-white text-slate-500 hover:text-slate-900 border border-slate-100"
                            }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1).replace("-", " ")}
                        </button>
                    ))}
                </div>

                {/* Featured Story Spotlight */}
                {activeFilter === 'all' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-20 bg-slate-950 rounded-[4rem] p-10 md:p-16 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/40"
                    >
                        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none translate-x-1/4">
                             <div className="w-full h-full bg-emerald-500 rounded-full blur-[100px]" />
                        </div>
                        
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-emerald-400 text-xs font-extrabold uppercase tracking-widest">
                                    <Star className="w-3.5 h-3.5 fill-emerald-500" />
                                    Featured Spotlight
                                </div>
                                <h2 className="text-4xl md:text-6xl font-extrabold leading-[1.1] tracking-tight">
                                    How David got into <br />
                                    <span className="text-emerald-500">Harvard Med.</span>
                                </h2>
                                <p className="text-xl text-slate-400 font-medium leading-relaxed">
                                    &quot;I came to DentiSpark with a strong background but zero knowledge of the MMI process. The mentors here didn&apos;t just teach me what to say—they taught me how to think like a professional.&quot;
                                </p>
                                <div className="flex flex-wrap gap-8 pt-4">
                                    <div>
                                        <p className="text-3xl font-extrabold text-emerald-500">522</p>
                                        <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">MCAT Score</p>
                                    </div>
                                    <div className="w-px h-12 bg-white/10" />
                                    <div>
                                        <p className="text-3xl font-extrabold text-emerald-500">Top 1%</p>
                                        <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Globally</p>
                                    </div>
                                </div>
                                <Button size="lg" className="h-14 px-10 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-lg group">
                                    Read David&apos;s Story <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/5">
                                <img 
                                    src="/images/premium/auth-landscape.png" 
                                    alt="David Chen" 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-60"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                                <div className="absolute bottom-8 left-8 right-8">
                                    <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center mb-4 cursor-pointer hover:bg-emerald-500 transition-colors group/play">
                                        <Play className="w-6 h-6 text-white group-hover/play:scale-110 transition-transform" />
                                    </div>
                                    <p className="text-2xl font-extrabold leading-tight">David Chen</p>
                                    <p className="text-sm font-bold text-slate-400">MD Candidate, Harvard Medical School</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Grid of Results */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    key={activeFilter}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {filteredStories.map((story) => (
                        <motion.div 
                            key={story.id}
                            variants={itemVariants}
                            className="bg-white rounded-[3rem] border border-slate-100 p-10 flex flex-col h-full hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group relative"
                        >
                            <div className="mb-8 relative flex items-center justify-between">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center text-2xl font-extrabold text-slate-900 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                    {story.name.charAt(0)}
                                </div>
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                                </div>
                            </div>

                            <Quote className="w-10 h-10 text-emerald-500/10 absolute top-10 right-10 group-hover:text-emerald-500/20 transition-colors" />

                            <div className="flex-1 space-y-4">
                                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">
                                    {story.achievement}
                                </h3>
                                <p className="text-slate-500 font-medium leading-relaxed italic">
                                    &quot;{story.quote}&quot;
                                </p>
                            </div>

                            <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
                                <div>
                                    <p className="text-lg font-extrabold text-slate-900 leading-none">{story.name}</p>
                                    <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mt-2">{story.university}</p>
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                                    story.category === 'dental' ? 'bg-emerald-50 text-emerald-700' : 
                                    story.category === 'medicine' ? 'bg-blue-50 text-blue-700' : 
                                    'bg-purple-50 text-purple-700'
                                }`}>
                                    {story.category}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Final CTA */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-32 bg-emerald-600 rounded-[4rem] p-10 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-emerald-600/20 group"
                >
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-white rounded-full blur-[120px]" />
                        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-slate-900 rounded-full blur-[120px]" />
                    </div>
                    
                    <div className="relative z-10 max-w-3xl mx-auto space-y-10">
                        <h2 className="text-4xl md:text-6xl font-extrabold leading-[1.1]">
                            Ready to be our next <br />
                            <span className="text-slate-900">success story?</span>
                        </h2>
                        <p className="text-xl text-emerald-50 font-medium leading-relaxed">
                            Join over 10,000 students already preparing for your dream medical or dental school offer.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                            <Button size="lg" className="h-16 px-10 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-700 font-extrabold text-xl border-none transition-all hover:scale-105 shadow-2xl" asChild>
                                <Link href="/sign-up">Start for Free</Link>
                            </Button>
                            <Button variant="ghost" className="h-16 px-10 rounded-2xl font-extrabold text-xl text-white hover:bg-white/10" asChild>
                                <Link href="/mentors" className="flex items-center gap-2">Browse Mentors <ArrowRight className="w-5 h-5" /></Link>
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </Container>
        </div>
    );
}
