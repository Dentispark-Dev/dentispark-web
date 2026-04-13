"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  Minus, 
  Info, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Trophy,
  Loader2,
  HelpCircle,
  Mail,
  Users,
  Video
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/providers/auth-provider";
import { BaseAPI } from "@/src/connection/base-api";
import { toast } from "sonner";
import Container from "@/src/components/layouts/container";

interface Plan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceAnnual: number;
  href: string;
  popular?: boolean;
  cta: string;
  icon: React.ReactNode;
  color: string;
}

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for exploring dental careers and initial research.",
    priceMonthly: 19,
    priceAnnual: 15,
    href: "/sign-up",
    cta: "Start for Free",
    icon: <Zap className="size-5" />,
    color: "slate",
  },
  {
    id: "pro",
    name: "Pro",
    description: "Our most popular plan for active applicants and students.",
    priceMonthly: 49,
    priceAnnual: 39,
    href: "/payment-setup?plan=pro",
    popular: true,
    cta: "Most Popular",
    icon: <ShieldCheck className="size-5" />,
    color: "emerald",
  },
  {
    id: "elite",
    name: "Elite",
    description: "Maximum support for those targeting competitive top-tier schools.",
    priceMonthly: 99,
    priceAnnual: 79,
    href: "/payment-setup?plan=elite",
    cta: "Join Elite",
    icon: <Trophy className="size-5" />,
    color: "amber",
  },
];

const CATEGORIES = [
  {
    name: "Intelligence & Tools",
    features: [
      { name: "University Database (UK)", starter: true, pro: true, elite: true },
      { name: "Admission Probability AI", starter: "Basic", pro: "Advanced", elite: "Predictive" },
      { name: "Personal Statement Review", starter: "1 Check", pro: "5 Checks / mo", elite: "Unlimited" },
      { name: "UCAT / BMAT Test Prep", starter: "Limited", pro: "Full Suite", elite: "Full Suite" },
      { name: "Shadowing & Work Exp Tracker", starter: true, pro: true, elite: true },
    ],
  },
  {
    name: "Mentorship & Coaching",
    features: [
      { name: "1:1 Mentor Matching", starter: "Discovery Only", pro: "Priority", elite: "Elite Matching" },
      { name: "Monthly Mentor Sessions", starter: false, pro: "2 Sessions", elite: "5 Sessions" },
      { name: "Video Consultation Room", starter: false, pro: true, elite: true },
      { name: "Personalized Study Planner", starter: false, pro: true, elite: true },
    ],
  },
  {
    name: "Support & Community",
    features: [
      { name: "Global Community Access", starter: true, pro: true, elite: true },
      { name: "Verification Badges", starter: false, pro: true, elite: true },
      { name: "Priority Email Support", starter: false, pro: "24h", elite: "1h Premium" },
      { name: "Dedicated Success Coach", starter: false, pro: false, elite: true },
    ],
  },
];

export default function PricingComparison() {
  const [isAnnual, setIsAnnual] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscription = async (plan: Plan) => {
    if (!user) {
      router.push("/sign-up");
      return;
    }

    if (plan.id === "starter") {
      router.push("/overview");
      return;
    }

    setLoadingPlan(plan.id);
    try {
      const api = new BaseAPI();
      const session = await api.post<{ checkoutUrl: string }>("/checkout/initiate", {
        platformUserEmailAddress: user.emailAddress,
        action: "MEMBERSHIP_REGISTRATION",
        metadata: {
           planId: plan.id,
           billingStep: isAnnual ? "ANNUAL" : "MONTHLY"
        }
      });
      if (session?.checkoutUrl) {
        window.location.href = session.checkoutUrl;
      }
    } catch (err) {
      toast.error("Checkout unavailable. Please try again later.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="bg-white py-12 lg:py-24">
      <Container className="max-w-6xl">
        {/* Toggle & Title */}
        <div className="flex flex-col items-center text-center space-y-6 mb-16 lg:mb-24">
          <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
             <button 
                onClick={() => setIsAnnual(false)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                  !isAnnual ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
             >
                Monthly
             </button>
             <button 
                onClick={() => setIsAnnual(true)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                  isAnnual ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-slate-400 hover:text-slate-600"
                )}
             >
                Annual
                <span className={cn(
                  "text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full",
                  isAnnual ? "bg-white/20" : "bg-emerald-100 text-emerald-600"
                )}>Save 20%</span>
             </button>
          </div>
          
          <h1 className="h2 max-w-2xl mx-auto">
            Everything you need to <span className="text-emerald-600">spark</span> your clinical career.
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">
            Choose the depth of support required for your current stage. Subsidized rates available for Access Project students.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="relative">
          {/* Comparison Table */}
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.06)] overflow-hidden">
             {/* Header Row */}
             <div className="grid grid-cols-1 lg:grid-cols-4 items-stretch border-b border-slate-50">
                <div className="hidden lg:flex flex-col justify-end p-8 lg:p-10 border-r border-slate-50">
                   <h3 className="text-2xl font-jakarta font-extrabold text-slate-900">Compare Plans</h3>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">Find your clinical edge</p>
                </div>

                {PLANS.map((plan) => (
                  <div 
                    key={plan.id}
                    className={cn(
                      "p-8 lg:p-10 flex flex-col items-center lg:items-start transition-all relative",
                      plan.popular && "bg-slate-900",
                      plan.id !== "elite" && "border-r border-slate-100"
                    )}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                    )}
                    
                    <div className={cn(
                      "mb-6 flex items-center gap-3",
                      plan.popular ? "text-emerald-400" : "text-emerald-600"
                    )}>
                       <div className={cn(
                         "size-10 rounded-xl flex items-center justify-center",
                         plan.popular ? "bg-emerald-500/10" : "bg-emerald-50"
                       )}>
                        {plan.icon}
                       </div>
                       <span className="font-extrabold text-xl font-jakarta">{plan.name}</span>
                    </div>

                    <div className="mb-4">
                       <div className="flex items-baseline gap-1">
                          <span className={cn(
                            "text-4xl lg:text-5xl font-extrabold font-jakarta tracking-tight",
                            plan.popular ? "text-white" : "text-slate-900"
                          )}>
                             £{isAnnual ? plan.priceAnnual : plan.priceMonthly}
                          </span>
                          <span className={cn(
                            "text-sm font-medium",
                            plan.popular ? "text-slate-500" : "text-slate-400"
                          )}>/mo</span>
                       </div>
                       <p className={cn(
                         "text-xs font-bold mt-2 h-10",
                         plan.popular ? "text-slate-400" : "text-slate-500"
                       )}>
                         {plan.description}
                       </p>
                    </div>

                    <Button 
                      onClick={() => handleSubscription(plan)}
                      disabled={loadingPlan === plan.id}
                      className={cn(
                        "w-full h-14 rounded-2xl font-bold transition-all duration-300",
                        plan.popular 
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/20" 
                          : "bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200"
                      )}
                    >
                      {loadingPlan === plan.id ? <Loader2 className="animate-spin" /> : plan.cta}
                    </Button>
                    
                    {isAnnual && (
                      <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-4">
                        Billed £{plan.priceAnnual * 12} Annually
                      </p>
                    )}
                  </div>
                ))}
             </div>

             {/* Categories Grid */}
             {CATEGORIES.map((category) => (
               <div key={category.name}>
                  {/* Category Header Row */}
                  <div className="bg-slate-50/50 p-6 lg:px-10 border-b border-slate-100">
                     <h4 className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-slate-400">
                        {category.name}
                     </h4>
                  </div>

                  {/* Feature Rows */}
                  {category.features.map((feature, idx) => (
                    <div key={idx} className="grid grid-cols-1 lg:grid-cols-4 border-b border-slate-50 items-center transition-colors hover:bg-slate-50/20">
                       <div className="p-6 lg:px-10 lg:py-5 border-r border-slate-50">
                          <div className="flex items-center gap-2 group cursor-help">
                             <span className="text-sm font-bold text-slate-700">{feature.name}</span>
                             <HelpCircle size={14} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                          </div>
                       </div>

                       {[feature.starter, feature.pro, feature.elite].map((val, i) => (
                         <div key={i} className={cn(
                           "p-6 lg:py-5 flex items-center justify-center border-r border-slate-50 last:border-r-0",
                           i === 1 && "bg-slate-100/10" // Tinting the 'Pro' column slightly
                         )}>
                            {typeof val === "boolean" ? (
                              val ? (
                                <div className="size-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                   <Check size={14} strokeWidth={3} />
                                </div>
                              ) : (
                                <Minus size={16} className="text-slate-200" />
                              )
                            ) : (
                              <span className={cn(
                                "text-xs font-extrabold uppercase tracking-tight",
                                typeof val === "string" && val !== "Limited" ? "text-emerald-600" : "text-slate-500"
                              )}>
                                {val}
                              </span>
                            )}
                         </div>
                       ))}
                    </div>
                  ))}
               </div>
             ))}

             {/* Final CTA Footer */}
             <div className="p-12 lg:p-16 flex flex-col items-center text-center space-y-8 bg-slate-900 text-white">
                <div className="space-y-4">
                   <h3 className="h3">Still have questions?</h3>
                   <p className="text-slate-400 max-w-lg mx-auto">
                     Our team can help you identify the best support tier for your current educational needs.
                   </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-6">
                   <Link href="/contact-us" className="text-emerald-400 font-bold hover:underline flex items-center gap-2">
                      Speak with an Advisor <ArrowRight size={16} />
                   </Link>
                   <Link href="/faqs" className="text-white hover:text-emerald-400 font-bold transition-all">
                      Browse FAQs
                   </Link>
                </div>
             </div>
          </div>
        </div>

        {/* Access Project Banner */}
        <div className="mt-16 bg-emerald-600 rounded-[3rem] p-10 lg:p-16 relative overflow-hidden text-white">
           <div className="absolute top-0 right-0 p-12 opacity-10">
              <Users className="size-48" />
           </div>
           
           <div className="relative z-10 lg:flex items-center justify-between gap-12">
              <div className="max-w-2xl space-y-4">
                 <div className="bg-white/10 w-fit px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                    Social Mobility Initiative
                 </div>
                 <h2 className="h2 text-white">The Access Project Grant</h2>
                 <p className="text-emerald-50 font-medium text-lg leading-relaxed">
                   Are you eligible for subsidized mentorship? We partner with outreach initiatives to ensure background never limits potential in dentistry.
                 </p>
              </div>
              <Button asChild className="mt-8 lg:mt-0 bg-white text-emerald-600 hover:bg-emerald-50 h-16 px-10 rounded-2xl font-bold text-lg shadow-2xl active:scale-95 transition-all">
                 <Link href="/access-project">Apply for Grant</Link>
              </Button>
           </div>
        </div>
      </Container>
    </div>
  );
}
