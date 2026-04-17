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
    ExternalLink,
    Settings,
    Activity,
    Database,
    ArrowUpRight,
    Search
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/src/lib/utils";

interface CourseEditViewProps {
    courseId: string;
}

type TabKey = "overview" | "requirements" | "fees" | "settings";

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "General Info", icon: <Activity className="h-4 w-4" /> },
    { key: "requirements", label: "Entry Reqs", icon: <Trophy className="h-4 w-4" /> },
    { key: "fees", label: "Fees & Links", icon: <Banknote className="h-4 w-4" /> },
    { key: "settings", label: "Management", icon: <Settings className="h-4 w-4" /> },
];

export function CourseEditView({ courseId }: CourseEditViewProps) {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabKey>("overview");
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
            toast.success("Course configuration updated");
        },
        onError: () => {
            toast.error("Failed to propagate course updates");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: () => adminService.deleteCourse(courseId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
            toast.success("Course purged from registry");
            router.push("/admin/content/courses");
        },
        onError: () => {
            toast.error("Handshake fail during deletion");
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === "number" ? (value ? Number(value) : undefined) : value
        }));
    };

    const handleSubmit = () => {
        if (!formData.universityHid || !formData.courseName) {
            toast.error("Primary fields are missing");
            return;
        }
        updateMutation.mutate(formData);
    };

    if (isLoading) {
        return (
            <div className="flex bg-[#fafafa] min-h-[500px] items-center justify-center">
                <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="max-w-3xl mx-auto mt-12 p-6 bg-white border border-greys-200 rounded-lg text-center shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Program Node Not Found</h3>
                <p className="text-sm text-slate-500 mb-6">This course registry entry could not be synchronized.</p>
                <Button asChild variant="outline">
                    <Link href="/admin/content/courses">Back to Programs Hub</Link>
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
                            <Link href="/admin/content/courses" className="hover:text-slate-900 transition-colors">Programs</Link>
                            <span className="text-greys-300">/</span>
                            <span className="font-medium text-slate-900 truncate max-w-[300px]">{formData.courseName || "Unnamed Program"}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button 
                            onClick={handleSubmit} 
                            disabled={updateMutation.isPending}
                            className="h-8 px-4 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
                        >
                            {updateMutation.isPending && <Loader2 className="h-3 w-3 mr-2 animate-spin" />}
                            Publish Updates
                        </Button>
                    </div>
                </div>
                <div className="mt-8 max-w-6xl mx-auto flex items-center gap-4">
                     <div className="h-12 w-12 bg-white border border-greys-200 rounded-lg p-1 shadow-sm flex items-center justify-center shrink-0 text-indigo-600">
                         <GraduationCap className="h-6 w-6" />
                     </div>
                     <div>
                         <h1 className="text-xl font-semibold tracking-tight leading-tight">{formData.courseName || "Unnamed Academy Program"}</h1>
                         <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5 font-medium">
                             <span className="flex items-center gap-1.5"><Database className="h-3 w-3 text-slate-400"/> {course.universityName || "Provider Pending"}</span>
                             <span className="text-greys-300">•</span>
                             <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-slate-400"/> {formData.durationYears ? `${formData.durationYears} Year Track` : "Variable Duration"}</span>
                             <span className="text-greys-300">•</span>
                             <span className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5 text-emerald-500"/> Deployment Active</span>
                         </div>
                     </div>
                </div>
            </div>

            {/* Layout Grid */}
            <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-10">
                
                {/* Left Sidebar Tabs */}
                <div className="w-52 shrink-0 pr-4">
                    <div className="space-y-1 mb-6">
                        <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Program Config</p>
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
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                             <div>
                                <h2 className="text-lg font-semibold text-slate-900">Definition Hub</h2>
                            </div>
                            
                            <div className="bg-white border border-greys-200 shadow-sm rounded-lg overflow-hidden">
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="courseName" className="text-xs font-semibold text-slate-700">Official Program Title</Label>
                                            <Input id="courseName" value={formData.courseName} onChange={handleChange} className="h-9 px-3 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500 bg-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="universityHid" className="text-xs font-semibold text-slate-700">Hosting Institution</Label>
                                            <select
                                                id="universityHid"
                                                className="w-full h-9 px-3 rounded-md border border-greys-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                value={formData.universityHid}
                                                onChange={handleChange}
                                            >
                                                <option value="">Link to provider...</option>
                                                {universitiesData?.content?.map(u => (
                                                    <option key={u.hid} value={u.hid}>{u.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="degreeType" className="text-xs font-semibold text-slate-700">Academic Level</Label>
                                            <select
                                                id="degreeType"
                                                className="w-full h-9 px-3 rounded-md border border-greys-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                value={formData.degreeType}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select level...</option>
                                                <option value="Undergraduate">Standard Entry (Undergraduate)</option>
                                                <option value="Postgraduate">Graduate Entry (Postgraduate)</option>
                                                <option value="Doctorate">Doctorate Specialist</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="durationYears" className="text-xs font-semibold text-slate-700">Duration Period (Years)</Label>
                                            <Input id="durationYears" type="number" value={formData.durationYears ?? ""} onChange={handleChange} className="h-9 px-3 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500 bg-white" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-xs font-semibold text-slate-700">Program Narrative</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="min-h-[160px] p-3 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500 bg-white resize-y"
                                            placeholder="Detailed curriculum overview..."
                                        />
                                    </div>
                                </div>
                                <div className="px-6 py-4 bg-greys-50 border-t border-greys-200 flex items-center justify-end">
                                    <Button onClick={handleSubmit} disabled={updateMutation.isPending} className="h-8 px-4 text-xs font-medium bg-white border border-greys-200 text-slate-700 hover:bg-greys-100 shadow-sm">
                                        Apply definition change
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "requirements" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                             <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-900">Academic Entry Protocol</h2>
                            </div>
                            
                            <div className="bg-white border border-greys-200 shadow-sm rounded-lg overflow-hidden">
                                <div className="p-6 space-y-8">
                                    <div className="space-y-2">
                                        <Label htmlFor="entryRequirements" className="text-xs font-semibold text-slate-700">General Gateways</Label>
                                        <Input id="entryRequirements" value={formData.entryRequirements} onChange={handleChange} className="h-9 px-3 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500 bg-white" placeholder="Standard entry criteria..." />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-greys-100">
                                        <div className="space-y-2">
                                            <Label htmlFor="aLevelRequirements" className="text-xs font-semibold text-slate-700">A-Level Grid</Label>
                                            <Input id="aLevelRequirements" value={formData.aLevelRequirements} onChange={handleChange} className="h-9 px-3 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500 bg-white" placeholder="e.g. AAA" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="ibRequirements" className="text-xs font-semibold text-slate-700">IB Points Score</Label>
                                            <Input id="ibRequirements" value={formData.ibRequirements} onChange={handleChange} className="h-9 px-3 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500 bg-white" placeholder="e.g. 38 Points" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-greys-100">
                                        <div className="space-y-2">
                                            <Label htmlFor="ucatRequirement" className="text-xs font-semibold text-slate-700">Aptitude (UCAT/GAMSAT)</Label>
                                            <Input id="ucatRequirement" value={formData.ucatRequirement} onChange={handleChange} className="h-9 px-3 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500 bg-white" placeholder="Cutoff or weighting..." />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="interviewDetails" className="text-xs font-semibold text-slate-700">Interview Format</Label>
                                            <Input id="interviewDetails" value={formData.interviewDetails} onChange={handleChange} className="h-9 px-3 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500 bg-white" placeholder="MMI or Panel..." />
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4 bg-greys-50 border-t border-greys-200 flex items-center justify-end">
                                    <Button onClick={handleSubmit} disabled={updateMutation.isPending} className="h-8 px-4 text-xs font-medium bg-white border border-greys-200 text-slate-700 hover:bg-greys-100 shadow-sm">
                                        Lock requirements
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "fees" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                             <div>
                                <h2 className="text-lg font-semibold text-slate-900">Financial Nodes & Assets</h2>
                            </div>
                            
                            <div className="bg-white border border-greys-200 shadow-sm rounded-lg overflow-hidden">
                                <div className="p-6 space-y-8">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="feesDomestic" className="text-xs font-semibold text-slate-700">Domestic Tuition Node (£)</Label>
                                            <div className="relative">
                                                <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                                <Input id="feesDomestic" type="number" value={formData.feesDomestic ?? ""} onChange={handleChange} className="h-9 pl-10 pr-3 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="feesInternational" className="text-xs font-semibold text-slate-700">International Tuition Node (£)</Label>
                                            <div className="relative">
                                                <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                                <Input id="feesInternational" type="number" value={formData.feesInternational ?? ""} onChange={handleChange} className="h-9 pl-10 pr-3 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-6 border-t border-greys-100">
                                        <Label htmlFor="courseUrl" className="text-xs font-semibold text-slate-700">Primary Program Source URL</Label>
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <div className="relative">
                                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                    <Input id="courseUrl" value={formData.courseUrl} onChange={handleChange} className="h-9 pl-10 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500" placeholder="https://university.ac.uk/dentistry" />
                                                </div>
                                            </div>
                                            {formData.courseUrl && (
                                                <Button asChild variant="outline" className="h-9 h-9 border-greys-200">
                                                    <a href={formData.courseUrl} target="_blank" rel="noopener noreferrer"><ArrowUpRight className="h-4 w-4" /></a>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    
                                     <div className="space-y-2 pt-4">
                                        <Label htmlFor="applicationDeadline" className="text-xs font-semibold text-slate-700">Admission Cutoff Date</Label>
                                        <div className="relative max-w-sm">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input id="applicationDeadline" type="date" value={formData.applicationDeadline} onChange={handleChange} className="h-9 pl-10 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500" />
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4 bg-greys-50 border-t border-greys-200 flex items-center justify-end">
                                    <Button onClick={handleSubmit} disabled={updateMutation.isPending} className="h-8 px-4 text-xs font-medium bg-white border border-greys-200 text-slate-700 hover:bg-greys-100 shadow-sm">
                                        Update financial record
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === "settings" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                             <div>
                                <h2 className="text-lg font-semibold text-slate-900">Governance & Decommissioning</h2>
                            </div>
                            
                            <div className="bg-white border text-sm border-greys-200 shadow-sm rounded-lg overflow-hidden p-8 space-y-10">
                                <div className="space-y-2">
                                    <h3 className="text-sm font-semibold text-slate-900">Program Integrity</h3>
                                    <p className="text-xs text-slate-400 font-medium italic">Ensure program naming conventions align with ecosystem standards.</p>
                                </div>
                                
                                <div className="pt-6 border-t border-error-100">
                                     <p className="text-sm font-semibold text-error-600 mb-2">Danger Zone</p>
                                     <div className="p-5 border border-error-100 rounded-lg bg-error-50/10 flex items-center justify-between">
                                          <div>
                                              <p className="text-xs font-bold text-slate-900">Purge Course Entry</p>
                                              <p className="text-[11px] text-slate-500 mt-1">Permanently remove this program from the database. Handshake cannot be undone.</p>
                                          </div>
                                          <Button 
                                              variant="outline" 
                                              onClick={() => { if(confirm("Confirm decommissioning?")) deleteMutation.mutate(); }}
                                              className="h-8 px-4 text-xs font-medium border-error-200 text-error-600 hover:bg-error-50 bg-white transition-all shadow-sm"
                                          >
                                              Decommission
                                          </Button>
                                     </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Context Meta Info Column */}
                <div className="w-full xl:w-64 shrink-0 space-y-6 hidden lg:block">
                    <div>
                        <h3 className="text-[12px] font-semibold text-slate-900 mb-3 uppercase tracking-wider">Sync State</h3>
                        <div className="bg-white border border-greys-200 rounded-lg overflow-hidden text-sm shadow-sm p-5 space-y-4">
                             <div className="flex items-center gap-3">
                                 <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                 <span className="text-xs font-bold text-slate-600 tracking-tight">Deployment Alive</span>
                             </div>
                             <p className="text-[11px] text-slate-400 leading-tight">Last synchronized node cluster transition successful.</p>
                        </div>
                    </div>

                    <div className="pt-4">
                        <h3 className="text-[12px] font-semibold text-slate-900 mb-3 uppercase tracking-wider">Operational Intel</h3>
                        <div className="flex flex-col gap-3">
                             <div className="border border-greys-200 bg-white px-3 py-2.5 rounded-lg text-[11px] shadow-sm">
                                 <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mb-1">Global HID</p>
                                 <p className="font-mono text-slate-700 truncate">{courseId}</p>
                             </div>
                             <div className="border border-greys-200 bg-slate-50 px-3 py-2.5 rounded-lg text-xs shadow-inner">
                                <span className="flex items-center gap-2 font-medium text-slate-700">
                                    <Database className="h-3.5 w-3.5 text-slate-400" /> core/programs
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
