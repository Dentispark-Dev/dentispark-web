"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Target, 
  Flame, 
  Award, 
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import { cn } from "@/src/lib/utils";

import { useAuth } from "@/src/providers/auth-provider";
import { useField } from "@/src/providers/field-provider";

export function PerformanceGrid() {
  const { user } = useAuth();
  const { activeField } = useField();
  const [data, setData] = React.useState<any>(null);
  const [lastSync, setLastSync] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchSparkData = async () => {
      try {
        // 1. Get history
        const syncRes = await fetch(`/api/ai/sync?userId=${user?.guid}`);
        const syncData = await syncRes.json();
        setLastSync(syncData.history?.[0]?.timestamp || null);

        // 2. Get AI Score
        const scoreRes = await fetch("/api/ai/spark-index", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user?.guid,
            field: activeField,
            history: syncData.history || [],
            profileStats: { gpa: "3.92", ucat: "3120" } // Mocked profile tie-in
          }),
        });
        const scoreData = await scoreRes.json();
        setData(scoreData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.guid) fetchSparkData();
  }, [user?.guid, activeField]);

  if (isLoading) return (
    <div className="h-64 bg-slate-50 rounded-[2.5rem] animate-pulse w-full" />
  );

  const score = data?.overallScore || 0;
  const breakdown = data?.breakdown || { academics: 0, clinical: 0, interview: 0 };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 bg-white">
        
        {/* Success Probability Pane */}
        <div className="p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50/50 blur-3xl rounded-full -z-10 transition-transform duration-700 group-hover:scale-150" />
          
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900 leading-tight tracking-tight">Success Probability</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[200px]">Based on dynamic enrollment readiness</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 transition-transform duration-300 group-hover:rotate-12">
              <Target className="w-6 h-6" />
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-100"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="52"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 52}
                  initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                  animate={{ strokeDashoffset: (2 * Math.PI * 52) * (1 - score / 100) }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  strokeLinecap="round"
                  className="text-emerald-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-slate-900">{score}%</span>
                  <span className="text-[8px] font-extrabold uppercase tracking-widest text-emerald-500">{data?.rank || "Evaluating"}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-xs font-bold">
                <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-2xl flex items-center justify-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    {data?.recentImprovement > 0 ? `+${data.recentImprovement}% Boost` : `Steady Pace`}
                </div>
                <div className="bg-slate-50 text-slate-500 px-4 py-3 rounded-2xl flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Verified
                </div>
            </div>
          </div>
        </div>

        {/* Engagement Streak Pane */}
        <div className="p-8 lg:p-10 flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-50/50 blur-3xl rounded-full -z-10 transition-transform duration-700 group-hover:scale-150" />

          <div className="flex justify-between items-start mb-8">
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900 leading-tight tracking-tight">Active Streak</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[200px]">Consecutive days logging progress</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-2xl text-orange-600 transition-transform duration-300 group-hover:-rotate-12">
                  <Flame className="w-6 h-6" />
              </div>
          </div>

          <div className="space-y-6">
              <div className="flex items-baseline gap-2">
                  <p className="text-5xl font-extrabold text-slate-900 tracking-tighter">12</p>
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Days</span>
              </div>

              <div className="flex gap-1.5 overflow-hidden">
                  {Array.from({ length: 14 }).map((_, i) => (
                      <motion.div 
                          key={i} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={cn(
                              "h-8 flex-1 rounded-md",
                              i < 12 ? "bg-orange-500" : "bg-slate-100"
                          )}
                      />
                  ))}
              </div>
              <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  <span>Continuity Score</span>
                  <span className="text-orange-600">LEGENDARY</span>
              </div>
          </div>
        </div>

        {/* Competency Score Pane */}
        <div className="p-8 lg:p-10 flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50/50 blur-3xl rounded-full -z-10 transition-transform duration-700 group-hover:scale-150" />

          <div className="flex justify-between items-start mb-8">
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900 leading-tight tracking-tight">Competency</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[200px]">Profile sector breakdown</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 transition-transform duration-300 group-hover:rotate-12">
                  <Award className="w-6 h-6" />
              </div>
          </div>

          <div className="space-y-5">
              {[
                  { label: "Academics", score: breakdown.academics, color: "bg-emerald-500", text: "text-emerald-700" },
                  { label: "Clinical", score: breakdown.clinical, color: "bg-blue-500", text: "text-blue-700" },
                  { label: "Interview", score: breakdown.interview, color: "bg-purple-500", text: "text-purple-700" }
              ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-4">
                      <span className="w-20 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 shrink-0">
                          {stat.label}
                      </span>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${stat.score}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className={cn("h-full rounded-full", stat.color)} 
                          />
                      </div>
                      <span className={cn("w-10 text-right text-xs font-extrabold", stat.text)}>
                          {stat.score}%
                      </span>
                  </div>
              ))}
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-6 pt-6 border-t border-slate-100 uppercase tracking-widest">
              <Activity className="w-3 h-3 text-blue-500" />
              {lastSync ? `Intelligence Synced ${new Date(lastSync).toLocaleDateString()}` : "Syncing Intelligence Assets..."}
          </div>
        </div>
      </div>
    </div>
  );
}
