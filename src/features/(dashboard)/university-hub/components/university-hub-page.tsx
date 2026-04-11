"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, Filter, X } from "lucide-react";
import { UniversityCard } from "./university-card";
import { CompareSchoolsButton } from "./compare-schools-button";
import { UK_DENTAL_SCHOOLS } from "../constants/universities";
import { University } from "../types";
import { useModalStore } from "@/src/store/modal-store";
import { ComparisonModal } from "./comparison-modal";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";

export function UniversityHubPage() {
  const router = useRouter();
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleToggleSelection = useCallback((id: string) => {
    setSelectedUniversities((prev) =>
      prev.includes(id) ? prev.filter((uId) => uId !== id) : [...prev, id],
    );
  }, []);

  const handleViewProfile = useCallback(
    (university: University) => {
      router.push(`/university-hub/${university.slug}`);
    },
    [router],
  );

  const { openModal, closeModal } = useModalStore();

  const handleCompareSchools = useCallback(() => {
    const selectedUnis = UK_DENTAL_SCHOOLS.filter((uni) =>
      selectedUniversities.includes(uni.id),
    );

    openModal({
      modalTitle: "Compare Schools",
      modalTitleClassName: "font-jakarta text-xl font-semibold",
      bodyContent: (
        <ComparisonModal 
          universities={selectedUnis} 
          onClose={closeModal} 
        />
      ),
      action: () => {},
      actionTitle: "",
      type: "compare-schools",
      size: "xl",
      isCustomContent: true,
    });
  }, [selectedUniversities, openModal, closeModal]);

  const filteredUniversities = useMemo(() => {
    return UK_DENTAL_SCHOOLS.filter((uni) => {
      const matchesSearch = uni.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           uni.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || uni.admissionStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-text-color font-jakarta text-3xl font-extrabold tracking-tight">
              University Hub
            </h1>
            <p className="text-slate-500 font-medium">Find and compare UK dental schools</p>
          </div>
          <CompareSchoolsButton
            selectedCount={selectedUniversities.length}
            onCompare={handleCompareSchools}
          />
        </motion.div>

        {/* Filters Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-3xl border border-slate-100 p-6 mb-12 shadow-sm flex flex-col md:flex-row gap-4 items-end"
        >
          <div className="flex-1 w-full space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Search Schools</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search by name or city..." 
                className="pl-11 h-12 bg-slate-50 border-transparent focus:bg-white focus:ring-emerald-500 rounded-2xl transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full md:w-64 space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Admission Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-12 bg-slate-50 border-transparent focus:ring-emerald-500 rounded-2xl font-semibold">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(searchQuery || statusFilter !== "all") && (
            <Button 
              variant="ghost" 
              onClick={clearFilters}
              className="h-12 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-2xl px-6 font-bold"
            >
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </motion.div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-text-color font-jakarta text-2xl font-bold">
              {filteredUniversities.length} School{filteredUniversities.length !== 1 ? 's' : ''} Found
            </h2>
        </div>

        {/* Universities Grid */}
        <AnimatePresence mode="popLayout">
          {filteredUniversities.length > 0 ? (
            <motion.div
              layout
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredUniversities.map((university) => (
                <motion.div
                  key={university.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <UniversityCard
                    university={university}
                    onViewProfile={handleViewProfile}
                    isSelected={selectedUniversities.includes(university.id)}
                    onToggleSelection={handleToggleSelection}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-24 flex flex-col items-center justify-center text-center space-y-4"
            >
                <div className="size-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300">
                    <Search className="size-10" />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-slate-900">No schools match your search</h3>
                   <p className="text-slate-500 mt-1">Try adjusting your filters or clearing them.</p>
                </div>
                <Button onClick={clearFilters} className="bg-slate-900 text-white rounded-2xl h-12 px-8">
                    View All Schools
                </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer spacing */}
        <div className="h-16" />
      </div>
    </div>
  );
}
