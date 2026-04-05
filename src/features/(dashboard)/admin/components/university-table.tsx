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
    Plus,
    Loader2,
    MapPin,
    Globe,
    BookPlus,
    Building2,
    LayoutGrid,
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
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedUniForProgram, setSelectedUniForProgram] = useState<string | undefined>(undefined);
    const queryClient = useQueryClient();
    const [query, setQuery] = useState<AdminUniversityQuery>({
        page: 0,
        perPage: 12,
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
            {/* ── Contextual Header ── */}
            <div className="bg-slate-900 p-10 md:p-14 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-800 flex flex-col xl:flex-row gap-10 justify-between items-center relative overflow-hidden transition-all duration-700">
                <div className="absolute top-0 right-0 h-64 w-64 bg-orange-500/10 rounded-bl-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 h-80 w-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="relative z-10 space-y-3 w-full xl:w-auto text-center xl:text-left">
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter font-sora">Academic Registry</h2>
                    <div className="flex items-center justify-center xl:justify-start gap-4">
                        <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em] flex items-center gap-2">
                            <Building2 className="w-3.5 h-3.5" />
                            Global Enrollment Network
                        </p>
                        <div className="h-1 w-1 rounded-full bg-white/20" />
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                            {data?.totalElements || 0} INSTITUTES VERIFIED
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-5 w-full xl:w-auto relative z-10">
                    <div className="relative group flex-1 xl:flex-none">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 group-focus-within:text-orange-400 transition-colors" />
                        <Input
                            placeholder="Find university by name or location..."
                            className="pl-14 pr-8 h-16 w-full xl:w-[450px] bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:bg-white/10 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/50 rounded-2xl transition-all font-bold text-base"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 shrink-0">
                        <div className="bg-white/5 p-1.5 rounded-2xl border border-white/10 flex items-center gap-1">
                            <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setViewMode("grid")}
                                className={cn(
                                    "h-12 w-12 rounded-xl transition-all",
                                    viewMode === "grid" ? "bg-white text-slate-900 shadow-xl" : "text-white/40 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <LayoutGrid className="h-5 w-5" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setViewMode("table")}
                                className={cn(
                                    "h-12 w-12 rounded-xl transition-all",
                                    viewMode === "table" ? "bg-white text-slate-900 shadow-xl" : "text-white/40 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Filter className="h-5 w-5" />
                            </Button>
                        </div>
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-orange-600 hover:bg-orange-700 text-white h-16 px-10 rounded-2xl shadow-2xl shadow-orange-900/20 gap-3 font-black text-sm active:scale-95 transition-all"
                        >
                            <Plus className="h-5 w-5" />
                            Register Institute
                        </Button>
                    </div>
                </div>
            </div>

            {/* ── Content View ── */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 animate-pulse space-y-6">
                            <div className="h-20 w-20 bg-slate-50 rounded-2xl mx-auto" />
                            <div className="space-y-3">
                                <div className="h-6 w-3/4 bg-slate-50 rounded-lg mx-auto" />
                                <div className="h-4 w-1/2 bg-slate-50 rounded-lg mx-auto" />
                            </div>
                            <div className="flex gap-2 justify-center">
                                <div className="h-8 w-20 bg-slate-50 rounded-full" />
                                <div className="h-8 w-20 bg-slate-50 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : universities.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-32 text-center border border-slate-100 shadow-2xl shadow-slate-200/40">
                    <div className="bg-slate-50 h-32 w-32 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner group overflow-hidden">
                        <Building2 className="h-16 w-16 text-slate-200 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" />
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter font-sora mb-4 uppercase">Registry Empty</h3>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] max-w-sm mx-auto leading-relaxed">No institutional matches found for current search parameters. Expand your criteria to refresh the registry data.</p>
                </div>
            ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {universities.map((uni) => (
                        <motion.div
                            key={uni.hid}
                            whileHover={{ y: -10 }}
                            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden group hover:shadow-2xl hover:shadow-orange-200/40 transition-all duration-500"
                        >
                            <div className="p-8 space-y-8 relative">
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-black hover:bg-slate-50 rounded-xl">
                                                <MoreVertical className="h-5 w-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-slate-100 shadow-2xl ring-1 ring-black/5">
                                            <DropdownMenuItem className="rounded-xl font-bold text-sm gap-3 p-3" onClick={() => router.push(`/admin/content/universities/${uni.hid}`)}>
                                                <ArrowRight className="w-4 h-4 text-orange-500" />
                                                View Blueprint
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleAddProgramSet(uni.hid)} className="rounded-xl font-bold text-sm gap-3 p-3 text-emerald-600 focus:bg-emerald-50">
                                                <BookPlus className="h-4 w-4" />
                                                Add Program
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-slate-50 my-1" />
                                            <DropdownMenuItem 
                                                onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(uni.hid); }} 
                                                className="rounded-xl font-bold text-sm gap-3 p-3 text-rose-600 focus:bg-rose-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Expunge Registry
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div 
                                    className="flex flex-col items-center text-center space-y-6 cursor-pointer"
                                    onClick={() => router.push(`/admin/content/universities/${uni.hid}`)}
                                >
                                    <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-slate-50 to-orange-50 border border-slate-100 flex items-center justify-center text-orange-600 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 overflow-hidden p-4">
                                        {(uni as any).logoUrl ? (
                                            <img src={(uni as any).logoUrl} alt={uni.name} className="h-full w-full object-contain" />
                                        ) : (
                                            <Globe className="h-10 w-10 opacity-30" />
                                        )}
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <h4 className="text-xl font-black text-slate-900 font-sora tracking-tight truncate w-full px-2">
                                            {uni.name}
                                        </h4>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                                            <MapPin className="h-3 w-3 text-rose-500" />
                                            {uni.location || "United Kingdom"}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center gap-2">
                                        <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 px-4 py-1.5 font-black text-[9px] tracking-tight rounded-full uppercase">
                                            {uni.dentalSchoolPathway || "Direct Entry"}
                                        </Badge>
                                        <Badge className="bg-orange-500/10 text-orange-600 border-none px-4 py-1.5 font-black text-[9px] tracking-tight rounded-full uppercase">
                                            Rank #{uni.ranking || "—"}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-slate-50/50 p-6 flex items-center justify-between border-t border-slate-50">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-white border border-slate-100 flex items-center justify-center">
                                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">8 Tracks</span>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-[10px] font-black text-slate-900 uppercase tracking-widest hover:bg-white hover:shadow-md rounded-xl transition-all group-hover:translate-x-1"
                                    onClick={() => router.push(`/admin/content/universities/${uni.hid}`)}
                                >
                                    Manage <ArrowRight className="h-3 w-3 ml-2 group-hover:text-orange-500" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden relative">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="pl-12 pr-6 py-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Institute Blueprint</th>
                                    <th className="px-6 py-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Global Hub</th>
                                    <th className="px-6 py-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Pathway</th>
                                    <th className="px-6 py-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Global Ranking</th>
                                    <th className="pr-12 pl-6 py-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Registry Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {universities.map((uni) => (
                                    <tr 
                                        key={uni.hid} 
                                        onClick={() => router.push(`/admin/content/universities/${uni.hid}`)}
                                        className="group cursor-pointer hover:bg-orange-50/30 transition-all duration-300"
                                    >
                                        <td className="pl-12 pr-6 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="h-16 w-16 rounded-[1.5rem] bg-white border border-slate-100 flex items-center justify-center p-3 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                                    {(uni as any).logoUrl ? (
                                                        <img src={(uni as any).logoUrl} alt={uni.name} className="h-full w-full object-contain" />
                                                    ) : (
                                                        <Globe className="h-6 w-6 text-slate-200" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-lg font-black text-slate-900 group-hover:text-orange-600 transition-colors tracking-tight mb-1">{uni.name}</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Awaiting Program Linking</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-8">
                                            <div className="flex items-center gap-3 text-slate-600">
                                                <MapPin className="h-4 w-4 text-rose-500/50" />
                                                <span className="text-sm font-black text-slate-700">{uni.location || "United Kingdom"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-8">
                                            <Badge variant="outline" className="bg-white text-indigo-600 border-indigo-100 px-5 py-1.5 font-black text-[10px] tracking-tight rounded-full group-hover:bg-indigo-50 transition-colors uppercase">
                                                {uni.dentalSchoolPathway || "Direct Entry"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-8">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                                                    <Star className="h-5 w-5 text-amber-500 fill-amber-50" />
                                                </div>
                                                <span className="text-base font-black text-slate-900 font-sora tracking-tighter">#{uni.ranking || "—"}</span>
                                            </div>
                                        </td>
                                        <td className="pr-12 pl-6 py-8 text-right" onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-14 w-14 text-slate-400 hover:text-black hover:bg-white rounded-2xl transition-all shadow-sm">
                                                        <MoreVertical className="h-6 w-6" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-64 p-3 rounded-[1.8rem] border-slate-100 shadow-2xl">
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[.2em] text-slate-400 px-4 py-3">Operations Terminal</DropdownMenuLabel>
                                                    <DropdownMenuSeparator className="bg-slate-50 mx-2" />
                                                    <DropdownMenuItem 
                                                        className="rounded-2xl font-black text-sm p-4 gap-4 mb-1" 
                                                        onClick={() => router.push(`/admin/content/universities/${uni.hid}`)}
                                                    >
                                                        <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                                            <ArrowRight className="w-5 h-5" />
                                                        </div>
                                                        Architect Blueprint
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        onClick={() => handleAddProgramSet(uni.hid)} 
                                                        className="rounded-2xl font-black text-sm p-4 gap-4 text-emerald-600 focus:bg-emerald-50 mb-1"
                                                    >
                                                        <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                            <BookPlus className="h-5 w-5" />
                                                        </div>
                                                        Link Program
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-slate-50 mx-2" />
                                                    <DropdownMenuItem 
                                                        onClick={() => deleteMutation.mutate(uni.hid)} 
                                                        className="rounded-2xl font-black text-sm p-4 gap-4 text-rose-600 focus:bg-rose-50"
                                                    >
                                                        <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
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

            {/* ── Intelligent Pagination ── */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-10 border-t border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-50">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Mapping <span className="text-slate-900">{(currentPage * query.perPage!) + 1}—{Math.min((currentPage + 1) * query.perPage!, data?.totalElements || 0)}</span> Globally
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4 p-2 bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-50">
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={currentPage === 0}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="h-14 w-14 rounded-2xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <div className="flex items-center gap-3 px-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl shadow-slate-900/40">
                            <span className="text-base font-black text-white font-sora tracking-tighter">{currentPage + 1}</span>
                            <span className="h-4 w-px bg-white/10" />
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{totalPages} NODES</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={currentPage >= totalPages - 1}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="h-14 w-14 rounded-2xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all"
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
