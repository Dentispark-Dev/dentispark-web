"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Title } from "@/src/components/atoms/title";

import aboutHeroImage from "@/public/images/about-hero-img.png";
import AboutTop from "@/src/components/icons/AboutTop";
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
                Our Story
              </div>
              <h1 className="font-jakarta text-5xl md:text-7xl font-extrabold text-slate-950 tracking-tighter leading-[1.1]">
                Empowering <span className="text-emerald-600">Tomorrow&apos;s</span> Dentists.
              </h1>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <div className="absolute -left-6 top-0 bottom-0 w-1 bg-emerald-500 rounded-full opacity-50 transition-all duration-500 group-hover:h-full group-hover:opacity-100" />
              <p className="font-jakarta text-slate-500 text-lg md:text-xl leading-relaxed max-w-xl">
                We&apos;re on a mission to break down barriers to dental
                education by providing accessible guidance, mentorship and
                support for underprivileged students—one application at a time.
              </p>
            </motion.div>
          </div>

          {/* Image Section */}
          <motion.div
            variants={itemVariants}
            className="relative flex items-center justify-end"
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-emerald-500/10 blur-3xl rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative size-[350px] md:size-[500px] overflow-hidden rounded-[3rem] border-8 border-white shadow-2xl transition-transform duration-700 group-hover:scale-[1.02] group-hover:-rotate-1">
                <Image
                  src={aboutHeroImage}
                  alt="Dental students and professionals working together"
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  fill
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
              </div>

              {/* Decorative Icon */}
              <div className="absolute -top-10 -left-10 md:-top-16 md:-left-16 p-6 rounded-3xl bg-white shadow-2xl border border-slate-50 animate-bounce-subtle">
                <AboutTop className="size-20 md:size-28" />
              </div>
            </div>

            {/* Background Circle */}
            <div className="absolute -top-24 -right-24 -z-10 hidden size-[600px] rounded-full bg-emerald-50 md:block opacity-50" />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
