"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, AlertTriangle, Zap } from "lucide-react";
import { useDeadlineManager } from "@/src/features/automation/hooks/use-deadline-manager";
import { cn } from "@/src/lib/utils";

export function DeadlineCountdown() {
  const { timeLeft, mainDeadline } = useDeadlineManager();

  if (!timeLeft) return null;

  const isCritical = timeLeft.days < 7;

  return (
    <div className={cn(
        "glass-card p-10 rounded-[3rem] border-primary-100 bg-white relative overflow-hidden transition-all duration-500",
        isCritical && "border-red-200 shadow-[0_0_40px_rgba(239,68,68,0.1)]"
    )}>
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
            <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                    <Calendar className="w-3 h-3" />
                    Target Milestone
                </div>
                <h2 className="text-4xl font-black text-black-900 tracking-tight">{mainDeadline.title}</h2>
                <p className="text-black-500 font-medium">The official window for all UK Dental Schools is closing soon.</p>
            </div>

            <div className="flex gap-4">
                <div className="flex-1 bg-black-900 text-white p-6 rounded-[2rem] flex flex-col items-center">
                    <span className="text-4xl font-black">{timeLeft.days}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-400">Days Out</span>
                </div>
                <div className="flex-[2] bg-greys-50 border border-greys-100 p-6 rounded-[2rem] flex items-center justify-around">
                    <div className="text-center">
                        <p className="text-2xl font-black text-black-800">{String(timeLeft.hours).padStart(2, '0')}</p>
                        <p className="text-[10px] font-black text-black-400 uppercase">Hrs</p>
                    </div>
                    <div className="w-px h-8 bg-greys-200" />
                    <div className="text-center">
                        <p className="text-2xl font-black text-black-800">{String(timeLeft.minutes).padStart(2, '0')}</p>
                        <p className="text-[10px] font-black text-black-400 uppercase">Min</p>
                    </div>
                    <div className="w-px h-8 bg-greys-200" />
                    <div className="text-center">
                        <p className="text-2xl font-black text-black-800">{String(timeLeft.seconds).padStart(2, '0')}</p>
                        <p className="text-[10px] font-black text-black-400 uppercase">Sec</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="relative">
            {isCritical ? (
                <motion.div 
                    animate={{ scale: [1, 1.02, 1], rotate: [0, 0.5, -0.5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="glass-card p-8 rounded-[2.5rem] bg-red-600 text-white border-none shadow-2xl shadow-red-200 space-y-4"
                >
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h4 className="text-xl font-black">CRITICAL WINDOW</h4>
                        <p className="text-white/80 text-sm font-medium leading-relaxed">Your application must be submitted within 7 days to guarantee consideration for the 2026 entry cycle.</p>
                    </div>
                    <button className="w-full h-14 bg-white text-red-600 rounded-2xl font-black uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center gap-2">
                        Complete Registration
                        <Zap className="w-4 h-4" />
                    </button>
                </motion.div>
            ) : (
                <div className="glass-card p-8 rounded-[2.5rem] bg-primary-600 text-white border-none shadow-2xl shadow-primary-200 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h4 className="text-xl font-black">Action Required</h4>
                        <p className="text-white/80 text-sm font-medium leading-relaxed">Early submission is highly recommended for Medicine & Dentistry to secure MMI slots.</p>
                    </div>
                    <button className="w-full h-14 bg-white text-primary-600 rounded-2xl font-black uppercase tracking-widest hover:bg-white/90 transition-all">
                        Review Checklist
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* Aesthetic Background */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary-50/50 blur-[120px] rounded-full -z-10" />
    </div>
  );
}
