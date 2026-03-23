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
  CheckCircle2,
  AlertCircle
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
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch("/api/ai/study-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, field: activeField }),
      });

      if (!response.ok) {
        throw new Error(response.statusText || "Plan generation failed");
      }

      const data = await response.json();
      setPlan(data);
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Failed to generate study plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/ai-hub" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-sora font-bold text-gray-900">AI 90-Day Study Planner</h1>
          <p className="text-gray-500 text-sm font-medium">Personalized strategy for your {activeFieldLabel} entrance exams.</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!plan && !isGenerating ? (
          <motion.div
            key="config"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-10 rounded-[2.5rem] bg-white border border-gray-100 space-y-8 shadow-sm"
          >
            <div className="text-center space-y-2">
              <Target className="w-12 h-12 text-emerald-600 mx-auto" />
              <h2 className="text-2xl font-sora font-bold text-gray-900">Map Your Success</h2>
              <p className="text-gray-500 text-sm font-medium">Tell us your targets, and we'll build the road to get there.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Target Exam Date</label>
                <Input
                  type="date"
                  value={formData.examDate}
                  onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                  className="rounded-xl h-12 border-gray-100 focus:border-emerald-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Target Score / Percentile</label>
                <Input
                  placeholder="e.g. 95th Percentile"
                  value={formData.targetScore}
                  onChange={(e) => setFormData({ ...formData, targetScore: e.target.value })}
                  className="rounded-xl h-12 border-gray-100 focus:border-emerald-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Weakest Topics</label>
                <Input
                  placeholder="e.g. Organic Chemistry, VR"
                  value={formData.weakAreas}
                  onChange={(e) => setFormData({ ...formData, weakAreas: e.target.value })}
                  className="rounded-xl h-12 border-gray-100 focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!formData.examDate}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-14 rounded-2xl font-sora font-bold shadow-sm transition-all text-lg transform active:scale-[0.98]"
            >
              Generate 90-Day Plan <ChevronRight className="ml-2 w-5 h-5" />
            </Button>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
          </motion.div>
        ) : isGenerating ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 space-y-8"
          >
            <div className="relative">
              <Calendar className="w-20 h-20 text-emerald-100" />
              <motion.div
                animate={{ y: [0, 40, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-0 left-0 right-0 h-1 bg-emerald-600 rounded-full"
              />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-sora font-bold text-gray-900">Synthesizing Your Curriculum...</h3>
              <p className="text-gray-500 font-medium">Creating a data-driven schedule optimized for your target date.</p>
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
              {plan?.phases?.map((phase: any, i: number) => (
                <div key={i} className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm relative overflow-hidden group hover:border-emerald-200 transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="text-6xl font-sora font-bold text-emerald-600">{i + 1}</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-emerald-600 uppercase tracking-widest text-[10px]">{phase.duration}</h4>
                      <h3 className="text-lg font-sora font-bold text-gray-900">{phase.name}</h3>
                    </div>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">{phase.focus}</p>
                    <div className="pt-2 flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase">
                      <CheckCircle2 className="w-3 h-3" /> {phase.milestone}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Weekly Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-xl font-sora font-bold text-gray-900">Representative Weekly Flow</h3>
                <div className="space-y-3">
                  {plan?.weeklySchedule?.map((day: any, i: number) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                      <div className="w-12 text-xs font-sora font-bold text-gray-300 uppercase group-hover:text-emerald-600 transition-colors">{day.day}</div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-700">{day.activity}</p>
                      </div>
                      <div className="text-[10px] font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{day.duration}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-emerald-600 text-white space-y-4 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-20">
                    <BookOpen className="w-12 h-12" />
                  </div>
                  <h4 className="font-sora font-bold flex items-center gap-2 relative z-10">
                    Essential Materials
                  </h4>
                  <ul className="space-y-2 opacity-95 relative z-10">
                    {plan?.materials?.map((m: string, i: number) => (
                      <li key={i} className="text-xs font-medium border-l-2 border-white/30 pl-3 py-1">{m}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-gray-100 space-y-4 shadow-sm">
                  <h4 className="font-sora font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" /> Pro Tips
                  </h4>
                  <div className="space-y-3">
                    {plan?.tips?.map((tip: string, i: number) => (
                      <p key={i} className="text-[10px] text-gray-500 font-medium leading-relaxed italic border-l-2 border-emerald-200 pl-3">
                        &quot;{tip}&quot;
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setPlan(null)}
                className="rounded-xl px-10 h-12 border-gray-200 font-sora font-bold text-gray-600 hover:bg-gray-50 transition-all"
              >
                Create New Plan
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
