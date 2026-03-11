"use client";

import { use, Suspense } from "react";
import { StudentProfileView } from "@/src/features/(dashboard)/admin/components";
import { Loader2 } from "lucide-react";

interface PageProps {
    params: Promise<{
        id: string[];
    }>;
}

export default function StudentDetailPage({ params }: PageProps) {
    const { id } = use(params);
    // Join segments back into a single ID (e.g., ["STU1", "294", "24859"] -> "STU1/294/24859")
    const fullId = id.join("/");
    
    return (
        <div className="space-y-6">
            <Suspense fallback={
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
                </div>
            }>
                <StudentProfileView studentId={fullId} />
            </Suspense>
        </div>
    );
}
