"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, CheckCircle, Package } from "lucide-react";
import { marketplaceApi, ServicePackage } from "@/src/features/marketplace/services/marketplace.api";
import { useAuth } from "@/src/providers/auth-provider";

export default function MentorServicesPage() {
    const { user } = useAuth();
    const [packages, setPackages] = useState<ServicePackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [duration, setDuration] = useState("60");
    const [features, setFeatures] = useState("");
    const [serviceType, setServiceType] = useState("Tutoring");

    // In a real scenario, this fetches actual data; for demo we pre-fill a mock package
    useEffect(() => {
        if (user) {
            // Mocking initial load for the demo
            setPackages([
                {
                    externalId: "mock-1",
                    mentorUsername: user.emailAddress || "dr_mentor",
                    title: "1-on-1 Interview Prep",
                    slug: "1-on-1-interview-prep",
                    description: "A comprehensive mock interview session tailored to your desired dental school.",
                    price: 150.0,
                    currency: "USD",
                    durationMinutes: 60,
                    featuresJson: '["Mock Interview", "Detailed Feedback", "Recording Included"]',
                    serviceType: "Interview Prep",
                    isActive: true
                }
            ]);
            setLoading(false);
            
            /*
            marketplaceApi.GET_MENTOR_PACKAGES(user.emailAddress)
                .then(setPackages)
                .catch(console.error)
                .finally(() => setLoading(false));
            */
        }
    }, [user]);

    const handleCreatePackage = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const newPackage = {
            title,
            description,
            price: parseFloat(price),
            currency: "USD",
            durationMinutes: parseInt(duration),
            featuresJson: JSON.stringify(features.split(',').map(f => f.trim())),
            serviceType,
            isActive: true
        };

        try {
            // Mock API Creation
            // const created = await marketplaceApi.CREATE_PACKAGE(newPackage);
            const created: ServicePackage = {
                ...newPackage,
                externalId: Math.random().toString(),
                mentorUsername: user?.emailAddress || "mentor",
                slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            };
            
            setPackages([...packages, created]);
            setShowModal(false);
            alert("Service package created successfully!");
            
            // Reset form
            setTitle("");
            setDescription("");
            setPrice("");
            setFeatures("");
            
        } catch (error) {
            alert("Failed to create package.");
        }
    };

    if (loading) return <div className="p-8">Loading your services...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto w-full">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-slab font-bold text-gray-900">My Services</h1>
                    <p className="text-gray-500 mt-2">Manage your marketplace offerings and packages.</p>
                </div>
                <button 
                  onClick={() => setShowModal(true)}
                  className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-md hover:bg-primary/90 transition-all"
                >
                    <Plus className="w-5 h-5 mr-2" /> Add New Service
                </button>
            </div>

            {packages.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-700 mb-2">No active services</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">Create your first service package to start offering paid guidance and mentorship to students.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {packages.map((pkg) => (
                        <div key={pkg.externalId} className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 relative group hover:shadow-md transition-all">
                            <div className="absolute top-4 right-4 flex gap-2">
                               <button className="p-2 text-gray-400 hover:text-primary transition-colors bg-gray-50 rounded-lg group-hover:bg-primary/10">
                                   <Edit2 className="w-4 h-4" />
                               </button>
                            </div>
                            <span className="text-xs font-bold uppercase text-secondary bg-secondary/10 px-3 py-1 rounded-full inline-block mb-4">
                                {pkg.serviceType}
                            </span>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-4">{pkg.description}</p>
                            
                            <div className="flex justify-between items-end mt-6 pt-6 border-t border-gray-50">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Price</p>
                                    <p className="text-2xl font-bold text-gray-900">${pkg.price}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 mb-1">Duration</p>
                                    <p className="font-medium text-gray-700">{pkg.durationMinutes} mins</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-slab font-bold">Create Service Package</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        
                        <form onSubmit={handleCreatePackage} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Service Title</label>
                                    <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. Personal Statement Review" />
                                </div>
                                
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                    <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/50" placeholder="Describe the value you provide..."></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Price (USD)</label>
                                    <input required type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. 150" />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Duration (Minutes)</label>
                                    <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/50">
                                        <option value="30">30 Minutes</option>
                                        <option value="60">60 Minutes</option>
                                        <option value="90">90 Minutes</option>
                                        <option value="120">120 Minutes</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Service Category</label>
                                    <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/50">
                                        <option value="Interview Prep">Interview Prep</option>
                                        <option value="Personal Statement">Personal Statement</option>
                                        <option value="Tutoring">Tutoring</option>
                                        <option value="Mentorship">General Mentorship</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Key Features (comma-separated)</label>
                                    <input required type="text" value={features} onChange={(e) => setFeatures(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. Line-by-line edit, 1-hour call, PDF notes" />
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary/90">Publish Service</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
