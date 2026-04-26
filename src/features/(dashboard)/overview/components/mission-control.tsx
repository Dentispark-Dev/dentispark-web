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
  XCircle, 
  Send, 
  Clock, 
  MessageSquare, 
  Sparkles, 
  Trophy,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  Lock,
  Globe,
  Star,
  Target,
  Layout,
  Compass,
  ArrowUpRight,
  Activity
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { useDashboardStore } from "@/src/store/dashboard-store";

import { MISSIONS_DATA, type Mission as MissionBase } from "../constants";

interface Mission extends MissionBase {
  icon: React.ReactNode;
}

const MISSION_ICONS: Record<number, React.ReactNode> = {
  1: <Search className="w-5 h-5" />,
  2: <Calendar className="w-5 h-5" />,
  3: <FileText className="w-5 h-5" />,
  4: <ShieldCheck className="w-5 h-5" />,
  5: <Zap className="w-5 h-5" />,
  6: <AlertCircle className="w-5 h-5" />,
  7: <Send className="w-5 h-5" />,
  8: <Clock className="w-5 h-5" />,
  9: <MessageSquare className="w-5 h-5" />,
  10: <Sparkles className="w-5 h-5" />,
  11: <Trophy className="w-5 h-5" />,
};

const MISSIONS: Mission[] = MISSIONS_DATA.map(m => ({
  ...m,
  icon: MISSION_ICONS[m.id]
}));

export function MissionControl() {
  const { stages, toggleStage } = useDashboardStore();
  const currentMonth = new Date().getMonth();
  
  const activeMissionId = useMemo(() => {
    // Priority: The first "Not Completed" stage is the focus
    if (!stages || stages.length === 0) return 1;
    const firstIncomplete = stages.find(s => !s.isCompleted);
    if (firstIncomplete) return firstIncomplete.id;
    return 1;
  }, [stages]);

  const [expandedId, setExpandedId] = useState<number>(activeMissionId);

  const toggleAccordion = (id: number) => {
    setExpandedId(expandedId === id ? 0 : id);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-4 mb-4">
        <h2 className="h2 tracking-tighter">
          Applicant <span className="text-emerald-600">Roadmap</span>
        </h2>
        <p className="text-slate-500 font-medium max-w-2xl text-lg">
          Your step-by-step intelligence checklist for the UK 2026/27 cycle. Expand a stage to view critical tasks and access DentiSpark tools.
        </p>
      </div>

      {/* Clinical Readiness Progress Bar & Placement Unlock */}
      <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Trophy className="w-48 h-48 text-emerald-900" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="caption-caps mb-3">
              <Activity className="w-3.5 h-3.5" />
              Outcome-Oriented Protocol
            </div>
            <h3 className="h3">Your Clinical Readiness</h3>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-4xl font-jakarta font-extrabold text-emerald-600 leading-none">
              {stages && stages.length > 0 
                ? Math.round((stages.filter(s => s.isCompleted).length / MISSIONS.length) * 100) 
                : 0}%
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Ready for Clinic</span>
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden w-full relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${stages && stages.length > 0 ? (stages.filter(s => s.isCompleted).length / MISSIONS.length) * 100 : 0}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-emerald-500 rounded-full" 
            />
          </div>
          
          <div className="flex justify-between items-center text-xs font-bold text-slate-500">
            <span>Foundation</span>
            <div className="flex items-center gap-1.5 text-amber-500">
              <Lock className="w-3.5 h-3.5" />
              <span>Placement Unlocks at 80%</span>
            </div>
            <span>Clinical Milestone</span>
          </div>
        </div>
      </div>

      {/* Accordion Timeline */}
      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        {MISSIONS.map((mission, index) => {
          const storeStage = stages.find(s => s.id === mission.id);
          const isCompleted = storeStage?.isCompleted || false;
          const isExpanded = expandedId === mission.id;
          const isActive = mission.id === activeMissionId;
          const isLast = index === MISSIONS.length - 1;

          return (
            <div 
              key={mission.id} 
              className={cn(
                "group border-b border-slate-100 last:border-b-0 transition-all duration-500 relative",
                isExpanded ? "bg-slate-50/80" : "hover:bg-slate-50/40"
              )}
            >
              {/* Dynamic Theme Color Left Border (Hover Only) */}
              <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top",
                mission.color === "emerald" && "bg-emerald-500",
                mission.color === "blue" && "bg-blue-500",
                mission.color === "amber" && "bg-amber-500",
                mission.color === "indigo" && "bg-indigo-500",
                mission.color === "orange" && "bg-orange-500",
                mission.color === "rose" && "bg-rose-500",
                mission.color === "teal" && "bg-teal-500",
                mission.color === "red" && "bg-red-500",
                mission.color === "purple" && "bg-purple-500",
                mission.color === "cyan" && "bg-cyan-500",
              )} />
              <button 
                onClick={() => toggleAccordion(mission.id)}
                className="w-full flex items-center justify-between p-6 lg:px-10 lg:py-8 text-left focus:outline-none"
              >
                <div className="flex items-center gap-6">
                  {/* Status Indicator */}
                  <div className="relative">
                    <motion.div 
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        animate={isCompleted ? { 
                            boxShadow: ["0px 0px 0px rgba(16, 185, 129, 0)", "0px 0px 25px rgba(16, 185, 129, 0.6)", "0px 0px 0px rgba(16, 185, 129, 0)"] 
                        } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className={cn(
                        "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 z-10 relative border-4 border-transparent shadow-sm",
                        isCompleted ? "bg-emerald-500 text-white border-white" : 
                        isActive ? "bg-emerald-600 text-white shadow-xl shadow-emerald-500/30" : 
                        "bg-white text-slate-300 border-slate-100 group-hover:border-slate-50 group-hover:shadow-md"
                    )}>
                      {isCompleted ? <CheckCircle2 className="w-7 h-7" /> : mission.icon}
                    </motion.div>
                    {/* Vertical Line Connector (unless last item) */}
                    {!isLast && (
                      <div className={cn(
                        "absolute top-12 left-1/2 -ml-px w-0.5 h-full",
                        isCompleted ? "bg-emerald-200" : "bg-slate-100"
                      )} style={{ height: 'calc(100% + 40px)' }} />
                    )}
                  </div>

                  {/* Title & Phase */}
                  <div className="relative">
                     <div className="flex items-center gap-3 mb-1">
                        <span className={cn(
                           "text-[10px] font-extrabold uppercase tracking-widest",
                           isActive ? "text-emerald-600" : "text-slate-400"
                        )}>
                           Stage {mission.id} • {mission.category}
                        </span>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase tracking-widest">
                            Current Focus
                          </span>
                        )}
                     </div>
                      <motion.h3 
                        whileHover={{ x: 5 }}
                        className={cn(
                        "text-xl lg:text-2xl font-extrabold transition-colors duration-500",
                        isActive ? "text-slate-900" : isCompleted ? "text-slate-700" : "text-slate-400 group-hover:text-slate-900"
                      )}>
                        {mission.title}
                      </motion.h3>
                      
                      {/* Interactive Hint (Visible on group-hover) */}
                      {!isExpanded && (
                        <div className="absolute top-1/2 -translate-y-1/2 right-12 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500 hidden lg:flex items-center gap-2">
                           <span className={cn(
                             "text-[9px] font-extrabold uppercase tracking-[0.2em]",
                             isActive ? "text-emerald-600" : "text-slate-400"
                           )}>
                              Launch Station
                           </span>
                           <ArrowRight className={cn(
                             "w-4 h-4",
                             isActive ? "text-emerald-500" : "text-slate-300"
                           )} />
                        </div>
                      )}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className="hidden md:block text-xs font-bold text-slate-400 uppercase tracking-widest bg-white border border-slate-100 px-3 py-1.5 rounded-full">
                    {mission.timeframe}
                  </span>
                  <div className={cn(
                    "w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300",
                    isExpanded ? "bg-white border-slate-200 rotate-180" : "bg-transparent border-transparent"
                  )}>
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pl-[5.5rem] pr-6 pb-8 lg:pr-10 lg:pb-10 pt-2">
                       <p className="text-slate-600 font-medium text-lg leading-relaxed mb-8 max-w-3xl">
                         {mission.description}
                       </p>

                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                          {/* Tasks */}
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-4">Required Actions</h4>
                            {mission.subtasks.map((task, i) => (
                              <div key={i} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded border border-slate-200 flex items-center justify-center bg-white shadow-sm shrink-0">
                                  <div className="w-2 h-2 rounded-[2px] bg-slate-200" />
                                </div>
                                <span className="text-slate-700 font-bold">{task}</span>
                              </div>
                            ))}
                          </div>

                          {/* Light Tip Box */}
                          <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                             <div className="flex items-center gap-2 mb-3">
                                <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                                <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest">Expert Advice</span>
                             </div>
                             <p className="text-emerald-800 font-medium leading-relaxed italic">
                               &quot;{mission.tip}&quot;
                             </p>
                          </div>
                       </div>

                       {/* Action & Completion Buttons */}
                       <div className="flex items-center gap-4 flex-wrap">
                          <Button 
                            asChild 
                            className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 px-6 font-bold tracking-wide shadow-md transition-all active:scale-95"
                          >
                            <Link href={mission.actionHref} target={mission.actionHref.startsWith('http') ? '_blank' : '_self'}>
                              {mission.actionLabel}
                              <ArrowUpRight className="ml-2 w-4 h-4" />
                            </Link>
                          </Button>

                          {isCompleted ? (
                             <Button 
                                 variant="ghost"
                                 onClick={(e) => {
                                     e.stopPropagation();
                                     toggleStage(mission.id);
                                 }}
                                 className="text-slate-400 hover:text-emerald-600 rounded-xl h-12 px-6 font-bold transition-all active:scale-95 flex items-center gap-2"
                             >
                                 <XCircle className="w-4 h-4" />
                                 Mark as Pending
                             </Button>
                          ) : (
                            <Button 
                                variant="outline"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleStage(mission.id);
                                }}
                                className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 rounded-xl h-12 px-6 font-bold transition-all active:scale-95 flex items-center gap-2 shadow-sm"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Mark as Complete
                            </Button>
                          )}
                          
                          {(isActive || isCompleted) && (
                            <Link href="/mentorship" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">
                              Book Mentor Guidance →
                            </Link>
                          )}
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
