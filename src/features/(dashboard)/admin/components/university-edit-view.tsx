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
            <div className="h-32 w-32 rounded-[2.5rem] bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 p-[3px] shadow-2xl shadow-orange-200 group-hover:rotate-3 transition-transform duration-500">
                <div className="h-full w-full rounded-[2.3rem] bg-white flex items-center justify-center overflow-hidden relative p-4">
                    {src ? (
                        <Image src={src} alt={name} fill className="object-contain p-4 transition-transform group-hover:scale-110" />
                    ) : (
                        <div className="text-4xl font-black text-orange-200 uppercase">{name.slice(0, 2)}</div>
                    )}
                </div>
            </div>
            <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-indigo-600 border-4 border-white shadow-lg flex items-center justify-center"
            >
                <Globe className="h-5 w-5 text-white" />
            </motion.div>
        </div>
    );
}

function ImpactMetric({ label, value, color, icon: Icon }: { label: string; value: string | number; color: string; icon: any }) {
    return (
        <div className={cn("px-6 py-4 rounded-3xl border border-white/20 backdrop-blur-md shadow-sm", color)}>
            <div className="flex items-center gap-2 mb-1">
                <Icon className="h-3 w-3 opacity-60" />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</span>
            </div>
            <p className="text-2xl font-black font-sora tracking-tighter">{value}</p>
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
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="h-8 w-8 text-orange-600 animate-spin" />
                <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Authenticating Academic Credentials...</p>
            </div>
        );
    }

    if (error || !university) {
        return (
            <div className="bg-rose-50/50 backdrop-blur-md border border-rose-100 rounded-[3rem] p-16 text-center shadow-2xl shadow-rose-100/20 max-w-2xl mx-auto mt-12">
                <div className="bg-rose-100 h-24 w-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner shadow-rose-200">
                    <Trash2 className="h-12 w-12 text-rose-500" />
                </div>
                <h3 className="text-3xl font-black text-rose-900 mb-4 font-sora tracking-tighter">Institute Registry Lock</h3>
                <p className="text-rose-700/70 mb-10 font-medium leading-relaxed">The academic institution you are attempting to modify is not currently reachable or has been removed from the global registry.</p>
                <Button asChild className="bg-rose-600 hover:bg-rose-700 text-white rounded-2xl h-14 px-10 font-black shadow-xl shadow-rose-900/10 active:scale-95 transition-all">
                    <Link href="/admin/content/universities">Return to Directory</Link>
                </Button>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-24"
        >
            {/* ── High-Fidelity University Header ── */}
            <div className="relative bg-slate-900 rounded-[3.5rem] overflow-hidden shadow-2xl p-10 md:p-16 text-white min-h-[400px] flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-500/10 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
                
                <div className="relative z-10 flex flex-col xl:flex-row gap-16 items-center xl:items-start text-center xl:text-left">
                    <div className="flex flex-col items-center gap-8">
                        <Button asChild variant="ghost" size="icon" className="rounded-2xl h-16 w-16 bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-xl transition-all active:scale-95 mb-4">
                            <Link href="/admin/content/universities">
                                <ArrowLeft className="h-7 w-7" />
                            </Link>
                        </Button>
                        <UniversityLogo src={formData.logoUrl} name={formData.name || "UN"} />
                    </div>

                    <div className="flex-1 space-y-8 min-w-0">
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center justify-center xl:justify-start gap-4">
                                <h1 className="text-5xl md:text-8xl font-black tracking-tighter font-sora leading-tight">{formData.name || "Registering Institution..."}</h1>
                                <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/30 text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full">
                                    Global Registry #882
                                </Badge>
                            </div>
                            <div className="flex flex-wrap items-center justify-center xl:justify-start gap-10 text-white/40 text-sm font-bold uppercase tracking-widest">
                                <span className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-orange-400" />
                                    {formData.location || "Location Pending"}
                                </span>
                                <span className="flex items-center gap-3">
                                    <Globe className="h-5 w-5 text-blue-400" />
                                    {formData.websiteUrl ? "Official.Edu Validated" : "Awaiting Web Linking"}
                                </span>
                                <span className="flex items-center gap-3">
                                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                                    VERIFIED ACADEMIC HUB
                                </span>
                            </div>
                        </div>

                        {/* High-Fidelity Stats Bar */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
                            <ImpactMetric label="Global Rank" value={`#${formData.ranking || "—"}`} color="bg-orange-500/10 text-orange-300" icon={Star} />
                            <ImpactMetric label="Active Programs" value="8" color="bg-indigo-500/10 text-indigo-300" icon={BookOpen} />
                            <ImpactMetric label="Scholarships" value="4" color="bg-emerald-500/10 text-emerald-300" icon={GraduationCap} />
                            <ImpactMetric label="Growth Yield" value="+12%" color="bg-cyan-500/10 text-cyan-300" icon={TrendingUp} />
                        </div>
                    </div>

                    <div className="w-full xl:w-96 space-y-4">
                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl space-y-8">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 text-center">Institutional Authority</h4>
                            <div className="space-y-4">
                                <Button 
                                    onClick={handleSubmit}
                                    disabled={updateMutation.isPending}
                                    className="w-full h-16 rounded-[1.5rem] bg-orange-600 hover:bg-orange-700 text-white font-black text-sm shadow-2xl shadow-orange-900/40 transition-all active:scale-95"
                                >
                                    {updateMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin mr-3" /> : <Save className="h-5 w-5 mr-3" />}
                                    Synchronize Registry
                                </Button>
                                <Button 
                                    onClick={() => {
                                        if (confirm("DANGER: This will remove this institution and all associated program linkage. Proceed?")) deleteMutation.mutate();
                                    }}
                                    className="w-full h-16 rounded-[1.5rem] bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-black text-sm transition-all active:scale-95"
                                >
                                    <Trash2 className="h-5 w-5 mr-3" />
                                    Decommission Institute
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Navigation Hub ── */}
            <div className="flex flex-col xl:flex-row gap-12">
                <div className="flex-1 space-y-10 min-w-0">
                    <div className="flex flex-wrap gap-2 p-2 bg-gray-100 rounded-[2rem] w-fit">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={cn(
                                    "flex items-center gap-3 px-10 py-5 rounded-[1.5rem] text-sm font-black transition-all duration-300 font-sora uppercase tracking-wider",
                                    activeTab === tab.key
                                        ? "bg-white shadow-2xl text-orange-600 ring-1 ring-black/5 scale-105 z-10"
                                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-200/50"
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
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === "identity" && (
                                <Card className="border-none shadow-2xl shadow-gray-200/50 bg-white/80 backdrop-blur-xl rounded-[3rem] p-10 overflow-hidden group">
                                    <div className="h-2 bg-gradient-to-r from-orange-400 via-rose-500 to-indigo-600 absolute top-0 left-0 w-full" />
                                    <CardHeader className="px-0 pb-10">
                                        <CardTitle className="text-2xl font-black text-slate-900 font-sora uppercase tracking-tight flex items-center gap-4">
                                            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl group-hover:rotate-12 transition-transform shadow-inner">
                                                <Building2 className="h-6 w-6" />
                                            </div>
                                            Registry Core Profile
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-0 space-y-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <Label htmlFor="name" className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Formal Institution Name</Label>
                                                <div className="relative">
                                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                                                    <Input id="name" value={formData.name} onChange={handleChange} className="h-16 pl-14 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white transition-all font-bold text-lg" required />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <Label htmlFor="location" className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Geographic Headquarters</Label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                                                    <Input id="location" value={formData.location} onChange={handleChange} className="h-16 pl-14 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white transition-all font-bold text-lg" placeholder="e.g. Oxford, United Kingdom" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="dentalSchoolPathway" className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Core Admission Pathway</Label>
                                            <div className="relative">
                                                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                                                <Input id="dentalSchoolPathway" value={formData.dentalSchoolPathway} onChange={handleChange} className="h-16 pl-14 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white transition-all font-bold" placeholder="e.g. 5-Year Direct Entry BDS" />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="description" className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Institutional Narrative</Label>
                                            <Textarea
                                                id="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                className="min-h-[250px] p-6 rounded-[2.5rem] bg-slate-50/50 border-slate-100 focus:bg-white transition-all font-medium leading-relaxed resize-none"
                                                placeholder="Provide a comprehensive description of the university's clinical focus, research output, and student support infrastructure..."
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {activeTab === "impact" && (
                                <Card className="border-none shadow-2xl shadow-gray-200/50 bg-white rounded-[3rem] p-12">
                                    <div className="space-y-12">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                            <div className="space-y-4">
                                                <h3 className="text-4xl font-black text-slate-900 font-sora tracking-tighter uppercase">Academic Impact Pulse</h3>
                                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Statistical ranking and institutional performance metrics</p>
                                            </div>
                                            <div className="p-6 bg-slate-900 rounded-[2rem] text-white">
                                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Global Ranking</p>
                                                <p className="text-5xl font-black font-sora">#{formData.ranking || "—"}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            {[
                                                { label: "Application Volume", value: "1.2k+", icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
                                                { label: "Success Quotient", value: "88%", icon: Sparkles, color: "text-emerald-600", bg: "bg-emerald-50" },
                                                { label: "Clinical Rating", value: "4.9/5", icon: Star, color: "text-amber-600", bg: "bg-amber-50" }
                                            ].map((stat, i) => (
                                                <div key={i} className={cn("p-10 rounded-[2.5rem] border-2 transition-all hover:scale-105", stat.bg, "border-transparent hover:border-white hover:shadow-xl")}>
                                                    <stat.icon className={cn("h-10 w-10 mb-6", stat.color)} />
                                                    <p className={cn("text-4xl font-black font-sora mb-2", stat.color)}>{stat.value}</p>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="p-12 bg-slate-50 rounded-[3rem] border border-slate-100 relative overflow-hidden">
                                            <div className="relative z-10">
                                                <h4 className="text-lg font-black font-sora uppercase mb-6 flex items-center gap-3">
                                                    <History className="h-5 w-5 text-slate-400" />
                                                    Historical Growth Registry
                                                </h4>
                                                <div className="h-48 w-full bg-slate-200/50 rounded-[2rem] border border-dashed border-slate-300 flex items-center justify-center">
                                                    <p className="text-sm font-bold text-slate-400 flex items-center gap-2">
                                                        <Search className="h-4 w-4" /> Generating Advanced Institutional Analytics Visualization...
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {activeTab === "settings" && (
                                <Card className="border-none shadow-2xl shadow-gray-200/50 bg-white rounded-[3rem] p-12">
                                    <div className="space-y-12">
                                        <div className="space-y-4">
                                            <h3 className="text-2xl font-black text-slate-900 font-sora uppercase tracking-tight">Technical Linkage & Assets</h3>
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Infrastructure configuration and digital identity management</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-6">
                                                <div className="space-y-3">
                                                    <Label htmlFor="websiteUrl" className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Global Website Terminal</Label>
                                                    <div className="relative">
                                                        <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />
                                                        <Input id="websiteUrl" value={formData.websiteUrl} onChange={handleChange} className="h-16 pl-16 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white font-bold" placeholder="https://university.edu" />
                                                        {formData.websiteUrl && (
                                                            <a href={formData.websiteUrl} target="_blank" rel="noopener noreferrer" className="absolute right-5 top-1/2 -translate-y-1/2 p-2 bg-white rounded-xl shadow-sm text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                                                                <ExternalLink className="h-4 w-4" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <Label htmlFor="logoUrl" className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Asset Asset URL (High Resolution)</Label>
                                                    <div className="relative">
                                                        <Globe className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-400" />
                                                        <Input id="logoUrl" value={formData.logoUrl} onChange={handleChange} className="h-16 pl-16 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white font-bold" placeholder="https://cdn.assets.com/logo.png" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-10 bg-slate-900 rounded-[3rem] text-white space-y-8 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/20 rounded-full blur-3xl" />
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 tracking-tight">Identity Preview</h4>
                                                <div className="flex flex-col items-center gap-6">
                                                    <UniversityLogo src={formData.logoUrl} name={formData.name || "UN"} />
                                                    <div className="text-center">
                                                        <p className="text-2xl font-black font-sora">{formData.name || "UNSET"}</p>
                                                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest mt-2">{formData.location || "Undefined Location"}</p>
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

                {/* ── Linked Entities Sidebar ── */}
                <div className="w-full xl:w-[450px] space-y-12">
                    {/* Program Dossier */}
                    <Card className="border-none shadow-2xl shadow-indigo-900/10 bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-indigo-600/20 transition-colors" />
                        <CardHeader className="p-0 pb-10 flex flex-row items-center justify-between">
                            <div className="space-y-1 border-l-4 border-indigo-500 pl-6">
                                <CardTitle className="text-2xl font-black font-sora uppercase tracking-tighter">Academic programs</CardTitle>
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Active Enrollment Tracks</p>
                            </div>
                            <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-indigo-400">8</div>
                        </CardHeader>
                        <CardContent className="p-0 space-y-8">
                            <div className="space-y-4">
                                {[
                                    { name: "Global Dentistry BDS", badge: "Direct Entry", slots: "42 Available" },
                                    { name: "Clinical Orthodontics", badge: "Postgraduate", slots: "12 Available" },
                                    { name: "Oral Surgery Pathway", badge: "Specialist", slots: "5 Available" }
                                ].map((prog, i) => (
                                    <div key={i} className="flex items-center gap-5 p-6 bg-white/5 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-all cursor-pointer group/item hover:border-indigo-500/30">
                                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center font-black text-xs shadow-lg group-hover/item:rotate-6 transition-transform">
                                            {prog.name.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black text-sm truncate uppercase tracking-tight mb-1">{prog.name}</p>
                                            <div className="flex items-center gap-3">
                                                <Badge className="bg-indigo-600/20 text-indigo-400 border-none text-[8px] font-black px-2 py-0.5 rounded-full">{prog.badge}</Badge>
                                                <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{prog.slots}</span>
                                            </div>
                                        </div>
                                        <ArrowUpRight className="h-5 w-5 text-white/10 group-hover/item:text-indigo-400 transition-all" />
                                    </div>
                                ))}
                            </div>
                            <Button asChild className="w-full h-16 bg-white text-slate-900 hover:bg-indigo-50 rounded-[1.5rem] font-black text-sm shadow-2xl shadow-indigo-900/40 transition-all active:scale-95">
                                <Link href="/admin/content/courses">View Full Program Dossier</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Affiliated Mentors */}
                    <Card className="border-none shadow-2xl shadow-gray-200/50 bg-white/80 backdrop-blur-xl rounded-[3.5rem] p-12 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-100 transition-colors" />
                        <CardHeader className="p-0 pb-10 flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl font-black font-sora uppercase tracking-tighter flex items-center gap-3">
                                    <Users className="h-6 w-6 text-emerald-600" />
                                    Top Clinical Mentors
                                </CardTitle>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-9">Institutional Affiliates</p>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 space-y-10">
                            <div className="space-y-6">
                                {[
                                    { name: "Dr. Elena Vance", focus: "Maxillofacial Specialist", rating: "4.9" },
                                    { name: "Prof. Arthur Dent", focus: "Pathology Lead", rating: "5.0" }
                                ].map((mentor, i) => (
                                    <div key={i} className="flex items-center gap-5 group/mentor">
                                        <div className="h-16 w-16 rounded-[1.5rem] bg-slate-100 border-2 border-white shadow-md flex items-center justify-center font-black text-slate-400 text-lg group-hover/mentor:scale-110 group-hover/mentor:rotate-3 transition-all">
                                            {mentor.name.slice(0, 1)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black text-slate-900 uppercase tracking-tight">{mentor.name}</p>
                                            <p className="text-xs font-bold text-slate-400 mt-0.5">{mentor.focus}</p>
                                            <div className="flex items-center gap-1 mt-2 text-amber-500">
                                                <Star className="h-3 w-3 fill-current" />
                                                <span className="text-[10px] font-black">{mentor.rating} Specialist Rating</span>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                                            <ArrowUpRight className="h-5 w-5" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="pt-6 border-t border-slate-100">
                                <Button asChild variant="outline" className="w-full h-16 rounded-[1.5rem] font-black text-sm border-2 border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95">
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
