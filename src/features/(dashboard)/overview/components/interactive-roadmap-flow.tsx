"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
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

// Mathematical geometry
const VIEW_WIDTH = 1200;
const VIEW_HEIGHT = 900;
const CX = 600;
const CY = 450;
const RADIUS = 180;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ITEMS = 11;
const ANGLE_STEP = 360 / ITEMS;
const DASH_GAP = 12;
const DASH_LENGTH = (CIRCUMFERENCE / ITEMS) - DASH_GAP;

const PILL_WIDTH = 280;
const PILL_HEIGHT = 86;

const PILL_POSITIONS = [
  { x: 880, y: 120, connectSide: "left" },
  { x: 880, y: 250, connectSide: "left" },
  { x: 880, y: 380, connectSide: "left" },
  { x: 880, y: 510, connectSide: "left" },
  { x: 880, y: 640, connectSide: "left" },
  { x: 880, y: 770, connectSide: "left" },
  { x: 40, y: 740, connectSide: "right" },
  { x: 40, y: 590, connectSide: "right" },
  { x: 40, y: 440, connectSide: "right" },
  { x: 40, y: 290, connectSide: "right" },
  { x: 40, y: 140, connectSide: "right" },
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
  const containerRef = useRef(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // High-performance scroll tracking for "scrolled highlights"
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  useEffect(() => {
    return scrollYProgress.onChange((v) => setScrollProgress(v));
  }, [scrollYProgress]);

  const currentIndex = STAGES.findIndex(s => s.isCurrent);
  
  // Calculate which stage should be highlighted based on either hover OR scroll
  const activeIndex = hoveredId !== null 
    ? hoveredId 
    : Math.min(STAGES.length - 1, Math.floor(scrollProgress * (STAGES.length + 2))); 

  const displayStage = STAGES[activeIndex];

  return (
    <div 
      ref={containerRef}
      className="w-full bg-white rounded-[3rem] p-8 lg:p-14 border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50/60 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/60 blur-[120px] rounded-full -z-10 pointer-events-none" />

      {/* Header */}
      <div className="mb-0 flex items-center justify-between relative z-10 text-center mx-auto md:text-left">
        <div>
            <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-emerald-600">Deep Performance Roadmap</h3>
            <h4 className="text-4xl font-black text-slate-900 tracking-tight mt-1">Interactive Hub Infographic</h4>
            <p className="text-slate-500 font-medium text-sm mt-2">
                This board responds to your scroll position and hover actions. Experience the journey.
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
            className="absolute inset-0"
          >
            <defs>
              <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="glow-orange" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Connecting Lines with pathLength drawing logic */}
            {STAGES.map((stage, i) => {
               const pos = PILL_POSITIONS[i];
               const startPoint = getSegmentCenterPoint(i);
               const endX = pos.connectSide === "left" ? pos.x : pos.x + PILL_WIDTH;
               const endY = pos.y + (PILL_HEIGHT / 2);
               
               const isRow1 = i < 4;
               const isRow2 = i >= 4 && i < 8;
               const colorClass = isRow1 ? "#34d399" : (isRow2 ? "#60a5fa" : "#fbbf24");
               
               const midX = (startPoint.x + endX) / 2;
               const d = `M ${startPoint.x} ${startPoint.y} Q ${midX} ${startPoint.y}, ${endX} ${endY}`;

               const isActive = activeIndex === i;
               const isPast = i < activeIndex;

               return (
                  <motion.path
                     key={`line-${i}`}
                     d={d}
                     stroke={colorClass}
                     strokeWidth={isActive ? "4" : "2"}
                     strokeDasharray={isActive ? "0" : "5 5"}
                     fill="none"
                     initial={{ pathLength: 0, opacity: 0.1 }}
                     animate={{
                        opacity: isActive ? 1 : (isPast ? 0.3 : 0.05),
                        pathLength: isActive || isPast ? 1 : 0.2
                     }}
                     transition={{ duration: 0.6, ease: "easeOut" }}
                  />
               );
            })}

            {/* Segmented Donut SVG */}
            <circle cx={CX} cy={CY} r={RADIUS + 15} stroke="#f8fafc" strokeWidth="48" fill="none" />
            
            {STAGES.map((stage, i) => {
              const rotation = (i * ANGLE_STEP) - 90;
              const isRow1 = i < 4;
              const isRow2 = i >= 4 && i < 8;
              const tailwindColor = isRow1 ? "#10b981" : (isRow2 ? "#3b82f6" : "#f59e0b");
              const glowFilter = isRow1 ? "url(#glow-emerald)" : (isRow2 ? "url(#glow-blue)" : "url(#glow-orange)");

              const isActive = activeIndex === i;
              const isPast = i < activeIndex;

              return (
                 <motion.circle 
                    key={`seg-${i}`}
                    cx={CX} 
                    cy={CY} 
                    r={RADIUS} 
                    fill="none"
                    stroke={tailwindColor}
                    strokeWidth={isActive ? "42" : "32"}
                    strokeDasharray={`${DASH_LENGTH} ${CIRCUMFERENCE}`}
                    strokeLinecap="round"
                    transform={`rotate(${rotation} ${CX} ${CY})`}
                    className="origin-center cursor-pointer"
                    onMouseEnter={() => setHoveredId(i)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{ filter: isActive ? glowFilter : "none" }}
                    animate={{ 
                       opacity: isActive ? 1 : (isPast ? 0.6 : 0.1)
                    }}
                 />
              )
            })}
          </svg>

          {/* HTML Overlay - Functional Points and Sonar Nodes */}
          {STAGES.map((stage, i) => {
             const pos = PILL_POSITIONS[i];
             const endX = pos.connectSide === "left" ? pos.x : pos.x + PILL_WIDTH;
             const endY = pos.y + (PILL_HEIGHT / 2);
             
             const isRow1 = i < 4;
             const isRow2 = i >= 4 && i < 8;
             const themeColor = isRow1 ? "emerald" : (isRow2 ? "blue" : "orange");
             const isActive = activeIndex === i;

             return (
               <div 
                  key={`point-${i}`}
                  className="absolute pointer-events-none"
                  style={{ left: endX, top: endY }}
               >
                  {/* Glowing Interaction Point matching user's "Clickable Points" request */}
                  <div className={cn(
                     "w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-500",
                     isActive ? "opacity-100" : "opacity-0"
                  )}>
                     <div className={cn("absolute w-full h-full rounded-full animate-ping opacity-75", `bg-${themeColor}-400`)} />
                     <div className={cn("w-3 h-3 rounded-full relative z-10", `bg-${themeColor}-500 shadow-lg shadow-${themeColor}-500/50`)} />
                  </div>
               </div>
             )
          })}

          {/* HTML Overlay - Central Radial Hub with 3D Effect */}
          <div 
             className="absolute flex flex-col items-center justify-center text-center rounded-full bg-white shadow-[0_0_80px_rgba(0,0,0,0.08)] border-[12px] border-slate-50 z-40 overflow-hidden"
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
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="flex flex-col items-center justify-center p-4"
                 >
                     <motion.div 
                        animate={{ y: [0, -5, 0], scale: [1, 1.05, 1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-sm"
                     >
                        <displayStage.icon className="w-8 h-8" />
                     </motion.div>
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                        STAGE {displayStage.id}
                     </span>
                     <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 max-w-[180px]">
                        {displayStage.title}
                     </h3>
                     <span className="text-[10px] font-bold text-slate-500 bg-slate-100 rounded-md px-2 py-1 mb-4 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" /> {displayStage.date}
                     </span>
                     
                     <button 
                        onClick={() => router.push(displayStage.url)}
                        className="group flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95"
                     >
                        Initialize toolkit <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                     </button>
                 </motion.div>
             </AnimatePresence>
          </div>

          {/* HTML Overlay - Interactive Pillars */}
          {STAGES.map((stage, i) => {
             const pos = PILL_POSITIONS[i];
             const isRow1 = i < 4;
             const isRow2 = i >= 4 && i < 8;
             const themeColor = i < 4 ? "emerald" : (i < 8 ? "blue" : "orange");
             const isActive = activeIndex === i;
             const isPast = i < activeIndex;

             return (
                 <div 
                    key={`pill-${stage.id}`}
                    onMouseEnter={() => setHoveredId(i)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => router.push(stage.url)}
                    className={cn(
                        "absolute flex items-center p-2 pr-6 rounded-full border-[1px] transition-all duration-500 cursor-pointer group",
                        isActive ? `bg-white border-${themeColor}-400 shadow-2xl scale-[1.08] z-50` : 
                        isPast ? `bg-white border-slate-200 hover:border-${themeColor}-300 hover:shadow-lg shadow-slate-200/20` : 
                        `bg-slate-50 border-slate-100 hover:bg-white hover:border-${themeColor}-200`,
                        !isActive && "opacity-50"
                    )}
                    style={{ 
                        left: pos.x, 
                        top: pos.y, 
                        width: PILL_WIDTH, 
                        height: PILL_HEIGHT 
                    }}
                 >
                     {/* Icon bubble */}
                     <div className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center shrink-0 transition-all duration-700 mr-4 border-[6px] shadow-sm",
                        isActive ? `bg-${themeColor}-500 text-white border-white scale-110` : 
                        isPast ? `bg-${themeColor}-50 text-${themeColor}-500 border-white` : 
                        "bg-white text-slate-300 border-white"
                     )}>
                         {isPast && !isActive ? (
                            <CheckCircle2 className="w-8 h-8" />
                         ) : (
                            <stage.icon className="w-8 h-8" />
                         )}
                     </div>

                     <div className="flex flex-col justify-center overflow-hidden">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={cn(
                                "text-[14px] font-black",
                                isActive ? `text-${themeColor}-600` : "text-slate-400"
                            )}>
                                {stage.id < 10 ? `0${stage.id}` : stage.id}
                            </span>
                            <span className={cn(
                                "text-[9px] font-black uppercase tracking-widest leading-none",
                                isActive ? "text-slate-800" : "text-slate-400 opacity-60"
                            )}>
                                {stage.phase.split(' • ')[1]}
                            </span>
                        </div>
                        <h5 className={cn(
                            "text-[15px] font-black leading-tight transition-all",
                            isActive ? "text-slate-900" : "text-slate-600"
                        )}>
                            {stage.title}
                        </h5>

                        <motion.div 
                          initial={false}
                          animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -5 }}
                          className={cn("text-[9px] font-black uppercase tracking-tighter mt-1 flex items-center gap-1", `text-${themeColor}-500`)}
                        >
                          <Zap className="w-3 h-3 fill-current" /> Active Stage
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
