"use client";

import WelcomeSection from "@/src/features/(dashboard)/overview/components/welcome-section";
import AIToolsGrid from "@/src/features/(dashboard)/overview/components/ai-tools-grid";
import PersonalizedMentors from "@/src/features/(dashboard)/overview/components/personalized-mentors";
import PopularResources from "@/src/features/(dashboard)/overview/components/popular-resources";
import { PerformanceGrid } from "@/src/features/analytics/components/performance-grid";
import { DeadlineCountdown } from "@/src/features/automation/components/deadline-countdown";
import { MissionControl } from "@/src/features/(dashboard)/overview/components/mission-control";
import { ShadowingLog } from "@/src/features/(dashboard)/overview/components/shadowing-log";
import { useAuth } from "@/src/providers/auth-provider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { overviewApi, type StudentProfile, type PersonalizedMentor, type ApplicationProgress } from "@/src/features/(dashboard)/overview/services/overview.api";
import { Star } from "lucide-react";
import { useDashboardStore } from "@/src/store/dashboard-store";

export default function OverviewPage() {
    const { isMentor, isStudent, isAdmin, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [studentData, setStudentData] = useState<StudentProfile | null>(null);
    const [mentors, setMentors] = useState<PersonalizedMentor[]>([]);
    const [progressData, setProgressData] = useState<ApplicationProgress | null>(null);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const { setStages } = useDashboardStore();

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

                const progressPromise = overviewApi.GET_APPLICATION_PROGRESS().catch(err => {
                    console.warn("Progress fetch failed:", err);
                    return null;
                });

                const [profile, personalizedMentors, progress] = await Promise.all([
                    profilePromise,
                    mentorsPromise,
                    progressPromise
                ]);

                if (profile) setStudentData(profile);
                if (personalizedMentors) setMentors(personalizedMentors);
                if (progress) {
                    setProgressData(progress);
                    if (progress.roadmap) setStages(progress.roadmap);
                }
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
            

            {/* Cinematic Mission Control */}
            <MissionControl />

            {/* Placement & Experience Logging */}
            <div className="max-w-5xl mx-auto pt-8">
                <ShadowingLog />
            </div>

            <div className="space-y-24">
                <AIToolsGrid />
                <PopularResources />
                
                {/* Bottom Intelligence Section - Full Width Stacking */}
                <div className="space-y-16 pt-12 border-t border-slate-100">
                    <div className="max-w-5xl mx-auto w-full">
                        <DeadlineCountdown />
                    </div>
                    
                    <PersonalizedMentors 
                        mentors={mentors} 
                        isLoading={isDataLoading}
                    />

                    <div className="bg-white rounded-[3rem] border border-slate-100 p-10 lg:p-16 shadow-2xl shadow-slate-200/50">
                        <div className="flex items-center justify-between mb-12">
                            <div className="space-y-1">
                                <h3 className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-emerald-600">Performance Metrics</h3>
                                <h4 className="text-3xl font-extrabold text-slate-900 tracking-tight">Application Strength</h4>
                            </div>
                            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm">
                                <Star className="w-6 h-6 fill-emerald-600" />
                            </div>
                        </div>
                        <PerformanceGrid />
                    </div>
                </div>
            </div>
        </div>
    );
}
