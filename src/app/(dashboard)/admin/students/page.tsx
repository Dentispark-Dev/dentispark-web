"use client";

import { Suspense } from "react";
import { StudentTable } from "@/src/features/(dashboard)/admin/components";
import { Loader2 } from "lucide-react";

export default function AdminStudentsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 font-jakarta">Student Management</h1>
                <p className="text-gray-500 mt-1">View, search and manage all registered students.</p>
            </div>

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
