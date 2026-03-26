"use client";

import { useRef } from "react";
import Container from "@/src/components/layouts/container";
import { Button } from "@/src/components/ui/button";
import { 
    Calendar, Search, BookOpen, 
    FileText, MessageSquare, Trophy,
    ArrowRight, CheckCircle2, Star,
    Sparkles, Clock, Globe
} from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";

interface Milestone {
    id: number;
    title: string;
    period: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    tasks: string[];
    tips: string;
    cta?: { label: string, href: string };
}

const TIMELINE_PHASES: Milestone[] = [
    {
        id: 1,
        title: "Research & Strategy",
        period: "January - March",
        description: "The foundation of a successful application starts with choosing the right universities and understanding the landscape.",
        icon: <Search className="w-6 h-6" />,
        color: "emerald",
        tasks: [
            "Research UK/International dental schools",
            "Check A-level/IB grade requirements",
            "Secure clinical work experience",
            "Understand the widening participation criteria"
        ],
        tips: "Start keeping a reflective diary of your work experience early—it will be invaluable for your personal statement.",
        cta: { label: "University Database", href: "/scholarships" }
    },
    {
        id: 2,
        title: "Test Preparation",
        period: "April - August",
        description: "Focusing on the UCAT/DAT. This is often the most intensive phase of the entire application process.",
        icon: <BookOpen className="w-6 h-6" />,
        color: "blue",
        tasks: [
            "Master UCAT/BMAT/DAT question formats",
            "Take timed mock examinations",
            "Identify and work on weak subsections",
            "Book your test date (July-Sept window)"
        ],
        tips: "Treat UCAT prep like a part-time job. 4-6 weeks of consistent, high-quality practice is more effective than cramming.",
        cta: { label: "Practice Tools", href: "/free-tools" }
    },
    {
        id: 3,
        title: "The UCAS Application",
        period: "September - October",
        description: "Crafting a standout personal statement and submitting your choices before the early October deadline.",
        icon: <FileText className="w-6 h-6" />,
        color: "amber",
        tasks: [
            "Draft and refine your Personal Statement",
            "Get feedback from clinical mentors",
            "Finalize your 4 dental/med choices",
            "Submit UCAS before October 15th"
        ],
        tips: "Focus on reflection, not list-making. Show admissions tutors what you learned from your experiences.",
        cta: { label: "Get PS Feedback", href: "/mentors" }
    },
    {
        id: 4,
        title: "Interview Mastery",
        period: "November - March",
        description: "Preparing for MMI (Multiple Mini Interview) and Panel formats. This is the final hurdle before your offer.",
        icon: <MessageSquare className="w-6 h-6" />,
        color: "purple",
        tasks: [
            "Research dental ethical scenarios",
            "Practice MMI stations with peers",
            "Perfect your 'Why Dentistry?' response",
            "Understand current NHS hot topics"
        ],
        tips: "MMIs are about showing your thought process and empathy. There is rarely a single 'correct' answer.",
        cta: { label: "Mock Interviews", href: "/mentors" }
    },
    {
        id: 5,
        title: "Offers & Results",
        period: "March - May",
        description: "Receiving conditional/unconditional offers and making your final decisions on UCAS Track.",
        icon: <Trophy className="w-6 h-6" />,
        color: "rose",
        tasks: [
            "Review conditional offer requirements",
            "Select Firm and Insurance choices",
            "Apply for student finance/scholarships",
            "Smash your final examinations"
        ],
        tips: "Once you have your offers, stay focused. The hard work only pays off when you meet your grade conditions.",
        cta: { label: "Success Stories", href: "/success-stories" }
    }
];

export default function AdmissionTimelinePage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="bg-[#fcfcfd] min-h-screen font-inter pb-32">
            {/* Hero Section */}
            <div className="bg-white border-b border-slate-100 py-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500 rounded-full blur-[100px]" />
                </div>
                
                <Container className="relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-xl shadow-slate-900/20"
                    >
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        The Admission Protocol
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8"
                    >
                        Your Roadmap <br />
                        <span className="text-emerald-600">to Success.</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-2xl mx-auto text-xl text-slate-500 font-medium leading-relaxed mb-12"
                    >
                        A comprehensive, phase-by-phase guide to securing your dream offer in Dentistry or Medicine. Timing is everything.
                    </motion.p>
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap items-center justify-center gap-4"
                    >
                        <Button size="lg" className="h-16 px-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-xl shadow-emerald-600/20 group" asChild>
                            <Link href="#timeline">Explore the Phases <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" /></Link>
                        </Button>
                    </motion.div>
                </Container>
            </div>

            {/* Timeline Section */}
            <Container className="pt-24 relative" id="timeline">
                <div ref={containerRef} className="relative space-y-32">
                    {/* Central Vertical Line (Desktop only) */}
                    <div className="absolute left-[30px] lg:left-1/2 top-0 bottom-0 w-px bg-slate-200 lg:-translate-x-1/2 hidden md:block" />
                    <motion.div 
                        className="absolute left-[30px] lg:left-1/2 top-0 bottom-0 w-1 lg:-translate-x-1/2 bg-emerald-500 origin-top hidden md:block"
                        style={{ scaleY }}
                    />

                    {TIMELINE_PHASES.map((phase, i) => (
                        <div key={phase.id} className={`relative flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-start lg:items-center gap-12 lg:gap-24`}>
                            {/* Milestone Marker */}
                            <div className="absolute left-[30px] lg:left-1/2 top-0 lg:top-1/2 -translate-x-1/2 lg:-translate-y-1/2 z-20 hidden md:block">
                                <motion.div 
                                    whileInView={{ scale: [0, 1.2, 1] }}
                                    viewport={{ once: true }}
                                    className={`w-16 h-16 rounded-3xl bg-white border-2 border-slate-100 shadow-2xl flex items-center justify-center text-slate-900 overflow-hidden relative group`}
                                >
                                    <div className={`absolute inset-0 bg-${phase.color}-500/10 opacity-0 group-hover:opacity-100 transition-opacity`} />
                                    <div className="relative font-black text-2xl">{phase.id}</div>
                                </motion.div>
                            </div>

                            {/* Content Column (Half width) */}
                            <div className="w-full lg:w-1/2 space-y-8">
                                <motion.div
                                    initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    className="bg-white rounded-[3.5rem] border border-slate-100 p-10 md:p-14 shadow-2xl shadow-slate-200/50 relative group overflow-hidden"
                                >
                                    {/* Accent Shape */}
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-${phase.color}-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-${phase.color}-500/10 transition-colors`} />

                                    <div className="flex items-center justify-between mb-8">
                                        <div className={`px-4 py-2 rounded-full bg-${phase.color}-50 text-${phase.color}-700 text-[10px] font-black uppercase tracking-widest`}>
                                            Phase 0{phase.id}
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400 font-bold text-sm bg-slate-50 px-4 py-2 rounded-full">
                                            <Calendar className="w-4 h-4" />
                                            {phase.period}
                                        </div>
                                    </div>

                                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
                                        {phase.title}
                                    </h2>
                                    <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10">
                                        {phase.description}
                                    </p>

                                    <div className="space-y-4 mb-12">
                                        {phase.tasks.map((task, tidx) => (
                                            <div key={tidx} className="flex items-start gap-4 group/task">
                                                <div className={`mt-1.5 w-2 h-2 rounded-full bg-${phase.color}-500 group-hover/task:scale-150 transition-transform`} />
                                                <span className="text-slate-600 font-bold text-base">{task}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Expert Tip Card */}
                                    <div className={`bg-${phase.color}-50/50 rounded-3xl p-6 border border-${phase.color}-100 flex gap-4 mb-10`}>
                                        <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm text-${phase.color}-600`}>
                                            <Sparkles className="w-5 h-5 fill-current" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className={`text-[10px] font-black uppercase tracking-widest text-${phase.color}-600/70`}>Mentor Pro Tip</p>
                                            <p className="text-sm font-bold text-slate-700 leading-relaxed italic">"{phase.tips}"</p>
                                        </div>
                                    </div>

                                    {phase.cta && (
                                        <Button size="lg" className={`w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black group`} asChild>
                                            <Link href={phase.cta.href}>
                                                {phase.cta.label}
                                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </Button>
                                    )}
                                </motion.div>
                            </div>

                            {/* Empty space for alternative layout */}
                            <div className="hidden lg:block lg:w-1/2" />
                        </div>
                    ))}
                </div>

                {/* Final CTA */}
                <motion.div 
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-64 bg-emerald-600 rounded-[4rem] p-10 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-emerald-600/20"
                >
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute -top-[20%] -left-[20%] w-[60%] h-[60%] bg-white rounded-full blur-[120px]" />
                        <div className="absolute -bottom-[20%] -right-[20%] w-[60%] h-[60%] bg-slate-900 rounded-full blur-[120px]" />
                    </div>
                    
                    <div className="relative z-10 max-w-3xl mx-auto space-y-10">
                        <h2 className="text-4xl md:text-6xl font-black leading-[1.1]">
                            Ready to master <br />
                            <span className="text-slate-900">your application?</span>
                        </h2>
                        <p className="text-xl text-emerald-50 font-medium leading-relaxed">
                            Don't leave your future to chance. Join DentiSpark today and follow the proven roadmap to your white coat.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                            <Button size="lg" className="h-16 px-10 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-700 font-black text-xl border-none transition-all hover:scale-105 shadow-2xl" asChild>
                                <Link href="/sign-up">Start Your Journey</Link>
                            </Button>
                            <Button variant="ghost" className="h-16 px-10 rounded-2xl font-black text-xl text-white hover:bg-white/10" asChild>
                                <Link href="/mentors" className="flex items-center gap-2">Book a Mentor <ArrowRight className="w-5 h-5" /></Link>
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </Container>
        </div>
    );
}
