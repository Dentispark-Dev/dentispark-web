"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, User, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/src/lib/utils";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: "Interviews" | "UCAT" | "Personal Statement" | "Clinical";
  author: string;
  date: string;
  readTime: string;
  image: string;
}

const SAMPLE_POSTS: BlogPost[] = [
  {
    id: "ucat-2026-strategy",
    title: "The Ultimate 2026 UCAT Strategy: From Band 3 to Band 1",
    excerpt: "Mastering the UCAT isn't just about practice—it's about pattern recognition. Discover the techniques used by top 1% candidates.",
    category: "UCAT",
    author: "Dr. Neil Sims",
    date: "April 12, 2024",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "mmi-ethics-mastery",
    title: "MMI Ethics Mastery: Navigating GDC Standards in Your Interview",
    excerpt: "The General Dental Council standards are the foundation of your interview. Learn how to apply them to complex ethical scenarios.",
    category: "Interviews",
    author: "Sarah Jenkins",
    date: "April 10, 2024",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "personal-statement-narrative",
    title: "The Narrative Arc: Why Your Personal Statement Needs a Story",
    excerpt: "Avoid the list of achievements. Build a narrative that shows your manual dexterity and reflective practice from day one.",
    category: "Personal Statement",
    author: "David Chen",
    date: "April 08, 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1973&auto=format&fit=crop"
  },
  {
    id: "clinical-work-exp-guide",
    title: "Shadowing Protocol: How to Maximize Your Clinical Work Experience",
    excerpt: "Don't just watch—observe. Our guide on how to log and reflect on clinical procedures for your dental school application.",
    category: "Clinical",
    author: "Dr. Amara Okoro",
    date: "April 05, 2024",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070&auto=format&fit=crop"
  }
];

export function BlogGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {SAMPLE_POSTS.map((post, i) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
        >
          <Link href={`/blog/${post.id}`} className="group block h-full">
            <article className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden h-full flex flex-col hover:border-emerald-200 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
              {/* Image Container */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <div className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-white backdrop-blur-md",
                    post.category === "UCAT" && "bg-blue-600/80",
                    post.category === "Interviews" && "bg-emerald-600/80",
                    post.category === "Personal Statement" && "bg-amber-600/80",
                    post.category === "Clinical" && "bg-purple-600/80",
                  )}>
                    {post.category}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
                  <div className="flex items-center gap-1.5">
                    <CalendarEventIcon /> {post.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-3" /> {post.readTime}
                  </div>
                </div>

                <h3 className="text-2xl font-jakarta font-extrabold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors leading-tight">
                  {post.title}
                </h3>
                
                <p className="text-slate-500 font-medium leading-relaxed mb-8 flex-1">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-extrabold text-slate-500 border border-white outline outline-1 outline-slate-100">
                      {post.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm font-bold text-slate-900">{post.author}</span>
                  </div>
                  
                  <div className="size-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <ArrowRight className="size-5" />
                  </div>
                </div>
              </div>
            </article>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

function CalendarEventIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}
