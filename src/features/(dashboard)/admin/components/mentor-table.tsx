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
    RefreshCw,
    UserCheck,
    Calendar,
    Hash,
    ShieldCheck,
    ArrowRight,
    Award,
    Trash2,
    ShieldX
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
import { CreateUserModal } from "./create-user-modal";
import { cn } from "@/src/lib/utils";

export function MentorTable() {
    const router = useRouter();
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
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

    const { data, isLoading, isError } = useQuery({
        queryKey: ["admin-mentors", query],
        queryFn: () => adminService.getMentorRecords(query),
        retry: 1,
    });

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const res = await fetch("/api/admin/seed-students", {
                method: "POST",
                headers: { Authorization: "Bearer dentispark-seed" },
            });
            const json = await res.json();
            if (res.ok) {
                toast.success(`Sync complete — ${json.totalMentorsSeeded ?? 0} mentors imported.`);
                queryClient.invalidateQueries({ queryKey: ["admin-mentors"] });
            } else {
                toast.error("Sync failed. Check server logs.");
            }
        } catch (e) {
            toast.error("Sync request failed.");
        } finally {
            setIsSyncing(false);
        }
    };

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

    const deleteMentorMutation = useMutation({
        mutationFn: (id: string) => adminService.deleteMentor(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-mentors"] });
            toast.success("Mentor account permanently deleted");
        },
        onError: (error: any) => {
            const diag = error?.headers?.['x-handled-locally'] ? '[LOCAL]' : 
                        error?.headers?.['x-proxied-to-java-fallback'] ? '[FALLBACK]' : '';
            const msg = `${diag} ${error?.message || error?.responseMessage || "Failed to delete mentor account"}`;
            toast.error(msg.trim());
        }
    });

    const verifyMentorMutation = useMutation({
        mutationFn: ({ id, verify }: { id: string; verify: boolean }) =>
            adminService.verifyMentor(id, { verify }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-mentors"] });
            toast.success("Mentor verification updated successfully");
        },
        onError: (error: any) => {
            const diag = error?.headers?.['x-handled-locally'] ? '[LOCAL]' : 
                        error?.headers?.['x-proxied-to-java-fallback'] ? '[FALLBACK]' : '';
            const msg = `${diag} ${error?.message || error?.responseMessage || "Failed to update mentor verification"}`;
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
        };
        return (
            <Badge className={cn("px-3 py-1 border-none font-extrabold text-[10px] uppercase tracking-widest", config[s] || "bg-blue-50 text-blue-700 ring-1 ring-blue-500/20")}>
                {status}
            </Badge>
        );
    };

    const mentors = data?.content || [];
    const totalPages = data?.totalPages || 0;
    const currentPage = data?.pageNumber || 0;

    const needsSync = (data as any)?.needsSync === true;

    return (
        <div className="space-y-4 pb-20 font-sans">
            {/* WordPress Style Header */}
            <div className="flex items-center gap-4 mb-2 mt-4">
                <h1 className="text-2xl font-normal text-slate-800">Mentors</h1>
                <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 px-3 text-xs border-teal-600 text-teal-600 font-medium hover:bg-teal-50"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    Add New Mentor
                </Button>
            </div>

            {/* Sync Banner */}
            {(needsSync || isError) && (
                <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-md px-4 py-3 text-sm">
                    <div className="flex items-center gap-2 text-amber-800">
                        <RefreshCw className="h-4 w-4 text-amber-600" />
                        <span>
                            {isError 
                                ? "Could not load mentors. Click Sync to import from the legacy system."
                                : "No local mentor data found. Sync once to import all mentors from the legacy system."}
                        </span>
                    </div>
                    <Button 
                        size="sm"
                        disabled={isSyncing}
                        onClick={handleSync}
                        className="h-7 px-3 text-xs bg-amber-600 hover:bg-amber-700 text-white border-0 ml-4"
                    >
                        {isSyncing ? (
                            <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Syncing…</>
                        ) : (
                            <><RefreshCw className="h-3 w-3 mr-1" /> Sync from Java</>
                        )}
                    </Button>
                </div>
            )}

            {/* Sub Nav */}
            <div className="flex gap-3 text-[13px] text-slate-500 mb-4">
                <span 
                    className={cn("cursor-pointer", query.verified === undefined ? "font-semibold text-slate-800" : "text-teal-600 hover:underline")}
                    onClick={() => setQuery(prev => ({ ...prev, verified: undefined, page: 0 }))}
                >
                    All <span className="text-slate-500 font-normal">({query.verified === undefined ? data?.totalElements || 0 : ''})</span>
                </span> | 
                <span 
                    className={cn("cursor-pointer", query.verified === true ? "font-semibold text-slate-800" : "text-teal-600 hover:underline")}
                    onClick={() => setQuery(prev => ({ ...prev, verified: true, page: 0 }))}
                >
                    Verified
                </span> | 
                <span 
                    className={cn("cursor-pointer", query.verified === false ? "font-semibold text-slate-800" : "text-teal-600 hover:underline")}
                    onClick={() => setQuery(prev => ({ ...prev, verified: false, page: 0 }))}
                >
                    Pending
                </span>
            </div>

            {/* Top Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-2 gap-4">
                <div className="flex items-center gap-2">
                    <select className="text-[13px] border-slate-400 rounded-sm px-2 py-1 bg-white h-8 w-32 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-slate-700">
                        <option>Bulk actions</option>
                        <option value="delete">Delete</option>
                    </select>
                    <Button variant="outline" className="h-8 px-3 text-xs border-slate-400 text-slate-700 bg-slate-50 hover:bg-white rounded-sm">Apply</Button>
                </div>
                <div className="flex items-center gap-2">
                    <Input 
                        placeholder="" 
                        className="h-8 w-48 text-[13px] rounded-sm border-slate-400 focus:border-teal-500"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <Button variant="outline" className="h-8 px-3 text-xs border-slate-400 text-slate-700 bg-slate-50 hover:bg-white rounded-sm">Search Users</Button>
                </div>
            </div>

            {/* WordPress Style Table */}
            <div className="bg-white border border-slate-300 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-[13px] text-slate-700 border-collapse">
                        <thead>
                            <tr className="border-b border-slate-300 bg-slate-50 text-slate-800">
                                <th className="w-10 py-2 px-3 text-center border-r border-slate-200">
                                    <input type="checkbox" className="rounded-sm border-slate-400" />
                                </th>
                                <th className="py-2 px-3 font-semibold">System ID</th>
                                <th className="py-2 px-3 font-semibold">Name</th>
                                <th className="py-2 px-3 font-semibold">Gateway</th>
                                <th className="py-2 px-3 font-semibold">Verified</th>
                                <th className="py-2 px-3 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={`skeleton-${i}`} className="animate-pulse bg-white">
                                        <td className="py-3 px-3 border-r border-slate-100"></td>
                                        <td className="py-3 px-3"><div className="h-4 w-24 bg-slate-200 rounded" /></td>
                                        <td className="py-3 px-3"><div className="h-4 w-40 bg-slate-200 rounded" /></td>
                                        <td className="py-3 px-3"><div className="h-4 w-32 bg-slate-200 rounded" /></td>
                                        <td className="py-3 px-3"><div className="h-4 w-16 bg-slate-200 rounded" /></td>
                                        <td className="py-3 px-3"><div className="h-4 w-16 bg-slate-200 rounded" /></td>
                                    </tr>
                                ))
                            ) : mentors.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 px-4 text-center text-slate-500">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                mentors.map((mentor, idx) => (
                                    <tr 
                                        key={mentor.hid}
                                        className={cn(
                                            "group transition-colors",
                                            idx % 2 === 0 ? "bg-white" : "bg-[#f9f9f9]"
                                        )}
                                    >
                                        <td className="w-10 py-3 px-3 text-center align-top border-r border-slate-100">
                                            <input type="checkbox" className="rounded-sm border-slate-400 mt-1" />
                                        </td>
                                        <td className="py-3 px-3 align-top">
                                            <div className="flex items-start gap-3">
                                                <div className="h-8 w-8 rounded-sm bg-slate-100 flex flex-shrink-0 items-center justify-center text-slate-600 font-bold text-xs mt-0.5">
                                                    {mentor.mentorName?.[0] || "?"}
                                                </div>
                                                <div className="flex flex-col">
                                                    <strong className="text-teal-700 text-[14px]">{mentor.hid}</strong>
                                                    <div className="flex flex-wrap gap-2 text-xs mt-1 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity min-h-[16px]">
                                                        <button 
                                                            onClick={() => router.push(`/admin/mentors/${encodeURIComponent(mentor.hid)}`)}
                                                            className="text-teal-600 hover:text-teal-800 hover:underline focus:opacity-100"
                                                        >
                                                            Edit
                                                        </button>
                                                        <span>|</span>
                                                        <button 
                                                            onClick={() => {
                                                                if (confirm("Are you sure you want to PERMANENTLY delete this mentor? This action cannot be undone.")) {
                                                                    deleteMentorMutation.mutate(mentor.hid);
                                                                }
                                                            }}
                                                            className="text-rose-600 hover:text-rose-800 hover:underline focus:opacity-100"
                                                        >
                                                            Delete
                                                        </button>
                                                        <span>|</span>
                                                        <button 
                                                            onClick={() => router.push(`/admin/mentors/${encodeURIComponent(mentor.hid)}`)}
                                                            className="text-teal-600 hover:text-teal-800 hover:underline focus:opacity-100"
                                                        >
                                                            View
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-3 align-top text-slate-700">
                                            {mentor.mentorName}
                                        </td>
                                        <td className="py-3 px-3 align-top text-slate-700">
                                            {mentor.dentalSchoolGateway || "General Dentistry"}
                                        </td>
                                        <td className="py-3 px-3 align-top">
                                            {mentor.verified ? (
                                                <span className="text-emerald-600 font-semibold">Yes</span>
                                            ) : (
                                                <span className="text-slate-500">No</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-3 align-top">
                                            {mentor.activationStatus}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* WordPress Style Pagination */}
                <div className="bg-slate-50 border-t border-slate-300 py-2 px-3 flex justify-between items-center text-xs text-slate-500">
                    <div>{data?.totalElements || 0} items</div>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 0}
                                onClick={() => handlePageChange(currentPage - 1)}
                                className="h-6 px-2 text-xs border-slate-300 rounded-sm"
                            >
                                <ChevronLeft className="h-3 w-3" />
                            </Button>
                            <span>{currentPage + 1} of {totalPages}</span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage >= totalPages - 1}
                                onClick={() => handlePageChange(currentPage + 1)}
                                className="h-6 px-2 text-xs border-slate-300 rounded-sm"
                            >
                                <ChevronRight className="h-3 w-3" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            {/* Contextual Modals */}
            <InviteMentorModal
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
