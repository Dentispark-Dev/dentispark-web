import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StageProgress {
  id: number;
  isCompleted: boolean;
  isCurrent: boolean;
}

interface DashboardState {
  // Application Progress (11 Stages)
  stages: StageProgress[];
  
  // UI Interaction States
  confettiTrigger: boolean;
  
  // Actions
  completeStage: (id: number) => void;
  toggleStage: (id: number) => void;
  setCurrentStage: (id: number) => void;
  triggerConfetti: () => void;
  resetProgress: () => void;
}

// Initial 11-Step Setup
const INITIAL_STAGES: StageProgress[] = Array.from({ length: 11 }, (_, i) => ({
  id: i + 1,
  isCompleted: false,
  isCurrent: i === 1 // Initially stage 2 is current for demo
}));

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      stages: INITIAL_STAGES,
      confettiTrigger: false,

      completeStage: (id) => set((state) => ({
        stages: state.stages.map((s) => 
          s.id === id ? { ...s, isCompleted: true } : s
        ),
        confettiTrigger: true
      })),

      toggleStage: (id) => set((state) => ({
        stages: state.stages.map((s) => 
          s.id === id ? { ...s, isCompleted: !s.isCompleted } : s
        ),
        // Only trigger confetti when marking as completed
        confettiTrigger: !state.stages.find(s => s.id === id)?.isCompleted
      })),

      setCurrentStage: (id) => set((state) => ({
        stages: state.stages.map((s) => ({
          ...s,
          isCurrent: s.id === id
        }))
      })),

      triggerConfetti: () => set({ confettiTrigger: true }),
      
      resetProgress: () => set({ stages: INITIAL_STAGES })
    }),
    {
      name: "dentispark-dashboard-storage",
    }
  )
);
