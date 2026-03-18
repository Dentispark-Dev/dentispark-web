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
  Target
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AIHubPage() {
  const tools = [
    {
      title: "AI Personal Statement Reviewer",
      description: "Upload your personal statement for an instant AI-powered analysis of tone, impact, and UCAS compatibility.",
      icon: <FileText className="w-8 h-8 text-primary-600" />,
      status: "Ready",
      color: "bg-primary-50",
      href: "/ai-hub/personal-statement"
    },
    {
      title: "Smart Mentor Matching",
      description: "Our algorithm matches you with the perfect mentor based on your target universities and academic specialty.",
      icon: <Sparkles className="w-8 h-8 text-blue-600" />,
      status: "Ready",
      color: "bg-blue-50",
      href: "/ai-hub/mentor-matching"
    },
    {
      title: "Interview Prep Bot",
      description: "Practice MMI and panel interviews with our voice-responsive AI dental mentor.",
      icon: <BrainCircuit className="w-8 h-8 text-purple-600" />,
      status: "Ready",
      color: "bg-purple-50",
      href: "/ai-hub/interview-prep"
    },
    {
      title: "Academic Transcript Parser",
      description: "Automatically extract your grades and achievements from uploaded documents to boost your profile.",
      icon: <ClipboardCheck className="w-8 h-8 text-indigo-600" />,
      status: "Ready",
      color: "bg-indigo-50",
      href: "/ai-hub/transcript-parser"
    },
    {
      title: "Admission Alpha Matchmaker",
      description: "Analyze your academic profile and extracurriculars to determine your statistical school-specific likelihood of acceptance.",
      icon: <BarChart3 className="w-8 h-8 text-emerald-600" />,
      status: "Ready",
      color: "bg-emerald-50",
      href: "/ai-hub/acceptance-odds"
    },
    {
      title: "90-Day Study Planner",
      description: "Get a personalized, data-driven study schedule tailored to your exam dates and weak areas.",
      icon: <Clock className="w-8 h-8 text-orange-600" />,
      status: "Ready",
      color: "bg-orange-50",
      href: "/ai-hub/study-planner"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full w-fit text-xs font-bold border border-emerald-100">
          <Zap className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
          AI Beta
        </div>
        <h1 className="text-4xl lg:text-5xl font-sora font-bold tracking-tight text-gray-900">
          AI Application Hub
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl font-medium">
          Supercharge your application journey with advanced AI tools designed specifically for international medical and dental students.
        </p>
      </div>

      {/* Admissions War-Room (Phase 10 Highlight) */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2.5rem] p-10 relative overflow-hidden flex flex-col md:flex-row items-center gap-10 bg-white shadow-xl border border-gray-100"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 blur-[100px] rounded-full -mr-20 -mt-20" />
        
        <div className="flex-1 space-y-6 relative z-10">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full w-fit text-[10px] font-bold uppercase tracking-wider">
                <Zap className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                New: Command Center
            </div>
            <div className="space-y-2">
                <h2 className="text-4xl font-sora font-bold tracking-tight text-gray-900">The Admissions War-Room</h2>
                <p className="text-gray-600 font-medium leading-relaxed max-w-lg">
                    Consolidate your entire application intelligence. View your tactical radar, readiness score, and real-time school-specific probability briefings in one high-impact command center.
                </p>
            </div>
            <Link href="/ai-hub/war-room">
                <button className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl font-sora font-bold hover:bg-emerald-700 transition-all shadow-sm text-lg group">
                    Enter War-Room <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </Link>
        </div>
        <div className="w-full md:w-1/3 flex justify-center py-4 relative z-10">
            <div className="relative">
                <div className="absolute inset-0 bg-emerald-100/50 blur-3xl rounded-full scale-110" />
                <div className="w-40 h-40 rounded-3xl bg-emerald-50 flex items-center justify-center border-2 border-white shadow-sm">
                    <Target className="w-20 h-20 text-emerald-600" />
                </div>
                <div className="absolute -top-4 -right-4 bg-emerald-600 text-white px-4 py-2 rounded-xl font-sora font-bold text-sm shadow-md border-2 border-white">82% Ready</div>
            </div>
        </div>
      </motion.div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white p-8 rounded-3xl hover:shadow-md transition-all border border-gray-100 hover:border-emerald-100"
          >
            <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              {tool.icon}
            </div>
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-sora font-semibold text-gray-900">{tool.title}</h3>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                tool.status === "Ready" ? "bg-emerald-50 text-emerald-700" : 
                tool.status === "Beta" ? "bg-blue-50 text-blue-700" : "bg-gray-50 text-gray-400"
              }`}>
                {tool.status}
              </span>
            </div>
            <p className="text-gray-500 mb-8 leading-relaxed font-medium text-sm">
              {tool.description}
            </p>
            <Link href={tool.href}>
              <button disabled={tool.status === "Coming Soon"} className={`w-full py-3 rounded-xl border font-sora font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                tool.status === "Coming Soon" ? "border-gray-100 text-gray-300 cursor-not-allowed" : "border-gray-200 text-gray-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
              }`}>
                {tool.status === "Coming Soon" ? "Notify Me" : "Open Tool"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Security Info */}
      <div className="flex items-center justify-center gap-12 py-12 opacity-60">
        <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            GDPR Compliant
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-widest">
            <Search className="w-4 h-4 text-emerald-500" />
            Vetted Content
        </div>
      </div>
    </div>
  );
}
