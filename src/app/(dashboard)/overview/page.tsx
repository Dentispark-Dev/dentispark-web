"use client";

import WelcomeSection from "@/src/features/(dashboard)/overview/components/welcome-section";
import AIToolsGrid from "@/src/features/(dashboard)/overview/components/ai-tools-grid";
import PersonalizedMentors from "@/src/features/(dashboard)/overview/components/personalized-mentors";
import PopularResources from "@/src/features/(dashboard)/overview/components/popular-resources";
import { PerformanceGrid } from "@/src/features/analytics/components/performance-grid";
import { ProgressPipeline } from "@/src/features/analytics/components/progress-pipeline";
import { DeadlineCountdown } from "@/src/features/automation/components/deadline-countdown";
import { MilestoneList } from "@/src/features/automation/components/milestone-list";
import { AdmissionRoadmap } from "@/src/features/(dashboard)/overview/components/admission-roadmap";
import { useAuth } from "@/src/providers/auth-provider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { overviewApi, type StudentProfile, type PersonalizedMentor } from "@/src/features/(dashboard)/overview/services/overview.api";
import { toast } from "sonner";

export default function OverviewPage() {
    const { isMentor, isStudent, isAdmin, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [studentData, setStudentData] = useState<StudentProfile | null>(null);
    const [mentors, setMentors] = useState<PersonalizedMentor[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && isMentor && !isAdmin) {
            router.replace("/mentor/overview");
        }
    }, [isMentor, isAdmin, authLoading, router]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!isStudent) return;
            
            try {
                setIsDataLoading(true);
                // Resilient fetching: fetch each independently so one failure doesn't block the other
                const profilePromise = overviewApi.GET_STUDENT_PROFILE().catch(err => {
                    console.warn("Student profile fetch failed:", err);
                    return null;
                });
                
                const mentorsPromise = overviewApi.GET_PERSONALIZED_MENTORS().catch(err => {
                    console.warn("Mentors fetch failed:", err);
                    return [];
                });

                const [profile, personalizedMentors] = await Promise.all([
                    profilePromise,
                    mentorsPromise
                ]);

                if (profile) setStudentData(profile);
                if (personalizedMentors) setMentors(personalizedMentors);
            } catch (error) {
                console.error("Critical dashboard load error:", error);
            } finally {
                setIsDataLoading(false);
            }
        };

        if (isStudent && !authLoading) {
            fetchDashboardData();
        }
    }, [isStudent, authLoading]);

    if (authLoading || (isMentor && !isAdmin)) return null;

    return (
        <div className="space-y-10 pb-12">
            <WelcomeSection 
                userName={studentData?.fullName} 
                userYear={studentData?.yearOfStudy} 
            />
            
            <AdmissionRoadmap />

            <AIToolsGrid />

            {/* Premium Analytics Layer */}
            <PerformanceGrid />

            <div className="grid grid-cols-1 gap-10 xl:grid-cols-3">
                <div className="xl:col-span-2 space-y-10">
                    <DeadlineCountdown />
                    {/* <ProgressPipeline /> - Replaced by AdmissionRoadmap */}
                    <PersonalizedMentors 
                        mentors={mentors} 
                        isLoading={isDataLoading}
                    />
                </div>

                <div className="xl:col-span-1 space-y-10">
                    <PopularResources />
                    {/* <MilestoneList /> - Redundant with Roadmap tasks */}
                </div>
            </div>
        </div>
    );
}
