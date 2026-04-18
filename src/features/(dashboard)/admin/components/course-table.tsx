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
    BookOpen,
    GraduationCap,
    Sparkles,
    Trash2,
    ArrowRight,
    BookPlus
} from "lucide-react";
import { adminService } from "@/src/connection/admin-service";
import { AdminCourseQuery } from "@/src/connection/api-types";
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
import { CreateCourseModal } from "./create-course-modal";
import { ProgramFetchModal } from "./program-fetch-modal";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";

interface CourseTableProps {
    universityId?: string;
}

export function CourseTable({ universityId }: CourseTableProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isFetchModalOpen, setIsFetchModalOpen] = useState(false);
    const [fetchedData, setFetchedData] = useState<any>(null);
    const queryClient = useQueryClient();
    const isStandalone = !universityId;

    const [query, setQuery] = useState<AdminCourseQuery>({
        page: 0,
        perPage: isStandalone ? 15 : 10,
        searchKey: "",
        universityId: universityId,
        degreeType: ""
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
        queryKey: ["admin-courses", query],
        queryFn: () => adminService.getCourseRecords(query),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => adminService.deleteCourse(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
            toast.success("Course registry entry removed");
        },
        onError: () => {
            toast.error("Failed to delete course record");
        }
    });

    const handlePageChange = (newPage: number) => {
        setQuery(prev => ({ ...prev, page: newPage }));
    };

    const courses = data?.content || [];
    const totalPages = data?.totalPages || 0;
    const currentPage = data?.pageNumber || 0;

    return (
        <div className={cn("space-y-6", isStandalone && "space-y-10 pb-20")}>
            {/* ── Header Card (Standalone Only) ── */}
            {isStandalone && (
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-greys-300 flex flex-col xl:flex-row gap-10 justify-between items-center relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 right-0 h-64 w-64 bg-indigo-50 rounded-bl-full opacity-40 pointer-events-none" />
                    
                    <div className="relative z-10 space-y-4 w-full xl:w-auto">
                        <div>
                            <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200 px-4 py-1.5 font-bold text-[10px] tracking-[0.25em] rounded-full uppercase mb-4 leading-none inline-flex font-jakarta">
                                Program Hub
                            </Badge>
                            <h2 className="text-4xl md:text-5xl font-semibold text-text-heading tracking-tight font-jakarta leading-tight">Academic <span className="text-indigo-600">Inventory</span></h2>
                        </div>
                        <div className="flex items-center gap-4 text-greys-500 font-medium font-jakarta">
                            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                                <BookOpen className="w-3.5 h-3.5" />
                                Course Catalog
                            </p>
                            <div className="h-1 w-1 rounded-full bg-greys-300" />
                            <p className="text-[10px] font-bold text-greys-400 uppercase tracking-widest">
                                {data?.totalElements || 0} Listed Programs
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 w-full xl:w-auto relative z-10">
                        <div className="relative group flex-1 xl:flex-none">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-greys-300 group-focus-within:text-indigo-600 transition-colors" />
                            <Input
                                placeholder="Search by course name or degree type..."
                                className="pl-14 pr-8 h-14 w-full xl:w-[450px] bg-greys-100 border-greys-300 text-text-heading placeholder:text-greys-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600/50 rounded-2xl transition-all font-medium text-sm font-jakarta"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-3 shrink-0">
                            <Button
                                variant="outline"
                                onClick={() => setIsFetchModalOpen(true)}
                                className="h-14 px-8 border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-2xl gap-3 font-bold text-xs uppercase tracking-widest active:scale-95 transition-all font-jakarta leading-none"
                            >
                                <Sparkles className="h-4 w-4" />
                                Smart Fetch
                            </Button>
                            <Button
                                onClick={() => {
                                    setFetchedData(null);
                                    setIsCreateModalOpen(true);
                                }}
                                className="bg-green-600 hover:bg-green-500 text-white h-14 px-10 rounded-2xl shadow-lg shadow-green-100 gap-3 font-bold text-xs uppercase tracking-widest active:scale-95 transition-all font-jakarta leading-none"
                            >
                                <Plus className="h-4 w-4" />
                                Add Course
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Nested View Headers (When inside University Edit) ── */}
            {!isStandalone && (
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-6 rounded-3xl border border-greys-300 shadow-sm">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-greys-400" />
                        <Input
                            placeholder="Search courses..."
                            className="pl-11 h-12 bg-greys-50 border-greys-200 focus:bg-white transition-all rounded-xl font-jakarta text-sm"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <Button
                            variant="outline"
                            onClick={() => setIsFetchModalOpen(true)}
                            className="h-12 border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 gap-2 font-bold px-5 rounded-xl transition-all font-jakarta text-xs uppercase tracking-widest"
                        >
                            <Sparkles className="h-4 w-4" />
                            Smart Fetch
                        </Button>
                        <Button
                            onClick={() => {
                                setFetchedData(null);
                                setIsCreateModalOpen(true);
                            }}
                            className="h-12 bg-green-600 hover:bg-green-700 gap-2 font-bold px-6 rounded-xl transition-all font-jakarta text-xs uppercase tracking-widest"
                        >
                            <Plus className="h-4 w-4" />
                            Add Course
                        </Button>
                    </div>
                </div>
            )}

            {/* ── Table Hub ── */}
            <div className={cn(
                "bg-white shadow-sm border border-greys-300 overflow-hidden relative",
                isStandalone ? "rounded-[2.5rem]" : "rounded-3xl"
            )}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-greys-100/50">
                                <th className={cn(
                                    "py-8 text-[10px] font-bold text-greys-400 uppercase tracking-[0.2em] font-jakarta",
                                    isStandalone ? "pl-12 pr-6" : "pl-8 pr-4"
                                )}>Course</th>
                                <th className="px-6 py-8 text-[10px] font-bold text-greys-400 uppercase tracking-[0.2em] font-jakarta">University</th>
                                <th className="px-6 py-8 text-[10px] font-bold text-greys-400 uppercase tracking-[0.2em] font-jakarta">Degree</th>
                                <th className="px-6 py-8 text-[10px] font-bold text-greys-400 uppercase tracking-[0.2em] font-jakarta">Duration</th>
                                <th className={cn(
                                    "py-8 text-[10px] font-bold text-greys-400 uppercase tracking-[0.2em] font-jakarta text-right",
                                    isStandalone ? "pr-12 pl-6" : "pr-8 pl-4"
                                )}>Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-greys-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
                                            <p className="text-greys-400 font-bold text-xs uppercase tracking-widest font-jakarta">Synchronizing Programs...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : courses.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-24 text-center">
                                        <div className="bg-greys-50 h-20 w-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                            <BookOpen className="h-8 w-8 text-greys-200" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-text-heading font-jakarta mb-2">No Programs Mapped</h3>
                                        <p className="text-greys-400 font-medium text-sm font-jakarta max-w-xs mx-auto">Use the Smart Fetch tool or add courses manually to populate the inventory.</p>
                                    </td>
                                </tr>
                            ) : (
                                courses.map((course) => (
                                    <tr 
                                        key={course.hid} 
                                        onClick={() => window.location.href = `/admin/content/courses/${course.hid}`}
                                        className="group cursor-pointer hover:bg-primary-50/30 transition-all duration-300"
                                    >
                                        <td className={cn(
                                            "py-8",
                                            isStandalone ? "pl-12 pr-6" : "pl-8 pr-4"
                                        )}>
                                            <div className="flex items-center gap-5">
                                                <div className="h-14 w-14 rounded-xl bg-white border border-greys-300 flex items-center justify-center p-3 shadow-xs group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                                    <BookOpen className="h-6 w-6 text-indigo-500" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-base font-semibold text-text-heading group-hover:text-indigo-600 transition-colors tracking-tight mb-0.5 font-jakarta truncate">{course.courseName}</p>
                                                    <p className="text-[10px] font-bold text-greys-400 uppercase tracking-widest font-jakarta truncate">{course.hid}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-8 font-jakarta">
                                            <div className="flex items-center gap-2.5 text-greys-600">
                                                <GraduationCap className="h-3.5 w-3.5 text-primary-500/50" />
                                                <span className="text-sm font-medium">{course.universityName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-8 font-jakarta">
                                            <Badge variant="outline" className="bg-white text-indigo-600 border-indigo-100 px-4 py-1 font-bold text-[10px] tracking-widest rounded-full group-hover:bg-indigo-50 transition-colors uppercase">
                                                {course.degreeType || "Undergraduate"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-8 font-jakarta">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-text-heading">{course.durationYears || "N/A"}</span>
                                                <span className="text-[10px] font-bold text-greys-400 uppercase tracking-widest">Years</span>
                                            </div>
                                        </td>
                                        <td className={cn(
                                            "py-8 text-right font-jakarta",
                                            isStandalone ? "pr-12 pl-6" : "pr-8 pl-4"
                                        )} onClick={(e) => e.stopPropagation()}>
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
                                                        onClick={() => window.location.href = `/admin/content/courses/${course.hid}`}
                                                    >
                                                        <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                                            <ArrowRight className="w-5 h-5" />
                                                        </div>
                                                        Architect Blueprint
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-greys-100 mx-2" />
                                                    <DropdownMenuItem 
                                                        onClick={() => deleteMutation.mutate(course.hid)} 
                                                        className="rounded-xl font-bold text-xs uppercase tracking-widest p-4 gap-4 text-error-600 focus:bg-error-50"
                                                    >
                                                        <div className="h-10 w-10 rounded-xl bg-error-50 text-error-600 flex items-center justify-center">
                                                            <Trash2 className="w-5 h-5" />
                                                        </div>
                                                        Inventory Purge
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

            <CreateCourseModal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setFetchedData(null);
                }}
                initialUniversityHid={universityId}
                initialData={fetchedData}
            />
            <ProgramFetchModal 
                isOpen={isFetchModalOpen}
                onClose={() => setIsFetchModalOpen(false)}
                onDataFetched={(data) => {
                    setFetchedData(data);
                    setIsCreateModalOpen(true);
                }}
            />
        </div>
    );
}
