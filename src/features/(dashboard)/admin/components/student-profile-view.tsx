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

function AvatarRing({ name }: { name: string }) {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    return (
        <div className="relative group">
            <div className="h-28 w-28 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-[3px] shadow-2xl shadow-indigo-200 group-hover:rotate-3 transition-transform duration-500">
                <div className="h-full w-full rounded-[2.3rem] bg-white flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent" />
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600 font-sora relative z-10">
                        {initials}
                    </span>
                </div>
            </div>
            <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-2xl bg-green-500 border-4 border-white shadow-lg flex items-center justify-center"
            >
                <CheckCircle className="h-4 w-4 text-white" />
            </motion.div>
        </div>
    );
}

function StatPill({ label, value, color, icon: Icon }: { label: string; value: string | number | undefined; color: string; icon?: any }) {
    return (
        <div className={cn("flex flex-col px-6 py-4 rounded-[1.5rem] border border-white/20 backdrop-blur-md shadow-sm", color)}>
            <div className="flex items-center gap-2 mb-1">
                {Icon && <Icon className="h-3 w-3 opacity-60" />}
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</span>
            </div>
            <span className="text-2xl font-black font-sora tracking-tighter">{value ?? "—"}</span>
        </div>
    );
}

function InsightRow({ label, status, color }: { label: string; status: string; color: string }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <span className="text-sm font-semibold text-gray-700">{label}</span>
            <span className={cn("px-3 py-0.5 rounded-full text-xs font-bold border", color)}>{status}</span>
        </div>
    );
}

export function StudentProfileView({ studentId }: StudentProfileViewProps) {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<TabKey>("profile");
    const [showFullWhy, setShowFullWhy] = useState(false);

    const { data: student, isLoading, error } = useQuery({
        queryKey: ["admin-student-detail", studentId],
        queryFn: () => adminService.getStudentDetail(studentId),
    });

    const updateStatusMutation = useMutation({
        mutationFn: (status: string) => adminService.updateStudentStatus(studentId, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-student-detail", studentId] });
            queryClient.invalidateQueries({ queryKey: ["admin-students"] });
            toast.success("Student status updated successfully");
        },
        onError: () => {
            toast.error("Failed to update student status");
        }
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
                <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
                <p className="text-gray-500 font-sora font-medium">Loading student profile...</p>
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="bg-red-50/50 border border-red-100 rounded-3xl p-12 text-center backdrop-blur-sm">
                <div className="bg-red-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <AlertCircle className="h-10 w-10 text-red-500" />
                </div>
                <h3 className="text-xl font-black text-red-900 mb-2 font-sora tracking-tight">Profile Data Unreachable</h3>
                <p className="text-red-700 mb-8 max-w-sm mx-auto font-medium">We were unable to synchronize with the admissions database. The student record may be restricted or temporarily offline.</p>
                <Button asChild className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-full px-10 py-6 font-bold shadow-lg shadow-red-200">
                    <Link href="/admin/students">Return to Student Directory</Link>
                </Button>
            </div>
        );
    }

    const fullName = `${student.firstName} ${student.lastName}`;
    const targetSchoolsArr = student.goals
        ? student.goals.split(",").map((g: string) => g.trim()).filter(Boolean)
        : [];

    const getStatusColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case "ACTIVE": return "bg-green-100 text-green-700 border-green-200";
            case "INACTIVE": return "bg-gray-100 text-gray-600 border-gray-200";
            case "SUSPENDED": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-blue-100 text-blue-700 border-blue-200";
        }
    };

    // Derive insights from available student data
    const readiness = student.ucatScore && student.ucatScore > 0
        ? (student.ucatScore >= 2500 ? "Strong" : student.ucatScore >= 2200 ? "Developing" : "Needs Support")
        : "Not Assessed";
    const engagement = student.whyDentistry && student.whyDentistry.length > 100
        ? "Engaged"
        : student.whyDentistry ? "Developing" : "Disengaged";
    const connection = targetSchoolsArr.length > 2
        ? "Well-Connected"
        : targetSchoolsArr.length > 0 ? "Discovered" : "Exploring";

    const readinessColor = readiness === "Strong"
        ? "bg-green-50 text-green-700 border-green-200"
        : readiness === "Developing"
            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
            : "bg-red-50 text-red-700 border-red-200";
    const engagementColor = engagement === "Engaged"
        ? "bg-green-50 text-green-700 border-green-200"
        : engagement === "Developing"
            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
            : "bg-red-50 text-red-700 border-red-200";
    const connectionColor = connection === "Well-Connected"
        ? "bg-green-50 text-green-700 border-green-200"
        : connection === "Discovered"
            ? "bg-blue-50 text-blue-700 border-blue-200"
            : "bg-gray-50 text-gray-600 border-gray-200";

    // Strengths chips derived from profile data
    const strengths: string[] = [
        student.dentalSchoolGateway && `Programme: ${student.dentalSchoolGateway}`,
        student.ucatScore ? "UCAT Taken" : null,
        student.casperScore ? "CASPer Taken" : null,
        student.currentAcademicYear ? `Year ${student.currentAcademicYear}` : null,
        targetSchoolsArr.length > 0 ? "Has Target Schools" : null,
        student.whyDentistry ? "Statement Submitted" : null,
    ].filter(Boolean) as string[];

    // Concerns from missing data
    const concerns: string[] = [
        !student.ucatScore ? "UCAT score not submitted" : null,
        !student.casperScore ? "CASPer not taken" : null,
        !student.whyDentistry ? "No motivation statement" : null,
        !student.phoneNumber ? "Phone number missing" : null,
        targetSchoolsArr.length === 0 ? "No target schools listed" : null,
        !student.gcseResult ? "GCSE results not provided" : null,
    ].filter(Boolean) as string[];

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 pb-12"
        >
            {/* ── High-Fidelity Profile Header ── */}
            <div className="relative bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl p-10 md:p-14 text-white">
                {/* Visual accents */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-600/20 to-transparent pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="relative z-10 flex flex-col xl:flex-row gap-12 items-start">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start flex-1 min-w-0 w-full">
                        <div className="flex flex-col items-center gap-6">
                            <Button asChild variant="ghost" size="icon" className="rounded-2xl h-14 w-14 bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-xl">
                                <Link href="/admin/students">
                                    <ArrowLeft className="h-6 w-6" />
                                </Link>
                            </Button>
                            <AvatarRing name={fullName} />
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-4 min-w-0">
                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter font-sora">{fullName}</h1>
                                    <Badge className={cn("text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border shadow-sm", getStatusColor(student.activationStatus))}>
                                        {student.activationStatus}
                                    </Badge>
                                </div>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-white/40 text-sm font-bold uppercase tracking-widest">
                                    <span className="flex items-center gap-2 group cursor-help transition-colors hover:text-white/60">
                                        <User className="h-4 w-4 text-indigo-400" />
                                        <span className="font-mono">{student.sid}</span>
                                    </span>
                                    <span className="flex items-center gap-2 group cursor-pointer hover:text-white/60">
                                        <Mail className="h-4 w-4 text-pink-400" />
                                        {student.emailAddress}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-emerald-400" />
                                        MEMBER SINCE {new Date(student.dateStamped).getFullYear()}
                                    </span>
                                </div>
                            </div>

                            {/* Bio / Motivation Preview */}
                            {student.whyDentistry && (
                                <div className="max-w-2xl bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                                    <p className="text-white/70 text-sm leading-relaxed italic font-medium">
                                        &ldquo;{student.whyDentistry.slice(0, 180)}...&rdquo;
                                    </p>
                                </div>
                            )}

                            {/* Stat Matrix */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                                <StatPill label="UCAT Aptitude" value={student.ucatScore} color="bg-indigo-500/10 text-indigo-300" icon={TrendingUp} />
                                <StatPill label="CASPer Assessment" value={student.casperScore} color="bg-emerald-500/10 text-emerald-300" icon={Award} />
                                <StatPill label="Target Schools" value={targetSchoolsArr.length} color="bg-pink-500/10 text-pink-300" icon={Target} />
                                <StatPill label="Academic Year" value={student.currentAcademicYear ? `Y${student.currentAcademicYear}` : "PRE"} color="bg-amber-500/10 text-amber-300" icon={GraduationCap} />
                            </div>
                        </div>
                    </div>

                    {/* Quick Access Sidebar */}
                    <div className="w-full xl:w-80 space-y-4">
                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-center">Entity Control</h4>
                            <div className="space-y-3">
                                <Button 
                                    onClick={() => updateStatusMutation.mutate(student.activationStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                                    disabled={updateStatusMutation.isPending}
                                    className={cn(
                                        "w-full h-14 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-xl",
                                        student.activationStatus === "ACTIVE" 
                                            ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-900/20" 
                                            : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-900/20"
                                    )}
                                >
                                    {student.activationStatus === "ACTIVE" ? (
                                        <><XCircle className="h-5 w-5 mr-3" /> Deactivate Account</>
                                    ) : (
                                        <><CheckCircle className="h-5 w-5 mr-3" /> Activate Account</>
                                    )}
                                </Button>
                                <Button 
                                    variant="outline"
                                    className="w-full h-14 rounded-2xl font-black text-sm border-white/10 text-white hover:bg-white/5"
                                >
                                    <Mail className="h-5 w-5 mr-3" /> Direct Message
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Navigation Hub ── */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100 rounded-[1.5rem] w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={cn(
                            "flex items-center gap-3 px-8 py-3.5 rounded-[1.2rem] text-sm font-black transition-all duration-300 font-sora uppercase tracking-wider",
                            activeTab === tab.key
                                ? "bg-white shadow-xl text-indigo-600 ring-1 ring-black/5"
                                : "text-gray-400 hover:text-gray-600 hover:bg-gray-200/50"
                        )}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Content Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Main Viewport */}
                <div className="lg:col-span-8 space-y-8">
                    <AnimatePresence mode="wait">
                        {activeTab === "profile" && (
                            <motion.div key="profile" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                                {/* Journey Timeline */}
                                <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                                    <CardHeader className="p-8 pb-4">
                                        <CardTitle className="text-xl font-black text-gray-900 font-sora flex items-center gap-4">
                                            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                                                <TrendingUp className="h-5 w-5" />
                                            </div>
                                            Admissions Progress
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8 pt-0">
                                        <div className="relative flex justify-between items-start pt-10 px-4">
                                            <div className="absolute top-14 left-0 w-full h-1.5 bg-gray-100 rounded-full" />
                                            <div 
                                                className="absolute top-14 left-0 h-1.5 bg-indigo-600 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(79,70,229,0.5)]" 
                                                style={{ width: student.ucatScore ? (student.whyDentistry ? "100%" : "50%") : "10%" }}
                                            />
                                            
                                            {[
                                                { label: "Onboarding", icon: Target, active: true },
                                                { label: "Aptitude", icon: Award, active: !!student.ucatScore },
                                                { label: "Statement", icon: BookOpen, active: !!student.whyDentistry },
                                                { label: "University", icon: GraduationCap, active: targetSchoolsArr.length > 0 },
                                            ].map((step, i) => (
                                                <div key={i} className="relative z-10 flex flex-col items-center gap-4 group">
                                                    <div className={cn(
                                                        "h-10 w-10 rounded-full flex items-center justify-center transition-all duration-500 border-4 border-white shadow-xl",
                                                        step.active ? "bg-indigo-600 text-white scale-110" : "bg-gray-200 text-gray-400 group-hover:bg-gray-300"
                                                    )}>
                                                        <step.icon className="h-4 w-4" />
                                                    </div>
                                                    <span className={cn("text-[10px] font-black uppercase tracking-widest", step.active ? "text-gray-900" : "text-gray-300")}>
                                                        {step.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Dossier Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-[2.5rem] bg-white">
                                        <CardHeader className="p-8 pb-4">
                                            <CardTitle className="text-base font-black text-gray-900 font-sora flex items-center gap-3">
                                                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                                                    <CheckCircle className="h-4 w-4" />
                                                </div>
                                                Competitive Strengths
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-8 pt-0 space-y-3">
                                            {strengths.map((s, i) => (
                                                <div key={i} className="flex items-center gap-4 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 group">
                                                    <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                                        <Sparkles className="h-3 w-3" />
                                                    </div>
                                                    <span className="text-sm font-bold text-emerald-900">{s}</span>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>

                                    <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-[2.5rem] bg-white">
                                        <CardHeader className="p-8 pb-4">
                                            <CardTitle className="text-base font-black text-gray-900 font-sora flex items-center gap-3">
                                                <div className="p-2 bg-rose-50 rounded-xl text-rose-600">
                                                    <AlertCircle className="h-4 w-4" />
                                                </div>
                                                Critical Gaps
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-8 pt-0 space-y-3">
                                            {concerns.map((c, i) => (
                                                <div key={i} className="flex items-center gap-4 p-4 bg-rose-50/50 rounded-2xl border border-rose-100 group">
                                                    <div className="h-6 w-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
                                                        <XCircle className="h-3 w-3" />
                                                    </div>
                                                    <span className="text-sm font-bold text-rose-900">{c}</span>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "insights" && (
                            <motion.div key="insights" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-[3rem] bg-slate-900 text-white p-12 text-center overflow-hidden relative">
                                    <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/20 rounded-full blur-[60px]" />
                                    <div className="relative z-10 space-y-6">
                                        <div className="inline-flex p-6 bg-white/10 rounded-[2rem] border border-white/10 backdrop-blur-xl mb-4">
                                            <Sparkles className="h-12 w-12 text-indigo-400" />
                                        </div>
                                        <h2 className="text-4xl font-black font-sora tracking-tighter">Readiness Intelligence</h2>
                                        <p className="text-white/50 font-bold max-w-lg mx-auto leading-relaxed">
                                            AI-driven evaluation of admissions probability based on historical data patterns and current profile density.
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                                            {[
                                                { label: "Overall Rating", value: "88%", color: "text-emerald-400" },
                                                { label: "Engagement", value: "High", color: "text-indigo-400" },
                                                { label: "Risk Level", value: "Minimal", color: "text-amber-400" },
                                            ].map((stat, i) => (
                                                <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                                                    <div className={cn("text-4xl font-black mb-2", stat.color)}>{stat.value}</div>
                                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{stat.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {activeTab === "history" && (
                            <motion.div key="history" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-[2.5rem] bg-white">
                                    <CardHeader className="p-8 pb-4">
                                        <CardTitle className="text-xl font-black text-gray-900 font-sora flex items-center gap-4">
                                            <div className="p-3 bg-slate-100 rounded-2xl text-slate-600">
                                                <History className="h-5 w-5" />
                                            </div>
                                            Academic History Log
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8 pt-0">
                                        {student.academicHistory && student.academicHistory.length > 0 ? (
                                            <div className="space-y-4">
                                                {student.academicHistory.map((entry: any, idx: number) => (
                                                    <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-lg transition-all duration-300">
                                                        <pre className="text-xs font-mono text-slate-500 whitespace-pre-wrap break-all">
                                                            {JSON.stringify(entry, null, 2)}
                                                        </pre>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-20 text-center space-y-4">
                                                <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                                                    <History className="h-10 w-10 text-slate-300" />
                                                </div>
                                                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No active logs detected</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Integration Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    
                    {/* Linked University Hub */}
                    <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-[2.5rem] bg-white overflow-hidden group">
                        <div className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600" />
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-lg font-black text-gray-900 font-sora flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                                        <GraduationCap className="h-5 w-5" />
                                    </div>
                                    Aligned University
                                </div>
                                <LinkIcon className="h-4 w-4 text-gray-300 group-hover:text-indigo-600 transition-colors" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                            <div className="p-6 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                                <div className="relative z-10">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Primary Pathway</p>
                                    <h3 className="text-xl font-black font-sora mb-1 truncate">{student.dentalSchoolGateway || "Pending Assignment"}</h3>
                                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                                        <MapPin className="h-3 w-3" />
                                        United Kingdom
                                    </div>
                                </div>
                            </div>
                            <Button asChild variant="outline" className="w-full h-12 rounded-xl border-gray-100 hover:bg-gray-50 text-xs font-black uppercase tracking-widest gap-2">
                                <Link href="/admin/universities">
                                    Entity Registry <ArrowUpRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Linked Mentor Hub */}
                    <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-[2.5rem] bg-white overflow-hidden group">
                        <div className="h-2 bg-gradient-to-r from-pink-600 to-rose-600" />
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-lg font-black text-gray-900 font-sora flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-pink-50 rounded-xl text-pink-600">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    Elite Mentor
                                </div>
                                <Settings className="h-4 w-4 text-gray-300 group-hover:text-pink-600 transition-colors" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                            <div className="flex items-center gap-4 p-4 rounded-[1.5rem] hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                <div className="h-14 w-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xl font-sora shadow-sm">
                                    JS
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-gray-900 truncate">Dr. Jonathan Smith</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Oxford Graduate</p>
                                </div>
                                <Button size="icon" variant="ghost" className="rounded-xl hover:bg-white hover:shadow-md transition-all">
                                    <ArrowUpRight className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100">
                                <p className="text-[10px] text-pink-700 font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                                    <Search className="h-3 w-3" /> Dynamic Suggestion
                                </p>
                                <p className="text-xs font-bold text-pink-900 leading-relaxed">
                                    Based on the {student.dentalSchoolGateway} pathway, we recommend mentoring support from verified specialist experts.
                                </p>
                            </div>
                            <Button asChild variant="outline" className="w-full h-12 rounded-xl border-gray-100 hover:bg-gray-50 text-xs font-black uppercase tracking-widest gap-2">
                                <Link href="/admin/mentors">
                                    Mentor Network <ArrowUpRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Academic History Summary */}
                    <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-[2.5rem] bg-slate-50 border border-slate-100 group hover:bg-white transition-all duration-500 transform hover:-translate-y-1">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                                Lifecycle Snapshot
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-4">
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-gray-400">Dossier Created</span>
                                <span className="text-gray-900 font-mono">{new Date(student.dateStamped).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-gray-400">Last Intelligence Update</span>
                                <span className="text-gray-900">Just Now</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-gray-400">Platform Status</span>
                                <span className={cn("px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest", getStatusColor(student.activationStatus))}>
                                    {student.activationStatus}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Small helper components ───────────────────────────────────────────────

function BadgeSchool({ name }: { name: string }) {
    return (
        <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full px-3 py-1 text-sm font-semibold">
            <GraduationCap className="h-3.5 w-3.5" />
            {name}
        </span>
    );
}

function InfoRow({
    icon,
    label,
    value,
    highlight,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    highlight?: string;
}) {
    return (
        <div className="flex items-center justify-between gap-3 py-1">
            <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider shrink-0">
                {icon}
                {label}
            </div>
            {highlight ? (
                <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full border", highlight)}>{value}</span>
            ) : (
                <span className="text-sm font-semibold text-gray-800 text-right truncate">{value}</span>
            )}
        </div>
    );
}
