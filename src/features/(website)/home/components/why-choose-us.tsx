"use client";

import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";
import Container from "@/src/components/layouts/container";

import whyUsImage1 from "@/public/images/why-us-1.png";
import whyUsImage2 from "@/public/images/why-us-2.png";
import whyUsImage3 from "@/public/images/why-us-3.png";
import whyUsImage4 from "@/public/images/why-us-4.png";

const features = [
  {
    title: "Free Guides & Checklists",
    description:
      "Access expertly crafted guides and checklists designed to help you stay organized, informed, and confident every step of the way — and yes, they're absolutely free.",
    imageSrc: whyUsImage1,
    imageAlt: "Person studying a guide",
  },
  {
    title: "AI-Driven Tools",
    description: "Smart Features to Help You Work Faster and Smarter",
    imageSrc: whyUsImage2,
    imageAlt: "AI robot on a screen",
  },
  {
    title: "Direct University Access",
    description:
      "Gain streamlined access to verified university representatives for guidance, application support, and up-to-date information — all in one place.",
    imageSrc: whyUsImage3,
    imageAlt: "Key unlocking a door",
  },
  {
    title: "Direct University Partnerships",
    description:
      "Get exclusive access and direct links to partner universities, fast-track your applications, and enjoy priority support from admissions officers.",
    imageSrc: whyUsImage4,
    imageAlt: "Key unlocking a door",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-24 md:py-32">
      <Container className="flex flex-col space-y-16">
        <div className="flex flex-col items-center space-y-4 text-center">
          <span className="text-secondary-600 border-secondary-200 bg-secondary-50 rounded-full border px-4 py-1 text-sm font-semibold tracking-wide uppercase">
            Our Advantage
          </span>
          <h2 className="font-slab text-4xl font-bold text-gray-900 md:text-5xl">
            Why Choose DentiSpark?
          </h2>
          <p className="font-sora text-greys-800 max-w-2xl text-lg">
            We provide specialized support to help you navigate the competitive landscape of dental school admissions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="group flex flex-col overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] transition-all hover:shadow-2xl"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={f.imageSrc}
                  alt={f.imageAlt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="flex flex-col space-y-4 p-10">
                <h3 className="font-slab text-2xl font-bold text-gray-900">
                  {f.title}
                </h3>
                <p className="font-sora text-greys-800 text-lg leading-relaxed">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
