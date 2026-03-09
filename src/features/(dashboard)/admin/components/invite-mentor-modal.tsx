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
import { Loader2, Mail, UserCheck } from "lucide-react";

interface InviteMentorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function InviteMentorModal({ isOpen, onClose }: InviteMentorModalProps) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        emailAddress: "",
        platformMemberCategory: "BDS" // Mentors also use these categories for specialization
    });

    const inviteMutation = useMutation({
        mutationFn: (payload: typeof formData) => adminService.inviteMentor(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-mentors"] });
            toast.success("Mentor invitation sent successfully");
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
                        <UserCheck className="h-5 w-5 text-secondary-600" />
                        Invite Mentor
                    </DialogTitle>
                    <DialogDescription>
                        Invite a new mentor to the platform. They will be notified to join and provide their expertise.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="m-firstName">First Name</Label>
                            <Input
                                id="m-firstName"
                                placeholder="Jane"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="m-lastName">Last Name</Label>
                            <Input
                                id="m-lastName"
                                placeholder="Smith"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="m-email">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                id="m-email"
                                type="email"
                                placeholder="jane.smith@example.com"
                                className="pl-10"
                                value={formData.emailAddress}
                                onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="m-category">Specialization</Label>
                        <Select
                            value={formData.platformMemberCategory}
                            onValueChange={(value) => setFormData({ ...formData, platformMemberCategory: value })}
                        >
                            <SelectTrigger id="m-category">
                                <SelectValue placeholder="Select specialization" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BDS">General Dentistry (BDS)</SelectItem>
                                <SelectItem value="DENTAL_NURSING">Dental Nursing</SelectItem>
                                <SelectItem value="DENTAL_HYGIENE">Dental Hygiene</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={inviteMutation.isPending} className="bg-secondary-600 hover:bg-secondary-700 text-white">
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
