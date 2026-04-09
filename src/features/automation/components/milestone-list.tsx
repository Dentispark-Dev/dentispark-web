"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, ChevronRight, Bell } from "lucide-react";
import { useDeadlineManager, Deadline } from "@/src/features/automation/hooks/use-deadline-manager";

export function MilestoneList() {
  const { deadlines } = useDeadlineManager();

  return (
    <div className="glass-card p-8 rounded-[2.5rem] border-greys-100 bg-white space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
            <h4 className="text-lg font-extrabold text-black-900">Upcoming Milestones</h4>
            <div className="flex items-center gap-2 text-xs font-bold text-black-400 uppercase tracking-widest">
                <Bell className="w-3 h-3" />
                Smart Reminders Active
            </div>
        </div>
      </div>

      <div className="space-y-3">
        {deadlines.filter(d => d.type === "minor").map((deadline, i) => (
          <motion.div 
            key={deadline.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group flex items-center justify-between p-4 bg-greys-50 hover:bg-white border border-transparent hover:border-greys-100 rounded-2xl transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black-400 group-hover:text-primary-600 group-hover:bg-primary-50 transition-all">
                    <Clock className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-sm font-bold text-black-800">{deadline.title}</p>
                    <p className="text-[10px] text-black-400 font-medium">Due: {new Date(deadline.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                </div>
            </div>
            <ChevronRight className="w-4 h-4 text-black-300 group-hover:text-black-900 group-hover:translate-x-1 transition-all" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
