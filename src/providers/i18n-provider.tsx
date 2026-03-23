"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Locale = "en" | "fr" | "ar";

type Dictionary = {
  [key: string]: string;
};

const dictionaries: Record<Locale, Dictionary> = {
  en: {
    dashboard_title: "Student Intelligence Hub",
    dashboard_subtitle: "Your journey to dental excellence starts here.",
    welcome_greeting_morning: "Good Morning",
    welcome_greeting_afternoon: "Good Afternoon",
    welcome_greeting_evening: "Good Evening",
    welcome_subtitle: "Your dream school is just a step away.",
    referral_title: "Refer & Unlock Premium",
    growth_hub: "Growth & Rewards",
    settings: "Account Settings",
    search_placeholder: "Search anything (Cmd+K)...",
    upgrade_now: "Upgrade to Premium",
    welcome_default_name: "Future Dentist",
    welcome_default_year: "Year 1",
  },
  fr: {
    dashboard_title: "Centre d'Intelligence Étudiant",
    dashboard_subtitle: "Votre voyage vers l'excellence dentaire commence ici.",
    welcome_greeting_morning: "Bon matin",
    welcome_greeting_afternoon: "Bon après-midi",
    welcome_greeting_evening: "Bonne soirée",
    welcome_subtitle: "L'école de vos rêves est à portée de main.",
    referral_title: "Parrainez et Débloquez le Premium",
    growth_hub: "Croissance et Récompenses",
    settings: "Paramètres du Compte",
    search_placeholder: "Rechercher (Cmd+K)...",
    upgrade_now: "Passer au Premium",
    welcome_default_name: "Futur Dentiste",
    welcome_default_year: "Année 1",
  },
  ar: {
    dashboard_title: "مركز ذكاء الطلاب",
    dashboard_subtitle: "رحلتك نحو التميز في طب الأسنان تبدأ من هنا.",
    welcome_greeting_morning: "صباح الخير",
    welcome_greeting_afternoon: "مساء الخير",
    welcome_greeting_evening: "مساء الخير",
    welcome_subtitle: "مدرسة أحلامك على بعد خطوة واحدة.",
    referral_title: "أحل الأصدقاء وافتح الميزات المميزة",
    growth_hub: "النمو والمكافآت",
    settings: "إعدادات الحساب",
    search_placeholder: "بحث (Cmd+K)...",
    upgrade_now: "الترقية إلى بريميوم",
    welcome_default_name: "طبيب أسنان المستقبل",
    welcome_default_year: "السنة 1",
  },
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  const t = (key: string) => {
    return dictionaries[locale][key] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      <div 
        dir={locale === "ar" ? "rtl" : "ltr"}
        style={{ display: "contents" }}
      >
        {children}
      </div>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
