"use client";

import { useState, useEffect } from "react";
import {
    Search,
    MoreHorizontal,
    Mail,
    Shield,
    UserX,
    UserCheck,
    Loader2,
    Plus,
    Users
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { adminService } from "@/src/connection/admin-service";
import { AdminRecord } from "@/src/connection/api-types";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

interface ModeratorTableProps {
    onInviteClick: () => void;
}

export function ModeratorTable({ onInviteClick }: ModeratorTableProps) {
    const [moderators, setModerators] = useState<AdminRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchKey, setSearchKey] = useState("");

    const fetchModerators = async () => {
        setIsLoading(true);
        try {
            // We fetch all admins and filter by 'Moderator' role
            const response = await adminService.getAdminRecords({
                searchKey,
                page: 0,
                perPage: 100
            });

            const filtered = response.content.filter(admin =>
                admin.rolesAndPermissions?.some(rp =>
                    rp.name.toLowerCase().includes("moderator")
                )
            );

            setModerators(filtered);
        } catch (error) {
            console.error("Failed to fetch moderators:", error);
            toast.error("Failed to load moderators");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchModerators();
    }, [searchKey]);

    const handleDeactivate = async (email: string) => {
        try {
            await adminService.deactivateAdmin(email, "Deactivated by super admin");
            toast.success("Moderator deactivated successfully");
            fetchModerators();
        } catch (error) {
            toast.error("Failed to deactivate moderator");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status?.toUpperCase()) {
            case "ACTIVE":
                return <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-full">Active</span>;
            case "INACTIVE":
                return <span className="px-2 py-1 text-xs font-medium bg-gray-50 text-gray-700 rounded-full">Inactive</span>;
            case "SUSPENDED":
                return <span className="px-2 py-1 text-xs font-medium bg-red-50 text-red-700 rounded-full">Suspended</span>;
            default:
                return <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">{status}</span>;
        }
    };

    return (
        <div className="space-y-4">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search moderators by name or email..."
                        className="pl-10 h-10 border-gray-200 focus:ring-primary-500"
                        value={searchKey}
                        onChange={(e) => setSearchKey(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <Button
                        variant="default"
                        className="flex gap-2 h-10 bg-primary-600 hover:bg-primary-700 text-white"
                        onClick={onInviteClick}
                    >
                        <Plus className="h-4 w-4" />
                        Invite Moderator
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Moderator User</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Username</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Permissions</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
                                            <p className="text-gray-400 text-sm">Loading moderators...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : moderators.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <Users className="h-10 w-10 text-gray-200" />
                                            <p>No moderators found.</p>
                                            <p className="text-xs">Try searching for a different name or invite a new one.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                moderators.map((moderator) => (
                                    <tr key={moderator.emailAddress} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-secondary-50 flex items-center justify-center text-secondary-600 font-semibold">
                                                    {(moderator.firstName || moderator.username)[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{moderator.fullName || moderator.username}</div>
                                                    <div className="text-xs text-gray-500">{moderator.emailAddress}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600 font-mono">@{moderator.username}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {moderator.rolesAndPermissions?.map((rp) => (
                                                    <span key={rp.guid} className="px-2 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-700 rounded border border-blue-100">
                                                        {rp.name}
                                                    </span>
                                                )) || <span className="text-xs text-gray-400">No roles</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(moderator.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="gap-2">
                                                        <Shield className="h-4 w-4" /> Change Access
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2">
                                                        <Mail className="h-4 w-4" /> Resend Invite
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {moderator.status === "ACTIVE" ? (
                                                        <DropdownMenuItem
                                                            className="gap-2 text-red-600 focus:text-red-700 focus:bg-red-50"
                                                            onClick={() => handleDeactivate(moderator.emailAddress)}
                                                        >
                                                            <UserX className="h-4 w-4" /> Deactivate
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem className="gap-2 text-green-600 focus:text-green-700 focus:bg-green-50">
                                                            <UserCheck className="h-4 w-4" /> Activate
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
