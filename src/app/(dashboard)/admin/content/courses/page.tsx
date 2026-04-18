"use client";

import { Suspense } from "react";
import { CourseTable } from "@/src/features/(dashboard)/admin/components";
import { Loader2 } from "lucide-react";

export default function AdminCoursesPage() {
    return (
        <div className="space-y-6">
            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin mx-auto mt-12" />}>
                <CourseTable />
            </Suspense>
        </div>
    );
}
