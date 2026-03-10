"use client";

import { use } from "react";
import { MentorProfileView } from "@/src/features/(dashboard)/admin/components";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function MentorDetailPage({ params }: PageProps) {
    const { id } = use(params);
    return (
        <div className="space-y-6">
            <MentorProfileView mentorId={id} />
        </div>
    );
}
