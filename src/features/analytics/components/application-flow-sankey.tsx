"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/src/lib/utils";

// Define the flow data structure for easier interactivity
const NODES = [
  { id: "apps", label: "Applications", value: 47, x: 50, y: 200, color: "text-slate-900", bg: "bg-slate-100" },
  { id: "interviews", label: "Interviews", value: 16, x: 415, y: 55, color: "text-emerald-900", bg: "bg-emerald-100" },
  { id: "rejected", label: "Rejected/No Answer", value: 30, x: 415, y: 220, color: "text-orange-900", bg: "bg-orange-100" },
  { id: "waitlist_interview", label: "Interview Waitlist", value: 1, x: 415, y: 370, color: "text-rose-900", bg: "bg-rose-100" },
  { id: "attended", label: "Attended", value: 15, x: 615, y: 55, color: "text-teal-900", bg: "bg-teal-100" },
  { id: "declined", label: "Declined", value: 1, x: 580, y: 175, color: "text-emerald-900", bg: "bg-emerald-100" },
  { id: "offers", label: "Offers", value: 9, x: 810, y: 30, color: "text-amber-900", bg: "bg-amber-100" },
  { id: "waitlist", label: "Waitlist", value: 2, x: 810, y: 100, color: "text-purple-900", bg: "bg-purple-100" },
  { id: "rejection", label: "Rejection", value: 3, x: 810, y: 150, color: "text-pink-900", bg: "bg-pink-100" },
  { id: "no_response", label: "No response", value: 1, x: 810, y: 200, color: "text-slate-900", bg: "bg-slate-100" },
  { id: "accepted", label: "Accepted", value: 1, x: 960, y: 30, color: "text-emerald-900", bg: "bg-emerald-100" },
];

const PATHS = [
  { id: "p1", source: "apps", target: "interviews", d: "M 150 150 C 300 150, 250 80, 400 80", stroke: "url(#gradBlue)", width: 60, hoverColor: "#34d399" },
  { id: "p2", source: "apps", target: "rejected", d: "M 150 210 C 250 210, 250 260, 400 260", stroke: "url(#gradOrange)", width: 110, hoverColor: "#fb923c" },
  { id: "p3", source: "apps", target: "waitlist_interview", d: "M 150 270 C 200 270, 250 380, 400 380", stroke: "url(#gradRed)", width: 10, hoverColor: "#f43f5e" },
  { id: "p4", source: "interviews", target: "declined", d: "M 450 100 C 500 100, 500 180, 550 180", stroke: "url(#gradGreen)", width: 8, hoverColor: "#10b981" },
  { id: "p5", source: "interviews", target: "attended", d: "M 450 70 C 520 70, 520 70, 600 70", stroke: "url(#gradTeal)", width: 50, hoverColor: "#14b8a6" },
  { id: "p6", source: "attended", target: "offers", d: "M 650 60 C 700 60, 750 40, 800 40", stroke: "url(#gradYellow)", width: 35, hoverColor: "#fbbf24" },
  { id: "p7", source: "attended", target: "waitlist", d: "M 650 75 C 700 75, 750 110, 800 110", stroke: "url(#gradPurple)", width: 10, hoverColor: "#a855f7" },
  { id: "p8", source: "attended", target: "rejection", d: "M 650 85 C 700 85, 750 160, 800 160", stroke: "url(#gradPink)", width: 12, hoverColor: "#ec4899" },
  { id: "p9", source: "attended", target: "no_response", d: "M 650 90 C 700 90, 750 210, 800 210", stroke: "url(#gradBrown)", width: 5, hoverColor: "#b45309" },
  { id: "p10", source: "offers", target: "accepted", d: "M 850 35 C 900 35, 930 25, 950 25", stroke: "url(#gradGrey)", width: 5, hoverColor: "#64748b" },
];

export function ApplicationFlowSankey() {
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-[400px] bg-slate-50 rounded-[2.5rem] animate-pulse" />;

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 0.6,
      transition: { duration: 1.5, ease: "easeOut" }
    }
  };

  const handleNodeClick = (node: any) => {
    toast.success(`${node.value} ${node.label}`, {
      description: `Viewing details for ${node.label} phase.`
    });
  };

  // Helper to determine if a path should be highlighted based on hovered node
  const isPathActive = (path: any) => {
    if (hoveredPath) return hoveredPath === path.id;
    if (hoveredNode) return path.source === hoveredNode || path.target === hoveredNode;
    return true; // if nothing hovered, all active
  };

  return (
    <div className="w-full bg-white rounded-[3rem] p-10 lg:p-14 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 blur-3xl rounded-full -z-10 transition-transform duration-700 group-hover:scale-150" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-50/50 blur-3xl rounded-full -z-10 transition-transform duration-700 group-hover:scale-150" />

      <div className="mb-4 flex items-center justify-between">
        <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Applicant Roadmap</h3>
            <h4 className="text-3xl font-black text-slate-900 tracking-tight">Application Flow</h4>
        </div>
        <div className="text-xs font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
            Hover over paths & points
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] h-[450px] relative mt-8">
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 1000 450" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-sm"
          >
            {/* SVG Definitions */}
            <defs>
              <linearGradient id="gradBlue" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
              <linearGradient id="gradOrange" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#fb923c" />
              </linearGradient>
              <linearGradient id="gradRed" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
              <linearGradient id="gradGreen" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="gradTeal" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>
              <linearGradient id="gradYellow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
              <linearGradient id="gradPurple" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <linearGradient id="gradPink" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
              <linearGradient id="gradBrown" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id="gradGrey" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Paths */}
            {PATHS.map((path) => {
              const active = isPathActive(path);
              const isHovered = hoveredPath === path.id;

              return (
                <motion.path 
                  key={path.id}
                  d={path.d}
                  stroke={isHovered ? path.hoverColor : path.stroke}
                  strokeWidth={path.width}
                  fill="none" 
                  variants={pathVariants}
                  initial="hidden"
                  animate={{ 
                    pathLength: 1, 
                    opacity: active ? (isHovered ? 1 : 0.6) : 0.1 
                  }}
                  transition={{ duration: 0.3 }}
                  onMouseEnter={() => setHoveredPath(path.id)}
                  onMouseLeave={() => setHoveredPath(null)}
                  className="cursor-pointer transition-colors duration-300"
                  style={{ filter: isHovered ? "url(#glow)" : "none" }}
                />
              )
            })}
          </svg>
          
          {/* HTML Overlay for Nodes (Points) */}
          <div className="absolute inset-0 pointer-events-none">
            {NODES.map((node) => {
               const isHovered = hoveredNode === node.id;
               const inactive = (hoveredNode && !isHovered) || (hoveredPath !== null && !PATHS.find(p => p.id === hoveredPath && (p.source === node.id || p.target === node.id)));

               return (
                  <motion.div 
                    key={node.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: inactive ? 0.3 : 1, 
                      scale: isHovered ? 1.05 : 1,
                      zIndex: isHovered ? 50 : 10
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute pointer-events-auto"
                    style={{ left: node.x, top: node.y }}
                  >
                    <button 
                      className={cn(
                        "group relative flex flex-col items-start focus:outline-none transition-all duration-300",
                        isHovered && "drop-shadow-lg"
                      )}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onClick={() => handleNodeClick(node)}
                    >
                      {/* Clickable Point Indicator */}
                      <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-4 border-emerald-500 shadow-md group-hover:scale-150 transition-transform duration-300 group-hover:border-emerald-400 group-hover:bg-emerald-50" />
                      
                      <div className={cn("px-4 py-2 rounded-2xl border flex items-baseline gap-3 transition-colors duration-300", node.bg, isHovered ? "border-emerald-300 bg-white" : "border-transparent")}>
                        <span className={cn("text-2xl font-black", node.color)}>{node.value}</span>
                        <span className="text-xs font-bold text-slate-600 whitespace-nowrap">{node.label}</span>
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
