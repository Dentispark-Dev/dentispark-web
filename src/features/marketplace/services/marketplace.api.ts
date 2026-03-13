import { BaseAPI } from "@/src/connection/base-api";

export interface ServicePackage {
  externalId: string;
  mentorUsername: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  durationMinutes: number;
  featuresJson: string;
  serviceType: string;
  isActive: boolean;
}

export interface ServiceOrder {
  externalId: string;
  studentUsername: string;
  mentorUsername: string;
  servicePackage: ServicePackage;
  totalAmount: number;
  currency: string;
  status: string;
  studentNotes: string;
  createdAt: string;
  completedAt?: string;
  stripePaymentUrl?: string;
}

export interface ServicePackageCreateRequest {
  title: string;
  description: string;
  price: number;
  currency: string;
  durationMinutes: number;
  featuresJson: string;
  serviceType: string;
  isActive: boolean;
}

export interface OrderCreateRequest {
  packageSlug: string;
  studentNotes: string;
}

export interface PagedResponse<T> {
  data: T[];
  totalElements: number;
  totalPages: number;
}

class MarketplaceAPIService extends BaseAPI {
  constructor() {
    super();
  }

  async GET_MENTOR_PACKAGES(mentorUsername: string): Promise<ServicePackage[]> {
    return this.get<ServicePackage[]>(`/marketplace/packages/mentor/${mentorUsername}`);
  }

  async GET_PACKAGE_BY_SLUG(slug: string): Promise<ServicePackage> {
    return this.get<ServicePackage>(`/marketplace/packages/${slug}`);
  }

  async CREATE_PACKAGE(payload: ServicePackageCreateRequest): Promise<ServicePackage> {
    return this.post<ServicePackage>("/marketplace/packages", payload);
  }

  async UPDATE_PACKAGE(slug: string, payload: ServicePackageCreateRequest): Promise<ServicePackage> {
    return this.put<ServicePackage>(`/marketplace/packages/${slug}`, payload);
  }

  async INITIATE_ORDER(payload: OrderCreateRequest): Promise<ServiceOrder> {
    return this.post<ServiceOrder>("/marketplace/orders", payload);
  }

  async GET_STUDENT_ORDERS(page = 0, size = 10): Promise<PagedResponse<ServiceOrder>> {
    return this.get<PagedResponse<ServiceOrder>>(`/marketplace/orders/student?page=${page}&size=${size}`);
  }

  async GET_MENTOR_ORDERS(page = 0, size = 10): Promise<PagedResponse<ServiceOrder>> {
    return this.get<PagedResponse<ServiceOrder>>(`/marketplace/orders/mentor?page=${page}&size=${size}`);
  }

  async COMPLETE_ORDER(orderExternalId: string): Promise<ServiceOrder> {
    return this.post<ServiceOrder>(`/marketplace/orders/${orderExternalId}/complete`, {});
  }
}

export const marketplaceApi = new MarketplaceAPIService();
