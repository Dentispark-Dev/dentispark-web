"use client";

import { use } from "react";
import { UniversityEditView } from "@/src/features/(dashboard)/admin/components";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function UniversityEditPage({ params }: PageProps) {
    const { id } = use(params);
    return (
        <div className="space-y-6">
            <UniversityEditView universityId={id} />
        </div>
    );
}
