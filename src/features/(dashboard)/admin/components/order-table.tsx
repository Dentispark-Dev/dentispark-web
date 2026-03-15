"use client";

import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/src/connection/admin-service";
import { AdminOrderRecord } from "@/src/connection/api-types";
import { format } from "date-fns";
import { 
    ShoppingBag,
    Eye,
    CheckCircle2, 
    Clock, 
    AlertCircle,
    XCircle,
    Loader2,
    ChevronDown,
    ArrowUpDown
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    PENDING:       { label: "Pending Payment", className: "bg-yellow-50 text-yellow-700 border border-yellow-200", icon: <Clock className="h-3 w-3" /> },
    PAID_IN_ESCROW:{ label: "Processing",     className: "bg-blue-50 text-blue-700 border border-blue-200",     icon: <Loader2 className="h-3 w-3 animate-spin" /> },
    ACTIVE:        { label: "On Hold",         className: "bg-orange-50 text-orange-700 border border-orange-200", icon: <AlertCircle className="h-3 w-3" /> },
    COMPLETED:     { label: "Completed",       className: "bg-green-50 text-green-700 border border-green-200",  icon: <CheckCircle2 className="h-3 w-3" /> },
    DISPUTED:      { label: "Refunded",        className: "bg-purple-50 text-purple-700 border border-purple-200", icon: <AlertCircle className="h-3 w-3" /> },
    CANCELLED:     { label: "Cancelled",       className: "bg-red-50 text-red-600 border border-red-200",        icon: <XCircle className="h-3 w-3" /> },
};

function StatusBadge({ status }: { status: string }) {
    const cfg = STATUS_CONFIG[status] ?? { 
        label: status.replace(/_/g, " "), 
        className: "bg-gray-100 text-gray-600 border border-gray-200",
        icon: <ShoppingBag className="h-3 w-3" />
    };
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${cfg.className}`}>
            {cfg.icon}
            {cfg.label}
        </span>
    );
}

interface OrderTableProps {
    onCreateOrder?: () => void;
}

export function OrderTable({ onCreateOrder }: OrderTableProps) {
    const [page, setPage] = useState(0);
    const [statusFilter, setStatusFilter] = useState<string>("ALL");

    const { data: response, isLoading } = useQuery({
        queryKey: ["admin-orders", page],
        queryFn: () => adminService.getOrderRecords({ page, perPage: 20 }),
    });

    const orders: AdminOrderRecord[] = response?.content || [];
    const filtered = statusFilter === "ALL" ? orders : orders.filter(o => o.status === statusFilter);

    return (
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
            {/* WC-style toolbar */}
            <div className="border-b border-gray-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3 bg-gray-50/60">
                <div className="flex items-center gap-1 flex-wrap">
                    {["ALL", "PENDING", "PAID_IN_ESCROW", "COMPLETED", "CANCELLED", "DISPUTED"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                                statusFilter === s 
                                    ? "bg-gray-700 text-white" 
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                        >
                            {s === "ALL" ? "All" : STATUS_CONFIG[s]?.label ?? s}
                        </button>
                    ))}
                </div>
                <Button 
                    onClick={onCreateOrder}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold h-8 px-4 rounded gap-1 flex items-center"
                >
                    + Add Order
                </Button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide w-8">
                                <input type="checkbox" className="rounded-sm" />
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">
                                <span className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                                    Order <ArrowUpDown className="h-3 w-3" />
                                </span>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Billing</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Service</th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wide">Total</th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={8} className="px-4 py-12 text-center">
                                    <div className="flex items-center justify-center gap-2 text-gray-400">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span className="text-sm">Loading orders…</span>
                                    </div>
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-4 py-12 text-center text-gray-500 text-sm">
                                    No orders found.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((order) => (
                                <tr key={order.externalId} className="hover:bg-yellow-50/30 transition-colors group">
                                    <td className="px-4 py-3">
                                        <input type="checkbox" className="rounded-sm" />
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link 
                                            href={`/admin/sales/orders/${order.externalId}`}
                                            className="font-bold text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                            #{order.externalId.slice(0, 8).toUpperCase()}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">
                                        {format(new Date(order.createdAt), "MMM d, yyyy")}
                                        <div className="text-gray-400">{format(new Date(order.createdAt), "h:mm a")}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={order.status} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm font-semibold text-gray-900">{order.studentUsername}</div>
                                        <div className="text-xs text-gray-500">Mentor: {order.mentorUsername}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm text-gray-900 font-medium">{order.servicePackage?.title ?? "Custom Order"}</div>
                                        {order.studentNotes && (
                                            <div className="text-xs text-gray-500 truncate max-w-[200px]">{order.studentNotes}</div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right font-bold text-gray-900">
                                        {order.currency} {order.totalAmount.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link 
                                                href={`/admin/sales/orders/${order.externalId}`}
                                                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded border border-blue-100 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                View
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer pagination — WC style */}
            {response && response.totalPages > 1 && (
                <div className="border-t border-gray-200 px-4 py-3 bg-gray-50/60 flex items-center justify-between text-xs text-gray-600">
                    <span>
                        {filtered.length} item{filtered.length !== 1 ? "s" : ""}
                    </span>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-7 text-xs rounded" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Previous</Button>
                        <span className="font-bold text-gray-900">Page {page + 1} of {response.totalPages}</span>
                        <Button variant="outline" size="sm" className="h-7 text-xs rounded" disabled={page >= response.totalPages - 1} onClick={() => setPage(p => p + 1)}>Next →</Button>
                    </div>
                </div>
            )}
        </div>
    );
}
