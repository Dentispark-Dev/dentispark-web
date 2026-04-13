"use client";

import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Command } from "lucide-react";
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
  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      onStepChange(currentStep + 1);
    } else {
      onComplete();
    }
  }, [currentStep, steps.length, onStepChange, onComplete]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  }, [currentStep, onStepChange]);

  // Keyboard support for "Enter" to continue
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext]);

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center gap-4">
        <span className="text-emerald-600 font-jakarta font-bold text-xl flex items-center gap-2">
            {currentStep + 1} <ChevronRight className="w-4 h-4 opacity-50" />
        </span>
        <div className="flex gap-1.5 flex-1 max-w-[200px]">
            {steps.map((_, i) => (
                <motion.div 
                    key={i}
                    animate={{ 
                        backgroundColor: i <= currentStep ? "rgba(16, 185, 129, 1)" : "rgba(0, 0, 0, 0.1)",
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
           className="space-y-6"
        >
          <div className="space-y-2">
            <h2 className="text-3xl lg:text-4xl font-jakarta font-bold text-gray-900 tracking-tight leading-tight">
              {steps[currentStep].title}
            </h2>
            <p className="text-base text-gray-600 leading-relaxed font-medium max-w-lg">
              {steps[currentStep].description}
            </p>
          </div>

          <div className="pt-0">
            {steps[currentStep].component}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation & Shortcuts */}
      <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
            <Button 
                onClick={handleNext}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-12 rounded-xl font-jakarta font-semibold text-base shadow-sm transform active:scale-95 transition-all group"
            >
                {currentStep === steps.length - 1 ? "Start Analysis" : "Continue"} 
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="hidden md:flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                press <span className="px-1.5 py-0.5 border border-gray-200 rounded-md flex items-center gap-1"><Command className="w-3 h-3" /> ENTER</span>
            </div>
        </div>

        <div className="flex items-center gap-6">
            <button 
                onClick={handleBack}
                disabled={currentStep === 0}
                className="text-gray-400 hover:text-gray-900 font-semibold text-sm disabled:opacity-0 transition-all flex items-center gap-2"
            >
                <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <span className="w-1 h-1 bg-gray-200 rounded-full" />
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Phase {currentStep + 1} of {steps.length}</p>
        </div>
      </div>
    </div>
  );
}
