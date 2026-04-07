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
import { Loader2, Shield, UserPlus, Mail, Fingerprint, ShieldCheck, Sparkles, X, Key } from "lucide-react";
import { cn } from "@/src/lib/utils";

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
            setFormData({
                emailAddress: "",
                fullName: "",
                username: "",
                roleGuids: []
            });
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
            toast.success("Identity authorization sent");
            onSuccess();
            onClose();
        } catch {
            toast.error("Failed to authorize new identity");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-4 bg-white border-slate-100 rounded-[2.5rem] shadow-2xl overflow-hidden font-jakarta">
                
                {/* Header Section */}
                <div className="p-8 pb-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-32 w-32 bg-teal-50 rounded-bl-full opacity-40 -mr-8 -mt-8" />
                    <DialogHeader>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
                                <UserPlus className="h-7 w-7" />
                            </div>
                            <div className="text-left">
                                <DialogTitle className="text-3xl font-black text-slate-900 tracking-tight">
                                    Authorize <span className="text-teal-600">Architect</span>
                                </DialogTitle>
                                <DialogDescription className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.2em] mt-1">
                                    Deploy an Administrative Invitation to the Network
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 overflow-y-auto px-8 py-2 space-y-8 custom-scrollbar">
                        
                        {/* Core Details */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Identity Name</Label>
                                    <div className="relative group">
                                        <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                                        <Input
                                            id="fullName"
                                            placeholder="Samuel Tobins"
                                            className="pl-12 h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:bg-white focus:ring-teal-500/20 focus:border-teal-500 transition-all font-bold text-slate-600 shadow-sm"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData(p => ({ ...p, fullName: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="username" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">System Handle</Label>
                                    <div className="relative group">
                                        <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                                        <Input
                                            id="username"
                                            placeholder="samuel_admin"
                                            className="pl-12 h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:bg-white focus:ring-teal-500/20 focus:border-teal-500 transition-all font-bold text-slate-600 shadow-sm"
                                            value={formData.username}
                                            onChange={(e) => setFormData(p => ({ ...p, username: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Network Endpoint (Email)</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@dentispark.com"
                                        className="pl-12 h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:bg-white focus:ring-teal-500/20 focus:border-teal-500 transition-all font-bold text-slate-600 shadow-sm"
                                        value={formData.emailAddress}
                                        onChange={(e) => setFormData(p => ({ ...p, emailAddress: e.target.value }))}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Role Assignment */}
                        <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Clearance Protocol Assignment</Label>
                            <div className="grid grid-cols-1 gap-3 border border-slate-100 rounded-3xl p-5 bg-slate-50/20 max-h-60 overflow-y-auto custom-scrollbar shadow-inner">
                                {isLoadingRoles ? (
                                    <div className="flex flex-col items-center justify-center p-8 gap-3">
                                        <Loader2 className="h-6 w-6 animate-spin text-teal-500" />
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Scanning Roles...</p>
                                    </div>
                                ) : roles.length === 0 ? (
                                    <div className="text-center p-8 space-y-3">
                                        <Shield className="h-10 w-10 text-slate-200 mx-auto" />
                                        <p className="text-xs font-bold text-slate-400">Zero clearance protocols defined in the registry.</p>
                                    </div>
                                ) : (
                                    roles.map((role) => (
                                        <div
                                            key={role.guid}
                                            className={cn(
                                                "flex items-start space-x-4 p-4 rounded-2xl border border-transparent transition-all group/item cursor-pointer",
                                                formData.roleGuids.includes(role.guid) 
                                                    ? "bg-white border-teal-100 shadow-xl shadow-teal-500/5 ring-1 ring-teal-500/10" 
                                                    : "hover:bg-white/60 hover:border-slate-200"
                                            )}
                                            onClick={() => handleRoleToggle(role.guid)}
                                        >
                                            <div className="pt-0.5">
                                                <Checkbox
                                                    id={`role-${role.guid}`}
                                                    checked={formData.roleGuids.includes(role.guid)}
                                                    onCheckedChange={() => handleRoleToggle(role.guid)}
                                                    className="h-5 w-5 rounded-md border-slate-200 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <Label
                                                    htmlFor={`role-${role.guid}`}
                                                    className="text-sm font-black text-slate-900 cursor-pointer group-hover/item:text-teal-600 transition-colors"
                                                >
                                                    {role.name}
                                                </Label>
                                                <p className="text-[11px] font-bold text-slate-400 leading-tight">
                                                    {role.description || "Operational objective undefined."}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 pt-6 mt-4 border-t border-slate-50 bg-slate-50/30">
                        <DialogFooter className="flex flex-col sm:flex-row gap-4">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={onClose} 
                                disabled={isSubmitting}
                                className="h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all"
                            >
                                Cancel Deployment
                            </Button>
                            <Button 
                                type="submit" 
                                className="bg-slate-900 hover:bg-black text-white h-14 px-10 rounded-2xl shadow-xl shadow-slate-900/10 gap-3 font-black text-xs uppercase tracking-widest active:scale-95 transition-all min-w-[200px]" 
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Key className="h-5 w-5" />}
                                Authorize Entity
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
