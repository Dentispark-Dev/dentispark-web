// components/HowItWorks.tsx
"use client";

import Link from "next/link";
import Container from "@/src/components/layouts/container";
import { ArrowRight } from "lucide-react";

import DiscoverYourPath from "@/public/icons/discover-your-path.svg";
import AccessFreeTools from "@/public/icons/access-free-tool.svg";
import ConnectWithScholars from "@/public/icons/connect-with-mentors.svg";
import TrackYourJourney from "@/public/icons/track-your-journey.svg";
import { cn } from "@/src/lib/utils";
import Image, { StaticImageData } from "next/image";

type Card = {
  step: number;
  title: string;
  titleColor: string;
  description: string;
  icon: StaticImageData;
  bgColor: string;
  hasLink?: boolean;
};

const cards: Card[] = [
  {
    step: 1,
    title: "Discover Your Path",
    titleColor: "text-success-600",
    description:
      "Take the quiz to find your category (BDS, Dental Nursing, Dental Hygiene/Therapy).",
    icon: DiscoverYourPath,
    bgColor: "bg-success-200",
  },
  {
    step: 2,
    title: "Access Free Tools",
    titleColor: "text-warning-600",
    description: "Use guides, checklists, and university data.",
    icon: AccessFreeTools,
    bgColor: "bg-warning-200",
  },
  {
    step: 3,
    title: "Connect with Mentors",
    titleColor: "text-secondary-600",
    description: "Meet Black dental professionals.",
    icon: ConnectWithScholars,
    bgColor: "bg-secondary-200",
  },
  {
    step: 4,
    title: "Track Your Journey",
    titleColor: "text-primary",
    description: "Follow year-specific milestones.",
    icon: TrackYourJourney,
    bgColor: "bg-primary-200",
    hasLink: true,
  },
];

import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function HowItWorks() {
  return (
    <section className="bg-white py-24 md:py-32 overflow-hidden">
      <Container>
        <motion.div 
          className="flex flex-col space-y-24 md:space-y-40"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="flex flex-col items-center space-y-6 text-center">
            <motion.div variants={itemVariants} className="px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold tracking-[0.2em] uppercase">
              The Protocol
            </motion.div>
            <motion.h2 variants={itemVariants} className="font-sora text-4xl font-extrabold text-slate-900 md:text-6xl tracking-tight">
              Simple. Supportive. <span className="text-emerald-600">Powerful.</span>
            </motion.h2>
          </div>

          <div className="flex flex-col space-y-32">
            {cards.map(({ step, bgColor, icon: Icon, title, titleColor, description, hasLink }, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={cn(
                  "flex flex-col items-center justify-between gap-16 md:flex-row",
                  index % 2 !== 0 && "md:flex-row-reverse"
                )}
              >
                {/* Image/Icon Side */}
                <div className="relative flex-1 w-full max-w-[500px] group">
                  <div className={cn(
                    "absolute -inset-4 rounded-[3rem] blur-3xl opacity-20 -z-10 transition-opacity duration-500 group-hover:opacity-40",
                    bgColor.replace('bg-', 'bg-').replace('-200', '-400')
                  )} />
                  <div className={cn(
                    bgColor,
                    "flex aspect-square w-full items-center justify-center rounded-[3.5rem] p-16 shadow-[0_20px_50px_rgba(0,0,0,0.02)] transition-all duration-700 group-hover:scale-[1.02] group-hover:rotate-1"
                  )}>
                    <Image
                      src={Icon}
                      alt={title}
                      width={400}
                      height={400}
                      className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-2"
                    />
                  </div>
                  <div className="absolute -top-6 -right-6 md:-top-10 md:-right-10 size-20 md:size-28 rounded-full bg-white shadow-2xl flex items-center justify-center border-4 border-slate-50">
                    <span className={cn("font-sora text-3xl md:text-5xl font-extrabold", titleColor)}>
                      {step}
                    </span>
                  </div>
                </div>

                {/* Text Side */}
                <div className="flex flex-1 flex-col space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className={cn("h-1 w-12 rounded-full", titleColor.replace('text-', 'bg-'))} />
                      <span className={cn(titleColor, "font-sora text-xs font-bold uppercase tracking-[0.2em]")}>
                        Phase {step}
                      </span>
                    </div>
                    <h3 className="font-sora text-3xl font-extrabold text-slate-900 md:text-5xl tracking-tight leading-tight">
                      {title}
                    </h3>
                    <p className="font-sora text-slate-500 max-w-lg text-lg md:text-xl leading-relaxed">
                      {description}
                    </p>
                  </div>
                  {hasLink && (
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href="/sign-up"
                        className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-3xl bg-emerald-500 text-white font-sora font-extrabold text-lg transition-all duration-300 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40"
                      >
                        Start Your Journey 
                        <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
