"use client";

import { useState } from "react";
import Container from "@/src/components/layouts/container";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { 
    Search, Star, Calendar, 
    CheckCircle2, Heart, Phone,
    SlidersHorizontal, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { MENTOR_CATEGORIES, REAL_MENTORS, Mentor } from "@/src/features/(website)/mentors/data/mentors";

export default function PublicMentorsPage() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("default");

    const filtered = REAL_MENTORS.filter(m => {
        const matchesCategory = activeCategory === "all" || m.tags.includes(activeCategory);
        const matchesSearch = !searchQuery || 
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.credentials.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.specialty.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="bg-[#fcfcfd] min-h-screen pb-20 font-inter">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-100 py-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]" />
                </div>
                
                <Container className="relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-extrabold uppercase tracking-widest mb-8">
                        <Star className="w-3.5 h-3.5 fill-emerald-600" />
                        Verified Experts
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1] mb-6">
                        Learn from the best <br />
                        <span className="text-emerald-600">in the field.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-slate-500 font-medium leading-relaxed mb-10">
                        Book 1-on-1 sessions with clinical mentors, admissions committee members, and specialists who have been exactly where you are.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Button size="lg" className="h-14 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-lg" asChild>
                            <Link href="/become-a-mentor">Become a Mentor</Link>
                        </Button>
                        <Button variant="outline" size="lg" className="h-14 px-8 rounded-2xl border-gray-200 font-bold text-lg text-slate-600" onClick={() => document.getElementById('mentor-list')?.scrollIntoView({ behavior: 'smooth' })}>
                            Browse All Experts
                        </Button>
                    </div>
                </Container>
            </div>

            {/* Filter & Search Section */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
                <Container>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 py-4">
                        {/* Category Tabs */}
                        <div className="overflow-x-auto hidden-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
                            <div className="flex items-center gap-1 min-w-max">
                                {MENTOR_CATEGORIES.map(cat => (
                                    <button
                                        key={cat.key}
                                        onClick={() => setActiveCategory(cat.key)}
                                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                            activeCategory === cat.key
                                                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Search & Sort */}
                        <div className="flex items-center gap-3">
                            <div className="relative w-full lg:w-72">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input 
                                    placeholder="Search experts..." 
                                    className="h-12 pl-12 pr-4 bg-slate-50 border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl font-medium transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Mentor Grid */}
            <Container id="mentor-list" className="py-16">
                <div className="mb-10 flex items-center justify-between">
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        {filtered.length} Experts {activeCategory !== 'all' ? `in ${MENTOR_CATEGORIES.find(c => c.key === activeCategory)?.label}` : ''}
                    </h2>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                        Sort by: 
                        <select 
                            className="bg-transparent text-slate-900 outline-none cursor-pointer"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="default">Default</option>
                            <option value="rating">Highest Rated</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map(mentor => (
                            <MentorCard key={mentor.id} mentor={mentor} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 mb-2">No experts found</h3>
                        <p className="text-slate-500 font-medium max-w-sm mx-auto">
                            We couldn&apos;t find any experts matching your current search or filters. 
                            Try broadening your criteria.
                        </p>
                    </div>
                )}
                
                {/* CTA Block */}
                <div className="mt-20 bg-emerald-600 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden group shadow-2xl shadow-emerald-600/20">
                    <div className="relative z-10 max-w-2xl">
                        <h3 className="text-3xl md:text-5xl font-extrabold leading-[1.1] mb-6">
                            Want to become a mentor?
                        </h3>
                        <p className="text-emerald-50 text-lg md:text-xl font-medium mb-10 leading-relaxed">
                            Join our community of elite dentistry professionals and help the next generation of students succeed.
                        </p>
                        <Button size="lg" className="h-16 px-10 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-700 font-extrabold text-xl border-none transition-all hover:scale-[1.02]" asChild>
                            <Link href="/become-a-mentor" className="flex items-center gap-2">
                                Apply Now <ArrowRight className="w-6 h-6" />
                            </Link>
                        </Button>
                    </div>
                    <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block overflow-hidden">
                         <div className="absolute inset-0 bg-gradient-to-l from-emerald-600 to-transparent z-10" />
                         <img 
                            src="/images/premium/auth-landscape.png" 
                            alt="Mentorship" 
                            className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
                         />
                    </div>
                </div>
            </Container>
        </div>
    );
}

function MentorCard({ mentor }: { mentor: Mentor }) {
    return (
        <div className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col h-full">
            {/* Image/Avatar Section */}
            <div className="p-8 pb-4">
                <div className="flex items-start justify-between mb-6">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 p-[2px] shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-500">
                            <div className="w-full h-full rounded-[22px] bg-white flex items-center justify-center overflow-hidden">
                                {mentor.image ? (
                                    <img src={mentor.image} alt={mentor.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-2xl font-extrabold text-emerald-600">
                                        {mentor.name.split(" ").map(n => n[0]).join("")}
                                    </span>
                                )}
                            </div>
                        </div>
                        {mentor.verified && (
                            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                        )}
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1 justify-end text-amber-500 mb-1">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-extrabold text-slate-900">{mentor.rating.toFixed(1)}</span>
                        </div>
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                            {mentor.reviewCount} Reviews
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight group-hover:text-emerald-600 transition-colors">
                        {mentor.name}
                    </h3>
                    <p className="text-sm font-bold text-slate-500 leading-tight">
                        {mentor.credentials}
                    </p>
                </div>
            </div>

            {/* Info Section */}
            <div className="px-8 pb-8 flex-1 flex flex-col">
                <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3 mb-6">
                    {mentor.bio}
                </p>

                <div className="mt-auto space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Works at <span className="text-slate-900">{mentor.worksAt}</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                        <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Full Sessions</p>
                            <p className="text-lg font-extrabold text-slate-900">
                                {mentor.currency}{mentor.hourlyRate}<span className="text-xs text-slate-400 font-bold">/hr</span>
                            </p>
                        </div>
                        <Button variant="outline" className="h-12 rounded-xl border-gray-100 font-bold px-6 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all" asChild>
                            <Link href={`/mentor/${mentor.slug}`}>View Profile</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
