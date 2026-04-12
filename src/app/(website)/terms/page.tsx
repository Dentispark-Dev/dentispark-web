"use client";

import Container from "@/src/components/layouts/container";
import { motion } from "framer-motion";
import { Gavel, Scale, FileWarning, HelpCircle, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-white pt-32 pb-24 font-inter text-slate-800">
            <Container className="max-w-4xl">
                {/* Header */}
                <div className="mb-20 space-y-6">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors mb-4 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to DentiSpark Hub
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                            <Gavel className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-jakarta font-extrabold tracking-tight">Terms of <span className="text-amber-600">Service.</span></h1>
                    </div>
                    <p className="text-lg text-slate-500 font-medium">Agreement for educational guidance, mentorship, and platform participation.</p>
                </div>

                <div className="prose prose-slate prose-lg max-w-none space-y-16">
                    {/* Welcome */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 text-amber-600">
                            <Scale className="w-6 h-6" />
                            <h2 className="text-2xl font-jakarta font-extrabold m-0 text-slate-900 uppercase tracking-widest text-xs">Agreement</h2>
                        </div>
                        <p className="leading-relaxed">
                            Welcome to DentiSpark. These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of our platform, services, and applications. By clicking &ldquo;I Agree,&rdquo; or by using the DentiSpark website or services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, you must not use our services.
                        </p>
                    </section>

                    {/* Mentorship Ethics */}
                    <section className="space-y-8 bg-slate-950 text-white p-10 md:p-14 rounded-[3.5rem] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                        <div className="flex items-center gap-3 text-amber-400">
                            <CheckCircle2 className="w-6 h-6" />
                            <h2 className="text-2xl font-jakarta font-extrabold m-0 text-white uppercase tracking-widest text-xs">Mentorship Charter</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-white">Student Conduct</h3>
                                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                                    Students must treat mentors with professional respect. Harassment, unprofessional language, or attempts to circumvent the platform for direct payments are grounds for immediate termination without refund.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-white">Mentor Credentials</h3>
                                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                                    Mentors represent that they hold the credentials listed on their profiles. Misrepresentation of GDC registration or medical standing will result in permanent removal and notification to the relevant professional bodies.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Payments & Refunds */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 text-amber-600">
                            <Gavel className="w-6 h-6" />
                            <h2 className="text-2xl font-jakarta font-extrabold m-0 text-slate-900 uppercase tracking-widest text-xs">Payments & Cancellations</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl">
                                <h3 className="text-lg font-bold text-slate-900 mb-3">Professional Booking Policy</h3>
                                <ul className="list-none p-0 space-y-4 text-sm font-medium text-slate-600">
                                    <li className="flex gap-3">
                                        <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                        <span>Cancellations made more than 48 hours before a scheduled mentorship session are eligible for a full platform credit.</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                        <span>Cancellations made within 24 hours of a session are non-refundable to compensate the mentor for their time.</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                        <span>Wait-times: If a mentor fails to attend a session within 15 minutes, the student is entitled to a full re-booking at no cost.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Intellectual Property */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-jakarta font-extrabold m-0 text-slate-900 uppercase tracking-widest text-xs">Intellectual Property</h2>
                        <p className="leading-relaxed">
                            All curriculum materials, AI logic, and platform resources are the exclusive property of DentiSpark. Recording of video sessions without the express written consent of both the mentor and DentiSpark is strictly prohibited. Materials provided during sessions are for personal educational use only and may not be redistributed.
                        </p>
                    </section>

                    {/* Disclaimers */}
                    <section className="space-y-8 p-10 md:p-14 bg-amber-50 border border-amber-100 rounded-[3.5rem] relative overflow-hidden">
                        <div className="flex items-center gap-3 text-amber-800">
                            <FileWarning className="w-6 h-6" />
                            <h2 className="text-2xl font-jakarta font-extrabold m-0 uppercase tracking-widest text-xs">Critical Disclaimers</h2>
                        </div>
                        <p className="font-bold text-amber-900 mb-0">No Outcome Guarantee:</p>
                        <p className="text-amber-800/80 m-0 leading-relaxed font-medium">
                            DentiSpark provides guidance and educational tools. We do not guarantee admission into any dental school, medical school, or university program. The ultimate responsibility for application performance rests with the student.
                        </p>
                        <p className="font-bold text-amber-900 mb-0">No Clinical Advice:</p>
                        <p className="text-amber-800/80 m-0 leading-relaxed font-medium">
                            Mentorship sessions are for educational guidance only. Mentors do not provide clinical advice or patient treatment recommendations during their time on the platform.
                        </p>
                    </section>

                    {/* Contact */}
                    <section className="pt-16 border-t border-slate-100 text-center space-y-6">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                                <HelpCircle className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-jakarta font-extrabold m-0 text-slate-900">Need Clarification?</h2>
                            <p className="max-w-md mx-auto text-slate-500 font-medium">
                                If you have any questions about these terms or our professional standards, please contact our legal team at:
                            </p>
                            <a href="mailto:legal@dentispark.com" className="text-lg font-bold text-amber-600 hover:underline">legal@dentispark.com</a>
                        </div>
                    </section>
                </div>
            </Container>
        </main>
    );
}
