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
    ArrowRight,
    Trash2,
    ShieldX
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
import { CreateUserModal } from "./create-user-modal";
import { cn } from "@/src/lib/utils";

export function StudentTable() {
    const router = useRouter();
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
        onError: (_err, _newStatus, context: { previousData?: PaginatedResponse<StudentRecord> } | undefined) => {
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

    const deleteStudentMutation = useMutation({
        mutationFn: (id: string) => adminService.deleteStudent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-students"] });
            toast.success("Student account permanently deleted");
        },
        onError: (error: any) => {
            const diag = error?.headers?.['x-handled-locally'] ? '[LOCAL]' : 
                        error?.headers?.['x-proxied-to-java-fallback'] ? '[FALLBACK]' : '';
            const msg = `${diag} ${error?.message || error?.responseMessage || "Failed to delete student account"}`;
            toast.error(msg.trim());
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
            {/* ── Student Community Header ── */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-greys-300 flex flex-col xl:flex-row gap-8 justify-between items-center relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 h-48 w-48 bg-indigo-50 rounded-bl-full opacity-40 pointer-events-none" />
                
                <div className="relative z-10 space-y-3 w-full xl:w-auto">
                    <div>
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200 px-4 py-1.5 font-extrabold text-[11px] tracking-[0.3em] rounded-full uppercase mb-3 leading-none inline-flex font-jakarta">
                            User Directory
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-semibold text-text-heading tracking-tight font-jakarta leading-tight">Student <span className="text-indigo-600">Community</span></h2>
                    </div>
                    <div className="flex items-center gap-4 text-greys-500 font-medium font-jakarta">
                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                            <Layers className="w-3.5 h-3.5" />
                            Management Engine
                        </p>
                        <div className="h-1 w-1 rounded-full bg-greys-300" />
                        <p className="text-[10px] font-bold text-greys-400 uppercase tracking-widest">
                            {data?.totalElements || 0} Registered Members
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto relative z-10">
                    <div className="relative group flex-1 xl:flex-none">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-greys-300 group-focus-within:text-indigo-600 transition-colors" />
                        <Input
                            placeholder="Find student by name, email or SID..."
                            className="pl-14 pr-8 h-12 w-full xl:w-[400px] bg-greys-100 border-greys-300 text-text-heading placeholder:text-greys-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600/50 rounded-2xl transition-all font-medium text-sm font-jakarta"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 shrink-0">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="h-12 px-6 rounded-2xl border-greys-300 bg-white font-bold text-[11px] uppercase tracking-widest gap-2 shadow-sm hover:shadow-md transition-all font-jakarta">
                                    <Filter className="h-4 w-4 text-greys-400" />
                                    Filter
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-greys-300 shadow-2xl font-jakarta">
                                <DropdownMenuLabel className="text-[10px] font-extrabold uppercase tracking-widest text-greys-400 px-3 py-2">Account Status</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-greys-50" />
                                <DropdownMenuItem className="rounded-xl font-bold text-xs uppercase tracking-widest p-3" onClick={() => setQuery(prev => ({ ...prev, platformMemberProfileStatus: "", page: 0 }))}>All Residents</DropdownMenuItem>
                                <DropdownMenuItem className="rounded-xl font-bold text-xs uppercase tracking-widest p-3 text-emerald-600" onClick={() => setQuery(prev => ({ ...prev, platformMemberProfileStatus: "ACTIVE", page: 0 }))}>Active Members</DropdownMenuItem>
                                <DropdownMenuItem className="rounded-xl font-bold text-xs uppercase tracking-widest p-3 text-rose-600" onClick={() => setQuery(prev => ({ ...prev, platformMemberProfileStatus: "INACTIVE", page: 0 }))}>Inactive Accounts</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white h-12 px-8 rounded-2xl shadow-lg shadow-indigo-100 gap-2 font-bold text-[11px] uppercase tracking-widest active:scale-95 transition-all font-jakarta leading-none"
                        >
                            <UserPlus className="h-4 w-4" />
                            Direct Create
                        </Button>
                    </div>
                </div>
            </div>

            {/* Premium Interactive Table */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/40 border border-gray-50 overflow-hidden">
                <div className="overflow-x-auto overflow-y-hidden">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-greys-100/50">
                                <th className="pl-12 pr-6 py-5 text-[10px] font-bold text-greys-400 uppercase tracking-[0.2em] font-jakarta">Student Identity</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-greys-400 uppercase tracking-[0.2em] font-jakarta">System ID</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-greys-400 uppercase tracking-[0.2em] font-jakarta">Gateway</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-greys-400 uppercase tracking-[0.2em] font-jakarta">Billing</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-greys-400 uppercase tracking-[0.2em] font-jakarta">Status</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-greys-400 uppercase tracking-[0.2em] font-jakarta">Registered</th>
                                <th className="pr-12 pl-6 py-5 text-[10px] font-bold text-greys-400 uppercase tracking-[0.2em] font-jakarta text-right">Context</th>
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
                                        className="group cursor-pointer hover:bg-indigo-50/20 transition-all duration-300 relative"
                                    >
                                        <td className="pl-12 pr-6 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-white border border-greys-300 flex items-center justify-center text-indigo-600 font-extrabold text-[11px] shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                                    {(student.firstName?.[0] || "")}{(student.lastName?.[0] || "")}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-text-heading group-hover:text-indigo-600 transition-colors tracking-tight mb-0.5 font-jakarta">
                                                        {student.firstName} {student.lastName}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-greys-400 truncate tracking-widest uppercase italic font-jakarta">{student.emailAddress}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-jakarta">
                                            <div className="flex items-center gap-2">
                                                <Hash className="h-3 w-3 text-greys-300" />
                                                <span className="text-[10px] font-bold text-greys-500 font-mono tracking-tighter bg-greys-100 px-2 py-1 rounded-lg border border-greys-300 uppercase">{student.sid}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-jakarta">
                                            <Badge variant="outline" className="bg-white text-greys-500 border-greys-300 px-3 py-1 font-bold text-[10px] tracking-widest uppercase rounded-xl group-hover:border-indigo-200 group-hover:text-indigo-700 transition-colors">
                                                {student.dentalSchoolGateway || "BDS"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-6 font-jakarta">
                                            <div className="flex items-center gap-2">
                                                {student.paymentStatus === "PAID" ? (
                                                    <div className="flex items-center gap-2 text-indigo-600">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest italic">Elite Hub</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-greys-400">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-greys-300" />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest italic">Community</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-jakarta">
                                            {getStatusBadge(student.activationStatus)}
                                        </td>
                                        <td className="px-6 py-6 font-jakarta">
                                            <div className="flex items-center gap-2 text-greys-400">
                                                <Calendar className="h-3 w-3" />
                                                <span className="text-[11px] font-bold text-greys-500 tracking-tight">{new Date(student.dateStamped).toLocaleDateString("en-GB")}</span>
                                            </div>
                                        </td>
                                        <td className="pr-12 pl-6 py-6 text-right font-jakarta" onClick={(e) => e.stopPropagation()}>
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
                                                        className="rounded-xl font-bold text-sm text-amber-600 focus:bg-amber-50 focus:text-amber-700 gap-2"
                                                    >
                                                        <ShieldX className="w-4 h-4" />
                                                        Revoke Access
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        onClick={() => {
                                                            if (confirm("Are you sure you want to PERMANENTLY delete this student? This action cannot be undone.")) {
                                                                deleteStudentMutation.mutate(student.sid);
                                                            }
                                                        }} 
                                                        className="rounded-xl font-bold text-sm text-rose-600 focus:bg-rose-50 focus:text-rose-700 gap-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete Account
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
            <CreateUserModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
}
