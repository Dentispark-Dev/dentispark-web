"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/src/connection/admin-service";
import { CreateResourcePayload } from "@/src/connection/api-types";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { toast } from "sonner";
import { X, Loader2 } from "lucide-react";

interface CreateResourceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateResourceModal({ isOpen, onClose }: CreateResourceModalProps) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<CreateResourcePayload>({
        title: "",
        body: "",
        images: "",
        imageCaption: "",
        dentalSchoolPathWay: "",
        authorName: "",
        academicYear: ""
    });

    const createMutation = useMutation({
        mutationFn: () => adminService.createResource(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-resources"] });
            toast.success("Resource created successfully");
            onClose();
            setFormData({ title: "", body: "", images: "", imageCaption: "", dentalSchoolPathWay: "", authorName: "", academicYear: "" });
        },
        onError: () => {
            toast.error("Failed to create resource");
        }
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Add New Resource</h2>
                    <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            className="mt-1"
                            placeholder="Resource title"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        />
                    </div>

                    <div>
                        <Label htmlFor="body">Content *</Label>
                        <textarea
                            id="body"
                            rows={5}
                            className="w-full mt-1 px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                            placeholder="Resource content / body text..."
                            value={formData.body}
                            onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="authorName">Author Name</Label>
                            <Input
                                id="authorName"
                                className="mt-1"
                                placeholder="e.g. Dr. Smith"
                                value={formData.authorName}
                                onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                            />
                        </div>
                        <div>
                            <Label htmlFor="academicYear">Academic Year</Label>
                            <Input
                                id="academicYear"
                                className="mt-1"
                                placeholder="e.g. Year 1"
                                value={formData.academicYear}
                                onChange={(e) => setFormData(prev => ({ ...prev, academicYear: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="pathway">Dental School Pathway</Label>
                        <select
                            id="pathway"
                            className="w-full mt-1 h-10 px-3 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={formData.dentalSchoolPathWay}
                            onChange={(e) => setFormData(prev => ({ ...prev, dentalSchoolPathWay: e.target.value }))}
                        >
                            <option value="">Select pathway</option>
                            <option value="BDS">BDS</option>
                            <option value="NURSING">Nursing</option>
                            <option value="HYGIENE_THERAPY">Hygiene Therapy</option>
                            <option value="GENERAL">General</option>
                        </select>
                    </div>

                    <div>
                        <Label htmlFor="images">Image URL (optional)</Label>
                        <Input
                            id="images"
                            className="mt-1"
                            placeholder="https://example.com/image.jpg"
                            value={formData.images}
                            onChange={(e) => setFormData(prev => ({ ...prev, images: e.target.value }))}
                        />
                    </div>

                    {formData.images && (
                        <div>
                            <Label htmlFor="imageCaption">Image Caption</Label>
                            <Input
                                id="imageCaption"
                                className="mt-1"
                                placeholder="Image caption"
                                value={formData.imageCaption}
                                onChange={(e) => setFormData(prev => ({ ...prev, imageCaption: e.target.value }))}
                            />
                        </div>
                    )}
                </div>

                <div className="flex gap-3 p-6 border-t border-gray-100">
                    <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                    <Button
                        onClick={() => createMutation.mutate()}
                        disabled={createMutation.isPending || !formData.title || !formData.body}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                        {createMutation.isPending ? (
                            <><Loader2 className="h-4 w-4 animate-spin mr-2" />Creating...</>
                        ) : "Add Resource"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
