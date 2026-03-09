"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { adminService } from "@/src/connection/admin-service";
import { toast } from "sonner";
import { Loader2, GraduationCap, Globe, MapPin } from "lucide-react";

interface CreateUniversityModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateUniversityModal({ isOpen, onClose }: CreateUniversityModalProps) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        location: "",
        websiteUrl: "",
        logoUrl: "",
        ranking: 0,
        dentalSchoolPathway: "BDS"
    });

    const createMutation = useMutation({
        mutationFn: (payload: typeof formData) => adminService.createUniversity(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-universities"] });
            toast.success("University created successfully");
            onClose();
            setFormData({
                name: "",
                description: "",
                location: "",
                websiteUrl: "",
                logoUrl: "",
                ranking: 0,
                dentalSchoolPathway: "BDS"
            });
        },
        onError: (error: unknown) => {
            const errorData = error as { responseMessage?: string };
            toast.error(errorData?.responseMessage || "Failed to create university");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-indigo-600" />
                        Add New University
                    </DialogTitle>
                    <DialogDescription>
                        Register a new dental school or university on the platform.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto px-1">
                    <div className="space-y-2">
                        <Label htmlFor="u-name">University Name</Label>
                        <Input
                            id="u-name"
                            placeholder="Kings College London"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="u-location">Location</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="u-location"
                                    placeholder="London, UK"
                                    className="pl-10"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="u-pathway">Default Pathway</Label>
                            <Select
                                value={formData.dentalSchoolPathway}
                                onValueChange={(value) => setFormData({ ...formData, dentalSchoolPathway: value })}
                            >
                                <SelectTrigger id="u-pathway">
                                    <SelectValue placeholder="Select pathway" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="BDS">BDS Pathway</SelectItem>
                                    <SelectItem value="DENTAL_NURSING">Dental Nursing</SelectItem>
                                    <SelectItem value="DENTAL_HYGIENE">Dental Hygiene</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="u-website">Website URL</Label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                id="u-website"
                                type="url"
                                placeholder="https://www.example.edu"
                                className="pl-10"
                                value={formData.websiteUrl}
                                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="u-logo">Logo URL</Label>
                        <Input
                            id="u-logo"
                            type="url"
                            placeholder="https://example.com/logo.png"
                            value={formData.logoUrl}
                            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="u-ranking">Ranking (Optional)</Label>
                        <Input
                            id="u-ranking"
                            type="number"
                            placeholder="10"
                            value={formData.ranking || ""}
                            onChange={(e) => setFormData({ ...formData, ranking: parseInt(e.target.value) || 0 })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="u-desc">Description</Label>
                        <Textarea
                            id="u-desc"
                            placeholder="Provide a brief overview of the dental school..."
                            className="min-h-[100px]"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createMutation.isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            {createMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create University"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
