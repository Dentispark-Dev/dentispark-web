"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Search, 
  Sparkles, 
  BrainCircuit, 
  CheckCircle2, 
  University,
  Lightbulb,
  Target
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { MatchingWizard } from "@/src/features/ai-hub/components/matching-wizard";
import { useField } from "@/src/providers/field-provider";
import { MentorMatchCard } from "@/src/features/ai-hub/components/mentor-match-card";

export default function MentorMatchingPage() {
  const { activeField } = useField();
  const [isMatching, setIsMatching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedUnis, setSelectedUnis] = useState<string[]>([]);
  const [selectedFocus, setSelectedFocus] = useState<string[]>([]);
  const [matchingInsights, setMatchingInsights] = useState<any>(null);

  const universities = ["King's College London", "UCL", "University of Manchester", "Queen Mary", "Bristol Dental School", "Glasgow Dental School"];
  const focusAreas = ["Personal Statement", "Manual Dexterity", "UCAT Prep", "MMI Interview", "Mock Interview", "NHS Values"];

  const handleComplete = async () => {
    setIsMatching(true);
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
      const data = await response.json();
      setMatchingInsights(data);
      setShowResults(true);
    } catch (error) {
      console.error(error);
      setShowResults(true); // Fallback to mocks on error
    } finally {
      setIsMatching(false);
    }
  };

  const steps = [
    {
      title: "University Targets",
      description: "Select which dental schools you are aiming for to find mentors from those institutions.",
      component: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {universities.map(uni => (
            <button
              key={uni}
              onClick={() => setSelectedUnis(prev => prev.includes(uni) ? prev.filter(u => u !== uni) : [...prev, uni])}
              className={cn(
                "p-4 rounded-2xl border transition-all text-left flex items-center gap-3",
                selectedUnis.includes(uni) 
                  ? "bg-primary-50 border-primary-500 text-primary-900 shadow-sm" 
                  : "bg-white border-greys-100 text-black-600 hover:border-primary-200"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                selectedUnis.includes(uni) ? "bg-primary-500 text-white" : "bg-greys-50 text-black-400"
              )}>
                <University className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold">{uni}</span>
            </button>
          ))}
        </div>
      )
    },
    {
      title: "Focus Areas",
      description: "What specific parts of the application journey do you need the most help with?",
      component: (
        <div className="flex flex-wrap gap-3 mt-4">
          {focusAreas.map(focus => (
            <button
              key={focus}
              onClick={() => setSelectedFocus(prev => prev.includes(focus) ? prev.filter(f => f !== focus) : [...prev, focus])}
              className={cn(
                "px-6 py-3 rounded-2xl border transition-all flex items-center gap-2",
                selectedFocus.includes(focus)
                  ? "bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-100"
                  : "bg-white border-greys-100 text-black-700 hover:border-primary-200"
              )}
            >
              <Target className={cn("w-4 h-4", selectedFocus.includes(focus) ? "text-white" : "text-primary-500")} />
              <span className="text-sm font-bold">{focus}</span>
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
    <div className="max-w-5xl mx-auto space-y-8 pb-12 min-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/ai-hub" className="p-2 hover:bg-greys-100 rounded-lg transition-colors text-black-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-black-800">Smart Mentor Matching</h1>
            <p className="text-black-500 text-sm">Find your perfect guide based on targets & skills.</p>
          </div>
        </div>
        {!showResults && (
            <div className="flex items-center gap-2 px-4 py-2 bg-white/50 border border-greys-100 rounded-2xl shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-ping"></span>
                <span className="text-xs font-bold text-black-600">84 Active Mentors Online</span>
            </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!showResults && !isMatching ? (
          <motion.div 
            key="wizard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
          >
            <MatchingWizard steps={steps} onComplete={handleComplete} />
          </motion.div>
        ) : isMatching ? (
          <motion.div 
            key="matching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[500px] space-y-8"
          >
            <div className="relative">
                <div className="absolute inset-0 bg-primary-300/30 blur-3xl rounded-full scale-150 animate-pulse" />
                <BrainCircuit className="w-24 h-24 text-primary-600 relative animate-float" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-32 h-32 border-2 border-primary-500 rounded-full"
                    />
                </div>
            </div>
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-black text-black-800">Analyzing compatibility...</h2>
                <div className="flex gap-4">
                    {["Scanning Mentors", "Checking Targets", "Optimizing Flow"].map((text, i) => (
                        <div key={i} className="flex items-center gap-2 px-4 py-2 glass rounded-xl border-greys-100">
                            <motion.div 
                                animate={{ opacity: [1, 0.4, 1] }}
                                transition={{ repeat: Infinity, duration: 1, delay: i * 0.3 }}
                                className="w-2 h-2 rounded-full bg-primary-500" 
                            />
                            <span className="text-[10px] font-bold text-black-600 uppercase tracking-widest">{text}</span>
                        </div>
                    ))}
                </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            {/* Results Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-6 py-2 bg-green-50 text-green-700 rounded-full border border-green-200 text-sm font-bold shadow-sm">
                    <Sparkles className="w-4 h-4" />
                    Optimal Matches Found
                </div>
                <h2 className="text-4xl font-black text-black-900 tracking-tight">Your Custom Mentor Shortlist</h2>
                <p className="text-black-500 max-w-xl mx-auto">Our AI has analyzed 100+ data points to match you with mentors who specifically excel in your target areas.</p>
            </div>

            {matchingInsights && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                    <div className="glass-card p-10 rounded-[2.5rem] bg-gradient-to-br from-primary-50 to-white border-primary-100 flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-200">
                                <BrainCircuit className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-black-800">Matching Intelligence</h3>
                                <p className="text-xs text-black-500 uppercase tracking-widest font-black">Strategic Logic</p>
                            </div>
                        </div>
                        <p className="text-sm font-medium text-black-600 leading-relaxed italic border-l-4 border-primary-500 pl-4">
                            "{matchingInsights.matchingLogic}"
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {matchingInsights.idealMentorDNA.map((dna: string, i: number) => (
                                <span key={i} className="px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-[10px] font-black uppercase tracking-tighter">
                                    {dna}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-black-900 p-8 rounded-[2rem] text-white space-y-4 shadow-xl">
                            <div className="flex items-center gap-2 text-primary-400 font-bold text-xs uppercase tracking-widest">
                                <Sparkles className="w-4 h-4" /> Consultation Strategy
                            </div>
                            <p className="text-sm text-greys-100 leading-relaxed font-medium">{matchingInsights.consultationFocus}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {matchingInsights.strategicTips.map((tip: string, i: number) => (
                                <div key={i} className="p-4 bg-white border border-greys-100 rounded-2xl flex flex-col items-center text-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    <span className="text-[10px] font-bold text-black-600 leading-tight">{tip}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Match Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {matchedMentors.map((mentor, i) => (
                    <MentorMatchCard key={i} {...mentor} />
                ))}
            </div>

            {/* Consultation Banner */}
            <div className="glass-card bg-black-900 overflow-hidden relative rounded-[2.5rem]">
                <div className="absolute top-0 right-0 p-8 opacity-20">
                    <Lightbulb className="w-48 h-48 text-white rotate-12" />
                </div>
                <div className="p-10 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-white">Unsure who to pick?</h3>
                        <p className="text-greys-400">Book a free 15-min discovery call with our Lead Advisor to find your path.</p>
                    </div>
                    <Button className="bg-primary-500 hover:bg-primary-600 text-white px-10 h-14 rounded-2xl font-bold shadow-xl shadow-primary-900/40 transform active:scale-95 transition-all">
                        Schedule Discovery Call
                    </Button>
                </div>
            </div>

            <div className="flex justify-center">
                <Button 
                    variant="ghost" 
                    onClick={() => {setShowResults(false); setSelectedUnis([]); setSelectedFocus([]);}}
                    className="text-black-400 hover:text-black-600 flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Start Over
                </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
