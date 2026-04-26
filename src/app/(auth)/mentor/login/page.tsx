"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, Briefcase } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { useUnifiedLogin } from "@/src/features/(auth)/services";

// Form validation schema
const loginSchema = z.object({
  emailAddress: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function MentorLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const loginMutation = useUnifiedLogin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailAddress: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const normalizedData = {
      ...data,
      emailAddress: data.emailAddress.trim().toLowerCase(),
    };

    startTransition(() => {
      loginMutation.mutate(normalizedData);
    });
  };

  return (
    <div className="flex min-h-screen bg-white overflow-hidden">
      {/* --- Left Pane: Form --- */}
      <div className="w-full lg:w-[42%] flex flex-col p-6 lg:p-12 relative z-10 bg-white">
        {/* Form Content */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full space-y-6 mt-4"
        >
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 border border-emerald-100">
               <ShieldCheck className="size-3" />
               Official Mentor Hub
            </div>
            <h1 className="text-3xl font-jakarta font-bold text-gray-900 tracking-tight">
              Mentor Login
            </h1>
            <p className="text-gray-500 font-medium text-base">
              Welcome back. Sign in to your professional workspace.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="emailAddress"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold text-gray-700">Work Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. mentor@dentispark.com"
                        className="h-12 rounded-xl border-gray-200 bg-white px-4 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-sm"
                        disabled={isPending || loginMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-xs font-semibold text-gray-700">Password</FormLabel>
                      <Link href="/mentor/forgot-password"  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="h-12 rounded-xl border-gray-200 bg-white px-4 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-sm pr-12"
                          disabled={isPending || loginMutation.isPending}
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-jakarta font-semibold text-base transition-all active:scale-95 shadow-sm group mt-2"
                disabled={isPending || loginMutation.isPending}
              >
                {isPending || loginMutation.isPending ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Enter Mentor Hub
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>
          </Form>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-4">
             <p className="text-center text-xs font-medium text-gray-500">
                New to the professional network?{" "}
                <Link href="/mentor/onboarding" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline underline-offset-4">
                  Apply to Mentor
                </Link>
             </p>
          </div>
        </motion.div>
        
        {/* Footer Links */}
        <div className="mt-auto pt-10 flex items-center justify-center gap-6 text-xs font-medium text-gray-400">
          <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacy</Link>
          <span className="text-gray-300">© 2024 DentiSpark Professional</span>
        </div>
      </div>

      {/* --- Right Pane: Mentor Specific Branding --- */}
      <div className="hidden lg:flex lg:w-[58%] relative overflow-hidden bg-emerald-950 items-center justify-center p-20">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-10" />
        
        <div className="max-w-xl z-10 space-y-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur rounded-2xl text-white text-sm font-semibold mb-2">
               <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
               Professional Network Active
            </div>
            <h2 className="text-5xl font-jakarta font-bold text-white leading-[1.15] tracking-tight">
              Shape the future of <span className="text-emerald-400">dentistry</span>
            </h2>
            <p className="text-xl text-emerald-100/70 font-medium leading-relaxed max-w-lg">
              Manage your bookings, match with top-tier students, and share your clinical expertise with the next generation.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/10">
                <div className="flex items-center gap-3 text-white/60">
                    <Briefcase className="size-5 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-widest">Clinical Matchmaking</span>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                    <ShieldCheck className="size-5 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-widest">Secure Messaging</span>
                </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
