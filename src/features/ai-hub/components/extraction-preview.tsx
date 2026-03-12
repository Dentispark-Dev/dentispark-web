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
        <h5 className="text-xs font-black text-black-400 uppercase tracking-widest">{title}</h5>
        <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">AI Verified</span>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {items.map((item, i) => (
          <motion.div 
            key={item.key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between p-4 bg-white border border-greys-100 rounded-2xl group hover:border-primary-200 transition-colors"
          >
            <div className="space-y-0.5">
                <span className="text-[10px] text-black-400 font-bold uppercase tracking-tighter">{item.key}</span>
                <p className="text-sm font-bold text-black-800">{item.value}</p>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="text-right flex flex-col items-end">
                    <span className="text-[10px] font-bold text-black-500">{item.confidence}%</span>
                    <div className="h-1 w-12 bg-greys-100 rounded-full mt-1 overflow-hidden">
                        <div 
                            className="h-full bg-green-500" 
                            style={{ width: `${item.confidence}%` }} 
                        />
                    </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
