"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Search,
    MoreHorizontal,
    Mail,
    Shield,
    UserX,
    UserCheck,
    Loader2,
    Plus,
    ArrowRight,
    ExternalLink,
    Lock,
    ShieldCheck,
    Calendar,
    Globe,
    Trash2,
    ShieldX
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
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { CreateUserModal } from "./create-user-modal";

interface AdminTableProps {
    onInviteClick: () => void;
}

export function AdminTable({ onInviteClick }: AdminTableProps) {
    const router = useRouter();
    const [admins, setAdmins] = useState<AdminRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchKey, setSearchKey] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchAdmins = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await adminService.getAdminRecords({
                searchKey,
                page: 0,
                perPage: 100
            });
            setAdmins(response.content);
        } catch {
            toast.error("Failed to load administrative users");
        } finally {
            setIsLoading(false);
        }
    }, [searchKey]);

    useEffect(() => {
        fetchAdmins();
    }, [fetchAdmins]);

    const handleDeactivate = async (email: string) => {
        try {
            await adminService.deactivateAdmin(email, "Deactivated by administrator");
            toast.success("Admin deactivated successfully");
            fetchAdmins();
        } catch (error: any) {
            const diag = error?.headers?.['x-handled-locally'] ? '[LOCAL]' : 
                        error?.headers?.['x-proxied-to-java-fallback'] ? '[FALLBACK]' : '';
            const msg = `${diag} ${error?.message || error?.responseMessage || "Failed to deactivate admin"}`;
            toast.error(msg);
        }
    };

    const handleDelete = async (email: string) => {
        if (!confirm("Are you sure you want to PERMANENTLY delete this administrator? This action cannot be undone.")) {
            return;
        }
        try {
            await adminService.deleteAdmin(email);
            toast.success("Administrator record permanently deleted");
            fetchAdmins();
        } catch (error: any) {
            const diag = error?.headers?.['x-handled-locally'] ? '[LOCAL]' : 
                        error?.headers?.['x-proxied-to-java-fallback'] ? '[FALLBACK]' : '';
            const msg = `${diag} ${error?.message || error?.responseMessage || "Failed to delete administrator"}`;
            toast.error(msg);
        }
    };

    const getStatusBadge = (status: string) => {
        const s = status?.toUpperCase() || "PENDING";
        return (
            <div className={cn(
                "px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border shrink-0",
                s === "ACTIVE" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                s === "INACTIVE" ? "bg-slate-50 text-slate-400 border-slate-100" :
                "bg-rose-50 text-rose-600 border-rose-100"
            )}>
                {s}
            </div>
        );
    };

    return (
        <div className="space-y-4 pb-20 font-sans">
            {/* WordPress Style Header */}
            <div className="flex items-center gap-4 mb-2 mt-4">
                <h1 className="text-2xl font-normal text-slate-800">Users</h1>
                <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 px-3 text-xs border-teal-600 text-teal-600 font-medium hover:bg-teal-50"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    Add New User
                </Button>
            </div>

            {/* Sub Nav */}
            <div className="flex gap-3 text-[13px] text-slate-500 mb-4">
                <span className="font-semibold text-slate-800">All <span className="text-slate-500 font-normal">({admins.length})</span></span> | 
                <span className="text-teal-600 hover:underline cursor-pointer">Administrator <span className="text-slate-500 font-normal">({admins.length})</span></span>
            </div>

            {/* Top Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-2 gap-4">
                <div className="flex items-center gap-2">
                    <select className="text-[13px] border-slate-400 rounded-sm px-2 py-1 bg-white h-8 w-32 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-slate-700">
                        <option>Bulk actions</option>
                        <option value="delete">Delete</option>
                    </select>
                    <Button variant="outline" className="h-8 px-3 text-xs border-slate-400 text-slate-700 bg-slate-50 hover:bg-white rounded-sm">Apply</Button>
                </div>
                <div className="flex items-center gap-2">
                    <Input 
                        placeholder="" 
                        className="h-8 w-48 text-[13px] rounded-sm border-slate-400 focus:border-teal-500"
                        value={searchKey}
                        onChange={(e) => setSearchKey(e.target.value)}
                    />
                    <Button variant="outline" className="h-8 px-3 text-xs border-slate-400 text-slate-700 bg-slate-50 hover:bg-white rounded-sm">Search Users</Button>
                </div>
            </div>

            {/* WordPress Style Table */}
            <div className="bg-white border border-slate-300 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-[13px] text-slate-700 border-collapse">
                        <thead>
                            <tr className="border-b border-slate-300 bg-slate-50 text-slate-800">
                                <th className="w-10 py-2 px-3 text-center border-r border-slate-200">
                                    <input type="checkbox" className="rounded-sm border-slate-400" />
                                </th>
                                <th className="py-2 px-3 font-semibold">Username</th>
                                <th className="py-2 px-3 font-semibold">Name</th>
                                <th className="py-2 px-3 font-semibold">Email</th>
                                <th className="py-2 px-3 font-semibold">Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={`skeleton-${i}`} className="animate-pulse bg-white">
                                        <td className="py-3 px-3 border-r border-slate-100"></td>
                                        <td className="py-3 px-3"><div className="h-4 w-32 bg-slate-200 rounded" /></td>
                                        <td className="py-3 px-3"><div className="h-4 w-40 bg-slate-200 rounded" /></td>
                                        <td className="py-3 px-3"><div className="h-4 w-48 bg-slate-200 rounded" /></td>
                                        <td className="py-3 px-3"><div className="h-4 w-24 bg-slate-200 rounded" /></td>
                                    </tr>
                                ))
                            ) : admins.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 px-4 text-center text-slate-500">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                admins.map((admin, idx) => (
                                    <tr 
                                        key={admin.emailAddress}
                                        className={cn(
                                            "group transition-colors",
                                            idx % 2 === 0 ? "bg-white" : "bg-[#f9f9f9]"
                                        )}
                                    >
                                        <td className="w-10 py-3 px-3 text-center align-top border-r border-slate-100">
                                            <input type="checkbox" className="rounded-sm border-slate-400 mt-1" />
                                        </td>
                                        <td className="py-3 px-3 align-top">
                                            <div className="flex items-start gap-3">
                                                <div className="h-8 w-8 rounded-sm bg-slate-100 flex flex-shrink-0 items-center justify-center text-slate-600 font-bold text-xs mt-0.5">
                                                    {(admin.firstName || admin.username)[0].toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <strong className="text-teal-700 text-[14px]">@{admin.username}</strong>
                                                    <div className="flex flex-wrap gap-2 text-xs mt-1 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity min-h-[16px]">
                                                        <button 
                                                            onClick={() => router.push(`/admin/settings/admins/${encodeURIComponent(admin.emailAddress)}`)}
                                                            className="text-teal-600 hover:text-teal-800 hover:underline focus:opacity-100"
                                                        >
                                                            Edit
                                                        </button>
                                                        <span>|</span>
                                                        <button 
                                                            onClick={() => handleDelete(admin.emailAddress)}
                                                            className="text-rose-600 hover:text-rose-800 hover:underline focus:opacity-100"
                                                        >
                                                            Delete
                                                        </button>
                                                        <span>|</span>
                                                        <button 
                                                            onClick={() => router.push(`/admin/settings/admins/${encodeURIComponent(admin.emailAddress)}`)}
                                                            className="text-teal-600 hover:text-teal-800 hover:underline focus:opacity-100"
                                                        >
                                                            View
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-3 align-top text-slate-700">
                                            {admin.fullName || admin.username}
                                        </td>
                                        <td className="py-3 px-3 align-top">
                                            <a href={`mailto:${admin.emailAddress}`} className="text-teal-600 hover:underline">{admin.emailAddress}</a>
                                        </td>
                                        <td className="py-3 px-3 align-top text-slate-700">
                                            {admin.rolesAndPermissions?.map(rp => rp.name).join(", ") || "Administrator"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="bg-slate-50 border-t border-slate-300 py-2 px-3 flex justify-between items-center text-xs text-slate-500">
                    <div>{admins.length} items</div>
                </div>
            </div>
            <CreateUserModal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    fetchAdmins();
                }}
            />
        </div>
    );
}
