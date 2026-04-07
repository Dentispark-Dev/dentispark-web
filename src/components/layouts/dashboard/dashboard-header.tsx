"use client";

import WhiteLogo from "@/src/components/icons/WhiteLogo";
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
    <header className="fixed top-0 right-0 left-0 z-50 h-14 border-b border-white/5 bg-[#1d2327]">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile hamburger */}
        <div className="flex items-center space-x-4 lg:hidden">
          <button onClick={onMenuClick} className="text-white/70 hover:text-white transition-colors">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Clickable logo */}
        <Link href={isAdmin ? "/admin" : isMentor ? "/mentor/overview" : "/overview"} className="cursor-pointer transition-opacity hover:opacity-80">
          <WhiteLogo className="h-10 w-24 md:h-12 md:w-32" />
        </Link>

        {/* Right side: notification + user info + logout */}
        <div className="flex items-center space-x-4 divide-x divide-white/10">
          <div className="flex items-center space-x-2 pr-4 sm:space-x-4">
            {/* Notification bell */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-slate-300 relative cursor-pointer rounded-md p-1.5 transition-colors hover:bg-white/10 focus:outline-none">
                  <Bell className="size-6" strokeWidth={1.5} />
                  <span className="absolute top-1.5 right-1.5 size-2.5 rounded-full border-2 border-[#1d2327] bg-[#FE4648]"></span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0 shadow-2xl border-slate-200">
                <DropdownMenuLabel className="p-4 font-jakarta text-sm font-bold">Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <div className="bg-slate-50 p-3 rounded-full mb-3">
                    <Bell className="h-6 w-6 text-slate-300" />
                  </div>
                  <p className="text-sm font-medium text-slate-900">No new notifications</p>
                  <p className="text-xs text-slate-500 mt-1">We'll notify you when something important happens.</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-3 text-center justify-center text-xs font-bold text-[#12AC75] cursor-pointer hover:bg-slate-50 uppercase tracking-wider">
                  View all
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Direct Logout (Visible on top as requested) */}
            <button 
              onClick={logout}
              className="group hidden sm:flex items-center gap-2 rounded-md bg-white/5 py-1.5 px-3 text-sm font-bold text-slate-200 transition-all hover:bg-[#FE4648] hover:text-white"
            >
              <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>Log Out</span>
            </button>
          </div>

          {/* User info dropdown (WordPress Style) */}
          <div className="pl-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-3 outline-none transition-all hover:bg-white/5 p-1 rounded-md active:scale-[0.98]">
                  <div className="hidden text-right font-jakarta lg:block">
                    <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold opacity-60">Howdy,</p>
                    <p className="text-white text-sm font-semibold leading-tight">{user?.fullName?.split(' ')[0]}</p>
                  </div>
                  
                  {user?.profilePicture ? (
                    <div className="flex size-9 items-center justify-center rounded-full ring-2 ring-white/10">
                      <Image
                        src={user.profilePicture}
                        alt="Profile"
                        width={36}
                        height={36}
                        className="size-9 rounded-full object-cover"
                      />
                    </div>
                  ) : user?.fullName ? (
                    <div className="bg-[#12AC75] font-jakarta flex size-9 items-center justify-center rounded-full font-bold text-white uppercase shadow-lg ring-1 ring-white/20">
                      {user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                  ) : (
                    <div className="bg-white/10 size-9 rounded-full animate-pulse" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 mt-2 shadow-2xl border-slate-200">
                <DropdownMenuLabel className="font-jakarta text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-3 opacity-60">
                   Quick Links
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer py-3 px-4 font-medium">
                  <User className="mr-3 h-4 w-4 text-slate-400" />
                  <span>Your Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/profile/settings")} className="cursor-pointer py-3 px-4 font-medium">
                  <Settings className="mr-3 h-4 w-4 text-slate-400" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/dashboard/purchases")} className="cursor-pointer py-3 px-4 font-medium">
                  <CreditCard className="mr-3 h-4 w-4 text-slate-400" />
                  <span>My Purchases</span>
                </DropdownMenuItem>
                
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/admin/settings")} className="cursor-pointer py-3 px-4 font-bold text-amber-600 bg-amber-50/30 hover:bg-amber-50 transition-colors">
                      <Shield className="mr-3 h-4 w-4" />
                      <span>Admin Controls</span>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer py-3 px-4 font-bold text-red-600 focus:text-red-700 focus:bg-red-50">
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Log Out of DentiSpark</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
