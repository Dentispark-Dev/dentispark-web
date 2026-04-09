"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/src/providers/i18n-provider";
import { useAuth } from "@/src/providers/auth-provider";

interface WelcomeSectionProps {
  userName?: string;
  userYear?: string;
}

export default function WelcomeSection({
  userName,
  userYear,
}: WelcomeSectionProps) {
  const { t } = useI18n();
  const { user } = useAuth();
  
  const displayUserName = userName || user?.fullName || t("welcome_default_name");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("welcome_greeting_morning");
    if (hour < 18) return t("welcome_greeting_afternoon");
    return t("welcome_greeting_evening");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex flex-col gap-1">
        <span className="caption-caps">{getGreeting()}</span>
        <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
          {displayUserName}
        </h1>
        <p className="text-slate-500 font-bold text-sm">
          {t("welcome_subtitle") || "Ready to secure your place in clinical excellence?"}
        </p>
      </div>
    </motion.div>
  );
}
