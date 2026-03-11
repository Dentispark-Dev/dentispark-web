"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Loader2,
    UserPlus
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

export function StudentTable() {
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
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ["admin-students", query] });

            // Snapshot the previous value
            const previousData = queryClient.getQueryData<PaginatedResponse<StudentRecord>>(["admin-students", query]);

            // Optimistically update to the new value
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
            // Rollback to the previous value if mutation fails
            if (context?.previousData) {
                queryClient.setQueryData(["admin-students", query], context.previousData);
            }
            toast.error("Failed to update student status");
        },
        onSettled: () => {
            // Always refetch after error or success to ensure sync with server
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
        switch (status.toUpperCase()) {
            case "ACTIVE":
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none">Active</Badge>;
            case "INACTIVE":
                return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-none">Inactive</Badge>;
            case "SUSPENDED":
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none">Suspended</Badge>;
            case "PENDING":
                return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-none">Pending</Badge>;
            default:
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">{status}</Badge>;
        }
    };

    const paginatedData = data;
    const students = paginatedData?.content || [];
    const totalPages = paginatedData?.totalPages || 0;
    const currentPage = paginatedData?.pageNumber || 0;

    return (
        <div className="space-y-4">
            {/* Filters & Actions */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by name, email or SID..."
                        className="pl-10 h-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <Button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="bg-green-600 hover:bg-green-700 text-white gap-2 h-10"
                    >
                        <UserPlus className="h-4 w-4" />
                        Invite Student
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex gap-2 h-10 border-gray-200">
                                <Filter className="h-4 w-4" />
                                Filter
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setQuery(prev => ({ ...prev, platformMemberProfileStatus: "", page: 0 }))}>
                                All Statuses
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setQuery(prev => ({ ...prev, platformMemberProfileStatus: "ACTIVE", page: 0 }))}>
                                Active
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setQuery(prev => ({ ...prev, platformMemberProfileStatus: "INACTIVE", page: 0 }))}>
                                Inactive
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Category</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setQuery(prev => ({ ...prev, platformMemberCategory: "", page: 0 }))}>
                                All Categories
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setQuery(prev => ({ ...prev, platformMemberCategory: "BDS", page: 0 }))}>
                                BDS
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setQuery(prev => ({ ...prev, platformMemberCategory: "NURSING", page: 0 }))}>
                                Nursing
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setQuery(prev => ({ ...prev, platformMemberCategory: "HYGIENE_THERAPY", page: 0 }))}>
                                Hygiene Therapy
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">SID</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
                                            <p className="text-gray-400 text-sm">Loading students...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        No students found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                students.map((student) => (
                                    <tr key={student.sid} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-semibold">
                                                    {(student.firstName?.[0] || "")}{(student.lastName?.[0] || "")}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{student.firstName} {student.lastName}</p>
                                                    <p className="text-xs text-gray-500">{student.emailAddress}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                                            {student.sid}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {student.dentalSchoolGateway || "BDS"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(student.activationStatus)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(student.dateStamped).toLocaleDateString("en-GB")}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/students/${encodeURIComponent(student.sid)}`}>
                                                            View Profile
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: student.sid, status: "ACTIVE" })}>
                                                        Activate Account
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: student.sid, status: "INACTIVE" })} className="text-red-600">
                                                        Deactivate Account
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

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                        <p className="text-sm text-gray-500">
                            Showing <span className="font-medium">{(currentPage * query.perPage!) + 1}</span> to <span className="font-medium">{Math.min((currentPage + 1) * query.perPage!, paginatedData?.totalElements || 0)}</span> of <span className="font-medium">{paginatedData?.totalElements}</span> results
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 0}
                                onClick={() => handlePageChange(currentPage - 1)}
                                className="h-8 px-2 border-gray-200"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage >= totalPages - 1}
                                onClick={() => handlePageChange(currentPage + 1)}
                                className="h-8 px-2 border-gray-200"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            {/* Modal */}
            <InviteStudentModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
            />
        </div>
    );
}
