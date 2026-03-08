"use client";

import { AdminDashboardAnalytics } from "@/src/features/(dashboard)/admin/components";

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 font-sora">Admin Dashboard</h1>
                <p className="text-gray-500 mt-1">Platform overview and performance metrics.</p>
            </div>

            <AdminDashboardAnalytics />
        </div>
    );
}
