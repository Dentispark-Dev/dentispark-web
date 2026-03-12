"use client";

import React from "react";
import WelcomeSection from "@/src/features/(dashboard)/overview/components/welcome-section";
import { WebhookManager } from "@/src/features/institutions/components/webhook-manager";
import { APIKeyManager } from "@/src/features/institutions/components/api-key-manager";
import { Code, Terminal, Cpu, Globe } from "lucide-react";

export default function InstitutionalDeveloperPage() {
  return (
    <div className="space-y-10 pb-12">
      <WelcomeSection userName="Institutional Admin" userYear="Developer Portal" />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
        <div className="xl:col-span-1 space-y-6">
            <div className="glass-card bg-white p-6 rounded-[2rem] border-primary-100 shadow-xl">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-black-400 mb-6">Integration Status</h4>
                <div className="space-y-6">
                    <StatusItem icon={<Terminal />} label="API Health" status="99.9%" />
                    <StatusItem icon={<Globe />} label="Webhook Load" status="Low" />
                    <StatusItem icon={<Cpu />} label="Compute usage" status="3% of limit" />
                </div>
            </div>

            <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-2xl">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                    <Code className="w-6 h-6" />
                </div>
                <h3 className="font-black italic uppercase text-lg tracking-tight mb-2">Need Help?</h3>
                <p className="text-white/70 text-xs mb-6 font-medium leading-relaxed">Our engineering team is available for custom LMS integration support.</p>
                <button className="w-full h-10 bg-white text-primary-600 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-white-50 transition-all">
                    Contact Support
                </button>
            </div>
        </div>

        <div className="xl:col-span-3">
          <WebhookManager />
          <APIKeyManager />
        </div>
      </div>
    </div>
  );
}

function StatusItem({ icon, label, status }: any) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-greys-50 flex items-center justify-center text-black-400">
                    {React.cloneElement(icon, { size: 16 })}
                </div>
                <span className="text-[11px] font-bold text-black-600 uppercase tracking-tight">{label}</span>
            </div>
            <span className="text-[11px] font-black text-black-900">{status}</span>
        </div>
    )
}
