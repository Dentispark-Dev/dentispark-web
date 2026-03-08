"use client";

import { ContactSupportForm } from "@/src/features/(mentor-dashboard)/quality-control/components/contact-support-form";

export default function MentorQualityControlRoute() {
    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h1 className="text-gray-900 text-2xl font-semibold">Quality Control</h1>
                <p className="text-gray-500 mt-1 text-sm">Session feedback and quality metrics.</p>
            </div>
            <ContactSupportForm />
        </div>
    );
}
