"use client";

import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { Loader2, Fingerprint, CheckCircle2, XCircle } from "lucide-react";

interface EditSidModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    currentSid: string;
    userName: string;
}

export function EditSidModal({ isOpen, onClose, userId, currentSid, userName }: EditSidModalProps) {
    const queryClient = useQueryClient();
    const [sid, setSid] = useState(currentSid);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        setSid(currentSid);
        setIsAvailable(null);
    }, [currentSid, isOpen]);

    const checkAvailability = async (value: string) => {
        if (!value || value === currentSid) {
            setIsAvailable(null);
            return;
        }
        
        // Basic format check
        if (!/^[a-zA-Z0-9-]+$/.test(value)) {
            setIsAvailable(false);
            return;
        }

        setIsChecking(true);
        try {
            const res = await fetch(`/api/admin/users/sid?sid=${encodeURIComponent(value)}`);
            const data = await res.json();
            setIsAvailable(data.available);
        } catch (e) {
            console.error("Failed to check SID availability", e);
        } finally {
            setIsChecking(false);
        }
    };

    const updateMutation = useMutation({
        mutationFn: async (newSid: string) => {
            const res = await fetch(`/api/admin/users/${userId}/sid`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sid: newSid }),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to update ID");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-students"] });
            queryClient.invalidateQueries({ queryKey: ["admin-mentors"] });
            toast.success("System ID updated successfully");
            onClose();
        },
        onError: (error: any) => {
            toast.error(error.message);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (sid === currentSid) {
            onClose();
            return;
        }
        updateMutation.mutate(sid);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] p-0 bg-white border-none rounded-[2rem] shadow-2xl overflow-hidden font-jakarta">
                <div className="p-8 pb-4">
                    <DialogHeader>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                                <Fingerprint className="h-7 w-7" />
                            </div>
                            <div className="text-left">
                                <DialogTitle className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                    Edit <span className="text-indigo-600">ID</span>
                                </DialogTitle>
                                <DialogDescription className="text-slate-400 font-extrabold text-[10px] uppercase tracking-[0.2em] mt-1">
                                    Customizing {userName}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-4 p-5 rounded-2xl bg-indigo-50/30 border border-indigo-100/50">
                        <div className="flex items-start gap-3">
                            <ShieldCheck className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                            <p className="text-xs font-bold text-slate-600 leading-relaxed">
                                Changing the <span className="text-indigo-600">Used ID</span> will update the profile URL. Previous links using the old ID may break.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1">New System ID</Label>
                        <div className="relative">
                            <Input
                                placeholder="Dr-Julius-Babayemi"
                                className="h-12 bg-slate-50/80 border-slate-100 rounded-xl focus:bg-white transition-all font-bold text-slate-600 pr-10 focus:ring-2 focus:ring-indigo-500/20"
                                value={newSid}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\s+/g, '-');
                                    setNewSid(val);
                                }}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {isChecking ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-slate-300" />
                                ) : isAvailable === true ? (
                                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                ) : isAvailable === false ? (
                                    <Fingerprint className="h-4 w-4 text-rose-500" />
                                ) : null}
                            </div>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 ml-1 italic">
                            Only letters, numbers, and dashes are allowed.
                        </p>
                    </div>
                </div>

                <div className="p-8 bg-slate-50/50 border-t border-slate-100">
                    <DialogFooter className="flex flex-col sm:flex-row gap-4">
                        <Button 
                            variant="ghost" 
                            onClick={onClose} 
                            className="h-12 px-8 rounded-xl font-extrabold text-[10px] uppercase tracking-widest text-slate-400 hover:bg-white"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={() => updateSidMutation.mutate()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white h-12 px-10 rounded-xl shadow-xl shadow-indigo-900/10 gap-3 font-extrabold text-[10px] uppercase tracking-widest transition-all min-w-[180px]" 
                            disabled={updateSidMutation.isPending || !newSid || isAvailable === false || newSid === currentSid}
                        >
                            {updateSidMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
                            Update ID
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
