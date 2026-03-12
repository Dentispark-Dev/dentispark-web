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
  ShieldCheck
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

      {/* Hero Glass Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 border-primary-100/50"
      >
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-bold text-black-700">Need a Personal Statement Review?</h2>
          <p className="text-black-500">
            Our specialized LLM has been trained on thousands of successful UK dental and medical school applications. Get detailed feedback in seconds.
          </p>
          <Link href="/ai-hub/personal-statement">
            <button className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200">
              Start AI Review <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
        <div className="w-full md:w-1/3 flex justify-center">
            <div className="relative">
                <BrainCircuit className="w-32 h-32 text-primary-200 animate-pulse" />
                <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-primary-500 animate-bounce" />
            </div>
        </div>
        {/* Background blobs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl -z-10" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl -z-10" />
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
