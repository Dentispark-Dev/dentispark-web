"use client";

import { Suspense } from "react";
import { StudentProfileView } from "@/src/features/(dashboard)/admin/components";
import { Loader2 } from "lucide-react";

export function StudentProfileClientWrapper({ id }: { id: string }) {
    return (
        <div className="space-y-6">
            <Suspense fallback={
                <div className="flex h-[400px] items-center justify-center">
                    <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
                </div>
            }>
                <StudentProfileView studentId={id} />
            </Suspense>
        </div>
    );
}
