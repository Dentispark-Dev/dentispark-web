import { ResourceHubApi } from "@/src/connection/resource-hub-service";
import Container from "@/src/components/layouts/container";
import { Title } from "@/src/components/atoms/title";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft, Clock, MapPin, GraduationCap, CheckCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  // Try to fetch for real metadata (handling mock fallback if backend offline)
  return {
    title: `Scholarship Details | DentiSpark`,
    description: "View full eligibility and application details for this scholarship.",
  };
}

export default async function ScholarshipDetailsPage({ params }: { params: { slug: string } }) {
  // In a real Server Component, we'd fetch directly. Use mock fallback for now.
  let scholarship = null;
  
  try {
     const api = new ResourceHubApi();
     scholarship = await api.getScholarshipBySlug(params.slug);
  } catch (e) {
      console.log("Using fallback data for", params.slug);
      // Fallback mock data matching the grid
      scholarship = getMockScholarship(params.slug);
  }

  if (!scholarship) {
    notFound();
  }

  return (
    <div className="bg-gray-50 py-12 md:py-24 min-h-screen">
      <Container>
        <Link href="/scholarships" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Scholarships
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="col-span-1 lg:col-span-2 space-y-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                    {scholarship.isSponsored && (
                        <div className="absolute top-0 right-0 bg-primary-500 text-white px-4 py-1 font-semibold text-sm rounded-bl-xl shadow-sm">
                            Sponsored
                        </div>
                    )}
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                        <span className="flex items-center"><GraduationCap className="h-4 w-4 mr-1 text-primary-500"/> {scholarship.targetDegreeLevel}</span>
                        <span>•</span>
                        <span className="flex items-center"><MapPin className="h-4 w-4 mr-1 text-primary-500"/> {scholarship.targetLocation || "Global"}</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-slab font-bold text-gray-900 mb-6">{scholarship.title}</h1>
                    
                    <div className="prose prose-lg max-w-none text-gray-600">
                        <p>{scholarship.description}</p>
                        
                        <h3 className="text-xl font-slab font-bold text-gray-900 mt-8 mb-4">Eligibility Criteria</h3>
                        <ul className="space-y-2">
                             <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"/>Must be enrolled in or accepted to an accredited specific program.</li>
                             <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"/>Demonstrate outstanding academic achievement (e.g., GPA &gt; 3.5).</li>
                             <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"/>Submit two letters of recommendation.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Sidebar Data */}
            <div className="col-span-1">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                    <h3 className="font-slab text-xl font-bold text-gray-900 mb-6 border-b pb-4">Funding Facts</h3>
                    
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Award Amount</p>
                            <p className="text-2xl font-bold text-primary-600">
                                 {scholarship.amountCurrency} {scholarship.amountValue?.toLocaleString() || "Varies"}
                            </p>
                        </div>
                        
                        <div>
                            <p className="text-sm text-gray-500 mb-1 flex items-center"><Clock className="h-4 w-4 mr-1"/> Application Deadline</p>
                            <p className="text-lg font-medium text-gray-900">
                                {scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Rolling Admission'}
                            </p>
                        </div>
                    </div>

                    <Button size="lg" className="w-full mt-8 shadow-sm text-lg" asChild>
                         <a href={scholarship.applicationLink || "#"} target="_blank" rel="noopener noreferrer">Apply Now</a>
                    </Button>
                    <p className="text-xs text-center text-gray-400 mt-4">You will be redirected to the official provider's website to complete your application.</p>
                </div>
            </div>
        </div>
      </Container>
    </div>
  );
}

function getMockScholarship(slug: string) {
    const mocks = [
        {
            externalId: "mock1",
            title: "Global Excellence Dental Scholarship 2026",
            slug: "global-excellence-dental-scholarship-2026",
            description: "A highly competitive scholarship awarded to outstanding international students pursuing a BDS degree. Covers full tuition and living expenses for the first year. The successful candidate will also be offered a summer research internship.",
            amountValue: 25000,
            amountCurrency: "£",
            deadline: "2025-11-15",
            eligibilityCriteriaJson: "{}",
            applicationLink: "https://example.com",
            isSponsored: true,
            targetDegreeLevel: "BDS",
            targetLocation: "United Kingdom"
        },
        {
            externalId: "mock2",
            title: "Future Leaders in Orthodontics Grant",
            slug: "future-leaders-orthodontics-grant",
            description: "Designed for postgraduate students demonstrating exceptional promise in the field of Orthodontics. Open to candidates enrolling in accredited Masters programs. Funding goes towards research materials and conference travel.",
            amountValue: 10000,
            amountCurrency: "$",
            deadline: "2026-03-01",
            eligibilityCriteriaJson: "{}",
            applicationLink: "https://example.com",
            isSponsored: false,
            targetDegreeLevel: "Masters",
            targetLocation: "USA"
        }
    ];
    return mocks.find(m => m.slug === slug) || mocks[0];
}
