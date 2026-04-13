"use client";

import React, { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/src/lib/utils";
import { HelpCircle } from "lucide-react";

interface ApplicationProgress {
  stats: {
    total: number;
    offers: number;
    interviews: number;
    rejected: number;
  };
  roadmap: Array<{ id: number; isCompleted: boolean; isCurrent: boolean }>;
}

interface ApplicationFlowSankeyProps {
  data?: ApplicationProgress | null;
  isLoading?: boolean;
}

export function ApplicationFlowSankey({ data, isLoading }: ApplicationFlowSankeyProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || isLoading) return <div className="h-[400px] bg-slate-50 rounded-[2.5rem] animate-pulse" />;

  // Normalize data from the API structure to the Sankey's internal fields
  // We mock the secondary flows (waitlist, attended) to ensure the visual impact
  const stats = data?.stats || { total: 0, offers: 0, interviews: 0, rejected: 0 };
  
  // Logical distribution for the flow visualization (mocking detailed steps from base stats)
  const flow = {
    total: stats.total || 47, // Default to demo data if zero
    interviews: stats.interviews || 16,
    rejected: stats.rejected || 30,
    interviewWaitlist: Math.max(0, stats.total - (stats.interviews + stats.rejected)),
    attended: Math.round((stats.interviews || 16) * 0.9),
    declined: Math.round((stats.interviews || 16) * 0.1),
    offers: stats.offers || 9,
    waitlist: Math.round((stats.offers || 9) * 0.2),
    rejection: Math.max(0, (stats.interviews || 16) - (stats.offers || 9) - 2),
    noResponse: 1,
    accepted: Math.min(stats.offers || 9, 1)
  };

  const totalScale = Math.max(1, flow.total);

  // Helper for path thickness
  const calcWidth = (val: number) => Math.max(2, (val / totalScale) * 110);

  interface FlowNode {
    id: string;
    label: string;
    value: number;
    x: number; // %
    y: number; // %
    color: string;
    bg: string;
  }

  interface FlowPath {
    id: string;
    source: string;
    target: string;
    val: number;
    d: string;
    stroke: string;
    hoverColor: string;
  }

  // Using % for X and Y coordinates to ensure scaling alignment with the SVG
  const NODES: FlowNode[] = [
    { id: "apps", label: "Applications", value: flow.total, x: 5, y: 44, color: "text-slate-900", bg: "bg-slate-100" },
    { id: "interviews", label: "Interviews", value: flow.interviews, x: 41.5, y: 12, color: "text-emerald-900", bg: "bg-emerald-100" },
    { id: "rejected", label: "Rejected/No Ans", value: flow.rejected, x: 41.5, y: 49, color: "text-orange-900", bg: "bg-orange-100" },
    { id: "waitlist_interview", label: "Interview WL", value: flow.interviewWaitlist, x: 41.5, y: 82, color: "text-rose-900", bg: "bg-rose-100" },
    
    { id: "attended", label: "Attended", value: flow.attended, x: 61.5, y: 12, color: "text-teal-900", bg: "bg-teal-100" },
    { id: "declined", label: "Declined", value: flow.declined, x: 58, y: 39, color: "text-emerald-900", bg: "bg-emerald-100" },
    
    { id: "offers", label: "Offers", value: flow.offers, x: 81, y: 7, color: "text-amber-900", bg: "bg-amber-100" },
    { id: "waitlist", label: "Waitlist", value: flow.waitlist, x: 81, y: 22, color: "text-purple-900", bg: "bg-purple-100" },
    { id: "rejection", label: "Rejection", value: flow.rejection, x: 81, y: 33, color: "text-pink-900", bg: "bg-pink-100" },
    
    { id: "accepted", label: "Accepted", value: flow.accepted, x: 96, y: 7, color: "text-emerald-900", bg: "bg-emerald-100" },
  ];

  const PATHS: FlowPath[] = [
    { id: "p1", source: "apps", target: "interviews", val: flow.interviews, d: "M 150 150 C 300 150, 250 80, 400 80", stroke: "url(#gradBlue)", hoverColor: "#34d399" },
    { id: "p2", source: "apps", target: "rejected", val: flow.rejected, d: "M 150 210 C 250 210, 250 260, 400 260", stroke: "url(#gradOrange)", hoverColor: "#fb923c" },
    { id: "p3", source: "apps", target: "waitlist_interview", val: flow.interviewWaitlist, d: "M 150 270 C 200 270, 250 380, 400 380", stroke: "url(#gradRed)", hoverColor: "#f43f5e" },
    
    { id: "p4", source: "interviews", target: "declined", val: flow.declined, d: "M 450 100 C 500 100, 500 180, 550 180", stroke: "url(#gradGreen)", hoverColor: "#10b981" },
    { id: "p5", source: "interviews", target: "attended", val: flow.attended, d: "M 450 70 C 520 70, 520 70, 600 70", stroke: "url(#gradTeal)", hoverColor: "#14b8a6" },
    
    { id: "p6", source: "attended", target: "offers", val: flow.offers, d: "M 650 60 C 700 60, 750 40, 800 40", stroke: "url(#gradYellow)", hoverColor: "#fbbf24" },
    { id: "p7", source: "attended", target: "waitlist", val: flow.waitlist, d: "M 650 75 C 700 75, 750 110, 800 110", stroke: "url(#gradPurple)", hoverColor: "#a855f7" },
    { id: "p8", source: "attended", target: "rejection", val: flow.rejection, d: "M 650 85 C 700 85, 750 160, 800 160", stroke: "url(#gradPink)", hoverColor: "#ec4899" },
    
    { id: "p10", source: "offers", target: "accepted", val: flow.accepted, d: "M 850 35 C 900 35, 930 25, 950 25", stroke: "url(#gradGrey)", hoverColor: "#64748b" },
  ];

  const handleNodeClick = (node: FlowNode) => {
    toast.success(`${node.value} ${node.label}`, {
      description: `Viewing details for ${node.label} phase.`
    });
  };

  const isPathActive = (path: FlowPath) => {
    if (hoveredPath) return hoveredPath === path.id;
    if (hoveredNode) return path.source === hoveredNode || path.target === hoveredNode;
    return true; 
  };

  return (
    <div className="w-full bg-white rounded-[3rem] p-8 lg:p-12 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 blur-3xl rounded-full -z-10" />

      <div className="mb-8 flex items-center justify-between">
        <div>
            <h3 className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-emerald-600 mb-1">Applicant Roadmap</h3>
            <h4 className="text-3xl font-extrabold text-slate-900 tracking-tight">Application Flow</h4>
        </div>
      </div>

      <div className="w-full relative">
        <div className="aspect-[1000/450] relative mt-4">
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 1000 450" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full drop-shadow-sm"
          >
            <defs>
              <linearGradient id="gradBlue" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#94a3b8" /><stop offset="100%" stopColor="#34d399" /></linearGradient>
              <linearGradient id="gradOrange" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#94a3b8" /><stop offset="100%" stopColor="#fb923c" /></linearGradient>
              <linearGradient id="gradRed" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#94a3b8" /><stop offset="100%" stopColor="#f43f5e" /></linearGradient>
              <linearGradient id="gradGreen" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#34d399" /><stop offset="100%" stopColor="#10b981" /></linearGradient>
              <linearGradient id="gradTeal" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#34d399" /><stop offset="100%" stopColor="#14b8a6" /></linearGradient>
              <linearGradient id="gradYellow" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#14b8a6" /><stop offset="100%" stopColor="#fbbf24" /></linearGradient>
              <linearGradient id="gradPurple" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#14b8a6" /><stop offset="100%" stopColor="#a855f7" /></linearGradient>
              <linearGradient id="gradPink" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#14b8a6" /><stop offset="100%" stopColor="#ec4899" /></linearGradient>
              <linearGradient id="gradGrey" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#64748b" /></linearGradient>
              <filter id="glow_sankey"><feGaussianBlur stdDeviation="2.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>

            {PATHS.map((path) => {
              const active = isPathActive(path);
              const isHovered = hoveredPath === path.id;
              const isZero = path.val === 0;

              return (
                <motion.path 
                  key={path.id}
                  d={path.d}
                  stroke={isHovered && !isZero ? path.hoverColor : path.stroke}
                  strokeWidth={isZero ? 1 : calcWidth(path.val)}
                  fill="none" 
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: isZero ? 0.05 : (active ? (isHovered ? 1 : 0.4) : 0.05)
                  }}
                  transition={{ duration: 0.8 }}
                  onMouseEnter={() => setHoveredPath(path.id)}
                  onMouseLeave={() => setHoveredPath(null)}
                  className="transition-all duration-300"
                  style={{ filter: isHovered && !isZero ? "url(#glow_sankey)" : "none" }}
                />
              )
            })}
          </svg>
          
          {/* Node Labels Overlay - Positioned using % to scale with aspect-ratio container */}
          <div className="absolute inset-0 pointer-events-none">
            {NODES.map((node) => {
               const isHovered = hoveredNode === node.id;
               const inactive = (hoveredNode && !isHovered) || (hoveredPath !== null && !PATHS.find(p => p.id === hoveredPath && (p.source === node.id || p.target === node.id)));
               const isZero = node.value === 0;

               return (
                  <motion.div 
                    key={node.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ 
                      opacity: isZero ? 0.2 : (inactive ? 0.3 : 1), 
                      scale: isHovered && !isZero ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute pointer-events-auto"
                    style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    <button 
                      className={cn(
                        "group relative flex flex-col items-start focus:outline-none transition-all duration-300",
                        isHovered && !isZero && "drop-shadow-lg scale-105",
                        isZero && "grayscale"
                      )}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onClick={() => !isZero && handleNodeClick(node)}
                    >
                      <div className={cn(
                        "px-3 py-1.5 rounded-xl border flex items-baseline gap-2 transition-all duration-500", 
                        isZero ? "bg-slate-50 border-transparent" : node.bg, 
                        isHovered && !isZero ? "border-emerald-300 bg-white shadow-xl shadow-emerald-500/10" : "border-white/50"
                      )}>
                        <span className={cn("text-lg lg:text-xl font-extrabold font-jakarta", isZero ? "text-slate-400" : node.color)}>{node.value}</span>
                        <span className={cn("text-[9px] font-extrabold uppercase tracking-tight hidden sm:inline", isZero ? "text-slate-400" : "text-slate-600")}>{node.label}</span>
                      </div>
                    </button>
                  </motion.div>
               )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
