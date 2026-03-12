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
    <div className="glass p-4 rounded-2xl space-y-3">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-black-700 text-sm">{name}</span>
        <span className="text-primary-700 text-xs font-bold">{score}%</span>
      </div>
      <div className="h-1.5 w-full bg-greys-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          className="h-full bg-primary-500"
        />
      </div>
      <p className="text-[11px] text-black-500 leading-relaxed">{feedback}</p>
    </div>
  );
}
