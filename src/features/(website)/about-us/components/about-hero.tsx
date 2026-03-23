"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import Container from "@/src/components/layouts/container";

export function AboutHero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-[#FDFCF8]">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[80%] h-[60%] bg-radial-gradient from-[#1DB97417] to-transparent" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-radial-gradient from-[#1DB9740D] to-transparent" />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side: Text Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDFBF4] border border-[#C8F0DC] text-[10px] font-bold uppercase tracking-widest text-[#0F9B5E]">
                A UK Initiative · 2026
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-bricolage text-5xl md:text-7xl font-extrabold text-[#1A1714] leading-[1.05] tracking-tight"
            >
              Understanding <br />
              <span className="text-[#1DB974] relative inline-block">
                Unseen Journeys
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                  <path d="M0 6C20 6 30 2 50 2C70 2 80 6 100 6" stroke="#1DB974" strokeWidth="4" fill="none" strokeDasharray="6 4" strokeLinecap="round" />
                </svg>
              </span> <br />
              in Dental Admissions
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-jakarta text-lg text-[#7A7267] max-w-lg leading-relaxed"
            >
              Partnering with advisors, students, families, and NHS practices to address the real barriers underrepresented aspirants face across all three dental pathways.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              {["BDS", "Dental Hygiene / Therapy", "Dental Nursing"].map((path) => (
                <span key={path} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E8E3D8] text-xs font-bold text-[#1A1714] shadow-sm hover:shadow-md transition-shadow">
                  <div className="size-2 rounded-full bg-[#1DB974]" />
                  {path}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="#advisors"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#1DB974] text-white font-jakarta font-bold text-base shadow-lg shadow-[#1DB97459] hover:bg-[#0F9B5E] hover:-translate-y-1 transition-all"
              >
                Share Your Insights <ArrowRight className="size-5" />
              </Link>
              <Link
                href="#students"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white border-2 border-[#E8E3D8] text-[#1A1714] font-jakarta font-bold text-base hover:border-[#1DB974] hover:text-[#1DB974] hover:-translate-y-1 transition-all"
              >
                Explore Pathways <ArrowDown className="size-5" />
              </Link>
            </motion.div>
          </div>

          {/* Right Side: Animated Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:flex flex-col gap-4"
          >
            {[
              { emoji: "🎓", label: "For Schools", title: "Supporting Guidance & Pastoral Teams", color: "ic-green", href: "#advisors" },
              { emoji: "🦷", label: "For Aspirants", title: "Realistic Pathways to BDS, Therapy & Nursing", color: "ic-amber", href: "#students" },
              { emoji: "🏡", label: "For Families", title: "Holding Ambition & Realism Together", color: "ic-cream", href: "#parents" },
              { emoji: "🏥", label: "For NHS Practices", title: "Structured, Fair Access Placements", color: "ic-forest", href: "#practices" },
            ].map((card, i) => (
              <Link
                key={i}
                href={card.href}
                className="group flex items-center gap-6 p-6 rounded-[2rem] bg-white border border-[#E8E3D8] shadow-sm hover:translate-x-3 hover:shadow-lg hover:border-[#1DB97433] transition-all duration-300"
              >
                <div className="size-14 rounded-2xl bg-[#EDFBF4] flex items-center justify-center text-2xl group-hover:bg-[#1DB974] group-hover:text-white transition-colors">
                  {card.emoji}
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#7A7267] mb-0.5">{card.label}</p>
                  <p className="font-bricolage text-base font-bold text-[#1A1714]">{card.title}</p>
                </div>
                <div className="size-8 rounded-full bg-[#F5F2EB] flex items-center justify-center text-[#7A7267] opacity-0 group-hover:opacity-100 group-hover:bg-[#1DB974] group-hover:text-white transition-all">
                  <ArrowRight className="size-4" />
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
