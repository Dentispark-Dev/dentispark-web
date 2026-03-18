"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileSearch } from "lucide-react";

export function DocumentScanner() {
  return (
    <div className="relative w-full max-w-md aspect-[3/4] bg-white rounded-3xl border border-gray-100 overflow-hidden flex items-center justify-center shadow-2xl group">
      {/* Security Status Bar */}
      <div className="absolute top-4 left-4 right-4 z-30 flex justify-between items-center bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gray-100">
        <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-bold text-gray-700 uppercase tracking-widest">S3 Secure Vault Active</span>
        </div>
        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-3 h-3 border border-gray-200 rounded-full flex items-center justify-center text-[8px]">!</span>
            256-Bit SSL
        </div>
      </div>

      {/* Scanner Beam */}
      <motion.div 
        initial={{ top: "-10%" }}
        animate={{ top: "110%" }}
        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_20px_rgba(16,185,129,0.3)] z-20"
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
      />

      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 animate-pulse">
            <FileSearch className="w-10 h-10" />
        </div>
        <div className="text-center space-y-1">
            <h4 className="font-sora font-bold text-gray-900">Reading Document...</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">AI Vision Processing</p>
        </div>
      </div>

      {/* Corner Brackets */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-emerald-200 rounded-tl-lg" />
      <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-emerald-200 rounded-tr-lg" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-emerald-200 rounded-bl-lg" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-emerald-200 rounded-br-lg" />
    </div>
  );
}
