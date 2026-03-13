"use client";

import React, { useState, useEffect } from "react";
import { Plus, BarChart2, MousePointerClick, Eye, CheckCircle, XCircle } from "lucide-react";
import { marketingApi, AdvertisementData, AdCreateRequest } from "@/src/features/marketing/services/marketing.api";
import { useAuth } from "@/src/providers/auth-provider";
import { useRouter } from "next/navigation";

export default function AdminMarketingDashboard() {
    const { user, isAdmin } = useAuth();
    const router = useRouter();
    const [ads, setAds] = useState<AdvertisementData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form state
    const [title, setTitle] = useState("");
    const [advertiserName, setAdvertiserName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [targetUrl, setTargetUrl] = useState("");
    const [zone, setZone] = useState("HEADER_BANNER");

    // Redirect non-admins
    useEffect(() => {
        if (user && !isAdmin) {
            router.push("/overview");
        }
    }, [user, isAdmin, router]);

    useEffect(() => {
        if (isAdmin) {
           // For demo, we are mocking the initial state since the backend API might not be fully seeded
           setAds([
               {
                   externalId: "mock-1",
                   title: "Summer Med Prep Course",
                   advertiserName: "UniAdmissions",
                   imageUrl: "https://images.unsplash.com/photo-1576091160550-2173ff9e5ee5?w=500&q=80",
                   targetUrl: "https://example.com/med",
                   adZone: "SIDEBAR_RECTANGLE",
                   isActive: true,
                   impressionsCount: 12450,
                   clicksCount: 342
               },
               {
                   externalId: "mock-2",
                   title: "Join the #1 UCAT Prep Course",
                   advertiserName: "UCAT Masters",
                   imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
                   targetUrl: "https://example.com/ucat-masters",
                   adZone: "IN_FEED_SPONSORED",
                   isActive: false,
                   impressionsCount: 89000,
                   clicksCount: 1205
               }
           ]);
           setLoading(false);
           
           /* 
             marketingApi.getAllAds() -> Needs an admin endpoint added, or we just mock for now
           */
        }
    }, [isAdmin]);

    const handleCreateAd = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload: AdCreateRequest = {
            title,
            advertiserName,
            imageUrl,
            targetUrl,
            zone
        };

        try {
            // const created = await marketingApi.CREATE_AD(payload);
            const created: AdvertisementData = {
                ...payload,
                externalId: Math.random().toString(),
                adZone: zone as 'HEADER_BANNER' | 'SIDEBAR_RECTANGLE' | 'IN_FEED_SPONSORED' | 'FOOTER_BANNER',
                isActive: true,
                impressionsCount: 0,
                clicksCount: 0
            };
            
            setAds([created, ...ads]);
            setShowModal(false);
            alert("Advertisement successfully deployed to the platform.");
            
            // Reset
            setTitle("");
            setAdvertiserName("");
            setImageUrl("");
            setTargetUrl("");
            setZone("HEADER_BANNER");
        } catch (error) {
            alert("Failed to create advertisement.");
        }
    };

    if (loading) return <div className="p-8">Loading marketing console...</div>;

    const totalImpressions = ads.reduce((sum, ad) => sum + ad.impressionsCount, 0);
    const totalClicks = ads.reduce((sum, ad) => sum + ad.clicksCount, 0);
    const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0.00";

    return (
        <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-slab font-bold text-gray-900">Marketing & Advertising</h1>
                    <p className="text-gray-500 mt-2">Manage platform sponsorships, active banners, and track campaign performance.</p>
                </div>
                <button 
                  onClick={() => setShowModal(true)}
                  className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-md hover:bg-primary/90 transition-all"
                >
                    <Plus className="w-5 h-5 mr-2" /> Launch Campaign
                </button>
            </div>

            {/* Performance Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4">
                        <Eye className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase">Total Impressions</p>
                        <h3 className="text-3xl font-bold text-gray-900">{totalImpressions.toLocaleString()}</h3>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-4">
                        <MousePointerClick className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase">Total Clicks</p>
                        <h3 className="text-3xl font-bold text-gray-900">{totalClicks.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-4">
                        <BarChart2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase">Avg. CTR</p>
                        <h3 className="text-3xl font-bold text-gray-900">{avgCtr}%</h3>
                    </div>
                </div>
            </div>

            {/* Active Campaigns Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Campaign Directory</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Campaign Info</th>
                                <th className="px-6 py-4">Zone</th>
                                <th className="px-6 py-4">Impressions</th>
                                <th className="px-6 py-4">Clicks</th>
                                <th className="px-6 py-4">CTR</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {ads.map((ad) => (
                                <tr key={ad.externalId} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        {ad.isActive ? (
                                            <span className="flex items-center text-green-600 font-bold text-sm"><CheckCircle className="w-4 h-4 mr-1"/> Active</span>
                                        ) : (
                                            <span className="flex items-center text-gray-400 font-bold text-sm"><XCircle className="w-4 h-4 mr-1"/> Paused</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                           <img src={ad.imageUrl} alt={ad.advertiserName} className="w-10 h-10 rounded object-cover mr-3 bg-gray-100" />
                                           <div>
                                               <p className="font-bold text-gray-900">{ad.title}</p>
                                               <p className="text-xs text-gray-500">{ad.advertiserName}</p>
                                           </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 bg-gray-50/50">
                                        <span className="text-xs font-bold font-mono bg-white border border-gray-200 px-2 py-1 rounded">{ad.adZone}</span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{ad.impressionsCount.toLocaleString()}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{ad.clicksCount.toLocaleString()}</td>
                                    <td className="px-6 py-4 font-bold text-primary">
                                        {ad.impressionsCount > 0 ? ((ad.clicksCount / ad.impressionsCount) * 100).toFixed(2) : "0.00"}%
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-red-500 font-bold text-sm transition-colors">Stop</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-slab font-bold">New Advertising Campaign</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        
                        <form onSubmit={handleCreateAd} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Campaign Title</label>
                                    <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. Med Prep Mastery 2026" />
                                </div>
                                
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Advertiser Name</label>
                                    <input required type="text" value={advertiserName} onChange={(e) => setAdvertiserName(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. Kaplan, UniAdmissions" />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Creative Image URL</label>
                                    <input required type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/50" placeholder="https://..." />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Destination Target URL</label>
                                    <input required type="url" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/50" placeholder="https://..." />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Placement Zone</label>
                                    <select value={zone} onChange={(e) => setZone(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/50">
                                        <option value="HEADER_BANNER">Header Banner (Top)</option>
                                        <option value="SIDEBAR_RECTANGLE">Sidebar Rectangle</option>
                                        <option value="IN_FEED_SPONSORED">In-Feed Sponsored Row</option>
                                        <option value="FOOTER_BANNER">Footer Banner</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary/90">Deploy Campaign</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
