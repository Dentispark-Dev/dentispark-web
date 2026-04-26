"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/src/components/ui/breadcrumb";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { FileText } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useState, useEffect } from "react";
import { useModalStore } from "@/src/store/modal-store";
import { SuggestSlotForm } from "./suggest-slot-form";
import { AcceptBookingModal } from "./accept-booking-modal";
import { PracticeTestDetailModal } from "./practice-test-detail-modal";
import { BaseAPI } from "@/src/connection/base-api";
import { toast } from "sonner";
import { StudentSnapshotDemo } from "./student-snapshot";
import { LooseRecord } from "@/src/types/loose";

interface StudentProfilePageProps {
  className?: string;
}

export function StudentProfilePage({ className }: StudentProfilePageProps) {
  const router = useRouter();
  const [student, setStudent] = useState<LooseRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullGoals, setShowFullGoals] = useState(false);
  const [showFullWhy, setShowFullWhy] = useState(false);
  const { openModal, closeModal } = useModalStore();

  useEffect(() => {
    async function load() {
        setIsLoading(true);
        try {
            const res = await fetch("/api/mentor/student-matches"); 
            const data = await res.json();
            if (data.students && data.students.length > 0) {
                setStudent(data.students[0]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }
    load();
  }, []);

  const breadcrumbItems = [
    { label: "Student matching", href: "/mentor/student-matching" },
    { label: "Student's profile", isActive: true },
  ];

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full" />
                <div className="h-4 w-32 bg-slate-100 rounded" />
            </div>
        </div>
    );
  }

  if (!student) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
            <h2 className="h2 mb-4">Profile Unavailable</h2>
            <p className="text-slate-500 font-bold mb-8">This candidate profile is currently being verified by the DentiSpark audit team.</p>
            <Button onClick={() => router.push("/mentor/student-matching")} className="rounded-xl h-12 px-8 bg-slate-900">
                Back to Matching
            </Button>
        </div>
    );
  }

  const handleAcceptBooking = () => {
    openModal({
      modalTitle: "",
      bodyContent: (
        <AcceptBookingModal
          student={{
            name: student.name,
            year: student.year,
            avatar: student.avatar,
          }}
          booking={{
            title: student.booking?.title || "Mentoring Session",
            date: student.booking?.date || "TBD",
          }}
          onAccept={async () => {
            try {
              const api = new BaseAPI();
              await api.post("/sessions/book", {
                sessionTitle: student.booking?.title,
                inviteeEmail: student.name,
                sessionType: "MENTORING_SESSION",
              });
              toast.success("Booking accepted!", { description: `Session with ${student.name} has been confirmed.` });
            } catch {
              toast.error("Failed to accept booking", { description: "Please try again shortly." });
            }
            closeModal();
          }}
          onSuggestNewSlot={() => {
            closeModal();
            setTimeout(() => {
              handleSuggestNewSlot();
            }, 100);
          }}
        />
      ),
      type: "accept-booking",
      size: "md",
      isCustomContent: true,
      action: () => {},
      actionTitle: "",
    });
  };

  const handleSuggestNewSlot = () => {
    openModal({
      modalTitle: "Suggest New slot",
      bodyContent: (
        <SuggestSlotForm
          onSubmit={(data) => {
            toast.success("Slot suggested!", { description: `New slot on ${data.date || "selected date"} has been sent to the student.` });
            closeModal();
          }}
          onCancel={closeModal}
        />
      ),
      type: "suggest-slot",
      size: "2xl",
      isCustomContent: true,
      action: () => {},
      actionTitle: "",
    });
  };

  return (
    <div className={cn("min-h-screen bg-white py-6", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <Breadcrumb items={breadcrumbItems} />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <div className="flex items-center gap-8">
                <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-[2rem] border-4 border-slate-50 shadow-xl shadow-slate-200/50">
                  <Image
                    src={student.avatar}
                    alt={student.name}
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <span className="caption-caps">Candidate Profile</span>
                  <h1 className="h2">{student.name}</h1>
                  <p className="text-slate-500 font-bold text-lg">{student.year}</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-6">
                 {[
                    { label: "Preferred School", value: student.preferredSchool },
                    { label: "UCAT Score", value: student.ucatScore },
                    { label: "A-Level Predicted", value: student.aLevelScore }
                 ].map(stat => (
                    <div key={stat.label} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 min-w-[160px]">
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                        <p className="text-sm font-extrabold text-slate-900">{stat.value}</p>
                    </div>
                 ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="h3">Strategic Goals</h2>
              <p className="text-slate-600 font-medium text-lg leading-relaxed">
                {showFullGoals ? student.goals : `${student.goals?.substring(0, 300)}...`}
              </p>
              {!showFullGoals && (
                <Button variant="link" onClick={() => setShowFullGoals(true)} className="text-emerald-600 font-extrabold p-0 h-auto">Read Full Narrative</Button>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="h3">Why Dentistry?</h2>
              <p className="text-slate-600 font-medium text-lg leading-relaxed">
                {student.whyDentistry}
              </p>
            </div>
          </div>

          <div className="space-y-8 lg:col-span-1">
             <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/20">
                <h3 className="text-xl font-extrabold mb-2">{student.booking?.title || "Mentoring Session"}</h3>
                <p className="text-slate-400 font-bold mb-8">{student.booking?.date || "Schedule Pending"}</p>
                
                <div className="space-y-4">
                    <Button onClick={handleAcceptBooking} className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-extrabold text-xs uppercase tracking-widest transition-all">
                        Initialize Session
                    </Button>
                    <Button onClick={handleSuggestNewSlot} variant="ghost" className="w-full h-14 text-slate-400 hover:text-white rounded-2xl font-bold">
                        Suggest Alternative
                    </Button>
                </div>
             </div>

             <Card className="rounded-[2.5rem] p-8 border-slate-100 shadow-sm">
                <h3 className="h4 mb-6">Candidate Intelligence</h3>
                <StudentSnapshotDemo />
             </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
