"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Twitter, Instagram, Facebook, Linkedin } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  title: string;
  image: string;
  socialLinks: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "John Doe",
    title: "Founder/CEO",
    image: "/images/team-1.png",
    socialLinks: {
      twitter: "#",
      instagram: "#",
      facebook: "#",
      linkedin: "#",
    },
  },
  {
    id: "2",
    name: "Jane Smith",
    title: "CTO",
    image: "/images/team-2.png",
    socialLinks: {
      twitter: "#",
      instagram: "#",
      facebook: "#",
      linkedin: "#",
    },
  },
  {
    id: "3",
    name: "Michael Brown",
    title: "CFO",
    image: "/images/team-3.png",
    socialLinks: {
      twitter: "#",
      instagram: "#",
      facebook: "#",
      linkedin: "#",
    },
  },
  {
    id: "4",
    name: "John Doe",
    title: "Founder/CEO",
    image: "/images/team-4.png",
    socialLinks: {
      twitter: "#",
      instagram: "#",
      facebook: "#",
      linkedin: "#",
    },
  },
  {
    id: "5",
    name: "Jane Smith",
    title: "CTO",
    image: "/images/team-5.png",
    socialLinks: {
      twitter: "#",
      instagram: "#",
      facebook: "#",
      linkedin: "#",
    },
  },
  {
    id: "6",
    name: "Michael Brown",
    title: "CFO",
    image: "/images/team-6.png",
    socialLinks: {
      twitter: "#",
      instagram: "#",
      facebook: "#",
      linkedin: "#",
    },
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

import { Variants } from "framer-motion";
import Container from "@/src/components/layouts/container";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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

export function TeamSection() {
  return (
    <section className="bg-slate-50/30 py-24 md:py-32 overflow-hidden">
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col space-y-20"
        >
          {/* Header */}
          <div className="flex flex-col items-center space-y-6 text-center">
            <motion.div variants={itemVariants} className="px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold tracking-[0.2em] uppercase">
              The Visionaries
            </motion.div>
            <motion.h2 variants={itemVariants} className="font-sora text-4xl font-extrabold text-slate-900 md:text-6xl tracking-tight">
              Meet the <span className="text-emerald-600">Team.</span>
            </motion.h2>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <motion.div
                key={member.id}
                variants={itemVariants}
                className="group relative flex flex-col items-center rounded-[3rem] bg-white border border-slate-100 p-8 shadow-[0_20px_40px_rgba(0,0,0,0.02)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(16,185,129,0.1)] hover:border-emerald-100"
              >
                {/* Profile Image */}
                <div className="relative mb-8 size-[240px] group-hover:scale-105 transition-transform duration-700">
                  <div className="absolute -inset-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity duration-700" />
                  <div className="relative size-full overflow-hidden rounded-[2.5rem] border-4 border-white shadow-xl">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  </div>
                </div>

                {/* Member Info */}
                <div className="text-center space-y-3">
                  <h3 className="font-sora text-2xl font-extrabold text-slate-900">
                    {member.name}
                  </h3>
                  <div className="inline-block px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-widest transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-100">
                    {member.title}
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-8 flex space-x-4">
                  {Object.entries(member.socialLinks).map(([platform, link]) => {
                    if (!link || link === "#") return null;
                    const Icon = platform === 'twitter' ? Twitter : platform === 'instagram' ? Instagram : platform === 'facebook' ? Facebook : Linkedin;
                    return (
                      <Link
                        key={platform}
                        href={link}
                        className="size-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-400 transition-all duration-300 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 hover:scale-110 hover:-rotate-6"
                        aria-label={`${member.name} ${platform}`}
                      >
                        <Icon className="h-4 w-4" />
                      </Link>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
