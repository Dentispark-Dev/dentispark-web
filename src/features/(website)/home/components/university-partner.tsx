"use client";

import School1 from "@/src/components/icons/Sch1";
import School2 from "@/src/components/icons/Sch2";
import School3 from "@/src/components/icons/Sch3";
import School4 from "@/src/components/icons/Sch4";

import Partner1 from "@/src/components/icons/Partner1";
import Partner2 from "@/src/components/icons/Partner2";

import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function UniversityPartner() {
  return (
    <motion.div 
      className="bg-white/40 backdrop-blur-xl mt-24 flex w-full max-w-6xl flex-col divide-slate-100 rounded-[2.5rem] p-12 shadow-[0_30px_60px_rgba(16,185,129,0.08)] border border-emerald-100/30 md:flex-row mx-auto"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* Left column */}
      <motion.div variants={itemVariants} className="flex flex-1 flex-col items-start py-6 text-left md:pl-8">
        <p className="mb-8 font-jakarta text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">
          The Authority
        </p>
        <h3 className="mb-8 font-jakarta text-lg font-extrabold text-slate-900 leading-relaxed">
          The #1 Platform for underprivileged students
          <br />
          applying to dental school.
        </h3>
        <div className="flex flex-wrap gap-10 items-center">
          <School1 className="h-16 w-auto opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
          <School2 className="h-16 w-auto opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
          <School3 className="h-16 w-auto opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
          <School4 className="h-16 w-auto opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
        </div>
      </motion.div>

      {/* Custom Divider */}
      <motion.div variants={itemVariants} className="hidden md:flex items-center px-10">
        <div className="h-32 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
      </motion.div>
      <div className="mx-auto my-10 block h-px w-24 bg-slate-100 md:hidden" />

      {/* Right column */}
      <motion.div variants={itemVariants} className="flex flex-col py-6 text-left md:w-[45%] md:items-start md:pl-10">
        <p className="mb-8 font-jakarta text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">
          Alliances
        </p>
        <h3 className="mb-8 font-jakarta text-lg font-extrabold text-slate-900 leading-relaxed">
          Partnered with leading nonprofits to support
          <br />
          underprivileged students.
        </h3>
        <div className="flex flex-wrap gap-12 items-center">
          <Partner1 className="h-8 w-auto opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
          <Partner2 className="h-8 w-auto opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
        </div>
      </motion.div>
    </motion.div>
  );
}
