import { BaseAPI } from "@/src/connection/base-api";
import type { AcademicProfile } from "@/src/connection/api-types";

export interface UpdateStudentProfileRequest {
  fullName?: string;
  mobileNumber?: string;
  country?: string;
  education?: string;
  profilePicture?: string;
  linkedinUrl?: string;
  biography?: string;
  whyDentistry?: string;
}

export interface UpdateAcademicProfileRequest {
  yearOfStudy?: string;
  gcseResult?: string;
  ucatScore?: string;
  casperScore?: string;
  goals?: string;
  biologyGrade?: string;
  chemistryGrade?: string;
  otherSubject?: string;
  otherSubjectGrade?: string;
}

export interface StudentProfileData {
  fullName: string;
  emailAddress: string;
  mobileNumber?: string;
  profilePicture?: string;
  linkedinProfileUrl?: string;
  biography?: string;
  whyDentistry?: string;
}

class ProfileAPIService extends BaseAPI {
  constructor() {
    super();
  }

  async GETACADEMICPROFILE(): Promise<AcademicProfile> {
    return this.get<AcademicProfile>("/student/academic-profile");
  }

  async UPDATESTUDENTPROFILE(
    payload: UpdateStudentProfileRequest,
  ): Promise<StudentProfileData> {
    return this.patch<StudentProfileData>("/student/profile", payload);
  }

  async UPDATEACADEMICPROFILE(
    payload: UpdateAcademicProfileRequest,
  ): Promise<AcademicProfile> {
    return this.patch<AcademicProfile>("/student/academic-profile", payload);
  }
}

const profileAPIService = new ProfileAPIService();

export { profileAPIService };
