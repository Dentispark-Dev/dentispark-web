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

export function ScholarshipGrid() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [degreeFilter, setDegreeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchScholarships();
  }, [degreeFilter]);

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { pageNumber: 0, pageSize: 20 };
      if (degreeFilter !== "all") {
        params.degreeLevel = degreeFilter;
      }
      const response = await api.getScholarships(params);
      
      if (!response || !response.data || response.data.length === 0) {
           setScholarships(getMockScholarships());
      } else {
           setScholarships(response.data);
      }
      
    } catch (error) {
           console.error("Failed to fetch scholarships", error);
           setScholarships(getMockScholarships());
    } finally {
      setLoading(false);
    }
  };

  const filteredScholarships = scholarships.filter(s => 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (s.targetLocation && s.targetLocation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <section className="bg-slate-50/30 py-24 md:py-32 overflow-hidden">
      <Container>
        <motion.div 
          className="flex flex-col space-y-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-6">
            <motion.div variants={itemVariants} className="px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold tracking-[0.2em] uppercase">
              Opportunity Hub
            </motion.div>
            <motion.h2 variants={itemVariants} className="font-sora text-4xl font-extrabold text-slate-900 md:text-6xl tracking-tight">
              Find Your <span className="text-emerald-600">Scholarship.</span>
            </motion.h2>
            <motion.p variants={itemVariants} className="font-sora text-slate-500 text-lg max-w-2xl leading-relaxed">
              Browse our comprehensive database of verified grants and financial aid specifically curated for dental and medical excellence.
            </motion.p>
          </div>

          {/* Filters and Search - Premium UI */}
          <motion.div 
            variants={itemVariants}
            className="group relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-[2.5rem] blur-xl opacity-50 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between rounded-[2rem] bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-slate-100 transition-all duration-500 hover:border-emerald-100">
              <div className="flex w-full flex-col gap-6 md:w-[70%] md:flex-row">
                <div className="w-full relative group/search">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 group-focus-within/search:text-emerald-500 transition-colors" />
                  <Input 
                    placeholder="Search by name, university, or location..." 
                    className="w-full h-14 bg-slate-50/50 pl-12 rounded-2xl border-slate-100 focus:border-emerald-500/30 focus:ring-emerald-500/10 font-sora text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={degreeFilter} onValueChange={setDegreeFilter}>
                  <SelectTrigger className="h-14 w-full md:w-[240px] bg-slate-50/50 rounded-2xl border-slate-100 focus:border-emerald-500/30 font-sora text-sm font-bold">
                    <SelectValue placeholder="Degree Level" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-100 font-sora">
                    <SelectItem value="all">All Degrees</SelectItem>
                    <SelectItem value="BDS">BDS / DDS</SelectItem>
                    <SelectItem value="Masters">Masters</SelectItem>
                    <SelectItem value="PhD">PhD / Research</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={fetchScholarships} 
                className="h-14 w-full md:w-auto px-10 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-sora font-extrabold shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02]"
              >
                Apply Filters
              </Button>
            </div>
          </motion.div>

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
                  <motion.div variants={itemVariants} className="col-span-full py-20 text-center space-y-4 bg-white/50 rounded-[3rem] border border-dashed border-slate-200">
                      <div className="size-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                        <Search size={32} />
                      </div>
                      <p className="font-sora text-lg text-slate-500 font-bold">No scholarships found matching your criteria.</p>
                  </motion.div>
              ) : (
                filteredScholarships.map((scholarship) => (
                <motion.div 
                  key={scholarship.externalId || scholarship.slug} 
                  variants={itemVariants}
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
                          {scholarship.amountCurrency}{scholarship.amountValue?.toLocaleString() || "Varies"}
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
                            <span className="text-slate-900 bg-slate-50 px-3 py-1 rounded-full">{scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : 'Rolling'}</span>
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
        </motion.div>
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
