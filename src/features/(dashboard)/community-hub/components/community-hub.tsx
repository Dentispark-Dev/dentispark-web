"use client";

import { motion } from "framer-motion";
import { PostsSection } from "./posts-section";
import { SuccessStories } from "./success-stories";
import { mockPosts, mockSuccessStories } from "../constants";
import { Users, MessageSquare, TrendingUp, Zap } from "lucide-react";

export function CommunityHub() {
  const stats = [
    { label: "Active Members", value: "2,480", icon: <Users className="w-4 h-4" />, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Daily Posts", value: "142", icon: <MessageSquare className="w-4 h-4" />, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Expert Responses", value: "98%", icon: <Zap className="w-4 h-4" />, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Growth", value: "+12%", icon: <TrendingUp className="w-4 h-4" />, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-20">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full w-fit text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
            <Users className="w-3 h-3" />
            Global Network
          </div>
          <h1 className="text-4xl lg:text-5xl font-sora font-bold tracking-tight text-gray-900 text-left">
            Community Hub
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl font-medium text-left">
            Connect with fellow dental students, share insights, and get advice from experts in the DentiSpark network.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2 min-w-[140px]">
              <div className={`${stat.bg} ${stat.color} w-8 h-8 rounded-lg flex items-center justify-center`}>
                {stat.icon}
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sora">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Feed Section */}
          <div className="lg:col-span-2 space-y-8">
            <PostsSection posts={mockPosts} />
          </div>

          {/* Sidebar Section */}
          <div className="space-y-8">
             <SuccessStories stories={mockSuccessStories} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
