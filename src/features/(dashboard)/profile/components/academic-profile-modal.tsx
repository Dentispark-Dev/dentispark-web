"use client";

import { Loader2, Plus, Trash2, GraduationCap, BarChart3, Briefcase, Building2 } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { academicSchema } from "../types";
import {
  yearOptions,
  gradeOptions,
  gcseOptions,
  universityStatusOptions,
  defaultAcademicData,
} from "../constants";
import { useUpdateAcademicProfileMutation } from "../services";
import { cn } from "@/src/lib/utils";

const academicModalSchema = academicSchema.extend({
  courseOfInterest: z.enum(
    ["dental-science", "dental-hygiene-therapy", "dental-nursing"],
    {
      required_error: "Please select a course of interest",
    },
  ),
});

type AcademicModalFormData = z.infer<typeof academicModalSchema>;

interface AcademicProfileModalProps {
  initialData?: Partial<AcademicModalFormData>;
  onSubmit: (data: AcademicModalFormData) => void;
  onCancel: () => void;
}

export function AcademicProfileModal({
  initialData,
  onSubmit,
  onCancel,
}: AcademicProfileModalProps) {
  const updateAcademicProfileMutation = useUpdateAcademicProfileMutation();

  const form = useForm<AcademicModalFormData>({
    resolver: zodResolver(academicModalSchema),
    defaultValues: {
      ...defaultAcademicData,
      courseOfInterest: "dental-science",
      ...initialData,
    },
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
    control: form.control,
    name: "workExperience" as any,
  });

  const { fields: uniFields, append: appendUni, remove: removeUni } = useFieldArray({
    control: form.control,
    name: "universityShortlist" as any,
  });

  const handleSubmit = async (data: AcademicModalFormData) => {
    try {
      await updateAcademicProfileMutation.mutateAsync({
        ...data,
      });
      onSubmit(data);
    } catch {
      // Error handled by mutation toast
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <Form {...form}>
        <form
          id="academic-profile-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-10"
        >
          {/* Section: Core Profile */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <h3 className="font-sora font-bold">Core Academic Info</h3>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="yearOfStudy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">Year of study</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {yearOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gcseResult"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">GCSE Average</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Select Grade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {gcseOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section: Admissions Tests */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-2">
              <BarChart3 className="h-5 w-5 text-emerald-500" />
              <h3 className="font-sora font-bold">Admissions Tests</h3>
            </div>
            
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="ucatScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">UCAT Total</FormLabel>
                      <FormControl><Input {...field} placeholder="e.g. 2800" className="h-12 rounded-xl" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="casperScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">CASPer</FormLabel>
                      <FormControl><Input {...field} placeholder="Quartile" className="h-12 rounded-xl" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bmatSection1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">BMAT S1</FormLabel>
                      <FormControl><Input {...field} placeholder="Score" className="h-12 rounded-xl" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 text-center">UCAT Component Breakdown</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { name: "ucatVerbal", label: "Verbal" },
                    { name: "ucatDecision", label: "Decision" },
                    { name: "ucatQuant", label: "Quant" },
                    { name: "ucatAbstract", label: "Abstract" },
                    { name: "ucatSituational", label: "SJT" },
                  ].map((sub) => (
                    <FormField
                      key={sub.name}
                      control={form.control}
                      name={sub.name as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[9px] font-extrabold text-slate-500 uppercase flex justify-center mb-1">{sub.label}</FormLabel>
                          <FormControl><Input {...field} className="h-10 text-center rounded-lg bg-white" placeholder="—" /></FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Work Experience */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2 text-slate-900">
                <Briefcase className="h-5 w-5 text-blue-500" />
                <h3 className="font-sora font-bold">Experience Logs</h3>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => appendExp({ id: Math.random().toString(), company: "", role: "", duration: "", reflection: "" } as any)}
                className="h-8 text-xs font-bold border-blue-100 text-blue-600 hover:bg-blue-50"
              >
                <Plus className="h-3 w-3 mr-1" /> Add Experience
              </Button>
            </div>

            <div className="space-y-4">
              {expFields.map((field, index) => (
                <div key={field.id} className="p-6 bg-white border border-slate-100 shadow-sm rounded-3xl space-y-4 relative group">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeExp(index)}
                    className="absolute top-4 right-4 h-8 w-8 p-0 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`workExperience.${index}.company` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-bold text-slate-400 uppercase">Hospital/Clinic</FormLabel>
                          <FormControl><Input {...field} className="h-10 rounded-xl" /></FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name={`workExperience.${index}.role` as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold text-slate-400 uppercase">Role</FormLabel>
                            <FormControl><Input {...field} className="h-10 rounded-xl" /></FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`workExperience.${index}.duration` as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold text-slate-400 uppercase">Duration</FormLabel>
                            <FormControl><Input {...field} className="h-10 rounded-xl" /></FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name={`workExperience.${index}.reflection` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold text-slate-400 uppercase">Personal Reflection (Critical for AI)</FormLabel>
                        <FormControl><Textarea {...field} placeholder="What did you learn from this placement?" className="min-h-[80px] rounded-2xl resize-none" /></FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              {expFields.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/30">
                  <p className="text-slate-400 text-sm font-medium">Add your clinical placements or shadowing experience.</p>
                </div>
              )}
            </div>
          </div>

          {/* Section: University Shortlist */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2 text-slate-900">
                <Building2 className="h-5 w-5 text-slate-900" />
                <h3 className="font-sora font-bold">University Choices</h3>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => appendUni({ id: Math.random().toString(), university: "", course: "Dental Science", status: "Interested" } as any)}
                className="h-8 text-xs font-bold border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <Plus className="h-3 w-3 mr-1" /> Add University
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {uniFields.map((field, index) => (
                <div key={field.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3 relative group">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeUni(index)}
                    className="absolute top-2 right-2 h-6 w-6 p-0 text-slate-300 hover:text-red-500 rounded-full"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  <FormField
                    control={form.control}
                    name={`universityShortlist.${index}.university` as any}
                    render={({ field }) => (
                      <Input {...field} placeholder="University Name" className="h-10 bg-white border-slate-200 rounded-xl" />
                    )}
                  />
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`universityShortlist.${index}.course` as any}
                      render={({ field }) => (
                        <Input {...field} placeholder="Course" className="h-9 bg-white border-slate-200 rounded-xl text-xs flex-1" />
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`universityShortlist.${index}.status` as any}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-9 w-[110px] bg-white border-slate-200 rounded-xl text-[10px] font-bold">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {universityStatusOptions.map(opt => (
                              <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex w-full gap-4 pt-10 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              className="h-14 flex-1 rounded-2xl text-slate-600 font-bold hover:bg-slate-50"
              onClick={onCancel}
              disabled={updateAcademicProfileMutation.isPending}
            >
              Discard Changes
            </Button>
            <Button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white h-14 flex-1 rounded-2xl font-sora font-extrabold text-lg shadow-xl"
              disabled={updateAcademicProfileMutation.isPending}
            >
              {updateAcademicProfileMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Save Admissions Portfolio"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
