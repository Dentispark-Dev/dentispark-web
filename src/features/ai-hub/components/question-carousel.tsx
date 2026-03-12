"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";

interface QuestionCarouselProps {
  question: string;
  index: number;
}

export function QuestionCarousel({ question, index }: QuestionCarouselProps) {
  return (
    <div className="relative glass-card p-10 rounded-[2.5rem] border-primary-100/30 overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Quote className="w-32 h-32 text-primary-600" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6 relative z-10"
        >
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-primary-600 text-white rounded-lg text-xs font-bold uppercase tracking-widest">
                Question {index + 1}
            </span>
            <div className="h-0.5 flex-1 bg-primary-100" />
          </div>

          <h3 className="text-3xl font-black text-black-800 leading-tight">
            {question}
          </h3>

          <div className="pt-4 flex items-center gap-4 text-sm text-black-400 font-medium">
            <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Clinical Ethics
            </span>
            <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                MMI Style
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
