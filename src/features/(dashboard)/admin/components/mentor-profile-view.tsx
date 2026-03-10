"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/src/connection/admin-service";
import {
    Mail,
    Phone,
    Calendar,
    Star,
    User,
    CheckCircle,
    XCircle,
    AlertCircle,
    Loader2,
    ArrowLeft,
    Stethoscope
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

interface MentorProfileViewProps {
    mentorId: string;
}

export function MentorProfileView({ mentorId }: MentorProfileViewProps) {
    const queryClient = useQueryClient();

    const { data: mentor, isLoading, error } = useQuery({
        queryKey: ["admin-mentor-detail", mentorId],
        queryFn: () => adminService.getMentorDetail(mentorId),
    });

    const updateStatusMutation = useMutation({
        mutationFn: (status: string) => adminService.updateMentorStatus(mentorId, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-mentor-detail", mentorId] });
            queryClient.invalidateQueries({ queryKey: ["admin-mentors"] });
            toast.success("Mentor status updated successfully");
        },
        onError: () => {
            toast.error("Failed to update mentor status");
        }
    });

    const verifyMutation = useMutation({
        mutationFn: (verify: boolean) => adminService.verifyMentor(mentorId, { verify }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-mentor-detail", mentorId] });
            toast.success("Mentor verification updated");
        },
        onError: () => {
            toast.error("Failed to update verification");
        }
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
                <p className="text-gray-500">Loading mentor profile...</p>
            </div>
        );
    }

    if (error || !mentor) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-900 mb-2">Failed to Load Profile</h3>
                <p className="text-red-700 mb-6">We couldn&apos;t retrieve the details for this mentor. Please try again later.</p>
                <Button asChild variant="outline">
                    <Link href="/admin/mentors">Back to Mentors</Link>
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
            default:
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-3 py-1">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost" size="icon" className="rounded-full h-10 w-10">
                        <Link href="/admin/mentors">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{mentor.firstName} {mentor.lastName}</h1>
                        <p className="text-sm text-gray-500">Mentor ID: <span className="font-mono font-medium">{mentor.hid}</span></p>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <Button
                        variant="outline"
                        onClick={() => verifyMutation.mutate(!mentor.verified)}
                        disabled={verifyMutation.isPending}
                        className={mentor.verified ? "border-yellow-500 text-yellow-600 hover:bg-yellow-50" : "border-green-500 text-green-600 hover:bg-green-50"}
                    >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {mentor.verified ? "Unverify Mentor" : "Verify Mentor"}
                    </Button>
                    {mentor.activationStatus !== "ACTIVE" && (
                        <Button
                            onClick={() => updateStatusMutation.mutate("ACTIVE")}
                            disabled={updateStatusMutation.isPending}
                            className="bg-green-600 hover:bg-green-700 flex gap-2"
                        >
                            <CheckCircle className="h-4 w-4" />
                            Activate Account
                        </Button>
                    )}
                    {mentor.activationStatus === "ACTIVE" && (
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
                {/* Left Column */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm">
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
                                    <p className="text-sm font-medium">{mentor.emailAddress}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="h-4 w-4 text-gray-400 mt-1" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Phone Number</p>
                                    <p className="text-sm font-medium">{mentor.phoneNumber || "Not provided"}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar className="h-4 w-4 text-gray-400 mt-1" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Date Registered</p>
                                    <p className="text-sm font-medium">
                                        {new Date(mentor.dateStamped).toLocaleDateString("en-GB", {
                                            day: "numeric", month: "long", year: "numeric"
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="h-4 w-4 flex items-center justify-center mt-1">
                                    <div className="h-2 w-2 rounded-full bg-primary-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Account Status</p>
                                    <div className="mt-1">{getStatusBadge(mentor.activationStatus)}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className={`h-4 w-4 mt-1 ${mentor.verified ? "text-green-500" : "text-gray-400"}`} />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Verification</p>
                                    <p className={`text-sm font-medium ${mentor.verified ? "text-green-600" : "text-gray-500"}`}>
                                        {mentor.verified ? "Verified Mentor" : "Pending Verification"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Ratings */}
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Star className="h-5 w-5 text-yellow-500" />
                                Ratings
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="text-4xl font-bold text-gray-900">
                                    {mentor.averageRating?.toFixed(1) ?? "N/A"}
                                </div>
                                <div>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <Star key={i} className={`h-4 w-4 ${i <= Math.round(mentor.averageRating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">{mentor.totalReviews ?? 0} reviews</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Stethoscope className="h-5 w-5 text-primary-600" />
                                Professional Profile
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4 p-4 rounded-xl bg-gray-50/50">
                                    <h4 className="font-semibold text-gray-900 border-b pb-2">Experience</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="space-y-1">
                                            <p className="text-gray-500">Years in Dentistry</p>
                                            <p className="font-medium text-primary-700">{mentor.yearsInDentistry ?? "N/A"}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-gray-500">Specialization</p>
                                            <p className="font-medium">{mentor.areaOfSpecialization || mentor.dentalSchoolGateway || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4 p-4 rounded-xl bg-gray-50/50">
                                    <h4 className="font-semibold text-gray-900 border-b pb-2">School Experience</h4>
                                    <p className="text-sm text-gray-600">{mentor.dentalSchoolExperience || "Not provided"}</p>
                                </div>
                            </div>
                            {mentor.whyMentor && (
                                <div className="mt-6 space-y-2">
                                    <h4 className="text-sm font-semibold text-gray-700 uppercase">Why They Mentor</h4>
                                    <p className="text-sm text-gray-600 bg-white p-4 rounded-lg border border-gray-100 italic">
                                        &quot;{mentor.whyMentor}&quot;
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
