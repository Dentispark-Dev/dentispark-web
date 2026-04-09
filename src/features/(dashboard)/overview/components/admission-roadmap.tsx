"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Zap,
  Target,
  FileText,
  MessageSquare,
  Trophy,
  Calendar
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import Link from "next/link";

interface Phase {
  id: number;
  title: string;
  months: string;
  tasks: string[];
  tip: string;
  icon: React.ReactNode;
  color: string;
  aiTools: { name: string; href: string }[];
  mentors: { service: string; href: string };
  startMonth: number; // 0-indexed (Jan = 0)
  endMonth: number;
}

const PHASES: Phase[] = [
  {
    id: 1,
    title: "Spark & Research",
    months: "Jan - Mar",
    startMonth: 0,
    endMonth: 2,
    tasks: ["Research schools", "Attend open days", "Start UCAT prep"],
    tip: "Start early to avoid the rush.",
    icon: <Target className="w-5 h-5" />,
    color: "emerald",
    aiTools: [{ name: "Admission Alpha", href: "/ai-hub/acceptance-odds" }, { name: "Study Planner", href: "/ai-hub/study-planner" }],
    mentors: { service: "Uni Selection", href: "/mentorship/discovery" }
  },
  {
    id: 2,
    title: "The Foundation",
    months: "Apr - May",
    startMonth: 3,
    endMonth: 4,
    tasks: ["Register UCAT", "Draft Personal Statement", "Secure references"],
    tip: "UCAT slots fill up quickly—book early!",
    icon: <FileText className="w-5 h-5" />,
    color: "blue",
    aiTools: [{ name: "PS Reviewer", href: "/ai-hub/personal-statement" }],
    mentors: { service: "PS Strategy", href: "/mentorship/personal-statement" }
  },
  {
    id: 3,
    title: "The Execution",
    months: "Jun - Jul",
    startMonth: 5,
    endMonth: 6,
    tasks: ["Sit UCAT", "Review PS Draft", "Check final requirements"],
    tip: "Email schools directly if you're unsure.",
    icon: <Zap className="w-5 h-5" />,
    color: "amber",
    aiTools: [{ name: "UCAS Compat", href: "/ai-hub/transcript-parser" }],
    mentors: { service: "PS Refining", href: "/mentorship/personal-statement" }
  },
  {
    id: 4,
    title: "The Submission",
    months: "Aug - Oct",
    startMonth: 7,
    endMonth: 9,
    tasks: ["Finalise UCAS", "Submit by Oct 15th", "Monitor emails"],
    tip: "Don't leave it late! Aim for early submission.",
    icon: <ArrowRight className="w-5 h-5" />,
    color: "rose",
    aiTools: [{ name: "Final Check", href: "/ai-hub/personal-statement" }],
    mentors: { service: "UCAS Review", href: "/mentorship/discovery" }
  },
  {
    id: 5,
    title: "The Challenge",
    months: "Nov - Jan",
    startMonth: 10,
    endMonth: 0, // Jan next year
    tasks: ["Prepare Interviews", "Attend stations", "Wait for offers"],
    tip: "Watch your inbox and practice daily.",
    icon: <MessageSquare className="w-5 h-5" />,
    color: "purple",
    aiTools: [{ name: "Interview Bot", href: "/ai-hub/interview-prep" }],
    mentors: { service: "Mock MMIs", href: "/mentorship/interviews" }
  },
  {
    id: 6,
    title: "The Reward",
    months: "Feb - Sept",
    startMonth: 1,
    endMonth: 8,
    tasks: ["Confirm offers", "Meet grade conditions", "Start Dental School"],
    tip: "Revisit your top choices before confirming.",
    icon: <Trophy className="w-5 h-5" />,
    color: "indigo",
    aiTools: [{ name: "Pathway Tracker", href: "/guidance-hub" }],
    mentors: { service: "Pre-Uni Prep", href: "/mentorship/premium" }
  }
];

export function AdmissionRoadmap() {
  const currentMonth = new Date().getMonth();
  
  const currentPhaseIndex = useMemo(() => {
    // Basic logic to find which phase we are in
    // Note: This is simplified and could be more robust
    const index = PHASES.findIndex(p => {
        if (p.startMonth <= p.endMonth) {
            return currentMonth >= p.startMonth && currentMonth <= p.endMonth;
        } else {
            // Handles wrap-around (e.g., Nov-Jan)
            return currentMonth >= p.startMonth || currentMonth <= p.endMonth;
        }
    });
    return index === -1 ? 0 : index;
  }, [currentMonth]);

  const currentPhase = PHASES[currentPhaseIndex];

  return (
    <div className="space-y-8">
      {/* Visual Progress Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {PHASES.map((phase, idx) => {
          const isCompleted = idx < currentPhaseIndex;
          const isCurrent = idx === currentPhaseIndex;
          
          return (
            <div key={phase.id} className="relative group">
                <div 
                    className={cn(
                        "h-2 rounded-full transition-all duration-500 mb-2",
                        isCompleted ? "bg-emerald-500" : 
                        isCurrent ? "bg-slate-900 w-full" : "bg-slate-100"
                    )}
                />
                <div className="flex flex-col">
                    <span className={cn(
                        "text-[9px] font-extrabold uppercase tracking-widest truncate",
                        isCurrent ? "text-slate-900" : "text-slate-400"
                    )}>
                        Phase {phase.id}
                    </span>
                    <span className={cn(
                        "text-[9px] font-bold text-slate-400 truncate",
                        isCurrent && "text-slate-600"
                    )}>
                        {phase.months}
                    </span>
                </div>
            </div>
          );
        })}
      </div>

      {/* Main Phase Card */}
      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 md:p-12 relative overflow-hidden"
      >
        {/* Background Decorative Element */}
        <div className={`absolute top-0 right-0 w-64 h-64 bg-${currentPhase.color}-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none`} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Current Phase Info */}
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-110",
                        `bg-${currentPhase.color}-500 text-white`
                    )}>
                        {currentPhase.icon}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                             <span className={cn("text-xs font-extrabold uppercase tracking-widest", `text-${currentPhase.color}-600`)}>Current Phase</span>
                             <div className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{currentPhase.title}</h2>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">What to Do Now</h3>
                    <div className="space-y-3">
                        {currentPhase.tasks.map((task, i) => (
                            <div key={i} className="flex items-center gap-3 group/task">
                                <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                </div>
                                <span className="text-sm font-bold text-slate-600 group-hover/task:text-slate-900 transition-colors">{task}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                        <Sparkles className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Key Tip</p>
                        <p className="text-sm font-bold text-slate-700 leading-tight">"{currentPhase.tip}"</p>
                    </div>
                </div>
            </div>

            {/* Right: Quick Recommendations */}
            <div className="space-y-6 lg:border-l lg:border-slate-100 lg:pl-12">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                         <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Recommended AI Tools</h3>
                         <Link href="/ai-hub" className="text-[10px] font-extrabold text-emerald-600 uppercase hover:underline">View All</Link>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        {currentPhase.aiTools.map((tool, i) => (
                            <Link key={i} href={tool.href}>
                                <div className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                            <Zap className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <span className="text-sm font-extrabold text-slate-900">{tool.name}</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="pt-4">
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">Mentor Support</h3>
                    <Link href={currentPhase.mentors.href}>
                        <div className="p-6 rounded-3xl bg-slate-900 text-white hover:bg-slate-800 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                                <MessageSquare className="w-12 h-12" />
                            </div>
                            <div className="relative z-10 flex flex-col gap-1">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">Featured Service</span>
                                <span className="text-lg font-extrabold">{currentPhase.mentors.service} Coaching</span>
                                <p className="text-xs text-slate-400 font-bold mt-2 flex items-center gap-2">
                                    Book a session <ArrowRight className="w-3 h-3" />
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
