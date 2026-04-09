"use client";

import { useQuery } from "@tanstack/react-query";
import { marketplaceApi } from "@/src/features/marketplace/services/marketplace.api";
import { ShoppingBag, Package, Clock, CheckCircle2, AlertCircle, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

export default function StudentPurchasesPage() {
    const { data: response, isLoading } = useQuery({
        queryKey: ["student-orders"],
        queryFn: () => marketplaceApi.GET_STUDENT_ORDERS(0, 10),
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "COMPLETED": return "bg-green-100 text-green-700 border-green-200";
            case "PENDING": return "bg-gray-100 text-gray-700 border-gray-200";
            case "PAID_IN_ESCROW": return "bg-blue-100 text-blue-700 border-blue-200";
            case "ACTIVE": return "bg-purple-100 text-purple-700 border-purple-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "COMPLETED": return <CheckCircle2 className="h-4 w-4" />;
            case "PENDING": return <Clock className="h-4 w-4" />;
            case "DISPUTED": return <AlertCircle className="h-4 w-4" />;
            default: return <Package className="h-4 w-4" />;
        }
    };

    return (
        <div className="p-6 space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-extrabold text-gray-900">My Purchases</h1>
                <p className="text-gray-500 font-medium">Track and manage your service orders and mentoring packages.</p>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center p-20 text-green-600">
                    <div className="animate-spin h-10 w-10 border-4 border-current border-t-transparent rounded-full" />
                </div>
            ) : response?.data.length === 0 ? (
                <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-16 text-center">
                    <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="h-8 w-8 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No purchases yet</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">You haven't purchased any mentoring services or packages yet. Explore our marketplace to get started!</p>
                    <Button asChild className="bg-green-600 hover:bg-green-700 h-12 px-8 rounded-xl font-bold">
                        <Link href="/mentorship">Explore Marketplace</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {response?.data.map((order) => (
                        <div key={order.externalId} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                                        <Package className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{order.servicePackage.title}</h3>
                                        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-gray-500 font-medium">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {format(new Date(order.createdAt), "MMM d, yyyy")}
                                            </span>
                                            <span className="font-bold text-gray-900">
                                                {order.currency} {order.totalAmount.toLocaleString()}
                                            </span>
                                            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600">ID: #{order.externalId.slice(0, 8)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusStyle(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        {order.status.replace(/_/g, " ")}
                                    </div>
                                    <Button variant="outline" size="sm" className="rounded-lg font-bold border-gray-200">
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
