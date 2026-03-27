"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  BookOpen, 
  FileText, 
  Stamp, 
  Zap, 
  Send, 
  AlertCircle, 
  MessageSquare, 
  Trophy, 
  CheckCircle2, 
  Home,
  ArrowRight,
  ExternalLink,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";

interface Mission {
  id: number;
  title: string;
  timeframe: string;
  description: string;
  tip: string;
  icon: React.ReactNode;
  color: string;
  actionLabel: string;
  actionHref: string;
  status: "locked" | "available" | "completed";
}

const MISSIONS: Mission[] = [
  {
    id: 1,
    title: "Research Schools & Open Days",
    timeframe: "Jan - Mar",
    description: "Identify your top 5 dental schools and plan your open day visits.",
    tip: "Start early! Universities look for students who have researched their specific clinical teaching styles.",
    icon: <Search className="w-5 h-5" />,
    color: "emerald",
    actionLabel: "Explore Schools",
    actionHref: "/university-hub",
    status: "available"
  },
  {
    id: 2,
    title: "UCAT/DAT Registration",
    timeframe: "Apr - May",
    description: "Book your entrance exam slot. High-demand centers fill up fast.",
    tip: "Testing slots fill quickly. Secure your preferred date and location as soon as booking opens.",
    icon: <Calendar className="w-5 h-5" />,
    color: "blue",
    actionLabel: "UCAT Guide",
    actionHref: "/guidance-hub",
    status: "available"
  },
  {
    id: 3,
    title: "Draft Personal Statement",
    timeframe: "Apr - May",
    description: "Start drafting. Focus on your work experience and 'Why Dentistry'.",
    tip: "Use the AI Reviewer to ensure your tone is professional and reflects the core dental competencies.",
    icon: <FileText className="w-5 h-5" />,
    color: "amber",
    actionLabel: "Start Drafting",
    actionHref: "/ai-hub/personal-statement",
    status: "available"
  },
  {
    id: 4,
    title: "Secure References",
    timeframe: "Apr - May",
    description: "Contact your tutors or employers for academic and clinical references.",
    tip: "Ask early! Teachers are swamped with reference requests in September.",
    icon: <ShieldCheck className="w-5 h-5" />,
    color: "indigo",
    actionLabel: "Reference Tips",
    actionHref: "/guidance-hub",
    status: "available"
  },
  {
    id: 5,
    title: "Sit Entrance Exams",
    timeframe: "Jun - Jul",
    description: "The big day. Sit your UCAT/BMAT/DAT and get your results.",
    tip: "Email schools if you are unsure about your score's impact on your application.",
    icon: <Zap className="w-5 h-5" />,
    color: "orange",
    actionLabel: "90-Day Plan",
    actionHref: "/ai-hub/study-planner",
    status: "available"
  },
  {
    id: 6,
    title: "Finalise UCAS Detail",
    timeframe: "Aug",
    description: "Review your requirements and finalize your 4 + 1 choices.",
    tip: "Final check! Ensure your personal statement is perfectly aligned with university expectations.",
    icon: <AlertCircle className="w-5 h-5" />,
    color: "rose",
    actionLabel: "Final Review",
    actionHref: "/ai-hub/personal-statement",
    status: "available"
  },
  {
    id: 7,
    title: "Submit UCAS Application",
    timeframe: "Sept",
    description: "The point of no return. Submit your application early for peace of mind.",
    tip: "Double-check everything. Once submitted, changes are difficult to make.",
    icon: <Send className="w-5 h-5" />,
    color: "teal",
    actionLabel: "UCAS Track",
    actionHref: "https://www.ucas.com/",
    status: "available"
  },
  {
    id: 8,
    title: "UCAS Deadline (Oct 15)",
    timeframe: "Oct 15",
    description: "The absolute cutoff for Dental and Medical school applications.",
    tip: "Don't leave it late! Server traffic spikes on deadline day.",
    icon: <Clock className="w-5 h-5" />,
    color: "red",
    actionLabel: "Check Status",
    actionHref: "/applications",
    status: "available"
  },
  {
    id: 9,
    title: "Interview Season",
    timeframe: "Oct - Nov",
    description: "Prepare for MMIs and Panels. This is where you prove you're ready.",
    tip: "Watch your inbox! Interview invites can arrive with very short notice.",
    icon: <MessageSquare className="w-5 h-5" />,
    color: "purple",
    actionLabel: "Prep Now",
    actionHref: "/ai-hub/interview-prep",
    status: "available"
  },
  {
    id: 10,
    title: "Interviews & Offers",
    timeframe: "Jan - Mar (2027)",
    description: "Attending interviews and receiving conditional/unconditional offers.",
    tip: "Offers may be conditional on your final grades. Keep the momentum going!",
    icon: <Sparkles className="w-5 h-5" />,
    color: "cyan",
    actionLabel: "Book Mentor",
    actionHref: "/mentorship",
    status: "available"
  },
  {
    id: 11,
    title: "Confirm Offer & Enrollment",
    timeframe: "May - Sept",
    description: "Meeting your grades, selecting your 'Firm' choice, and starting school.",
    tip: "Revisit the school before making your final decision on UCAS Track.",
    icon: <Trophy className="w-5 h-5" />,
    color: "emerald",
    actionLabel: "Success Hub",
    actionHref: "/guidance-hub",
    status: "available"
  }
];

export function MissionControl() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">("upcoming");

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-1 block">Your Master Roadmap</span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mission Control</h2>
          <p className="text-sm text-slate-500 font-medium">Follow every step of the 2026/27 admission cycle.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
            <button 
                onClick={() => setActiveTab("upcoming")}
                className={cn("px-6 py-2 rounded-xl text-xs font-black transition-all", activeTab === "upcoming" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600")}
            >
                Path to Enrollment
            </button>
            <button 
                onClick={() => setActiveTab("completed")}
                className={cn("px-6 py-2 rounded-xl text-xs font-black transition-all", activeTab === "completed" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600")}
            >
                Archive
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MISSIONS.map((mission, idx) => (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className="group relative bg-white rounded-[2.5rem] border border-slate-100 p-8 hover:shadow-2xl hover:shadow-slate-200/50 hover:border-emerald-100 transition-all duration-500 flex flex-col h-full"
          >
            {/* Header: Icon & Timeframe */}
            <div className="flex items-center justify-between mb-8">
                <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500",
                    `bg-${mission.color}-500 text-white shadow-lg shadow-${mission.color}-500/20`
                )}>
                    {mission.icon}
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Step {mission.id}</span>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] font-black text-slate-600">{mission.timeframe}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-3 mb-8 flex-1">
                <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors uppercase tracking-tight">{mission.title}</h3>
                <p className="text-sm text-slate-500 font-bold leading-relaxed">{mission.description}</p>
            </div>

            {/* Tip Overlay (Hover only on large screens, or visible) */}
            <div className="mb-8 p-4 rounded-2xl bg-slate-50 border border-slate-100 relative group-hover:bg-white transition-colors duration-500">
                <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-3 h-3 text-emerald-500" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Key Tip</span>
                </div>
                <p className="text-[11px] font-bold text-slate-600 leading-tight italic">"{mission.tip}"</p>
            </div>

            {/* Action Button */}
            <Button 
                variant="outline" 
                className="w-full h-12 rounded-xl border-slate-200 text-slate-700 font-black text-xs hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition-all gap-2 group/btn" 
                asChild
            >
                <Link href={mission.actionHref} target={mission.actionHref.startsWith('http') ? '_blank' : '_self'}>
                    {mission.actionLabel}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                </Link>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
