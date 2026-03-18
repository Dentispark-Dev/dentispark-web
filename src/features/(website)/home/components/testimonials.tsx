"use client";

import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import Container from "@/src/components/layouts/container";

import testimonial1 from "@/public/images/testimonial-1.png";
import testimonial2 from "@/public/images/testimonial-2.png";
import testimonial3 from "@/public/images/testimonial-3.png";

import testimonial from "@/public/images/testimonial-image.png";
import mTestimonial from "@/public/images/testimonial-image-m.png";

import LondonLogo from "@/src/components/icons/London";
import storyImg from "@/public/images/story.png";
import bigReadiousBg from "@/public/icons/big-radius-bg.svg";
import smRadiousBg from "@/public/icons/sm-radius-bg.svg";
import quoteBg from "@/public/icons/quote.svg";
import { Title } from "@/src/components/atoms/title";
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

export function Testimonials() {
  return (
    <section className="bg-slate-50/30 py-24 md:py-32 overflow-hidden">
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
              Success Stories
            </motion.div>
            <motion.h2 variants={itemVariants} className="font-sora text-4xl font-extrabold text-slate-900 md:text-6xl tracking-tight">
              Real Stories. <span className="text-emerald-600">Real Impact.</span>
            </motion.h2>
          </div>

          {/* Hero testimonial - Cinematic Upgrade */}
          <motion.div variants={itemVariants} className="group relative w-full max-w-6xl overflow-hidden rounded-[3rem] bg-slate-950 shadow-2xl">
            <div className="relative aspect-video w-full md:aspect-[21/9]">
              <Image
                src={testimonial}
                alt="Aisha Mubarak"
                fill
                className="object-cover opacity-50 transition-transform duration-1000 group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
            </div>

            <div className="absolute inset-0 flex flex-col justify-center p-10 md:p-20">
              <div className="max-w-2xl space-y-8">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <LondonLogo className="h-16 w-16 text-white/90" />
                </motion.div>
                <blockquote className="font-sora text-2xl leading-tight font-extrabold text-white md:text-4xl">
                  &ldquo;Dentispark&apos;s free guides helped me ace my UCAT and secure my place at a world-class university.&rdquo;
                </blockquote>
                <div className="flex items-center gap-5">
                  <div className="size-16 rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/20">
                    <Image src={storyImg} alt="Aisha" className="object-cover h-full w-full" />
                  </div>
                  <div className="flex flex-col">
                    <cite className="not-italic text-2xl font-extrabold text-emerald-400 font-sora">Aisha Mubarak</cite>
                    <span className="text-lg text-slate-400 font-medium font-sora">King&apos;s College London</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Testimonial Grid - Premium Glassmorphism Cards */}
          <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-3">
            {[
              {
                name: "Temi Sims",
                role: "Prospective Dental Nursing",
                quote: "DentiSpark's free UCAT guide helped me score 2700! The resources are incredibly detailed and refined.",
                img: testimonial1,
              },
              {
                name: "Jamal Johnson",
                role: "BDS - Dental Hygienist",
                quote: "Mentorship from a fellow Black hygienist kept me motivated throughout the entire application process.",
                img: testimonial2,
              },
              {
                name: "Aisha Emma",
                role: "Apprentice Dental Nursing",
                quote: "The free apprenticeship guides got me started when I didn't know where else to turn for guidance.",
                img: testimonial3,
              }
            ].map((t, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                className="group flex flex-col justify-between rounded-[2.5rem] bg-white border border-slate-100 p-10 shadow-[0_20px_40px_rgba(0,0,0,0.02)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(16,185,129,0.1)] hover:border-emerald-100"
              >
                <div className="space-y-8">
                  <div className="relative size-12">
                    <Image src={quoteBg} alt="Quotes" fill className="opacity-10 dark:invert transition-opacity group-hover:opacity-20" />
                  </div>
                  <p className="font-sora text-slate-600 text-lg leading-relaxed font-medium italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="mt-12 flex items-center gap-5 pt-8 border-t border-slate-50">
                  <div className="relative h-14 w-14 overflow-hidden rounded-2xl ring-2 ring-emerald-50 group-hover:ring-emerald-200 transition-all duration-500 shadow-md">
                    <Image src={t.img} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-sora font-extrabold text-slate-900 leading-none mb-1">{t.name}</h4>
                    <p className="font-sora text-xs text-slate-400 font-bold uppercase tracking-wider">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Featured Story - High-Impact CTA */}
          <motion.div 
            variants={itemVariants}
            className="group relative flex w-full max-w-6xl flex-col items-center gap-12 overflow-hidden rounded-[4rem] bg-slate-900 p-10 md:flex-row md:p-20 shadow-2xl"
          >
            <div className="absolute inset-0 bg-emerald-500/5 mix-blend-overlay" />
            <div className="relative z-10 flex-shrink-0">
              <div className="relative size-64 overflow-hidden rounded-[3rem] border-4 border-white/5 shadow-2xl transition-transform duration-700 group-hover:scale-105 md:size-80">
                <Image src={storyImg} alt="Success Story" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-40" />
              </div>
            </div>
            
            <div className="relative z-10 flex-1 space-y-10 text-center md:text-left">
              <h3 className="font-sora text-4xl font-extrabold text-white md:text-6xl md:leading-tight tracking-tight">
                How Aisha Got into <span className="text-emerald-400">King&apos;s College.</span>
              </h3>
              <Button size="lg" className="h-16 px-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-lg font-extrabold transition-all duration-300 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95">
                Read the Success Story
              </Button>
            </div>

            {/* Premium Decorations */}
            <div className="absolute top-0 right-0 h-full w-full opacity-5 pointer-events-none">
              <Image src={bigReadiousBg} alt="" fill className="object-cover" />
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
