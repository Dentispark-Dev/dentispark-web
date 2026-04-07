"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState, forwardRef } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItem = ({ question, answer, isOpen, onToggle }: FAQItemProps) => {
  return (
    <div className="border-b border-slate-100 last:border-b-0 overflow-hidden">
      <button
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between py-8 text-left transition-all duration-300 group"
      >
        <h3 className={cn(
          "font-jakarta pr-8 text-lg font-extrabold transition-all duration-300",
          isOpen ? "text-emerald-600" : "text-slate-900 group-hover:text-emerald-500"
        )}>
          {question}
        </h3>
        <div className={cn(
          "size-10 rounded-full flex items-center justify-center transition-all duration-500",
          isOpen ? "bg-emerald-500 text-white rotate-180" : "bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500"
        )}>
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="pb-8 pr-12">
              <p className="font-jakarta text-slate-500 leading-relaxed text-base">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const faqData = [
  {
    id: 1,
    question: "What sectors have we built for?",
    answer:
      "We've created products in all sorts of areas like Finance, Health, Telecom, Agriculture, Fashion, Transportation, data management, and a bunch more.",
  },
  {
    id: 2,
    question: "How long does the dental school application process take?",
    answer:
      "The dental school application process typically takes 12-18 months from start to finish. This includes preparation time for entrance exams, gathering required documents, submitting applications, attending interviews, and waiting for admission decisions.",
  },
  {
    id: 3,
    question: "What qualifications do I need for dental school?",
    answer:
      "Most dental schools require a bachelor's degree with prerequisite courses in biology, chemistry, physics, and mathematics. You'll also need to take the DAT (Dental Admission Test), have relevant experience through shadowing or volunteering, and demonstrate strong academic performance.",
  },
  {
    id: 4,
    question: "How much does dental school cost?",
    answer:
      "Dental school tuition varies significantly depending on whether you attend a public or private institution. Public schools typically range from $40,000-$60,000 per year for residents, while private schools can cost $70,000-$100,000+ annually. This doesn't include living expenses and equipment costs.",
  },
  {
    id: 5,
    question: "What support services do you offer?",
    answer:
      "We provide comprehensive support including application guidance, interview preparation, personal statement review, course selection advice, mentorship programs, and ongoing academic support throughout your dental school journey.",
  },
  {
    id: 6,
    question: "Can you help with international dental school applications?",
    answer:
      "Yes, we have experience with international dental school applications and can help you navigate the specific requirements for different countries, including credential evaluations, language requirements, and visa processes.",
  },
];

export function FAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([1]));

  const toggleItem = (id: number) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <section className="bg-white rounded-[3rem] p-10 md:p-16 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
      <div className="w-full">
        <div className="mb-12 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold tracking-[0.2em] uppercase w-fit"
          >
            FAQ
          </motion.div>
          <h2 className="font-jakarta text-4xl font-extrabold text-slate-900 tracking-tight">
            Common <span className="text-emerald-600 italic">Questions.</span>
          </h2>
          <p className="font-jakarta text-slate-500 max-w-xl leading-relaxed">
            Find answers to common inquiries or <a href="mailto:contact@dentispark.co.uk" className="text-emerald-600 font-bold hover:underline">get in touch</a> for personalized assistance.
          </p>
        </div>

        <div className="divide-y divide-slate-50">
          {faqData.map((item) => (
            <FAQItem
              key={item.id}
              question={item.question}
              answer={item.answer}
              isOpen={openItems.has(item.id)}
              onToggle={() => toggleItem(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
