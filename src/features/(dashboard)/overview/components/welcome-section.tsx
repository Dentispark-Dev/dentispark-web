"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/src/providers/i18n-provider";

interface WelcomeSectionProps {
  userName?: string;
  userYear?: string;
}

export default function WelcomeSection({
  userName,
  userYear,
}: WelcomeSectionProps) {
  const { t } = useI18n();
  
  const displayUserName = userName || t("welcome_default_name");
  const displayUserYear = userYear || t("welcome_default_year");

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sora text-black-800 mb-1 text-sm font-medium md:text-base">
            {getGreeting()}, {displayUserName}
          </h1>
          <p className="text-black-300 font-sora text-xs md:text-sm">
            {t("welcome_subtitle")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
