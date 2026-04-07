"use client";

import Container from "@/src/components/layouts/container";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart, GraduationCap, PoundSterling, Users, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/src/components/ui/button";

const ACCESS_BENEFITS = [
    {
        title: "Subsidised Mentorship",
        description: "Access 1:1 coaching sessions with verified dental professionals at reduced rates through our partnership fund.",
        icon: <Users className="w-6 h-6" />,
    },
    {
        title: "Free Resource Library",
        description: "Full access to UCAT prep guides, personal statement templates, and financial support guides at no cost.",
        icon: <GraduationCap className="w-6 h-6" />,
    },
    {
        title: "Bursary Guidance",
        description: "Personalised support navigating NHS bursaries, maintenance loans, and widening participation scholarships.",
        icon: <PoundSterling className="w-6 h-6" />,
    },
    {
        title: "Priority Placement Access",
        description: "Students from underrepresented backgrounds receive priority allocation for our clinical work experience placements.",
        icon: <ShieldCheck className="w-6 h-6" />,
    },
];

const ELIGIBILITY = [
    "Students from POLAR4 Quintile 1 or 2 postcodes",
    "First-generation university applicants",
    "Students eligible for Free School Meals (FSM)",
    "Care-experienced or estranged students",
    "Students from schools with low progression rates to higher education",
];

export default function AccessProjectPage() {
    return (
        <main className="min-h-screen pt-20 pb-24 bg-white">
            <Container className="py-16">
                {/* Hero */}
                <div className="max-w-4xl mx-auto text-center space-y-6 mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-50 text-purple-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-purple-100">
                        <Heart className="w-3.5 h-3.5" />
                        Widening Participation
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-jakarta font-black text-slate-900 tracking-tight leading-[1.1]">
                        The DentiSpark <span className="text-purple-600">Access Project</span>
                    </h1>
                    <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                        We believe every student with the ambition and aptitude for dentistry deserves the same preparation, regardless of their background or postcode.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
                    {ACCESS_BENEFITS.map((benefit, i) => (
                        <motion.div
                            key={benefit.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-slate-50 hover:bg-white p-8 rounded-3xl border border-slate-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300 group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                {benefit.icon}
                            </div>
                            <h3 className="text-xl font-jakarta font-black text-slate-900 mb-3">{benefit.title}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">{benefit.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Eligibility */}
                <div className="max-w-3xl mx-auto bg-purple-950 rounded-[3rem] p-10 lg:p-14 text-white relative overflow-hidden mb-16">
                    <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
                        <div className="w-[400px] h-[400px] bg-purple-900/40 rounded-full blur-3xl" />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-jakarta font-black mb-8 tracking-tight">Who qualifies?</h2>
                        <div className="space-y-4">
                            {ELIGIBILITY.map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                                    <span className="font-medium text-purple-100">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Link href="/sign-up">
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white font-jakarta font-bold px-10 h-14 rounded-2xl text-base transition-all group flex items-center gap-3 mx-auto">
                            Apply for Access Support
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                    <p className="text-sm text-slate-400 mt-4">No cost. No obligation. We'll review your eligibility within 48 hours.</p>
                </div>
            </Container>
        </main>
    );
}
