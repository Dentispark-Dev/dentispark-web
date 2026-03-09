"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/src/connection/admin-service";
import {
    Mail,
    Phone,
    Calendar,
    GraduationCap,
    User,
    CheckCircle,
    XCircle,
    AlertCircle,
    Loader2,
    ArrowLeft
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

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
                <p className="text-gray-500">Loading student profile...</p>
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-900 mb-2">Failed to Load Profile</h3>
                <p className="text-red-700 mb-6">We couldn&apos;t retrieve the details for this student. Please try again later.</p>
                <Button asChild variant="outline">
                    <Link href="/admin/students">Back to Students</Link>
                </Button>
            </div>
        );
    }

    const getStatusBadge = (status: string) => {
        switch (status.toUpperCase()) {
            case "ACTIVE":
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none px-3 py-1">Active</Badge>;
            case "INACTIVE":
                return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-none px-3 py-1">Inactive</Badge>;
            case "SUSPENDED":
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none px-3 py-1">Suspended</Badge>;
            case "PENDING":
                return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-none px-3 py-1">Pending</Badge>;
            default:
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-3 py-1">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header / Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost" size="icon" className="rounded-full h-10 w-10">
                        <Link href="/admin/students">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{student.firstName} {student.lastName}</h1>
                        <p className="text-sm text-gray-500">Student ID: <span className="font-mono font-medium">{student.sid}</span></p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {student.activationStatus !== "ACTIVE" && (
                        <Button
                            onClick={() => updateStatusMutation.mutate("ACTIVE")}
                            disabled={updateStatusMutation.isPending}
                            className="bg-green-600 hover:bg-green-700 flex gap-2"
                        >
                            <CheckCircle className="h-4 w-4" />
                            Activate Account
                        </Button>
                    )}
                    {student.activationStatus === "ACTIVE" && (
                        <Button
                            variant="destructive"
                            onClick={() => updateStatusMutation.mutate("INACTIVE")}
                            disabled={updateStatusMutation.isPending}
                            className="flex gap-2"
                        >
                            <XCircle className="h-4 w-4" />
                            Deactivate Account
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Basic Info */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm h-full">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="h-5 w-5 text-primary-600" />
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Mail className="h-4 w-4 text-gray-400 mt-1" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Email Address</p>
                                    <p className="text-sm font-medium">{student.emailAddress}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="h-4 w-4 text-gray-400 mt-1" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Phone Number</p>
                                    <p className="text-sm font-medium">{student.phoneNumber || "Not provided"}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar className="h-4 w-4 text-gray-400 mt-1" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Date Registered</p>
                                    <p className="text-sm font-medium">
                                        {new Date(student.dateStamped).toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric"
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-4 w-4 flex items-center justify-center">
                                    <div className="h-2 w-2 rounded-full bg-primary-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Account Status</p>
                                    <div className="mt-1">{getStatusBadge(student.activationStatus)}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Middle Column: Academic History */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-primary-600" />
                                Academic Profile
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4 p-4 rounded-xl bg-gray-50/50">
                                    <h4 className="font-semibold text-gray-900 border-b pb-2 mb-3">Education</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="space-y-1">
                                            <p className="text-gray-500">Degree/Gateway</p>
                                            <p className="font-medium text-primary-700">{student.dentalSchoolGateway || "BDS"}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-gray-500">Current Year</p>
                                            <p className="font-medium">Year {student.currentAcademicYear || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 p-4 rounded-xl bg-gray-50/50">
                                    <h4 className="font-semibold text-gray-900 border-b pb-2 mb-3">Exam Results</h4>
                                    <div className="grid grid-cols-3 gap-4 text-sm text-center">
                                        <div className="space-y-1">
                                            <p className="text-gray-500">GCSE</p>
                                            <p className="font-bold text-primary-600">{student.gcseResult || "-"}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-gray-500">UCAT</p>
                                            <p className="font-bold text-primary-600">{student.ucatScore || "-"}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-gray-500">CASPER</p>
                                            <p className="font-bold text-primary-600">{student.casperScore || "-"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {(student.whyDentistry || student.goals) && (
                                <div className="mt-8 space-y-6">
                                    {student.whyDentistry && (
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-semibold text-gray-700 uppercase">Motivation for Dentistry</h4>
                                            <p className="text-sm text-gray-600 bg-white p-4 rounded-lg border border-gray-100 italic">
                                                &quot;{student.whyDentistry}&quot;
                                            </p>
                                        </div>
                                    )}
                                    {student.goals && (
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-semibold text-gray-700 uppercase">Future Goals</h4>
                                            <p className="text-sm text-gray-600 bg-white p-4 rounded-lg border border-gray-100">
                                                {student.goals}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Placeholder for future sections */}
                    <Card className="border-none shadow-sm border-dashed border-2 border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-lg text-gray-400">Applications & Mentorship</CardTitle>
                        </CardHeader>
                        <CardContent className="h-24 flex items-center justify-center text-gray-400">
                            Activity data for applications and mentorship will appear here.
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
