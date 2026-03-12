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

export default function PersonalStatementReviewer() {
  const [inputMode, setInputMode] = useState<"text" | "upload">("text");
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{ score: number, metrics: {name: string, score: number, feedback: string}[], suggestions: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartAnalysis = async () => {
    if (inputMode === "text" && text.length < 100) return;
    
    setIsAnalyzing(true);
    // Simulate complex AI analysis
    await new Promise(resolve => setTimeout(resolve, 3500));
    
    setResults({
      score: 82,
      metrics: [
        { name: "Academic Tone", score: 90, feedback: "Excellent use of professional terminology related to dental sciences." },
        { name: "Structure & Flow", score: 75, feedback: "Good, but the transition between your work experience and your motivation needs to be smoother." },
        { name: "Impact", score: 85, feedback: "Strong opening statement that immediately captures attention." },
        { name: "UCAS Compliance", score: 95, feedback: "Well within character limits and follows standard formatting." }
      ],
      suggestions: [
        "Include more specific examples of manual dexterity (e.g., musical instruments or fine art).",
        "Elaborate more on your understanding of the NHS Core Values.",
        "Correct a minor grammatical slip in the second paragraph."
      ]
    });
    setIsAnalyzing(false);
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
            <h1 className="text-2xl font-bold text-black-800">AI Personal Statement Reviewer</h1>
            <p className="text-black-500 text-sm">Professional feedback in seconds.</p>
          </div>
        </div>
        <div className="px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-xs font-bold border border-primary-200">
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
            <div className="flex bg-greys-100 p-1 rounded-xl w-fit">
              <button 
                onClick={() => setInputMode("text")}
                className={cn(
                  "px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                  inputMode === "text" ? "bg-white shadow-sm text-primary-600" : "text-black-500 hover:text-black-700"
                )}
              >
                <FileText className="w-4 h-4" />
                Paste Text
              </button>
              <button 
                onClick={() => setInputMode("upload")}
                className={cn(
                  "px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                  inputMode === "upload" ? "bg-white shadow-sm text-primary-600" : "text-black-500 hover:text-black-700"
                )}
              >
                <Upload className="w-4 h-4" />
                Upload File
              </button>
            </div>

            {/* Input Area */}
            <div className="glass-card rounded-2xl p-4 border-greys-200 min-h-[400px]">
              {inputMode === "text" ? (
                <textarea 
                  className="w-full h-[350px] bg-transparent resize-none focus:outline-none p-4 text-black-700 leading-relaxed placeholder:text-black-300"
                  placeholder="Paste your personal statement here (UCAS character limit is 4,000)..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-[350px] flex flex-col items-center justify-center border-2 border-dashed border-primary-100 rounded-xl bg-primary-50/20 hover:bg-primary-50/50 transition-colors cursor-pointer group"
                >
                  <input type="file" className="hidden" ref={fileInputRef} accept=".pdf,.doc,.docx" />
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform font-bold">
                    <Upload className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-black-700 font-semibold text-lg">Upload your statement</h3>
                  <p className="text-black-400 text-sm mt-1">PDF, Word, or Text files are supported</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2 text-xs text-black-400">
                    <Zap className="w-3 h-3 text-primary-500" />
                    Estimated analysis time: 5-10 seconds
                </div>
                <Button 
                    onClick={handleStartAnalysis}
                    disabled={inputMode === "text" && text.length < 100}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-10 h-12 rounded-xl font-bold shadow-lg shadow-primary-200"
                >
                    Analyze Application
                </Button>
            </div>
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
                <div className="absolute inset-0 bg-primary-200/50 blur-3xl rounded-full scale-150 animate-pulse" />
                <BrainCircuit className="w-24 h-24 text-primary-600 relative animate-float" />
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                    className="absolute -inset-4 border-2 border-dashed border-primary-300 rounded-full"
                />
            </div>
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-black-800">AI is reviewing your statement...</h2>
                <p className="text-black-500">Critiquing structure, tone, and clinical experience markers.</p>
            </div>
            
            <div className="w-full max-w-xs h-1.5 bg-greys-200 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3.5 }}
                    className="h-full bg-primary-600"
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
                <ScoreGauge score={results!.score} />

                <div className="md:col-span-2 space-y-4">
                    <h3 className="text-lg font-bold text-black-800">Category Breakdown</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {results!.metrics.map((m: { name: string, score: number, feedback: string }) => (
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
            <div className="glass-card p-8 rounded-3xl bg-white space-y-6">
                <h3 className="text-xl font-bold text-black-800 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary-600" />
                    Key AI Suggestions
                </h3>
                <div className="space-y-4">
                    {results!.suggestions.map((s: string, i: number) => (
                        <div key={i} className="flex gap-4 p-4 rounded-xl bg-primary-50 border border-primary-100 items-start">
                            <div className="h-6 w-6 rounded-full bg-primary-200 text-primary-700 flex items-center justify-center shrink-0 font-bold text-xs">
                                {i + 1}
                            </div>
                            <p className="text-sm text-black-700">{s}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <Button 
                    variant="outline" 
                    onClick={() => {setResults(null); setText("");}}
                    className="w-full sm:w-auto px-8 rounded-xl border-greys-300 transform active:scale-95 transition-transform"
                >
                    Try Another Draft
                </Button>
                <div className="flex gap-4 w-full sm:w-auto">
                    <Button 
                        variant="secondary"
                        className="flex-1 sm:flex-none gap-2 px-6 rounded-xl transform active:scale-95 transition-transform"
                    >
                        <Download className="w-4 h-4" /> Export PDF
                    </Button>
                    <Button className="flex-1 sm:flex-none gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 rounded-xl shadow-lg shadow-primary-200 transform active:scale-95 transition-transform">
                        Share with Mentor <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
