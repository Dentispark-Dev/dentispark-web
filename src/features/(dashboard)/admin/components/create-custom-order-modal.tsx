"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/src/connection/admin-service";
import { AdminServicePackageRecord } from "@/src/connection/api-types";
import { useState } from "react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { 
    User, Package, FileText, ChevronRight, ArrowLeft, 
    Plus, Trash2, Search, ShoppingBag, DollarSign, X
} from "lucide-react";
import { toast } from "sonner";

interface LineItem {
    pkg: AdminServicePackageRecord;
    qty: number;
    price: number; // allow override
}

interface CreateCustomOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateCustomOrderModal({ isOpen, onClose }: CreateCustomOrderModalProps) {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [customerEmail, setCustomerEmail] = useState("");
    const [lineItems, setLineItems] = useState<LineItem[]>([]);
    const [orderNote, setOrderNote] = useState("");
    const [pkgSearch, setPkgSearch] = useState("");

    const queryClient = useQueryClient();

    const { data: pkgData } = useQuery({
        queryKey: ["admin-packages-create"],
        queryFn: () => adminService.getServicePackageRecords({ page: 0, perPage: 100 }),
        enabled: isOpen && step === 2,
    });

    const packages: AdminServicePackageRecord[] = pkgData?.content ?? [];
    const filtered = packages.filter(p =>
        p.title.toLowerCase().includes(pkgSearch.toLowerCase()) ||
        p.mentorUsername.toLowerCase().includes(pkgSearch.toLowerCase())
    );

    const orderTotal = lineItems.reduce((s, i) => s + i.price * i.qty, 0);
    const currency = lineItems[0]?.pkg.currency ?? "USD";

    const addItem = (pkg: AdminServicePackageRecord) => {
        const existing = lineItems.find(i => i.pkg.externalId === pkg.externalId);
        if (existing) {
            setLineItems(lineItems.map(i => i.pkg.externalId === pkg.externalId ? { ...i, qty: i.qty + 1 } : i));
        } else {
            setLineItems([...lineItems, { pkg, qty: 1, price: pkg.price }]);
        }
    };

    const removeItem = (id: string) => setLineItems(lineItems.filter(i => i.pkg.externalId !== id));

    const updatePrice = (id: string, price: number) =>
        setLineItems(lineItems.map(i => i.pkg.externalId === id ? { ...i, price } : i));

    const mutation = useMutation({
        mutationFn: async () => {
            // Send one order per line item (API limitation); in a real multi-item order you'd batch
            for (const item of lineItems) {
                await adminService.initiateOrderAdmin({
                    studentEmail: customerEmail,
                    mentorEmail: item.pkg.mentorUsername,
                    packageSlug: item.pkg.slug,
                    notes: orderNote,
                });
            }
        },
        onSuccess: () => {
            toast.success("Custom order created and sent to customer!");
            queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
            reset();
        },
        onError: (e: any) => toast.error(e.message || "Failed to create order"),
    });

    const reset = () => {
        setStep(1);
        setCustomerEmail("");
        setLineItems([]);
        setOrderNote("");
        setPkgSearch("");
        onClose();
    };

    const canNext1 = !!customerEmail.trim() && customerEmail.includes("@");
    const canNext2 = lineItems.length > 0;
    const canSubmit = canNext1 && canNext2;

    return (
        <Dialog open={isOpen} onOpenChange={reset}>
            <DialogContent className="sm:max-w-[720px] p-0 border border-gray-200 shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[92vh]">
                {/* Header — WC style */}
                <div className="border-b border-gray-200 bg-white px-6 py-4 shrink-0">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5 text-gray-600" />
                            Add New Order
                        </DialogTitle>
                    </DialogHeader>
                    {/* WC-style step breadcrumb */}
                    <div className="flex items-center gap-2 mt-3 text-xs">
                        {(["Customer", "Products", "Review"] as const).map((label, i) => (
                            <span key={label} className="flex items-center gap-2">
                                <button
                                    onClick={() => { if (i < step - 1) setStep((i + 1) as 1 | 2 | 3); }}
                                    className={`flex items-center gap-1.5 font-semibold px-2 py-0.5 rounded transition-colors ${
                                        step === i + 1 ? "text-white bg-gray-700" : i + 1 < step ? "text-blue-600 hover:underline cursor-pointer" : "text-gray-400"
                                    }`}
                                >
                                    <span className={`h-4 w-4 rounded-full text-[10px] flex items-center justify-center font-extrabold ${step === i + 1 ? "bg-white text-gray-700" : i + 1 < step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>
                                        {i + 1}
                                    </span>
                                    {label}
                                </button>
                                {i < 2 && <ChevronRight className="h-3 w-3 text-gray-300" />}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                    {/* ── STEP 1: Customer ── */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-4">
                                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                    <User className="h-4 w-4" /> Customer Details
                                </h3>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600">Student Email Address <span className="text-red-500">*</span></label>
                                    <Input
                                        placeholder="student@dentispark.com"
                                        value={customerEmail}
                                        onChange={(e) => setCustomerEmail(e.target.value)}
                                        className="h-10 rounded-sm border-gray-300 text-sm font-medium focus:ring-1 focus:ring-gray-400"
                                    />
                                    <p className="text-[11px] text-gray-400">The order payment request will be sent to this email address.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 2: Products ── */}
                    {step === 2 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Left: Service Picker */}
                            <div className="bg-white border border-gray-200 rounded-sm p-4 space-y-3">
                                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                    <Search className="h-3.5 w-3.5" /> Add Products / Services
                                </h3>
                                <Input
                                    placeholder="Search services…"
                                    value={pkgSearch}
                                    onChange={(e) => setPkgSearch(e.target.value)}
                                    className="h-9 rounded-sm border-gray-300 text-sm"
                                />
                                <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                                    {filtered.length === 0 && (
                                        <p className="text-xs text-gray-400 py-4 text-center">No services found.</p>
                                    )}
                                    {filtered.map((pkg) => (
                                        <button
                                            key={pkg.externalId}
                                            onClick={() => addItem(pkg)}
                                            className="w-full text-left flex items-start justify-between gap-3 p-3 rounded border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 transition-colors group"
                                        >
                                            <div>
                                                <p className="text-xs font-semibold text-gray-900 group-hover:text-blue-700">{pkg.title}</p>
                                                <p className="text-[10px] text-gray-500">by {pkg.mentorUsername} · {pkg.durationMinutes} min</p>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0">
                                                <span className="text-xs font-bold text-gray-700">{pkg.currency} {pkg.price}</span>
                                                <Plus className="h-3.5 w-3.5 text-blue-500 opacity-0 group-hover:opacity-100" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Order items */}
                            <div className="bg-white border border-gray-200 rounded-sm p-4 space-y-3">
                                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                    <Package className="h-3.5 w-3.5" /> Order Items
                                </h3>
                                {lineItems.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
                                        <ShoppingBag className="h-8 w-8 opacity-30" />
                                        <p className="text-xs">No items added yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {lineItems.map((item) => (
                                            <div key={item.pkg.externalId} className="flex items-start gap-3 p-3 bg-gray-50 rounded border border-gray-100">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-semibold text-gray-900 truncate">{item.pkg.title}</p>
                                                    <p className="text-[10px] text-gray-500">by {item.pkg.mentorUsername}</p>
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <label className="text-[10px] text-gray-500">Price:</label>
                                                        <input
                                                            type="number"
                                                            value={item.price}
                                                            onChange={(e) => updatePrice(item.pkg.externalId, parseFloat(e.target.value) || 0)}
                                                            className="w-20 h-6 text-xs border border-gray-200 rounded px-1.5 font-medium"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <button onClick={() => removeItem(item.pkg.externalId)} className="text-gray-300 hover:text-red-500 transition-colors">
                                                        <X className="h-3.5 w-3.5" />
                                                    </button>
                                                    <span className="text-xs font-bold text-gray-900">{item.pkg.currency} {(item.price * item.qty).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {lineItems.length > 0 && (
                                    <div className="border-t border-gray-200 pt-3 space-y-1.5">
                                        <div className="flex justify-between text-xs text-gray-600">
                                            <span>Subtotal</span><span className="font-semibold">{currency} {orderTotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-bold text-gray-900">
                                            <span>Order Total</span><span>{currency} {orderTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── STEP 3: Review ── */}
                    {step === 3 && (
                        <div className="space-y-4">
                            {/* Order Summary */}
                            <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-4">
                                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                    <FileText className="h-3.5 w-3.5" /> Order Summary
                                </h3>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-gray-500 pb-2 border-b border-gray-100">
                                        <span>Customer</span><span className="font-bold text-gray-900">{customerEmail}</span>
                                    </div>
                                    <table className="w-full text-xs mt-2">
                                        <thead>
                                            <tr className="text-gray-500 uppercase border-b border-gray-100">
                                                <th className="text-left py-2 font-semibold">Item</th>
                                                <th className="text-right py-2 font-semibold">Cost</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {lineItems.map(item => (
                                                <tr key={item.pkg.externalId}>
                                                    <td className="py-2">
                                                        <div className="font-semibold text-gray-900">{item.pkg.title}</div>
                                                        <div className="text-gray-500">by {item.pkg.mentorUsername}</div>
                                                    </td>
                                                    <td className="py-2 text-right font-bold text-gray-900">{item.pkg.currency} {(item.price * item.qty).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="border-t border-gray-200">
                                                <td className="py-3 text-sm font-extrabold text-gray-900">Total</td>
                                                <td className="py-3 text-right text-sm font-extrabold text-gray-900">{currency} {orderTotal.toFixed(2)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            {/* Order Note */}
                            <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-3">
                                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                    <FileText className="h-3.5 w-3.5" /> Order Note
                                </h3>
                                <Textarea
                                    placeholder="Add a note to the order (optional)…"
                                    value={orderNote}
                                    onChange={(e) => setOrderNote(e.target.value)}
                                    className="text-sm rounded-sm border-gray-300 min-h-[80px]"
                                />
                                <p className="text-[11px] text-gray-400">This note will be visible to the customer in their order details.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <DialogFooter className="border-t border-gray-200 px-6 py-4 bg-white flex items-center justify-between shrink-0">
                    <Button variant="ghost" onClick={step === 1 ? reset : () => setStep(s => (s - 1) as 1 | 2 | 3)} className="rounded-sm font-semibold text-sm h-9 gap-1.5">
                        {step === 1 ? <><X className="h-4 w-4" /> Cancel</> : <><ArrowLeft className="h-4 w-4" /> Back</>}
                    </Button>
                    {step < 3 ? (
                        <Button
                            onClick={() => setStep(s => (s + 1) as 1 | 2 | 3)}
                            disabled={(step === 1 && !canNext1) || (step === 2 && !canNext2)}
                            className="bg-gray-800 hover:bg-gray-900 text-white rounded-sm font-bold h-9 px-6 gap-2 text-sm"
                        >
                            Continue <ChevronRight className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={() => mutation.mutate()}
                            disabled={!canSubmit || mutation.isPending}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-sm font-bold h-9 px-6 gap-2 text-sm shadow-md"
                        >
                            {mutation.isPending ? "Creating Order…" : "Create Order"}
                            {!mutation.isPending && <ShoppingBag className="h-4 w-4" />}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
