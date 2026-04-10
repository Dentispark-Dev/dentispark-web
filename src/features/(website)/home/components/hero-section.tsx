// components/Hero.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";
import { motion, TargetAndTransition, Variants } from "framer-motion";

import Container from "@/src/components/layouts/container";
import heroImg1 from "@/public/images/hero-1.png";
import heroImg2 from "@/public/images/hero-2.png";
import UniversityPartner from "./university-partner";

const createBounceVariants = (axis: "x" | "y"): Variants => ({
  rest: { [axis]: 0 },
  hover: {
    [axis]: axis === "y" ? 5 : 5,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 12,
      repeat: 1,
      repeatType: "reverse",
    },
  } as TargetAndTransition,
});

const bounceY = createBounceVariants("y");
const bounceX = createBounceVariants("x");

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20">
      <div
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="from-primary to-primary h-[1000px] w-[1000px] bg-gradient-to-r opacity-10 mix-blend-plus-darker blur-3xl filter" />
      </div>

      {/* Dotted square pattern */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              #E5E7EB,
              #E5E7EB .5px,
              transparent .5px,
              transparent 200px
            ),
            repeating-linear-gradient(
              90deg,
              #E5E7EB,
              #E5E7EB .5px,
              transparent .5px,
              transparent 200px
            )
          `,
          backgroundSize: "200px 200px",
        }}
      />

      <Container className="relative z-10 flex flex-col items-center space-y-8 text-center">
        <h1 className="h1 max-w-5xl">
          Empowering
          <span className="relative inline-block px-2">
            <span className="border-emerald-500 bg-emerald-50 pointer-events-none absolute inset-0 -rotate-[1.5deg] transform rounded-full border-2 border-dotted" />
            <span className="text-emerald-600 relative inline-block px-5 py-2 italic font-extrabold">
              underprivileged
            </span>
          </span>{" "}
          students for dental school success
        </h1>
        <p className="text-slate-500 text-lg md:text-xl font-bold max-w-2xl leading-relaxed">
          Free expert mentorship, elite clinical guidance, and AI-driven outcomes for 
          the next generation of dental professionals.
        </p>

        <div className="z-40 flex flex-col gap-6 sm:flex-row mt-6">
          <Link href="/sign-up" className="cursor-pointer">
            <motion.div
              initial="rest"
              whileHover="hover"
              animate="rest"
              className="bg-slate-900 font-jakarta hover:bg-slate-800 inline-flex w-full cursor-pointer items-center justify-center gap-4 rounded-2xl px-10 py-5 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-2xl transition"
            >
              <span>Get Started Free</span>
              <motion.span variants={bounceX} className="flex">
                <ArrowRight size={20} />
              </motion.span>
            </motion.div>
          </Link>

          <Link href="/resources" className="cursor-pointer">
            <motion.div
              initial="rest"
              whileHover="hover"
              animate="rest"
              className="bg-white border-2 border-slate-100 font-jakarta text-slate-900 inline-flex cursor-pointer items-center justify-center gap-4 rounded-2xl px-10 py-5 text-sm font-bold uppercase tracking-[0.2em] transition hover:bg-slate-50 shadow-sm"
            >
              <span>Explore Tools</span>
              <motion.span variants={bounceY} className="flex">
                <ArrowDown size={20} />
              </motion.span>
            </motion.div>
          </Link>
        </div>

        {/* Hero images grid */}
        <div className="mt-16 w-full max-w-6xl grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="overflow-hidden rounded-4xl shadow-2xl border border-slate-100 bg-slate-50 aspect-video md:aspect-[4/3] relative">
            <Image
              src={heroImg1}
              alt="Student receiving mentorship online"
              className="object-cover transition-transform duration-700 hover:scale-105"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              placeholder="blur"
            />
          </div>
          <div className="overflow-hidden rounded-4xl shadow-2xl border border-slate-100 bg-slate-50 aspect-video md:aspect-[4/3] relative">
            <Image
              src={heroImg2}
              alt="One-on-one tutoring session"
              className="object-cover transition-transform duration-700 hover:scale-105"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              placeholder="blur"
            />
          </div>
        </div>

        <UniversityPartner />
      </Container>
    </section>
  );
}
