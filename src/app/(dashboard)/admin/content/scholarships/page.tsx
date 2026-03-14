"use client";

import { Suspense } from "react";
import { ScholarshipTable } from "@/src/features/(dashboard)/admin/components/scholarship-table";
import { Loader2 } from "lucide-react";

export default function AdminScholarshipsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Scholarships</h1>
                    <p className="text-gray-600">Manage scholarship listings and awards for students.</p>
                </div>
            </div>

            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin mx-auto mt-12" />}>
                <ScholarshipTable />
            </Suspense>
        </div>
    );
}
