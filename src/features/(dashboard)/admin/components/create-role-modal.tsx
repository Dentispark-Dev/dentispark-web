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
import { PlatformPermissionData, PlatformRoleData } from "@/src/connection/api-types";
import { toast } from "sonner";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Loader2, Search } from "lucide-react";

interface CreateRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editRole?: PlatformRoleData | null;
}

export function CreateRoleModal({ isOpen, onClose, onSuccess, editRole }: CreateRoleModalProps) {
    const [permissions, setPermissions] = useState<PlatformPermissionData[]>([]);
    const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [formData, setFormData] = useState({
        roleName: "",
        description: "",
        permissionEnums: [] as string[]
    });

    const fetchPermissions = useCallback(async () => {
        if (permissions.length > 0) return;
        setIsLoadingPermissions(true);
        try {
            const response = await adminService.getPlatformPermissions();
            setPermissions(response);
        } catch {
            toast.error("Failed to load permissions");
        } finally {
            setIsLoadingPermissions(false);
        }
    }, [permissions.length]);

    useEffect(() => {
        if (isOpen) {
            fetchPermissions();
            if (editRole) {
                setFormData({
                    roleName: editRole.name,
                    description: editRole.description || "",
                    permissionEnums: [] // This should be fetched if editing, but our service currently expects the Guid
                });
                fetchRolePermissions(editRole.guid);
            } else {
                setFormData({
                    roleName: "",
                    description: "",
                    permissionEnums: []
                });
            }
        }
    }, [isOpen, editRole, fetchPermissions]);

    const fetchRolePermissions = async (guid: string) => {
        try {
            const response = await adminService.getRolePermissions(guid);
            setFormData(prev => ({
                ...prev,
                permissionEnums: response.permissions.map(p => p.name) // Permissions are identified by Enum Name in the payload
            }));
        } catch {
            console.error("Failed to fetch role permissions");
        }
    };

    const handlePermissionToggle = (permissionName: string) => {
        setFormData(prev => ({
            ...prev,
            permissionEnums: prev.permissionEnums.includes(permissionName)
                ? prev.permissionEnums.filter(p => p !== permissionName)
                : [...prev.permissionEnums, permissionName]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editRole) {
                await adminService.addRolePermissions({
                    roleGuid: editRole.guid,
                    permissionEnums: formData.permissionEnums
                });
                toast.success("Role permissions updated");
            } else {
                await adminService.createRoleWithPermissions(formData);
                toast.success("Role created successfully");
            }
            onSuccess();
            onClose();
        } catch {
            toast.error("Failed to save role");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredPermissions = permissions.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col p-0">
                <div className="p-6 pb-0">
                    <DialogHeader>
                        <DialogTitle>{editRole ? "Edit Role Permissions" : "Create New Role"}</DialogTitle>
                        <DialogDescription>
                            Define a role name and select the associated permissions.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="roleName">Role Name</Label>
                            <Input
                                id="roleName"
                                placeholder="e.g. Content Manager"
                                value={formData.roleName}
                                onChange={(e) => setFormData(p => ({ ...p, roleName: e.target.value }))}
                                required
                                disabled={!!editRole}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                placeholder="Brief description of this role's purpose"
                                value={formData.description}
                                onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                                disabled={!!editRole}
                            />
                        </div>

                        <div className="space-y-3">
                            <Label>Permissions</Label>
                            <div className="relative mb-2">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Filter permissions..."
                                    className="pl-10 h-9 text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="border rounded-lg divide-y bg-gray-50/30 max-h-[300px] overflow-y-auto">
                                {isLoadingPermissions ? (
                                    <div className="flex items-center justify-center p-8">
                                        <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
                                    </div>
                                ) : filteredPermissions.length === 0 ? (
                                    <p className="p-8 text-center text-sm text-gray-400">No permissions found.</p>
                                ) : (
                                    filteredPermissions.map((permission) => (
                                        <div key={permission.guid} className="flex items-start gap-3 p-3 hover:bg-white transition-colors">
                                            <Checkbox
                                                id={`perm-${permission.guid}`}
                                                className="mt-1"
                                                checked={formData.permissionEnums.includes(permission.name)}
                                                onCheckedChange={() => handlePermissionToggle(permission.name)}
                                            />
                                            <Label
                                                htmlFor={`perm-${permission.guid}`}
                                                className="text-sm font-normal cursor-pointer flex-1"
                                            >
                                                <span className="font-semibold text-gray-900">{permission.name}</span>
                                                <span className="block text-xs text-gray-500 mt-0.5">{permission.description}</span>
                                            </Label>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t bg-gray-50/50">
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-primary-600 hover:bg-primary-700 min-w-[120px]" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                {editRole ? "Update Permissions" : "Create Role"}
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
