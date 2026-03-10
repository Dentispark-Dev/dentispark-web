"use client";

import { use } from "react";
import { StudentProfileView } from "@/src/features/(dashboard)/admin/components";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function StudentDetailPage({ params }: PageProps) {
    const { id } = use(params);
    return (
        <div className="space-y-6">
            <StudentProfileView studentId={id} />
        </div>
    );
}
