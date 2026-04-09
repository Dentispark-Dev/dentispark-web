"use client";

import React, { useState } from "react";
import { Copy, Gift, Users, Star, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ReferralSystem() {
  const [copied, setCopied] = useState(false);
  const referralCode = "DENTI-SHARK-777";
  const referralLink = `https://dentispark.com/signup?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const milestones = [
    { referrals: 1, reward: "AI PS Review Booster", unlocked: true },
    { referrals: 3, reward: "Premium Template Pack", unlocked: false },
    { referrals: 5, reward: "15-min Mentor Consult", unlocked: false },
  ];

  return (
    <div className="space-y-8">
      <div className="glass-card p-10 rounded-[3rem] bg-gradient-to-br from-primary-600 to-blue-700 text-white relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Refer & Unlock Premium</h2>
          </div>
          
          <p className="text-white/80 font-medium max-w-lg leading-relaxed">
            Invite your dental school peers to DentiSpark. When they join, you both unlock exclusive AI tool boosters and premium mentorship rewards.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="flex-1 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 flex items-center justify-between group">
              <span className="font-extrabold tracking-widest text-sm text-white/90 truncate">{referralLink}</span>
              <button 
                onClick={handleCopy}
                className="p-2 hover:bg-white/20 rounded-xl transition-all"
              >
                {copied ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-white/60 group-hover:text-white" />}
              </button>
            </div>
            <button className="h-16 px-8 bg-white text-primary-700 rounded-2xl font-extrabold uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20 flex items-center gap-2">
              Invite Peers
              <Users className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Abstract Aesthetic */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-white/5 rounded-full blur-2xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {milestones.map((m, idx) => (
          <div key={idx} className={`glass-card p-8 rounded-[2.5rem] border-greys-100 relative ${m.unlocked ? 'bg-primary-50/30' : 'bg-white'}`}>
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${m.unlocked ? 'bg-primary-100 text-primary-600' : 'bg-greys-50 text-greys-400'}`}>
                <Star className="w-6 h-6" fill={m.unlocked ? "currentColor" : "none"} />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-black-400">{m.referrals} Referral{m.referrals > 1 ? 's' : ''}</span>
            </div>
            
            <h4 className="font-extrabold text-black-900 leading-tight mb-2">{m.reward}</h4>
            <p className="text-xs text-black-400 font-medium">Earn credit when a friend creates an account using your link.</p>

            <AnimatePresence>
                {m.unlocked && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-4 right-4 bg-green-500 text-white p-1 rounded-full"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
