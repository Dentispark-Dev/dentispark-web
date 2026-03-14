"use client";

import React, { useEffect, useState, useRef } from "react";
import { marketingApi, AdvertisementData } from "@/src/features/marketing/services/marketing.api";
import Link from "next/link";

export default function AdBanner({ zone }: { zone: string }) {
    const [ad, setAd] = useState<AdvertisementData | null>(null);
    const [tracked, setTracked] = useState(false);
    
    // Intersection observer to track impression when Ad becomes visible
    const ref = useRef<HTMLAnchorElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting);
        }, { threshold: 0.5 });
        
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        // Fetch ad for this zone
        // In real app, might just pick random from array. Hardcoding mock for demo if API fails.
        const mockAd: AdvertisementData = {
            externalId: `mock-ad-${zone}`,
            title: "Join the #1 UCAT Prep Course",
            advertiserName: "UCAT Masters",
            imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
            targetUrl: "https://example.com/ucat-masters",
            adZone: zone as 'HEADER_BANNER' | 'SIDEBAR_RECTANGLE' | 'IN_FEED_SPONSORED' | 'FOOTER_BANNER',
            isActive: true,
            impressionsCount: 0,
            clicksCount: 0
        };
        
        // marketingApi.GET_ADS_BY_ZONE(zone).then(ads => {
        //    if (ads.length > 0) {
        //        const randomAd = ads[Math.floor(Math.random() * ads.length)];
        //        setAd(randomAd);
        //    }
        // }).catch(() => setAd(mockAd));
        
        setAd(mockAd);
    }, [zone]);

    useEffect(() => {
        if (isVisible && ad && !tracked) {
            // Track Impression
            // marketingApi.TRACK_IMPRESSION(ad.externalId).catch(console.error);
            setTracked(true);
            console.log("Impression tracked for ad:", ad.externalId);
        }
    }, [isVisible, ad, tracked]);

    if (!ad) return null;

    const handleAdClick = () => {
        // marketingApi.TRACK_CLICK(ad.externalId).catch(console.error);
        console.log("Click tracked for ad:", ad.externalId);
    };

    return (
        <a 
          ref={ref}
          href={ad.targetUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={handleAdClick}
          className="block w-full rounded-2xl overflow-hidden relative group my-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
            <div className="absolute top-2 right-2 z-10 bg-black/40 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded backdrop-blur-md">
                Sponsored
            </div>
            
            <div className="relative h-32 md:h-48 w-full bg-gray-100 overflow-hidden">
                <img 
                   src={ad.imageUrl} 
                   alt={ad.title} 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex items-center p-6 md:p-8">
                    <div className="max-w-md">
                       <span className="text-secondary font-bold text-sm tracking-widest uppercase mb-1 block">
                           {ad.advertiserName}
                       </span>
                       <h3 className="text-white text-xl md:text-3xl font-slab font-bold mb-2">
                           {ad.title}
                       </h3>
                       <button className="text-white font-medium text-sm flex items-center group-hover:underline">
                           Learn More →
                       </button>
                    </div>
                </div>
            </div>
        </a>
    );
}
