"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { UniversityCard } from "./university-card";
import { CompareSchoolsButton } from "./compare-schools-button";
import { UK_DENTAL_SCHOOLS } from "../constants/universities";
import { University } from "../types";
import { useModalStore } from "@/src/store/modal-store";
import { ComparisonModal } from "./comparison-modal";

export function UniversityHubPage() {
  const router = useRouter();
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);

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

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 flex items-center justify-between"
        >
          <h1 className="text-text-color text-2xl font-semibold">
            University Hub
          </h1>
          <CompareSchoolsButton
            selectedCount={selectedUniversities.length}
            onCompare={handleCompareSchools}
          />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-text-color mb-6 text-2xl font-semibold"
        >
          UK Dental Schools
        </motion.h2>

        {/* Universities Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {UK_DENTAL_SCHOOLS.map((university, index) => (
            <motion.div
              key={university.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
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

        {/* Footer spacing */}
        <div className="h-16" />
      </div>
    </div>
  );
}
