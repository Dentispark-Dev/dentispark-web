"use client";

import Link from "next/link";
import Container from "@/src/components/layouts/container";
import { 
    Twitter, Instagram, Facebook, Linkedin, 
    Mail, Phone, MapPin, ExternalLink,
    ArrowRight, Sparkles, Send
} from "lucide-react";
import WhiteLogo from "@/src/components/icons/WhiteLogo";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    welcome: [
      { label: "Free Tools", href: "/free-tools" },
      { label: "Scholarships & Funding", href: "/scholarships" },
      { label: "Admission Timeline", href: "/admission-timeline" },
      { label: "Success Stories", href: "/success-stories" }
    ],
    company: [
      { label: "About Us", href: "/about-us" },
      { label: "Contact Us", href: "/contact-us" },
      { label: "FAQs", href: "/faqs" },
      { label: "Mentors", href: "/mentors" }
    ],
    getInvolved: [
      { label: "Become a Mentor", href: "/become-a-mentor" },
      { label: "University Representative", href: "/university-rep" },
      { label: "Pricing", href: "/pricing" }
    ],
    legal: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" }
    ]
  };

  return (
    <footer className="relative bg-[#0a0a0a] text-gray-400 overflow-hidden">
      {/* Top Border Glow */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      
      {/* Main Footer Content */}
      <Container className="pt-24 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="inline-block transition-opacity hover:opacity-80">
              <WhiteLogo className="h-16 w-auto drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]" />
            </Link>
            <p className="text-gray-500 font-medium leading-relaxed max-w-sm">
              Empowering the next generation of dental and medical professionals through world-class mentorship and innovative test prep tools. 
            </p>
            <div className="flex gap-4">
              {[
                { icon: <Twitter className="w-5 h-5" />, label: "Twitter" },
                { icon: <Instagram className="w-5 h-5" />, label: "Instagram" },
                { icon: <Facebook className="w-5 h-5" />, label: "Facebook" },
                { icon: <Linkedin className="w-5 h-5" />, label: "LinkedIn" }
              ].map((social, i) => (
                <Link 
                  key={i} 
                  href="#" 
                  aria-label={social.label}
                  className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-gray-500 hover:text-emerald-500 hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all group"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-4 lg:ml-auto">
            {/* Welcome Column */}
            <div className="space-y-6">
              <h4 className="text-white font-black text-sm uppercase tracking-widest">Resources</h4>
              <ul className="space-y-4">
                {footerLinks.welcome.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-500 hover:text-emerald-500 font-medium transition-colors text-sm flex items-center group">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 opacity-0 group-hover:opacity-100 transition-all -ml-3 group-hover:ml-0" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div className="space-y-6">
              <h4 className="text-white font-black text-sm uppercase tracking-widest">Company</h4>
              <ul className="space-y-4">
                {footerLinks.company.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-500 hover:text-emerald-500 font-medium transition-colors text-sm flex items-center group">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 opacity-0 group-hover:opacity-100 transition-all -ml-3 group-hover:ml-0" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Column */}
            <div className="space-y-6">
              <h4 className="text-white font-black text-sm uppercase tracking-widest">Opportunities</h4>
              <ul className="space-y-4">
                {footerLinks.getInvolved.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-500 hover:text-emerald-500 font-medium transition-colors text-sm flex items-center group">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 opacity-0 group-hover:opacity-100 transition-all -ml-3 group-hover:ml-0" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column */}
            <div className="space-y-6">
              <h4 className="text-white font-black text-sm uppercase tracking-widest">Contact</h4>
              <ul className="space-y-5">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-500 font-medium leading-relaxed">
                    3, Birling Avenue, Rainham,<br />Gillingham, ME8 7HB
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-emerald-500 shrink-0" />
                  <a href="mailto:contact@dentispark.com" className="text-sm text-gray-500 hover:text-emerald-500 font-medium transition-colors">
                    contact@dentispark.com
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
                  <a href="tel:+441634238360" className="text-sm text-gray-500 hover:text-emerald-500 font-medium transition-colors">
                    +44 1634 238360
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom Legal Bar */}
      <div className="border-t border-white/[0.03] py-10 bg-black/50">
        <Container className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-[0.2em]">
            © {currentYear} DentiSpark Technology. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            {footerLinks.legal.map(link => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="text-xs font-black text-gray-600 hover:text-emerald-500 uppercase tracking-widest transition-colors flex items-center gap-1.5"
              >
                {link.label}
                <ExternalLink className="w-3 h-3" />
              </Link>
            ))}
          </div>
        </Container>
      </div>

      {/* Particle Effect Overlay (Subtle) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
         <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/20 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>
    </footer>
  );
}
