"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/src/connection/admin-service";
import { useState } from "react";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { 
    Package, 
    Plus, 
    DollarSign, 
    Clock, 
    User, 
    CheckCircle2,
    LayoutGrid,
    Tag,
    ChevronRight,
    ListChecks
} from "lucide-react";
import { toast } from "sonner";

interface CreateServicePackageModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateServicePackageModal({ isOpen, onClose }: CreateServicePackageModalProps) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        currency: "USD",
        durationMinutes: "",
        featuresJson: "[]",
        serviceType: "Mentoring",
        isActive: true,
        mentorEmail: ""
    });

    const [features, setFeatures] = useState<string[]>([]);
    const [newFeature, setNewFeature] = useState("");

    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: () => adminService.createServicePackageAdmin(formData.mentorEmail, {
            ...formData,
            price: parseFloat(formData.price),
            durationMinutes: parseInt(formData.durationMinutes),
            featuresJson: JSON.stringify(features)
        }),
        onSuccess: () => {
            toast.success("Service package created successfully!");
            queryClient.invalidateQueries({ queryKey: ["admin-packages"] });
            onClose();
            resetForm();
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to create service package");
        }
    });

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            price: "",
            currency: "USD",
            durationMinutes: "",
            featuresJson: "[]",
            serviceType: "Mentoring",
            isActive: true,
            mentorEmail: ""
        });
        setFeatures([]);
    };

    const addFeature = () => {
        if (newFeature.trim()) {
            setFeatures([...features, newFeature.trim()]);
            setNewFeature("");
        }
    };

    const removeFeature = (index: number) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[650px] border-none shadow-2xl rounded-3xl overflow-hidden p-0 max-h-[90vh] flex flex-col">
                <div className="bg-gradient-to-br from-green-600 to-green-800 p-8 text-white relative shrink-0">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Package className="h-24 w-24" />
                    </div>
                    <DialogHeader className="relative z-10">
                        <DialogTitle className="text-2xl font-black flex items-center gap-2 text-white">
                            <Plus className="h-7 w-7" />
                            New Service Package
                        </DialogTitle>
                        <DialogDescription className="text-green-100 font-medium opacity-90">
                            Create a specialized service that mentors can offer to students.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div className="space-y-4 md:col-span-2">
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1.5">
                                    <User className="h-3 w-3" />
                                    Mentor Email Address
                                </label>
                                <Input 
                                    placeholder="mentor@dentispark.com"
                                    value={formData.mentorEmail}
                                    onChange={(e) => setFormData({...formData, mentorEmail: e.target.value})}
                                    className="h-12 rounded-xl border-gray-200 focus:ring-green-500 font-medium"
                                />
                                <p className="text-[10px] text-gray-400 font-bold italic">Which mentor will provide this service?</p>
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1.5">
                                <LayoutGrid className="h-3 w-3" />
                                Service Title
                            </label>
                            <Input 
                                placeholder="e.g. Premium Mock Interview Session"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="h-12 rounded-xl border-gray-200 focus:ring-green-500 font-bold"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1.5">
                                <DollarSign className="h-3 w-3" />
                                Price (USD)
                            </label>
                            <Input 
                                type="number"
                                placeholder="99.00"
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                                className="h-12 rounded-xl border-gray-200 focus:ring-green-500 font-bold"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1.5">
                                <Clock className="h-3 w-3" />
                                Duration (Minutes)
                            </label>
                            <Input 
                                type="number"
                                placeholder="60"
                                value={formData.durationMinutes}
                                onChange={(e) => setFormData({...formData, durationMinutes: e.target.value})}
                                className="h-12 rounded-xl border-gray-200 focus:ring-green-500 font-bold"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1.5">
                                <Tag className="h-3 w-3" />
                                Service Type
                            </label>
                            <Input 
                                placeholder="e.g. Interview Prep, Resume Review"
                                value={formData.serviceType}
                                onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                                className="h-12 rounded-xl border-gray-200 focus:ring-green-500 font-medium"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1.5">
                                <Plus className="h-3 w-3" />
                                Description
                            </label>
                            <Textarea 
                                placeholder="Describe the service details..."
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="rounded-xl border-gray-200 focus:ring-green-500 font-medium min-h-[80px]"
                            />
                        </div>

                        {/* Features List */}
                        <div className="space-y-4 md:col-span-2">
                            <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1.5">
                                <ListChecks className="h-3 w-3" />
                                Key Features / Includes
                            </label>
                            <div className="flex gap-2">
                                <Input 
                                    placeholder="Add a feature..."
                                    value={newFeature}
                                    onChange={(e) => setNewFeature(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                                    className="h-12 rounded-xl border-gray-200 focus:ring-green-500 font-medium"
                                />
                                <Button 
                                    type="button"
                                    onClick={addFeature}
                                    className="h-12 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-bold"
                                >
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 border border-green-100 rounded-lg text-xs font-bold">
                                        {feature}
                                        <button onClick={() => removeFeature(idx)} className="text-green-300 hover:text-green-600 font-black">×</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between md:col-span-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="space-y-0.5">
                                <h4 className="text-sm font-bold text-gray-900">Active Status</h4>
                                <p className="text-xs text-gray-500">Should this service be visible to students?</p>
                            </div>
                            <Button
                                type="button"
                                variant={formData.isActive ? "default" : "outline"}
                                onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                                className={`rounded-xl font-black text-xs h-10 px-6 ${formData.isActive ? "bg-green-600 hover:bg-green-700" : "bg-white text-gray-400 border-gray-200"}`}
                            >
                                {formData.isActive ? "ACTIVE" : "INACTIVE"}
                            </Button>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-8 bg-gray-50/50 border-t border-gray-100 flex gap-3 sm:justify-end shrink-0">
                    <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold h-12 px-6">
                        Cancel
                    </Button>
                    <Button 
                        onClick={() => createMutation.mutate()}
                        disabled={!formData.title || !formData.price || !formData.mentorEmail || createMutation.isPending}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-black h-12 px-8 shadow-lg shadow-green-200 flex items-center gap-2"
                    >
                        {createMutation.isPending ? "Creating..." : "Create Service"}
                        {!createMutation.isPending && <ChevronRight className="h-4 w-4" />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
