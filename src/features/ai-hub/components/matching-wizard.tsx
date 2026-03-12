"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface Step {
  title: string;
  description: string;
  component: React.ReactNode;
}

interface MatchingWizardProps {
  steps: Step[];
  onComplete: () => void;
}

export function MatchingWizard({ steps, onComplete }: MatchingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Progress Indicator */}
      <div className="flex gap-2 justify-center">
        {steps.map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === currentStep ? "w-12 bg-primary-500" : 
              i < currentStep ? "w-6 bg-primary-200" : "w-6 bg-greys-100"
            }`}
          />
        ))}
      </div>

      {/* Content Area */}
      <div className="glass-card p-10 rounded-[2.5rem] border-primary-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles className="w-32 h-32 text-primary-600" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 relative z-10"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-black-800 tracking-tight">
                {steps[currentStep].title}
              </h2>
              <p className="text-black-500 leading-relaxed font-medium">
                {steps[currentStep].description}
              </p>
            </div>

            <div className="pt-4">
              {steps[currentStep].component}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-4">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          disabled={currentStep === 0}
          className="text-black-400 hover:text-black-800 flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </Button>

        <Button 
          onClick={handleNext}
          className="bg-black-900 border-2 border-black-900 text-white hover:bg-black-800 px-8 h-12 rounded-2xl font-bold flex items-center gap-2 shadow-xl hover:translate-y-[-2px] transition-all"
        >
          {currentStep === steps.length - 1 ? "Find My Mentor" : "Continue"}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
