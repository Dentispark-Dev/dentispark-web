"use client";

import React, { useState } from "react";
import { Webhook, Trash2, Plus, CheckCircle2, AlertCircle, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  status: "active" | "inactive";
}

export function WebhookManager() {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    { id: "1", url: "https://lms.kingscollege.london/webhooks/dentispark", events: ["interview.completed", "ps.reviewed"], status: "active" },
  ]);

  const addWebhook = () => {
    const newHook: WebhookConfig = {
      id: Math.random().toString(36).substr(2, 9),
      url: "https://",
      events: ["interview.completed"],
      status: "active",
    };
    setWebhooks([...webhooks, newHook]);
  };

  return (
    <div className="glass-card bg-white p-8 rounded-[2rem] border-primary-100 shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
            <Webhook className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-black-900">University Webhooks</h3>
            <p className="text-xs text-black-400">Receive real-time student performance updates</p>
          </div>
        </div>
        <button 
          onClick={addWebhook}
          className="h-10 px-4 bg-primary-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary-700 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Endpoint
        </button>
      </div>

      <div className="space-y-4">
        {webhooks.map((hook) => (
          <div key={hook.id} className="p-4 rounded-2xl bg-greys-50 border border-greys-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-black-900 truncate">{hook.url}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${hook.status === "active" ? "bg-emerald-100 text-emerald-600" : "bg-greys-200 text-black-400"}`}>
                  {hook.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {hook.events.map(event => (
                  <span key={event} className="text-[10px] bg-white border border-greys-200 px-2 py-0.5 rounded-md text-black-500 font-medium">
                    {event}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-greys-200 rounded-lg text-black-400 transition-colors">
                <Copy className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
        <p className="text-[11px] text-amber-800 leading-tight">
          <strong>Security Tip:</strong> We recommend verifying webhook signatures using the <code>DS-Signature</code> header to ensure requests originate from DentiSpark.
        </p>
      </div>
    </div>
  );
}
