"use client";

import { motion } from "framer-motion";
import Container from "@/src/components/layouts/container";
import Submit from "@/src/components/icons/Submit";
import Receive from "@/src/components/icons/Receive";
import Start from "@/src/components/icons/Start";
import Grow from "@/src/components/icons/Grow";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/src/components/ui/carousel";
import { cn } from "@/src/lib/utils";

const features = [
  {
    id: 1,
    icon: Submit,
    title: "Submit",
    description:
      "Create your coaching profile and share your areas of expertise with us.",
    bgColor: "bg-primary-100",
  },
  {
    id: 2,
    icon: Receive,
    title: "Receive authorization",
    description:
      "Our dedicated team evaluates your profile to connect you with the most suitable mentors at Dentispark.",
    bgColor: "bg-[#EAEEFF]",
  },
  {
    id: 3,
    icon: Start,
    title: "Start mentoring",
    description:
      "We'll assess your details and provide you with the go-ahead to begin mentoring!",
    bgColor: "bg-[#FDF0E6]",
  },
  {
    id: 4,
    icon: Grow,
    title: "Grow your enterprise",
    description:
      "Generate income, enhance your reputation, and mentor the future leaders of tomorrow.",
    bgColor: "bg-[#FBEAEA]",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

import { Variants } from "framer-motion";

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

export function FeaturesSection() {
  return (
    <section className="bg-slate-50/30 py-24 md:py-32 overflow-hidden">
      <Container>
        <motion.div 
          className="flex flex-col space-y-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Header */}
          <div className="flex flex-col items-center space-y-6 text-center">
            <motion.div variants={itemVariants} className="px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold tracking-[0.2em] uppercase">
              The Process
            </motion.div>
            <motion.h2 variants={itemVariants} className="font-sora text-4xl font-extrabold text-slate-900 md:text-6xl tracking-tight">
              How it <span className="text-emerald-600">Works.</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  variants={itemVariants}
                  className="group relative flex flex-col items-center text-center p-10 rounded-[3rem] bg-white border border-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.02)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(16,185,129,0.1)] hover:border-emerald-100"
                >
                  <div className="absolute top-6 right-8 text-4xl font-extrabold text-slate-50 group-hover:text-emerald-50 transition-colors duration-500 font-sora pointer-events-none">
                    0{index + 1}
                  </div>
                  
                  {/* Icon Container */}
                  <div className="mb-10 relative">
                    <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative size-20 flex items-center justify-center rounded-[2rem] bg-slate-50 border border-slate-100 text-slate-400 transition-all duration-500 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 group-hover:scale-110 group-hover:rotate-6">
                      <IconComponent className="size-8" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="font-sora text-xl font-extrabold text-slate-900 transition-colors group-hover:text-emerald-600">
                      {feature.title}
                    </h3>
                    <p className="font-sora text-slate-500 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
