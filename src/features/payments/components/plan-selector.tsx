"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Zap, ShieldCheck, CreditCard, X } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { PLANS, calculateAdaptivePrice, ProfileFactor } from "../utils/adaptive-pricing";

interface PlanSelectorProps {
  onSelect: (planId: string, price: number) => void;
}

export function PlanSelector({ onSelect }: PlanSelectorProps) {
  const [factors, setFactors] = useState<ProfileFactor[]>(["early-bird"]);
  
  const toggleFactor = (factor: ProfileFactor) => {
    setFactors(prev => prev.includes(factor) ? prev.filter(f => f !== factor) : [...prev, factor]);
  };

  return (
    <div className="space-y-12">
      {/* Factor Toggle - Adaptive Showcase */}
      <div className="flex flex-wrap items-center justify-center gap-4 bg-greys-50 p-6 rounded-[2.5rem] border border-greys-100">
        <span className="text-sm font-extrabold text-black-400 uppercase tracking-widest mr-4">Apply Discounts</span>
        {[
          { id: "low-ses", label: "Low SES Support", icon: ShieldCheck },
          { id: "early-bird", label: "Early Bird", icon: Zap },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => toggleFactor(item.id as ProfileFactor)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition-all border",
              factors.includes(item.id as ProfileFactor) 
                ? "bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-200" 
                : "bg-white border-greys-200 text-black-500 hover:border-primary-300"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan) => {
          const pricing = calculateAdaptivePrice(plan.basePrice, factors);
          const hasDiscount = pricing.discountPercentage > 0;

          return (
            <motion.div
              key={plan.id}
              whileHover={{ y: -8 }}
              className={cn(
                "glass-card p-10 rounded-[3rem] flex flex-col justify-between transition-all duration-300",
                plan.id === "pro" ? "border-primary-500 shadow-2xl shadow-primary-100 ring-4 ring-primary-50" : "border-greys-100"
              )}
            >
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-extrabold text-black-900 leading-tight">{plan.name}</h3>
                    {plan.id === "pro" && <span className="text-[10px] font-extrabold text-primary-600 uppercase tracking-widest bg-primary-50 px-2 py-1 rounded-md">Recommended</span>}
                  </div>
                  {plan.isPremium && <Sparkles className="w-6 h-6 text-primary-500" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <AnimatePresence mode="wait">
                      <motion.span 
                        key={pricing.discountedPrice}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl font-extrabold text-black-900"
                      >
                        £{pricing.discountedPrice}
                      </motion.span>
                    </AnimatePresence>
                    <span className="text-black-400 font-bold">/one-time</span>
                  </div>
                  {hasDiscount && plan.basePrice > 0 && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs font-bold text-green-600 flex items-center gap-1"
                    >
                      <s className="text-black-300">£{plan.basePrice}</s>
                      Save {pricing.discountPercentage}% with selected factors
                    </motion.p>
                  )}
                </div>

                <div className="space-y-4 pt-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary-600" />
                      </div>
                      <span className="text-sm font-medium text-black-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onSelect(plan.id, pricing.discountedPrice)}
                disabled={plan.basePrice === 0}
                className={cn(
                  "w-full h-16 rounded-[1.5rem] mt-10 font-extrabold uppercase tracking-widest transition-all text-sm",
                  plan.id === "pro" ? "bg-primary-600 text-white hover:bg-primary-700 shadow-xl shadow-primary-200" :
                  plan.basePrice === 0 ? "bg-greys-100 text-black-400 cursor-default" :
                  "bg-black-900 text-white hover:bg-black-800"
                )}
              >
                {plan.basePrice === 0 ? "Current Plan" : "Choose Plan"}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
