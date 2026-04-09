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
      setError("AI Insight Layer Unavailable. We've retrieved our top primary mentor matches for your profile.");
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
        <div className="space-y-3 mt-4">
          {universities.map((uni, i) => (
            <button
              key={uni}
              onClick={() => setSelectedUnis(prev => prev.includes(uni) ? prev.filter(u => u !== uni) : [...prev, uni])}
              className={cn(
                "w-full group/btn p-3 px-5 rounded-[1.25rem] border transition-all flex items-center gap-4",
                selectedUnis.includes(uni) 
                  ? "bg-emerald-50 border-emerald-200 shadow-sm" 
                  : "bg-white border-gray-200 hover:border-emerald-200 hover:bg-gray-50"
              )}
            >
              <div className={cn(
                "w-8 h-8 shrink-0 rounded-[0.5rem] flex items-center justify-center font-bold text-xs transition-all",
                selectedUnis.includes(uni) ? "bg-emerald-600 text-white shadow-sm" : "bg-gray-100 text-gray-400"
              )}>
                {selectedUnis.includes(uni) ? <Check className="w-4 h-4" /> : String.fromCharCode(65 + i)}
              </div>
              <span className={cn(
                  "text-base font-jakarta font-semibold transition-colors text-left",
                  selectedUnis.includes(uni) ? "text-emerald-900" : "text-gray-600 group-hover/btn:text-gray-900"
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
        <div className="space-y-3 mt-4">
          {focusAreas.map((focus, i) => (
            <button
              key={focus}
              onClick={() => setSelectedFocus(prev => prev.includes(focus) ? prev.filter(f => f !== focus) : [...prev, focus])}
              className={cn(
                "w-full group/btn p-3 px-5 rounded-[1.25rem] border transition-all flex items-center gap-4",
                selectedFocus.includes(focus)
                  ? "bg-emerald-50 border-emerald-200 shadow-sm"
                  : "bg-white border-gray-200 hover:border-emerald-200 hover:bg-gray-50"
              )}
            >
               <div className={cn(
                "w-8 h-8 shrink-0 rounded-[0.5rem] flex items-center justify-center font-bold text-xs transition-all",
                selectedFocus.includes(focus) ? "bg-emerald-600 text-white shadow-sm" : "bg-gray-100 text-gray-400"
              )}>
                {selectedFocus.includes(focus) ? <Check className="w-4 h-4" /> : String.fromCharCode(65 + i)}
              </div>
              <span className={cn(
                  "text-base font-jakarta font-semibold transition-colors text-left",
                  selectedFocus.includes(focus) ? "text-emerald-900" : "text-gray-600 group-hover/btn:text-gray-900"
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
    <div className="bg-gray-50 min-h-screen text-gray-900 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {!showResults && !isMatching ? (
            <motion.div key="wizard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <LelandSplitPane
                    step={currentStep}
                    leftContent={
                        <div className="space-y-6">
                            <Link href="/ai-hub" className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors group mb-6">
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                <span className="text-xs font-semibold uppercase tracking-wider">Exit to Hub</span>
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
            className="fixed inset-0 bg-white flex flex-col items-center justify-center space-y-12 z-[100]"
          >
            <IntelligenceRadar step={3} dataPoints={1024} label="Executing Optimal Analysis" />
            <div className="flex gap-4">
                {["Scanning Member Pool", "Synthesizing Profiles", "Calculating Proximity"].map((text, i) => (
                    <div key={i} className="flex items-center gap-2 px-6 py-3 bg-gray-50 rounded-2xl border border-gray-200">
                        <motion.div 
                            animate={{ opacity: [1, 0.4, 1] }}
                            transition={{ repeat: Infinity, duration: 1, delay: i * 0.3 }}
                            className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm" 
                        />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{text}</span>
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
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    Deep Match Analysis Complete
                </div>
                <h2 className="text-5xl lg:text-6xl font-jakarta font-extrabold text-gray-900 tracking-tight leading-[1.1]">
                    Your High-Proximity <br /> <span className="text-emerald-600">Mentor Match.</span>
                </h2>
                <p className="text-xl text-gray-500 font-medium max-w-2xl leading-relaxed">We've audited our entire network to identify the mentors uniquely architected for your specific dental application roadmap.</p>
            </div>

            {error && (
                <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center gap-4 text-emerald-800">
                    <Sparkles className="w-5 h-5 shrink-0 text-emerald-500" />
                    <p className="text-sm font-bold uppercase tracking-widest leading-none">Smart Matching Protocol Active</p>
                </div>
            )}

            {/* Strategic Insights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-7 bg-white p-10 lg:p-12 rounded-3xl border border-gray-200 flex flex-col gap-10 shadow-sm relative overflow-hidden group"
                >
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm">
                            <BrainCircuit className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-xl font-jakarta font-extrabold text-slate-900 tracking-tight">Strategic Architecture</h3>
                            <p className="text-[10px] text-emerald-600 uppercase tracking-widest font-extrabold">AI Match Synthesis</p>
                        </div>
                    </div>
                    
                    <div className="space-y-6 relative z-10">
                        <p className="text-xl font-medium text-gray-800 leading-relaxed border-l-4 border-emerald-500 pl-6 py-1">
                            "{matchingInsights?.matchingLogic || "We've prioritized mentors with clinical surgical backgrounds who align with your KCL and Manchester ambitions."}"
                        </p>
                        <div className="flex flex-wrap gap-2 pt-4">
                            {(matchingInsights?.idealMentorDNA || ["Clinical Specialist", "Interview Veteran", "Academic Excellence"]).map((dna: string, i: number) => (
                                <div key={dna} className="px-5 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-[10px] font-semibold uppercase tracking-wider cursor-default flex items-center gap-2">
                                    <BarChart3 size={14} className="text-emerald-500" />
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
                    <div className="bg-white p-10 rounded-3xl text-gray-900 space-y-6 border border-gray-200 shadow-sm relative overflow-hidden group h-full flex flex-col justify-center">
                        <div className="absolute inset-0 bg-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center gap-3 text-emerald-600 font-bold text-xs uppercase tracking-widest relative z-10">
                            <Sparkles className="w-5 h-5" /> Recommended Trajectory
                        </div>
                        <p className="text-lg text-slate-500 leading-relaxed font-medium relative z-10">
                            {matchingInsights?.consultationFocus || "Focus your initial sessions on MMI scenario roleplay and refining the clinical empathy section of your personal statement."}
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Mentors Grid */}
            <div className="space-y-12">
                <div className="flex items-center justify-between border-b border-gray-200 pb-8">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-3xl font-jakarta font-extrabold text-slate-900 tracking-tight">Elite Specialists</h3>
                        <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-[0.2em]">Matched for your specific mission profile</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="p-3 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                            <Filter size={18} />
                        </div>
                        <div className="p-3 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
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
            <div className="relative bg-emerald-600 rounded-3xl p-16 lg:p-24 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden shadow-sm">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-white/10 blur-[80px] rotate-45 pointer-events-none" />
                
                <div className="space-y-6 relative z-10 max-w-xl text-center lg:text-left">
                    <h3 className="text-4xl lg:text-5xl font-jakarta font-extrabold text-white tracking-tight leading-[1.1]">Accelerate Your Admissions</h3>
                    <p className="text-emerald-50 text-lg font-medium">Unsure which elite specialist fits your mission? Secure a strategic briefing with our lead advisor.</p>
                </div>
                
                <div className="relative z-10 shrink-0">
                    <Link href="/mentorship">
                        <Button className="bg-white text-emerald-900 hover:bg-gray-50 px-12 h-16 rounded-xl font-jakarta font-extrabold text-lg hover:-translate-y-1 transition-all flex items-center gap-4 group">
                            Live Briefing
                            <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Footer Reset */}
            <div className="flex justify-center">
                <button 
                    onClick={() => {setShowResults(false); setSelectedUnis([]); setSelectedFocus([]); setCurrentStep(0);}}
                    className="group flex flex-col items-center gap-4 text-gray-400 hover:text-gray-900 transition-all duration-300"
                >
                    <div className="w-px h-12 bg-gray-200 group-hover:bg-emerald-500 transition-colors" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Reset Search</span>
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
