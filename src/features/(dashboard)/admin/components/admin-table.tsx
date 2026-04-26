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
        } catch {
            toast.error("Failed to deactivate admin");
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
        } catch {
            toast.error("Failed to delete administrator");
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
        <div className="space-y-8 pb-20 font-jakarta">
            {/* High-Fidelity Header */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-8 justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 h-40 w-40 bg-teal-50 rounded-bl-full opacity-40 -mr-10 -mt-10" />
                
                <div className="relative z-10 space-y-4 text-center md:text-left">
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                        <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-xl shadow-slate-200">
                            <Shield className="h-6 w-6" />
                        </div>
                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Admin <span className="text-teal-600">Council</span></h2>
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em] max-w-md">
                        Institutional Governance & High-Trust Operations
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto relative z-10">
                    <div className="relative group min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                        <Input
                            placeholder="Architect Search..."
                            className="pl-12 h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:bg-white focus:ring-teal-500/20 focus:border-teal-500 transition-all font-bold text-slate-600"
                            value={searchKey}
                            onChange={(e) => setSearchKey(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button
                            className="bg-slate-900 hover:bg-black text-white h-14 px-8 rounded-2xl shadow-xl gap-3 font-extrabold text-xs uppercase tracking-widest active:scale-95 transition-all group"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            <Plus className="h-5 w-5 group-hover:scale-110 transition-transform" />
                            Direct Create
                        </Button>
                        <Button
                            className="bg-teal-600 hover:bg-teal-700 text-white h-14 px-8 rounded-2xl shadow-xl shadow-teal-900/10 gap-3 font-extrabold text-xs uppercase tracking-widest active:scale-95 transition-all group"
                            onClick={onInviteClick}
                        >
                            <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
                            Authorize
                        </Button>
                    </div>
                </div>
            </div>

            {/* Premium Interactive Directory */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-10 py-6 text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.25em]">Administrative Architect</th>
                                <th className="px-10 py-6 text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.25em]">Namespace</th>
                                <th className="px-10 py-6 text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.25em]">Governance Roles</th>
                                <th className="px-10 py-6 text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.25em]">Clearance</th>
                                <th className="px-10 py-6 text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.25em] text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <AnimatePresence mode="popLayout">
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={`skeleton-${i}`} className="animate-pulse">
                                            <td colSpan={5} className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-14 w-14 rounded-2xl bg-slate-100" />
                                                    <div className="space-y-2">
                                                        <div className="h-4 w-40 bg-slate-100 rounded-full" />
                                                        <div className="h-3 w-24 bg-slate-50 rounded-full" />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : admins.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-24 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                                                    <Lock className="h-10 w-10" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xl font-extrabold text-slate-900 tracking-tight">Zero Registry Hits</p>
                                                    <p className="text-slate-400 font-bold text-sm">No administrative entities matching your query.</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    admins.map((admin, idx) => (
                                        <motion.tr 
                                            key={admin.emailAddress}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            onClick={() => router.push(`/admin/settings/admins/${encodeURIComponent(admin.emailAddress)}`)}
                                            className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                                        >
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="relative">
                                                        <div className="h-14 w-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 font-extrabold shadow-sm group-hover:scale-105 group-hover:rotate-3 transition-transform">
                                                            {(admin.firstName || admin.username)[0].toUpperCase()}
                                                        </div>
                                                        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center">
                                                            <div className={cn(
                                                                "h-2.5 w-2.5 rounded-full",
                                                                admin.status === "ACTIVE" ? "bg-emerald-500" : "bg-slate-300"
                                                            )} />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-extrabold text-slate-900 group-hover:text-teal-600 transition-colors">{admin.fullName || admin.username}</div>
                                                        <div className="text-[11px] font-bold text-slate-400 mt-0.5">{admin.emailAddress}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <span className="text-[13px] font-bold text-slate-600 bg-slate-100/80 px-2.5 py-1 rounded-lg">@{admin.username}</span>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {admin.rolesAndPermissions?.map((rp) => (
                                                        <span key={rp.guid} className="px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest bg-white text-slate-600 rounded-md border border-slate-200 shadow-sm">
                                                            {rp.name}
                                                        </span>
                                                    )) || <span className="text-xs text-slate-400 font-bold">Standard Access</span>}
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-sm">
                                                {getStatusBadge(admin.status)}
                                            </td>
                                            <td className="px-10 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-md rounded-xl transition-all">
                                                            <MoreHorizontal className="h-5 w-5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-slate-100 shadow-2xl">
                                                        <DropdownMenuLabel className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3 py-2">Operations Terminal</DropdownMenuLabel>
                                                        <DropdownMenuSeparator className="bg-slate-50" />
                                                        <DropdownMenuItem 
                                                            className="rounded-xl font-bold text-sm gap-3 py-3 px-3 transition-colors cursor-pointer"
                                                            onClick={() => router.push(`/admin/settings/admins/${encodeURIComponent(admin.emailAddress)}`)}
                                                        >
                                                            <ArrowRight className="h-4 w-4 text-teal-600" /> View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="rounded-xl font-bold text-sm gap-3 py-3 px-3 transition-colors cursor-pointer">
                                                            <ShieldCheck className="h-4 w-4 text-teal-600" /> Modify Clearance
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-slate-50" />
                                                        {admin.status === "ACTIVE" ? (
                                                            <DropdownMenuItem
                                                                className="rounded-xl font-bold text-sm gap-3 py-3 px-3 text-rose-600 focus:bg-rose-50 focus:text-rose-700 transition-colors cursor-pointer"
                                                                onClick={() => handleDeactivate(admin.emailAddress)}
                                                            >
                                                                <ShieldX className="h-4 w-4" /> Revoke Access
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem className="rounded-xl font-bold text-sm gap-3 py-3 px-3 text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700 transition-colors cursor-pointer">
                                                                <UserCheck className="h-4 w-4" /> Restore Access
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem
                                                            className="rounded-xl font-bold text-sm gap-3 py-3 px-3 text-rose-600 focus:bg-rose-50 focus:text-rose-700 transition-colors cursor-pointer"
                                                            onClick={() => handleDelete(admin.emailAddress)}
                                                        >
                                                            <Trash2 className="h-4 w-4" /> Delete Account
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
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
