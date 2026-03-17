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
            <div className="absolute inset-0 bg-primary-200 blur-3xl rounded-full scale-150 animate-pulse" />
            <BrainCircuit className="w-16 h-16 text-primary-600 relative animate-float" />
        </div>
        <p className="text-black-500 font-bold uppercase tracking-widest text-[10px]">Assembling Command Center Intelligence...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6 max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-4">
            <AlertCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-black-900">Command Center Offline</h2>
        <p className="text-black-500 font-medium">{error}</p>
        <Button 
            onClick={() => window.location.reload()}
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 h-12 rounded-xl font-bold shadow-lg"
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
            <Link href="/ai-hub" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-black-400 hover:text-primary-600 transition-colors">
                <ArrowLeft className="w-3 h-3" /> Back to Intelligence Hub
            </Link>
            <div className="space-y-1">
                <h1 className="text-5xl font-black text-black-900 tracking-tight">Admissions War-Room</h1>
                <p className="text-black-500 font-medium text-lg">Real-time tactical briefing for your application journey.</p>
            </div>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-3xl border border-greys-100 shadow-sm">
            <div className="px-6 py-4 rounded-2xl bg-black-900 text-white text-center">
                <span className="block text-[8px] font-black uppercase tracking-[0.3em] opacity-50 mb-1">Combat Readiness</span>
                <span className="text-3xl font-black">{data?.readinessScore}%</span>
            </div>
            <div className="pr-6">
                <span className="block text-[8px] font-black uppercase tracking-[0.3em] text-black-400 mb-1">Status</span>
                <span className="text-green-600 font-black flex items-center gap-1 uppercase text-xs">
                    <Activity className="w-3 h-3" /> Operational
                </span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Col: Tactical Assets */}
        <div className="lg:col-span-2 space-y-10">
            
            {/* Tactical Radar Card */}
            <div className="glass-card p-10 rounded-[3rem] bg-white border-greys-100 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Target className="w-48 h-48" />
                </div>
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-black-800 tracking-tight">Tactical Radar</h3>
                            <p className="text-sm text-black-500 font-medium">Visualization of your application balance across critical axes.</p>
                        </div>
                        <div className="space-y-4">
                            {data?.radarData?.map((item: any) => (
                                <div key={item.subject} className="space-y-1.5">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest px-1">
                                        <span className="text-black-400">{item.subject}</span>
                                        <span className="text-primary-600">{item.A}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-greys-50 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.A}%` }}
                                            className="h-full bg-primary-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 min-h-[300px] flex items-center justify-center bg-greys-50/50 rounded-[2.5rem] border border-greys-100/50">
                        <ApplicationRadar data={data?.radarData || []} />
                    </div>
                </div>
            </div>

            {/* Strategic Roadmap Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-8 rounded-[2.5rem] bg-black-900 text-white space-y-6 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Zap className="w-20 h-20" />
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-xl font-black tracking-tight">Next Strategic Strike</h4>
                        <p className="text-white/60 text-sm leading-relaxed">Based on your Radar, your **Clinical Reflection** log is the highest priority for Manchester entry.</p>
                        <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-2xl h-12 font-bold gap-2">
                            Execute Log Update <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                
                <div className="glass-card p-8 rounded-[2.5rem] bg-indigo-600 text-white space-y-6 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles className="w-20 h-20" />
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-xl font-black tracking-tight">Interview Simulation</h4>
                        <p className="text-white/60 text-sm leading-relaxed">Your **Vocal Command** is at 78%. Reach 90% to upgrade King's College odds to Low Risk.</p>
                        <Link href="/ai-hub/interview-prep" className="block w-full">
                            <Button className="w-full bg-white text-indigo-700 hover:bg-greys-50 rounded-2xl h-12 font-bold gap-2">
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
            <div className="glass-card p-8 rounded-[2.5rem] bg-white border border-greys-100 shadow-sm space-y-6">
                <h3 className="text-xl font-black text-black-800 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-amber-500" />
                    Strategic Directives
                </h3>
                <div className="space-y-4">
                    {data?.topDirectives?.map((directive: string, i: number) => (
                        <div key={i} className="p-4 rounded-2xl bg-greys-50 border border-greys-100 flex gap-4 items-start group hover:bg-white hover:shadow-lg transition-all">
                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] font-black text-primary-600 shadow-sm shrink-0 mt-1">
                                0{i+1}
                            </div>
                            <p className="text-xs text-black-700 font-semibold leading-relaxed">
                                {directive}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xs font-black text-black-400 uppercase tracking-widest pl-2">Admissions Radar</h3>
                {data?.schoolBriefings?.map((brief: any, i: number) => (
                    <div key={i} className="glass-card p-6 rounded-[2rem] bg-white border border-greys-100 hover:border-primary-300 transition-all flex items-center justify-between group shadow-sm">
                        <div className="space-y-0.5">
                            <h5 className="font-black text-black-800 text-sm">{brief.name}</h5>
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                                    brief.risk === 'Low' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                )}>
                                    {brief.risk} Risk
                                </span>
                                <span className="text-[8px] font-bold text-black-400">Gap: {brief.gap}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="block text-2xl font-black text-primary-600">{brief.probability}%</span>
                            <span className="text-[8px] font-black text-black-300 uppercase tracking-tighter">Prob.</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Status Grid Quick Access */}
            <div className="grid grid-cols-2 gap-4">
                {[
                    { label: "Personal Statement", icon: <FileText className="w-4 h-4" />, color: "bg-blue-500" },
                    { label: "Clinical Log", icon: <Activity className="w-4 h-4" />, color: "bg-green-500" },
                    { label: "Interview Prep", icon: <BrainCircuit className="w-4 h-4" />, color: "bg-purple-500" },
                    { label: "Mentor Sync", icon: <Users className="w-4 h-4" />, color: "bg-amber-500" },
                ].map((item) => (
                    <button key={item.label} className="p-4 rounded-3xl bg-white border border-greys-100 hover:border-primary-500 hover:shadow-xl transition-all text-left space-y-3 group">
                        <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg", item.color)}>
                            {item.icon}
                        </div>
                        <span className="block text-[8px] font-black uppercase tracking-widest text-black-400 group-hover:text-black-800 transition-colors">{item.label}</span>
                    </button>
                ))}
            </div>

        </div>
      </div>
    </div>
  );
}
