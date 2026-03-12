"use client";

import { AdminDashboardAnalytics, ActivityFeed } from "@/src/features/(dashboard)/admin/components";

export default function AdminDashboardPage() {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1200 ease-out">
            <AdminDashboardAnalytics />
            <div className="grid grid-cols-1 gap-8">
                <ActivityFeed />
            </div>
        </div>
    );
}
