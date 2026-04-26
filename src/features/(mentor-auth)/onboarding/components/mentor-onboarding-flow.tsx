import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Stethoscope, 
  GraduationCap, 
  Briefcase, 
  Award, 
  Clock, 
  CheckCircle, 
  ChevronRight, 
  ArrowLeft,
  User,
  Mail,
  Lock,
  Phone,
  Check,
  Star as StarIcon,
  Play,
  Loader2
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";

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
import { Checkbox } from "@/src/components/ui/checkbox";
import { cn } from "@/src/lib/utils";
import {
  SPECIALIZATION_OPTIONS, 
  YEARS_EXPERIENCE_OPTIONS,
  EXPERTISE_AREAS
} from "../types";
import { authApi } from "@/src/features/(auth)/services/api";

// Validation Schema for the final step
const mentorOnboardingSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  emailAddress: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters").regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "8+ chars, 1 uppercase, 1 lowercase, 1 number"
  ),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, "Must agree to terms"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type OnboardingFormData = z.infer<typeof mentorOnboardingSchema>;

const STEPS = [
  { id: "role", title: "Your Professional Role", description: "What is your current standing?" },
  { id: "experience", title: "Years in Dentistry", description: "How long have you been practicing?" },
  { id: "specialization", title: "Main Specialization", description: "What is your primary area?" },
  { id: "expertise", title: "Mentoring Expertise", description: "Where can you help most?" },
  { id: "training", title: "DentiSpark Training", description: "Quick intro to our standards" },
  { id: "documents", title: "Verify Your Credentials", description: "Upload CV and Certifications" },
  { id: "interview", title: "Final Vetting Interview", description: "Book a quick 15-min call" },
  { id: "account", title: "Create Your Account", description: "Final step to join the elite" },
];

const ROLES = [
  { id: "dentist", label: "Qualified Dentist", icon: Stethoscope },
  { id: "specialist", label: "Dental Specialist", icon: Award },
  { id: "student", label: "Dental Student (Senior)", icon: GraduationCap },
  { id: "other", label: "Other Professional", icon: Briefcase },
];

// Reusing some UI patterns from student SignupFlow for consistency
const OptionCard = ({ 
  icon: Icon, 
  label, 
  selected, 
  onClick 
}: { 
  icon: React.ElementType; 
  label: string; 
  selected: boolean; 
  onClick: () => void 
}) => (
  <motion.button
    whileHover={{ y: -4, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={cn(
      "relative flex flex-col items-center justify-center p-6 rounded-[32px] border-2 transition-all duration-300 min-h-[160px] w-full group",
      selected 
        ? "bg-emerald-50 border-emerald-500 shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)]" 
        : "bg-white border-slate-100 hover:border-emerald-200 hover:shadow-xl shadow-sm"
    )}
  >
    <div className={cn(
      "size-14 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300",
      selected ? "bg-emerald-500 text-white" : "bg-slate-50 text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600"
    )}>
      <Icon size={28} />
    </div>
    <span className={cn(
      "text-sm font-bold tracking-tight text-center px-4",
      selected ? "text-emerald-900" : "text-slate-600"
    )}>{label}</span>
    {selected && (
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute top-4 right-4 size-6 bg-emerald-500 rounded-full flex items-center justify-center text-white"
      >
        <Check size={14} strokeWidth={3} />
      </motion.div>
    )}
  </motion.button>
);

const SOCIAL_PROOF = [
  {
    quote: "Joining DentiSpark allowed me to give back to the community while earning on my own schedule.",
    author: "Dr. Aris Thorne • Orthodontic Specialist",
    stat: "£50-£150 / hr",
    benefit: "Flexible Earnings",
    statLabel: "Average Mentor Earnings"
  },
  {
    quote: "The platform handles all the admin. I just show up and mentor. It's incredibly efficient.",
    author: "Dr. Sarah Leong • General Dentist",
    stat: "500+ Mentors",
    benefit: "Elite Network",
    statLabel: "Global Mentor Network"
  },
  {
    quote: "Seeing my mentees get into their dream dental schools is the most rewarding part of my career.",
    author: "James Winston • Final Year BDS Student",
    stat: "95% Student Success",
    benefit: "High Impact",
    statLabel: "Tracked Success Rate"
  },
  {
    quote: "The documentation process was straightforward. I felt verified and professional from day one.",
    author: "Dr. Elena Rossi • Specialist Mentor",
    stat: "100% Vetted",
    benefit: "Trust & Quality",
    statLabel: "Mentor Verification Rate"
  }
];

export function MentorOnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [onboardingData, setOnboardingData] = useState({
    role: "",
    experience: "",
    specialization: "",
    expertise: [] as string[],
    trainingWatched: false,
    interviewSlot: "",
    documents: {
      cv: null as File | null,
      certs: null as File | null,
    }
  });

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(mentorOnboardingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      emailAddress: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    }
  });

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

   const onSubmit = async (data: OnboardingFormData) => {
    startTransition(async () => {
      try {
        console.log("[MentorOnboarding] Initiating registration...");
        
        // Step 1: Account Registration
        const registrationResponse = await authApi.MENTOR_REGISTRATION({
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          emailAddress: data.emailAddress.trim().toLowerCase(),
          password: data.password,
          phoneNumber: data.phoneNumber.trim(),
          yearOfDentistry: onboardingData.experience,
          areaOfSpecialization: onboardingData.specialization,
        });

        if (registrationResponse.responseCode !== "00") {
          console.error("[MentorOnboarding] Registration failed:", registrationResponse);
          throw new Error(registrationResponse.responseMessage || "Registration failed. Please check your details and try again.");
        }

        console.log("[MentorOnboarding] Registration successful. Proceeding to verification...");

        // Step 2: Profile Verification
        const expertiseMapping: Record<string, string> = {
          "ucat": "UCAT",
          "personal-statements": "PERSONAL_STATEMENT",
          "mmis": "MMIs",
          "school-specific-advice": "SCHOOL_SPECIFIC_ADVICE"
        };

        const mappedExpertise = onboardingData.expertise.map(e => expertiseMapping[e] || e);

        // Safely parse interview slot
        let interviewDate = new Date().toISOString().split('T')[0];
        let interviewTime = "10:00 AM";
        try {
          if (onboardingData.interviewSlot) {
            const parts = onboardingData.interviewSlot.split(" ");
            const dayPart = parts[0];
            const timePart = parts[2] || "10:00";
            const ampm = parts[3] || "AM";
            const today = new Date();
            interviewDate = dayPart.toLowerCase() === "tomorrow" 
              ? new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0]
              : today.toISOString().split('T')[0];
            interviewTime = `${timePart} ${ampm}`;
          }
        } catch (_) {
            // Defaults are fine
        }

        const documentNames = [
          onboardingData.documents.cv?.name,
          onboardingData.documents.certs?.name,
        ].filter(Boolean) as string[];

        const verificationResponse = await authApi.MENTOR_VERIFICATION({
          emailAddress: data.emailAddress.trim().toLowerCase(),
          documentUploadLinks: documentNames,
          expertiseDetailsList: mappedExpertise,
          dentalSchoolExperience: onboardingData.role,
          interviewDate,
          interviewTime,
        });

        if (verificationResponse.responseCode !== "00") {
          console.error("[MentorOnboarding] Verification failed:", verificationResponse);
          throw new Error(verificationResponse.responseMessage || "Verification setup failed. Please contact support.");
        }

        console.log("[MentorOnboarding] All steps completed successfully.");

        // ✅ Show success screen
        setIsSuccess(true);
        toast.success("Account created successfully!");
        
        // Brief delay so they see the success state before redirect
        setTimeout(() => {
          router.push("/mentor/verify-email?email=" + encodeURIComponent(data.emailAddress.trim().toLowerCase()));
        }, 2000);

      } catch (error: unknown) {
        console.error("[MentorOnboarding] Submission error:", error);
        toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
      }
    });
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const currentProof = SOCIAL_PROOF[currentStep % SOCIAL_PROOF.length];

  const FileUploadCard = ({ 
    title, 
    keyName, 
    icon: Icon 
  }: { 
    title: string; 
    keyName: "cv" | "certs"; 
    icon: React.ElementType 
  }) => {
    const file = onboardingData.documents[keyName];
    return (
      <div className={cn(
        "p-6 rounded-[24px] border-2 transition-all flex flex-col items-center justify-center text-center gap-4 group",
        file 
          ? "bg-emerald-50 border-emerald-500" 
          : "bg-white border-slate-100 hover:border-emerald-200"
      )}>
        <div className={cn(
          "size-12 rounded-xl flex items-center justify-center transition-colors",
          file ? "bg-emerald-500 text-white" : "bg-slate-50 text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600"
        )}>
           {file ? <Check size={24} /> : <Icon size={24} />}
        </div>
        <div>
          <h4 className="font-bold text-slate-900">{title}</h4>
          <p className="text-xs text-slate-500 mt-1">
            {file ? file.name : "Upload PDF or Word (max 5MB)"}
          </p>
        </div>
        <label className="cursor-pointer">
          <input 
            type="file" 
            className="hidden" 
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                setOnboardingData(prev => ({
                  ...prev,
                  documents: { ...prev.documents, [keyName]: f }
                }));
              }
            }}
          />
          <span className={cn(
            "inline-block px-6 py-2 rounded-xl text-xs font-bold transition-all",
            file ? "bg-emerald-100 text-emerald-700" : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
          )}>
            {file ? "Change File" : "Choose File"}
          </span>
        </label>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 items-stretch min-h-[700px]">
      {/* Left: Interactive Card */}
      <div className="w-full lg:w-[65%] flex flex-col">
        <div className="bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden flex-1 flex flex-col relative">
          
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-50">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
            />
          </div>

          <div className="p-8 md:p-12 lg:p-16 flex-1 flex flex-col">
            <header className="mb-12">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.3em] mb-4 block">
                Step {currentStep + 1} of {STEPS.length}
              </span>
              <h1 className="text-4xl md:text-5xl font-jakarta font-bold text-slate-900 leading-tight tracking-tight">
                {currentStep === 0 && <span className="inline-block text-emerald-500 mr-2 italic">1 &rarr;</span>}
                {STEPS[currentStep].title}
              </h1>
              <p className="text-lg text-slate-500 font-medium mt-4">
                {STEPS[currentStep].description}
              </p>
            </header>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 shrink-0 h-full"
              >
                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                    <div className="size-24 rounded-[32px] bg-emerald-500 text-white flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/20">
                      <CheckCircle size={48} />
                    </div>
                    <h2 className="text-4xl font-jakarta font-bold text-slate-900 mb-4">You&apos;re in!</h2>
                    <p className="text-xl text-slate-500 max-w-md font-medium">
                      Your application has been received. We&apos;re redirecting you to verify your email...
                    </p>
                    <div className="mt-12 flex items-center gap-2 text-emerald-600 font-bold">
                      <Loader2 className="animate-spin size-5" />
                      Finalizing your profile
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Step Content */}
                {currentStep === 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ROLES.map((role) => (
                      <OptionCard
                        key={role.id}
                        icon={role.icon}
                        label={role.label}
                        selected={onboardingData.role === role.id}
                        onClick={() => {
                          setOnboardingData(prev => ({ ...prev, role: role.id }));
                          setTimeout(handleNext, 400);
                        }}
                      />
                    ))}
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {YEARS_EXPERIENCE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setOnboardingData(prev => ({ ...prev, experience: opt.value }));
                          setTimeout(handleNext, 400);
                        }}
                        className={cn(
                          "px-6 py-8 rounded-[24px] border-2 font-bold text-lg transition-all",
                          onboardingData.experience === opt.value
                            ? "bg-emerald-500 text-white border-emerald-600 shadow-lg"
                            : "bg-white text-slate-600 border-slate-100 hover:border-emerald-200"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full overflow-y-auto max-h-[400px] pr-4 custom-scrollbar">
                    {SPECIALIZATION_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setOnboardingData(prev => ({ ...prev, specialization: opt.value }));
                        }}
                        className={cn(
                          "px-6 py-4 rounded-[20px] border-2 font-bold text-left transition-all flex items-center justify-between",
                          onboardingData.specialization === opt.value
                            ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                            : "bg-white text-slate-600 border-slate-100 hover:border-emerald-200"
                        )}
                      >
                        {opt.label}
                        {onboardingData.specialization === opt.value && <CheckCircle className="size-5 text-emerald-500" />}
                      </button>
                    ))}
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      {EXPERTISE_AREAS.map((area) => (
                        <button
                          key={area.value}
                          onClick={() => {
                            setOnboardingData(prev => ({
                              ...prev,
                              expertise: prev.expertise.includes(area.value)
                                ? prev.expertise.filter(i => i !== area.value)
                                : [...prev.expertise, area.value]
                            }));
                          }}
                          className={cn(
                            "group px-8 py-5 rounded-[24px] border-2 flex items-center justify-between transition-all",
                            onboardingData.expertise.includes(area.value)
                              ? "bg-emerald-500 text-white border-emerald-600 shadow-lg"
                              : "bg-white text-slate-700 border-slate-100 hover:border-emerald-200"
                          )}
                        >
                          <span className="text-xl font-bold">{area.label}</span>
                          <div className={cn(
                            "size-8 rounded-full border-2 flex items-center justify-center transition-colors",
                            onboardingData.expertise.includes(area.value)
                              ? "bg-white/20 border-white"
                              : "border-slate-200 bg-slate-50 group-hover:bg-emerald-100"
                          )}>
                             {onboardingData.expertise.includes(area.value) && <Check size={18} strokeWidth={4} />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="flex flex-col items-center justify-center py-4">
                     <div className="relative group cursor-pointer mb-8 w-full max-w-lg aspect-video rounded-[32px] overflow-hidden shadow-2xl">
                        <img 
                          src="/images/mentor-img-1.png" 
                          alt="Mentor Training" 
                          className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                           <motion.div 
                             whileHover={{ scale: 1.1 }}
                             className="size-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl text-white"
                           >
                              <Play size={40} fill="white" className="ml-1" />
                           </motion.div>
                        </div>
                     </div>
                     <div className="text-center space-y-4">
                        <h3 className="text-2xl font-bold text-slate-900">Mentor Standards & Values</h3>
                        <p className="text-slate-500 max-w-md mx-auto">Please watch this 2-minute overview of our platform standards before proceeding.</p>
                        <Button 
                          onClick={() => {
                            setOnboardingData(prev => ({ ...prev, trainingWatched: true }));
                            handleNext();
                          }}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 h-12 rounded-2xl font-bold"
                        >
                          I&apos;ve Watched &amp; Understand
                        </Button>
                     </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center h-full">
                    <FileUploadCard title="Curriculum Vitae" keyName="cv" icon={Briefcase} />
                    <FileUploadCard title="Dental Certifications" keyName="certs" icon={Award} />
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="flex flex-col items-center justify-center py-4 text-center">
                    <div className="size-24 rounded-[32px] bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-8 border border-emerald-500/20 shadow-inner">
                      <Clock size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Book Your Vetting Call</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-10">
                      All DentiSpark mentors undergo a brief 15-minute video interview to ensure the highest quality of mentorship.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
                      {["Tomorrow at 10:00 AM", "Tomorrow at 2:00 PM", "Monday at 9:00 AM", "Monday at 4:00 PM"].map((slot) => (
                        <button
                          key={slot}
                          onClick={() => {
                            setOnboardingData(prev => ({ ...prev, interviewSlot: slot }));
                            handleNext();
                          }}
                          className={cn(
                            "p-4 rounded-2xl border-2 font-bold transition-all text-sm",
                            onboardingData.interviewSlot === slot
                              ? "bg-emerald-500 text-white border-emerald-600 shadow-md"
                              : "bg-white text-slate-600 border-slate-100 hover:border-emerald-200"
                          )}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                    
                    <button className="mt-8 text-emerald-600 font-bold text-sm hover:underline">
                      See more availability &rarr;
                    </button>
                  </div>
                )}

                {currentStep === 7 && (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                       <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-400">First Name</FormLabel>
                                <FormControl>
                                  <Input {...field} className="h-14 rounded-2xl border-slate-100 bg-slate-50 px-6 focus:ring-emerald-500" placeholder="John" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-400">Last Name</FormLabel>
                                <FormControl>
                                  <Input {...field} className="h-14 rounded-2xl border-slate-100 bg-slate-50 px-6 focus:ring-emerald-500" placeholder="Doe" />
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
                            <FormItem>
                              <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-400">Email Address</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                                  <Input {...field} className="h-14 rounded-2xl border-slate-100 bg-slate-50 px-14 focus:ring-emerald-500" placeholder="john@example.com" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-400">Phone Number</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                                  <Input {...field} className="h-14 rounded-2xl border-slate-100 bg-slate-50 px-14 focus:ring-emerald-500" placeholder="+44 7000 000000" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-400">Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                                    <Input type="password" {...field} className="h-14 rounded-2xl border-slate-100 bg-slate-50 px-14 focus:ring-emerald-500" placeholder="••••••••" />
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
                              <FormItem>
                                <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-400">Confirm</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                                    <Input type="password" {...field} className="h-14 rounded-2xl border-slate-100 bg-slate-50 px-14 focus:ring-emerald-500" placeholder="••••••••" />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="agreeToTerms"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 py-2">
                              <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <FormLabel className="text-sm font-medium text-slate-500">I agree to the Terms of Service and Privacy Policy</FormLabel>
                            </FormItem>
                          )}
                        />

                        <Button 
                          type="submit"
                          disabled={isPending}
                          className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-lg shadow-lg active:scale-[0.98] transition-all"
                        >
                          Join the Mentor Community
                        </Button>
                    </form>
                  </Form>
                )}
                </>
                )}
              </motion.div>
            </AnimatePresence>

            {!isSuccess && (
              <footer className="mt-12 flex items-center justify-between border-t border-slate-50 pt-8">
                {currentStep > 0 ? (
                  <button 
                    onClick={handleBack}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold uppercase tracking-widest text-xs transition-colors"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                ) : <div />}

                {currentStep < STEPS.length - 1 && currentStep !== 0 && currentStep !== 1 && currentStep !== 4 && (
                  <Button 
                    onClick={handleNext}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-14 px-10 font-bold text-lg shadow-xl shadow-emerald-500/20 active:scale-95 transition-all group"
                  >
                    Continue
                    <ChevronRight className="size-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}
              </footer>
            )}
          </div>
        </div>

        {/* Mini Footer */}
        <div className="flex items-center justify-center gap-8 py-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          <span>© 2024 DentiSpark Mentorship</span>
          <Link href="/support" className="hover:text-slate-600 transition-colors">Need Help?</Link>
        </div>
      </div>

      {/* Right: Social Proof & Stats */}
      <div className="hidden lg:flex w-full lg:w-[35%] flex-col gap-6">
        <div className="bg-[#0F172A] rounded-[40px] p-8 md:p-12 flex flex-col h-full text-white relative overflow-hidden group">
          {/* Subtle decoration */}
          <div className="absolute top-[-10%] right-[-10%] size-64 bg-emerald-500/10 blur-[80px] rounded-full group-hover:bg-emerald-500/20 transition-all duration-1000" />
          
          <div className="relative z-10 flex flex-col h-full">
            <header className="mb-auto">
              <div className="size-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-8 border border-emerald-500/20 shadow-inner group-hover:scale-110 transition-transform">
                <StarIcon size={32} fill="currentColor" />
              </div>
              <h2 className="text-3xl font-jakarta font-semibold leading-tight tracking-tight mb-4">
                Join the top 5% of dental mentors.
              </h2>
              <p className="text-slate-400 text-lg">
                DentiSpark is home to some of the brightest minds in dentistry.
              </p>
            </header>

            <AnimatePresence mode="wait">
              <motion.div 
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="my-12 space-y-8"
              >
                <div className="space-y-4">
                  <div className="flex text-emerald-400 gap-1">
                    {[1,2,3,4,5].map(i => <StarIcon key={i} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-xl font-medium leading-relaxed italic text-slate-200">
                    &quot;{currentProof.quote}&quot;
                  </p>
                  <div className="flex items-center gap-4">
                     <div className="size-10 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-400">
                        {currentProof.author[0]}
                     </div>
                     <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                       {currentProof.author}
                     </span>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col gap-4">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.3em]">
                      {currentProof.benefit}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-4xl font-jakarta font-bold text-white tracking-widest">
                        {currentProof.stat}
                      </span>
                      <span className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">
                        {currentProof.statLabel}
                      </span>
                    </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <footer className="mt-auto">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="shrink-0 size-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                    <Check size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Flexible Mentoring</h4>
                    <p className="text-xs text-slate-400">Choose your own hours and rates.</p>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
