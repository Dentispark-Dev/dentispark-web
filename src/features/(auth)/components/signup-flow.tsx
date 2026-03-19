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
  useOAuth2Signup,
  type SignupRequest 
} from "../services";
import { useGoogleAuth } from "@/src/hooks/use-google-auth";

const signupSchema = z.object({
  firstName: z.string().min(2, "First name required"),
  lastName: z.string().min(2, "Last name required"),
  emailAddress: z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 characters"),
});

type SignupData = z.infer<typeof signupSchema>;

const STEPS = [
  { id: "goal", title: "What is your goal?", subtitle: "Select your primary clinical interest" },
  { id: "interest", title: "What do you need help with?", subtitle: "Choose the areas that best fit your needs" },
  { id: "timeline", title: "When is your target?", subtitle: "Tell us when you are looking for help" },
  { id: "referral", title: "How did you hear about us?", subtitle: "We'd love to know how you found DentiSpark" },
  { id: "account", title: "Join the elite", subtitle: "Create your account to start your journey" },
];

const OPTIONS = {
  goal: [
    { label: "BDS (Dental School)", value: "BDS", icon: Stethoscope },
    { label: "Dental Nursing", value: "NURSING", icon: BookOpen },
    { label: "Dental Hygiene/Therapy", value: "HYGIENE", icon: Calendar },
    { label: "Clinical Postgrad", value: "POSTGRAD", icon: MessageSquare },
  ],
  interest: [
    { label: "Personal Statement", value: "PS" },
    { label: "Interview Prep", value: "INTERVIEW" },
    { label: "UCAT / BMAT", value: "TESTS" },
    { label: "University Choices", value: "UNI" },
    { label: "Shadowing / Work Exp", value: "EXP" },
  ],
  timeline: [
    { label: "As soon as possible", value: "ASAP" },
    { label: "Next 6 months", value: "6MONTHS" },
    { label: "Next 12 months", value: "12MONTHS" },
    { label: "Just exploring", value: "EXPLORING" },
  ],
  referral: [
    { label: "Google Search", value: "GOOGLE" },
    { label: "Social Media (IG/TikTok)", value: "SOCIAL" },
    { label: "Friend or Colleague", value: "FRIEND" },
    { label: "University / School", value: "SCHOOL" },
    { label: "Other", value: "OTHER" },
  ],
};

const SOCIAL_PROOF = [
  {
    step: 0,
    quote: "DentiSpark's guidance was pivotal in my acceptance to King's College Dental School.",
    author: "Sarah J. • BDS Student",
    stat: "95% Success Rate",
    logos: ["KCL", "Queen Mary", "Bristol"]
  },
  {
    step: 1,
    quote: "The UCAT prep tools are unlike anything else—structured, professional, and effective.",
    author: "James M. • Prospective Student",
    stat: "50+ Elite Mentors",
    logos: ["Manchester", "Leeds", "Sheffield"]
  },
  {
    step: 2,
    quote: "I found my perfect mentor within minutes. The matching process is incredibly seamless.",
    author: "Aisha K. • Dental Nurse",
    stat: "24/7 Expert Support",
    logos: ["Birmingham", "Cardiff", "Glasgow"]
  },
  {
    step: 3,
    quote: "Highly recommended for anyone serious about their dental career. A true game-changer.",
    author: "Dr. Robert P. • Lead Mentor",
    stat: "Elite Community",
    logos: ["UCL", "Plymouth", "Liverpool"]
  },
];

export function SignupFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({
    goal: "",
    interests: [],
    timeline: "",
    referral: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const signupMutation = useSignup();
  const oauth2SignupMutation = useOAuth2Signup();

  const { signInWithGoogle } = useGoogleAuth({
    onSuccess: (code) => {
      oauth2SignupMutation.mutate({
        oauth2ProviderAuthorizationCode: code,
        authProvider: "GOOGLE",
        memberType: "STUDENT",
      });
    },
    onError: () => toast.error("Google authentication failed"),
  });

  const form = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { firstName: "", lastName: "", emailAddress: "", password: "" },
  });

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const selectOption = (field: string, value: string) => {
    if (field === "interests") {
      const current = formData.interests || [];
      const updated = current.includes(value)
        ? current.filter((v: string) => v !== value)
        : [...current, value];
      setFormData({ ...formData, interests: updated });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const onSubmit = async (data: SignupData) => {
    startTransition(() => {
      signupMutation.mutate({
        ...data,
        memberType: "STUDENT",
        // We could send formData here too if the API supported it
      });
    });
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="flex flex-col lg:flex-row min-h-[90vh] w-full max-w-7xl mx-auto bg-white lg:rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 mt-10 mb-10">
      
      {/* Left Pane - Form Steps */}
      <div className="flex-1 flex flex-col p-8 md:p-12 lg:p-16 relative bg-white">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 overflow-hidden">
          <motion.div 
            className="h-full bg-emerald-500"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-12">
          {currentStep > 0 ? (
            <button 
              onClick={handleBack} 
              className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <div className="flex items-center">
              <Logo className="h-8 w-auto" />
            </div>
          )}
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
            Step {currentStep + 1} of {STEPS.length}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="space-y-10"
            >
              <div className="space-y-3 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-sora font-extrabold text-slate-900 tracking-tight leading-tight">
                  <span className="text-emerald-500 mr-2">{currentStep + 1} →</span>
                  {STEPS[currentStep].title}
                </h2>
                <p className="text-slate-500 font-medium text-lg">
                  {STEPS[currentStep].subtitle}
                </p>
              </div>

              {/* Goal Step */}
              {STEPS[currentStep].id === "goal" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {OPTIONS.goal.map((opt) => (
                    <OptionCard
                      key={opt.value}
                      label={opt.label}
                      icon={<opt.icon className={cn("size-6", formData.goal === opt.value ? "text-white" : "text-emerald-500")} />}
                      selected={formData.goal === opt.value}
                      onClick={() => selectOption("goal", opt.value)}
                    />
                  ))}
                </div>
              )}

              {/* Interest Step */}
              {STEPS[currentStep].id === "interest" && (
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-3">
                    {OPTIONS.interest.map((opt) => (
                      <ChoiceButton
                        key={opt.value}
                        label={opt.label}
                        selected={formData.interests.includes(opt.value)}
                        onClick={() => selectOption("interests", opt.value)}
                      />
                    ))}
                    <div className="relative w-full mt-4">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                       <Input 
                        placeholder="Other specific area..." 
                        className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50 focus:ring-emerald-500/20"
                       />
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline Step */}
              {STEPS[currentStep].id === "timeline" && (
                <div className="grid grid-cols-1 gap-4">
                  {OPTIONS.timeline.map((opt) => (
                    <OptionCard
                      key={opt.value}
                      label={opt.label}
                      selected={formData.timeline === opt.value}
                      onClick={() => selectOption("timeline", opt.value)}
                    />
                  ))}
                </div>
              )}

              {/* Referral Step */}
              {STEPS[currentStep].id === "referral" && (
                <div className="grid grid-cols-1 gap-4">
                  {OPTIONS.referral.map((opt) => (
                    <OptionCard
                      key={opt.value}
                      label={opt.label}
                      selected={formData.referral === opt.value}
                      onClick={() => selectOption("referral", opt.value)}
                    />
                  ))}
                </div>
              )}

              {/* Account Step */}
              {STEPS[currentStep].id === "account" && (
                <div className="space-y-6">
                  {/* Google Sign-up */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-14 rounded-2xl border-slate-100 bg-white hover:bg-slate-50 flex items-center justify-center gap-3 font-sora font-bold text-slate-700 transition-all shadow-sm"
                    onClick={signInWithGoogle}
                    disabled={isPending || oauth2SignupMutation.isPending}
                  >
                    <svg className="size-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </Button>

                  <div className="relative py-2 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center px-2">
                      <span className="w-full border-t border-slate-100" />
                    </div>
                    <span className="relative bg-white px-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest">or email</span>
                  </div>

                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="First name"
                        className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus:ring-emerald-500/20 px-6 font-medium"
                        {...form.register("firstName")}
                      />
                      <Input
                        placeholder="Last name"
                        className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus:ring-emerald-500/20 px-6 font-medium"
                        {...form.register("lastName")}
                      />
                    </div>
                    <Input
                      placeholder="Email address"
                      type="email"
                      className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus:ring-emerald-500/20 px-6 font-medium"
                      {...form.register("emailAddress")}
                    />
                    <div className="relative">
                      <Input
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus:ring-emerald-500/20 px-6 font-medium pr-14"
                        {...form.register("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Footer Actions */}
              <div className="pt-8 flex flex-col items-center gap-6">
                <Button 
                  onClick={currentStep === STEPS.length - 1 ? form.handleSubmit(onSubmit) : handleNext}
                  disabled={
                    (STEPS[currentStep].id === "goal" && !formData.goal) ||
                    (STEPS[currentStep].id === "timeline" && !formData.timeline) ||
                    (STEPS[currentStep].id === "referral" && !formData.referral) ||
                    isPending || signupMutation.isPending
                  }
                  className="w-full md:w-auto min-w-[200px] h-16 rounded-[1.5rem] bg-emerald-500 hover:bg-emerald-600 text-white font-sora font-extrabold text-lg transition-all duration-300 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 active:scale-95 group"
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
                <blockquote className="text-3xl font-sora font-extrabold text-white leading-tight tracking-tight">
                  "{SOCIAL_PROOF[Math.min(currentStep, SOCIAL_PROOF.length - 1)].quote}"
                </blockquote>
                <div className="flex items-center gap-4 pt-4">
                  <div className="size-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                    {SOCIAL_PROOF[Math.min(currentStep, SOCIAL_PROOF.length - 1)].author.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-white">{SOCIAL_PROOF[Math.min(currentStep, SOCIAL_PROOF.length - 1)].author}</span>
                    <span className="text-xs text-slate-400 uppercase tracking-widest font-bold font-sora">Verified Student</span>
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

function OptionCard({ label, icon, selected, onClick }: any) {
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
        <span className={cn("font-sora font-extrabold text-lg", selected ? "text-white" : "text-slate-700")}>
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

function ChoiceButton({ label, selected, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-6 py-3 rounded-2xl font-sora font-bold text-sm transition-all border",
        selected 
          ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
          : "bg-white border-slate-100 text-slate-500 hover:border-emerald-200 hover:bg-emerald-50/30"
      )}
    >
      {label}
    </button>
  );
}

function Star({ size, fill, ...props }: any) {
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
