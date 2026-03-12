"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Mic, 
  Player, 
  Play, 
  Square, 
  RefreshCcw, 
  CheckCircle2, 
  BrainCircuit, 
  Clock, 
  AlertCircle,
  BarChart3,
  Award,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { InterviewTimer } from "@/src/features/ai-hub/components/interview-timer";
import { QuestionCarousel } from "@/src/features/ai-hub/components/question-carousel";

export default function InterviewPrepPage() {
  const [sessionState, setSessionState] = useState<"setup" | "active" | "feedback">("setup");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [difficulty, setDifficulty] = useState<"Standard" | "Elite">("Standard");

  const questions = [
    "Why DentiSpark Dental School specifically? What draws you to our clinical curriculum?",
    "Tell me about a time you showed leadership during a clinical or volunteer placement.",
    "A patient is refusing treatment that is clearly in their best interest. How do you handle this?",
    "What do you believe is the single most important quality a dentist must possess today?"
  ];

  const handleStartSession = () => {
    setSessionState("active");
    setCurrentQuestionIndex(0);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setIsRecording(false);
    } else {
      setSessionState("feedback");
    }
  };

  const setupOptions = [
    { id: "mmi", title: "MMI Masterclass", desc: "Fast-paced mini stations (7 mins each)", icon: <Clock className="w-5 h-5 text-blue-500" /> },
    { id: "panel", title: "Traditional Panel", desc: "In-depth 20-minute discussion", icon: <Award className="w-5 h-5 text-purple-500" /> },
    { id: "ethics", title: "Ethics Deep Dive", desc: "Focus on GDC standards & NHS values", icon: <BrainCircuit className="w-5 h-5 text-primary-500" /> }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 min-h-[85vh]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/ai-hub" className="p-2 hover:bg-greys-100 rounded-lg transition-colors text-black-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-black-800">AI Interview Prep Bot</h1>
            <p className="text-black-500 text-sm">Adaptive mock interviews with real-time feedback.</p>
          </div>
        </div>
        
        {sessionState === "active" && (
            <div className="flex gap-4">
                <div className="px-4 py-2 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-2 animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-red-600" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Recording Response</span>
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
            <div className="glass-card p-10 rounded-[2.5rem] border-primary-100/30 space-y-8 text-center bg-white/50">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-black-800">Configure Your Session</h2>
                    <p className="text-black-500 font-medium">Select your interview style and difficulty to begin.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {setupOptions.map(opt => (
                        <button key={opt.id} className="p-6 rounded-3xl border border-greys-100 bg-white hover:border-primary-500 hover:shadow-xl hover:shadow-primary-100 transition-all text-left space-y-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-greys-50 flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                {opt.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-black-800">{opt.title}</h4>
                                <p className="text-xs text-black-400 leading-tight">{opt.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="flex items-center justify-center gap-4 pt-4">
                    <div className="flex bg-greys-100 p-1 rounded-2xl">
                        {(["Standard", "Elite"] as const).map(d => (
                            <button 
                                key={d}
                                onClick={() => setDifficulty(d)}
                                className={cn(
                                    "px-8 py-2.5 rounded-xl text-sm font-bold transition-all",
                                    difficulty === d ? "bg-white shadow-lg text-primary-600" : "text-black-400 hover:text-black-600"
                                )}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>

                <Button 
                    onClick={handleStartSession}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-12 h-14 rounded-2xl font-bold shadow-xl shadow-primary-200 transform active:scale-95 transition-all text-lg"
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
                    question={questions[currentQuestionIndex]} 
                    index={currentQuestionIndex} 
                />

                <div className="flex items-center justify-between p-8 glass-card rounded-[2rem] border-primary-100/30">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => setIsRecording(!isRecording)}
                            className={cn(
                                "w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-90",
                                isRecording ? "bg-red-500 text-white" : "bg-primary-600 text-white hover:bg-primary-700"
                            )}
                        >
                            {isRecording ? <Square className="w-8 h-8 fill-white" /> : <Mic className="w-8 h-8" />}
                        </button>
                        <div className="space-y-1">
                            <h4 className="font-bold text-black-800">
                                {isRecording ? "Listening to response..." : "Click to start recording"}
                            </h4>
                            <p className="text-xs text-black-400 font-medium">Standard Response Time: 120s</p>
                        </div>
                    </div>
                    
                    <Button 
                        onClick={handleNextQuestion}
                        className="bg-black-900 text-white h-14 px-8 rounded-2xl font-bold flex items-center gap-2 hover:bg-black-800 shadow-xl transition-all"
                    >
                        {currentQuestionIndex === questions.length - 1 ? "Finish Interview" : "Next Station"}
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            <div className="lg:col-span-1 space-y-8">
                <div className="glass-card p-8 rounded-[2rem] border-primary-100/30 flex flex-col items-center justify-center bg-white/50">
                    <InterviewTimer 
                        durationSeconds={120} 
                        isActive={isRecording} 
                        onComplete={() => setIsRecording(false)} 
                    />
                </div>

                <div className="glass-card p-6 rounded-[2rem] border-primary-100/30 space-y-4">
                    <h5 className="text-xs font-black text-black-400 uppercase tracking-widest">Station Protocol</h5>
                    <div className="space-y-3">
                        {[
                            "Be concise and structured",
                            "Use the STAR technique",
                            "Maintain professional tone",
                            "Cite NHS Core Values"
                        ].map((rule, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-black-700 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                                {rule}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="feedback"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            {/* Feedback Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-6 py-2 bg-primary-100 text-primary-700 rounded-full border border-primary-200 text-sm font-bold">
                    <award className="w-4 h-4" />
                    Interview Successfully Completed
                </div>
                <h2 className="text-4xl font-black text-black-900 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-black-900 to-primary-600">Performance Analytics</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Confidence", score: 85, icon: <Mic className="text-blue-500" /> },
                    { label: "Structure", score: 72, icon: <BarChart3 className="text-purple-500" /> },
                    { label: "NHS Values", score: 94, icon: <BrainCircuit className="text-primary-500" /> },
                    { label: "Clarity", score: 88, icon: <CheckCircle2 className="text-green-500" /> }
                ].map(metric => (
                    <div key={metric.label} className="glass-card p-6 rounded-3xl border-greys-100 space-y-4 text-center">
                        <div className="w-10 h-10 rounded-xl bg-greys-50 mx-auto flex items-center justify-center">
                            {metric.icon}
                        </div>
                        <div>
                            <span className="block text-2xl font-black text-black-800">{metric.score}%</span>
                            <span className="text-[10px] font-bold text-black-400 uppercase tracking-widest">{metric.label}</span>
                        </div>
                        <div className="h-1 w-full bg-greys-100 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${metric.score}%` }}
                                className="h-full bg-primary-500"
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="glass-card p-8 rounded-[2.5rem] border-primary-100/30 space-y-6">
                <h3 className="text-xl font-bold text-black-800 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary-600" />
                    AI Critique & Improvement Plan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4 p-6 rounded-3xl bg-green-50/50 border border-green-100">
                        <h4 className="text-sm font-bold text-green-800 uppercase tracking-wider">Key Strengths</h4>
                        <ul className="space-y-2 text-sm text-green-700">
                            <li>• Strong integration of ethical pillars in the refusal station.</li>
                            <li>• Consistent academic tone with clinical relevance.</li>
                            <li>• Clear verbal signposting between different points.</li>
                        </ul>
                    </div>
                    <div className="space-y-4 p-6 rounded-3xl bg-amber-50/50 border border-amber-100">
                        <h4 className="text-sm font-bold text-amber-800 uppercase tracking-wider">Critical Improvements</h4>
                        <ul className="space-y-2 text-sm text-amber-700">
                            <li>• Leadership example lacked specific "outcome" metrics.</li>
                            <li>• Slight hesitancy when discussing NHS funding structures.</li>
                            <li>• Eye-contact (simulated) could be improved in panel mode.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="flex justify-center gap-4">
                <Button 
                    variant="outline" 
                    onClick={() => setSessionState("setup")}
                    className="px-10 h-14 rounded-2xl border-greys-300 font-bold transform active:scale-95 transition-all"
                >
                    Try Another Session
                </Button>
                <Button className="bg-primary-600 hover:bg-primary-700 text-white px-12 h-14 rounded-2xl font-bold shadow-xl shadow-primary-200 transform active:scale-95 transition-all">
                    Upgrade to Elite Coaching <Sparkles className="w-4 h-4 ml-2" />
                </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
