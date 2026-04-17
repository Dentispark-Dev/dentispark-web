"use client";

import { use } from "react";
import { ScholarshipEditView } from "@/src/features/(dashboard)/admin/components/scholarship-edit-view";

interface ScholarshipPageProps {
    params: Promise<{ id: string }>;
}

export default function AdminScholarshipDetailPage({ params }: ScholarshipPageProps) {
    const { id } = use(params);
    
    return <ScholarshipEditView scholarshipId={id} />;
}
