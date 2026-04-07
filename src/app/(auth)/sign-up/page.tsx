"use client";

import { SignupFlow } from "@/src/features/(auth)/components/signup-flow";
import { SignUpInterstitial } from "@/src/features/(auth)/components/signup-interstitial";
import React, { useState } from "react";
import Logo from "@/src/components/icons/Logo";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function SignUpPage() {
  const [showFlow, setShowFlow] = useState(false);

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 md:p-8 lg:p-12 relative">
      {/* Background Decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-teal-500/5 blur-[100px] rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        {!showFlow ? (
          <motion.div 
            key="interstitial"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex justify-center"
          >
            <SignUpInterstitial onContinue={() => setShowFlow(true)} />
          </motion.div>
        ) : (
          <motion.div 
            key="flow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex justify-center"
          >
            <SignupFlow />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="mt-12 flex items-center gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
        <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
        <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
        <span>© 2024 DentiSpark</span>
      </div>
    </main>
  );
}
