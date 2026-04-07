"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { Lock, ChevronRight } from "lucide-react";
import Container from "@/src/components/layouts/container";

import ucatImage from "@/public/images/ucat.png";
import bookletImage from "@/public/images/booklet.png";
import { cn } from "@/src/lib/utils";

const freeResources = [
  {
    id: "ucat-guide",
    title: "DentiSpark UCAT Prep Guide",
    description: "Master the UCAT with DentiSpark's proprietary strategic roadmap.",
    ctaText: "Unlock This Resource — It's Free",
    image: ucatImage,
    imageAlt: "UCAT Prep Guide",
    backgroundColor: "bg-green-50",
    href: "/sign-up",
    locked: true,
  },
  {
    id: "dental-booklet",
    title: "Dental Schools Council Yearbook",
    description: "Your official, curated guide to UK Dental education requirements.",
    ctaText: "Unlock This Resource — It's Free",
    image: bookletImage,
    imageAlt: "Dental Schools Council 2025 Booklet",
    backgroundColor: "bg-secondary-50",
    href: "/sign-up",
    locked: true,
  },
];

const additionalResources = [
  {
    id: "ps-template",
    title: "Personal Statement Template",
    description: "DentiSpark-specific template reflective of actual UK dental school requirements.",
    ctaText: "Unlock This Resource — It's Free",
    backgroundColor: "bg-[#FDF0E6]",
    href: "/sign-up",
    locked: true,
    icon: (
      <svg width="200" height="200" viewBox="0 0 100 100" fill="none">
        <rect
          x="20"
          y="15"
          width="50"
          height="65"
          rx="3"
          fill="#FFF4E6"
          stroke="#FB923C"
          strokeWidth="2"
        />
        <rect x="25" y="25" width="15" height="2" fill="#FB923C" />
        <rect x="25" y="30" width="25" height="2" fill="#FB923C" />
        <rect x="25" y="35" width="20" height="2" fill="#FB923C" />
        <rect x="45" y="15" width="25" height="40" rx="3" fill="#FB923C" />
        <rect x="50" y="20" width="15" height="2" fill="white" />
        <rect x="50" y="25" width="10" height="2" fill="white" />
      </svg>
    ),
  },
  {
    id: "financial-guide",
    title: "Financial Support Guide",
    description: "Strategic funding options for your dental academic journey.",
    ctaText: "Unlock This Resource — It's Free",
    backgroundColor: "bg-[#F8F8F8]",
    href: "/sign-up",
    locked: true,
    icon: (
      <svg width="200" height="200" viewBox="0 0 100 100" fill="none">
        <circle
          cx="50"
          cy="40"
          r="15"
          fill="#DBEAFE"
          stroke="#3B82F6"
          strokeWidth="2"
        />
        <text
          x="50"
          y="45"
          textAnchor="middle"
          fill="#3B82F6"
          fontSize="12"
          fontWeight="bold"
        >
          £
        </text>
        <rect x="35" y="60" width="8" height="8" fill="#F59E0B" />
        <rect x="45" y="60" width="8" height="8" fill="#F59E0B" />
        <rect x="55" y="60" width="8" height="8" fill="#F59E0B" />
        <circle cx="25" cy="30" r="8" fill="#10B981" />
        <circle cx="75" cy="35" r="6" fill="#EF4444" />
      </svg>
    ),
  },
  {
    id: "nursing-guide",
    title: "Dental Nursing Apprenticeship Guide",
    description: "Step-by-Step roadmap to becoming a qualified Dental Nurse.",
    ctaText: "Unlock This Resource — It's Free",
    backgroundColor: "bg-error-50",
    href: "/sign-up",
    locked: true,
    icon: (
      <svg width="200" height="200" viewBox="0 0 100 100" fill="none">
        <rect
          x="30"
          y="20"
          width="40"
          height="55"
          rx="4"
          fill="#FEF2F2"
          stroke="#EF4444"
          strokeWidth="2"
        />
        <rect x="35" y="30" width="30" height="3" fill="#EF4444" />
        <rect x="35" y="37" width="25" height="2" fill="#EF4444" />
        <rect x="35" y="42" width="20" height="2" fill="#EF4444" />
        <rect x="35" y="47" width="28" height="2" fill="#EF4444" />
        <rect x="45" y="15" width="10" height="8" fill="#EF4444" />
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

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

export function FreeTools() {
  return (
    <section className="bg-white py-24 md:py-32 overflow-hidden">
      <Container>
        <motion.div 
          className="flex flex-col space-y-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="flex flex-col items-center space-y-6 text-center">
            <motion.div variants={cardVariants} className="px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold tracking-[0.2em] uppercase">
              Resource Hub
            </motion.div>
            <motion.h2 variants={cardVariants} className="font-jakarta max-w-4xl text-4xl font-extrabold text-slate-900 md:text-6xl tracking-tight">
              Begin your Dental journey with <span className="text-emerald-600">free resources</span>
            </motion.h2>
            <motion.p variants={cardVariants} className="font-jakarta text-slate-500 max-w-3xl text-lg md:text-xl leading-relaxed">
              Access curated guides, university datasets, and AI-driven checklists tailored to your specific application goals.
            </motion.p>
          </div>

          {/* Resources Grid - Primary Cards */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {freeResources.map((resource) => (
              <motion.div key={resource.id} variants={cardVariants}>
                <Link
                  href={resource.href}
                  className="group relative flex h-full overflow-hidden rounded-[3rem] bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(16,185,129,0.1)] hover:border-emerald-200"
                >
                  <div className="flex flex-1 flex-col justify-center p-10 md:p-14">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                         <h3 className="font-jakarta text-3xl font-extrabold text-slate-900 leading-tight">
                            {resource.title}
                         </h3>
                         {resource.locked && <LockIcon />}
                      </div>
                      <p className="font-jakarta text-slate-500 text-lg leading-relaxed">
                        {resource.description}
                      </p>
                      <div className="flex items-center gap-3 font-bold text-emerald-600 group-hover:text-emerald-500 transition-colors">
                        <span className="text-sm uppercase tracking-widest">{resource.ctaText}</span>
                        <div className="p-2 rounded-full bg-emerald-50 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          >
                            <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={cn("hidden w-2/5 items-center justify-center p-10 md:flex relative", resource.backgroundColor)}>
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
                    <Image
                      src={resource.image}
                      alt={resource.imageAlt}
                      width={250}
                      height={250}
                      className="relative z-10 object-contain transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Additional Resources - Secondary Cards */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {additionalResources.map((resource) => (
              <motion.div key={resource.id} variants={cardVariants}>
                <Link
                  href={resource.href}
                  className="group flex flex-col h-full overflow-hidden rounded-[3rem] bg-white border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(16,185,129,0.08)] hover:border-emerald-200"
                >
                  <div className={cn("flex aspect-[1.2] items-center justify-center p-12 relative overflow-hidden", resource.backgroundColor)}>
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
                    <div className="relative z-10 transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 drop-shadow-xl">
                      {resource.icon}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-5 p-10">
                    <div className="flex items-center gap-3">
                      <h3 className="font-jakarta text-2xl font-extrabold text-slate-900 leading-tight">
                        {resource.title}
                      </h3>
                      {resource.locked && <LockIcon size={18} />}
                    </div>
                    <p className="font-jakarta text-slate-500 leading-relaxed text-sm">
                      {resource.description}
                    </p>
                    <div className="flex items-center gap-2 font-bold text-emerald-600 pt-2">
                      <span className="text-xs uppercase tracking-widest">{resource.ctaText}</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="group-hover:translate-x-1 transition-transform">
                        <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Single CTA Bottom */}
          <div className="flex justify-center pt-8">
            <Link 
              href="/sign-up"
              className="group h-16 px-10 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-jakarta font-extrabold text-lg flex items-center gap-3 shadow-xl shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1"
            >
              Create your free account to access all guides
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

function LockIcon({ size = 24 }: { size?: number }) {
  return (
    <div className="p-2 rounded-xl bg-slate-100 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
      <Lock size={size} />
    </div>
  );
}
