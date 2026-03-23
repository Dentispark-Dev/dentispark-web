"use client";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Title } from "@/src/components/atoms/title";
import { cn } from "@/src/lib/utils";

const plans = [
  {
    name: "Free Plan",
    priceHtml: "Free",
    description: "Curious to see how it works?",
    features: ["Access guides", "University data", "AI-driven checklists"],
    highlighted: false,
  },
  {
    name: "Premium Plan",
    // TODO: Confirm final live pricing or connect to Stripe/Chargebee API before launch
    priceHtml: '$24<span class="text-sm font-normal">/month</span>',
    description: "Need More? Upgrade for 1:1 Mentorship and More",
    features: [
      "Access guides",
      "University data",
      "AI-driven checklists",
      "1:1 Mentorship",
    ],
    highlighted: true,
  },
];

import { motion, Variants } from "framer-motion";
import Container from "@/src/components/layouts/container";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function PricingSection() {
  return (
    <section className="bg-white py-24 md:py-32 overflow-hidden">
      <Container>
        <motion.div 
          className="flex flex-col items-center space-y-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="flex flex-col items-center space-y-6 text-center">
            <motion.div variants={itemVariants} className="px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold tracking-[0.2em] uppercase">
              Investment
            </motion.div>
            <motion.h2 variants={itemVariants} className="font-sora text-4xl font-extrabold text-slate-900 md:text-6xl tracking-tight max-w-3xl">
              Unlock more support when you&apos;re <span className="text-emerald-600">ready.</span>
            </motion.h2>
          </div>

          <div className="grid w-full max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={itemVariants}
                className={cn(
                  "group relative flex flex-col rounded-[3rem] p-10 border transition-all duration-500 hover:-translate-y-2",
                  plan.highlighted 
                    ? "bg-slate-900 border-slate-800 shadow-[0_30px_60px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/20" 
                    : "bg-white border-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.05)]"
                )}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 right-10 bg-emerald-500 text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                    Most Popular
                  </div>
                )}

                <div className="flex flex-col h-full">
                  <div className="mb-10">
                    <h3 className={cn(
                      "font-sora text-2xl font-extrabold mb-3",
                      plan.highlighted ? "text-white" : "text-slate-900"
                    )}>
                      {plan.name}
                    </h3>
                    <p className={cn(
                      "font-sora text-sm leading-relaxed",
                      plan.highlighted ? "text-slate-400" : "text-slate-500"
                    )}>
                      {plan.description}
                    </p>
                  </div>

                  <div
                    className={cn(
                      "font-sora text-5xl font-extrabold mb-10 tracking-tighter",
                      plan.highlighted ? "text-white" : "text-slate-900"
                    )}
                    dangerouslySetInnerHTML={{ __html: plan.priceHtml }}
                  />

                  <Button
                    className={cn(
                      "h-14 rounded-2xl font-sora font-extrabold text-sm uppercase tracking-widest transition-all duration-300",
                      plan.highlighted 
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40" 
                        : "bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200"
                    )}
                  >
                    Get Started Now
                  </Button>

                  <div className={cn(
                    "my-8 h-px w-full",
                    plan.highlighted ? "bg-slate-800" : "bg-slate-50"
                  )} />

                  <ul className="space-y-5">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center space-x-4"
                      >
                        <div className={cn(
                          "size-5 rounded-full flex items-center justify-center border",
                          plan.highlighted ? "border-emerald-500/30 bg-emerald-500/10" : "border-emerald-100 bg-emerald-50"
                        )}>
                          <Check size={12} className="text-emerald-500" />
                        </div>
                        <span className={cn(
                          "font-sora text-sm font-medium",
                          plan.highlighted ? "text-slate-300" : "text-slate-600"
                        )}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            variants={itemVariants}
            className="group relative flex w-full max-w-5xl flex-col justify-between gap-8 rounded-[2.5rem] bg-emerald-50/50 border border-emerald-100 p-10 md:flex-row md:items-center transition-all duration-500 hover:bg-emerald-50"
          >
            <div className="space-y-2">
              <h3 className="font-sora text-2xl font-extrabold text-emerald-700">
                Access Project
              </h3>
              <p className="font-sora text-slate-600 font-medium">
                Subsidized pricing available through the Access Project initiative.
              </p>
            </div>
            <Link
              href="/access-project"
              className="group font-sora inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white border border-emerald-200 text-emerald-700 font-bold transition-all duration-300 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/20"
            >
              Learn more <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
