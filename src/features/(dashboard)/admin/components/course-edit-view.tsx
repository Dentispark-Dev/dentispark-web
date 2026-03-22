"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/src/connection/admin-service";
import { CreateCoursePayload } from "@/src/connection/api-types";
import {
    BookOpen,
    Loader2,
    ArrowLeft,
    Save,
    Trash2,
    GraduationCap,
    Clock,
    Banknote,
    Calendar,
    Globe,
    FileText,
    Trophy,
    ExternalLink
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CourseEditViewProps {
    courseId: string;
}

export function CourseEditView({ courseId }: CourseEditViewProps) {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [formData, setFormData] = useState<CreateCoursePayload>({
        universityHid: "",
        courseName: "",
        degreeType: "",
        durationYears: undefined,
        entryRequirements: "",
        description: "",
        feesDomestic: undefined,
        feesInternational: undefined,
        applicationDeadline: "",
        aLevelRequirements: "",
        ibRequirements: "",
        ucatRequirement: "",
        interviewDetails: "",
        courseUrl: ""
    });

    const { data: course, isLoading, error } = useQuery({
        queryKey: ["admin-course-detail", courseId],
        queryFn: () => adminService.getCourseDetail(courseId),
    });

    const { data: universitiesData } = useQuery({
        queryKey: ["admin-universities-all"],
        queryFn: () => adminService.getUniversityRecords({ page: 0, perPage: 100 }),
    });

    useEffect(() => {
        if (course) {
            setFormData({
                universityHid: course.universityHid || "",
                courseName: course.courseName || "",
                degreeType: course.degreeType || "",
                durationYears: course.durationYears,
                entryRequirements: course.entryRequirements || "",
                description: course.description || "",
                feesDomestic: course.feesDomestic,
                feesInternational: course.feesInternational,
                applicationDeadline: course.applicationDeadline || "",
                aLevelRequirements: course.aLevelRequirements || "",
                ibRequirements: course.ibRequirements || "",
                ucatRequirement: course.ucatRequirement || "",
                interviewDetails: course.interviewDetails || "",
                courseUrl: course.courseUrl || ""
            });
        }
    }, [course]);

    const updateMutation = useMutation({
        mutationFn: (payload: CreateCoursePayload) => adminService.updateCourse(courseId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-course-detail", courseId] });
            queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
            toast.success("Course updated successfully");
        },
        onError: () => {
            toast.error("Failed to update course");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: () => adminService.deleteCourse(courseId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
            toast.success("Course deleted successfully");
            router.push("/admin/content/courses");
        },
        onError: () => {
            toast.error("Failed to delete course");
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === "number" ? (value ? Number(value) : undefined) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.universityHid || !formData.courseName) {
            toast.error("University and Course Name are required");
            return;
        }
        updateMutation.mutate(formData);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
                <p className="text-gray-500">Loading course details...</p>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                <ArrowLeft className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-900 mb-2">Failed to Load Course</h3>
                <p className="text-red-700 mb-6">We couldn&apos;t retrieve the details for this course.</p>
                <Button asChild variant="outline">
                    <Link href="/admin/content/courses">Back to Courses</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost" size="icon" className="rounded-full h-10 w-10">
                        <Link href="/admin/content/courses">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Course</h1>
                        <p className="text-sm text-gray-500">{course.courseName} - {course.universityName}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50 gap-2"
                        onClick={() => {
                            if (confirm("Are you sure you want to delete this course?")) {
                                deleteMutation.mutate();
                            }
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={updateMutation.isPending}
                        className="bg-primary-600 hover:bg-primary-700 gap-2"
                    >
                        {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
                {/* Left Column: Core Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-primary-600" />
                                Basic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="universityHid">University *</Label>
                                    <select
                                        id="universityHid"
                                        className="w-full h-10 px-3 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        value={formData.universityHid}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select a university</option>
                                        {universitiesData?.content?.map(u => (
                                            <option key={u.hid} value={u.hid}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="courseName">Course Name *</Label>
                                    <Input id="courseName" value={formData.courseName} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="degreeType">Degree Type</Label>
                                    <select
                                        id="degreeType"
                                        className="w-full h-10 px-3 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        value={formData.degreeType}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select type</option>
                                        <option value="Undergraduate">Undergraduate</option>
                                        <option value="Postgraduate">Postgraduate</option>
                                        <option value="Doctorate">Doctorate</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="durationYears">Duration (Years)</Label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="durationYears"
                                            type="number"
                                            value={formData.durationYears ?? ""}
                                            onChange={handleChange}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="min-h-[120px] resize-none"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-primary-600" />
                                Entry Requirements
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="entryRequirements">General Requirements</Label>
                                <Input id="entryRequirements" value={formData.entryRequirements} onChange={handleChange} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="aLevelRequirements">A-Level Requirements</Label>
                                    <Input id="aLevelRequirements" value={formData.aLevelRequirements} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ibRequirements">IB Requirements</Label>
                                    <Input id="ibRequirements" value={formData.ibRequirements} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ucatRequirement">UCAT Requirement</Label>
                                    <Input id="ucatRequirement" value={formData.ucatRequirement} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="interviewDetails">Interview Details</Label>
                                    <Input id="interviewDetails" value={formData.interviewDetails} onChange={handleChange} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Fees, Deadlines & Links */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Banknote className="h-5 w-5 text-primary-600" />
                                Fees & Deadlines
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="feesDomestic">Domestic Fees (£)</Label>
                                <div className="relative">
                                    <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="feesDomestic"
                                        type="number"
                                        value={formData.feesDomestic ?? ""}
                                        onChange={handleChange}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="feesInternational">International Fees (£)</Label>
                                <div className="relative">
                                    <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="feesInternational"
                                        type="number"
                                        value={formData.feesInternational ?? ""}
                                        onChange={handleChange}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="applicationDeadline">Application Deadline</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="applicationDeadline"
                                        type="date"
                                        value={formData.applicationDeadline}
                                        onChange={handleChange}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Globe className="h-5 w-5 text-primary-600" />
                                External Links
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="courseUrl">Course Website URL</Label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="courseUrl"
                                        value={formData.courseUrl}
                                        onChange={handleChange}
                                        className="pl-10"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                            {formData.courseUrl && (
                                <Button asChild variant="outline" size="sm" className="w-full gap-2">
                                    <a href={formData.courseUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-3 w-3" />
                                        Visit Course Page
                                    </a>
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Stats Card */}
                    <Card className="border-none shadow-sm bg-primary-50/30">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold uppercase text-gray-400">Course Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                    <GraduationCap className="h-5 w-5 text-primary-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Degree Type</p>
                                    <p className="text-sm font-semibold">{formData.degreeType || "Not specified"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                    <Clock className="h-5 w-5 text-primary-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Duration</p>
                                    <p className="text-sm font-semibold">{formData.durationYears ? `${formData.durationYears} Years` : "Not specified"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                    <FileText className="h-5 w-5 text-primary-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Requirements</p>
                                    <p className="text-sm font-semibold truncate max-w-[150px]">{formData.aLevelRequirements || "Not specified"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
}
