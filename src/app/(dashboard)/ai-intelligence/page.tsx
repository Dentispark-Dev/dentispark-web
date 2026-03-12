"use client";

import React from "react";
import WelcomeSection from "@/src/features/(dashboard)/overview/components/welcome-section";
import { SentimentVisualizer } from "@/src/features/ai-assistant/components/sentiment-visualizer";
import { motion } from "framer-motion";
import { MessageSquare, Video, FileText, ArrowRight } from "lucide-react";

export default function AIAnalyticsPage() {
  return (
    <div className="space-y-10 pb-12">
      <WelcomeSection userName="Future Dentist" userYear="AI Insights Active" />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-10">
          <SentimentVisualizer />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuickAction 
              title="Mock Interview" 
              desc="Start 15-min practice" 
              icon={<Video className="w-5 h-5" />} 
              color="bg-primary-600" 
            />
            <QuickAction 
              title="PS Reviewer" 
              desc="Get AI feedback" 
              icon={<FileText className="w-5 h-5" />} 
              color="bg-black-900" 
            />
          </div>
        </div>

        <div className="xl:col-span-1 space-y-6">
            <div className="glass-card bg-white p-6 rounded-[2rem] border-primary-100 shadow-xl">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-black-400 mb-4">Recent Sessions</h4>
                <div className="space-y-4">
                    <SessionItem title="General Interview Prep" date="2 hours ago" score={88} />
                    <SessionItem title="Manual Dexterity Talk" date="Yesterday" score={72} />
                    <SessionItem title="Ethics Scenarios" date="3 days ago" score={95} />
                </div>
            </div>

            <div className="glass-card bg-gradient-to-br from-primary-600 to-primary-700 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="font-black italic uppercase text-lg tracking-tight mb-2">Mentor Access</h3>
                    <p className="text-white/70 text-xs mb-6 font-medium">Connect with current dental students for 1:1 strategy calls.</p>
                    <button className="w-full h-12 bg-white text-primary-600 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white-50 transition-all flex items-center justify-center gap-2">
                        Browse Mentors
                        <ArrowRight className="w-3 h-3" />
                    </button>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ title, desc, icon, color }: any) {
    return (
        <button className="glass-card bg-white p-6 rounded-3xl border-greys-100 shadow-lg hover:shadow-xl hover:translate-y-[-4px] transition-all flex items-center gap-4 text-left">
            <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white`}>
                {icon}
            </div>
            <div>
                <h4 className="font-black text-black-900 text-sm uppercase tracking-tight">{title}</h4>
                <p className="text-black-400 text-xs">{desc}</p>
            </div>
        </button>
    )
}

function SessionItem({ title, date, score }: any) {
    return (
        <div className="flex items-center justify-between p-3 hover:bg-greys-50 rounded-xl transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
                    <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                    <h5 className="font-bold text-black-900 text-[11px] leading-none mb-1">{title}</h5>
                    <p className="text-[10px] text-black-400 font-medium">{date}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-[11px] font-black text-black-900 leading-none">{score}%</p>
                <p className="text-[9px] text-emerald-600 font-black uppercase tracking-tighter">Pass</p>
            </div>
        </div>
    )
}
