"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Landmark, ArrowUpRight, CheckCircle2, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils";

interface PayoutSettingsProps {
  isStripeConnected?: boolean;
  onConnect?: () => void;
}

export function PayoutSettings({ isStripeConnected = false, onConnect }: PayoutSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    // Simulate a redirect to Stripe Connect
    setTimeout(() => {
      if (onConnect) onConnect();
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-extrabold text-slate-900 font-jakarta tracking-tight">Payout Settings</h2>
        <p className="text-slate-500 font-medium">Manage how you receive your earnings from mentorship sessions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Connection Status Card */}
        <Card className="md:col-span-12 border-none shadow-xl shadow-slate-200/40 bg-white rounded-[2rem] overflow-hidden">
          <div className={cn(
            "h-2 bg-gradient-to-r",
            isStripeConnected ? "from-emerald-400 to-teal-500" : "from-indigo-500 to-blue-600"
          )} />
          <CardHeader className="p-8 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-xl",
                  isStripeConnected ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"
                )}>
                  <Landmark className="w-5 h-5" />
                </div>
                Payment Provider
              </CardTitle>
              {isStripeConnected && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-extrabold uppercase tracking-widest">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Connected
                </div>
              )}
            </div>
            <CardDescription className="text-slate-500 font-medium mt-2">
              DentiSpark uses Stripe Connect to securely process payments and distribute payouts globally.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4">
            {!isStripeConnected ? (
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Secure & Compliant</p>
                      <p className="text-sm text-slate-500">Your financial data never touches our servers. Stripe handles all KYC and security.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                      <CreditCard className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Weekly Payouts</p>
                      <p className="text-sm text-slate-500">Earnings from your sessions are automatically deposited into your bank account.</p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleConnect}
                  disabled={isLoading}
                  className="w-full sm:w-auto h-14 px-10 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/10 active:scale-95 transition-all group"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <div className="flex items-center gap-2">
                      Connect with Stripe
                      <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Available to Payout</p>
                    <p className="text-2xl font-extrabold text-slate-900">£425.00</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Pending Balance</p>
                    <p className="text-2xl font-extrabold text-slate-900">£120.00</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Total Lifetime</p>
                    <p className="text-2xl font-extrabold text-slate-900">£2,840.00</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="h-12 px-6 rounded-xl font-bold border-slate-200">
                    Go to Stripe Dashboard
                  </Button>
                  <Button variant="ghost" className="h-12 px-6 rounded-xl font-bold text-red-600 hover:bg-red-50">
                    Disconnect
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Box */}
        <div className="md:col-span-12 flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 font-medium">
            Payouts are usually processed within 3-5 business days after a session is completed. You must have a verified Stripe account to receive funds.
          </p>
        </div>
      </div>
    </div>
  );
}
