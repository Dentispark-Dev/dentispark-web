"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Sparkles, 
  BrainCircuit, 
  CheckCircle2, 
  AlertCircle,
  Check,
  Search,
  Filter,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { useField } from "@/src/providers/field-provider";

// Components
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
      // Simulate/Hit API
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
                  ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
                  : "bg-white/5 border-white/5 hover:border-white/20"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all",
                selectedUnis.includes(uni) ? "bg-emerald-500 text-black scale-110" : "bg-white/10 text-white/40"
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
                  ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : "bg-white/5 border-white/5 hover:border-white/20"
              )}
            >
               <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all",
                selectedFocus.includes(focus) ? "bg-emerald-500 text-black scale-110" : "bg-white/10 text-white/40"
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
      name: "Dt. Marcus Thorne",
      university: "Univ of Pennsylvania",
      specialty: "Orthodontic Prep",
      compatibility: 98,
      highlights: ["Elite Orthodontics", "12+ Years Experience"],
      slug: "dt-marcus-thorne",
      image: "/images/premium/mentor-banner.png"
    },
    {
      name: "Dr. Elena Rostova",
      university: "Harvard School of Dental Medicine",
      specialty: "Surgical Residency",
      compatibility: 94,
      highlights: ["Chief of Surgery", "Admissions Committee"],
      slug: "dr-elena-rostova",
      image: "/images/premium/auth-landscape.png"
    },
    {
      name: "Dr. Sarah Chen",
      university: "King's College London",
      specialty: "UCAT Strategy",
      compatibility: 89,
      highlights: ["NHS Consultant", "UCAT Specialist"],
      slug: "dr-sarah-chen",
      image: "/images/premium/mentor-banner.png"
    }
  ];

  return (
    <div className="bg-[#050A0E] min-h-screen text-white overflow-x-hidden">
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
            <IntelligenceRadar step={3} dataPoints={1024} label="Executing Optimal Analysis" />
            <div className="flex gap-4">
                {["Scanning Member Pool", "Synthesizing Profiles", "Calculating Proximity"].map((text, i) => (
                    <div key={i} className="flex items-center gap-2 px-6 py-3 bg-white/5 rounded-2xl border border-white/5">
                        <motion.div 
                            animate={{ opacity: [1, 0.4, 1] }}
                            transition={{ repeat: Infinity, duration: 1, delay: i * 0.3 }}
                            className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
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
            className="max-w-7xl mx-auto px-8 py-20 space-y-24"
          >
            <div className="space-y-6 max-w-4xl">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
                    <Sparkles className="w-4 h-4" />
                    Deep Match Analysis Complete
                </div>
                <h2 className="text-7xl font-black text-white tracking-tighter leading-[0.9] italic uppercase">
                    Your High-Proximity <br /> <span className="text-emerald-500">Mentor Match results</span>
                </h2>
                <p className="text-xl text-white/50 font-medium max-w-2xl">We've audited our entire network to identify the mentors uniquely architected for your specific dental application roadmap.</p>
            </div>

            {error && (
                <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-4 text-amber-400">
                    <AlertCircle className="w-6 h-6 shrink-0" />
                    <p className="text-sm font-bold tracking-tight">{error}</p>
                </div>
            )}

            {/* Strategic Insights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-7 bg-[#0A1218] p-12 rounded-[3.5rem] border border-white/5 flex flex-col gap-10 shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full" />
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-2xl">
                            <BrainCircuit className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white italic tracking-tight uppercase">Strategic Architecture</h3>
                            <p className="text-[9px] text-emerald-400 uppercase tracking-widest font-black">AI Match Synthesis</p>
                        </div>
                    </div>
                    
                    <div className="space-y-6 relative z-10">
                        <p className="text-2xl font-bold text-white/90 leading-tight italic border-l-4 border-emerald-500 pl-8 py-2">
                            "{matchingInsights?.matchingLogic || "We've prioritized mentors with clinical surgical backgrounds who align with your KCL and Manchester ambitions."}"
                        </p>
                        <div className="flex flex-wrap gap-2 pt-4">
                            {(matchingInsights?.idealMentorDNA || ["Clinical Specialist", "Interview Veteran", "Academic Excellence"]).map((dna: string, i: number) => (
                                <div key={dna} className="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all cursor-default flex items-center gap-2">
                                    <BarChart3 size={14} />
                                    {dna}
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-5 space-y-8"
                >
                    <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] text-white space-y-6 border border-white/5 shadow-2xl relative overflow-hidden group h-full flex flex-col justify-center">
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center gap-3 text-emerald-400 font-black text-xs uppercase tracking-widest relative z-10">
                            <Sparkles className="w-5 h-5" /> Recommended Trajectory
                        </div>
                        <p className="text-lg text-white/70 leading-relaxed font-semibold relative z-10 italic">
                            {matchingInsights?.consultationFocus || "Focus your initial sessions on MMI scenario roleplay and refining the clinical empathy section of your personal statement."}
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Mentors Grid */}
            <div className="space-y-12">
                <div className="flex items-center justify-between border-b border-white/5 pb-8">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-3xl font-black text-white italic tracking-tight uppercase">Elite Specialists</h3>
                        <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Matched for your specific mission profile</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-white/40 hover:text-white transition-colors cursor-pointer">
                            <Filter size={18} />
                        </div>
                        <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-white/40 hover:text-white transition-colors cursor-pointer">
                            <Search size={18} />
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {matchedMentors.map((mentor, i) => (
                        <MentorMatchCard key={i} {...mentor} />
                    ))}
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="relative bg-emerald-600 rounded-[4rem] p-16 lg:p-24 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden shadow-[0_40px_100px_rgba(16,185,129,0.2)]">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-white/10 blur-[80px] rotate-45 pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[100%] bg-black/5 blur-[60px] rounded-full pointer-events-none" />
                
                <div className="space-y-6 relative z-10 max-w-xl text-center lg:text-left">
                    <h3 className="text-5xl lg:text-6xl font-black text-black tracking-tighter leading-[0.9] italic uppercase">Accelerate Your Admissions</h3>
                    <p className="text-black/70 text-xl font-bold italic">Unsure which elite specialist fits your mission? Secure a strategic briefing with our lead advisor.</p>
                </div>
                
                <div className="relative z-10 shrink-0">
                    <Button className="bg-black text-white hover:bg-black/90 px-16 h-24 rounded-full font-black text-2xl shadow-3xl transform hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group">
                        Live Briefing
                        <ArrowLeft className="w-6 h-6 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Footer Reset */}
            <div className="flex justify-center">
                <button 
                    onClick={() => {setShowResults(false); setSelectedUnis([]); setSelectedFocus([]); setCurrentStep(0);}}
                    className="group flex flex-col items-center gap-4 text-white/20 hover:text-white transition-all transition-duration-500"
                >
                    <div className="w-px h-12 bg-white/10 group-hover:bg-emerald-500 transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-[0.6em] italic">De-Initialize Engine</span>
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
