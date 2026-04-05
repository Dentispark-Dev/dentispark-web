"use client";

import { useState, useEffect } from "react";
import {
    MoreHorizontal,
    Loader2,
    Shield,
    Users,
    Trash2,
    Edit2,
    ShieldCheck,
    Settings,
    ArrowRight,
    Lock
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
    DropdownMenuLabel
} from "@/src/components/ui/dropdown-menu";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
        <div className="space-y-8 pb-12">
            {/* Governance Header */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row gap-8 justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-50 rounded-bl-full opacity-40 -mr-10 -mt-10" />
                
                <div className="relative z-10 space-y-2 text-center md:text-left">
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                        <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                            <Shield className="h-6 w-6" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight font-sora">Governance Hub</h2>
                    </div>
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-[0.2em] max-w-md">
                        Institutional Access Control & Administrative Permissions
                    </p>
                </div>

                <div className="flex gap-4 w-full md:w-auto relative z-10">
                    <Button
                        className="bg-slate-900 hover:bg-black text-white h-14 px-8 rounded-2xl shadow-xl shadow-black/10 gap-3 font-bold text-sm active:scale-95 transition-all group w-full md:w-auto"
                        onClick={onCreateClick}
                    >
                        <ShieldCheck className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        Initialize New Role
                    </Button>
                </div>
            </div>

            {/* Role Intelligence Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm animate-pulse space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 rounded-2xl bg-gray-100" />
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 bg-gray-100 rounded-full w-2/3" />
                                        <div className="h-3 bg-gray-50 rounded-full w-1/3" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-3 bg-gray-50 rounded-full w-full" />
                                    <div className="h-3 bg-gray-50 rounded-full w-5/6" />
                                </div>
                            </div>
                        ))
                    ) : roles.length === 0 ? (
                        <div className="col-span-full py-24 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 flex flex-col items-center gap-4">
                            <div className="p-6 bg-gray-50 rounded-full">
                                <Lock className="h-10 w-10 text-gray-300" />
                            </div>
                            <div>
                                <p className="text-xl font-black text-gray-900 tracking-tight font-sora">Registry Empty</p>
                                <p className="text-gray-400 font-medium">Initialize the first administrative role to begin.</p>
                            </div>
                        </div>
                    ) : (
                        roles.map((role, idx) => (
                            <motion.div
                                key={role.guid}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-indigo-200/20 transition-all duration-300 relative group flex flex-col"
                            >
                                <div className="absolute top-6 right-6">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-black hover:bg-gray-50 rounded-xl transition-all">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-gray-100 shadow-2xl">
                                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-3 py-2">Role Management</DropdownMenuLabel>
                                            <DropdownMenuSeparator className="bg-gray-50" />
                                            <DropdownMenuItem className="rounded-xl font-bold text-sm gap-3 py-3" onClick={() => onEditClick(role)}>
                                                <Edit2 className="h-4 w-4 text-indigo-500" /> Modify Permissions
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-gray-50" />
                                            <DropdownMenuItem className="rounded-xl font-bold text-sm gap-3 py-3 text-rose-600 focus:bg-rose-50 focus:text-rose-700">
                                                <Trash2 className="h-4 w-4" /> Terminate Role
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="flex items-center gap-5 mb-6">
                                    <div className="h-16 w-16 rounded-[1.25rem] bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                        <ShieldCheck className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-gray-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors font-sora">
                                            {role.name}
                                        </h4>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black mt-1">Platform Role</p>
                                    </div>
                                </div>

                                <p className="text-sm font-medium text-gray-500 mb-8 flex-1 leading-relaxed decoration-indigo-500/30 line-clamp-3">
                                    {role.description || "The core objectives for this role haven't been defined yet."}
                                </p>

                                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600">
                                        <Users className="h-4 w-4 text-slate-400" />
                                        <span className="text-xs font-black tracking-tight">{role.users || 0} Members</span>
                                    </div>
                                    <Button
                                        variant="link"
                                        className="text-indigo-600 p-0 h-auto text-xs font-black uppercase tracking-widest gap-2 flex hover:no-underline group/btn"
                                        onClick={() => onEditClick(role)}
                                    >
                                        Registry
                                        <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
