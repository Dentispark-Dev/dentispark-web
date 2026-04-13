"use client";

import { useState, useEffect, useCallback } from "react";
import Container from "@/src/components/layouts/container";
import { Button } from "@/src/components/ui/button";
import { Search } from "lucide-react";
import { ResourceHubApi, Scholarship } from "@/src/connection/resource-hub-service";
import Link from "next/link";
import { motion } from "framer-motion";
import { REAL_SCHOLARSHIPS } from "../data/scholarships";
import { LooseRecord } from "@/src/types/loose";

const api = new ResourceHubApi();

interface ScholarshipGridProps {
  searchQuery: string;
  degreeFilter: string;
}

export function ScholarshipGrid({ searchQuery, degreeFilter }: ScholarshipGridProps) {
  const [scholarships, setScholarships] = useState<Scholarship[]>(REAL_SCHOLARSHIPS);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchScholarships = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const params: LooseRecord = { pageNumber: 0, pageSize: 20 };
      if (degreeFilter !== "all") {
        params.degreeLevel = degreeFilter;
      }
      const response = await api.getScholarships(params);
      if (response && response.data && response.data.length > 0) {
        setScholarships(response.data);
      } else if (scholarships.length === 0) {
        setScholarships(REAL_SCHOLARSHIPS);
      }
    } catch (error) {
      console.error("Failed to fetch scholarships", error);
      if (scholarships.length === 0) setScholarships(REAL_SCHOLARSHIPS);
    } finally {
      setLoading(false);
    }
  }, [degreeFilter, scholarships.length]);

  useEffect(() => {
    fetchScholarships(isInitialLoad);
    if (isInitialLoad) setIsInitialLoad(false);
  }, [degreeFilter, fetchScholarships, isInitialLoad]);

  const filteredScholarships = scholarships.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.targetLocation && s.targetLocation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <section id="scholarships-list" className="bg-slate-50/30 py-8 md:py-12 overflow-hidden">
      <Container>
        <div className="flex flex-col space-y-8">
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
                  <p className="font-jakarta text-lg text-slate-500 font-bold">No scholarships found matching your criteria.</p>
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
                        <div className="font-jakarta text-xl font-extrabold text-emerald-600">
                          {scholarship.amountCurrency}{scholarship.amountValue > 0 ? scholarship.amountValue.toLocaleString() : "Varies"}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-jakarta text-2xl font-extrabold text-slate-900 line-clamp-2 transition-colors group-hover:text-emerald-600">
                          {scholarship.title}
                        </h3>
                        <p className="font-jakarta text-slate-500 text-sm leading-relaxed line-clamp-3">
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

                      <Button asChild className="h-14 mt-8 w-full rounded-2xl bg-slate-900 hover:bg-emerald-500 text-white font-jakarta font-extrabold transition-all duration-300 shadow-xl shadow-slate-900/10 hover:shadow-emerald-500/20">
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
