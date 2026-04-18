"use client";

import { Suspense } from "react";
import { StudentTable } from "@/src/features/(dashboard)/admin/components";
import { Loader2 } from "lucide-react";

export default function AdminStudentsPage() {
    return (
        <div className="space-y-6">

            <Suspense fallback={
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
                </div>
            }>
                <StudentTable />
            </Suspense>
        </div>
    );
}
