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
        memberType: "STUDENT",
        platformMemberCategory: "BDS"
    });

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
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] flex flex-col p-4 bg-white border-slate-100 rounded-[2.5rem] shadow-2xl overflow-hidden font-jakarta">
                
                <div className="p-8 pb-4 relative overflow-hidden">
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
                                <DialogDescription className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.2em] mt-1">
                                    Directly Onboard Admin, Mentor or Student
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 overflow-y-auto px-8 py-2 space-y-6 custom-scrollbar">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1">First Name</Label>
                                <Input
                                    placeholder="John"
                                    className="h-12 bg-slate-50/50 border-slate-100 rounded-xl focus:bg-white transition-all font-bold text-slate-600"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1">Last Name</Label>
                                <Input
                                    placeholder="Doe"
                                    className="h-12 bg-slate-50/50 border-slate-100 rounded-xl focus:bg-white transition-all font-bold text-slate-600"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1">Email Address</Label>
                            <Input
                                type="email"
                                placeholder="john.doe@example.com"
                                className="h-12 bg-slate-50/50 border-slate-100 rounded-xl focus:bg-white transition-all font-bold text-slate-600"
                                value={formData.emailAddress}
                                onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1">Role / Member Type</Label>
                                <Select
                                    value={formData.memberType}
                                    onValueChange={(value: any) => setFormData({ ...formData, memberType: value })}
                                >
                                    <SelectTrigger className="h-12 bg-slate-50/50 border-slate-100 rounded-xl font-bold text-slate-600">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl font-jakarta">
                                        <SelectItem value="STUDENT" className="font-bold">Student</SelectItem>
                                        <SelectItem value="ACADEMIC_MENTOR" className="font-bold">Mentor</SelectItem>
                                        <SelectItem value="PLATFORM_ADMIN" className="font-bold">Admin</SelectItem>
                                        <SelectItem value="MODERATOR" className="font-bold">Moderator</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1">Password</Label>
                                <div className="relative">
                                    <Input
                                        type="text"
                                        className="h-12 bg-slate-50/50 border-slate-100 rounded-xl focus:bg-white transition-all font-bold text-slate-600 pr-10"
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
                                    <SelectTrigger className="h-12 bg-slate-50/50 border-slate-100 rounded-xl font-bold text-slate-600">
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

                    <div className="p-8 pt-6 mt-4 border-t border-slate-50 bg-slate-50/30">
                        <DialogFooter className="flex flex-col sm:flex-row gap-4">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={onClose} 
                                className="h-12 px-8 rounded-xl font-extrabold text-xs uppercase tracking-widest text-slate-400"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                className="bg-indigo-600 hover:bg-indigo-700 text-white h-12 px-10 rounded-xl shadow-xl shadow-indigo-900/10 gap-3 font-extrabold text-xs uppercase tracking-widest transition-all min-w-[200px]" 
                                disabled={createMutation.isPending}
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
