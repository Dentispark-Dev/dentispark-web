"use client";

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
    School,
    Trophy,
    BookOpen
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";

interface StudentProfileViewProps {
    studentId: string;
}

export function StudentProfileView({ studentId }: StudentProfileViewProps) {
    const queryClient = useQueryClient();

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
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
                <p className="text-gray-500 font-sora">Loading student dossier...</p>
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="bg-red-50/50 backdrop-blur-md border border-red-100 rounded-3xl p-12 text-center shadow-lg shadow-red-100/20">
                <div className="bg-red-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="h-10 w-10 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-red-900 mb-2 font-sora">Profile Unavailable</h3>
                <p className="text-red-700 mb-8 max-w-md mx-auto">We couldn&apos;t retrieve the complete dossier for this student. It may have been removed or the server is unresponsive.</p>
                <Button asChild className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8">
                    <Link href="/admin/students">Return to Directory</Link>
                </Button>
            </div>
        );
    }

    const getStatusBadge = (status: string) => {
        switch (status.toUpperCase()) {
            case "ACTIVE":
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none px-3 py-1 font-semibold">Active</Badge>;
            case "INACTIVE":
                return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-none px-3 py-1 font-semibold">Inactive</Badge>;
            case "SUSPENDED":
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none px-3 py-1 font-semibold">Suspended</Badge>;
            default:
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-3 py-1 font-semibold">{status}</Badge>;
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 pb-12"
        >
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-xl shadow-gray-200/40 border border-white/50">
                <div className="flex items-center gap-6">
                    <Button asChild variant="ghost" size="icon" className="rounded-full h-12 w-12 bg-gray-50 hover:bg-primary-50 text-gray-500 hover:text-primary-600 shrink-0 shadow-sm border border-gray-100">
                        <Link href="/admin/students">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight font-sora">{student.firstName} {student.lastName}</h1>
                            {student.activationStatus === "ACTIVE" && (
                                <div className="bg-green-50 text-green-500 p-1 rounded-full" title="Active Account">
                                    <CheckCircle className="h-5 w-5" />
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                            <span className="flex items-center gap-1"><User className="h-4 w-4" /> ID: <span className="font-mono text-gray-700">{student.sid}</span></span>
                            <span className="h-1 w-1 rounded-full bg-gray-300" />
                            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Enrolled: {new Date(student.dateStamped).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {student.activationStatus !== "ACTIVE" ? (
                        <Button
                            onClick={() => updateStatusMutation.mutate("ACTIVE")}
                            disabled={updateStatusMutation.isPending}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-full shadow-sm border-none"
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Activate Account
                        </Button>
                    ) : (
                        <Button
                            variant="destructive"
                            onClick={() => updateStatusMutation.mutate("INACTIVE")}
                            disabled={updateStatusMutation.isPending}
                            className="rounded-full shadow-sm"
                        >
                            <XCircle className="h-4 w-4 mr-2" />
                            Deactivate Account
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Essential Contact Info */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="border-none shadow-xl shadow-gray-200/40 bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-primary-500 to-blue-400" />
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2 font-sora">
                                <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                                    <User className="h-5 w-5" />
                                </div>
                                Personal Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-5">
                                <div className="flex items-start gap-4">
                                    <div className="mt-0.5 p-2 bg-gray-50 border border-gray-100 rounded-xl text-gray-500">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Primary Email</p>
                                        <p className="text-sm font-semibold text-gray-900 break-all">{student.emailAddress}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="mt-0.5 p-2 bg-gray-50 border border-gray-100 rounded-xl text-gray-500">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Phone Number</p>
                                        <p className="text-sm font-semibold text-gray-900">{student.phoneNumber || "Not provided"}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-6 border-t border-gray-100 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-gray-600">Account Status</span>
                                    {getStatusBadge(student.activationStatus)}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-gray-600">Category Pathway</span>
                                    <span className="text-sm font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100">
                                        {student.dentalSchoolGateway || "Unspecified"}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Academic Summary Card */}
                    <Card className="border-none shadow-xl shadow-gray-200/40 bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-3xl overflow-hidden relative">
                        <div className="absolute -right-6 -top-6 h-24 w-24 bg-white/10 rounded-full blur-xl" />
                        <CardContent className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <Trophy className="h-5 w-5 text-indigo-50" />
                                </div>
                                <h3 className="text-lg font-bold font-sora">Admissions Profile</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-black/10 px-4 py-3 rounded-xl border border-white/10">
                                    <span className="text-sm font-semibold text-indigo-100">Current Year</span>
                                    <span className="text-lg font-black">{student.currentAcademicYear ? `Year ${student.currentAcademicYear}` : 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center bg-black/10 px-4 py-3 rounded-xl border border-white/10">
                                    <span className="text-sm font-semibold text-indigo-100">UCAT Score</span>
                                    <span className="text-lg font-black">{student.ucatScore || 'Not taken'}</span>
                                </div>
                                <div className="flex justify-between items-center bg-black/10 px-4 py-3 rounded-xl border border-white/10">
                                    <span className="text-sm font-semibold text-indigo-100">CASPER Score</span>
                                    <span className="text-lg font-black">{student.casperScore || 'Not taken'}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Deep Academic & Motivation Data */}
                <div className="lg:col-span-8 space-y-8">
                    <Card className="border-none shadow-xl shadow-gray-200/40 bg-white/80 backdrop-blur-xl rounded-3xl h-full">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3 font-sora">
                                <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 shadow-sm border border-blue-100">
                                    <GraduationCap className="h-5 w-5" />
                                </div>
                                Application Focus
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            {/* Academic Metrics Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-5 bg-gray-50/80 rounded-2xl border border-gray-100/80 hover:bg-white hover:shadow-md transition-all">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">GCSE Results Overview</p>
                                    <p className="text-lg font-bold text-gray-900">{student.gcseResult || "Not provided"}</p>
                                </div>
                                <div className="p-5 bg-gray-50/80 rounded-2xl border border-gray-100/80 hover:bg-white hover:shadow-md transition-all">
                                    <div className="flex items-center gap-2 mb-2">
                                        <School className="h-4 w-4 text-gray-400" />
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Target Universities</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {student.goals ? (
                                            student.goals.split(',').map((goal: string, idx: number) => (
                                                <Badge key={idx} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold">{goal.trim()}</Badge>
                                            ))
                                        ) : (
                                            <span className="text-sm text-gray-500 font-medium">No target schools specified</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Info Cards */}
                            <div className="space-y-6">
                                <div className="p-6 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-2xl border border-indigo-100/50 group hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600">
                                            <BookOpen className="h-4 w-4" />
                                        </div>
                                        <h4 className="font-bold text-gray-900 font-sora">Motivation & Drive</h4>
                                    </div>
                                    {student.whyDentistry ? (
                                        <blockquote className="border-l-4 border-indigo-300 pl-4 py-1 italic text-gray-700 text-sm leading-relaxed">
                                            &quot;{student.whyDentistry}&quot;
                                        </blockquote>
                                    ) : (
                                        <p className="text-gray-400 italic text-sm">No motivational statement provided during signup.</p>
                                    )}
                                </div>

                                {student.academicHistory && student.academicHistory.length > 0 && (
                                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                        <h4 className="font-bold text-gray-900 font-sora mb-4 flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            Academic History Log
                                        </h4>
                                        <div className="space-y-2">
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            {student.academicHistory.map((history: any, idx: number) => (
                                                <div key={idx} className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 text-sm flex justify-between">
                                                    <span className="font-medium text-gray-700">{JSON.stringify(history)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}
