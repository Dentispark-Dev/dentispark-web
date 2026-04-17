"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/src/connection/admin-service";
import { CreateScholarshipPayload } from "@/src/connection/api-types";
import {
    Award,
    Loader2,
    ArrowLeft,
    Save,
    Trash2,
    Globe,
    FileText,
    Banknote,
    Calendar,
    ExternalLink,
    Settings,
    Activity,
    Database,
    ArrowUpRight,
    Search,
    Stethoscope,
    GraduationCap,
    MapPin,
    Users
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/src/lib/utils";

interface ScholarshipEditViewProps {
    scholarshipId: string;
}

type TabKey = "general" | "eligibility" | "financials" | "settings";

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "general", label: "Grant Info", icon: <Award className="h-4 w-4" /> },
    { key: "eligibility", label: "Eligibility", icon: <Users className="h-4 w-4" /> },
    { key: "financials", label: "Nodes & Links", icon: <Banknote className="h-4 w-4" /> },
    { key: "settings", label: "Governance", icon: <Settings className="h-4 w-4" /> },
];

export function ScholarshipEditView({ scholarshipId }: ScholarshipEditViewProps) {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabKey>("general");
    const [formData, setFormData] = useState<CreateScholarshipPayload>({
        title: "",
        description: "",
        amountValue: 0,
        amountCurrency: "GBP",
        deadline: "",
        eligibilityCriteriaJson: "",
        applicationLink: "",
        isSponsored: false,
        targetDegreeLevel: "",
        targetLocation: "",
        fundingType: "",
        numberOfAwards: "",
        selectionBasis: "",
        coversJson: "",
        intakeYear: "",
        gender: "",
        nationality: "",
        studyMode: ""
    });

    const { data: scholarship, isLoading, error } = useQuery({
        queryKey: ["admin-scholarship-detail", scholarshipId],
        queryFn: () => adminService.getScholarshipDetail(scholarshipId),
    });

    useEffect(() => {
        if (scholarship) {
            setFormData({
                title: scholarship.title || "",
                description: scholarship.description || "",
                amountValue: scholarship.amountValue || 0,
                amountCurrency: scholarship.amountCurrency || "GBP",
                deadline: scholarship.deadline || "",
                eligibilityCriteriaJson: scholarship.eligibilityCriteriaJson || "",
                applicationLink: scholarship.applicationLink || "",
                isSponsored: scholarship.isSponsored || false,
                targetDegreeLevel: scholarship.targetDegreeLevel || "",
                targetLocation: scholarship.targetLocation || "",
                fundingType: scholarship.fundingType || "",
                numberOfAwards: scholarship.numberOfAwards || "",
                selectionBasis: scholarship.selectionBasis || "",
                coversJson: scholarship.coversJson || "",
                intakeYear: scholarship.intakeYear || "",
                gender: scholarship.gender || "",
                nationality: scholarship.nationality || "",
                studyMode: scholarship.studyMode || ""
            });
        }
    }, [scholarship]);

    const updateMutation = useMutation({
        mutationFn: (payload: Partial<CreateScholarshipPayload>) => adminService.updateScholarship(scholarshipId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-scholarship-detail", scholarshipId] });
            queryClient.invalidateQueries({ queryKey: ["admin-scholarships"] });
            toast.success("Scholarship configuration updated");
        },
        onError: () => {
            toast.error("Failed to propagate scholarship updates");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: () => adminService.deleteScholarship(scholarshipId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-scholarships"] });
            toast.success("Scholarship purged from registry");
            router.push("/admin/content/scholarships");
        },
        onError: () => {
            toast.error("Handshake fail during deletion");
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === "number" ? Number(value) : value
        }));
    };

    const handleToggle = (id: keyof CreateScholarshipPayload) => {
        setFormData(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSubmit = () => {
        if (!formData.title) {
            toast.error("Scholarship Title is required");
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

    if (error || !scholarship) {
        return (
            <div className="max-w-3xl mx-auto mt-12 p-6 bg-white border border-greys-200 rounded-lg text-center shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Scholarship Node Not Found</h3>
                <p className="text-sm text-slate-500 mb-6">This scholarship registry entry could not be synchronized.</p>
                <Button asChild variant="outline">
                    <Link href="/admin/content/scholarships">Back to Grants Hub</Link>
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
                            <Link href="/admin/content/scholarships" className="hover:text-slate-900 transition-colors">Grant Hub</Link>
                            <span className="text-greys-300">/</span>
                            <span className="font-medium text-slate-900 truncate max-w-[300px]">{formData.title || "Unnamed Grant"}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button 
                            onClick={handleSubmit} 
                            disabled={updateMutation.isPending}
                            className="h-8 px-4 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
                        >
                            {updateMutation.isPending && <Loader2 className="h-3 w-3 mr-2 animate-spin" />}
                            Publish Configuration
                        </Button>
                    </div>
                </div>
                <div className="mt-8 max-w-6xl mx-auto flex items-center gap-4">
                     <div className="h-12 w-12 bg-white border border-greys-200 rounded-lg p-1 shadow-sm flex items-center justify-center shrink-0 text-amber-500">
                         <Award className="h-6 w-6" />
                     </div>
                     <div>
                         <h1 className="text-xl font-semibold tracking-tight leading-tight">{formData.title || "New Platform Scholarship"}</h1>
                         <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5 font-medium">
                             <span className="flex items-center gap-1.5"><Globe className="h-3 w-3 text-slate-400"/> {formData.targetLocation || "Global Scope"}</span>
                             <span className="text-greys-300">•</span>
                             <span className="flex items-center gap-1.5"><Banknote className="h-3.5 w-3.5 text-slate-400"/> {formData.amountCurrency} {formData.amountValue?.toLocaleString()}</span>
                             <span className="text-greys-300">•</span>
                             <span className="flex items-center gap-1.5"><Database className="h-3.5 w-3.5 text-slate-400"/> SID: {scholarshipId.slice(0,8)}</span>
                         </div>
                     </div>
                </div>
            </div>

            {/* Layout Grid */}
            <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-10">
                
                {/* Left Sidebar Tabs */}
                <div className="w-52 shrink-0 pr-4">
                    <div className="space-y-1 mb-6">
                        <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Grant Configuration</p>
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
                    {activeTab === "general" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                             <div>
                                <h2 className="text-lg font-semibold text-slate-900">Programmatic Definitions</h2>
                            </div>
                            
                            <div className="bg-white border border-greys-200 shadow-sm rounded-lg overflow-hidden">
                                <div className="p-6 space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-xs font-semibold text-slate-700">Display Title</Label>
                                        <Input id="title" value={formData.title} onChange={handleChange} className="h-9 px-3 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500 bg-white" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="targetLocation" className="text-xs font-semibold text-slate-700">Geographic Scope</Label>
                                            <Input id="targetLocation" value={formData.targetLocation} onChange={handleChange} className="h-9 px-3 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500 bg-white" placeholder="Worldwide, UK, etc." />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="fundingType" className="text-xs font-semibold text-slate-700">Financial Classification</Label>
                                            <select
                                                id="fundingType"
                                                className="w-full h-9 px-3 rounded-md border border-greys-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                value={formData.fundingType}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select type...</option>
                                                <option value="Merit-based">Merit-based Node</option>
                                                <option value="Need-based">Social Responsibility / Need-based</option>
                                                <option value="Government">Legislative / Government</option>
                                                <option value="Private">Corporate / Private</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-xs font-semibold text-slate-700">Abstract Narrative</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="min-h-[160px] p-3 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500 bg-white resize-y"
                                            placeholder="Detailed grant purpose and coverage..."
                                        />
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-4 bg-slate-50 border border-greys-200 rounded-lg">
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-semibold text-slate-900 italic">Sponsored Badge</p>
                                            <p className="text-[11px] text-slate-500">Apply visual highlight in marketplace searches.</p>
                                        </div>
                                        <Button
                                            onClick={() => handleToggle("isSponsored")}
                                            variant="outline"
                                            className={cn(
                                                "h-8 px-4 text-[10px] font-bold uppercase tracking-wider transition-all",
                                                formData.isSponsored ? "bg-amber-500 text-white border-none" : "bg-white text-slate-400"
                                            )}
                                        >
                                            {formData.isSponsored ? "Eminent" : "Neutral"}
                                        </Button>
                                    </div>
                                </div>
                                <div className="px-6 py-4 bg-greys-50 border-t border-greys-200 flex items-center justify-end">
                                    <Button onClick={handleSubmit} disabled={updateMutation.isPending} className="h-8 px-4 text-xs font-medium bg-white border border-greys-200 text-slate-700 hover:bg-greys-100 shadow-sm">
                                        Save narrative updates
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "eligibility" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                             <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-900">Application Parameters</h2>
                            </div>
                            
                            <div className="bg-white border border-greys-200 shadow-sm rounded-lg overflow-hidden">
                                <div className="p-6 space-y-8">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="targetDegreeLevel" className="text-xs font-semibold text-slate-700">Academic Target Node</Label>
                                            <Input id="targetDegreeLevel" value={formData.targetDegreeLevel} onChange={handleChange} className="h-9 px-3 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500 bg-white" placeholder="BDS, MDS, PhD, etc." />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="intakeYear" className="text-xs font-semibold text-slate-700">Intake Cycle</Label>
                                            <Input id="intakeYear" value={formData.intakeYear} onChange={handleChange} className="h-9 px-3 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500 bg-white" placeholder="2025/26" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-greys-100">
                                        <div className="space-y-2">
                                            <Label htmlFor="nationality" className="text-xs font-semibold text-slate-700">Origin Compatibility</Label>
                                            <Input id="nationality" value={formData.nationality} onChange={handleChange} className="h-9 px-3 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500 bg-white" placeholder="Specific countries or 'Any'" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="studyMode" className="text-xs font-semibold text-slate-700">Engagement Mode</Label>
                                            <Input id="studyMode" value={formData.studyMode} onChange={handleChange} className="h-9 px-3 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500 bg-white" placeholder="Full-time / Part-time" />
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-4 border-t border-greys-100">
                                        <Label htmlFor="eligibilityCriteriaJson" className="text-xs font-semibold text-slate-700">Systemic Eligibility Nodes (Raw Intel)</Label>
                                        <Textarea
                                            id="eligibilityCriteriaJson"
                                            value={formData.eligibilityCriteriaJson}
                                            onChange={handleChange}
                                            className="min-h-[120px] p-3 text-xs font-mono focus-visible:ring-1 focus-visible:ring-indigo-500 bg-slate-50 border-greys-200"
                                            placeholder="Detailed qualification markers..."
                                        />
                                    </div>
                                </div>
                                <div className="px-6 py-4 bg-greys-50 border-t border-greys-200 flex items-center justify-end">
                                    <Button onClick={handleSubmit} disabled={updateMutation.isPending} className="h-8 px-4 text-xs font-medium bg-white border border-greys-200 text-slate-700 hover:bg-greys-100 shadow-sm">
                                        Commit eligibility rules
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "financials" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                             <div>
                                <h2 className="text-lg font-semibold text-slate-900">Quantifiable Assets</h2>
                            </div>
                            
                            <div className="bg-white border border-greys-200 shadow-sm rounded-lg overflow-hidden">
                                <div className="p-6 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="amountValue" className="text-xs font-semibold text-slate-700">Grant Quantum</Label>
                                            <Input id="amountValue" type="number" value={formData.amountValue} onChange={handleChange} className="h-9 px-3 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="amountCurrency" className="text-xs font-semibold text-slate-700">Currency Node</Label>
                                            <select
                                                id="amountCurrency"
                                                className="w-full h-9 px-3 rounded-md border border-greys-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                value={formData.amountCurrency}
                                                onChange={handleChange}
                                            >
                                                <option value="GBP">Sterling (£)</option>
                                                <option value="USD">Dollar ($)</option>
                                                <option value="EUR">Euro (€)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="numberOfAwards" className="text-xs font-semibold text-slate-700">Award Multiplicity</Label>
                                            <Input id="numberOfAwards" value={formData.numberOfAwards} onChange={handleChange} className="h-9 px-3 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500" placeholder="e.g. 5 annually" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-greys-100">
                                        <div className="space-y-2">
                                            <Label htmlFor="deadline" className="text-xs font-semibold text-slate-700">Handshake Termination (Deadline)</Label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                <Input id="deadline" type="date" value={formData.deadline?.split('T')[0] || ""} onChange={handleChange} className="h-9 pl-10 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="applicationLink" className="text-xs font-semibold text-slate-700">Primary External Source</Label>
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                    <Input id="applicationLink" value={formData.applicationLink} onChange={handleChange} className="h-9 pl-10 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500" placeholder="https://..." />
                                                </div>
                                                {formData.applicationLink && (
                                                    <Button asChild variant="outline" className="h-9 w-9 p-0 bg-white border-greys-200">
                                                        <a href={formData.applicationLink} target="_blank" rel="noopener noreferrer"><ArrowUpRight className="h-4 w-4" /></a>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4 bg-greys-50 border-t border-greys-200 flex items-center justify-end">
                                    <Button onClick={handleSubmit} disabled={updateMutation.isPending} className="h-8 px-4 text-xs font-medium bg-white border border-greys-200 text-slate-700 hover:bg-greys-100 shadow-sm">
                                        Sync financial node
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === "settings" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                             <div>
                                <h2 className="text-lg font-semibold text-slate-900">Authority Control Hub</h2>
                            </div>
                            
                            <div className="bg-white border text-sm border-greys-200 shadow-sm rounded-lg overflow-hidden p-8 space-y-10">
                                <div className="space-y-2">
                                    <h3 className="text-sm font-semibold text-slate-900 italic">Registry Integrity</h3>
                                    <p className="text-xs text-slate-500 font-medium">Configure ecosystem visibility and lifecycle state.</p>
                                </div>
                                
                                <div className="pt-6 border-t border-error-100">
                                     <p className="text-sm font-semibold text-error-600 mb-2">Registry Decommissioning</p>
                                     <div className="p-5 border border-error-100 rounded-lg bg-error-50/10 flex items-center justify-between">
                                          <div>
                                              <p className="text-xs font-bold text-slate-900">Purge Grant Asset</p>
                                              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Permanently disconnect this scholarship from the resource hub. Irreversible Transition.</p>
                                          </div>
                                          <Button 
                                              variant="outline" 
                                              onClick={() => { if(confirm("Confirm decommissioning of this asset?")) deleteMutation.mutate(); }}
                                              className="h-8 px-4 text-xs font-medium border-error-200 text-error-600 hover:bg-error-50 bg-white transition-all shadow-sm"
                                          >
                                              Purge Node
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
                                 <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                 <span className="text-xs font-bold text-slate-600 tracking-tight">Active Deployment</span>
                             </div>
                             <p className="text-[11px] text-slate-400 leading-tight">Registry verified across global clusters.</p>
                        </div>
                    </div>

                    <div className="pt-4">
                        <h3 className="text-[12px] font-semibold text-slate-900 mb-3 uppercase tracking-wider">Asset Intel</h3>
                        <div className="flex flex-col gap-3">
                             <div className="border border-greys-200 bg-white px-3 py-2.5 rounded-lg text-[11px] shadow-sm">
                                 <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mb-1">Global HID</p>
                                 <p className="font-mono text-slate-700 truncate">{scholarshipId}</p>
                             </div>
                             <div className="border border-greys-200 bg-slate-50 px-3 py-2.5 rounded-lg text-xs shadow-inner">
                                <span className="flex items-center gap-2 font-medium text-slate-700">
                                    <Database className="h-3.5 w-3.5 text-slate-400" /> core/scholarships
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
