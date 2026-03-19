"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
    Search, Star, Calendar, ChevronDown, ChevronUp, 
    SlidersHorizontal, Phone, Heart, CheckCircle2
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import Link from "next/link";

// ─── Category Tabs (Leland-style) ─────────────────────────────
const CATEGORIES = [
    { key: "all", label: "All Mentors" },
    { key: "dental", label: "🦷 Dental School" },
    { key: "medicine-md", label: "🩺 Medicine — MD" },
    { key: "medicine-do", label: "🩺 Medicine — DO" },
    { key: "nursing", label: "🏥 Nursing" },
    { key: "pa", label: "💊 Physician Assistant" },
    { key: "test-prep", label: "📚 Test Prep (DAT/MCAT)" },
    { key: "personal-statement", label: "✍️ Personal Statement" },
    { key: "interview-prep", label: "🎤 Interview Prep" },
];

// ─── Mock mentor data (replace with real API) ─────────────────
// ─── Mock mentor data (Premium Slugs) ─────────────────
const MOCK_MENTORS = [
    {
        id: "dt-marcus-thorne",
        slug: "dt-marcus-thorne",
        name: "Dt. Marcus Thorne",
        credentials: "Elite Orthodontics | 12+ Years Experience",
        bio: "Specializing in advanced orthodontic procedures and guiding pre-dental students through the application process.",
        worksAt: "Univ of Pennsylvania",
        field: "dental",
        specialty: "Orthodontics, Program Strategy",
        hourlyRate: 175,
        currency: "US$",
        rating: 4.9,
        reviewCount: 88,
        available: "Available tomorrow",
        verified: true,
        introCall: true,
        tags: ["dental", "specialization"],
    },
    {
        id: "dr-elena-rostova",
        slug: "dr-elena-rostova",
        name: "Dr. Elena Rostova",
        credentials: "Chief of Surgery | Admissions Committee Member",
        bio: "I leverage my experience on the Harvard admissions committee to help driven students craft compelling narratives.",
        worksAt: "Harvard Medicine",
        field: "medicine-md",
        specialty: "Surgery, MMI Prep",
        hourlyRate: 210,
        currency: "US$",
        rating: 5.0,
        reviewCount: 62,
        available: "Available Thurs",
        verified: true,
        introCall: true,
        tags: ["medicine-md", "surgery"],
    },
    {
        id: "dr-sarah-chen",
        slug: "dr-sarah-chen",
        name: "Dr. Sarah Chen",
        credentials: "NHS Consultant | UCAT Specialist",
        bio: "Passionate about mentoring the next generation of UK dentists. I specialize in breaking down the UCAT requirements.",
        worksAt: "King's College London",
        field: "dental",
        specialty: "UCAT, UK Dental Schools",
        hourlyRate: 120,
        currency: "US$",
        rating: 4.8,
        reviewCount: 145,
        available: "Available today",
        verified: true,
        introCall: true,
        tags: ["dental", "test-prep"],
    },
    {
        id: "dt-james-wilson",
        slug: "dt-james-wilson",
        name: "Dt. James Wilson",
        credentials: "Pediatric Specialist | Former UCSF Admissions",
        bio: "I help applicants highlight their soft skills and community impact to stand out in the competitive landscape.",
        worksAt: "UCSF Pediatric Dentistry",
        field: "dental",
        specialty: "Pediatrics, soft-skills",
        hourlyRate: 160,
        currency: "US$",
        rating: 4.9,
        reviewCount: 34,
        available: "Available Mon",
        verified: true,
        introCall: false,
        tags: ["dental", "interview-prep"],
    },
    {
        id: "dr-amira-patel",
        slug: "dr-amira-patel",
        name: "Dr. Amira Patel",
        credentials: "Top of Class UCL | Research Fellow",
        bio: "My focus is on helping students with strong academic and research backgrounds translate those achievements into offers.",
        worksAt: "UCL / NHS Consultant",
        field: "nursing",
        specialty: "Research, Academic Strategy",
        hourlyRate: 140,
        currency: "US$",
        rating: 5.0,
        reviewCount: 29,
        available: "Available Wed",
        verified: true,
        introCall: true,
        tags: ["nursing", "research"],
    },
];

// ─── Filter Panel ─────────────────────────────────────────────
interface FilterSection { label: string; open: boolean }

function FilterPanel({ onFiltersChange }: { onFiltersChange: (f: any) => void }) {
    const [rateOpen, setRateOpen] = useState(true);
    const [specOpen, setSpecOpen] = useState(true);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [identityOpen, setIdentityOpen] = useState(false);

    const [rates, setRates] = useState<string[]>([]);
    const [specs, setSpecs] = useState<string[]>([]);

    const toggleRate = (r: string) => setRates(p => p.includes(r) ? p.filter(x => x !== r) : [...p, r]);
    const toggleSpec = (s: string) => setSpecs(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

    return (
        <div className="w-56 shrink-0 space-y-4 text-sm">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-sm">Filters</h3>
                <button className="text-xs text-emerald-600 hover:underline font-medium">Clear</button>
            </div>

            {/* Hourly Rate */}
            <div className="border-t border-gray-100 pt-4 space-y-2">
                <button
                    onClick={() => setRateOpen(o => !o)}
                    className="flex items-center justify-between w-full font-semibold text-gray-800"
                >
                    Hourly Rate {rateOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>
                {rateOpen && (
                    <div className="space-y-2 pt-1">
                        <div className="flex gap-2">
                            <Input placeholder="Min" className="h-8 text-xs rounded-sm border-gray-300" />
                            <Input placeholder="Max" className="h-8 text-xs rounded-sm border-gray-300" />
                        </div>
                        {["$0 - $99/hr", "$100 - $199/hr", "$200 - $299/hr", "$300+/hr"].map(r => (
                            <label key={r} className="flex items-center gap-2 cursor-pointer hover:text-emerald-700 text-gray-600">
                                <input
                                    type="checkbox"
                                    checked={rates.includes(r)}
                                    onChange={() => toggleRate(r)}
                                    className="rounded-sm accent-emerald-600"
                                />
                                <span className="text-xs">{r}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Specialization */}
            <div className="border-t border-gray-100 pt-4 space-y-2">
                <button
                    onClick={() => setSpecOpen(o => !o)}
                    className="flex items-center justify-between w-full font-semibold text-gray-800"
                >
                    Specialization {specOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>
                {specOpen && (
                    <div className="space-y-2 pt-1">
                        {["Personal Statement", "Test Prep", "Interview Prep (MMI)", "School Selection", "Secondary Essays", "Research & Volunteering"].map(s => (
                            <label key={s} className="flex items-center gap-2 cursor-pointer hover:text-emerald-700 text-gray-600">
                                <input type="checkbox" className="rounded-sm accent-emerald-600" />
                                <span className="text-xs">{s}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Services Offered */}
            <div className="border-t border-gray-100 pt-4 space-y-2">
                <button
                    onClick={() => setServicesOpen(o => !o)}
                    className="flex items-center justify-between w-full font-semibold text-gray-800"
                >
                    Services Offered {servicesOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>
                {servicesOpen && (
                    <div className="space-y-2 pt-1">
                        {["1:1 Coaching Session", "Essay Review", "Mock Interview", "Application Review", "Study Plan"].map(s => (
                            <label key={s} className="flex items-center gap-2 cursor-pointer hover:text-emerald-700 text-gray-600">
                                <input type="checkbox" className="rounded-sm accent-emerald-600" />
                                <span className="text-xs">{s}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Identity / Access */}
            <div className="border-t border-gray-100 pt-4 space-y-2">
                <button
                    onClick={() => setIdentityOpen(o => !o)}
                    className="flex items-center justify-between w-full font-semibold text-gray-800"
                >
                    Background <span className="ml-1 text-gray-400 font-normal text-xs font-normal">(optional)</span>
                    {identityOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>
                {identityOpen && (
                    <div className="space-y-2 pt-1">
                        {["First-Generation", "LGBTQ+ Friendly", "Low-Income Background", "Underrepresented Minority", "International Student Friendly"].map(s => (
                            <label key={s} className="flex items-center gap-2 cursor-pointer hover:text-emerald-700 text-gray-600">
                                <input type="checkbox" className="rounded-sm accent-emerald-600" />
                                <span className="text-xs">{s}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Mentor Card ──────────────────────────────────────────────
function MentorCard({ mentor }: { mentor: typeof MOCK_MENTORS[0] }) {
    const [followed, setFollowed] = useState(false);

    return (
        <div className="flex gap-5 p-5 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow group">
            {/* Avatar */}
            <div className="shrink-0">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-black text-xl">
                    {mentor.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-2">
                <div>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                                {mentor.name}
                            </h3>
                            <p className="text-sm text-gray-700 line-clamp-1">{mentor.credentials}</p>
                        </div>
                        {/* Rate */}
                        <div className="text-right shrink-0">
                            <p className="font-black text-gray-900">{mentor.currency}{mentor.hourlyRate}<span className="text-xs font-medium text-gray-400">/hr</span></p>
                        </div>
                    </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-gray-600 line-clamp-2">{mentor.bio}</p>

                {/* Workplace chip */}
                <div className="flex items-center gap-1 text-xs text-gray-500">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    Works at {mentor.worksAt}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3">
                        {/* Stars + count */}
                        <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-bold text-gray-900">{mentor.rating.toFixed(1)}</span>
                            <span className="text-xs text-gray-400">({mentor.reviewCount})</span>
                        </div>
                        {/* Availability */}
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {mentor.available}
                        </div>
                    </div>
                    
                    {/* CTAs */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setFollowed(f => !f)}
                            className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded border transition-colors ${
                                followed 
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700" 
                                    : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                            <Heart className={`h-3 w-3 ${followed ? "fill-emerald-600 text-emerald-600" : ""}`} />
                            {followed ? "Following" : "Follow"}
                        </button>

                        {mentor.introCall && (
                            <Button className="h-8 px-4 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg gap-1.5">
                                <Phone className="h-3 w-3" />
                                Free intro call
                            </Button>
                        )}

                        <Link
                            href={`/mentor/${mentor.slug}`}
                            className="text-xs font-semibold text-gray-600 hover:text-gray-900 hover:underline"
                        >
                            View profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────
export default function MentorshipPage() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("default");
    const [showFilters, setShowFilters] = useState(true);

    const filtered = MOCK_MENTORS.filter(m => {
        const matchesCategory = activeCategory === "all" || m.tags.includes(activeCategory);
        const matchesSearch = !searchQuery || 
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.credentials.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.specialty.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const categoryLabel = CATEGORIES.find(c => c.key === activeCategory)?.label ?? "All Mentors";

    return (
        <div className="space-y-0">
            {/* ── Category Tabs (top nav, Leland-style) ── */}
            <div className="border-b border-gray-200 -mx-6 px-6 overflow-x-auto">
                <div className="flex items-center gap-0 whitespace-nowrap">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.key}
                            onClick={() => setActiveCategory(cat.key)}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                                activeCategory === cat.key
                                    ? "border-gray-900 text-gray-900 font-bold"
                                    : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Page Header ── */}
            <div className="pt-6 pb-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{categoryLabel} — Mentors & Coaches</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Book 1-on-1 sessions with verified experts to make progress on your admissions goals.
                            <button className="ml-2 text-emerald-600 hover:underline font-medium">Talk to our team</button>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowFilters(f => !f)}
                            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <SlidersHorizontal className="h-3.5 w-3.5" />
                            {showFilters ? "Hide" : "Show"} Filters
                        </button>
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        >
                            <option value="default">Sort by default</option>
                            <option value="rating">Highest rated</option>
                            <option value="price-asc">Price: low to high</option>
                            <option value="price-desc">Price: high to low</option>
                            <option value="availability">Soonest available</option>
                        </select>
                    </div>
                </div>

                {/* Search bar */}
                <div className="relative max-w-2xl">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search mentors by name, specialty, or school…"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                    />
                </div>
            </div>

            {/* ── Main content: sidebar + list ── */}
            <div className="flex gap-8 pt-2">
                {/* Left sidebar filters */}
                {showFilters && (
                    <FilterPanel onFiltersChange={() => {}} />
                )}

                {/* Mentor list */}
                <div className="flex-1 space-y-3">
                    <p className="text-sm text-gray-500">
                        <span className="font-bold text-gray-900">{filtered.length}</span> mentor{filtered.length !== 1 ? "s" : ""} found
                    </p>

                    {filtered.length === 0 ? (
                        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center text-gray-500">
                            <p className="font-semibold text-gray-700 mb-1">No mentors found</p>
                            <p className="text-sm">Try adjusting your filters or search query.</p>
                        </div>
                    ) : (
                        filtered.map(mentor => (
                            <MentorCard key={mentor.id} mentor={mentor} />
                        ))
                    )}

                    {/* "Not sure?" CTA — like Leland  */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                                <span className="text-emerald-600 text-base">⚡</span>
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">Not sure? Get personalized mentor recommendations.</p>
                                <p className="text-xs text-gray-500">Finding the right mentor can be overwhelming. Let our AI match you.</p>
                            </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <Button variant="outline" className="h-9 text-sm rounded-xl gap-1.5 font-semibold border-gray-300">
                                <Phone className="h-3.5 w-3.5" />
                                Schedule a call
                            </Button>
                            <Button className="h-9 text-sm bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold">
                                Get recommendations →
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
