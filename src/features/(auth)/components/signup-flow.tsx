"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  ChevronRight, 
  ArrowLeft, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2,
  Stethoscope,
  BookOpen,
  Calendar,
  MessageSquare,
  Search,
  Check
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { cn } from "@/src/lib/utils";
import Logo from "@/src/components/icons/Logo";
import { 
  useSignup, 
import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  ChevronRight, 
  ArrowLeft, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2,
  Stethoscope,
  BookOpen,
  Calendar,
  MessageSquare,
  Search,
  Check
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { cn } from "@/src/lib/utils";
import Logo from "@/src/components/icons/Logo";
import { 
  useSignup, 
  useOAuth2Signup,
  type SignupRequest 
} from "../services";
import { useGoogleAuth } from "@/src/hooks/use-google-auth";
                  disabled={
                    (STEPS[currentStep].id === "goal" && !formData.goal) ||
                    (STEPS[currentStep].id === "timeline" && !formData.timeline) ||
                    (STEPS[currentStep].id === "referral" && !formData.referral) ||
                    isPending || signupMutation.isPending
                  }
                  className="w-full md:w-auto min-w-[200px] h-16 rounded-[1.5rem] bg-emerald-500 hover:bg-emerald-600 text-white font-jakarta font-extrabold text-lg transition-all duration-300 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 active:scale-95 group"
                >
                  {isPending || signupMutation.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      {currentStep === STEPS.length - 1 ? "Complete Registration" : "Continue"}
                      <CheckCircle className="size-5 group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </Button>
                
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest text-center">
                  Press enter to continue <span className="text-emerald-500">↵</span>
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Links */}
        <div className="mt-auto pt-10 text-center md:text-left">
           <p className="text-sm font-medium text-slate-400">
             Already a member? <Link href="/login" className="text-emerald-500 font-bold hover:underline">Log in</Link>
           </p>
        </div>
      </div>

      {/* Right Pane - Social Proof Sidebar */}
      <div className="hidden lg:flex lg:w-[40%] bg-slate-900 relative overflow-hidden flex-col justify-center p-16 text-white border-l border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 space-y-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 text-emerald-400">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <blockquote className="text-3xl font-jakarta font-extrabold text-white leading-tight tracking-tight">
                  &ldquo;{SOCIAL_PROOF[Math.min(currentStep, SOCIAL_PROOF.length - 1)].quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-4 pt-4">
                  <div className="size-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                    {SOCIAL_PROOF[Math.min(currentStep, SOCIAL_PROOF.length - 1)].author.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-white">{SOCIAL_PROOF[Math.min(currentStep, SOCIAL_PROOF.length - 1)].author}</span>
                    <span className="text-xs text-slate-400 uppercase tracking-widest font-bold font-jakarta">Verified Student</span>
                  </div>
                </div>
              </div>

              <div className="pt-12 border-t border-white/10 space-y-8">
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Success Stories at</span>
                  <div className="grid grid-cols-3 gap-4">
                    {SOCIAL_PROOF[Math.min(currentStep, SOCIAL_PROOF.length - 1)].logos.map((logo) => (
                      <div key={logo} className="h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center px-4 transition-all hover:bg-white/10 hover:border-emerald-500/30">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{logo}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 pt-4">
                  <div className="flex items-center gap-4 group">
                    <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 size-10 shrink-0 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
                      <Check size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-bold">{SOCIAL_PROOF[Math.min(currentStep, SOCIAL_PROOF.length - 1)].stat}</span>
                      <span className="text-xs text-slate-400 font-medium">Verified by DentiSpark Data</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function OptionCard({ label, icon, selected, onClick }: LooseRecord) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex items-center justify-between p-6 rounded-3xl border transition-all duration-300 text-left",
        selected 
          ? "bg-emerald-500 border-emerald-500 text-white shadow-xl shadow-emerald-500/20 scale-[1.02]" 
          : "bg-white border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/10"
      )}
    >
      <div className="flex items-center gap-4">
        {icon && (
          <div className={cn(
            "size-12 rounded-2xl flex items-center justify-center transition-colors",
            selected ? "bg-white/20" : "bg-emerald-50 group-hover:bg-emerald-500 group-hover:text-white"
          )}>
            {icon}
          </div>
        )}
        <span className={cn("font-jakarta font-extrabold text-lg", selected ? "text-white" : "text-slate-700")}>
          {label}
        </span>
      </div>
      <div className={cn(
        "size-6 rounded-full border-2 flex items-center justify-center transition-all",
        selected ? "border-white bg-white text-emerald-500 scale-110" : "border-slate-200"
      )}>
        {selected && <Check size={14} strokeWidth={3} />}
      </div>
    </button>
  );
}

function ChoiceButton({ label, selected, onClick }: LooseRecord) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-6 py-3 rounded-2xl font-jakarta font-bold text-sm transition-all border",
        selected 
          ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
          : "bg-white border-slate-100 text-slate-500 hover:border-emerald-200 hover:bg-emerald-50/30"
      )}
    >
      {label}
    </button>
  );
}

function Star({ size, fill, ...props }: LooseRecord) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={fill || "none"} 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
