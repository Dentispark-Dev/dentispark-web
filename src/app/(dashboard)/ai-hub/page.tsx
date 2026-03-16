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
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full w-fit text-sm font-medium animate-pulse">
          <Zap className="w-4 h-4 fill-primary-600" />
          AI Beta
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-black-800">
          AI Application Hub
        </h1>
        <p className="text-lg text-black-500 max-w-2xl">
          Supercharge your application journey with advanced AI tools designed specifically for international medical and dental students.
        </p>
      </div>

      {/* Admissions War-Room (Phase 10 Highlight) */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-[2.5rem] p-10 relative overflow-hidden flex flex-col md:flex-row items-center gap-10 bg-black-900 text-white shadow-2xl border-t-4 border-primary-500"
      >
        <div className="flex-1 space-y-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full w-fit text-[10px] font-black uppercase tracking-widest">
                <Zap className="w-3 h-3 fill-primary-600" />
                New: Command Center
            </div>
            <div className="space-y-2">
                <h2 className="text-4xl font-black tracking-tight">The Admissions War-Room</h2>
                <p className="text-white/60 font-medium leading-relaxed">
                    Consolidate your entire application intelligence. View your tactical radar, readiness score, and real-time school-specific probability briefings in one high-impact command center.
                </p>
            </div>
            <Link href="/ai-hub/war-room">
                <button className="flex items-center gap-3 bg-primary-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-primary-700 transition-all shadow-xl shadow-primary-900/40 text-lg group">
                    Enter War-Room <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </Link>
        </div>
        <div className="w-full md:w-1/3 flex justify-center py-4">
            <div className="relative">
                <div className="absolute inset-0 bg-primary-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
                <Target className="w-40 h-40 text-primary-500 relative" />
                <div className="absolute -top-4 -right-4 bg-white text-black-900 px-4 py-2 rounded-2xl font-black text-sm shadow-xl">82% Ready</div>
            </div>
        </div>
      </motion.div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group glass p-6 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all border-transparent hover:border-primary-200"
          >
            <div className={`w-14 h-14 ${tool.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              {tool.icon}
            </div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-black-700">{tool.title}</h3>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                tool.status === "Ready" ? "bg-green-100 text-green-700" : 
                tool.status === "Beta" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-400"
              }`}>
                {tool.status}
              </span>
            </div>
            <p className="text-black-500 mb-6 leading-relaxed">
              {tool.description}
            </p>
            <Link href={tool.href}>
              <button disabled={tool.status === "Coming Soon"} className={`w-full py-2.5 rounded-lg border font-medium transition-all ${
                tool.status === "Coming Soon" ? "border-gray-100 text-gray-300 cursor-not-allowed" : "border-primary-100 text-primary-600 hover:bg-primary-50"
              }`}>
                {tool.status === "Coming Soon" ? "Notify Me" : "Open Tool"}
              </button>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Security Info */}
      <div className="flex items-center justify-center gap-8 py-8 opacity-50">
        <div className="flex items-center gap-2 text-sm text-black-400">
            <ShieldCheck className="w-4 h-4" />
            GDPR Compliant
        </div>
        <div className="flex items-center gap-2 text-sm text-black-400">
            <Search className="w-4 h-4" />
            Vetted Content
        </div>
      </div>
    </div>
  );
}
