"use client";

import { motion } from "framer-motion";
import { Title } from "@/src/components/atoms/title";
import Container from "@/src/components/layouts/container";
import { ContactUsForm } from "@/src/features/(website)/contact-us/components/contact-us-form";
import { FAQ } from "@/src/features/(website)/contact-us/components/faq";

import { Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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

export function ContactUs() {
  return (
    <section className="relative pt-40 pb-32 overflow-hidden bg-slate-50/30">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <Container className="relative z-10">
        <motion.div 
          className="flex flex-col space-y-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-6">
            <motion.div variants={itemVariants} className="px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold tracking-[0.2em] uppercase">
              Get in Touch
            </motion.div>
            <motion.h1 variants={itemVariants} className="font-sora text-5xl md:text-8xl font-extrabold text-slate-900 tracking-tighter leading-[1.1]">
              Let&apos;s talk <span className="text-emerald-600">Success.</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="font-sora text-slate-500 text-lg md:text-xl max-w-2xl leading-relaxed">
              Have questions? We&apos;re here to help you navigate your journey to dental excellence. 
              Reach out manually at <a href="mailto:contact@dentispark.co.uk" className="text-emerald-600 font-bold hover:underline transition-all">contact@dentispark.co.uk</a>
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Form Container with Glassmorphism */}
            <motion.div 
              variants={itemVariants}
              className="group relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-[3rem] blur-xl opacity-50 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative p-10 md:p-14 rounded-[3rem] bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] transition-all duration-500 hover:border-emerald-100">
                <ContactUsForm />
              </div>
            </motion.div>

            {/* Side Content / Info / FAQ Hook */}
            <motion.div variants={itemVariants} className="space-y-12">
              <div className="space-y-6">
                <h2 className="font-sora text-3xl font-extrabold text-slate-900">Immediate Support</h2>
                <p className="font-sora text-slate-500 leading-relaxed">
                  Our dedicated team of advisors is available to assist you with onboarding, 
                  service inquiries, and technical support. Expect a response within 24 hours.
                </p>
              </div>

              {/* FAQ Section Integrated */}
              <div className="pt-8 border-t border-slate-100">
                <FAQ />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
