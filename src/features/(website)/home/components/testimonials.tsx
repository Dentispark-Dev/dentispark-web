// components/Testimonials.tsx
"use client";

import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import Container from "@/src/components/layouts/container";

import testimonial1 from "@/public/images/testimonial-1.png";
import testimonial2 from "@/public/images/testimonial-2.png";
import testimonial3 from "@/public/images/testimonial-3.png";

import testimonial from "@/public/images/testimonial-image.png";
import mTestimonial from "@/public/images/testimonial-image-m.png";

import LondonLogo from "@/src/components/icons/London";
import storyImg from "@/public/images/story.png";
import bigReadiousBg from "@/public/icons/big-radius-bg.svg";
import smRadiousBg from "@/public/icons/sm-radius-bg.svg";
import quoteBg from "@/public/icons/quote.svg";
import { Title } from "@/src/components/atoms/title";





export function Testimonials() {
  return (
    <section className="bg-[#fcfcfc] py-24 md:py-32">
      <Container className="flex flex-col items-center space-y-20">
        <div className="flex flex-col items-center space-y-4 text-center">
          <Title>Testimonials</Title>
          <h2 className="font-slab text-4xl font-bold text-gray-900 md:text-5xl">
            Real Stories. Real Impact.
          </h2>
        </div>

        {/* Hero testimonial - Enhanced */}
        <div className="group relative w-full max-w-5xl overflow-hidden rounded-[2.5rem] bg-black shadow-2xl">
          <div className="relative aspect-video w-full md:aspect-[16/7]">
            <Image
              src={testimonial}
              alt="Aisha Mubarak"
              fill
              className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16">
            <div className="max-w-2xl space-y-6">
              <LondonLogo className="h-12 w-12 text-white" />
              <blockquote className="font-slab text-2xl leading-tight font-medium text-white md:text-4xl">
                &ldquo;Dentispark&apos;s free guides helped me ace my UCAT and secure my place at university.&rdquo;
              </blockquote>
              <div className="flex flex-col">
                <cite className="not-italic text-xl font-bold text-[#12AC75]">Aisha Mubarak</cite>
                <span className="text-lg text-gray-300">University of London</span>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Grid - Clean Elevated Cards */}
        <div className="grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              name: "Temi Sims",
              role: "Prospective Dental Nursing",
              quote: "DentiSpark's free UCAT guide helped me score 2700! The resources are incredibly detailed.",
              img: testimonial1,
              bg: "bg-white"
            },
            {
              name: "Jamal Johnson",
              role: "BDS - Dental Hygienist",
              quote: "Mentorship from a Black hygienist kept me motivated throughout the entire application process.",
              img: testimonial2,
              bg: "bg-white"
            },
            {
              name: "Aisha Emma",
              role: "Apprentice Dental Nursing",
              quote: "The free apprenticeship guides got me started when I didn't know where else to turn.",
              img: testimonial3,
              bg: "bg-white"
            }
          ].map((t, i) => (
            <div key={i} className="flex flex-col justify-between rounded-3xl bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all hover:-translate-y-2 hover:shadow-xl">
              <div className="space-y-6">
                <Image src={quoteBg} alt="Quotes" width={40} height={40} className="opacity-20" />
                <p className="font-sora text-greys-800 text-lg leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-14 w-14 overflow-hidden rounded-full ring-2 ring-primary/10">
                  <Image src={t.img} alt={t.name} width={56} height={56} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{t.name}</h4>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Story - Sleek CTA */}
        <div className="bg-greys-1000 group relative flex w-full max-w-5xl flex-col items-center gap-12 overflow-hidden rounded-[3rem] p-8 md:flex-row md:p-16">
          <div className="relative z-10 flex-shrink-0">
            <div className="relative size-64 overflow-hidden rounded-[2rem] border-4 border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-105 md:size-80">
              <Image src={storyImg} alt="Success Story" fill className="object-cover" />
            </div>
          </div>
          
          <div className="relative z-10 flex-1 space-y-8 text-center md:text-left">
            <h3 className="font-slab text-3xl font-bold text-white md:text-5xl md:leading-tight">
              How Aisha Got into King&apos;s College London.
            </h3>
            <Button size="lg" className="bg-[#12AC75] hover:bg-[#0e8a5d] px-10 py-7 text-lg font-bold transition-all hover:scale-105 active:scale-95">
              Read the Full Story
            </Button>
          </div>

          {/* Abstract Decorations */}
          <div className="absolute top-0 right-0 h-full w-full opacity-10">
            <Image src={bigReadiousBg} alt="" fill className="object-contain" />
          </div>
        </div>
      </Container>
    </section>
  );
}
