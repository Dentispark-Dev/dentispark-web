"use client";

import React from "react";
import { 
  BrainCircuit, 
  FileText, 
  Sparkles, 
  ClipboardCheck,
  BarChart3,
  Clock,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AIToolsGrid() {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-sora font-bold text-gray-900">AI Application Hub</h2>
            <p className="text-gray-500 mt-1">Supercharge your application journey with intelligent tools.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white p-6 rounded-3xl hover:shadow-md transition-all border border-gray-100 hover:border-emerald-100"
          >
            <div className={`w-12 h-12 ${tool.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
              {tool.icon}
            </div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-sora font-semibold text-gray-900 pr-4">{tool.title}</h3>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md whitespace-nowrap ${
                tool.status === "Ready" ? "bg-emerald-50 text-emerald-700" : 
                tool.status === "Beta" ? "bg-blue-50 text-blue-700" : "bg-gray-50 text-gray-400"
              }`}>
                {tool.status}
              </span>
            </div>
            <p className="text-gray-500 mb-6 leading-relaxed font-medium text-sm line-clamp-2">
              {tool.description}
            </p>
            <Link href={tool.href}>
              <button disabled={tool.status === "Coming Soon"} className={`w-full py-2.5 rounded-xl border font-sora font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                tool.status === "Coming Soon" ? "border-gray-100 text-gray-300 cursor-not-allowed" : "border-gray-200 text-gray-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
              }`}>
                {tool.status === "Coming Soon" ? "Notify Me" : "Open Tool"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
