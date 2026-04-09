"use client";

import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import { StatsCard } from "./stats-card";
import { PayoutSection } from "./payout-section";
import { LatestBookingsSection } from "./latest-bookings-section";
import { WebinarsSection } from "./webinars-section";
import { BrainCircuit, TrendingUp } from "lucide-react";
import {
  MentorOverviewPageProps,
  MentorOverviewStats,
  PayoutInfo,
} from "../types";
import { SAMPLE_MENTOR_STATS, SAMPLE_PAYOUT_INFO } from "../constants";

export function MentorOverviewPage({ className }: MentorOverviewPageProps) {
  const stats: MentorOverviewStats = SAMPLE_MENTOR_STATS;
  const payoutInfo: PayoutInfo = SAMPLE_PAYOUT_INFO;

  const handleConnectBankAccount = () => {
    console.log("Connect bank account clicked");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("space-y-8 py-6", className)}
    >
      <div className="mb-8">
        <h1 className="text-black-800 font-jakarta mb-2 text-xl">
          Good Morning, Dr. Sarah
        </h1>
        <p className="text-black-300 font-jakarta">Ready to Guide Students?</p>
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
          value={`${stats.currency}${stats.totalEarnings}`}
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
          value="14"
          subtitle="Mentored Students"
          className="bg-white border-white/50 shadow-sm"
          borderColor="border-orange-100"
        />

        <StatsCard
          icon={
            <svg
              width="49"
              height="48"
              viewBox="0 0 49 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.4"
                d="M11.8137 32C12.0337 31.02 11.6337 29.62 10.9337 28.92L6.0737 24.06C4.5537 22.54 3.9537 20.92 4.3937 19.52C4.8537 18.12 6.2737 17.16 8.3937 16.8L14.6337 15.76C15.5337 15.6 16.6337 14.8 17.0537 13.98L20.4937 7.08C21.4937 5.1 22.8537 4 24.3337 4C25.8137 4 27.1737 5.1 28.1737 7.08L31.6137 13.98C31.8737 14.5 32.4137 15 32.9937 15.34L11.4537 36.88C11.1737 37.16 10.6937 36.9 10.7737 36.5L11.8137 32Z"
                fill="#12ac75"
              />
              <path
                d="M37.7336 28.9198C37.0136 29.6398 36.6136 31.0198 36.8536 31.9998L38.2336 38.0198C38.8136 40.5198 38.4536 42.3998 37.2136 43.2998C36.7136 43.6598 36.1136 43.8398 35.4136 43.8398C34.3936 43.8398 33.1936 43.4598 31.8736 42.6798L26.0136 39.1998C25.0936 38.6598 23.5736 38.6598 22.6536 39.1998L16.7936 42.6798C14.5736 43.9798 12.6736 44.1998 11.4536 43.2998C10.9936 42.9598 10.6536 42.4998 10.4336 41.8998L34.7536 17.5798C35.6736 16.6598 36.9736 16.2398 38.2336 16.4598L40.2536 16.7998C42.3736 17.1598 43.7936 18.1198 44.2536 19.5198C44.6936 20.9198 44.0936 22.5398 42.5736 24.0598L37.7336 28.9198Z"
                fill="#12ac75"
              />
            </svg>
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
            <svg
              width="49"
              height="48"
              viewBox="0 0 49 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.4"
                d="M18.6665 4C13.4265 4 9.1665 8.26 9.1665 13.5C9.1665 18.64 13.1865 22.8 18.4265 22.98C18.5865 22.96 18.7465 22.96 18.8665 22.98C18.9065 22.98 18.9265 22.98 18.9665 22.98C18.9865 22.98 18.9865 22.98 19.0065 22.98C24.1265 22.8 28.1465 18.64 28.1665 13.5C28.1665 8.26 23.9065 4 18.6665 4Z"
                fill="#ED6C02"
              />
              <path
                d="M28.8264 28.2998C23.2464 24.5798 14.1464 24.5798 8.52643 28.2998C5.98643 29.9998 4.58643 32.2998 4.58643 34.7598C4.58643 37.2198 5.98643 39.4998 8.50643 41.1798C11.3064 43.0598 14.9864 43.9998 18.6664 43.9998C22.3464 43.9998 26.0264 43.0598 28.8264 41.1798C31.3464 39.4798 32.7464 37.1998 32.7464 34.7198C32.7264 32.2598 31.3464 29.9798 28.8264 28.2998Z"
                fill="#ED6C02"
              />
              <path
                opacity="0.4"
                d="M40.6467 14.6802C40.9667 18.5602 38.2067 21.9602 34.3867 22.4202C34.3667 22.4202 34.3667 22.4202 34.3467 22.4202H34.2867C34.1667 22.4202 34.0467 22.4202 33.9467 22.4602C32.0067 22.5602 30.2267 21.9402 28.8867 20.8002C30.9467 18.9602 32.1267 16.2002 31.8867 13.2002C31.7467 11.5802 31.1867 10.1002 30.3467 8.8402C31.1067 8.4602 31.9867 8.2202 32.8867 8.1402C36.8067 7.8002 40.3067 10.7202 40.6467 14.6802Z"
                fill="#ED6C02"
              />
              <path
                d="M44.6465 33.1798C44.4865 35.1198 43.2465 36.7998 41.1665 37.9398C39.1665 39.0398 36.6465 39.5598 34.1465 39.4998C35.5865 38.1998 36.4265 36.5798 36.5865 34.8598C36.7865 32.3798 35.6065 29.9998 33.2465 28.0998C31.9065 27.0398 30.3465 26.1998 28.6465 25.5798C33.0665 24.2998 38.6265 25.1598 42.0465 27.9198C43.8865 29.3998 44.8265 31.2598 44.6465 33.1798Z"
                fill="#ED6C02"
              />
            </svg>
          }
          title="hours"
          titleColor="text-warning-500"
          value={stats.totalHours}
          subtitle="Total hours mentored"
          className="bg-[#FDF0E6]"
          borderColor="border-warning-200"
        />

        {/* Payout Section */}
        <PayoutSection
          payoutInfo={payoutInfo}
          onConnectBankAccountAction={handleConnectBankAccount}
        />

        {/* NEW: AI Class Intelligence Summary Card */}
        <div className="md:col-span-3 lg:col-span-4 glass-card p-6 rounded-3xl border-primary-100 bg-white shadow-sm flex flex-col md:flex-row items-center gap-8 border-l-8 border-l-primary-600">
            <div className="flex flex-col items-center">
                <div className="text-[10px] font-extrabold text-black-400 uppercase tracking-widest mb-1">Avg Spark Index</div>
                <div className="text-4xl font-extrabold text-primary-600">84.2%</div>
                <div className="text-[10px] font-bold text-green-500 uppercase flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" /> +2.4% this week
                </div>
            </div>
            
            <div className="h-12 w-px bg-greys-100 hidden md:block" />
            
            <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 text-xs font-extrabold text-black-800 uppercase tracking-widest">
                    <BrainCircuit className="w-4 h-4 text-primary-600" /> AI Cohort Insights
                </div>
                <p className="text-sm text-black-500 leading-relaxed font-medium">
                    Your students are showing high competency in <span className="text-black-800 font-bold">Academics</span>. However, 65% of your cohort have not completed a mock interview in the last 14 days. Suggest an Ethics station review.
                </p>
            </div>
            
            <Button variant="outline" className="rounded-xl border-primary-200 text-primary-700 hover:bg-primary-50">
                View Intelligence Report
            </Button>
        </div>
      </div>

      {/* Latest Bookings Section */}
      <LatestBookingsSection />

      {/* Webinars Section */}
      <WebinarsSection />
    </motion.div>
  );
}
