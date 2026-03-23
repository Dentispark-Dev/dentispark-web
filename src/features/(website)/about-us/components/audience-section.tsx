"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ChevronDown } from "lucide-react";
import Container from "@/src/components/layouts/container";
import { Button } from "@/src/components/ui/button";

interface AudienceSectionProps {
  id: string;
  eyebrow: string;
  title: string;
  lead: string;
  quote: string;
  cite: string;
  badge: string;
  visual: React.ReactNode;
  flip?: boolean;
  bg?: string;
  isDark?: boolean;
  formType: "advisors" | "students" | "parents" | "practices";
  pathwayPills?: string[];
}

export function AudienceSection({
  id,
  eyebrow,
  title,
  lead,
  quote,
  cite,
  badge,
  visual,
  flip = false,
  bg = "bg-[#FDFFCF8]",
  isDark = false,
  formType,
  pathwayPills,
}: AudienceSectionProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <section id={id} className={`py-24 ${bg} overflow-hidden`}>
      <Container>
        <div className={`grid grid-cols-1 lg:grid-cols-2 rounded-[3.5rem] overflow-hidden border border-[#E8E3D8] shadow-2xl ${flip ? "lg:flex-row-reverse" : ""}`}>
          {/* Visual Side */}
          <div className={`relative min-h-[520px] bg-[#EDFBF4] ${flip ? 'lg:order-last' : ''}`}>
            {visual}
            <span className={`absolute bottom-6 left-6 px-4 py-1.5 rounded-full bg-white text-[11px] font-bold text-[#0F9B5E] shadow-xl ${flip ? 'lg:left-auto lg:right-6' : ''}`}>
              {badge}
            </span>
            {pathwayPills && (
              <div className={`absolute top-6 right-6 flex flex-col gap-2 items-end ${flip ? 'lg:right-auto lg:left-6 lg:items-start' : ''}`}>
                {pathwayPills.map((pill) => (
                  <span key={pill} className="bg-[#1DB974] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-[#1DB97440]">
                    {pill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Content Side */}
          <div className={`p-10 md:p-16 flex flex-col justify-center ${isDark ? 'bg-[#144D37] text-white' : 'bg-white text-[#1A1714]'}`}>
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 w-fit
              ${isDark ? 'bg-[#1DB9742E] border-[#1DB97440] text-[#7DE8B8]' : 'bg-[#EDFBF4] border-[#C8F0DC] text-[#0F9B5E] border'}
            `}>
              {eyebrow}
            </span>

            <h2 className="font-bricolage text-3xl md:text-4xl font-extrabold mb-6 leading-tight">
              {title}
            </h2>

            <p className={`font-jakarta text-base mb-8 leading-relaxed ${isDark ? 'text-white/60' : 'text-[#3D3832]'}`}>
              {lead}
            </p>

            <div className={`pl-5 border-l-3 border-[#1DB974] mb-8 py-2 ${isDark ? 'bg-[#1DB9741A]' : 'bg-[#EDFBF4]'} rounded-r-2xl`}>
              <p className={`font-bricolage text-[15px] italic font-medium leading-relaxed ${isDark ? 'text-white/90' : 'text-[#1A1714]'}`}>
                &ldquo;{quote}&rdquo;
              </p>
              <cite className={`block not-italic text-[10px] font-bold mt-2 uppercase tracking-wide ${isDark ? 'text-white/40' : 'text-[#7A7267]'}`}>
                — {cite}
              </cite>
            </div>

            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className={`group flex items-center gap-3 w-fit px-8 py-4 rounded-full font-jakarta font-bold text-sm shadow-xl transition-all
                ${isDark ? 'bg-[#1DB974] text-white hover:bg-[#0F9B5E]' : 'bg-[#1DB974] text-white hover:bg-[#0F9B5E]'}
              `}
            >
              {formType === "advisors" && "Download Guide & Share Insights"}
              {formType === "students" && "Get Guidance & Join the Group"}
              {formType === "parents" && "Share Your Perspective"}
              {formType === "practices" && "Register Placement Interest"}
              <ChevronDown className={`size-4 transition-transform duration-300 ${isFormOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isFormOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className={`mt-6 p-8 rounded-3xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-[#FDFCF8] border-[#E8E3D8]'}`}>
                    <AboutForm type={formType} isDark={isDark} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}

function AboutForm({ type, isDark }: { type: string, isDark: boolean }) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="text-center py-4">
        <p className={`font-jakarta text-sm font-bold ${isDark ? 'text-[#7DE8B8]' : 'text-[#1DB974]'}`}>
          Thank you — we&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-white/60' : 'text-[#3D3832]'}`}>Full Name</label>
          <input type="text" className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-all ${isDark ? 'bg-white/10 border-white/10 text-white focus:border-[#1DB974]' : 'bg-white border-[#E8E3D8] text-[#1A1714] focus:border-[#1DB974]'}`} placeholder="Your name" required />
        </div>
        <div className="space-y-1.5">
          <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-white/60' : 'text-[#3D3832]'}`}>
            {type === "advisors" ? "Role" : type === "students" ? "Year Group" : type === "parents" ? "Relation" : "Role"}
          </label>
          <select className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-all ${isDark ? 'bg-white/10 border-white/10 text-white focus:border-[#1DB974]' : 'bg-white border-[#E8E3D8] text-[#1A1714] focus:border-[#1DB974]'}`} required>
            <option value="">Select...</option>
            {type === "advisors" && <><option>Career Advisor</option><option>Pastoral Lead</option></>}
            {type === "students" && <><option>Year 11</option><option>Year 12</option><option>Year 13</option></>}
            {type === "parents" && <><option>Parent</option><option>Guardian</option></>}
            {type === "practices" && <><option>Practice Manager</option><option>Lead Dentist</option></>}
          </select>
        </div>
      </div>
      <div className="space-y-1.5">
        <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-white/60' : 'text-[#3D3832]'}`}>Email</label>
        <input type="email" className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-all ${isDark ? 'bg-white/10 border-white/10 text-white focus:border-[#1DB974]' : 'bg-white border-[#E8E3D8] text-[#1A1714] focus:border-[#1DB974]'}`} placeholder="you@example.com" required />
      </div>
      <div className="space-y-1.5">
        <label className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-white/60' : 'text-[#3D3832]'}`}>
          {type === "advisors" ? "Your challenge" : type === "students" ? "One barrier" : type === "parents" ? "Pressure or concern" : "Placement capacity"}
        </label>
        <textarea className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-all min-h-[100px] ${isDark ? 'bg-white/10 border-white/10 text-white focus:border-[#1DB974]' : 'bg-white border-[#E8E3D8] text-[#1A1714] focus:border-[#1DB974]'}`} placeholder="..." required />
      </div>
      <button type="submit" className="w-full py-3 rounded-full bg-[#1DB974] text-white font-jakarta font-bold text-sm hover:bg-[#0F9B5E] shadow-lg shadow-[#1DB97440] transition-all">
        Submit
      </button>
      <p className={`text-[10px] leading-relaxed text-center ${isDark ? 'text-white/40' : 'text-[#7A7267]'}`}>
        ✦ You&apos;ll be added to our group for ongoing dialogue and early input on tools built around your insights.
      </p>
    </form>
  );
}
