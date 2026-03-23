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
}

export const overviewApi = new OverviewAPIService();
