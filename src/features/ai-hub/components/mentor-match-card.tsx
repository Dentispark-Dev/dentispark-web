"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, GraduationCap, ArrowUpRight, CheckCircle2, Award, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface MentorMatchCardProps {
  name: string;
  university: string;
  specialty: string;
  compatibility: number;
  image?: string;
  highlights: string[];
  slug: string;
}

export function MentorMatchCard({ 
  name, 
  university, 
  specialty, 
  compatibility, 
  highlights,
  image,
  slug
}: MentorMatchCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <div className="relative bg-white border border-gray-200 rounded-3xl p-1 shadow-sm overflow-hidden hover:shadow-md hover:border-emerald-500/30 transition-all duration-300">
        
        {/* Top Header Section with Match Index */}
        <div className="flex justify-between items-start p-6 pb-2">
            <div className="flex gap-4 items-center">
                <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-jakarta font-bold text-2xl shadow-sm border-2 border-white overflow-hidden">
                        {image ? (
                            <Image src={image} alt={name} fill className="object-cover" />
                        ) : (
                            name.split(" ").map(n => n[0]).join("")
                        )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center ring-2 ring-white">
                        <div className="w-full h-full bg-emerald-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className="text-xl font-jakarta font-extrabold text-gray-900 group-hover:text-emerald-700 transition-colors tracking-tight">{name}</h4>
                    <div className="flex items-center gap-1.5 text-gray-500 mt-1 uppercase text-[10px] font-semibold tracking-wider">
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                        {university}
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-end pt-1">
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-jakarta font-extrabold text-emerald-600 leading-none">{compatibility}%</span>
                </div>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Match Index</span>
            </div>
        </div>

        {/* Content Section */}
        <div className="px-6 space-y-6 pb-6">
            <div className="h-px bg-gray-100 w-full mt-2" />
            
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-50 rounded-lg">
                        <Award className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 tracking-wide">{specialty}</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                    {highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-[10px] text-gray-600 font-semibold uppercase tracking-wider group-hover:bg-gray-100 transition-all">
                            <Zap className="w-3 h-3 text-emerald-500" />
                            {h}
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-2 flex gap-3">
                <div className="flex-1">
                    <Link href={`/mentorship/${slug}`} className="block w-full">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 font-jakarta font-bold transition-all flex items-center justify-center gap-2 shadow-sm group/btn">
                            Secure Partnership
                            <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </Button>
                    </Link>
                </div>
                <button className="p-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-gray-400 hover:text-gray-600 transition-all shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                </button>
            </div>
        </div>
      </div>
    </motion.div>
  );
}
