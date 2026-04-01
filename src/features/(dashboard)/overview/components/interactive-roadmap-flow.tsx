"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Map, 
  AlignLeft, 
  Calendar,
  ChevronDown,
  ArrowRight
} from "lucide-react";
import { cn } from "@/src/lib/utils";

interface Stage {
  id: number;
  phase: string;
  title: string;
  date: string;
  isCurrent?: boolean;
}

const STAGES: Stage[] = [
  { id: 1, phase: "STAGE 1 • RESEARCH", title: "Research Schools & UCAS Strategy", date: "JAN - MAR" },
  { id: 2, phase: "STAGE 2 • PREPARATION", title: "UCAT Registration Window", date: "APR - MAY", isCurrent: true },
  { id: 3, phase: "STAGE 3 • PREPARATION", title: "Mastering the Personal Statement", date: "APR - MAY" },
  { id: 4, phase: "STAGE 4 • PREPARATION", title: "Secure Academic References", date: "APR - MAY" },
  { id: 5, phase: "STAGE 5 • EXAMS", title: "The UCAT Entrance Exam", date: "JUN - JUL" },
  { id: 6, phase: "STAGE 6 • APPLICATION", title: "Finalise UCAS Choices (4+1)", date: "AUG" },
  { id: 7, phase: "STAGE 7 • APPLICATION", title: "Submit UCAS Application", date: "SEPT" },
  { id: 8, phase: "STAGE 8 • APPLICATION", title: "THE HARD DEADLINE", date: "OCT 15" },
  { id: 9, phase: "STAGE 9 • INTERVIEWS", title: "MMI & Panel Interviews", date: "OCT - NOV" },
  { id: 10, phase: "STAGE 10 • INTERVIEWS", title: "Offers & Firm Choices", date: "JAN - MAR (2027)" },
  { id: 11, phase: "STAGE 11 • ENROLMENT", title: "Enrollment & Success", date: "MAY - SEPT" }
];

export function InteractiveRoadmapFlow() {
  const [layout, setLayout] = useState<"scurve" | "horizontal">("horizontal");
  const [expandedId, setExpandedId] = useState<number | null>(2); // Default open the current one

  // Find the index of the current stage (used for green vs grey path coloring)
  const currentIndex = STAGES.findIndex(s => s.isCurrent);

  return (
    <div className="w-full bg-white rounded-[3rem] p-10 lg:p-14 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 blur-3xl rounded-full -z-10 transition-transform duration-700 group-hover:scale-150" />
      
      {/* Header & Controls */}
      <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="text-center md:text-left">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Your Journey</h3>
            <h4 className="text-3xl font-black text-slate-900 tracking-tight">Applicant Roadmap</h4>
            <p className="text-slate-500 font-medium text-sm mt-2 max-w-md">
                Your step-by-step intelligence checklist for the UK 2026/27 cycle. Expand a stage to view critical tasks.
            </p>
        </div>
        
        {/* Layout Toggle */}
        <div className="flex items-center p-1 bg-slate-50 border border-slate-100 rounded-2xl">
            <button 
                onClick={() => setLayout("horizontal")}
                className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                    layout === "horizontal" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"
                )}
            >
                <AlignLeft className="w-4 h-4" /> Timeline
            </button>
            <button 
                onClick={() => setLayout("scurve")}
                className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                    layout === "scurve" ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"
                )}
            >
                <Map className="w-4 h-4" /> Board
            </button>
        </div>
      </div>

      {/* RENDER VIEW */}
      <div className="relative w-full z-10 p-2">
          {layout === "horizontal" ? (
             <HorizontalView expandedId={expandedId} setExpandedId={setExpandedId} currentIndex={currentIndex} />
          ) : (
             <SCurveView expandedId={expandedId} setExpandedId={setExpandedId} currentIndex={currentIndex} />
          )}
      </div>
    </div>
  );
}


// ----------------------------------------------------
// HORIZONTAL SCROLL VIEW
// ----------------------------------------------------
function HorizontalView({ expandedId, setExpandedId, currentIndex }: { expandedId: number | null, setExpandedId: any, currentIndex: number }) {
    return (
        <div className="w-full overflow-x-auto pb-12 pt-4 px-4 overflow-y-hidden custom-scrollbar">
            <div className="flex items-start min-w-max relative gap-16">
                
                {/* Background Connection Line */}
                <div className="absolute top-[3.25rem] left-8 w-[calc(100%-4rem)] h-1 bg-slate-100 -z-10 rounded-full" />
                {/* Active Connection Line */}
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentIndex / (STAGES.length - 1)) * 100}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute top-[3.25rem] left-8 h-1 bg-emerald-400 -z-10 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" 
                />

                {STAGES.map((stage, i) => {
                    const isCompleted = i < currentIndex;
                    const isCurrent = i === currentIndex;
                    const isExpanded = expandedId === stage.id;
                    const colorState = isCompleted ? "emerald" : isCurrent ? "emerald" : "slate";

                    return (
                        <div key={stage.id} className="relative w-64 flex flex-col items-center">
                            
                            {/* Node Core */}
                            <button 
                                onClick={() => setExpandedId(isExpanded ? null : stage.id)}
                                className={cn(
                                    "w-12 h-12 mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 ring-4 ring-white relative z-10",
                                    isCompleted && "bg-emerald-50 text-emerald-500 border-2 border-emerald-500",
                                    isCurrent && "bg-emerald-600 text-white shadow-xl shadow-emerald-500/30 scale-110",
                                    !isCompleted && !isCurrent && "bg-slate-100 text-slate-400 border border-slate-200 hover:bg-slate-200"
                                )}
                            >
                                {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <span className="font-black text-lg">{stage.id}</span>}
                            </button>

                            {/* Node Details */}
                            <div className={cn(
                                "text-center transition-opacity duration-300",
                                !isExpanded && "opacity-60 hover:opacity-100 cursor-pointer"
                            )} onClick={() => setExpandedId(isExpanded ? null : stage.id)}>
                                
                                <div className="flex flex-col items-center gap-1 mb-2">
                                     <span className={cn(
                                        "text-[8px] font-black uppercase tracking-widest",
                                        isCurrent ? "text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full" : "text-slate-400"
                                     )}>{stage.phase}</span>
                                </div>
                                <h4 className="text-sm font-black text-slate-800 leading-tight mb-2">
                                    {stage.title}
                                </h4>
                                <span className="text-[10px] font-bold text-slate-400 inline-flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                    <Calendar className="w-3 h-3" /> {stage.date}
                                </span>
                            </div>

                            {/* Expanded Data Dropdown Mock */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0, y: -10 }}
                                        animate={{ opacity: 1, height: "auto", y: 0 }}
                                        exit={{ opacity: 0, height: 0, y: -10 }}
                                        className="w-full mt-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-xl shadow-slate-200/50 text-left overflow-hidden"
                                    >
                                        <p className="text-xs text-slate-500 font-medium mb-3">Tasks to unlock progression for {stage.title}:</p>
                                        <ul className="space-y-3">
                                            {[1, 2, 3].map(t => (
                                                <li key={t} className="flex gap-2 items-start text-xs font-bold text-slate-700">
                                                    <div className="w-4 h-4 rounded-full border-2 border-slate-200 mt-0.5 shrink-0" />
                                                    Complete sub-task {t}
                                                </li>
                                            ))}
                                        </ul>
                                        <button className="w-full mt-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                                            Open Tool <ArrowRight className="w-3 h-3" />
                                        </button>
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

// ----------------------------------------------------
// S-CURVE BOARD VIEW
// ----------------------------------------------------
function SCurveView({ expandedId, setExpandedId, currentIndex }: { expandedId: number | null, setExpandedId: any, currentIndex: number }) {
    
    // Split into rows of 4 for the snake pattern
    const chunkedStages = [];
    for (let i = 0; i < STAGES.length; i += 4) {
        chunkedStages.push(STAGES.slice(i, i + 4));
    }

    return (
        <div className="w-full relative px-2 py-8 m-auto max-w-5xl">
            {chunkedStages.map((row, rowIndex) => {
                const isEvenRow = rowIndex % 2 !== 0; // Reverse every other row for S-Curve
                const displayRow = isEvenRow ? [...row].reverse() : row;
                
                return (
                    <div key={rowIndex} className="relative">
                        
                        {/* The Horizontal Line for this row */}
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 bg-slate-100 -z-10 rounded-full hidden md:block" />
                        
                        <div className={cn(
                            "grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 relative mb-12",
                            // No reverse needed physically in DOM because grid flow isn't visually mapped to line without explicit ordering,
                            // But we reversed the array to map the visual S.
                        )}>
                            {displayRow.map((stage, colIndex) => {
                                const i = STAGES.findIndex(s => s.id === stage.id);
                                const isCompleted = i < currentIndex;
                                const isCurrent = i === currentIndex;
                                const isExpanded = expandedId === stage.id;

                                return (
                                    <div key={stage.id} className="relative flex md:flex-col items-center md:text-center p-4 bg-white md:bg-transparent rounded-3xl border border-slate-100 shadow-sm md:border-transparent md:shadow-none hover:shadow-md md:hover:shadow-none transition-all cursor-pointer group" onClick={() => setExpandedId(isExpanded ? null : stage.id)}>
                                        
                                        {/* Node Marker */}
                                        <div className={cn(
                                            "w-10 h-10 md:mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 ring-4 ring-white shrink-0 mr-4 md:mr-0 relative z-10",
                                            isCompleted && "bg-emerald-50 text-emerald-500 border-2 border-emerald-500",
                                            isCurrent && "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-110",
                                            !isCompleted && !isCurrent && "bg-slate-100 text-slate-400 border border-slate-200 group-hover:bg-slate-200"
                                        )}>
                                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="font-black text-sm">{stage.id}</span>}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex flex-col md:items-center gap-1 mb-1">
                                                <span className={cn(
                                                    "text-[8px] font-black uppercase tracking-widest",
                                                    isCurrent ? "text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full w-fit md:mx-auto" : "text-slate-400"
                                                )}>{stage.phase}</span>
                                            </div>
                                            <h4 className="text-sm font-black text-slate-800 leading-tight mb-2">
                                                {stage.title}
                                            </h4>
                                            
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="mt-3 text-left bg-slate-50 p-4 rounded-2xl border border-slate-100"
                                                    >
                                                        <ul className="space-y-2 mb-3">
                                                            <li className="text-[10px] font-bold text-slate-600 flex gap-2">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" /> Focus on milestones
                                                            </li>
                                                            <li className="text-[10px] font-bold text-slate-600 flex gap-2">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" /> Unlock tools
                                                            </li>
                                                        </ul>
                                                        <button className="w-full py-1.5 bg-white border border-slate-200 text-slate-800 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm hover:border-emerald-300 transition-colors">
                                                            View Guide
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    );
}
