"use client";

import { Suspense } from "react";
import { ScholarshipTable } from "@/src/features/(dashboard)/admin/components/scholarship-table";
import { Loader2 } from "lucide-react";

export default function AdminScholarshipsPage() {
    return (
        <div className="space-y-6">
            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin mx-auto mt-12" />}>
                <ScholarshipTable />
            </Suspense>
        </div>
    );
}
