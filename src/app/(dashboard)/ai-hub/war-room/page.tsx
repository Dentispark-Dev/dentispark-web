"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  ShieldAlert, 
  Target, 
  TrendingUp, 
  Zap, 
  ChevronRight, 
  Sparkles, 
  BrainCircuit, 
  FileText, 
  Users, 
  Activity,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { ApplicationRadar } from "@/src/features/ai-hub/components/application-radar";
import { cn } from "@/src/lib/utils";

export default function WarRoomPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/ai/war-room");
        if (!res.ok) {
          throw new Error(res.statusText || "Failed to fetch war-room data");
        }
        const json = await res.json();
        setData(json);
      } catch (e: any) {
        console.error(e);
        setError(e.message || "Failed to aggregate war-room intelligence. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6">
        <div className="relative">
            <div className="absolute inset-0 bg-emerald-100 blur-3xl rounded-full scale-150 animate-pulse" />
            <BrainCircuit className="w-16 h-16 text-emerald-600 relative animate-float" />
        </div>
        <p className="text-gray-400 font-sora font-bold uppercase tracking-widest text-[10px]">Assembling Command Center Intelligence...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6 max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-4">
            <AlertCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-sora font-bold text-gray-900 tracking-tight">Command Center Offline</h2>
        <p className="text-gray-500 font-medium">{error}</p>
        <Button 
            onClick={() => window.location.reload()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-12 rounded-xl font-sora font-bold shadow-sm"
        >
            Retry Connection
        </Button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* War-Room Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
            <Link href="/ai-hub" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-emerald-600 transition-colors">
                <ArrowLeft className="w-3 h-3" /> Back to Intelligence Hub
            </Link>
            <div className="space-y-1">
                <h1 className="text-5xl font-sora font-bold text-gray-900 tracking-tight">Admissions War-Room</h1>
                <p className="text-gray-500 font-medium text-lg">Real-time tactical briefing for your application journey.</p>
            </div>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-3xl border border-gray-100 shadow-sm">
            <div className="px-6 py-4 rounded-2xl bg-gray-900 text-white text-center">
                <span className="block text-[8px] font-bold uppercase tracking-[0.3em] opacity-50 mb-1">Combat Readiness</span>
                <span className="text-3xl font-sora font-bold">{data?.readinessScore}%</span>
            </div>
            <div className="pr-6">
                <span className="block text-[8px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-1">Status</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1 uppercase text-xs">
                    <Activity className="w-3 h-3" /> Operational
                </span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Col: Tactical Assets */}
        <div className="lg:col-span-2 space-y-10">
            
            {/* Tactical Radar Card */}
            <div className="p-10 rounded-[3rem] bg-white border border-gray-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Target className="w-48 h-48 text-emerald-600" />
                </div>
                <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-sora font-bold text-gray-900 tracking-tight">Tactical Radar</h3>
                            <p className="text-sm text-gray-500 font-medium">Visualization of your application balance across critical axes.</p>
                        </div>
                        <div className="space-y-4">
                            {data?.radarData?.map((item: any) => (
                                <div key={item.subject} className="space-y-1.5">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest px-1">
                                        <span className="text-gray-400">{item.subject}</span>
                                        <span className="text-emerald-600 font-sora">{item.A}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.A}%` }}
                                            className="h-full bg-emerald-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 min-h-[300px] flex items-center justify-center bg-gray-50/30 rounded-[2.5rem] border border-gray-100">
                        <ApplicationRadar data={data?.radarData || []} />
                    </div>
                </div>
            </div>

            {/* Strategic Roadmap Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 rounded-[2.5rem] bg-gray-900 text-white space-y-6 relative overflow-hidden group hover:scale-[1.02] transition-transform shadow-sm">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Zap className="w-20 h-20" />
                    </div>
                    <div className="space-y-4 relative z-10">
                        <h4 className="text-xl font-sora font-bold tracking-tight">Next Strategic Strike</h4>
                        <p className="text-gray-400 text-sm leading-relaxed font-medium">Based on your Radar, your **Clinical Reflection** log is the highest priority for Manchester entry.</p>
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-12 font-sora font-bold gap-2 shadow-sm transition-all active:scale-95">
                            Execute Log Update <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                
                <div className="p-8 rounded-[2.5rem] bg-emerald-600 text-white space-y-6 relative overflow-hidden group hover:scale-[1.02] transition-transform shadow-sm">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles className="w-20 h-20" />
                    </div>
                    <div className="space-y-4 relative z-10">
                        <h4 className="text-xl font-sora font-bold tracking-tight">Interview Simulation</h4>
                        <p className="text-white/80 text-sm leading-relaxed font-medium">Your **Vocal Command** is at 78%. Reach 90% to upgrade King's College odds to Low Risk.</p>
                        <Link href="/ai-hub/interview-prep" className="block w-full">
                            <Button className="w-full bg-white text-emerald-700 hover:bg-gray-50 rounded-2xl h-12 font-sora font-bold gap-2 transition-all active:scale-95">
                                Start Session <ChevronRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Col: Admissions Briefing */}
        <div className="lg:col-span-1 space-y-10">
            
            {/* Strategic Directives Feed */}
            <div className="p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-xl font-sora font-bold text-gray-900 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-amber-500" />
                    Strategic Directives
                </h3>
                <div className="space-y-4">
                    {data?.topDirectives?.map((directive: string, i: number) => (
                        <div key={i} className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 flex gap-4 items-start group hover:bg-white hover:shadow-md transition-all">
                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-emerald-600 shadow-sm shrink-0 mt-1">
                                0{i+1}
                            </div>
                            <p className="text-xs text-gray-700 font-semibold leading-relaxed">
                                {directive}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Admissions Radar</h3>
                {data?.schoolBriefings?.map((brief: any, i: number) => (
                    <div key={i} className="p-6 rounded-[2rem] bg-white border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all flex items-center justify-between group shadow-sm">
                        <div className="space-y-0.5">
                            <h5 className="font-sora font-bold text-gray-900 text-sm">{brief.name}</h5>
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                                    brief.risk === 'Low' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                )}>
                                    {brief.risk} Risk
                                </span>
                                <span className="text-[8px] font-bold text-gray-400">Gap: {brief.gap}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="block text-2xl font-sora font-bold text-emerald-600">{brief.probability}%</span>
                            <span className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter">Prob.</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Status Grid Quick Access */}
            <div className="grid grid-cols-2 gap-4">
                {[
                    { label: "Personal Statement", icon: <FileText className="w-4 h-4" />, color: "bg-blue-600" },
                    { label: "Clinical Log", icon: <Activity className="w-4 h-4" />, color: "bg-emerald-600" },
                    { label: "Interview Prep", icon: <BrainCircuit className="w-4 h-4" />, color: "bg-indigo-600" },
                    { label: "Mentor Sync", icon: <Users className="w-4 h-4" />, color: "bg-amber-600" },
                ].map((item) => (
                    <button key={item.label} className="p-4 rounded-3xl bg-white border border-gray-100 hover:border-emerald-500 hover:shadow-md transition-all text-left space-y-3 group">
                        <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110", item.color)}>
                            {item.icon}
                        </div>
                        <span className="block text-[8px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-900 transition-colors">{item.label}</span>
                    </button>
                ))}
            </div>

        </div>
      </div>
    </div>
  );
}
