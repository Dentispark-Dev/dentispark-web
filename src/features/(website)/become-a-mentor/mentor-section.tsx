"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import Container from "@/src/components/layouts/container";

// Import mentor images
import mentor1 from "@/public/images/mentor-img-1.png";
import mentor2 from "@/public/images/mentor-img-2.png";

const mentors = [
  {
    slug: "dt-marcus-thorne",
    name: "Dt. Marcus Thorne",
    title: "Mentor & Orthodontist",
    quote:
      "Specializing in advanced orthodontic procedures and guiding pre-dental students through the rigorous application process for specialized programs.",
    image: mentor1,
  },
  {
    slug: "dr-elena-rostova",
    name: "Dr. Elena Rostova",
    title: "Mentor & Oral Surgeon",
    quote:
      "I leverage my experience on the Harvard admissions committee to help driven students craft compelling narratives. I focus on surgical specialties and high-stakes interviews.",
    image: mentor2,
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

export function MentorSection() {
  return (
    <section className="bg-wgite pb-20">
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          {mentors.map((mentor) => (
            <motion.div
              key={mentor.slug}
              variants={cardVariants}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.3 },
              }}
              className="group relative overflow-hidden rounded-2xl"
            >
              {/* Background Image */}
              <div className="relative h-[500px] w-full">
                <Image
                  src={mentor.image}
                  alt={mentor.name}
                  fill
                  className="object-cover"
                  quality={85}
                  placeholder="blur"
                />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 mb-4 flex flex-col justify-end p-10 text-white">
                {/* Quote */}
                <div className="mb-10">
                  <p className="text-sm leading-relaxed opacity-90">
                    &ldquo;{mentor.quote}&rdquo;
                  </p>
                </div>

                <div className="flex flex-col gap-6 md:flex-row md:justify-between">
                  {/* Mentor Info */}
                  <div className="font-sora">
                    <h3 className="text-primary text-lg font-semibold">
                      {mentor.name}
                    </h3>
                    <p className="text-xs">{mentor.title}</p>
                  </div>

                  {/* Profile Button */}
                  <div>
                    <Link href={`/mentor/${mentor.slug}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="font-sora border-white bg-transparent text-sm font-light text-white hover:bg-white hover:text-black"
                      >
                        View my Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
