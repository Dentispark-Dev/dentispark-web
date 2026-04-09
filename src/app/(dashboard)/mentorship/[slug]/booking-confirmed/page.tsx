"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Calendar, Video, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import confetti from "canvas-confetti";
import { useEffect } from "react";

export default function BookingConfirmedPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
      </div>
    }>
      <BookingConfirmedContent />
    </Suspense>
  );
}

function BookingConfirmedContent() {
  const searchParams = useSearchParams();
  const session = searchParams.get("session") || "your session";
  const isFree = searchParams.get("free") === "true";

  useEffect(() => {
    // Fire celebration confetti
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ["#10b981", "#0ea5e9", "#8b5cf6", "#f59e0b"],
    });
  }, []);

  return (
    <div className="max-w-lg mx-auto py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 text-center space-y-8"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto"
        >
          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        </motion.div>

        {/* Text */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Booking Confirmed!</h1>
          <p className="text-slate-500 mt-3 leading-relaxed">
            {isFree
              ? `Your free intro call has been requested. Your mentor will reach out within 24 hours to confirm the time.`
              : `Your payment for "${session}" was successful. You'll receive a confirmation email with your video link shortly.`}
          </p>
        </div>

        {/* Next steps */}
        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 text-left space-y-4">
          <p className="font-bold text-slate-700 text-sm uppercase tracking-widest">What happens next?</p>
          <div className="space-y-3">
            {[
              { icon: <Calendar className="w-4 h-4 text-emerald-600" />, text: "Your mentor will confirm the exact session time via email." },
              { icon: <Video className="w-4 h-4 text-blue-600" />, text: "A secure video room link will be sent to you 1 hour before your session." },
              { icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />, text: "Your roadmap stage will auto-update once the session is complete." },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">{step.icon}</div>
                <p className="text-slate-600 text-sm">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Button asChild className="h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-extrabold">
            <Link href="/overview">
              Go to My Dashboard <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-12 rounded-xl font-bold border-slate-200">
            <Link href="/mentorship">Browse More Mentors</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
