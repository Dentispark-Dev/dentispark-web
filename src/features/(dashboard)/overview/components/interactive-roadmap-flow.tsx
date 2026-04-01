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

interface StageData {
  id: number;
  phase: string;
  title: string;
  date: string;
  icon: LucideIcon;
  url: string;
  isCurrent?: boolean;
}

// 11 Applicant Stages with Real Tool Mappings
const STAGES: StageData[] = [
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

// Mathematical geometry for the Central Hub & Radial Donut
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

// Derived layout calculations for Left/Right columns matching user's reference infographic
const PILL_WIDTH = 280;
const PILL_HEIGHT = 86;

const PILL_POSITIONS = [
  // Right side (Indices 0 to 5) - Top to Bottom
  { x: 880, y: 120, connectSide: "left" },  // 0
  { x: 880, y: 250, connectSide: "left" },  // 1
  { x: 880, y: 380, connectSide: "left" },  // 2
  { x: 880, y: 510, connectSide: "left" },  // 3
  { x: 880, y: 640, connectSide: "left" },  // 4
  { x: 880, y: 770, connectSide: "left" },  // 5

  // Left side (Indices 6 to 10) - Bottom to Top to avoid crossing SVG lines
  { x: 40, y: 740, connectSide: "right" },  // 6
  { x: 40, y: 590, connectSide: "right" },  // 7
  { x: 40, y: 440, connectSide: "right" },  // 8
  { x: 40, y: 290, connectSide: "right" },  // 9
  { x: 40, y: 140, connectSide: "right" },  // 10
];

// Helper to calculate the perfect midpoint of each donut segment to attach line
function getSegmentCenterPoint(index: number) {
  // SVG circles draw starting from Math.PI / 2 (right side 0 deg), but stroke-dasharray rotated starts from top (-90deg)
  // We offset by -90 to start top-center, add the step, add half step to get to center of arc.
  const angleDeg = (index * ANGLE_STEP) - 90 + (ANGLE_STEP / 2);
  const angleRad = (angleDeg * Math.PI) / 180;
  
  // Radius + a bit of padding so line starts just outside the thick stroke
  const rOuter = RADIUS + 20; 
  return {
    x: CX + rOuter * Math.cos(angleRad),
    y: CY + rOuter * Math.sin(angleRad),
    angleDeg
  };
}

export function InteractiveRoadmapFlow() {
  const router = useRouter();
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  
  const currentIndex = STAGES.findIndex(s => s.isCurrent);
  
  // What to display in the massive central hub 
  const displayStage = hoveredNode !== null 
    ? STAGES[hoveredNode] 
    : STAGES[currentIndex];

  return (
    <div className="w-full bg-white rounded-[3rem] p-8 lg:p-14 border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
      
      {/* Header */}
      <div className="mb-0 flex items-center justify-between relative z-10 text-center mx-auto md:text-left">
        <div>
            <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-emerald-600">Step-by-Step Template</h3>
            <h4 className="text-4xl font-black text-slate-900 tracking-tight mt-1">11 Steps Infographic</h4>
            <p className="text-slate-500 font-medium text-sm mt-2">
                Hover any block to highlight its segment on the central radial hub.
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
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="glow-orange" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Connecting Lines (SVG paths from segments to pills) */}
            {STAGES.map((stage, i) => {
               const pos = PILL_POSITIONS[i];
               const startPoint = getSegmentCenterPoint(i);
               
               // Outer Point: Edge of the HTML pill
               const endX = pos.connectSide === "left" ? pos.x : pos.x + PILL_WIDTH;
               const endY = pos.y + (PILL_HEIGHT / 2);
               
               // Determine thematic colors per graphic block
               const isRow1 = i < 4;
               const isRow2 = i >= 4 && i < 8;
               const colorClass = isRow1 ? "#34d399" : (isRow2 ? "#60a5fa" : "#fbbf24");
               
               // Simple quadratic bezier curve for aesthetic connection
               const midX = (startPoint.x + endX) / 2;
               const controlY = startPoint.y; 
               
               const d = `M ${startPoint.x} ${startPoint.y} Q ${midX} ${controlY}, ${endX} ${endY}`;

               const isHovered = hoveredNode === i;
               const isPast = i <= currentIndex && hoveredNode === null;
               const isDim = hoveredNode !== null && !isHovered;

               return (
                  <motion.path
                     key={`line-${i}`}
                     d={d}
                     stroke={colorClass}
                     strokeWidth="2"
                     strokeDasharray="4 4"
                     fill="none"
                     initial={{ pathLength: 1, opacity: 0.2 }}
                     animate={{
                        opacity: isHovered ? 1 : (isPast ? 0.6 : (isDim ? 0.05 : 0.2)),
                        strokeWidth: isHovered ? 3 : 2,
                        strokeDasharray: isHovered ? "0 0" : "4 4"
                     }}
                     transition={{ duration: 0.3 }}
                  />
               );
            })}

            {/* Segmented Donut SVG */}
            <circle cx={CX} cy={CY} r={RADIUS + 15} stroke="#f8fafc" strokeWidth="46" fill="none" />
            
            {STAGES.map((stage, i) => {
              const rotation = (i * ANGLE_STEP) - 90; // Start at 12 o'clock (-90deg)
              
              // Color buckets mapping exactly identical to 8 Steps infographics block coloring
              const isRow1 = i < 4;
              const isRow2 = i >= 4 && i < 8;
              const tailwindColor = isRow1 ? "#10b981" : (isRow2 ? "#3b82f6" : "#f59e0b");
              const glowFilter = isRow1 ? "url(#glow-emerald)" : (isRow2 ? "url(#glow-blue)" : "url(#glow-orange)");

              const isHovered = hoveredNode === i;
              const isDim = hoveredNode !== null && !isHovered;
              const isPast = i <= currentIndex;

              return (
                 <motion.circle 
                    key={`seg-${i}`}
                    cx={CX} 
                    cy={CY} 
                    r={RADIUS} 
                    fill="none"
                    stroke={tailwindColor}
                    strokeWidth="32"
                    strokeDasharray={`${DASH_LENGTH} ${CIRCUMFERENCE}`}
                    strokeLinecap="round"
                    transform={`rotate(${rotation} ${CX} ${CY})`}
                    className="transition-all duration-300 origin-center cursor-pointer"
                    onMouseEnter={() => setHoveredNode(i)}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{ filter: isHovered ? glowFilter : "none" }}
                    animate={{ 
                       strokeWidth: isHovered ? 40 : 32,
                       opacity: isHovered ? 1 : (isDim ? 0.2 : (isPast ? 1 : 0.6))
                    }}
                 />
              )
            })}
          </svg>

          {/* HTML Overlay - Central Radial Hub Engine */}
          <motion.div 
             animate={{ rotate: [0, 360] }}
             transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
             className="absolute rounded-full border-[1px] border-slate-100 opacity-20 pointer-events-none"
             style={{ 
               left: CX - (RADIUS + 80), 
               top: CY - (RADIUS + 80), 
               width: (RADIUS + 80) * 2, 
               height: (RADIUS + 80) * 2 
             }}
          />

          <div 
             className="absolute flex flex-col items-center justify-center text-center rounded-full bg-white shadow-[0_0_80px_rgba(0,0,0,0.08)] border-[12px] border-slate-50 transition-all duration-500 ease-out z-40"
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
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center justify-center p-4"
                 >
                     <motion.div 
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-sm"
                     >
                        <displayStage.icon className="w-7 h-7" />
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
                        className="group flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95"
                     >
                        Open Tool <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                     </button>
                 </motion.div>
             </AnimatePresence>
          </div>

          {/* HTML Overlay - Splitting 11 Spoke Pillars */}
          {STAGES.map((stage, i) => {
             const pos = PILL_POSITIONS[i];
             
             const isRow1 = i < 4;
             const isRow2 = i >= 4 && i < 8;
             const themeColor = isRow1 ? "emerald" : (isRow2 ? "blue" : "orange");
             
             const isHovered = hoveredNode === i;
             const isDim = hoveredNode !== null && !isHovered;
             const isPast = i <= currentIndex;

             return (
                 <div 
                    key={`pill-${stage.id}`}
                    onMouseEnter={() => setHoveredNode(i)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => router.push(stage.url)}
                    className={cn(
                        "absolute flex items-center p-2 pr-5 rounded-full border-[1px] transition-all duration-500 cursor-pointer group",
                        isHovered ? `bg-white border-${themeColor}-400 shadow-2xl shadow-${themeColor}-400/20 scale-[1.05] z-50` : 
                        isPast ? `bg-white border-slate-200 hover:border-${themeColor}-300 hover:shadow-lg shadow-slate-200/40` : 
                        `bg-slate-50 border-slate-100 hover:bg-white hover:border-${themeColor}-200 hover:shadow-lg shadow-slate-200/20`,
                        isDim && "opacity-30 grayscale blur-[0.5px]"
                    )}
                    style={{ 
                        left: pos.x, 
                        top: pos.y, 
                        width: PILL_WIDTH, 
                        height: PILL_HEIGHT 
                    }}
                 >
                     {/* Pill Icon Bubble - Exact reference style */}
                     <div className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 mr-4 border-[6px] shadow-sm",
                        isHovered ? `bg-${themeColor}-500 text-white border-white scale-110 rotate-12` : 
                        isPast ? `bg-${themeColor}-50 text-${themeColor}-500 border-white` : 
                        "bg-white text-slate-300 border-white group-hover:bg-slate-50"
                     )}>
                         {isPast && !isHovered ? (
                            <CheckCircle2 className="w-7 h-7" />
                         ) : (
                            <stage.icon className="w-7 h-7" />
                         )}
                     </div>

                     {/* Pill Core Text */}
                     <div className="flex flex-col justify-center overflow-hidden">
                        <div className="flex items-center gap-1.5 mb-1">
                            <span className={cn(
                                "text-[14px] font-black",
                                isHovered ? `text-${themeColor}-600` : "text-slate-400"
                            )}>
                                {stage.id < 10 ? `0${stage.id}` : stage.id}
                            </span>
                            <span className={cn(
                                "text-[8px] font-black uppercase tracking-widest leading-none",
                                isHovered ? "text-slate-600" : "text-slate-300"
                            )}>
                                {stage.phase.split(' • ')[1]}
                            </span>
                        </div>
                        <h5 className={cn(
                            "text-[14px] font-black leading-tight transition-colors transition-all",
                            isHovered ? "text-slate-900" : "text-slate-600"
                        )}>
                            {stage.title}
                        </h5>
                        
                        {/* Interactive Hint */}
                        <motion.div 
                            initial={false}
                            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -5 }}
                            className={cn(
                                "text-[9px] font-black uppercase tracking-tighter mt-1 flex items-center gap-1",
                                `text-${themeColor}-500`
                            )}
                        >
                            <Zap className="w-3 h-3 fill-current" /> Initialize {stage.title.split(' ')[0]}
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
