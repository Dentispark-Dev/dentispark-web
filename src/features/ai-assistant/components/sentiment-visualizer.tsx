"use client";

import React from "react";
import { motion } from "framer-motion";
import { Brain, Activity, Zap, Shield, Target, TrendingUp } from "lucide-react";

interface SentimentData {
  label: string;
  score: number;
  icon: React.ReactNode;
  color: string;
}

export function SentimentVisualizer() {
  const metrics: SentimentData[] = [
    { label: "Confidence", score: 88, icon: <Shield className="w-4 h-4" />, color: "bg-blue-500" },
    { label: "Clarity", score: 72, icon: <Zap className="w-4 h-4" />, color: "bg-amber-500" },
    { label: "Empathy", score: 95, icon: <Activity className="w-4 h-4" />, color: "bg-emerald-500" },
    { label: "Professionalism", score: 91, icon: <Target className="w-4 h-4" />, color: "bg-primary-600" },
  ];

  return (
    <div className="glass-card bg-white p-8 rounded-[2.5rem] border-primary-100 shadow-2xl overflow-hidden relative group">
      {/* HUD Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/20 via-transparent to-greys-50/50 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-black-900 flex items-center justify-center text-white shadow-xl shadow-black-500/20">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-black-900 tracking-tight text-lg italic uppercase">AI Sentiment Analysis</h3>
            <p className="text-black-400 text-[10px] font-black uppercase tracking-widest">Real-time Emotional Intelligence HUD</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metrics.map((metric, index) => (
            <motion.div 
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-3"
            >
              <div className="flex justify-between items-end px-1">
                <div className="flex items-center gap-2">
                  <span className={`p-1.5 rounded-lg ${metric.color} text-white`}>
                    {metric.icon}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-black-600">{metric.label}</span>
                </div>
                <span className="text-lg font-black text-black-900 tracking-tighter">{metric.score}%</span>
              </div>
              
              <div className="h-3 w-full bg-greys-100 rounded-full overflow-hidden border border-greys-200/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.score}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  className={`h-full ${metric.color} rounded-full relative group-hover:brightness-110 transition-all`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 p-4 rounded-3xl bg-primary-50 border border-primary-100 flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-primary-600 mt-0.5" />
          <div>
            <p className="text-xs font-black text-primary-900 uppercase tracking-tight">AI Insight</p>
            <p className="text-[11px] text-primary-700 font-medium leading-relaxed mt-1">
              Your "Clarity" score dropped during technical questions. Focus on steady pacing and avoid "filler" words to increase professional presence by ~15%.
            </p>
          </div>
        </div>
      </div>

      {/* Futuristic Grid Lines */}
      <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-black-900">
          <line x1="0" y1="100" x2="100" y2="0" stroke="currentColor" strokeWidth="0.5" />
          <line x1="20" y1="100" x2="100" y2="20" stroke="currentColor" strokeWidth="0.5" />
          <line x1="40" y1="100" x2="100" y2="40" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>
    </div>
  );
}
