"use client";

import React from "react";
import { ReferralSystem } from "@/src/features/growth/components/referral-system";
import { SuccessCard } from "@/src/features/growth/components/success-card";
import { motion } from "framer-motion";
import { Rocket, Trophy, Globe } from "lucide-react";
import Link from "next/link";

export default function GrowthPage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-16">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                <Rocket className="w-7 h-7" />
            </div>
            <h1 className="text-4xl font-black text-black-900 tracking-tight">Growth & Rewards</h1>
        </div>
        <p className="text-black-500 font-medium text-lg max-w-2xl">
          Help build the DentiSpark community. Earn credits, unlock premium features, and celebrate your application milestones.
        </p>
      </div>

      <ReferralSystem />

      <section className="pt-8 border-t border-greys-100">
        <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-primary-500" />
                    <h2 className="text-2xl font-black text-black-900 tracking-tight uppercase tracking-widest text-xs">Milestone Sharing</h2>
                </div>
                <h3 className="text-3xl font-black text-black-900 leading-tight">Celebrate Your Wins Globally.</h3>
                <p className="text-black-400 font-medium leading-relaxed">
                    Generate elite tier success cards for your Personal Statement reviews, interview bot sessions, or university offers. Designed for instant sharing on Instagram and LinkedIn.
                </p>
                <div className="flex gap-8">
                    <div className="space-y-1">
                        <p className="text-2xl font-black text-primary-600 italic">5k+</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-black-400">Cards Shared</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-2xl font-black text-blue-600 italic">100%</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-black-400">Viral Impact</p>
                    </div>
                </div>
            </div>
            
            <div className="flex-1 w-full max-w-md">
                <SuccessCard 
                    score={94} 
                    category="AI Review" 
                    milestone="Elite Narrative Flow Detected by AI Hub" 
                />
            </div>
        </div>
      </section>

      <div className="glass-card p-12 rounded-[3.5rem] bg-black-900 text-white flex flex-col items-center text-center space-y-8 relative overflow-hidden">
        <Globe className="w-12 h-12 text-primary-400 animate-spin-slow" />
        <div className="space-y-4 relative z-10">
            <h3 className="text-3xl font-black tracking-tight">Going Institutional?</h3>
            <p className="text-white/60 font-medium max-w-lg">
                Are you part of a dental academy or school? Contact us for corporate licensing and institutional mentor dashboards.
            </p>
        </div>
        <Link href="/contact-us" className="h-16 px-10 bg-white text-black-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-50 transition-all relative z-10 flex items-center justify-center">
            Contact Partnerships
        </Link>
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>
    </div>
  );
}
