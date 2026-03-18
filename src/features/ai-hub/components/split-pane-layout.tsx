"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LelandSplitPaneProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  step: number;
}

export function LelandSplitPane({ leftContent, rightContent, step }: LelandSplitPaneProps) {
  // Define dynamic background colors based on step
  const getGlowColor = (s: number) => {
    switch(s) {
      case 0: return "rgba(16, 185, 129, 0.08)"; // Emerald
      case 1: return "rgba(59, 130, 246, 0.08)"; // Blue
      case 2: return "rgba(139, 92, 246, 0.08)"; // Purple
      default: return "rgba(16, 185, 129, 0.08)";
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col lg:flex-row bg-white overflow-hidden z-[50]">
      {/* Dynamic Background Glow System */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            backgroundColor: getGlowColor(step),
            scale: [1, 1.1, 1],
            x: [0, 50, 0],
            y: [0, -50, 0]
          }}
          transition={{ 
            backgroundColor: { duration: 1.5 },
            scale: { repeat: Infinity, duration: 10, ease: "easeInOut" },
            x: { repeat: Infinity, duration: 15, ease: "easeInOut" },
            y: { repeat: Infinity, duration: 12, ease: "easeInOut" }
          }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] blur-[160px] rounded-full opacity-60"
        />
        <motion.div 
          animate={{ 
            backgroundColor: step === 1 ? "rgba(236, 72, 153, 0.05)" : "rgba(30, 64, 175, 0.05)",
            scale: [1, 1.2, 1],
            x: [0, -100, 0],
            y: [0, 100, 0]
          }}
          transition={{ 
            backgroundColor: { duration: 1.5 },
            scale: { repeat: Infinity, duration: 14, ease: "easeInOut" },
            x: { repeat: Infinity, duration: 20, ease: "easeInOut" },
            y: { repeat: Infinity, duration: 18, ease: "easeInOut" }
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] blur-[140px] rounded-full opacity-40"
        />
        
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      {/* Left Pane: Interaction Area */}
      <motion.div 
        className="w-full lg:w-1/2 h-full relative z-10 flex flex-col justify-center px-8 lg:px-24 py-12 overflow-y-auto border-r border-gray-100 bg-white/40 backdrop-blur-sm"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-xl w-full mx-auto">
          {leftContent}
        </div>
      </motion.div>

      {/* Right Pane: Trust & Visuals */}
      <motion.div 
        className="hidden lg:flex lg:w-1/2 h-full relative z-10 items-center justify-center p-12 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      >
        {/* Depth effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent pointer-events-none" />
        <div className="max-w-2xl w-full">
          {rightContent}
        </div>
      </motion.div>
    </div>
  );
}
