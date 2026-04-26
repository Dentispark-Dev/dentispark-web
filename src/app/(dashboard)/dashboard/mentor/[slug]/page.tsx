"use client";

import { notFound, useRouter } from "next/navigation";
import React, { useState, useEffect, use } from "react";
import { MentorProfileView } from "@/src/features/profile/components/mentor-profile-view";
import { MENTORS_BY_SLUG } from "@/src/features/(website)/mentors/data/mentors";

interface MentorDashboardPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function MentorDashboardPage({ params }: MentorDashboardPageProps) {
  const router = useRouter();
  const { slug } = use(params);

  const mentor = MENTORS_BY_SLUG[slug];

  if (!mentor && slug) {
    notFound();
  }

  if (!slug) return null;

  // Normalize mentor to match MentorProfile interface in MentorProfileView
  const normalizedMentor = mentor ? {
    ...mentor,
    availability: mentor.available,
    stats: mentor.stats || { rating: mentor.rating, sessions: 0, mentees: 0 },
    services: mentor.services || []
  } : null;

  return (
    <MentorProfileView 
      mentor={normalizedMentor as any} 
      isDashboard={true} 
      onBack={() => router.push("/mentorship")} 
    />
  );
}
