"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X, ArrowRight, Lock } from "lucide-react";

export function GDPRBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("dentispark-consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("dentispark-consent", "true");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[500px]"
        >
          <div className="glass-card bg-black-900/90 text-white p-8 rounded-[2.5rem] border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
            <div className="flex items-start gap-6 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/20">
                <Lock className="w-7 h-7" />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-black tracking-tight leading-tight">Privacy First.</h3>
                  <button onClick={() => setIsVisible(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                    <X className="w-5 h-5 text-white/50" />
                  </button>
                </div>
                
                <p className="text-sm font-medium text-white/70 leading-relaxed">
                  We use cookies and advanced encryption to secure your dental application data. By continuing, you agree to our <a href="/privacy" className="text-primary-400 hover:underline">Privacy Policy</a>.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <button 
                    onClick={handleAccept}
                    className="flex-1 h-14 bg-white text-black-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-50 transition-all flex items-center justify-center gap-2"
                  >
                    Accept All
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setIsVisible(false)}
                    className="px-6 h-14 border border-white/20 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all"
                  >
                    Settings
                  </button>
                </div>
              </div>
            </div>

            {/* Background Aesthetic */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/10 blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-600/10 blur-3xl -z-10" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
