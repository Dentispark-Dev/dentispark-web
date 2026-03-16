"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  BarChart3, 
  Calculator, 
  ChevronRight, 
  Loader2, 
  Sparkles, 
  Target, 
  TrendingUp,
  AlertCircle,
  BrainCircuit
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useField } from "@/src/providers/field-provider";
import { cn } from "@/src/lib/utils";

export default function AcceptanceOddsPage() {
  const { activeField, activeFieldLabel } = useField();
  const [isCalculating, setIsCalculating] = useState(false);
  const [profile, setProfile] = useState({
    gpa: "",
    entranceScore: "",
    clinicalHours: "",
    volunteering: ""
  });
  const [results, setResults] = useState<any>(null);

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      const response = await fetch("/api/ai/matchmaker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, field: activeField }),
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/ai-hub" className="p-2 hover:bg-greys-100 rounded-lg transition-colors text-black-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-black-800">Admission Alpha Matchmaker</h1>
            <p className="text-black-500 text-sm">School-specific acceptance probabilities & gap analysis.</p>
          </div>
        </div>
        <div className="px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-xs font-bold border border-primary-200">
            v4.2 Probability Engine
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!results && !isCalculating ? (
          <motion.div 
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-10 rounded-[3rem] bg-white border-primary-100/30 space-y-8 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
                <Target className="w-64 h-64" />
            </div>

            <div className="space-y-2 relative z-10">
                <h2 className="text-3xl font-black text-black-900 tracking-tight">Build Your Profile</h2>
                <p className="text-black-500 font-medium">Our AI will match your stats against individual UK school benchmarks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-black-400 uppercase tracking-widest pl-1">Target GPA / A-Levels</label>
                    <Input 
                        placeholder="e.g. 3.9 / AAA"
                        value={profile.gpa}
                        onChange={(e) => setProfile({...profile, gpa: e.target.value})}
                        className="rounded-2xl h-14 bg-greys-50/50 border-greys-100 focus:bg-white transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-black-400 uppercase tracking-widest pl-1">Admission Test (UCAT/MCAT/BMAT)</label>
                    <Input 
                        placeholder="Expected Score"
                        value={profile.entranceScore}
                        onChange={(e) => setProfile({...profile, entranceScore: e.target.value})}
                        className="rounded-2xl h-14 bg-greys-50/50 border-greys-100 focus:bg-white transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-black-400 uppercase tracking-widest pl-1">Clinical Experience Hours</label>
                    <Input 
                        placeholder="Hours verified"
                        value={profile.clinicalHours}
                        onChange={(e) => setProfile({...profile, clinicalHours: e.target.value})}
                        className="rounded-2xl h-14 bg-greys-50/50 border-greys-100 focus:bg-white transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-black-400 uppercase tracking-widest pl-1">Extracurricular Highlights</label>
                    <Input 
                        placeholder="Summary of roles"
                        value={profile.volunteering}
                        onChange={(e) => setProfile({...profile, volunteering: e.target.value})}
                        className="rounded-2xl h-14 bg-greys-50/50 border-greys-100 focus:bg-white transition-all"
                    />
                </div>
            </div>

            <Button 
                onClick={handleCalculate}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white h-16 rounded-[2rem] font-black shadow-xl shadow-primary-200 transition-all text-xl gap-3 group"
            >
                Start Matching <TrendingUp className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </motion.div>
        ) : isCalculating ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 space-y-10"
          >
            <div className="relative">
                <div className="absolute inset-0 bg-primary-200/50 blur-3xl rounded-full scale-150 animate-pulse" />
                <BrainCircuit className="w-24 h-24 text-primary-600 relative animate-float" />
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    className="absolute -inset-6 border-2 border-dashed border-primary-200 rounded-full"
                />
            </div>
            <div className="text-center space-y-3">
                <h3 className="text-3xl font-black text-black-900 tracking-tight">Running Simulation...</h3>
                <p className="text-black-500 font-medium max-w-sm mx-auto">Analyzing profile against historical admission thresholds for {activeFieldLabel} schools.</p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Strategy Overview */}
            <div className="glass-card p-10 rounded-[3rem] bg-black-900 text-white space-y-6 shadow-2xl relative overflow-hidden border-t-4 border-primary-500">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="w-32 h-32 rounded-full border-8 border-primary-500/20 flex items-center justify-center text-5xl font-black shrink-0 relative">
                        <div className="absolute inset-2 rounded-full border-4 border-primary-500 animate-spin-slow opacity-30" />
                        !
                    </div>
                    <div className="space-y-4 text-center md:text-left">
                        <h3 className="text-2xl font-black tracking-tight">Strategic Match Directives</h3>
                        <p className="text-white/70 leading-relaxed font-medium">
                            {results.overallStrategy}
                        </p>
                    </div>
                </div>
            </div>

            {/* University Match Grid */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl font-black text-black-900 tracking-tight">Individual School Predictions</h3>
                    <span className="text-[10px] font-black text-black-400 uppercase tracking-[0.2em]">Ranked by Probability</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {results.universityPredictions.map((univ: any, i: number) => (
                        <div key={i} className="glass-card p-8 rounded-[2.5rem] bg-white border border-greys-100 hover:border-primary-300 transition-all group overflow-hidden relative shadow-sm">
                            <div className={cn(
                                "absolute top-0 right-0 px-6 py-2 rounded-bl-3xl text-[10px] font-black uppercase tracking-widest",
                                univ.riskLevel === 'Low' ? 'bg-green-100 text-green-700' :
                                univ.riskLevel === 'Moderate' ? 'bg-blue-100 text-blue-700' :
                                'bg-amber-100 text-amber-700'
                            )}>
                                {univ.riskLevel} Risk
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div>
                                    <h4 className="text-xl font-black text-black-900 mb-1">{univ.universityName}</h4>
                                    <div className="text-4xl font-black text-primary-600">{univ.probability}% <span className="text-[10px] text-black-400 tracking-widest font-black uppercase">Odds</span></div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <h5 className="text-[10px] font-black text-black-400 uppercase tracking-widest inline-flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3 text-amber-500" /> Gap Analysis
                                        </h5>
                                        <ul className="space-y-1">
                                            {univ.gapAnalysis.map((gap: string, j: number) => (
                                                <li key={j} className="text-xs text-black-600 font-medium flex gap-2">
                                                    <div className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                                    {gap}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="space-y-2 p-5 bg-greys-50 rounded-2xl group-hover:bg-primary-50/50 transition-colors">
                                        <h5 className="text-[10px] font-black text-primary-600 uppercase tracking-widest inline-flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" /> Success Roadmap
                                        </h5>
                                        <ul className="space-y-2">
                                            {univ.successSteps.map((step: string, j: number) => (
                                                <li key={j} className="text-xs text-black-900 font-bold flex gap-2 items-start">
                                                    <ChevronRight className="w-3 h-3 text-primary-500 mt-0.5 shrink-0" />
                                                    {step}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <Button 
                    variant="outline" 
                    onClick={() => setResults(null)}
                    className="flex-1 h-14 rounded-2xl border-greys-200 font-bold text-black-600 hover:bg-greys-50"
                >
                    Re-calculate Thresholds
                </Button>
                <Button 
                    className="flex-1 bg-black-900 text-white h-14 rounded-2xl font-bold shadow-xl shadow-greys-200 gap-2"
                >
                    Save as Strategic Roadmap <Sparkles className="w-5 h-5" />
                </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
