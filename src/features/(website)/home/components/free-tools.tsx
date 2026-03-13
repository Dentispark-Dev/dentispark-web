"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import Container from "@/src/components/layouts/container";

import ucatImage from "@/public/images/ucat.png";
import bookletImage from "@/public/images/booklet.png";
import { cn } from "@/src/lib/utils";

const freeResources = [
  {
    id: 1,
    title: "UCAT Prep Guide",
    description: "Master the UCAT with confidence",
    ctaText: "Get it now",
    image: ucatImage,
    imageAlt: "UCAT Prep Guide",
    backgroundColor: "bg-green-50",
    href: "/resources",
  },
  {
    id: 2,
    title: "Dental Schools Council 2025 Booklet",
    description: "Your official guide to UK Dental education",
    ctaText: "Get it now",
    image: bookletImage,
    imageAlt: "Dental Schools Council 2025 Booklet",
    backgroundColor: "bg-secondary-50",
    href: "/resources",
  },
];

const additionalResources = [
  {
    id: 3,
    title: "Personal Statement Template",
    description: "Craft a compelling and structured personal statement",
    ctaText: "Get it now",
    backgroundColor: "bg-[#FDF0E6]",
    href: "/resources",
    icon: (
      <svg width="200" height="200" viewBox="0 0 100 100" fill="none">
        <rect
          x="20"
          y="15"
          width="50"
          height="65"
          rx="3"
          fill="#FFF4E6"
          stroke="#FB923C"
          strokeWidth="2"
        />
        <rect x="25" y="25" width="15" height="2" fill="#FB923C" />
        <rect x="25" y="30" width="25" height="2" fill="#FB923C" />
        <rect x="25" y="35" width="20" height="2" fill="#FB923C" />
        <rect x="45" y="15" width="25" height="40" rx="3" fill="#FB923C" />
        <rect x="50" y="20" width="15" height="2" fill="white" />
        <rect x="50" y="25" width="10" height="2" fill="white" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Financial Support Guide",
    description: "Understanding funding options for your academic journey",
    ctaText: "Get it now",
    backgroundColor: "bg-[#F8F8F8]",
    href: "/resources",
    icon: (
      <svg width="200" height="200" viewBox="0 0 100 100" fill="none">
        <circle
          cx="50"
          cy="40"
          r="15"
          fill="#DBEAFE"
          stroke="#3B82F6"
          strokeWidth="2"
        />
        <text
          x="50"
          y="45"
          textAnchor="middle"
          fill="#3B82F6"
          fontSize="12"
          fontWeight="bold"
        >
          £
        </text>
        <rect x="35" y="60" width="8" height="8" fill="#F59E0B" />
        <rect x="45" y="60" width="8" height="8" fill="#F59E0B" />
        <rect x="55" y="60" width="8" height="8" fill="#F59E0B" />
        <circle cx="25" cy="30" r="8" fill="#10B981" />
        <circle cx="75" cy="35" r="6" fill="#EF4444" />
      </svg>
    ),
  },
  {
    id: 5,
    title: "Dental Nursing Apprenticeship Guide",
    description: "Your Step-by-Step guide to becoming a qualified Dental Nurse",
    ctaText: "Get it now",
    backgroundColor: "bg-error-50",
    href: "/resources",
    icon: (
      <svg width="200" height="200" viewBox="0 0 100 100" fill="none">
        <rect
          x="30"
          y="20"
          width="40"
          height="55"
          rx="4"
          fill="#FEF2F2"
          stroke="#EF4444"
          strokeWidth="2"
        />
        <rect x="35" y="30" width="30" height="3" fill="#EF4444" />
        <rect x="35" y="37" width="25" height="2" fill="#EF4444" />
        <rect x="35" y="42" width="20" height="2" fill="#EF4444" />
        <rect x="35" y="47" width="28" height="2" fill="#EF4444" />
        <rect x="45" y="15" width="10" height="8" fill="#EF4444" />
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export function FreeTools() {
  return (
    <section className="bg-[#fcfcfc] py-24 md:py-32">
      <Container className="flex flex-col space-y-16">
        <div className="flex flex-col items-center space-y-6 text-center">
          <h2 className="font-slab max-w-4xl text-4xl font-bold text-gray-900 md:text-5xl">
            Begin your Dental journey with <span className="text-[#12AC75]">free resources</span>
          </h2>
          <p className="font-sora text-greys-800 max-w-3xl text-lg leading-relaxed">
            Access guides, university data, AI-driven checklists, and financial support tailored to your year and goals.
          </p>
        </div>

        {/* Resources Grid - Primary Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {freeResources.map((resource) => (
            <Link
              key={resource.id}
              href={resource.href}
              className="group relative flex overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] transition-all hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="flex flex-1 flex-col justify-center p-8 md:p-12">
                <div className="space-y-4">
                  <h3 className="font-slab text-2xl font-bold text-gray-900">
                    {resource.title}
                  </h3>
                  <p className="font-sora text-greys-800 text-lg leading-relaxed">
                    {resource.description}
                  </p>
                  <div className="flex items-center gap-2 font-bold text-[#12AC75]">
                    <span>{resource.ctaText}</span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="transition-transform duration-300 group-hover:translate-x-2"
                    >
                      <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className={cn("hidden w-1/3 items-center justify-center p-8 md:flex", resource.backgroundColor)}>
                <Image
                  src={resource.image}
                  alt={resource.imageAlt}
                  width={200}
                  height={200}
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Additional Resources - Secondary Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {additionalResources.map((resource) => (
            <Link
              key={resource.id}
              href={resource.href}
              className="group flex flex-col overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] transition-all hover:-translate-y-2 hover:shadow-xl"
            >
              <div className={cn("flex aspect-[4/3] items-center justify-center p-12", resource.backgroundColor)}>
                <div className="transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  {resource.icon}
                </div>
              </div>
              <div className="flex flex-col space-y-4 p-8">
                <h3 className="font-slab text-xl font-bold text-gray-900">
                  {resource.title}
                </h3>
                <p className="font-sora text-greys-800 leading-relaxed">
                  {resource.description}
                </p>
                <div className="flex items-center gap-2 font-bold text-[#12AC75]">
                  <span className="text-sm">{resource.ctaText}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
