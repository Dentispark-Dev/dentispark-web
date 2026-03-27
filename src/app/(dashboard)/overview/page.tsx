"use client";

import WelcomeSection from "@/src/features/(dashboard)/overview/components/welcome-section";
import AIToolsGrid from "@/src/features/(dashboard)/overview/components/ai-tools-grid";
import PersonalizedMentors from "@/src/features/(dashboard)/overview/components/personalized-mentors";
import PopularResources from "@/src/features/(dashboard)/overview/components/popular-resources";
import { PerformanceGrid } from "@/src/features/analytics/components/performance-grid";
import { AdmissionRoadmap } from "@/src/features/(dashboard)/overview/components/admission-roadmap";
import { MissionControl } from "@/src/features/(dashboard)/overview/components/mission-control";
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
        <div className="space-y-12 pb-24">
            <WelcomeSection 
                userName={studentData?.fullName} 
                userYear={studentData?.yearOfStudy} 
            />
            
            <AdmissionRoadmap />

            {/* The 11-Step Master Roadmap */}
            <MissionControl />

            <div className="grid grid-cols-1 gap-12 xl:grid-cols-3">
                <div className="xl:col-span-2 space-y-12">
                    <AIToolsGrid />
                    <PersonalizedMentors 
                        mentors={mentors} 
                        isLoading={isDataLoading}
                    />
                </div>

                <div className="xl:col-span-1 space-y-12">
                    <DeadlineCountdown />
                    <PopularResources />
                    <PerformanceGrid />
                </div>
            </div>
        </div>
    );
}
