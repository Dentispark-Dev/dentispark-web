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
    Stethoscope,
    Briefcase,
    Award,
    FileText,
    ExternalLink,
    Clock3
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";
import { MentorRadarChart } from "@/src/features/(dashboard)/profile/components/mentor-radar-chart";
import { MentorBadgeList } from "@/src/features/(dashboard)/profile/components/mentor-badge-list";
import { Zap, Target, Users, TrendingUp } from "lucide-react";

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
                <p className="text-gray-500 font-sora">Loading mentor dossier...</p>
            </div>
        );
    }

    if (error || !mentor) {
        return (
            <div className="bg-red-50/50 backdrop-blur-md border border-red-100 rounded-3xl p-12 text-center shadow-lg shadow-red-100/20">
                <div className="bg-red-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="h-10 w-10 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-red-900 mb-2 font-sora">Profile Unavailable</h3>
                <p className="text-red-700 mb-8 max-w-md mx-auto">We couldn&apos;t retrieve the complete dossier for this mentor. It may have been removed or the server is unresponsive.</p>
                <Button asChild className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8">
                    <Link href="/admin/mentors">Return to Directory</Link>
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
                        <Link href="/admin/mentors">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight font-sora">{mentor.firstName} {mentor.lastName}</h1>
                            {mentor.verified && (
                                <div className="bg-blue-50 text-blue-500 p-1 rounded-full" title="Verified Mentor">
                                    <CheckCircle className="h-5 w-5" />
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                            <span className="flex items-center gap-1"><User className="h-4 w-4" /> ID: <span className="font-mono text-gray-700">{mentor.hid}</span></span>
                            <span className="h-1 w-1 rounded-full bg-gray-300" />
                            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Joined: {new Date(mentor.dateStamped).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</span>
                        </div>
                        <MentorBadgeList badges={["GDC_REGISTERED", "OXFORD_GRAD", "TOP_MENTOR"]} />
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <Button
                        variant={mentor.verified ? "outline" : "default"}
                        onClick={() => verifyMutation.mutate(!mentor.verified)}
                        disabled={verifyMutation.isPending}
                        className={`rounded-full shadow-sm ${mentor.verified ? "border-amber-200 text-amber-700 hover:bg-amber-50" : "bg-blue-600 hover:bg-blue-700 text-white border-none"}`}
                    >
                        {mentor.verified ? "Revoke Verification" : "Verify Mentor"}
                    </Button>
                    
                    {mentor.activationStatus !== "ACTIVE" ? (
                        <Button
                            onClick={() => updateStatusMutation.mutate("ACTIVE")}
                            disabled={updateStatusMutation.isPending}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-full shadow-sm border-none"
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Activate
                        </Button>
                    ) : (
                        <Button
                            variant="destructive"
                            onClick={() => updateStatusMutation.mutate("INACTIVE")}
                            disabled={updateStatusMutation.isPending}
                            className="rounded-full shadow-sm"
                        >
                            <XCircle className="h-4 w-4 mr-2" />
                            Deactivate
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Essential Contact Info */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="border-none shadow-xl shadow-gray-200/40 bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-primary-500 to-emerald-400" />
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2 font-sora">
                                <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                                    <User className="h-5 w-5" />
                                </div>
                                Contact Profile
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
                                        <p className="text-sm font-semibold text-gray-900">{mentor.emailAddress}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="mt-0.5 p-2 bg-gray-50 border border-gray-100 rounded-xl text-gray-500">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Phone Number</p>
                                        <p className="text-sm font-semibold text-gray-900">{mentor.phoneNumber || "Not provided"}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-6 border-t border-gray-100 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-gray-600">Account Status</span>
                                    {getStatusBadge(mentor.activationStatus)}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-gray-600">Verification</span>
                                    {mentor.verified ? (
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full"><CheckCircle className="h-3.5 w-3.5" /> Verified</span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full"><AlertCircle className="h-3.5 w-3.5" /> Pending</span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Verification Dossier */}
                    <Card className="border-none shadow-xl shadow-gray-200/40 bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-amber-400 to-orange-500" />
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2 font-sora">
                                <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                                    <Award className="h-5 w-5" />
                                </div>
                                Verification Dossier
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Submitted Documents</p>
                                
                                {mentor.documentUploadLinks && mentor.documentUploadLinks.length > 0 ? (
                                    mentor.documentUploadLinks.map((link, idx) => (
                                        <a 
                                            key={idx}
                                            href={link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-3 bg-gray-50 hover:bg-amber-50 border border-gray-100 rounded-2xl transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 bg-white rounded-lg shadow-sm text-gray-400 group-hover:text-amber-500">
                                                    <FileText className="h-4 w-4" />
                                                </div>
                                                <span className="text-sm font-semibold text-gray-700">
                                                    {link.includes("cv") ? "Curriculum Vitae" : link.includes("cert") ? "Certification" : `Document ${idx + 1}`}
                                                </span>
                                            </div>
                                            <ExternalLink className="h-3.5 w-3.5 text-gray-300 group-hover:text-amber-400" />
                                        </a>
                                    ))
                                ) : (
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
                                        <p className="text-xs text-gray-400 font-medium italic">No documents uploaded yet.</p>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-gray-100 space-y-3">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Vetting Interview</p>
                                <div className="flex items-center gap-3 p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                    <Clock3 className="h-4 w-4 text-indigo-500" />
                                    <div>
                                        <p className="text-[10px] font-bold text-indigo-400 uppercase">Scheduled Slot</p>
                                        <p className="text-sm font-bold text-indigo-900">{mentor.interviewDate ? `${mentor.interviewDate} ${mentor.interviewSlot || ""}` : "Not scheduled"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button 
                                    className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold py-6 shadow-lg shadow-amber-500/20"
                                    onClick={() => verifyMutation.mutate(!mentor.verified)}
                                >
                                    {mentor.verified ? "Revoke Verification" : "Verify Credentials"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Mentorship Stats / Ratings */}
                    <Card className="border-none shadow-xl shadow-gray-200/40 bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden relative group">
                        <div className="absolute -right-12 -top-12 h-32 w-32 bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-400/20 transition-colors" />
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-bold text-gray-900 font-sora">Performance</h3>
                                <div className="p-2 bg-amber-50 rounded-xl text-amber-500">
                                    <Award className="h-5 w-5" />
                                </div>
                            </div>
                            
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-amber-50 to-orange-50/50 border-4 border-white shadow-lg mb-4">
                                    <span className="text-4xl font-black text-amber-500 tracking-tighter">
                                        {mentor.averageRating?.toFixed(1) ?? "N/A"}
                                    </span>
                                </div>
                                <div className="flex justify-center gap-1 mb-2">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Star key={i} className={`h-5 w-5 ${i <= Math.round(mentor.averageRating || 0) ? "text-amber-400 fill-amber-400 drop-shadow-sm" : "text-gray-200 fill-gray-100"}`} />
                                    ))}
                                </div>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">{mentor.totalReviews ?? 0} Reviews Total</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Deep Professional Data */}
                <div className="lg:col-span-8 space-y-8">
                    <Card className="border-none shadow-xl shadow-gray-200/40 bg-white/80 backdrop-blur-xl rounded-3xl h-full">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3 font-sora">
                                <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 shadow-sm border border-indigo-100">
                                    <Briefcase className="h-5 w-5" />
                                </div>
                                Professional Expertise
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="p-5 bg-gray-50/80 rounded-2xl border border-gray-100/80 hover:bg-white hover:shadow-md transition-all">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Years Active</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-2xl font-black text-gray-900">{mentor.yearsInDentistry ?? 0}</p>
                                        <span className="text-sm font-semibold text-gray-500">Years</span>
                                    </div>
                                </div>
                                <div className="p-5 bg-gray-50/80 rounded-2xl border border-gray-100/80 hover:bg-white hover:shadow-md transition-all md:col-span-2">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Primary Specialization</p>
                                    <p className="text-lg font-bold text-indigo-700">{mentor.areaOfSpecialization || mentor.dentalSchoolGateway || "General Dentistry"}</p>
                                </div>
                            </div>

                            {/* Supercharged: Impact Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-br from-indigo-600 to-primary-700 p-6 rounded-3xl text-white shadow-lg shadow-indigo-100 overflow-hidden relative">
                                    <Zap className="absolute -right-4 -bottom-4 h-24 w-24 opacity-10" />
                                    <div className="relative z-10">
                                        <div className="p-2 bg-white/20 rounded-xl w-fit mb-4 backdrop-blur-md">
                                            <Users className="h-5 w-5" />
                                        </div>
                                        <p className="text-3xl font-black mb-1">50+</p>
                                        <p className="text-xs font-bold uppercase tracking-widest opacity-80">Students Guided</p>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-3xl text-white shadow-lg shadow-emerald-100 overflow-hidden relative">
                                    <Target className="absolute -right-4 -bottom-4 h-24 w-24 opacity-10" />
                                    <div className="relative z-10">
                                        <div className="p-2 bg-white/20 rounded-xl w-fit mb-4 backdrop-blur-md">
                                            <TrendingUp className="h-5 w-5" />
                                        </div>
                                        <p className="text-3xl font-black mb-1">98%</p>
                                        <p className="text-xs font-bold uppercase tracking-widest opacity-80">Admission Success</p>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-3xl text-white shadow-lg shadow-amber-100 overflow-hidden relative">
                                    <Award className="absolute -right-4 -bottom-4 h-24 w-24 opacity-10" />
                                    <div className="relative z-10">
                                        <div className="p-2 bg-white/20 rounded-xl w-fit mb-4 backdrop-blur-md">
                                            <Star className="h-5 w-5" />
                                        </div>
                                        <p className="text-3xl font-black mb-1">4.9/5</p>
                                        <p className="text-xs font-bold uppercase tracking-widest opacity-80">Avg. Satisfaction</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
                                {/* Radar Chart for Strengths */}
                                <div className="md:col-span-1">
                                    <MentorRadarChart data={{
                                        ucat: 4.8,
                                        mmi: 4.5,
                                        personalStatement: 4.9,
                                        clinicalKnowledge: 4.2,
                                        academicGuidance: 4.7
                                    }} />
                                </div>

                                <div className="md:col-span-1 space-y-6">
                                    <div className="p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl border border-blue-100/50 group hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
                                                <Stethoscope className="h-4 w-4" />
                                            </div>
                                            <h4 className="font-bold text-gray-900 font-sora">School & Clinical Experience</h4>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed text-sm">
                                            {mentor.dentalSchoolExperience ? mentor.dentalSchoolExperience : <span className="text-gray-400 italic">No detailed school experience provided during onboarding.</span>}
                                        </p>
                                    </div>

                                    <div className="p-6 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 rounded-2xl border border-emerald-100/50 group hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-white rounded-lg shadow-sm text-emerald-600">
                                                <User className="h-4 w-4" />
                                            </div>
                                            <h4 className="font-bold text-gray-900 font-sora">Motivation for Mentoring</h4>
                                        </div>
                                        {mentor.whyMentor ? (
                                            <blockquote className="border-l-4 border-emerald-300 pl-4 py-1 italic text-gray-700 text-sm leading-relaxed">
                                                &quot;{mentor.whyMentor}&quot;
                                            </blockquote>
                                        ) : (
                                            <p className="text-gray-400 italic text-sm">No specific motivational statement provided.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}
