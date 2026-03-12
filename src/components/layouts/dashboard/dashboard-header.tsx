"use client";

import Logo from "@/src/components/icons/Logo";
import { DashboardHeaderProps } from "./types";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/src/providers/auth-provider";

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { user } = useAuth();

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
        <Link href="/admin/overview" className="cursor-pointer transition-opacity hover:opacity-80">
          <Logo className="h-16 w-32 md:h-20 md:w-48" />
        </Link>

        {/* Right side: notification + user info */}
        <div className="flex items-center space-x-4">
          {/* Notification bell */}
          <span className="text-black-500 relative cursor-pointer rounded-full">
            <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-px right-1.5 size-2.5 rounded-full bg-[#FE4648]"></span>
          </span>

          {/* User info */}
          <div className="hidden items-center space-x-3 lg:flex">
            {user?.profilePicture ? (
              <div className="flex size-10 items-center justify-center rounded-full ring-2 ring-primary/20">
                <Image
                  src={user.profilePicture}
                  alt="Profile"
                  width={40}
                  height={40}
                  priority
                  quality={85}
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
              <div className="font-sora">
                <div className="flex items-center gap-2">
                  <p className="text-black-700 text-sm font-semibold leading-tight">{user.fullName}</p>
                  {/* Online indicator */}
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 border border-green-200 px-2 py-0.5 text-[10px] font-bold text-green-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
                    Online
                  </span>
                </div>
                <p className="text-black-500 text-[10px] truncate max-w-[180px]">{user.emailAddress}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
