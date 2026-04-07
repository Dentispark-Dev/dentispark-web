"use client";

import { motion, Variants } from "framer-motion";
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

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function MentorSection() {
  return (
    <section className="bg-white pb-32 overflow-hidden">
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-12 lg:grid-cols-2"
        >
          {mentors.map((mentor) => (
            <motion.div
              key={mentor.slug}
              variants={itemVariants}
              className="group relative h-[550px] overflow-hidden rounded-[3.5rem] border border-slate-100 shadow-2xl transition-all duration-700 hover:-translate-y-2 hover:shadow-emerald-500/10"
            >
              {/* Background Image */}
              <div className="absolute inset-0 size-full">
                <Image
                  src={mentor.image}
                  alt={mentor.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  quality={90}
                  priority
                />
                {/* Cinematic Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-90" />
                <div className="absolute inset-0 bg-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
                {/* Quote with Glassmorphism */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="mb-10 p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl"
                >
                  <p className="font-jakarta text-sm md:text-base leading-relaxed italic text-slate-200">
                    &ldquo;{mentor.quote}&rdquo;
                  </p>
                </motion.div>

                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                  {/* Mentor Info */}
                  <div className="space-y-2">
                    <h3 className="font-jakarta text-3xl font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                      {mentor.name}
                    </h3>
                    <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                      {mentor.title}
                    </div>
                  </div>

                  {/* Profile Button */}
                  <div className="shrink-0">
                    <Link href={`/mentor/${mentor.slug}`}>
                      <Button
                        className="h-14 px-8 rounded-2xl bg-white text-slate-950 font-jakarta font-extrabold text-sm hover:bg-emerald-500 hover:text-white transition-all duration-300 shadow-xl shadow-white/5 hover:shadow-emerald-500/20"
                      >
                        View Profile
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
