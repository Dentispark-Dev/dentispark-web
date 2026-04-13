"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MentorResourcesPage } from "@/src/features/(mentor-dashboard)/resources/components/mentor-resources-page";

export default function MentorResourcesCategoryPage() {
    const params = useParams();
    const router = useRouter();
    const category = params?.category as string;

    const categoryLabels: Record<string, string> = {
        "all": "All Resources",
        "dental-science": "Dental Science Resources",
        "dental-hygiene": "Dental Hygiene & Therapy Resources",
        "dental-nursing": "Dental Nursing Resources",
    };

    const label = categoryLabels[category] || "Resources";

    return (
        <div className="space-y-6">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-semibold transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Resources
            </button>
            <div className="mb-2">
                <h1 className="text-2xl font-bold text-slate-900">{label}</h1>
            </div>
            <MentorResourcesPage />
        </div>
    );
}
