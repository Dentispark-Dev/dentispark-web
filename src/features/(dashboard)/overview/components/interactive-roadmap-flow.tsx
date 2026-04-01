"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Map, 
  Target,
  FileText,
  MessageSquare,
  Trophy,
  Calendar,
  Zap,
  ArrowRight
} from "lucide-react";
import { cn } from "@/src/lib/utils";

// 11 Applicant Stages mapping to user's screenshot
const STAGES = [
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

// Snake coordinates mapped to a 1000x800 viewBox
const NODE_POSITIONS = [
  { cx: 100, cy: 150 }, // 1
  { cx: 366, cy: 150 }, // 2
  { cx: 633, cy: 150 }, // 3
  { cx: 900, cy: 150 }, // 4
  
  { cx: 900, cy: 400 }, // 5
  { cx: 633, cy: 400 }, // 6
  { cx: 366, cy: 400 }, // 7
  { cx: 100, cy: 400 }, // 8
  
  { cx: 100, cy: 650 }, // 9
  { cx: 450, cy: 650 }, // 10
  { cx: 800, cy: 650 }  // 11
];

// Connecting SVG paths between the nodes
const PATH_SEGMENTS = [
  { id: 1, d: "M 100 150 L 366 150" }, // 1 to 2
  { id: 2, d: "M 366 150 L 633 150" }, // 2 to 3
  { id: 3, d: "M 633 150 L 900 150" }, // 3 to 4
  { id: 4, d: "M 900 150 A 125 125 0 0 1 900 400" }, // 4 to 5 (curve down)
  { id: 5, d: "M 900 400 L 633 400" }, // 5 to 6
  { id: 6, d: "M 633 400 L 366 400" }, // 6 to 7
  { id: 7, d: "M 366 400 L 100 400" }, // 7 to 8
  { id: 8, d: "M 100 400 A 125 125 0 0 0 100 650" }, // 8 to 9 (curve down)
  { id: 9, d: "M 100 650 L 450 650" }, // 9 to 10
  { id: 10, d: "M 450 650 L 800 650" } // 10 to 11
];

export function InteractiveRoadmapFlow() {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [expandedNode, setExpandedNode] = useState<number | null>(null);

  const currentIndex = STAGES.findIndex(s => s.isCurrent);

  return (
    <div className="w-full bg-slate-900 rounded-[3rem] p-8 lg:p-14 border border-slate-800 shadow-2xl relative overflow-hidden group">
      
      {/* Dark modern background effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full -z-10 transition-transform duration-1000 group-hover:scale-150" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -z-10 transition-transform duration-1000 group-hover:scale-150" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-center md:text-left">
        <div>
            <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-emerald-400">Step-by-Step Intelligence</h3>
            <h4 className="text-4xl font-black text-white tracking-tight mt-1">Applicant Process Flow</h4>
            <p className="text-slate-400 font-medium text-sm mt-3 max-w-lg">
                Hover over the path to illuminate stages, or click a node to expand toolsets and critical actions.
            </p>
        </div>
      </div>

      {/* Interactive SVG Flow Map */}
      <div className="w-full overflow-x-auto custom-scrollbar pb-10">
        <div className="min-w-[1000px] h-[800px] relative mt-4">
          
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 1000 800" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-2xl"
          >
            <defs>
              <linearGradient id="glowG" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="glowB" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
              <linearGradient id="glowO" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <filter id="svgGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Base Background Path */}
            {PATH_SEGMENTS.map(seg => (
               <path 
                 key={`base-${seg.id}`} 
                 d={seg.d} 
                 stroke="#1e293b" 
                 strokeWidth="40" 
                 strokeLinecap="round"
                 strokeLinejoin="round"
               />
            ))}

            {/* Dynamic Interactive Paths */}
            {PATH_SEGMENTS.map((seg, i) => {
              // Determine if this segment should be lit up
              const isPastNode = i < currentIndex; // 0-indexed, so seg 0 is before node 1
              const isHoveredRoute = hoveredNode !== null && i < hoveredNode;
              
              // Color logic
              const isActiveRoute = isHoveredRoute || isPastNode;
              // Change color randomly or based on row (1st row green, 2nd row blue, 3rd row orange)
              let colorUrl = "url(#glowG)";
              if (i >= 4 && i <= 7) colorUrl = "url(#glowB)";
              if (i > 7) colorUrl = "url(#glowO)";

              return (
                <motion.path 
                  key={`active-${seg.id}`}
                  d={seg.d}
                  stroke={isActiveRoute ? colorUrl : "transparent"}
                  strokeWidth="24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: isActiveRoute ? 1 : 0, 
                    opacity: isActiveRoute ? 1 : 0 
                  }}
                  transition={{ duration: 0.5, delay: isHoveredRoute ? i * 0.05 : 0 }}
                  style={{ filter: isActiveRoute ? "url(#svgGlow)" : "none" }}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          {/* HTML Overlay for Rich Nodes & Interactions */}
          <div className="absolute inset-0 pointer-events-none">
            {STAGES.map((stage, i) => {
               const pos = NODE_POSITIONS[i];
               const xPct = (pos.cx / 1000) * 100;
               const yPct = (pos.cy / 800) * 100;

               const isExpanded = expandedNode === stage.id;
               const isHovered = hoveredNode === stage.id;
               const isCompleted = i < currentIndex;
               const isCurrent = i === currentIndex;
               
               // Determine visual row
               const isRow1 = i < 4;
               const isRow2 = i >= 4 && i < 8;
               
               // Color theme for the node
               const themeColor = isRow2 ? "blue" : (i >= 8 ? "orange" : "emerald");

               return (
                  <div 
                    key={stage.id}
                    className="absolute pointer-events-auto flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 z-20"
                    style={{ left: `${xPct}%`, top: `${yPct}%` }}
                    onMouseEnter={() => setHoveredNode(stage.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {/* The Clickable Node Button */}
                    <button 
                      onClick={() => setExpandedNode(isExpanded ? null : stage.id)}
                      className={cn(
                        "w-20 h-20 rounded-full flex flex-col items-center justify-center border-[6px] transition-all duration-300 relative group",
                        isCompleted ? `bg-${themeColor}-500 border-slate-900 text-white` : 
                        isCurrent ? `bg-${themeColor}-600 border-${themeColor}-300 text-white shadow-[0_0_30px_rgba(52,211,153,0.4)] scale-110` : 
                        `bg-slate-800 border-slate-700 text-slate-400 hover:border-${themeColor}-400 hover:bg-slate-700`
                      )}
                    >
                      {isCompleted ? <CheckCircle2 className="w-8 h-8" /> : <span className="font-black text-2xl">{stage.id}</span>}
                    </button>

                    {/* Pop-out Info Box (Visible on hover or expansion) */}
                    <AnimatePresence>
                      <motion.div 
                        initial={{ opacity: 0, y: 15, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className={cn(
                          "absolute top-full mt-4 w-64 bg-slate-800 border border-slate-700 rounded-3xl p-5 shadow-2xl text-left pointer-events-auto",
                          // Position differently if on edge to avoid overflow
                          pos.cx > 800 ? "-translate-x-[75%]" : (pos.cx < 200 ? "-translate-x-[25%]" : "-translate-x-1/2"),
                          (isHovered || isExpanded) ? "z-50" : "opacity-0 pointer-events-none hidden",
                          `hover:border-${themeColor}-500/50`
                        )}
                      >
                         <div className={cn(
                             "text-[9px] font-black uppercase tracking-widest mb-1.5",
                             `text-${themeColor}-400`
                         )}>
                             {stage.phase}
                         </div>
                         <h4 className="text-[15px] font-black text-white leading-tight mb-3">
                             {stage.title}
                         </h4>

                         <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-900/50 p-2 rounded-xl border border-slate-800/80 mb-3">
                             <Calendar className={cn("w-3.5 h-3.5", `text-${themeColor}-400`)} /> {stage.date}
                         </div>

                         {/* Only show rich action content if fully expanded (clicked) */}
                         <AnimatePresence>
                             {isExpanded && (
                                 <motion.div 
                                    initial={{ height: 0, opacity: 0 }} 
                                    animate={{ height: "auto", opacity: 1 }} 
                                    exit={{ height: 0, opacity: 0 }}
                                    className="pt-3 mt-3 border-t border-slate-700"
                                 >
                                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                        <Zap className="w-3 h-3 text-amber-400" /> Suggested Action
                                    </h5>
                                    <button className={cn(
                                        "w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2",
                                        `bg-${themeColor}-500 hover:bg-${themeColor}-400 text-white`
                                    )}>
                                        Open Toolkit <ArrowRight className="w-3 h-3" />
                                    </button>
                                 </motion.div>
                             )}
                         </AnimatePresence>
                      </motion.div>
                    </AnimatePresence>

                  </div>
               )
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
