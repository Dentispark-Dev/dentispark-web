"use client";

import React, { useState } from "react";
import { Key, Eye, EyeOff, Copy, RefreshCw, Plus, ShieldCheck } from "lucide-react";

export function APIKeyManager() {
  const [keys] = useState([
    { id: "1", name: "LMS Production Key", prefix: "ds_live_", key: "••••••••••••••••", created: "Oct 12, 2025" },
    { id: "2", name: "Internal Reporting", prefix: "ds_live_", key: "••••••••••••••••", created: "Feb 1, 2026" },
  ]);

  return (
    <div className="glass-card bg-white p-8 rounded-[2rem] border-primary-100 shadow-xl mt-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black-900 flex items-center justify-center text-white">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-black-900">REST API Keys</h3>
            <p className="text-xs text-black-400">Generate secure tokens for institutional data access</p>
          </div>
        </div>
        <button className="h-10 px-4 border-2 border-black-900 text-black-900 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black-900 hover:text-white transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Generate Key
        </button>
      </div>

      <div className="space-y-4">
        {keys.map((key) => (
          <div key={key.id} className="p-5 rounded-2xl bg-white border border-greys-100 hover:border-primary-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-black text-black-900 uppercase tracking-tight mb-1">{key.name}</h4>
              <div className="flex items-center gap-2 font-mono text-[11px] text-black-500">
                <span className="text-primary-600 font-bold">{key.prefix}</span>
                <span>{key.key}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-[10px] text-black-400 font-bold uppercase">Created</p>
                <p className="text-[11px] font-medium text-black-600">{key.created}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 border border-greys-200 rounded-lg hover:bg-greys-50 transition-all">
                  <Eye className="w-4 h-4 text-black-400" />
                </button>
                <button className="p-2 border border-greys-200 rounded-lg hover:bg-greys-50 transition-all">
                  <Copy className="w-4 h-4 text-black-400" />
                </button>
                <button className="p-2 border border-greys-200 rounded-lg hover:bg-red-50 text-red-500 transition-all">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 rounded-[1.5rem] bg-black-900 text-white flex items-center justify-between overflow-hidden relative">
        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Security Active</span>
            </div>
            <h5 className="text-sm font-bold mb-1">Developer Documentation</h5>
            <p className="text-xs text-white/60">Explore our OpenAPI spec and SDKs for integration.</p>
        </div>
        <button className="relative z-10 px-5 py-2.5 bg-white text-black-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white-50 transition-all">
            Open Docs
        </button>
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
      </div>
    </div>
  );
}
