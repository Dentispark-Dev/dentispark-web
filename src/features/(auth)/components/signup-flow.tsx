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
  Check,
  Star
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

const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  terms: z.boolean().refine((val) => val === true, "You must accept the terms"),
});

type SignupFormData = z.infer<typeof signupSchema> & {
  goal?: string;
  timeline?: string;
  referral?: string;
};

const STEPS = [
  { id: "account", title: "Create Account", description: "Start your dental journey" },
  { id: "goal", title: "Primary Goal", description: "What are you aiming for?" },
  { id: "timeline", title: "Application Timeline", description: "When are you applying?" },
  { id: "referral", title: "Referral", description: "How did you find us?" },
];

const SOCIAL_PROOF = [
  { quote: "DentiSpark cut my application time in half. Peer-review was a game changer.", author: "Sarah K.", logos: ["KCL", "UCL", "Barts"], stat: "Top 5% UCAT Score" },
  { quote: "The mentor matching logic found me someone who actually understood my niche.", author: "Ahmed R.", logos: ["Leeds", "Manchester"], stat: "3 Offers Received" },
  { quote: "Gemma's AI feedback on my PS was better than my paid advisor.", author: "Elena M.", logos: ["Bristol", "Sheffield"], stat: "100% PS Satisfaction" },
  { quote: "One-click session booking and Daily integration makes coordination so easy.", author: "Liam T.", logos: ["Glasgow", "Dundee"], stat: "Verified Enrolled Student" },
];

export function SignupFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPending, startTransition] = useTransition();
  const signupMutation = useSignup();
  const oauthSignupMutation = useOAuth2Signup();
  const { loginWithGoogle } = useGoogleAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      terms: false,
    }
  });

  const formData = watch();

  const onNext = async () => {
    const fieldsToValidate = currentStep === 0 ? ["fullName", "email", "password", "terms"] : [];
    const isValid = await trigger(fieldsToValidate as any);
    
    if (isValid) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        await signupMutation.mutateAsync(formData as SignupRequest);
      }
    }
  };

  const onBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      {/* Left Pane - Form */}
      <div className="flex-1 flex flex-col p-8 md:p-16 lg:p-24 relative overflow-y-auto">
        <div className="flex items-center justify-between mb-16">
          <Link href="/">
            <Logo className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-2">
            {STEPS.map((_, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  idx === currentStep ? "w-8 bg-emerald-500" : idx < currentStep ? "w-4 bg-emerald-200" : "w-4 bg-slate-100"
                )}
              />
            ))}
          </div>
        </div>

        <div className="max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <span className="caption-caps">Step 0{currentStep + 1}</span>
                <h1 className="h2">{STEPS[currentStep].title}</h1>
                <p className="text-slate-500 font-medium">{STEPS[currentStep].description}</p>
              </div>

              {currentStep === 0 && (
                 <form className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                      <Input {...register("fullName")} placeholder="Jane Doe" className="h-14 rounded-2xl" />
                      {errors.fullName && <p className="text-red-500 text-xs font-medium">{errors.fullName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                      <Input {...register("email")} type="email" placeholder="jane@example.com" className="h-14 rounded-2xl" />
                      {errors.email && <p className="text-red-500 text-xs font-medium">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                      <Input {...register("password")} type="password" placeholder="••••••••" className="h-14 rounded-2xl" />
                      {errors.password && <p className="text-red-500 text-xs font-medium">{errors.password.message}</p>}
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <input type="checkbox" {...register("terms")} className="size-5 rounded-lg border-slate-200 text-emerald-500 focus:ring-emerald-500" />
                      <label className="text-sm text-slate-500 font-medium">
                        I agree to the <Link href="/terms" className="text-emerald-500 hover:underline">Terms of Service</Link>
                      </label>
                    </div>
                    {errors.terms && <p className="text-red-500 text-xs font-medium">{errors.terms.message}</p>}
                 </form>
              )}

              {currentStep === 1 && (
                <div className="grid grid-cols-1 gap-4">
                  <OptionCard 
                    label="Get into Dental School" 
                    icon={<Stethoscope className="size-6" />} 
                    selected={formData.goal === "dental"} 
                    onClick={() => setValue("goal", "dental")} 
                  />
                  <OptionCard 
                    label="Master Clinical Skills" 
                    icon={<BookOpen className="size-6" />} 
                    selected={formData.goal === "clinical"} 
                    onClick={() => setValue("goal", "clinical")} 
                  />
                  <OptionCard 
                    label="Research & Specialization" 
                    icon={<Sparkles className="size-6" />} 
                    selected={formData.goal === "research"} 
                    onClick={() => setValue("goal", "research")} 
                  />
                </div>
              )}

              {currentStep === 2 && (
                <div className="flex flex-wrap gap-3">
                  {["2024 Cycle", "2025 Cycle", "2026 Cycle", "Just Browsing"].map(t => (
                    <ChoiceButton 
                      key={t} 
                      label={t} 
                      selected={formData.timeline === t} 
                      onClick={() => setValue("timeline", t)} 
                    />
                  ))}
                </div>
              )}

              {currentStep === 3 && (
                <div className="grid grid-cols-1 gap-4">
                   <OptionCard 
                    label="Social Media" 
                    icon={<Search className="size-6" />} 
                    selected={formData.referral === "social"} 
                    onClick={() => setValue("referral", "social")} 
                  />
                  <OptionCard 
                    label="From a Mentor" 
                    icon={<User className="size-6" />} 
                    selected={formData.referral === "mentor"} 
                    onClick={() => setValue("referral", "mentor")} 
                  />
                </div>
              )}

              <div className="flex flex-col md:flex-row items-center gap-6 pt-8">
                {currentStep > 0 && (
                  <button onClick={onBack} className="text-slate-400 hover:text-slate-600 font-bold flex items-center gap-2 group transition-colors">
                    <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                  </button>
                )}
                <Button 
                  onClick={onNext}
                  disabled={
                    (currentStep === 1 && !formData.goal) ||
                    (currentStep === 2 && !formData.timeline) ||
                    (currentStep === 3 && !formData.referral) ||
                    signupMutation.isPending
                  }
                  className="w-full md:w-auto min-w-[200px] h-16 rounded-[1.5rem] bg-emerald-500 hover:bg-emerald-600 text-white font-jakarta font-extrabold text-lg transition-all duration-300 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 active:scale-95 group"
                >
                  {signupMutation.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      {currentStep === STEPS.length - 1 ? "Complete Registration" : "Continue"}
                      <CheckCircle className="size-5 group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-auto pt-10 text-center md:text-left">
           <p className="text-sm font-medium text-slate-400">
             Already a member? <Link href="/login" className="text-emerald-500 font-bold hover:underline">Log in</Link>
           </p>
        </div>
      </div>

      {/* Right Pane - Social Proof Sidebar */}
      <div className="hidden lg:flex lg:w-[40%] bg-slate-900 relative overflow-hidden flex-col justify-center p-16 text-white border-l border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />
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
                      <div key={logo} className="h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center px-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{logo}</span>
                      </div>
                    ))}
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

interface LooseRecord {
  label: string;
  icon?: React.ReactNode;
  selected: boolean;
  onClick: () => void;
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

function ChoiceButton({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
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
