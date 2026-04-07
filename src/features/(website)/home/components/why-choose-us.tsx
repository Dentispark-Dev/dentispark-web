"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, ShieldCheck } from "lucide-react";
import Container from "@/src/components/layouts/container";

import whyUsImage1 from "@/public/images/why-us-1.png";
import whyUsImage2 from "@/public/images/why-us-2.png";
import whyUsImage3 from "@/public/images/why-us-3.png";
import whyUsImage4 from "@/public/images/why-us-4.png";

const features = [
  {
    title: "Free Guides & Checklists",
    description:
      "Access expertly crafted guides and checklists designed to help you stay organized, informed, and confident every step of the way — and yes, they're absolutely free.",
    imageSrc: whyUsImage1,
    imageAlt: "Person studying a guide",
  },
  {
    title: "AI-Driven Tools",
    description: "Smart Features to Help You Work Faster and Smarter",
    imageSrc: whyUsImage2,
    imageAlt: "AI robot on a screen",
  },
  {
    title: "Contextual Admission Engine",
    description: "Our proprietary tool calculates your real percentage-chance based on POLAR4 Widening Participation data and regional context—not just grades.",
    imageSrc: whyUsImage3,
    imageAlt: "Contextual Admission Calculator",
  },
  {
    title: "Guaranteed Clinical Placement",
    description: "Secure a structured, one-week observation placement at our partner practices upon completing your 'Theory-to-Theatre' readiness gate.",
    imageSrc: whyUsImage4,
    imageAlt: "Clinical placement in Rainham",
  },
];

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

export default function WhyChooseUs() {
  return (
    <section className="bg-slate-50/50 py-24 md:py-32 overflow-hidden">
      <Container>
        <motion.div 
          className="flex flex-col space-y-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="flex flex-col items-center space-y-6 text-center">
            <motion.div variants={itemVariants} className="px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold tracking-[0.2em] uppercase">
              The Advantage
            </motion.div>
            <motion.h2 variants={itemVariants} className="font-jakarta text-4xl font-extrabold text-slate-900 md:text-6xl tracking-tight">
              Why Choose <span className="text-emerald-600">DentiSpark?</span>
            </motion.h2>
            <motion.p variants={itemVariants} className="font-jakarta text-slate-500 max-w-2xl text-lg md:text-xl leading-relaxed">
              We provide the elite infrastructure and support needed to dominate the competitive landscape of dental admissions.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {features.map((f, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="group relative flex flex-col overflow-hidden rounded-[3rem] bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(16,185,129,0.1)] hover:border-emerald-200"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={f.imageSrc}
                    alt={f.imageAlt}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-emerald-900/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="flex flex-col space-y-5 p-12">
                  <h3 className="font-jakarta text-2xl font-extrabold text-slate-900 leading-tight">
                    {f.title}
                  </h3>
                  <p className="font-jakarta text-slate-500 text-lg leading-relaxed">
                    {f.description}
                  </p>
                  <div className="pt-4 flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    Learn more 
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center pt-10">
            <Link 
              href="/sign-up"
              className="group h-16 px-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-jakarta font-extrabold text-lg flex items-center gap-3 transition-all duration-300 shadow-xl shadow-emerald-600/20 hover:-translate-y-1"
            >
              Join DentiSpark for free and take your first step toward dental school
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
