"use client";

import Link from "next/link";
import Image from "next/image";
import { DashboardSidebarProps } from "./types";
import { useLogout } from "@/src/hooks/use-logout";
import { cn } from "@/src/lib/utils";

import { useAuth } from "@/src/providers/auth-provider";
import { useRouter } from "next/navigation";
import { LanguageSwitcher } from "../../common/language-switcher";
import { useState } from "react";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { FieldSwitcher } from "@/src/components/ui/field-switcher";

export default function DashboardSidebar({
  isOpen,
  onClose,
  menuItems,
  currentPath,
}: DashboardSidebarProps) {
  const { showLogoutModal } = useLogout();
  const router = useRouter();
  const { user, isPremium, isStudent } = useAuth();
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  return (
    <aside
      className={cn(
        "border-greys-300 bg-white-100 fixed inset-y-0 left-0 z-50 w-[300px] transform border-t transition-transform duration-300 ease-in-out lg:top-18 lg:bottom-0 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between p-6 lg:hidden border-b border-greys-100 mb-2">
          <WhiteLogo className="h-8 w-auto invert brightness-0" />
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl bg-greys-50 text-black-500 hover:bg-greys-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Field Switcher */}
        <div className="px-4 pt-4 pb-2">
           <FieldSwitcher />
        </div>

        {/* Navigation */}
        <nav className="font-jakarta mt-2 flex-1 space-y-1 px-4 py-2 text-sm overflow-y-auto">
          {menuItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedGroups.includes(item.id);
            const isActive =
              currentPath === item.href ||
              currentPath.startsWith(item.href + "/") ||
              (hasChildren && item.children?.some(child => currentPath === child.href));

            return (
              <div key={item.id} className="space-y-1">
                {hasChildren ? (
                  <button
                    onClick={() => toggleGroup(item.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3 py-2.5 font-medium transition-colors",
                      isActive ? "bg-primary-50 text-primary-700" : "text-black-600 hover:bg-greys-100",
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={cn(isActive ? "text-primary-600" : "text-black-400")}>
                        {isActive ? item.icon.active : item.icon.inactive}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    ) : (
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    )}
                  </button>
                ) : (
                    <div className="flex flex-1 items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className={cn(isActive ? "text-primary-600" : "text-black-400")}>
                          {isActive ? item.icon.active : item.icon.inactive}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      
                      {/* Notifications / Badges */}
                      {(item.badge !== undefined && item.badge > 0) ? (
                        <span className="bg-[#FE4648] text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                          {item.badge}
                        </span>
                      ) : item.dot ? (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#12AC75] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#12AC75]"></span>
                        </span>
                      ) : null}
                    </div>
                  </Link>
                )}

                {hasChildren && isExpanded && (
                  <div className="ml-9 mt-1 space-y-1 pl-4">
                    {item.children?.map((child) => {
                      const isChildActive = currentPath === child.href;
                      return (
                        <Link
                          key={child.id}
                          href={child.href}
                          className={cn(
                            "block rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                            isChildActive
                              ? "bg-primary-50 text-primary-700"
                              : "text-black-500 hover:bg-greys-50 hover:text-black-700",
                          )}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <button
            className="mt-4 flex items-center space-x-3 px-3"
            onClick={showLogoutModal}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.4414 14.62L20.0014 12.06L17.4414 9.5"
                stroke="#D32F2F"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.76172 12.0586H19.9317"
                stroke="#D32F2F"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.7617 20C7.34172 20 3.76172 17 3.76172 12C3.76172 7 7.34172 4 11.7617 4"
                stroke="#D32F2F"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-error-600">Logout</span>
          </button>

          <div className="pt-8 px-4">
            <LanguageSwitcher />
          </div>
        </nav>

        {/* Premium Upgrade UI - Only show if user is a student and not premium */}
        {isStudent && !isPremium && (
          <div className="p-4">
            <div className="bg-primary-100 rounded-2xl p-4">
              {/* Premium Badge */}
              <div className="mb-3 flex items-start gap-4">
                <Image
                  src="/images/premium-badge.png"
                  alt="Premium Badge"
                  width={1000}
                  height={1000}
                  className="w-16 object-cover"
                />

                <div>
                  <h3 className="text-primary text-xl font-semibold">
                    Premium Plan
                  </h3>

                  <p className="text-slate-500 font-jakarta mb-4 text-xs font-bold leading-relaxed">
                    Need More?
                    <br />
                    Upgrade for 1:1 Mentorship and More
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => router.push("/payment-setup")}
                className="bg-primary hover:bg-primary-400 w-full rounded-md px-4 py-3 text-sm font-medium text-white transition-colors duration-200"
              >
                Try Premium for 14 days
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
