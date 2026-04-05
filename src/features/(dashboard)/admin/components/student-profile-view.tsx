"use client";

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
    GraduationCap,
    MapPin,
    Target,
    BookOpen,
    TrendingUp,
    Award,
    ChevronDown,
    ChevronUp,
    ClipboardList,
    Lightbulb,
    History,
    Sparkles,
    Link as LinkIcon,
    ArrowUpRight,
    Search,
    ShieldCheck,
    Settings
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";

interface StudentProfileViewProps {
    studentId: string;
}

type TabKey = "profile" | "insights" | "history" | "management";

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "profile", label: "Dossier", icon: <User className="h-4 w-4" /> },
    { key: "insights", label: "Readiness Pulse", icon: <Sparkles className="h-4 w-4" /> },
    { key: "history", label: "Academic Log", icon: <History className="h-4 w-4" /> },
    { key: "management", label: "Administrative", icon: <ShieldCheck className="h-4 w-4" /> },
];

export function StudentProfileView({ studentId }: StudentProfileViewProps) {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabKey>("profile");

    const { data: student, isLoading, error } = useQuery({
        queryKey: ["admin-student-detail", studentId],
        queryFn: () => adminService.getStudentDetail(studentId),
    });

    const updateStatusMutation = useMutation({
        mutationFn: (status: string) => adminService.updateStudentStatus(studentId, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-student-detail", studentId] });
            toast.success("Identity status updated");
        },
        onError: () => {
            toast.error("Failed to propagate status change");
        }
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] gap-6 bg-white">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-t-2 border-primary-600 animate-spin" />
                    <User className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary-600 animate-pulse" />
                </div>
                <p className="text-greys-600 font-medium tracking-tight font-jakarta animate-pulse">Syncing Hub Data...</p>
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center max-w-lg mx-auto bg-white p-12 rounded-3xl border border-greys-300">
                <div className="p-4 bg-error-50 rounded-full text-error-600">
                    <AlertCircle className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-text-heading">Registry Synchronisation Failure</h3>
                    <p className="text-greys-600 text-sm leading-relaxed">The administrative hub was unable to establish a secure handshake with the primary student database.</p>
                </div>
                <Button asChild variant="outline" className="rounded-xl px-10 h-12 border-greys-300 font-bold text-xs uppercase tracking-widest transition-all hover:bg-greys-100">
                    <Link href="/admin/students">Return to Student Hub</Link>
                </Button>
            </div>
        );
    }

    const fullName = `${student.firstName} ${student.lastName}`;
    const targetSchoolsArr = student.goals
        ? student.goals.split(",").map((g: string) => g.trim()).filter(Boolean)
        : [];

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* ── Individual Identity Header ── */}
            <div className="bg-white p-8 md:p-12 border-b border-greys-300 flex flex-col md:flex-row gap-10 justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 h-64 w-64 bg-primary-50 rounded-bl-full opacity-40 pointer-events-none" />
                
                <div className="flex-1 flex flex-col md:flex-row items-center gap-8 relative z-10 w-full">
                    <AvatarRing name={fullName} />
                    <div className="space-y-4 text-center md:text-left flex-1 min-w-0">
                        <div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-2">
                                <Badge variant="outline" className="bg-primary-50 text-primary-600 border-primary-200 px-4 py-1.5 font-bold text-[10px] tracking-[0.25em] rounded-full uppercase leading-none">
                                    Identity Profile
                                </Badge>
                                <span className="text-[11px] font-bold text-greys-400 uppercase tracking-widest opacity-60 leading-none">SID: {student.sid}</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-semibold text-text-heading tracking-tight leading-tight font-jakarta">
                                {student.firstName} <span className="text-primary-600">{student.lastName}</span>
                            </h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-4 text-sm text-greys-600 font-medium font-jakarta">
                                <span className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-primary-500 opacity-60" />
                                    {student.emailAddress}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary-500 opacity-60" />
                                    Academic Year {student.currentAcademicYear || "TBD"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 relative z-10 shrink-0">
                    <Button 
                        variant="outline" 
                        onClick={() => router.back()}
                        className="h-12 px-6 rounded-xl border-greys-300 bg-white text-text-color font-bold text-xs gap-3 hover:bg-greys-100 transition-all active:scale-95 shadow-sm uppercase tracking-widest leading-none font-jakarta"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Registry
                    </Button>
                    <Button className="h-12 px-10 rounded-xl bg-primary-600 text-white font-bold text-xs hover:bg-primary-500 transition-all active:scale-95 shadow-lg shadow-primary-200 uppercase tracking-widest leading-none font-jakarta">
                        Send Message
                    </Button>
                </div>
            </div>

            {/* ── Navigation Hub ── */}
            <div className="container mx-auto px-6 mt-10">
                <div className="flex flex-wrap gap-2 p-1.5 bg-greys-100 rounded-2xl w-fit border border-greys-300 mb-10">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                "flex items-center gap-3 px-8 py-3.5 rounded-xl text-xs font-bold transition-all duration-300 uppercase tracking-widest leading-none font-jakarta",
                                activeTab === tab.key
                                    ? "bg-white shadow-xl text-primary-600 ring-1 ring-black/5"
                                    : "text-greys-400 hover:text-text-color hover:bg-greys-200/50"
                            )}
                        >
                            <span className={cn("transition-colors", activeTab === tab.key ? "text-primary-600" : "text-greys-400")}>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === "profile" && (
                        <motion.div
                            key="profile"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-10"
                        >
                            <div className="lg:col-span-8 space-y-10">
                                {/* Academic Milestone Pathway */}
                                <div className="bg-white rounded-3xl border border-greys-300 p-10 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 h-40 w-40 bg-primary-50 rounded-full opacity-30 -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-700" />
                                    
                                    <div className="flex items-center gap-2 mb-12">
                                        <div className="p-2.5 bg-primary-50 rounded-xl text-primary-600">
                                            <TrendingUp className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-text-heading font-jakarta">Admission Milestone Pathway</h3>
                                    </div>
                                    
                                    <div className="relative flex justify-between items-start px-2">
                                        <div className="absolute top-[18px] left-0 w-full h-[3px] bg-greys-100 rounded-full" />
                                        <div 
                                            className="absolute top-[18px] left-0 h-[3px] bg-primary-600 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(18,172,117,0.3)]" 
                                            style={{ width: student.ucatScore ? (student.whyDentistry ? "100%" : "66%") : "33%" }}
                                        />
                                        
                                        {[
                                            { label: "Profile", icon: User, active: true },
                                            { label: "Aptitude", icon: Award, active: !!student.ucatScore },
                                            { label: "Statement", icon: BookOpen, active: !!student.whyDentistry },
                                            { label: "Goals", icon: GraduationCap, active: targetSchoolsArr.length > 0 },
                                        ].map((step, i) => (
                                            <div key={i} className="relative z-10 flex flex-col items-center gap-5">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-full flex items-center justify-center transition-all duration-500 border-[3px] border-white shadow-md",
                                                    step.active ? "bg-primary-600 text-white scale-110" : "bg-greys-200 text-greys-400"
                                                )}>
                                                    <step.icon className="h-4 w-4" />
                                                </div>
                                                <span className={cn("text-[10px] font-bold uppercase tracking-widest text-center max-w-[80px] font-jakarta", step.active ? "text-text-heading" : "text-greys-400")}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Detailed Attributes */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white rounded-3xl border border-greys-300 p-10 space-y-8">
                                        <h3 className="text-lg font-semibold text-text-heading flex items-center gap-3 font-jakarta">
                                            <Target className="h-5 w-5 text-primary-600" />
                                            Core Profile Attributes
                                        </h3>
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center py-2 border-b border-greys-100">
                                                <span className="text-xs font-bold text-greys-400 uppercase tracking-widest font-jakarta">Entry Gateway</span>
                                                <span className="text-sm font-semibold text-text-heading font-jakarta">{student.dentalSchoolGateway || "Standard Entry"}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-greys-100">
                                                <span className="text-xs font-bold text-greys-400 uppercase tracking-widest font-jakarta">UCAT Score</span>
                                                <span className="text-sm font-semibold text-primary-600 font-jakarta">{student.ucatScore || "Not Logged"}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-greys-100">
                                                <span className="text-xs font-bold text-greys-400 uppercase tracking-widest font-jakarta">CASPer Node</span>
                                                <span className="text-sm font-semibold text-indigo-600 font-jakarta">{student.casperScore || "Pending"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-3xl border border-greys-300 p-10 space-y-8">
                                        <h3 className="text-lg font-semibold text-text-heading flex items-center gap-3 font-jakarta">
                                            <Sparkles className="h-5 w-5 text-primary-600" />
                                            Competitive Standing
                                        </h3>
                                        <div className="space-y-4">
                                            {student.whyDentistry ? (
                                                <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100">
                                                    <p className="text-[11px] font-bold text-primary-700 uppercase tracking-widest mb-1 italic font-jakarta">Personal Motivation Logged</p>
                                                    <p className="text-xs text-text-heading font-medium leading-relaxed italic group-hover:text-primary-700 transition-colors font-jakarta">
                                                        &ldquo;{student.whyDentistry.slice(0, 120)}...&rdquo;
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="p-4 bg-greys-100 rounded-2xl text-center">
                                                    <p className="text-xs font-medium text-greys-500 font-jakarta">No motivation statement provided.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-4 space-y-8">
                                {/* Linked Mentors & Partners */}
                                <div className="bg-greys-100 rounded-3xl border border-greys-300 p-8 space-y-6">
                                    <h3 className="text-[10px] font-bold text-greys-500 uppercase tracking-[0.2em] px-2 opacity-60 font-jakarta">Linked Ecosystem Units</h3>
                                    <div className="space-y-4">
                                        <div className="bg-white p-5 rounded-2xl border border-greys-300 flex items-center justify-between group hover:border-primary-400 transition-all cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                                                    <GraduationCap className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-bold text-greys-400 uppercase tracking-widest leading-none mb-1 font-jakarta">Primary Mentor</p>
                                                    <p className="text-xs font-semibold text-text-heading group-hover:text-primary-600 transition-colors font-jakarta">Dr. Jonathan Smith</p>
                                                </div>
                                            </div>
                                            <ArrowUpRight className="h-4 w-4 text-greys-300 group-hover:text-primary-600" />
                                        </div>
                                        <div className="bg-white p-5 rounded-2xl border border-greys-300 flex items-center justify-between group hover:border-primary-400 transition-all cursor-pointer text-greys-400">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-greys-100 border border-greys-300 flex items-center justify-center">
                                                    <BookOpen className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-bold uppercase tracking-widest opacity-60 leading-none mb-1 font-jakarta">University Node</p>
                                                    <p className="text-xs font-semibold font-jakarta">Multiple Targets</p>
                                                </div>
                                            </div>
                                            <LinkIcon className="h-4 w-4 opacity-40" />
                                        </div>
                                    </div>
                                </div>

                                {/* Account Operations */}
                                <div className="bg-white rounded-3xl border border-error-100 p-10 space-y-8">
                                    <h3 className="text-sm font-bold text-error-600 uppercase tracking-widest font-jakarta">Administrative Actions</h3>
                                    <div className="space-y-3">
                                        <Button 
                                            onClick={() => updateStatusMutation.mutate(student.activationStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                                            className={cn(
                                                "w-full h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all font-jakarta leading-none",
                                                student.activationStatus === "ACTIVE" 
                                                    ? "bg-error-600 hover:bg-error-700 text-white shadow-xl shadow-error-100" 
                                                    : "bg-primary-600 hover:bg-primary-700 text-white"
                                            )}
                                        >
                                            {student.activationStatus === "ACTIVE" ? "Suspend Identity Access" : "Reinstate Registry Entry"}
                                        </Button>
                                        <Button variant="ghost" className="w-full h-12 rounded-xl text-[10px] font-bold text-greys-500 hover:text-text-heading hover:bg-greys-100 uppercase tracking-widest font-jakarta leading-none">
                                            Archive Record
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "insights" && (
                        <motion.div
                            key="insights"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="bg-white rounded-[2rem] border border-greys-300 p-12 space-y-12 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-semibold text-text-heading tracking-tight font-jakarta">Admission Readiness Pulse</h3>
                                    <p className="text-sm text-greys-500 font-medium font-jakarta">Algorithmic evaluation of application depth and mission alignment.</p>
                                </div>
                                <div className="h-16 w-16 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center shadow-inner">
                                    <Sparkles className="h-8 w-8" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                <div className="space-y-8">
                                    <InsightRow label="Identity Completeness" status="Professional" color="bg-primary-50 text-primary-600 border-primary-200" />
                                    <InsightRow label="Engagement Metrics" status="Standard" color="bg-indigo-50 text-indigo-600 border-indigo-200" />
                                    <InsightRow label="Registry Density" status="Elite" color="bg-emerald-50 text-emerald-600 border-emerald-200" />
                                </div>
                                <div className="p-12 bg-primary-50/30 rounded-3xl border border-primary-100 flex flex-col items-center justify-center text-center space-y-6">
                                    <p className="text-[10px] font-bold text-primary-700 uppercase tracking-[0.3em] opacity-60 font-jakarta">Consolidated Rating</p>
                                    <div className="text-7xl font-bold text-text-heading font-jakarta tracking-tighter">A<span className="text-primary-600">+</span></div>
                                    <p className="text-xs text-greys-500 font-medium max-w-[180px] font-jakarta">Synthesised from 14 operational profile nodes.</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// ─── Small helper components ───────────────────────────────────────────────

function AvatarRing({ name }: { name: string }) {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    return (
        <div className="relative group">
            <div className="h-28 w-28 rounded-[2rem] bg-primary-600 p-[3px] shadow-xl shadow-primary-100 group-hover:rotate-2 transition-transform duration-500">
                <div className="h-full w-full rounded-[1.8rem] bg-white flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent" />
                    <span className="text-3xl font-bold text-primary-600 font-jakarta relative z-10">
                        {initials}
                    </span>
                </div>
            </div>
            <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-2xl bg-success-500 border-4 border-white shadow-lg flex items-center justify-center"
            >
                <CheckCircle className="h-4 w-4 text-white" />
            </motion.div>
        </div>
    );
}

function StatPill({ label, value, color, icon: Icon }: { label: string; value: string | number | undefined; color: string; icon?: any }) {
    return (
        <div className={cn("flex flex-col px-6 py-4 rounded-2xl border border-greys-300 bg-white shadow-sm transition-all hover:shadow-md", color)}>
            <div className="flex items-center gap-2 mb-1">
                {Icon && <Icon className="h-3.5 w-3.5 opacity-60" />}
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 font-jakarta leading-none">{label}</span>
            </div>
            <span className="text-xl font-bold text-text-heading tracking-tight font-jakarta">{value ?? "—"}</span>
        </div>
    );
}

function InsightRow({ label, status, color }: { label: string; status: string; color: string }) {
    return (
        <div className="flex items-center justify-between py-4 border-b border-greys-100 last:border-0 grow">
            <span className="text-sm font-semibold text-text-heading font-jakarta shrink-0">{label}</span>
            <span className={cn("px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border font-jakarta text-center", color)}>{status}</span>
        </div>
    );
}
