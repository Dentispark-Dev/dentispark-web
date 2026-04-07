"use client";

import { motion } from "framer-motion";
import AimBackground from "@/src/components/icons/AimBackground";
import Container from "@/src/components/layouts/container";

import { Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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

export function AimSection() {
  return (
    <section className="relative bg-white pb-32 overflow-hidden">
      <Container>
        <motion.div 
          className="grid grid-cols-1 gap-12 lg:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Mission Card */}
          <motion.div
            variants={itemVariants}
            className="group relative h-full flex flex-col justify-between rounded-[3rem] p-12 border border-emerald-100 bg-emerald-50/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(16,185,129,0.1)] hover:bg-emerald-50"
          >
            <div className="absolute top-0 right-0 p-8 opacity-20 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12 translate-x-4 -translate-y-4">
              <AimBackground fill="#10b981" className="size-48" />
            </div>

            <div className="relative z-10 space-y-10">
              <div className="px-5 py-2 rounded-full bg-emerald-500 text-white text-[10px] font-bold tracking-[0.3em] uppercase w-fit shadow-lg shadow-emerald-500/20">
                Mission
              </div>
              <p className="font-jakarta text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                To make dental school applications <span className="text-emerald-600 underline decoration-emerald-200 underline-offset-8">easier, affordable, and accessible</span> for underprivileged students.
              </p>
            </div>
            
            <div className="mt-12 h-1.5 w-24 bg-emerald-500 rounded-full transition-all duration-500 group-hover:w-full" />
          </motion.div>

          {/* Vision Card */}
          <motion.div
            variants={itemVariants}
            className="group relative h-full flex flex-col justify-between rounded-[3rem] p-12 border border-slate-200 bg-slate-50/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.05)] hover:bg-white"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12 translate-x-4 -translate-y-4">
              <AimBackground fill="#475569" className="size-48" />
            </div>

            <div className="relative z-10 space-y-10">
              <div className="px-5 py-2 rounded-full bg-slate-900 text-white text-[10px] font-bold tracking-[0.3em] uppercase w-fit shadow-lg shadow-slate-900/20">
                Vision
              </div>
              <p className="font-jakarta text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                To be the <span className="text-slate-600 underline decoration-slate-200 underline-offset-8">leading global platform</span> guiding underserved students into dental careers.
              </p>
            </div>
            
            <div className="mt-12 h-1.5 w-24 bg-slate-900 rounded-full transition-all duration-500 group-hover:w-full" />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
