"use client";
import { LooseRecord } from "@/src/types/loose";


import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/src/connection/admin-service";
import {
    Mail,
    Phone,
    Calendar,
    User,
    CheckCircle,
    XCircle,
    AlertCircle,
    Loader2,
    ArrowLeft,
    Shield,
    ShieldCheck,
    ShieldAlert,
    History,
    Sparkles,
    ChevronDown,
    ChevronUp,
    Settings,
    Fingerprint,
    Globe,
    Lock,
    ExternalLink,
    ArrowUpRight,
    Terminal,
    Key
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";

interface AdminProfileViewProps {
    adminEmail: string; // Admins are identified by email in many endpoints
}

type TabKey = "dossier" | "governance" | "activity" | "security";

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "dossier", label: "Identity Dossier", icon: <User className="h-4 w-4" /> },
    { key: "governance", label: "Governance Hub", icon: <Shield className="h-4 w-4" /> },
    { key: "activity", label: "Operation Log", icon: <History className="h-4 w-4" /> },
    { key: "security", label: "Security Terminal", icon: <Key className="h-4 w-4" /> },
];

export function AdminProfileView({ adminEmail }: AdminProfileViewProps) {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabKey>("dossier");

    // Fetch all admins and find the specific one (as there's no single detail endpoint)
    const { data: admins, isLoading, error } = useQuery({
        queryKey: ["admin-records-list"],
        queryFn: () => adminService.getAdminRecords({ page: 0, perPage: 500 }),
    });

    const admin = admins?.content.find(a => a.emailAddress === decodeURIComponent(adminEmail));

    const deactivationMutation = useMutation({
        mutationFn: () => adminService.deactivateAdmin(decodeURIComponent(adminEmail), "Deactivated via administrative terminal"),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-records-list"] });
            toast.success("Identity access revoked");
        },
        onError: () => {
            toast.error("Handshake failed during revocation");
        }
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] gap-6 bg-white font-jakarta">
                <div className="relative">
                    <div className="h-20 w-20 rounded-full border-t-2 border-slate-900 animate-spin" />
                    <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-slate-900 animate-pulse" />
                </div>
                <p className="text-slate-400 font-extrabold uppercase tracking-[0.3em] text-[10px]">Authorizing Network Access...</p>
            </div>
        );
    }

    if (error || !admin) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] space-y-8 text-center max-w-xl mx-auto bg-white p-16 rounded-[3rem] border border-slate-100 shadow-2xl font-jakarta">
                <div className="p-6 bg-rose-50 rounded-full text-rose-600">
                    <ShieldAlert className="h-14 w-14" />
                </div>
                <div className="space-y-3">
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Identity Synchronization Failure</h3>
                    <p className="text-slate-400 font-bold text-sm leading-relaxed uppercase tracking-widest max-w-sm mx-auto opacity-60">The administrative hub failed to establish a secure handshake with the registry entry.</p>
                </div>
                <Button 
                    onClick={() => router.back()}
                    variant="outline" 
                    className="rounded-[1.5rem] px-12 h-14 border-slate-200 font-extrabold text-xs uppercase tracking-widest transition-all hover:bg-slate-50 shadow-sm"
                >
                    Return to Hub
                </Button>
            </div>
        );
    }

    const initials = (admin.fullName || admin.username)
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="min-h-screen bg-white pb-20 font-jakarta">
            {/* ── High-Trust Identity Header ── */}
            <div className="bg-white p-10 md:p-16 border-b border-slate-50 flex flex-col md:flex-row gap-12 justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 h-80 w-80 bg-teal-50 rounded-bl-full opacity-40 pointer-events-none -mr-20 -mt-20" />
                
                <div className="flex-1 flex flex-col md:flex-row items-center gap-10 relative z-10 w-full">
                    <div className="relative group">
                        <div className="h-32 w-32 rounded-[2.5rem] bg-slate-900 border-[6px] border-white shadow-2xl flex items-center justify-center overflow-hidden group-hover:scale-105 group-hover:rotate-3 transition-transform duration-500">
                           <span className="text-4xl font-extrabold text-white">{initials}</span>
                        </div>
                        <div className={cn(
                            "absolute -bottom-1 -right-1 h-10 w-10 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center",
                            admin.status === "ACTIVE" ? "bg-emerald-500" : "bg-slate-300"
                        )}>
                            {admin.status === "ACTIVE" ? (
                                <CheckCircle className="h-5 w-5 text-white" />
                            ) : (
                                <Lock className="h-5 w-5 text-white" />
                            )}
                        </div>
                    </div>

                    <div className="space-y-5 text-center md:text-left flex-1 min-w-0">
                        <div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-3">
                                <Badge variant="outline" className="bg-teal-50 text-teal-600 border-teal-200 px-4 py-1.5 font-extrabold text-[10px] tracking-[0.25em] rounded-full uppercase">
                                    Architect Entity
                                </Badge>
                                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest opacity-60">Namespace: @{admin.username}</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                {admin.fullName || admin.username}
                            </h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-8 mt-5 text-sm text-slate-500 font-bold uppercase tracking-widest">
                                <span className="flex items-center gap-2 opacity-60">
                                    <Mail className="h-4 w-4 text-teal-600" />
                                    {admin.emailAddress}
                                </span>
                                <span className="flex items-center gap-2 opacity-60">
                                    <Globe className="h-4 w-4 text-teal-600" />
                                    Global Permission Set
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 relative z-10 shrink-0">
                    <Button 
                        variant="outline" 
                        onClick={() => router.back()}
                        className="h-14 px-8 rounded-2xl border-slate-100 bg-white text-slate-400 font-extrabold text-xs gap-3 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95 shadow-sm uppercase tracking-widest"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Exit Dossier
                    </Button>
                    <Button className="h-14 px-10 rounded-2xl bg-teal-600 text-white font-extrabold text-xs hover:bg-teal-700 transition-all active:scale-95 shadow-xl shadow-teal-100 uppercase tracking-widest gap-3">
                        <Terminal className="h-5 w-5" />
                        Execute Ping
                    </Button>
                </div>
            </div>

            {/* ── Sub-Routing Hub ── */}
            <div className="container mx-auto px-10 mt-12">
                <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-[2rem] w-fit border border-slate-100 mb-12 shadow-inner">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                "flex items-center gap-3 px-8 py-4 rounded-[1.5rem] text-[10px] font-extrabold transition-all duration-300 uppercase tracking-widest",
                                activeTab === tab.key
                                    ? "bg-white shadow-xl text-teal-600 text-[11px]"
                                    : "text-slate-400 hover:text-slate-900"
                            )}
                        >
                            <span className={cn("transition-colors", activeTab === tab.key ? "text-teal-600" : "text-slate-400")}>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === "dossier" && (
                        <motion.div
                            key="dossier"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-10"
                        >
                            <div className="lg:col-span-8 space-y-10">
                                {/* Core Identity Metrics */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <MetricPill label="Last Protocol Activity" value="2 Hours Ago" icon={History} />
                                    <MetricPill label="Clearance Rank" value="Senior Admin" icon={ShieldCheck} />
                                    <MetricPill label="Trust Score" value="99.9%" icon={Sparkles} />
                                </div>

                                {/* About / Governance Context */}
                                <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 h-40 w-40 bg-teal-50 rounded-full opacity-30 -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-700" />
                                    
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-3 bg-slate-900 rounded-2xl text-white">
                                            <Fingerprint className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Identity Context</h3>
                                    </div>
                                    
                                    <p className="text-slate-500 font-bold text-sm leading-relaxed mb-8 max-w-2xl">
                                        This administrative entity is authorized for complex system operations, including role governance, institutional verification, and platform integrity monitoring. All operations performed by this node are signed and stored in the immutable audit log.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 opacity-60">Assigned Domain</p>
                                            <p className="text-sm font-extrabold text-slate-900">Institutional Governance</p>
                                        </div>
                                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 opacity-60">Activation Date</p>
                                            <p className="text-sm font-extrabold text-slate-900">January 12, 2024</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-4 space-y-10">
                                {/* Quick Access Terminal */}
                                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white space-y-8 shadow-2xl relative overflow-hidden">
                                     <div className="absolute bottom-0 right-0 h-40 w-40 bg-white/5 rounded-full -mb-20 -mr-20" />
                                     <div className="space-y-2">
                                         <h3 className="text-xl font-extrabold tracking-tight flex items-center gap-3">
                                             <Terminal className="h-5 w-5 text-teal-400" />
                                             Operations Terminal
                                         </h3>
                                         <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Execute Security Protocols</p>
                                     </div>

                                     <div className="space-y-4 relative z-10">
                                         <Button 
                                            className="w-full h-14 bg-white hover:bg-slate-100 text-slate-900 rounded-2xl font-extrabold text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95"
                                            onClick={() => setActiveTab("governance")}
                                         >
                                             Elevate Permissions
                                         </Button>
                                         <Button 
                                            variant="outline" 
                                            className="w-full h-14 border-white/10 hover:border-white/40 bg-transparent text-white rounded-2xl font-extrabold text-[10px] uppercase tracking-[0.2em] transition-all"
                                            onClick={() => deactivationMutation.mutate()}
                                         >
                                            {admin.status === "ACTIVE" ? "Revoke Access" : "Reinstate Access"}
                                         </Button>
                                     </div>
                                </div>

                                {/* Security Overview */}
                                <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest opacity-60">Security State</h3>
                                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                                                <Key className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">MFA Status</p>
                                                <p className="text-sm font-extrabold text-slate-900">Biometric Verified</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "governance" && (
                        <motion.div
                            key="governance"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[3rem] border border-slate-100 p-16 space-y-12 shadow-sm relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 h-96 w-96 bg-teal-50/30 rounded-full blur-3xl -mr-48 -mt-48" />
                            
                            <div className="relative z-10 flex flex-col md:flex-row gap-10 justify-between items-start">
                                <div className="space-y-3">
                                    <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">Role Intelligence Grid</h3>
                                    <p className="text-slate-400 font-bold text-sm leading-relaxed uppercase tracking-widest max-w-xl">Granular audit of architectural clearance and system permission nodes assigned to this identity.</p>
                                </div>
                                <div className="p-6 bg-slate-900 rounded-[2rem] text-white flex items-center justify-center shadow-2xl">
                                    <Shield className="h-10 w-10" />
                                </div>
                            </div>

                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {admin.rolesAndPermissions?.map((role, i) => (
                                    <div key={role.guid} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] group hover:bg-white hover:shadow-2xl hover:shadow-teal-100/50 transition-all duration-500">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="h-12 w-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                                <ShieldCheck className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 opacity-60">System Role</p>
                                                <h4 className="text-lg font-extrabold text-slate-900 leading-tight group-hover:text-teal-600 transition-colors">{role.name}</h4>
                                            </div>
                                        </div>
                                        <div className="pt-6 border-t border-slate-100">
                                            <Button variant="link" className="p-0 h-auto text-[10px] font-extrabold text-slate-400 hover:text-teal-600 uppercase tracking-widest flex items-center gap-2 group/btn">
                                                Inspect Capabilities
                                                <ArrowUpRight className="h-3 w-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                            </Button>
                                        </div>
                                    </div>
                                )) || (
                                    <div className="col-span-full py-20 text-center">
                                        <p className="text-slate-400 font-bold">No custom governance nodes assigned.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function MetricPill({ label, value, icon: Icon }: { label: string; value: string; icon: LooseRecord }) {
    return (
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:text-teal-600 transition-colors">
                    <Icon className="h-4 w-4" />
                </div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest opacity-60">{label}</p>
            </div>
            <p className="text-lg font-extrabold text-slate-900 ml-9">{value}</p>
        </div>
    );
}
