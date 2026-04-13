"use client";

import { useState } from "react";
import { cn } from "@/src/lib/utils";
import { StudentMatchingCard } from "@/src/components/molecules/student-matching-card";
import { useRouter } from "next/navigation";
import { TrendingUp } from "lucide-react";
import { LooseRecord } from "@/src/types/loose";

type FilterTab = "all" | "personal-statement" | "ucat";

interface Student {
  id: string;
  name: string;
  year: string;
  avatar: string;
  preferredSchool: string;
  ucatScore: string;
  aLevelScore: string;
  category: "all" | "personal-statement" | "ucat";
}

interface LatestBookingsSectionProps {
  className?: string;
  bookings?: LooseRecord[];
}

export function LatestBookingsSection({
  className,
  bookings = [],
}: LatestBookingsSectionProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  const displayBookings = bookings.length > 0 
    ? bookings.map(b => ({
        id: b.id,
        name: b.studentName,
        year: "Dental Applicant",
        avatar: "/images/latest-booking.png", // Fallback avatar
        preferredSchool: "Awaiting Input",
        ucatScore: "TBD",
        aLevelScore: "TBD",
        category: "all" as const,
        date: new Date(b.date).toLocaleDateString()
      }))
    : [];

  const handleProceed = (studentId: string) => {
    router.push(`/mentor/student-matching/${studentId}`);
  };

  const handleViewProfile = (studentId: string) => {
    router.push(`/mentor/student-matching/${studentId}`);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-jakarta text-black-800 text-xl font-bold">
          Latest bookings
        </h2>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {["all", "personal-statement", "ucat"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab as FilterTab)}
              className={cn(
                "font-jakarta rounded-xl px-4 py-2 text-sm font-bold transition-all uppercase tracking-tighter",
                activeFilter === tab
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                  : "bg-white text-slate-500 hover:text-slate-900 border border-slate-100",
              )}
            >
              {tab.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Grid */}
      {displayBookings.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayBookings.map((student) => (
            <StudentMatchingCard
              key={student.id}
              student={student}
              onProceed={() => handleProceed(student.id)}
              onViewProfile={() => handleViewProfile(student.id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center rounded-[3rem] bg-slate-50 border border-slate-100 text-center">
             <div className="size-16 rounded-2xl bg-white flex items-center justify-center text-slate-300 mb-4 shadow-sm">
                <TrendingUp className="size-8" />
             </div>
             <h3 className="text-lg font-bold text-slate-900">No active bookings yet</h3>
             <p className="text-slate-500 text-sm font-medium mt-1">Your recent activity will appear here once students book sessions.</p>
        </div>
      )}
    </div>
  );
}
