import React from "react";
import Link from "next/link";
import { CheckCircle, Search, Star, Clock } from "lucide-react";
import Header from "@/src/components/layouts/header";
import { Footer } from "@/src/components/layouts/footer";
import AdBanner from "@/src/components/marketing/AdBanner";

const mockServices = [
  {
    externalId: "1",
    mentorUsername: "dr_smith",
    title: "Comprehensive Personal Statement Review",
    slug: "comprehensive-personal-statement-review",
    description: "I will thoroughly review your dental school personal statement, providing detailed feedback on structure, content, and tone to ensure you stand out to admissions committees.",
    price: 150.0,
    currency: "USD",
    durationMinutes: 60,
    featuresJson: '["Line-by-line editing", "Structural feedback", "1-hour video consultation"]',
    serviceType: "Personal Statement Review",
    mentorName: "Dr. Sarah Smith",
    mentorRating: 4.9,
    reviews: 124
  },
  {
    externalId: "2",
    mentorUsername: "dr_jones",
    title: "MMI Mock Interview - Full Circuit",
    slug: "mmi-mock-interview-full-circuit",
    description: "Experience a full Multi-Mini Interview (MMI) circuit under timed, realistic conditions. Receive immediate personalized feedback on your performance for each station.",
    price: 200.0,
    currency: "USD",
    durationMinutes: 120,
    featuresJson: '["6 timed MMI stations", "Ethical scenarios", "Detailed performance scorecard"]',
    serviceType: "Mock Interview",
    mentorName: "Dr. James Jones",
    mentorRating: 5.0,
    reviews: 89
  },
  {
    externalId: "3",
    mentorUsername: "student_mentor_alex",
    title: "UCAT Strategy & Tutoring Session",
    slug: "ucat-strategy-tutoring",
    description: "Struggling with the UCAT? We will break down your weakest sections and implement proven strategies to boost your score efficiently.",
    price: 50.0,
    currency: "USD",
    durationMinutes: 45,
    featuresJson: '["Targeted practice questions", "Time management techniques", "Action plan"]',
    serviceType: "Tutoring",
    mentorName: "Alex R. (D4 Student)",
    mentorRating: 4.8,
    reviews: 42
  }
];

export const metadata = {
  title: "Mentor Services Marketplace | DentiSpark",
  description: "Browse and book expert services from top dental mentors to accelerate your career.",
};

export default function ServicesMarketplacePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-primary pt-32 pb-20 px-4 md:px-8 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-slab font-bold mb-6">Expert Help, <span className="text-secondary">On Demand.</span></h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 mb-10">
            Browse our marketplace of curated services offered by top dental professionals and students. From application prep to clinical advice, get exactly what you need.
          </p>
          
          <div className="max-w-2xl mx-auto bg-white p-2 rounded-full shadow-lg flex items-center">
            <Search className="h-6 w-6 text-gray-400 ml-4" />
            <input 
              type="text" 
              placeholder="What service do you need help with?" 
              className="w-full px-4 py-3 text-gray-800 outline-none bg-transparent"
            />
            <button className="bg-secondary text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto flex-1 w-full">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-slab font-bold text-gray-900">Featured Services</h2>
          <div className="flex gap-4">
            <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white shadow-sm outline-none">
              <option>All Categories</option>
              <option>Personal Statement</option>
              <option>Interviews</option>
              <option>Tutoring</option>
            </select>
          </div>
        </div>
        
        <AdBanner zone="IN_FEED_SPONSORED" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockServices.map((service) => (
            <div key={service.externalId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {service.serviceType}
                  </span>
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-bold text-sm text-gray-800">{service.mentorRating}</span>
                    <span className="text-xs text-gray-500">({service.reviews})</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {service.description}
                </p>
                
                <div className="flex items-center text-sm text-gray-500 mt-auto">
                   <Clock className="h-4 w-4 mr-1" /> Delivery in {service.durationMinutes} mins
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Starting at</span>
                  <span className="text-xl font-bold text-gray-900">${service.price}</span>
                </div>
                <Link href={`/services/${service.slug}`} className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
