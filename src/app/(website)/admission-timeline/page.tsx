"use client";

import { AdmissionProbabilityCalculator } from "@/src/features/(website)/home/components/admission-probability-calculator";

export default function AdmissionTimelinePage() {
    return (
        <main className="min-h-screen pt-20">
            <AdmissionProbabilityCalculator />
        </main>
    );
}
