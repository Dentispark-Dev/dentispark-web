"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { PlanSelector } from "@/src/features/payments/components/plan-selector";
import { CheckoutModal } from "@/src/features/payments/components/checkout-modal";
import { PLANS } from "@/src/features/payments/utils/adaptive-pricing";

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<{ id: string; price: number } | null>(null);

  const planName = PLANS.find(p => p.id === selectedPlan?.id)?.name || "";

  return (
    <div className="space-y-16 pb-20">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black uppercase tracking-widest text-primary-600 bg-primary-50 px-4 py-2 rounded-full"
        >
            Premium Solutions
        </motion.span>
        <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl font-black text-black-900 tracking-tight leading-tight"
        >
            Invest in your <span className="text-primary-600">Dental Future.</span>
        </motion.h1>
        <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-black-500 text-lg font-medium"
        >
            Choose the plan that fits your ambition. Our adaptive pricing engine ensures accessibility for any background.
        </motion.p>
      </div>

      <PlanSelector onSelect={(id, price) => setSelectedPlan({ id, price })} />

      <CheckoutModal 
        isOpen={!!selectedPlan} 
        onClose={() => setSelectedPlan(null)}
        planName={planName}
        price={selectedPlan?.price || 0}
      />

      <div className="text-center">
        <p className="text-black-400 text-sm font-medium">
            Join over 5,000 students securing their dental places this year.
        </p>
      </div>
    </div>
  );
}
