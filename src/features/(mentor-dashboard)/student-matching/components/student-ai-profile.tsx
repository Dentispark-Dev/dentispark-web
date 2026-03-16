"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  BrainCircuit, 
  Sparkles, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  Zap,
  BarChart3,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { ScoreGauge } from "@/src/features/ai-hub/components/score-gauge";

interface StudentAIProfileProps {
  studentId: string;
}

export function StudentAIProfile({ studentId }: StudentAIProfileProps) {
  const [insights, setInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const response = await fetch("/api/mentor/student-insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId }),
        });
        const data = await response.json();
        setInsights(data);
      } catch (error) {
        console.error("Error fetching insights:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchInsights();
  }, [studentId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <BrainCircuit className="w-12 h-12 text-primary-600 animate-pulse" />
        <p className="text-black-500 font-medium">Drafting Mentor Intelligence Profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/mentor/student-matching" className="p-2 hover:bg-greys-100 rounded-lg transition-colors text-black-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-black-800">Student Intelligence Profile</h1>
            <p className="text-black-500 text-sm">AI-driven assessment for mentee integration.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-xl text-xs font-bold shadow-lg">
            <TrendingUp className="w-4 h-4 text-primary-400" />
            Ranked: Tier A- Elite
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Spark Index & Metrics */}
        <div className="lg:col-span-1 space-y-8">
            <div className="glass-card p-8 rounded-[2.5rem] border-primary-100 bg-white shadow-sm flex flex-col items-center text-center">
                <h3 className="text-xs font-black text-black-400 uppercase tracking-widest mb-6">Spark Index (Readiness)</h3>
                <ScoreGauge score={insights?.predictedAcceptanceOdds || 85} />
                <div className="grid grid-cols-3 gap-4 w-full mt-8 pt-8 border-t border-greys-100">
                    {[
                        { label: "Acad", val: 92, color: "text-blue-500" },
                        { label: "Clin", val: 78, color: "text-green-500" },
                        { label: "Int", val: 65, color: "text-orange-500" }
                    ].map(stat => (
                        <div key={stat.label} className="space-y-1">
                            <span className="text-[10px] font-black text-black-400 uppercase">{stat.label}</span>
                            <p className={cn("text-lg font-black", stat.color)}>{stat.val}%</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass-card p-6 rounded-3xl bg-black-900 text-white space-y-4">
                <div className="flex items-center gap-2 text-primary-400 text-[10px] font-black uppercase tracking-widest">
                    <Zap className="w-4 h-4" /> Priority Action Items
                </div>
                <div className="space-y-3">
                    {insights?.mentorActionPoints?.map((point: string, i: number) => (
                        <div key={i} className="flex gap-3 text-xs leading-relaxed">
                            <CheckCircle2 className="w-4 h-4 text-primary-500 shrink-0" />
                            <span className="text-white/80">{point}</span>
                        </div>
                    )) || (
                        <p className="text-xs text-white/50 italic">No priority actions detected.</p>
                    )}
                </div>
            </div>
        </div>

        {/* Right Col: AI Case Notes & Analysis */}
        <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-10 rounded-[2.5rem] border-primary-100 bg-white shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-primary-600" />
                        <h3 className="text-xl font-bold text-black-800">AI Mentor Case Notes</h3>
                    </div>
                    <span className="text-[10px] font-bold text-black-400 uppercase bg-greys-100 px-3 py-1 rounded-full">v3.0 Analysis</span>
                </div>

                <div className="space-y-6">
                    <p className="text-black-600 leading-relaxed font-medium bg-primary-50/50 p-6 rounded-3xl border border-primary-100 italic">
                        &quot;{insights?.summary || "Analyzing student history and synchronizing data layers..."}&quot;
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <div className="space-y-4">
                            <h4 className="flex items-center gap-2 text-xs font-black text-green-600 uppercase tracking-widest">
                                <CheckCircle2 className="w-4 h-4" /> Cognitive Strengths
                            </h4>
                            <ul className="space-y-2">
                                {insights?.strengths?.map((s: string, i: number) => (
                                    <li key={i} className="text-sm text-black-700 flex gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="flex items-center gap-2 text-xs font-black text-amber-600 uppercase tracking-widest">
                                <AlertCircle className="w-4 h-4" /> Growth Opportunity
                            </h4>
                            <ul className="space-y-2">
                                {insights?.weaknesses?.map((w: string, i: number) => (
                                    <li key={i} className="text-sm text-black-700 flex gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                        {w}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-greys-100 flex justify-end gap-4">
                    <Button variant="outline" className="rounded-xl px-8 border-greys-300">Archive Notes</Button>
                    <Button className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-10 font-bold shadow-lg shadow-primary-200">
                        Discuss with Student
                    </Button>
                </div>
            </div>

            {/* Preparation Activity Feed */}
            <div className="glass-card p-10 rounded-[2.5rem] border-primary-100 bg-white shadow-sm space-y-6">
                <div className="flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-primary-600" />
                    <h3 className="text-xl font-bold text-black-800">Intelligence Sync History</h3>
                </div>
                <div className="space-y-4">
                    {[
                        { date: "Mar 15, 2024", tool: "Transcript Parser", res: "GPA 3.92 Extracted", impact: "+4% Spark" },
                        { date: "Mar 14, 2024", tool: "Personal Statement", res: "82% Quality Score", impact: "+12% Spark" },
                        { date: "Mar 12, 2024", tool: "Interview Prep", res: "Elite Station Completed", impact: "+7% Spark" }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-greys-50 hover:bg-greys-100 transition-colors">
                            <div className="flex gap-4 items-center">
                                <div className="w-1 h-10 bg-primary-500 rounded-full" />
                                <div>
                                    <p className="text-sm font-bold text-black-800">{item.tool}</p>
                                    <p className="text-[10px] text-black-400 font-medium uppercase tracking-widest">{item.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-black-700">{item.res}</p>
                                <p className="text-[10px] font-black text-primary-600 italic">{item.impact}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
