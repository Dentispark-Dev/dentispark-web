"use client";

import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/src/connection/admin-service";
import { 
    Package, 
    MoreVertical, 
    Clock, 
    Tag, 
    CheckCircle2, 
    XCircle,
    Plus,
    Send,
    AlertCircle,
    ArrowRight,
    Trash2,
    Settings2,
    Search,
    ChevronLeft,
    ChevronRight,
    Loader2
} from "lucide-react";
import { useState, useCallback } from "react";
import { Button } from "@/src/components/ui/button";
import { LooseRecord } from "@/src/types/loose";
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
import { useSearch } from "@/src/hooks/use-search";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ServicePackageTableProps {
    onInitiateOrder?: (pkg: LooseRecord) => void;
}

export function ServicePackageTable({ onInitiateOrder }: ServicePackageTableProps) {
    const [page, setPage] = useState(0);

    const { data: response, isLoading, isError, error } = useQuery({
        queryKey: ["admin-packages", page],
        queryFn: () => adminService.getServicePackageRecords({ page, perPage: 15 }),
    });

    const handleSearch = useCallback((val: string) => {
        // Search logic not yet fully implemented in backend for packages, but UI is ready
    }, []);

    const {
        value: searchInput,
        setValue: setSearchInput,
    } = useSearch({
        paramName: "searchKey",
        onSearch: handleSearch
    });

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    if (isError) {
        return (
            <div className="bg-red-50 border border-red-100 p-12 rounded-[2.5rem] text-center space-y-6 shadow-sm animate-in fade-in duration-500 font-jakarta">
                <div className="bg-red-100 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto text-red-600 shadow-sm rotate-3">
                    <AlertCircle className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-red-900 font-extrabold text-2xl tracking-tight">Marketplace Hub Offline</h3>
                    <p className="text-red-600 font-medium max-w-md mx-auto">{(error as Error)?.message || "Security session mismatch or backend failure detected (Code 95/500)."}</p>
                </div>
                <div className="pt-4">
                    <Button 
                        variant="outline" 
                        onClick={() => window.location.reload()} 
                        className="h-14 rounded-2xl border-red-200 text-red-700 hover:bg-red-100 font-bold px-10 transition-all active:scale-95 uppercase text-xs tracking-widest"
                    >
                        Retry Connection
                    </Button>
                </div>
            </div>
        );
    }

    const packages = response?.content || [];
    const totalPages = response?.totalPages || 0;
    const currentPage = response?.pageNumber || 0;

    return (
        <div className="space-y-10 pb-20">
            {/* ── Marketplace Header ── */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-greys-300 flex flex-col xl:flex-row gap-8 justify-between items-center relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 h-48 w-48 bg-green-50 rounded-bl-full opacity-40 pointer-events-none" />
                
                <div className="relative z-10 space-y-3 w-full xl:w-auto">
                    <div>
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 px-4 py-1.5 font-extrabold text-[11px] tracking-[0.3em] rounded-full uppercase mb-3 leading-none inline-flex font-jakarta">
                            Service Marketplace
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-semibold text-text-heading tracking-tight font-jakarta leading-tight">Professional <span className="text-green-600">Packages</span></h2>
                    </div>
                    <div className="flex items-center gap-4 text-greys-500 font-medium font-jakarta">
                        <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest flex items-center gap-2">
                            <Settings2 className="w-3.5 h-3.5" />
                            Provider Directory
                        </p>
                        <div className="h-1 w-1 rounded-full bg-greys-300" />
                        <p className="text-[10px] font-bold text-greys-400 uppercase tracking-widest">
                            {response?.totalElements || 0} Registered Services
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto relative z-10">
                    <div className="relative group flex-1 xl:flex-none">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-greys-300 group-focus-within:text-green-600 transition-colors" />
                        <Input
                            placeholder="Search by package title or mentor..."
                            className="pl-14 pr-8 h-12 w-full xl:w-[400px] bg-greys-100 border-greys-300 text-text-heading placeholder:text-greys-400 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-orange-600/50 rounded-2xl transition-all font-medium text-sm font-jakarta"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 shrink-0">
                        <Button
                            className="bg-primary-600 hover:bg-primary-500 text-white h-12 px-8 rounded-2xl shadow-lg shadow-primary-100 gap-2 font-bold text-[11px] uppercase tracking-widest active:scale-95 transition-all font-jakarta leading-none"
                        >
                            <Plus className="h-4 w-4" />
                            Create Package
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
                                <th className="pl-12 pr-6 py-5 text-[10px] font-bold text-greys-400 uppercase tracking-[0.2em] font-jakarta">Service Hub</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-greys-400 uppercase tracking-[0.2em] font-jakarta">Mentor Provider</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-greys-400 uppercase tracking-[0.2em] font-jakarta">Type & Runtime</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-greys-400 uppercase tracking-[0.2em] font-jakarta">Commercials</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-greys-400 uppercase tracking-[0.2em] font-jakarta">Status</th>
                                <th className="pr-12 pl-6 py-5 text-[10px] font-bold text-greys-400 uppercase tracking-[0.2em] font-jakarta text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-greys-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
                                            <p className="text-greys-400 font-bold text-xs uppercase tracking-widest font-jakarta">Synchronizing Inventory...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : packages.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-24 text-center text-gray-400 font-jakarta uppercase font-bold text-sm tracking-widest">
                                        No active service packages found.
                                    </td>
                                </tr>
                            ) : (
                                packages.map((pkg: any) => (
                                    <tr key={pkg.externalId} className="hover:bg-green-50/20 transition-all group cursor-pointer">
                                        <td className="pl-12 pr-6 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="h-12 w-12 rounded-xl bg-white border border-greys-300 flex items-center justify-center p-2.5 shadow-xs group-hover:scale-110 group-hover:rotate-2 transition-transform duration-500">
                                                    <Package className="h-6 w-6 text-green-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-text-heading group-hover:text-green-600 transition-colors tracking-tight mb-0.5 font-jakarta truncate">{pkg.title}</p>
                                                    <p className="text-[10px] font-bold text-greys-400 uppercase tracking-widest font-jakarta truncate max-w-[200px] italic">Commercial Resource</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-jakarta">
                                            <div className="flex items-center gap-2.5 text-greys-600">
                                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                                <span className="text-xs font-medium">{pkg.mentorUsername}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-jakarta">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2 text-[10px] text-greys-400 font-bold uppercase tracking-widest">
                                                    <Tag className="h-3 w-3 text-green-500" />
                                                    {pkg.serviceType || "Mentoring"}
                                                </div>
                                                <div className="flex items-center gap-2 text-[11px] text-greys-600 font-bold">
                                                    <Clock className="h-3 w-3 text-greys-400" />
                                                    {pkg.durationMinutes} Minutes
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-jakarta">
                                            <div className="flex items-baseline gap-1.5 text-base font-extrabold text-text-heading tracking-tight">
                                                <span className="text-[10px] text-greys-400 font-bold uppercase tracking-widest">{pkg.currency}</span>
                                                {pkg.price.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-jakarta text-[10px] font-bold uppercase tracking-widest">
                                            {pkg.isActive ? (
                                                <Badge className="bg-green-50 text-green-600 border-green-200 px-4 py-1.5 rounded-full font-bold">
                                                    <CheckCircle2 className="h-3 w-3 mr-2" />
                                                    ACTIVE
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-white text-greys-400 border-greys-200 px-4 py-1.5 rounded-full font-bold">
                                                    <XCircle className="h-3 w-3 mr-2" />
                                                    INACTIVE
                                                </Badge>
                                            )}
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
                                                        className="rounded-xl font-bold text-xs uppercase tracking-widest p-4 gap-4 mb-1 text-green-600 focus:bg-green-50" 
                                                        onClick={() => onInitiateOrder?.(pkg)}
                                                    >
                                                        <div className="h-10 w-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                                                            <Send className="w-5 h-5" />
                                                        </div>
                                                        Dispatch Order
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        className="rounded-xl font-bold text-xs uppercase tracking-widest p-4 gap-4 mb-1" 
                                                    >
                                                        <div className="h-10 w-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                                                            <ArrowRight className="w-5 h-5" />
                                                        </div>
                                                        Architect Blueprint
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-greys-100 mx-2" />
                                                    <DropdownMenuItem 
                                                        className="rounded-xl font-bold text-xs uppercase tracking-widest p-4 gap-4 text-error-600 focus:bg-error-50"
                                                    >
                                                        <div className="h-10 w-10 rounded-xl bg-error-50 text-error-600 flex items-center justify-center">
                                                            <Trash2 className="w-5 h-5" />
                                                        </div>
                                                        Market Purge
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
                                Mapping <span className="text-text-heading">{(currentPage * 15) + 1}—{Math.min((currentPage + 1) * 15, response?.totalElements || 0)}</span> Entry Nodes
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
        </div>
    );
}
