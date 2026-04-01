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

export interface ApplicationProgress {
  total: number;
  interviews: number;
  rejected: number;
  interviewWaitlist: number;
  attended: number;
  declined: number;
  offers: number;
  waitlist: number;
  rejection: number;
  noResponse: number;
  accepted: number;
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
    // Mock data for a single student (e.g. applying to 4 dental schools via UCAS)
    return Promise.resolve({
      total: 4,
      interviews: 2,
      rejected: 2,
      interviewWaitlist: 0,
      attended: 2,
      declined: 0,
      offers: 1,
      waitlist: 1,
      rejection: 0,
      noResponse: 0,
      accepted: 1
    });
  }
}

export const overviewApi = new OverviewAPIService();
