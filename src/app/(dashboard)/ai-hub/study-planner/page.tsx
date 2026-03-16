"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Calendar, 
  ChevronRight, 
  Loader2, 
  Sparkles, 
  BookOpen, 
  Target,
  Clock,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useField } from "@/src/providers/field-provider";

export default function StudyPlannerPage() {
  const { activeField, activeFieldLabel } = useField();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    examDate: "",
    weakAreas: "",
    targetScore: ""
  });
  const [plan, setPlan] = useState<any>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/study-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, field: activeField }),
      });
      const data = await response.json();
      setPlan(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/ai-hub" className="p-2 hover:bg-greys-100 rounded-lg transition-colors text-black-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-black-800">AI 90-Day Study Planner</h1>
          <p className="text-black-500 text-sm">Personalized strategy for your {activeFieldLabel} entrance exams.</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!plan && !isGenerating ? (
          <motion.div 
            key="config"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-10 rounded-[2.5rem] bg-white border-primary-100/30 space-y-8 shadow-sm"
          >
            <div className="text-center space-y-2">
                <Target className="w-12 h-12 text-primary-600 mx-auto" />
                <h2 className="text-2xl font-bold text-black-800">Map Your Success</h2>
                <p className="text-black-500 text-sm">Tell us your targets, and we'll build the road to get there.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-black-400 uppercase tracking-widest pl-1">Target Exam Date</label>
                    <Input 
                        type="date"
                        value={formData.examDate}
                        onChange={(e) => setFormData({...formData, examDate: e.target.value})}
                        className="rounded-xl h-12"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-black-400 uppercase tracking-widest pl-1">Target Score / Percentile</label>
                    <Input 
                        placeholder="e.g. 95th Percentile"
                        value={formData.targetScore}
                        onChange={(e) => setFormData({...formData, targetScore: e.target.value})}
                        className="rounded-xl h-12"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-black-400 uppercase tracking-widest pl-1">Weakest Topics</label>
                    <Input 
                        placeholder="e.g. Organic Chemistry, VR"
                        value={formData.weakAreas}
                        onChange={(e) => setFormData({...formData, weakAreas: e.target.value})}
                        className="rounded-xl h-12"
                    />
                </div>
            </div>

            <Button 
                onClick={handleGenerate}
                disabled={!formData.examDate}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white h-14 rounded-2xl font-bold shadow-lg shadow-primary-200 transition-all text-lg"
            >
                Generate 90-Day Plan <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        ) : isGenerating ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 space-y-8"
          >
            <div className="relative">
                <Calendar className="w-20 h-20 text-primary-200" />
                <motion.div 
                    animate={{ y: [0, 40, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute top-0 left-0 right-0 h-1 bg-primary-600 rounded-full"
                />
            </div>
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-black-800">Synthesizing Your Curriculum...</h3>
                <p className="text-black-500">Creating a data-driven schedule optimized for your target date.</p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="plan"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Timeline Phases */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plan.phases.map((phase: any, i: number) => (
                    <div key={i} className="glass-card p-6 rounded-3xl bg-white border-primary-100/20 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="text-6xl font-black">{i + 1}</span>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-black text-primary-600 uppercase tracking-widest text-[10px]">{phase.duration}</h4>
                                <h3 className="text-lg font-bold text-black-800">{phase.name}</h3>
                            </div>
                            <p className="text-xs text-black-500 font-medium leading-relaxed">{phase.focus}</p>
                            <div className="pt-2 flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase">
                                <CheckCircle2 className="w-3 h-3" /> {phase.milestone}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Weekly Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-8 rounded-[2.5rem] bg-white border border-greys-100 shadow-sm space-y-6">
                    <h3 className="text-xl font-bold text-black-800">Representative Weekly Flow</h3>
                    <div className="space-y-3">
                        {plan.weeklySchedule.map((day: any, i: number) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-greys-50 transition-colors border border-transparent hover:border-greys-100 group">
                                <div className="w-12 text-xs font-black text-black-300 uppercase group-hover:text-primary-600 transition-colors">{day.day}</div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-black-700">{day.activity}</p>
                                </div>
                                <div className="text-[10px] font-bold text-black-400 bg-greys-100 px-3 py-1 rounded-full">{day.duration}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-card p-6 rounded-3xl bg-primary-600 text-white space-y-4 shadow-xl shadow-primary-100">
                        <h4 className="font-bold flex items-center gap-2">
                            <BookOpen className="w-4 h-4" /> Essential Materials
                        </h4>
                        <ul className="space-y-2 opacity-90">
                            {plan.materials.map((m: string, i: number) => (
                                <li key={i} className="text-xs font-medium border-l-2 border-white/20 pl-3 py-1">{m}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="glass-card p-6 rounded-3xl bg-white border border-greys-100 space-y-4 shadow-sm">
                        <h4 className="font-bold text-black-800 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary-600" /> Pro Tips
                        </h4>
                        <div className="space-y-3">
                            {plan.tips.map((tip: string, i: number) => (
                                <p key={i} className="text-[10px] text-black-500 font-medium leading-relaxed italic border-l-2 border-primary-200 pl-3">
                                    &quot;{tip}&quot;
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <Button variant="outline" onClick={() => setPlan(null)} className="rounded-xl px-10">
                    Create New Plan
                </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
