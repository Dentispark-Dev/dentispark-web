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
    Send
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/src/components/ui/button";

interface ServicePackageTableProps {
    onInitiateOrder?: (pkg: any) => void;
}

export function ServicePackageTable({ onInitiateOrder }: ServicePackageTableProps) {
    const [page, setPage] = useState(0);

    const { data: response, isLoading } = useQuery({
        queryKey: ["admin-packages", page],
        queryFn: () => adminService.getServicePackageRecords({ page, perPage: 10 }),
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    const packages = response?.content || [];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Service Title</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Mentor</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type & Duration</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {packages.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No service packages found.
                                </td>
                            </tr>
                        ) : (
                            packages.map((pkg) => (
                                <tr key={pkg.externalId} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                                                <Package className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm">{pkg.title}</div>
                                                <div className="text-xs text-gray-500 truncate max-w-[200px]">{pkg.description || "No description"}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{pkg.mentorUsername}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-600 font-bold">
                                                <Tag className="h-3 w-3" />
                                                {pkg.serviceType || "Mentoring"}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                <Clock className="h-3 w-3" />
                                                {pkg.durationMinutes} Minutes
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-extrabold text-gray-900">
                                            {pkg.currency} {pkg.price.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {pkg.isActive ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-green-100 text-green-700 border border-green-200">
                                                <CheckCircle2 className="h-3 w-3" />
                                                ACTIVE
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gray-100 text-gray-600 border border-gray-200">
                                                <XCircle className="h-3 w-3" />
                                                INACTIVE
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="h-8 rounded-lg font-bold text-xs gap-1 border-gray-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200"
                                                onClick={() => onInitiateOrder?.(pkg)}
                                            >
                                                <Send className="h-3 w-3" />
                                                Send Order
                                            </Button>
                                            <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                                                <MoreVertical className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {response && response.totalPages > 1 && (
                <div className="p-4 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                        Page {page + 1} of {response.totalPages}
                    </p>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 rounded-lg font-bold"
                            disabled={page === 0}
                            onClick={() => setPage(p => p - 1)}
                        >
                            Previous
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 rounded-lg font-bold"
                            disabled={page >= response.totalPages - 1}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
