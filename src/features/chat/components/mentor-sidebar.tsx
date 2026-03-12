"use client";

import React from "react";
import Image from "next/image";
import { Search, MoreHorizontal, Circle } from "lucide-react";
import { cn } from "@/src/lib/utils";

const MOCK_MENTORS = [
  { id: "1", name: "Dr. Sarah Chen", role: "Orthodontist", status: "online", lastMsg: "Focus on communication...", time: "2m" },
  { id: "2", name: "Dr. James Wilson", role: "General Dentist", status: "offline", lastMsg: "See you at the mock interview", time: "1h" },
  { id: "3", name: "Dr. Priya Patel", role: "Oral Surgeon", status: "online", lastMsg: "Great progress on the PS!", time: "4h" },
];

export function MentorSidebar() {
  return (
    <div className="w-full h-full flex flex-col bg-white border-r border-greys-100">
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-black-900 tracking-tight">Messages</h2>
          <button className="p-2 hover:bg-greys-100 rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5 text-black-400" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black-300" />
          <input 
            type="text" 
            placeholder="Search mentors..." 
            className="w-full h-12 pl-11 pr-4 bg-greys-50 border border-greys-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all font-medium"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-2">
        {MOCK_MENTORS.map((mentor) => (
          <div 
            key={mentor.id}
            className={cn(
                "flex items-center gap-4 p-4 rounded-[2rem] transition-all cursor-pointer group",
                mentor.id === "1" ? "bg-primary-50" : "hover:bg-greys-50"
            )}
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-greys-200 flex items-center justify-center font-black text-black-400">
                {mentor.name.split(" ").map(n => n[0]).join("")}
              </div>
              {mentor.status === "online" && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-white rounded-full" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <p className="text-sm font-black text-black-900 truncate">{mentor.name}</p>
                <span className="text-[10px] font-black text-black-300 uppercase">{mentor.time}</span>
              </div>
              <p className="text-xs text-black-400 font-medium truncate">{mentor.lastMsg}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
