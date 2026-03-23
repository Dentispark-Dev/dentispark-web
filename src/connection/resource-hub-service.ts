import BaseAPI from "@/src/connection/base-api";

export interface Scholarship {
  externalId: string;
  title: string;
  slug: string;
  description: string;
  amountValue: number;
  amountCurrency: string;
  deadline: string | null;
  eligibilityCriteriaJson: string;
  applicationLink: string;
  isSponsored: boolean;
  targetDegreeLevel: string;
  targetLocation: string;
  fundingType?: string;
  numberOfAwards?: string;
  selectionBasis?: string;
  coversJson?: string;
  intakeYear?: string;
  gender?: string;
  nationality?: string;
  studyMode?: string;
}

export interface AcademicProgram {
  externalId: string;
  title: string;
  slug: string;
  universityName: string;
  degreeLevel: string;
  description: string;
  acceptanceRate: number;
  keyMetricsJson: string;
  isSponsored: boolean;
  location: string;
}

export interface PagedResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  data: T[];
}

export class ResourceHubApi extends BaseAPI {
  async getScholarships(params?: {
    degreeLevel?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<PagedResponse<Scholarship>> {
    const query = new URLSearchParams();
    if (params?.degreeLevel) query.append("degreeLevel", params.degreeLevel);
    if (params?.pageNumber !== undefined) query.append("pageNumber", params.pageNumber.toString());
    if (params?.pageSize !== undefined) query.append("pageSize", params.pageSize.toString());

    return this.get(`/resource-hub/scholarships?${query.toString()}`);
  }

  async getScholarshipBySlug(slug: string): Promise<Scholarship> {
    return this.get(`/resource-hub/scholarships/${slug}`);
  }

  async getAcademicPrograms(params?: {
    degreeLevel?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<PagedResponse<AcademicProgram>> {
    const query = new URLSearchParams();
    if (params?.degreeLevel) query.append("degreeLevel", params.degreeLevel);
    if (params?.pageNumber !== undefined) query.append("pageNumber", params.pageNumber.toString());
    if (params?.pageSize !== undefined) query.append("pageSize", params.pageSize.toString());

    return this.get(`/resource-hub/programs?${query.toString()}`);
  }

  async getAcademicProgramBySlug(slug: string): Promise<AcademicProgram> {
    return this.get(`/resource-hub/programs/${slug}`);
  }
}
