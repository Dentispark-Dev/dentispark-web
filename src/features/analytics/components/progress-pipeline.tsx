"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { cn } from "@/src/lib/utils";

const pipelineSteps = [
  { id: 1, title: "Researching", status: "completed", description: "Choosing 5 Unis" },
  { id: 2, title: "Personal Statement", status: "current", description: "Final Draft Review" },
  { id: 3, title: "UCAS Submission", status: "upcoming", description: "Deadline Oct 15" },
  { id: 4, title: "Interview Cycle", status: "upcoming", description: "MMI/Panel Prep" },
  { id: 5, title: "Offer Confirmed", status: "upcoming", description: "Final Destination" }
];

export function ProgressPipeline() {
  const [steps, setSteps] = useState(pipelineSteps);

  useEffect(() => {
    // Simulate fetching user activity state
    const hasFinishedEssay = true; // In real app, fetch from AI Hub state
    const updatedSteps = pipelineSteps.map(step => {
        if (step.id === 2 && hasFinishedEssay) return { ...step, status: "completed" };
        if (step.id === 3 && hasFinishedEssay) return { ...step, status: "current" };
        return step;
    });
    setSteps(updatedSteps);
  }, []);

  return (
    <div className="glass-card p-10 rounded-[3rem] border-primary-50 bg-white/50 relative overflow-hidden">
      <div className="relative z-10 space-y-10">
        <div className="flex justify-between items-end">
            <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary-500">Application Journey</span>
                <h3 className="text-3xl font-extrabold text-black-900 leading-tight">Your Progress Pipeline</h3>
            </div>
            <div className="flex gap-2 text-xs font-bold text-black-500 bg-greys-50 px-4 py-2 rounded-full border border-greys-100">
                Next Step: {steps.find(s => s.status === "current")?.description || "Continue"}
                <ArrowRight className="w-4 h-4" />
            </div>
        </div>

        <div className="relative flex justify-between items-start">
            {/* Background Line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-greys-100 -z-10 mx-6" />
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: steps.filter(s => s.status === "completed").length * 25 + "%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute top-6 left-0 h-0.5 bg-primary-500 -z-10 mx-6" 
            />

            {steps.map((step, i) => (
                <div key={step.id} className="flex flex-col items-center gap-4 text-center max-w-[140px] group">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-300",
                            step.status === "completed" ? "bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-200" :
                            step.status === "current" ? "bg-white border-primary-500 text-primary-600 shadow-xl shadow-primary-50 ring-4 ring-primary-50" :
                            "bg-white border-greys-200 text-black-300"
                        )}
                    >
                        {step.status === "completed" ? (
                            <CheckCircle2 className="w-6 h-6" />
                        ) : step.status === "current" ? (
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                <Circle className="w-6 h-6 fill-primary-600" />
                            </motion.div>
                        ) : (
                            <span className="font-bold text-xs">{step.id}</span>
                        )}
                    </motion.div>
                    
                    <div className="space-y-1">
                        <p className={cn(
                            "text-[10px] font-extrabold uppercase tracking-tight",
                            step.status === "upcoming" ? "text-black-300" : "text-black-800"
                        )}>{step.title}</p>
                        <p className="text-[10px] text-black-400 font-medium leading-tight">{step.description}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Background aesthetic */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50/50 blur-[100px] rounded-full -z-10" />
    </div>
  );
}
