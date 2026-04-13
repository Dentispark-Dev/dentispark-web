"use client";

import { useState } from "react";
import { Edit, ShieldCheck, Award, BadgeCheck } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/src/providers/auth-provider";
import { useModal } from "@/src/hooks/use-modal";
import { EditPersonalInfoModal } from "./edit-personal-info-modal";
import { toast } from "sonner";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/utils";
import { LooseRecord } from "@/src/types/loose";

export function MentorPersonalInformation() {
  const { user } = useAuth();
  const { showModal, hideModal } = useModal();

  const [personalInfo, setPersonalInfo] = useState({
    firstName: "Sara",
    lastName: "Barrywhite",
    email: user?.emailAddress || "johndoe@dentispark.co.uk",
    phone: "+44 7700 900000",
    gdcNumber: "123456",
    professionalTier: "specialist" as "student" | "associate" | "specialist",
    aboutMe: `With ten years of experience in graduate admissions at Stanford University's School of Engineering and School of Education, I can provide valuable insight into the application and review process. I am here to address your concerns and answer your questions about applying to graduate school.

Since 2013, I have worked as a professional graduate admission consultant and coach, specializing in helping navigate the application process for programs in the dental sciences.

Why do I mentor?
I mentor students to bring clarity and purpose to the graduate application process. My goal is to help as many individuals as possible achieve their academic objectives.`,
  });

  const handleEditClick = () => {
    showModal({
      type: "edit-personal-info",
      modalTitle: "Edit personal information",
      size: "xl",
      isCustomContent: true,
      bodyContent: (
        <EditPersonalInfoModal
          onSave={handleSave}
          onCancel={hideModal}
          initialData={{
            firstName: personalInfo.firstName,
            lastName: personalInfo.lastName,
            emailAddress: personalInfo.email,
            phoneNumber: personalInfo.phone,
            gdcNumber: personalInfo.gdcNumber,
            professionalTier: personalInfo.professionalTier,
            aboutMe: personalInfo.aboutMe,
          }}
        />
      ),
      action: () => {},
      actionTitle: "",
    });
  };

  const handleSave = (data: LooseRecord) => {
    setPersonalInfo({
      ...personalInfo,
      firstName: data.firstName || personalInfo.firstName,
      lastName: data.lastName || personalInfo.lastName,
      email: data.emailAddress || personalInfo.email,
      phone: data.phoneNumber || personalInfo.phone,
      gdcNumber: data.gdcNumber || personalInfo.gdcNumber,
      professionalTier: data.professionalTier || personalInfo.professionalTier,
      aboutMe: data.aboutMe || personalInfo.aboutMe,
    });

    toast.success("Professional profile updated successfully!");
    hideModal();
  };

  return (
    <div className="rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-sm">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-emerald-500" />
          <h2 className="font-jakarta text-xl font-extrabold text-slate-900 tracking-tight">
            Professional Identity
          </h2>
        </div>
        <Button
          onClick={handleEditClick}
          className="rounded-xl h-10 px-6 font-bold shadow-lg shadow-primary/10 transition-transform hover:scale-105"
        >
          <Edit className="h-4 w-4 mr-2" />
          Update Credentials
        </Button>
      </div>

      <div className="space-y-10">
        {/* Vetting Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-slate-50/50 rounded-3xl border border-slate-50">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</p>
            <p className="font-jakarta font-bold text-slate-900">{personalInfo.firstName} {personalInfo.lastName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">GDC Number</p>
            <p className="font-jakarta font-bold text-slate-900 flex items-center gap-1.5">
              {personalInfo.gdcNumber || "Not Provided"}
              {personalInfo.gdcNumber && <BadgeCheck className="h-4 w-4 text-emerald-500" />}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Professional Tier</p>
            <div className="pt-0.5">
              <Badge className={cn(
                "rounded-lg font-bold text-[10px] uppercase tracking-wider px-2.5 py-1",
                personalInfo.professionalTier === 'specialist' ? "bg-purple-100 text-purple-700 hover:bg-purple-100" :
                personalInfo.professionalTier === 'associate' ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" :
                "bg-slate-100 text-slate-700 hover:bg-slate-100"
              )}>
                {personalInfo.professionalTier}
              </Badge>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Details</p>
            <p className="text-sm font-medium text-slate-600">{personalInfo.phone}</p>
          </div>
        </div>

        {/* Bio Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Clinical & Mentorship Bio</h3>
          </div>
          <div className="max-w-4xl text-base leading-relaxed text-slate-600 font-medium tracking-tight">
            {personalInfo.aboutMe.split("\n\n").map((paragraph, index) => (
              <p key={index} className="font-jakarta mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
