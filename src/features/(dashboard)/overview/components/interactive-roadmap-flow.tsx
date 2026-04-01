"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Calendar,
  Layers,
  Zap,
  ArrowRight,
  Search,
  PenTool,
  ClipboardCheck,
  Brain,
  ListChecks,
  Send,
  Timer,
  MessagesSquare,
  Trophy,
  GraduationCap,
  LucideIcon,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useRouter } from "next/navigation";

// 11 Applicant Stages
const STAGES = [
  { id: 1, phase: "STAGE 1 • RESEARCH", title: "Research Schools & UCAS Strategy", date: "JAN - MAR", icon: Search, url: "/university-hub" },
  { id: 2, phase: "STAGE 2 • PREPARATION", title: "UCAT Registration Window", date: "APR - MAY", icon: Calendar, url: "/ai-hub/study-planner", isCurrent: true },
  { id: 3, phase: "STAGE 3 • PREPARATION", title: "Mastering the Personal Statement", date: "APR - MAY", icon: PenTool, url: "/ai-hub/personal-statement" },
  { id: 4, phase: "STAGE 4 • PREPARATION", title: "Secure Academic References", date: "APR - MAY", icon: ClipboardCheck, url: "/guidance-hub" },
  { id: 5, phase: "STAGE 5 • EXAMS", title: "The UCAT Entrance Exam", date: "JUN - JUL", icon: Brain, url: "/ai-hub/study-planner" },
  { id: 6, phase: "STAGE 6 • APPLICATION", title: "Finalise UCAS Choices (4+1)", date: "AUG", icon: ListChecks, url: "/university-hub" },
  
  { id: 7, phase: "STAGE 7 • APPLICATION", title: "Submit UCAS Application", date: "SEPT", icon: Send, url: "/applications" },
  { id: 8, phase: "STAGE 8 • APPLICATION", title: "THE HARD DEADLINE", date: "OCT 15", icon: Timer, url: "/applications" },
  { id: 9, phase: "STAGE 9 • INTERVIEWS", title: "MMI & Panel Interviews", date: "OCT - NOV", icon: MessagesSquare, url: "/ai-hub/interview-prep" },
  { id: 10, phase: "STAGE 10 • INTERVIEWS", title: "Offers & Firm Choices", date: "JAN - MAR (2027)", icon: Trophy, url: "/ai-hub/acceptance-odds" },
  { id: 11, phase: "STAGE 11 • ENROLMENT", title: "Enrollment & Success", date: "MAY - SEPT", icon: GraduationCap, url: "/growth" }
];

// Drawing constants
const STAGE_GAP = 300; // Gap between each wave step
const WAVE_AMPLITUDE = 120; // Height of the waves
const BASELINE_Y = 250; // Vertical center for the wave

export function InteractiveRoadmapFlow() {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  
  const currentIndex = STAGES.findIndex(s => s.isCurrent);
  
  // Create an array of x points for our steps
  const xPoints = STAGES.map((_, i) => i * STAGE_GAP + 150);
  
  // Build the wave path string using cubic bezier loops
  // M x y C x1 y1, x2 y2, x3 y3
  let wavePath = `M ${xPoints[0]} ${BASELINE_Y}`;
  for (let i = 0; i < xPoints.length - 1; i++) {
    const startX = xPoints[i];
    const endX = xPoints[i+1];
    const midX = (startX + endX) / 2;
    
    // Alt peaks and troughs
    const isUp = i % 2 === 0;
    const cpY = isUp ? BASELINE_Y - WAVE_AMPLITUDE : BASELINE_Y + WAVE_AMPLITUDE;
    
    // We'll use two control points at the peak/trough to make the "fluid" shape more rounded
    wavePath += ` C ${midX - 50} ${cpY}, ${midX + 50} ${cpY}, ${endX} ${BASELINE_Y}`;
  }

  return (
    <div className="w-full bg-white rounded-[3rem] p-8 lg:p-14 border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
      
      {/* Decorative Branding Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50/60 blur-[120px] rounded-full -z-10 transition-transform duration-1000 group-hover:scale-150 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/60 blur-[120px] rounded-full -z-10 transition-transform duration-1000 group-hover:scale-150 pointer-events-none" />

      {/* Header Inline */}
      <div className="mb-14 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-center md:text-left">
        <div>
            <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-emerald-600">Dynamic Roadmap</h3>
            <h4 className="text-4xl font-black text-slate-900 tracking-tight mt-1">Journey Wave Timeline</h4>
            <p className="text-slate-500 font-medium text-sm mt-3">
                Your mission path from research to graduation. Navigate the wave and click to launch tools.
            </p>
        </div>
        <div className="flex items-center gap-2 px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap">
               Live Progress Active
            </span>
        </div>
      </div>

      {/* Fluid Wave Map (Horizontally scrollable) */}
      <div className="w-full overflow-x-auto custom-scrollbar pb-20 pt-10 px-8 relative z-10">
        <div 
          className="relative" 
          style={{ width: `${(STAGES.length - 1) * STAGE_GAP + 500}px`, height: "500px" }}
        >
          {/* Main SVG Container */}
          <svg 
            width="100%" 
            height="500" 
            viewBox={`0 0 ${(STAGES.length - 1) * STAGE_GAP + 500} 500`}
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-0 left-0 drop-shadow-sm pointer-events-none"
          >
            <defs>
              <linearGradient id="wave-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="50%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
              <filter id="wave-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Base Ghost Path (Grey) */}
            <path 
              d={wavePath} 
              stroke="#f1f5f9" 
              strokeWidth="48" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />

            {/* Progress/Hover Animated Path */}
            {STAGES.map((_, i) => {
               if (i === 0) return null;
               const isHovered = hoveredId === i;
               const isPast = i <= currentIndex;
               const isActive = isHovered || isPast;

               // Split wave segments to animate them individually or as group
               // In this simple version, we'll draw parts of the wave
               return null; 
            })}

            {/* Gradient Overlay for the wave up to current progress */}
            <motion.path 
              d={wavePath} 
              stroke="url(#wave-grad)"
              strokeWidth="48" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: (currentIndex / (STAGES.length - 1)) }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{ filter: "url(#wave-glow)", opacity: 0.8 }}
            />
          </svg>

          {/* HTML Overlay - Interactive Steps */}
          {STAGES.map((stage, i) => {
             const x = xPoints[i];
             const isUp = i % 2 === 0;
             const isHovered = hoveredId === i;
             const isCompleted = i < currentIndex;
             const isCurrent = i === currentIndex;
             const isPast = i <= currentIndex;

             // Logic colors
             const themeColor = i < 4 ? "emerald" : (i < 8 ? "blue" : "orange");

             return (
                <div 
                  key={stage.id}
                  className="absolute pointer-events-auto"
                  style={{ left: x, top: BASELINE_Y }}
                  onMouseEnter={() => setHoveredId(i)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                   {/* Main Step Hub (The Bubble) */}
                   <motion.div 
                     onClick={() => router.push(stage.url)}
                     animate={{ 
                        scale: isHovered ? 1.15 : 1, 
                        y: isHovered ? (isUp ? -10 : 10) : 0,
                        rotate: isHovered ? (isUp ? 5 : -5) : 0
                     }}
                     className={cn(
                        "w-24 h-24 rounded-full flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500 relative z-50",
                        isPast ? "bg-white shadow-xl" : "bg-slate-50 opacity-80",
                        isHovered ? `border-[8px] border-${themeColor}-400` : `border-[8px] border-white shadow-md`,
                        isCurrent && `shadow-[0_0_40px_rgba(52,211,153,0.3)]`
                     )}
                   >
                      <div className={cn(
                         "w-full h-full rounded-full flex items-center justify-center border-4 border-transparent",
                         isPast && !isHovered ? `bg-${themeColor}-50 text-${themeColor}-500` : 
                         isHovered ? `bg-${themeColor}-500 text-white` : "bg-slate-100 text-slate-300"
                      )}>
                         {isCompleted && !isHovered ? <CheckCircle2 className="w-10 h-10" /> : <stage.icon className="w-10 h-10" />}
                      </div>

                      {/* Number Tab */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-slate-900 border-2 border-white text-white flex items-center justify-center text-[10px] font-black z-10">
                        {stage.id < 10 ? `0${stage.id}` : stage.id}
                      </div>

                      {/* Arrow indicator matches reference */}
                      <div className={cn(
                        "absolute w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent transition-opacity",
                        isUp ? "border-t-[12px] border-t-white -bottom-3" : "border-b-[12px] border-b-white -top-3",
                        !isHovered && "opacity-0"
                      )} />
                   </motion.div>

                   {/* Information Card (Alternating Top/Bottom) */}
                   <div 
                      className={cn(
                         "absolute left-1/2 -translate-x-1/2 w-64 text-center pointer-events-none transition-all duration-500",
                         isUp ? "bottom-[5.5rem]" : "top-[5.5rem]",
                         isHovered ? "opacity-100 translate-y-0" : "opacity-60"
                      )}
                   >
                      <div className="flex flex-col items-center">
                         {/* Year/Phase Label Top */}
                         <div className={cn(
                           "text-[10px] font-black tracking-[0.2em] uppercase mb-2",
                           isHovered ? `text-${themeColor}-600` : "text-slate-400"
                         )}>
                           {stage.date}
                         </div>

                         {/* Main Content Box */}
                         <div className={cn(
                           "bg-white/80 backdrop-blur-md p-4 rounded-3xl border transition-all duration-300 shadow-sm",
                           isHovered ? "border-emerald-100 shadow-lg scale-105" : "border-transparent"
                         )}>
                            <h5 className="text-[15px] font-black text-slate-800 leading-tight mb-1">
                               {stage.title}
                            </h5>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter line-clamp-1">
                               {stage.phase.split(' • ')[1]}
                            </p>
                            
                            {/* Action hint inside card */}
                            <AnimatePresence>
                               {isHovered && (
                                  <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    className="flex items-center justify-center gap-1.5 mt-3 pt-3 border-t border-slate-50"
                                  >
                                     <Zap className={cn("w-3 h-3 fill-current", `text-${themeColor}-400`)} />
                                     <span className="text-[10px] font-black uppercase text-slate-900 tracking-widest">
                                        Open Toolkit
                                     </span>
                                  </motion.div>
                               )}
                            </AnimatePresence>
                         </div>
                      </div>
                   </div>

                </div>
             )
          })}
        </div>
      </div>
    </div>
  );
}
