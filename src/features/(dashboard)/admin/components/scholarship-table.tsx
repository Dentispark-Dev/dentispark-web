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
    Globe,
    Trophy,
    ArrowRight,
    Trash2,
    Building2,
    Calendar
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
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from "@/src/components/ui/dropdown-menu";
import { Badge } from "@/src/components/ui/badge";
import { toast } from "sonner";
import { CreateScholarshipModal } from "./create-scholarship-modal";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";

export function ScholarshipTable() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const [query, setQuery] = useState<AdminScholarshipQuery>({
        page: 0,
        perPage: 15, // Standardized for sleek list
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

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["admin-scholarships", query],
        queryFn: () => adminService.getScholarshipRecords(query),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => adminService.deleteScholarship(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-scholarships"] });
            toast.success("Scholarship record decommissioned");
        },
        onError: () => {
            toast.error("Failed to purge scholarship node");
        }
    });

    const handlePageChange = (newPage: number) => {
        setQuery(prev => ({ ...prev, page: newPage }));
    };

    const scholarships = data?.content || [];
    const totalPages = data?.totalPages || 0;
    const currentPage = data?.pageNumber || 0;

    return (
        <div className="space-y-10 pb-20">
            {/* ── Scholarship Registry Header ── */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-greys-300 flex flex-col xl:flex-row gap-8 justify-between items-center relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 h-48 w-48 bg-amber-50 rounded-bl-full opacity-40 pointer-events-none" />
                <div className="relative z-10 space-y-3 w-full xl:w-auto">
                    <div>
                        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 px-4 py-1.5 font-extrabold text-[11px] tracking-[0.3em] rounded-full uppercase mb-3 leading-none inline-flex font-jakarta">
                            Opportunity Registry
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-semibold text-text-heading tracking-tight font-jakarta leading-tight">Scholarship <span className="text-amber-600">Hub</span></h2>
                    </div>
                    <div className="flex items-center gap-4 text-greys-500 font-medium font-jakarta">
                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest flex items-center gap-2">
                            <Trophy className="w-3.5 h-3.5" />
                            Global Endowment
                        </p>
                        <div className="h-1 w-1 rounded-full bg-greys-300" />
                        <p className="text-[10px] font-bold text-greys-400 uppercase tracking-widest">
                            {data?.totalElements || 0} Registered Grants
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto relative z-10">
                    <div className="relative group flex-1 xl:flex-none">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-greys-300 group-focus-within:text-amber-600 transition-colors" />
                        <Input
                            placeholder="Search by grant title or location..."
                            className="pl-14 pr-8 h-12 w-full xl:w-[400px] bg-greys-100 border-greys-300 text-text-heading placeholder:text-greys-400 focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-600/50 rounded-2xl transition-all font-medium text-sm font-jakarta"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 shrink-0">
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-primary-600 hover:bg-primary-500 text-white h-12 px-8 rounded-2xl shadow-lg shadow-primary-100 gap-2 font-bold text-[11px] uppercase tracking-widest active:scale-95 transition-all font-jakarta leading-none"
                        >
                            <Plus className="h-4 w-4" />
                            Add Scholarship
                        </Button>
                    </div>
                </div>
            </div>

            {/* ── Table Hub ── */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-greys-300 overflow-hidden relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-greys-100/50">
                                <th className="pl-12 pr-6 py-5 text-[10px] font-bold text-greys-400 uppercase tracking-[0.2em] font-jakarta">Opportunity Node</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-greys-400 uppercase tracking-[0.2em] font-jakarta">Capital Value</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-greys-400 uppercase tracking-[0.2em] font-jakarta">Eligibility Set</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-greys-400 uppercase tracking-[0.2em] font-jakarta">Status Node</th>
                                <th className="pr-12 pl-6 py-5 text-[10px] font-bold text-greys-400 uppercase tracking-[0.2em] font-jakarta text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-greys-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="h-10 w-10 text-amber-600 animate-spin" />
                                            <p className="text-greys-400 font-bold text-xs uppercase tracking-widest font-jakarta">Accessing Registry...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : scholarships.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-24 text-center">
                                        <div className="bg-greys-50 h-20 w-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                                            <Trophy className="h-10 w-10 text-greys-200" />
                                        </div>
                                        <h3 className="text-2xl font-semibold text-text-heading tracking-tight font-jakarta mb-4">Registry Empty</h3>
                                        <p className="text-greys-400 font-medium text-sm max-w-sm mx-auto leading-relaxed font-jakarta">No scholarship opportunities mapped to current criteria. Expansion recommended.</p>
                                    </td>
                                </tr>
                            ) : (
                                scholarships.map((scholarship) => (
                                    <tr 
                                        key={scholarship.externalId} 
                                        onClick={() => window.location.href = `/admin/content/scholarships/${scholarship.externalId}`}
                                        className="group cursor-pointer hover:bg-amber-50/30 transition-all duration-300"
                                    >
                                        <td className="pl-12 pr-6 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="h-12 w-12 rounded-xl bg-white border border-greys-300 flex items-center justify-center p-2.5 shadow-xs group-hover:scale-110 group-hover:rotate-2 transition-transform duration-500">
                                                    <Award className="h-6 w-6 text-amber-500" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-base font-semibold text-text-heading group-hover:text-amber-600 transition-colors tracking-tight mb-0.5 font-jakarta">{scholarship.title}</p>
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-greys-400 uppercase tracking-widest font-jakarta">
                                                        <Globe className="h-3 w-3" />
                                                        {scholarship.targetLocation || "Global Scope"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-jakarta">
                                            <div className="flex flex-col gap-1">
                                                <div className="text-base font-extrabold text-text-heading tracking-tight">
                                                    <span className="text-[10px] text-greys-400 mr-1.5 uppercase tracking-widest">{scholarship.amountCurrency}</span>
                                                    {scholarship.amountValue?.toLocaleString() || "Varies"}
                                                </div>
                                                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">{scholarship.fundingType || "External Grant"}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-jakarta">
                                            <div className="flex flex-col gap-2">
                                                <Badge variant="outline" className="bg-white text-primary-600 border-primary-100 px-3 py-1 font-bold text-[10px] tracking-widest rounded-full group-hover:bg-primary-50 transition-colors uppercase w-fit">
                                                    {scholarship.targetDegreeLevel || "Any Degree"}
                                                </Badge>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-greys-400 uppercase tracking-widest">
                                                    {scholarship.numberOfAwards || "Multiple"} Units
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-jakarta">
                                            <div className="flex items-center gap-3 text-greys-500">
                                                <div className="h-10 w-10 rounded-xl bg-white border border-greys-300 flex items-center justify-center shadow-xs">
                                                    <Calendar className="h-4 w-4 text-greys-300" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-greys-400 uppercase tracking-widest leading-none mb-1">Deadline</span>
                                                    <span className="text-sm font-bold text-text-heading tracking-tight">
                                                        {scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString("en-GB") : "Rolling Node"}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="pr-12 pl-6 py-6 text-right font-jakarta" onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-greys-400 hover:text-text-heading hover:bg-white rounded-xl transition-all border border-transparent hover:border-greys-300 shadow-none hover:shadow-xs">
                                                        <MoreVertical className="h-5 w-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-64 p-3 rounded-2xl border-greys-300 shadow-2xl ring-1 ring-black/5 font-jakarta">
                                                    <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-greys-400 px-4 py-3">Operations Terminal</DropdownMenuLabel>
                                                    <DropdownMenuSeparator className="bg-greys-100 mx-2" />
                                                    <DropdownMenuItem 
                                                        className="rounded-xl font-bold text-xs uppercase tracking-widest p-4 gap-4 mb-1" 
                                                        onClick={() => window.location.href = `/admin/content/scholarships/${scholarship.externalId}`}
                                                    >
                                                        <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                                            <ArrowRight className="w-5 h-5" />
                                                        </div>
                                                        Architect Blueprint
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-greys-100 mx-2" />
                                                    <DropdownMenuItem 
                                                        onClick={() => deleteMutation.mutate(scholarship.externalId)} 
                                                        className="rounded-xl font-bold text-xs uppercase tracking-widest p-4 gap-4 text-error-600 focus:bg-error-50"
                                                    >
                                                        <div className="h-10 w-10 rounded-xl bg-error-50 text-error-600 flex items-center justify-center">
                                                            <Trash2 className="w-5 h-5" />
                                                        </div>
                                                        Node Purge
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
            </div>

            {/* ── Pagination Hub ── */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-10 border-t border-greys-300 font-jakarta">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-white rounded-2xl shadow-xs border border-greys-300">
                            <p className="text-[10px] font-bold text-greys-400 uppercase tracking-widest">
                                Mapping <span className="text-text-heading">{(currentPage * query.perPage!) + 1}—{Math.min((currentPage + 1) * query.perPage!, data?.totalElements || 0)}</span> Entry Nodes
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4 p-2 bg-greys-100 rounded-3xl border border-greys-300">
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={currentPage === 0}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="h-12 w-12 rounded-2xl hover:bg-white text-greys-400 hover:text-text-heading transition-all shadow-none hover:shadow-md"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <div className="flex items-center gap-3 px-8 bg-white rounded-2xl border border-greys-300 shadow-md">
                            <span className="text-base font-bold text-text-heading tracking-tight">{currentPage + 1}</span>
                            <span className="h-4 w-px bg-greys-200" />
                            <span className="text-[10px] font-bold text-greys-400 uppercase tracking-widest">{totalPages} NODES</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={currentPage >= totalPages - 1}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="h-12 w-12 rounded-2xl hover:bg-white text-greys-400 hover:text-text-heading transition-all shadow-none hover:shadow-md"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            )}

            <CreateScholarshipModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
}
