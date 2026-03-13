// components/HowItWorks.tsx
"use client";

import Link from "next/link";
import Container from "@/src/components/layouts/container";
import { ArrowRight } from "lucide-react";

import DiscoverYourPath from "@/public/icons/discover-your-path.svg";
import AccessFreeTools from "@/public/icons/access-free-tool.svg";
import ConnectWithScholars from "@/public/icons/connect-with-mentors.svg";
import TrackYourJourney from "@/public/icons/track-your-journey.svg";
import { cn } from "@/src/lib/utils";
import Image, { StaticImageData } from "next/image";

type Card = {
  step: number;
  title: string;
  titleColor: string;
  description: string;
  icon: StaticImageData;
  bgColor: string;
  hasLink?: boolean;
};

const cards: Card[] = [
  {
    step: 1,
    title: "Discover Your Path",
    titleColor: "text-success-600",
    description:
      "Take the quiz to find your category (BDS, Dental Nursing, Dental Hygiene/Therapy).",
    icon: DiscoverYourPath,
    bgColor: "bg-success-200",
  },
  {
    step: 2,
    title: "Access Free Tools",
    titleColor: "text-warning-600",
    description: "Use guides, checklists, and university data.",
    icon: AccessFreeTools,
    bgColor: "bg-warning-200",
  },
  {
    step: 3,
    title: "Connect with Mentors",
    titleColor: "text-secondary-600",
    description: "Meet Black dental professionals.",
    icon: ConnectWithScholars,
    bgColor: "bg-secondary-200",
  },
  {
    step: 4,
    title: "Track Your Journey",
    titleColor: "text-primary",
    description: "Follow year-specific milestones.",
    icon: TrackYourJourney,
    bgColor: "bg-primary-200",
    hasLink: true,
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-24 md:py-32">
      <Container className="flex flex-col space-y-20">
        <div className="flex flex-col items-center space-y-4 text-center">
          <span className="text-primary border-primary rounded-full border px-4 py-1 text-sm font-semibold tracking-wide uppercase">
            How it works
          </span>
          <h2 className="font-slab max-w-2xl text-4xl font-bold text-gray-900 md:text-5xl">
            Simple. Supportive. Powerful.
          </h2>
        </div>

        <div className="flex flex-col space-y-24 md:space-y-32">
          {cards.map(({ step, bgColor, icon: Icon, title, titleColor, description, hasLink }, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col items-center justify-between gap-12 md:flex-row",
                index % 2 !== 0 && "md:flex-row-reverse"
              )}
            >
              {/* Image/Icon Side */}
              <div className={cn(bgColor, "flex w-full flex-1 items-center justify-center rounded-[2rem] p-12 md:max-w-[450px]")}>
                <Image
                  src={Icon}
                  alt={title}
                  width={300}
                  height={300}
                  className="w-full max-w-[240px] transform transition-transform duration-500 hover:scale-105"
                />
              </div>

              {/* Text Side */}
              <div className="flex flex-1 flex-col space-y-6">
                <div className="flex flex-col space-y-4">
                  <span className={cn(titleColor, "text-lg font-bold uppercase tracking-wider")}>
                    Step {step}
                  </span>
                  <h3 className="font-slab text-3xl font-bold text-gray-900 md:text-4xl">
                    {title}
                  </h3>
                  <p className="font-sora text-greys-800 max-w-md text-lg leading-relaxed">
                    {description}
                  </p>
                </div>
                {hasLink && (
                  <div>
                    <Link
                      href="/journey"
                      className="text-primary bg-primary/10 hover:bg-primary/20 inline-flex items-center gap-2 rounded-full px-8 py-3 font-semibold transition-all"
                    >
                      Start Your Journey for Free
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
