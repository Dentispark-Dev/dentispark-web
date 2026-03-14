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

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  return {
    title: `Scholarship Details | DentiSpark`,
    description: "View full eligibility and application details for this scholarship.",
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
       scholarship = getMockScholarship(slug);
  }

  if (!scholarship) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Premium Header / Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100 py-6">
        <Container>
          <Link href="/scholarships" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-bold mb-4 transition-colors group">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Scholarships
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-primary-50 text-primary-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">Scholarship</span>
                {scholarship.isSponsored && <span className="bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-amber-100">Featured</span>}
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-black-900 tracking-tight leading-tight">{scholarship.title}</h1>
            </div>
            <div className="flex-shrink-0">
               <Button size="lg" className="h-14 px-10 rounded-2xl shadow-xl shadow-primary-500/20 text-md font-bold" asChild>
                  <a href={scholarship.applicationLink || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    Apply for this award
                    <ExternalLink className="h-4 w-4" />
                  </a>
               </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Key Facts Row */}
      <div className="border-b border-gray-100 py-10">
        <Container>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                        <Target className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-black-400 mb-1">Award Value</p>
                        <p className="text-xl font-black text-black-900">{scholarship.amountCurrency} {scholarship.amountValue?.toLocaleString() || "Varies"}</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                        <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-black-400 mb-1">Deadline</p>
                        <p className="text-xl font-black text-black-900">{scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'Rolling'}</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                        <GraduationCap className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-black-400 mb-1">Study Level</p>
                        <p className="text-xl font-black text-black-900">{scholarship.targetDegreeLevel}</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                        <Globe className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-black-400 mb-1">Location</p>
                        <p className="text-xl font-black text-black-900">{scholarship.targetLocation || "Global"}</p>
                    </div>
                </div>
            </div>
        </Container>
      </div>
      
      <Container className="py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-16">
                
                {/* About Section */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-black-900 flex items-center justify-center text-white">
                            <Info className="h-4 w-4" />
                        </div>
                        <h2 className="text-2xl font-black text-black-900 tracking-tight">About this scholarship</h2>
                    </div>
                    <div className="prose prose-lg max-w-none text-black-600 leading-relaxed font-medium">
                        <p>{scholarship.description}</p>
                    </div>
                </section>

                {/* Entry Requirements */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-black-900 flex items-center justify-center text-white">
                            <CheckCircle className="h-4 w-4" />
                        </div>
                        <h2 className="text-2xl font-black text-black-900 tracking-tight">Entry requirements</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100">
                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-black-400">Target Candidates</h4>
                            <p className="font-bold text-black-900">All International and Domestic students enrolled in accredited medicine/dentistry programs.</p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-black-400">Selection Basis</h4>
                            <p className="font-bold text-black-900">Academic excellence, community involvement, and financial need where applicable.</p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-black-400">Acceptance Status</h4>
                            <p className="font-bold text-black-900">Must hold a valid offer of admission prior to applying for the final round of funding.</p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-black-400">Study Mode</h4>
                            <p className="font-bold text-black-900">Full Time / Dual clinical-research tracks.</p>
                        </div>
                    </div>
                </section>

                {/* How to Apply */}
                <section>
                     <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-black-900 flex items-center justify-center text-white">
                            <ExternalLink className="h-4 w-4" />
                        </div>
                        <h2 className="text-2xl font-black text-black-900 tracking-tight">How to apply</h2>
                    </div>
                    <div className="space-y-6 text-black-600 font-medium leading-relaxed">
                        <p>To apply for this scholarship, you must follow the official provider's application process. Usually, this involves:</p>
                        <ol className="list-decimal pl-5 space-y-3">
                            <li>Reviewing the full eligibility criteria on the provider website.</li>
                            <li>Preparing your academic transcripts and letters of recommendation.</li>
                            <li>Completing the online application form before the stated deadline.</li>
                        </ol>
                        <Button className="mt-4 rounded-xl h-12 px-8 font-bold" asChild>
                            <a href={scholarship.applicationLink || "#"} target="_blank" rel="noopener noreferrer">Visit Provider Website</a>
                        </Button>
                    </div>
                </section>
            </div>

            {/* Right Column: Dynamic Sidebar */}
            <div className="space-y-8">
                <div className="glass-card bg-primary-600 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <LifeBuoy className="w-10 h-10 mb-6 text-primary-200" />
                        <h3 className="text-2xl font-black tracking-tight mb-4">Need help with your application?</h3>
                        <p className="text-primary-100 font-medium mb-8 leading-relaxed">Our mentors can help you polish your personal statement to maximize your scholarship chances.</p>
                        <Button variant="secondary" className="w-full h-14 rounded-2xl font-black text-primary-600 bg-white hover:bg-primary-50 border-none transition-all shadow-lg" asChild>
                            <Link href="/services">Book a Mentor</Link>
                        </Button>
                    </div>
                    <ShieldCheck className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12" />
                </div>

                <div className="p-8 rounded-[2.5rem] border border-gray-100 bg-gray-50/50">
                    <h4 className="font-black text-black-900 tracking-tight mb-6">Quick Links</h4>
                    <ul className="space-y-4">
                        <li>
                            <Link href="/scholarships" className="flex items-center text-sm font-bold text-black-600 hover:text-primary-600 transition-colors">
                                <ArrowLeft className="h-4 w-4 mr-2" /> All Support Programs
                            </Link>
                        </li>
                        <li>
                            <a href="#" className="flex items-center text-sm font-bold text-black-600 hover:text-primary-600 transition-colors">
                                <MapPin className="h-4 w-4 mr-2" /> University Finder
                            </a>
                        </li>
                    </ul>
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
            externalId: "ext1",
            title: "Education Future International Scholarship 2025",
            slug: "education-future-international-scholarship-2025",
            description: "A global scholarship program aimed at supporting high-potential international students. Open to all disciplines including medicine and dentistry for studies in the USA and non-USA countries. This award is designed to foster international collaboration and academic excellence among future healthcare leaders.",
            amountValue: 15000,
            amountCurrency: "$",
            deadline: "2025-10-31",
            eligibilityCriteriaJson: "{}",
            applicationLink: "https://www.wemakescholars.com/scholarship/education-future-international-scholarship",
            isSponsored: true,
            targetDegreeLevel: "BDS / MBBS",
            targetLocation: "Global"
        },
        {
            externalId: "ext2",
            title: "Commonwealth Distance Learning Scholarships 2026",
            slug: "commonwealth-distance-learning-scholarships-2026",
            description: "Targeted at students from developing Commonwealth countries to study for a UK Master's degree while living in their home country. Ideal for healthcare professionals seeking advanced qualifications in research methods, public health, or clinical specializations.",
            amountValue: 12000,
            amountCurrency: "£",
            deadline: "2025-12-15",
            eligibilityCriteriaJson: "{}",
            applicationLink: "https://www.wemakescholars.com/scholarship/commonwealth-distance-learning-scholarships",
            isSponsored: false,
            targetDegreeLevel: "Masters",
            targetLocation: "United Kingdom"
        },
        {
            externalId: "ext3",
            title: "Leverhulme Trade Charities Trust Bursary 2026",
            slug: "leverhulme-trade-charities-trust-bursary-2026",
            description: "Support for undergraduate students in financial need who are children or spouses of commercial travellers, pharmacists, or grocers. Includes support for medical and dental degrees across all UK-accredited institutions.",
            amountValue: 3000,
            amountCurrency: "£",
            deadline: "2026-03-01",
            eligibilityCriteriaJson: "{}",
            applicationLink: "https://www.wemakescholars.com/scholarship/leverhulme-trade-charities-trust-bursary-at-queen-mary-university-of-london",
            isSponsored: false,
            targetDegreeLevel: "BDS / MBBS",
            targetLocation: "United Kingdom"
        },
        {
            externalId: "ext4",
            title: "Narotam Sekhsaria PG Scholarship 2026-27",
            slug: "narotam-sekhsaria-pg-scholarship-2026-27",
            description: "Interest-free loan scholarships for Indian students with consistently high academic records who wish to pursue postgraduate studies at top-ranked universities globally. The scholarship selection process is rigorous and includes multiple rounds of interviews.",
            amountValue: 20000,
            amountCurrency: "$",
            deadline: "2026-03-15",
            eligibilityCriteriaJson: "{}",
            applicationLink: "https://www.wemakescholars.com/scholarship/narotam-sekhsaria-pg-scholarship",
            isSponsored: true,
            targetDegreeLevel: "Masters / PhD",
            targetLocation: "Global"
        },
        {
            externalId: "ext5",
            title: "Qalaa Holdings Scholarships 2026",
            slug: "qalaa-holdings-scholarships-2026",
            description: "Scholarships for talented Egyptian students to pursue Master's and PhD degrees at leading international universities in various fields including clinical medicine and public health policy.",
            amountValue: 30000,
            amountCurrency: "$",
            deadline: "2026-04-15",
            eligibilityCriteriaJson: "{}",
            applicationLink: "https://www.wemakescholars.com/scholarship/qalaa-holdings-scholarship",
            isSponsored: false,
            targetDegreeLevel: "PhD",
            targetLocation: "Global"
        },
        {
            externalId: "ext6",
            title: "Global Excellence Dental Scholarship 2026",
            slug: "global-excellence-dental-scholarship-2026",
            description: "A highly competitive scholarship awarded to outstanding international students pursuing a BDS degree. Covers full tuition and living expenses for the first year.",
            amountValue: 25000,
            amountCurrency: "£",
            deadline: "2025-11-15",
            eligibilityCriteriaJson: "{}",
            applicationLink: "https://example.com",
            isSponsored: true,
            targetDegreeLevel: "BDS",
            targetLocation: "United Kingdom"
        }
    ];
    return mocks.find(m => m.slug === slug) || mocks[0];
}
