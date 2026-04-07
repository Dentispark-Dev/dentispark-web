"use client";

import { use } from "react";
import { AdminProfileView } from "@/src/features/(dashboard)/admin/components";

export default function ModeratorDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return (
        <AdminProfileView adminEmail={id} />
    );
}
