"use client";

import React from "react";
import { ShieldCheck, AlertCircle, RefreshCw, Layers } from "lucide-react";
import { MOCK_LICENSES } from "../api/mock-institutional-data";

export function LicenseViewer() {
  const license = MOCK_LICENSES[0];
  const percentage = (license.usedSeats / license.totalSeats) * 100;

  return (
    <div className="glass-card p-10 rounded-[3rem] border-greys-100 space-y-8 relative overflow-hidden">
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span className="text-[10px] font-extrabold text-black-400 uppercase tracking-widest">Active License</span>
            </div>
            <h3 className="text-2xl font-extrabold text-black-900 tracking-tight">{license.name}</h3>
        </div>
        <button className="h-12 px-6 border border-greys-100 rounded-2xl flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-black-900 hover:bg-greys-50 transition-all">
            <RefreshCw className="w-4 h-4" />
            Manage Plan
        </button>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex justify-between items-end">
            <div className="space-y-1">
                <p className="text-sm font-extrabold text-black-900 tracking-tight">{license.usedSeats} / {license.totalSeats} Seats Occupied</p>
                <p className="text-xs text-black-400 font-medium italic">License expires on {license.expiryDate}</p>
            </div>
            <span className="text-2xl font-extrabold italic text-primary-600">{Math.round(percentage)}%</span>
        </div>
        
        <div className="h-5 w-full bg-greys-100 rounded-full overflow-hidden p-1">
            <div 
                className="h-full bg-gradient-to-r from-primary-500 to-blue-600 rounded-full shadow-lg shadow-primary-500/20"
                style={{ width: `${percentage}%` }}
            />
        </div>
      </div>

      <div className="flex gap-4 relative z-10 pt-2">
        <div className="flex-1 p-6 rounded-[1.5rem] bg-amber-50 border border-amber-100 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-200 flex items-center justify-center text-amber-700">
                <AlertCircle className="w-6 h-6" />
            </div>
            <div>
                <p className="text-xs font-extrabold text-amber-900 uppercase tracking-widest">Low Seat Alert</p>
                <p className="text-[10px] text-amber-700 font-medium">You are approaching your seat limit. Add more to ensure students can join.</p>
            </div>
        </div>
      </div>

      {/* Background Decor */}
      <Layers className="absolute right-[-5%] bottom-[-10%] w-32 h-32 text-primary-500/5 rotate-12 pointer-events-none" />
    </div>
  );
}
