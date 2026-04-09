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
  LucideIcon
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "@/src/store/dashboard-store";

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
const VIEW_WIDTH = 1200;
const VIEW_HEIGHT = 900;
const CX = 600;
const CY = 450;
const RADIUS = 180;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ITEMS = 11;
const ANGLE_STEP = 360 / ITEMS;
const DASH_GAP = 12; // Gap between pie segments
const DASH_LENGTH = (CIRCUMFERENCE / ITEMS) - DASH_GAP;

const PILL_WIDTH = 280;
const PILL_HEIGHT = 86;

const PILL_POSITIONS = [
  { x: 880, y: 120, connectSide: "left" },  // 0
  { x: 880, y: 250, connectSide: "left" },  // 1
  { x: 880, y: 380, connectSide: "left" },  // 2
  { x: 880, y: 510, connectSide: "left" },  // 3
  { x: 880, y: 640, connectSide: "left" },  // 4
  { x: 880, y: 770, connectSide: "left" },  // 5

  { x: 40, y: 740, connectSide: "right" },  // 6
  { x: 40, y: 590, connectSide: "right" },  // 7
  { x: 40, y: 440, connectSide: "right" },  // 8
  { x: 40, y: 290, connectSide: "right" },  // 9
  { x: 40, y: 140, connectSide: "right" },  // 10
];

function getSegmentCenterPoint(index: number) {
  const angleDeg = (index * ANGLE_STEP) - 90 + (ANGLE_STEP / 2);
  const angleRad = (angleDeg * Math.PI) / 180;
  const rOuter = RADIUS + 18;
  return {
    x: CX + rOuter * Math.cos(angleRad),
    y: CY + rOuter * Math.sin(angleRad),
    angleDeg
  };
}

export function InteractiveRoadmapFlow() {
  const router = useRouter();
  const { stages, toggleStage } = useDashboardStore();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  
  const currentStage = stages.find(s => s.isCurrent);
  const currentIndex = currentStage ? currentStage.id - 1 : 0;
  
  // Show the hovered stage or the current one in the center hub
  const activeIndex = hoveredId !== null ? hoveredId : currentIndex;
  const displayStage = STAGES[activeIndex];

  return (
    <div className="w-full bg-white rounded-[3rem] p-8 lg:p-14 border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
      
      {/* Decorative branding glow (Fixed position, NOT blobs) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50/40 blur-[120px] rounded-full -z-10 pointer-events-none transition-transform duration-1000 group-hover:scale-125" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/40 blur-[120px] rounded-full -z-10 pointer-events-none transition-transform duration-1000 group-hover:scale-125" />

      {/* Header */}
      <div className="mb-0 flex items-center justify-between relative z-10 text-center mx-auto md:text-left">
        <div>
            <h3 className="text-[12px] font-extrabold uppercase tracking-[0.4em] text-emerald-600">Applicant Roadmap</h3>
            <h4 className="text-4xl font-extrabold text-slate-900 tracking-tight mt-1">11 Steps Interactive Hub</h4>
            <p className="text-slate-500 font-medium text-sm mt-3">
               Hover any stage to launch your specialized toolkit and track your journey in real-time.
            </p>
        </div>
      </div>

      {/* Radial Infographic Wrapper */}
      <div className="w-full overflow-x-auto custom-scrollbar pb-10">
        <div className="min-w-[1200px] h-[900px] relative mt-8">
          
          <svg 
            width="100%" 
            height="100%" 
            viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 z-0"
          >
            <defs>
              <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="glow-orange" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Connecting Lines without messy Blobs */}
            {STAGES.map((stage, i) => {
               const pos = PILL_POSITIONS[i];
               const startPoint = getSegmentCenterPoint(i);
               const endX = pos.connectSide === "left" ? pos.x : pos.x + PILL_WIDTH;
               const endY = pos.y + (PILL_HEIGHT / 2);
               
               const isRow1 = i < 4;
               const isRow2 = i >= 4 && i < 8;
               const colorClass = isRow1 ? "#10b981" : (isRow2 ? "#3b82f6" : "#f59e0b");
               
               const midX = (startPoint.x + endX) / 2;
               const d = `M ${startPoint.x} ${startPoint.y} Q ${midX} ${startPoint.y}, ${endX} ${endY}`;

               const isActive = activeIndex === i;
               const isCompleted = stages.find(s => s.id === stage.id)?.isCompleted;

               return (
                  <motion.path
                     key={`line-${i}`}
                     d={d}
                     stroke={colorClass}
                     strokeWidth="2.5"
                     strokeDasharray={isActive ? "0" : "6 6"}
                     fill="none"
                     initial={{ pathLength: 1, opacity: 0.15 }}
                     animate={{
                        opacity: isActive ? 1 : (isCompleted ? 0.4 : 0.1),
                        strokeWidth: isActive ? "4" : "2.5",
                        strokeDasharray: isActive ? "0" : "6 6"
                     }}
                     transition={{ duration: 0.4, ease: "easeInOut" }}
                  />
               );
            })}

            {/* Clean Segmented Center Ring (No Blobs) */}
            <circle cx={CX} cy={CY} r={RADIUS + 15} stroke="#f8fafc" strokeWidth="48" fill="none" />
            
            {STAGES.map((stage, i) => {
              const rotation = (i * ANGLE_STEP) - 90;
              const isRow1 = i < 4;
              const isRow2 = i >= 4 && i < 8;
              const tailwindColor = isRow1 ? "#10b981" : (isRow2 ? "#3b82f6" : "#f59e0b");
              const glowFilter = isRow1 ? "url(#glow-emerald)" : (isRow2 ? "url(#glow-blue)" : "url(#glow-orange)");

              const isActive = activeIndex === i;
              const isCompleted = stages.find(s => s.id === stage.id)?.isCompleted;

              return (
                 <motion.circle 
                    key={`seg-${i}`}
                    cx={CX} 
                    cy={CY} 
                    r={RADIUS} 
                    fill="none"
                    stroke={tailwindColor}
                    strokeWidth={isActive ? "38" : "32"}
                    strokeDasharray={`${DASH_LENGTH} ${CIRCUMFERENCE}`}
                    strokeLinecap="round"
                    transform={`rotate(${rotation} ${CX} ${CY})`}
                    className="origin-center cursor-pointer"
                    onMouseEnter={() => setHoveredId(i)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{ 
                        filter: isActive ? glowFilter : "none",
                    }}
                    animate={{ 
                       opacity: isActive ? 1 : (isCompleted ? 0.6 : 0.25)
                    }}
                 />
              )
            })}
          </svg>

          {/* HTML Overlay - Central Hub Engine */}
          <div 
             className="absolute flex flex-col items-center justify-center text-center rounded-full bg-white shadow-[0_0_80px_rgba(0,0,0,0.06)] border-[12px] border-slate-50 z-40 transition-all duration-500 ease-out"
             style={{ 
               left: CX - (RADIUS - 40), 
               top: CY - (RADIUS - 40), 
               width: (RADIUS - 40) * 2, 
               height: (RADIUS - 40) * 2 
             }}
          >
             <AnimatePresence mode="wait">
                 <motion.div 
                    key={displayStage.id}
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -15 }}
                    transition={{ type: "spring", damping: 15, stiffness: 300 }}
                    className="flex flex-col items-center justify-center p-4"
                 >
                     <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-sm animate-pulse">
                        <displayStage.icon className="w-8 h-8" />
                     </div>
                     <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-1">
                        STAGE {displayStage.id}
                     </span>
                     <h3 className="text-xl font-extrabold text-slate-900 leading-tight mb-2 max-w-[180px]">
                        {displayStage.title}
                     </h3>
                     <span className="text-[10px] font-bold text-slate-500 bg-slate-100 rounded-md px-2 py-1 mb-5 flex items-center gap-1.5 leading-none">
                        <Calendar className="w-3 h-3" /> {displayStage.date}
                     </span>
                     
                     <button 
                        onClick={() => router.push(displayStage.url)}
                        className="group flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-extrabold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl hover:shadow-emerald-500/20 active:scale-95"
                     >
                        Open Tool <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                     </button>
                 </motion.div>
             </AnimatePresence>
          </div>

          {/* HTML Overlay - Pills without Blobs */}
          {STAGES.map((stage, i) => {
             const pos = PILL_POSITIONS[i];
             const themeColor = i < 4 ? "emerald" : (i < 8 ? "blue" : "orange");
             const isActive = activeIndex === i;
             const isCompleted = stages.find(s => s.id === stage.id)?.isCompleted;

             return (
                 <div 
                    key={`pill-${stage.id}`}
                    onMouseEnter={() => setHoveredId(i)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => router.push(stage.url)}
                    className={cn(
                        "absolute flex items-center p-2 pr-6 rounded-full border-[1px] transition-all duration-500 cursor-pointer group bg-white",
                        isActive ? `border-${themeColor}-400 shadow-2xl scale-[1.05] z-50` : 
                        isCompleted ? `border-slate-200 opacity-90 hover:border-${themeColor}-300 hover:shadow-lg` : 
                        `border-transparent opacity-60 hover:opacity-100 hover:border-${themeColor}-200`,
                    )}
                    style={{ 
                        left: pos.x, 
                        top: pos.y, 
                        width: PILL_WIDTH, 
                        height: PILL_HEIGHT 
                    }}
                 >
                     {/* The Icon Bubble */}
                     <div className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center shrink-0 transition-all duration-700 mr-4 border-[6px] shadow-sm",
                        isActive ? `bg-${themeColor}-500 text-white border-white scale-110` : 
                        isCompleted ? `bg-${themeColor}-50 text-${themeColor}-500 border-white font-bold` : 
                        "bg-slate-50 text-slate-300 border-white"
                     )}>
                         {isCompleted && !isActive ? (
                            <CheckCircle2 className="w-8 h-8" />
                         ) : (
                            <stage.icon className="w-8 h-8" />
                         )}
                     </div>

                     <div className="flex flex-col justify-center overflow-hidden">
                        <div className="flex items-center gap-1.5 mb-1 text-[14px]">
                            <span className={cn(
                                "font-extrabold",
                                isActive ? `text-${themeColor}-600` : "text-slate-400"
                            )}>
                                {stage.id < 10 ? `0${stage.id}` : stage.id}
                            </span>
                            <span className={cn(
                                "text-[9px] font-extrabold uppercase tracking-widest leading-none",
                                isActive ? "text-slate-800" : "text-slate-300"
                            )}>
                                {stage.phase.split(' • ')[1]}
                            </span>
                        </div>
                        <h5 className={cn(
                            "text-[15px] font-extrabold leading-tight truncate",
                            isActive ? "text-slate-900" : "text-slate-600"
                        )}>
                            {stage.title}
                        </h5>

                        <motion.div 
                          initial={false}
                          animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -5 }}
                          className={cn("text-[9px] font-extrabold uppercase tracking-tighter mt-1 flex items-center gap-1", `text-${themeColor}-500`)}
                        >
                          <Zap className="w-3 h-3 fill-current" /> Initialize Station
                        </motion.div>
                     </div>
                 </div>
             )
          })}
          
        </div>
      </div>
    </div>
  );
}
