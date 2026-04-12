"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, ArrowRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-2xl z-[100]"
        >
          <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl shadow-black/40 overflow-hidden relative group">
            {/* Subtle Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
              <div className="size-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                <Cookie className="size-6" />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-white font-jakarta font-extrabold text-sm uppercase tracking-widest mb-1 flex items-center justify-center md:justify-start gap-2">
                  Cookie Privacy 
                  <span className="size-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                </h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  We use cookies to personalize your mentorship experience and optimize our AI intelligence reports. 
                  By clicking &quot;Accept&quot;, you agree to our <span className="text-emerald-500 underline cursor-pointer">Privacy Policy</span>.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button 
                  onClick={handleDecline}
                  className="px-6 py-3 rounded-xl text-slate-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Decline
                </button>
                <Button 
                  onClick={handleAccept}
                  className="h-12 px-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 flex items-center gap-2 group/btn"
                >
                  Accept All
                  <ArrowRight className="size-3 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
              
              <button 
                onClick={() => setIsVisible(false)}
                className="absolute top-0 right-0 p-2 text-slate-500 hover:text-white md:hidden"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
