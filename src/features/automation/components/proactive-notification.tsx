"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, Bell } from "lucide-react";
import { useField } from "@/src/providers/field-provider";
import { cn } from "@/src/lib/utils";
import Link from "next/link";

interface AIRecommendation {
  priority: "high" | "low" | "medium";
  nextStep: string;
  motivationPrompt: string;
}

export function ProactiveNotification() {
  const { activeField } = useField();
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const response = await fetch("/api/ai/automation/recommendation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            currentStage: "Personal Statement Draft", 
            targetUniversities: ["King's College London", "UCL"],
            field: activeField,
            recentActivity: "Completed Essay Review"
          }),
        });
        const data = await response.json();
        setRecommendation(data);
        setIsVisible(true);
      } catch (error) {
        console.error(error);
      }
    };

    const timer = setTimeout(fetchRecommendation, 3000);
    return () => clearTimeout(timer);
  }, [activeField]);

  return (
    <AnimatePresence>
      {isVisible && recommendation && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-4"
        >
          <div className="glass-card bg-black-900/95 backdrop-blur-xl border-primary-500/30 p-4 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] flex items-center justify-between gap-6 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-transparent pointer-events-none" />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-900/40">
                <Bell className="w-5 h-5 animate-swing" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary-400">Co-pilot Suggestion</span>
                    <div className={cn(
                        "px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase",
                        recommendation.priority === "high" ? "bg-red-500/20 text-red-400" : "bg-primary-500/20 text-primary-400"
                    )}>
                        {recommendation.priority} Priority
                    </div>
                </div>
                <h4 className="text-white font-bold text-sm leading-tight">{recommendation.nextStep}</h4>
                <p className="text-greys-400 text-[10px] font-medium mt-0.5">{recommendation.motivationPrompt}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 relative z-10">
              <Link 
                href="/ai-hub"
                className="h-10 px-6 bg-white rounded-xl text-black-900 text-xs font-extrabold flex items-center gap-2 hover:bg-primary-50 transition-all active:scale-95 shadow-xl"
              >
                Go to Hub <ArrowRight className="w-3 h-3" />
              </Link>
              <button 
                onClick={() => setIsVisible(false)}
                className="w-10 h-10 rounded-xl bg-white/10 text-white/40 hover:text-white hover:bg-white/20 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
