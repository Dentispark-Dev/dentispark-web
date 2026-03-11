"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Shield,
    Clock,
    User,
    Filter,
    Trash2,
    AlertTriangle
} from "lucide-react";
import { adminService } from "@/src/connection/admin-service";
import { AuditQuery } from "@/src/connection/api-types";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from "@/src/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/src/components/ui/dialog";

const ACTION_COLORS: Record<string, string> = {
    CREATE: "bg-green-100 text-green-700",
    UPDATE: "bg-blue-100 text-blue-700",
    DELETE: "bg-red-100 text-red-700",
    LOGIN: "bg-purple-100 text-purple-700",
    LOGOUT: "bg-gray-100 text-gray-700",
    ACTIVATE: "bg-emerald-100 text-emerald-700",
    DEACTIVATE: "bg-orange-100 text-orange-700",
    VERIFY: "bg-teal-100 text-teal-700",
    CREATE_ASSET: "bg-green-100 text-green-700",
    UPDATE_ASSET: "bg-blue-100 text-blue-700",
};

const ACTION_TYPES = ["CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "ACTIVATE", "DEACTIVATE", "VERIFY", "CREATE_ASSET", "UPDATE_ASSET"];

export function AuditLogTable() {
    const [query, setQuery] = useState<AuditQuery>({
        page: 0,
        perPage: 20,
        searchKey: "",
        action: "",
        actor: ""
    });
    const [searchInput, setSearchInput] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["admin-audit-logs", query],
        queryFn: () => adminService.getAuditLogs(query),
    });
 
    const queryClient = useQueryClient();
    const clearLogsMutation = useMutation({
        mutationFn: () => adminService.clearAuditLogs(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-audit-logs"] });
            toast.success("Audit logs cleared successfully");
        },
        onError: () => {
            toast.error("Failed to clear audit logs");
        }
    });

    const handleSearch = () => {
        setQuery(prev => ({ ...prev, searchKey: searchInput, page: 0 }));
    };

    const handlePageChange = (newPage: number) => {
        setQuery(prev => ({ ...prev, page: newPage }));
    };

    const paginatedData = data;
    const logs = paginatedData?.content || [];
    const totalPages = paginatedData?.totalPages || 0;
    const currentPage = paginatedData?.pageNumber || 0;

    const getActionBadge = (action: string) => {
        const upper = action.toUpperCase();
        const colorClass = ACTION_COLORS[upper] || "bg-gray-100 text-gray-700";
        return <Badge className={`${colorClass} border-none font-mono text-xs`}>{action}</Badge>;
    };

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by actor, entity, or action..."
                        className="pl-10 h-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex gap-2 h-10 border-gray-200">
                                <Filter className="h-4 w-4" />
                                {query.action ? `Action: ${query.action}` : "Filter by Action"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Action Type</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setQuery(prev => ({ ...prev, action: "", page: 0 }))}>
                                All Actions
                            </DropdownMenuItem>
                            {ACTION_TYPES.map(action => (
                                <DropdownMenuItem key={action} onClick={() => setQuery(prev => ({ ...prev, action, page: 0 }))}>
                                    {action}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
 
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button 
                                variant="outline" 
                                className="flex gap-2 h-10 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                disabled={logs.length === 0 || clearLogsMutation.isPending}
                            >
                                <Trash2 className="h-4 w-4" />
                                Clear All Logs
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[400px]">
                            <DialogHeader>
                                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                    <AlertTriangle className="h-6 w-6 text-red-600" />
                                </div>
                                <DialogTitle className="text-xl font-bold text-gray-900">Clear Audit Logs?</DialogTitle>
                                <DialogDescription className="text-gray-500">
                                    This action will permanently delete all audit log records from the database. This cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline" className="rounded-xl border-gray-200">Cancel</Button>
                                </DialogClose>
                                <Button 
                                    onClick={() => clearLogsMutation.mutate()}
                                    className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                                >
                                    {clearLogsMutation.isPending ? "Clearing..." : "Yes, Clear All"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center gap-2">
                                        <User className="h-3.5 w-3.5" />
                                        Actor
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Entity</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">IP Address</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-3.5 w-3.5" />
                                        Date & Time
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
                                            <p className="text-gray-400 text-sm">Loading audit logs...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Shield className="h-12 w-12 text-gray-200" />
                                            <p className="text-gray-400">No audit events found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.guid} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-semibold text-xs">
                                                    {log.actor?.[0]?.toUpperCase() || "?"}
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{log.actor}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getActionBadge(log.action)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                            {log.actionMessage}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <span className="font-mono text-xs">{log.entity}</span>
                                            {log.entityId && (
                                                <p className="font-mono text-xs text-gray-400 truncate max-w-[100px]">{log.entityId}</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 font-mono text-xs">
                                            {log.ipAddress || "—"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(log.actionDateTime).toLocaleString("en-GB", {
                                                day: "2-digit", month: "short", year: "numeric",
                                                hour: "2-digit", minute: "2-digit"
                                            })}
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
                            Showing <span className="font-medium">{(currentPage * query.perPage!) + 1}</span> to{" "}
                            <span className="font-medium">{Math.min((currentPage + 1) * query.perPage!, paginatedData?.totalElements || 0)}</span> of{" "}
                            <span className="font-medium">{paginatedData?.totalElements}</span> events
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline" size="sm"
                                disabled={currentPage === 0}
                                onClick={() => handlePageChange(currentPage - 1)}
                                className="h-8 px-2 border-gray-200"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline" size="sm"
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
        </div>
    );
}
