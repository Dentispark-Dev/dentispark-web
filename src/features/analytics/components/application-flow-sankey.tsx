"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function ApplicationFlowSankey() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-[400px] bg-slate-50 rounded-3xl animate-pulse" />;

  // Animation variants
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 0.6,
      transition: { duration: 2, ease: "easeInOut" }
    }
  };

  const labelVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, delay: 1.5 }
    }
  };

  return (
    <div className="w-full bg-white rounded-[3rem] p-10 lg:p-16 border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
      {/* Background Decorators */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 blur-3xl rounded-full -z-10 transition-transform duration-700 group-hover:scale-150" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-50/50 blur-3xl rounded-full -z-10 transition-transform duration-700 group-hover:scale-150" />

      <div className="mb-12">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Performance Visualization</h3>
        <h4 className="text-3xl font-black text-slate-900 tracking-tight">Application Flow</h4>
      </div>

      <div className="w-full overflow-x-auto pb-4">
        {/* Responsive container for SVG, maintaining aspect ratio but wide enough to forbid squishing */}
        <div className="min-w-[800px] h-[450px] relative">
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 1000 450" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-sm"
          >
            {/* 1. Applications to Interviews */}
            <motion.path 
              d="M 150 150 C 300 150, 250 80, 400 80" 
              stroke="url(#gradBlue)" 
              strokeWidth="60" 
              fill="none" 
              variants={pathVariants}
              initial="hidden"
              animate="visible"
            />
            
            {/* 2. Applications to Rejected */}
            <motion.path 
              d="M 150 210 C 250 210, 250 260, 400 260" 
              stroke="url(#gradOrange)" 
              strokeWidth="110" 
              fill="none" 
              variants={pathVariants}
              initial="hidden"
              animate="visible"
            />

            {/* 3. Applications to Waitlist */}
            <motion.path 
              d="M 150 270 C 200 270, 250 380, 400 380" 
              stroke="url(#gradRed)" 
              strokeWidth="10" 
              fill="none" 
              variants={pathVariants}
              initial="hidden"
              animate="visible"
            />

            {/* 4. Interviews to Declined */}
            <motion.path 
              d="M 450 100 C 500 100, 500 180, 550 180" 
              stroke="url(#gradGreen)" 
              strokeWidth="8" 
              fill="none" 
              variants={pathVariants}
              initial="hidden"
              animate="visible"
            />

            {/* 5. Interviews to Attended */}
            <motion.path 
              d="M 450 70 C 520 70, 520 70, 600 70" 
              stroke="url(#gradTeal)" 
              strokeWidth="50" 
              fill="none" 
              variants={pathVariants}
              initial="hidden"
              animate="visible"
            />

            {/* 6. Attended to Offers */}
            <motion.path 
              d="M 650 60 C 700 60, 750 40, 800 40" 
              stroke="url(#gradYellow)" 
              strokeWidth="35" 
              fill="none" 
              variants={pathVariants}
              initial="hidden"
              animate="visible"
            />

            {/* 7. Attended to Waitlist */}
            <motion.path 
              d="M 650 75 C 700 75, 750 110, 800 110" 
              stroke="url(#gradPurple)" 
              strokeWidth="10" 
              fill="none" 
              variants={pathVariants}
              initial="hidden"
              animate="visible"
            />

            {/* 8. Attended to Rejection */}
            <motion.path 
              d="M 650 85 C 700 85, 750 160, 800 160" 
              stroke="url(#gradPink)" 
              strokeWidth="12" 
              fill="none" 
              variants={pathVariants}
              initial="hidden"
              animate="visible"
            />

            {/* 9. Attended to No Response */}
            <motion.path 
              d="M 650 90 C 700 90, 750 210, 800 210" 
              stroke="url(#gradBrown)" 
              strokeWidth="5" 
              fill="none" 
              variants={pathVariants}
              initial="hidden"
              animate="visible"
            />

            {/* 10. Offers to Accepted */}
            <motion.path 
              d="M 850 35 C 900 35, 930 25, 950 25" 
              stroke="url(#gradGrey)" 
              strokeWidth="5" 
              fill="none" 
              variants={pathVariants}
              initial="hidden"
              animate="visible"
            />

            {/* Graph Node Labels */}
            <motion.g variants={labelVariants} initial="hidden" animate="visible" className="text-slate-800 font-medium">
              
              {/* Main Node */}
              <text x="50" y="210" className="text-3xl font-black fill-slate-900">47</text>
              <text x="50" y="230" className="text-sm fill-slate-500">Applications</text>

              {/* Tier 2 Nodes */}
              <rect x="400" y="50" width="100" height="60" className="fill-emerald-50 rounded-lg" rx="8" />
              <text x="415" y="75" className="text-2xl font-black fill-emerald-900">16</text>
              <text x="415" y="95" className="text-xs font-semibold fill-emerald-700">Interviews</text>

              <rect x="400" y="200" width="160" height="110" className="fill-orange-50" rx="8" />
              <text x="415" y="250" className="text-2xl font-black fill-orange-900">30</text>
              <text x="415" y="270" className="text-xs font-semibold fill-orange-700">Rejected/No Answer</text>

              <text x="410" y="385" className="text-xl font-black fill-rose-900">1</text>
              <text x="430" y="382" className="text-xs font-medium fill-slate-600">Interview Waitlist</text>

              {/* Tier 3 Nodes */}
              <rect x="600" y="45" width="100" height="50" className="fill-teal-50" rx="8" />
              <text x="615" y="70" className="text-2xl font-black fill-teal-900">15</text>
              <text x="615" y="85" className="text-xs font-semibold fill-teal-700">Attended</text>

              <text x="560" y="185" className="text-xl font-black fill-emerald-900">1</text>
              <text x="580" y="182" className="text-xs font-medium fill-slate-600">Declined</text>

              {/* Tier 4 Nodes */}
              <rect x="800" y="25" width="80" height="35" className="fill-amber-50" rx="6" />
              <text x="810" y="45" className="text-xl font-black fill-amber-900">9</text>
              <text x="830" y="42" className="text-xs font-semibold fill-amber-700">Offers</text>

              <text x="810" y="115" className="text-xl font-black fill-purple-900">2</text>
              <text x="830" y="112" className="text-xs font-medium fill-slate-600">Waitlist</text>

              <text x="810" y="165" className="text-xl font-black fill-pink-900">3</text>
              <text x="830" y="162" className="text-xs font-medium fill-slate-600">Rejection</text>

              <text x="810" y="215" className="text-xl font-black fill-slate-900">1</text>
              <text x="830" y="212" className="text-xs font-medium fill-slate-600">No response</text>

              {/* Tier 5 Node */}
              <text x="960" y="30" className="text-xl font-black fill-slate-900">1</text>
              <text x="960" y="45" className="text-xs overflow-visible fill-slate-600 font-bold whitespace-nowrap">Accepted</text>
            </motion.g>

            {/* Gradient Definitions */}
            <defs>
              <linearGradient id="gradBlue" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
              <linearGradient id="gradOrange" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#fb923c" />
              </linearGradient>
              <linearGradient id="gradRed" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
              <linearGradient id="gradGreen" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="gradTeal" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>
              <linearGradient id="gradYellow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
              <linearGradient id="gradPurple" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <linearGradient id="gradPink" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
              <linearGradient id="gradBrown" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id="gradGrey" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
