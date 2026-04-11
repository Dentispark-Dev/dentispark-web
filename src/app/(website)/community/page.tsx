"use client";

import { motion } from "framer-motion";
import { Users, Shield, MessageSquare, Sparkles, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";

export default function CommunityComingSoon() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-4xl w-full text-center space-y-12">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-600 font-bold text-xs uppercase tracking-widest shadow-sm border border-blue-100"
        >
          <Users className="size-4" /> Power in Numbers
        </motion.div>

        <div className="space-y-6">
          <h1 className="text-4xl md:text-7xl font-jakarta font-extrabold text-slate-900 tracking-tight leading-[1.05]">
             The DentiSpark <span className="text-emerald-500 underline decoration-emerald-200 decoration-8 underline-offset-8">Circle.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            We're building a safe, elite space for dental students to mentor each other, share interview tips, and form study cohorts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { icon: <MessageSquare className="text-emerald-600" />, title: "Peer Support", desc: "Connect with classmates across the UK." },
             { icon: <Shield className="text-blue-600" />, title: "Vetted Access", desc: "Only verified dental applicants & mentors." },
             { icon: <Heart className="text-rose-600" />, title: "Collaborate", desc: "Joint PS reviews and MMI mock stations." }
           ].map((feature, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 * i + 0.3 }}
               className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
             >
                <div className="size-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   {feature.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
             </motion.div>
           ))}
        </div>

        <div className="pt-12 space-y-6">
           <p className="text-sm font-extrabold text-slate-400 uppercase tracking-[0.2em]">Launching Summer 2026</p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild className="h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-10 font-bold text-lg shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all">
                <Link href="/contact-us">Early Access Inquiry</Link>
              </Button>
              <Button variant="ghost" asChild className="h-14 rounded-2xl px-8 font-bold text-slate-500">
                <Link href="/">Back to Home</Link>
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
