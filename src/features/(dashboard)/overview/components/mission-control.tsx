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
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Lock,
  Globe,
  Star
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
  color: "emerald" | "blue" | "amber" | "indigo" | "orange" | "rose" | "teal" | "red" | "purple" | "cyan";
  actionLabel: string;
  actionHref: string;
  category: "Research" | "Preparation" | "Exams" | "Application" | "Interviews" | "Enrolment";
  subtasks: string[];
}

const MISSIONS: Mission[] = [
  {
    id: 1,
    title: "Research Schools & Open Days",
    timeframe: "Jan - Mar",
    category: "Research",
    description: "Identify your top 5 dental schools and plan your open day visits.",
    tip: "Universities value students who understand their specific clinical teaching styles (e.g., PBL vs Traditional).",
    icon: <Search className="w-5 h-5" />,
    color: "emerald",
    actionLabel: "Explore University Hub",
    actionHref: "/university-hub",
    subtasks: ["Shortlist top 5 schools", "Book at least 2 open days", "Review entry requirements"]
  },
  {
    id: 2,
    title: "UCAT/DAT Registration",
    timeframe: "Apr - May",
    category: "Preparation",
    description: "Secure your test date. High-demand centers fill up almost instantly.",
    tip: "Testing slots are first-come, first-served. Set a reminder for the day booking opens!",
    icon: <Calendar className="w-5 h-5" />,
    color: "blue",
    actionLabel: "UCAT Booking Guide",
    actionHref: "/guidance-hub",
    subtasks: ["Create Pearson VUE account", "Check nearest test center", "Set booking reminder"]
  },
  {
    id: 3,
    title: "Draft Personal Statement",
    timeframe: "Apr - May",
    category: "Preparation",
    description: "Start your narrative. Focus on clinical observation and 'Why Dentistry'.",
    tip: "Use our AI Reviewer to scan for 'Buzzwords' that medical schools specifically look for.",
    icon: <FileText className="w-5 h-5" />,
    color: "amber",
    actionLabel: "Open AI PS Reviewer",
    actionHref: "/ai-hub/personal-statement",
    subtasks: ["Brainstorm work experience", "Write first 500 words", "Run AI tone analysis"]
  },
  {
    id: 4,
    title: "Secure References",
    timeframe: "Apr - May",
    category: "Preparation",
    description: "Request academic references from tutors who know your science aptitude.",
    tip: "Provide your referees with a 'Cheat Sheet' of your extracurriculars to help them write a better note.",
    icon: <ShieldCheck className="w-5 h-5" />,
    color: "indigo",
    actionLabel: "Reference Strategy",
    actionHref: "/guidance-hub",
    subtasks: ["Identify 2 referees", "Prepare achievement summary", "Send formal requests"]
  },
  {
    id: 5,
    title: "Sit Entrance Exams",
    timeframe: "Jun - Jul",
    category: "Exams",
    description: "The peak of the cycle. Focus on your UCAT/BMAT performance.",
    tip: "If your score isn't what you expected, don't panic. Some schools value the PS more than the score.",
    icon: <Zap className="w-5 h-5" />,
    color: "orange",
    actionLabel: "Intense Study Plan",
    actionHref: "/ai-hub/study-planner",
    subtasks: ["Complete 5 mock tests", "Review weak areas daily", "Finalize UCAT strategy"]
  },
  {
    id: 6,
    title: "Finalise UCAS Choices",
    timeframe: "Aug",
    category: "Application",
    description: "Review your requirements and finalize your 4 + 1 dentistry choices.",
    tip: "Strategize! Apply to schools where your UCAT score fits their specific decile requirements.",
    icon: <AlertCircle className="w-5 h-5" />,
    color: "rose",
    actionLabel: "Strategize Application",
    actionHref: "/ai-hub/acceptance-odds",
    subtasks: ["Compare 5th (Insurance) choice", "Final PS polish", "Verify exam results upload"]
  },
  {
    id: 7,
    title: "Submit UCAS Application",
    timeframe: "Sept",
    category: "Application",
    description: "The absolute submission window. Aim for early September.",
    tip: "Submission traffic spikes on deadline day. Submit early to avoid technical delays.",
    icon: <Send className="w-5 h-5" />,
    color: "teal",
    actionLabel: "UCAS Track Login",
    actionHref: "https://www.ucas.com/",
    subtasks: ["Pay application fee", "Verify reference upload", "Hit Submit!"]
  },
  {
    id: 8,
    title: "The UCAS Deadline",
    timeframe: "Oct 15",
    category: "Application",
    description: "The hard cutoff for all Medical and Dental applications in the UK.",
    tip: "Once the clock hits midnight, it's over for this cycle. No exceptions.",
    icon: <Clock className="w-5 h-5" />,
    color: "red",
    actionLabel: "Verify Submission",
    actionHref: "/applications",
    subtasks: ["Check confirmation email", "Check UCAS Hub status"]
  },
  {
    id: 9,
    title: "Interview Season",
    timeframe: "Oct - Nov",
    category: "Interviews",
    description: "Master the MMI stations and ethical panel discussions.",
    tip: "Dental interviews focus heavily on Manual Dexterity and Ethical Reasoning. Practice both.",
    icon: <MessageSquare className="w-5 h-5" />,
    color: "purple",
    actionLabel: "Mock MMI Session",
    actionHref: "/ai-hub/interview-prep",
    subtasks: ["Study GMC/GDC ethics", "Manual dexterity practice", "10 Mock Stations"]
  },
  {
    id: 10,
    title: "Interviews & Offers",
    timeframe: "Jan - Mar (2027)",
    category: "Interviews",
    description: "The reward phase. Managing interviews and receiving offers.",
    tip: "Keep the momentum! Offers are almost always conditional on your final A-Level/IB grades.",
    icon: <Sparkles className="w-5 h-5" />,
    color: "cyan",
    actionLabel: "Offer Matchmaker",
    actionHref: "/mentorship",
    subtasks: ["Attend interview days", "Check offer conditions", "Respond to Firm choice"]
  },
  {
    id: 11,
    title: "Enrollment & Success",
    timeframe: "May - Sept",
    category: "Enrolment",
    description: "A-Level results day and starting your journey as a Dental Student.",
    tip: "Celebrate! You've made it into one of the most competitive fields in the world.",
    icon: <Trophy className="w-5 h-5" />,
    color: "emerald",
    actionLabel: "Welcome to Dentistry",
    actionHref: "/guidance-hub",
    subtasks: ["Verify final grades", "Complete uni enrollment", "Start reading list"]
  }
];

const COLOR_MAP = {
  emerald: "from-emerald-500/20 to-emerald-600/20 text-emerald-600 border-emerald-100",
  blue: "from-blue-500/20 to-blue-600/20 text-blue-600 border-blue-100",
  amber: "from-amber-500/20 to-amber-600/20 text-amber-600 border-amber-100",
  indigo: "from-indigo-500/20 to-indigo-600/20 text-indigo-600 border-indigo-100",
  orange: "from-orange-500/20 to-orange-600/20 text-orange-600 border-orange-100",
  rose: "from-rose-500/20 to-rose-600/20 text-rose-600 border-rose-100",
  teal: "from-teal-500/20 to-teal-600/20 text-teal-600 border-teal-100",
  red: "from-red-500/20 to-red-600/20 text-red-600 border-red-100",
  purple: "from-purple-500/20 to-purple-600/20 text-purple-600 border-purple-100",
  cyan: "from-cyan-500/20 to-cyan-600/20 text-cyan-600 border-cyan-100",
};

const BG_COLOR_MAP = {
  emerald: "bg-emerald-500",
  blue: "bg-blue-500",
  amber: "bg-amber-500",
  indigo: "bg-indigo-500",
  orange: "bg-orange-500",
  rose: "bg-rose-500",
  teal: "bg-teal-500",
  red: "bg-red-500",
  purple: "bg-purple-500",
  cyan: "bg-cyan-500",
};

export function MissionControl() {
  const currentMonth = new Date().getMonth();
  const [selectedMission, setSelectedMission] = useState<Mission>(MISSIONS[0]);

  // Determine "Live" mission based on timeframe (simplified for demo)
  const liveMissionId = useMemo(() => {
    if (currentMonth >= 0 && currentMonth <= 2) return 1;
    if (currentMonth >= 3 && currentMonth <= 4) return 2;
    if (currentMonth >= 5 && currentMonth <= 6) return 5;
    if (currentMonth >= 7 && currentMonth <= 8) return 6;
    if (currentMonth >= 9 && currentMonth <= 10) return 9;
    return 11;
  }, [currentMonth]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <span className="h-px w-8 bg-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Unified Mission Command</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight lg:text-5xl">Your Success Map</h2>
            <p className="text-slate-500 font-bold max-w-xl">Every critical dental school milestone, synced and prioritized for the 2026/27 cycle.</p>
        </div>
        
        <div className="hidden lg:flex items-center gap-8 bg-white/50 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/40 shadow-sm">
            <div className="flex flex-col items-center">
                <span className="text-[20px] font-black text-slate-900">11</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Missions</span>
            </div>
            <div className="h-8 w-px bg-slate-100" />
            <div className="flex flex-col items-center">
                <span className="text-[20px] font-black text-emerald-500">{(liveMissionId / 11 * 100).toFixed(0)}%</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cycle Ready</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
        {/* Left: Interactive Node Path */}
        <div className="xl:col-span-8 overflow-x-auto pb-6 -mx-4 px-4 xl:mx-0 xl:px-0">
          <div className="flex xl:flex-wrap gap-4 min-w-[1000px] xl:min-w-0 relative py-8">
            {/* Connection Line Background */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 -z-10 hidden xl:block" />
            
            {MISSIONS.map((mission, idx) => {
              const isSelected = selectedMission.id === mission.id;
              const isLive = mission.id === liveMissionId;
              const isCompleted = mission.id < liveMissionId;

              return (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedMission(mission)}
                  className={cn(
                    "flex-shrink-0 cursor-pointer relative group",
                    "w-[140px] xl:w-[15.5%]"
                  )}
                >
                  {/* The Node Card */}
                  <div className={cn(
                    "relative z-10 p-5 rounded-[2rem] border transition-all duration-500 flex flex-col items-center gap-3",
                    isSelected ? "bg-white shadow-2xl shadow-slate-200 border-emerald-500 scale-105 z-20" : 
                    isLive ? "bg-emerald-50/50 border-emerald-200" :
                    "bg-white/40 backdrop-blur-sm border-slate-100 hover:border-slate-300"
                  )}>
                    {/* Live Indicator */}
                    {isLive && (
                        <div className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
                        </div>
                    )}

                    <div className={cn(
                        "w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                        isCompleted ? "bg-emerald-600 text-white" : 
                        isSelected ? `bg-${mission.color}-500 text-white` : "bg-slate-100 text-slate-400"
                    )}>
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : mission.icon}
                    </div>

                    <div className="text-center">
                        <p className={cn(
                            "text-[8px] font-black uppercase tracking-widest mb-1 truncate w-full",
                            isSelected ? "text-emerald-600" : "text-slate-400"
                        )}>STEP {mission.id}</p>
                        <p className={cn(
                            "text-[10px] font-black leading-tight line-clamp-2",
                            isSelected ? "text-slate-900" : "text-slate-500"
                        )}>{mission.title}</p>
                    </div>
                  </div>

                  {/* Date Label */}
                  <div className="mt-4 text-center">
                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{mission.timeframe}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right: Mission Intelligence Panel (Focus Mode) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedMission.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="xl:col-span-4 bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-8 xl:p-10 relative overflow-hidden h-full flex flex-col"
          >
            {/* Background Aesthetic */}
            <div className={cn(
                "absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] -z-10 opacity-20",
                BG_COLOR_MAP[selectedMission.color]
            )} />

            <div className="flex-1 space-y-8">
                <div className="flex items-center justify-between">
                    <div className={cn(
                        "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm",
                        COLOR_MAP[selectedMission.color]
                    )}>
                        Mission Focus: {selectedMission.category}
                    </div>
                    {selectedMission.id === liveMissionId && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                            Active Stage
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <h3 className="text-3xl font-black text-slate-900 leading-[1.1]">{selectedMission.title}</h3>
                    <p className="text-slate-500 font-bold leading-relaxed">{selectedMission.description}</p>
                </div>

                <div className="space-y-5">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Strategic Sub-tasks</h4>
                    <div className="space-y-3">
                        {selectedMission.subtasks.map((task, i) => (
                            <div key={i} className="flex items-start gap-3 group/subtask">
                                <div className="mt-0.5 w-5 h-5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-center shrink-0 group-hover/subtask:bg-emerald-500 group-hover/subtask:border-emerald-500 transition-colors">
                                    <ChevronRight className="w-3 h-3 text-slate-300 group-hover/subtask:text-white transition-colors" />
                                </div>
                                <span className="text-sm font-black text-slate-700">{task}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform">
                        <Sparkles className="w-16 h-16" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                             <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center">
                                <Globe className="w-3 h-3 text-white" />
                             </div>
                             <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 font-sora">Mentor Guidance</span>
                        </div>
                        <p className="text-sm font-bold leading-relaxed">"{selectedMission.tip}"</p>
                    </div>
                </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100">
                <Button 
                    className={cn(
                        "w-full h-16 rounded-2xl font-black text-sm gap-2 transition-all shadow-xl hover:scale-[1.02]",
                        BG_COLOR_MAP[selectedMission.color],
                        "text-white hover:opacity-90"
                    )}
                    asChild
                >
                    <Link href={selectedMission.actionHref} target={selectedMission.actionHref.startsWith('http') ? '_blank' : '_self'}>
                        {selectedMission.actionLabel}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
