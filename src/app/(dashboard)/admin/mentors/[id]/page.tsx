"use client";

import { use, Suspense } from "react";
import { MentorProfileView } from "@/src/features/(dashboard)/admin/components";
import { Loader2 } from "lucide-react";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function MentorDetailPage({ params }: PageProps) {
    const { id } = use(params);
    return (
        <div className="space-y-6">
            <Suspense fallback={
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
                </div>
            }>
                <MentorProfileView mentorId={id} />
            </Suspense>
        </div>
    );
}
