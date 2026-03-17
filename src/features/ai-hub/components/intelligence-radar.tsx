"use client";

import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Sparkles, Target, Zap, ShieldCheck } from "lucide-react";

interface IntelligenceRadarProps {
  step: number;
  dataPoints: number;
  label?: string;
}

export function IntelligenceRadar({ step, dataPoints, label }: IntelligenceRadarProps) {
  return (
    <div className="relative flex flex-col items-center justify-center py-20">
      {/* Outer Rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[1, 2, 3].map((r) => (
          <motion.div
            key={r}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 4 + r,
              ease: "easeInOut" 
            }}
            className="absolute border border-primary-500/20 rounded-full"
            style={{ width: `${r * 180}px`, height: `${r * 180}px` }}
          />
        ))}
      </div>

      {/* Center Intelligence Core */}
      <div className="relative z-10">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="absolute -inset-8 border border-dashed border-primary-400/30 rounded-full"
        />
        
        <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(20,184,166,0.3)] relative group">
          <BrainCircuit className="w-16 h-16 text-white" />
          <motion.div 
            className="absolute -top-2 -right-2 bg-white text-black font-black text-[10px] px-2 py-0.5 rounded-full shadow-lg"
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            LIVE
          </motion.div>
        </div>
      </div>

      {/* Dynamic Data Labels */}
      <div className="mt-16 text-center space-y-2 relative z-10">
        <motion.p 
          key={label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white font-black text-2xl uppercase tracking-[0.2em]"
        >
          {label || "System Scanning"}
        </motion.p>
        <div className="flex items-center justify-center gap-4 text-primary-400 font-bold text-xs">
          <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> AI READY</span>
          <span className="w-1 h-1 bg-white/20 rounded-full" />
          <span>{dataPoints} DATA POINTS LOADED</span>
        </div>
      </div>

      {/* Rotating Nodes (Selected Schools/Areas) */}
      <div className="absolute inset-0 pointer-events-none">
          {[Sparkles, Target, ShieldCheck].map((Icon, i) => (
              <motion.div
                key={i}
                className="absolute"
                animate={{ 
                    rotate: [0, 360],
                    x: [Math.cos(i) * 200, Math.cos(i + 0.1) * 200],
                    y: [Math.sin(i) * 200, Math.sin(i + 0.1) * 200]
                }}
                transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                style={{ left: '50%', top: '50%' }}
              >
                  <div className="w-8 h-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center text-primary-400">
                      <Icon className="w-4 h-4" />
                  </div>
              </motion.div>
          ))}
      </div>
    </div>
  );
}
