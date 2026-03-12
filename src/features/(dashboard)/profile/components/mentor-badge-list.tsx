"use client";

import { motion } from "framer-motion";
import { ShieldCheck, GraduationCap, Award, CheckCircle2 } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface BadgeConfig {
  icon: any;
  label: string;
  color: string;
  bgColor: string;
}

const BADGE_MAP: Record<string, BadgeConfig> = {
  "GDC_REGISTERED": {
    icon: ShieldCheck,
    label: "GDC Registered",
    color: "text-blue-700",
    bgColor: "bg-blue-50"
  },
  "OXFORD_GRAD": {
    icon: GraduationCap,
    label: "Oxford Graduate",
    color: "text-purple-700",
    bgColor: "bg-purple-50"
  },
  "KINGS_GRAD": {
    icon: GraduationCap,
    label: "King's Graduate",
    color: "text-red-700",
    bgColor: "bg-red-50"
  },
  "UCAT_3000": {
    icon: Award,
    label: "UCAT 3000+ Club",
    color: "text-amber-700",
    bgColor: "bg-amber-50"
  },
  "TOP_MENTOR": {
    icon: CheckCircle2,
    label: "Top Mentor 2024",
    color: "text-green-700",
    bgColor: "bg-green-50"
  }
};

interface MentorBadgeListProps {
  badges?: string[];
}

export function MentorBadgeList({ badges = [] }: MentorBadgeListProps) {
  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 py-4">
      {badges.map((badgeKey, index) => {
        const config = BADGE_MAP[badgeKey];
        if (!config) return null;
        
        const Icon = config.icon;

        return (
          <motion.div
            key={badgeKey}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 260, damping: 20 }}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border border-current/10 shadow-sm backdrop-blur-md",
              config.bgColor,
              config.color
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wide">
              {config.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
