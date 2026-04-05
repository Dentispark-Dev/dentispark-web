import { useState } from "react";
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
    Clock3,
    History,
    Sparkles,
    Link as LinkIcon,
    ArrowUpRight,
    Search,
    ShieldCheck,
    Settings,
    TrendingUp,
    Zap,
    Target,
    Users,
    GraduationCap,
    MapPin,
    ArrowRight
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MentorRadarChart } from "@/src/features/(dashboard)/profile/components/mentor-radar-chart";
import { MentorBadgeList } from "@/src/features/(dashboard)/profile/components/mentor-badge-list";
import { cn } from "@/src/lib/utils";

type TabKey = "profile" | "performance" | "management";

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "profile", label: "Dossier", icon: <User className="h-4 w-4" /> },
    { key: "performance", label: "Impact Pulse", icon: <Sparkles className="h-4 w-4" /> },
    { key: "management", label: "Governance", icon: <ShieldCheck className="h-4 w-4" /> },
];

function AvatarRing({ name, initials }: { name: string; initials?: string }) {
    const displayInitials = initials || name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    return (
        <div className="relative group">
            <div className="h-28 w-28 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-[3px] shadow-2xl shadow-indigo-200 group-hover:rotate-3 transition-transform duration-500">
                <div className="h-full w-full rounded-[2.3rem] bg-white flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent" />
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600 font-sora relative z-10">
                        {displayInitials}
                    </span>
                </div>
            </div>
            <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-2xl bg-emerald-500 border-4 border-white shadow-lg flex items-center justify-center"
            >
                <CheckCircle className="h-4 w-4 text-white" />
            </motion.div>
        </div>
    );
}

function StatPill({ label, value, color, icon: Icon }: { label: string; value: string | number | undefined; color: string; icon?: any }) {
    return (
        <div className={cn("flex flex-col px-6 py-4 rounded-[1.5rem] border border-white/20 backdrop-blur-md shadow-sm", color)}>
            <div className="flex items-center gap-2 mb-1">
                {Icon && <Icon className="h-3 w-3 opacity-60" />}
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</span>
            </div>
            <span className="text-2xl font-black font-sora tracking-tighter">{value ?? "—"}</span>
        </div>
    );
}

interface MentorProfileViewProps {
    mentorId: string;
}

export function MentorProfileView({ mentorId }: MentorProfileViewProps) {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<TabKey>("profile");

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
                <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Decrypting Mentor Dossier...</p>
            </div>
        );
    }

    if (error || !mentor) {
        return (
            <div className="bg-rose-50/50 backdrop-blur-md border border-rose-100 rounded-[3rem] p-16 text-center shadow-2xl shadow-rose-100/20 max-w-2xl mx-auto">
                <div className="bg-rose-100 h-24 w-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner shadow-rose-200">
                    <AlertCircle className="h-12 w-12 text-rose-500" />
                </div>
                <h3 className="text-3xl font-black text-rose-900 mb-4 font-sora tracking-tighter">Dossier Unavailable</h3>
                <p className="text-rose-700/70 mb-10 font-medium leading-relaxed">The mentor profile you are looking for is currently restricted or does not exist in our central registry.</p>
                <Button asChild className="bg-rose-600 hover:bg-rose-700 text-white rounded-2xl h-14 px-10 font-black shadow-xl shadow-rose-900/10 active:scale-95 transition-all">
                    <Link href="/admin/mentors">Return to Directory</Link>
                </Button>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case "ACTIVE": return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "INACTIVE": return "bg-slate-100 text-slate-600 border-slate-200";
            case "SUSPENDED": return "bg-rose-50 text-rose-700 border-rose-100";
            default: return "bg-indigo-50 text-indigo-700 border-indigo-100";
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pb-24"
        >
            {/* ── High-Fidelity Profile Header ── */}
            <div className="relative bg-slate-900 rounded-[3.5rem] overflow-hidden shadow-2xl p-10 md:p-14 text-white">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-600/10 to-transparent pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="relative z-10 flex flex-col xl:flex-row gap-12 items-start">
                    <div className="flex flex-col md:flex-row gap-10 items-center md:items-start flex-1 min-w-0 w-full">
                        <div className="flex flex-col items-center gap-8">
                            <Button asChild variant="ghost" size="icon" className="rounded-2xl h-14 w-14 bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-xl transition-all active:scale-95">
                                <Link href="/admin/mentors">
                                    <ArrowLeft className="h-6 w-6" />
                                </Link>
                            </Button>
                            <AvatarRing name={`${mentor.firstName} ${mentor.lastName}`} />
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-6 min-w-0">
                            <div className="space-y-3">
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter font-sora">{mentor.firstName} {mentor.lastName}</h1>
                                    <Badge className={cn("text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full border shadow-sm", getStatusColor(mentor.activationStatus))}>
                                        {mentor.activationStatus}
                                    </Badge>
                                    {mentor.verified && (
                                        <Badge className="bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-full border-none shadow-lg shadow-indigo-900/20">
                                            Verified Specialist
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 text-white/40 text-sm font-bold uppercase tracking-widest">
                                    <span className="flex items-center gap-2 group cursor-help transition-colors hover:text-white/60">
                                        <User className="h-4 w-4 text-indigo-400" />
                                        <span className="font-mono">{mentor.hid}</span>
                                    </span>
                                    <span className="flex items-center gap-2 group cursor-pointer hover:text-white/60">
                                        <Mail className="h-4 w-4 text-pink-400" />
                                        {mentor.emailAddress}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-emerald-400" />
                                        MEMBER SINCE {new Date(mentor.dateStamped).getFullYear()}
                                    </span>
                                </div>
                            </div>

                            <MentorBadgeList badges={["GDC_REGISTERED", "OXFORD_GRAD", "TOP_MENTOR"]} />

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
                                <StatPill label="Avg Rating" value={mentor.averageRating?.toFixed(1) || "5.0"} color="bg-amber-500/10 text-amber-300" icon={Star} />
                                <StatPill label="Impact" value={`${mentor.totalReviews || 0}+`} color="bg-emerald-500/10 text-emerald-300" icon={Users} />
                                <StatPill label="Experience" value={`${mentor.yearsInDentistry || 0}Y`} color="bg-indigo-500/10 text-indigo-300" icon={Briefcase} />
                                <StatPill label="Focus" value={mentor.areaOfSpecialization?.split(" ")[0] || "General"} color="bg-pink-500/10 text-pink-300" icon={Stethoscope} />
                            </div>
                        </div>
                    </div>

                    <div className="w-full xl:w-80 space-y-4">
                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-center">System Authority</h4>
                            <div className="space-y-4">
                                <Button 
                                    onClick={() => verifyMutation.mutate(!mentor.verified)}
                                    disabled={verifyMutation.isPending}
                                    className={cn(
                                        "w-full h-16 rounded-[1.5rem] font-black text-sm transition-all active:scale-95 shadow-2xl",
                                        mentor.verified 
                                            ? "bg-slate-700 hover:bg-slate-800 text-white border border-white/10" 
                                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-900/40"
                                    )}
                                >
                                    {mentor.verified ? <><ShieldCheck className="h-5 w-5 mr-3" /> Revoke specialist status</> : <><Award className="h-5 w-5 mr-3" /> Grant specialist status</>}
                                </Button>
                                <Button 
                                    onClick={() => updateStatusMutation.mutate(mentor.activationStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                                    disabled={updateStatusMutation.isPending}
                                    className={cn(
                                        "w-full h-16 rounded-[1.5rem] font-black text-sm transition-all active:scale-95 shadow-lg",
                                        mentor.activationStatus === "ACTIVE" 
                                            ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30" 
                                            : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    )}
                                >
                                    {mentor.activationStatus === "ACTIVE" ? <><XCircle className="h-5 w-5 mr-3" /> Suspend Access</> : <><CheckCircle className="h-5 w-5 mr-3" /> Restore Access</>}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Tabs & Content ── */}
            <div className="flex flex-col lg:flex-row gap-12">
                <div className="flex-1 space-y-10 min-w-0">
                    {/* Navigation */}
                    <div className="flex flex-wrap gap-2 p-2 bg-gray-100 rounded-[2rem] w-fit">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={cn(
                                    "flex items-center gap-3 px-8 py-4 rounded-[1.5rem] text-sm font-black transition-all duration-300 font-sora uppercase tracking-wider",
                                    activeTab === tab.key
                                        ? "bg-white shadow-2xl text-indigo-600 ring-1 ring-black/5 scale-105 z-10"
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
                            {activeTab === "profile" && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <Card className="border-none shadow-2xl shadow-gray-200/50 bg-white/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden group">
                                            <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                                            <CardHeader className="pb-4 p-8">
                                                <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3 font-sora uppercase tracking-tight">
                                                    <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 shadow-inner group-hover:rotate-12 transition-transform">
                                                        <Briefcase className="h-6 w-6" />
                                                    </div>
                                                    Professional Path
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-8 pt-0 space-y-8">
                                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100/50">
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                                                        <GraduationCap className="h-3 w-3" /> Clinical Specialization
                                                    </h4>
                                                    <p className="text-lg font-bold text-slate-800 leading-relaxed font-sora">
                                                        {mentor.areaOfSpecialization || mentor.dentalSchoolGateway || "General Dentistry Excellence"}
                                                    </p>
                                                </div>

                                                <div className="space-y-6">
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                                        <FileText className="h-3 w-3" /> Career Narrative
                                                    </h4>
                                                    <p className="text-slate-600 leading-relaxed font-medium">
                                                        {mentor.dentalSchoolExperience || "No professional narrative provided yet. This mentor specializes in guiding students through the complex transitions of dental school admissions and clinical rotations."}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-none shadow-2xl shadow-gray-200/50 bg-white/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden group">
                                            <div className="h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />
                                            <CardHeader className="pb-4 p-8">
                                                <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3 font-sora uppercase tracking-tight">
                                                    <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 shadow-inner group-hover:rotate-12 transition-transform">
                                                        <Star className="h-6 w-6" />
                                                    </div>
                                                    Mentorship Ethos
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-8 pt-0 space-y-8">
                                                <div className="p-8 bg-emerald-50/50 rounded-[2.5rem] border border-emerald-100/50 relative overflow-hidden">
                                                    <Sparkles className="absolute -right-4 -bottom-4 h-24 w-24 text-emerald-200 opacity-20 rotate-12" />
                                                    <blockquote className="text-emerald-900/80 font-bold text-xl italic leading-relaxed font-sora relative z-10">
                                                        &quot;{mentor.whyMentor || "Empowering the next generation of dental professionals through structured guidance and clinical insight."}&quot;
                                                    </blockquote>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                                                        <div className="p-2.5 bg-white rounded-xl shadow-sm text-amber-500"><TrendingUp className="h-5 w-5" /></div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase">Growth Rate</p>
                                                            <p className="text-lg font-black text-slate-800">High</p>
                                                        </div>
                                                    </div>
                                                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                                                        <div className="p-2.5 bg-white rounded-xl shadow-sm text-indigo-500"><Target className="h-5 w-5" /></div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase">Strategy</p>
                                                            <p className="text-lg font-black text-slate-800">Precision</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            )}

                            {activeTab === "performance" && (
                                <Card className="border-none shadow-2xl shadow-gray-200/50 bg-white/80 backdrop-blur-xl rounded-[3rem] p-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                                        <div className="space-y-10">
                                            <div className="space-y-4">
                                                <h3 className="text-3xl font-black text-slate-900 font-sora tracking-tighter uppercase">Impact Pulse</h3>
                                                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Statistical decomposition of mentorship efficacy</p>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div className="p-8 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 text-center space-y-2 group hover:bg-indigo-600 hover:text-white transition-all">
                                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Success Rate</p>
                                                    <p className="text-4xl font-black font-sora">94%</p>
                                                    <Zap className="h-6 w-6 mx-auto opacity-20 group-hover:scale-125 transition-transform" />
                                                </div>
                                                <div className="p-8 bg-emerald-50/50 rounded-[2.5rem] border border-emerald-100 text-center space-y-2 group hover:bg-emerald-600 hover:text-white transition-all">
                                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Review Volume</p>
                                                    <p className="text-4xl font-black font-sora">{mentor.totalReviews || 0}</p>
                                                    <Star className="h-6 w-6 mx-auto opacity-20 group-hover:scale-125 transition-transform" />
                                                </div>
                                            </div>

                                            <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white overflow-hidden relative">
                                                <History className="absolute -right-8 -bottom-8 h-32 w-32 opacity-10" />
                                                <div className="relative z-10 space-y-4">
                                                    <h4 className="text-lg font-black font-sora uppercase tracking-tight">Mentorship Longevity</h4>
                                                    <div className="flex items-center gap-6">
                                                        <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center font-black text-2xl font-sora">{mentor.yearsInDentistry || 5}</div>
                                                        <div>
                                                            <p className="text-sm font-bold text-white/60">Years of active guidance within the DentiSpark Ecosystem.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100 flex items-center justify-center">
                                            <MentorRadarChart data={{
                                                ucat: 4.8,
                                                mmi: 4.5,
                                                personalStatement: 4.9,
                                                clinicalKnowledge: 4.2,
                                                academicGuidance: 4.7
                                            }} />
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {activeTab === "management" && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <Card className="border-none shadow-2xl shadow-gray-200/50 bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10">
                                            <h3 className="text-xl font-black text-slate-900 font-sora uppercase mb-8 flex items-center gap-3">
                                                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl"><ShieldCheck className="h-5 w-5" /></div>
                                                Credential Audit
                                            </h3>
                                            <div className="space-y-4">
                                                {mentor.documentUploadLinks && mentor.documentUploadLinks.length > 0 ? (
                                                    mentor.documentUploadLinks.map((link, idx) => (
                                                        <a 
                                                            key={idx}
                                                            href={link} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-between p-5 bg-slate-50 hover:bg-indigo-50 border border-slate-100 rounded-2xl transition-all group"
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className="p-3 bg-white rounded-xl shadow-sm text-slate-400 group-hover:text-indigo-600 group-hover:rotate-6 transition-all">
                                                                    <FileText className="h-5 w-5" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-black text-slate-700">
                                                                        {link.includes("cv") ? "Official Resume / CV" : link.includes("cert") ? "Professional Certification" : `Credential Bundle ${idx + 1}`}
                                                                    </p>
                                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified Document</p>
                                                                </div>
                                                            </div>
                                                            <ArrowUpRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                                        </a>
                                                    ))
                                                ) : (
                                                    <div className="p-10 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 text-center">
                                                        <p className="text-sm font-bold text-slate-400 italic">No credentials uploaded for review.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>

                                        <Card className="border-none shadow-2xl shadow-gray-200/50 bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10">
                                            <h3 className="text-xl font-black text-slate-900 font-sora uppercase mb-8 flex items-center gap-3">
                                                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl"><Clock3 className="h-5 w-5" /></div>
                                                Access Timeline
                                            </h3>
                                            <div className="space-y-6 relative overflow-hidden">
                                                <div className="flex items-center gap-6 p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100">
                                                    <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center shadow-sm text-indigo-600">
                                                        <Calendar className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Registration Date</p>
                                                        <p className="text-xl font-black text-indigo-900 font-sora">{new Date(mentor.dateStamped).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                                    <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center shadow-sm text-slate-400">
                                                        <Clock3 className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Last System Interaction</p>
                                                        <p className="text-xl font-black text-slate-800 font-sora">Recent Active</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* ── Linked Entities Sidebar ── */}
                <div className="w-full lg:w-[400px] space-y-10">
                    {/* Active Mentees Sidebar */}
                    <Card className="border-none shadow-2xl shadow-gray-200/50 bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-600/40 transition-colors" />
                        <CardHeader className="p-0 pb-8 flex flex-row items-center justify-between">
                            <CardTitle className="text-xl font-black font-sora uppercase tracking-tighter flex items-center gap-3">
                                <Users className="h-6 w-6 text-indigo-400" />
                                High-Potential Mentees
                            </CardTitle>
                            <Badge className="bg-indigo-600 text-white border-none font-black px-3 py-1 rounded-full">12 ACTIVE</Badge>
                        </CardHeader>
                        <CardContent className="p-0 space-y-6">
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group/item">
                                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-sm shadow-lg group-hover/item:rotate-6 transition-transform">
                                            ST
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate uppercase tracking-tight">Candidate 0{i}-X</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Active Application</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-white/20 group-hover/item:translate-x-1 transition-all" />
                                    </div>
                                ))}
                            </div>
                            <Button asChild className="w-full h-14 bg-white text-slate-900 hover:bg-indigo-50 rounded-2xl font-black text-sm shadow-xl shadow-indigo-900/40 transition-all active:scale-95">
                                <Link href="/admin/users?role=STUDENT">Manage Mentee Registry</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Institutional Alignment */}
                    <Card className="border-none shadow-2xl shadow-gray-200/50 bg-white/80 backdrop-blur-xl rounded-[3rem] p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl pointer-events-none" />
                        <CardHeader className="p-0 pb-8 flex flex-row items-center justify-between">
                            <CardTitle className="text-xl font-black font-sora uppercase tracking-tighter flex items-center gap-3">
                                <GraduationCap className="h-6 w-6 text-indigo-600" />
                                Institutional Alignment
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 space-y-8">
                            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative group/uni transition-all hover:shadow-xl hover:shadow-indigo-100 group">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="h-14 w-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-indigo-600 group-hover/uni:scale-110 transition-transform">
                                        <GraduationCap className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-lg text-slate-900 leading-tight">University of Oxford</h4>
                                        <div className="flex items-center gap-2 mt-1 text-slate-400">
                                            <MapPin className="h-3 w-3" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">Alumni / Clinical Fellow</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <span>Focus Area</span>
                                        <span className="text-indigo-600">Advanced Surgery</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full w-4/5 bg-indigo-600 rounded-full shadow-sm shadow-indigo-200" />
                                    </div>
                                </div>
                            </div>
                            
                            <Button asChild variant="outline" className="w-full h-14 rounded-2xl font-black text-sm border-2 border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95">
                                <Link href="/admin/universities">View Institutional Registry</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}
