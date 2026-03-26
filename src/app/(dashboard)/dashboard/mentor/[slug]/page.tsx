"use client";

import { notFound, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { MentorProfileView } from "@/src/features/profile/components/mentor-profile-view";
import { MENTORS_BY_SLUG } from "@/src/features/(website)/mentors/data/mentors";

interface MentorDashboardPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function MentorDashboardPage({ params }: MentorDashboardPageProps) {
  const router = useRouter();
  const [slug, setSlug] = useState<string>("");

  useEffect(() => {
    params.then(p => setSlug(p.slug));
  }, [params]);

  const mentor = MENTORS_BY_SLUG[slug];

  if (!mentor && slug) {
    // Fallback/Redirect or notFound
    notFound();
  }

  if (!slug) return null;

  return (
    <MentorProfileView 
      mentor={mentor} 
      isDashboard={true} 
      onBack={() => router.push("/mentorship")} 
    />
  );
}
