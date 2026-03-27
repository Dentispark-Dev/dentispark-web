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
  Compass
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
  const [selectedMissionId, setSelectedMissionId] = useState(1);
  const selectedMission = MISSIONS.find(m => m.id === selectedMissionId) || MISSIONS[0];

  const currentMonth = new Date().getMonth();
  const activeMissionId = useMemo(() => {
    if (currentMonth >= 0 && currentMonth <= 2) return 1;
    if (currentMonth >= 3 && currentMonth <= 4) return 2;
    if (currentMonth >= 5 && currentMonth <= 6) return 5;
    if (currentMonth >= 7 && currentMonth <= 8) return 6;
    if (currentMonth >= 9 && currentMonth <= 10) return 9;
    return 11;
  }, [currentMonth]);

  return (
    <section className="relative overflow-hidden rounded-[3.5rem] bg-slate-900 p-1 lg:p-2 border border-slate-800 shadow-2xl">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 blur-[100px] -z-10 rounded-full" />

      <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] p-8 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Mission Intelligence (Spotlight) */}
          <div className="lg:col-span-8 flex flex-col h-full space-y-12">
            <div className="flex flex-col space-y-4">
               <div className="flex items-center gap-3">
                  <span className="w-10 h-1 bg-emerald-500 rounded-full" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">Elite Admission Command</span>
               </div>
               <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                 The <span className="text-emerald-500">Path</span> to UK Dentistry
               </h2>
               <p className="text-slate-400 font-bold max-w-xl text-lg">
                 Your intelligent roadmap for the 2026/27 cycle, integrated with every DentiSpark tool.
               </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col rounded-[3rem] bg-white/5 border border-white/10 p-10 lg:p-14 overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    {React.cloneElement(selectedMission.icon as React.ReactElement, { className: "w-32 h-32" })}
                </div>

                <div className="relative z-10 flex flex-col h-full space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                      MISSION STAGE {selectedMission.id}: {selectedMission.category}
                    </div>
                    {selectedMission.id === activeMissionId && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-500/20">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        Current Priority
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-4xl lg:text-5xl font-black text-white">{selectedMission.title}</h3>
                    <p className="text-slate-300 text-xl font-medium leading-relaxed max-w-2xl">{selectedMission.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Actionable Intelligence</h4>
                      <div className="space-y-4">
                        {selectedMission.subtasks.map((task, i) => (
                           <div key={i} className="flex items-center gap-4 group/item">
                              <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover/item:border-emerald-500 transition-colors">
                                 <CheckCircle2 className="w-3 h-3 text-slate-500 group-hover/item:text-emerald-500 transition-colors" />
                              </div>
                              <span className="text-slate-200 font-bold">{task}</span>
                           </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 space-y-4">
                        <div className="flex items-center gap-3">
                           <ShieldCheck className="w-5 h-5 text-emerald-400" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Expert Tip</span>
                        </div>
                        <p className="text-slate-300 font-medium italic leading-relaxed">"{selectedMission.tip}"</p>
                    </div>
                  </div>

                  <div className="pt-8 flex flex-col sm:flex-row gap-4">
                    <Button 
                      asChild 
                      className="h-16 px-10 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 hover:scale-[1.02]"
                    >
                      <Link href={selectedMission.actionHref} target={selectedMission.actionHref.startsWith('http') ? '_blank' : '_self'}>
                        {selectedMission.actionLabel}
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Link>
                    </Button>
                    <Button 
                      variant="outline"
                      className="h-16 px-10 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 font-black text-sm uppercase tracking-widest transition-all"
                    >
                      Cycle Overview
                    </Button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: The Gutter Timeline */}
          <div className="lg:col-span-4 flex flex-col space-y-8">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">The Mission Queue</h4>
            
            <div className="flex flex-col gap-3 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              {MISSIONS.map((mission) => {
                const isActive = mission.id === activeMissionId;
                const isSelected = mission.id === selectedMissionId;
                const isCompleted = mission.id < activeMissionId;

                return (
                  <button
                    key={mission.id}
                    onClick={() => setSelectedMissionId(mission.id)}
                    className={cn(
                      "group relative flex items-center gap-5 p-6 rounded-[2rem] border transition-all duration-300 text-left",
                      isSelected 
                        ? "bg-white/10 border-white/20 shadow-xl" 
                        : "bg-transparent border-white/5 hover:border-white/10"
                    )}
                  >
                    <div className={cn(
                        "w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center transition-all duration-500",
                        isCompleted ? "bg-emerald-500 text-white" : 
                        isActive ? "bg-white text-slate-900 scale-110 shadow-lg" : 
                        "bg-white/5 text-slate-500 border border-white/5"
                    )}>
                      {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : mission.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn(
                            "text-[8px] font-black uppercase tracking-widest",
                            isActive ? "text-emerald-400" : "text-slate-500"
                        )}>
                          STEP {mission.id}
                        </span>
                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">
                          {mission.timeframe}
                        </span>
                      </div>
                      <h5 className={cn(
                        "text-sm font-black truncate",
                        isSelected ? "text-white" : "text-slate-400 group-hover:text-slate-300"
                      )}>
                        {mission.title}
                      </h5>
                    </div>

                    {isSelected && (
                        <motion.div 
                          layoutId="activeGlow"
                          className="absolute inset-0 rounded-[2rem] border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)] pointer-events-none" 
                        />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
