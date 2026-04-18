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
    Users,
    ShieldAlert,
    ArrowRight,
    Trophy,
    Target,
    Lock
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

interface ModeratorTableProps {
    onInviteClick: () => void;
}

export function ModeratorTable({ onInviteClick }: ModeratorTableProps) {
    const router = useRouter();
    const [moderators, setModerators] = useState<AdminRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchKey, setSearchKey] = useState("");

    const fetchModerators = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await adminService.getAdminRecords({
                searchKey,
                page: 0,
                perPage: 100
            });

            const filtered = response.content.filter(admin =>
                !admin.rolesAndPermissions ||
                admin.rolesAndPermissions.length === 0 ||
                admin.rolesAndPermissions.some(rp => {
                    const name = rp.name.toLowerCase();
                    return name.includes("moderator") || name.includes("admin");
                })
            );

            setModerators(filtered);
        } catch {
            toast.error("Failed to load moderators");
        } finally {
            setIsLoading(false);
        }
    }, [searchKey]);

    useEffect(() => {
        fetchModerators();
    }, [fetchModerators]);

    const handleDeactivate = async (email: string) => {
        try {
            await adminService.deactivateAdmin(email, "Deactivated by super admin");
            toast.success("Moderator deactivated successfully");
            fetchModerators();
        } catch {
            toast.error("Failed to deactivate moderator");
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
            {/* Professional Header */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col xl:flex-row gap-8 justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 h-40 w-40 bg-blue-50 rounded-bl-full opacity-40 -mr-10 -mt-10" />
                
                <div className="relative z-10 space-y-3 text-center xl:text-left w-full xl:w-auto">
                    <div className="flex items-center gap-3 justify-center xl:justify-start">
                        <div className="p-2.5 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-200">
                            <Users className="h-5 w-5" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Moderator <span className="text-blue-600">Hub</span></h2>
                    </div>
                    <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.3em] max-w-md">
                        Platform Ethics & Community Integrity Oversight
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto relative z-10">
                    <div className="relative group min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <Input
                            placeholder="Moderator Search..."
                            className="pl-12 h-12 bg-slate-50/50 border-slate-100 rounded-2xl focus:bg-white focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-600 text-sm"
                            value={searchKey}
                            onChange={(e) => setSearchKey(e.target.value)}
                        />
                    </div>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 rounded-2xl shadow-xl shadow-blue-900/10 gap-3 font-extrabold text-[11px] uppercase tracking-widest active:scale-95 transition-all group"
                        onClick={onInviteClick}
                    >
                        <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        Onboard Moderator
                    </Button>
                </div>
            </div>

            {/* Premium Interactive Table */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-10 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.25em]">Moderator Entity</th>
                                <th className="px-10 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.25em]">Namespace</th>
                                <th className="px-10 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.25em]">Permission Set</th>
                                <th className="px-10 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.25em]">Status</th>
                                <th className="px-10 py-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.25em] text-right">Actions</th>
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
                                ) : moderators.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-24 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                                                    <Users className="h-10 w-10" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xl font-extrabold text-slate-900 tracking-tight">Zero Moderator Hits</p>
                                                    <p className="text-slate-400 font-bold text-sm">No moderator entities matching your query.</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    moderators.map((moderator, idx) => (
                                        <motion.tr 
                                            key={moderator.emailAddress}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            onClick={() => router.push(`/admin/moderators/${encodeURIComponent(moderator.emailAddress)}`)}
                                            className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                                        >
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="relative">
                                                        <div className="h-14 w-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-extrabold shadow-sm group-hover:scale-105 group-hover:rotate-3 transition-transform">
                                                            {(moderator.firstName || moderator.username)[0].toUpperCase()}
                                                        </div>
                                                        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center">
                                                            <div className={cn(
                                                                "h-2.5 w-2.5 rounded-full",
                                                                moderator.status === "ACTIVE" ? "bg-emerald-500" : "bg-slate-300"
                                                            )} />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">{moderator.fullName || moderator.username}</div>
                                                        <div className="text-[11px] font-bold text-slate-400 mt-0.5">{moderator.emailAddress}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <span className="text-[13px] font-bold text-slate-600 bg-slate-100/80 px-2.5 py-1 rounded-lg">@{moderator.username}</span>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {moderator.rolesAndPermissions?.map((rp) => (
                                                        <span key={rp.guid} className="px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest bg-white text-slate-600 rounded-md border border-slate-200 shadow-sm">
                                                            {rp.name}
                                                        </span>
                                                    )) || <span className="text-xs text-slate-400 font-bold">Standard Monitor</span>}
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-sm">
                                                {getStatusBadge(moderator.status)}
                                            </td>
                                            <td className="px-10 py-6 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-md rounded-xl transition-all">
                                                            <MoreHorizontal className="h-5 w-5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-slate-100 shadow-2xl">
                                                        <DropdownMenuLabel className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3 py-2">Ethics Terminal</DropdownMenuLabel>
                                                        <DropdownMenuSeparator className="bg-slate-50" />
                                                        <DropdownMenuItem className="rounded-xl font-bold text-sm gap-3 py-3 px-3 transition-colors cursor-pointer">
                                                            <ShieldAlert className="h-4 w-4 text-blue-600" /> Adjust Permissions
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="rounded-xl font-bold text-sm gap-3 py-3 px-3 transition-colors cursor-pointer">
                                                            <Mail className="h-4 w-4 text-emerald-600" /> Contact Entity
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-slate-50" />
                                                        {moderator.status === "ACTIVE" ? (
                                                            <DropdownMenuItem
                                                                className="rounded-xl font-bold text-sm gap-3 py-3 px-3 text-rose-600 focus:bg-rose-50 focus:text-rose-700 transition-colors cursor-pointer"
                                                                onClick={() => handleDeactivate(moderator.emailAddress)}
                                                            >
                                                                <UserX className="h-4 w-4" /> Revoke Trust
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem className="rounded-xl font-bold text-sm gap-3 py-3 px-3 text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700 transition-colors cursor-pointer">
                                                                <UserCheck className="h-4 w-4" /> Restore Trust
                                                            </DropdownMenuItem>
                                                        )}
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
        </div>
    );
}
