"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Target, 
  Flame, 
  Award, 
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import { cn } from "@/src/lib/utils";

export function PerformanceGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Success Probability Card */}
      <div className="lg:col-span-2 glass-card p-8 rounded-[2.5rem] border-primary-100 bg-white relative overflow-hidden flex flex-col justify-between min-h-[300px]">
        <div className="relative z-10 flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-black-900 leading-tight">Success Probability</h3>
            <p className="text-black-400 text-sm font-medium">Based on your current application profile</p>
          </div>
          <div className="p-3 bg-primary-50 rounded-2xl text-primary-600">
            <Target className="w-6 h-6" />
          </div>
        </div>

        <div className="relative flex items-center justify-center py-6">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-greys-100"
            />
            <motion.circle
              cx="96"
              cy="96"
              r="80"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 80}
              initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
              animate={{ strokeDashoffset: (2 * Math.PI * 80) * (1 - 0.78) }}
              transition={{ duration: 2, ease: "easeOut" }}
              strokeLinecap="round"
              className="text-primary-600"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-black-900">78%</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary-500">Tier A- Rank</span>
          </div>
        </div>

        <div className="relative z-10 flex gap-3 text-xs font-bold">
            <div className="flex-1 bg-green-50 text-green-700 px-4 py-3 rounded-2xl flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4" />
                +12% vs Last Week
            </div>
            <div className="flex-1 bg-primary-50 text-primary-700 px-4 py-3 rounded-2xl flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Top 5% of Applicants
            </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary-100/30 blur-3xl rounded-full" />
      </div>

      {/* Engagement Streak Card */}
      <div className="glass-card p-6 rounded-[2.5rem] border-orange-100 bg-white flex flex-col justify-between">
        <div className="flex justify-between items-start">
            <div className="p-3 bg-orange-50 rounded-2xl text-orange-600">
                <Flame className="w-6 h-6" />
            </div>
            <div className="text-right">
                <span className="text-xs font-black text-black-400 uppercase tracking-widest leading-none">Streak</span>
                <p className="text-3xl font-black text-black-900">12 Days</p>
            </div>
        </div>

        <div className="space-y-4">
            <div className="grid grid-cols-7 gap-1.5">
                {Array.from({ length: 28 }).map((_, i) => (
                    <div 
                        key={i} 
                        className={cn(
                            "aspect-square rounded-[4px]",
                            i < 12 ? "bg-orange-500" : i < 15 ? "bg-orange-200" : "bg-greys-100"
                        )}
                    />
                ))}
            </div>
            <div className="flex justify-between items-center text-[10px] font-black text-black-400 uppercase tracking-widest">
                <span>Last 4 Weeks</span>
                <span className="text-orange-600">Legendary</span>
            </div>
        </div>

        <button className="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 h-12 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
            Share Streak
            <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Competency Score Card */}
      <div className="glass-card p-6 rounded-[2.5rem] border-purple-100 bg-white flex flex-col justify-between">
        <div className="flex justify-between items-start">
            <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                <Award className="w-6 h-6" />
            </div>
            <div className="text-right">
                <span className="text-xs font-black text-black-400 uppercase tracking-widest leading-none">Level</span>
                <p className="text-3xl font-black text-black-900">Pro 4</p>
            </div>
        </div>

        <div className="space-y-3">
            {[
                { label: "Academics", score: 92, color: "bg-green-500" },
                { label: "Clinical", score: 68, color: "bg-purple-500" },
                { label: "Interview", score: 85, color: "bg-primary-500" }
            ].map((stat) => (
                <div key={stat.label} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-black-600">
                        <span>{stat.label}</span>
                        <span>{stat.score}%</span>
                    </div>
                    <div className="h-1.5 bg-greys-100 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.score}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={cn("h-full", stat.color)} 
                        />
                    </div>
                </div>
            ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-black-500">
            <Activity className="w-4 h-4 text-purple-500" />
            Active profile syncing...
        </div>
      </div>
    </div>
  );
}
