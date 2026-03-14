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
      
      // Temporary mock data for UI visualization if backend is not fully connected
      if (!response || !response.data || response.data.length === 0) {
           setScholarships(getMockScholarships());
      } else {
           setScholarships(response.data);
      }
      
    } catch (error) {
           console.error("Failed to fetch scholarships", error);
           setScholarships(getMockScholarships()); // Fallback for UI demonstration
    } finally {
      setLoading(false);
    }
  };

  const filteredScholarships = scholarships.filter(s => 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (s.targetLocation && s.targetLocation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <section className="bg-white py-12 md:py-24">
      <Container>
        <div className="mb-12 flex flex-col items-center text-center">
          <Title className="mb-4">Find Your Scholarship</Title>
          <p className="text-text-color max-w-2xl text-lg">
            Browse our comprehensive database of verified scholarships, grants, and financial aid opportunities for dental and medical students worldwide.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between rounded-xl bg-gray-50 p-6 shadow-sm border border-gray-100">
          <div className="flex w-full flex-col gap-4 md:w-2/3 md:flex-row shadow-sm">
            <div className="w-full relative shadow-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search by name, university, or location..." 
                className="w-full bg-white pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={degreeFilter} onValueChange={setDegreeFilter}>
              <SelectTrigger className="w-full md:w-[200px] bg-white shadow-sm">
                <SelectValue placeholder="Degree Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Degrees</SelectItem>
                <SelectItem value="BDS">BDS / DDS</SelectItem>
                <SelectItem value="Masters">Masters</SelectItem>
                <SelectItem value="PhD">PhD / Research</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={fetchScholarships} className="w-full shadow-sm md:w-auto">Apply Filters</Button>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 animate-pulse rounded-xl bg-gray-200"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
             {filteredScholarships.length === 0 ? (
                 <div className="col-span-full py-12 text-center text-gray-500">
                     No scholarships found matching your criteria.
                 </div>
             ) : (
                filteredScholarships.map((scholarship) => (
                <div 
                    key={scholarship.externalId || scholarship.slug} 
                    className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${scholarship.isSponsored ? 'border-primary-200 bg-green-50/30' : 'border-gray-200 bg-white'}`}
                >
                    {scholarship.isSponsored && (
                        <div className="absolute right-0 top-0 rounded-bl-lg bg-primary-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                            Featured
                        </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
                        {scholarship.targetDegreeLevel}
                        </span>
                        <span className="text-sm font-semibold text-primary-600">
                        {scholarship.amountCurrency} {scholarship.amountValue?.toLocaleString() || "Varies"}
                        </span>
                    </div>
                    <h3 className="font-slab mb-2 text-xl font-bold text-gray-900 line-clamp-2">
                        {scholarship.title}
                    </h3>
                    <p className="mb-4 flex-1 text-sm text-gray-600 line-clamp-3">
                        {scholarship.description}
                    </p>
                    <div className="mt-auto flex flex-col gap-2 border-t border-gray-100 pt-4 text-sm text-gray-500">
                        <div className="flex justify-between">
                            <span>Deadline:</span>
                            <span className="font-medium text-gray-900">{scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : 'Rolling'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Location:</span>
                            <span className="font-medium text-gray-900">{scholarship.targetLocation || "Global"}</span>
                        </div>
                    </div>
                    <Button asChild className="mt-6 w-full shadow-sm hover:shadow-md transition-shadow">
                        <Link href={`/scholarships/${scholarship.slug}`}>View Details</Link>
                    </Button>
                    </div>
                </div>
                ))
            )}
          </div>
        )}
      </Container>
    </section>
  );
}

function getMockScholarships(): Scholarship[] {
    return [
        {
            externalId: "mock1",
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
        },
        {
            externalId: "mock2",
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
        },
        {
            externalId: "mock3",
            title: "Access to Dentistry Foundation Award",
            slug: "access-to-dentistry-foundation-award",
            description: "Financial assistance aimed at supporting students from underrepresented backgrounds entering their first year of dental school.",
            amountValue: 5000,
            amountCurrency: "£",
            deadline: "2025-08-30",
            eligibilityCriteriaJson: "{}",
            applicationLink: "https://example.com",
            isSponsored: false,
            targetDegreeLevel: "BDS",
            targetLocation: "United Kingdom"
        },
         {
            externalId: "mock4",
            title: "International Maxillofacial Research Fellowship",
            slug: "international-maxillofacial-research-fellowship",
            description: "Fully funded PhD fellowship for advanced research in oral and maxillofacial surgery techniques. Requires prior clinical experience.",
            amountValue: 45000,
            amountCurrency: "€",
            deadline: "2025-12-01",
            eligibilityCriteriaJson: "{}",
            applicationLink: "https://example.com",
            isSponsored: true,
            targetDegreeLevel: "PhD",
            targetLocation: "Europe"
        }
    ]
}
