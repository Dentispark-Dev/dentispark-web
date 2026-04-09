"use client";

import React from "react";
import { Users, MoreVertical, Search, Filter, TrendingUp } from "lucide-react";
import { INSTITUTIONAL_COHORTS } from "../api/mock-institutional-data";

export function CohortManager() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black-300" />
          <input 
            type="text" 
            placeholder="Search cohorts or student groups..." 
            className="w-full h-12 pl-12 pr-4 bg-white border border-greys-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary-500/20 transition-all"
          />
        </div>
        <div className="flex gap-2">
            <button className="h-12 px-6 border border-greys-100 rounded-2xl flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest text-black-400 hover:bg-greys-50">
                <Filter className="w-4 h-4" />
                Filter
            </button>
            <button className="h-12 px-6 bg-black-900 text-white rounded-2xl text-sm font-extrabold uppercase tracking-widest hover:bg-primary-600 transition-all">
                Create Cohort
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {INSTITUTIONAL_COHORTS.map((cohort) => (
          <div key={cohort.id} className="glass-card p-6 rounded-[2rem] border-greys-100 flex items-center justify-between group hover:border-primary-200 transition-all">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                <Users className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-black-900">{cohort.name}</h4>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-extrabold tracking-widest text-black-400 uppercase">{cohort.institution}</span>
                    <span className="w-1 h-1 bg-greys-200 rounded-full" />
                    <span className="text-[10px] font-extrabold tracking-widest text-primary-600 uppercase italic">Active {cohort.lastActive}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-12">
                <div className="text-right space-y-1">
                    <p className="text-[10px] font-extrabold text-black-300 uppercase tracking-widest">Aggregate Progress</p>
                    <div className="flex items-center gap-2 justify-end">
                        <span className="text-lg font-extrabold text-black-900">{cohort.averageProgress}%</span>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                </div>
                
                <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-greys-100 flex items-center justify-center text-[10px] font-extrabold text-black-400">
                             #{i}
                        </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-primary-600 flex items-center justify-center text-[10px] font-extrabold text-white">
                        +{cohort.studentCount - 3}
                    </div>
                </div>

                <button className="p-2 hover:bg-greys-50 rounded-xl transition-colors">
                    <MoreVertical className="w-5 h-5 text-black-300" />
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
