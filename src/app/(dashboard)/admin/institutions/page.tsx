"use client";

import React from "react";
import { CohortManager } from "@/src/features/institutions/components/cohort-manager";
import { LicenseViewer } from "@/src/features/institutions/components/license-viewer";
import { Building2, LayoutDashboard, Database, ShieldCheck, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function InstitutionalDashboard() {
  const stats = [
    { label: "Active Cohorts", val: "12", icon: Building2, trend: "+2 this month" },
    { label: "Managed Students", val: "1,240", icon: LayoutDashboard, trend: "98% session rate" },
    { label: "Total Mentors", val: "86", icon: ShieldCheck, trend: "4.9 Avg Rating" },
    { label: "Data Integrity", val: "E2EE", icon: Database, trend: "Audit Ready" },
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary-600">
                <Building2 className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">Institutional Hub</span>
            </div>
            <h1 className="text-4xl font-black text-black-900 tracking-tight">London Dental Academy</h1>
            <p className="text-black-400 font-medium text-lg">Managing elite cohorts of dental practitioners.</p>
        </div>
        
        <div className="flex gap-3">
            <button className="h-14 px-8 border border-greys-100 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-greys-50 transition-all">
                Export Audit Log
                <ArrowUpRight className="w-4 h-4" />
            </button>
            <button className="h-14 px-8 bg-black-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
                Institutional Settings
            </button>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
            <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 rounded-[2rem] border-greys-100 space-y-3"
            >
                <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                        <stat.icon className="w-5 h-5" />
                    </div>
                </div>
                <div>
                    <p className="text-[10px] font-black text-black-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-3xl font-black text-black-900 italic">{stat.val}</p>
                </div>
                <p className="text-[9px] font-black text-green-600 uppercase tracking-widest italic">{stat.trend}</p>
            </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-black-900 uppercase tracking-widest text-xs">Active Cohorts</h2>
                <div className="h-px flex-1 bg-greys-100 ml-4" />
            </div>
            <CohortManager />
        </div>
        
        <div className="space-y-8">
            <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-black-900 uppercase tracking-widest text-xs">License Overview</h2>
                <div className="h-px flex-1 bg-greys-100 ml-4" />
            </div>
            <LicenseViewer />
        </div>
      </div>
    </div>
  );
}
