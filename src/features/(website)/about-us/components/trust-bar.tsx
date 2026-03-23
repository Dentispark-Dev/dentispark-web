"use client";

import { motion } from "framer-motion";
import Container from "@/src/components/layouts/container";

const trustItems = [
  "Working with UK secondary schools",
  "NHS practice partnerships",
  "Access Project aligned",
  "Sutton Trust principles",
  "Your data is never sold",
];

export function TrustBar() {
  return (
    <div className="bg-[#0D3D2B] py-6 overflow-hidden">
      <Container>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {trustItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 whitespace-nowrap"
            >
              <div className="size-1.5 rounded-full bg-[#1DB974]" />
              <span className="font-jakarta text-[11px] font-bold uppercase tracking-widest text-white/60">
                {item}
              </span>
            </motion.div>
          ))}
        </div>
      </Container>
    </div>
  );
}
