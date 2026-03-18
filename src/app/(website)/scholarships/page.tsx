export const metadata = {
  title: "Scholarships | DentiSpark",
  description: "Browse the largest database of dental and medical scholarships, grants, and financial aid.",
};

"use client";

import { ScholarshipGrid } from "@/src/features/(website)/scholarships/components/scholarship-grid";
import AdBanner from "@/src/components/marketing/AdBanner";
import { motion, Variants } from "framer-motion";
import Container from "@/src/components/layouts/container";

export default function ScholarshipsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section - Cinematic Upgrade */}
      <section className="relative pt-40 pb-32 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-transparent opacity-50" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <Container>
          <motion.div 
            className="relative z-10 text-center space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-4">
              Financial Empowerment
            </div>
            <h1 className="font-sora text-5xl md:text-8xl font-extrabold text-white tracking-tighter leading-[1.1]">
              Funding Your <span className="text-emerald-400">Future.</span>
            </h1>
            <p className="font-sora text-slate-400 text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Discover millions in available scholarships specifically curated for aspiring healthcare professionals. Your journey to excellence starts here.
            </p>
          </motion.div>
        </Container>
      </section>

      <div className="max-w-7xl mx-auto px-4 w-full mt-12 mb-8">
          <AdBanner zone="HEADER_BANNER" />
      </div>

      <ScholarshipGrid />
    </div>
  );
}
