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
    Trash2,
    Building2,
    GraduationCap,
    TrendingUp,
    ShieldCheck,
    Settings,
    ArrowUpRight,
    Users,
    Activity,
    Database,
    Image as ImageIcon
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { CourseTable } from "./course-table";

interface UniversityEditViewProps {
    universityId: string;
}

type TabKey = "overview" | "details" | "programs" | "settings";

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "Overview", icon: <Activity className="h-4 w-4" /> },
    { key: "details", label: "Institutional Details", icon: <Building2 className="h-4 w-4" /> },
    { key: "programs", label: "Programs", icon: <BookOpen className="h-4 w-4" /> },
    { key: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
];

export function UniversityEditView({ universityId }: UniversityEditViewProps) {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabKey>("overview");
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
            toast.success("Settings saved successfully");
        },
        onError: () => {
            toast.error("Failed to save changes");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: () => adminService.deleteUniversity(universityId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-universities"] });
            toast.success("University deleted");
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

    const handleSubmit = () => {
        updateMutation.mutate(formData);
    };

    if (isLoading) {
        return (
            <div className="flex bg-[#fafafa] min-h-[500px] items-center justify-center">
                <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
            </div>
        );
    }

    if (error || !university) {
        return (
            <div className="max-w-3xl mx-auto mt-12 p-6 bg-white border border-greys-200 rounded-lg text-center shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">University Not Found</h3>
                <p className="text-sm text-slate-500 mb-6">This institution couldn't be loaded or doesn't exist.</p>
                <Button asChild variant="outline">
                    <Link href="/admin/content/universities">Back to Universities</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans pb-24 text-slate-900 border-x border-greys-100 max-w-[1400px] mx-auto shadow-[0_0_40px_-15px_rgba(0,0,0,0.05)]">
            {/* Header Area */}
            <div className="px-6 py-5 border-b border-greys-200 bg-white text-sm">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Link href="/admin/content/universities" className="hover:text-slate-900 transition-colors">Universities</Link>
                            <span className="text-greys-300">/</span>
                            <span className="font-medium text-slate-900 truncate max-w-[200px]">{formData.name || universityId}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="h-8 text-xs font-medium border-greys-200 hover:bg-greys-50 shadow-sm" asChild>
                           <a href={formData.websiteUrl || "#"} target="_blank" rel="noopener noreferrer">View Site <ArrowUpRight className="ml-1.5 h-3 w-3 text-slate-400"/></a>
                        </Button>
                        <Button 
                            onClick={handleSubmit} 
                            disabled={updateMutation.isPending}
                            className="h-8 px-4 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
                        >
                            {updateMutation.isPending && <Loader2 className="h-3 w-3 mr-2 animate-spin" />}
                            Save Settings
                        </Button>
                    </div>
                </div>
                <div className="mt-8 max-w-6xl mx-auto flex items-center gap-4">
                     <div className="h-12 w-12 bg-white border border-greys-200 rounded-lg p-1 shadow-sm flex items-center justify-center shrink-0">
                         {formData.logoUrl ? (
                             <img src={formData.logoUrl} alt={formData.name} className="object-contain h-full w-full rounded-md" />
                         ) : (
                             <Building2 className="h-6 w-6 text-slate-300" />
                         )}
                     </div>
                     <div>
                         <h1 className="text-xl font-semibold tracking-tight leading-tight">{formData.name || "Unnamed University"}</h1>
                         <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5 font-medium">
                             <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3"/> {formData.location || "No location set"}</span>
                             <span className="text-greys-300">•</span>
                             <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500"/> Verified</span>
                         </div>
                     </div>
                </div>
            </div>

            {/* Layout Grid */}
            <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-10">
                
                {/* Left Sidebar Tabs */}
                <div className="w-52 shrink-0 pr-4">
                    <div className="space-y-1 mb-6">
                        <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Configuration</p>
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all group",
                                    activeTab === tab.key
                                        ? "bg-indigo-50/70 text-indigo-700"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-greys-100/50"
                                )}
                            >
                                <div className={cn(
                                    "transition-colors",
                                    activeTab === tab.key ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                                )}>
                                    {tab.icon}
                                </div>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0">
                    {activeTab === "overview" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            
                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Ranking</p>
                                    <p className="text-2xl font-semibold text-slate-900">#{formData.ranking || "—"}</p>
                                </div>
                                <div className="pl-6 border-l border-greys-200">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Mentors</p>
                                    <p className="text-2xl font-semibold text-slate-900">12</p>
                                </div>
                                <div className="pl-6 border-l border-greys-200">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Programs</p>
                                    <p className="text-2xl font-semibold text-slate-900">8</p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-greys-200">
                                <h3 className="text-base font-semibold text-slate-900 mb-4">Useful Documentation to read</h3>
                                <div className="grid grid-cols-2 gap-4">
                                     <div className="p-5 bg-white border border-greys-200 shadow-sm rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                                         <BookOpen className="h-6 w-6 text-indigo-500 mb-4" />
                                         <h4 className="text-sm font-semibold text-slate-900 mb-2">Programs Config</h4>
                                         <p className="text-xs text-slate-500 mb-4 leading-relaxed">Guide to map university specific tracks like BDS and Grad Entry reliably.</p>
                                         <span className="text-indigo-600 font-medium text-xs flex items-center">Learn more <span className="ml-1">→</span></span>
                                     </div>
                                     <div className="p-5 bg-white border border-greys-200 shadow-sm rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                                         <Globe className="h-6 w-6 text-emerald-500 mb-4" />
                                         <h4 className="text-sm font-semibold text-slate-900 mb-2">Linkage & Assets</h4>
                                         <p className="text-xs text-slate-500 mb-4 leading-relaxed">Best practices for using high quality logos and verifying primary domains.</p>
                                          <span className="text-indigo-600 font-medium text-xs flex items-center">Learn more <span className="ml-1">→</span></span>
                                     </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "details" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">Core Fields</h2>
                            </div>
                            <div className="bg-white border border-greys-200 shadow-sm rounded-lg overflow-hidden">
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-xs font-semibold text-slate-700">Institution Name</Label>
                                            <Input id="name" value={formData.name} onChange={handleChange} className="h-9 px-3 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500 bg-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="location" className="text-xs font-semibold text-slate-700">Location</Label>
                                            <Input id="location" value={formData.location} onChange={handleChange} className="h-9 px-3 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500 bg-white" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dentalSchoolPathway" className="text-xs font-semibold text-slate-700">Admission Pathway</Label>
                                        <Input id="dentalSchoolPathway" value={formData.dentalSchoolPathway} onChange={handleChange} className="h-9 px-3 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500 bg-white" placeholder="e.g. 5-Year BDS" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-xs font-semibold text-slate-700">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="min-h-[160px] p-3 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500 bg-white resize-y"
                                        />
                                    </div>
                                </div>
                                <div className="px-6 py-4 bg-greys-50 border-t border-greys-200 flex items-center justify-end">
                                    <Button onClick={handleSubmit} disabled={updateMutation.isPending} className="h-8 px-4 text-xs font-medium bg-white border border-greys-200 text-slate-700 hover:bg-greys-100 shadow-sm">
                                        Save changes
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "settings" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                             <div>
                                <h2 className="text-lg font-semibold text-slate-900">Project Settings</h2>
                            </div>
                            
                            <div className="bg-white border border-greys-200 shadow-sm rounded-lg overflow-hidden">
                                <div className="p-6 space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="websiteUrl" className="text-xs font-semibold text-slate-700">Primary Domain</Label>
                                        <Input id="websiteUrl" value={formData.websiteUrl} onChange={handleChange} className="h-9 px-3 text-sm max-w-md focus-visible:ring-1 focus-visible:ring-indigo-500" placeholder="https://..." />
                                    </div>
                                    <div className="space-y-2 pt-4 border-t border-greys-100">
                                        <Label htmlFor="logoUrl" className="text-xs font-semibold text-slate-700">Logo Asset URL</Label>
                                        <div className="flex gap-4">
                                            <div className="h-16 w-16 rounded-md border border-greys-200 bg-white flex items-center justify-center shrink-0 shadow-sm p-1">
                                                {formData.logoUrl ? <img src={formData.logoUrl} className="h-full w-full object-contain" /> : <ImageIcon className="h-6 w-6 text-slate-300" />}
                                            </div>
                                            <div className="flex-1 space-y-2 max-w-md">
                                                <Input id="logoUrl" value={formData.logoUrl} onChange={handleChange} className="h-9 px-3 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500" placeholder="CDN URL" />
                                                <p className="text-[11px] text-slate-500">Provide an absolute URL to a high-resolution PNG.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4 bg-greys-50 border-t border-greys-200 flex items-center justify-end">
                                    <Button onClick={handleSubmit} disabled={updateMutation.isPending} className="h-8 px-4 text-xs font-medium bg-white border border-greys-200 text-slate-700 hover:bg-greys-100 shadow-sm">
                                        Save changes
                                    </Button>
                                </div>
                            </div>

                            <div className="pt-8">
                                <h3 className="text-base font-semibold text-error-600 mb-4">Danger Zone</h3>
                                <div className="p-5 border border-error-200 shadow-sm rounded-lg flex items-center justify-between bg-white">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Delete University</p>
                                        <p className="text-xs text-slate-500 mt-1">This action cannot be undone. All database records will be purged.</p>
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        onClick={() => {
                                            if (confirm("Are you totally sure? Delete action is permanent.")) deleteMutation.mutate();
                                        }}
                                        className="h-8 px-4 text-xs font-medium border-error-200 text-error-600 hover:bg-error-50 bg-white shadow-sm"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                    

                    {activeTab === "programs" && (
                         <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-900">Academic Programs</h2>
                                <p className="text-xs text-slate-500">Manage courses specifically offered by this institution.</p>
                            </div>
                            
                            <CourseTable universityId={universityId} />
                        </div>
                    )}
                </div>

                {/* Right Context Meta Info Column */}
                <div className="w-full xl:w-72 shrink-0 space-y-6 hidden lg:block">
                    <div>
                        <h3 className="text-[13px] font-semibold text-slate-900 mb-3">Project Info</h3>
                        <div className="bg-greys-50/50 border border-greys-200 rounded-lg overflow-hidden text-xs">
                            <div className="flex justify-between items-center px-4 py-2.5 border-b border-greys-100">
                                <span className="text-slate-500 font-medium">Region</span>
                                <span className="flex items-center gap-2"><MapPin className="h-3 w-3 text-slate-400"/>{formData.location ? formData.location.split(',').pop()?.trim() : "Unknown"}</span>
                            </div>
                            <div className="flex justify-between items-center px-4 py-2.5">
                                <span className="text-slate-500 font-medium">Internal Identifier</span>
                                <span className="font-mono text-slate-600 uppercase">{universityId.slice(0, 15)}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[13px] font-semibold text-slate-900 mb-3">Repository</h3>
                        <p className="text-[11px] text-slate-500 mb-3">Institutional records are synchronized with the primary platform network.</p>
                        <div className="flex items-center justify-between border border-greys-200 bg-white px-3 py-2.5 rounded-lg text-xs shadow-sm shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                            <span className="flex items-center gap-2 font-medium text-slate-700">
                                <Database className="h-3.5 w-3.5 text-slate-400" /> core/universities
                            </span>
                            <span className="text-indigo-600 font-medium cursor-pointer hover:underline">Edit</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
