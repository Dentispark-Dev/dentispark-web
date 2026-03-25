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
  Zap,
  Star,
  Brain,
  Timer,
  Award
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";

const studentTypes = [
  { label: "All applicants", value: "All applicants", icon: Users },
  { label: "School Leaver", value: "School Leaver", icon: GraduationCap },
  { label: "Graduate Applicant", value: "Graduate Applicant", icon: BookOpen },
  { label: "International Applicant", value: "International Applicant", icon: Globe },
  { label: "Widening Participation", value: "Widening Participation", icon: Star },
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
    <section className="relative py-24 md:py-32 overflow-hidden bg-white">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-50/40 via-white to-white" />
      <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] bg-emerald-500/[0.03] blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3 animate-pulse" />
      <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] bg-teal-500/[0.03] blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3" />
      
      <Container>
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
          
          {/* Left side Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center space-y-8 text-center md:items-start md:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
              <Zap size={14} className="fill-emerald-600" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Admission AI</span>
            </div>
            
            <h2 className="font-sora text-4xl font-extrabold leading-tight text-slate-900 md:text-6xl tracking-tight">
              Predict Your <span className="relative inline-block">
                <span className="relative z-10 text-emerald-600">Dental</span>
                <span className="absolute bottom-2 left-0 h-3 w-full bg-emerald-100 -z-10" />
              </span> Future!
            </h2>
            
            <p className="font-sora text-slate-600 text-lg md:text-xl leading-relaxed max-w-xl">
              Calculate your admission probability using historical data sets and elite dental school entry requirements.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-4">
              {[
                { label: "Instant Results", icon: Timer },
                { label: "Live Entry Data", icon: Award },
                { label: "AI Recommendations", icon: Brain },
                { label: "Global Schools", icon: Globe }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="size-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <item.icon size={18} />
                  </div>
                  <span className="font-sora text-xs font-bold text-slate-700 uppercase tracking-tight">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right side: Premium Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Form Glass Card */}
            <div className="relative z-10 rounded-[3.5rem] bg-white/70 backdrop-blur-3xl p-8 md:p-14 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.08)] border border-white">
              <Form {...form}>
                <form
                  className="space-y-12"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  {/* Student type */}
                  <FormField
                    control={form.control}
                    name="studentType"
                    render={({ field }) => (
                      <FormItem className="space-y-6">
                        <div className="flex items-center justify-between">
                          <FormLabel className="font-sora text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            I AM A...
                          </FormLabel>
                        </div>
                        <FormControl>
                          <RadioGroup
                            className="flex flex-wrap gap-3"
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            {studentTypes.map((type) => (
                              <label
                                key={type.value}
                                className={cn(
                                  "group relative flex items-center justify-center px-5 py-3 rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden",
                                  field.value === type.value 
                                    ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/10' 
                                    : 'bg-white border-slate-100 text-slate-500 hover:border-emerald-200 hover:bg-emerald-50/20'
                                )}
                              >
                                <RadioGroupItem value={type.value} id={type.value} className="sr-only" />
                                <type.icon size={14} className={cn("mr-2", field.value === type.value ? "text-emerald-400" : "text-slate-400 group-hover:text-emerald-500")} />
                                <span className="font-sora text-[11px] font-bold uppercase tracking-tight relative z-10">{type.label}</span>
                              </label>
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Academic Statistics */}
                  <div className="space-y-10">
                    <div className="relative py-2 flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-100" />
                      </div>
                      <span className="relative bg-white px-6 py-1.5 rounded-full border border-slate-100 text-slate-400 font-bold text-[9px] uppercase tracking-[0.3em]">Academic Core</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <FormField
                        control={form.control}
                        name="ucat"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="flex items-center gap-2 font-sora text-[11px] font-bold text-slate-600 uppercase tracking-tight">
                              <Brain size={14} className="text-emerald-500" /> UCAT Score
                            </FormLabel>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="h-16 rounded-2xl border-slate-100 bg-slate-50/50 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-sora font-medium px-6">
                                  <SelectValue placeholder="Range" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-2">
                                  {scoreRanges.map((r) => (
                                    <SelectItem key={r} value={r} className="font-sora text-sm font-medium py-3 focus:bg-emerald-50 focus:text-emerald-700 rounded-xl m-1 transition-colors cursor-pointer">{r}</SelectItem>
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
                          <FormItem className="space-y-3">
                            <FormLabel className="flex items-center gap-2 font-sora text-[11px] font-bold text-slate-600 uppercase tracking-tight">
                              <GraduationCap size={14} className="text-emerald-500" /> A-Level Grades
                            </FormLabel>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="h-16 rounded-2xl border-slate-100 bg-slate-50/50 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-sora font-medium px-6">
                                  <SelectValue placeholder="Range" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-2">
                                  {scoreRanges.map((r) => (
                                    <SelectItem key={r} value={r} className="font-sora text-sm font-medium py-3 focus:bg-emerald-50 focus:text-emerald-700 rounded-xl m-1 transition-colors cursor-pointer">{r}</SelectItem>
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
                          <FormItem className="space-y-3">
                            <FormLabel className="flex items-center gap-2 font-sora text-[11px] font-bold text-slate-600 uppercase tracking-tight">
                              <Stethoscope size={14} className="text-emerald-500" /> Work Exp
                            </FormLabel>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="h-16 rounded-2xl border-slate-100 bg-slate-50/50 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-sora font-medium px-6">
                                  <SelectValue placeholder="Hours" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-2">
                                  {scoreRanges.map((r) => (
                                    <SelectItem key={r} value={r} className="font-sora text-sm font-medium py-3 focus:bg-emerald-50 focus:text-emerald-700 rounded-xl m-1 transition-colors cursor-pointer">{r}</SelectItem>
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
                          <FormItem className="space-y-3">
                            <FormLabel className="flex items-center gap-2 font-sora text-[11px] font-bold text-slate-600 uppercase tracking-tight">
                              <Globe size={14} className="text-emerald-500" /> IELTS Score
                            </FormLabel>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="h-16 rounded-2xl border-slate-100 bg-slate-50/50 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-sora font-medium px-6">
                                  <SelectValue placeholder="Score" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-2">
                                  {scoreRanges.map((r) => (
                                    <SelectItem key={r} value={r} className="font-sora text-sm font-medium py-3 focus:bg-emerald-50 focus:text-emerald-700 rounded-xl m-1 transition-colors cursor-pointer">{r}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Futuristic Button */}
                  <Button
                    type="submit"
                    className="relative w-full h-20 rounded-[2rem] bg-emerald-500 hover:bg-emerald-600 text-white font-sora font-black text-xl transition-all duration-500 shadow-2xl shadow-emerald-500/30 overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Calculate Success Probability
                      <Zap size={20} className="fill-white group-hover:scale-125 transition-transform duration-500" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
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
