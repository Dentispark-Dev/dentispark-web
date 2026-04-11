import { apiClient } from "@/src/connection";
import type { ApiResponse } from "@/src/connection/api-types";
import { ScheduleSlot } from "../types";

export const scheduleApi = {
  getAvailability: async (userId: string): Promise<ApiResponse<{ availability: ScheduleSlot[] | null }>> => {
    return apiClient.getFullResponse<{ availability: ScheduleSlot[] | null }>(
      `/mentor/availability?userId=${userId}`
    );
  },

  updateAvailability: async (userId: string, availability: ScheduleSlot[]): Promise<ApiResponse<{ success: boolean; availability: ScheduleSlot[] }>> => {
    return apiClient.postFullResponse<{ success: boolean; availability: ScheduleSlot[] }>(
      "/mentor/availability",
      { userId, availability }
    );
  },
};
