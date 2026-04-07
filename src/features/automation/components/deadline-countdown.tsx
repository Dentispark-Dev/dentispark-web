"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, AlertTriangle, Zap, Clock } from "lucide-react";
import { useDeadlineManager } from "@/src/features/automation/hooks/use-deadline-manager";
import { cn } from "@/src/lib/utils";

export function DeadlineCountdown() {
  const { timeLeft, mainDeadline } = useDeadlineManager();

  if (!timeLeft) return null;

  const isCritical = timeLeft.days < 7;

  return (
    <div className={cn(
        "bg-white p-6 lg:p-8 rounded-[2rem] border transition-all duration-500 w-full flex flex-col xl:flex-row xl:items-center justify-between gap-8",
        isCritical ? "border-red-200 shadow-xl shadow-red-500/5" : "border-slate-100 shadow-sm hover:shadow-md"
    )}>
        {/* Left Section: Target Info */}
        <div className="flex items-center gap-6 flex-1 min-w-0">
            <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0",
                isCritical ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
            )}>
                <Calendar className="w-8 h-8" />
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest truncate",
                        isCritical ? "text-red-500" : "text-emerald-500"
                    )}>
                        Target Milestone
                    </span>
                    {isCritical && (
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[9px] font-bold uppercase tracking-widest animate-pulse shrink-0">
                            Critical
                        </span>
                    )}
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1 truncate">
                    {mainDeadline.title}
                </h2>
                <p className="text-slate-500 text-sm font-medium truncate">
                    UK Dental Schools official window.
                </p>
            </div>
        </div>

        {/* Middle Section: Horizontal Countdown */}
        <div className="flex items-center gap-4 shrink-0 justify-center">
            <div className="flex items-baseline gap-2 bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100">
                <span className={cn("text-4xl font-black", isCritical ? "text-red-600" : "text-slate-900")}>
                    {timeLeft.days}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Days</span>
            </div>
            <div className="flex items-center gap-6 px-6 py-4 rounded-2xl">
                <div className="text-center">
                    <p className="text-2xl font-black text-slate-700">{String(timeLeft.hours).padStart(2, '0')}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hrs</p>
                </div>
                <span className="text-slate-300 font-bold">:</span>
                <div className="text-center">
                    <p className="text-2xl font-black text-slate-700">{String(timeLeft.minutes).padStart(2, '0')}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Min</p>
                </div>
                <span className="text-slate-300 font-bold">:</span>
                <div className="text-center">
                    <p className="text-2xl font-black text-slate-700">{String(timeLeft.seconds).padStart(2, '0')}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sec</p>
                </div>
            </div>
        </div>

        {/* Right Section: Action */}
        <div className="shrink-0 flex justify-end mt-4 xl:mt-0">
            <button className={cn(
                "w-full xl:w-auto h-14 px-8 rounded-xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                isCritical 
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20" 
                    : "bg-slate-900 hover:bg-slate-800 text-white"
            )}>
                {isCritical ? "Complete Registration" : "Review Checklist"}
                {isCritical ? <Zap className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            </button>
        </div>
    </div>
  );
}
