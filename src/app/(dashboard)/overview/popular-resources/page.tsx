"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
    ArrowLeft, 
    BookOpen, 
    FileText, 
    Stethoscope, 
    GraduationCap, 
    Activity, 
    ShieldCheck, 
    Search,
    ExternalLink,
    Clock,
    Star,
    Filter
} from "lucide-react";

interface Resource {
    id: string;
    title: string;
    description: string;
    category: string;
    icon: React.ReactNode;
    readTime: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    href: string;
    featured?: boolean;
}

const RESOURCES: Resource[] = [
    {
        id: "ucat-guide",
        title: "DentiSpark UCAT Prep Guide",
        description: "Master the UCAT with our proprietary strategic roadmap covering all five subtests: Verbal Reasoning, Decision Making, Quantitative Reasoning, Abstract Reasoning, and Situational Judgement.",
        category: "UCAT",
        icon: <Activity className="w-5 h-5" />,
        readTime: "15 min",
        difficulty: "Intermediate",
        href: "/resources/ucat-guide",
        featured: true,
    },
    {
        id: "dental-booklet",
        title: "Dental Schools Council Yearbook",
        description: "Your official guide to UK Dental education requirements. Includes entry requirements for all UK dental schools, A-level/IB targets, and UCAT/BMAT thresholds.",
        category: "Admissions",
        icon: <GraduationCap className="w-5 h-5" />,
        readTime: "20 min",
        difficulty: "Beginner",
        href: "/resources/dental-booklet",
        featured: true,
    },
    {
        id: "ps-template",
        title: "Personal Statement Template",
        description: "DentiSpark-specific template reflective of actual UK dental school requirements. Structure your clinical observations, volunteering, and manual dexterity evidence.",
        category: "Application",
        icon: <FileText className="w-5 h-5" />,
        readTime: "12 min",
        difficulty: "Intermediate",
        href: "/resources/ps-template",
        featured: true,
    },
    {
        id: "financial-guide",
        title: "Financial Support Guide",
        description: "Strategic funding options for your dental academic journey. Detailed breakdown of NHS bursaries, Student Finance England, and regional scholarships for dental students.",
        category: "Finance",
        icon: <ShieldCheck className="w-5 h-5" />,
        readTime: "10 min",
        difficulty: "Beginner",
        href: "/resources/financial-guide",
    },
    {
        id: "nursing-guide",
        title: "Dental Nursing Apprenticeship Guide",
        description: "Step-by-step roadmap to becoming a qualified Dental Nurse. Covers the Level 3 Diploma, apprenticeship standards, and career progression routes.",
        category: "Career Paths",
        icon: <Stethoscope className="w-5 h-5" />,
        readTime: "18 min",
        difficulty: "Beginner",
        href: "/resources/nursing-guide",
    },
    {
        id: "interview-guide",
        title: "MMI Interview Survival Guide",
        description: "Master the Multiple Mini Interview format used by the majority of UK dental schools. Includes ethical scenarios, communication stations, and roleplay tips aligned with GDC Standards.",
        category: "Interviews",
        icon: <BookOpen className="w-5 h-5" />,
        readTime: "25 min",
        difficulty: "Advanced",
        href: "/ai-hub/interview-prep",
    },
    {
        id: "work-experience",
        title: "Work Experience Placement Handbook",
        description: "How to find, secure, and maximise your dental work experience. Includes a Shadowing Log template and tips for converting observations into UCAS personal statement content.",
        category: "Clinical",
        icon: <Stethoscope className="w-5 h-5" />,
        readTime: "14 min",
        difficulty: "Beginner",
        href: "/overview",
    },
    {
        id: "ucas-timeline",
        title: "UCAS Application Timeline 2026/27",
        description: "Critical deadlines and milestones for the 2026/27 dental school application cycle. From UCAT registration in April to the October 15th submission deadline.",
        category: "Admissions",
        icon: <Clock className="w-5 h-5" />,
        readTime: "8 min",
        difficulty: "Beginner",
        href: "/overview",
    },
    {
        id: "manual-dexterity",
        title: "Manual Dexterity Portfolio Guide",
        description: "How to evidence manual dexterity for your dental school application. Covers model making, wire bending, instrument handling, and reflective documentation.",
        category: "Application",
        icon: <Activity className="w-5 h-5" />,
        readTime: "10 min",
        difficulty: "Intermediate",
        href: "/guidance-hub",
    },
];

const CATEGORIES = ["All", "UCAT", "Admissions", "Application", "Finance", "Interviews", "Clinical", "Career Paths"];

export default function PopularResourcesPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filtered = RESOURCES.filter(r => {
        const matchesCategory = activeCategory === "All" || r.category === activeCategory;
        const matchesSearch = !searchQuery || 
            r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 pb-24"
        >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link href="/overview" className="flex items-center gap-1 hover:text-gray-900 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Overview
                </Link>
                <span>/</span>
                <span className="text-gray-900 font-bold">Popular Resources</span>
            </div>

            {/* Header */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 lg:p-14 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                    <BookOpen className="w-48 h-48 text-slate-900" />
                </div>
                <div className="relative z-10 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
                        <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                        Curated Library
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-jakarta font-extrabold text-slate-900 tracking-tight">
                        Popular Resources
                    </h1>
                    <p className="text-slate-500 font-medium max-w-2xl text-lg">
                        Essential reading for every aspiring dental student. Each resource is curated to directly support your UCAS application, interview preparation, and clinical readiness.
                    </p>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                activeCategory === cat
                                    ? "bg-slate-900 text-white shadow-sm"
                                    : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Featured Resources */}
            {activeCategory === "All" && !searchQuery && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {RESOURCES.filter(r => r.featured).map((resource, i) => (
                        <Link key={resource.id} href={resource.href}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group bg-emerald-950 rounded-3xl p-8 text-white relative overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col justify-between min-h-[280px]"
                            >
                                <div className="absolute top-0 right-0 -translate-y-4 translate-x-4">
                                    <div className="w-32 h-32 bg-emerald-900/50 rounded-full blur-2xl" />
                                </div>
                                <div className="relative z-10 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="p-2.5 bg-emerald-900/50 rounded-xl text-emerald-400">
                                            {resource.icon}
                                        </div>
                                        <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">{resource.category}</span>
                                    </div>
                                    <h3 className="text-xl font-jakarta font-extrabold tracking-tight leading-tight group-hover:text-emerald-300 transition-colors">
                                        {resource.title}
                                    </h3>
                                    <p className="text-emerald-100/70 text-sm font-medium leading-relaxed line-clamp-2">
                                        {resource.description}
                                    </p>
                                </div>
                                <div className="relative z-10 flex items-center justify-between mt-6 pt-4 border-t border-emerald-900/50">
                                    <div className="flex items-center gap-3 text-xs text-emerald-300 font-bold">
                                        <Clock className="w-3.5 h-3.5" />
                                        {resource.readTime}
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            )}

            {/* All Resources Grid */}
            <div>
                <p className="text-sm text-slate-500 mb-4">
                    <span className="font-bold text-slate-900">{filtered.length}</span> resource{filtered.length !== 1 ? "s" : ""} found
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map((resource, i) => (
                        <Link key={resource.id} href={resource.href}>
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="group bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg hover:border-emerald-200 transition-all duration-300 h-full flex flex-col"
                            >
                                <div className="flex items-center justify-between mb-5">
                                    <div className="p-2.5 bg-slate-50 rounded-xl text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                        {resource.icon}
                                    </div>
                                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                                        resource.difficulty === "Beginner" ? "bg-green-50 text-green-600" :
                                        resource.difficulty === "Intermediate" ? "bg-amber-50 text-amber-600" :
                                        "bg-red-50 text-red-600"
                                    }`}>
                                        {resource.difficulty}
                                    </span>
                                </div>
                                <div className="flex-1 space-y-3">
                                    <h3 className="text-lg font-jakarta font-extrabold text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors leading-tight">
                                        {resource.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-3">
                                        {resource.description}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-4 text-xs text-slate-400 font-bold">
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            {resource.readTime}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Filter className="w-3.5 h-3.5" />
                                            {resource.category}
                                        </span>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center">
                        <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="font-bold text-slate-700 mb-1">No resources found</p>
                        <p className="text-sm text-slate-500">Try adjusting your search or category filter.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
