"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Loader2,
    UserCheck,
    Calendar,
    Hash,
    ShieldCheck,
    ArrowRight,
    Award
} from "lucide-react";
import { adminService } from "@/src/connection/admin-service";
import { MentorQuery, PaginatedResponse, MentorRecord } from "@/src/connection/api-types";
import { useSearch } from "@/src/hooks/use-search";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from "@/src/components/ui/dropdown-menu";
import { Badge } from "@/src/components/ui/badge";
import { toast } from "sonner";
import { InviteMentorModal } from "./invite-mentor-modal";
import { cn } from "@/src/lib/utils";

export function MentorTable() {
    const router = useRouter();
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const [query, setQuery] = useState<MentorQuery>({
        page: 0,
        perPage: 10,
        searchKey: "",
        platformMemberCategory: "",
        platformMemberProfileStatus: "",
        verified: undefined
    });

    const handleSearch = useCallback((val: string) => {
        setQuery(prev => ({ ...prev, searchKey: val, page: 0 }));
    }, []);

    const {
        value: searchInput,
        setValue: setSearchInput,
    } = useSearch({
        paramName: "searchKey",
        onSearch: handleSearch
    });

    const { data, isLoading } = useQuery({
        queryKey: ["admin-mentors", query],
        queryFn: () => adminService.getMentorRecords(query),
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            adminService.updateMentorStatus(id, { status }),
        onMutate: async ({ id, status }) => {
            await queryClient.cancelQueries({ queryKey: ["admin-mentors", query] });
            const previousData = queryClient.getQueryData<PaginatedResponse<MentorRecord>>(["admin-mentors", query]);
            if (previousData) {
                queryClient.setQueryData(["admin-mentors", query], {
                    ...previousData,
                    content: previousData.content.map(mentor =>
                        mentor.hid === id ? { ...mentor, activationStatus: status } : mentor
                    )
                });
            }
            return { previousData };
        },
        onError: (_err, _newStatus, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(["admin-mentors", query], context.previousData);
            }
            toast.error("Failed to update mentor status");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-mentors"] });
        },
        onSuccess: () => {
            toast.success("Mentor status updated successfully");
        }
    });

    const verifyMentorMutation = useMutation({
        mutationFn: ({ id, verify }: { id: string; verify: boolean }) =>
            adminService.verifyMentor(id, { verify }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-mentors"] });
            toast.success("Mentor verification updated successfully");
        },
        onError: () => {
            toast.error("Failed to update mentor verification");
        }
    });

    const handlePageChange = (newPage: number) => {
        setQuery(prev => ({ ...prev, page: newPage }));
    };

    const getStatusBadge = (status: string) => {
        const s = status.toUpperCase();
        const config: Record<string, string> = {
            ACTIVE: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20",
            INACTIVE: "bg-slate-50 text-slate-700 ring-1 ring-slate-500/20",
            SUSPENDED: "bg-rose-50 text-rose-700 ring-1 ring-rose-500/20",
        };
        return (
            <Badge className={cn("px-3 py-1 border-none font-black text-[10px] uppercase tracking-widest", config[s] || "bg-blue-50 text-blue-700 ring-1 ring-blue-500/20")}>
                {status}
            </Badge>
        );
    };

    const mentors = data?.content || [];
    const totalPages = data?.totalPages || 0;
    const currentPage = data?.pageNumber || 0;

    return (
        <div className="space-y-6">
            {/* Contextual Header */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row gap-6 justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 h-32 w-32 bg-secondary-50 rounded-bl-full opacity-50" />
                
                <div className="relative z-10 space-y-1 w-full md:w-auto">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Professional Mentors</h2>
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Award className="w-3.5 h-3.5" />
                        Vetting Command
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto relative z-10">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                        <Input
                            placeholder="Find mentor by name, email or HID..."
                            className="pl-12 pr-6 h-12 w-full md:w-[400px] bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 rounded-2xl transition-all font-medium text-sm"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="h-12 px-6 rounded-2xl border-gray-100 bg-white font-bold text-xs gap-2 shadow-sm hover:shadow-md transition-all">
                                    <Filter className="h-4 w-4 text-gray-400" />
                                    Filter View
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-gray-100 shadow-2xl">
                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-3 py-2">Verification</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-gray-50" />
                                <DropdownMenuItem className="rounded-xl font-bold text-sm" onClick={() => setQuery(prev => ({ ...prev, verified: undefined, page: 0 }))}>All Registries</DropdownMenuItem>
                                <DropdownMenuItem className="rounded-xl font-bold text-sm text-emerald-600" onClick={() => setQuery(prev => ({ ...prev, verified: true, page: 0 }))}>Verified Mentors</DropdownMenuItem>
                                <DropdownMenuItem className="rounded-xl font-bold text-sm text-amber-600" onClick={() => setQuery(prev => ({ ...prev, verified: false, page: 0 }))}>Pending Vetting</DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-gray-50" />
                                <DropdownMenuItem 
                                    className="rounded-xl font-black text-xs text-slate-900 bg-slate-50 uppercase tracking-widest"
                                    onClick={() => setQuery(prev => ({ ...prev, platformMemberProfileStatus: "INACTIVE", verified: false, page: 0 }))}
                                >
                                    Action Required
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button
                            onClick={() => setIsInviteModalOpen(true)}
                            className="bg-primary-600 hover:bg-primary-700 text-white h-12 px-6 rounded-2xl shadow-xl shadow-primary-500/10 gap-2 font-bold text-xs active:scale-95 transition-all"
                        >
                            <UserCheck className="h-4 w-4" />
                            Invite Mentor
                        </Button>
                    </div>
                </div>
            </div>

            {/* Premium Interactive Table */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/40 border border-gray-50 overflow-hidden">
                <div className="overflow-x-auto overflow-y-hidden">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-gray-50/30">
                                <th className="pl-10 pr-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Mentor Identity</th>
                                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Handled ID</th>
                                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Expertise</th>
                                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Vetting</th>
                                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Status</th>
                                <th className="pr-10 pl-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-right">Context</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="relative">
                                                <div className="h-16 w-16 rounded-full border-t-2 border-b-2 border-secondary-600 animate-spin" />
                                                <Award className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-secondary-600 animate-pulse" />
                                            </div>
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Accessing Mentor Registry...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : mentors.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-32 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-4 bg-gray-50 rounded-full mb-2">
                                                <Search className="h-8 w-8 text-gray-300" />
                                            </div>
                                            <p className="text-gray-900 font-black tracking-tight text-xl">No Mentors Found</p>
                                            <p className="text-gray-400 font-medium text-sm">Expand your search to find more professionals.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                mentors.map((mentor) => (
                                    <tr 
                                        key={mentor.hid} 
                                        onClick={() => router.push(`/admin/mentors/${encodeURIComponent(mentor.hid)}`)}
                                        className="group cursor-pointer hover:bg-slate-50/50 transition-all duration-300 relative"
                                    >
                                        <td className="pl-10 pr-6 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-black text-sm shadow-sm group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                                                    {mentor.mentorName?.[0] || "?"}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-black text-gray-900 group-hover:text-primary-600 transition-colors leading-tight mb-0.5">
                                                        {mentor.mentorName}
                                                    </p>
                                                    <p className="text-[11px] font-bold text-gray-400 tracking-tight italic">Member since {new Date(mentor.dateStamped).toLocaleDateString("en-GB")}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2">
                                                <Hash className="h-3 w-3 text-gray-300" />
                                                <span className="text-xs font-black text-slate-500 font-mono tracking-tighter bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">{mentor.hid}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-sm text-gray-600">
                                            <Badge variant="outline" className="bg-white text-emerald-600 border-emerald-100 px-3 py-1 font-bold text-[10px] tracking-tight rounded-xl group-hover:bg-emerald-50 transition-colors uppercase">
                                                {mentor.dentalSchoolGateway || "General Dentistry"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-6">
                                            {mentor.verified ? (
                                                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50/50 px-3 py-1.5 rounded-full ring-1 ring-emerald-500/20 w-fit">
                                                    <ShieldCheck className="h-3.5 w-3.5 shadow-sm" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Verified Expert</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full ring-1 ring-gray-500/10 w-fit italic">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-gray-300 animate-pulse" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Pending Vetting</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-6">
                                            {getStatusBadge(mentor.activationStatus)}
                                        </td>
                                        <td className="pr-10 pl-6 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-black hover:bg-white rounded-xl transition-all">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-gray-100 shadow-2xl">
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-3 py-2">Management</DropdownMenuLabel>
                                                    <DropdownMenuSeparator className="bg-gray-50" />
                                                    <DropdownMenuItem className="rounded-xl font-bold text-sm gap-2" onClick={() => router.push(`/admin/mentors/${encodeURIComponent(mentor.hid)}`)}>
                                                        <ArrowRight className="w-4 h-4 text-emerald-500" />
                                                        Explore Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-xl font-bold text-sm" onClick={() => verifyMentorMutation.mutate({ id: mentor.hid, verify: !mentor.verified })}>
                                                        {mentor.verified ? "Revoke Verification" : "Authorize Expert"}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-gray-50" />
                                                    <DropdownMenuItem 
                                                        onClick={() => updateStatusMutation.mutate({ id: mentor.hid, status: "INACTIVE" })} 
                                                        className="rounded-xl font-bold text-sm text-rose-600 focus:bg-rose-50"
                                                    >
                                                        Terminate Access
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Intelligent Pagination */}
                {totalPages > 1 && (
                    <div className="px-10 py-8 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gray-50/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-50">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Displaying <span className="text-gray-900">{(currentPage * query.perPage!) + 1}—{Math.min((currentPage + 1) * query.perPage!, data?.totalElements || 0)}</span> Professional Experts
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 0}
                                onClick={() => handlePageChange(currentPage - 1)}
                                className="h-10 px-4 rounded-xl border-gray-100 bg-white hover:bg-gray-50 shadow-sm transition-all text-xs font-bold"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center gap-2 px-6 bg-slate-900 rounded-xl border border-slate-800 shadow-xl">
                                <span className="text-xs font-black text-white">{currentPage + 1}</span>
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1">/</span>
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{totalPages}</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage >= totalPages - 1}
                                onClick={() => handlePageChange(currentPage + 1)}
                                className="h-10 px-4 rounded-xl border-gray-100 bg-white hover:bg-gray-50 shadow-sm transition-all text-xs font-bold"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            {/* Contextual Modals */}
            <InviteMentorModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
            />
        </div>
    );
}
