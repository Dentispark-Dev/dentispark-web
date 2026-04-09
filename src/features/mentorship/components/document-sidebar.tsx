"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Upload, Plus, CheckCircle2, 
  Trash2, Download, MessageSquarePlus, ChevronRight 
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

interface Annotation {
  id: string;
  time: string;
  text: string;
  author: "mentor" | "student";
}

export function DocumentSidebar() {
  const [activeTab, setActiveTab] = useState<"files" | "annotations">("files");
  const [annotations, setAnnotations] = useState<Annotation[]>([
    { id: "1", time: "10:05 AM", text: "Strengthen the opening statement on manual dexterity.", author: "mentor" },
    { id: "2", time: "10:15 AM", text: "NHS Core Values section needs real-world examples.", author: "mentor" },
  ]);
  const [newAnnotation, setNewAnnotation] = useState("");

  const addAnnotation = () => {
    if (!newAnnotation.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAnnotations([...annotations, { id: Date.now().toString(), time: timeStr, text: newAnnotation, author: "mentor" }]);
    setNewAnnotation("");
  };

  return (
    <div className="w-80 h-full bg-white border-l border-slate-100 flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Tabs */}
      <div className="flex border-b border-slate-100 p-1 bg-slate-50/50 m-4 rounded-xl">
        <button
          onClick={() => setActiveTab("files")}
          className={cn(
            "flex-1 py-2 text-xs font-extrabold uppercase tracking-widest rounded-lg transition-all",
            activeTab === "files" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
          )}
        >
          Files
        </button>
        <button
          onClick={() => setActiveTab("annotations")}
          className={cn(
            "flex-1 py-2 text-xs font-extrabold uppercase tracking-widest rounded-lg transition-all",
            activeTab === "annotations" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
          )}
        >
          Annotations
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === "files" ? (
            <motion.div
              key="files"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-slate-200 rounded-3xl p-6 text-center group hover:border-emerald-400 hover:bg-emerald-50 transition-all cursor-pointer">
                <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-700">Upload PS</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-extrabold tracking-widest">PDF or DOCX</p>
              </div>

              {/* File List */}
              <div className="space-y-3">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">Active Documents</p>
                <div className="p-4 bg-white border-2 border-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/5 relative overflow-hidden group">
                  <div className="flex items-start gap-3 relative z-10">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">Daniel_Sarabia_PS_v2.docx</p>
                      <p className="text-[10px] text-slate-500 font-medium">Uploaded 12m ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                    <button className="flex-1 flex items-center justify-center py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-[10px] font-extrabold uppercase tracking-widest transition-colors">
                      <Download className="w-3.5 h-3.5 mr-1.5" /> Download
                    </button>
                    <button className="p-2 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="annotations"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">Live Session Notes</p>
              <div className="space-y-4">
                {annotations.map((item) => (
                  <div key={item.id} className="relative pl-4 border-l-2 border-emerald-500 py-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest">{item.author}</span>
                      <span className="text-[10px] font-medium text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-700 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>

              {/* Add Annotation Input */}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                 <textarea
                   value={newAnnotation}
                   onChange={(e) => setNewAnnotation(e.target.value)}
                   placeholder="Type an action item..."
                   className="w-full h-24 p-3 bg-slate-50 border-none rounded-2xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
                 />
                 <Button 
                   onClick={addAnnotation}
                   className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                 >
                   <MessageSquarePlus className="w-4 h-4" />
                   Add Annotation
                 </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Branding */}
      <div className="p-6 bg-slate-50/50 flex items-center justify-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.3em]">Precision Review</span>
      </div>
    </div>
  );
}
