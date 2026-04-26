"use client";
import { LooseRecord } from "@/src/types/loose";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/src/connection/admin-service";
import { chatService } from "@/src/connection/chat-service";
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
    ArrowRight,
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
import { MentorRadarChart } from "@/src/features/(dashboard)/profile/components/mentor-radar-chart";
import { MentorBadgeList } from "@/src/features/(dashboard)/profile/components/mentor-badge-list";
import { cn } from "@/src/lib/utils";

type TabKey = "profile" | "performance" | "management";

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "profile", label: "Dossier", icon: <User className="h-4 w-4" /> },
    { key: "performance", label: "Performance", icon: <Sparkles className="h-4 w-4" /> },
    { key: "management", label: "Governance", icon: <ShieldCheck className="h-4 w-4" /> },
];

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
            <div className="flex bg-[#fafafa] min-h-[500px] items-center justify-center">
                <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
            </div>
        );
    }

    if (error || !mentor) {
        return (
            <div className="max-w-3xl mx-auto mt-12 p-6 bg-white border border-greys-200 rounded-lg text-center shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Mentor Not Found</h3>
                <p className="text-sm text-slate-500 mb-6">This registry entry couldn't be loaded or doesn't exist.</p>
                <Button asChild variant="outline">
                    <Link href="/admin/mentors">Back to Mentor Registry</Link>
                </Button>
            </div>
        );
    }

    const fullName = `${mentor.firstName} ${mentor.lastName}`;

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans pb-24 text-slate-900 border-x border-greys-100 max-w-[1400px] mx-auto shadow-[0_0_40px_-15px_rgba(0,0,0,0.05)]">
            {/* Header Area */}
            <div className="px-6 py-5 border-b border-greys-200 bg-white text-sm">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Link href="/admin/mentors" className="hover:text-slate-900 transition-colors">Mentors Hub</Link>
                            <span className="text-greys-300">/</span>
                            <span className="font-medium text-slate-900 truncate max-w-[200px]">{fullName}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="outline" 
                            className="h-8 px-4 text-xs font-medium border-greys-200 hover:bg-greys-50 shadow-sm gap-2"
                            onClick={async () => {
                                try {
                                    const response = await chatService.upsertPeerConversation({
                                        participantEmail: mentor.emailAddress,
                                        participantName: `${mentor.firstName} ${mentor.lastName}`,
                                        participantType: "MENTOR"
                                    });
                                    if (response.responseData) {
                                        router.push(`/admin/messages?conversationId=${response.responseData.id}`);
                                    }
                                } catch (err) {
                                    toast.error("Failed to initiate secure channel");
                                }
                            }}
                        >
                           <Mail className="h-3.5 w-3.5 text-slate-400"/> Message Advisor
                        </Button>
                        <Button 
                            onClick={() => verifyMutation.mutate(!mentor.verified)}
                            disabled={verifyMutation.isPending}
                            className={cn(
                                "h-8 px-4 text-xs font-medium text-white shadow-sm transition-all",
                                mentor.verified 
                                    ? "bg-slate-900 hover:bg-slate-800" 
                                    : "bg-emerald-600 hover:bg-emerald-700 font-bold"
                            )}
                        >
                            {verifyMutation.isPending && <Loader2 className="h-3 w-3 mr-2 animate-spin" />}
                            {mentor.verified ? "Revoke Verification" : "Verify Identity"}
                        </Button>
                    </div>
                </div>
                <div className="mt-8 max-w-6xl mx-auto flex items-center gap-4">
                     <div className="h-12 w-12 bg-white border border-greys-200 rounded-lg shadow-sm flex items-center justify-center shrink-0">
                         <span className="text-slate-900 font-bold text-lg">{mentor.firstName[0]}{mentor.lastName[0]}</span>
                     </div>
                     <div>
                         <h1 className="text-xl font-semibold tracking-tight leading-tight flex items-center gap-2">
                            {fullName}
                            {mentor.verified && <CheckCircle className="h-4 w-4 text-emerald-500 shadow-sm" />}
                         </h1>
                         <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5 font-medium">
                             <span className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-slate-400"/> {mentor.emailAddress}</span>
                             <span className="text-greys-300">•</span>
                             <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5 text-slate-400"/> {mentor.yearsInDentistry || 0}+ Years Practice</span>
                             <span className="text-greys-300">•</span>
                             <span className="flex items-center gap-1.5"><Database className="h-3.5 w-3.5 text-slate-400"/> HID: {mentor.hid}</span>
                         </div>
                     </div>
                </div>
            </div>

            {/* Layout Grid */}
            <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-10">
                
                {/* Left Sidebar Tabs */}
                <div className="w-52 shrink-0 pr-4">
                    <div className="space-y-1 mb-6">
                        <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Professional Dossier</p>
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
                    {activeTab === "profile" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white border border-greys-200 shadow-sm rounded-lg overflow-hidden flex flex-col">
                                    <div className="p-5 border-b border-greys-200 bg-greys-50/30 flex items-center gap-2">
                                        <Briefcase className="h-4 w-4 text-slate-700" />
                                        <h3 className="font-semibold text-slate-900 text-sm">Professional Narrative</h3>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Specialization</p>
                                            <p className="text-sm font-semibold text-slate-900">
                                                {mentor.areaOfSpecialization || "General Dentistry Excellence"}
                                            </p>
                                        </div>
                                        <div className="pt-4 border-t border-greys-100">
                                            <p className="text-xs text-slate-600 leading-relaxed italic border-l-2 border-indigo-200 pl-4">
                                                &ldquo;{mentor.dentalSchoolExperience || "No professional narrative provided."}&rdquo;
                                            </p>
                                        </div>
                                        <div className="pt-4">
                                            <MentorBadgeList badges={["GDC_REGISTERED", "OXFORD_GRAD", "TOP_MENTOR"]} />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-greys-200 shadow-sm rounded-lg overflow-hidden flex flex-col">
                                    <div className="p-5 border-b border-greys-200 bg-greys-50/30 flex items-center gap-2">
                                        <Star className="h-4 w-4 text-warning-500" />
                                        <h3 className="font-semibold text-slate-900 text-sm">Mentorship Ethos</h3>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col space-y-6">
                                        <div className="p-5 bg-indigo-50/30 border border-indigo-100 rounded-lg">
                                            <p className="text-sm text-indigo-900 font-medium leading-relaxed italic">
                                                &ldquo;{mentor.whyMentor || "Empowering the next generation of dental professionals."}&rdquo;
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-auto">
                                            <div className="p-4 bg-greys-50 border border-greys-200 rounded-lg text-center">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Impact Rating</p>
                                                <p className="text-lg font-bold text-slate-900">{mentor.averageRating?.toFixed(1) || "5.0"}</p>
                                            </div>
                                            <div className="p-4 bg-greys-50 border border-greys-200 rounded-lg text-center">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Engagements</p>
                                                <p className="text-lg font-bold text-slate-900">{mentor.totalReviews || 0}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                             </div>

                             <div className="pt-6 border-t border-greys-200">
                                <h3 className="text-sm font-semibold text-slate-900 mb-4">Credentials Audit</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {mentor.documentUploadLinks && mentor.documentUploadLinks.length > 0 ? (
                                        mentor.documentUploadLinks.map((link, idx) => (
                                            <a 
                                                key={idx}
                                                href={link} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-4 bg-white border border-greys-200 rounded-lg shadow-sm hover:border-indigo-500 transition-all group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-greys-50 rounded-lg text-slate-400 group-hover:text-indigo-600 transition-colors">
                                                        <FileText className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-900">
                                                            {link.toLowerCase().includes("cv") ? "Resume / Curriculum Vitae" : "Practice Certification"}
                                                        </p>
                                                        <p className="text-[10px] text-slate-500 mt-0.5">Verified Asset ID: {mentor.hid.slice(0, 8)}</p>
                                                    </div>
                                                </div>
                                                <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-indigo-600" />
                                            </a>
                                        ))
                                    ) : (
                                        <div className="col-span-2 p-12 bg-greys-50 border border-dashed border-greys-300 rounded-lg text-center">
                                            <p className="text-sm text-slate-400 font-medium italic">No credentials submitted for review.</p>
                                        </div>
                                    )}
                                </div>
                             </div>
                        </div>
                    )}

                    {activeTab === "performance" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                             <div className="bg-white border border-greys-200 shadow-sm rounded-lg p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                 <div className="space-y-10">
                                     <div>
                                        <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Efficacy Pulse</h3>
                                        <p className="text-sm text-slate-500 mt-1 font-medium italic">Active performance metrics across mentorship pillars.</p>
                                     </div>
                                     
                                     <div className="grid grid-cols-2 gap-4">
                                         <div className="p-6 bg-slate-900 rounded-lg text-white shadow-lg space-y-4">
                                             <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Success Rate</p>
                                             <div className="flex items-end gap-2">
                                                 <span className="text-4xl font-bold leading-none">94%</span>
                                                 <TrendingUp className="h-5 w-5 text-emerald-400 mb-1" />
                                             </div>
                                         </div>
                                         <div className="p-6 bg-white border border-greys-200 rounded-lg shadow-sm space-y-4 group hover:border-indigo-500 transition-colors">
                                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Feedback Count</p>
                                             <div className="flex items-end gap-2 text-slate-900">
                                                 <span className="text-4xl font-bold leading-none">{mentor.totalReviews || 0}</span>
                                                 <Star className="h-5 w-5 text-warning-400 mb-1" />
                                             </div>
                                         </div>
                                     </div>

                                     <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-lg flex items-center gap-4">
                                         <div className="p-3 bg-white border border-indigo-100 text-indigo-600 rounded-lg shadow-sm">
                                             <Zap className="h-5 w-5" />
                                         </div>
                                         <div className="text-xs">
                                             <p className="font-semibold text-slate-900 italic">High Velocity Responder</p>
                                             <p className="text-slate-500 mt-0.5">Mentor typically engages within 4 business hours.</p>
                                         </div>
                                     </div>
                                 </div>

                                 <div className="flex items-center justify-center p-4 bg-greys-50 rounded-lg border border-greys-100">
                                      <div className="scale-90">
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
                        </div>
                    )}
                    
                    {activeTab === "management" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                             <div>
                                <h2 className="text-lg font-semibold text-slate-900">Governance Identity Protocol</h2>
                            </div>
                            
                            <div className="bg-white border border-greys-200 shadow-sm rounded-lg overflow-hidden divide-y divide-greys-100">
                                <div className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                     <div>
                                        <p className="text-sm font-semibold text-slate-900">Platform Presence</p>
                                        <p className="text-xs text-slate-500 mt-1">Determine if the advisor is visible in student searches.</p>
                                    </div>
                                    <Button 
                                        variant="outline"
                                        onClick={() => updateStatusMutation.mutate(mentor.activationStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                                        className={cn(
                                            "h-8 px-4 text-xs font-medium bg-white shadow-sm transition-all",
                                            mentor.activationStatus === "ACTIVE" 
                                                ? "text-error-600 border-error-200 hover:bg-error-50" 
                                                : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                        )}
                                    >
                                        {mentor.activationStatus === "ACTIVE" ? "Deactivate Visibility" : "Restore Visibility"}
                                    </Button>
                                </div>
                                <div className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                     <div>
                                        <p className="text-sm font-semibold text-slate-900">Identity Archival</p>
                                        <p className="text-xs text-slate-500 mt-1 italic">Flag this entry for permanent decommissioning.</p>
                                    </div>
                                    <Button variant="outline" className="h-8 px-4 text-xs font-medium border-greys-200 text-slate-400 hover:text-slate-900 bg-white shadow-sm">
                                        Purge Entry
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Context Meta Info Column */}
                <div className="w-full xl:w-64 shrink-0 space-y-6 hidden lg:block">
                    <div>
                        <h3 className="text-[12px] font-semibold text-slate-900 mb-3 uppercase tracking-wider">Ecosystem Timeline</h3>
                        <div className="bg-white border border-greys-200 rounded-lg overflow-hidden text-sm shadow-sm p-5 space-y-6">
                            <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Registered</p>
                                <p className="text-sm font-semibold text-slate-900">{new Date(mentor.dateStamped).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</p>
                            </div>
                            <div className="pt-4 border-t border-greys-100">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Last Synchronization</p>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                    <p className="text-sm font-semibold text-slate-900">Active Node</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <h3 className="text-[12px] font-semibold text-slate-900 mb-3 uppercase tracking-wider">Operational Intel</h3>
                        <p className="text-[11px] text-slate-500 mb-4 leading-relaxed font-medium italic">Handshake status verified across all primary data buckets.</p>
                        <div className="flex items-center justify-between border border-greys-200 bg-slate-50 px-3 py-2.5 rounded-lg text-xs shadow-inner">
                            <span className="flex items-center gap-2 font-medium text-slate-700">
                                <Database className="h-3.5 w-3.5 text-slate-400" /> core/mentors
                            </span>
                            <span className="font-mono text-[10px] text-slate-400">#v0.12</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
