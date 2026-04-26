"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import FooterPattern from "@/src/components/icons/FooterPattern";
import Container from "@/src/components/layouts/container";
import { motion, Variants } from "framer-motion";

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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function JoinSection() {
  return (
    <section className="bg-slate-900 relative overflow-hidden py-32 md:py-48 group">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-50" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
      
      {/* SVG Pattern */}
      <FooterPattern className="pointer-events-none absolute inset-0 h-full w-full opacity-10 transition-opacity duration-700 group-hover:opacity-15" />

      <Container>
        <motion.div 
          className="relative z-10 flex flex-col items-center space-y-12 text-center text-white"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2 
            variants={itemVariants}
            className="font-jakarta text-4xl font-extrabold leading-tight md:text-7xl md:leading-[1.1] tracking-tighter max-w-4xl"
          >
            Join <span className="text-emerald-400">5,000+</span> students who started their journey <span className="relative inline-block">this month<div className="absolute -bottom-2 left-0 w-full h-1 bg-emerald-500/30 rounded-full" /></span>
          </motion.h2>

          <motion.div variants={itemVariants} className="pt-6">
            <Link href="/sign-up" className="relative group/btn inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-3xl blur opacity-30 group-hover/btn:opacity-60 transition duration-500" />
              <Button 
                size="lg" 
                className="relative h-16 md:h-20 px-8 md:px-16 rounded-[2rem] bg-emerald-500 hover:bg-emerald-600 text-lg md:text-2xl font-extrabold transition-all duration-300 shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95"
              >
                Start Your Journey for Free
              </Button>
            </Link>
          </motion.div>
          
          <motion.p variants={itemVariants} className="font-jakarta text-slate-400 text-sm font-bold uppercase tracking-[0.3em] pt-4">
            No credit card required • Join in 60 seconds
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}
