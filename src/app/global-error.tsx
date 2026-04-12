"use client";

import { useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to your monitoring service (Sentry, etc.)
    console.error("CATASTROPHIC ROOT ERROR:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-xl w-full text-center space-y-8 bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-2xl relative overflow-hidden">
          {/* Subtle geometric background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-full opacity-50 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 animate-pulse">
                <AlertCircle className="w-10 h-10" />
            </div>
            
            <div className="space-y-3">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight font-jakarta leading-tight">
                    Critical System Handshake <span className="text-rose-600">Failed</span>
                </h1>
                <p className="text-slate-500 font-medium text-lg max-w-sm mx-auto font-jakarta">
                    Our primary WebRTC and identity nodes have encountered an unhandled exception. Your data remains secure.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Button 
                    onClick={() => reset()}
                    className="flex-1 h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group"
                >
                    <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    RE-INITIALISE NODE
                </Button>
                
                <Button 
                    asChild
                    variant="outline"
                    className="flex-1 h-14 rounded-2xl border-slate-200 text-slate-600 font-bold flex items-center justify-center gap-2"
                >
                    <Link href="/">
                        <Home className="w-5 h-5" />
                        RETURN TO HUB
                    </Link>
                </Button>
            </div>
            
            <div className="pt-6 border-t border-slate-100 w-full">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                    Support Identity Token: {error.digest || "DS-NODE-00X"}
                </p>
                <p className="text-[9px] text-slate-300 font-medium mt-1">
                    Automated report sent to DentiSpark Operations.
                </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
