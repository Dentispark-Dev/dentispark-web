"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  Zap, 
  AlertCircle, 
  Send, 
  Clock, 
  MessageSquare, 
  Sparkles, 
  Trophy,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Lock,
  Globe,
  Star,
  Target,
  Layout,
  Compass,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";

interface Mission {
  id: number;
  title: string;
  timeframe: string;
  description: string;
  tip: string;
  icon: React.ReactNode;
  color: string;
  actionLabel: string;
  actionHref: string;
  category: "Research" | "Preparation" | "Exams" | "Application" | "Interviews" | "Enrolment";
  subtasks: string[];
}

const MISSIONS: Mission[] = [
  {
    id: 1,
    title: "Research Schools & UCAS Strategy",
    timeframe: "Jan - Mar",
    category: "Research",
    description: "Identify your top 5 dental schools and plan your open day visits across the UK.",
    tip: "UK universities value students who understand the NHS constitution and clinical teaching styles.",
    icon: <Search className="w-5 h-5" />,
    color: "emerald",
    actionLabel: "Explore University Hub",
    actionHref: "/university-hub",
    subtasks: ["Shortlist top 5 UK schools", "Review NHS Constitution", "Check entry requirements"]
  },
  {
    id: 2,
    title: "UCAT Registration Window",
    timeframe: "Apr - May",
    category: "Preparation",
    description: "The UCAT booking window is critical. High-demand UK centers fill up instantly.",
    tip: "Set a reminder for the day UCAT booking opens. Slots are first-come, first-served.",
    icon: <Calendar className="w-5 h-5" />,
    color: "blue",
    actionLabel: "UCAT Booking Guide",
    actionHref: "/guidance-hub",
    subtasks: ["Create Pearson VUE account", "Identify nearest UK center", "Set booking reminder"]
  },
  {
    id: 3,
    title: "Mastering the Personal Statement",
    timeframe: "Apr - May",
    category: "Preparation",
    description: "Start your narrative for the UCAS application. Focus on UK clinical exposure.",
    tip: "Focus on your 'Manual Dexterity' and 'Reflective Practice'—traits highly prized by UK selectors.",
    icon: <FileText className="w-5 h-5" />,
    color: "amber",
    actionLabel: "Analyze with AI Reviewer",
    actionHref: "/ai-hub/personal-statement",
    subtasks: ["Document UK work exp", "Draft 'Why Dentistry' section", "AI-check for NHS values"]
  },
  {
    id: 4,
    title: "Secure Academic References",
    timeframe: "Apr - May",
    category: "Preparation",
    description: "Ensure your UCAS references reflect your aptitude for rigorous science training.",
    tip: "Give your tutors a summary of your extracurriculars to help them write a comprehensive UCAS reference.",
    icon: <ShieldCheck className="w-5 h-5" />,
    color: "indigo",
    actionLabel: "Reference Strategy",
    actionHref: "/guidance-hub",
    subtasks: ["Request UCAS references", "Provide achievement summary", "Verify referee progress"]
  },
  {
    id: 5,
    title: "The UCAT Entrance Exam",
    timeframe: "Jun - Jul",
    category: "Exams",
    description: "This is the most critical hurdle for UK Dental school entry.",
    tip: "Consistency is key. Use our UK-specific mocks to simulate the real testing environment.",
    icon: <Zap className="w-5 h-5" />,
    color: "orange",
    actionLabel: "Intense Study Plan",
    actionHref: "/ai-hub/study-planner",
    subtasks: ["Daily abstract reasoning", "Complete 5 full mocks", "Finalize UCAT strategy"]
  },
  {
    id: 6,
    title: "Finalise UCAS Choices (4+1)",
    timeframe: "Aug",
    category: "Application",
    description: "Review your results and finalize your 4 + 1 dentistry choices for UCAS.",
    tip: "Strategize! Apply to UK schools where your UCAT score fits their specific decile requirements.",
    icon: <AlertCircle className="w-5 h-5" />,
    color: "rose",
    actionLabel: "Check Acceptance Odds",
    actionHref: "/ai-hub/acceptance-odds",
    subtasks: ["Choose 5th insurance choice", "Audit PS for character count", "Verify grade predictions"]
  },
  {
    id: 7,
    title: "Submit UCAS Application",
    timeframe: "Sept",
    category: "Application",
    description: "The primary window for UK Medical and Dental submissions.",
    tip: "UK schools track submission dates. Aim for mid-September to show organization.",
    icon: <Send className="w-5 h-5" />,
    color: "teal",
    actionLabel: "UCAS Track Portal",
    actionHref: "https://www.ucas.com/",
    subtasks: ["Pay UCAS fee (£27.50)", "Final PS proofread", "Submit Application"]
  },
  {
    id: 8,
    title: "THE HARD DEADLINE",
    timeframe: "Oct 15",
    category: "Application",
    description: "The absolute cutoff for all UK Dentistry and Medicine applications.",
    tip: "Missing this deadline means waiting another full year. Submit early.",
    icon: <Clock className="w-5 h-5" />,
    color: "red",
    actionLabel: "Verify Track Status",
    actionHref: "/applications",
    subtasks: ["Confirm UCAS receipt", "Check spam for uni emails"]
  },
  {
    id: 9,
    title: "MMI & Panel Interviews",
    timeframe: "Oct - Nov",
    category: "Interviews",
    description: "Master the Multiple Mini Interview (MMI) stations used across UK dental schools.",
    tip: "UK interviews focus heavily on GDC Standards and Dental Ethics. Study them early.",
    icon: <MessageSquare className="w-5 h-5" />,
    color: "purple",
    actionLabel: "AI Mock Interview",
    actionHref: "/ai-hub/interview-prep",
    subtasks: ["Study GDC Standards", "Practise MMI stations", "Master NHS Ethics"]
  },
  {
    id: 10,
    title: "Offers & Firm Choices",
    timeframe: "Jan - Mar (2027)",
    category: "Interviews",
    description: "Receiving your offers and selecting your Firm and Insurance choices.",
    tip: "Decisions are almost always conditional on your final A-Level/IB results.",
    icon: <Sparkles className="w-5 h-5" />,
    color: "cyan",
    actionLabel: "Manage Offers",
    actionHref: "/mentorship",
    subtasks: ["Compare offers", "Respond on UCAS Hub", "Final grade push"]
  },
  {
    id: 11,
    title: "Enrollment & Success",
    timeframe: "May - Sept",
    category: "Enrolment",
    description: "A-Level Results Day and starting your journey at a UK Dental School.",
    tip: "You've secured an offer in one of the UK's most competitive courses. Congratulations!",
    icon: <Trophy className="w-5 h-5" />,
    color: "emerald",
    actionLabel: "Student Portal",
    actionHref: "/guidance-hub",
    subtasks: ["Confirm results", "Complete uni enrollment", "Start pre-reading"]
  }
];

export function MissionControl() {
  const currentMonth = new Date().getMonth();
  const activeMissionId = useMemo(() => {
    if (currentMonth >= 0 && currentMonth <= 2) return 1;
    if (currentMonth >= 3 && currentMonth <= 4) return 2;
    if (currentMonth >= 5 && currentMonth <= 6) return 5;
    if (currentMonth >= 7 && currentMonth <= 8) return 6;
    if (currentMonth >= 9 && currentMonth <= 10) return 9;
    return 11;
  }, [currentMonth]);

  const [selectedId, setSelectedId] = useState(activeMissionId);
  const activeMission = MISSIONS.find(m => m.id === selectedId) || MISSIONS[0];

  return (
    <div className="space-y-12">
      {/* Horizontal Mission Timeline */}
      <div className="relative">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-100 -translate-y-1/2 -z-10" />
        <div className="flex items-center justify-between overflow-x-auto pb-4 custom-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 scroll-smooth">
          {MISSIONS.map((mission, idx) => {
            const isActive = mission.id === activeMissionId;
            const isSelected = mission.id === selectedId;
            const isCompleted = mission.id < activeMissionId;

            return (
              <motion.button
                key={mission.id}
                onClick={() => setSelectedId(mission.id)}
                className={cn(
                  "flex flex-col items-center gap-3 shrink-0 px-6 py-2 transition-all group",
                  isSelected ? "scale-105" : "hover:scale-105"
                )}
              >
                <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border shadow-sm",
                    isCompleted ? "bg-emerald-600 border-emerald-600 text-white" : 
                    isSelected ? "bg-white border-emerald-500 text-emerald-600" :
                    isActive ? "bg-white border-blue-200 text-blue-500 animate-pulse" :
                    "bg-white border-slate-100 text-slate-400 group-hover:border-slate-300"
                )}>
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : mission.icon}
                </div>
                <div className="text-center">
                    <p className={cn(
                        "text-[9px] font-black uppercase tracking-widest",
                        isSelected ? "text-emerald-600" : "text-slate-400"
                    )}>STAGE {mission.id}</p>
                    <p className={cn(
                        "text-[10px] font-black uppercase tracking-tighter w-24 truncate",
                        isSelected ? "text-slate-900" : "text-slate-400"
                    )}>{mission.category}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Main Integrated Action Center */}
      <AnimatePresence mode="wait">
        <motion.div
           key={activeMission.id}
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -30 }}
           transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
           className="relative overflow-hidden rounded-[3rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 p-10 lg:p-16"
        >
          {/* Subtle Accent Gradients */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-50/50 blur-[100px] -z-10 rounded-full" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-50/30 blur-[80px] -z-10 rounded-full" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-12 flex flex-col space-y-12">
              
              {/* Header Info */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border",
                            activeMission.id === activeMissionId 
                              ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                              : "bg-slate-50 border-slate-100 text-slate-400"
                        )}>
                            {activeMission.id < activeMissionId ? "Mission Completed" : 
                             activeMission.id === activeMissionId ? "Current Milestone" : "Upcoming Mission"}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activeMission.timeframe} Cycle</span>
                    </div>
                    <h2 className="text-4xl lg:text-7xl font-black text-slate-900 tracking-tight leading-none">
                       {activeMission.title}
                    </h2>
                    <p className="text-slate-500 font-bold text-xl max-w-3xl leading-relaxed">
                       {activeMission.description}
                    </p>
                 </div>

                 <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-[2rem] border border-slate-100">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                        <Sparkles className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div className="pr-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Progress</p>
                        <p className="text-2xl font-black text-slate-900 leading-none">{(selectedId / 11 * 100).toFixed(0)}%</p>
                    </div>
                 </div>
              </div>

              {/* Task Matrix */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 <div className="space-y-8">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Critical Tasks</h4>
                    <div className="space-y-5">
                       {activeMission.subtasks.map((task, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + (i * 0.1) }}
                            className="flex items-center gap-5 group cursor-pointer"
                          >
                             <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm group-hover:border-emerald-500 group-hover:bg-emerald-50 transition-all">
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500" />
                             </div>
                             <span className="text-lg font-black text-slate-700">{task}</span>
                          </motion.div>
                       ))}
                    </div>
                 </div>

                 <div className="relative group">
                    <div className="absolute inset-0 bg-emerald-600 rounded-[3rem] -rotate-1 group-hover:rotate-0 transition-transform duration-500 shadow-xl shadow-emerald-600/10" />
                    <div className="relative bg-slate-900 rounded-[3rem] p-10 lg:p-12 text-white h-full flex flex-col justify-between space-y-8">
                       <div className="space-y-4">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
                                <Star className="w-4 h-4 text-white fill-white" />
                             </div>
                             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Expert Admissions Tip</span>
                          </div>
                          <p className="text-xl font-bold leading-relaxed italic">
                             "{activeMission.tip}"
                          </p>
                       </div>

                       <div className="flex items-center gap-3 pt-6 border-t border-white/5 uppercase text-[10px] font-black tracking-widest text-slate-500">
                          <Globe className="w-4 h-4" /> UK Dental Cycle 2026/27
                       </div>
                    </div>
                 </div>
              </div>

              {/* Action Triggers */}
              <div className="pt-10 flex flex-col sm:flex-row items-center gap-6">
                 <Button 
                   asChild 
                   className="h-20 px-12 rounded-[2rem] bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg gap-3 transition-all shadow-2xl shadow-emerald-600/20 hover:scale-[1.02]"
                 >
                    <Link href={activeMission.actionHref} target={activeMission.actionHref.startsWith('http') ? '_blank' : '_self'}>
                       {activeMission.actionLabel}
                       <ArrowUpRight className="w-6 h-6" />
                    </Link>
                 </Button>
                 <Link 
                   href="/mentorship" 
                   className="text-slate-400 hover:text-emerald-600 font-black text-sm uppercase tracking-widest transition-colors flex items-center gap-2"
                 >
                    Book Mentor Session <ChevronRight className="w-4 h-4" />
                 </Link>
              </div>

            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
