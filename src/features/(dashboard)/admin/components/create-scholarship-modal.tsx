"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/src/connection/admin-service";
import { CreateScholarshipPayload } from "@/src/connection/api-types";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { toast } from "sonner";
import { X, Loader2 } from "lucide-react";

interface CreateScholarshipModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateScholarshipModal({ isOpen, onClose }: CreateScholarshipModalProps) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<CreateScholarshipPayload>({
        title: "",
        description: "",
        amountValue: 0,
        amountCurrency: "£",
        deadline: "",
        eligibilityCriteriaJson: "",
        applicationLink: "",
        isSponsored: false,
        targetDegreeLevel: "",
        targetLocation: ""
    });

    const createMutation = useMutation({
        mutationFn: () => adminService.createScholarship(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-scholarships"] });
            toast.success("Scholarship created successfully");
            onClose();
            setFormData({ 
                title: "", 
                description: "", 
                amountValue: 0, 
                amountCurrency: "£", 
                deadline: "", 
                eligibilityCriteriaJson: "", 
                applicationLink: "", 
                isSponsored: false, 
                targetDegreeLevel: "", 
                targetLocation: "" 
            });
        },
        onError: () => {
            toast.error("Failed to create scholarship");
        }
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Add New Scholarship</h2>
                    <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <Label htmlFor="title">Scholarship Title *</Label>
                        <Input
                            id="title"
                            className="mt-1"
                            placeholder="e.g. Global Excellence Dental Scholarship"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="amountValue">Amount Value *</Label>
                            <Input
                                id="amountValue"
                                type="number"
                                className="mt-1"
                                placeholder="e.g. 5000"
                                value={formData.amountValue || ""}
                                onChange={(e) => setFormData(prev => ({ ...prev, amountValue: Number(e.target.value) }))}
                            />
                        </div>
                        <div>
                            <Label htmlFor="amountCurrency">Currency</Label>
                            <select
                                id="amountCurrency"
                                className="w-full mt-1 h-10 px-3 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={formData.amountCurrency}
                                onChange={(e) => setFormData(prev => ({ ...prev, amountCurrency: e.target.value }))}
                            >
                                <option value="£">GBP (£)</option>
                                <option value="$">USD ($)</option>
                                <option value="€">EUR (€)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="targetDegreeLevel">Target Level</Label>
                            <Input
                                id="targetDegreeLevel"
                                className="mt-1"
                                placeholder="e.g. BDS, Masters"
                                value={formData.targetDegreeLevel}
                                onChange={(e) => setFormData(prev => ({ ...prev, targetDegreeLevel: e.target.value }))}
                            />
                        </div>
                        <div>
                            <Label htmlFor="targetLocation">Location</Label>
                            <Input
                                id="targetLocation"
                                className="mt-1"
                                placeholder="e.g. UK, Global"
                                value={formData.targetLocation}
                                onChange={(e) => setFormData(prev => ({ ...prev, targetLocation: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="deadline">Application Deadline</Label>
                        <Input
                            id="deadline"
                            type="date"
                            className="mt-1"
                            value={formData.deadline}
                            onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                        />
                    </div>

                    <div>
                        <Label htmlFor="applicationLink">Application Link (Direct University Link)</Label>
                        <Input
                            id="applicationLink"
                            className="mt-1"
                            placeholder="https://university.edu/scholarships/apply"
                            value={formData.applicationLink}
                            onChange={(e) => setFormData(prev => ({ ...prev, applicationLink: e.target.value }))}
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            rows={3}
                            className="w-full mt-1 px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                            placeholder="Brief overview of the scholarship..."
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isSponsored"
                            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                            checked={formData.isSponsored}
                            onChange={(e) => setFormData(prev => ({ ...prev, isSponsored: e.target.checked }))}
                        />
                        <Label htmlFor="isSponsored" className="cursor-pointer">Feature this scholarship (Sponsored)</Label>
                    </div>
                </div>

                <div className="flex gap-3 p-6 border-t border-gray-100">
                    <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                    <Button
                        onClick={() => createMutation.mutate()}
                        disabled={createMutation.isPending || !formData.title || !formData.amountValue}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                        {createMutation.isPending ? (
                            <><Loader2 className="h-4 w-4 animate-spin mr-2" />Creating...</>
                        ) : "Add Scholarship"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
