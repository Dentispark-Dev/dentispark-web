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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { adminService } from "@/src/connection/admin-service";
import { toast } from "sonner";
import { Loader2, Mail, User } from "lucide-react";

interface InviteStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function InviteStudentModal({ isOpen, onClose }: InviteStudentModalProps) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        emailAddress: "",
        platformMemberCategory: "BDS"
    });

    const inviteMutation = useMutation({
        mutationFn: (payload: typeof formData) => adminService.inviteStudent(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-students"] });
            toast.success("Student invitation sent successfully");
            onClose();
            setFormData({
                firstName: "",
                lastName: "",
                emailAddress: "",
                platformMemberCategory: "BDS"
            });
        },
        onError: (error: unknown) => {
            const errorData = error as { responseMessage?: string };
            toast.error(errorData?.responseMessage || "Failed to send invitation");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        inviteMutation.mutate(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary-600" />
                        Invite Student
                    </DialogTitle>
                    <DialogDescription>
                        Send an invitation to a new student. They will receive an email to complete their profile.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                placeholder="John"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="john.doe@example.com"
                                className="pl-10"
                                value={formData.emailAddress}
                                onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                            value={formData.platformMemberCategory}
                            onValueChange={(value) => setFormData({ ...formData, platformMemberCategory: value })}
                        >
                            <SelectTrigger id="category">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BDS">BDS Student</SelectItem>
                                <SelectItem value="DENTAL_NURSING">Dental Nursing</SelectItem>
                                <SelectItem value="DENTAL_HYGIENE">Dental Hygiene</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={inviteMutation.isPending} className="bg-primary-600 hover:bg-primary-700">
                            {inviteMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Send Invitation"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
