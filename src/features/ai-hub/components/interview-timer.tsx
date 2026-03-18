"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface InterviewTimerProps {
  durationSeconds: number;
  onComplete?: () => void;
  isActive: boolean;
}

export function InterviewTimer({ durationSeconds, onComplete, isActive }: InterviewTimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);

  useEffect(() => {
    setTimeLeft(durationSeconds);
  }, [durationSeconds]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && onComplete) {
      onComplete();
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, onComplete]);

  const percentage = (timeLeft / durationSeconds) * 100;
  const isUrgent = timeLeft <= 30;
  const isWarning = timeLeft <= 60 && timeLeft > 30;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full transform -rotate-90">
          <circle 
            cx="80" cy="80" r="72" 
            stroke="currentColor" strokeWidth="8" fill="transparent" 
            className="text-gray-100" 
          />
          <motion.circle 
            cx="80" cy="80" r="72" 
            stroke="currentColor" strokeWidth="8" fill="transparent" 
            strokeDasharray="452.39"
            animate={{ strokeDashoffset: 452.39 - (452.39 * percentage) / 100 }}
            transition={{ duration: 1, ease: "linear" }}
            className={cn(
              "transition-colors duration-500",
              isUrgent ? "text-red-500" : isWarning ? "text-amber-500" : "text-emerald-500"
            )}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn(
                "text-4xl font-sora font-bold tabular-nums transition-colors duration-500",
                isUrgent ? "text-red-600 animate-pulse" : "text-gray-900"
            )}>
                {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time Left</span>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}
