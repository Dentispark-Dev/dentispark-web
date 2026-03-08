"use client";

import WelcomeSection from "@/src/features/(dashboard)/overview/components/welcome-section";
import PersonalizedMentors from "@/src/features/(dashboard)/overview/components/personalized-mentors";
import PopularResources from "@/src/features/(dashboard)/overview/components/popular-resources";

export default function OverviewPage() {
    return (
        <div className="space-y-6">
            <WelcomeSection />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="xl:col-span-2 space-y-6">
                    <PersonalizedMentors />
                </div>

                <div className="xl:col-span-1">
                    <PopularResources />
                </div>
            </div>
        </div>
    );
}
