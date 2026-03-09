"use client";

import { useState, useEffect } from "react";
import {
    MoreHorizontal,
    Loader2,
    Shield,
    Users,
    Trash2,
    Edit2
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { adminService } from "@/src/connection/admin-service";
import { PlatformRoleData } from "@/src/connection/api-types";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

interface RoleTableProps {
    onCreateClick: () => void;
    onEditClick: (role: PlatformRoleData) => void;
}

export function RoleTable({ onCreateClick, onEditClick }: RoleTableProps) {
    const [roles, setRoles] = useState<PlatformRoleData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRoles = async () => {
        setIsLoading(true);
        try {
            const response = await adminService.getPlatformRoles();
            setRoles(response);
        } catch (error) {
            console.error("Failed to fetch roles:", error);
            toast.error("Failed to load roles");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    return (
        <div className="space-y-4">
            {/* Header Actions */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div>
                    <h3 className="font-semibold text-gray-900">Platform Roles</h3>
                    <p className="text-xs text-gray-500">Manage administrative roles and their permission sets</p>
                </div>

                <Button
                    className="flex gap-2 h-10 bg-primary-600 hover:bg-primary-700 font-medium"
                    onClick={onCreateClick}
                >
                    <Shield className="h-4 w-4" />
                    Create Role
                </Button>
            </div>

            {/* Grid of Roles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center bg-white rounded-xl border border-dashed border-gray-200">
                        <Loader2 className="h-8 w-8 text-primary-600 animate-spin mb-2" />
                        <p className="text-gray-400 text-sm">Loading roles...</p>
                    </div>
                ) : roles.length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-400">No roles defined yet.</p>
                    </div>
                ) : (
                    roles.map((role) => (
                        <div key={role.guid} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group">
                            <div className="absolute top-4 right-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem className="gap-2" onClick={() => onEditClick(role)}>
                                            <Edit2 className="h-4 w-4" /> Edit Permissions
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="gap-2 text-red-600 focus:text-red-700">
                                            <Trash2 className="h-4 w-4" /> Delete Role
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-12 w-12 rounded-lg bg-secondary-50 flex items-center justify-center text-secondary-600">
                                    <Shield className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{role.name}</h4>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Role</p>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-6 line-clamp-2 min-h-[40px]">
                                {role.description || "No description provided for this role."}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Users className="h-4 w-4" />
                                    <span className="text-xs font-medium">{role.users || 0} Assigned</span>
                                </div>
                                <Button
                                    variant="link"
                                    className="text-primary-600 p-0 h-auto text-xs font-semibold"
                                    onClick={() => onEditClick(role)}
                                >
                                    Modify Permissions
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
