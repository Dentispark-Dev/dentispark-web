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
import { Loader2, Search, ShieldCheck, ShieldAlert, Sparkles, X, Fingerprint, Lock } from "lucide-react";
import { cn } from "@/src/lib/utils";

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
                    permissionEnums: [] 
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
                permissionEnums: response.permissions.map(p => p.name)
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
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-4 bg-white border-slate-100 rounded-[2.5rem] shadow-2xl overflow-hidden font-jakarta">
                
                {/* Header Section */}
                <div className="p-8 pb-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-32 w-32 bg-teal-50 rounded-bl-full opacity-40 -mr-8 -mt-8" />
                    <DialogHeader>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
                                <ShieldCheck className="h-7 w-7" />
                            </div>
                            <div className="text-left">
                                <DialogTitle className="text-3xl font-black text-slate-900 tracking-tight">
                                    {editRole ? "Modify Node" : "Deploy Architecture"}
                                </DialogTitle>
                                <DialogDescription className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.2em] mt-1">
                                    Configure Institutional Permissions & Access
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 overflow-y-auto px-8 py-2 space-y-8 custom-scrollbar">
                        
                        {/* Core Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="roleName" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Architectural Node Name</Label>
                                <div className="relative group">
                                    <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                                    <Input
                                        id="roleName"
                                        placeholder="e.g. Lead Moderator"
                                        className="pl-12 h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:bg-white focus:ring-teal-500/20 focus:border-teal-500 transition-all font-bold text-slate-600 shadow-sm"
                                        value={formData.roleName}
                                        onChange={(e) => setFormData(p => ({ ...p, roleName: e.target.value }))}
                                        required
                                        disabled={!!editRole}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Node Objective</Label>
                                <div className="relative group">
                                    <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                                    <Input
                                        id="description"
                                        placeholder="Define the purpose..."
                                        className="pl-12 h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:bg-white focus:ring-teal-500/20 focus:border-teal-500 transition-all font-bold text-slate-600 shadow-sm"
                                        value={formData.description}
                                        onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                                        disabled={!!editRole}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Permissions Registry */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Permission Registry</Label>
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                    formData.permissionEnums.length > 0 ? "bg-teal-50 text-teal-600" : "bg-slate-50 text-slate-400"
                                )}>
                                    {formData.permissionEnums.length} Selected
                                </span>
                            </div>
                            
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                                <Input
                                    placeholder="Filter system permissions..."
                                    className="pl-10 h-11 bg-slate-50/50 border-slate-100 rounded-xl focus:bg-white focus:ring-teal-500/10 focus:border-teal-500 transition-all font-bold text-xs"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="border border-slate-100 rounded-2xl divide-y divide-slate-50 bg-slate-50/20 max-h-[300px] overflow-y-auto custom-scrollbar shadow-inner">
                                {isLoadingPermissions ? (
                                    <div className="flex items-center justify-center p-12">
                                        <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
                                    </div>
                                ) : filteredPermissions.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <Lock className="h-10 w-10 text-slate-200 mx-auto mb-2" />
                                        <p className="text-sm font-bold text-slate-400">Zero permissions matching query.</p>
                                    </div>
                                ) : (
                                    filteredPermissions.map((permission) => (
                                        <div 
                                            key={permission.guid} 
                                            className={cn(
                                                "flex items-start gap-4 p-5 hover:bg-white transition-all cursor-pointer group/item",
                                                formData.permissionEnums.includes(permission.name) && "bg-teal-50/30"
                                            )}
                                            onClick={() => handlePermissionToggle(permission.name)}
                                        >
                                            <div className="pt-1">
                                                <Checkbox
                                                    id={`perm-${permission.guid}`}
                                                    checked={formData.permissionEnums.includes(permission.name)}
                                                    onCheckedChange={() => handlePermissionToggle(permission.name)}
                                                    className="h-5 w-5 rounded-md border-slate-200 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600 hover:border-teal-600 transition-colors"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <Label
                                                    htmlFor={`perm-${permission.guid}`}
                                                    className="text-sm font-black text-slate-900 cursor-pointer group-hover/item:text-teal-600 transition-colors"
                                                >
                                                    {permission.name}
                                                </Label>
                                                <p className="text-[11px] font-bold text-slate-400 leading-tight">
                                                    {permission.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="p-8 pt-6 mt-4 border-t border-slate-50 bg-slate-50/30">
                        <DialogFooter className="flex flex-col sm:flex-row gap-4">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={onClose} 
                                disabled={isSubmitting}
                                className="h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-white transition-all"
                            >
                                Abort Operation
                            </Button>
                            <Button 
                                type="submit" 
                                className="bg-slate-900 hover:bg-black text-white h-14 px-10 rounded-2xl shadow-xl shadow-slate-900/10 gap-3 font-black text-xs uppercase tracking-widest active:scale-95 transition-all min-w-[180px]" 
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
                                {editRole ? "Finalize Node" : "Deploy Node"}
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
