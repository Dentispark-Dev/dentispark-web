"use client";

import { 
    ServicePackageTable, 
    InitiateOrderModal,
    CreateServicePackageModal,
    StandaloneInitiateOrderModal
} from "@/src/features/(dashboard)/admin/components";
import { useState } from "react";
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
        <div className="space-y-8">
            <ServicePackageTable 
                onInitiateOrder={handleInitiateOrder} 
            />

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
