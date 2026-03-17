"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Sparkles, 
  BrainCircuit, 
  CheckCircle2, 
  AlertCircle,
  Check
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { useField } from "@/src/providers/field-provider";

// New Leland Evolution Components
import { LelandSplitPane } from "@/src/features/ai-hub/components/split-pane-layout";
import { IntelligenceRadar } from "@/src/features/ai-hub/components/intelligence-radar";
import { MatchingWizard } from "@/src/features/ai-hub/components/matching-wizard";
import { MentorMatchCard } from "@/src/features/ai-hub/components/mentor-match-card";

export default function MentorMatchingPage() {
  const { activeField } = useField();
  const [isMatching, setIsMatching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedUnis, setSelectedUnis] = useState<string[]>([]);
  const [selectedFocus, setSelectedFocus] = useState<string[]>([]);
  const [matchingInsights, setMatchingInsights] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const universities = ["King's College London", "UCL", "University of Manchester", "Queen Mary", "Bristol Dental School", "Glasgow Dental School"];
  const focusAreas = ["Personal Statement", "Manual Dexterity", "UCAT Prep", "MMI Interview", "Mock Interview", "NHS Values"];

  const handleComplete = async () => {
    setIsMatching(true);
    setError(null);
    try {
      const response = await fetch("/api/ai/mentor-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          targetUniversities: selectedUnis, 
          focusAreas: selectedFocus,
          field: activeField 
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText || "Matching failed");
      }

      const data = await response.json();
      setMatchingInsights(data);
      setShowResults(true);
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Failed to generate AI insights. Using standard matchmaking profiles.");
      setShowResults(true); 
    } finally {
      setIsMatching(false);
    }
  };

  const steps = [
    {
      title: "University Targets",
      description: "Select which dental schools you are aiming for to find mentors from those institutions.",
      component: (
        <div className="space-y-4 mt-8">
          {universities.map((uni, i) => (
            <button
              key={uni}
              onClick={() => setSelectedUnis(prev => prev.includes(uni) ? prev.filter(u => u !== uni) : [...prev, uni])}
              className={cn(
                "w-full group/btn p-6 rounded-2xl border transition-all flex items-center gap-6",
                selectedUnis.includes(uni) 
                  ? "bg-primary-500/10 border-primary-500 shadow-[0_0_20px_rgba(20,184,166,0.1)]" 
                  : "bg-white/5 border-white/5 hover:border-white/20"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all",
                selectedUnis.includes(uni) ? "bg-primary-500 text-black scale-110" : "bg-white/10 text-white/40"
              )}>
                {selectedUnis.includes(uni) ? <Check className="w-5 h-5" /> : String.fromCharCode(65 + i)}
              </div>
              <span className={cn(
                  "text-lg font-bold transition-colors",
                  selectedUnis.includes(uni) ? "text-white" : "text-white/60 group-hover/btn:text-white"
              )}>{uni}</span>
            </button>
          ))}
        </div>
      )
    },
    {
      title: "Focus Areas",
      description: "What specific parts of the application journey do you need the most help with?",
      component: (
        <div className="space-y-4 mt-8">
          {focusAreas.map((focus, i) => (
            <button
              key={focus}
              onClick={() => setSelectedFocus(prev => prev.includes(focus) ? prev.filter(f => f !== focus) : [...prev, focus])}
              className={cn(
                "w-full group/btn p-6 rounded-2xl border transition-all flex items-center gap-6",
                selectedFocus.includes(focus)
                  ? "bg-primary-500/10 border-primary-500"
                  : "bg-white/5 border-white/5 hover:border-white/20"
              )}
            >
               <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all",
                selectedFocus.includes(focus) ? "bg-primary-500 text-black scale-110" : "bg-white/10 text-white/40"
              )}>
                {selectedFocus.includes(focus) ? <Check className="w-5 h-5" /> : String.fromCharCode(65 + i)}
              </div>
              <span className={cn(
                  "text-lg font-bold transition-colors",
                  selectedFocus.includes(focus) ? "text-white" : "text-white/60 group-hover/btn:text-white"
              )}>{focus}</span>
            </button>
          ))}
        </div>
      )
    }
  ];

  const matchedMentors = [
    {
      name: "Dr. Sarah Chen",
      university: "King's College London",
      specialty: "MMI & Personal Statement",
      compatibility: 98,
      highlights: ["Current KCL Student", "Oral Surgery Specialist", "50+ Successful Students"]
    },
    {
      name: "James Wilson",
      university: "University of Manchester",
      specialty: "UCAT & Manual Dexterity",
      compatibility: 92,
      highlights: ["99th Percentile UCAT", "Violin Excellence (Manual Dex)", "Recent Grad"]
    },
    {
      name: "Dr. Amira Patel",
      university: "UCL",
      specialty: "Clinical Scenarios",
      compatibility: 87,
      highlights: ["NHS Value Expert", "Top of Class (UCL)", "Interview Panel Exp"]
    }
  ];

  return (
    <div className="bg-[#050A0E] min-h-screen text-white">
      <AnimatePresence mode="wait">
        {!showResults && !isMatching ? (
            <motion.div key="wizard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <LelandSplitPane
                    step={currentStep}
                    leftContent={
                        <div className="space-y-8">
                            <Link href="/ai-hub" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group mb-8">
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                <span className="text-xs font-bold uppercase tracking-widest">Exit to Hub</span>
                            </Link>
                            <MatchingWizard 
                                steps={steps} 
                                currentStep={currentStep}
                                onStepChange={(s) => setCurrentStep(s)}
                                onComplete={handleComplete} 
                            />
                        </div>
                    }
                    rightContent={
                        <IntelligenceRadar 
                            step={currentStep} 
                            dataPoints={(selectedUnis.length + selectedFocus.length) * 12}
                            label={currentStep === 0 ? "Targeting Universities" : "Mapping Focus Areas"}
                        />
                    }
                />
            </motion.div>
        ) : isMatching ? (
          <motion.div 
            key="matching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#050A0E] flex flex-col items-center justify-center space-y-12 z-[100]"
          >
            <IntelligenceRadar step={3} dataPoints={1024} label="Executing Match Logic" />
            <div className="flex gap-4">
                {["Scanning Pool", "Checking Compatibility", "Optimizing Pairs"].map((text, i) => (
                    <div key={i} className="flex items-center gap-2 px-6 py-3 bg-white/5 rounded-2xl border border-white/5">
                        <motion.div 
                            animate={{ opacity: [1, 0.4, 1] }}
                            transition={{ repeat: Infinity, duration: 1, delay: i * 0.3 }}
                            className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]" 
                        />
                        <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{text}</span>
                    </div>
                ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-8 py-20 space-y-16"
          >
            <div className="space-y-6 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500/10 text-primary-400 rounded-full border border-primary-500/20 text-[10px] font-black uppercase tracking-widest">
                    <Sparkles className="w-4 h-4" />
                    Optimal Matches Calculated
                </div>
                <h2 className="text-6xl font-black text-white tracking-tight leading-none italic uppercase">
                    Your Intelligence Briefing
                </h2>
                <p className="text-xl text-white/50 font-medium">We've identified the mentors most capable of accelerating your specific dental application strategy.</p>
            </div>

            {error && (
                <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-4 text-amber-400">
                    <AlertCircle className="w-6 h-6 shrink-0" />
                    <p className="text-sm font-bold tracking-tight">{error}</p>
                </div>
            )}

            {matchingInsights && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-12 rounded-[3rem] bg-gradient-to-br from-white/5 to-white/0 border-white/5 flex flex-col gap-8 shadow-2xl"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-primary-600 flex items-center justify-center text-white shadow-2xl">
                                <BrainCircuit className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white italic tracking-tight">STRATEGIC LOGIC</h3>
                                <p className="text-[10px] text-primary-400 uppercase tracking-widest font-black">Match Engine Insights</p>
                            </div>
                        </div>
                        <p className="text-lg font-medium text-white/80 leading-relaxed italic border-l-4 border-primary-500 pl-6">
                            "{matchingInsights.matchingLogic}"
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {matchingInsights.idealMentorDNA.map((dna: string, i: number) => (
                                <span key={i} className="px-5 py-2 bg-primary-500 text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform cursor-default">
                                    {dna}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-black/80 backdrop-blur-3xl p-10 rounded-[2.5rem] text-white space-y-6 border border-white/5 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex items-center gap-3 text-primary-400 font-black text-xs uppercase tracking-widest relative z-10">
                                <Sparkles className="w-5 h-5" /> Consultation Matrix
                            </div>
                            <p className="text-lg text-white/60 leading-relaxed font-medium relative z-10">{matchingInsights.consultationFocus}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {matchingInsights.strategicTips.map((tip: string, i: number) => (
                                <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-[1.5rem] flex flex-col items-center text-center gap-4 hover:border-primary-500/30 transition-all group">
                                    <CheckCircle2 className="w-8 h-8 text-primary-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-black text-white/40 leading-tight uppercase tracking-widest">{tip}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}

            <div className="space-y-8">
                <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-black text-white italic tracking-[0.2em] uppercase">Tactical Selection</h3>
                    <div className="h-1 w-20 bg-primary-500 rounded-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {matchedMentors.map((mentor, i) => (
                        <MentorMatchCard key={i} {...mentor} />
                    ))}
                </div>
            </div>

            <div className="relative glass-card bg-primary-600 rounded-[3rem] p-16 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden shadow-[0_0_100px_rgba(20,184,166,0.3)]">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-white/20 blur-[80px] rotate-45 pointer-events-none" />
                <div className="space-y-4 relative z-10 max-w-xl text-center lg:text-left">
                    <h3 className="text-4xl lg:text-5xl font-black text-black tracking-tight leading-none italic uppercase">Maximize Your Advantage</h3>
                    <p className="text-black/70 text-lg font-bold">Unsure which specialist fits your current mission? Secure a briefing with our lead advisor.</p>
                </div>
                <Button className="bg-black text-white hover:bg-black/80 px-12 h-20 rounded-3xl font-black text-xl shadow-2xl transform active:scale-95 transition-all relative z-10 shrink-0">
                    Schedule Briefing
                </Button>
            </div>

            <div className="flex justify-center pt-8">
                <Button 
                    variant="ghost" 
                    onClick={() => {setShowResults(false); setSelectedUnis([]); setSelectedFocus([]); setCurrentStep(0);}}
                    className="text-white/40 hover:text-white font-black uppercase tracking-[0.4em] text-xs flex items-center gap-4 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Re-Initialize Engine
                </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
