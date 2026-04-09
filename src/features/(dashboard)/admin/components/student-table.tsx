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
    UserPlus,
    Calendar,
    Hash,
    Layers,
    CreditCard,
    ArrowRight
} from "lucide-react";
import { adminService } from "@/src/connection/admin-service";
import { StudentQuery, PaginatedResponse, StudentRecord } from "@/src/connection/api-types";
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
import { InviteStudentModal } from "./invite-student-modal";
import { cn } from "@/src/lib/utils";

export function StudentTable() {
    const router = useRouter();
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const [query, setQuery] = useState<StudentQuery>({
        page: 0,
        perPage: 10,
        searchKey: "",
        platformMemberCategory: "",
        platformMemberProfileStatus: ""
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
        queryKey: ["admin-students", query],
        queryFn: () => adminService.getStudentRecords(query),
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            adminService.updateStudentStatus(id, { status }),
        onMutate: async ({ id, status }) => {
            await queryClient.cancelQueries({ queryKey: ["admin-students", query] });
            const previousData = queryClient.getQueryData<PaginatedResponse<StudentRecord>>(["admin-students", query]);
            if (previousData) {
                queryClient.setQueryData(["admin-students", query], {
                    ...previousData,
                    content: previousData.content.map(student =>
                        student.sid === id ? { ...student, activationStatus: status } : student
                    )
                });
            }
            return { previousData };
        },
        onError: (_err, _newStatus, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(["admin-students", query], context.previousData);
            }
            toast.error("Failed to update student status");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-students"] });
        },
        onSuccess: () => {
            toast.success("Student status updated successfully");
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
            PENDING: "bg-amber-50 text-amber-700 ring-1 ring-amber-500/20",
        };
        return (
            <Badge className={cn("px-3 py-1 border-none font-extrabold text-[10px] uppercase tracking-widest", config[s] || "bg-blue-50 text-blue-700 ring-1 ring-blue-500/20")}>
                {status}
            </Badge>
        );
    };

    const students = data?.content || [];
    const totalPages = data?.totalPages || 0;
    const currentPage = data?.pageNumber || 0;

    return (
        <div className="space-y-6">
            {/* Contextual Header */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row gap-6 justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 h-32 w-32 bg-primary-50 rounded-bl-full opacity-50" />
                
                <div className="relative z-10 space-y-1 w-full md:w-auto">
                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Student Community</h2>
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5" />
                        Management Engine
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto relative z-10">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                        <Input
                            placeholder="Find student by name, email or SID..."
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
                                    Advanced Filters
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-gray-100 shadow-2xl">
                                <DropdownMenuLabel className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 px-3 py-2">Account Status</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-gray-50" />
                                <DropdownMenuItem className="rounded-xl font-bold text-sm" onClick={() => setQuery(prev => ({ ...prev, platformMemberProfileStatus: "", page: 0 }))}>All Residents</DropdownMenuItem>
                                <DropdownMenuItem className="rounded-xl font-bold text-sm text-emerald-600" onClick={() => setQuery(prev => ({ ...prev, platformMemberProfileStatus: "ACTIVE", page: 0 }))}>Active Members</DropdownMenuItem>
                                <DropdownMenuItem className="rounded-xl font-bold text-sm text-rose-600" onClick={() => setQuery(prev => ({ ...prev, platformMemberProfileStatus: "INACTIVE", page: 0 }))}>Inactive Accounts</DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-gray-50" />
                                <DropdownMenuLabel className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 px-3 py-2">Billing State</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-gray-50" />
                                <DropdownMenuItem className="rounded-xl font-bold text-sm" onClick={() => setQuery(prev => ({ ...prev, paymentStatus: undefined, page: 0 }))}>All Billing</DropdownMenuItem>
                                <DropdownMenuItem className="rounded-xl font-bold text-sm text-blue-600" onClick={() => setQuery(prev => ({ ...prev, paymentStatus: "PAID", page: 0 }))}>Paid Licenses</DropdownMenuItem>
                                <DropdownMenuItem className="rounded-xl font-bold text-sm" onClick={() => setQuery(prev => ({ ...prev, paymentStatus: "FREE", page: 0 }))}>Community Tier</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button
                            onClick={() => setIsInviteModalOpen(true)}
                            className="bg-slate-900 hover:bg-black text-white h-12 px-6 rounded-2xl shadow-xl shadow-black/10 gap-2 font-bold text-xs active:scale-95 transition-all"
                        >
                            <UserPlus className="h-4 w-4" />
                            Invite Member
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
                                <th className="pl-10 pr-6 py-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Student Identity</th>
                                <th className="px-6 py-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">System ID</th>
                                <th className="px-6 py-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Gateway</th>
                                <th className="px-6 py-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Billing</th>
                                <th className="px-6 py-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Status</th>
                                <th className="px-6 py-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Registered</th>
                                <th className="pr-10 pl-6 py-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-right">Context</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="relative">
                                                <div className="h-16 w-16 rounded-full border-t-2 border-b-2 border-primary-600 animate-spin" />
                                                <Layers className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary-600 animate-pulse" />
                                            </div>
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Syncing Platform Members...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-32 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-4 bg-gray-50 rounded-full mb-2">
                                                <Search className="h-8 w-8 text-gray-300" />
                                            </div>
                                            <p className="text-gray-900 font-extrabold tracking-tight text-xl">No Members Found</p>
                                            <p className="text-gray-400 font-medium text-sm">Adjust your filters to see more of the community.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                students.map((student) => (
                                    <tr 
                                        key={student.sid} 
                                        onClick={() => router.push(`/admin/students/${encodeURIComponent(student.sid)}`)}
                                        className="group cursor-pointer hover:bg-gray-50[0.02] hover:bg-slate-50/50 transition-all duration-300 relative"
                                    >
                                        <td className="pl-10 pr-6 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-extrabold text-sm shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                                    {(student.firstName?.[0] || "")}{(student.lastName?.[0] || "")}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-extrabold text-gray-900 group-hover:text-primary-600 transition-colors leading-tight mb-0.5">
                                                        {student.firstName} {student.lastName}
                                                    </p>
                                                    <p className="text-[11px] font-bold text-gray-400 truncate tracking-tight">{student.emailAddress}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2">
                                                <Hash className="h-3 w-3 text-gray-300" />
                                                <span className="text-xs font-extrabold text-slate-500 font-mono tracking-tighter bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">{student.sid}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <Badge variant="outline" className="bg-white text-gray-500 border-gray-100 px-3 py-1 font-bold text-[10px] tracking-tight rounded-xl group-hover:border-primary-200 group-hover:text-primary-700 transition-colors">
                                                {student.dentalSchoolGateway || "BDS"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2">
                                                {student.paymentStatus === "PAID" ? (
                                                    <div className="flex items-center gap-2 text-blue-600">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                                        <span className="text-[10px] font-extrabold uppercase tracking-widest italic">Tier 1 Elite</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                                                        <span className="text-[10px] font-extrabold uppercase tracking-widest italic">Community</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            {getStatusBadge(student.activationStatus)}
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span className="text-xs font-bold text-gray-500">{new Date(student.dateStamped).toLocaleDateString("en-GB")}</span>
                                            </div>
                                        </td>
                                        <td className="pr-10 pl-6 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-black hover:bg-white rounded-xl transition-all">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-gray-100 shadow-2xl">
                                                    <DropdownMenuLabel className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 px-3 py-2">Quick Commands</DropdownMenuLabel>
                                                    <DropdownMenuSeparator className="bg-gray-50" />
                                                    <DropdownMenuItem className="rounded-xl font-bold text-sm gap-2" onClick={() => router.push(`/admin/students/${encodeURIComponent(student.sid)}`)}>
                                                        <ArrowRight className="w-4 h-4 text-primary-500" />
                                                        Go to Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-xl font-bold text-sm" onClick={() => updateStatusMutation.mutate({ id: student.sid, status: "ACTIVE" })}>
                                                        Verify Activation
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-gray-50" />
                                                    <DropdownMenuItem 
                                                        onClick={() => updateStatusMutation.mutate({ id: student.sid, status: "INACTIVE" })} 
                                                        className="rounded-xl font-bold text-sm text-rose-600 focus:bg-rose-50 focus:text-rose-700"
                                                    >
                                                        Revoke Access
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
                    <div className="px-10 py-8 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gray-50/20">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100">
                                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                                    Displaying <span className="text-gray-900">{(currentPage * query.perPage!) + 1}—{Math.min((currentPage + 1) * query.perPage!, data?.totalElements || 0)}</span> of <span className="text-gray-900">{data?.totalElements}</span> Elite Members
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 0}
                                onClick={() => handlePageChange(currentPage - 1)}
                                className="h-10 px-4 rounded-xl border-gray-100 bg-white hover:bg-gray-50 shadow-sm transition-all text-xs font-bold gap-2"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <div className="flex items-center gap-2 px-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                <span className="text-xs font-extrabold text-primary-600">{currentPage + 1}</span>
                                <span className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest">of {totalPages}</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage >= totalPages - 1}
                                onClick={() => handlePageChange(currentPage + 1)}
                                className="h-10 px-4 rounded-xl border-gray-100 bg-white hover:bg-gray-50 shadow-sm transition-all text-xs font-bold gap-2"
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            {/* Contextual Modals */}
            <InviteStudentModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
            />
        </div>
    );
}
