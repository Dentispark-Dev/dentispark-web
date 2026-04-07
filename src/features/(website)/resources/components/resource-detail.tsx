"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import Container from "@/src/components/layouts/container";
import resourceDetailImage from "@/public/images/resource-detail.png";
import resourceContentImage from "@/public/images/resource-content-img.png";
import type { Resource } from "../data/resources";
import { ResourcesGridSecondary } from "./resources-grid-secondary";
import { cn } from "@/src/lib/utils";

interface ResourceDetailProps {
  resource: Resource;
}

export function ResourceDetail({ resource }: ResourceDetailProps) {
  const [isTocCollapsed, setIsTocCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("section-0");

  const tableOfContents = useMemo(
    () => resource.sections.map(s => s.title),
    [resource.sections],
  );

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = resource.sections.map((_, index) => `section-${index}`);
      const scrollPosition = window.scrollY + 100; // Offset for header

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, [resource.sections]);

  return (
    <main className="min-h-screen bg-white py-16 font-jakarta">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto"
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-black-700 mb-4 text-3xl leading-[120%] font-black sm:text-4xl tracking-tight"
            >
              {resource.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-black-400 font-bold uppercase tracking-widest text-[10px]"
            >
              Published on {resource.date}
            </motion.p>
          </div>

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-12 overflow-hidden rounded-[2.5rem] border border-slate-100 shadow-2xl"
          >
            <Image
              src={resourceDetailImage}
              alt={resource.title}
              width={1000}
              height={1000}
              className="w-full object-cover"
              quality={90}
              placeholder="blur"
              priority
            />
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid gap-24 lg:grid-cols-6"
          >
            {/* Table of Contents - Left Sidebar */}
            <div className="lg:col-span-2">
              <div className="sticky top-20 space-y-6">
                {/* Table of Contents */}
                <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-slate-900 text-sm font-black uppercase tracking-widest">
                      On This Page
                    </h3>
                    <button
                      onClick={() => setIsTocCollapsed(!isTocCollapsed)}
                      className="hover:bg-emerald-50 text-emerald-600 rounded-full p-1 transition-colors"
                      aria-label={
                        isTocCollapsed
                          ? "Expand table of contents"
                          : "Collapse table of contents"
                      }
                    >
                      {isTocCollapsed ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronUp className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <motion.div
                    initial={false}
                    animate={{
                      height: isTocCollapsed ? 0 : "auto",
                      opacity: isTocCollapsed ? 0 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <ul className="space-y-4">
                      {tableOfContents.map((item, index) => {
                        const sectionId = `section-${index}`;
                        const isActive = activeSection === sectionId;
                        return (
                          <li key={index}>
                            <button
                              onClick={() => scrollToSection(sectionId)}
                              className={cn(
                                "font-jakarta text-left text-sm transition-all duration-300 hover:translate-x-1",
                                isActive
                                  ? "font-bold text-emerald-600"
                                  : "text-slate-400 font-medium hover:text-slate-600",
                              )}
                            >
                              {item}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </motion.div>
                </div>

                {/* Share Section */}
                <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8">
                  <h3 className="text-slate-400 mb-4 text-[10px] font-black uppercase tracking-widest">
                    Share Insight
                  </h3>
                  <div className="flex items-center gap-3">
                    {/* Instagram */}
                    <a
                      href="#"
                      className="bg-white border border-slate-100 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100 flex h-10 w-10 items-center justify-center rounded-xl transition-all shadow-sm"
                      aria-label="Share on Instagram"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>

                    {/* Facebook */}
                    <a
                      href="#"
                      className="bg-white border border-slate-100 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100 flex h-10 w-10 items-center justify-center rounded-xl transition-all shadow-sm"
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>

                    {/* Twitter */}
                    <a
                      href="#"
                      className="bg-white border border-slate-100 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100 flex h-10 w-10 items-center justify-center rounded-xl transition-all shadow-sm"
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Right Side */}
            <div className="space-y-16 lg:col-span-4">
              {resource.sections.map((section, index) => (
                <div key={index} className="space-y-6" id={`section-${index}`}>
                  <h2
                    className={cn(
                      "text-2xl font-black transition-colors lg:text-3xl tracking-tight leading-tight",
                      activeSection === `section-${index}`
                        ? "text-emerald-600"
                        : "text-slate-900",
                    )}
                  >
                    {section.title}
                  </h2>
                  <p className="text-lg leading-relaxed text-slate-600 font-medium">
                    {section.content}
                  </p>
                  {index === 0 && (
                    <div className="overflow-hidden rounded-[2rem] border border-slate-100 shadow-xl my-10">
                      <Image
                        src={resourceContentImage}
                        alt="Clinical Guidance"
                        width={800}
                        height={500}
                        className="w-full object-cover"
                        quality={90}
                        placeholder="blur"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </Container>

      <div className="mt-32">
        <Container>
          <h2 className="mb-8 text-2xl font-semibold transition-colors lg:text-3xl">
            You might also like
          </h2>
        </Container>

        <ResourcesGridSecondary />
      </div>
    </main>
  );
}
