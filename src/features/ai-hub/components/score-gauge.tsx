"use client";

import React from "react";
import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
}

export function ScoreGauge({ score }: ScoreGaugeProps) {
  return (
    <div className="md:col-span-1 p-8 rounded-3xl border border-gray-100 flex flex-col items-center justify-center text-center space-y-6 bg-white shadow-sm">
      <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest pl-1">Global Score</span>
      <div className="relative h-48 w-48 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
          <motion.circle 
            initial={{ strokeDashoffset: 552 }}
            animate={{ strokeDashoffset: 552 - (552 * score) / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="552" className="text-emerald-500" 
          />
        </svg>
        <span className="absolute text-5xl font-sora font-bold text-gray-900">{score}</span>
      </div>
      <div className="flex items-center gap-2 text-emerald-600 font-sora font-semibold">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        Strong Potential
      </div>
    </div>
  );
}
