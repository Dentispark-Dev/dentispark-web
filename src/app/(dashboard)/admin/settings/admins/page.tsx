"use client";

import { useState } from "react";
import { AdminTable, InviteAdminModal } from "@/src/features/(dashboard)/admin/components";

export default function AdminsPage() {
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleSuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">System Administrators</h1>
                <p className="text-gray-500">Manage administrative users, invite new team members, and assign roles.</p>
            </div>

            <AdminTable
                key={refreshKey}
                onInviteClick={() => setIsInviteModalOpen(true)}
            />

            <InviteAdminModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onSuccess={handleSuccess}
            />
        </div>
    );
}
