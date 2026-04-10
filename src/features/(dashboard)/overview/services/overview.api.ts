import { BaseAPI } from "@/src/connection/base-api";

export interface StudentProfile {
  fullName: string;
  emailAddress: string;
  mobileNumber?: string;
  profilePicture?: string;
  yearOfStudy?: string;
}

export interface PersonalizedMentor {
  id: string;
  slug: string;
  name: string;
  title: string;
  rating: number;
  reviewCount: number;
  description: string;
  avatar: string;
  country: string;
  flag: string;
}

export interface RoadmapStage {
  id: number;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface ApplicationProgress {
  // Stats for the visual counters
  stats: {
    total: number;
    offers: number;
    interviews: number;
    rejected: number;
  };
  // Detailed roadmap progress (the 11 steps)
  roadmap: RoadmapStage[];
}

class OverviewAPIService extends BaseAPI {
  constructor() {
    super();
  }

  async GET_STUDENT_PROFILE(): Promise<StudentProfile | null> {
    try {
      return await this.get<StudentProfile>("/student/profile");
    } catch (error) {
      console.warn("API Error: GET_STUDENT_PROFILE failed", error);
      return null;
    }
  }

  async GET_PERSONALIZED_MENTORS(): Promise<PersonalizedMentor[]> {
    try {
      const response = await this.get<{ mentors: PersonalizedMentor[] }>("/student/profile/matching-mentors");
      return response?.mentors || [];
    } catch (error) {
      console.warn("API Error: GET_PERSONALIZED_MENTORS failed", error);
      return [];
    }
  }

  async GET_APPLICATION_PROGRESS(): Promise<ApplicationProgress> {
    try {
      return await this.get<ApplicationProgress>("/student/roadmap-progress");
    } catch (error) {
      // Return a clean zero-state if the API is not yet active
      return {
        stats: { total: 0, offers: 0, interviews: 0, rejected: 0 },
        roadmap: Array.from({ length: 11 }, (_, i) => ({
          id: i + 1,
          isCompleted: false,
          isCurrent: i === 0
        }))
      };
    }
  }
}

export const overviewApi = new OverviewAPIService();
