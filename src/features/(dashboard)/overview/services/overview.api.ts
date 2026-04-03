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

  async GET_STUDENT_PROFILE(): Promise<StudentProfile> {
    return this.get<StudentProfile>("/student/profile");
  }

  async GET_PERSONALIZED_MENTORS(): Promise<PersonalizedMentor[]> {
    return this.get<PersonalizedMentor[]>("/student/personalized-mentors");
  }

  async GET_APPLICATION_PROGRESS(): Promise<ApplicationProgress> {
    // In production, this would be: return this.get<ApplicationProgress>("/student/roadmap-progress");
    // For now, we perform a clean "Scaffold" that returns the 11-step progress
    return Promise.resolve({
      stats: {
        total: 4,
        offers: 1,
        interviews: 2,
        rejected: 1
      },
      roadmap: Array.from({ length: 11 }, (_, i) => ({
        id: i + 1,
        isCompleted: i === 0, // Mock: Stage 1 complete
        isCurrent: i === 1    // Mock: Stage 2 active
      }))
    });
  }
}

export const overviewApi = new OverviewAPIService();
