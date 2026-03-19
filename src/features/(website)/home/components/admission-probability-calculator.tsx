// components/AdmissionProbabilityCalculator.tsx
"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/src/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import { Title } from "@/src/components/atoms/title";
import Container from "@/src/components/layouts/container";

const studentTypes = [
  "All applicants",
  "School Leaver",
  "Graduate Applicant",
  "International Applicant",
  "Widening Participation",
] as const;

const scoreRanges = ["0-20", "21-40", "41-60", "61-80", "81-100"];

type FormValues = {
  studentType: string;
  ucat: string;
  alevel: string;
  hours: string;
  ielts: string;
};

import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { x: -30, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const formVariants: Variants = {
  hidden: { x: 30, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function AdmissionProbabilityCalculator() {
  const form = useForm<FormValues>({
    defaultValues: {
      studentType: studentTypes[0],
      ucat: "",
      alevel: "",
      hours: "",
      ielts: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log("Form values:", values);
  };

  return (
    <section className="bg-slate-50/50 py-24 md:py-32 overflow-hidden">
      <Container>
        <motion.div 
          className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Left side */}
          <motion.div variants={itemVariants} className="flex flex-col items-center space-y-8 text-center md:items-start md:text-left">
            <div className="px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold tracking-[0.2em] uppercase">
              AI Tools
            </div>
            <h2 className="font-sora text-4xl font-extrabold leading-tight text-slate-900 md:text-6xl tracking-tight">
              Check Your <span className="text-emerald-600">Admission</span> Chances!
            </h2>
            <p className="font-sora text-slate-500 text-lg md:text-xl leading-relaxed max-w-lg">
              Our advanced calculator uses historical data and entry requirements to estimate your probability of success.
            </p>
            
            <div className="flex flex-col gap-4 w-full max-w-sm pt-4">
              {[
                "Instant AI-powered results",
                "Based on latest entry data",
                "Personalized recommendations"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="size-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <svg className="size-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-sora text-sm font-bold text-slate-700 uppercase tracking-wide">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right side: form */}
          <motion.div variants={formVariants} className="relative">
            <div className="absolute -inset-4 bg-emerald-500/5 blur-3xl rounded-[4rem] -z-10" />
            <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-100 to-transparent rounded-[3rem] -z-10 opacity-50" />
            <Form {...form}>
              <form
                className="space-y-12 rounded-[3rem] bg-white p-8 md:p-12 shadow-[0_20px_50px_rgba(16,185,129,0.05)] border border-slate-100"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                {/* Student type */}
                <FormField
                  control={form.control}
                  name="studentType"
                  render={({ field }) => (
                    <FormItem className="space-y-6">
                      <FormLabel className="font-sora text-sm font-extrabold text-slate-900 uppercase tracking-widest">
                        I am a...
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          className="flex flex-wrap gap-3"
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          {studentTypes.map((type) => (
                            <label
                              key={type}
                              className={`
                                group relative flex items-center justify-center px-4 py-2.5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden
                                ${field.value === type 
                                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                                  : 'bg-white border-slate-100 text-slate-500 hover:border-emerald-200 hover:bg-emerald-50/30'
                                }
                              `}
                            >
                              <RadioGroupItem value={type} id={type} className="sr-only" />
                              <span className="font-sora text-[11px] font-bold uppercase tracking-tight relative z-10">{type}</span>
                            </label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Academic info */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-slate-100" />
                    <span className="font-sora text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Academic Statistics</span>
                    <div className="h-px flex-1 bg-slate-100" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="ucat"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="font-sora text-[11px] font-bold text-slate-600 uppercase tracking-tight">
                            UCAT Score
                          </FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-sora font-medium">
                                <SelectValue placeholder="Range" />
                              </SelectTrigger>
                              <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                                {scoreRanges.map((r) => (
                                  <SelectItem key={r} value={r} className="font-sora text-sm font-medium py-3 focus:bg-emerald-50 focus:text-emerald-700 rounded-xl m-1">{r}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="alevel"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="font-sora text-[11px] font-bold text-slate-600 uppercase tracking-tight">
                            A-Level Grades
                          </FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-sora font-medium">
                                <SelectValue placeholder="Range" />
                              </SelectTrigger>
                              <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                                {scoreRanges.map((r) => (
                                  <SelectItem key={r} value={r} className="font-sora text-sm font-medium py-3 focus:bg-emerald-50 focus:text-emerald-700 rounded-xl m-1">{r}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="hours"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="font-sora text-[11px] font-bold text-slate-600 uppercase tracking-tight">
                            Work Experience
                          </FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-sora font-medium">
                                <SelectValue placeholder="Hours" />
                              </SelectTrigger>
                              <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                                {scoreRanges.map((r) => (
                                  <SelectItem key={r} value={r} className="font-sora text-sm font-medium py-3 focus:bg-emerald-50 focus:text-emerald-700 rounded-xl m-1">{r}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ielts"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="font-sora text-[11px] font-bold text-slate-600 uppercase tracking-tight">
                            IELTS Score
                          </FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-sora font-medium">
                                <SelectValue placeholder="Score" />
                              </SelectTrigger>
                              <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                                {scoreRanges.map((r) => (
                                  <SelectItem key={r} value={r} className="font-sora text-sm font-medium py-3 focus:bg-emerald-50 focus:text-emerald-700 rounded-xl m-1">{r}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full h-16 rounded-[1.5rem] bg-emerald-500 hover:bg-emerald-600 text-white font-sora font-extrabold text-lg transition-all duration-300 shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Calculate My Chances
                </Button>
              </form>
            </Form>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
