"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, GraduationCap, ArrowUpRight, CheckCircle2, Award } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface MentorMatchCardProps {
  name: string;
  university: string;
  specialty: string;
  compatibility: number;
  image?: string;
  highlights: string[];
}

export function MentorMatchCard({ 
  name, 
  university, 
  specialty, 
  compatibility, 
  highlights 
}: MentorMatchCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-blue-500/0 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative glass-card bg-black/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 space-y-6 hover:border-primary-500/30 transition-all duration-500 overflow-hidden">
        {/* Compatibility Badge */}
        <div className="absolute top-0 right-0 px-6 py-3 bg-primary-600/10 border-b border-l border-white/5 rounded-bl-3xl">
            <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-primary-400 leading-none">{compatibility}%</span>
                <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mt-1">Match Index</span>
            </div>
        </div>

        <div className="flex gap-6 items-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center text-white font-black text-3xl shadow-2xl group-hover:scale-110 transition-transform duration-500">
                {name[0]}
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-black border-4 border-black/0 rounded-full flex items-center justify-center">
                <div className="w-full h-full bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-black" />
                </div>
            </div>
          </div>

          <div>
            <h4 className="text-2xl font-black text-white group-hover:text-primary-400 transition-colors">{name}</h4>
            <div className="flex items-center gap-2 text-white/40 mt-1 uppercase text-[10px] font-bold tracking-widest">
                <GraduationCap className="w-4 h-4 text-primary-500" />
                {university}
            </div>
          </div>
        </div>

        <div className="h-px bg-white/5 w-full" />

        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-primary-400" />
                <span className="text-sm font-bold text-white/80">{specialty}</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
                {highlights.map((h, i) => (
                    <span key={i} className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[10px] text-white/60 font-medium">
                        {h}
                    </span>
                ))}
            </div>
        </div>

        <Button className="w-full bg-white text-black hover:bg-primary-500 hover:text-white rounded-2xl h-14 font-black text-lg transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 group/btn">
            Secure Partnership
            <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
}
