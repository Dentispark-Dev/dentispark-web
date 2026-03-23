"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
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
  glow: string;
  phase: string;
};

const STEPS: Step[] = [
  {
    id: 1,
    title: "Discover Your Path",
    description: "Take the quiz to find your category (BDS, Nursing, Hygiene).",
    icon: DiscoverYourPath,
    color: "text-emerald-500",
    glow: "bg-emerald-500/20",
    phase: "Foundation"
  },
  {
    id: 2,
    title: "Access Free Tools",
    description: "Use guides, checklists, and university data.",
    icon: AccessFreeTools,
    color: "text-orange-500",
    glow: "bg-orange-500/20",
    phase: "Empowerment"
  },
  {
    id: 3,
    title: "Connect with Mentors",
    description: "Meet Black dental professionals and scholars.",
    icon: ConnectWithScholars,
    color: "text-blue-600",
    glow: "bg-blue-600/20",
    phase: "Networking"
  },
  {
    id: 4,
    title: "Track Your Journey",
    description: "Follow year-specific milestones and goals.",
    icon: TrackYourJourney,
    color: "text-teal-500",
    glow: "bg-teal-500/20",
    phase: "Mastery"
  }
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="bg-white py-20 overflow-hidden relative">
      <Container>
        <div className="flex flex-col space-y-16">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 pb-12">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold tracking-widest uppercase mb-2">
                <Sparkles className="w-3 h-3" /> The DentiSpark Protocol
              </div>
              <h2 className="font-sora text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Your Journey. <span className="text-emerald-600">Connected.</span>
              </h2>
            </div>
            <Link 
              href="/sign-up" 
              className="group flex items-center gap-2 font-sora font-extrabold text-slate-900 hover:text-emerald-600 transition-colors"
            >
              Start Your Path <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Interactive Path Container */}
          <div className="relative">
            {/* Desktop Path Line */}
            <div className="hidden lg:block absolute top-[5.5rem] left-[12.5%] right-[12.5%] h-1 bg-slate-50 overflow-hidden rounded-full">
              <motion.div 
                className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {STEPS.map((step, idx) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  onMouseEnter={() => setActiveStep(idx)}
                  className="group relative"
                >
                  <div className={cn(
                    "flex flex-col h-full bg-white border border-slate-100 rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)]",
                    activeStep === idx ? "border-emerald-100 shadow-[0_20px_50px_-12px_rgba(16,185,129,0.12)]" : ""
                  )}>
                    {/* Step Icon Node */}
                    <div className="relative mb-8 flex justify-center lg:justify-start">
                        <div className={cn(
                            "relative z-10 w-24 h-24 rounded-3xl p-6 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3 shadow-lg flex items-center justify-center",
                            activeStep === idx || activeStep === -1 ? `bg-white shadow-${step.color.split('-')[1]}/10` : "bg-slate-50"
                        )}>
                            <div className={cn("absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity", step.glow)} />
                            <Image 
                                src={step.icon} 
                                alt={step.title} 
                                className={cn(
                                    "w-full h-full object-contain transition-all duration-500",
                                    activeStep === idx ? "scale-110" : "grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100"
                                )}
                            />
                        </div>
                        {/* Phase Indicator Bubble */}
                        <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-slate-50 z-20">
                            <span className={cn("font-sora font-extrabold text-sm", step.color)}>
                                {step.id}
                            </span>
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-2">
                            <div className={cn("h-1 w-6 rounded-full", step.color.replace('text-', 'bg-'))} />
                            <span className={cn("text-[10px] font-bold uppercase tracking-widest", step.color)}>
                                {step.phase}
                            </span>
                        </div>
                        <h3 className="font-sora text-xl font-extrabold text-slate-900 leading-tight">
                            {step.title}
                        </h3>
                        <p className="font-sora text-slate-500 text-xs font-medium leading-relaxed">
                            {step.description}
                        </p>
                    </div>

                    {/* Desktop Hover Details Overlay (Subtle) */}
                    <AnimatePresence>
                        {activeStep === idx && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute -bottom-2 -left-2 -right-2 h-1 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                            />
                        )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

