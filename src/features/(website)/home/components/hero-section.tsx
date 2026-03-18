// components/Hero.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowRight, Zap } from "lucide-react";
import { motion, Variants } from "framer-motion";

import Container from "@/src/components/layouts/container";
import heroImg1 from "@/public/images/hero-1.png";
import heroImg2 from "@/public/images/hero-2.png";
import UniversityPartner from "./university-partner";
import { Button } from "@/src/components/ui/button";

const bounceY: Variants = {
  rest: { y: 0 },
  hover: {
    y: 5,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 12,
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
};

const bounceX: Variants = {
  rest: { x: 0 },
  hover: {
    x: 5,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 12,
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
};

export function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
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
        ease: [0.16, 1, 0.3, 1], // Custom ease-out expo
      },
    },
  };

  return (
    <section className="relative overflow-hidden pt-32 pb-24">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 5, 0],
            opacity: [0.05, 0.08, 0.05]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-emerald-400/20 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -5, 0],
            opacity: [0.03, 0.06, 0.03]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-teal-400/20 blur-[100px] rounded-full"
        />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#10b981 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} 
        />
      </div>

      <Container className="relative z-10">
        <motion.div 
          className="flex flex-col items-center space-y-10 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold tracking-widest uppercase mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Elite Dental Mentorship
          </motion.div>

          <motion.h1 
            variants={itemVariants} 
            className="font-sora text-slate-900 max-w-5xl text-5xl md:text-7xl leading-[1.1] font-extrabold tracking-tight"
          >
            Empowering{" "}
            <span className="relative inline-block text-emerald-600">
              underprivileged
              <motion.svg 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
                viewBox="0 0 350 20" 
                className="absolute -bottom-2 left-0 w-full h-3 text-emerald-400/30"
              >
                <path d="M5 15Q175 2 345 15" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" />
              </motion.svg>
            </span>{" "}
            students to achieve dental school dreams
          </motion.h1>

          <motion.p 
            variants={itemVariants} 
            className="text-slate-500 text-lg md:text-xl max-w-3xl leading-relaxed"
          >
            Access world-class guidance, elite mentorship, and AI-driven insights specifically designed for the next generation of dental leaders.
          </motion.p>

          <motion.div 
            variants={itemVariants} 
            className="flex flex-col sm:flex-row gap-5 items-center justify-center pt-4"
          >
            <Link href="/sign-up">
              <Button size="lg" className="h-14 px-10 text-base rounded-full shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300">
                Start My Journey Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/resources">
              <Button variant="outline" size="lg" className="h-14 px-10 text-base rounded-full border-2 border-slate-200 hover:border-emerald-500 hover:text-emerald-600 transition-all duration-300">
                Explore Resources <ArrowDown className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>

          {/* Hero images with glassmorphism effects */}
          <motion.div 
            variants={itemVariants}
            className="relative mt-20 w-full max-w-6xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group relative overflow-hidden rounded-[2.5rem] bg-white p-2 shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="relative overflow-hidden rounded-[2rem] aspect-[4/3]">
                  <Image
                    src={heroImg1}
                    alt="Student receiving mentorship online"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    width={800}
                    height={600}
                    quality={90}
                    priority
                  />
                  <div className="absolute inset-0 bg-emerald-900/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-[2.5rem] bg-white p-2 shadow-2xl transition-all duration-500 hover:-translate-y-2 md:mt-12">
                <div className="relative overflow-hidden rounded-[2rem] aspect-[4/3]">
                  <Image
                    src={heroImg2}
                    alt="One-on-one tutoring session"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    width={800}
                    height={600}
                    quality={90}
                    priority
                  />
                  <div className="absolute inset-0 bg-teal-900/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            </div>
            
            {/* Added a floating badge */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-6 md:right-12 bg-white/80 backdrop-blur-xl border border-white p-4 rounded-3xl shadow-xl flex items-center gap-3"
            >
              <div className="bg-emerald-100 p-2 rounded-2xl text-emerald-600">
                <Zap className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800">95%</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Success Rate</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full pt-16">
            <UniversityPartner />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
