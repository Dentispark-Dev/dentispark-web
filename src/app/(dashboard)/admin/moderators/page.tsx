"use client";

import { useState, Suspense } from "react";
import { ModeratorTable, InviteAdminModal } from "@/src/features/(dashboard)/admin/components";
import { Users, Loader2 } from "lucide-react";

export default function ModeratorsPage() {
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <Users className="h-6 w-6 text-primary-600" />
                    <h1 className="text-3xl font-bold text-gray-900 font-sora">Moderator Management</h1>
                </div>
                <p className="text-gray-500">Manage platform moderators and their access permissions.</p>
            </div>

            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin mx-auto mt-12" />}>
                <ModeratorTable onInviteClick={() => setIsInviteModalOpen(true)} />

                <InviteAdminModal
                    isOpen={isInviteModalOpen}
                    onClose={() => setIsInviteModalOpen(false)}
                    onSuccess={() => {
                        // Refresh table logic handled by react-query if used, or manual refetch
                        window.location.reload(); // Simple approach for now
                    }}
                />
            </Suspense>
        </div>
    );
}
