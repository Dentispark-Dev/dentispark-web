"use client";

import { useState, useEffect } from "react";
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
import { adminService } from "@/src/connection/admin-service";
import { PlatformRoleData } from "@/src/connection/api-types";
import { toast } from "sonner";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Loader2 } from "lucide-react";

interface InviteAdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function InviteAdminModal({ isOpen, onClose, onSuccess }: InviteAdminModalProps) {
    const [roles, setRoles] = useState<PlatformRoleData[]>([]);
    const [isLoadingRoles, setIsLoadingRoles] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        emailAddress: "",
        fullName: "",
        username: "",
        roleGuids: [] as string[]
    });

    useEffect(() => {
        if (isOpen) {
            fetchRoles();
        }
    }, [isOpen]);

    const fetchRoles = async () => {
        setIsLoadingRoles(true);
        try {
            const response = await adminService.getPlatformRoles();
            setRoles(response.responseData);
        } catch (error) {
            toast.error("Failed to load roles");
        } finally {
            setIsLoadingRoles(false);
        }
    };

    const handleRoleToggle = (guid: string) => {
        setFormData(prev => ({
            ...prev,
            roleGuids: prev.roleGuids.includes(guid)
                ? prev.roleGuids.filter(g => g !== guid)
                : [...prev.roleGuids, guid]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.roleGuids.length === 0) {
            toast.error("Please select at least one role");
            return;
        }

        setIsSubmitting(true);
        try {
            await adminService.inviteAdmin(formData);
            toast.success("Invitation sent successfully");
            onSuccess();
            onClose();
        } catch (error) {
            toast.error("Failed to send invitation");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Invite Admin User</DialogTitle>
                    <DialogDescription>
                        Send an invitation email to a new administrative user.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                placeholder="e.g. Samuel Tobins"
                                value={formData.fullName}
                                onChange={(e) => setFormData(p => ({ ...p, fullName: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                placeholder="e.g. samuel_admin"
                                value={formData.username}
                                onChange={(e) => setFormData(p => ({ ...p, username: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@dentispark.com"
                                value={formData.emailAddress}
                                onChange={(e) => setFormData(p => ({ ...p, emailAddress: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="grid gap-3">
                            <Label>Assign Roles</Label>
                            <div className="grid grid-cols-1 gap-2 border border-gray-100 rounded-lg p-3 bg-gray-50/50 max-h-40 overflow-y-auto">
                                {isLoadingRoles ? (
                                    <div className="flex items-center justify-center p-4">
                                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                    </div>
                                ) : (
                                    roles.map((role) => (
                                        <div key={role.guid} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`role-${role.guid}`}
                                                checked={formData.roleGuids.includes(role.guid)}
                                                onCheckedChange={() => handleRoleToggle(role.guid)}
                                            />
                                            <Label
                                                htmlFor={`role-${role.guid}`}
                                                className="text-sm font-normal cursor-pointer flex-1"
                                            >
                                                {role.name}
                                                <span className="block text-xs text-gray-400">{role.description}</span>
                                            </Label>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-primary-600 hover:bg-primary-700" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Send Invitation
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
