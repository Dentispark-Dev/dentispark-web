"use client";

import React, { useState } from "react";
import { Shield, Download, Trash2, Eye, Key, Globe, Bell } from "lucide-react";
import { motion } from "framer-motion";

export function PrivacySettings() {
  const [downloading, setDownloading] = useState(false);

  const sections = [
    {
      title: "Data Visibility",
      icon: Eye,
      items: [
        { label: "Profile Public Visibility", desc: "Allow other students to see your basic stats", enabled: true },
        { label: "Mentor Access", desc: "Share application drafts with verified mentors", enabled: true },
      ]
    },
    {
      title: "Security Layers",
      icon: Key,
      items: [
        { label: "Two-Factor Authentication", desc: "Add an extra layer of security to your account", enabled: false },
        { label: "Login Notifications", desc: "Get alerted about new sign-ins", enabled: true },
      ]
    }
  ];

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      const data = { 
        user: "Current Student", 
        data: "All DentiSpark application history",
        exportedAt: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dentispark-my-data.json";
      a.click();
      setDownloading(false);
    }, 2000);
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-black-900 tracking-tight">Privacy & Security</h2>
          <p className="text-black-400 font-medium text-sm">Manage your data and account transparency.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section, idx) => (
          <div key={idx} className="glass-card p-8 rounded-[2.5rem] border-greys-100 space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-greys-50">
              <section.icon className="w-5 h-5 text-primary-500" />
              <h3 className="font-black text-black-900 uppercase tracking-widest text-xs">{section.title}</h3>
            </div>
            
            <div className="space-y-6">
              {section.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-black text-black-800">{item.label}</p>
                    <p className="text-xs text-black-400 font-medium">{item.desc}</p>
                  </div>
                  <div className={cn(
                    "w-12 h-6 rounded-full transition-all relative cursor-pointer",
                    item.enabled ? "bg-primary-600" : "bg-greys-200"
                  )}>
                    <div className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                      item.enabled ? "right-1" : "left-1"
                    )} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-10 rounded-[3rem] border-greys-100 bg-black-900 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <h3 className="text-2xl font-black tracking-tight">Data Sovereignty</h3>
            <p className="text-white/60 font-medium max-w-md">
              Download a complete copy of your DentiSpark data or permanently remove your account from our systems.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button 
                onClick={handleDownload}
                disabled={downloading}
                className="h-14 px-8 bg-white text-black-900 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-primary-50 transition-all disabled:opacity-50"
            >
              {downloading ? "Preparing..." : "Download Data"}
              <Download className="w-4 h-4" />
            </button>
            <button className="h-14 px-8 bg-red-600/20 text-red-400 border border-red-500/30 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-red-600/30 transition-all">
              Delete Account
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const cn = (...classes: (string | undefined | null | boolean)[]) => classes.filter(Boolean).join(" ");
