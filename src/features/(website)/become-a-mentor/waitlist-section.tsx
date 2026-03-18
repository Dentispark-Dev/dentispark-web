"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import Container from "@/src/components/layouts/container";

import waitlistImage from "@/public/images/waitlist.png";

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

export function WaitlistSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-slate-950">
      {/* Background Cinematic Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      
      <Container className="relative z-10">
        <motion.div 
          className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Image Section */}
          <motion.div
            variants={itemVariants}
            className="relative"
          >
            <div className="relative group/waitlist mx-auto flex items-center justify-center">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[3rem] blur opacity-20 group-hover/waitlist:opacity-40 transition-opacity duration-700" />
              <div className="relative size-[350px] md:size-[450px] overflow-hidden rounded-[3rem] border border-white/10 shadow-2xl transition-transform duration-1000 group-hover/waitlist:scale-[1.02]">
                <Image
                  src={waitlistImage}
                  alt="Your Mentees are waiting for you"
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover/waitlist:scale-110"
                  fill
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                
                {/* Floating Stat */}
                <div className="absolute top-10 right-10 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl">
                  <p className="font-sora text-white text-xs font-bold">1k+ Pending Applications</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Section */}
          <div className="space-y-10">
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-[0.3em] uppercase w-fit">
                Impact Tomorrow
              </div>
              <h2 className="font-sora text-5xl md:text-7xl font-extrabold text-white tracking-tighter leading-[1.1]">
                Your Mentees are <span className="text-emerald-400 font-extrabold italic">waiting</span> for you.
              </h2>
              <p className="font-sora text-slate-400 text-lg md:text-xl leading-relaxed">
                Step into a world of elite mentorship. Share your wisdom with driven individuals and shape the future of medicine.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link href="/mentor/onboarding" className="relative group/cta inline-block">
                <div className="absolute -inset-1 bg-emerald-500 rounded-2xl blur opacity-30 group-hover/cta:opacity-60 transition duration-500" />
                <Button 
                  size="lg" 
                  className="relative h-16 px-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-sora font-extrabold text-lg transition-all duration-300 shadow-xl shadow-emerald-500/20 hover:scale-[1.02]"
                >
                  Join the Waitlist
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
