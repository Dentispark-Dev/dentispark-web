"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
    ChevronDown, ArrowDown, Check, ChevronUp
} from "lucide-react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────
interface Step {
    id: number;
    question: string;
    subtitle?: string;
    type: "single" | "multi" | "select";
    options: { key: string; label: string }[];
    allowMultiple?: boolean;
    hint?: string;
}

interface SocialProof {
    quote: string;
    name: string;
    rating: number;
    coachedBy?: string;
    stat?: string;
}

// ─── Social proof data per step ───────────────────────────────
const socialProofs: SocialProof[] = [
    {
        stat: "Join 50,000+ students accepted to top dental & medical schools.",
        quote: "DentiSpark gave me a mentor who helped me craft my dental school essays — I got in first try!",
        name: "Sarah M.",
        rating: 5,
        coachedBy: "Dr. James K."
    },
    {
        stat: "Trusted by students accepted to Harvard Medical, Penn Dental, UCLA DGSOM, and more.",
        quote: "The personalized study plan changed everything for my DAT prep.",
        name: "Marcus T.",
        rating: 5,
        coachedBy: "Dr. Aisha R."
    },
    {
        stat: "92% of DentiSpark users say working with a mentor increased their confidence.",
        quote: "I was a re-applicant. My mentor helped me turn weaknesses into strengths. Accepted this cycle!",
        name: "Priya L.",
        rating: 5,
        coachedBy: "Dr. Kevin S."
    },
    {
        stat: "Students on DentiSpark get accepted 2× faster than the national average.",
        quote: "The mock interviews were terrifyingly realistic — which is exactly why I aced my actual MMI.",
        name: "David C.",
        rating: 5,
        coachedBy: "Dr. Natalie H."
    },
    {
        stat: "It's never been easier to get help from an expert.",
        quote: "I feel more confident in taking the next steps needed to achieve my admissions goals.",
        name: "Jordan P.",
        rating: 5,
        coachedBy: "Dr. Omar F."
    },
    {
        stat: "Over 500 verified mentors. Zero guesswork.",
        quote: "I found my mentor on DentiSpark and got my acceptance letter 3 months later. 10/10.",
        name: "Amina W.",
        rating: 5,
    },
];

// ─── Step definitions ─────────────────────────────────────────
const steps: Step[] = [
    {
        id: 1,
        question: "What is your goal?",
        type: "single",
        options: [
            { key: "get-into-school", label: "Get into dental / medical school" },
            { key: "test-prep", label: "Prepare for DAT / MCAT / TEAS" },
            { key: "find-mentor", label: "Find an expert mentor" },
            { key: "build-career", label: "Build my healthcare career" },
        ],
    },
    {
        id: 2,
        question: "What are you most interested in?",
        subtitle: "Choose as many as you like.",
        type: "multi",
        options: [
            { key: "dental", label: "🦷 Dental School (DDS/DMD)" },
            { key: "medicine-md", label: "🩺 Medicine — MD (Allopathic)" },
            { key: "medicine-do", label: "🩺 Medicine — DO (Osteopathic)" },
            { key: "nursing", label: "🏥 Nursing (BSN/ABSN/NP)" },
            { key: "pa", label: "💊 Physician Assistant" },
            { key: "pharmacy", label: "⚗️ Pharmacy (PharmD)" },
            { key: "vet", label: "🐾 Veterinary School" },
            { key: "other", label: "Other / Exploring" },
        ],
    },
    {
        id: 3,
        question: "What do you need most help with?",
        subtitle: "If you don't find what you need, select 'General Support'.",
        type: "select",
        options: [
            { key: "personal-statement", label: "Personal Statement & Secondary Essays" },
            { key: "test-strategy", label: "DAT / MCAT / TEAS / GRE Strategy" },
            { key: "school-selection", label: "School List & Application Strategy" },
            { key: "interview-prep", label: "Interview Prep (MMI + Traditional)" },
            { key: "scholarship", label: "Scholarships & Financial Aid" },
            { key: "research-volunteering", label: "Research, Volunteering & Extracurriculars" },
            { key: "general", label: "General Support & Guidance" },
        ],
    },
    {
        id: 4,
        question: "Where are you in your journey?",
        type: "single",
        options: [
            { key: "just-starting", label: "Just starting out (exploring)" },
            { key: "preparing", label: "Actively preparing (1–2 years out)" },
            { key: "applying", label: "Currently applying (this cycle)" },
            { key: "reapplicant", label: "Re-applicant" },
            { key: "accepted", label: "Already accepted / In school" },
        ],
    },
    {
        id: 5,
        question: "When are you looking for help?",
        type: "single",
        options: [
            { key: "asap", label: "As soon as possible" },
            { key: "6-months", label: "In the next 6 months" },
            { key: "6-12-months", label: "6–12 months" },
            { key: "12-plus-months", label: "12+ months" },
            { key: "free-only", label: "I'm just looking for free resources" },
        ],
    },
    {
        id: 6,
        question: "Last question — how did you hear about us?",
        type: "single",
        options: [
            { key: "google", label: "Google" },
            { key: "youtube", label: "YouTube" },
            { key: "instagram", label: "Instagram" },
            { key: "tiktok", label: "TikTok" },
            { key: "facebook", label: "Facebook" },
            { key: "reddit", label: "Reddit" },
            { key: "friend", label: "Referred by a friend" },
            { key: "school-club", label: "School Club / Campus event" },
            { key: "podcast", label: "Podcast" },
            { key: "other", label: "Other" },
        ],
    },
];

// ─── Star Rating ──────────────────────────────────────────────
function Stars({ count }: { count: number }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: count }).map((_, i) => (
                <svg key={i} className="h-4 w-4 fill-yellow-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

const OPTION_KEYS = ["A","B","C","D","E","F","G","H","I","J","K","L"];

export default function ApplyPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string[]>>({});
    const [selectOpen, setSelectOpen] = useState(false);
    const [selectSearch, setSelectSearch] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const step = steps[currentStep];
    const proof = socialProofs[currentStep];
    const selected = answers[step.id] ?? [];

    const toggle = (key: string) => {
        const curr = answers[step.id] ?? [];
        if (step.type === "single") {
            setAnswers({ ...answers, [step.id]: [key] });
        } else {
            setAnswers({
                ...answers,
                [step.id]: curr.includes(key) ? curr.filter(k => k !== key) : [...curr, key],
            });
        }
    };

    const canProceed = selected.length > 0;

    const next = () => {
        if (!canProceed) return;
        if (currentStep < steps.length - 1) {
            setCurrentStep(s => s + 1);
            setSelectOpen(false);
            setSelectSearch("");
        } else {
            // Done → save to sessionStorage and go to sign-up
            setIsSubmitting(true);
            sessionStorage.setItem("onboarding_answers", JSON.stringify(answers));
            router.push("/sign-up?from=apply");
        }
    };

    // Keyboard nav
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Enter" && canProceed) next();
            if (e.key === "ArrowDown") setCurrentStep(s => Math.min(s + 1, steps.length - 1));
            if (e.key === "ArrowUp") setCurrentStep(s => Math.max(s - 1, 0));
            // Option hotkeys A-L
            const idx = "abcdefghijkl".indexOf(e.key.toLowerCase());
            if (idx >= 0 && idx < step.options.length && step.type !== "select") {
                toggle(step.options[idx].key);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [currentStep, selected, canProceed]);

    const filteredOptions = step.options.filter(o =>
        o.label.toLowerCase().includes(selectSearch.toLowerCase())
    );

    const progressPct = ((currentStep) / steps.length) * 100;

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Top progress bar */}
            <div className="h-0.5 bg-gray-100 fixed top-0 left-0 right-0 z-50">
                <div 
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                />
            </div>

            {/* Logo */}
            <div className="fixed top-4 right-6 z-50">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-emerald-500 rounded-sm flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
                            <path d="M7 0L13.9282 10.5H0.0717969L7 0Z" />
                        </svg>
                    </div>
                    <span className="font-bold text-gray-900 hidden sm:block">DentiSpark</span>
                </Link>
            </div>

            {/* Main layout: left question + right social proof */}
            <div className="flex flex-1 min-h-screen">
                {/* LEFT: Question */}
                <div className="flex-1 flex flex-col justify-center px-8 md:px-24 py-24 max-w-2xl">
                    <div className="space-y-8">
                        {/* Step indicator */}
                        <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                            <span className="text-lg">{step.id}</span>
                            <svg width="16" height="10" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 5h14M9 1l5 4-5 4" />
                            </svg>
                        </div>

                        {/* Question */}
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-1">
                                {step.question}
                            </h1>
                            {step.subtitle && (
                                <p className="text-sm text-gray-500">{step.subtitle}</p>
                            )}
                        </div>

                        {/* Options */}
                        {step.type !== "select" ? (
                            <div className="space-y-2">
                                {step.options.map((opt, i) => {
                                    const isSelected = selected.includes(opt.key);
                                    return (
                                        <button
                                            key={opt.key}
                                            onClick={() => toggle(opt.key)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded border text-left text-sm font-medium transition-all duration-150 group ${
                                                isSelected
                                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                                    : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-emerald-50/30"
                                            }`}
                                        >
                                            <span className={`shrink-0 h-6 w-6 rounded-sm border text-xs font-extrabold flex items-center justify-center transition-colors ${
                                                isSelected 
                                                    ? "border-emerald-500 bg-emerald-500 text-white" 
                                                    : "border-gray-300 text-gray-400 bg-white"
                                            }`}>
                                                {isSelected ? <Check className="h-3.5 w-3.5" /> : OPTION_KEYS[i]}
                                            </span>
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            /* Select dropdown */
                            <div className="relative">
                                <div
                                    className="w-full border-b-2 border-emerald-400 pb-2 flex items-center justify-between cursor-pointer"
                                    onClick={() => setSelectOpen(!selectOpen)}
                                >
                                    <input
                                        type="text"
                                        value={selectSearch || (selected[0] ? step.options.find(o => o.key === selected[0])?.label ?? "" : "")}
                                        onChange={e => { setSelectSearch(e.target.value); setSelectOpen(true); }}
                                        placeholder="Type or select an option"
                                        className="flex-1 bg-transparent outline-none text-gray-700 text-sm font-medium placeholder:text-gray-400"
                                    />
                                    <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                                </div>
                                {selectOpen && (
                                    <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-xl z-20 max-h-64 overflow-y-auto">
                                        {filteredOptions.map(opt => (
                                            <button
                                                key={opt.key}
                                                onClick={() => {
                                                    toggle(opt.key);
                                                    setSelectSearch("");
                                                    setSelectOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-3 text-sm hover:bg-emerald-50 transition-colors ${
                                                    selected.includes(opt.key) ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-gray-700"
                                                }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* OK button */}
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                onClick={next}
                                disabled={!canProceed || isSubmitting}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded text-sm font-bold transition-all ${
                                    canProceed && !isSubmitting
                                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" 
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                            >
                                {isSubmitting ? "Setting up your account…" : currentStep < steps.length - 1 ? "OK" : "Find My Mentor →"}
                            </button>
                            {canProceed && !isSubmitting && (
                                <span className="text-xs text-gray-400">
                                    press <kbd className="font-mono bg-gray-100 px-1 rounded">Enter ↵</kbd>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Social proof panel */}
                <div className="hidden md:flex w-[420px] bg-gray-50 border-l border-gray-100 flex-col justify-center px-12 py-24 gap-8">
                    {proof.stat && (
                        <p className="text-xl font-bold text-gray-800 leading-snug">{proof.stat}</p>
                    )}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-extrabold text-sm shrink-0">
                                {proof.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">{proof.name}</p>
                                <Stars count={proof.rating} />
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm italic leading-relaxed">"{proof.quote}"</p>
                        {proof.coachedBy && (
                            <p className="text-xs text-gray-400">Mentored by {proof.coachedBy}</p>
                        )}
                    </div>

                    {/* Trusted by logos placeholder */}
                    {currentStep === 1 && (
                        <div className="space-y-3">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Trusted by students accepted to</p>
                            <div className="flex flex-wrap gap-3 text-xs font-bold text-gray-300">
                                {["Harvard", "Penn", "NYU", "UCLA", "Michigan", "Columbia", "Mayo Clinic"].map(s => (
                                    <span key={s} className="border border-gray-200 px-3 py-1 rounded-full text-gray-400">{s}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="bg-emerald-600 text-white rounded-xl p-5 space-y-1">
                            <p className="font-extrabold text-lg">93%</p>
                            <p className="text-sm text-emerald-100">of users say that working with a DentiSpark mentor significantly increased their chances of getting accepted.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom nav arrows */}
            <div className="fixed bottom-6 right-6 flex gap-2 z-50">
                <button
                    onClick={() => setCurrentStep(s => Math.max(s - 1, 0))}
                    disabled={currentStep === 0}
                    className="h-9 w-9 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                >
                    <ChevronUp className="h-4 w-4" />
                </button>
                <button
                    onClick={() => setCurrentStep(s => Math.min(s + 1, steps.length - 1))}
                    disabled={currentStep === steps.length - 1}
                    className="h-9 w-9 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                >
                    <ArrowDown className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
