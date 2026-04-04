"use client";

import { useAuth } from "@/src/providers/auth-provider";
import { ReactNode } from "react";

type Role = "ACADEMIC_MENTOR" | "PLATFORM_ADMIN" | "PLATFORM_SYSTEM" | "STUDENT";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: Role[];
  fallback?: ReactNode;
}

/**
 * A lightweight client-side security wrapper.
 * Prevents rendering of specific UI components if the user lacks the correct role.
 */
export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // Avoid rendering flash before auth state resolves
  }

  if (!user) {
    return <>{fallback}</>;
  }

  const userRole = (user.memberType as Role) || "STUDENT";

  if (allowedRoles.includes(userRole)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
