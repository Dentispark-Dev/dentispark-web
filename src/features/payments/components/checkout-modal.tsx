"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, ShieldCheck, X, Zap, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  price: number;
}

export function CheckoutModal({ isOpen, onClose, planName, price }: CheckoutModalProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleCheckout = () => {
    setStatus("loading");
    setTimeout(() => setStatus("success"), 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black-900/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative glass-card w-full max-w-[500px] bg-white rounded-[3.5rem] p-10 border-primary-100 shadow-2xl overflow-hidden"
          >
            {status !== "success" ? (
              <div className="space-y-8">
                <div className="flex justify-between items-start">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-primary-50 flex items-center justify-center text-primary-600">
                    <CreditCard className="w-8 h-8" />
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-greys-100 rounded-full transition-colors">
                    <X className="w-6 h-6 text-black-400" />
                  </button>
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-black-900 tracking-tight">Complete Upgrade</h2>
                  <p className="text-black-500 font-medium">Safe & secure checkout via Stripe layer.</p>
                </div>

                <div className="bg-greys-50 p-6 rounded-[2rem] border border-greys-100 space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold text-black-400 uppercase tracking-widest">
                        <span>Plan</span>
                        <span>Amount</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-black text-black-900">
                        <span>{planName}</span>
                        <span>£{price}</span>
                    </div>
                </div>

                <div className="space-y-6">
                  {/* Stripe Mock Elements */}
                  <div className="space-y-4">
                    <div className="h-14 bg-white border border-greys-200 rounded-2xl flex items-center px-4 gap-4">
                        <CreditCard className="w-5 h-5 text-black-300" />
                        <span className="text-black-300 text-sm">•••• •••• •••• 4242</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-14 bg-white border border-greys-200 rounded-2xl flex items-center px-4 text-black-300 text-sm">MM/YY</div>
                        <div className="h-14 bg-white border border-greys-200 rounded-2xl flex items-center px-4 text-black-300 text-sm">CVC</div>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={status === "loading"}
                    className="w-full h-16 bg-primary-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-primary-700 shadow-xl shadow-primary-200 transition-all flex items-center justify-center gap-2"
                  >
                    {status === "loading" ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <>
                            Pay £{price} Now
                            <Zap className="w-4 h-4" />
                        </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-3 text-[10px] font-black text-black-400 uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4 text-primary-500" />
                    Stripe Secure • 256-bit Encryption
                  </div>
                </div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-10 flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="w-24 h-24 rounded-[2rem] bg-green-50 text-green-600 flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-black-900 tracking-tight">Upgrade Successful!</h2>
                    <p className="text-black-500 font-medium">Your premium features have been unlocked.</p>
                </div>
                <button 
                    onClick={onClose}
                    className="w-full h-16 bg-black-900 text-white rounded-[1.5rem] font-black uppercase tracking-widest"
                >
                    Go back to Dashboard
                </button>
              </motion.div>
            )}

            {/* Background Aesthetic */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary-50/50 blur-[120px] rounded-full -z-10" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
