"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Container from "@/src/components/layouts/container";

import becomeAmenrorImage from "@/public/images/become-a-mentor.png";

const createBounceVariants = () => ({
  rest: { x: 0 },
  hover: {
    x: 5,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 12,
      repeat: 1,
      repeatType: "reverse" as const,
    },
  },
});

const bounceX = createBounceVariants();

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

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-24 md:pt-48 md:pb-32">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <Container className="relative z-10">
        <motion.div 
          className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Content Section */}
          <div className="space-y-10 group">
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold tracking-[0.3em] uppercase w-fit">
                Legacy Building
              </div>
              <h1 className="font-jakarta text-5xl md:text-7xl font-extrabold text-slate-950 tracking-tighter leading-[1.1]">
                Utilise your skills to <span className="text-emerald-600">assist</span> those in need.
              </h1>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <div className="absolute -left-6 top-0 bottom-0 w-1 bg-emerald-500 rounded-full opacity-50 transition-all duration-500 group-hover:h-full group-hover:opacity-100" />
              <p className="font-jakarta text-slate-500 text-lg md:text-xl leading-relaxed max-w-xl">
                Mentoring provides the chance to earn extra income whilst
                nurturing enduring relationships with the leaders of tomorrow. Join an elite circle of educators.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4">
              <Link href="/mentor/onboarding" className="relative group/btn inline-block">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-2xl blur opacity-30 group-hover/btn:opacity-60 transition duration-500" />
                <Button 
                  size="lg" 
                  className="relative h-16 px-10 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-jakarta font-extrabold text-lg transition-all duration-300 shadow-xl shadow-emerald-500/20 hover:scale-[1.02]"
                >
                  Become a Mentor <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Image Section */}
          <motion.div
            variants={itemVariants}
            className="relative flex items-center justify-end"
          >
            <div className="relative group/img">
              <div className="absolute -inset-4 bg-emerald-500/10 blur-3xl rounded-[3rem] opacity-0 group-hover/img:opacity-100 transition-opacity duration-700" />
              <div className="relative size-[350px] md:size-[550px] overflow-hidden rounded-[3rem] border-8 border-white shadow-2xl transition-transform duration-1000 group-hover/img:scale-[1.02]">
                <Image
                  src={becomeAmenrorImage}
                  alt="Become a Mentor"
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover/img:scale-110"
                  fill
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent opacity-60" />
                
                {/* Float Badge */}
                <div className="absolute bottom-10 left-10 right-10 p-6 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/20 shadow-2xl transform translate-y-4 opacity-0 group-hover/img:translate-y-0 group-hover/img:opacity-100 transition-all duration-700 delay-100">
                  <p className="font-jakarta text-white text-sm font-bold text-center">Join 500+ Elite Mentor Members</p>
                </div>
              </div>
            </div>

            {/* Background Circle */}
            <div className="absolute -top-24 -right-24 -z-10 hidden size-[600px] rounded-full bg-emerald-50 md:block opacity-30" />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
