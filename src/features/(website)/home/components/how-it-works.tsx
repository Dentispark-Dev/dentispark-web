"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Sparkles, Zap, ShieldCheck, Globe, Star } from "lucide-react";
import Container from "@/src/components/layouts/container";
import { cn } from "@/src/lib/utils";

import DiscoverYourPath from "@/public/icons/discover-your-path.svg";
import AccessFreeTools from "@/public/icons/access-free-tool.svg";
import ConnectWithScholars from "@/public/icons/connect-with-mentors.svg";
import TrackYourJourney from "@/public/icons/track-your-journey.svg";

type Step = {
  id: number;
  title: string;
  description: string;
  icon: StaticImageData;
  color: string;
  bgGradient: string;
  accent: string;
  phase: string;
};

const STEPS: Step[] = [
  {
    id: 1,
    title: "Discover Your Path",
    description: "Personalized quiz to map your dental career trajectory.",
    icon: DiscoverYourPath,
    color: "from-emerald-400 to-teal-500",
    bgGradient: "bg-emerald-500/5",
    accent: "text-emerald-500",
    phase: "Foundation"
  },
  {
    id: 2,
    title: "Access Free Tools",
    description: "Elite archives of guides, checklists, and university data.",
    icon: AccessFreeTools,
    color: "from-orange-400 to-rose-500",
    bgGradient: "bg-orange-500/5",
    accent: "text-orange-600",
    phase: "Empowerment"
  },
  {
    id: 3,
    title: "Connect with Mentors",
    description: "Direct lineage to top-tier dental scholars and experts.",
    icon: ConnectWithScholars,
    color: "from-blue-400 to-indigo-600",
    bgGradient: "bg-blue-600/5",
    accent: "text-blue-700",
    phase: "Networking"
  },
  {
    id: 4,
    title: "Track Your Journey",
    description: "Strategic milestone tracking for long-term mastery.",
    icon: TrackYourJourney,
    color: "from-teal-400 to-cyan-500",
    bgGradient: "bg-teal-500/5",
    accent: "text-teal-600",
    phase: "Prestige"
  }
];

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section ref={containerRef} className="bg-slate-50/50 py-24 md:py-32 overflow-hidden relative">
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-emerald-100/30 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] bg-blue-100/20 blur-[100px] rounded-full" />
      </div>

      <Container>
        <div className="flex flex-col space-y-20">
          {/* Enhanced Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10 border-b border-slate-200 pb-16">
            <div className="space-y-6 max-w-3xl">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-bold tracking-[0.3em] uppercase"
              >
                <Sparkles className="w-3 h-3 text-emerald-400" /> The DentiSpark Protocol
              </motion.div>
              <h2 className="font-sora text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tighter leading-tight italic">
                Your Journey. <span className="text-emerald-500 not-italic uppercase">Connected.</span>
              </h2>
              <p className="font-sora text-slate-500 text-lg md:text-xl max-w-2xl leading-relaxed font-medium">
                A seamless transition from discovery to mastery. Every stage, every mentor, every tool—optimized for your success.
              </p>
            </div>
          </div>

          {/* Interactive Cinematic Path Container */}
          <div className="relative pt-10">
            {/* Desktop Curved SVG Path */}
            <div className="hidden lg:block absolute top-[5rem] left-0 w-full h-32 -z-0">
               <svg width="100%" height="150" viewBox="0 0 1200 150" fill="none" preserveAspectRatio="none">
                  <path 
                    d="M50,75 C250,75 350,25 550,25 C750,25 850,125 1150,125" 
                    stroke="#E2E8F0" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    strokeDasharray="8 12"
                  />
                  <motion.path 
                    d="M50,75 C250,75 350,25 550,25 C750,25 850,125 1150,125" 
                    stroke="url(#pathGradient)" 
                    strokeWidth="6" 
                    strokeLinecap="round"
                    style={{ pathLength }}
                  />
                  <defs>
                    <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="50%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
               </svg>
            </div>

            {/* Steps Grid - High Fidelity Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 items-start">
              {STEPS.map((step, idx) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, duration: 0.8 }}
                  className="group relative h-full pt-12 md:pt-0"
                  style={{ 
                    marginTop: idx === 1 ? '-40px' : idx === 2 ? '40px' : idx === 3 ? '80px' : '0px' 
                  }}
                >
                  <motion.div 
                    whileHover={{ y: -15, rotateX: 5, rotateY: 5 }}
                    className={cn(
                        "flex flex-col h-full bg-white/70 backdrop-blur-3xl border border-white rounded-[3rem] p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 overflow-hidden relative",
                        "hover:shadow-[0_40px_100px_-20px_rgba(16,185,129,0.15)] hover:border-emerald-100/50"
                    )}
                  >
                    {/* Interior Glow */}
                    <div className={cn("absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700", step.bgGradient.replace('bg-', 'bg-').replace('/5', '/20'))} />

                    {/* Phase Badge */}
                    <div className="flex items-center justify-between mb-10 w-full">
                        <div className="flex flex-col">
                            <span className={cn("text-[10px] font-black uppercase tracking-[0.3em] mb-1", step.accent)}>
                                Phase 0{step.id}
                            </span>
                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{step.phase}</span>
                        </div>
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg transition-transform duration-500 group-hover:scale-110",
                            `bg-gradient-to-br ${step.color}`
                        )}>
                            {step.id}
                        </div>
                    </div>

                    {/* Step Icon Node - Premium Treatment */}
                    <div className="relative mb-8">
                        <div className="w-24 h-24 rounded-[2rem] bg-slate-50 relative flex items-center justify-center p-6 shadow-inner overflow-hidden group-hover:bg-white transition-colors duration-500">
                             <div className={cn("absolute inset-0 opacity-10 blur-xl transition-opacity duration-500", step.bgGradient.replace('/5', ''))} />
                             <Image 
                                src={step.icon} 
                                alt={step.title} 
                                className="w-full h-full object-contain relative z-10 filter drop-shadow-xl transition-all duration-500 group-hover:scale-125 group-hover:rotate-6"
                             />
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="space-y-4 flex-1 relative z-10">
                        <h3 className="font-sora text-2xl font-black text-slate-900 tracking-tighter leading-none group-hover:text-emerald-600 transition-colors">
                            {step.title}
                        </h3>
                        <p className="font-sora text-slate-500 text-sm leading-relaxed font-semibold">
                            {step.description}
                        </p>
                    </div>

                    {/* Interactive Bottom Bar */}
                    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex -space-x-2">
                            {[1,2,3].map(i => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100" />
                            ))}
                        </div>
                        <div className={cn("w-2 h-2 rounded-full", step.bgGradient.replace('bg-', 'bg-').replace('/5', ''))} />
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}


