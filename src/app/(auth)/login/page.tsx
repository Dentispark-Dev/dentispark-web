"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

import Logo from "@/src/components/icons/Logo";
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

export default function LoginPage() {
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
    startTransition(() => {
      loginMutation.mutate(data);
    });
  };

  const handleSocialLogin = (provider: string) => {
    startTransition(() => {
      // TODO: Implement social login
      console.log(`Login with ${provider}`);
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
            <h1 className="text-3xl font-sora font-bold text-gray-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-gray-500 font-medium text-base">
              Your journey starts here. Log in to access your dashboard.
            </p>
          </div>

          {/* Social Auth */}
          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center gap-3 text-sm font-semibold text-gray-700 transition-all shadow-sm"
              onClick={() => handleSocialLogin("google")}
              disabled={isPending || loginMutation.isPending}
            >
              <svg className="size-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </Button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500 font-medium text-xs">or</span>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="emailAddress"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold text-gray-700">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. name@example.com"
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
                      <Link href="/forgot-password" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
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
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-sora font-semibold text-base transition-all active:scale-95 shadow-sm group mt-2"
                disabled={isPending || loginMutation.isPending}
              >
                {isPending || loginMutation.isPending ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Log in
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm font-medium text-gray-500">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline underline-offset-4">
              Sign up
            </Link>
          </p>
        </motion.div>
        
        {/* Footer Links */}
        <div className="mt-auto pt-10 flex items-center justify-center gap-6 text-xs font-medium text-gray-400">
          <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms Conditions</Link>
          <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
          <span className="text-gray-300">© 2024 DentiSpark</span>
        </div>
      </div>

      {/* --- Right Pane: Light Professional Branding --- */}
      <div className="hidden lg:flex lg:w-[58%] relative overflow-hidden bg-[#F3F7F6] items-center justify-center p-20">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
        
        <div className="max-w-xl z-10 space-y-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="inline-block px-4 py-1.5 bg-emerald-100/50 border border-emerald-200/50 rounded-full text-emerald-800 text-sm font-semibold mb-2">
              Join DentiSpark
            </div>
            <h2 className="text-5xl font-sora font-bold text-emerald-950 leading-[1.15] tracking-tight">
              Empowering the next generation
            </h2>
            <p className="text-xl text-emerald-800/70 font-medium leading-relaxed max-w-lg">
              Connect with world-class mentors and accelerate your dental school journey with precision and purpose.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
