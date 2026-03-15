"use client";

import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/src/connection/admin-service";
import { format } from "date-fns";
import { 
    ArrowLeft, CheckCircle2, Clock, AlertCircle, XCircle, 
    Loader2, User, Package, FileText, DollarSign, Calendar,
    ShoppingBag
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { useParams } from "next/navigation";

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    PENDING:        { label: "Pending Payment", className: "bg-yellow-100 text-yellow-800 border border-yellow-300", icon: <Clock className="h-4 w-4" /> },
    PAID_IN_ESCROW: { label: "Processing",      className: "bg-blue-100 text-blue-800 border border-blue-300",     icon: <Loader2 className="h-4 w-4 animate-spin" /> },
    ACTIVE:         { label: "On Hold",          className: "bg-orange-100 text-orange-800 border border-orange-300", icon: <AlertCircle className="h-4 w-4" /> },
    COMPLETED:      { label: "Completed",        className: "bg-green-100 text-green-800 border border-green-300",  icon: <CheckCircle2 className="h-4 w-4" /> },
    DISPUTED:       { label: "Refunded",         className: "bg-purple-100 text-purple-800 border border-purple-300", icon: <AlertCircle className="h-4 w-4" /> },
    CANCELLED:      { label: "Cancelled",        className: "bg-red-100 text-red-700 border border-red-300",        icon: <XCircle className="h-4 w-4" /> },
};

export default function AdminOrderDetailPage() {
    const params = useParams();
    const orderId = params?.id as string;

    // We fetch all orders and find by ID since there's no single-order endpoint yet
    const { data: response, isLoading } = useQuery({
        queryKey: ["admin-orders-detail", orderId],
        queryFn: () => adminService.getOrderRecords({ page: 0, perPage: 200 }),
        enabled: !!orderId,
    });

    const order = response?.content?.find((o: any) => o.externalId === orderId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-24">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="max-w-[1200px] mx-auto p-8 space-y-4">
                <Link href="/admin/sales/orders" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                    <ArrowLeft className="h-4 w-4" /> Back to Orders
                </Link>
                <div className="bg-white border border-gray-200 rounded-sm p-12 text-center text-gray-500">
                    Order not found.
                </div>
            </div>
        );
    }

    const statusCfg = STATUS_CONFIG[order.status] ?? { 
        label: order.status, 
        className: "bg-gray-100 text-gray-700 border border-gray-200",
        icon: <ShoppingBag className="h-4 w-4" />
    };

    return (
        <div className="max-w-[1200px] mx-auto p-6 space-y-6">
            {/* ── Breadcrumb / Back ── */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link href="/admin/sales/orders" className="text-blue-600 hover:underline flex items-center gap-1">
                    <ArrowLeft className="h-3.5 w-3.5" /> Orders
                </Link>
                <span>/</span>
                <span className="text-gray-900 font-semibold">Order #{order.externalId.slice(0, 8).toUpperCase()}</span>
            </div>

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Order #{order.externalId.slice(0, 8).toUpperCase()}
                    </h1>
                    <p className="text-sm text-gray-500">
                        Payment request created on {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded text-sm font-bold ${statusCfg.className}`}>
                        {statusCfg.icon} {statusCfg.label}
                    </span>
                </div>
            </div>

            {/* ── Main grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT col (2/3): Items + Totals + Notes */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items — WC style */}
                    <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
                        <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center gap-2">
                            <Package className="h-4 w-4 text-gray-500" />
                            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Order Items</h2>
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-xs font-bold text-gray-500 uppercase border-b border-gray-100 bg-gray-50/50">
                                    <th className="px-5 py-3 text-left">Item</th>
                                    <th className="px-5 py-3 text-center">Qty</th>
                                    <th className="px-5 py-3 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-50">
                                    <td className="px-5 py-4">
                                        <div className="font-semibold text-gray-900">{order.servicePackage?.title ?? "Custom Service"}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">
                                            {order.servicePackage?.currency} {order.servicePackage?.price?.toFixed(2)} each · Mentor: {order.mentorUsername}
                                        </div>
                                        {order.studentNotes && (
                                            <div className="mt-2 text-xs text-gray-500 italic bg-gray-50 px-3 py-2 rounded border-l-2 border-gray-200">
                                                {order.studentNotes}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-center text-gray-700">1</td>
                                    <td className="px-5 py-4 text-right font-bold text-gray-900">
                                        {order.currency} {order.totalAmount?.toFixed(2)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        {/* Totals block */}
                        <div className="border-t border-gray-200 px-5 py-4 space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>{order.currency} {order.totalAmount?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-200">
                                <span>Order Total</span>
                                <span>{order.currency} {order.totalAmount?.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Notes Timeline */}
                    <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
                        <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Order Activity</h2>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="h-7 w-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                                    </div>
                                    <div className="w-0.5 bg-gray-100 flex-1 mt-1" />
                                </div>
                                <div className="pb-4">
                                    <p className="text-sm font-semibold text-gray-900">Order created by Admin</p>
                                    <p className="text-xs text-gray-500">{format(new Date(order.createdAt), "MMM d, yyyy 'at' h:mm a")}</p>
                                    <p className="text-xs text-gray-600 mt-1">Payment request sent to {order.studentUsername}.</p>
                                </div>
                            </div>
                            {order.completedAt && (
                                <div className="flex gap-4">
                                    <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Order Completed</p>
                                        <p className="text-xs text-gray-500">{format(new Date(order.completedAt), "MMM d, yyyy 'at' h:mm a")}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT col (1/3): Customer + Billing */}
                <div className="space-y-6">
                    {/* General Info */}
                    <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
                        <div className="bg-gray-50 border-b border-gray-200 px-5 py-3">
                            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">General</h2>
                        </div>
                        <div className="p-5 space-y-3 text-sm">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Order Date</p>
                                <p className="text-gray-900 font-medium flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                    {format(new Date(order.createdAt), "MMMM d, yyyy")}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Status</p>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${statusCfg.className}`}>
                                    {statusCfg.icon} {statusCfg.label}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Customer Billing */}
                    <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
                        <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center justify-between">
                            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Billing</h2>
                        </div>
                        <div className="p-5 space-y-4 text-sm">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Customer</p>
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                        <User className="h-4 w-4 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{order.studentUsername}</p>
                                        <p className="text-xs text-blue-600">Student Account</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Mentor</p>
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                                        <User className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{order.mentorUsername}</p>
                                        <p className="text-xs text-green-600">Mentor Account</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
                        <div className="bg-gray-50 border-b border-gray-200 px-5 py-3">
                            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Payment</h2>
                        </div>
                        <div className="p-5 space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Via</span><span className="font-semibold">Stripe</span>
                            </div>
                            <div className="flex justify-between text-gray-900 font-black">
                                <span>Total</span>
                                <span className="flex items-center gap-1">
                                    <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                                    {order.currency} {order.totalAmount?.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
