"use client";

import React from "react";
import { motion } from "framer-motion";

interface FeedbackCardProps {
  name: string;
  score: number;
  feedback: string;
}

export function FeedbackCard({ name, score, feedback }: FeedbackCardProps) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-50 shadow-sm space-y-3">
      <div className="flex justify-between items-center">
        <span className="font-sora font-semibold text-gray-900 text-sm">{name}</span>
        <span className="text-emerald-700 text-xs font-bold">{score}%</span>
      </div>
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          className="h-full bg-emerald-500"
        />
      </div>
      <p className="text-[11px] text-gray-500 leading-relaxed font-medium">{feedback}</p>
    </div>
  );
}
