// components/JoinSection.tsx
"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import FooterPattern from "@/src/components/icons/FooterPattern";
// Assuming you placed your SVG under /components/ui/, or adjust the path:

export function JoinSection() {
  return (
    <section className="bg-greys-1000 relative overflow-hidden py-32 md:py-48">
      {/* SVG Pattern */}
      <FooterPattern className="pointer-events-none absolute inset-0 h-full w-full opacity-20" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center space-y-12 text-center text-white px-4">
        <h2 className="font-slab text-4xl font-bold leading-tight md:text-6xl md:leading-tight">
          Join <span className="text-[#12AC75]">5,000+</span> students who started their journey this month
        </h2>
        <Link href="/sign-up" className="cursor-pointer">
          <Button size="lg" className="bg-[#12AC75] hover:bg-[#0e8a5d] px-12 py-8 text-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl">
            Start Your Journey for Free
          </Button>
        </Link>
      </div>
    </section>
  );
}
