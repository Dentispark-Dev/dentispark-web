"use client";

import { useState, useEffect } from "react";
import Container from "@/src/components/layouts/container";
import { Title } from "@/src/components/atoms/title";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import { Search } from "lucide-react";
import { ResourceHubApi, Scholarship } from "@/src/connection/resource-hub-service";
import Link from "next/link";

const api = new ResourceHubApi();

import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

import { REAL_SCHOLARSHIPS } from "../data/scholarships";

interface ScholarshipGridProps {
  searchQuery: string;
  degreeFilter: string;
}

export function ScholarshipGrid({ searchQuery, degreeFilter }: ScholarshipGridProps) {
  const [scholarships, setScholarships] = useState<Scholarship[]>(REAL_SCHOLARSHIPS);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    fetchScholarships(isInitialLoad);
    if (isInitialLoad) setIsInitialLoad(false);
  }, [degreeFilter]);

  const fetchScholarships = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const params: Record<string, unknown> = { pageNumber: 0, pageSize: 20 };
      if (degreeFilter !== "all") {
        params.degreeLevel = degreeFilter;
      }
      const response = await api.getScholarships(params);
      
      if (response && response.data && response.data.length > 0) {
           setScholarships(response.data);
      } else if (!isInitialLoad) {
           // If we already have local data and API fails/empty, keep local
           // Only set to local if we have nothing better
           if (scholarships.length === 0) setScholarships(REAL_SCHOLARSHIPS);
      }
      
    } catch (error) {
           console.error("Failed to fetch scholarships", error);
           if (scholarships.length === 0) setScholarships(REAL_SCHOLARSHIPS);
    } finally {
      setLoading(false);
    }
  };

  const filteredScholarships = scholarships.filter(s => 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (s.targetLocation && s.targetLocation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <section id="scholarships-list" className="bg-slate-50/30 py-8 md:py-12 overflow-hidden">
      <Container>
        <div className="flex flex-col space-y-8">
          {/* Results Grid - Header removed for better UX above fold */}

          {/* Results Grid */}
          {loading ? (
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-[400px] animate-pulse rounded-[2.5rem] bg-slate-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-shimmer" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              {filteredScholarships.length === 0 ? (
                  <div className="col-span-full py-20 text-center space-y-4 bg-white/50 rounded-[3rem] border border-dashed border-slate-200">
                      <div className="size-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                        <Search size={32} />
                      </div>
                      <p className="font-sora text-lg text-slate-500 font-bold">No scholarships found matching your criteria.</p>
                  </div>
              ) : (
                filteredScholarships.map((scholarship) => (
                <motion.div 
                  key={scholarship.externalId || scholarship.slug} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`group relative flex flex-col rounded-[2.5rem] border transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(16,185,129,0.1)] ${scholarship.isSponsored ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-100 bg-white'}`}
                >
                    {scholarship.isSponsored && (
                        <div className="absolute right-6 top-6 rounded-full bg-emerald-500 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-emerald-500/30 z-10">
                            Featured
                        </div>
                    )}
                    
                    <div className="flex flex-1 flex-col p-10 space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-slate-100 group-hover:bg-emerald-100 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 group-hover:text-emerald-600 transition-colors">
                          {scholarship.targetDegreeLevel}
                        </span>
                        <div className="font-sora text-xl font-extrabold text-emerald-600">
                          {scholarship.amountCurrency}{scholarship.amountValue > 0 ? scholarship.amountValue.toLocaleString() : "Varies"}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-sora text-2xl font-extrabold text-slate-900 line-clamp-2 transition-colors group-hover:text-emerald-600">
                          {scholarship.title}
                        </h3>
                        <p className="font-sora text-slate-500 text-sm leading-relaxed line-clamp-3">
                          {scholarship.description}
                        </p>
                      </div>

                      <div className="mt-auto flex flex-col gap-4 pt-6 border-t border-slate-50">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-slate-400">Deadline</span>
                            <span className="text-slate-900 bg-slate-50 px-3 py-1 rounded-full">{scholarship.deadline || "TBC"}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-slate-400">Location</span>
                            <span className="text-slate-900 bg-emerald-50 px-3 py-1 rounded-full text-emerald-600 border border-emerald-100">{scholarship.targetLocation || "Global"}</span>
                        </div>
                      </div>

                      <Button asChild className="h-14 mt-8 w-full rounded-2xl bg-slate-900 hover:bg-emerald-500 text-white font-sora font-extrabold transition-all duration-300 shadow-xl shadow-slate-900/10 hover:shadow-emerald-500/20">
                          <Link href={`/scholarships/${scholarship.slug}`}>View Details</Link>
                      </Button>
                    </div>
                </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

function getMockScholarships(): Scholarship[] {
    return [
        {
            externalId: "ext1",
            title: "Education Future International Scholarship 2025",
            slug: "education-future-international-scholarship-2025",
            description: "A global scholarship program aimed at supporting high-potential international students. Open to all disciplines including medicine and dentistry for studies in the USA and non-USA countries.",
            amountValue: 15000,
            amountCurrency: "$",
            deadline: "2025-10-31",
            eligibilityCriteriaJson: "{}",
            applicationLink: "https://www.le.ac.uk/scholarships/sanctuary",
            isSponsored: true,
            targetDegreeLevel: "BDS",
            targetLocation: "Global"
        },
        {
            externalId: "ext2",
            title: "Commonwealth Distance Learning Scholarships 2026",
            slug: "commonwealth-distance-learning-scholarships-2026",
            description: "Targeted at students from developing Commonwealth countries to study for a UK Master's degree while living in their home country. Ideal for healthcare professionals seeking advanced qualifications.",
            amountValue: 12000,
            amountCurrency: "£",
            deadline: "2025-12-15",
            eligibilityCriteriaJson: "{}",
            applicationLink: "https://cscuk.fcdo.gov.uk/scholarships/commonwealth-distance-learning-scholarships/",
            isSponsored: false,
            targetDegreeLevel: "Masters",
            targetLocation: "United Kingdom"
        },
        {
            externalId: "ext3",
            title: "Leverhulme Trade Charities Trust Bursary 2026",
            slug: "leverhulme-trade-charities-trust-bursary-2026",
            description: "Support for undergraduate students in financial need who are children or spouses of commercial travellers, pharmacists, or grocers. Includes support for medical and dental degrees.",
            amountValue: 3000,
            amountCurrency: "£",
            deadline: "2026-03-01",
            eligibilityCriteriaJson: "{}",
            applicationLink: "https://www.leverhulme-trade.org.uk/undergraduate-bursaries",
            isSponsored: false,
            targetDegreeLevel: "BDS",
            targetLocation: "United Kingdom"
        },
        {
            externalId: "ext4",
            title: "Narotam Sekhsaria PG Scholarship 2026-27",
            slug: "narotam-sekhsaria-pg-scholarship-2026-27",
            description: "Interest-free loan scholarships for Indian students with consistently high academic records who wish to pursue postgraduate studies at top-ranked universities globally.",
            amountValue: 20000,
            amountCurrency: "$",
            deadline: "2026-03-15",
            eligibilityCriteriaJson: "{}",
            applicationLink: "https://pg.nsfoundation.co.in/",
            isSponsored: true,
            targetDegreeLevel: "Masters",
            targetLocation: "Global"
        },
        {
            externalId: "ext5",
            title: "Qalaa Holdings Scholarships 2026",
            slug: "qalaa-holdings-scholarships-2026",
            description: "Scholarships for talented Egyptian students to pursue Master's and PhD degrees at leading international universities in various fields including clinical medicine.",
            amountValue: 30000,
            amountCurrency: "$",
            deadline: "2026-04-15",
            eligibilityCriteriaJson: "{}",
            applicationLink: "http://qalaascholarships.org/",
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
            applicationLink: "https://www.dundee.ac.uk/scholarships/global-excellence-scholarship-january-2026",
            isSponsored: true,
            targetDegreeLevel: "BDS",
            targetLocation: "United Kingdom"
        },
        {
            externalId: "ext7",
            title: "Future Leaders in Orthodontics Grant",
            slug: "future-leaders-orthodontics-grant",
            description: "Designed for postgraduate students demonstrating exceptional promise in the field of Orthodontics. Open to candidates enrolling in accredited Masters programs.",
            amountValue: 10000,
            amountCurrency: "$",
            deadline: "2026-03-01",
            eligibilityCriteriaJson: "{}",
            applicationLink: "https://example.com",
            isSponsored: false,
            targetDegreeLevel: "Masters",
            targetLocation: "USA"
        }
    ]
}
