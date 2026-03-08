"use client";

import { StudentTable } from "@/src/features/(dashboard)/admin/components";

export default function AdminStudentsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 font-sora">Student Management</h1>
                <p className="text-gray-500 mt-1">View, search and manage all registered students.</p>
            </div>

            <StudentTable />
        </div>
    );
}
