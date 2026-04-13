import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { ArrowRight, LayoutDashboard } from "lucide-react";

export function DashboardPreview() {
  return (
    <section className="bg-slate-50 py-24 sm:py-32 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-6 mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full text-slate-500 text-[10px] font-bold uppercase tracking-widest shadow-sm">
            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
            Outcome-Oriented UI
          </div>
          <h2 className="text-4xl lg:text-6xl font-jakarta font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            Your entire dental school journey, <span className="text-emerald-600">in one place.</span>
          </h2>
          <p className="text-lg text-slate-500 font-medium">
            Stop guessing your next step. Our smart dashboard tracks your clinical readiness, flags missing module gaps, and points you directly to the action that moves the needle today.
          </p>
          <div className="pt-4">
            <Link href="/sign-up">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-jakarta font-bold px-10 h-14 rounded-2xl text-base transition-all group flex items-center gap-3">
                Get access — it&apos;s free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Mockup Container */}
        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent z-10 bottom-0 top-1/2 pointer-events-none" />
          
          <div className="relative rounded-[2rem] border border-slate-200/60 bg-white shadow-2xl shadow-slate-200/50 overflow-hidden group">
            
            {/* Top Bar Mock */}
            <div className="h-12 border-b border-slate-100 flex items-center px-6 gap-2 bg-slate-50">
              <div className="w-3 h-3 rounded-full bg-slate-200" />
              <div className="w-3 h-3 rounded-full bg-slate-200" />
              <div className="w-3 h-3 rounded-full bg-slate-200" />
              <div className="ml-4 w-64 h-6 rounded-md bg-white border border-slate-200" />
            </div>

            {/* Content Mock */}
            <div className="p-8 lg:p-12 bg-slate-50/50 grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Sidebar Mock */}
              <div className="hidden md:flex flex-col gap-4 col-span-3">
                <div className="h-8 w-3/4 rounded-lg bg-emerald-100/50" />
                <div className="h-8 w-full rounded-lg bg-slate-100" />
                <div className="h-8 w-5/6 rounded-lg bg-slate-100" />
                <div className="h-8 w-full rounded-lg bg-slate-100" />
                <div className="mt-8 h-32 w-full rounded-xl bg-slate-100" />
              </div>

              {/* Main Content Area */}
              <div className="col-span-12 md:col-span-9 space-y-8">
                {/* Progress Bar Mock */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <LayoutDashboard className="w-24 h-24 text-emerald-900" />
                  </div>
                  <h3 className="font-jakarta font-bold text-slate-800 text-lg">Your Clinical Readiness: 80%</h3>
                  <p className="text-sm text-slate-400 mt-1 mb-4">Phase 3: UCAT & Admissions Prep</p>
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden w-full">
                    <div className="h-full bg-emerald-500 w-4/5 rounded-full" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Next Step Mock */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm group-hover:border-emerald-200 transition-colors">
                    <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">Next Recommended Action</h4>
                    <p className="font-jakarta font-bold text-slate-900">Complete Mock Interview #2</p>
                    <div className="mt-4 h-10 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center text-sm font-semibold">
                      Start Module
                    </div>
                  </div>

                  {/* Mentor Mock */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Mentor Booking Status</h4>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200" />
                      <div>
                        <p className="font-jakarta font-bold text-slate-900 text-sm">Session with Dr. Chen</p>
                        <p className="text-xs text-slate-500">Confirmed for Friday, 2pm</p>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
