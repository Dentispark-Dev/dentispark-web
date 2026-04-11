"use client";

import { motion } from "framer-motion";
import { BookOpen, Sparkles, ArrowRight, Rss } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

export default function BlogComingSoon() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-3xl w-full text-center space-y-12">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-600 font-bold text-xs uppercase tracking-widest shadow-sm border border-emerald-100"
        >
          <Sparkles className="size-4" /> Coming Soon: The DentiSpark Blog
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-jakarta font-extrabold text-slate-900 leading-[1.1] tracking-tight">
             Inside the <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-blue-500">Spark.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto">
            Expert insights, student interviews, and the latest trends in dental school applications. We're crafting the ultimate resource library.
          </p>
        </div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden"
        >
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 size-32 bg-emerald-500/5 blur-[60px] rounded-full" />
          
          <div className="relative z-10 space-y-8">
            <div className="flex flex-col items-center gap-4">
               <div className="size-16 rounded-3xl bg-slate-900 flex items-center justify-center text-white shadow-2xl shadow-slate-900/20">
                  <Rss className="size-8" />
               </div>
               <h2 className="text-2xl font-bold text-slate-900">Be the first to know</h2>
               <p className="text-slate-500 font-medium">Get a notification when our first guide drops.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
               <Input 
                 placeholder="your@email.com" 
                 className="h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-emerald-500 transition-all font-medium"
               />
               <Button className="h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-8 font-bold text-lg shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all">
                 Join waitlist
               </Button>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8 border-t border-slate-100">
           <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="size-12 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                   DS
                </div>
              ))}
              <div className="size-12 rounded-full border-4 border-white bg-emerald-500 flex items-center justify-center text-xs font-bold text-white">
                +840
              </div>
           </div>
           <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
             <span className="text-slate-900">840+ students</span> already on the spark list.
           </p>
        </div>
      </div>
    </div>
  );
}
