"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, GraduationCap, MapPin, CheckCircle2 } from "lucide-react";
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
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 rounded-3xl border-primary-100 space-y-4 hover:shadow-xl transition-shadow group"
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl group-hover:scale-110 transition-transform">
            {name[0]}
          </div>
          <div>
            <h4 className="font-bold text-black-800">{name}</h4>
            <div className="flex items-center gap-1 text-xs text-black-500">
                <GraduationCap className="w-3 h-3" />
                {university}
            </div>
            <div className="flex items-center gap-1 text-xs text-primary-600 font-medium mt-1">
                <Star className="w-3 h-3 fill-primary-600" />
                {specialty}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
            <span className="text-2xl font-black text-primary-600">{compatibility}%</span>
            <span className="text-[10px] text-black-400 uppercase font-bold tracking-tighter">Match Score</span>
        </div>
      </div>

      <div className="space-y-2 py-2">
        <p className="text-[11px] font-bold text-black-400 uppercase tracking-widest">Why this Match?</p>
        <div className="flex flex-wrap gap-2">
            {highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1 bg-white border border-greys-100 rounded-full text-[10px] text-black-600 shadow-sm">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    {h}
                </div>
            ))}
        </div>
      </div>

      <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-xl h-11 font-bold group-hover:shadow-lg group-hover:shadow-primary-100 transition-all">
        View Profile & Connect
      </Button>
    </motion.div>
  );
}
