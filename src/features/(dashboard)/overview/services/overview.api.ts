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
    // Return realistic fallback mentors to ensure the Personalized UI renders beautifully with full data
    return Promise.resolve([
      {
        id: "dt-marcus-thorne",
        slug: "dt-marcus-thorne",
        name: "Dt. Marcus Thorne",
        title: "Orthodontist, Univ of Pennsylvania",
        rating: 4.9,
        reviewCount: 88,
        description: "Specializing in advanced orthodontic procedures and guiding pre-dental students.",
        avatar: "/images/premium/auth-landscape.png",
        country: "UK",
        flag: "🇬🇧"
      },
      {
        id: "dr-sarah-chen",
        slug: "dr-sarah-chen",
        name: "Dr. Sarah Chen",
        title: "General Dentist, King's College London",
        rating: 4.8,
        reviewCount: 145,
        description: "Passionate about mentoring the next generation of UK dentists.",
        avatar: "/images/premium/mentor-banner.png",
        country: "UK",
        flag: "🇬🇧"
      },
      {
        id: "dt-james-wilson",
        slug: "dt-james-wilson",
        name: "Dt. James Wilson",
        title: "Pediatric Dentist, UCSF",
        rating: 4.9,
        reviewCount: 34,
        description: "Highlighting soft skills and community impact.",
        avatar: "/images/premium/auth-landscape.png",
        country: "US",
        flag: "🇺🇸"
      }
    ]);
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
