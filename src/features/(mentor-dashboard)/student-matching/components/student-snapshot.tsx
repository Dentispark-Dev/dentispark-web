"use client";

import { motion } from "framer-motion";
import { 
  Brain, FileText, Target, ChevronRight, 
  CheckCircle2, Clock, AlertTriangle, BarChart3, TrendingUp
} from "lucide-react";
import { cn } from "@/src/lib/utils";

// ─── Types ───────────────────────────────────────────────────────
interface PSScore {
  motivationScore: number;
  nhsCoreValuesScore: number;
  manualDexterityScore?: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
}

interface RoadmapStage {
  id: number;
  label: string;
  status: "completed" | "in_progress" | "locked";
}

interface StudentSnapshotProps {
  studentName: string;
  ucatScore?: string;
  aLevelScore?: string;
  targetSchool?: string;
  psScore?: PSScore;
  roadmap?: RoadmapStage[];
  sessionCount?: number;
}

// ─── Score Ring ───────────────────────────────────────────────────
function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const pct = (score / 10) * 100;
  const circumference = 2 * Math.PI * 18;
  const strokeDash = (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-14 h-14">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r="18" fill="none" stroke="#f1f5f9" strokeWidth="4" />
          <circle
            cx="22" cy="22" r="18" fill="none"
            stroke={color} strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${strokeDash} ${circumference}`}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-black text-slate-900">{score}</span>
        </div>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center leading-tight">{label}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────
export function StudentSnapshot({
  studentName,
  ucatScore,
  aLevelScore,
  targetSchool,
  psScore,
  roadmap,
  sessionCount = 0,
}: StudentSnapshotProps) {
  
  const completedStages = roadmap?.filter(s => s.status === "completed").length ?? 0;
  const totalStages = roadmap?.length ?? 11;
  const progressPct = Math.round((completedStages / totalStages) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-black text-slate-900 text-lg">Student Intelligence</h3>
          <p className="text-slate-400 text-xs font-medium mt-0.5">AI-generated profile for {studentName}</p>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
          Pre-Session Brief
        </span>
      </div>

      {/* UCAT + Academic Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-xl mx-auto mb-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-black text-slate-900">{ucatScore ?? "—"}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">UCAT Score</p>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-xl mx-auto mb-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-xl font-black text-slate-900">{aLevelScore ?? "—"}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">A-Levels</p>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-amber-100 rounded-xl mx-auto mb-2">
            <Target className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-black text-slate-900">{sessionCount}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Sessions Done</p>
        </div>
      </div>

      {/* Target School */}
      {targetSchool && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
          <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
            <Target className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Target School</p>
            <p className="font-bold text-slate-900 text-sm">{targetSchool}</p>
          </div>
        </div>
      )}

      {/* Roadmap Progress */}
      {roadmap && roadmap.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm">Application Roadmap</h4>
            <span className="text-xs font-bold text-slate-500">{completedStages}/{totalStages} stages</span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
            />
          </div>

          {/* Stage List (last 4) */}
          <div className="space-y-2">
            {roadmap.slice(-5).map((stage) => (
              <div key={stage.id} className="flex items-center gap-2.5">
                {stage.status === "completed" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                {stage.status === "in_progress" && <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-pulse" />}
                {stage.status === "locked" && <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-200 shrink-0" />}
                <span className={cn(
                  "text-xs font-medium",
                  stage.status === "completed" && "text-emerald-700",
                  stage.status === "in_progress" && "text-amber-700 font-bold",
                  stage.status === "locked" && "text-slate-400"
                )}>
                  Stage {stage.id}: {stage.label}
                </span>
                {stage.status === "in_progress" && (
                  <span className="ml-auto text-[10px] font-black uppercase tracking-wider text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded">
                    Current
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Personal Statement Scores */}
      {psScore && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-indigo-500" />
            <h4 className="font-bold text-slate-900 text-sm">AI Personal Statement Analysis</h4>
          </div>

          <div className="flex items-center justify-around py-2">
            <ScoreRing score={psScore.motivationScore} label="Motivation" color="#10b981" />
            <ScoreRing score={psScore.nhsCoreValuesScore} label="NHS Values" color="#6366f1" />
            {psScore.manualDexterityScore != null && (
              <ScoreRing score={psScore.manualDexterityScore} label="Dexterity" color="#f59e0b" />
            )}
            <ScoreRing score={psScore.overallScore} label="Overall" color="#0ea5e9" />
          </div>

          {/* Strengths */}
          {psScore.strengths.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Strengths</p>
              {psScore.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-slate-600 text-xs">{s}</p>
                </div>
              ))}
            </div>
          )}

          {/* Weaknesses */}
          {psScore.weaknesses.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Areas to Improve</p>
              {psScore.weaknesses.map((w, i) => (
                <div key={i} className="flex items-start gap-2">
                  <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-slate-600 text-xs">{w}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ─── Demo / Default Export ────────────────────────────────────────
// Renders with realistic mock data so mentors see a real preview even before API integration
export function StudentSnapshotDemo() {
  return (
    <StudentSnapshot
      studentName="Daniel Sarabia"
      ucatScore="2640"
      aLevelScore="AAA*"
      targetSchool="University of Bristol"
      sessionCount={0}
      psScore={{
        motivationScore: 7,
        nhsCoreValuesScore: 5,
        manualDexterityScore: 8,
        overallScore: 6,
        strengths: ["Strong personal anecdote showing early passion", "Good evidence of manual dexterity via violin"],
        weaknesses: ["NHS Core Values paragraph is too generic", "Lacks reflection on work experience moments"],
      }}
      roadmap={[
        { id: 3, label: "A-Level Results", status: "completed" },
        { id: 4, label: "Work Experience", status: "completed" },
        { id: 5, label: "UCAT Preparation", status: "in_progress" },
        { id: 6, label: "Personal Statement", status: "locked" },
        { id: 7, label: "UCAS Submission", status: "locked" },
      ]}
    />
  );
}
