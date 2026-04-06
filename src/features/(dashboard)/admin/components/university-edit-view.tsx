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
    Trash2,
    Building2,
    Users,
    GraduationCap,
    TrendingUp,
    ShieldCheck,
    Settings,
    ArrowUpRight,
    ExternalLink,
    Search,
    Sparkles,
    History
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";

interface UniversityEditViewProps {
    universityId: string;
}

type TabKey = "identity" | "impact" | "settings";

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "identity", label: "Core Identity", icon: <Building2 className="h-4 w-4" /> },
    { key: "impact", label: "Academic Impact", icon: <Sparkles className="h-4 w-4" /> },
    { key: "settings", label: "Registry Control", icon: <Settings className="h-4 w-4" /> },
];

function UniversityLogo({ src, name }: { src?: string; name: string }) {
    return (
        <div className="relative group">
            <div className="h-32 w-32 rounded-[2.5rem] bg-white p-1 border border-greys-300 shadow-sm group-hover:rotate-2 transition-transform duration-500">
                <div className="h-full w-full rounded-[2.3rem] bg-white flex items-center justify-center overflow-hidden relative p-4">
                    {src ? (
                        <Image src={src} alt={name} fill className="object-contain p-4 transition-transform group-hover:scale-110" />
                    ) : (
                        <div className="text-4xl font-black text-primary-200 uppercase font-jakarta">{name.slice(0, 2)}</div>
                    )}
                </div>
            </div>
            <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-primary-600 border-4 border-white shadow-lg flex items-center justify-center"
            >
                <ShieldCheck className="h-5 w-5 text-white" />
            </motion.div>
        </div>
    );
}

function ImpactMetric({ label, value, color, icon: Icon }: { label: string; value: string | number; color: string; icon: any }) {
    return (
        <div className={cn("px-6 py-4 rounded-3xl border border-greys-200 bg-white shadow-xs transition-all hover:shadow-md", color)}>
            <div className="flex items-center gap-2 mb-1">
                <Icon className="h-3 w-3 opacity-60" />
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 font-jakarta">{label}</span>
            </div>
            <p className="text-2xl font-bold font-jakarta tracking-tight">{value}</p>
        </div>
    );
}

export function UniversityEditView({ universityId }: UniversityEditViewProps) {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabKey>("identity");
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
            toast.success("Institutional registry updated successfully");
        },
        onError: () => {
            toast.error("Failed to update university registry");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: () => adminService.deleteUniversity(universityId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-universities"] });
            toast.success("Institute removed from registry");
            router.push("/admin/content/universities");
        },
        onError: () => {
            toast.error("Critical failure during registry deletion");
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
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 font-jakarta">
                <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
                <p className="text-greys-500 font-bold uppercase tracking-widest text-xs">Authenticating Academic Credentials...</p>
            </div>
        );
    }

    if (error || !university) {
        return (
            <div className="bg-error-50/50 backdrop-blur-md border border-error-100 rounded-[3rem] p-16 text-center shadow-2xl shadow-error-100/20 max-w-2xl mx-auto mt-12 font-jakarta">
                <div className="bg-error-100 h-24 w-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner shadow-error-200">
                    <Trash2 className="h-12 w-12 text-error-500" />
                </div>
                <h3 className="text-3xl font-bold text-error-900 mb-4 tracking-tight">Institute Registry Lock</h3>
                <p className="text-error-700/70 mb-10 font-medium leading-relaxed">The academic institution you are attempting to modify is not currently reachable or has been removed from the global registry.</p>
                <Button asChild className="bg-error-600 hover:bg-error-700 text-white rounded-2xl h-14 px-10 font-bold shadow-xl shadow-error-900/10 active:scale-95 transition-all">
                    <Link href="/admin/content/universities">Return to Directory</Link>
                </Button>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-24 font-jakarta"
        >
            {/* ── High-Fidelity University Header (Light Theme) ── */}
            <div className="relative bg-white rounded-[2.5rem] border border-greys-300 overflow-hidden shadow-sm p-8 md:p-14 text-text-heading min-h-[400px] flex flex-col justify-center">
                <div className="absolute top-0 right-0 h-64 w-64 bg-primary-50 rounded-bl-full opacity-40 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col xl:flex-row gap-12 items-center xl:items-start text-center xl:text-left">
                    <div className="flex flex-col items-center gap-8">
                        <Button asChild variant="ghost" size="icon" className="rounded-2xl h-14 w-14 bg-greys-100 hover:bg-white text-greys-500 border border-transparent hover:border-greys-300 transition-all active:scale-95 mb-2 shadow-none hover:shadow-xs">
                            <Link href="/admin/content/universities">
                                <ArrowLeft className="h-6 w-6" />
                            </Link>
                        </Button>
                        <UniversityLogo src={formData.logoUrl} name={formData.name || "UN"} />
                    </div>

                    <div className="flex-1 space-y-8 min-w-0">
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center justify-center xl:justify-start gap-4">
                                <Badge variant="outline" className="bg-primary-50 text-primary-600 border-primary-200 px-4 py-1.5 font-bold text-[10px] tracking-[0.25em] rounded-full uppercase leading-none inline-flex">
                                    Official Institution
                                </Badge>
                                <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight w-full">{formData.name || "Registering Institution..."}</h1>
                            </div>
                            <div className="flex flex-wrap items-center justify-center xl:justify-start gap-8 text-greys-400 text-xs font-bold uppercase tracking-widest">
                                <span className="flex items-center gap-2.5">
                                    <MapPin className="h-4.5 w-4.5 text-error-500/60" />
                                    {formData.location || "Location Pending"}
                                </span>
                                <span className="flex items-center gap-2.5">
                                    <Globe className="h-4.5 w-4.5 text-primary-500/60" />
                                    {formData.websiteUrl ? "Official Registry Validated" : "Awaiting Web Linkage"}
                                </span>
                                <span className="flex items-center gap-2.5">
                                    <ShieldCheck className="h-4.5 w-4.5 text-success-500/60" />
                                    VERIFIED ACADEMIC HUB
                                </span>
                            </div>
                        </div>

                        {/* High-Fidelity Stats Bar */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
                            <ImpactMetric label="Global Rank" value={`#${formData.ranking || "—"}`} color="text-warning-600" icon={Star} />
                            <ImpactMetric label="Active Tracks" value="8" color="text-indigo-600" icon={BookOpen} />
                            <ImpactMetric label="Scholarships" value="4" color="text-success-600" icon={GraduationCap} />
                            <ImpactMetric label="Growth Rate" value="+12%" color="text-primary-600" icon={TrendingUp} />
                        </div>
                    </div>

                    <div className="w-full xl:w-96 space-y-4">
                        <div className="bg-greys-100 border border-greys-300 rounded-[2rem] p-8 space-y-6">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-greys-400 text-center">Institutional Authority</h4>
                            <div className="space-y-3">
                                <Button 
                                    onClick={handleSubmit}
                                    disabled={updateMutation.isPending}
                                    className="w-full h-14 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary-100 transition-all active:scale-95 leading-none"
                                >
                                    {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2.5" /> : <Save className="h-4 w-4 mr-2.5" />}
                                    Synchronize Registry
                                </Button>
                                <Button 
                                    onClick={() => {
                                        if (confirm("DANGER: This will remove this institution and all associated program linkage. Proceed?")) deleteMutation.mutate();
                                    }}
                                    className="w-full h-14 rounded-xl bg-white hover:bg-error-50 text-error-600 border border-greys-300 hover:border-error-200 font-bold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-none"
                                >
                                    <Trash2 className="h-4 w-4 mr-2.5" />
                                    Purge Registry
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Navigation Hub ── */}
            <div className="flex flex-col xl:flex-row gap-12">
                <div className="flex-1 space-y-10 min-w-0">
                    <div className="flex flex-wrap gap-2 p-1.5 bg-greys-100 rounded-2xl w-fit border border-greys-300">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={cn(
                                    "flex items-center gap-3 px-8 py-3.5 rounded-xl text-[11px] font-bold transition-all duration-300 uppercase tracking-widest",
                                    activeTab === tab.key
                                        ? "bg-white shadow-md text-primary-600 ring-1 ring-black/5"
                                        : "text-greys-400 hover:text-text-heading hover:bg-greys-200"
                                )}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === "identity" && (
                                <Card className="border border-greys-300 shadow-xs bg-white rounded-[2rem] p-8 md:p-10 relative overflow-hidden group">
                                    <div className="h-1.5 bg-primary-600 absolute top-0 left-0 w-full opacity-10" />
                                    <CardHeader className="px-0 pb-10">
                                        <CardTitle className="text-xl font-bold text-text-heading uppercase tracking-widest flex items-center gap-4">
                                            <div className="p-3 bg-primary-50 text-primary-600 rounded-xl group-hover:rotate-6 transition-transform shadow-xs">
                                                <Building2 className="h-6 w-6" />
                                            </div>
                                            Registry Hub Profile
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-0 space-y-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <Label htmlFor="name" className="text-[10px] font-bold uppercase text-greys-400 tracking-[0.2em] ml-1">Formal Institution Name</Label>
                                                <div className="relative">
                                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-greys-300" />
                                                    <Input id="name" value={formData.name} onChange={handleChange} className="h-14 pl-14 rounded-xl bg-greys-50 border-greys-300 focus:bg-white transition-all font-semibold text-base" required />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <Label htmlFor="location" className="text-[10px] font-bold uppercase text-greys-400 tracking-[0.2em] ml-1">Geographic Headquarters</Label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-greys-300" />
                                                    <Input id="location" value={formData.location} onChange={handleChange} className="h-14 pl-14 rounded-xl bg-greys-50 border-greys-300 focus:bg-white transition-all font-semibold text-base" placeholder="e.g. Oxford, United Kingdom" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="dentalSchoolPathway" className="text-[10px] font-bold uppercase text-greys-400 tracking-[0.2em] ml-1">Core Admission Pathway</Label>
                                            <div className="relative">
                                                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-greys-300" />
                                                <Input id="dentalSchoolPathway" value={formData.dentalSchoolPathway} onChange={handleChange} className="h-14 pl-14 rounded-xl bg-greys-50 border-greys-300 focus:bg-white transition-all font-semibold" placeholder="e.g. 5-Year Direct Entry BDS" />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="description" className="text-[10px] font-bold uppercase text-greys-400 tracking-[0.2em] ml-1">Institutional Blueprint Narrative</Label>
                                            <Textarea
                                                id="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                className="min-h-[250px] p-6 rounded-2xl bg-greys-50 border-greys-300 focus:bg-white transition-all font-medium leading-relaxed resize-none shadow-none text-sm"
                                                placeholder="Provide a comprehensive description of the university's clinical focus, research output, and student support infrastructure..."
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {activeTab === "impact" && (
                                <Card className="border border-greys-300 shadow-xs bg-white rounded-[2rem] p-10">
                                    <div className="space-y-12">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                            <div className="space-y-3">
                                                <h3 className="text-2xl font-bold text-text-heading tracking-tight uppercase">Academic Impact Pulse</h3>
                                                <p className="text-greys-400 font-bold uppercase tracking-widest text-[10px]">Statistical ranking and institutional performance metrics</p>
                                            </div>
                                            <div className="p-6 bg-primary-600 rounded-2xl text-white shadow-lg shadow-primary-100">
                                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-2 leading-none">Global Ranking</p>
                                                <p className="text-4xl font-bold tracking-tight">#{formData.ranking || "—"}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {[
                                                { label: "Application Velocity", value: "1.2k+", icon: TrendingUp, color: "text-primary-600", bg: "bg-primary-50/50" },
                                                { label: "Success Yield", value: "88%", icon: Sparkles, color: "text-success-600", bg: "bg-success-50/50" },
                                                { label: "Clinical Excellence", value: "4.9/5", icon: Star, color: "text-warning-600", bg: "bg-warning-50/50" }
                                            ].map((stat, i) => (
                                                <div key={i} className={cn("p-8 rounded-3xl border border-greys-200 transition-all hover:bg-white hover:shadow-md", stat.bg)}>
                                                    <stat.icon className={cn("h-8 w-8 mb-6", stat.color)} />
                                                    <p className={cn("text-3xl font-bold tracking-tight mb-2", stat.color)}>{stat.value}</p>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-greys-400">{stat.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="p-10 bg-greys-50 rounded-3xl border border-greys-200 relative overflow-hidden">
                                            <div className="relative z-10">
                                                <h4 className="text-base font-bold uppercase mb-6 flex items-center gap-3 text-text-heading">
                                                    <History className="h-5 w-5 text-greys-400" />
                                                    Registry Growth Timeline
                                                </h4>
                                                <div className="h-40 w-full bg-white rounded-2xl border border-dashed border-greys-300 flex items-center justify-center">
                                                    <p className="text-[11px] font-bold text-greys-400 flex items-center gap-2 uppercase tracking-widest">
                                                        <Search className="h-4 w-4" /> Visual Pulse Analytics Loading...
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {activeTab === "settings" && (
                                <Card className="border border-greys-300 shadow-xs bg-white rounded-[2rem] p-10">
                                    <div className="space-y-12">
                                        <div className="space-y-3">
                                            <h3 className="text-2xl font-bold text-text-heading tracking-tight uppercase">Registry Assets & Linkage</h3>
                                            <p className="text-greys-400 font-bold uppercase tracking-widest text-[10px]">Infrastructure configuration and digital identity management</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-8">
                                                <div className="space-y-4">
                                                    <Label htmlFor="websiteUrl" className="text-[10px] font-bold uppercase text-greys-400 tracking-[0.2em] ml-1">Digital Domain Terminal</Label>
                                                    <div className="relative">
                                                        <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-400" />
                                                        <Input id="websiteUrl" value={formData.websiteUrl} onChange={handleChange} className="h-14 pl-16 rounded-xl bg-greys-50 border-greys-300 focus:bg-white font-semibold" placeholder="https://university.edu" />
                                                        {formData.websiteUrl && (
                                                            <a href={formData.websiteUrl} target="_blank" rel="noopener noreferrer" className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 bg-white rounded-lg shadow-xs text-primary-600 hover:bg-primary-600 hover:text-white flex items-center justify-center transition-all">
                                                                <ExternalLink className="h-4 w-4" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <Label htmlFor="logoUrl" className="text-[10px] font-bold uppercase text-greys-400 tracking-[0.2em] ml-1">Archive Asset URL (Hi-Res)</Label>
                                                    <div className="relative">
                                                        <Globe className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-success-400" />
                                                        <Input id="logoUrl" value={formData.logoUrl} onChange={handleChange} className="h-14 pl-16 rounded-xl bg-greys-50 border-greys-300 focus:bg-white font-semibold" placeholder="https://cdn.assets.com/logo.png" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-10 bg-greys-100 border border-greys-200 rounded-[2rem] text-text-heading space-y-8 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 opacity-20 rounded-full blur-3xl pointer-events-none" />
                                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-greys-400 tracking-tight text-center">Snapshot Preview</h4>
                                                <div className="flex flex-col items-center gap-6">
                                                    <div className="h-24 w-24 rounded-2xl bg-white border border-greys-300 shadow-xs flex items-center justify-center p-3">
                                                        {formData.logoUrl ? (
                                                            <img src={formData.logoUrl} alt="Logo" className="h-full w-full object-contain" />
                                                        ) : (
                                                            <Globe className="h-8 w-8 text-greys-200" />
                                                        )}
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-lg font-bold text-text-heading">{formData.name || "UNSET"}</p>
                                                        <p className="text-[10px] font-bold text-greys-400 uppercase tracking-widest mt-2">{formData.location || "Undefined Location"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* ── Linked Registry Sidebar (Light Theme) ── */}
                <div className="w-full xl:w-[450px] space-y-10">
                    {/* Program Dossier */}
                    <Card className="border border-primary-100 shadow-sm bg-white rounded-[2.5rem] p-8 md:p-10 text-text-heading relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-50 rounded-full blur-[80px] pointer-events-none opacity-40" />
                        <CardHeader className="p-0 pb-10 flex flex-row items-center justify-between">
                            <div className="space-y-1.5 border-l-4 border-primary-500 pl-6">
                                <CardTitle className="text-xl font-bold uppercase tracking-tight">Active programs</CardTitle>
                                <p className="text-[10px] font-bold text-primary-600/60 uppercase tracking-widest">Enrollment Tracks</p>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-primary-100/50 border border-primary-100 flex items-center justify-center font-bold text-primary-600 text-sm shadow-xs">8</div>
                        </CardHeader>
                        <CardContent className="p-0 space-y-8">
                            <div className="space-y-3.5">
                                {[
                                    { name: "Clinical Dentistry BDS", badge: "Direct Entry", slots: "42 Available" },
                                    { name: "Maxillofacial Specialist", badge: "Postgraduate", slots: "12 Available" },
                                    { name: "Oral Research Pathway", badge: "Doctoral", slots: "5 Available" }
                                ].map((prog, i) => (
                                    <div key={i} className="flex items-center gap-5 p-5 bg-greys-50 rounded-2xl border border-greys-200 hover:bg-white hover:border-primary-300 transition-all cursor-pointer group/item hover:shadow-md">
                                        <div className="h-12 w-12 rounded-xl bg-white border border-greys-200 flex items-center justify-center font-bold text-xs shadow-xs group-hover/item:rotate-3 transition-transform text-primary-600">
                                            {prog.name.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-xs truncate uppercase tracking-tight mb-1 text-text-heading">{prog.name}</p>
                                            <div className="flex items-center gap-3">
                                                <Badge className="bg-primary-600/10 text-primary-700 border-none text-[8px] font-bold px-2 py-0.5 rounded-full uppercase leading-none">{prog.badge}</Badge>
                                                <span className="text-[9px] font-bold text-greys-400 uppercase tracking-widest leading-none">{prog.slots}</span>
                                            </div>
                                        </div>
                                        <ArrowUpRight className="h-5 w-5 text-greys-300 group-hover/item:text-primary-600 transition-all" />
                                    </div>
                                ))}
                            </div>
                            <Button asChild className="w-full h-14 bg-greys-900 text-white hover:bg-black-800 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-black-100 transition-all active:scale-95 leading-none">
                                <Link href="/admin/content/courses">View Full Dossier</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Affiliated Mentors */}
                    <Card className="border border-greys-300 shadow-xs bg-white rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-success-50/50 rounded-full blur-3xl pointer-events-none group-hover:bg-success-100 transition-colors" />
                        <CardHeader className="p-0 pb-10 flex flex-row items-center justify-between">
                            <div className="space-y-1.5 border-l-4 border-success-500 pl-6">
                                <CardTitle className="text-xl font-bold uppercase tracking-tight">Clinical Mentors</CardTitle>
                                <p className="text-[10px] font-bold text-greys-400 uppercase tracking-widest">Faculty Affiliates</p>
                            </div>
                            <Users className="h-6 w-6 text-success-600 opacity-60" />
                        </CardHeader>
                        <CardContent className="p-0 space-y-10">
                            <div className="space-y-6">
                                {[
                                    { name: "Dr. Elena Vance", focus: "Clinical Specialist", rating: "4.9" },
                                    { name: "Prof. Arthur Dent", focus: "Orthodontic Lead", rating: "5.0" }
                                ].map((mentor, i) => (
                                    <div key={i} className="flex items-center gap-5 group/mentor">
                                        <div className="h-14 w-14 rounded-xl bg-greys-50 border border-greys-200 shadow-xs flex items-center justify-center font-bold text-greys-600 text-base group-hover/mentor:scale-110 group-hover/mentor:rotate-2 transition-all">
                                            {mentor.name.slice(0, 1)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-text-heading uppercase tracking-tight text-xs">{mentor.name}</p>
                                            <p className="text-[10px] font-bold text-greys-400 mt-0.5 leading-none">{mentor.focus}</p>
                                            <div className="flex items-center gap-1.5 mt-2.5 text-warning-500">
                                                <Star className="h-3 w-3 fill-current" />
                                                <span className="text-[9px] font-bold uppercase tracking-widest">{mentor.rating} Rating</span>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg bg-greys-50 hover:bg-white hover:text-primary-600 border border-transparent hover:border-greys-300 transition-all shadow-none">
                                            <ArrowUpRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="pt-8 border-t border-greys-200">
                                <Button asChild variant="outline" className="w-full h-14 rounded-xl font-bold text-xs uppercase tracking-widest border border-greys-300 hover:bg-greys-50 hover:border-greys-400 transition-all active:scale-95 text-text-color leading-none shadow-none">
                                    <Link href="/admin/mentors">Audit Academic Faculty</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}
