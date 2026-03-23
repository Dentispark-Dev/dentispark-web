"use client";

import { motion } from "framer-motion";
import { Star, Users } from "lucide-react";
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
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-black-800 font-semibold md:text-xl">
          Personalized Mentors
        </h2>
        {showViewAll && (
          <Link
            href="/overview/personalized-mentors"
            className="text-primary-600 hover:text-primary-700 hidden items-center gap-2 text-xs font-medium md:flex"
          >
            <Users className="h-4 w-4" />
            See all Mentors
          </Link>
        )}

        {showViewAll && (
          <Link
            href="/overview/personalized-mentors"
            className="text-primary-600 hover:text-primary-700 flex items-center gap-2 text-xs font-medium md:hidden"
          >
            <Users className="h-4 w-4" />
            See all
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : mentors.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
          No personalized mentors found for your profile.
        </div>
      ) : (
        /* Mobile & Desktop: Carousel */
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
            <CarouselContent className="-ml-4">
              {mentors.map((mentor, index) => (
                <CarouselItem
                  key={mentor.id}
                  className="basis-[85%] pl-4 sm:basis-[70%] md:basis-1/2 lg:basis-[40%] [@media(min-width:1800px)]:basis-1/4 [@media(min-width:2300px)]:basis-1/5 [@media(min-width:2800px)]:basis-1/6"
                >
                  <motion.div
                    className="border-greys-200 flex h-full flex-col rounded-xl border bg-white p-6 transition-shadow hover:shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex h-full flex-col items-center text-center">
                      <div className="relative mb-4">
                        <div className="bg-greys-100 h-20 w-20 overflow-hidden rounded-full md:h-24 md:w-24">
                          <Image
                            src={mentor.avatar || "/images/premium/mentor-banner.png"}
                            alt={mentor.name}
                            className="h-full w-full object-cover"
                            width={120}
                            height={120}
                          />
                        </div>
                      </div>

                      <h3 className="text-black-800 font-sora mb-1 flex items-center gap-2 text-sm font-normal">
                        {mentor.name}
                        <span className="text-lg">{mentor.flag}</span>
                      </h3>

                    <p className="text-text-color font-sora mb-3 text-xs font-medium">
                      {mentor.title}
                    </p>

                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {mentor.rating}
                        </span>
                      </div>
                      <span className="font-sora text-xs text-[#12AC75] underline">
                        {mentor.reviewCount} reviews
                      </span>
                    </div>

                    <p className="text-text-color font-sora mb-6 line-clamp-1 text-xs font-normal">
                      {mentor.description}
                    </p>

                    <Link href={`/dashboard/mentor/${mentor.slug}`} className="w-full">
                      <Button
                        variant={"outline"}
                        className="font-sora w-full rounded-lg border text-sm font-medium transition-colors"
                      >
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="hover:bg-greys-50 border-greys-300 absolute top-1/2 left-0 size-10 -translate-y-1/2 border bg-white shadow-lg" />
              <CarouselNext className="hover:bg-greys-50 border-greys-300 absolute top-1/2 -right-0 size-10 -translate-y-1/2 border bg-white shadow-lg" />
            </div>
          </Carousel>
        </div>
      )}
    </motion.div>
  );
}
