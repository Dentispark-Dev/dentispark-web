"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight, Star, ShieldCheck } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";

import mentor1 from "@/public/images/mentor-1.png";
import mentor2 from "@/public/images/mentor-2.png";

import UKFlag from "@/src/components/icons/UkFlag";
import Stanford from "@/src/components/icons/Standford";
import Container from "@/src/components/layouts/container";

type Mentor = {
  name: string;
  title: string;
  flag: React.ReactElement;
  avatar: StaticImageData;
  institutions: { name: string; role: string; logo: string }[];
  highlight?: string;
};

const mentors = [
  {
    slug: "dr-sarah-chen",
    name: "Dr. Sarah Chen",
    title: "General Dentist, King's College London",
    flag: <UKFlag className="size-5" />,
    avatar: mentor1,
    institutions: [
      {
        name: "King's College London",
        role: "NHS Consultant",
        logo: "/images/logos/stanford.png",
      },
      {
        name: "UCAT Specialist",
        role: "Lead Mentor",
        logo: "/images/logos/stanford.png",
      },
    ],
    highlight: "Helped 50+ students get accepted",
  },
  {
    slug: "dt-marcus-thorne",
    name: "Dt. Marcus Thorne",
    title: "Orthodontist, Univ of Pennsylvania",
    flag: <UKFlag className="size-5" />,
    avatar: mentor2,
    institutions: [
      {
        name: "University of Pennsylvania",
        role: "Elite Orthodontics",
        logo: "/images/logos/stanford.png",
      },
      {
        name: "Application Expert",
        role: "12+ Years Experience",
        logo: "/images/logos/stanford.png",
      },
    ],
  },
  {
    slug: "dr-elena-rostova",
    name: "Dr. Elena Rostova",
    title: "Oral Surgeon, Harvard School",
    flag: <UKFlag className="size-5" />,
    avatar: mentor2,
    institutions: [
      {
        name: "Harvard School of Dental Medicine",
        role: "Chief of Surgery",
        logo: "/images/logos/stanford.png",
      },
      {
        name: "Admissions Committee",
        role: "Expert Advisor",
        logo: "/images/logos/stanford.png",
      },
    ],
  },
  {
    slug: "dt-james-wilson",
    name: "Dt. James Wilson",
    title: "Pediatric Dentist, UCSF",
    flag: <UKFlag className="size-5" />,
    avatar: mentor2,
    institutions: [
      {
        name: "UCSF Dental School",
        role: "Pediatric Specialist",
        logo: "/images/logos/stanford.png",
      },
      {
        name: "Soft Skills Mentor",
        role: "Community Impact Expert",
        logo: "/images/logos/stanford.png",
      },
    ],
  },
];

import { motion, useScroll, useTransform, useSpring, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function MeetOurMentors() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <Container>
        <motion.div 
          className="flex flex-col space-y-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-emerald-50 pb-8">
            <div className="space-y-2">
              <motion.div variants={itemVariants} className="text-emerald-600 text-[10px] font-bold tracking-[0.2em] uppercase">
                Expert Guidance
              </motion.div>
              <motion.h2 variants={itemVariants} className="font-jakarta text-3xl font-extrabold text-slate-900 md:text-5xl tracking-tight">
                Meet our <span className="text-emerald-600">Mentors</span>
              </motion.h2>
            </div>
            <motion.div variants={itemVariants}>
              <Link
                href="/mentor"
                className="group font-jakarta inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold transition-all duration-300 hover:bg-emerald-500 hover:text-white"
              >
                See all Mentors <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          {/* Carousel */}
          <motion.div variants={itemVariants} className="relative">
            <Carousel className="overflow-visible" opts={{ align: "start", loop: true }}>
              <CarouselContent className="-ml-6">
                {mentors.map((m) => (
                  <CarouselItem
                    key={m.name}
                    className="pl-6 basis-[90%] md:basis-[50%] lg:basis-[33.333%]"
                  >
                    <div className="group h-full bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-[0_20px_40px_rgba(0,0,0,0.02)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(16,185,129,0.12)] hover:border-emerald-100 flex flex-col">
                      <div className="flex items-start justify-between mb-8">
                        <div className="relative">
                          <div className="absolute -inset-1 bg-emerald-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="relative size-20 overflow-hidden rounded-2xl border-2 border-white shadow-lg">
                            <Image
                              src={m.avatar}
                              alt={m.name}
                              width={120}
                              height={120}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          </div>
                          <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
                            {m.flag}
                          </div>
                        </div>
                        {m.highlight && (
                          <div className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-emerald-100">
                            {m.highlight.includes("50+") ? "Expert" : "Top Rated"}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 mb-6">
                        <h3 className="font-jakarta text-xl font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          {m.name}
                        </h3>
                        <p className="font-jakarta text-slate-500 text-sm leading-relaxed">
                          {m.title}
                        </p>
                      </div>

                      <div className="space-y-3 flex-1">
                        {m.institutions.slice(0, 2).map((inst, i) => (
                          <div
                            key={i}
                            className="flex items-center space-x-3 rounded-2xl bg-slate-50/50 p-3 transition-colors group-hover:bg-emerald-50/30"
                          >
                            <div className="size-8 flex-shrink-0 bg-white rounded-lg p-1.5 shadow-sm">
                              <Stanford className="h-full w-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-jakarta text-[11px] font-bold text-slate-900 truncate uppercase tracking-tight">{inst.name}</p>
                              <p className="font-jakarta text-[10px] text-slate-400 font-medium truncate">
                                {inst.role}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Trust Signal */}
                      <div className="mt-6 px-4 py-2 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center gap-2">
                         <ShieldCheck className="size-3 text-emerald-500" />
                         <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Verified by DentiSpark Team</span>
                      </div>

                      {/* CTA & Rating Row */}
                      <div className="mt-6 pt-6 border-t border-slate-50 space-y-4">
                        <div className="flex items-center justify-between">
                           <Link 
                             href="/sign-up"
                             className="h-10 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-[0.1em] flex items-center gap-2 transition-all"
                           >
                              Book Free Intro
                              <ArrowRight size={12} />
                           </Link>
                           <div className="flex flex-col items-end">
                              <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-md">
                                 <Star size={10} fill="#10B981" className="text-emerald-500" />
                                 <span className="text-[10px] font-extrabold text-emerald-700">4.8 / 5.0</span>
                              </div>
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-1">(43 reviewed)</span>
                           </div>
                        </div>
                        <Link 
                          href={`/mentor/${m.slug}`}
                          className="font-jakarta text-[10px] font-bold text-slate-400 hover:text-emerald-600 transition-colors uppercase tracking-[0.2em] flex items-center justify-center gap-1.5 w-full"
                        >
                          View Full Profile
                        </Link>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <div className="mt-12 flex items-center justify-center gap-6">
                <CarouselPrevious className="static translate-y-0 rounded-2xl border-slate-100 hover:bg-emerald-50 hover:text-emerald-600 transition-all" />
                <div className="h-px w-24 bg-slate-100 relative overflow-hidden">
                  <motion.div 
                    animate={{ x: [-100, 100] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400 to-transparent w-full"
                  />
                </div>
                <CarouselNext className="static translate-y-0 rounded-2xl border-slate-100 hover:bg-emerald-50 hover:text-emerald-600 transition-all" />
              </div>
            </Carousel>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
