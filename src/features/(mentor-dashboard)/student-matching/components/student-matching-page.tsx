"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";
import { StudentMatchingCard } from "@/src/components/molecules/student-matching-card";
import { MOCK_STUDENTS } from "../constants";
import { FilterTab } from "../types";

interface StudentMatchingPageProps {
  className?: string;
}

export function StudentMatchingPage({ className }: StudentMatchingPageProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);

  // Simulated fetch for real students
  useState(() => {
    async function load() {
        setIsLoading(true);
        try {
            const res = await fetch("/api/mentor/student-matches");
            const data = await res.json();
            setStudents(data.students || []);
        } catch (err) {
            console.error("Failed to load students", err);
        } finally {
            setIsLoading(false);
        }
    }
    load();
  }, []);

  const filteredStudents = students.filter((student) => {
    if (activeFilter === "all") return true;
    return student.category === activeFilter;
  });

  const handleProceed = (studentId: string) => {
    router.push(`/mentor/student-matching/${studentId}`);
  };

  const handleViewProfile = (studentId: string) => {
    router.push(`/mentor/student-matching/${studentId}`);
  };

  return (
    <div className={cn("min-h-screen bg-transparent py-10", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-10"
      >
        {/* Page Header with Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="caption-caps">Deployment Phase • Application 2026/27</span>
            <h1 className="h2 pb-2">Student Intelligence Matching</h1>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit">
            {[
              { id: "all", label: "All Applicants" },
              { id: "personal-statement", label: "PS Review" },
              { id: "ucat", label: "UCAT Strategy" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={cn(
                  "font-jakarta rounded-lg px-6 py-2.5 text-xs font-extrabold uppercase tracking-widest transition-all",
                  activeFilter === tab.id
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-slate-400 hover:text-slate-600",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Students Grid */}
        {filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student.id || index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <StudentMatchingCard
                  student={student}
                  onProceed={() => handleProceed(student.id)}
                  onViewProfile={() => handleViewProfile(student.id)}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          /* Premium Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[500px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-12 text-center"
          >
            <div className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-slate-200/50 flex items-center justify-center mb-8">
              <span className="text-4xl">🔎</span>
            </div>
            <h3 className="h3 mb-3">Syncing Candidate Pipeline...</h3>
            <p className="text-slate-500 font-bold max-w-md mx-auto leading-relaxed mb-10">
              Our AI is currently auditing incoming UK dental school applications. Once matched based on your specialty, candidates will appear here instantly.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" className="rounded-xl px-8 h-12 font-bold border-slate-200">
                Refresh Intelligence
              </Button>
              <Button className="rounded-xl px-8 h-12 font-bold bg-slate-900">
                Update My Specialty
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
