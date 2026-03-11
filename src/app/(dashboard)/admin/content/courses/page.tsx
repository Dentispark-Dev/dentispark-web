"use client";

import { Suspense } from "react";
import { CourseTable } from "@/src/features/(dashboard)/admin/components";
import { Loader2 } from "lucide-react";

export default function AdminCoursesPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
                    <p className="text-gray-600">Manage dental degree programs and entry requirements.</p>
                </div>
            </div>

            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin mx-auto mt-12" />}>
                <CourseTable />
            </Suspense>
        </div>
    );
}
