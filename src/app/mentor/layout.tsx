"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/src/components/auth/protected-route";
import {
    DashboardSidebar,
    DashboardHeader,
    MobileMenuOverlay,
    menuItems,
} from "@/src/components/layouts/dashboard";
import { usePathname } from "next/navigation";

export default function MentorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    return (
        <ProtectedRoute requiresProfile>
            <div className="bg-background-body flex min-h-screen">
                <MobileMenuOverlay
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
                <DashboardSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    menuItems={menuItems}
                    currentPath={pathname}
                />
                <div className="flex w-full flex-col lg:pl-64">
                    <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />
                    <main className="bg-background-body flex-1 p-4 md:p-6 lg:p-8">
                        <div className="mx-auto max-w-[1600px]">{children}</div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
