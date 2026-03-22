"use client";

import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { adminService } from "@/src/connection/admin-service";
import { CreateCoursePayload } from "@/src/connection/api-types";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { toast } from "sonner";
import { X, Loader2 } from "lucide-react";

interface CreateCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialUniversityHid?: string;
}

export function CreateCourseModal({ isOpen, onClose, initialUniversityHid }: CreateCourseModalProps) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<CreateCoursePayload>({
        universityHid: initialUniversityHid || "",
        courseName: "",
        degreeType: "",
        durationYears: undefined,
        entryRequirements: "",
        description: "",
        feesDomestic: undefined,
        feesInternational: undefined,
        applicationDeadline: "",
        aLevelRequirements: "",
        ibRequirements: "",
        ucatRequirement: "",
        interviewDetails: "",
        courseUrl: ""
    });

    const { data: universitiesData } = useQuery({
        queryKey: ["admin-universities-all"],
        queryFn: () => adminService.getUniversityRecords({ page: 0, perPage: 100 }),
        enabled: isOpen
    });

    const createMutation = useMutation({
        mutationFn: () => adminService.createCourse(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
            toast.success("Course created successfully");
            onClose();
            setFormData({ 
                universityHid: initialUniversityHid || "", 
                courseName: "", 
                degreeType: "", 
                durationYears: undefined, 
                entryRequirements: "", 
                description: "", 
                feesDomestic: undefined, 
                feesInternational: undefined, 
                applicationDeadline: "",
                aLevelRequirements: "",
                ibRequirements: "",
                ucatRequirement: "",
                interviewDetails: "",
                courseUrl: "" 
            });
        },
        onError: () => {
            toast.error("Failed to create course");
        }
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Add New Course</h2>
                    <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <Label htmlFor="universityHid">University *</Label>
                        <select
                            id="universityHid"
                            className="w-full mt-1 h-10 px-3 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={formData.universityHid}
                            onChange={(e) => setFormData(prev => ({ ...prev, universityHid: e.target.value }))}
                        >
                            <option value="">Select a university</option>
                            {universitiesData?.content?.map(u => (
                                <option key={u.hid} value={u.hid}>{u.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <Label htmlFor="courseName">Course Name *</Label>
                        <Input
                            id="courseName"
                            className="mt-1"
                            placeholder="e.g. Bachelor of Dental Surgery"
                            value={formData.courseName}
                            onChange={(e) => setFormData(prev => ({ ...prev, courseName: e.target.value }))}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="degreeType">Degree Type</Label>
                            <select
                                id="degreeType"
                                className="w-full mt-1 h-10 px-3 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={formData.degreeType}
                                onChange={(e) => setFormData(prev => ({ ...prev, degreeType: e.target.value }))}
                            >
                                <option value="">Select type</option>
                                <option value="Undergraduate">Undergraduate</option>
                                <option value="Postgraduate">Postgraduate</option>
                                <option value="Doctorate">Doctorate</option>
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="durationYears">Duration (Years)</Label>
                            <Input
                                id="durationYears"
                                type="number"
                                className="mt-1"
                                placeholder="e.g. 5"
                                value={formData.durationYears ?? ""}
                                onChange={(e) => setFormData(prev => ({ ...prev, durationYears: e.target.value ? Number(e.target.value) : undefined }))}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="entryRequirements">Entry Requirements</Label>
                        <Input
                            id="entryRequirements"
                            className="mt-1"
                            placeholder="e.g. AAA at A-Level including Chemistry"
                            value={formData.entryRequirements}
                            onChange={(e) => setFormData(prev => ({ ...prev, entryRequirements: e.target.value }))}
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            rows={3}
                            className="w-full mt-1 px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                            placeholder="Brief overview of the course..."
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="feesDomestic">Domestic Fees (£)</Label>
                            <Input
                                id="feesDomestic"
                                type="number"
                                className="mt-1"
                                placeholder="e.g. 9250"
                                value={formData.feesDomestic ?? ""}
                                onChange={(e) => setFormData(prev => ({ ...prev, feesDomestic: e.target.value ? Number(e.target.value) : undefined }))}
                            />
                        </div>
                        <div>
                            <Label htmlFor="feesInternational">International Fees (£)</Label>
                            <Input
                                id="feesInternational"
                                type="number"
                                className="mt-1"
                                placeholder="e.g. 30000"
                                value={formData.feesInternational ?? ""}
                                onChange={(e) => setFormData(prev => ({ ...prev, feesInternational: e.target.value ? Number(e.target.value) : undefined }))}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="aLevelRequirements">A-Level Requirements</Label>
                            <Input
                                id="aLevelRequirements"
                                className="mt-1"
                                placeholder="e.g. AAA including Biology and Chemistry"
                                value={formData.aLevelRequirements}
                                onChange={(e) => setFormData(prev => ({ ...prev, aLevelRequirements: e.target.value }))}
                            />
                        </div>
                        <div>
                            <Label htmlFor="ibRequirements">IB Requirements</Label>
                            <Input
                                id="ibRequirements"
                                className="mt-1"
                                placeholder="e.g. 36 points with 666 at HL"
                                value={formData.ibRequirements}
                                onChange={(e) => setFormData(prev => ({ ...prev, ibRequirements: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="ucatRequirement">UCAT Requirement</Label>
                            <Input
                                id="ucatRequirement"
                                className="mt-1"
                                placeholder="e.g. Top 30% or 2600+"
                                value={formData.ucatRequirement}
                                onChange={(e) => setFormData(prev => ({ ...prev, ucatRequirement: e.target.value }))}
                            />
                        </div>
                        <div>
                            <Label htmlFor="interviewDetails">Interview Details</Label>
                            <Input
                                id="interviewDetails"
                                className="mt-1"
                                placeholder="e.g. MMI Format, typically December-March"
                                value={formData.interviewDetails}
                                onChange={(e) => setFormData(prev => ({ ...prev, interviewDetails: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="courseUrl">Course URL Link</Label>
                            <Input
                                id="courseUrl"
                                className="mt-1"
                                placeholder="e.g. https://www.kcl.ac.uk/study/undergraduate/courses/dentistry-bds"
                                value={formData.courseUrl}
                                onChange={(e) => setFormData(prev => ({ ...prev, courseUrl: e.target.value }))}
                            />
                        </div>
                        <div>
                            <Label htmlFor="applicationDeadline">Application Deadline</Label>
                            <Input
                                id="applicationDeadline"
                                type="date"
                                className="mt-1"
                                value={formData.applicationDeadline}
                                onChange={(e) => setFormData(prev => ({ ...prev, applicationDeadline: e.target.value }))}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 p-6 border-t border-gray-100">
                    <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                    <Button
                        onClick={() => createMutation.mutate()}
                        disabled={createMutation.isPending || !formData.universityHid || !formData.courseName}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                        {createMutation.isPending ? (
                            <><Loader2 className="h-4 w-4 animate-spin mr-2" />Creating...</>
                        ) : "Add Course"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
