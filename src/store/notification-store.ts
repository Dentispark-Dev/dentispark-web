import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ActivityEvent {
  id: string;
  type: "message" | "booking" | "application" | "system";
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

interface NotificationState {
  events: ActivityEvent[];
  unreadCount: number;
  
  // Actions
  addEvent: (event: Omit<ActivityEvent, "id" | "timestamp" | "isRead">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      events: [
        {
          id: "welcome-1",
          type: "system",
          title: "Welcome to DentiSpark",
          description: "Your professional journey starts here. Explore our AI Hub to get started.",
          timestamp: new Date().toISOString(),
          isRead: false,
          link: "/overview"
        }
      ],
      unreadCount: 1,

      addEvent: (event) => set((state) => {
        const newEvent: ActivityEvent = {
          ...event,
          id: Math.random().toString(36).substring(7),
          timestamp: new Date().toISOString(),
          isRead: false,
        };
        const updatedEvents = [newEvent, ...state.events].slice(0, 50); // Keep last 50
        return {
          events: updatedEvents,
          unreadCount: updatedEvents.filter(e => !e.isRead).length
        };
      }),

      markAsRead: (id) => set((state) => {
        const updatedEvents = state.events.map(e => 
          e.id === id ? { ...e, isRead: true } : e
        );
        return {
          events: updatedEvents,
          unreadCount: updatedEvents.filter(e => !e.isRead).length
        };
      }),

      markAllAsRead: () => set((state) => ({
        events: state.events.map(e => ({ ...e, isRead: true })),
        unreadCount: 0
      })),

      clearAll: () => set({ events: [], unreadCount: 0 })
    }),
    {
      name: "dentispark-notification-storage",
    }
  )
);
