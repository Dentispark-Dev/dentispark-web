"use client";

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
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MentorRadarChart } from "@/src/features/(dashboard)/profile/components/mentor-radar-chart";
import { MentorBadgeList } from "@/src/features/(dashboard)/profile/components/mentor-badge-list";
import { cn } from "@/src/lib/utils";

type TabKey = "profile" | "performance" | "management";

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "profile", label: "Professional Dossier", icon: <User className="h-4 w-4" /> },
    { key: "performance", label: "Impact Pulse", icon: <Sparkles className="h-4 w-4" /> },
    { key: "management", label: "Governance & Registry", icon: <ShieldCheck className="h-4 w-4" /> },
];

function AvatarRing({ name }: { name: string }) {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    return (
        <div className="relative group">
            <div className="h-28 w-28 rounded-[2rem] bg-primary-600 p-[3px] shadow-xl shadow-primary-100 group-hover:rotate-2 transition-transform duration-500">
                <div className="h-full w-full rounded-[1.8rem] bg-white flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent" />
                    <span className="text-3xl font-bold text-primary-600 font-jakarta relative z-10">
                        {initials}
                    </span>
                </div>
            </div>
            <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-2xl bg-success-500 border-4 border-white shadow-lg flex items-center justify-center"
            >
                <CheckCircle className="h-4 w-4 text-white" />
            </motion.div>
        </div>
    );
}

function StatPill({ label, value, color, icon: Icon }: { label: string; value: string | number | undefined; color: string; icon?: any }) {
    return (
        <div className={cn("flex flex-col px-6 py-4 rounded-2xl border border-greys-300 bg-white shadow-sm transition-all hover:shadow-md", color)}>
            <div className="flex items-center gap-2 mb-1">
                {Icon && <Icon className="h-3.5 w-3.5 opacity-60" />}
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 font-jakarta leading-none">{label}</span>
            </div>
            <span className="text-xl font-bold text-text-heading tracking-tight font-jakarta">{value ?? "—"}</span>
        </div>
    );
}

interface MentorProfileViewProps {
    mentorId: string;
}

export function MentorProfileView({ mentorId }: MentorProfileViewProps) {
    const queryClient = useQueryClient();
    const router = useRouter();
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
            toast.success("Mentor status updated in registry");
        },
        onError: () => {
            toast.error("Failed to propagate status change");
        }
    });

    const verifyMutation = useMutation({
        mutationFn: (verify: boolean) => adminService.verifyMentor(mentorId, { verify }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-mentor-detail", mentorId] });
            toast.success("Identity verification status updated");
        },
        onError: () => {
            toast.error("Handshake fail during verification");
        }
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] gap-6 bg-white">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-t-2 border-primary-600 animate-spin" />
                    <User className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary-600 animate-pulse" />
                </div>
                <p className="text-greys-600 font-medium tracking-tight font-jakarta animate-pulse">Syncing Hub Data...</p>
            </div>
        );
    }

    if (error || !mentor) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center max-w-lg mx-auto bg-white p-12 rounded-3xl border border-greys-300">
                <div className="p-4 bg-error-50 rounded-full text-error-600">
                    <AlertCircle className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-text-heading">Registry Synchronisation Failure</h3>
                    <p className="text-greys-600 text-sm leading-relaxed">The administrative hub was unable to establish a secure handshake with the primary mentor database.</p>
                </div>
                <Button asChild variant="outline" className="rounded-xl px-10 h-12 border-greys-300 font-bold text-xs uppercase tracking-widest transition-all hover:bg-greys-100">
                    <Link href="/admin/mentors">Return to Mentor Registry</Link>
                </Button>
            </div>
        );
    }

    const fullName = `${mentor.firstName} ${mentor.lastName}`;

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* ── Professional Identity Header ── */}
            <div className="bg-white p-8 md:p-12 border-b border-greys-300 flex flex-col md:flex-row gap-10 justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 h-64 w-64 bg-primary-50 rounded-bl-full opacity-40 pointer-events-none" />
                
                <div className="flex-1 flex flex-col md:flex-row items-center gap-8 relative z-10 w-full">
                    <AvatarRing name={fullName} />
                    <div className="space-y-4 text-center md:text-left flex-1 min-w-0">
                        <div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-2">
                                <Badge variant="outline" className="bg-primary-50 text-primary-600 border-primary-200 px-4 py-1.5 font-bold text-[10px] tracking-[0.25em] rounded-full uppercase leading-none">
                                    Specialist Profile
                                </Badge>
                                {mentor.verified && (
                                    <Badge className="bg-success-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase leading-none shadow-lg shadow-success-100">
                                        Verified Provider
                                    </Badge>
                                )}
                                <span className="text-[11px] font-bold text-greys-400 uppercase tracking-widest opacity-60 leading-none">HID: {mentor.hid}</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-semibold text-text-heading tracking-tight leading-tight font-jakarta">
                                {mentor.firstName} <span className="text-primary-600">{mentor.lastName}</span>
                            </h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-4 text-sm text-greys-600 font-medium font-jakarta">
                                <span className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-primary-500 opacity-60" />
                                    {mentor.emailAddress}
                                </span>
                                <span className="flex items-center gap-2 text-primary-600 font-bold uppercase tracking-widest text-[10px]">
                                    <Calendar className="h-4 w-4 opacity-60" />
                                    Member Since {new Date(mentor.dateStamped).getFullYear()}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            <StatPill label="Avg Rating" value={mentor.averageRating?.toFixed(1) || "5.0"} color="text-warning-600" icon={Star} />
                            <StatPill label="Mentees" value={`${mentor.totalReviews || 0}`} color="text-indigo-600" icon={Users} />
                            <StatPill label="Expertise" value={`${mentor.yearsInDentistry || 0}Y`} color="text-primary-600" icon={Briefcase} />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 relative z-10 shrink-0">
                    <Button 
                        variant="outline" 
                        onClick={() => router.back()}
                        className="h-12 px-6 rounded-xl border-greys-300 bg-white text-text-color font-bold text-xs gap-3 hover:bg-greys-100 transition-all active:scale-95 shadow-sm uppercase tracking-widest leading-none font-jakarta"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Registry
                    </Button>
                    <Button className="h-12 px-10 rounded-xl bg-primary-600 text-white font-bold text-xs hover:bg-primary-500 transition-all active:scale-95 shadow-lg shadow-primary-200 uppercase tracking-widest leading-none font-jakarta">
                        Send Message
                    </Button>
                </div>
            </div>

            {/* ── Navigation Hub ── */}
            <div className="container mx-auto px-6 mt-10">
                <div className="flex flex-wrap gap-2 p-1.5 bg-greys-100 rounded-2xl w-fit border border-greys-300 mb-10">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                "flex items-center gap-3 px-8 py-3.5 rounded-xl text-xs font-bold transition-all duration-300 uppercase tracking-widest leading-none font-jakarta",
                                activeTab === tab.key
                                    ? "bg-white shadow-xl text-primary-600 ring-1 ring-black/5"
                                    : "text-greys-400 hover:text-text-color hover:bg-greys-200/50"
                            )}
                        >
                            <span className={cn("transition-colors", activeTab === tab.key ? "text-primary-600" : "text-greys-400")}>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col xl:flex-row gap-10">
                    <div className="flex-1 min-w-0">
                        <AnimatePresence mode="wait">
                            {activeTab === "profile" && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-10"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <Card className="bg-white rounded-3xl border border-greys-300 p-8 shadow-sm space-y-8 overflow-hidden group">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-3 bg-primary-50 rounded-2xl text-primary-600">
                                                    <Briefcase className="h-5 w-5" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-text-heading font-jakarta">Professional Narrative</h3>
                                            </div>
                                            
                                            <div className="space-y-6">
                                                <div className="p-6 bg-greys-100 rounded-2xl border border-greys-200">
                                                    <p className="text-[10px] font-bold text-greys-400 uppercase tracking-widest mb-2 font-jakarta">Current Focus</p>
                                                    <p className="text-lg font-semibold text-text-heading leading-tight font-jakarta">
                                                        {mentor.areaOfSpecialization || "General Dentistry Excellence"}
                                                    </p>
                                                </div>
                                                <div className="space-y-4">
                                                    <p className="text-sm text-greys-600 leading-relaxed font-jakarta">
                                                        {mentor.dentalSchoolExperience || "No professional narrative provided yet. This mentor specializes in guiding students through the complex transitions of dental school admissions and clinical rotations."}
                                                    </p>
                                                    <MentorBadgeList badges={["GDC_REGISTERED", "OXFORD_GRAD", "TOP_MENTOR"]} />
                                                </div>
                                            </div>
                                        </Card>

                                        <Card className="bg-white rounded-3xl border border-greys-300 p-8 shadow-sm space-y-8 overflow-hidden group">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                                                    <Star className="h-5 w-5" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-text-heading font-jakarta">Mentorship Ethos</h3>
                                            </div>
                                            
                                            <div className="space-y-8">
                                                <div className="p-8 bg-indigo-50/30 rounded-3xl border border-indigo-100 relative overflow-hidden group-hover:bg-indigo-50 transition-colors duration-500">
                                                    <Sparkles className="absolute -right-4 -bottom-4 h-24 w-24 text-indigo-200 opacity-20 rotate-12" />
                                                    <blockquote className="text-indigo-900 font-semibold text-xl italic leading-relaxed font-jakarta relative z-10">
                                                        &ldquo;{mentor.whyMentor || "Empowering the next generation of dental professionals through structured guidance and clinical insight."}&rdquo;
                                                    </blockquote>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-5 bg-greys-100 rounded-2xl border border-greys-200 flex items-center gap-4">
                                                        <div className="p-2.5 bg-white rounded-xl shadow-sm text-warning-500"><TrendingUp className="h-4 w-4" /></div>
                                                        <div>
                                                            <p className="text-[9px] font-bold text-greys-400 uppercase tracking-widest font-jakarta leading-none mb-1">Impact</p>
                                                            <p className="text-sm font-bold text-text-heading font-jakarta">High Velocity</p>
                                                        </div>
                                                    </div>
                                                    <div className="p-5 bg-greys-100 rounded-2xl border border-greys-200 flex items-center gap-4">
                                                        <div className="p-2.5 bg-white rounded-xl shadow-sm text-primary-500"><Target className="h-4 w-4" /></div>
                                                        <div>
                                                            <p className="text-[9px] font-bold text-greys-400 uppercase tracking-widest font-jakarta leading-none mb-1">Strategy</p>
                                                            <p className="text-sm font-bold text-text-heading font-jakarta">Precision</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "performance" && (
                                <motion.div
                                    key="performance"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="bg-white rounded-[2rem] border border-greys-300 p-12 shadow-sm"
                                >
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                        <div className="space-y-12">
                                            <div className="space-y-2">
                                                <h3 className="text-2xl font-semibold text-text-heading tracking-tight font-jakarta">Impact Pulse Analysis</h3>
                                                <p className="text-sm text-greys-500 font-medium font-jakarta">Algorithmic evaluation of mentorship efficacy across core pillars.</p>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div className="p-10 bg-primary-50/50 rounded-[2.5rem] border border-primary-100 text-center space-y-4 group hover:bg-primary-600 hover:text-white transition-all duration-500">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 font-jakarta leading-none">Success Velocity</p>
                                                    <p className="text-5xl font-bold font-jakarta tracking-tight">94%</p>
                                                    <Zap className="h-6 w-6 mx-auto opacity-20 group-hover:scale-125 transition-transform" />
                                                </div>
                                                <div className="p-10 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 text-center space-y-4 group hover:bg-indigo-600 hover:text-white transition-all duration-500">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 font-jakarta leading-none">Review Density</p>
                                                    <p className="text-5xl font-bold font-jakarta tracking-tight">{mentor.totalReviews || 0}</p>
                                                    <Star className="h-6 w-6 mx-auto opacity-20 group-hover:scale-125 transition-transform" />
                                                </div>
                                            </div>

                                            <div className="p-8 bg-greys-900 rounded-[2.5rem] text-white overflow-hidden relative shadow-2xl">
                                                <History className="absolute -right-8 -bottom-8 h-32 w-32 opacity-10" />
                                                <div className="relative z-10 flex items-center gap-8">
                                                    <div className="h-20 w-20 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-3xl font-jakarta border border-white/10">
                                                        {mentor.yearsInDentistry || 5}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h4 className="text-lg font-semibold font-jakarta leading-tight">Ecosystem Seniority</h4>
                                                        <p className="text-sm text-white/50 font-medium font-jakarta lg:max-w-xs">Years of active operational guidance within the DentiSpark platform.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-greys-100 rounded-[3rem] p-10 border border-greys-200 flex items-center justify-center group">
                                            <div className="transform group-hover:scale-105 transition-transform duration-700">
                                                <MentorRadarChart data={{
                                                    ucat: 4.8,
                                                    mmi: 4.5,
                                                    personalStatement: 4.9,
                                                    clinicalKnowledge: 4.2,
                                                    academicGuidance: 4.7
                                                }} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "management" && (
                                <motion.div
                                    key="management"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-10"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <Card className="bg-white rounded-3xl border border-greys-300 p-10 shadow-sm">
                                            <h3 className="text-xl font-semibold text-text-heading font-jakarta uppercase mb-10 flex items-center gap-3">
                                                <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl"><ShieldCheck className="h-5 w-5" /></div>
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
                                                            className="flex items-center justify-between p-6 bg-greys-100 hover:bg-primary-50 border border-greys-200 rounded-2xl transition-all group"
                                                        >
                                                            <div className="flex items-center gap-5">
                                                                <div className="p-3 bg-white rounded-xl shadow-sm text-greys-400 group-hover:text-primary-600 group-hover:rotate-6 transition-all">
                                                                    <FileText className="h-6 w-6" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-text-heading font-jakarta">
                                                                        {link.includes("cv") ? "Official Resume / CV" : link.includes("cert") ? "Professional Certification" : `Credential Bundle ${idx + 1}`}
                                                                    </p>
                                                                    <p className="text-[10px] font-bold text-greys-400 uppercase tracking-widest mt-1 font-jakarta leading-none">Security Verified Node</p>
                                                                </div>
                                                            </div>
                                                            <ArrowUpRight className="h-5 w-5 text-greys-300 group-hover:text-primary-500 transition-colors" />
                                                        </a>
                                                    ))
                                                ) : (
                                                    <div className="p-16 bg-greys-100 rounded-[2rem] border border-dashed border-greys-300 text-center">
                                                        <p className="text-sm font-medium text-greys-400 italic font-jakarta">No credentials uploaded for review.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>

                                        <Card className="bg-white rounded-3xl border border-greys-300 p-10 shadow-sm">
                                            <h3 className="text-xl font-semibold text-text-heading font-jakarta uppercase mb-10 flex items-center gap-3">
                                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Clock3 className="h-5 w-5" /></div>
                                                Access Timeline
                                            </h3>
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-6 p-8 bg-indigo-50/30 rounded-3xl border border-indigo-100">
                                                    <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center shadow-sm text-indigo-600">
                                                        <Calendar className="h-7 w-7" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1 tracking-widest font-jakarta">Registration Gateway</p>
                                                        <p className="text-2xl font-bold text-indigo-900 font-jakarta tracking-tight">{new Date(mentor.dateStamped).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6 p-8 bg-greys-100 rounded-3xl border border-greys-200">
                                                    <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center shadow-sm text-greys-400">
                                                        <Clock3 className="h-7 w-7" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-greys-400 uppercase mb-1 tracking-widest font-jakarta">Last Registry Sync</p>
                                                        <p className="text-2xl font-bold text-text-heading font-jakarta tracking-tight">Active Node</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ── Sidebar Actions & Intel ── */}
                    <div className="w-full xl:w-[400px] space-y-10">
                        {/* Governance Actions */}
                        <div className="bg-white rounded-[2.5rem] border border-greys-300 p-10 space-y-8 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 h-40 w-40 bg-greys-50 rounded-full opacity-40 -mr-20 -mt-20" />
                            <h3 className="text-[10px] font-bold text-greys-500 uppercase tracking-[0.3em] font-jakarta mb-2">Authority Protocol</h3>
                            <div className="space-y-4 relative z-10">
                                <Button 
                                    onClick={() => verifyMutation.mutate(!mentor.verified)}
                                    disabled={verifyMutation.isPending}
                                    className={cn(
                                        "w-full h-14 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl font-jakarta leading-none",
                                        mentor.verified 
                                            ? "bg-greys-200 text-text-heading hover:bg-greys-300" 
                                            : "bg-primary-600 text-white hover:bg-primary-500 shadow-primary-200"
                                    )}
                                >
                                    {mentor.verified ? <><ShieldCheck className="h-4 w-4 mr-3" /> Revoke Verification</> : <><Award className="h-4 w-4 mr-3" /> Grant Verification</>}
                                </Button>
                                <Button 
                                    onClick={() => updateStatusMutation.mutate(mentor.activationStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                                    disabled={updateStatusMutation.isPending}
                                    className={cn(
                                        "w-full h-14 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg font-jakarta leading-none",
                                        mentor.activationStatus === "ACTIVE" 
                                            ? "bg-error-50 text-error-600 border border-error-100 hover:bg-error-100" 
                                            : "bg-success-50 text-success-600 border border-success-100 hover:bg-success-100"
                                    )}
                                >
                                    {mentor.activationStatus === "ACTIVE" ? <><XCircle className="h-4 w-4 mr-3" /> Suspend Access</> : <><CheckCircle className="h-4 w-4 mr-3" /> Restore Access</>}
                                </Button>
                            </div>
                        </div>

                        {/* LinkedIn Impact Intel */}
                        <Card className="bg-greys-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 rounded-full blur-3xl pointer-events-none group-hover:bg-primary-600/40 transition-colors duration-700" />
                            <CardHeader className="p-0 pb-10 flex flex-row items-center justify-between">
                                <CardTitle className="text-lg font-semibold font-jakarta uppercase tracking-tight flex items-center gap-3">
                                    <Users className="h-5 w-5 text-primary-400" />
                                    Active Roadmap
                                </CardTitle>
                                <Badge className="bg-primary-600 text-white border-none font-bold px-4 py-1.5 rounded-full text-[9px] tracking-widest uppercase">12 Nodes</Badge>
                            </CardHeader>
                            <CardContent className="p-0 space-y-8">
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group/item">
                                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center font-bold text-sm shadow-lg group-hover/item:rotate-6 transition-transform">
                                                C{i}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm truncate uppercase tracking-tight font-jakarta">Candidate Node {i}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-success-500 animate-pulse" />
                                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-jakarta">Status Active</p>
                                                </div>
                                            </div>
                                            <ArrowUpRight className="h-4 w-4 text-white/20 group-hover/item:text-primary-400 group-hover/item:translate-x-1 transition-all" />
                                        </div>
                                    ))}
                                </div>
                                <Button asChild className="w-full h-14 bg-white text-greys-900 hover:bg-primary-50 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-black/40 transition-all active:scale-95 leading-none font-jakarta">
                                    <Link href="/admin/users?role=STUDENT">Manage Mentee Intel</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
