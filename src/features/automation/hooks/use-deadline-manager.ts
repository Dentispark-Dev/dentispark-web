"use client";

import { useState, useEffect } from "react";

export interface Deadline {
  id: string;
  title: string;
  date: string; // ISO format
  type: "major" | "minor";
}

const DEFAULT_DEADLINES: Deadline[] = [
  { id: "ucas-main", title: "UCAS Medicine/Dentistry Deadline", date: "2026-10-15T18:00:00Z", type: "major" },
  { id: "transcript-sub", title: "Transcript Submission", date: "2026-11-01T23:59:59Z", type: "minor" },
  { id: "interview-invite", title: "First Interview Invites", date: "2026-12-10T09:00:00Z", type: "minor" }
];

export function useDeadlineManager() {
  const [deadlines] = useState<Deadline[]>(DEFAULT_DEADLINES);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const target = new Date(DEFAULT_DEADLINES[0].date).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft(null);
      }
    };

    const interval = setInterval(updateTimer, 1000);
    updateTimer();

    return () => clearInterval(interval);
  }, []);

  return { deadlines, timeLeft, mainDeadline: DEFAULT_DEADLINES[0] };
}
