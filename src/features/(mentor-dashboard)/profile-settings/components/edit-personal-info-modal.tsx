"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { LooseRecord } from "@/src/types/loose";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

const editPersonalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  emailAddress: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  countryCode: z.string().min(1, "Country code is required"),
  gdcNumber: z.string().min(6, "GDC number must be at least 6 digits").optional().or(z.literal("")),
  professionalTier: z.enum(["student", "associate", "specialist"]),
  aboutMe: z.string().optional(),
  whyDoIMentor: z.string().optional(),
});

type EditPersonalInfoFormData = z.infer<typeof editPersonalInfoSchema>;

interface EditPersonalInfoModalProps {
  onSave: (data: EditPersonalInfoFormData) => void;
  onCancel: () => void;
  initialData?: LooseRecord; // Using any to handle the extended fields passed from view
}

export function EditPersonalInfoModal({
  onSave,
  onCancel,
  initialData,
}: EditPersonalInfoModalProps) {
  const [aboutMeWordCount, setAboutMeWordCount] = useState(0);
  const [whyMentorWordCount, setWhyMentorWordCount] = useState(0);

  const form = useForm<EditPersonalInfoFormData>({
    resolver: zodResolver(editPersonalInfoSchema),
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      emailAddress: initialData?.emailAddress || "",
      phoneNumber: initialData?.phoneNumber || "",
      countryCode: initialData?.countryCode || "UK",
      gdcNumber: initialData?.gdcNumber || "",
      professionalTier: initialData?.professionalTier || "associate",
      aboutMe: initialData?.aboutMe || "",
      whyDoIMentor: initialData?.whyDoIMentor || "",
    },
  });

  const countWords = (text: string) => {
    return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  };

  const handleAboutMeChange = (value: string) => {
    setAboutMeWordCount(countWords(value));
    return value;
  };

  const handleWhyMentorChange = (value: string) => {
    setWhyMentorWordCount(countWords(value));
    return value;
  };

  const onSubmit = (data: EditPersonalInfoFormData) => {
    onSave(data);
  };

  return (
    <div className="w-full space-y-8 py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Section: Professional Vetting */}
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Elite Verification Data</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="gdcNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      GDC Registration Number
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. 123456" className="h-12 bg-white rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="professionalTier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Professional Tier
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 bg-white rounded-xl">
                          <SelectValue placeholder="Select Tier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="student">Dental Student / Trainee</SelectItem>
                        <SelectItem value="associate">Dental Associate</SelectItem>
                        <SelectItem value="specialist">Consultant / Specialist</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    First name
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="h-12 rounded-xl" />
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
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Last name
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="h-12 rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="emailAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="email" className="h-12 rounded-xl" />
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
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Phone number
                  </FormLabel>
                  <FormControl>
                    <div className="flex">
                      <FormField
                        control={form.control}
                        name="countryCode"
                        render={({ field: countryField }) => (
                          <Select
                            onValueChange={countryField.onChange}
                            defaultValue={countryField.value}
                          >
                            <SelectTrigger className="w-24 rounded-r-none border-r-0 h-12 rounded-l-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="UK">UK (+44)</SelectItem>
                              <SelectItem value="US">US (+1)</SelectItem>
                              <SelectItem value="CA">CA (+1)</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <Input
                        {...field}
                        className="h-12 rounded-l-none rounded-r-xl"
                        placeholder="7700 900000"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* About Me */}
            <FormField
              control={form.control}
              name="aboutMe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    About me
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Tell us about yourself"
                      className="min-h-[150px] resize-none rounded-2xl"
                      onChange={(e) => {
                        const value = handleAboutMeChange(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <div className="font-jakarta text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-1 flex justify-end">
                    Word count: {aboutMeWordCount}/1000
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Why do I mentor */}
            <FormField
              control={form.control}
              name="whyDoIMentor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Why do I mentor?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Tell us about your reasons..."
                      className="min-h-[150px] resize-none rounded-2xl"
                      onChange={(e) => {
                        const value = handleWhyMentorChange(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <div className="font-jakarta text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-1 flex justify-end">
                    Word count: {whyMentorWordCount}/1000
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Action Buttons */}
          <div className="font-jakarta flex w-full gap-4 pt-6 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="h-14 flex-1 rounded-2xl text-slate-600 font-bold hover:bg-slate-50"
            >
              Discard Changes
            </Button>
            <Button type="submit" className="h-14 flex-1 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-jakarta font-extrabold text-lg shadow-xl">
              Apply Credentials
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
