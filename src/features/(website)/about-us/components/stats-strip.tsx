"use client";

import { motion } from "framer-motion";
import Container from "@/src/components/layouts/container";

const stats = [
  { num: "1 in 5", text: "dental applicants from underrepresented backgrounds" },
  { num: "68%", text: "of advisors report limited resources for health profession pathways" },
  { num: "4 guides", text: "co-created with advisors, students, parents & practices" },
];

export function StatsStrip() {
  return (
    <div className="bg-[#0D3D2B] rounded-[3.5rem] mt-16 overflow-hidden shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {stats.map((stat, i) => (
          <div key={i} className={`p-10 text-center border-[#FFFFFF10] ${i !== stats.length - 1 ? 'md:border-r' : ''}`}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="font-bricolage text-5xl font-extrabold text-white mb-3"
            >
              {stat.num.includes("in") ? (
                <> {stat.num.split("in")[0]} <span className="text-[#1DB974]">in</span> {stat.num.split("in")[1]} </>
              ) : stat.num.includes("guides") ? (
                <> <span className="text-[#1DB974]">{stat.num.split(" ")[0]}</span> {stat.num.split(" ")[1]} </>
              ) : (
                <> {stat.num.replace("%", "")}<span className="text-[#1DB974]">%</span> </>
              )}
            </motion.div>
            <p className="font-jakarta text-xs text-white/40 max-w-[180px] mx-auto leading-relaxed">
              {stat.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
