"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, GraduationCap, ArrowUpRight, CheckCircle2, Award, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Image from "next/image";

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
  highlights,
  image
}: MentorMatchCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="group relative"
    >
      {/* Dynamic Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      <div className="relative bg-[#0A1218]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-1 shadow-2xl overflow-hidden ring-1 ring-white/10 group-hover:ring-emerald-500/30 transition-all duration-500">
        
        {/* Top Header Section with Match Index */}
        <div className="flex justify-between items-start p-8 pb-4">
            <div className="flex gap-4 items-center">
                <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white font-black text-2xl shadow-xl border border-white/10 overflow-hidden">
                        {image ? (
                            <Image src={image} alt={name} fill className="object-cover" />
                        ) : (
                            name.split(" ").map(n => n[0]).join("")
                        )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#0A1218] rounded-full flex items-center justify-center ring-4 ring-[#0A1218]">
                        <div className="w-full h-full bg-emerald-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 text-black" />
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors uppercase italic tracking-tight">{name}</h4>
                    <div className="flex items-center gap-1.5 text-white/40 mt-1 uppercase text-[9px] font-black tracking-[0.15em]">
                        <GraduationCap className="w-3 h-3 text-emerald-500" />
                        {university}
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-end">
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-emerald-400 italic leading-none">{compatibility}%</span>
                </div>
                <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mt-1">Match Index</span>
            </div>
        </div>

        {/* Content Section */}
        <div className="px-8 space-y-6 pb-8">
            <div className="h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent w-full" />
            
            <div className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <Award className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-xs font-bold text-white/70 uppercase tracking-widest">{specialty}</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                    {highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl text-[9px] text-white/50 font-bold uppercase tracking-wider group-hover:bg-white/10 group-hover:text-white/80 transition-all">
                            <Zap className="w-2.5 h-2.5 text-emerald-500/70" />
                            {h}
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-2 flex gap-3">
                <div className="flex-1">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-14 font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-emerald-900/40 relative overflow-hidden group/btn">
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                        Secure Partnership
                        <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </Button>
                </div>
                <button className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-white/40 hover:text-white transition-all">
                    <ShieldCheck className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* Decorative corner element */}
        <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-emerald-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.div>
  );
}
