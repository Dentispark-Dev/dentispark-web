"use client";

import { useEffect, useState } from "react";
import { cn } from "@/src/lib/utils";
import { useRouter } from "next/navigation";
import { TrendingUp, CheckCircle, XCircle, Loader2, Calendar, Clock, User } from "lucide-react";
import { LooseRecord } from "@/src/types/loose";
import { Button } from "@/src/components/ui/button";
import { toast } from "sonner";

interface LatestBookingsSectionProps {
  className?: string;
  bookings?: LooseRecord[];
}

export function LatestBookingsSection({
  className,
  bookings: initialBookings = [],
}: LatestBookingsSectionProps) {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>(initialBookings);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    setBookings(initialBookings);
  }, [initialBookings]);

  const handleApprove = async (bookingId: string) => {
    setIsProcessing(bookingId);
    try {
      const response = await fetch("/api/mentor/bookings/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Booking confirmed!");
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: "CONFIRMED" } : b));
      } else {
        toast.error(data.error || "Failed to approve booking");
      }
    } catch (error) {
      console.error("Approval Error:", error);
      toast.error("An error occurred");
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="font-jakarta text-black-800 text-xl font-bold">
          Session Requests
        </h2>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
           <span>Total: {bookings.length}</span>
        </div>
      </div>

      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-all">
               <div className="flex items-center gap-4">
                  <div className="size-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
                     {booking.studentAvatar ? <img src={booking.studentAvatar} alt={booking.studentName} className="size-full object-cover" /> : <User className="size-6" />}
                  </div>
                  <div>
                     <h3 className="font-bold text-slate-900 text-lg">{booking.studentName}</h3>
                     <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                           <Calendar className="size-3.5 text-primary-600" />
                           {new Date(booking.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                           <Clock className="size-3.5 text-primary-600" />
                           {booking.time}
                        </div>
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  {booking.status === "PENDING" ? (
                    <>
                      <Button 
                        onClick={() => handleApprove(booking.id)}
                        disabled={!!isProcessing}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold gap-2 px-6 shadow-lg shadow-emerald-500/10 active:scale-95 transition-all"
                      >
                        {isProcessing === booking.id ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle className="size-4" />}
                        Approve Session
                      </Button>
                      <Button 
                        variant="outline"
                        className="rounded-xl border-slate-200 text-slate-600 font-bold gap-2 active:scale-95 transition-all"
                      >
                        <XCircle className="size-4" />
                        Decline
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm border border-emerald-100">
                       <CheckCircle className="size-4" />
                       Confirmed
                    </div>
                  )}
                  <Button 
                    variant="ghost"
                    onClick={() => router.push(`/mentor/student-matching/${booking.studentId}`)}
                    className="rounded-xl text-primary-600 font-bold hover:bg-primary-50"
                  >
                    View Student Profile
                  </Button>
               </div>
            </div>
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
