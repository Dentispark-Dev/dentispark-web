"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import {
  useSignup,
  useOAuth2Signup,
  type SignupRequest,
  type OAuth2SignupRequest,
} from "@/src/features/(auth)/services";
import { useGoogleAuth } from "@/src/hooks/use-google-auth";

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

const signUpSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    emailAddress: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const signupMutation = useSignup();
  const oauth2SignupMutation = useOAuth2Signup();

  const { signInWithGoogle } = useGoogleAuth({
    onSuccess: (authorizationCode) => {
      const oauth2Data: OAuth2SignupRequest = {
        oauth2ProviderAuthorizationCode: authorizationCode,
        authProvider: "GOOGLE",
        memberType: "STUDENT",
      };
      oauth2SignupMutation.mutate(oauth2Data);
    },
    onError: (error) => {
      console.error("Google OAuth error:", error);
      toast.error("Google authentication failed");
    },
  });

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      emailAddress: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    startTransition(() => {
      const signupPayload: SignupRequest = {
        emailAddress: data.emailAddress,
        firstName: data.firstName,
        lastName: data.lastName,
        memberType: "STUDENT",
        password: data.password,
      };
      signupMutation.mutate(signupPayload);
    });
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === "google") {
      signInWithGoogle();
    } else {
      toast.info(`${provider} authentication coming soon!`);
    }
  };

  return (
    <div className="flex min-h-screen bg-white overflow-hidden">
      {/* --- Left Pane: Form --- */}
      <div className="w-full lg:w-[42%] flex flex-col p-8 md:p-12 lg:p-16 relative z-10 bg-white overflow-y-auto">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/">
            <Logo className="h-8 md:h-10 text-emerald-900" />
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-bold text-emerald-900/60 uppercase tracking-widest">
            <Link href="/about-us" className="hover:text-emerald-900 transition-colors">About</Link>
            <Link href="/become-a-mentor" className="hover:text-emerald-900 transition-colors">Become a Mentor</Link>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full space-y-8"
        >
          <div className="space-y-3">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight italic uppercase">
              Join the elite
            </h1>
            <p className="text-gray-500 font-medium text-lg">
              Start your journey with DentiSpark today.
            </p>
          </div>

          {/* Social Auth */}
          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full h-14 rounded-2xl border-gray-100 bg-white hover:bg-gray-50 flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest text-gray-700 transition-all shadow-sm"
              onClick={() => handleSocialLogin("google")}
              disabled={isPending || oauth2SignupMutation.isPending}
            >
              <svg className="size-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-300 uppercase tracking-widest font-black text-[10px]">or</span>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John"
                          className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 px-5 focus:bg-white transition-all border-none shadow-none focus-visible:ring-emerald-500/20"
                          disabled={isPending || signupMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Doe"
                          className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 px-5 focus:bg-white transition-all border-none shadow-none focus-visible:ring-emerald-500/20"
                          disabled={isPending || signupMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="emailAddress"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john@example.com"
                        className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 px-5 focus:bg-white transition-all border-none shadow-none focus-visible:ring-emerald-500/20"
                        disabled={isPending || signupMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 px-5 focus:bg-white transition-all border-none shadow-none focus-visible:ring-emerald-500/20"
                            disabled={isPending || signupMutation.isPending}
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 px-5 focus:bg-white transition-all border-none shadow-none focus-visible:ring-emerald-500/20"
                            disabled={isPending || signupMutation.isPending}
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[1.5rem] font-black text-lg transition-all active:scale-95 shadow-lg shadow-emerald-600/20 uppercase tracking-widest italic group"
                  disabled={isPending || signupMutation.isPending}
                >
                  {isPending || signupMutation.isPending ? (
                    <Loader2 className="animate-spin h-6 w-6" />
                  ) : (
                    <span className="flex items-center gap-2">
                      Join community
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <p className="text-center text-sm font-bold text-gray-500">
            Already a Member?{" "}
            <Link href="/login" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">
              Login Here
            </Link>
          </p>
        </motion.div>
        
        {/* Footer Links */}
        <div className="mt-auto pt-10 flex items-center justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-gray-300">
          <Link href="/terms" className="hover:text-gray-500 transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-gray-500 transition-colors">Privacy</Link>
          <span className="text-gray-200">© 2024 DentiSpark</span>
        </div>
      </div>

      {/* --- Right Pane: Landscape --- */}
      <div className="hidden lg:block lg:w-[58%] relative overflow-hidden bg-emerald-100">
        <Image
          src="/images/premium/auth-landscape.png"
          alt="Serene Mountains"
          fill
          className="object-cover transition-transform duration-[10s] hover:scale-105"
          priority
        />
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-20 left-20 right-20 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-10 bg-white/10 backdrop-blur-3xl rounded-[3rem] border border-white/20 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <h2 className="text-5xl font-black text-white italic tracking-tight leading-none uppercase mb-4">
              Empowering the next <br /> generation
            </h2>
            <p className="text-xl text-white/80 font-medium leading-relaxed">
              Connect with world-class mentors and accelerate your dental school journey with precision and purpose.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
