"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/src/components/auth/protected-route";
import {
    DashboardSidebar,
    DashboardHeader,
    MobileMenuOverlay,
    getFilteredMenuItems,
} from "@/src/components/layouts/dashboard";
import { usePathname } from "next/navigation";
import { useAuth } from "@/src/providers/auth-provider";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const { user } = useAuth();

    // Filter menu items based on logged-in user's role
    const filteredMenuItems = getFilteredMenuItems(user?.memberType as "STUDENT" | "ACADEMIC_MENTOR" | "PLATFORM_ADMIN" | "PLATFORM_SYSTEM" | "MODERATOR" | undefined);

    // Hide sidebar and header on onboarding/profile setup pages if they live here
    const isProfileSetup = pathname.includes("/profile-setup");

    if (isProfileSetup) {
        return <ProtectedRoute>{children}</ProtectedRoute>;
    }

    return (
        <ProtectedRoute requiresProfile>
            <div className="bg-background-body flex min-h-screen">
                {/* Mobile Menu Overlay */}
                <MobileMenuOverlay
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />

                {/* Sidebar */}
                <DashboardSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    menuItems={filteredMenuItems}
                    currentPath={pathname}
                />

                {/* Main Content Area */}
                <div className="flex w-full flex-col lg:pl-[300px]">
                    <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />

                    <main className="bg-background-body flex-1 p-4 md:p-6 lg:p-8">
                        <div className="mx-auto max-w-[1600px]">{children}</div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
