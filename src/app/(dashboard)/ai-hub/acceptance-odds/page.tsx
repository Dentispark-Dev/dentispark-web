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
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    // Load persisted state
    const saved = localStorage.getItem("dentispark_acceptance_odds");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setResults(parsed.results || null);
        setProfile(parsed.profile || { gpa: "", entranceScore: "", clinicalHours: "", volunteering: "" });
      } catch (e) {
        console.error("Failed to parse saved odds data", e);
      }
    }
  }, []);

  React.useEffect(() => {
    // Save state
    localStorage.setItem("dentispark_acceptance_odds", JSON.stringify({ results, profile }));
  }, [results, profile]);

  const handleCalculate = async () => {
    setIsCalculating(true);
    setError(null);
    try {
      const response = await fetch("/api/ai/matchmaker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, field: activeField }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || response.statusText || "Matchmaking failed");
      }

      const data = await response.json();
      setResults(data);
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Failed to generate university matching data. Please try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/ai-hub" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-jakarta font-bold text-gray-900">Admission Alpha Matchmaker</h1>
            <p className="text-gray-500 text-sm font-medium">School-specific acceptance probabilities & gap analysis.</p>
          </div>
        </div>
        <div className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
            v4.2 Probability Engine
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!results && !isCalculating ? (
          <motion.div 
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-10 rounded-3xl bg-white border border-gray-100 space-y-8 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 pointer-events-none">
                <Target className="w-64 h-64" />
            </div>

            <div className="space-y-2 relative z-10">
                <h2 className="text-3xl font-jakarta font-bold text-gray-900 tracking-tight">Build Your Profile</h2>
                <p className="text-gray-500 font-medium">Our AI will match your stats against individual UK school benchmarks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Target GPA / A-Levels</label>
                    <Input 
                        placeholder="e.g. 3.9 / AAA"
                        value={profile.gpa}
                        onChange={(e) => setProfile({...profile, gpa: e.target.value})}
                        className="rounded-xl h-14 bg-gray-50 border-gray-100 focus:bg-white focus:border-emerald-500 transition-all font-medium"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Admission Test (UCAT/MCAT/BMAT)</label>
                    <Input 
                        placeholder="Expected Score"
                        value={profile.entranceScore}
                        onChange={(e) => setProfile({...profile, entranceScore: e.target.value})}
                        className="rounded-xl h-14 bg-gray-50 border-gray-100 focus:bg-white focus:border-emerald-500 transition-all font-medium"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Clinical Experience Hours</label>
                    <Input 
                        placeholder="Hours verified"
                        value={profile.clinicalHours}
                        onChange={(e) => setProfile({...profile, clinicalHours: e.target.value})}
                        className="rounded-xl h-14 bg-gray-50 border-gray-100 focus:bg-white focus:border-emerald-500 transition-all font-medium"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Extracurricular Highlights</label>
                    <Input 
                        placeholder="Summary of roles"
                        value={profile.volunteering}
                        onChange={(e) => setProfile({...profile, volunteering: e.target.value})}
                        className="rounded-xl h-14 bg-gray-50 border-gray-100 focus:bg-white focus:border-emerald-500 transition-all font-medium"
                    />
                </div>
            </div>
            <Button 
                onClick={handleCalculate}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-16 rounded-xl font-jakarta font-semibold transition-all text-xl gap-3 shadow-sm group"
            >
                Start Matching <TrendingUp className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>

            {error && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-center gap-3 text-amber-800">
                    <AlertCircle className="w-5 h-5 shrink-0 text-amber-500" />
                    <p className="text-sm font-semibold">{error}</p>
                </div>
            )}
          </motion.div>
        ) : isCalculating ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 space-y-10"
          >
            <div className="relative">
                <div className="absolute inset-0 bg-emerald-100/50 blur-3xl rounded-full scale-150 animate-pulse" />
                <BrainCircuit className="w-24 h-24 text-emerald-600 relative animate-float" />
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    className="absolute -inset-6 border-2 border-dashed border-emerald-200 rounded-full"
                />
            </div>
            <div className="text-center space-y-3">
                <h3 className="text-3xl font-jakarta font-bold text-gray-900 tracking-tight">Running Simulation...</h3>
                <p className="text-gray-500 font-medium max-w-sm mx-auto">Analyzing profile against historical admission thresholds for {activeFieldLabel} schools.</p>
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
            <div className="p-10 rounded-3xl bg-emerald-600 text-white space-y-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-white/10 blur-[80px] rotate-45 pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
                    <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl font-jakarta font-bold shrink-0 shadow-sm border border-white/20">
                        82%
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-2xl font-jakarta font-bold tracking-tight text-white leading-tight">Strategic Match Directives</h3>
                        <p className="text-emerald-50 leading-relaxed font-medium">
                            {results?.overallStrategy}
                        </p>
                    </div>
                </div>
            </div>

            {/* University Match Grid */}
            <div className="space-y-8">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-2xl font-jakarta font-bold text-gray-900 tracking-tight">Individual School Predictions</h3>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ranked by Probability</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {results?.universityPredictions?.map((univ: any, i: number) => (
                        <div key={i} className="p-8 rounded-3xl bg-white border border-gray-100 hover:border-emerald-200 transition-all group overflow-hidden relative shadow-sm hover:shadow-md">
                            <div className={cn(
                                "absolute top-0 right-0 px-6 py-2 rounded-bl-3xl text-[10px] font-bold uppercase tracking-wider",
                                univ.riskLevel === 'Low' ? 'bg-emerald-50 text-emerald-700' :
                                univ.riskLevel === 'Moderate' ? 'bg-blue-50 text-blue-700' :
                                'bg-amber-50 text-amber-700'
                            )}>
                                {univ.riskLevel} Risk
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div>
                                    <h4 className="text-xl font-jakarta font-bold text-gray-900 mb-1">{univ.universityName}</h4>
                                    <div className="text-4xl font-jakarta font-bold text-emerald-600">{univ.probability}% <span className="text-[10px] text-gray-400 tracking-widest font-bold uppercase ml-1">Probability</span></div>
                                </div>

                                <div className="space-y-5">
                                    <div className="space-y-3">
                                        <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest inline-flex items-center gap-1.5">
                                            <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Gap Analysis
                                        </h5>
                                        <ul className="space-y-2">
                                            {univ.gapAnalysis.map((gap: string, j: number) => (
                                                <li key={j} className="text-xs text-gray-600 font-medium flex gap-2">
                                                    <div className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                                    {gap}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="space-y-3 p-5 bg-gray-50 rounded-2xl group-hover:bg-emerald-50 transition-colors">
                                        <h5 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest inline-flex items-center gap-1.5">
                                            <Sparkles className="w-3.5 h-3.5" /> Success Roadmap
                                        </h5>
                                        <ul className="space-y-2">
                                            {univ.successSteps.map((step: string, j: number) => (
                                                <li key={j} className="text-xs text-gray-900 font-semibold flex gap-2 items-start">
                                                    <ChevronRight className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
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

            <div className="flex flex-col md:flex-row gap-4 pt-6">
                <Button 
                    variant="outline" 
                    onClick={() => setResults(null)}
                    className="flex-1 h-14 rounded-xl border-gray-200 font-jakarta font-semibold text-gray-600 hover:bg-gray-50"
                >
                    Re-calculate Thresholds
                </Button>
                <Button 
                    className="flex-1 bg-gray-900 hover:bg-black text-white h-14 rounded-xl font-jakarta font-semibold shadow-sm gap-2"
                >
                    Save Strategic Roadmap <Sparkles className="w-5 h-5 text-emerald-400" />
                </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
