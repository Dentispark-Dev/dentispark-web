"use client";

import { useState } from "react";
import { Edit, Loader2, Award, BookOpen, GraduationCap, Building2, BarChart3, Briefcase, Plus, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { useAuth } from "@/src/providers/auth-provider";
import { Badge } from "@/src/components/ui/badge";

import { type AcademicFormData } from "../types";
import { defaultAcademicData } from "../constants";
import { AcademicProfileModal } from "./academic-profile-modal";
import { useAcademicProfileQuery } from "../services";
import { cn } from "@/src/lib/utils";

interface AcademicProfileProps {
  initialData?: Partial<AcademicFormData>;
}

export function AcademicProfile({ initialData }: AcademicProfileProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const isMentor = user?.memberType === "ACADEMIC_MENTOR";

  const {
    data: academicProfileData,
    isLoading,
    error,
    refetch,
  } = useAcademicProfileQuery();

  const data: AcademicFormData = {
    ...defaultAcademicData,
    ...initialData,
    ...(academicProfileData && {
      ...academicProfileData,
      biologyGrade: academicProfileData?.aLevelGrades?.find(g => g.subject.toLowerCase() === "biology")?.grade || "",
      chemistryGrade: academicProfileData?.aLevelGrades?.find(g => g.subject.toLowerCase() === "chemistry")?.grade || "",
      otherSubject: academicProfileData?.aLevelGrades?.find(g => !["biology", "chemistry"].includes(g.subject.toLowerCase()))?.subject || "",
      otherSubjectGrade: academicProfileData?.aLevelGrades?.find(g => !["biology", "chemistry"].includes(g.subject.toLowerCase()))?.grade || "",
    }),
  };

  if (isMentor) {
    return (
      <div className="mx-auto max-w-5xl bg-white pb-16">
        <div className="p-6">
          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-12 text-center">
            <GraduationCap className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-slate-900 font-bold text-xl">Student Admissions Portfolio</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto tracking-tight">This specialized dashboard is reserved for student users to manage their dental school applications.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex items-center justify-between px-4 sm:px-0">
        <div>
          <h1 className="text-3xl font-sora font-extrabold text-slate-900 tracking-tight">Admissions Portfolio</h1>
          <p className="text-slate-500 mt-1 font-medium tracking-tight">Complete your profile to unlock AI-powered personal statement scoring and mentor matching.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="rounded-xl px-6 h-12 shadow-lg shadow-primary/10 transition-transform hover:scale-[1.02] active:scale-[0.98]">
          <Edit className="mr-2 h-4 w-4" />
          Update Portfolio
        </Button>
      </div>

      {/* Grid Layout for Different Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Academic & Tests */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* UCAT/BMAT Analytics Card */}
          <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-slate-900 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BarChart3 className="text-emerald-400 h-6 w-6" />
                <h3 className="text-white font-sora font-bold uppercase tracking-widest text-xs">Admissions Test Analytics</h3>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20">
                AI Match Ready
              </Badge>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Main Score Display */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total UCAT</p>
                  <p className="text-2xl font-sora font-extrabold text-slate-900">{data.ucatScore || "—"}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">CASPer</p>
                  <p className="text-2xl font-sora font-extrabold text-slate-900">{data.casperScore || "—"}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">BMAT S1</p>
                  <p className="text-2xl font-sora font-extrabold text-slate-900">{data.bmatSection1 || "—"}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">BMAT S2</p>
                  <p className="text-2xl font-sora font-extrabold text-slate-900">{data.bmatSection2 || "—"}</p>
                </div>
              </div>

              {/* UCAT Sub-score Breakdown */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  UCAT Component Breakdown
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: "Verbal Reasoning", val: data.ucatVerbal },
                    { label: "Decision Making", val: data.ucatDecision },
                    { label: "Quant Reasoning", val: data.ucatQuant },
                    { label: "Abstract Reasoning", val: data.ucatAbstract },
                    { label: "Situational Judgement", val: data.ucatSituational },
                  ].map((sub, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">{sub.label}</span>
                      <span className="font-sora font-bold text-slate-900">{sub.val || "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Academic Background Section */}
          <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-6">
            <div className="flex items-center gap-3">
              <Award className="text-primary h-6 w-6" />
              <h3 className="text-slate-900 font-sora font-bold">Academic Achievement</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Base Credentials</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-3 border-b border-slate-50">
                    <span className="text-sm font-medium text-slate-600">Year of Study</span>
                    <span className="text-sm font-bold text-slate-900 capitalize">{data.yearOfStudy.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-50">
                    <span className="text-sm font-medium text-slate-600">GCSE Result (Avg)</span>
                    <span className="text-sm font-bold text-slate-900">{data.gcseResult}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">A-Level Grades</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { sub: "Biology", grade: data.biologyGrade || "" },
                    { sub: "Chemistry", grade: data.chemistryGrade || "" },
                    { sub: data.otherSubject || "Other", grade: data.otherSubjectGrade || "" }
                  ].map((item, i) => (
                    <div key={i} className={cn("p-4 rounded-2xl border", item.grade?.includes('A') ? "bg-emerald-50 border-emerald-100" : "bg-slate-50 border-slate-100")}>
                      <p className="text-[10px] font-bold text-slate-500 truncate mb-1">{item.sub}</p>
                      <p className={cn("text-xl font-sora font-extrabold", item.grade?.includes('A') ? "text-emerald-700" : "text-slate-900")}>{item.grade || "—"}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Work Experience Modular List */}
          <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Briefcase className="text-blue-500 h-6 w-6" />
                <h3 className="text-slate-900 font-sora font-bold">Experience Logs</h3>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold" onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add Entry
              </Button>
            </div>

            <div className="space-y-4">
              {data.workExperience && data.workExperience.length > 0 ? (
                data.workExperience.map((exp, i) => (
                  <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl group hover:bg-white hover:border-blue-200 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-slate-900 font-bold text-lg">{exp.company}</h4>
                        <p className="text-slate-500 text-sm font-medium">{exp.role} • {exp.duration}</p>
                      </div>
                      <Badge variant="outline" className="bg-white">Verified</Badge>
                    </div>
                    <p className="text-slate-600 text-sm italic leading-relaxed">"{exp.reflection}"</p>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center rounded-3xl border-2 border-dashed border-slate-100">
                  <p className="text-slate-400 font-medium">No experience logs added yet.</p>
                  <p className="text-xs text-slate-400 mt-1">Structured experience data is critical for PS AI.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Admission Dashboard */}
        <div className="space-y-8">
          
          {/* Action Center */}
          <div className="bg-gradient-to-br from-primary to-primary-600 rounded-[2rem] p-8 text-white shadow-xl shadow-primary/20">
            <h3 className="font-sora font-bold text-xl mb-2">Portfolio Score</h3>
            <div className="flex items-end gap-3 mb-6">
              <span className="text-5xl font-sora font-extrabold tracking-tighter">82%</span>
              <span className="text-white/70 font-bold mb-2">Complete</span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full mb-8 overflow-hidden">
              <div className="bg-white h-full w-[82%]" />
            </div>
            <Button className="w-full bg-white text-primary hover:bg-slate-100 font-bold h-12 rounded-xl">
              Preview Snapshot
            </Button>
          </div>

          {/* University Shortlist Tracker */}
          <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-6">
            <div className="flex items-center gap-3">
              <Building2 className="text-slate-900 h-6 w-6" />
              <h3 className="text-slate-900 font-sora font-bold">University Shortlist</h3>
            </div>

            <div className="space-y-3">
              {data.universityShortlist && data.universityShortlist.length > 0 ? (
                data.universityShortlist.map((uni, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-50">
                    <div>
                      <p className="font-bold text-slate-900 text-sm leading-none">{uni.university}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{uni.course}</p>
                    </div>
                    {uni.status === "Offer" ? (
                      <div className="p-1 px-2.5 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-extrabold flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        OFFER
                      </div>
                    ) : uni.status === "Interview" ? (
                      <div className="p-1 px-2.5 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-extrabold flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        INTERVIEW
                      </div>
                    ) : uni.status === "Rejected" ? (
                      <div className="p-1 px-2.5 bg-red-100 text-red-700 rounded-lg text-[10px] font-extrabold flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        REJECTED
                      </div>
                    ) : (
                      <div className="p-1 px-2.5 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-extrabold uppercase">
                        {uni.status}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-100">
                  <AlertCircle className="h-5 w-5 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">Add your top choice universities to track your application status.</p>
                </div>
              )}
              <Button variant="outline" className="w-full mt-2 border-slate-200 border-dashed hover:bg-slate-50 h-10 rounded-xl text-slate-500 font-bold text-xs" onClick={() => setIsModalOpen(true)}>
                <Plus className="h-3 w-3 mr-1" /> Manage List
              </Button>
            </div>
          </section>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="mx-auto max-h-[95vh] max-w-3xl overflow-hidden p-0 sm:max-h-[90vh] rounded-[2.5rem]">
          <div className="flex h-full max-h-[calc(95vh-2rem)] flex-col sm:max-h-[calc(90vh-4rem)]">
            <DialogHeader className="flex-shrink-0 border-b border-slate-100 px-6 py-6 bg-slate-50/50">
              <DialogTitle className="text-2xl font-sora font-extrabold text-slate-900 tracking-tight">
                Update Admissions Portfolio
              </DialogTitle>
              <p className="text-slate-500 text-sm font-medium">Enter your granular test scores and background data for AI evaluation.</p>
            </DialogHeader>
            <div className="hidden-scrollbar flex-1 touch-pan-y overflow-y-auto overscroll-contain p-6">
              <AcademicProfileModal
                initialData={data}
                onSubmit={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
