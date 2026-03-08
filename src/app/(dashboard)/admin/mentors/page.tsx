"use client";

import { MentorTable } from "@/src/features/(dashboard)/admin/components";

export default function AdminMentorsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 font-sora">Mentor Management</h1>
                <p className="text-gray-500 mt-1">Review mentor profiles, verify credentials and manage status.</p>
            </div>

            <MentorTable />
        </div>
    );
}
