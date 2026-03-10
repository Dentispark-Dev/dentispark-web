"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Loader2, Shield } from "lucide-react";

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

    const fetchRoles = useCallback(async () => {
        setIsLoadingRoles(true);
        try {
            const response = await adminService.getPlatformRoles();
            setRoles(response);
        } catch {
            toast.error("Failed to load roles");
        } finally {
            setIsLoadingRoles(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchRoles();
        }
    }, [isOpen, fetchRoles]);

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
        } catch {
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
                            <Label className="text-sm font-semibold text-gray-700">Assign Roles</Label>
                            <div className="grid grid-cols-1 gap-2 border border-gray-200 rounded-xl p-4 bg-gray-50/50 max-h-60 overflow-y-auto shadow-inner">
                                {isLoadingRoles ? (
                                    <div className="flex flex-col items-center justify-center p-8 gap-3">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
                                        <p className="text-xs text-gray-400 font-medium">Fetching available roles...</p>
                                    </div>
                                ) : roles.length === 0 ? (
                                    <div className="text-center p-6 space-y-2">
                                        <Shield className="h-8 w-8 text-gray-200 mx-auto" strokeWidth={1.5} />
                                        <p className="text-xs text-gray-500">No roles found in the system.</p>
                                        <p className="text-[10px] text-gray-400">Please create roles in the &quot;Roles&quot; tab first.</p>
                                    </div>
                                ) : (
                                    roles.map((role) => (
                                        <div
                                            key={role.guid}
                                            className="flex items-start space-x-3 p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-100 group"
                                        >
                                            <div className="pt-0.5">
                                                <Checkbox
                                                    id={`role-${role.guid}`}
                                                    checked={formData.roleGuids.includes(role.guid)}
                                                    onCheckedChange={() => handleRoleToggle(role.guid)}
                                                    className="border-gray-300 data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                                                />
                                            </div>
                                            <Label
                                                htmlFor={`role-${role.guid}`}
                                                className="text-sm font-medium text-gray-700 cursor-pointer flex-1 leading-tight"
                                            >
                                                {role.name}
                                                <span className="block text-[10px] text-gray-400 mt-1 font-normal group-hover:text-gray-500">{role.description || "No description provided"}</span>
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
