"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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
import Container from "@/src/components/layouts/container";
import { 
  GraduationCap, 
  BookOpen, 
  Stethoscope, 
  Globe, 
  Users, 
  ArrowRight,
  Brain,
  Timer,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";

const studentTypes = [
  { label: "All applicants", value: "All applicants", icon: Users },
  { label: "School Leaver", value: "School Leaver", icon: GraduationCap },
  { label: "Graduate Applicant", value: "Graduate Applicant", icon: BookOpen },
  { label: "International Applicant", value: "International Applicant", icon: Globe },
] as const;

const scoreRanges = ["0-20", "21-40", "41-60", "61-80", "81-100"];

type FormValues = {
  studentType: string;
  ucat: string;
  alevel: string;
  hours: string;
  ielts: string;
};

export function AdmissionProbabilityCalculator() {
  const form = useForm<FormValues>({
    defaultValues: {
      studentType: "All applicants",
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
    <section className="relative py-24 md:py-32 overflow-hidden bg-[#FCFCFD]">
      {/* Soft Background Accents */}
      <div className="absolute top-0 right-0 -z-10 h-full w-[40%] bg-emerald-500/[0.02] hidden lg:block" />
      
      <Container>
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2 lg:gap-24">
          
          {/* Left side: Strategic Message */}
          <div className="flex flex-col space-y-10 pt-8">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold tracking-[0.2em] uppercase w-fit"
            >
              <CheckCircle2 size={12} />
              <span>Free AI Tool</span>
            </motion.div>
            
            <div className="space-y-6">
              <h2 className="font-sora text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl tracking-tight">
                Admission <span className="text-emerald-500">Chances</span> <br />Calculator
              </h2>
              <p className="font-sora text-slate-500 text-lg md:text-xl leading-relaxed max-w-lg">
                Upload your profile highlights to see where you stand in the competitive dental school application landscape.
              </p>
            </div>
            
            <div className="space-y-5 pt-4">
              {[
                "Data synchronized with latest UCAS entries",
                "School-specific success thresholds",
                "Actionable improvement pathways"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="size-6 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                    <ArrowRight size={12} className="text-emerald-500" />
                  </div>
                  <span className="font-sora text-sm font-semibold text-slate-600 tracking-wide">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side: Modern Minimalist Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.1)] border border-slate-100">
              <Form {...form}>
                <form
                  className="space-y-10"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  {/* Selection Type */}
                  <FormField
                    control={form.control}
                    name="studentType"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormLabel className="font-sora text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">
                          Applicant Path
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            className="grid grid-cols-2 gap-3"
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            {studentTypes.map((type) => (
                              <label
                                key={type.value}
                                className={cn(
                                  "group flex flex-col items-center justify-center p-5 rounded-2xl border text-center transition-all duration-300 cursor-pointer",
                                  field.value === type.value 
                                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                                    : 'bg-white border-slate-100 text-slate-500 hover:border-emerald-200'
                                )}
                              >
                                <RadioGroupItem value={type.value} id={type.value} className="sr-only" />
                                <type.icon size={20} className={cn("mb-3", field.value === type.value ? "text-white" : "text-emerald-500")} />
                                <span className="font-sora text-[11px] font-bold uppercase tracking-tight">{type.label}</span>
                              </label>
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Fields Divider */}
                  <div className="h-px w-full bg-slate-50" />

                  {/* Core Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="ucat"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="font-sora text-[10px] font-bold text-slate-400 uppercase tracking-tight ml-1">
                            UCAT Performance
                          </FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="h-14 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-emerald-500/10 focus:border-emerald-500 font-sora font-medium px-5">
                                <SelectValue placeholder="Range" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-slate-100 p-1">
                                {scoreRanges.map((r) => (
                                  <SelectItem key={r} value={r} className="font-sora text-sm py-3 m-1 focus:bg-emerald-50 rounded-lg">{r}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="alevel"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="font-sora text-[10px] font-bold text-slate-400 uppercase tracking-tight ml-1">
                            A-Level Average
                          </FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="h-14 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-emerald-500/10 focus:border-emerald-500 font-sora font-medium px-5">
                                <SelectValue placeholder="Range" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-slate-100 p-1">
                                {scoreRanges.map((r) => (
                                  <SelectItem key={r} value={r} className="font-sora text-sm py-3 m-1 focus:bg-emerald-50 rounded-lg">{r}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="hours"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="font-sora text-[10px] font-bold text-slate-400 uppercase tracking-tight ml-1">
                            Experience Hours
                          </FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="h-14 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-emerald-500/10 focus:border-emerald-500 font-sora font-medium px-5">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-slate-100 p-1">
                                {scoreRanges.map((r) => (
                                  <SelectItem key={r} value={r} className="font-sora text-sm py-3 m-1 focus:bg-emerald-50 rounded-lg">{r}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ielts"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="font-sora text-[10px] font-bold text-slate-400 uppercase tracking-tight ml-1">
                            Language Proficiency
                          </FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="h-14 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-emerald-500/10 focus:border-emerald-500 font-sora font-medium px-5">
                                <SelectValue placeholder="Score" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-slate-100 p-1">
                                {scoreRanges.map((r) => (
                                  <SelectItem key={r} value={r} className="font-sora text-sm py-3 m-1 focus:bg-emerald-50 rounded-lg">{r}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-16 rounded-2xl bg-[#0F172A] hover:bg-slate-800 text-white font-sora font-bold text-sm tracking-widest uppercase transition-all duration-300 shadow-xl shadow-slate-200"
                  >
                    View Success Probability
                  </Button>
                </form>
              </Form>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
