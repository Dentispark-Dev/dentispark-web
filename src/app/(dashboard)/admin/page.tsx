"use client";

import { Suspense } from "react";
import { AdminDashboardAnalytics } from "@/src/features/(dashboard)/admin/components";
import { Loader2 } from "lucide-react";

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 font-sora">Admin Dashboard</h1>
                <p className="text-gray-500 mt-1">Platform overview and performance metrics.</p>
            </div>

            <Suspense fallback={
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
                </div>
            }>
                <AdminDashboardAnalytics />
            </Suspense>
        </div>
    );
}
