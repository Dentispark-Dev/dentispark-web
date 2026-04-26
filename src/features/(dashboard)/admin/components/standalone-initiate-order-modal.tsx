"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { 
    ShoppingCart, 
    Send, 
    User, 
    ChevronRight, 
    Search,
    Package,
    ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { LooseRecord } from "@/src/types/loose";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";

interface StandaloneInitiateOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function StandaloneInitiateOrderModal({ isOpen, onClose }: StandaloneInitiateOrderModalProps) {
    const [step, setStep] = useState(1);
    const [studentEmail, setStudentEmail] = useState("");
    const [mentorEmail, setMentorEmail] = useState("");
    const [selectedPackage, setSelectedPackage] = useState<LooseRecord | null>(null);
    const [notes, setNotes] = useState("");

    const queryClient = useQueryClient();

    // Fetch packages to select from (ideally filtered by mentor, but let's get all for now for selection)
    const { data: pkgResponse, isLoading: isLoadingPkgs } = useQuery({
        queryKey: ["admin-packages-all"],
        queryFn: () => adminService.getServicePackageRecords({ page: 0, perPage: 100 }),
        enabled: isOpen
    });

    const initiateMutation = useMutation({
        mutationFn: () => adminService.initiateOrderAdmin({
            studentEmail,
            mentorEmail: selectedPackage?.mentorUsername ?? "",
            packageSlug: selectedPackage?.slug ?? "",
            notes
        }),
        onSuccess: () => {
            toast.success("Order request sent to student!");
            queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
            onClose();
            resetModal();
        },
        onError: (error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : "Failed to initiate order";
            toast.error(errorMessage);
        }
    });

    const resetModal = () => {
        setStep(1);
        setStudentEmail("");
        setMentorEmail("");
        setSelectedPackage(null);
        setNotes("");
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px] border-none shadow-2xl rounded-3xl overflow-hidden p-0 flex flex-col max-h-[90vh]">
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 text-white relative shrink-0">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Send className="h-24 w-24" />
                    </div>
                    <DialogHeader className="relative z-10">
                        <DialogTitle className="text-2xl font-extrabold flex items-center gap-2 text-white">
                            <ShoppingCart className="h-6 w-6" />
                            Direct Order Placement
                        </DialogTitle>
                        <DialogDescription className="text-indigo-100 font-medium opacity-90">
                            Manually create an order for any student and mentor pair.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                    {/* Progress Indicator */}
                    <div className="flex items-center gap-2 mb-4">
                        {[1, 2, 3].map((s) => (
                            <div 
                                key={s} 
                                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= step ? "bg-indigo-600" : "bg-gray-100"}`}
                            />
                        ))}
                    </div>

                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <User className="h-4 w-4 text-indigo-600" />
                                Step 1: Assign Student
                            </h3>
                            <div className="space-y-2">
                                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Student Email</label>
                                <Input 
                                    placeholder="Enter student email address..."
                                    value={studentEmail}
                                    onChange={(e) => setStudentEmail(e.target.value)}
                                    className="h-12 rounded-xl border-gray-200 focus:ring-indigo-500 font-medium"
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Package className="h-4 w-4 text-indigo-600" />
                                Step 2: Select Service Package
                            </h3>
                            <div className="space-y-2">
                                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Available Services</label>
                                <Select 
                                    onValueChange={(val) => {
                                        const pkg = pkgResponse?.content.find((p: LooseRecord) => p.externalId === val);
                                        setSelectedPackage(pkg ?? null);
                                    }}
                                >
                                    <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:ring-indigo-500 font-medium">
                                        <SelectValue placeholder="Select a service package..." />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-gray-100 shadow-xl">
                                        {pkgResponse?.content.map((pkg: LooseRecord) => (
                                            <SelectItem key={pkg.externalId} value={pkg.externalId} className="rounded-lg py-3">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900">{pkg.title}</span>
                                                    <span className="text-xs text-gray-500">By {pkg.mentorUsername} • {pkg.currency} {pkg.price}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <ListChecks className="h-4 w-4 text-indigo-600" />
                                Step 3: Finalize & Add Notes
                            </h3>
                            <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100 space-y-3">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-indigo-400 uppercase">Student</span>
                                    <span className="font-bold text-indigo-900">{studentEmail}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-indigo-400 uppercase">Mentor</span>
                                    <span className="font-bold text-indigo-900">{selectedPackage?.mentorUsername}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-t border-indigo-100 pt-3">
                                    <span className="font-extrabold text-indigo-700">{selectedPackage?.title}</span>
                                    <span className="font-extrabold text-indigo-900">{selectedPackage?.currency} {selectedPackage?.price}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Order Notes</label>
                                <Textarea 
                                    placeholder="Add any internal notes or instructions for the student..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="rounded-xl border-gray-200 focus:ring-indigo-500 font-medium min-h-[100px]"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-8 bg-gray-50/50 border-t border-gray-100 flex gap-3 sm:justify-end shrink-0">
                    {step > 1 && (
                        <Button variant="ghost" onClick={prevStep} className="rounded-xl font-bold h-12 px-6">
                            Back
                        </Button>
                    )}
                    {step < 3 ? (
                        <Button 
                            onClick={nextStep}
                            disabled={(step === 1 && !studentEmail) || (step === 2 && !selectedPackage)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold h-12 px-8 flex items-center gap-2"
                        >
                            Next Step
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button 
                            onClick={() => initiateMutation.mutate()}
                            disabled={initiateMutation.isPending}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-extrabold h-12 px-8 flex items-center gap-2 shadow-lg shadow-green-100"
                        >
                            {initiateMutation.isPending ? "Placing Order..." : "Confirm & Send Order"}
                            <Send className="h-4 w-4" />
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

const ListChecks = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>
    </svg>
);
