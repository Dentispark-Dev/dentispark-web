"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";
import Image from "next/image";

interface Resource {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  category: string;
}

const mockResources: Resource[] = [
  {
    id: "1",
    title: "M7 MBA Programs - What They Are & How to Get In",
    description:
      "An expert admissions coach details how to get into an elite M7 business school with ways to stand out in your application and showcase leadership potential.",
    date: "May 23, 2023",
    image: "/images/resource-1.png",
    category: "MBA",
  },
  {
    id: "2",
    title: "Mastering the GMAT: Strategies for Success",
    description:
      "Discover effective study techniques and time management tips to ace the GMAT, enhancing your chances of admission to top business schools.",
    date: "June 15, 2023",
    image: "/images/resource-2.png",
    category: "GMAT",
  },
  {
    id: "3",
    title: "Medical School Application Timeline",
    description:
      "A comprehensive guide to planning your medical school application process from start to finish, including key deadlines and requirements.",
    date: "July 8, 2023",
    image: "/images/resource-3.png",
    category: "Medical",
  },
  {
    id: "4",
    title: "Dental School Interview Preparation",
    description:
      "Essential tips and practice questions to help you excel in dental school interviews and make a lasting impression on admissions committees.",
    date: "August 12, 2023",
    image: "/images/resource-4.png",
    category: "Dental",
  },
  {
    id: "5",
    title: "UCAT Exam Guide: Complete Preparation",
    description:
      "Master the UCAT exam with comprehensive study materials, practice tests, and proven strategies from successful medical students.",
    date: "September 5, 2023",
    image: "/images/resource-5.png",
    category: "UCAT",
  },
  {
    id: "6",
    title: "Personal Statement Writing Masterclass",
    description:
      "Learn how to craft compelling personal statements that showcase your passion, experience, and commitment to your chosen field.",
    date: "October 18, 2023",
    image: "/images/resource-6.png",
    category: "Application",
  },
];

interface PopularResourcesProps {
  showViewAll?: boolean;
}

export default function PopularResources({
  showViewAll = true,
}: PopularResourcesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-16"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-black-800 font-semibold md:text-xl">
          Popular Resources
        </h2>
        {showViewAll && (
          <Link
            href="/overview/popular-resources"
            className="font-sora hidden items-center gap-2 text-xs transition-colors hover:text-gray-700 md:flex"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M13.3327 1.66797H6.66602C3.33268 1.66797 1.66602 3.33464 1.66602 6.66797V17.5013C1.66602 17.9596 2.04102 18.3346 2.49935 18.3346H13.3327C16.666 18.3346 18.3327 16.668 18.3327 13.3346V6.66797C18.3327 3.33464 16.666 1.66797 13.3327 1.66797Z"
                stroke="#4F4F4F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.83398 7.91797H14.1673"
                stroke="#4F4F4F"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.83398 12.0859H11.6673"
                stroke="#4F4F4F"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            See all Resources
          </Link>
        )}

        {showViewAll && (
          <Link
            href="/overview/popular-resources"
            className="text-primary-600 hover:text-primary-700 flex items-center gap-2 text-xs font-medium md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M13.3327 1.66797H6.66602C3.33268 1.66797 1.66602 3.33464 1.66602 6.66797V17.5013C1.66602 17.9596 2.04102 18.3346 2.49935 18.3346H13.3327C16.666 18.3346 18.3327 16.668 18.3327 13.3346V6.66797C18.3327 3.33464 16.666 1.66797 13.3327 1.66797Z"
                stroke="#4F4F4F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.83398 7.91797H14.1673"
                stroke="#4F4F4F"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.83398 12.0859H11.6673"
                stroke="#4F4F4F"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            See all
          </Link>
        )}
      </div>

      {/* Mobile & Desktop: Carousel */}
      <div className="block overflow-hidden rounded-2xl">
        <Carousel
          opts={{
            align: "start",
            loop: false,
            dragFree: false,
            containScroll: "trimSnaps",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {mockResources.map((resource, index) => (
              <CarouselItem
                key={resource.id}
                className="basis-full pl-4 sm:basis-[70%] md:basis-1/2 lg:basis-full xl:basis-full"
              >
                <motion.div
                  className="flex h-full flex-col group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-sm border border-slate-100">
                    <Image
                      src={resource.image}
                      alt={resource.title}
                      className="h-[180px] w-full object-cover group-hover:scale-105 transition-transform duration-700"
                      width={1000}
                      height={1000}
                      priority
                      quality={90}
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-800">
                      {resource.category}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col pt-4 space-y-2">
                    <p className="text-slate-400 font-black text-[9px] uppercase tracking-widest">
                      {resource.date}
                    </p>
                    <h3 className="text-slate-900 line-clamp-2 text-sm font-black leading-tight group-hover:text-emerald-600 transition-colors">
                      {resource.title}
                    </h3>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden lg:flex justify-end gap-2 mt-4">
            <CarouselPrevious className="static translate-y-0 rounded-xl border-slate-100 hover:bg-emerald-50 hover:text-emerald-600 shadow-sm" />
            <CarouselNext className="static translate-y-0 rounded-xl border-slate-100 hover:bg-emerald-50 hover:text-emerald-600 shadow-sm" />
          </div>
        </Carousel>
      </div>
    </motion.div>
  );
}
