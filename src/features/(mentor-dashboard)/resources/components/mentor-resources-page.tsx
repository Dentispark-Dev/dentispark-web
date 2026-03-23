"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ResourcesSection } from "./resources-section";
import {
  MENTOR_RESOURCES,
  DENTAL_SCIENCE_RESOURCES,
  DENTAL_HYGIENE_THERAPY_RESOURCES,
  DENTAL_NURSING_RESOURCES,
} from "../constants";
import { ResourcesPageProps } from "../types";

export function MentorResourcesPage({ className }: ResourcesPageProps) {
  const router = useRouter();

  const handleSeeAllResources = () => {
    router.push("/mentor/resources/all");
  };

  const handleSeeAllDentalResources = () => {
    router.push("/mentor/resources/dental-science");
  };

  const handleSeeAllDentalHygieneResources = () => {
    router.push("/mentor/resources/dental-hygiene");
  };

  const handleSeeAllDentalNursingResources = () => {
    router.push("/mentor/resources/dental-nursing");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`space-y-8 py-6 ${className || ""}`}
    >
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">
          Resources
        </h1>
      </div>

      {/* Resources Section */}
      <ResourcesSection
        title="Resources"
        resources={MENTOR_RESOURCES}
        onSeeAll={handleSeeAllResources}
      />

      {/* Dental Science Resources Section */}
      <ResourcesSection
        title="Dental Science Resources"
        resources={DENTAL_SCIENCE_RESOURCES}
        onSeeAll={handleSeeAllDentalResources}
      />

      {/* Dental Hygiene/Therapy Resources Section */}
      <ResourcesSection
        title="Dental Hygiene/Therapy Resources"
        resources={DENTAL_HYGIENE_THERAPY_RESOURCES}
        onSeeAll={handleSeeAllDentalHygieneResources}
      />

      {/* Dental Nursing Resources Section */}
      <ResourcesSection
        title="Dental Nursing Resources"
        resources={DENTAL_NURSING_RESOURCES}
        onSeeAll={handleSeeAllDentalNursingResources}
      />
    </motion.div>
  );
}
