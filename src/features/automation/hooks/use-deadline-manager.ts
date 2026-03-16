"use client";

import { useState, useEffect } from "react";
import { useField } from "@/src/providers/field-provider";

export interface Deadline {
  id: string;
  title: string;
  date: string; // ISO format
  type: "major" | "minor";
  description?: string;
}

const DEFAULT_DEADLINES: Deadline[] = [
  { id: "ucas-main", title: "UCAS Medicine/Dentistry Deadline", date: "2026-10-15T18:00:00Z", type: "major" },
];

export function useDeadlineManager() {
  const { activeField } = useField();
  const [deadlines, setDeadlines] = useState<Deadline[]>(DEFAULT_DEADLINES);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const fetchDeadlines = async () => {
        try {
            const response = await fetch("/api/ai/automation/deadlines", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    targetUniversities: ["King's College London", "UCL"], // Future: get from profile
                    field: activeField 
                }),
            });
            const data = await response.json();
            if (data.deadlines) setDeadlines(data.deadlines);
        } catch (error) {
            console.error(error);
        }
    };
    fetchDeadlines();
  }, [activeField]);

  useEffect(() => {
    if (!deadlines.length) return;
    const target = new Date(deadlines[0].date).getTime();

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
  }, [deadlines]);

  return { deadlines, timeLeft, mainDeadline: deadlines[0] || DEFAULT_DEADLINES[0] };
}
