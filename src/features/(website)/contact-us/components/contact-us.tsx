"use client";

import { motion } from "framer-motion";
import { Title } from "@/src/components/atoms/title";
import Container from "@/src/components/layouts/container";
import { ContactUsForm } from "@/src/features/(website)/contact-us/components/contact-us-form";
import { FAQ } from "@/src/features/(website)/contact-us/components/faq";
import { Mail, Phone, MapPin, MessageSquare, Clock, Sparkles } from "lucide-react";

import { Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function ContactUs() {
  return (
    <section className="relative pt-40 pb-32 overflow-hidden bg-[#fcfcfd]">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/[0.03] blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/[0.02] blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <Container className="relative z-10">
        <motion.div 
          className="flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Centered Header */}
          <div className="flex flex-col items-center text-center space-y-6 mb-20">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-widest">
              <MessageSquare className="w-3.5 h-3.5 fill-emerald-600" />
              Admissions Support
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1]">
              Get in <span className="text-emerald-600">Touch.</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
              Have questions about your application or our programs? Our dedicated team is here to help you succeed.
            </motion.p>
          </div>

          {/* Contact Info Cards Grid */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-16"
          >
            {[
              { 
                icon: <Mail className="w-6 h-6 text-emerald-500" />, 
                title: "Email Us", 
                value: "contact@dentispark.com", 
                sub: "Expect a reply within 24h",
                href: "mailto:contact@dentispark.com"
              },
              { 
                icon: <Phone className="w-6 h-6 text-blue-500" />, 
                title: "Call Us", 
                value: "+44 1634 238360", 
                sub: "Mon - Fri, 9am - 5pm",
                href: "tel:+441634238360"
              },
              { 
                icon: <MapPin className="w-6 h-6 text-purple-500" />, 
                title: "Visit Us", 
                value: "Gillingham, Kent", 
                sub: "Main Admissions Office",
                href: "#"
              }
            ].map((info, i) => (
              <a 
                key={i}
                href={info.href}
                className="group p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-emerald-100 transition-all duration-500 flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  {info.icon}
                </div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{info.title}</h3>
                <p className="text-lg font-black text-slate-900 mb-1">{info.value}</p>
                <p className="text-xs font-bold text-slate-400">{info.sub}</p>
              </a>
            ))}
          </motion.div>

          {/* Centered Centered Form Container */}
          <motion.div 
            variants={itemVariants}
            className="w-full max-w-2xl relative group"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-[4rem] blur-2xl opacity-50 pointer-events-none group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200 p-10 md:p-14 overflow-hidden">
               {/* Internal Header for Form */}
               <div className="mb-12">
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Send us a message</h2>
                  <p className="text-slate-500 font-medium">Fill out the form below and we&apos;ll get back to you shortly.</p>
               </div>
               
               <ContactUsForm />
            </div>
          </motion.div>

          {/* FAQ Hook */}
          <motion.div variants={itemVariants} className="mt-32 w-full">
             <div className="flex flex-col items-center text-center mb-16">
                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Common Questions</h2>
                <div className="w-16 h-1 bg-emerald-500 rounded-full" />
             </div>
             <FAQ />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
