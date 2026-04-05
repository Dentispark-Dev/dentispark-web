"use client";

import Logo from "@/src/components/icons/Logo";
import { DashboardHeaderProps } from "./types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/providers/auth-provider";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/src/components/ui/dropdown-menu";
import { Bell, LogOut, User, Settings, CreditCard, Shield } from "lucide-react";

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { user, isAdmin, isMentor, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="border-greys-300 bg-whites-200 fixed top-0 right-0 left-0 z-50 border-b">
      <div className="flex h-18 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile hamburger */}
        <div className="flex items-center space-x-4 lg:hidden">
          <button onClick={onMenuClick}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Clickable logo */}
        <Link href={isAdmin ? "/admin" : isMentor ? "/mentor/overview" : "/overview"} className="cursor-pointer transition-opacity hover:opacity-80">
          <Logo className="h-16 w-32 md:h-20 md:w-48" />
        </Link>

        {/* Right side: notification + user info */}
        <div className="flex items-center space-x-4">
          {/* Notification bell */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-black-500 relative cursor-pointer rounded-full p-1.5 transition-colors hover:bg-slate-100 focus:outline-none">
                <Bell className="size-7" strokeWidth={1.5} />
                <span className="absolute top-1.5 right-1.5 size-2.5 rounded-full border-2 border-white bg-[#FE4648]"></span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
              <DropdownMenuLabel className="p-4 font-sora text-sm font-bold">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className="bg-slate-50 p-3 rounded-full mb-3">
                  <Bell className="h-6 w-6 text-slate-300" />
                </div>
                <p className="text-sm font-medium text-slate-900">No new notifications</p>
                <p className="text-xs text-slate-500 mt-1">We'll notify you when something important happens.</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-3 text-center justify-center text-xs font-bold text-primary cursor-pointer hover:bg-slate-50">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User info */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-3 outline-none transition-all hover:opacity-90 active:scale-[0.98]">
                {user?.profilePicture ? (
                  <div className="flex size-10 items-center justify-center rounded-full ring-2 ring-primary/20">
                    <Image
                      src={user.profilePicture}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="size-10 rounded-full object-cover"
                    />
                  </div>
                ) : user?.fullName ? (
                  <div className="bg-primary font-sora flex size-10 items-center justify-center rounded-full font-bold text-white uppercase ring-2 ring-primary/20">
                    {user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                ) : (
                  <div className="bg-primary/30 size-10 rounded-full" />
                )}

                {user?.fullName && (
                  <div className="hidden text-left font-sora lg:block">
                    <div className="flex items-center gap-2">
                      <p className="text-black-700 text-sm font-semibold leading-tight">{user.fullName}</p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 border border-green-200 px-2 py-0.5 text-[10px] font-bold text-green-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
                        Online
                      </span>
                    </div>
                    <p className="text-black-500 text-[10px] truncate max-w-[150px]">{user.emailAddress}</p>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2">
              <DropdownMenuLabel className="font-sora text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-2">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer py-2.5 px-3">
                <User className="mr-2 h-4 w-4" />
                <span>View Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/profile/settings")} className="cursor-pointer py-2.5 px-3">
                <Settings className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/dashboard/purchases")} className="cursor-pointer py-2.5 px-3">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Purchases & Billing</span>
              </DropdownMenuItem>
              
              {isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/admin/settings")} className="cursor-pointer py-2.5 px-3 text-amber-600">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Admin Controls</span>
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer py-2.5 px-3 text-red-600 focus:text-red-600 focus:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
