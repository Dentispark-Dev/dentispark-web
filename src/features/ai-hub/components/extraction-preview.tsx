"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface ExtractionItem {
  key: string;
  value: string;
  confidence: number;
}

interface ExtractionPreviewProps {
  items: ExtractionItem[];
  title: string;
}

export function ExtractionPreview({ items, title }: ExtractionPreviewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">{title}</h5>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">AI Verified</span>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {items.map((item, i) => (
          <motion.div 
            key={item.key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between p-4 bg-white border border-gray-50 rounded-2xl group hover:border-emerald-200 hover:shadow-sm transition-all"
          >
            <div className="space-y-0.5">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.key}</span>
                <p className="text-sm font-jakarta font-bold text-gray-900">{item.value}</p>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="text-right flex flex-col items-end">
                    <span className="text-[10px] font-bold text-gray-500">{item.confidence}%</span>
                    <div className="h-1.5 w-12 bg-gray-100 rounded-full mt-1 overflow-hidden">
                        <div 
                            className="h-full bg-emerald-500" 
                            style={{ width: `${item.confidence}%` }} 
                        />
                    </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
