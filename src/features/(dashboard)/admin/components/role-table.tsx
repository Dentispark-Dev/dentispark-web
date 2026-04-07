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
    Lock,
    Sparkles,
    ShieldAlert
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
        <div className="space-y-8 pb-20 font-jakarta">
            {/* Governance Header */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-8 justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 h-40 w-40 bg-teal-50 rounded-bl-full opacity-40 -mr-10 -mt-10" />
                
                <div className="relative z-10 space-y-4 text-center md:text-left">
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                        <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-xl shadow-slate-200">
                            <ShieldAlert className="h-6 w-6" />
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Role <span className="text-teal-600">Permissions</span></h2>
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em] max-w-md">
                        System Architecture & Institutional Access Controls
                    </p>
                </div>

                <div className="flex gap-4 w-full md:w-auto relative z-10">
                    <Button
                        className="bg-slate-900 hover:bg-black text-white h-14 px-8 rounded-2xl shadow-xl shadow-slate-900/10 gap-3 font-black text-xs uppercase tracking-widest active:scale-95 transition-all group w-full md:w-auto"
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
                            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-pulse space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 rounded-2xl bg-slate-50" />
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 bg-slate-100 rounded-full w-2/3" />
                                        <div className="h-3 bg-slate-50 rounded-full w-1/3" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-3 bg-slate-50 rounded-full w-full" />
                                    <div className="h-3 bg-slate-50 rounded-full w-5/6" />
                                </div>
                            </div>
                        ))
                    ) : roles.length === 0 ? (
                        <div className="col-span-full py-24 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 flex flex-col items-center gap-4">
                            <div className="p-8 bg-slate-50 rounded-full text-slate-200">
                                <Lock className="h-10 w-10" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xl font-black text-slate-900 tracking-tight">Access Registry Empty</p>
                                <p className="text-slate-400 font-bold text-sm">Deploy the first role to establish access protocols.</p>
                            </div>
                        </div>
                    ) : (
                        roles.map((role, idx) => (
                            <motion.div
                                key={role.guid}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-teal-200/20 transition-all duration-500 relative group flex flex-col"
                            >
                                <div className="absolute top-8 right-8">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-slate-100 shadow-2xl">
                                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-2 text-center border-b border-slate-50 mb-1">Architecture Node</DropdownMenuLabel>
                                            <DropdownMenuItem className="rounded-xl font-bold text-sm gap-3 py-3 px-3 transition-colors cursor-pointer" onClick={() => onEditClick(role)}>
                                                <Edit2 className="h-4 w-4 text-teal-600" /> Modify Permissions
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-slate-50" />
                                            <DropdownMenuItem className="rounded-xl font-bold text-sm gap-3 py-3 px-3 text-rose-600 focus:bg-rose-50 focus:text-rose-700 transition-colors cursor-pointer">
                                                <Trash2 className="h-4 w-4" /> Terminate Node
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="flex items-center gap-5 mb-8">
                                    <div className="h-16 w-16 rounded-[1.25rem] bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                        <ShieldCheck className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-teal-600 transition-colors">
                                            {role.name}
                                        </h4>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black mt-1">Platform Architecture</p>
                                    </div>
                                </div>

                                <p className="text-[13px] font-bold text-slate-500 mb-10 flex-1 leading-relaxed line-clamp-3">
                                    {role.description || "Core operational objectives for this administrative node remain undefined."}
                                </p>

                                <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600">
                                        <Users className="h-4 w-4 text-slate-400" />
                                        <span className="text-[11px] font-black uppercase tracking-tight">{role.users || 0} Entities</span>
                                    </div>
                                    <Button
                                        variant="link"
                                        className="text-teal-600 p-0 h-auto text-[11px] font-black uppercase tracking-widest gap-2 flex hover:no-underline group/btn"
                                        onClick={() => onEditClick(role)}
                                    >
                                        Inspect Registry
                                        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
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
