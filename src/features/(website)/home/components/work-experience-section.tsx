import React from "react";
import { ArrowRight, CheckCircle2, FileText, Activity, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";

export function WorkExperienceSection() {
  return (
    <section className="bg-emerald-950 py-24 sm:py-32 relative overflow-hidden">
      {/* Abstract Background Vectors */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
        <div className="w-[800px] h-[800px] bg-emerald-900/40 rounded-full blur-3xl" />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-900 border border-emerald-700/50 rounded-full text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
              <MapPin className="w-3.5 h-3.5" />
              Omnipark Partnership • Rainham, Kent
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-jakarta font-extrabold text-white tracking-tight leading-[1.1]">
              Earn Your Place in a <span className="text-emerald-400">Real Dental Practice.</span>
            </h2>
            
            <p className="text-lg lg:text-xl text-emerald-100/80 font-medium leading-relaxed max-w-xl">
              Complete your DentiSpark readiness modules and unlock a guaranteed one-week work placement with our partner dental practice. 
            </p>

            <div className="space-y-5 pt-4">
              {[
                { icon: Activity, text: "Shadow real clinical procedures (Root Canals, Fillings)" },
                { icon: FileText, text: "Maintain a digital Shadowing Log in your dashboard" },
                { icon: CheckCircle2, text: "Generate authentic material for your UCAS personal statement" }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="p-2.5 bg-emerald-900/80 rounded-xl text-emerald-400 shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <p className="text-white font-medium self-center">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="pt-8">
              <Link href="/sign-up">
                <Button className="bg-white hover:bg-emerald-50 text-emerald-950 font-jakarta font-bold px-10 h-14 rounded-2xl text-base transition-all group flex items-center gap-3">
                  See how to qualify for your placement
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Clinical Image Container */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-emerald-300 rounded-[3rem] blur-2xl opacity-20" />
            <div className="relative bg-emerald-900/30 border border-emerald-800/50 p-4 rounded-[3rem] shadow-2xl overflow-hidden aspect-[4/3] group">
              <Image 
                src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1600&auto=format&fit=crop" 
                alt="Real Dental Placement Work Experience"
                fill
                className="object-cover rounded-[2.5rem] group-hover:scale-105 transition-transform duration-700"
              />
              {/* Overlay Badge */}
              <div className="absolute bottom-10 left-10 right-10 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-3xl">
                <p className="text-white font-bold text-sm">Theory-to-Theatre Bridge</p>
                <p className="text-emerald-100 text-xs mt-1">Convert textbook knowledge into physical clinical exposure.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
