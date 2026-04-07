"use client";

import React, { useState } from "react";
import { 
  FileText, 
  Activity, 
  CheckCircle2, 
  PenLine, 
  Stethoscope, 
  BrainCircuit,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export function ShadowingLog() {
  const [activeTab, setActiveTab] = useState<"log" | "generate">("log");
  const [selectedProcedures, setSelectedProcedures] = useState<string[]>([]);
  const [reflection, setReflection] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<string | null>(null);

  const procedures = [
    { id: "root-canal", label: "Root Canal Treatment", icon: Activity },
    { id: "patient-comms", label: "Patient Communication", icon: MessageSquare },
    { id: "fillings", label: "Composite Fillings", icon: PenLine },
    { id: "diagnostics", label: "Radiograph Analysis", icon: Stethoscope },
  ];

  const handleToggleProcedure = (id: string) => {
    setSelectedProcedures(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    if (selectedProcedures.length === 0 || reflection.length < 10) {
      toast.error("Please select at least one procedure and add a brief reflection.");
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate AI generation delay
    setTimeout(() => {
      setGeneratedDraft(
        `During my clinical placement, observing ${selectedProcedures.length} complex procedures reinforced my understanding of the stamina and precision required in modern dentistry. Particularly during the procedures involving ${selectedProcedures[0].replace('-', ' ')}, I noted how the clinician seamlessly blended technical manual dexterity with empathetic patient communication. My reflection on this experience (${reflection.substring(0, 30)}...) has cemented my resolve to pursue dentistry, highlighting that clinical excellence is intrinsically linked to ethical patient care.`
      );
      setIsGenerating(false);
      setActiveTab("generate");
      toast.success("UCAS draft generated successfully!");
    }, 1500);
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 lg:p-10 shadow-xl shadow-slate-200/50">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-8 border-b border-slate-100 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
            <FileText className="w-3.5 h-3.5" />
            Clinical Placement
          </div>
          <h3 className="text-2xl font-jakarta font-black text-slate-900">Digital Shadowing Log</h3>
        </div>
        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
          <button 
            onClick={() => setActiveTab("log")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === "log" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Log Entry
          </button>
          <button 
            onClick={() => setActiveTab("generate")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === "generate" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Draft Generator
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "log" ? (
          <motion.div 
            key="log"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Procedures Observed Today</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {procedures.map(proc => {
                  const isSelected = selectedProcedures.includes(proc.id);
                  return (
                    <button
                      key={proc.id}
                      onClick={() => handleToggleProcedure(proc.id)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                        isSelected 
                          ? "bg-blue-50 border-blue-200" 
                          : "bg-white border-slate-200 hover:border-blue-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                        <proc.icon className="w-4 h-4" />
                      </div>
                      <span className={`font-bold text-sm ${isSelected ? "text-blue-900" : "text-slate-600"}`}>
                        {proc.label}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 ml-auto" />}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Personal Reflection</label>
              <textarea 
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="What did you learn today? Focus on empathy, manual dexterity, or teamwork..."
                className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
              />
            </div>

            <Button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <BrainCircuit className="w-5 h-5" />
                  </motion.div>
                  Synthesizing Draft...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate UCAS Paragraph
                </>
              )}
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            key="generate"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {generatedDraft ? (
              <div className="space-y-6">
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 relative">
                  <div className="absolute top-6 right-6">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h4 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    Draft Ready for Personal Statement
                  </h4>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {generatedDraft}
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold text-slate-500 hover:text-slate-800">
                    Edit Reflection
                  </Button>
                  <Button className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold">
                    Save to Vault
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 mb-2">
                  <FileText className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">No draft generated yet.</p>
                <p className="text-sm text-slate-400">Log an entry and provide a reflection to generate your UCAS paragraph.</p>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("log")}
                  className="mt-4 rounded-xl font-bold text-slate-600"
                >
                  Return to Log
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
