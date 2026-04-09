"use client";

import { useState } from "react";
import { OrderTable } from "@/src/features/(dashboard)/admin/components/order-table";
import { CreateCustomOrderModal } from "@/src/features/(dashboard)/admin/components/create-custom-order-modal";
import { ShoppingCart, TrendingUp, CreditCard, Plus } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function AdminOrdersPage() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
            {/* ── WC-style page header ── */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Platform service transactions and payment requests.</p>
                </div>
                <Button
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-sm font-bold h-9 px-4 text-sm gap-2 flex items-center shadow-sm"
                >
                    <Plus className="h-4 w-4" />
                    Add Order
                </Button>
            </div>

            {/* ── Quick Stats ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-sm border border-gray-200 flex items-center gap-4">
                    <div className="h-10 w-10 rounded bg-green-50 flex items-center justify-center shrink-0">
                        <ShoppingCart className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Orders</p>
                        <p className="text-xl font-extrabold text-gray-900">—</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-sm border border-gray-200 flex items-center gap-4">
                    <div className="h-10 w-10 rounded bg-blue-50 flex items-center justify-center shrink-0">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Platform Revenue</p>
                        <p className="text-xl font-extrabold text-gray-900">—</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-sm border border-gray-200 flex items-center gap-4">
                    <div className="h-10 w-10 rounded bg-purple-50 flex items-center justify-center shrink-0">
                        <CreditCard className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Escrow Balance</p>
                        <p className="text-xl font-extrabold text-gray-900">—</p>
                    </div>
                </div>
            </div>

            {/* ── Orders Table ── */}
            <OrderTable onCreateOrder={() => setIsCreateOpen(true)} />

            {/* ── Create Custom Order Modal ── */}
            <CreateCustomOrderModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
        </div>
    );
}
