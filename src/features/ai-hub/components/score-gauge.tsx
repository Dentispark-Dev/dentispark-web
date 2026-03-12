"use client";

import React from "react";
import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
}

export function ScoreGauge({ score }: ScoreGaugeProps) {
  return (
    <div className="md:col-span-1 glass-card p-8 rounded-3xl border-primary-200 flex flex-col items-center justify-center text-center space-y-4">
      <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">Global Score</span>
      <div className="relative h-48 w-48 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-greys-200" />
          <motion.circle 
            initial={{ strokeDashoffset: 552 }}
            animate={{ strokeDashoffset: 552 - (552 * score) / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="552" className="text-primary-500" 
          />
        </svg>
        <span className="absolute text-5xl font-black text-black-800">{score}</span>
      </div>
      <div className="flex items-center gap-2 text-green-600 font-semibold">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        Strong Potential
      </div>
    </div>
  );
}
