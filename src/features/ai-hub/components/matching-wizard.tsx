"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Sparkles, Command } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface Step {
  title: string;
  description: string;
  component: React.ReactNode;
}

interface MatchingWizardProps {
  steps: Step[];
  onComplete: () => void;
  currentStep: number;
  onStepChange: (step: number) => void;
}

export function MatchingWizard({ steps, onComplete, currentStep, onStepChange }: MatchingWizardProps) {
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      onStepChange(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  // Keyboard support for "Enter" to continue
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep]);

  return (
    <div className="space-y-12">
      {/* Step Indicator */}
      <div className="flex items-center gap-4">
        <span className="text-primary-500 font-black text-xl italic tracking-tighter flex items-center gap-2">
            {currentStep + 1} <ChevronRight className="w-4 h-4 opacity-50" />
        </span>
        <div className="flex gap-1.5 flex-1 max-w-[200px]">
            {steps.map((_, i) => (
                <motion.div 
                    key={i}
                    animate={{ 
                        backgroundColor: i <= currentStep ? "rgba(20, 184, 166, 1)" : "rgba(255, 255, 255, 0.1)",
                        width: i === currentStep ? "40px" : "12px"
                    }}
                    className="h-1 rounded-full"
                />
            ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={currentStep}
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -20 }}
           transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
           className="space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
              {steps[currentStep].title}
            </h2>
            <p className="text-xl text-white/50 leading-relaxed font-medium max-w-lg">
              {steps[currentStep].description}
            </p>
          </div>

          <div className="py-2">
            {steps[currentStep].component}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation & Shortcuts */}
      <div className="flex flex-col gap-6 pt-4 border-t border-white/5">
        <div className="flex items-center gap-4">
            <Button 
                onClick={handleNext}
                className="bg-primary-600 hover:bg-primary-500 text-white px-12 h-16 rounded-2xl font-black text-xl shadow-[0_0_30px_rgba(20,184,166,0.2)] transform active:scale-95 transition-all group"
            >
                {currentStep === steps.length - 1 ? "Start Analysis" : "OK"} 
                <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="hidden md:flex items-center gap-2 text-white/30 text-[10px] font-bold uppercase tracking-widest">
                press <span className="px-1.5 py-0.5 border border-white/20 rounded-md flex items-center gap-1"><Command className="w-2 h-2" /> ENTER</span>
            </div>
        </div>

        <div className="flex items-center gap-6">
            <button 
                onClick={handleBack}
                disabled={currentStep === 0}
                className="text-white/40 hover:text-white font-bold text-sm disabled:opacity-0 transition-all flex items-center gap-2"
            >
                <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <span className="w-1 h-1 bg-white/10 rounded-full" />
            <p className="text-[10px] text-white/20 font-medium uppercase tracking-[0.3em]">Phase {currentStep + 1} of {steps.length}</p>
        </div>
      </div>
    </div>
  );
}
