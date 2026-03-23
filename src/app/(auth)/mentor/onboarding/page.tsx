"use client";

import { MentorOnboardingFlow } from "@/src/features/(mentor-auth)/onboarding/components/mentor-onboarding-flow";
import Link from "next/link";
import Logo from "@/src/components/icons/Logo";
import { motion } from "framer-motion";

export default function MentorOnboardingPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 md:p-8 lg:p-12">
      {/* Background Decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-teal-500/5 blur-[100px] rounded-full" />
      </div>

      {/* Mini Header for Mentor Onboarding Page */}
      <div className="w-full max-w-7xl flex items-center justify-between mb-8 px-4">
        <Link href="/">
          <Logo className="h-10 w-auto" />
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/mentor/login" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors uppercase tracking-widest">
            Login
          </Link>
          <div className="h-4 w-px bg-slate-200" />
          <Link href="/sign-up" className="hidden md:block text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors uppercase tracking-widest">
            Student Signup
          </Link>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex justify-center"
      >
        <MentorOnboardingFlow />
      </motion.div>

      {/* Footer */}
      <div className="mt-12 flex items-center gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
        <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
        <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
        <Link href="/support" className="hover:text-slate-600 transition-colors">Mentor Support</Link>
        <span>© 2024 DentiSpark</span>
      </div>
    </main>
  );
}
