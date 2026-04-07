"use client";

import React from "react";
import { 
  BrainCircuit, 
  FileText, 
  Sparkles, 
  Search, 
  ArrowRight,
  ClipboardCheck,
  Zap,
  ShieldCheck,
  BarChart3,
  Clock,
  ChevronRight,
  Target,
  Fingerprint,
  Cpu,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";

export default function AIHubPage() {
  const tools = [
    {
      title: "Personal Statement Reviewer",
      description: "Upload your personal statement for an instant AI-powered analysis of tone, impact, and UCAS compatibility.",
      icon: <FileText className="w-8 h-8" />,
      status: "Ready",
      href: "/ai-hub/personal-statement"
    },
    {
      title: "Smart Mentor Matching",
      description: "Our algorithm matches you with the perfect mentor based on your target universities and academic specialty.",
      icon: <Sparkles className="w-8 h-8" />,
      status: "Ready",
      href: "/ai-hub/mentor-matching"
    },
    {
      title: "Interview Prep Bot",
      description: "Practice MMI and panel interviews with our voice-responsive AI dental mentor.",
      icon: <BrainCircuit className="w-8 h-8" />,
      status: "Ready",
      href: "/ai-hub/interview-prep"
    },
    {
      title: "Academic Transcript Parser",
      description: "Automatically extract your grades and achievements from uploaded documents to boost your profile.",
      icon: <ClipboardCheck className="w-8 h-8" />,
      status: "Ready",
      href: "/ai-hub/transcript-parser"
    },
    {
      title: "Admission Alpha Matchmaker",
      description: "Analyze your academic profile and extracurriculars to determine school-specific likelihood of acceptance.",
      icon: <BarChart3 className="w-8 h-8" />,
      status: "Ready",
      href: "/ai-hub/acceptance-odds"
    },
    {
      title: "90-Day Study Planner",
      description: "Get a personalized, data-driven study schedule tailored to your exam dates and weak areas.",
      icon: <Clock className="w-8 h-8" />,
      status: "Ready",
      href: "/ai-hub/study-planner"
    }
  ];

  return (
    <div className="space-y-12 pb-24 font-jakarta">
      {/* Premium Hub Header */}
      <div className="bg-white p-12 md:p-16 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-96 w-96 bg-teal-50/50 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none" />
        
        <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-3 px-5 py-2 bg-emerald-50 text-emerald-700 rounded-full w-fit text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100">
                <Zap className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                Neural Network Beta 1.0
            </div>
            
            <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
                    AI Application <span className="text-teal-600">Hub</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-500 max-w-3xl font-bold leading-relaxed">
                    Deploy architectural intelligence designed specifically for international medical and dental students seeking high-trust institutional outcomes.
                </p>
            </div>

            <div className="flex flex-wrap gap-10 pt-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-teal-600">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security State</p>
                        <p className="text-xs font-bold text-slate-900 leading-none mt-0.5">GDPR Protocol Verified</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-teal-600">
                        <Target className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Precision Rate</p>
                        <p className="text-xs font-bold text-slate-900 leading-none mt-0.5">99.8% Academic Alignment</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Intelligence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group bg-white p-12 rounded-[3rem] border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 relative flex flex-col justify-between min-h-[380px]"
          >
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                    <div className="h-20 w-20 rounded-[1.75rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 transition-all group-hover:bg-slate-900 group-hover:text-white group-hover:scale-110 group-hover:rotate-3">
                        {tool.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] bg-teal-50 text-teal-600 px-5 py-2 rounded-full border border-teal-100 shadow-sm">
                        {tool.status}
                    </span>
                </div>

                <div className="space-y-4 mb-12">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight group-hover:text-teal-600 transition-colors uppercase leading-none">{tool.title}</h3>
                    <p className="text-[15px] font-bold text-slate-500 leading-relaxed max-w-[85%]">
                        {tool.description}
                    </p>
                </div>
            </div>

            <Link href={tool.href} className="relative z-10">
              <button disabled={tool.status === "Coming Soon"} className={cn(
                "w-full h-16 rounded-[1.25rem] border border-slate-200 text-slate-900 font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4",
                tool.status === "Coming Soon" ? "opacity-30 cursor-not-allowed" : "hover:bg-slate-900 hover:text-white hover:border-slate-900 hover:shadow-2xl hover:shadow-slate-900/20 active:scale-95"
              )}>
                {tool.status === "Coming Soon" ? "Notify Network" : "Initialize Terminal"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Trust Footer */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 pt-12">
        <div className="flex items-center gap-4 text-slate-400 group cursor-default">
            <Cpu className="w-5 h-5 group-hover:text-teal-600 transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Quantum Intelligence Layer</span>
        </div>
        <div className="h-px w-24 bg-slate-100 hidden md:block" />
        <div className="flex items-center gap-4 text-slate-400 group cursor-default">
            <Fingerprint className="w-5 h-5 group-hover:text-teal-600 transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Biometric-Verified Access</span>
        </div>
      </div>
    </div>
  );
}
