"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
  message: z
    .string()
    .min(1, "Message is required")
    .max(500, "Message must be 500 characters or less"),
  agreeToPrivacy: z.boolean().refine((val) => val === true, {
    message: "You must agree to the privacy policy",
  }),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export function ContactUsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageLength, setMessageLength] = useState(0);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
      agreeToPrivacy: false,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API call to submit contact form
      console.log("Form data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset form on success
      form.reset();
      setMessageLength(0);

      // TODO: Show success message/toast
      alert("Thank you for your message! We'll get back to you soon.");
    } catch (error) {
      console.error("Error submitting form:", error);
      // TODO: Show error message/toast
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMessageChange = (value: string) => {
    setMessageLength(value.length);
    return value;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      className=""
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* First Name and Last Name */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="font-sora text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Jane"
                        aria-invalid={!!form.formState.errors.firstName}
                        {...field}
                        className="h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:border-emerald-500/30 focus:ring-emerald-500/10 font-sora text-sm px-6 transition-all"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold text-rose-500" />
                  </FormItem>
                )}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="font-sora text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
                        aria-invalid={!!form.formState.errors.lastName}
                        {...field}
                        className="h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:border-emerald-500/30 focus:ring-emerald-500/10 font-sora text-sm px-6 transition-all"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold text-rose-500" />
                  </FormItem>
                )}
              />
            </motion.div>
          </div>

          {/* Email Address and Phone Number */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="font-sora text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative group/field">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 h-4 w-4 group-focus-within/field:text-emerald-500 transition-colors" />
                        <Input
                          type="email"
                          placeholder="jane@example.com"
                          className="h-14 bg-slate-50/50 border-slate-100 rounded-2xl pl-14 pr-6 focus:border-emerald-500/30 focus:ring-emerald-500/10 font-sora text-sm transition-all"
                          aria-invalid={!!form.formState.errors.email}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold text-rose-500" />
                  </FormItem>
                )}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="font-sora text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+44 7000 000000"
                        className="h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:border-emerald-500/30 focus:ring-emerald-500/10 font-sora text-sm px-6 transition-all"
                        aria-invalid={!!form.formState.errors.phone}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold text-rose-500" />
                  </FormItem>
                )}
              />
            </motion.div>
          </div>

          {/* Message */}
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <div className="flex justify-between items-center">
                    <FormLabel className="font-sora text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
                      Your Message
                    </FormLabel>
                    <span className="text-[10px] font-bold text-slate-300 font-sora uppercase tracking-widest">
                      {messageLength}/500
                    </span>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us how we can help you..."
                      aria-invalid={!!form.formState.errors.message}
                      {...field}
                      onChange={(e) => {
                        const value = handleMessageChange(e.target.value);
                        field.onChange(value);
                      }}
                      className="min-h-[160px] bg-slate-50/50 border-slate-100 rounded-3xl focus:border-emerald-500/30 focus:ring-emerald-500/10 font-sora text-sm p-6 resize-none transition-all"
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] font-bold text-rose-500" />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Privacy Policy Checkbox */}
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="agreeToPrivacy"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-y-0 space-x-3 p-4 rounded-2xl bg-slate-50/30 border border-slate-100 transition-colors hover:bg-emerald-50/20 hover:border-emerald-100">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="size-5 rounded-md border-slate-200 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 transition-all"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <p className="font-sora text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Agree to{" "}
                      <span className="text-emerald-600 underline cursor-pointer hover:text-emerald-700">
                        Privacy Policy
                      </span>
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants} className="pt-4">
            <div className="relative group/submit">
              <div className="absolute -inset-1 bg-emerald-500 rounded-2xl blur opacity-20 group-hover/submit:opacity-40 transition duration-500" />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="relative w-full h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-sora font-extrabold text-lg transition-all duration-300 shadow-xl shadow-emerald-500/20 hover:scale-[1.01]"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Send Message{" "}
                    <ArrowRight className="ml-2 size-5 transition-transform group-hover/submit:translate-x-1" />
                  </div>
                )}
              </Button>
            </div>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
}
