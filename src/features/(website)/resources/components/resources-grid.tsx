"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Container from "@/src/components/layouts/container";

// Import resource images
import resource1 from "@/public/images/resource-1.png";
import resource2 from "@/public/images/resource-2.png";
import resource3 from "@/public/images/resource-3.png";

const resources = [
  {
    id: "ucat-guide",
    title: "DentiSpark UCAT Prep Guide",
    description: "Master the UCAT with DentiSpark's proprietary strategic roadmap.",
    date: "March 15, 2024",
    image: resource1,
    imageAlt: "UCAT Prep Guide",
  },
  {
    id: "dental-booklet",
    title: "Dental Schools Council Yearbook",
    description: "Your official, curated guide to UK Dental education requirements.",
    date: "January 10, 2024",
    image: resource2,
    imageAlt: "Dental Schools Council 2025 Booklet",
  },
  {
    id: "ps-template",
    title: "Personal Statement Template",
    description: "DentiSpark-specific template reflective of actual UK dental school requirements.",
    date: "February 20, 2024",
    image: resource3,
    imageAlt: "Personal Statement Template",
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

export function ResourcesGrid() {
  return (
    <section className="bg-white pb-8">
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {resources.map((resource) => (
            <Link
              key={resource.id}
              href={`/resources/${resource.id}`}
              className="cursor-pointer"
            >
              <motion.div
                variants={cardVariants}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
                className="group flex flex-col overflow-hidden bg-white"
              >
                <div className="mb-2 overflow-hidden rounded-lg">
                  <Image
                    src={resource.image}
                    alt={resource.imageAlt}
                    width={1000}
                    height={1000}
                    className="w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    quality={85}
                    placeholder="blur"
                    priority
                  />
                </div>
                <div className="flex flex-col py-6">
                  <p className="text-black-400 font-sora mb-2 text-sm">
                    {resource.date}
                  </p>
                  <h3 className="text-black-700 mb-3 line-clamp-2 text-lg font-semibold">
                    {resource.title}
                  </h3>
                  <p className="text-text-color font-sora flex-1 text-xs leading-[160%]">
                    {resource.description}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
