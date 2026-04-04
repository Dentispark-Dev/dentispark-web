"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Loader2, Calendar, Clock, Video, Zap, FileText, MessageSquare } from "lucide-react";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { MENTORS_BY_SLUG } from "@/src/features/(website)/mentors/data/mentors";

const SESSION_META: Record<string, { label: string; duration: string; icon: React.ReactNode; color: string; bg: string }> = {
  "intro":           { label: "Free Intro Call",          duration: "15 min", icon: <MessageSquare className="w-5 h-5" />, color: "text-emerald-600", bg: "bg-emerald-50" },
  "ucat-mentoring":  { label: "UCAT Strategy Session",    duration: "60 min", icon: <Zap className="w-5 h-5" />,          color: "text-blue-600",    bg: "bg-blue-50" },
  "ps-review":       { label: "Personal Statement Review",duration: "60 min", icon: <FileText className="w-5 h-5" />,     color: "text-indigo-600",  bg: "bg-indigo-50" },
  "mmi-prep":        { label: "MMI Mock Interview",       duration: "60 min", icon: <Video className="w-5 h-5" />,        color: "text-purple-600",  bg: "bg-purple-50" },
};

export default function CheckoutRedirectPage() {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get("session") || "ucat-mentoring";
  const sessionMeta = SESSION_META[sessionId];
  const mentor = MENTORS_BY_SLUG[slug];
  const isLoading = false; // Will be driven by Stripe redirect

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!mentor || !sessionMeta) {
    router.push("/mentorship");
    return null;
  }

  const price = sessionId === "intro" ? 0 : mentor.hourlyRate;

  const handleProceedToStripe = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mentorName: mentor.name,
          sessionType: sessionMeta.label,
          price,
          mentorSlug: slug,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        setError(data.error || "Failed to create payment session. Please try again.");
        return;
      }

      // Redirect to Stripe Checkout (or the confirmation page for free calls)
      window.location.href = data.url;
    } catch (err) {
      setError("A network error occurred. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-12">
      <Link
        href={`/mentorship/${slug}`}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to {mentor.name}'s Profile
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-slate-900">Confirm Your Booking</h1>
          <p className="text-slate-500 mt-1">Review the details before proceeding to secure payment.</p>
        </div>

        {/* Booking Summary */}
        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 space-y-5">
          {/* Mentor */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-black">
              {mentor.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <p className="font-black text-slate-900">{mentor.name}</p>
              <p className="text-slate-500 text-sm">{mentor.title}</p>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Session type */}
          <div className="flex items-center gap-4">
            <div className={cn("p-2.5 rounded-xl", sessionMeta.bg, sessionMeta.color)}>
              {sessionMeta.icon}
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">{sessionMeta.label}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Clock className="w-3 h-3 text-slate-400" />
                <span className="text-slate-400 text-xs">{sessionMeta.duration}</span>
                <Calendar className="w-3 h-3 text-slate-400 ml-2" />
                <span className="text-slate-400 text-xs">Date TBC after booking</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-600">Total</span>
            <span className="text-2xl font-black text-slate-900">
              {price === 0 ? "Free" : `${mentor.currency}${price}`}
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleProceedToStripe}
          disabled={loading}
          className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black tracking-wide shadow-md transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</>
          ) : price === 0 ? (
            "Confirm Free Intro Call →"
          ) : (
            `Pay ${mentor.currency}${price} Securely →`
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          Stripe Secure · 256-bit SSL · Money-Back Guarantee
        </div>
      </motion.div>
    </div>
  );
}
