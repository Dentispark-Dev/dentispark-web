"use client";

import { motion } from "framer-motion";
import { Star, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";

import { PersonalizedMentor } from "../services/overview.api";

interface PersonalizedMentorsProps {
  showViewAll?: boolean;
  mentors?: PersonalizedMentor[];
  isLoading?: boolean;
}

export default function PersonalizedMentors({
  showViewAll = true,
  mentors = [],
  isLoading = false,
}: PersonalizedMentorsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="mb-8 flex items-end justify-between">
        <div className="space-y-1">
            <h3 className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-emerald-600">Expert Guidance</h3>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Personalized Mentors
            </h2>
        </div>
        {showViewAll && (
          <Link
            href="/mentorship"
            className="text-emerald-700 hover:text-emerald-800 flex items-center gap-2 text-sm font-bold transition-colors uppercase tracking-widest"
          >
            Review All Roster <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-[2rem] bg-slate-50 border border-slate-100" />
          ))}
        </div>
      ) : mentors.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-[2rem] bg-slate-50 text-slate-400 font-medium">
          No personalized mentors found for your profile.
        </div>
      ) : (
        <div className="block">
          <Carousel
            opts={{
              align: "start",
              loop: false,
              dragFree: false,
              containScroll: "trimSnaps",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-6">
              {mentors.map((mentor, index) => (
                <CarouselItem
                  key={mentor.id}
                  className="pl-6 basis-[90%] md:basis-1/2 lg:basis-1/3"
                >
                  <motion.div
                    className="flex flex-row items-center gap-6 rounded-[2rem] border border-slate-100 bg-white p-6 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:border-emerald-200 group h-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="relative shrink-0">
                      <div className="bg-slate-50 h-24 w-24 overflow-hidden rounded-[1.25rem] border border-slate-100 group-hover:border-emerald-200 transition-colors">
                        <Image
                          src={mentor.avatar || "/images/premium/mentor-banner.png"}
                          alt={mentor.name}
                          className="h-full w-full object-cover"
                          width={120}
                          height={120}
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-white rounded-lg p-1 shadow-sm border border-slate-100">
                          <span className="text-lg leading-none">{mentor.flag}</span>
                      </div>
                    </div>

                    <div className="flex flex-col flex-1 min-w-0">
                      <h3 className="text-slate-900 font-extrabold text-lg truncate pr-2">
                        {mentor.name}
                      </h3>
                      <p className="text-slate-500 text-xs font-bold mb-3 truncate">
                        {mentor.title}
                      </p>

                      <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-600">
                                <Star className="h-3 w-3 fill-amber-500" />
                                <span className="text-xs font-extrabold">
                                  {mentor.rating}
                                </span>
                              </div>
                              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 truncate">
                                {mentor.reviewCount} Reviews
                              </span>
                          </div>
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden lg:block">
              <CarouselPrevious className="hover:bg-slate-50 border-slate-200 absolute top-1/2 -left-4 size-12 -translate-y-1/2 border bg-white shadow-xl text-slate-600 rounded-2xl" />
              <CarouselNext className="hover:bg-slate-50 border-slate-200 absolute top-1/2 -right-4 size-12 -translate-y-1/2 border bg-white shadow-xl text-slate-600 rounded-2xl" />
            </div>
          </Carousel>
        </div>
      )}
    </motion.div>
  );
}
