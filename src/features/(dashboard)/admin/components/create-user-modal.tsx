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
import { AdminCreateUserPayload } from "@/src/connection/api-types";
import { toast } from "sonner";
import { Loader2, Mail, User, UserPlus, Sparkles, Fingerprint, GraduationCap, ShieldCheck, Lock } from "lucide-react";

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<AdminCreateUserPayload>({
        firstName: "",
        lastName: "",
        emailAddress: "",
        password: "password123",
        sid: "",
        memberType: "STUDENT",
        platformMemberCategory: "BDS"
    });

    const [isSidAvailable, setIsSidAvailable] = useState<boolean | null>(null);
    const [isCheckingSid, setIsCheckingSid] = useState(false);

    const checkSidAvailability = async (value: string) => {
        if (!value) {
            setIsSidAvailable(null);
            return;
        }
        if (!/^[a-zA-Z0-9-]+$/.test(value)) {
            setIsSidAvailable(false);
            return;
        }
        setIsCheckingSid(true);
        try {
            const res = await fetch(`/api/admin/users/sid?sid=${encodeURIComponent(value)}`);
            const data = await res.json();
            setIsSidAvailable(data.available);
        } catch (e) {
            console.error("Failed to check SID availability", e);
        } finally {
            setIsCheckingSid(false);
        }
    };

    const createMutation = useMutation({
        mutationFn: (payload: AdminCreateUserPayload) => adminService.createUserAdmin(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-students"] });
            queryClient.invalidateQueries({ queryKey: ["admin-mentors"] });
            queryClient.invalidateQueries({ queryKey: ["admin-admins"] });
            toast.success("User created successfully");
            onClose();
            setFormData({
                firstName: "",
                lastName: "",
                emailAddress: "",
                password: "password123",
                memberType: "STUDENT",
                platformMemberCategory: "BDS"
            });
        },
        onError: (error: any) => {
            toast.error(error?.responseMessage || "Failed to create user");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] flex flex-col p-0 bg-white border-none rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.1)] overflow-hidden font-jakarta">
                
                <div className="p-8 pb-4 relative overflow-hidden bg-slate-50/50">
                    <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-50 rounded-bl-full opacity-40 -mr-8 -mt-8" />
                    <DialogHeader>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                                <UserPlus className="h-7 w-7" />
                            </div>
                            <div className="text-left">
                                <DialogTitle className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                    Create <span className="text-indigo-600">User</span>
                                </DialogTitle>
                                <DialogDescription className="text-slate-400 font-extrabold text-[10px] uppercase tracking-[0.2em] mt-1">
                                    Administrative Onboarding Hub
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 custom-scrollbar">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1">First Name</Label>
                                <Input
                                    placeholder="John"
                                    className="h-12 bg-slate-50/80 border-slate-100 rounded-xl focus:bg-white transition-all font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500/20"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1">Last Name</Label>
                                <Input
                                    placeholder="Doe"
                                    className="h-12 bg-slate-50/80 border-slate-100 rounded-xl focus:bg-white transition-all font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500/20"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1">Email Address</Label>
                                <Input
                                    type="email"
                                    placeholder="john.doe@example.com"
                                    className="h-12 bg-slate-50/80 border-slate-100 rounded-xl focus:bg-white transition-all font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500/20"
                                    value={formData.emailAddress}
                                    onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1">Used ID (Optional)</Label>
                                <div className="relative">
                                    <Input
                                        placeholder="Dr-Julius-Babayemi"
                                        className="h-12 bg-slate-50/80 border-slate-100 rounded-xl focus:bg-white transition-all font-bold text-slate-600 pr-10 focus:ring-2 focus:ring-indigo-500/20"
                                        value={formData.sid}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\s+/g, '-');
                                            setFormData({ ...formData, sid: val });
                                            checkSidAvailability(val);
                                        }}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {isCheckingSid ? (
                                            <Loader2 className="h-4 w-4 animate-spin text-slate-300" />
                                        ) : isSidAvailable === true ? (
                                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                        ) : isSidAvailable === false ? (
                                            <Fingerprint className="h-4 w-4 text-rose-500" />
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1">Role / Member Type</Label>
                                <Select
                                    value={formData.memberType}
                                    onValueChange={(value: any) => setFormData({ ...formData, memberType: value })}
                                >
                                    <SelectTrigger className="h-12 bg-slate-50/80 border-slate-100 rounded-xl font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500/20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl font-jakarta">
                                        <SelectItem value="STUDENT" className="font-bold">Student</SelectItem>
                                        <SelectItem value="ACADEMIC_MENTOR" className="font-bold">Mentor</SelectItem>
                                        <SelectItem value="PLATFORM_ADMIN" className="font-bold">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1">Password</Label>
                                <div className="relative">
                                    <Input
                                        type="text"
                                        className="h-12 bg-slate-50/80 border-slate-100 rounded-xl focus:bg-white transition-all font-bold text-slate-600 pr-10 focus:ring-2 focus:ring-indigo-500/20"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                </div>
                            </div>
                        </div>

                        {(formData.memberType === "STUDENT" || formData.memberType === "ACADEMIC_MENTOR") && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <Label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1">Pathway / Category</Label>
                                <Select
                                    value={formData.platformMemberCategory}
                                    onValueChange={(value) => setFormData({ ...formData, platformMemberCategory: value })}
                                >
                                    <SelectTrigger className="h-12 bg-slate-50/80 border-slate-100 rounded-xl font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500/20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl font-jakarta">
                                        <SelectItem value="BDS" className="font-bold">BDS Academic Track</SelectItem>
                                        <SelectItem value="DENTAL_NURSING" className="font-bold">Dental Nursing</SelectItem>
                                        <SelectItem value="DENTAL_HYGIENE" className="font-bold">Dental Hygiene</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <div className="p-8 bg-slate-50/50 border-t border-slate-100">
                        <DialogFooter className="flex flex-col sm:flex-row gap-4">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={onClose} 
                                className="h-12 px-8 rounded-xl font-extrabold text-[10px] uppercase tracking-widest text-slate-400 hover:bg-white"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                className="bg-indigo-600 hover:bg-indigo-700 text-white h-12 px-10 rounded-xl shadow-xl shadow-indigo-900/10 gap-3 font-extrabold text-[10px] uppercase tracking-widest transition-all min-w-[200px]" 
                                disabled={createMutation.isPending || isSidAvailable === false}
                            >
                                {createMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
                                Create User
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
