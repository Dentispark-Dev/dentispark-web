"use client";

import { useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { AlertTriangle, RefreshCcw, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log for analytics
    console.error("APP RENDERING ERROR:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-jakarta">
                Something didn't load right
            </h2>
            <p className="text-slate-500 font-medium text-sm font-jakarta leading-relaxed">
                We encountered a non-critical rendering issue. You can try refreshing this section or head back to the main overview.
            </p>
        </div>

        <div className="flex flex-col gap-3">
            <Button 
                onClick={() => reset()}
                className="h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 group"
            >
                <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                Refresh Section
            </Button>
            
            <Button 
                asChild
                variant="ghost"
                className="h-12 rounded-xl text-slate-500 font-bold hover:text-slate-900 flex items-center justify-center gap-2"
            >
                <Link href="/dashboard">
                    <LayoutDashboard className="w-4 h-4" />
                    Back to Overview
                </Link>
            </Button>
        </div>
        
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
            Error Ref: {error.digest || "APP-RENDER-ERR"}
        </p>
      </div>
    </div>
  );
}
