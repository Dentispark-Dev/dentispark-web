import { OrderTable } from "@/src/features/(dashboard)/admin/components/order-table";
import { ShoppingCart, TrendingUp, CreditCard } from "lucide-react";

export default function AdminOrdersPage() {
    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-gray-900">Platform Sales & Orders</h1>
                <p className="text-gray-500 font-medium">Monitor and manage all service transactions across the DentiSpark platform.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center">
                        <ShoppingCart className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Sales</p>
                        <p className="text-2xl font-black text-gray-900">---</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Platform Revenue</p>
                        <p className="text-2xl font-black text-gray-900">---</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Escrow Balance</p>
                        <p className="text-2xl font-black text-gray-900">---</p>
                    </div>
                </div>
            </div>

            <OrderTable />
        </div>
    );
}
