"use client";

import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/src/connection/admin-service";
import { AdminOrderRecord } from "@/src/connection/api-types";
import { format } from "date-fns";
import { 
    ShoppingBag, 
    User, 
    Calendar, 
    MoreVertical, 
    CheckCircle2, 
    Clock, 
    AlertCircle,
    Package
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/src/components/ui/button";

export function OrderTable() {
    const [page, setPage] = useState(0);

    const { data: response, isLoading } = useQuery({
        queryKey: ["admin-orders", page],
        queryFn: () => adminService.getOrderRecords({ page, perPage: 10 }),
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "COMPLETED": return "bg-green-100 text-green-700 border-green-200";
            case "PAID_IN_ESCROW": return "bg-blue-100 text-blue-700 border-blue-200";
            case "ACTIVE": return "bg-purple-100 text-purple-700 border-purple-200";
            case "PENDING": return "bg-gray-100 text-gray-700 border-gray-200";
            case "DISPUTED": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "COMPLETED": return <CheckCircle2 className="h-3 w-3" />;
            case "PENDING": return <Clock className="h-3 w-3" />;
            case "DISPUTED": return <AlertCircle className="h-3 w-3" />;
            default: return <Package className="h-3 w-3" />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    const orders = response?.data || [];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order & Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Service Package</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No orders found on the platform.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.externalId} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                                                <ShoppingBag className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm">#{order.externalId.slice(0, 8)}</div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {format(new Date(order.createdAt), "MMM d, yyyy")}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-full bg-gray-100">
                                                <User className="h-3 w-3 text-gray-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{order.studentUsername}</div>
                                                <div className="text-xs text-gray-500 font-bold uppercase">To: {order.mentorUsername}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-gray-900">{order.servicePackage.title}</div>
                                        <div className="text-xs text-gray-500 truncate max-w-[200px]">
                                            {order.studentNotes || "No student notes provided"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-black text-gray-900">
                                            {order.currency} {order.totalAmount.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status.replace(/_/g, " ")}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {response && response.totalPages > 1 && (
                <div className="p-6 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-500 font-medium">
                        Showing page <span className="text-gray-900">{page + 1}</span> of <span className="text-gray-900">{response.totalPages}</span>
                    </p>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={page === 0}
                            onClick={() => setPage(p => p - 1)}
                        >
                            Previous
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
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
