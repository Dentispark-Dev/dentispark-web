"use client";

import { Suspense } from "react";
import { LoginHistoryTable } from "@/src/features/(dashboard)/admin/components/login-history-table";
import { Loader2 } from "lucide-react";

export default function AdminLoginHistoryPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Login History</h1>
                <p className="text-gray-600 mt-1">Monitor user login sessions, devices, and locations.</p>
            </div>
            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin mx-auto mt-12" />}>
                <LoginHistoryTable />
            </Suspense>
        </div>
    );
}
