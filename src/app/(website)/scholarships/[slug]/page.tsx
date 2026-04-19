import { LooseRecord } from "@/src/types/loose";
import { ResourceHubApi } from "@/src/connection/resource-hub-service";
import Container from "@/src/components/layouts/container";
import { Button } from "@/src/components/ui/button";
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  GraduationCap, 
  CheckCircle, 
  Info, 
  Target, 
  LifeBuoy, 
  Globe, 
  Calendar, 
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { REAL_SCHOLARSHIPS } from "@/src/features/(website)/scholarships/data/scholarships";
import { ScholarshipApplyButton } from "@/src/features/(website)/scholarships/components/apply-button";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;
  const scholarship = REAL_SCHOLARSHIPS.find(m => m.slug === slug);
  
  return {
    title: `${scholarship?.title || 'Scholarship Details'} | DentiSpark`,
    description: scholarship?.description || "View full eligibility and application details for this scholarship.",
  };
}

export default async function ScholarshipDetailsPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;
  let scholarship = null;
  
  try {
     const api = new ResourceHubApi();
     scholarship = await api.getScholarshipBySlug(slug);
  } catch (e) {
     // Fallback to real mock data
     scholarship = REAL_SCHOLARSHIPS.find(m => m.slug === slug);
  }

  if (!scholarship) {
    // If still not found, try the fallback again or 404
    scholarship = REAL_SCHOLARSHIPS.find(m => m.slug === slug);
    if (!scholarship) notFound();
  }

  const covers = scholarship.coversJson ? JSON.parse(scholarship.coversJson) : ["Tuition fees", "Living expenses support"];
  const providerName = (scholarship as LooseRecord).provider || "University Provider";

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-inter">
      {/* Premium Header / Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-8">
        <Container>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/scholarships" className="hover:text-primary-600 transition-colors">Scholarships</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{scholarship.title}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-primary-600/20">
                  Global Award
                </div>
                {scholarship.isSponsored && (
                  <div className="bg-amber-100 text-amber-700 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-200">
                    Featured
                  </div>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-4">
                {scholarship.title}
              </h1>
              <p className="text-xl text-slate-500 font-medium leading-relaxed">
                Offered by <span className="text-primary-600 font-bold">{providerName}</span>
              </p>
            </div>
            
            <div className="flex flex-col gap-4 min-w-[280px]">
              <ScholarshipApplyButton 
                url={scholarship.applicationLink || "#"} 
                scholarshipTitle={scholarship.title} 
              />
              <p className="text-center text-xs text-gray-400 font-medium">Verified Official Provider Link</p>
            </div>
          </div>
        </Container>
      </div>

      {/* Key Facts Grid - Premium Style */}
      <div className="bg-white border-b border-gray-100 shadow-sm relative z-10">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
            <div className="py-8 px-6 first:pl-0">
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-5 w-5 text-primary-600" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Award Value</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{scholarship.amountCurrency}{scholarship.amountValue > 0 ? scholarship.amountValue.toLocaleString() : "Varies"}</p>
              <p className="text-xs text-slate-500 font-bold mt-1">{(scholarship as LooseRecord).fundingType || "Contribution to fees"}</p>
            </div>
            <div className="py-8 px-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="h-5 w-5 text-primary-600" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Deadline</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">
                {scholarship.deadline}
              </p>
              <p className="text-xs text-slate-500 font-bold mt-1">Intake: {(scholarship as LooseRecord).intakeYear || "2026 Entry"}</p>
            </div>
            <div className="py-8 px-6">
              <div className="flex items-center gap-3 mb-2">
                <GraduationCap className="h-5 w-5 text-primary-600" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Study Level</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 truncate">{scholarship.targetDegreeLevel}</p>
              <p className="text-xs text-slate-500 font-bold mt-1">{(scholarship as LooseRecord).numberOfAwards || "Multiple awards"}</p>
            </div>
            <div className="py-8 px-6 last:pr-0">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="h-5 w-5 text-primary-600" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Target Location</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{scholarship.targetLocation || "United Kingdom"}</p>
              <p className="text-xs text-slate-500 font-bold mt-1">{(scholarship as LooseRecord).nationality || "All Eligible"}</p>
            </div>
          </div>
        </Container>
      </div>
      
      <Container className="py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left Column: Details */}
            <div className="lg:col-span-8 space-y-16">
                
                {/* About Section */}
                <section id="about" className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                            <Info className="h-6 w-6" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">About this scholarship</h2>
                    </div>
                    
                    <div className="prose prose-lg max-w-none text-slate-600 leading-relaxed font-medium">
                        <p className="mb-8">{scholarship.description}</p>
                        
                        <div className="mt-12">
                          <h3 className="text-xl font-extrabold text-slate-900 mb-6">What does this scholarship cover?</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {covers.map((item: string, i: number) => (
                              <div key={i} className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0" />
                                <span className="font-bold text-slate-700">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                    </div>
                </section>

                {/* Entry Requirements */}
                <section id="requirements" className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                            <GraduationCap className="h-6 w-6" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Eligibility Criteria</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Study Level</span>
                            <p className="text-lg font-bold text-slate-900">{scholarship.targetDegreeLevel}</p>
                        </div>
                        <div className="space-y-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Location</span>
                            <p className="text-lg font-bold text-slate-900">{scholarship.targetLocation || "United Kingdom"}</p>
                        </div>
                    </div>

                    <div className="mt-10 pt-10 border-t border-gray-100">
                      <h4 className="text-sm font-extrabold text-slate-900 mb-4">Detailed Requirements</h4>
                      <p className="text-slate-600 font-medium leading-[1.8]">
                        {scholarship.eligibilityCriteriaJson && scholarship.eligibilityCriteriaJson !== "{}" 
                          ? (JSON.parse(scholarship.eligibilityCriteriaJson).notes || "Candidates must meet the specific criteria set by the provider. Please visit the official website for full details.") 
                          : "Candidates must hold an offer of a place or meet residency requirements as specified by the provider."}
                      </p>
                    </div>
                </section>

                {/* How to Apply */}
                <section id="apply" className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
                     <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                            <ExternalLink className="h-6 w-6" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">How to apply</h2>
                    </div>
                    <div className="space-y-8">
                        <div className="space-y-4 text-slate-600 font-medium leading-relaxed">
                          <p>To secure this award, you must follow the official application steps provided by the institution:</p>
                          <div className="space-y-4 ml-2">
                            {[
                              "Complete your academic application for a qualifying course.",
                              "Ensure you meet all eligibility and residency requirements.",
                              "Submit any required forms or evidence before the specified deadline."
                            ].map((step, i) => (
                              <div key={i} className="flex gap-4">
                                <div className="w-6 h-6 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center text-xs font-extrabold flex-shrink-0">
                                  {i + 1}
                                </div>
                                <p className="text-slate-700 font-bold">{step}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100">
                          <p className="text-sm font-bold text-primary-800 flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            Direct Application Required
                          </p>
                          <p className="text-xs text-primary-600 mt-1 font-medium">Please note that DentiSpark does not process applications for this award directly.</p>
                        </div>
                        <ScholarshipApplyButton 
                            url={scholarship.applicationLink || "#"} 
                            scholarshipTitle={scholarship.title}
                            className="h-14 px-10 rounded-2xl font-extrabold text-lg bg-slate-900 hover:bg-slate-800"
                        />
                    </div>
                </section>
            </div>

            {/* Right Column: Dynamic Sidebar */}
            <div className="lg:col-span-4 space-y-8">
                <div className="bg-emerald-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <LifeBuoy className="w-12 h-12 mb-8 text-emerald-100" />
                        <h3 className="text-3xl font-extrabold tracking-tight mb-4">Maximize Your Chances</h3>
                        <p className="text-emerald-50 font-medium mb-10 text-lg leading-relaxed">Our clinical mentors help you craft a standout <span className="underline decoration-emerald-400 underline-offset-4">Personal Statement</span> that captures your potential.</p>
                        <Button variant="secondary" className="w-full h-16 rounded-2xl font-extrabold text-emerald-700 bg-white hover:bg-emerald-50 border-none transition-all shadow-xl text-lg hover:scale-[1.02]" asChild>
                            <Link href="/services">Book Statement Review</Link>
                        </Button>
                    </div>
                    <ShieldCheck className="absolute -right-6 -bottom-6 w-40 h-40 opacity-10 rotate-12" />
                </div>

                <div className="p-10 rounded-[2.5rem] border border-gray-100 bg-white shadow-sm sticky top-8">
                    <h4 className="font-extrabold text-slate-900 tracking-tight mb-8 text-xl">Institution Contact</h4>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-extrabold text-gray-900">{providerName}</p>
                            <p className="text-xs text-gray-500 font-bold">{scholarship.targetLocation || "United Kingdom"}</p>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full h-12 rounded-xl border-gray-200 font-bold text-gray-700" asChild>
                          <Link href="/contact">Inquire via DentiSpark</Link>
                        </Button>
                        <div className="pt-6 border-t border-gray-100">
                          <Link href="/scholarships" className="flex items-center text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">
                              <ArrowLeft className="h-4 w-4 mr-2" /> View More Scholarships
                          </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </Container>
    </div>
  );
}
