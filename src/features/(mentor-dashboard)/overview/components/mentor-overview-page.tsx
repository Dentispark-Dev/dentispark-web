"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import { StatsCard } from "./stats-card";
import { PayoutSection } from "./payout-section";
import { LatestBookingsSection } from "./latest-bookings-section";
import { WebinarsSection } from "./webinars-section";
import { BrainCircuit, TrendingUp, Loader2, ShieldCheck, ShieldAlert, Clock } from "lucide-react";
import { useAuth } from "@/src/providers/auth-provider";
import {
  MentorOverviewPageProps,
  MentorOverviewStats,
  PayoutInfo,
} from "../types";
import { SAMPLE_MENTOR_STATS } from "../constants";

export function MentorOverviewPage({ className }: MentorOverviewPageProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<MentorOverviewStats>({
    ...SAMPLE_MENTOR_STATS,
    isVerified: false,
    isStripeConnected: false,
    guidedStudents: 0,
    averageRating: "0.0"
  });
  const [isLoading, setIsLoading] = useState(true);

  const payoutInfo: PayoutInfo = {
    isConnected: stats.isStripeConnected,
    isStripeConnected: stats.isStripeConnected,
    bankAccountLast4: stats.isStripeConnected ? "4421" : undefined,
    pendingAmount: 0 
  };

  useEffect(() => {
    if (user?.id) {
      fetchStats();
    }
  }, [user?.id]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/mentor/stats?userId=${user!.id}`);
      const data = await response.json();
      if (response.ok) {
        setStats({
          totalEarnings: parseFloat(data.totalEarnings),
          guidedStudents: data.guidedStudents,
          averageRating: data.averageRating,
          totalHours: parseFloat(data.totalHours),
          currency: data.currency || "£",
          isVerified: data.isVerified,
          isStripeConnected: data.isStripeConnected
        });
      }
    } catch (error) {
      console.error("Failed to fetch mentor stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectBankAccount = () => {
    // Redirect to Stripe Onboarding or open modal
    console.log("Connect bank account clicked");
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Intelligence...</p>
        </div>
      </div>
    );
  }

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("space-y-8 py-6 px-4 md:px-0", className)}
    >
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-black-800 font-jakarta mb-2 text-2xl font-bold">
            {getTimeGreeting()}, {user?.fullName?.split(" ")[0] || "Mentor"}
          </h1>
          <p className="text-black-300 font-jakarta font-medium">Ready to Guide Students?</p>
        </div>

        {!stats.isVerified ? (
           <div className="px-6 py-4 rounded-3xl bg-amber-50 border border-amber-100 flex items-center gap-4 shadow-sm">
              <div className="size-10 rounded-2xl bg-white flex items-center justify-center text-amber-500 shadow-sm">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-widest leading-none">Status: Pending Verification</span>
                </div>
                <p className="text-[11px] text-amber-700 font-medium max-w-xs leading-tight">Our clinical team is reviewing your GDC credentials. This usually takes 24-48 hours.</p>
              </div>
           </div>
        ) : (
          <div className="px-6 py-4 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center gap-4 shadow-sm">
              <div className="size-10 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-widest leading-none">Status: Verified Expert</span>
                </div>
                <p className="text-[11px] text-emerald-700 font-medium max-w-xs leading-tight">Your mentor profile is fully active and visible to prospective dental students.</p>
              </div>
           </div>
        )}
      </div>

      <div className="font-jakarta grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        <StatsCard
          icon={
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-600">
               <TrendingUp className="w-6 h-6" />
            </div>
          }
          title="Earnings"
          titleColor="text-secondary-500"
          value={`${stats.currency}${stats.totalEarnings.toLocaleString()}`}
          subtitle="Total platform revenue"
          className="bg-white border-white/50 shadow-sm"
          borderColor="border-secondary-100"
        />

        <StatsCard
          icon={
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
               <BrainCircuit className="w-6 h-6" />
            </div>
          }
          title="Guided"
          titleColor="text-orange-500"
          value={stats.guidedStudents.toString()}
          subtitle="Mentored Students"
          className="bg-white border-white/50 shadow-sm"
          borderColor="border-orange-100"
        />

        <StatsCard
          icon={
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
               <StarIcon />
            </div>
          }
          title="Rating"
          titleColor="text-primary-500"
          value={stats.averageRating}
          subtitle="Session feedback score"
          className="bg-white border-white/50 shadow-sm"
          borderColor="border-primary-100"
        />

        <StatsCard
          icon={
            <div className="w-12 h-12 rounded-xl bg-[#FDF0E6] flex items-center justify-center text-orange-600">
                <Clock className="w-6 h-6" />
            </div>
          }
          title="Hours"
          titleColor="text-warning-500"
          value={stats.totalHours.toString()}
          subtitle="Total hours mentored"
          className="bg-[#FDF0E6]/30 border-white/50 shadow-sm"
          borderColor="border-warning-200"
        />

        {/* Payout Section */}
        <PayoutSection
          payoutInfo={payoutInfo}
          onConnectBankAccountAction={handleConnectBankAccount}
        />

        {/* AI Class Intelligence Summary Card */}
        <div className="md:col-span-3 lg:col-span-4 glass-card p-8 rounded-[2.5rem] border-primary-100 bg-white shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center gap-10 border-l-8 border-l-primary-600 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-full bg-primary-50/50 blur-[40px] -mr-16 pointer-events-none group-hover:bg-primary-50 transition-colors" />
            <div className="flex flex-col items-center shrink-0 relative z-10">
                <div className="text-[10px] font-extrabold text-black-400 uppercase tracking-widest mb-2">Avg Spark Index</div>
                <div className="text-5xl font-extrabold text-primary-600">84.2%</div>
                <div className="text-[10px] font-bold text-green-500 uppercase flex items-center gap-1.5 mt-2">
                    <TrendingUp className="w-3.5 h-3.5" /> +2.4% this week
                </div>
            </div>
            
            <div className="h-16 w-px bg-slate-100 hidden md:block" />
            
            <div className="flex-1 space-y-4 relative z-10">
                <div className="flex items-center gap-3 text-sm font-extrabold text-slate-800 uppercase tracking-widest">
                    <BrainCircuit className="w-5 h-5 text-primary-600" /> AI Cohort Intelligence
                </div>
                <p className="text-base text-slate-500 leading-relaxed font-medium">
                    Your students are showing high competency in <span className="text-slate-800 font-bold">Academics</span>. However, 65% of your cohort have not completed a mock interview in the last 14 days. <span className="text-primary-600 font-bold italic">Recommendation:</span> Suggest an Ethics station review.
                </p>
            </div>
            
            <Button variant="outline" className="rounded-2xl h-14 px-8 border-primary-200 text-primary-700 hover:bg-primary-50 font-bold relative z-10 shadow-lg shadow-primary-500/5">
                View Cohort Report
            </Button>
        </div>
      </div>

      {/* Latest Bookings Section */}
      {/* <LatestBookingsSection bookings={[]} /> */}

      {/* Webinars Section */}
      <WebinarsSection />
    </motion.div>
  );
}

function StarIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
        </svg>
    );
}
