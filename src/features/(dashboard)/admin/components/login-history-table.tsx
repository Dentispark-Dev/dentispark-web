"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    ChevronLeft,
    ChevronRight,
    Loader2,
    History,
    Clock,
    User,
    Monitor,
    MapPin,
    Globe,
    Trash2,
    AlertTriangle
} from "lucide-react";
import { adminService } from "@/src/connection/admin-service";
import { Button } from "@/src/components/ui/button";
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

export function LoginHistoryTable() {
    const [page, setPage] = useState(0);
    const perPage = 20;

    const { data, isLoading } = useQuery({
        queryKey: ["admin-login-history", page],
        queryFn: () => adminService.getLoginHistory(page, perPage),
    });
 
    const queryClient = useQueryClient();
    const clearHistoryMutation = useMutation({
        mutationFn: () => adminService.clearLoginHistory(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-login-history"] });
            toast.success("Login history cleared successfully");
        },
        onError: () => {
            toast.error("Failed to clear login history");
        }
    });

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const paginatedData = data;
    const sessions = paginatedData?.content || [];
    const totalPages = paginatedData?.totalPages || 0;
    const currentPage = paginatedData?.pageNumber || 0;

    return (
        <div className="space-y-4">
            <div className="flex justify-end p-2">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button 
                            variant="outline" 
                            className="flex gap-2 h-10 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                            disabled={sessions.length === 0 || clearHistoryMutation.isPending}
                        >
                            <Trash2 className="h-4 w-4" />
                            Clear All Sessions
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[400px]">
                        <DialogHeader>
                            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                <AlertTriangle className="h-6 w-6 text-red-600" />
                            </div>
                            <DialogTitle className="text-xl font-bold text-gray-900">Clear Login History?</DialogTitle>
                            <DialogDescription className="text-gray-500">
                                This action will permanently delete all login activity records from the database. This cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" className="rounded-xl border-gray-200">Cancel</Button>
                            </DialogClose>
                            <Button 
                                onClick={() => clearHistoryMutation.mutate()}
                                className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                            >
                                {clearHistoryMutation.isPending ? "Clearing..." : "Yes, Clear All"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
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
                                        User Info
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                     <div className="flex items-center gap-2">
                                        <Globe className="h-3.5 w-3.5" />
                                        IP Address
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                     <div className="flex items-center gap-2">
                                        <MapPin className="h-3.5 w-3.5" />
                                        Location
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                     <div className="flex items-center gap-2">
                                        <Monitor className="h-3.5 w-3.5" />
                                        Device
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-3.5 w-3.5" />
                                        Login Time
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
                                            <p className="text-gray-400 text-sm">Loading login history...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : sessions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <History className="h-12 w-12 text-gray-200" />
                                            <p className="text-gray-400">No login records found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                sessions.map((session: any) => (
                                    <tr key={session.guid} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">{session.userEmail}</span>
                                                <span className="text-xs text-gray-400">{session.userType}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 font-mono text-xs">
                                            {session.ipAddress || "—"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {session.location || "Unknown"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {session.device || "Unknown"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(session.loginAt).toLocaleString("en-GB", {
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
                            Showing <span className="font-medium">{(currentPage * perPage) + 1}</span> to{" "}
                            <span className="font-medium">{Math.min((currentPage + 1) * perPage, paginatedData?.totalElements || 0)}</span> of{" "}
                            <span className="font-medium">{paginatedData?.totalElements}</span> records
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
