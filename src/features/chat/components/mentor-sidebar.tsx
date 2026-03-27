"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MoreHorizontal, User, Plus, Filter, CheckCheck } from "lucide-react";
import { cn } from "@/src/lib/utils";

const MOCK_MENTORS = [
  { id: "1", name: "Dr. Sarah Chen", role: "Orthodontist", status: "online", lastMsg: "Focus on communication...", time: "14:32", unread: 0, isRead: true },
  { id: "2", name: "Dr. James Wilson", role: "General Dentist", status: "offline", lastMsg: "See you at the mock interview", time: "13:45", unread: 2, isRead: false },
  { id: "3", name: "Dr. Priya Patel", role: "Oral Surgeon", status: "online", lastMsg: "Great progress on the PS!", time: "Yesterday", unread: 0, isRead: true },
];

export function MentorSidebar() {
  return (
    <div className="w-full h-full flex flex-col bg-white border-r border-gray-100 font-sora">
      {/* Refined Sidebar Header - Streamlined */}
      <div className="p-4 space-y-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search mentors or chats..." 
            className="w-full h-10 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:bg-white transition-all placeholder:text-gray-400 text-gray-700"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {["All", "Unread", "Mentors"].map((label, i) => (
                <button 
                  key={label}
                  className={cn(
                    "px-4 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all",
                    i === 0 ? "bg-emerald-600 text-white shadow-sm shadow-emerald-200" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                  )}
                >
                    {label}
                </button>
            ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto bg-white">
        {MOCK_MENTORS.map((mentor) => (
          <div 
            key={mentor.id}
            className={cn(
                "flex items-center gap-4 px-4 py-3 transition-all cursor-pointer group relative hover:bg-[#f5f6f6]",
                mentor.id === "1" ? "bg-[#f0f2f5]" : ""
            )}
          >
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400 overflow-hidden border border-gray-100">
                {mentor.name.split(" ").map(n => n[0]).join("")}
              </div>
              {mentor.status === "online" && (
                <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
              )}
            </div>
            
            <div className="flex-1 min-w-0 border-b border-gray-50 pb-3 group-last:border-none">
              <div className="flex justify-between items-start mb-0.5">
                <Link href="/mentor/sarah-chen" className="hover:text-emerald-600 transition-colors">
                  <p className="text-base font-medium text-gray-900 truncate tracking-tight hover:text-inherit">{mentor.name}</p>
                </Link>
                <span className={cn(
                    "text-[11px] font-medium mt-1",
                    mentor.unread > 0 ? "text-emerald-500" : "text-gray-400"
                )}>
                    {mentor.time}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 min-w-0">
                  {mentor.isRead && (
                    <CheckCheck className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  )}
                  <p className="text-[13px] text-gray-500 truncate font-normal leading-tight">
                    {mentor.lastMsg}
                  </p>
                </div>
                {mentor.unread > 0 && (
                  <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
                    {mentor.unread}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
