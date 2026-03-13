import { ScholarshipGrid } from "@/src/features/(website)/scholarships/components/scholarship-grid";
import AdBanner from "@/src/components/marketing/AdBanner";

export const metadata = {
  title: "Scholarships | DentiSpark",
  description: "Browse the largest database of dental and medical scholarships, grants, and financial aid.",
};

export default function ScholarshipsPage() {
  return (
    <>
      {/* Optional Hero Area for the Scholarships Page */}
      <section className="bg-primary-900 py-16 text-white text-center">
         <h1 className="font-slab text-4xl md:text-5xl font-bold mb-4">Funding Your Future</h1>
         <p className="text-primary-100 max-w-2xl mx-auto px-4">Discover millions in available scholarships specifically curated for aspiring healthcare professionals.</p>
      </section>
       <div className="max-w-7xl mx-auto px-4 w-full mt-4">
           <AdBanner zone="HEADER_BANNER" />
       </div>
      <ScholarshipGrid />
    </>
  );
}
