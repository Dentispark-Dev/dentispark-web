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
        <div className="space-y-4 pb-20 font-sans">
            {/* WordPress Style Header */}
            <div className="flex items-center gap-4 mb-2 mt-4">
                <h1 className="text-2xl font-normal text-slate-800">Students</h1>
                <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 px-3 text-xs border-teal-600 text-teal-600 font-medium hover:bg-teal-50"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    Add New Student
                </Button>
            </div>

            {/* Sub Nav */}
            <div className="flex gap-3 text-[13px] text-slate-500 mb-4">
                <span 
                    className={cn("cursor-pointer", !query.platformMemberProfileStatus ? "font-semibold text-slate-800" : "text-teal-600 hover:underline")}
                    onClick={() => setQuery(prev => ({ ...prev, platformMemberProfileStatus: "", page: 0 }))}
                >
                    All <span className="text-slate-500 font-normal">({!query.platformMemberProfileStatus ? data?.totalElements || 0 : ''})</span>
                </span> | 
                <span 
                    className={cn("cursor-pointer", query.platformMemberProfileStatus === "ACTIVE" ? "font-semibold text-slate-800" : "text-teal-600 hover:underline")}
                    onClick={() => setQuery(prev => ({ ...prev, platformMemberProfileStatus: "ACTIVE", page: 0 }))}
                >
                    Active
                </span> | 
                <span 
                    className={cn("cursor-pointer", query.platformMemberProfileStatus === "INACTIVE" ? "font-semibold text-slate-800" : "text-teal-600 hover:underline")}
                    onClick={() => setQuery(prev => ({ ...prev, platformMemberProfileStatus: "INACTIVE", page: 0 }))}
                >
                    Inactive
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
                                <th className="py-2 px-3 font-semibold">Email</th>
                                <th className="py-2 px-3 font-semibold">Gateway</th>
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
                                        <td className="py-3 px-3"><div className="h-4 w-48 bg-slate-200 rounded" /></td>
                                        <td className="py-3 px-3"><div className="h-4 w-20 bg-slate-200 rounded" /></td>
                                        <td className="py-3 px-3"><div className="h-4 w-16 bg-slate-200 rounded" /></td>
                                    </tr>
                                ))
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 px-4 text-center text-slate-500">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                students.map((student, idx) => (
                                    <tr 
                                        key={student.sid}
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
                                                    {(student.firstName?.[0] || "")}{(student.lastName?.[0] || "")}
                                                </div>
                                                <div className="flex flex-col">
                                                    <strong className="text-teal-700 text-[14px]">{student.sid}</strong>
                                                    <div className="flex flex-wrap gap-2 text-xs mt-1 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity min-h-[16px]">
                                                        <button 
                                                            onClick={() => router.push(`/admin/students/${encodeURIComponent(student.sid)}`)}
                                                            className="text-teal-600 hover:text-teal-800 hover:underline focus:opacity-100"
                                                        >
                                                            Edit
                                                        </button>
                                                        <span>|</span>
                                                        <button 
                                                            onClick={() => {
                                                                if (confirm("Are you sure you want to PERMANENTLY delete this student? This action cannot be undone.")) {
                                                                    deleteStudentMutation.mutate(student.sid);
                                                                }
                                                            }}
                                                            className="text-rose-600 hover:text-rose-800 hover:underline focus:opacity-100"
                                                        >
                                                            Delete
                                                        </button>
                                                        <span>|</span>
                                                        <button 
                                                            onClick={() => router.push(`/admin/students/${encodeURIComponent(student.sid)}`)}
                                                            className="text-teal-600 hover:text-teal-800 hover:underline focus:opacity-100"
                                                        >
                                                            View
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-3 align-top text-slate-700">
                                            {student.firstName} {student.lastName}
                                        </td>
                                        <td className="py-3 px-3 align-top">
                                            <a href={`mailto:${student.emailAddress}`} className="text-teal-600 hover:underline">{student.emailAddress}</a>
                                        </td>
                                        <td className="py-3 px-3 align-top text-slate-700">
                                            {student.dentalSchoolGateway || "BDS"}
                                        </td>
                                        <td className="py-3 px-3 align-top">
                                            {student.activationStatus}
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
