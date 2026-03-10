"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/src/connection/admin-service";
import {
    Globe,
    MapPin,
    Link as LinkIcon,
    Star,
    BookOpen,
    Loader2,
    ArrowLeft,
    Save,
    Trash2
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface UniversityEditViewProps {
    universityId: string;
}

export function UniversityEditView({ universityId }: UniversityEditViewProps) {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        dentalSchoolPathway: "",
        description: "",
        websiteUrl: "",
        logoUrl: "",
        ranking: 0
    });

    const { data: university, isLoading, error } = useQuery({
        queryKey: ["admin-university-detail", universityId],
        queryFn: () => adminService.getUniversityDetail(universityId),
    });

    useEffect(() => {
        if (university) {
            setFormData({
                name: university.name || "",
                location: university.location || "",
                dentalSchoolPathway: university.dentalSchoolPathway || "",
                description: university.description || "",
                websiteUrl: university.websiteUrl || "",
                logoUrl: university.logoUrl || "",
                ranking: university.ranking || 0
            });
        }
    }, [university]);

    const updateMutation = useMutation({
        mutationFn: (payload: typeof formData) => adminService.updateUniversity(universityId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-university-detail", universityId] });
            queryClient.invalidateQueries({ queryKey: ["admin-universities"] });
            toast.success("University updated successfully");
        },
        onError: () => {
            toast.error("Failed to update university");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: () => adminService.deleteUniversity(universityId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-universities"] });
            toast.success("University deleted successfully");
            router.push("/admin/content/universities");
        },
        onError: () => {
            toast.error("Failed to delete university");
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: id === "ranking" ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
                <p className="text-gray-500">Loading university details...</p>
            </div>
        );
    }

    if (error || !university) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                <ArrowLeft className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-900 mb-2">Failed to Load University</h3>
                <p className="text-red-700 mb-6">We couldn&apos;t retrieve the details for this university.</p>
                <Button asChild variant="outline">
                    <Link href="/admin/content/universities">Back to Universities</Link>
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
                        <Link href="/admin/content/universities">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit University</h1>
                        <p className="text-sm text-gray-500">{university.name}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50 gap-2"
                        onClick={() => {
                            if (confirm("Are you sure you want to delete this university?")) {
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

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Basic Details */}
                <Card className="lg:col-span-2 border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary-600" />
                            General Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">University Name</Label>
                                <Input id="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" value={formData.location} onChange={handleChange} placeholder="e.g. London, UK" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dentalSchoolPathway">Dental School Pathway</Label>
                            <Input id="dentalSchoolPathway" value={formData.dentalSchoolPathway} onChange={handleChange} placeholder="e.g. Direct Entry (5 Years)" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="min-h-[150px] resize-none"
                                placeholder="Tell us more about this university..."
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column: Meta & Links */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Globe className="h-5 w-5 text-primary-600" />
                                Links & Ranking
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="websiteUrl">Website URL</Label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input id="websiteUrl" value={formData.websiteUrl} onChange={handleChange} className="pl-10" placeholder="https://..." />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="logoUrl">Logo URL</Label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input id="logoUrl" value={formData.logoUrl} onChange={handleChange} className="pl-10" placeholder="https://..." />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ranking">Global Ranking</Label>
                                <div className="relative">
                                    <Star className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input id="ranking" type="number" value={formData.ranking} onChange={handleChange} className="pl-10" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Preview */}
                    <Card className="border-none shadow-sm bg-primary-50/30">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold uppercase text-gray-400">Preview</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            {formData.logoUrl ? (
                                <div className="relative h-16 w-16 mb-4 rounded-lg bg-white p-2 border">
                                    <Image
                                        src={formData.logoUrl}
                                        alt="Logo Preview"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4 border border-dashed border-gray-300">
                                    <Globe className="h-8 w-8 text-gray-300" />
                                </div>
                            )}
                            <h4 className="font-bold text-gray-900">{formData.name || "University Name"}</h4>
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {formData.location || "Location"}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
}
