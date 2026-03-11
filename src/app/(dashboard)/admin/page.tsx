"use client";

import { Suspense } from "react";
import { AdminDashboardAnalytics, ActivityFeed } from "@/src/features/(dashboard)/admin/components";
import { Loader2, Sparkles } from "lucide-react";

export default function AdminDashboardPage() {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1200 ease-out">
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
