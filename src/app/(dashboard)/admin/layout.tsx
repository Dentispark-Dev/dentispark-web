"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/providers/auth-provider";
import { Loader2 } from "lucide-react";

/**
 * AdminGuard - Wraps the admin section to enforce role-based access.
 * Non-admin users attempting to access /admin routes are redirected
 * to /overview, preventing the admin UI shell from leaking.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const isAdmin =
    user?.memberType === "PLATFORM_ADMIN" || user?.memberType === "PLATFORM_SYSTEM";

  useEffect(() => {
    if (!isLoading && user && !isAdmin) {
      router.replace("/overview");
    }
  }, [isLoading, user, isAdmin, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Redirect handled by effect above
  }

  return <>{children}</>;
}
