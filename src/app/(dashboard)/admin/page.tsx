"use client";

import { Suspense } from "react";
import { AdminDashboardAnalytics, ActivityFeed } from "@/src/features/(dashboard)/admin/components";
import { Loader2, Sparkles } from "lucide-react";

export default function AdminDashboardPage() {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1200 ease-out">
            <header className="relative overflow-hidden p-10 rounded-[2.5rem] bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-primary-500/20 backdrop-blur-md ring-1 ring-primary-500/30">
                                <Sparkles className="h-5 w-5 text-primary-400" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-primary-400/80">Command Center</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black font-sora tracking-tight">
                            Admin <span className="text-primary-400">Universe</span>
                        </h1>
                        <p className="text-gray-400 font-medium text-lg max-w-xl">
                            Intelligence dashboard for platform performance and user growth metrics.
                        </p>
                    </div>
                </div>
            </header>

            <Suspense fallback={
                <div className="flex items-center justify-center p-24">
                    <div className="relative">
                        <div className="h-12 w-12 rounded-full border-t-2 border-primary-600 animate-spin" />
                        <Loader2 className="absolute inset-0 m-auto h-5 w-5 text-primary-600 animate-spin" />
                    </div>
                </div>
            }>
                <AdminDashboardAnalytics />
            </Suspense>

            <div className="grid grid-cols-1 gap-8">
                <ActivityFeed />
            </div>
        </div>
    );
}
