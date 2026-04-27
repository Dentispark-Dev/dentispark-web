"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    ChevronLeft,
    ChevronRight,
    Loader2,
    RefreshCw,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import { adminService } from "@/src/connection/admin-service";
import { StudentQuery, PaginatedResponse, StudentRecord } from "@/src/connection/api-types";
import { useSearch } from "@/src/hooks/use-search";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { toast } from "sonner";
import { InviteStudentModal } from "./invite-student-modal";
import { CreateUserModal } from "./create-user-modal";
import { EditSidModal } from "./edit-sid-modal";
import { cn } from "@/src/lib/utils";

export function StudentTable() {
    const router = useRouter();
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [editSidData, setEditSidData] = useState<{ isOpen: boolean; userId: string; sid: string; name: string }>({
        isOpen: false,
        userId: "",
        sid: "",
        name: ""
    });
    const queryClient = useQueryClient();

    // Row selection state
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [bulkAction, setBulkAction] = useState("bulk");

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

    const { data, isLoading, isError } = useQuery({
        queryKey: ["admin-students", query],
        queryFn: () => adminService.getStudentRecords(query),
        retry: 1,
    });

    // Triggered by the "Sync from Java" banner — calls the seed endpoint once
    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const res = await fetch("/api/admin/seed-students", {
                method: "POST",
                headers: { Authorization: "Bearer dentispark-seed" },
            });
            const json = await res.json();
            if (res.ok) {
                toast.success(`Sync complete — ${json.totalSeeded ?? 0} students imported.`);
                queryClient.invalidateQueries({ queryKey: ["admin-students"] });
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
            toast.success("Student removed successfully");
        },
        onError: (error: any) => {
            const diag = error?.headers?.['x-handled-locally'] ? '[LOCAL]' :
                        error?.headers?.['x-proxied-to-java-fallback'] ? '[FALLBACK]' : '';
            const msg = `${diag} ${error?.message || error?.responseMessage || "Failed to remove student"}`;
            toast.error(msg.trim());
        }
    });

    const students = data?.content || [];
    const totalPages = data?.totalPages || 0;
    const currentPage = data?.pageNumber || 0;

    // ── Selection helpers ────────────────────────────────────────────────────
    const allIds = students.map(s => s.sid);
    const allSelected = allIds.length > 0 && allIds.every(id => selectedIds.has(id));
    const someSelected = allIds.some(id => selectedIds.has(id));

    const toggleAll = () => {
        if (allSelected) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(allIds));
        }
    };

    const toggleOne = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    // ── Bulk apply ───────────────────────────────────────────────────────────
    const handleBulkApply = async () => {
        if (bulkAction === "bulk" || selectedIds.size === 0) {
            if (bulkAction === "bulk") toast.error("Please select a bulk action first.");
            if (selectedIds.size === 0) toast.error("Please select at least one student.");
            return;
        }

        if (bulkAction === "delete") {
            if (!confirm(`Permanently remove ${selectedIds.size} selected student${selectedIds.size > 1 ? "s" : ""}? This cannot be undone.`)) return;
            const ids = Array.from(selectedIds);
            let successCount = 0;
            for (const id of ids) {
                try {
                    await adminService.deleteStudent(id);
                    successCount++;
                } catch {
                    toast.error(`Failed to remove student ${id}`);
                }
            }
            if (successCount > 0) toast.success(`${successCount} student${successCount > 1 ? "s" : ""} removed successfully.`);
            setSelectedIds(new Set());
            queryClient.invalidateQueries({ queryKey: ["admin-students"] });
        }
    };

    const handlePageChange = (newPage: number) => {
        setQuery(prev => ({ ...prev, page: newPage }));
        setSelectedIds(new Set());
    };

    // ── Status badge ─────────────────────────────────────────────────────────
    const getStatusBadge = (status: string) => {
        const s = (status || "").toUpperCase();
        const map: Record<string, { label: string; cls: string }> = {
            ACTIVE:    { label: "Active",    cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
            COMPLETED: { label: "Completed", cls: "bg-indigo-50 text-indigo-700 border border-indigo-200" },
            INACTIVE:  { label: "Inactive",  cls: "bg-slate-100 text-slate-500 border border-slate-200" },
            SUSPENDED: { label: "Suspended", cls: "bg-rose-50 text-rose-700 border border-rose-200" },
            PENDING:   { label: "Pending",   cls: "bg-amber-50 text-amber-700 border border-amber-200" },
        };
        const cfg = map[s] || { label: status, cls: "bg-slate-100 text-slate-600 border border-slate-200" };
        return (
            <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide", cfg.cls)}>
                {cfg.label}
            </span>
        );
    };

    const needsSync = (data as any)?.needsSync === true;

    return (
        <div className="space-y-4 pb-20 font-sans">
            {/* Page Header */}
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

            {/* Sync Banner — shown only when local DB has no students yet */}
            {(needsSync || isError) && (
                <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-md px-4 py-3 text-sm">
                    <div className="flex items-center gap-2 text-amber-800">
                        <RefreshCw className="h-4 w-4 text-amber-600" />
                        <span>
                            {isError
                                ? "Could not load students. Click Sync to import from the legacy system."
                                : "No local student data found. Sync once to import all students from the legacy system."}
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

            {/* Sub Nav Filters */}
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

            {/* Bulk Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-3">
                <div className="flex items-center gap-2">
                    <select
                        value={bulkAction}
                        onChange={e => setBulkAction(e.target.value)}
                        className="text-[13px] border border-slate-300 rounded-sm px-2 py-1 bg-white h-8 w-36 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-slate-700"
                    >
                        <option value="bulk">Bulk actions</option>
                        <option value="delete">Delete</option>
                    </select>
                    <Button
                        variant="outline"
                        className="h-8 px-3 text-xs border-slate-300 text-slate-700 bg-slate-50 hover:bg-white rounded-sm"
                        onClick={handleBulkApply}
                        disabled={selectedIds.size === 0 || bulkAction === "bulk"}
                    >
                        Apply
                        {selectedIds.size > 0 && bulkAction !== "bulk" && (
                            <span className="ml-1.5 bg-teal-600 text-white text-[10px] rounded-full px-1.5 py-0.5 font-bold leading-none">
                                {selectedIds.size}
                            </span>
                        )}
                    </Button>
                    {selectedIds.size > 0 && (
                        <span className="text-[12px] text-slate-500">
                            {selectedIds.size} selected
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Search students…"
                        className="h-8 w-52 text-[13px] rounded-sm border-slate-300 focus:border-teal-500"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <Button variant="outline" className="h-8 px-3 text-xs border-slate-300 text-slate-700 bg-slate-50 hover:bg-white rounded-sm">
                        Search Users
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-[13px] text-slate-700 border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-[11px] uppercase tracking-wider">
                                <th className="w-10 py-3 px-4 text-center">
                                    <input
                                        type="checkbox"
                                        className="rounded-sm border-slate-400 cursor-pointer"
                                        checked={allSelected}
                                        ref={el => { if (el) el.indeterminate = someSelected && !allSelected; }}
                                        onChange={toggleAll}
                                    />
                                </th>
                                <th className="py-3 px-4 font-semibold">System ID</th>
                                <th className="py-3 px-4 font-semibold">Name</th>
                                <th className="py-3 px-4 font-semibold">Email</th>
                                <th className="py-3 px-4 font-semibold">Gateway</th>
                                <th className="py-3 px-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <tr key={`skeleton-${i}`} className="animate-pulse bg-white">
                                        <td className="py-3 px-4"><div className="h-4 w-4 bg-slate-200 rounded mx-auto" /></td>
                                        <td className="py-3 px-4"><div className="h-4 w-28 bg-slate-200 rounded" /></td>
                                        <td className="py-3 px-4"><div className="h-4 w-36 bg-slate-200 rounded" /></td>
                                        <td className="py-3 px-4"><div className="h-4 w-44 bg-slate-200 rounded" /></td>
                                        <td className="py-3 px-4"><div className="h-4 w-16 bg-slate-200 rounded" /></td>
                                        <td className="py-3 px-4"><div className="h-4 w-20 bg-slate-200 rounded" /></td>
                                    </tr>
                                ))
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 px-4 text-center text-slate-400 text-sm">
                                        No students found.
                                    </td>
                                </tr>
                            ) : (
                                students.map((student) => {
                                    const isSelected = selectedIds.has(student.sid);
                                    return (
                                        <tr
                                            key={student.sid}
                                            className={cn(
                                                "group transition-colors hover:bg-indigo-50/30",
                                                isSelected ? "bg-indigo-50/50" : ""
                                            )}
                                        >
                                            {/* Checkbox */}
                                            <td className="w-10 py-3 px-4 text-center align-middle">
                                                <input
                                                    type="checkbox"
                                                    className="rounded-sm border-slate-400 cursor-pointer"
                                                    checked={isSelected}
                                                    onChange={() => toggleOne(student.sid)}
                                                />
                                            </td>

                                            {/* System ID + row actions */}
                                            <td className="py-3 px-4 align-middle">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-md bg-slate-100 border border-slate-200 flex flex-shrink-0 items-center justify-center text-slate-600 font-bold text-xs">
                                                        {(student.firstName?.[0] || "")}{(student.lastName?.[0] || "")}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <button
                                                            onClick={() => router.push(`/admin/students/${encodeURIComponent(student.sid)}`)}
                                                            className="text-teal-700 font-semibold hover:text-teal-900 hover:underline text-left truncate"
                                                        >
                                                            {student.sid}
                                                        </button>
                                                        <div className="flex gap-2 text-[11px] mt-0.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => router.push(`/admin/students/${encodeURIComponent(student.sid)}`)}
                                                                className="text-teal-600 hover:text-teal-800 hover:underline"
                                                            >
                                                                Edit
                                                            </button>
                                                            <span>|</span>
                                                            <button 
                                                                onClick={() => setEditSidData({
                                                                    isOpen: true,
                                                                    userId: student.sid,
                                                                    sid: student.sid,
                                                                    name: `${student.firstName} ${student.lastName}`
                                                                })}
                                                                className="text-indigo-600 hover:text-indigo-800 hover:underline"
                                                            >
                                                                Edit ID
                                                            </button>
                                                            <span>|</span>
                                                            <button
                                                                onClick={() => {
                                                                    if (confirm("Permanently remove this student? This cannot be undone.")) {
                                                                        deleteStudentMutation.mutate(student.sid);
                                                                    }
                                                                }}
                                                                className="text-rose-500 hover:text-rose-700 hover:underline"
                                                            >
                                                                Delete
                                                            </button>
                                                            <span>|</span>
                                                            <button
                                                                onClick={() => router.push(`/admin/students/${encodeURIComponent(student.sid)}`)}
                                                                className="text-teal-600 hover:text-teal-800 hover:underline"
                                                            >
                                                                View
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Name */}
                                            <td className="py-3 px-4 align-middle font-medium text-slate-800">
                                                {student.firstName} {student.lastName}
                                            </td>

                                            {/* Email */}
                                            <td className="py-3 px-4 align-middle">
                                                <a href={`mailto:${student.emailAddress}`} className="text-teal-600 hover:underline">
                                                    {student.emailAddress}
                                                </a>
                                            </td>

                                            {/* Gateway */}
                                            <td className="py-3 px-4 align-middle text-slate-600">
                                                {student.dentalSchoolGateway || "BDS"}
                                            </td>

                                            {/* Status */}
                                            <td className="py-3 px-4 align-middle">
                                                {getStatusBadge(student.activationStatus)}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="bg-slate-50 border-t border-slate-200 py-2.5 px-4 flex justify-between items-center text-xs text-slate-500">
                    <div>{data?.totalElements || 0} items</div>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 0}
                                onClick={() => handlePageChange(currentPage - 1)}
                                className="h-7 px-2 text-xs border-slate-300 rounded-sm"
                            >
                                <ChevronLeft className="h-3 w-3" />
                            </Button>
                            <span className="font-medium text-slate-700">{currentPage + 1} of {totalPages}</span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage >= totalPages - 1}
                                onClick={() => handlePageChange(currentPage + 1)}
                                className="h-7 px-2 text-xs border-slate-300 rounded-sm"
                            >
                                <ChevronRight className="h-3 w-3" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <InviteStudentModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
            />
            <CreateUserModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
            <EditSidModal
                isOpen={editSidData.isOpen}
                onClose={() => setEditSidData(prev => ({ ...prev, isOpen: false }))}
                userId={editSidData.userId}
                currentSid={editSidData.sid}
                userName={editSidData.name}
            />
        </div>
    );
}
