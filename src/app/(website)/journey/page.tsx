"use client";

import Container from "@/src/components/layouts/container";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, BookOpen, Stethoscope, FileText, GraduationCap, Trophy, Calendar } from "lucide-react";
import { Button } from "@/src/components/ui/button";

const JOURNEY_PHASES = [
    {
        phase: "01",
        title: "Discovery & Foundation",
        timeframe: "Year 10 – Year 11",
        description: "Build your academic foundation and discover whether dentistry is the right career through self-assessment, work shadowing, and reading around the subject.",
        milestones: ["Achieve strong GCSE grades (7-9 in Sciences)", "Complete initial dental practice shadowing", "Start a Manual Dexterity portfolio"],
        icon: <BookOpen className="w-6 h-6" />,
        color: "emerald"
    },
    {
        phase: "02",
        title: "Clinical Exposure & Skills",
        timeframe: "Year 12 (Lower Sixth)",
        description: "Deepen your clinical awareness. Log structured work experience, develop reflective writing, and begin preparation for the UCAT entrance exam.",
        milestones: ["Complete structured clinical placement", "Start Shadowing Log entries", "Begin UCAT preparation"],
        icon: <Stethoscope className="w-6 h-6" />,
        color: "blue"
    },
    {
        phase: "03",
        title: "Application Architecture",
        timeframe: "Year 12 – Year 13 (Summer)",
        description: "Write your UCAS personal statement, secure academic references, and strategically select your 4+1 dental school choices.",
        milestones: ["Draft and polish personal statement", "Secure academic references", "Finalise UCAS school choices"],
        icon: <FileText className="w-6 h-6" />,
        color: "amber"
    },
    {
        phase: "04",
        title: "The UCAT & Submission",
        timeframe: "Year 13 (June – October)",
        description: "Take the UCAT entrance exam, submit your UCAS application before the October 15th deadline, and prepare for interview invitations.",
        milestones: ["Sit the UCAT exam", "Submit UCAS application", "Prepare for MMI interview format"],
        icon: <Calendar className="w-6 h-6" />,
        color: "orange"
    },
    {
        phase: "05",
        title: "Interviews & Offers",
        timeframe: "Year 13 (November – March)",
        description: "Attend Multiple Mini Interviews (MMI) and panel interviews. Receive conditional offers and select your Firm and Insurance choices.",
        milestones: ["Complete MMI simulations", "Attend university interviews", "Accept Firm & Insurance offers"],
        icon: <GraduationCap className="w-6 h-6" />,
        color: "purple"
    },
    {
        phase: "06",
        title: "Results & Enrolment",
        timeframe: "Year 13 (August – September)",
        description: "Receive A-Level results. Meet your conditional offer requirements and begin your first year at dental school.",
        milestones: ["Achieve required A-Level grades", "Complete university enrolment", "Begin BDS Year 1"],
        icon: <Trophy className="w-6 h-6" />,
        color: "emerald"
    }
];

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.1, duration: 0.5 }
    })
};

export default function JourneyPage() {
    return (
        <main className="min-h-screen pt-20 pb-24 bg-white">
            <Container className="py-16">
                <div className="max-w-4xl mx-auto text-center space-y-6 mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
                        <GraduationCap className="w-3.5 h-3.5" />
                        The DentiSpark Protocol
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-jakarta font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                        Your Journey to <span className="text-emerald-600">Dental School</span>
                    </h1>
                    <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                        A structured, phase-by-phase roadmap from GCSE preparation to your first day as a dental student. Every milestone is tracked and supported by DentiSpark.
                    </p>
                </div>

                <div className="space-y-8 max-w-4xl mx-auto">
                    {JOURNEY_PHASES.map((phase, i) => (
                        <motion.div
                            key={phase.phase}
                            custom={i}
                            variants={fadeIn}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="group relative flex gap-8 items-start"
                        >
                            {/* Timeline Connector */}
                            <div className="hidden md:flex flex-col items-center shrink-0">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                                    phase.color === "emerald" ? "bg-emerald-500" :
                                    phase.color === "blue" ? "bg-blue-500" :
                                    phase.color === "amber" ? "bg-amber-500" :
                                    phase.color === "orange" ? "bg-orange-500" :
                                    phase.color === "purple" ? "bg-purple-500" : "bg-slate-500"
                                }`}>
                                    {phase.icon}
                                </div>
                                {i < JOURNEY_PHASES.length - 1 && (
                                    <div className="w-0.5 h-full bg-slate-100 mt-2" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 bg-slate-50 hover:bg-white p-8 rounded-3xl border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600">Phase {phase.phase}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{phase.timeframe}</span>
                                </div>
                                <h3 className="text-2xl font-jakarta font-extrabold text-slate-900 mb-3 tracking-tight">{phase.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed mb-6">{phase.description}</p>
                                <div className="space-y-2">
                                    {phase.milestones.map((m, j) => (
                                        <div key={j} className="flex items-center gap-3">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                            <span className="text-sm font-bold text-slate-700">{m}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="max-w-4xl mx-auto mt-16 text-center">
                    <Link href="/sign-up">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-jakarta font-bold px-10 h-14 rounded-2xl text-base transition-all group flex items-center gap-3 mx-auto">
                            Start Your Journey — It&apos;s Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </Container>
        </main>
    );
}
