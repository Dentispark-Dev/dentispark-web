"use client";
import { LooseRecord } from "@/src/types/loose";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/src/connection/admin-service";
import {
    User,
    Loader2,
    ArrowLeft,
    CheckCircle,
    Building2,
    GraduationCap,
    Clock,
    FileText,
    Star,
    BookOpen,
    Trash2,
    ShieldCheck,
    Settings,
    ArrowUpRight,
    MapPin,
    Users,
    Activity,
    Database,
    Image as ImageIcon,
    Mail,
    Phone,
    Calendar,
    AlertCircle,
    TrendingUp,
    Target,
    Sparkles,
    History,
    Link as LinkIcon,
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

interface StudentProfileViewProps {
    studentId: string;
}

type TabKey = "profile" | "insights" | "history" | "management";

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "profile", label: "Overview", icon: <User className="h-4 w-4" /> },
    { key: "insights", label: "Application Readiness", icon: <Sparkles className="h-4 w-4" /> },
    { key: "history", label: "Academic Record", icon: <History className="h-4 w-4" /> },
    { key: "management", label: "Account Management", icon: <ShieldCheck className="h-4 w-4" /> },
];

export function StudentProfileView({ studentId }: StudentProfileViewProps) {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabKey>("profile");

    const { data: student, isLoading, error } = useQuery({
        queryKey: ["admin-student-detail", studentId],
        queryFn: () => adminService.getStudentDetail(studentId),
    });

    const updateStatusMutation = useMutation({
        mutationFn: (status: string) => adminService.updateStudentStatus(studentId, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-student-detail", studentId] });
            toast.success("Identity status updated");
        },
        onError: () => {
            toast.error("Failed to propagate status change");
        }
    });

    const deleteStudentMutation = useMutation({
        mutationFn: () => adminService.deleteStudent(studentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-students"] });
            toast.success("Student account archived and hidden successfully");
            router.push("/admin/students");
        },
        onError: (error: any) => {
            const diag = error?.headers?.['x-handled-locally'] ? '[LOCAL]' : 
                        error?.headers?.['x-proxied-to-java-fallback'] ? '[FALLBACK]' : '';
            const msg = `${diag} ${error?.message || error?.responseMessage || "Failed to archive student account"}`;
            toast.error(msg.trim());
        }
    });

    if (isLoading) {
        return (
            <div className="flex bg-[#fafafa] min-h-[500px] items-center justify-center">
                <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="max-w-3xl mx-auto mt-12 p-6 bg-white border border-greys-200 rounded-lg text-center shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Student Not Found</h3>
                <p className="text-sm text-slate-500 mb-6">This student record could not be loaded or does not exist.</p>
                <Button asChild variant="outline">
                    <Link href="/admin/students">Back to Students</Link>
                </Button>
            </div>
        );
    }

    const fullName = `${student.firstName} ${student.lastName}`;
    const targetSchoolsArr = student.goals
        ? student.goals.split(",").map((g: string) => g.trim()).filter(Boolean)
        : [];

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans pb-24 text-slate-900 border-x border-greys-100 max-w-[1400px] mx-auto shadow-[0_0_40px_-15px_rgba(0,0,0,0.05)]">
            {/* Header Area */}
            <div className="px-6 py-5 border-b border-greys-200 bg-white text-sm">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Link href="/admin/students" className="hover:text-slate-900 transition-colors">Students Registry</Link>
                            <span className="text-greys-300">/</span>
                            <span className="font-medium text-slate-900 truncate max-w-[200px]">{fullName}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="h-8 px-4 text-xs font-medium border-greys-200 hover:bg-greys-50 shadow-sm gap-2">
                           <Mail className="h-3.5 w-3.5 text-slate-400"/> Send Message
                        </Button>
                        <Button 
                            onClick={() => updateStatusMutation.mutate(student.activationStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                            disabled={updateStatusMutation.isPending}
                            className={cn(
                                "h-8 px-4 text-xs font-medium text-white shadow-sm transition-all",
                                student.activationStatus === "ACTIVE" 
                                    ? "bg-slate-900 hover:bg-slate-800" 
                                    : "bg-emerald-600 hover:bg-emerald-700"
                            )}
                        >
                            {updateStatusMutation.isPending && <Loader2 className="h-3 w-3 mr-2 animate-spin" />}
                            {student.activationStatus === "ACTIVE" ? "Suspend Account" : "Reinstate Account"}
                        </Button>
                    </div>
                </div>
                <div className="mt-8 max-w-6xl mx-auto flex items-center gap-4">
                     <div className="h-12 w-12 bg-white border border-greys-200 rounded-lg shadow-sm flex items-center justify-center shrink-0">
                         <span className="text-slate-900 font-bold text-lg">{student.firstName[0]}{student.lastName[0]}</span>
                     </div>
                     <div>
                         <h1 className="text-xl font-semibold tracking-tight leading-tight flex items-center gap-2">
                            {fullName}
                            {student.activationStatus === "ACTIVE" && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                         </h1>
                         <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5 font-medium">
                             <span className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-slate-400"/> {student.emailAddress}</span>
                             <span className="text-greys-300">•</span>
                             <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-slate-400"/> Year {student.currentAcademicYear || "TBD"}</span>
                             <span className="text-greys-300">•</span>
                             <span className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5 text-slate-400"/> SID: {student.sid}</span>
                         </div>
                     </div>
                </div>
            </div>

            {/* Layout Grid */}
            <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-10">
                
                {/* Left Sidebar Tabs */}
                <div className="w-52 shrink-0 pr-4">
                    <div className="space-y-1 mb-6">
                        <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Student Profile</p>
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
                             <div>
                                <h2 className="text-lg font-semibold text-slate-900">Profile Overview</h2>
                            </div>
                            
                            <div className="bg-white border border-greys-200 shadow-sm rounded-lg overflow-hidden">
                                <div className="p-6">
                                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-6">Application Progress</h3>
                                    
                                    <div className="relative flex justify-between items-start px-4 py-4">
                                        <div className="absolute top-[34px] left-8 w-[calc(100%-4rem)] h-[2px] bg-slate-100" />
                                        <div 
                                            className="absolute top-[34px] left-8 h-[2px] bg-indigo-500 transition-all duration-1000" 
                                            style={{ width: student.ucatScore ? (student.whyDentistry ? "100%" : "50%") : "10%" }}
                                        />
                                        
                                        {[
                                            { label: "Profile", icon: User, active: true },
                                            { label: "Aptitude", icon: BookOpen, active: !!student.ucatScore },
                                            { label: "Statement", icon: FileText, active: !!student.whyDentistry },
                                        ].map((step, i) => (
                                            <div key={i} className="relative z-10 flex flex-col items-center gap-3">
                                                <div className={cn(
                                                    "h-8 w-8 rounded-full flex items-center justify-center transition-all bg-white border-2",
                                                    step.active ? "border-indigo-500 text-indigo-600 shadow-sm" : "border-slate-200 text-slate-400"
                                                )}>
                                                    <step.icon className="h-4 w-4" />
                                                </div>
                                                <span className={cn("text-[10px] font-medium tracking-wide text-center", step.active ? "text-slate-900" : "text-slate-400")}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white border text-sm border-greys-200 shadow-sm rounded-lg overflow-hidden">
                                    <div className="p-5 border-b border-greys-100 flex items-center gap-2">
                                        <Target className="h-4 w-4 text-slate-400" />
                                        <h3 className="font-semibold text-slate-900">Academic Profile</h3>
                                    </div>
                                    <div className="divide-y divide-greys-100 text-sm">
                                        <div className="flex justify-between p-4">
                                            <span className="text-slate-500 font-medium">Entry Route</span>
                                            <span className="text-slate-900 font-medium">{student.dentalSchoolGateway || "Standard Entry"}</span>
                                        </div>
                                        <div className="flex justify-between p-4 bg-slate-50/50">
                                            <span className="text-slate-500 font-medium">UCAT Score</span>
                                            <span className="text-indigo-600 font-semibold">{student.ucatScore || "Not Recorded"}</span>
                                        </div>
                                        <div className="flex justify-between p-4">
                                            <span className="text-slate-500 font-medium">CASPer Assessment</span>
                                            <span className="text-slate-900 font-medium">{student.casperScore || "Not Submitted"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border text-sm border-greys-200 shadow-sm rounded-lg overflow-hidden flex flex-col">
                                    <div className="p-5 border-b border-greys-100 flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-slate-400" />
                                        <h3 className="font-semibold text-slate-900">Personal Statement</h3>
                                    </div>
                                    <div className="p-5 flex-1 bg-slate-50/50">
                                        {student.whyDentistry ? (
                                            <p className="text-sm text-slate-700 leading-relaxed italic border-l-2 border-indigo-200 pl-4">
                                                &ldquo;{student.whyDentistry}&rdquo;
                                            </p>
                                        ) : (
                                            <div className="h-full flex items-center justify-center min-h-[100px]">
                                                <p className="text-xs font-medium text-slate-400 italic">No personal statement submitted.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-6 border-t border-greys-200">
                                <h3 className="text-sm font-semibold text-slate-900 mb-4">Administrative Actions</h3>
                                <div className="grid grid-cols-2 gap-4">
                                     <div className="p-4 bg-white border border-greys-200 shadow-sm rounded-lg hover:shadow-md transition-shadow cursor-pointer group">
                                         <Mail className="h-5 w-5 text-indigo-500 mb-3" />
                                         <h4 className="text-xs font-semibold text-slate-900 mb-1">Send Notification Email</h4>
                                         <p className="text-[11px] text-slate-500 leading-relaxed">Send an email notification to this student.</p>
                                     </div>
                                     <div className="p-4 bg-white border border-greys-200 shadow-sm rounded-lg hover:shadow-md transition-shadow cursor-pointer group">
                                         <History className="h-5 w-5 text-emerald-500 mb-3" />
                                         <h4 className="text-xs font-semibold text-slate-900 mb-1">View Activity Log</h4>
                                         <p className="text-[11px] text-slate-500 leading-relaxed">View a complete record of all account activity and administrative changes.</p>
                                     </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "insights" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                             <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-900">Application Readiness Assessment</h2>
                                <span className="text-xs text-slate-500 font-medium">Algorithmic evaluation</span>
                            </div>
                            
                            <div className="bg-white border border-greys-200 shadow-sm rounded-lg overflow-hidden flex flex-col md:flex-row">
                                <div className="flex-1 divide-y divide-greys-100">
                                     <div className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                                        <span className="text-sm font-medium text-slate-700">Profile Completeness</span>
                                        <span className="px-3 py-1 rounded-md text-[10px] font-semibold uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100">Professional</span>
                                    </div>
                                    <div className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                                        <span className="text-sm font-medium text-slate-700">Platform Engagement</span>
                                        <span className="px-3 py-1 rounded-md text-[10px] font-semibold uppercase tracking-widest bg-indigo-50 text-indigo-700 border border-indigo-100">Standard</span>
                                    </div>
                                    <div className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                                        <span className="text-sm font-medium text-slate-700">Application Strength</span>
                                        <span className="px-3 py-1 rounded-md text-[10px] font-semibold uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100">Elite</span>
                                    </div>
                                </div>
                                <div className="w-64 bg-slate-50 border-l border-greys-100 p-8 flex flex-col items-center justify-center text-center">
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-4">Consolidated Rating</p>
                                    <div className="text-6xl font-bold text-slate-900 tracking-tighter">A<span className="text-indigo-600">+</span></div>
                                    <p className="text-[11px] text-slate-500 font-medium mt-4">Based on 14 assessment criteria.</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === "history" && (
                         <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">Target Universities</h2>
                            </div>
                            
                            <div className="bg-white border text-sm border-greys-200 shadow-sm rounded-lg overflow-hidden p-6">
                                <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-4">Selected Universities</h3>
                                {targetSchoolsArr.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {targetSchoolsArr.map((school: string, i: number) => (
                                            <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-700">
                                                {school}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 italic">No universities selected yet.</p>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {activeTab === "management" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                             <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-900">Account Management</h2>
                            </div>
                            
                            <div className="bg-white border border-greys-200 shadow-sm rounded-lg overflow-hidden">
                                <div className="p-5 border-b border-greys-100 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                     <div>
                                        <p className="text-sm font-semibold text-slate-900">Account Access</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Toggle whether the student can log in and use systems.</p>
                                    </div>
                                    <Button 
                                        variant="outline"
                                        onClick={() => updateStatusMutation.mutate(student.activationStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                                        className={cn(
                                            "h-8 px-4 text-xs font-medium bg-white shadow-sm transition-all",
                                            student.activationStatus === "ACTIVE" 
                                                ? "text-error-600 border-error-200 hover:bg-error-50" 
                                                : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                        )}
                                    >
                                        {student.activationStatus === "ACTIVE" ? "Suspend Access" : "Reinstate Access"}
                                    </Button>
                                </div>
                                <div className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                     <div>
                                        <p className="text-sm font-semibold text-slate-900 italic">Remove Account</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Permanently remove this student account from the platform.</p>
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        onClick={() => {
                                            if (confirm("Are you sure you want to permanently remove this student account? This action cannot be undone.")) {
                                                deleteStudentMutation.mutate();
                                            }
                                        }}
                                        disabled={deleteStudentMutation.isPending}
                                        className="h-8 px-4 text-xs font-medium border-greys-200 text-slate-400 hover:text-error-600 hover:bg-error-50 hover:border-error-200 bg-white shadow-sm transition-colors"
                                    >
                                        {deleteStudentMutation.isPending && <Loader2 className="h-3 w-3 mr-2 animate-spin" />}
                                        Remove Account
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Context Meta Info Column */}
                <div className="w-full xl:w-64 shrink-0 space-y-6 hidden lg:block">
                    <div>
                        <h3 className="text-[12px] font-semibold text-slate-900 mb-3 uppercase tracking-wider">Linked Accounts</h3>
                        <div className="bg-white border border-greys-200 rounded-lg overflow-hidden text-sm shadow-sm">
                            <div className="flex flex-col p-4 border-b border-greys-100 hover:bg-slate-50 transition-colors group cursor-pointer text-left">
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Assigned Mentor</span>
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-slate-900 group-hover:text-indigo-600">Pending Assignment</span>
                                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-indigo-600" />
                                </div>
                            </div>
                            <div className="flex flex-col p-4 hover:bg-slate-50 transition-colors group cursor-pointer text-left">
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Learning Pathway</span>
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-slate-900 group-hover:text-indigo-600">Standard Pathway</span>
                                    <LinkIcon className="h-3.5 w-3.5 text-slate-300 group-hover:text-indigo-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[12px] font-semibold text-slate-900 mb-3 uppercase tracking-wider">Account Information</h3>
                        <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">Profile data is synchronised with the central student registry.</p>
                        <div className="flex items-center justify-between border border-greys-200 bg-slate-50 px-3 py-2.5 rounded-lg text-xs">
                            <span className="flex items-center gap-2 font-medium text-slate-700">
                                <Database className="h-3.5 w-3.5 text-slate-400" /> core/students
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
