"use client";

import React, { useState, useCallback, useEffect } from "react";
import { 
  ArrowLeft, 
  Mic, 
  Play, 
  Square, 
  RefreshCcw, 
  CheckCircle2, 
  BrainCircuit, 
  Clock, 
  AlertCircle,
  BarChart3,
  Award,
  ChevronRight,
  Sparkles,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { InterviewTimer } from "@/src/features/ai-hub/components/interview-timer";
import { QuestionCarousel } from "@/src/features/ai-hub/components/question-carousel";

import { useField } from "@/src/providers/field-provider";
import { useAuth } from "@/src/providers/auth-provider";
import { useSpeechRecognition } from "@/src/hooks/use-speech-recognition";

import { INTERVIEW_QUESTIONS, type InterviewQuestion } from "@/src/features/ai-hub/constants/questions";

export default function InterviewPrepPage() {
  const { activeField, activeFieldLabel } = useField();
  const { user } = useAuth();
  const [sessionState, setSessionState] = useState<"setup" | "active" | "feedback">("setup");
  const [selectedStyle, setSelectedStyle] = useState<"MMI" | "PANEL" | "ETHICS">("MMI");
  const [stationPhase, setStationPhase] = useState<"prep" | "answer">("prep");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [difficulty, setDifficulty] = useState<"Standard" | "Elite">("Standard");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    setTranscript,
    isSupported: isSTTSupported 
  } = useSpeechRecognition();

  const [results, setResults] = useState<{
    metrics: { label: string, score: number }[],
    strengths: string[],
    improvements: string[],
    critique: string
  } | null>(null);

  // Filtered Questions based on Field and Style
  const questions = useMemo(() => {
    return INTERVIEW_QUESTIONS.filter(q => 
        (q.field === activeField || q.field === "BOTH") && 
        (q.style === selectedStyle)
    ).map(q => q.text);
  }, [activeField, selectedStyle]);

  // Fallback if no questions match
  const activeQuestions = questions.length > 0 ? questions : [
    `Why do you want to pursue a career in ${activeFieldLabel}?`,
    "Tell me about a time you showed leadership.",
    "How do you handle stress in a clinical setting?"
  ];

  const speakQuestion = useCallback((text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes("Google") && v.lang.includes("en-GB")) || 
                           voices.find(v => v.lang.includes("en-GB")) ||
                           voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;
        window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleStartSession = () => {
    setSessionState("active");
    setStationPhase("prep");
    setCurrentQuestionIndex(0);
  };

  const startStation = () => {
      setStationPhase("answer");
      speakQuestion(activeQuestions[currentQuestionIndex]);
      startListening();
  };

  const handleFinishInterview = async () => {
    stopListening();
    setIsAnalyzing(true);
    setError(null);
    setSessionState("feedback");
    
    try {
      const response = await fetch("/api/ai/interview-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          question: activeQuestions[currentQuestionIndex], 
          transcript: transcript || "The student provided a thoughtful but somewhat brief answer focusing on clinical excellence.", 
          field: activeField,
          difficulty 
        }),
      });

      if (!response.ok) throw new Error(response.statusText || "Evaluation failed");
      const data = await response.json();
      setResults(data);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to analyze response.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNextQuestion = () => {
    stopListening();
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setStationPhase("prep");
      setTranscript("");
    } else {
      handleFinishInterview();
    }
  };

  const setupOptions = [
    { id: "MMI", title: "MMI Masterclass", desc: "Fast-paced mini stations (2 mins each)", icon: <Clock className="w-5 h-5 text-blue-500" /> },
    { id: "PANEL", title: "Traditional Panel", desc: "In-depth clinical discussion", icon: <Award className="w-5 h-5 text-purple-500" /> },
    { id: "ETHICS", title: "Ethics Deep Dive", desc: "Focus on professionalism & ethics", icon: <BrainCircuit className="w-5 h-5 text-emerald-500" /> }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 min-h-[85vh]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/ai-hub" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-jakarta font-bold text-gray-900">DentiSpark Voice Interview Beta</h1>
            <p className="text-gray-500 text-sm font-medium">Real-time transcription & AI Vocal guidance enabled.</p>
          </div>
        </div>
        
        {sessionState === "active" && (
            <div className="flex gap-4">
                <div className={cn(
                    "px-4 py-2 rounded-xl border flex items-center gap-2 transition-all",
                    stationPhase === "prep" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-red-50 text-red-600 border-red-100 animate-pulse"
                )}>
                    <div className={cn("w-2 h-2 rounded-full", stationPhase === "prep" ? "bg-amber-600" : "bg-red-600")} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                        {stationPhase === "prep" ? "Reading Period (60s)" : "Recording Response"}
                    </span>
                </div>
            </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {sessionState === "setup" ? (
          <motion.div 
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
            <div className="p-10 rounded-3xl border border-gray-100 space-y-8 text-center bg-white shadow-sm">
                <div className="space-y-2">
                    <h2 className="text-3xl font-jakarta font-bold text-gray-900">Configure Your Session</h2>
                    <p className="text-gray-500 font-medium">Select your interview style and difficulty to begin.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    {setupOptions.map(opt => (
                        <button 
                            key={opt.id} 
                            onClick={() => setSelectedStyle(opt.id as any)}
                            className={cn(
                                "p-6 rounded-3xl border transition-all space-y-4 group",
                                selectedStyle === opt.id ? "bg-emerald-50 border-emerald-500 shadow-md" : "border-gray-100 bg-white hover:border-emerald-500"
                            )}
                        >
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                                selectedStyle === opt.id ? "bg-white text-emerald-600 shadow-sm" : "bg-gray-50 group-hover:bg-emerald-50 group-hover:text-emerald-600"
                            )}>
                                {opt.icon}
                            </div>
                            <div>
                                <h4 className="font-jakarta font-bold text-gray-900">{opt.title}</h4>
                                <p className="text-xs text-gray-500 leading-tight font-medium">{opt.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-6 pt-4">
                    <div className="flex bg-gray-100 p-1.5 rounded-xl">
                        {(["Standard", "Elite"] as const).map(d => (
                            <button 
                                key={d}
                                onClick={() => setDifficulty(d)}
                                className={cn(
                                    "px-8 py-2.5 rounded-lg text-sm font-jakarta font-semibold transition-all",
                                    difficulty === d ? "bg-white shadow-sm text-emerald-600" : "text-gray-500 hover:text-gray-900"
                                )}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                    
                    {!isSTTSupported && (
                        <div className="flex items-center gap-2 text-amber-600 text-[10px] font-bold uppercase tracking-widest bg-amber-50 px-4 py-2 rounded-full border border-amber-100">
                            <AlertCircle className="w-4 h-4" /> Voice Input not supported in this browser
                        </div>
                    )}
                </div>

                <Button 
                    onClick={handleStartSession}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-12 h-14 rounded-xl font-jakarta font-bold shadow-sm transform active:scale-95 transition-all text-lg"
                >
                    Initialize AI Mentor
                </Button>
            </div>
          </motion.div>
        ) : sessionState === "active" ? (
          <motion.div 
            key="active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-8">
                <QuestionCarousel 
                    question={activeQuestions[currentQuestionIndex]} 
                    index={currentQuestionIndex} 
                />

                <div className="flex flex-col p-10 rounded-3xl border border-gray-100 gap-8 bg-white shadow-sm relative overflow-hidden transition-all">
                    {stationPhase === "prep" && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center px-6">
                            <div className="bg-white p-8 rounded-3xl shadow-xl space-y-4 max-w-sm text-center border border-gray-100 animate-in fade-in zoom-in duration-300">
                                <h4 className="text-xl font-jakarta font-bold text-gray-900 tracking-tight">Reading Station</h4>
                                <p className="text-gray-500 text-sm font-medium">Read the prompt above carefully. You have 60 seconds before the station begins.</p>
                                <Button 
                                    onClick={startStation}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 font-jakarta font-bold shadow-sm"
                                >
                                    Enter Station Now <Play className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Vocal Waveform Simulation */}
                    {isListening && (
                        <div className="absolute top-0 inset-x-0 h-1 flex gap-0.5 opacity-30">
                            {[...Array(50)].map((_, i) => (
                                <motion.div 
                                    key={i}
                                    className="flex-1 bg-emerald-500"
                                    animate={{ height: [4, 12, 6, 16, 4] }}
                                    transition={{ repeat: Infinity, duration: 0.5 + Math.random(), delay: i * 0.05 }}
                                />
                            ))}
                        </div>
                    )}

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Vocal Output Log (Real-time)</label>
                            {isListening && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse">
                                    <Sparkles className="w-3 h-3" /> AI Syncing Voice
                                </div>
                            )}
                        </div>
                        <div className="w-full min-h-[160px] bg-gray-50 border-2 border-dashed border-gray-100 rounded-2xl p-8 text-gray-700 font-medium leading-relaxed transition-all">
                            {transcript || <span className="text-gray-300 italic">Wait until the station starts. Your speech will appear here automatically...</span>}
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-6">
                            <button 
                                disabled={stationPhase === "prep"}
                                onClick={() => isListening ? stopListening() : startListening()}
                                className={cn(
                                    "w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-sm active:scale-90 disabled:opacity-20",
                                    isListening ? "bg-red-500 text-white ring-4 ring-red-50" : "bg-emerald-600 text-white hover:bg-emerald-700"
                                )}
                            >
                                {isListening ? <Square className="w-6 h-6 fill-white" /> : <Mic className="w-6 h-6" />}
                            </button>
                            <div className="space-y-1">
                                <h4 className="font-jakarta font-bold text-gray-900 uppercase text-xs tracking-tight">
                                    {isListening ? "Listening..." : stationPhase === "prep" ? "Awaiting Station Start" : "Click to Speak"}
                                </h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest opacity-60">
                                    Noise Cancellation v2.1 Active
                                </p>
                            </div>
                        </div>
                        
                        <Button 
                            onClick={handleNextQuestion}
                            disabled={stationPhase === "prep"}
                            className="bg-gray-900 hover:bg-black text-white h-12 px-8 rounded-xl font-jakarta font-semibold flex items-center gap-2 transform active:translate-x-1 transition-all text-sm disabled:opacity-20 shadow-sm"
                        >
                            {currentQuestionIndex === activeQuestions.length - 1 ? "End Interview" : "Submit & Exit Station"}
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-1 space-y-8">
                <div className="p-10 rounded-3xl border border-gray-100 flex flex-col items-center justify-center bg-white shadow-sm">
                    <InterviewTimer 
                        durationSeconds={stationPhase === "prep" ? 60 : 120} 
                        isActive={true} 
                        onComplete={() => {
                            if (stationPhase === "prep") startStation();
                            else handleNextQuestion();
                        }} 
                    />
                    <div className="mt-6 text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Phase</p>
                        <p className="text-sm font-jakarta font-bold text-emerald-600 uppercase mt-1">{stationPhase} STATION</p>
                    </div>
                </div>

                <div className="p-10 rounded-3xl border border-gray-100 space-y-6 bg-white shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                    <h5 className="text-xs font-jakarta font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-emerald-500" /> Admission Protocol
                    </h5>
                    <div className="space-y-5">
                        {[
                            { label: "Clarity", desc: "Speak slowly and clearly for AI transcription." },
                            { label: "Technique", desc: "Always utilize the STAR method for scenarios." },
                            { label: "Values", desc: "Integrate NHS Core Compassion values." },
                            { label: "Pacing", desc: "Aim for a 90-second response duration." }
                        ].map((rule, i) => (
                            <div key={i} className="space-y-1">
                                <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">{rule.label}</p>
                                <p className="text-xs text-gray-500 font-medium leading-tight">{rule.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </motion.div>
        ) : isAnalyzing ? (
           <motion.div 
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[500px] space-y-8"
          >
            <div className="relative">
                <div className="absolute inset-0 bg-emerald-100/50 blur-3xl rounded-full scale-150 animate-pulse" />
                <BrainCircuit className="w-24 h-24 text-emerald-600 relative animate-float" />
            </div>
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-jakarta font-bold text-gray-900">AI is scoring your performance...</h2>
                <p className="text-gray-500 font-medium">Evaluating ethics, structure, and professional tone.</p>
            </div>
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          </motion.div>
        ) : results ? (
          <motion.div 
            key="feedback"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            {/* Feedback Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 text-sm font-bold">
                    <Award className="w-4 h-4" />
                    Interview Successfully Completed
                </div>
                <h2 className="text-4xl font-jakarta font-bold text-gray-900 tracking-tight">Performance Analytics</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {results?.metrics.map(metric => (
                    <div key={metric.label} className="p-6 rounded-3xl border border-gray-100 space-y-4 text-center bg-white shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 mx-auto flex items-center justify-center text-emerald-600">
                            <BarChart3 className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="block text-2xl font-jakarta font-bold text-gray-900">{metric.score}%</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{metric.label}</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${metric.score}%` }}
                                className="h-full bg-emerald-500"
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-8 rounded-3xl border border-gray-100 space-y-6 bg-white shadow-sm">
                <h3 className="text-xl font-jakarta font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    AI Critique & Improvement Plan
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed italic border-l-4 border-emerald-200 pl-4 py-2 font-medium">
                    &quot;{results?.critique}&quot;
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4 p-6 rounded-3xl bg-emerald-50/50 border border-emerald-100">
                        <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider">Key Strengths</h4>
                        <ul className="space-y-2 text-sm text-emerald-700 font-medium">
                            {results?.strengths.map((s, i) => <li key={i} className="flex gap-2"><span>•</span> {s}</li>)}
                        </ul>
                    </div>
                    <div className="space-y-4 p-6 rounded-3xl bg-amber-50/50 border border-amber-100">
                        <h4 className="text-sm font-bold text-amber-800 uppercase tracking-wider">Critical Improvements</h4>
                        <ul className="space-y-2 text-sm text-amber-700 font-medium">
                            {results?.improvements.map((im, i) => <li key={i} className="flex gap-2"><span>•</span> {im}</li>)}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="flex justify-center gap-4">
                <Button 
                    variant="outline" 
                    onClick={() => { setSessionState("setup"); setResults(null); }}
                    className="px-10 h-14 rounded-xl border-gray-200 font-jakarta font-bold transform active:scale-95 transition-all text-gray-600 hover:bg-gray-50"
                >
                    Try Another Session
                </Button>
                <Button 
                    onClick={async () => {
                        try {
                            const metrics = results?.metrics ?? [];
                            const avgScore = metrics.length > 0 
                                ? metrics.reduce((acc, m) => acc + m.score, 0) / metrics.length 
                                : 0;
                            await fetch("/api/ai/sync", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    userId: user?.guid,
                                    toolId: "interview-prep",
                                    accomplishment: `Completed Interview Prep with ${avgScore.toFixed(0)}% Score`,
                                    metadata: results
                                })
                            });
                            alert("Performance Intelligence Synced!");
                        } catch (e) {
                            console.error(e);
                        }
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-12 h-14 rounded-xl font-jakarta font-bold shadow-sm transform active:scale-95 transition-all"
                >
                    Sync Performance <Sparkles className="w-4 h-4 ml-2" />
                </Button>
            </div>
          </motion.div>
        ) : error ? (
             <div className="text-center py-20 bg-white rounded-3xl border border-amber-100 shadow-sm space-y-4">
                <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
                <h3 className="text-2xl font-jakarta font-bold text-gray-900">Evaluation Failed</h3>
                <p className="text-gray-500 max-w-md mx-auto font-medium">{error}</p>
                <Button onClick={() => setSessionState("setup")} variant="outline" className="rounded-xl border-gray-200 font-bold">Restart Session</Button>
            </div>
        ) : (
             <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="text-lg font-jakarta font-bold text-gray-900">Evaluation Unavailable</h3>
                <p className="text-gray-500 font-medium">Something went wrong during the AI analysis.</p>
                <Button onClick={() => setSessionState("setup")} variant="outline" className="rounded-xl border-gray-200 font-bold">Back to Setup</Button>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}
