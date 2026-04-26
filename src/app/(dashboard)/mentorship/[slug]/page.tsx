"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star, CheckCircle2, Calendar, ArrowLeft, Clock, Users,
  MessageSquare, Video, FileText, Zap, Shield, ChevronRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { MENTORS_BY_SLUG } from "@/src/features/(website)/mentors/data/mentors";
import { cn } from "@/src/lib/utils";

// ─── Booking Session Types ──────────────────────────────────────
const SESSION_TYPES = [
  {
    id: "intro",
    icon: <MessageSquare className="w-5 h-5" />,
    label: "Free Intro Call",
    duration: "15 min",
    price: 0,
    description: "A no-obligation call to see if we're a good fit.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    id: "ucat-mentoring",
    icon: <Zap className="w-5 h-5" />,
    label: "UCAT Strategy Session",
    duration: "60 min",
    price: null, // uses mentor hourly rate
    description: "Deep-dive into UCAT prep strategy and score improvement.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    id: "ps-review",
    icon: <FileText className="w-5 h-5" />,
    label: "Personal Statement Review",
    duration: "60 min",
    price: null,
    description: "Live review of your UCAS personal statement with inline feedback.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    id: "mmi-prep",
    icon: <Video className="w-5 h-5" />,
    label: "MMI Mock Interview",
    duration: "90 min",
    price: null,
    description: "Full live MMI simulation with GDC & NHS ethics scenarios.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

// ─── Mock Reviews ────────────────────────────────────────────────
const MOCK_REVIEWS = [
  {
    id: "r1",
    name: "Aisha K.",
    date: "March 2026",
    rating: 5,
    text: "Absolutely transformed my personal statement. Got offers from King's and Birmingham after this session. 10/10.",
  },
  {
    id: "r2",
    name: "Tom H.",
    date: "February 2026",
    rating: 5,
    text: "The MMI prep was brutal but exactly what I needed. The mock scenarios were so close to the real thing at Bristol.",
  },
  {
    id: "r3",
    name: "Priya S.",
    date: "January 2026",
    rating: 4,
    text: "Great UCAT advice. My VR score went from 620 to 700 after following the strategy. Highly recommended.",
  },
];

// ─── Stat Chip ────────────────────────────────────────────────
function StatChip({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 sm:px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100">
      <div className="text-slate-400">{icon}</div>
      <span className="text-2xl font-extrabold text-slate-900">{value}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────
export default function MentorProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const mentor = MENTORS_BY_SLUG[slug];
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  if (!mentor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-2xl font-extrabold text-slate-900">Mentor not found.</p>
        <Link href="/mentorship">
          <Button variant="outline">← Back to Mentors</Button>
        </Link>
      </div>
    );
  }

  const calculateSessionPrice = (sessionId: string) => {
    if (sessionId === "intro") return 0;
    const session = SESSION_TYPES.find(s => s.id === sessionId);
    if (!session) return mentor.hourlyRate;
    
    // MMI Prep is 90 mins (60m interview + 30m feedback) = 1.5x hourly rate
    if (sessionId === "mmi-prep") return Math.round(mentor.hourlyRate * 1.5);
    
    return mentor.hourlyRate;
  };

  const handleBookSession = () => {
    if (!selectedSession) return;
    const session = SESSION_TYPES.find(s => s.id === selectedSession);
    if (!session) return;

    const price = calculateSessionPrice(selectedSession);
    const name = `${mentor.name} — ${session.label}`;

    // Route to checkout with encoded params
    router.push(
      `/mentorship/${slug}/checkout?session=${selectedSession}&price=${price}&mentor=${encodeURIComponent(name)}`
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-24">
      {/* ── Back Link ── */}
      <Link
        href="/mentorship"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Mentors
      </Link>

      {/* ── Profile Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
      >
        {/* Banner */}
        <div className="h-36 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 relative">
          <div className="absolute inset-0 opacity-30"
            style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #10b981 0%, transparent 60%), radial-gradient(circle at 70% 50%, #0ea5e9 0%, transparent 60%)" }}
          />
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          {/* Avatar + name row */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-12 mb-6">
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-[1.5rem] border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-extrabold text-3xl">
                {mentor.image ? (
                  <Image src={mentor.image} alt={mentor.name} width={96} height={96} className="object-cover w-full h-full" />
                ) : (
                  mentor.name.split(" ").map(n => n[0]).join("").slice(0, 2)
                )}
              </div>
              {mentor.verified && (
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-1 border-2 border-white">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">{mentor.name}</h1>
                  <p className="text-slate-500 font-semibold mt-1">{mentor.title}</p>
                  <p className="text-slate-400 text-sm font-medium">{mentor.credentials}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-extrabold text-slate-900">
                    {mentor.currency}{mentor.hourlyRate}
                    <span className="text-sm font-medium text-slate-400">/hr</span>
                  </p>
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mt-1">
                    {mentor.available}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rating + tag row */}
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-xl">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-extrabold text-slate-900 text-sm">{mentor.rating.toFixed(1)}</span>
              <span className="text-slate-400 text-xs">({mentor.reviewCount} reviews)</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 px-3 py-1.5 bg-slate-50 rounded-xl">
              {mentor.specialty}
            </span>
            {mentor.introCall && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl uppercase tracking-widest">
                Free Intro Call
              </span>
            )}
          </div>

          {/* Bio */}
          <p className="text-slate-600 leading-relaxed max-w-2xl">{mentor.bio}</p>
        </div>
      </motion.div>

      {/* ── Stats ── */}
      {mentor.stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatChip label="Sessions" value={mentor.stats.sessions.toLocaleString()} icon={<Video className="w-5 h-5" />} />
          <StatChip label="Mentees" value={mentor.stats.mentees.toLocaleString()} icon={<Users className="w-5 h-5" />} />
          <StatChip label="Rating" value={`${mentor.stats.rating.toFixed(1)}★`} icon={<Star className="w-5 h-5" />} />
          <StatChip label="Reviews" value={mentor.stats.reviews} icon={<MessageSquare className="w-5 h-5" />} />
        </div>
      )}

      {/* ── Two Column: Services + Booking ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Services */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Services Offered</h2>
            {mentor.services?.map(svc => (
              <div key={svc.name} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-100 mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900">{svc.name}</h3>
                  <p className="text-slate-500 text-sm mt-0.5">{svc.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Student Reviews</h2>
            {MOCK_REVIEWS.map(review => (
              <div key={review.id} className="p-6 bg-white rounded-2xl border border-slate-100 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-extrabold text-sm">
                      {review.name[0]}
                    </div>
                    <span className="font-bold text-slate-900 text-sm">{review.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-slate-400 text-xs ml-1">{review.date}</span>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="space-y-5 lg:sticky lg:top-8 lg:self-start">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
            <h2 className="text-lg font-extrabold text-slate-900 mb-4">Book a Session</h2>

            <div className="space-y-3">
              {SESSION_TYPES.map(session => {
                const sPrice = calculateSessionPrice(session.id);
                const priceLabel = session.id === "intro" ? "Free" : `${mentor.currency}${sPrice}`;
                const isSelected = selectedSession === session.id;

                return (
                  <button
                    key={session.id}
                    onClick={() => setSelectedSession(session.id)}
                    className={cn(
                      "w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200",
                      isSelected
                        ? "border-emerald-500 bg-emerald-50/60"
                        : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    <div className={cn("p-2 rounded-xl shrink-0", session.bg, session.color)}>
                      {session.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-slate-900 text-sm">{session.label}</p>
                        <span className={cn("font-extrabold text-sm shrink-0", session.price === 0 ? "text-emerald-600" : "text-slate-900")}>
                          {priceLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-400 text-xs">{session.duration}</span>
                      </div>
                      <p className="text-slate-500 text-xs mt-1 line-clamp-1">{session.description}</p>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />}
                  </button>
                );
              })}
            </div>

            <Button
              onClick={handleBookSession}
              disabled={!selectedSession}
              className="w-full mt-5 h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-extrabold tracking-wide shadow-md transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {selectedSession ? "Continue to Book" : "Select a Session"}
              {selectedSession && <ChevronRight className="w-4 h-4" />}
            </Button>

            <div className="flex items-center justify-center gap-2 mt-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              Secure checkout · SSL Encrypted
            </div>
          </div>

          {/* Guarantee pill */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-900 text-sm">DentiSpark Guarantee</p>
              <p className="text-emerald-700 text-xs mt-0.5">
                Not satisfied? Get a full refund within 24 hours, no questions asked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
