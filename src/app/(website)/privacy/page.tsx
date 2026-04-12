"use client";

import Container from "@/src/components/layouts/container";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileCheck, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
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
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                            <Shield className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-jakarta font-extrabold tracking-tight">Privacy <span className="text-emerald-600">Charter.</span></h1>
                    </div>
                    <p className="text-lg text-slate-500 font-medium">Last Updated: April 12, 2024. Your data security is our clinical priority.</p>
                </div>

                <div className="prose prose-slate prose-lg max-w-none space-y-16">
                    {/* Introduction */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 text-emerald-600">
                            <Eye className="w-6 h-6" />
                            <h2 className="text-2xl font-jakarta font-extrabold m-0 text-slate-900 uppercase tracking-widest text-xs">Overview</h2>
                        </div>
                        <p className="leading-relaxed">
                            At DentiSpark (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), we are committed to protecting and respecting your privacy. This policy explains how we collect, use, and protect your personal data when you use the DentiSpark platform, including our mentorship services, AI tools, and educational resources.
                        </p>
                    </section>

                    {/* Data Collection */}
                    <section className="space-y-8 bg-slate-50 p-8 md:p-12 rounded-[2.5rem] border border-slate-100">
                        <div className="flex items-center gap-3 text-blue-600">
                            <Lock className="w-6 h-6" />
                            <h2 className="text-2xl font-jakarta font-extrabold m-0 text-slate-900 uppercase tracking-widest text-xs">What We Collect</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-900">Direct Information</h3>
                                <ul className="list-none p-0 space-y-3">
                                    {[
                                        "Identity data (Name, Date of Birth)",
                                        "Contact data (Email, Address, Phone)",
                                        "Academic data (GPA, UCAT scores, School)",
                                        "Professional data (Mentors: GDC registration, CV)"
                                    ].map((item, i) => (
                                        <li key={i} className="text-sm font-medium text-slate-600 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-900">Automated Data</h3>
                                <ul className="list-none p-0 space-y-3">
                                    {[
                                        "Technical data (IP Address, Browser type)",
                                        "Usage data (How you interact with AI tools)",
                                        "Transaction data (Payment history via Stripe)",
                                        "Marketing preferences"
                                    ].map((item, i) => (
                                        <li key={i} className="text-sm font-medium text-slate-600 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400" /> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Data Usage */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 text-emerald-600">
                            <FileCheck className="w-6 h-6" />
                            <h2 className="text-2xl font-jakarta font-extrabold m-0 text-slate-900 uppercase tracking-widest text-xs">Processing Purpose</h2>
                        </div>
                        <div className="space-y-4">
                            <p className="font-medium">We process your data for the following legitimate business interests:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                    <p className="font-bold text-slate-900 mb-1 font-jakarta uppercase tracking-tighter text-[10px]">Mentorship Management</p>
                                    To facilitate secure Video WebRTC sessions and booking payments through Daily.co and Stripe.
                                </div>
                                <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                    <p className="font-bold text-slate-900 mb-1 font-jakarta uppercase tracking-tighter text-[10px]">AI Optimization</p>
                                    To generate personalized UCAT/MMI strategies based on your provided performance metrics.
                                </div>
                                <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                    <p className="font-bold text-slate-900 mb-1 font-jakarta uppercase tracking-tighter text-[10px]">Clinical Verification</p>
                                    To verify the credentials of medical and dental mentors in accordance with UK professional standards.
                                </div>
                                <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                    <p className="font-bold text-slate-900 mb-1 font-jakarta uppercase tracking-tighter text-[10px]">Legal Compliance</p>
                                    To comply with VAT, tax, and anti-fraud regulations in the UK and European Union.
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Data Retention */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-jakarta font-extrabold m-0 text-slate-900">Data Retention & Security</h2>
                        <p>
                            We retain your personal data only for as long as necessary to fulfil the purposes we collected it for. We carry out regular reviews of the data we hold and delete what is no longer needed. We implement high-level encryption (SSL/TLS) for all data in transit and at rest.
                        </p>
                    </section>

                    {/* Rights */}
                    <section className="space-y-6 bg-slate-900 text-white p-10 md:p-14 rounded-[3.5rem] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />
                        <h2 className="text-2xl font-jakarta font-extrabold m-0 text-white">Your GDPR Rights</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-10">
                            {[
                                { title: "The Right to Access", desc: "Obtain a copy of the data we hold about you." },
                                { title: "The Right to Erase", desc: "Request the deletion of your account and data." },
                                { title: "The Right to Object", desc: "Stop processing your data for direct marketing." }
                            ].map((right, i) => (
                                <div key={i} className="space-y-2">
                                    <h4 className="text-sm font-extrabold uppercase tracking-widest text-emerald-400">{right.title}</h4>
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed">{right.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Contact */}
                    <section className="pt-16 border-t border-slate-100 text-center space-y-6">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                                <Mail className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-jakarta font-extrabold m-0 text-slate-900">Questions?</h2>
                            <p className="max-w-md mx-auto text-slate-500 font-medium">
                                If you have any inquiries regarding this policy or our data handling practices, please contact our Data Protection Officer at:
                            </p>
                            <a href="mailto:privacy@dentispark.com" className="text-lg font-bold text-emerald-600 hover:underline">privacy@dentispark.com</a>
                        </div>
                    </section>
                </div>
            </Container>
        </main>
    );
}
