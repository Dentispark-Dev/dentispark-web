"use client";

import { useState } from "react";
import { Edit, GraduationCap, Briefcase, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useModal } from "@/src/hooks/use-modal";
import { EditEducationModal } from "./edit-education-modal";
import { EditWorkModal } from "./edit-work-modal";
import { toast } from "sonner";
import Image from "next/image";
import { Badge } from "@/src/components/ui/badge";

export function MentorEducationWork() {
  const { showModal, hideModal } = useModal();

  const [specialties, setSpecialties] = useState([
    "MMI Coaching", "Personal Statement Review", "UCAT Strategy", "Clinical Skills", "Manual Dexterity"
  ]);

  const [educationData, setEducationData] = useState([
    {
      university: "King's College London",
      degree: "Bachelor of Dental Surgery (BDS)",
      period: "2015 - 2020",
      logo: "/images/uni-svg.png",
    },
  ]);

  const [workData, setWorkData] = useState([
    {
      company: "Private Dental Practice",
      position: "Associate Dentist",
      period: "2020 - Present",
      logo: "/images/uni-svg.png",
      description: [
        "Specializing in aesthetic restorative dentistry and patient communication.",
        "Mentoring foundation dentists and dental students during clinical placements."
      ],
    },
  ]);

  const handleEditEducation = () => {
    showModal({
      type: "edit-education",
      modalTitle: "Update Education",
      size: "xl",
      isCustomContent: true,
      bodyContent: (
        <EditEducationModal
          onSave={handleSaveEducation}
          onCancel={hideModal}
          initialData={{
            schools: educationData.map((edu) => ({
              school: edu.university,
              fromDate: "",
              toDate: "",
            })),
          }}
        />
      ),
      action: () => {},
      actionTitle: "",
    });
  };

  const handleSaveEducation = (data: any) => {
    const updatedEducation = data.schools.map((school: any) => ({
      university: school.school,
      degree: "BDS Dental Surgery",
      period: `${school.fromDate} - ${school.toDate}`,
      logo: "/images/uni-svg.png",
    }));

    setEducationData(updatedEducation);
    toast.success("Educational records updated!");
    hideModal();
  };

  return (
    <div className="space-y-8">
      {/* Mentorship Specialties - NEW SECTION */}
      <div className="rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-sm">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-amber-500" />
            <h2 className="font-sora text-xl font-extrabold text-slate-900 tracking-tight">
              Mentorship Specialties
            </h2>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl font-bold border-slate-100">
            Manage Tags
          </Button>
        </div>
        <div className="flex flex-wrap gap-3">
          {specialties.map((tag) => (
            <Badge key={tag} className="bg-slate-50 text-slate-700 hover:bg-slate-100 border-none px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Education Section */}
        <div className="rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-sm flex flex-col">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-6 w-6 text-primary" />
              <h2 className="font-sora text-xl font-extrabold text-slate-900 tracking-tight">Education</h2>
            </div>
            <Button onClick={handleEditEducation} variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full hover:bg-slate-50">
              <Edit className="h-4 w-4 text-slate-400" />
            </Button>
          </div>

          <div className="space-y-8 flex-1">
            {educationData.map((edu, index) => (
              <div key={index} className="flex gap-6 group">
                <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-3 transition-colors group-hover:bg-white group-hover:border-primary/20">
                   <Image src={edu.logo} alt="" width={32} height={32} className="opacity-80" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-sora font-bold text-slate-900 leading-tight">{edu.university}</h4>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">{edu.degree}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase">{edu.period}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Work Experience Section */}
        <div className="rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-sm">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Briefcase className="h-6 w-6 text-blue-500" />
              <h2 className="font-sora text-xl font-extrabold text-slate-900 tracking-tight">Experience</h2>
            </div>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full hover:bg-slate-50">
              <Edit className="h-4 w-4 text-slate-400" />
            </Button>
          </div>

          <div className="space-y-10">
            {workData.map((work, index) => (
              <div key={index} className="space-y-4">
                <div className="flex gap-6">
                  <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-3">
                    <Image src={work.logo} alt="" width={32} height={32} className="opacity-80" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-sora font-bold text-slate-900 leading-tight">{work.company}</h4>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">{work.position}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase">{work.period}</p>
                  </div>
                </div>
                <div className="pl-20 space-y-2">
                  {work.description.map((point, i) => (
                    <p key={i} className="text-sm font-medium text-slate-500 leading-relaxed">• {point}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
