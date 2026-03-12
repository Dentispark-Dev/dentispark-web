"use client";

import React from "react";
import { Share2, Download, Instagram, Twitter, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface SuccessCardProps {
  score: number;
  milestone: string;
  category: string;
}

export function SuccessCard({ score, milestone, category }: SuccessCardProps) {
  return (
    <div className="space-y-6">
      <div className="relative group w-full max-w-sm mx-auto">
        {/* The Card - Designed for Social Sharing Capture */}
        <div id="success-card-capture" className="aspect-square bg-black-900 rounded-[3.5rem] p-10 text-white relative overflow-hidden border border-white/10 shadow-2xl flex flex-col justify-between">
          <div className="relative z-10 flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">DentiSpark AI</span>
              </div>
              <h3 className="text-xl font-black tracking-tight">{category} Success</h3>
            </div>
            <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center">
                <span className="font-black text-xs text-primary-400">#DENTI</span>
            </div>
          </div>

          <div className="relative z-10 text-center space-y-4 py-8">
            <div className="relative inline-block">
                <span className="text-8xl font-black tracking-tightest leading-none bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent italic">
                    {score}%
                </span>
                <div className="absolute -top-4 -right-8 px-3 py-1 bg-primary-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-500/20">
                    Elite Tier
                </div>
            </div>
            <p className="text-sm font-medium text-white/50 px-8">
              &quot;{milestone}&quot;
            </p>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/10 flex justify-between items-end">
            <div className="space-y-1 text-left">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Student Beta 2024</p>
                <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-1 bg-primary-500 rounded-full" />)}
                </div>
            </div>
            <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em]">www.dentispark.com</p>
          </div>

          {/* Background FX */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_var(--primary-color)_0%,_transparent_70%)] opacity-10 blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-full h-full bg-[linear-gradient(45deg,transparent_40%,rgba(255,255,255,0.05)_50%,transparent_60%)] animate-[shimmer_5s_infinite]" />
        </div>

        {/* Action Toolbar */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
          <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black-900 shadow-xl hover:scale-110 active:scale-95 transition-all">
            <Instagram className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 bg-black-900 text-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all">
            <Twitter className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 bg-primary-600 text-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all">
            <Download className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 bg-greys-100 text-black-600 rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
