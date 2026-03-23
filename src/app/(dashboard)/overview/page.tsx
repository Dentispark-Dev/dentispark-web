"use client";

import WelcomeSection from "@/src/features/(dashboard)/overview/components/welcome-section";
import AIToolsGrid from "@/src/features/(dashboard)/overview/components/ai-tools-grid";
import PersonalizedMentors from "@/src/features/(dashboard)/overview/components/personalized-mentors";
import PopularResources from "@/src/features/(dashboard)/overview/components/popular-resources";
import { PerformanceGrid } from "@/src/features/analytics/components/performance-grid";
import { ProgressPipeline } from "@/src/features/analytics/components/progress-pipeline";
import { DeadlineCountdown } from "@/src/features/automation/components/deadline-countdown";
import { MilestoneList } from "@/src/features/automation/components/milestone-list";
import { useAuth } from "@/src/providers/auth-provider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OverviewPage() {
    const { isMentor, isStudent, isAdmin, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && isMentor && !isAdmin) {
            router.replace("/mentor/overview");
        }
    }, [isMentor, isAdmin, isLoading, router]);

    if (isLoading || (isMentor && !isAdmin)) return null;

    return (
        <div className="space-y-10 pb-12">
            <WelcomeSection />
            <AIToolsGrid />

            {/* Premium Analytics Layer */}
            <PerformanceGrid />

            <div className="grid grid-cols-1 gap-10 xl:grid-cols-3">
                <div className="xl:col-span-2 space-y-10">
                    <DeadlineCountdown />
                    <ProgressPipeline />
                    <PersonalizedMentors />
                </div>

                <div className="xl:col-span-1 space-y-10">
                    <PopularResources />
                    <MilestoneList />
                </div>
            </div>
        </div>
    );
}
