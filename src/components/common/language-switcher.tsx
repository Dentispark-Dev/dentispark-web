"use client";

import React from "react";
import { useI18n } from "@/src/providers/i18n-provider";
import { Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = React.useState(false);

  const languages = [
    { code: "en", name: "English (UK)", flag: "🇬🇧" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
  ];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 px-4 glass-card border-greys-100 rounded-xl flex items-center gap-2 hover:bg-greys-50 transition-all group"
      >
        <Globe className="w-4 h-4 text-black-400 group-hover:text-primary-600 transition-colors" />
        <span className="text-[10px] font-black uppercase tracking-widest text-black-600">
          {languages.find(l => l.code === locale)?.name}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-12 right-0 w-48 glass-card bg-white p-2 rounded-2xl border-primary-100 shadow-2xl z-50"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLocale(lang.code as any);
                  setIsOpen(false);
                }}
                className={`w-full h-10 px-3 rounded-xl flex items-center justify-between hover:bg-primary-50 transition-all ${locale === lang.code ? 'bg-primary-50' : ''}`}
              >
                <div className="flex items-center gap-2">
                    <span className="text-sm">{lang.flag}</span>
                    <span className="text-[11px] font-bold text-black-900">{lang.name}</span>
                </div>
                {locale === lang.code && <div className="w-1.5 h-1.5 bg-primary-600 rounded-full" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
