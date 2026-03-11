"use client";

import { useState, Suspense } from "react";
import { RoleTable, CreateRoleModal } from "@/src/features/(dashboard)/admin/components";
import { PlatformRoleData } from "@/src/connection/api-types";
import { Loader2 } from "lucide-react";

export default function RolesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editRole, setEditRole] = useState<PlatformRoleData | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleCreate = () => {
        setEditRole(null);
        setIsModalOpen(true);
    };

    const handleEdit = (role: PlatformRoleData) => {
        setEditRole(role);
        setIsModalOpen(true);
    };

    const handleSuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
                <p className="text-gray-500">Create roles and define permission sets for system administrators.</p>
            </div>

            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin mx-auto mt-12" />}>
                <RoleTable
                    key={refreshKey}
                    onCreateClick={handleCreate}
                    onEditClick={handleEdit}
                />

                <CreateRoleModal
                    isOpen={isModalOpen}
                    editRole={editRole}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handleSuccess}
                />
            </Suspense>
        </div>
    );
}
