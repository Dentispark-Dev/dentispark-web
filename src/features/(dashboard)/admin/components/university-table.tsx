"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Plus,
    Loader2,
    MapPin,
    Globe,
    BookPlus,
    Building2,
    ArrowRight,
    Trash2,
    Star
} from "lucide-react";
import { adminService } from "../../../../connection/admin-service";
import { AdminUniversityQuery } from "@/src/connection/api-types";
import { CreateCourseModal } from "./create-course-modal";
import { useSearch } from "@/src/hooks/use-search";
import { CreateUniversityModal } from "./create-university-modal";
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
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";

export function UniversityTable() {
    const router = useRouter();
    // Enforced "table" (list) style as per user request
    const [viewMode] = useState<"table">("table");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedUniForProgram, setSelectedUniForProgram] = useState<string | undefined>(undefined);
    const queryClient = useQueryClient();
    const [query, setQuery] = useState<AdminUniversityQuery>({
        page: 0,
        perPage: 15, // Slightly increased for list view
        searchKey: "",
        dentalSchoolPathway: ""
    });

    const [isCreateProgramModalOpen, setIsCreateProgramModalOpen] = useState(false);

    const handleAddProgramSet = (hid: string) => {
        setSelectedUniForProgram(hid);
        setIsCreateProgramModalOpen(true);
    };

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
        queryKey: ["admin-universities", query],
        queryFn: () => adminService.getUniversityRecords(query),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => adminService.deleteUniversity(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-universities"] });
            toast.success("Institutional registry entry removed");
        },
        onError: () => {
            toast.error("Failed to decommission institutional registry");
        }
    });

    const handlePageChange = (newPage: number) => {
        setQuery(prev => ({ ...prev, page: newPage }));
    };

    const universities = data?.content || [];
    const totalPages = data?.totalPages || 0;
    const currentPage = data?.pageNumber || 0;

    return (
        <div className="space-y-10 pb-20">
            {/* ── Institutional Registry Header ── */}
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-greys-300 flex flex-col xl:flex-row gap-10 justify-between items-center relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 h-64 w-64 bg-primary-50 rounded-bl-full opacity-40 pointer-events-none" />
                
                <div className="relative z-10 space-y-4 w-full xl:w-auto">
                    <div>
                        <Badge variant="outline" className="bg-primary-50 text-primary-600 border-primary-200 px-4 py-1.5 font-bold text-[10px] tracking-[0.25em] rounded-full uppercase mb-4 leading-none inline-flex font-jakarta">
                            University Registry
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-semibold text-text-heading tracking-tight font-jakarta leading-tight">Academic <span className="text-primary-600">Inventory</span></h2>
                    </div>
                    <div className="flex items-center gap-4 text-greys-500 font-medium font-jakarta">
                        <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest flex items-center gap-2">
                            <Building2 className="w-3.5 h-3.5" />
                            Global Directory
                        </p>
                        <div className="h-1 w-1 rounded-full bg-greys-300" />
                        <p className="text-[10px] font-bold text-greys-400 uppercase tracking-widest">
                            {data?.totalElements || 0} Registered Institutes
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 w-full xl:w-auto relative z-10">
                    <div className="relative group flex-1 xl:flex-none">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-greys-300 group-focus-within:text-primary-600 transition-colors" />
                        <Input
                            placeholder="Search by institution name or hub location..."
                            className="pl-14 pr-8 h-14 w-full xl:w-[450px] bg-greys-100 border-greys-300 text-text-heading placeholder:text-greys-400 focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-600/50 rounded-2xl transition-all font-medium text-sm font-jakarta"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 shrink-0">
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-primary-600 hover:bg-primary-500 text-white h-14 px-10 rounded-2xl shadow-lg shadow-primary-100 gap-3 font-bold text-xs uppercase tracking-widest active:scale-95 transition-all font-jakarta leading-none"
                        >
                            <Plus className="h-4 w-4" />
                            Register Institute
                        </Button>
                    </div>
                </div>
            </div>

            {/* ── Content View (List Enforced) ── */}
            {isLoading ? (
                <div className="bg-white rounded-3xl border border-greys-300 overflow-hidden">
                    <div className="p-8 space-y-4 animate-pulse">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-20 bg-greys-100 rounded-2xl w-full" />
                        ))}
                    </div>
                </div>
            ) : universities.length === 0 ? (
                <div className="bg-white rounded-3xl p-24 text-center border border-greys-300 shadow-sm">
                    <div className="bg-greys-50 h-28 w-28 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner group overflow-hidden">
                        <Building2 className="h-12 w-12 text-greys-200 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" />
                    </div>
                    <h3 className="text-2xl font-semibold text-text-heading tracking-tight font-jakarta mb-4">Registry Empty</h3>
                    <p className="text-greys-400 font-medium text-sm max-w-sm mx-auto leading-relaxed font-jakarta">No institutional matches found for current search parameters. Expand your criteria to refresh the registry data.</p>
                </div>
            ) : (
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-greys-300 overflow-hidden relative">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead>
                                <tr className="bg-greys-100/50">
                                    <th className="pl-12 pr-6 py-8 text-[10px] font-bold text-greys-400 uppercase tracking-[0.2em] font-jakarta">Institute Detail</th>
                                    <th className="px-6 py-8 text-[10px] font-bold text-greys-400 uppercase tracking-[0.2em] font-jakarta">Hub Location</th>
                                    <th className="px-6 py-8 text-[10px] font-bold text-greys-400 uppercase tracking-[0.2em] font-jakarta">Pathway</th>
                                    <th className="px-6 py-8 text-[10px] font-bold text-greys-400 uppercase tracking-[0.2em] font-jakarta">Global Ranking</th>
                                    <th className="pr-12 pl-6 py-8 text-[10px] font-bold text-greys-400 uppercase tracking-[0.2em] font-jakarta text-right">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-greys-100">
                                {universities.map((uni) => (
                                    <tr 
                                        key={uni.hid} 
                                        onClick={() => router.push(`/admin/content/universities/${uni.hid}`)}
                                        className="group cursor-pointer hover:bg-primary-50/50 transition-all duration-300"
                                    >
                                        <td className="pl-12 pr-6 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="h-16 w-16 rounded-xl bg-white border border-greys-300 flex items-center justify-center p-3 shadow-xs group-hover:scale-110 group-hover:rotate-2 transition-transform duration-500">
                                                    {(uni as any).logoUrl ? (
                                                        <img src={(uni as any).logoUrl} alt={uni.name} className="h-full w-full object-contain" />
                                                    ) : (
                                                        <Globe className="h-6 w-6 text-greys-200" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-lg font-semibold text-text-heading group-hover:text-primary-600 transition-colors tracking-tight mb-1 font-jakarta">{uni.name}</p>
                                                    <p className="text-[10px] font-bold text-greys-400 uppercase tracking-widest italic font-jakarta">Awaiting Program Linking</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-8 font-jakarta">
                                            <div className="flex items-center gap-3 text-greys-600">
                                                <MapPin className="h-3.5 w-3.5 text-error-500/50" />
                                                <span className="text-sm font-medium">{uni.location || "United Kingdom"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-8 font-jakarta">
                                            <Badge variant="outline" className="bg-white text-primary-600 border-primary-100 px-5 py-1.5 font-bold text-[10px] tracking-widest rounded-full group-hover:bg-primary-50 transition-colors uppercase">
                                                {uni.dentalSchoolPathway || "Direct Entry"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-8 font-jakarta">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-xl bg-white border border-greys-300 flex items-center justify-center shadow-xs">
                                                    <Star className="h-5 w-5 text-warning-500 fill-warning-50" />
                                                </div>
                                                <span className="text-base font-bold text-text-heading tracking-tight">#{uni.ranking || "—"}</span>
                                            </div>
                                        </td>
                                        <td className="pr-12 pl-6 py-8 text-right font-jakarta" onClick={(e) => e.stopPropagation()}>
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
                                                        onClick={() => router.push(`/admin/content/universities/${uni.hid}`)}
                                                    >
                                                        <div className="h-10 w-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                                                            <ArrowRight className="w-5 h-5" />
                                                        </div>
                                                        Architect Blueprint
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        onClick={() => handleAddProgramSet(uni.hid)} 
                                                        className="rounded-xl font-bold text-xs uppercase tracking-widest p-4 gap-4 text-success-600 focus:bg-success-50 mb-1"
                                                    >
                                                        <div className="h-10 w-10 rounded-xl bg-success-50 text-success-600 flex items-center justify-center">
                                                            <BookPlus className="h-5 w-5" />
                                                        </div>
                                                        Link Program
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-greys-100 mx-2" />
                                                    <DropdownMenuItem 
                                                        onClick={() => deleteMutation.mutate(uni.hid)} 
                                                        className="rounded-xl font-bold text-xs uppercase tracking-widest p-4 gap-4 text-error-600 focus:bg-error-50"
                                                    >
                                                        <div className="h-10 w-10 rounded-xl bg-error-50 text-error-600 flex items-center justify-center">
                                                            <Trash2 className="w-5 h-5" />
                                                        </div>
                                                        Registry Purge
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

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

            {/* Modals */}
            <CreateUniversityModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
            <CreateCourseModal 
                isOpen={isCreateProgramModalOpen}
                onClose={() => {
                    setIsCreateProgramModalOpen(false);
                    setSelectedUniForProgram(undefined);
                }}
                initialUniversityHid={selectedUniForProgram}
            />
        </div>
    );
}
