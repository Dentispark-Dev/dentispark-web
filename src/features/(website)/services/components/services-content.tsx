"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle, Search, Star, Clock, Filter, ArrowRight } from "lucide-react";
import AdBanner from "@/src/components/marketing/AdBanner";
import { motion, Variants } from "framer-motion";
import Container from "@/src/components/layouts/container";
import { Button } from "@/src/components/ui/button";

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

export function ServicesContent({ services }: { services: any[] }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/30">
      {/* Hero Section - Compact & Powerful */}
      <section className="relative pt-20 pb-12 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-transparent opacity-50" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <Container>
          <motion.div 
            className="relative z-10 text-center space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-block px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-0">
              Premium Marketplace
            </div>
            <h1 className="font-sora text-3xl md:text-5xl font-extrabold text-white tracking-tighter leading-[1.1]">
              Expert Help, <span className="text-emerald-400">On Demand.</span>
            </h1>
            <p className="font-sora text-slate-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
              Browse our curated marketplace of high-end services offered by top dental professionals and scholars. Get the elite support you deserve.
            </p>
            
            <div className="max-w-2xl mx-auto mt-6 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-500" />
              <div className="relative bg-white/10 backdrop-blur-2xl border border-white/10 p-2 rounded-full flex items-center shadow-2xl">
                <Search className="h-6 w-6 text-slate-400 ml-6" />
                <input 
                  type="text" 
                  placeholder="What service do you need help with?" 
                  className="w-full px-6 py-4 text-white placeholder-slate-500 outline-none bg-transparent font-sora text-lg"
                />
                <Button className="h-14 px-10 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-sora font-extrabold text-lg transition-all duration-300 shadow-xl shadow-emerald-500/20">
                  Search
                </Button>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-12 overflow-hidden">
        <Container>
          <motion.div 
            className="flex flex-col space-y-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-2 border-b border-slate-100 pb-6">
              <div className="space-y-4">
                <motion.div variants={itemVariants} className="px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold tracking-[0.2em] uppercase w-fit">
                  Curated Catalog
                </motion.div>
                <motion.h2 variants={itemVariants} className="font-sora text-2xl font-extrabold text-slate-900 md:text-3xl tracking-tight">
                  Featured <span className="text-emerald-600">Services.</span>
                </motion.h2>
              </div>
              
              <motion.div variants={itemVariants} className="flex gap-4">
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <select className="pl-12 pr-6 py-3 border border-slate-100 rounded-2xl bg-white shadow-sm outline-none font-sora text-sm font-bold text-slate-700 appearance-none hover:border-emerald-200 transition-colors">
                    <option>All Categories</option>
                    <option>Personal Statement</option>
                    <option>Interviews</option>
                    <option>Tutoring</option>
                  </select>
                </div>
              </motion.div>
            </div>
            
            <motion.div variants={itemVariants}>
              <AdBanner zone="IN_FEED_SPONSORED" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {services.map((service, index) => (
                <motion.div 
                  key={service.externalId} 
                  variants={itemVariants}
                  className="group relative flex flex-col rounded-[2.5rem] bg-white border border-slate-100 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.02)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(16,185,129,0.1)] hover:border-emerald-100"
                >
                  <div className="p-8 pb-4 flex-1 space-y-6">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
                        {service.serviceType}
                      </span>
                      <div className="flex items-center space-x-1 text-emerald-500 bg-emerald-50/50 px-3 py-1 rounded-full border border-emerald-100/50">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="font-sora font-extrabold text-xs">{service.mentorRating}</span>
                        <span className="text-[10px] text-slate-400 font-bold">({service.reviews})</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-sora text-2xl font-extrabold text-slate-900 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {service.title}
                      </h3>
                      <p className="font-sora text-slate-500 text-sm leading-relaxed line-clamp-3">
                        {service.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 pt-4">
                      <div className="size-10 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-sm">
                        <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
                          {service.mentorName.charAt(0)}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-sora text-xs font-extrabold text-slate-900">{service.mentorName}</span>
                        <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                           <Clock className="h-3 w-3 mr-1" /> {service.durationMinutes} min delivery
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8 pt-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30 group-hover:bg-emerald-50/30 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Starting at</span>
                      <span className="font-sora text-2xl font-extrabold text-slate-900">${service.price}</span>
                    </div>
                    <Link href={`/services/${service.slug}`} className="group/btn relative inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-sora font-extrabold text-sm rounded-2xl hover:bg-emerald-500 transition-all duration-300 shadow-lg shadow-slate-900/10 hover:shadow-emerald-500/20">
                      Book Now <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
