"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Plus,
    Loader2,
    Award,
    Globe
} from "lucide-react";
import { adminService } from "@/src/connection/admin-service";
import { AdminScholarshipQuery } from "@/src/connection/api-types";
import { useSearch } from "@/src/hooks/use-search";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/src/components/ui/dropdown-menu";
import { Badge } from "@/src/components/ui/badge";
import { toast } from "sonner";
import { CreateScholarshipModal } from "./create-scholarship-modal";

export function ScholarshipTable() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const [query, setQuery] = useState<AdminScholarshipQuery>({
        page: 0,
        perPage: 10,
        searchKey: "",
        degreeLevel: ""
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
        queryKey: ["admin-scholarships", query],
        queryFn: () => adminService.getScholarshipRecords(query),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => adminService.deleteScholarship(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-scholarships"] });
            toast.success("Scholarship deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete scholarship");
        }
    });

    const handlePageChange = (newPage: number) => {
        setQuery(prev => ({ ...prev, page: newPage }));
    };

    const paginatedData = data;
    const scholarships = paginatedData?.content || [];
    const totalPages = paginatedData?.totalPages || 0;
    const currentPage = paginatedData?.pageNumber || 0;

    return (
        <>
            <div className="space-y-4">
                {/* Filters & Actions */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search scholarships..."
                            className="pl-10 h-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline" className="flex gap-2 h-10 border-gray-200">
                            <Filter className="h-4 w-4" />
                            Filter
                        </Button>
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="h-10 bg-green-600 hover:bg-green-700 flex gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Scholarship
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Scholarship</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Target Level</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Deadline</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
                                                <p className="text-gray-400 text-sm">Loading scholarships...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : scholarships.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                            No scholarships found.
                                        </td>
                                    </tr>
                                ) : (
                                    scholarships.map((scholarship) => (
                                        <tr key={scholarship.externalId} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                                                        <Award className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{scholarship.title}</p>
                                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                                            <Globe className="h-3 w-3" />
                                                            {scholarship.targetLocation || "Global"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                                                {scholarship.amountCurrency} {scholarship.amountValue?.toLocaleString() || "Varies"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-none font-normal">
                                                    {scholarship.targetDegreeLevel || "Any"}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : "Rolling"}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => window.location.href = `/admin/content/scholarships/${scholarship.externalId}`}>
                                                            Edit Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => deleteMutation.mutate(scholarship.externalId)} className="text-red-600">
                                                            Delete
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
            </div>
            <CreateScholarshipModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </>
    );
}
