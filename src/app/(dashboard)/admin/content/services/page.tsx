"use client";

import { 
    ServicePackageTable, 
    InitiateOrderModal,
    CreateServicePackageModal,
    StandaloneInitiateOrderModal
} from "@/src/features/(dashboard)/admin/components";
import { useState } from "react";
import { Plus, LayoutGrid, Search, Filter, ShoppingCart } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { LooseRecord } from "@/src/types/loose";

export default function AdminServicesPage() {
    const [selectedPackage, setSelectedPackage] = useState<LooseRecord | null>(null);
    const [isInitiateModalOpen, setIsInitiateModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isStandaloneOrderOpen, setIsStandaloneOrderOpen] = useState(false);

    const handleInitiateOrder = (pkg: LooseRecord) => {
        setSelectedPackage(pkg);
        setIsInitiateModalOpen(true);
    };

    return (
        <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                        <LayoutGrid className="h-8 w-8 text-green-600" />
                        Service Marketplace
                    </h1>
                    <p className="text-gray-500 font-medium">Manage mentor service packages and initiate student orders.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline"
                        onClick={() => setIsStandaloneOrderOpen(true)}
                        className="rounded-xl font-bold h-12 px-6 border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 flex items-center gap-2"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        Direct Order
                    </Button>
                    <Button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold h-12 px-6 shadow-lg shadow-green-100 flex items-center gap-2"
                    >
                        <Plus className="h-5 w-5" />
                        Add New Service
                    </Button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                        placeholder="Search services or mentors..." 
                        className="pl-11 h-12 rounded-xl border-gray-200 bg-white focus:ring-green-500 font-medium"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button variant="outline" className="rounded-xl h-12 px-4 font-bold border-gray-200 bg-white gap-2 flex-1 md:flex-none">
                        <Filter className="h-4 w-4" />
                        Filter
                    </Button>
                    <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden md:block" />
                    <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest hidden md:block">
                        Platform Marketplace Hub
                    </p>
                </div>
            </div>

            <ServicePackageTable onInitiateOrder={handleInitiateOrder} />

            <InitiateOrderModal 
                package={selectedPackage}
                isOpen={isInitiateModalOpen}
                onClose={() => setIsInitiateModalOpen(false)}
            />

            <CreateServicePackageModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            <StandaloneInitiateOrderModal 
                isOpen={isStandaloneOrderOpen}
                onClose={() => setIsStandaloneOrderOpen(false)}
            />
        </div>
    );
}
