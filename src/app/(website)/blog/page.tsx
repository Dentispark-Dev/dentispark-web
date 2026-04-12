"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Search, TrendingUp, BookOpen, Star } from "lucide-react";
import Container from "@/src/components/layouts/container";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { BlogGrid } from "@/src/features/(website)/blog/components/blog-grid";

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#fcfcfd] pt-32 pb-24 font-inter">
      <Container>
        {/* Header / Hero */}
        <div className="max-w-5xl mx-auto space-y-16 mb-24">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 font-bold text-xs uppercase tracking-[0.2em] shadow-sm border border-emerald-100"
            >
              <Sparkles className="size-3.5 fill-emerald-600" /> Intellectual Leadership
            </motion.div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-jakarta font-extrabold text-slate-900 leading-[1] tracking-tight">
                Inside the <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-blue-500">Spark.</span>
              </h1>
              <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                Elite tactical insights, current student interviews, and the data-driven future of dental school admissions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
               <div className="relative w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="Search guides..." 
                    className="h-14 pl-12 rounded-2xl bg-white border-slate-100 focus:border-emerald-500 transition-all font-medium shadow-sm"
                  />
               </div>
               <Button className="h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-8 font-bold whitespace-nowrap active:scale-95 transition-all">
                  Browse All
               </Button>
            </div>
          </div>

          {/* Featured Post Card (Hero Style) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="group relative bg-white rounded-[3.5rem] border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/40 hover:border-emerald-200 transition-all duration-700"
          >
            <div className="flex flex-col lg:flex-row items-stretch">
                <div className="lg:w-1/2 relative min-h-[400px]">
                    <img 
                        src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2070&auto=format&fit=crop" 
                        alt="Featured Article" 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent lg:hidden" />
                </div>
                <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center space-y-8">
                    <div className="flex items-center gap-4">
                        <span className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase tracking-widest border border-emerald-100">
                            Editors Pick
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <TrendingUp className="size-3.5 text-blue-500" /> Trending Weekly
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-jakarta font-extrabold text-slate-900 leading-tight tracking-tight">
                        The 2026 Admissions Playbook: What&apos;s Changed?
                    </h2>
                    
                    <p className="text-lg text-slate-500 font-medium leading-relaxed">
                        From digital UCAT interfaces to evolving MMI ethics stations, we break down the critical shifts you need to navigate for the upcoming application cycle.
                    </p>

                    <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/20">
                                DS
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">DentiSpark Editorial</p>
                                <p className="text-xs font-medium text-slate-400">15 min read • Strategy</p>
                            </div>
                        </div>
                        <Button variant="ghost" className="size-14 rounded-2xl bg-slate-50 text-slate-900 hover:bg-emerald-600 hover:text-white transition-all">
                            <ArrowRight className="size-6" />
                        </Button>
                    </div>
                </div>
            </div>
          </motion.div>
        </div>

        {/* Section Title */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12 max-w-5xl mx-auto px-4">
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-extrabold text-emerald-600 uppercase tracking-[0.3em]">
                    <div className="w-8 h-[2px] bg-emerald-500" /> Tactical Intelligence
                </div>
                <h2 className="text-3xl md:text-4xl font-jakarta font-extrabold text-slate-900 tracking-tight">Recent Archives</h2>
            </div>
            
            <div className="flex gap-2">
                {["All", "Interviews", "UCAT", "Strategy"].map(tab => (
                    <button key={tab} className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-900 hover:bg-white transition-all border border-transparent hover:border-slate-100 first:bg-white first:text-slate-900 first:border-slate-100 first:shadow-sm">
                        {tab}
                    </button>
                ))}
            </div>
        </div>

        {/* Blog Grid Component */}
        <div className="max-w-5xl mx-auto">
            <BlogGrid />
        </div>

        {/* Subscribe Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto mt-32 bg-slate-900 rounded-[3.5rem] p-12 md:p-20 text-center relative overflow-hidden group shadow-2xl shadow-slate-900/40"
        >
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
             <div className="w-full h-full bg-emerald-500 rounded-full blur-[100px]" />
          </div>
          
          <div className="relative z-10 space-y-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-emerald-400 font-bold text-[10px] uppercase tracking-widest border border-white/5">
                <Star className="size-3.5 fill-emerald-500" /> Weekly Intelligence Report
              </div>
              
              <h2 className="text-4xl md:text-5xl font-jakarta font-extrabold text-white leading-tight">
                Don&apos;t miss a <span className="text-emerald-500">spark.</span>
              </h2>
              
              <p className="text-lg text-slate-400 font-medium max-w-xl mx-auto">
                Join 10k+ applicants receiving our weekly tactical newsletter with interview leaks and score analysis.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input 
                    placeholder="Enter your email" 
                    className="h-16 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10 transition-all font-medium text-lg px-8"
                  />
                  <Button className="h-16 bg-white hover:bg-slate-100 text-slate-950 px-10 rounded-2xl font-bold text-lg shadow-2xl active:scale-[0.98] transition-all">
                    Subscribe
                  </Button>
              </div>
          </div>
        </motion.div>
      </Container>
    </main>
  );
}
