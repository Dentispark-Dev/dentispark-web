"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Sparkles, 
  Search, 
  Layers, 
  Save, 
  CheckCircle2,
  Trash2,
  BrainCircuit,
  FileCode,
  Zap,
  RefreshCcw
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { DocumentScanner } from "@/src/features/ai-hub/components/document-scanner";
import { ExtractionPreview } from "@/src/features/ai-hub/components/extraction-preview";

export default function TranscriptParserPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        setIsParsing(true);
        setTimeout(() => {
          setIsParsing(false);
          setShowResults(true);
        }, 4000);
      }, 1500);
    }
  };

  const academicData = [
    { key: "Overall GPA", value: "3.92 / 4.0", confidence: 99 },
    { key: "Biology Grade", value: "A* (98%)", confidence: 98 },
    { key: "Chemistry Grade", value: "A (94%)", confidence: 97 },
    { key: "UCAT Score", value: "3120 (SJT Band 1)", confidence: 100 }
  ];

  const clinicalData = [
    { key: "Placements", value: "St. Mary's General, Oral Surgery", confidence: 94 },
    { key: "Shadowing Hours", value: "120 Hours Verified", confidence: 92 },
    { key: "Patient Contact", value: "High (Assistive Role)", confidence: 88 }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 min-h-[85vh]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/ai-hub" className="p-2 hover:bg-greys-100 rounded-lg transition-colors text-black-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-black-800">Academic Transcript Parser</h1>
            <p className="text-black-500 text-sm">Automated data extraction for your application profile.</p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showResults && !isParsing ? (
          <motion.div 
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-full max-w-2xl glass-card p-12 rounded-[3rem] border-primary-100 border-dashed border-2 flex flex-col items-center text-center space-y-6 relative group hover:border-primary-500 transition-all">
                <div className="w-24 h-24 rounded-3xl bg-primary-50 flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
                    {isUploading ? <RefreshCcw className="w-10 h-10 animate-spin" /> : <Upload className="w-10 h-10" />}
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-black-800">Drop your transcript here</h2>
                    <p className="text-black-500 font-medium">We support PDF, DOCX, and high-res images. Our AI handles the rest.</p>
                </div>
                
                <label className="relative cursor-pointer">
                    <input 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    />
                    <div className="bg-black-900 text-white px-10 h-14 rounded-2xl font-bold flex items-center gap-2 shadow-xl hover:bg-black-800 transition-all">
                        Browse Files
                    </div>
                </label>

                <div className="flex gap-4 pt-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                    <FileCode className="w-8 h-8" />
                    <FileText className="w-8 h-8" />
                    <Layers className="w-8 h-8" />
                </div>

                {/* Animated BG blobs */}
                <div className="absolute inset-0 -z-10 overflow-hidden rounded-[3rem]">
                    <div className="absolute top-0 -right-20 w-40 h-40 bg-primary-100/30 blur-3xl" />
                    <div className="absolute bottom-0 -left-20 w-40 h-40 bg-blue-100/30 blur-3xl" />
                </div>
            </div>
          </motion.div>
        ) : isParsing ? (
          <motion.div 
            key="parsing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[500px]"
          >
            <div className="flex justify-center">
                <DocumentScanner />
            </div>
            <div className="space-y-8">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-xs font-bold uppercase tracking-widest animate-pulse">
                        <BrainCircuit className="w-4 h-4" />
                        Analyzing Structure
                    </div>
                    <h2 className="text-4xl font-black text-black-900 tracking-tight">Extracting Academic Insights</h2>
                    <p className="text-black-500 leading-relaxed max-w-md">Our neural network is identifying tables, dates, and clinical keywords from your document to ensure maximum accuracy.</p>
                </div>

                <div className="space-y-4">
                    {[
                        { label: "OCR Layer Activation", done: true },
                        { label: "Grid Alignment & Table Mapping", done: true },
                        { label: "Entity Recognition (Grades/Subjects)", done: false },
                        { label: "Final Validation", done: false }
                    ].map((step, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center transition-colors",
                                step.done ? "bg-green-500 text-white" : "bg-greys-100 text-black-300"
                            )}>
                                {step.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                            </div>
                            <span className={cn(
                                "text-sm font-bold",
                                step.done ? "text-black-800" : "text-black-400"
                            )}>{step.label}</span>
                        </div>
                    ))}
                </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Sidebar Stats */}
            <div className="lg:col-span-1 space-y-6">
                <div className="glass-card p-8 rounded-[2.5rem] border-primary-100 bg-black-900 text-white relative overflow-hidden">
                    <Zap className="absolute top-0 right-0 p-8 w-40 h-40 text-primary-500 opacity-20 -rotate-12" />
                    <div className="relative z-10 space-y-6">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary-400">Total Credits Extracted</span>
                            <p className="text-5xl font-black">420<span className="text-xl text-primary-300 ml-1">pts</span></p>
                        </div>
                        <div className="pt-4 border-t border-white/10 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white/60">Quality Score</span>
                                <span className="font-bold text-green-400">Excellent (98%)</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white/60">Profile Impact</span>
                                <span className="font-bold text-primary-400">+12% SEO Boost</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 rounded-[2rem] border-greys-100 space-y-4">
                    <h5 className="text-xs font-black text-black-400 uppercase tracking-widest">Integrity Check</h5>
                    <p className="text-xs text-black-500 leading-relaxed font-medium">All data has been cross-referenced with standard UK marking schemes for Dentistry applications.</p>
                </div>
            </div>

            {/* Main Results */}
            <div className="lg:col-span-2 space-y-8">
                <div className="glass-card p-10 rounded-[2.5rem] border-primary-100/30 space-y-10">
                    <ExtractionPreview title="Extracted Academics" items={academicData} />
                    <div className="h-px bg-greys-100" />
                    <ExtractionPreview title="Clinical & Voluntary Work" items={clinicalData} />

                    <div className="pt-6 flex flex-col md:flex-row gap-4">
                        <Button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white h-14 rounded-2xl font-bold shadow-xl shadow-primary-200 gap-2 transition-all active:scale-95">
                            <Save className="w-5 h-5" />
                            Sync to My Profile
                        </Button>
                        <Button 
                            variant="ghost" 
                            onClick={() => {setShowResults(false); setUploadedFile(null);}}
                            className="bg-greys-50 hover:bg-greys-100 text-black-600 h-14 px-8 rounded-2xl font-bold flex items-center gap-2"
                        >
                            <Trash2 className="w-5 h-5" />
                            Discard
                        </Button>
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
