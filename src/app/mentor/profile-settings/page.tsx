"use client";

import { MentorProfileSettingsHeader } from "@/src/features/(mentor-dashboard)/profile-settings/components/mentor-profile-settings-header";
import { MentorPersonalInformation } from "@/src/features/(mentor-dashboard)/profile-settings/components/mentor-personal-information";
import { MentorEducationWork } from "@/src/features/(mentor-dashboard)/profile-settings/components/mentor-education-work";

export default function MentorProfileSettingsRoute() {
    return (
        <div className="space-y-6">
            <MentorProfileSettingsHeader />
            <MentorPersonalInformation />
            <MentorEducationWork />
        </div>
    );
}
