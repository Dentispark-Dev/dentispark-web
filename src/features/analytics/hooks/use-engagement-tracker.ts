"use client";

import { useEffect, useState } from "react";

interface EngagementState {
  lastActive: string;
  sessions: number;
  streak: number;
  toolsUsed: string[];
}

export function useEngagementTracker() {
  const [engagement, setEngagement] = useState<EngagementState>({
    lastActive: new Date().toISOString(),
    sessions: 1,
    streak: 12, // Mocked for UI demonstration
    toolsUsed: []
  });

  useEffect(() => {
    // In a real app, this would sync with a backend or localStorage
    const trackActivity = () => {
      console.log("[Analytics] Tracking student engagement event...");
    };

    trackActivity();
    
    // Simulate periodic engagement pulses
    const interval = setInterval(trackActivity, 60000);
    return () => clearInterval(interval);
  }, []);

  const trackToolUsage = (toolId: string) => {
    setEngagement(prev => ({
      ...prev,
      toolsUsed: prev.toolsUsed.includes(toolId) ? prev.toolsUsed : [...prev.toolsUsed, toolId]
    }));
    console.log(`[Analytics] Tool used: ${toolId}`);
  };

  return { engagement, trackToolUsage };
}
