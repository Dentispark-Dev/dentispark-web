"use client";

import React from "react";
import { 
  BrainCircuit, 
  FileText, 
  Sparkles, 
  ClipboardCheck,
  BarChart3,
  Clock,
  ArrowRight,
  Zap,
  ShieldCheck,
  Search,
  Key,
  Fingerprint,
  Sparkle
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";

export default function AIToolsGrid() {
  const tools = [
    {
      title: "Personal Statement Reviewer",
      description: "Upload your personal statement for an instant AI-powered analysis of tone, impact, and UCAS compatibility.",
      icon: <FileText className="w-7 h-7" />,
      status: "Ready",
      href: "/ai-hub/personal-statement"
    },
    {
      title: "Smart Mentor Matching",
      description: "Our algorithm matches you with the perfect mentor based on your target universities and academic specialty.",
      icon: <Sparkles className="w-7 h-7" />,
      status: "Ready",
      href: "/ai-hub/mentor-matching"
    },
    {
      title: "Interview Prep Bot",
      description: "Practice MMI and panel interviews with our voice-responsive AI dental mentor.",
      icon: <BrainCircuit className="w-7 h-7" />,
      status: "Ready",
      href: "/ai-hub/interview-prep"
    },
    {
      title: "Academic Transcript Parser",
      description: "Automatically extract your grades and achievements from uploaded documents to boost your profile.",
      icon: <ClipboardCheck className="w-7 h-7" />,
      status: "Ready",
      href: "/ai-hub/transcript-parser"
    },
    {
      title: "Admission Alpha Matchmaker",
      description: "Analyze your academic profile and extracurriculars to determine school-specific likelihood of acceptance.",
      icon: <Fingerprint className="w-7 h-7" />,
      status: "Ready",
      href: "/ai-hub/acceptance-odds"
    },
    {
      title: "90-Day Study Planner",
      description: "Get a personalized, data-driven study schedule tailored to your exam dates and weak areas.",
      icon: <Clock className="w-7 h-7" />,
      status: "Ready",
      href: "/ai-hub/study-planner"
    }
  ];

  return (
    <div className="space-y-10 font-jakarta">
      {/* High-Fidelity Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-xl shadow-slate-200">
                <Zap className="h-6 w-6" />
             </div>
             <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">AI Application <span className="text-teal-600">Hub</span></h2>
                <div className="flex items-center gap-4 mt-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] opacity-60">Neural Pathway Active</span>
                    <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                </div>
             </div>
          </div>
          <p className="text-sm font-bold text-slate-500 max-w-xl leading-relaxed">
            Supercharge your application journey with specialized architectural intelligence designed for high-trust institutional entry.
          </p>
        </div>
        
        <div className="flex items-center gap-6 px-8 py-4 bg-slate-50 rounded-[1.5rem] border border-slate-100">
             <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-teal-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">GDPR SECURE</span>
             </div>
             <div className="h-4 w-px bg-slate-200" />
             <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-teal-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">VETTED NODES</span>
             </div>
        </div>
      </div>
      
      {/* Precision Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="group bg-white p-10 rounded-[2.5rem] hover:shadow-2xl hover:shadow-slate-200/50 transition-all border border-slate-100 relative overflow-hidden flex flex-col justify-between min-h-[320px]"
          >
            <div className="absolute top-0 right-0 h-40 w-40 bg-teal-50/50 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-700" />
            
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-8">
                    <div className="h-16 w-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-900 border border-slate-100 shadow-sm group-hover:bg-slate-900 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    {tool.icon}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-teal-600 bg-teal-50 px-4 py-1.5 rounded-full border border-teal-100">
                        {tool.status}
                        </span>
                        <div className="flex gap-1">
                            <div className="h-1 w-1 rounded-full bg-slate-200 group-hover:bg-teal-500 transition-colors" />
                            <div className="h-1 w-1 rounded-full bg-slate-200 group-hover:bg-teal-500 transition-colors delay-75" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 mb-10">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-teal-600 transition-colors">{tool.title}</h3>
                    <p className="text-sm font-bold text-slate-500 leading-relaxed max-w-[90%]">
                        {tool.description}
                    </p>
                </div>
            </div>

            <Link href={tool.href} className="relative z-10">
              <button className="w-full h-14 rounded-2xl border border-slate-200 text-slate-900 font-black text-[10px] uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-3 hover:bg-slate-900 hover:text-white hover:border-slate-900 hover:shadow-xl active:scale-[0.98]">
                Open Intelligence Terminal
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
