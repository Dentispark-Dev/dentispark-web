import { BaseAPI } from "@/src/connection/base-api";

export interface AdvertisementData {
    externalId: string;
    title: string;
    advertiserName: string;
    imageUrl: string;
    targetUrl: string;
    adZone: 'HEADER_BANNER' | 'SIDEBAR_RECTANGLE' | 'IN_FEED_SPONSORED' | 'FOOTER_BANNER';
    isActive: boolean;
    impressionsCount: number;
    clicksCount: number;
}

export interface AdCreateRequest {
    title: string;
    advertiserName: string;
    imageUrl: string;
    targetUrl: string;
    zone: string;
}

class MarketingAPIService extends BaseAPI {
    constructor() {
        super();
    }

    async GET_ADS_BY_ZONE(zone: string): Promise<AdvertisementData[]> {
        return this.get<AdvertisementData[]>(`/marketing/ads/zone/${zone}`);
    }

    async TRACK_IMPRESSION(externalId: string): Promise<void> {
        return this.post<void>(`/marketing/ads/${externalId}/impression`, {});
    }

    async TRACK_CLICK(externalId: string): Promise<void> {
        return this.post<void>(`/marketing/ads/${externalId}/click`, {});
    }

    async CREATE_AD(payload: AdCreateRequest): Promise<AdvertisementData> {
        return this.post<AdvertisementData>("/marketing/ads", payload);
    }
}

export const marketingApi = new MarketingAPIService();
