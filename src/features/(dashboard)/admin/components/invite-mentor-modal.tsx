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
import { Loader2, Mail, UserCheck, Sparkles, Fingerprint, GraduationCap, ShieldCheck, UserPlus, Award } from "lucide-react";
import { cn } from "@/src/lib/utils";

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
        platformMemberCategory: "BDS"
    });

    const inviteMutation = useMutation({
        mutationFn: (payload: typeof formData) => adminService.inviteMentor(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-mentors"] });
            toast.success("Expert invitation dispatched");
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
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] flex flex-col p-4 bg-white border-slate-100 rounded-[2.5rem] shadow-2xl overflow-hidden font-jakarta">
                
                {/* Header Section */}
                <div className="p-8 pb-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-32 w-32 bg-secondary-50 rounded-bl-full opacity-40 -mr-8 -mt-8" />
                    <DialogHeader>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
                                <Award className="h-7 w-7" />
                            </div>
                            <div className="text-left">
                                <DialogTitle className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                    Invite <span className="text-secondary-600">Mentor</span>
                                </DialogTitle>
                                <DialogDescription className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.2em] mt-1">
                                    Onboard a professional expert to the mentorship network
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
                                <Label htmlFor="m-firstName" className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1">Given Name</Label>
                                <div className="relative group">
                                    <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-secondary-600 transition-colors" />
                                    <Input
                                        id="m-firstName"
                                        placeholder="Jane"
                                        className="pl-12 h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:bg-white focus:ring-secondary-500/20 focus:border-secondary-500 transition-all font-bold text-slate-600 shadow-sm"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="m-lastName" className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1">Family Name</Label>
                                <div className="relative group">
                                    <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-secondary-600 transition-colors" />
                                    <Input
                                        id="m-lastName"
                                        placeholder="Smith"
                                        className="pl-12 h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:bg-white focus:ring-secondary-500/20 focus:border-secondary-500 transition-all font-bold text-slate-600 shadow-sm"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Network Endpoint */}
                        <div className="space-y-2">
                            <Label htmlFor="m-email" className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1">Professional Email</Label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-secondary-600 transition-colors" />
                                <Input
                                    id="m-email"
                                    type="email"
                                    placeholder="jane.smith@dentispark.com"
                                    className="pl-12 h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:bg-white focus:ring-secondary-500/20 focus:border-secondary-500 transition-all font-bold text-slate-600 shadow-sm"
                                    value={formData.emailAddress}
                                    onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Domain Specialization */}
                        <div className="space-y-2">
                            <Label htmlFor="m-category" className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1">Domain Expertise</Label>
                            <div className="relative group">
                                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-secondary-600 transition-colors z-10" />
                                <Select
                                    value={formData.platformMemberCategory}
                                    onValueChange={(value) => setFormData({ ...formData, platformMemberCategory: value })}
                                >
                                    <SelectTrigger id="m-category" className="pl-12 h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:ring-secondary-500/20 focus:border-secondary-500 transition-all font-bold text-slate-600 shadow-sm">
                                        <SelectValue placeholder="Select expertise" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-2 font-jakarta">
                                        <SelectItem value="BDS" className="rounded-xl font-bold py-3 text-secondary-600">General Dentistry (BDS)</SelectItem>
                                        <SelectItem value="DENTAL_NURSING" className="rounded-xl font-bold py-3 text-secondary-600">Nursing Operations</SelectItem>
                                        <SelectItem value="DENTAL_HYGIENE" className="rounded-xl font-bold py-3 text-secondary-600">Hygiene Specialist</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 pt-6 mt-4 border-t border-slate-50 bg-slate-50/30">
                        <DialogFooter className="flex flex-col sm:flex-row gap-4">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={onClose} 
                                disabled={inviteMutation.isPending}
                                className="h-14 px-8 rounded-2xl font-extrabold text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all"
                            >
                                Terminate
                            </Button>
                            <Button 
                                type="submit" 
                                className="bg-slate-900 hover:bg-black text-white h-14 px-10 rounded-2xl shadow-xl shadow-slate-900/10 gap-3 font-extrabold text-xs uppercase tracking-widest active:scale-95 transition-all min-w-[200px]" 
                                disabled={inviteMutation.isPending}
                            >
                                {inviteMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
                                Authorize Expert
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
