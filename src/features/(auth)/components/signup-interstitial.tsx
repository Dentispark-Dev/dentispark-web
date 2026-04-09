"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  Globe
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Image from "next/image";

interface SignUpInterstitialProps {
  onContinue: () => void;
}

export function SignUpInterstitial({ onContinue }: SignUpInterstitialProps) {
  const highlights = [
    {
      title: "Clinical Readiness Progress Bar",
      description: "Track your technical and ethical preparation for dental school.",
      icon: BarChart3,
      color: "text-emerald-500",
      bg: "bg-emerald-50"
    },
    {
      title: "AI-Powered Personal Statement Builder",
      description: "Draft and refine your application with field-specific intelligence.",
      icon: BrainCircuit,
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      title: "Work Experience Placement Tracker",
      description: "Unlock and manage your guaranteed clinical placements.",
      icon: MapPin,
      color: "text-orange-500",
      bg: "bg-orange-50"
    },
    {
      title: "Contextual Admissions Engine",
      description: "See your real chances using POLAR4 and regional data.",
      icon: Globe,
      color: "text-teal-500",
      bg: "bg-teal-50"
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 flex flex-col lg:flex-row min-h-[700px]">
      {/* Left: Visual Preview */}
      <div className="lg:w-1/2 bg-slate-900 relative p-12 flex flex-col justify-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-transparent opacity-50" />
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 space-y-10"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
              <Sparkles size={12} /> Platform Preview
            </div>
            <h2 className="font-jakarta text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Unlock your <br /><span className="text-emerald-400">Dental Future.</span>
            </h2>
          </div>

          {/* Mock Dashboard Visual */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-emerald-500/20 blur-2xl rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex gap-2">
                        {[1,2,3].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-white/10" />)}
                    </div>
                    <div className="h-2 w-32 bg-white/5 rounded-full" />
                </div>
                
                <div className="space-y-6">
                    <div className="h-6 w-3/4 bg-emerald-500/20 rounded-lg" />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-24 bg-white/5 rounded-2xl border border-white/5 p-4 flex flex-col justify-between">
                            <div className="size-6 rounded-lg bg-emerald-500/20" />
                            <div className="h-2 w-full bg-white/10 rounded-full" />
                        </div>
                        <div className="h-24 bg-white/5 rounded-2xl border border-white/5 p-4 flex flex-col justify-between">
                            <div className="size-6 rounded-lg bg-blue-500/20" />
                            <div className="h-2 w-full bg-white/10 rounded-full" />
                        </div>
                    </div>
                </div>
                
                {/* Float Elements */}
                <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 right-4 bg-white rounded-2xl p-4 shadow-2xl flex items-center gap-3 border border-slate-100"
                >
                    <div className="size-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <BarChart3 size={20} />
                    </div>
                    <div className="flex flex-col pr-4">
                        <span className="text-slate-900 font-bold text-[10px] uppercase tracking-wider">Readiness</span>
                        <span className="text-emerald-600 font-extrabold text-xs">88% Complete</span>
                    </div>
                </motion.div>
            </div>
          </div>

          <p className="text-slate-400 font-medium leading-relaxed">
            Gain immediate access to elite infrastructure architected for the next generation of dental professionals.
          </p>
        </motion.div>
      </div>

      {/* Right: Value Props & CTA */}
      <div className="lg:w-1/2 p-12 md:p-16 flex flex-col justify-center">
        <div className="space-y-12">
          <div className="space-y-4 text-center lg:text-left">
            <h3 className="font-jakarta text-3xl font-extrabold text-slate-900 tracking-tight">
              What You're Getting
            </h3>
            <p className="text-slate-500 font-medium capitalize">Everything you need to secure your seat in Dental School.</p>
          </div>

          <div className="space-y-8">
            {highlights.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="flex items-start gap-5 group"
              >
                <div className={`size-12 shrink-0 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon size={22} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-jakarta text-slate-900 font-bold text-lg leading-none">{item.title}</h4>
                  <p className="font-jakarta text-slate-500 text-sm font-medium leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-100 space-y-6">
            <Button 
                onClick={onContinue}
                className="w-full h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-jakarta font-extrabold text-lg shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 group transition-all duration-300 hover:-translate-y-1"
            >
                Continue to Secure Account
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /> Secure SSL</div>
                <div className="w-1 h-1 rounded-full bg-slate-200" />
                <div className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> Free Forever</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
