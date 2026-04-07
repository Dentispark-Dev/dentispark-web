"use client";

import React, { useState, useRef } from "react";
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  BrainCircuit,
  Loader2,
  ChevronRight,
  Download
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { ScoreGauge } from "@/src/features/ai-hub/components/score-gauge";
import { FeedbackCard } from "@/src/features/ai-hub/components/feedback-card";

import { useField } from "@/src/providers/field-provider";
import { useAuth } from "@/src/providers/auth-provider";

export default function PersonalStatementReviewer() {
  const { activeField, activeFieldLabel } = useField();
  const { user } = useAuth();
  const [inputMode, setInputMode] = useState<"text" | "upload">("text");
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
   const [results, setResults] = useState<{ score: number, metrics: {name: string, score: number, feedback: string}[], suggestions: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartAnalysis = async () => {
    if (inputMode === "text" && text.length < 100) return;
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const response = await fetch("/api/ai/personal-statement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, field: activeField }),
      });

      if (!response.ok) {
        throw new Error(response.statusText || "Analysis failed");
      }

      const data = await response.json();
      setResults(data);
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Failed to analyze personal statement. Please try again.");
    } finally {
      setIsAnalyzing(false);
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
            <h1 className="text-2xl font-jakarta font-bold text-gray-900">AI {activeFieldLabel} Statement Reviewer</h1>
            <p className="text-gray-500 text-sm font-medium">Professional feedback for your {activeFieldLabel} application journey.</p>
          </div>
        </div>
        <div className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold border border-emerald-100 uppercase tracking-widest">
            v2.1 Adaptive LLM
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!results && !isAnalyzing ? (
          <motion.div 
            key="input-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            {/* Mode Switcher */}
            <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
              <button 
                onClick={() => setInputMode("text")}
                className={cn(
                  "px-6 py-2 rounded-lg text-sm font-jakarta font-semibold transition-all flex items-center gap-2",
                  inputMode === "text" ? "bg-white shadow-sm text-emerald-600" : "text-gray-500 hover:text-gray-900"
                )}
              >
                <FileText className="w-4 h-4" />
                Paste Text
              </button>
              <button 
                onClick={() => setInputMode("upload")}
                className={cn(
                  "px-6 py-2 rounded-lg text-sm font-jakarta font-semibold transition-all flex items-center gap-2",
                  inputMode === "upload" ? "bg-white shadow-sm text-emerald-600" : "text-gray-500 hover:text-gray-900"
                )}
              >
                <Upload className="w-4 h-4" />
                Upload File
              </button>
            </div>

            {/* Input Area */}
            <div className="relative p-6 rounded-3xl border border-gray-100 min-h-[400px] bg-white shadow-sm flex flex-col">
              {inputMode === "text" ? (
                <>
                  <textarea 
                    className="w-full flex-1 bg-transparent resize-none focus:outline-none p-4 text-gray-700 font-medium leading-relaxed placeholder:text-gray-300"
                    placeholder="Paste your personal statement here (UCAS character limit is 4,000)..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <div className="flex items-center justify-between px-4 py-2 border-t border-gray-50 bg-gray-50/30 rounded-b-2xl">
                    <div className="flex gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Characters</span>
                        <span className={cn(
                          "text-sm font-jakarta font-extrabold",
                          text.length > 4000 ? "text-red-500" : "text-gray-700"
                        )}>
                          {text.length.toLocaleString()} <span className="text-gray-300 font-medium">/ 4,000</span>
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Words</span>
                        <span className="text-sm font-jakarta font-extrabold text-gray-700">
                          {text.trim() === "" ? 0 : text.trim().split(/\s+/).length}
                        </span>
                      </div>
                    </div>
                    {text.length > 4000 && (
                      <div className="flex items-center gap-1.5 text-red-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Limit Exceeded
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex-1 flex flex-col items-center justify-center border-2 border-dashed border-emerald-100 rounded-2xl bg-emerald-50/20 hover:bg-emerald-50/50 transition-colors cursor-pointer group"
                >
                  <input type="file" className="hidden" ref={fileInputRef} accept=".pdf,.doc,.docx" />
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform font-bold">
                    <Upload className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-gray-900 font-jakarta font-bold text-lg">Upload your statement</h3>
                  <p className="text-gray-500 text-sm mt-1 font-medium">PDF, Word, or Text files are supported</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <Zap className="w-3.5 h-3.5 text-emerald-500" />
                    Estimated analysis: 5-10 seconds
                </div>
                <Button 
                    onClick={handleStartAnalysis}
                    disabled={inputMode === "text" && text.length < 100}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 h-12 rounded-xl font-jakarta font-bold shadow-sm transform active:scale-95 transition-all"
                >
                    Analyze Application
                </Button>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}
          </motion.div>
        ) : isAnalyzing ? (
          <motion.div 
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[500px] space-y-8"
          >
            <div className="relative">
                <div className="absolute inset-0 bg-emerald-100/50 blur-3xl rounded-full scale-150 animate-pulse" />
                <BrainCircuit className="w-24 h-24 text-emerald-600 relative animate-float" />
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                    className="absolute -inset-4 border-2 border-dashed border-emerald-200 rounded-full"
                />
            </div>
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-jakarta font-bold text-gray-900">AI is reviewing your statement...</h2>
                <p className="text-gray-500 font-medium">Critiquing structure, tone, and clinical experience markers.</p>
            </div>
            
            <div className="w-full max-w-xs h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3.5 }}
                    className="h-full bg-emerald-600"
                />
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results && <ScoreGauge score={results.score} />}

                <div className="md:col-span-2 space-y-4">
                    <h3 className="text-lg font-jakarta font-bold text-gray-900 pl-1">Category Breakdown</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {results?.metrics.map((m: { name: string, score: number, feedback: string }) => (
                            <FeedbackCard 
                                key={m.name} 
                                name={m.name} 
                                score={m.score} 
                                feedback={m.feedback} 
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Key Suggestions */}
            <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-xl font-jakarta font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    Key AI Suggestions
                </h3>
                <div className="space-y-4">
                    {results?.suggestions.map((s: string, i: number) => (
                        <div key={i} className="flex gap-4 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 items-start">
                            <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-jakarta font-bold text-xs">
                                {i + 1}
                            </div>
                            <p className="text-sm text-gray-700 font-medium leading-relaxed">{s}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <Button 
                    variant="outline" 
                    onClick={() => {setResults(null); setText("");}}
                    className="w-full sm:w-auto px-8 h-12 rounded-xl border-gray-200 font-jakarta font-bold transform active:scale-95 transition-all text-gray-600 hover:bg-gray-50"
                >
                    Try Another Draft
                </Button>
                <div className="flex gap-4 w-full sm:w-auto">
                    <Button 
                        onClick={async () => {
                            try {
                                await fetch("/api/ai/sync", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        userId: user?.guid,
                                        toolId: "personal-statement",
                                        accomplishment: `Achieved 1PS Score of ${results?.score}% in ${activeFieldLabel}`,
                                        metadata: results
                                    })
                                });
                                alert("Intelligence Synced!");
                            } catch (e) { console.error(e); }
                        }}
                        className="flex-1 sm:flex-none gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-12 rounded-xl font-jakarta font-bold shadow-sm transform active:scale-95 transition-all"
                    >
                        Sync to Profile <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
