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
    History
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

type TabKey = "profile" | "insights" | "history";

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
    { key: "insights", label: "Insights", icon: <Lightbulb className="h-4 w-4" /> },
    { key: "history", label: "Academic History", icon: <History className="h-4 w-4" /> },
];

function AvatarRing({ name }: { name: string }) {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    return (
        <div className="relative">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[3px] shadow-xl shadow-purple-200">
                <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600 font-sora">
                        {initials}
                    </span>
                </div>
            </div>
            <div className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-400 border-2 border-white shadow-sm" />
        </div>
    );
}

function StatPill({ label, value, color }: { label: string; value: string | number | undefined; color: string }) {
    return (
        <div className={cn("flex flex-col items-center px-6 py-3 rounded-2xl border", color)}>
            <span className="text-xl font-black font-sora">{value ?? "—"}</span>
            <span className="text-xs font-semibold uppercase tracking-wider opacity-70 mt-0.5">{label}</span>
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
            {/* ── Hero Header ── */}
            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-300/40">
                {/* Decorative blobs */}
                <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-20 h-32 w-32 rounded-full bg-pink-400/20 blur-xl pointer-events-none" />

                <div className="relative z-10 p-8">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                        {/* Back + Avatar */}
                        <div className="flex items-center gap-5">
                            <Button asChild variant="ghost" size="icon"
                                className="rounded-full h-10 w-10 bg-white/15 hover:bg-white/30 text-white shrink-0 border border-white/20">
                                <Link href="/admin/students">
                                    <ArrowLeft className="h-5 w-5" />
                                </Link>
                            </Button>
                            <AvatarRing name={fullName} />
                        </div>

                        {/* Name + meta */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h1 className="text-3xl font-black text-white tracking-tight font-sora">{fullName}</h1>
                                <Badge className={cn("border font-bold text-xs px-3 py-1", getStatusColor(student.activationStatus))}>
                                    {student.activationStatus}
                                </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm font-medium mb-5">
                                <span className="flex items-center gap-1.5">
                                    <User className="h-3.5 w-3.5" />
                                    <span className="font-mono text-white/90">{student.sid}</span>
                                </span>
                                {student.emailAddress && (
                                    <span className="flex items-center gap-1.5">
                                        <Mail className="h-3.5 w-3.5" />
                                        {student.emailAddress}
                                    </span>
                                )}
                                {student.phoneNumber && (
                                    <span className="flex items-center gap-1.5">
                                        <Phone className="h-3.5 w-3.5" />
                                        {student.phoneNumber}
                                    </span>
                                )}
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" />
                                    Joined {new Date(student.dateStamped).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                                </span>
                            </div>

                            {/* Motivational quote */}
                            {student.whyDentistry && (
                                <div className="bg-white/10 border border-white/20 rounded-2xl px-5 py-3 mb-5 backdrop-blur-sm">
                                    <p className="text-white/90 text-sm italic leading-relaxed line-clamp-2">
                                        &ldquo;{student.whyDentistry}&rdquo;
                                    </p>
                                </div>
                            )}

                            {/* Stat pills */}
                            <div className="flex flex-wrap gap-3">
                                <StatPill label="UCAT Score" value={student.ucatScore} color="bg-white/10 border-white/20 text-white" />
                                <StatPill label="CASPer Score" value={student.casperScore} color="bg-white/10 border-white/20 text-white" />
                                <StatPill label="Target Schools" value={targetSchoolsArr.length || "None"} color="bg-white/10 border-white/20 text-white" />
                                {student.currentAcademicYear && (
                                    <StatPill label="Academic Year" value={`Year ${student.currentAcademicYear}`} color="bg-white/10 border-white/20 text-white" />
                                )}
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col gap-2 shrink-0">
                            {student.activationStatus !== "ACTIVE" ? (
                                <Button onClick={() => updateStatusMutation.mutate("ACTIVE")}
                                    disabled={updateStatusMutation.isPending}
                                    className="bg-green-500 hover:bg-green-400 text-white rounded-full border-none font-bold shadow-lg shadow-green-900/30">
                                    <CheckCircle className="h-4 w-4 mr-2" /> Activate
                                </Button>
                            ) : (
                                <Button variant="destructive"
                                    onClick={() => updateStatusMutation.mutate("INACTIVE")}
                                    disabled={updateStatusMutation.isPending}
                                    className="rounded-full font-bold">
                                    <XCircle className="h-4 w-4 mr-2" /> Deactivate
                                </Button>
                            )}
                            <Button onClick={() => updateStatusMutation.mutate("SUSPENDED")}
                                disabled={updateStatusMutation.isPending}
                                className="bg-yellow-500 hover:bg-yellow-400 text-white rounded-full border-none font-bold shadow-lg shadow-yellow-900/20 text-sm">
                                Suspend
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Tabs ── */}
            <div className="flex gap-1 bg-gray-100/80 rounded-2xl p-1.5 w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 font-sora",
                            activeTab === tab.key
                                ? "bg-white shadow-md text-indigo-700"
                                : "text-gray-500 hover:text-gray-800"
                        )}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Tab Content ── */}
            <AnimatePresence mode="wait">
                {activeTab === "profile" && (
                    <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Left (main content) */}
                            <div className="lg:col-span-8 space-y-6">

                                {/* Strengths */}
                                <Card className="border-none shadow-lg shadow-gray-100/60 rounded-3xl bg-white">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center gap-2.5 text-base font-bold text-gray-900 font-sora">
                                            <div className="p-2 rounded-xl bg-green-50 text-green-600">
                                                <CheckCircle className="h-4 w-4" />
                                            </div>
                                            Strengths & Positive Signals
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {strengths.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {strengths.map((s, i) => (
                                                    <span key={i} className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1 text-sm font-semibold">
                                                        <CheckCircle className="h-3.5 w-3.5" />
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-400 italic text-sm">No positive signals detected yet.</p>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Concerns */}
                                <Card className="border-none shadow-lg shadow-gray-100/60 rounded-3xl bg-white">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center gap-2.5 text-base font-bold text-gray-900 font-sora">
                                            <div className="p-2 rounded-xl bg-orange-50 text-orange-500">
                                                <AlertCircle className="h-4 w-4" />
                                            </div>
                                            Active Concerns
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {concerns.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {concerns.map((c, i) => (
                                                    <span key={i} className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-full px-3 py-1 text-sm font-semibold">
                                                        <AlertCircle className="h-3.5 w-3.5" />
                                                        {c}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-green-600 font-semibold text-sm flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4" /> No active concerns — profile is complete!
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* GCSE Results */}
                                <Card className="border-none shadow-lg shadow-gray-100/60 rounded-3xl bg-white">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center gap-2.5 text-base font-bold text-gray-900 font-sora">
                                            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                                                <Award className="h-4 w-4" />
                                            </div>
                                            Academic Results
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">GCSE</p>
                                                <p className="text-base font-bold text-gray-900">{student.gcseResult || "Not provided"}</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">UCAT</p>
                                                <p className="text-base font-bold text-gray-900">{student.ucatScore || "Not taken"}</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">CASPer</p>
                                                <p className="text-base font-bold text-gray-900">{student.casperScore || "Not taken"}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Application Goals */}
                                {student.goals && (
                                    <Card className="border-none shadow-lg shadow-gray-100/60 rounded-3xl bg-white">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="flex items-center gap-2.5 text-base font-bold text-gray-900 font-sora">
                                                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                                                    <Target className="h-4 w-4" />
                                                </div>
                                                Target Dental Schools
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-2">
                                                {targetSchoolsArr.map((school: string, i: number) => (
                                                    <BadgeSchool key={i} name={school} />
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Why Dentistry */}
                                {student.whyDentistry && (
                                    <Card className="border-none shadow-lg shadow-gray-100/60 rounded-3xl bg-gradient-to-br from-indigo-50/60 to-purple-50/60">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="flex items-center gap-2.5 text-base font-bold text-gray-900 font-sora">
                                                <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600">
                                                    <BookOpen className="h-4 w-4" />
                                                </div>
                                                Why Dentistry / Medicine?
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <blockquote className="border-l-4 border-indigo-300 pl-4 text-gray-700 text-sm leading-relaxed italic">
                                                {showFullWhy
                                                    ? `"${student.whyDentistry}"`
                                                    : `"${student.whyDentistry.slice(0, 280)}${student.whyDentistry.length > 280 ? "..." : ""}"`}
                                            </blockquote>
                                            {student.whyDentistry.length > 280 && (
                                                <button
                                                    onClick={() => setShowFullWhy((v) => !v)}
                                                    className="mt-3 flex items-center gap-1 text-indigo-600 text-sm font-semibold hover:underline"
                                                >
                                                    {showFullWhy ? <><ChevronUp className="h-4 w-4" /> Show less</> : <><ChevronDown className="h-4 w-4" /> Read more</>}
                                                </button>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}
                            </div>

                            {/* Right sidebar */}
                            <div className="lg:col-span-4 space-y-6">
                                {/* Programme Details */}
                                <Card className="border-none shadow-lg shadow-gray-100/60 rounded-3xl bg-white overflow-hidden">
                                    <div className="h-1.5 bg-gradient-to-r from-indigo-400 to-purple-400" />
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center gap-2.5 text-base font-bold text-gray-900 font-sora">
                                            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                                                <GraduationCap className="h-4 w-4" />
                                            </div>
                                            Programme Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <InfoRow icon={<GraduationCap className="h-3.5 w-3.5" />} label="Programme" value={student.dentalSchoolGateway || "Unspecified"} />
                                        <InfoRow icon={<TrendingUp className="h-3.5 w-3.5" />} label="Academic Year" value={student.currentAcademicYear ? `Year ${student.currentAcademicYear}` : "Not set"} />
                                        <InfoRow icon={<MapPin className="h-3.5 w-3.5" />} label="Account Status" value={student.activationStatus} highlight={getStatusColor(student.activationStatus)} />
                                        <InfoRow icon={<Calendar className="h-3.5 w-3.5" />} label="Joined" value={new Date(student.dateStamped).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} />
                                    </CardContent>
                                </Card>

                                {/* Contact */}
                                <Card className="border-none shadow-lg shadow-gray-100/60 rounded-3xl bg-white overflow-hidden">
                                    <div className="h-1.5 bg-gradient-to-r from-pink-400 to-rose-400" />
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center gap-2.5 text-base font-bold text-gray-900 font-sora">
                                            <div className="p-2 rounded-xl bg-rose-50 text-rose-500">
                                                <Mail className="h-4 w-4" />
                                            </div>
                                            Contact
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <InfoRow icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={student.emailAddress} />
                                        <InfoRow icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={student.phoneNumber || "Not provided"} />
                                    </CardContent>
                                </Card>

                                {/* Quick Actions */}
                                <Card className="border-none shadow-lg shadow-gray-100/60 rounded-3xl bg-white">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center gap-2.5 text-base font-bold text-gray-900 font-sora">
                                            <div className="p-2 rounded-xl bg-gray-100 text-gray-600">
                                                <ClipboardList className="h-4 w-4" />
                                            </div>
                                            Quick Actions
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <Button
                                            className="w-full rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm"
                                            onClick={() => updateStatusMutation.mutate("ACTIVE")}
                                            disabled={updateStatusMutation.isPending || student.activationStatus === "ACTIVE"}
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" /> Activate Account
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            className="w-full rounded-xl font-semibold text-sm"
                                            onClick={() => updateStatusMutation.mutate("INACTIVE")}
                                            disabled={updateStatusMutation.isPending || student.activationStatus === "INACTIVE"}
                                        >
                                            <XCircle className="h-4 w-4 mr-2" /> Deactivate Account
                                        </Button>
                                        <Button
                                            className="w-full rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-semibold text-sm"
                                            onClick={() => updateStatusMutation.mutate("SUSPENDED")}
                                            disabled={updateStatusMutation.isPending || student.activationStatus === "SUSPENDED"}
                                        >
                                            Suspend Account
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === "insights" && (
                    <motion.div key="insights" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Insightful Results */}
                            <Card className="border-none shadow-lg shadow-gray-100/60 rounded-3xl bg-white">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2.5 text-base font-bold text-gray-900 font-sora">
                                        <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                                            <TrendingUp className="h-4 w-4" />
                                        </div>
                                        Insightful Results
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <InsightRow label="Readiness" status={readiness} color={readinessColor} />
                                    <InsightRow label="Engagement" status={engagement} color={engagementColor} />
                                    <InsightRow label="Connection" status={connection} color={connectionColor} />
                                    <InsightRow
                                        label="Profile Completeness"
                                        status={concerns.length === 0 ? "Complete" : `${concerns.length} item(s) missing`}
                                        color={concerns.length === 0
                                            ? "bg-green-50 text-green-700 border-green-200"
                                            : "bg-yellow-50 text-yellow-700 border-yellow-200"}
                                    />
                                </CardContent>
                            </Card>

                            {/* Test Readiness Indicators */}
                            <Card className="border-none shadow-lg shadow-gray-100/60 rounded-3xl bg-white">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2.5 text-base font-bold text-gray-900 font-sora">
                                        <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                                            <Award className="h-4 w-4" />
                                        </div>
                                        Test Preparation
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <InsightRow
                                        label="UCAT Preparation"
                                        status={student.ucatScore ? `Score: ${student.ucatScore}` : "Not taken yet"}
                                        color={student.ucatScore
                                            ? (student.ucatScore >= 2500 ? "bg-green-50 text-green-700 border-green-200" : "bg-yellow-50 text-yellow-700 border-yellow-200")
                                            : "bg-gray-50 text-gray-600 border-gray-200"}
                                    />
                                    <InsightRow
                                        label="CASPer Preparation"
                                        status={student.casperScore ? `Score: ${student.casperScore}` : "Not taken yet"}
                                        color={student.casperScore
                                            ? "bg-green-50 text-green-700 border-green-200"
                                            : "bg-gray-50 text-gray-600 border-gray-200"}
                                    />
                                    <InsightRow
                                        label="GCSE Foundation"
                                        status={student.gcseResult || "Not submitted"}
                                        color={student.gcseResult
                                            ? "bg-green-50 text-green-700 border-green-200"
                                            : "bg-red-50 text-red-600 border-red-200"}
                                    />
                                    <InsightRow
                                        label="Motivation Statement"
                                        status={student.whyDentistry ? "Submitted" : "Not written"}
                                        color={student.whyDentistry
                                            ? "bg-green-50 text-green-700 border-green-200"
                                            : "bg-orange-50 text-orange-600 border-orange-200"}
                                    />
                                </CardContent>
                            </Card>

                            {/* Summary stats */}
                            <Card className="border-none shadow-lg shadow-gray-100/60 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white md:col-span-2">
                                <CardContent className="p-8">
                                    <h3 className="text-lg font-bold font-sora mb-6">Overall Admissions Readiness</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            { label: "Strengths", value: strengths.length },
                                            { label: "Gaps", value: concerns.length },
                                            { label: "Target Schools", value: targetSchoolsArr.length },
                                            { label: "Profile Score", value: `${Math.round(((strengths.length / (strengths.length + concerns.length || 1)) * 100))}%` },
                                        ].map((item) => (
                                            <div key={item.label} className="bg-white/10 border border-white/20 rounded-2xl p-4 text-center backdrop-blur-sm">
                                                <div className="text-3xl font-black mb-1">{item.value}</div>
                                                <div className="text-xs font-semibold text-white/70 uppercase tracking-wider">{item.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                )}

                {activeTab === "history" && (
                    <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                        <Card className="border-none shadow-lg shadow-gray-100/60 rounded-3xl bg-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2.5 text-base font-bold text-gray-900 font-sora">
                                    <div className="p-2 rounded-xl bg-gray-100 text-gray-600">
                                        <History className="h-4 w-4" />
                                    </div>
                                    Academic History Log
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {student.academicHistory && student.academicHistory.length > 0 ? (
                                    <div className="space-y-3">
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {student.academicHistory.map((entry: any, idx: number) => (
                                            <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-white hover:shadow-sm transition-all">
                                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl shrink-0 mt-0.5">
                                                    <ClipboardList className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Entry {idx + 1}</span>
                                                    </div>
                                                    <pre className="text-sm text-gray-700 font-mono whitespace-pre-wrap break-all">
                                                        {JSON.stringify(entry, null, 2)}
                                                    </pre>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16">
                                        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <History className="h-8 w-8 text-gray-300" />
                                        </div>
                                        <p className="text-gray-400 font-semibold">No academic history recorded yet.</p>
                                        <p className="text-gray-300 text-sm mt-1">History entries will appear here as they are added.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
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
