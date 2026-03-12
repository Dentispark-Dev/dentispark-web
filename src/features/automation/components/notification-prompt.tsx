"use client";

import React, { useState, useEffect } from "react";
import { Bell, X, ShieldCheck, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function NotificationPrompt() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if notifications are supported and if user hasn't made a choice yet
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 8000); // Wait 8 seconds before showing soft prompt
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleEnable = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted.");
        // In a real app, you'd subscribe to push here
      }
      setIsVisible(false);
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      setIsVisible(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className="fixed bottom-24 right-8 z-[100] w-full max-w-sm"
        >
          <div className="glass-card bg-white p-6 rounded-[2.5rem] border-primary-100 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-primary-500/20">
                <Bell className="w-6 h-6 animate-bounce" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-black text-black-900 tracking-tight">Stay Competitive.</h3>
                  <button onClick={() => setIsVisible(false)} className="p-1 hover:bg-greys-100 rounded-full transition-colors">
                    <X className="w-4 h-4 text-black-400" />
                  </button>
                </div>
                
                <p className="text-xs font-medium text-black-500 leading-relaxed">
                  Enable push alerts for real-time mentor feedback and critical UCAS application deadlines.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button 
                    onClick={handleEnable}
                    className="flex-1 h-12 bg-primary-600 text-white rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
                  >
                    Enable Alerts
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => setIsVisible(false)}
                    className="px-4 h-12 border border-greys-100 rounded-xl font-black uppercase tracking-widest text-[9px] text-black-400 hover:bg-greys-50 transition-all"
                  >
                    Later
                  </button>
                </div>
              </div>
            </div>

            {/* Verification Badge */}
            <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldCheck className="w-12 h-12 text-black" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
