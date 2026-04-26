"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/src/connection/admin-service";
import { useState } from "react";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { ShoppingCart, Send, User, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { LooseRecord } from "@/src/types/loose";

interface InitiateOrderModalProps {
    package: LooseRecord | null;
    isOpen: boolean;
    onClose: () => void;
}

export function InitiateOrderModal({ package: pkg, isOpen, onClose }: InitiateOrderModalProps) {
    const [studentEmail, setStudentEmail] = useState("");
    const [notes, setNotes] = useState("");
    const queryClient = useQueryClient();

    const initiateMutation = useMutation({
        mutationFn: () => adminService.initiateOrderAdmin({
            studentEmail,
            mentorEmail: pkg?.mentorUsername ?? "",
            packageSlug: pkg?.slug ?? "",
            notes
        }),
        onSuccess: () => {
            toast.success("Order sent to student successfully!");
            queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
            onClose();
            setStudentEmail("");
            setNotes("");
        },
        onError: (error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : "Failed to initiate order";
            toast.error(errorMessage);
        }
    });

    if (!pkg) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] border-none shadow-2xl rounded-3xl overflow-hidden p-0">
                <div className="bg-gradient-to-br from-green-600 to-green-800 p-8 text-white relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <ShoppingCart className="h-24 w-24" />
                    </div>
                    <DialogHeader className="relative z-10">
                        <DialogTitle className="text-2xl font-extrabold flex items-center gap-2 text-white">
                            <Send className="h-6 w-6" />
                            Initiate Order
                        </DialogTitle>
                        <DialogDescription className="text-green-100 font-medium opacity-90">
                            Create a direct payment order for a student.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8 space-y-6">
                    {/* Package Info Summary */}
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1">Selected Service</p>
                                <h4 className="font-bold text-gray-900">{pkg.title}</h4>
                                <p className="text-xs text-gray-500 font-medium">By {pkg.mentorUsername}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-extrabold text-green-700">{pkg.currency} {pkg.price.toLocaleString()}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase italic">Admin Authorized</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1.5">
                                <User className="h-3 w-3" />
                                Student Email Address
                            </label>
                            <Input 
                                placeholder="student@example.com"
                                value={studentEmail}
                                onChange={(e) => setStudentEmail(e.target.value)}
                                className="h-12 rounded-xl border-gray-200 focus:ring-green-500 focus:border-green-500 font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1.5">
                                <ChevronRight className="h-3 w-3" />
                                Order Notes (Optional)
                            </label>
                            <Textarea 
                                placeholder="Special instructions for this order..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="rounded-xl border-gray-200 focus:ring-green-500 focus:border-green-500 font-medium min-h-[100px]"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-8 bg-gray-50/50 border-t border-gray-100 flex gap-3 sm:justify-end">
                    <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold h-12 px-6">
                        Cancel
                    </Button>
                    <Button 
                        onClick={() => initiateMutation.mutate()}
                        disabled={!studentEmail || initiateMutation.isPending}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-extrabold h-12 px-8 shadow-lg shadow-green-200 flex items-center gap-2"
                    >
                        {initiateMutation.isPending ? "Sending..." : "Send Order Request"}
                        {!initiateMutation.isPending && <ChevronRight className="h-4 w-4" />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
