"use client";

import { use } from "react";
import { UniversityProfile } from "@/src/features/(dashboard)/university-hub/components/university-profile";
import { UK_DENTAL_SCHOOLS } from "@/src/features/(dashboard)/university-hub/constants/universities";
import { notFound } from "next/navigation";

export default function UniversityProfilePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);

    // Find university by id or slug
    const university =
        UK_DENTAL_SCHOOLS.find((u) => u.id === id || u.slug === id) ||
        UK_DENTAL_SCHOOLS[0];

    if (!university) {
        notFound();
    }

    return <UniversityProfile university={university} />;
}
