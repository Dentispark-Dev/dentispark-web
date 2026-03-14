"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, CheckCircle, ShieldCheck, Star } from "lucide-react";
import Link from "next/link";
import { marketplaceApi, ServicePackage } from "@/src/features/marketplace/services/marketplace.api";


// Fallback data for UI demonstration since DB might be empty
const MOCK_PACKAGE: ServicePackage = {
    externalId: "1",
    mentorUsername: "dr_smith",
    title: "Comprehensive Personal Statement Review",
    slug: "comprehensive-personal-statement-review",
    description: "I will thoroughly review your dental school personal statement, providing detailed feedback on structure, content, and tone to ensure you stand out to admissions committees. We will focus on highlighting your unique journey and mitigating any red flags.",
    price: 150.0,
    currency: "USD",
    durationMinutes: 60,
    featuresJson: '["Line-by-line editing", "Structural feedback", "1-hour video consultation", "Unlimited email follow-ups for 7 days"]',
    serviceType: "Personal Statement Review",
    isActive: true
};

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [pkg, setPkg] = useState<ServicePackage>(MOCK_PACKAGE);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // In a real implementation we would fetch this from marketplaceApi
  /*
  useEffect(() => {
    marketplaceApi.GET_PACKAGE_BY_SLUG(params.slug as string)
      .then(setPkg)
      .catch(console.error);
  }, [params.slug]);
  */

  const handlePurchase = async () => {
    setLoading(true);
    try {
      // Mock API call simulation
      // const order = await marketplaceApi.INITIATE_ORDER({ packageSlug: pkg.slug, studentNotes: notes });
      // window.location.href = order.stripePaymentUrl!;
      
      alert("Order initiated successfully! Redirecting to secure checkout...");
      setTimeout(() => {
          // Mock redirect to successful checkout
          router.push("/dashboard/purchases");
      }, 2000);

    } catch (error) {
      alert("Failed to initiate order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!pkg) return <div className="min-h-screen py-32 text-center">Loading service details...</div>;

  let features: string[] = [];
  try {
    features = JSON.parse(pkg.featuresJson);
  } catch (e) {
    features = ["Standard features apply"];
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      
      <main className="flex-1 py-12 px-4 md:px-8 mt-24">
        <div className="max-w-6xl mx-auto">
          {/* Back button */}
          <Link href="/services" className="inline-flex items-center text-gray-500 hover:text-primary mb-8 font-medium transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Service Details */}
            <div className="lg:col-span-2 space-y-8">
              
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-sm font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-4 py-1.5 rounded-full">
                    {pkg.serviceType}
                  </span>
                  <div className="flex items-center text-yellow-500 ml-4">
                     <Star className="h-5 w-5 fill-current" />
                     <Star className="h-5 w-5 fill-current" />
                     <Star className="h-5 w-5 fill-current" />
                     <Star className="h-5 w-5 fill-current" />
                     <Star className="h-5 w-5 fill-current" />
                     <span className="text-gray-600 font-bold ml-2 text-sm">5.0 (124 reviews)</span>
                  </div>
                </div>
                
                <h1 className="text-3xl md:text-5xl font-slab font-bold text-gray-900 mb-6 leading-tight">
                  {pkg.title}
                </h1>
                
                <div className="flex items-center justify-between py-6 border-y border-gray-100 mb-8">
                   <div className="flex items-center gap-4">
                       <div className="w-14 h-14 bg-gray-200 rounded-full overflow-hidden">
                           <img src="https://i.pravatar.cc/150?img=32" alt="Mentor" className="w-full h-full object-cover" />
                       </div>
                       <div>
                           <p className="font-bold text-gray-900 text-lg">Dr. Sarah Smith</p>
                           <p className="text-sm text-gray-500">@{pkg.mentorUsername}</p>
                       </div>
                   </div>
                   <div className="hidden md:flex flex-col items-end text-sm text-gray-500">
                       <p className="flex items-center"><ShieldCheck className="w-4 h-4 mr-1 text-green-500"/> Verified Expert</p>
                       <p className="flex items-center mt-1"><Clock className="w-4 h-4 mr-1 text-blue-500"/> Usually responds in 2 hours</p>
                   </div>
                </div>

                <div>
                   <h2 className="text-2xl font-slab font-bold text-gray-900 mb-4">About This Service</h2>
                   <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">{pkg.description}</p>
                </div>
              </div>

            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 sticky top-32">
                 <div className="flex justify-between items-end mb-6 pb-6 border-b border-gray-100">
                     <h3 className="font-bold text-gray-500 text-lg">Total Price</h3>
                     <p className="text-4xl font-bold text-gray-900">${pkg.price}</p>
                 </div>

                 <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-primary"/> Delivery: {pkg.durationMinutes} mins
                    </h4>
                    <ul className="space-y-3">
                        {features.map((feature, idx) => (
                           <li key={idx} className="flex items-start text-gray-700">
                               <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0 mt-0.5" />
                               <span>{feature}</span>
                           </li>
                        ))}
                    </ul>
                 </div>

                 <div className="mb-8">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Message to Mentor (Optional)</label>
                    <textarea 
                       className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                       rows={3}
                       placeholder="Briefly describe what you need help with..."
                       value={notes}
                       onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                 </div>

                 <button 
                   onClick={handlePurchase}
                   disabled={loading}
                   className="w-full py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-70"
                 >
                   {loading ? "Processing..." : "Continue to Checkout"}
                 </button>
                 
                 <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 mr-1"/> Secure Escrow Payment
                 </p>
              </div>
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}
