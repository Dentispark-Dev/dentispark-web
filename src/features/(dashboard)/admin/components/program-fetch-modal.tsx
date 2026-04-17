"use client";

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
import { Label } from "@/src/components/ui/label";
import { 
    Loader2, 
    Globe, 
    Sparkles, 
    CheckCircle2, 
    AlertCircle,
    ArrowRight
} from "lucide-react";
import { toast } from "sonner";

interface ProgramFetchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDataFetched: (data: any) => void;
}

export function ProgramFetchModal({ isOpen, onClose, onDataFetched }: ProgramFetchModalProps) {
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleFetch = async () => {
        if (!url) return;
        
        setIsLoading(true);
        setResult(null);

        try {
            const response = await fetch("/api/admin/fetch-program", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch program details");
            }

            setResult(data);
            toast.success("Program details extracted successfully!");
        } catch (error: any) {
            console.error("Fetch error:", error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = () => {
        if (result) {
            onDataFetched(result);
            onClose();
            setUrl("");
            setResult(null);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Sparkles className="h-24 w-24 rotate-12" />
                    </div>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-yellow-300" />
                            Smart Program Fetcher
                        </DialogTitle>
                        <DialogDescription className="text-indigo-100 font-medium">
                            Paste the university course URL and our AI will extract the details for you.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8 space-y-6 bg-white">
                    <div className="space-y-2">
                        <Label htmlFor="url" className="text-sm font-bold text-slate-700">Course Page URL</Label>
                        <div className="relative group">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            <Input 
                                id="url"
                                placeholder="https://www.ucl.ac.uk/prospective-students/undergraduate/degrees/dentistry-bds"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="pl-11 h-14 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
                            />
                        </div>
                    </div>

                    {result && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-500 bg-emerald-50 border border-emerald-100 rounded-2xl p-6 space-y-4">
                            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                                <CheckCircle2 className="h-4 w-4" />
                                Extraction Complete
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Course Name</p>
                                    <p className="text-sm font-bold text-slate-900 leading-tight">{result.courseName}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Degree Type</p>
                                    <p className="text-sm font-bold text-slate-900 leading-tight">{result.degreeType}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Duration</p>
                                    <p className="text-sm font-bold text-slate-900 leading-tight">{result.durationYears} Years</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Entry Reqs</p>
                                    <p className="text-sm font-bold text-slate-900 leading-tight truncate">{result.entryRequirements}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!result && !isLoading && (
                        <div className="bg-slate-50 rounded-2xl p-4 flex gap-3 items-start border border-slate-100">
                            <AlertCircle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                AI-driven extraction works best with official UK university undergraduate and postgraduate course pages.
                            </p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex flex-col items-center justify-center p-8 space-y-4">
                            <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
                            <p className="text-sm font-bold text-indigo-600 animate-pulse uppercase tracking-[0.2em]">Analyzing Course Data...</p>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-8 bg-slate-50 sm:justify-start">
                    {!result ? (
                        <Button 
                            onClick={handleFetch} 
                            disabled={isLoading || !url}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white w-full h-14 rounded-2xl font-bold shadow-lg shadow-indigo-100 gap-2 text-sm uppercase tracking-widest outline-none ring-offset-0 focus:ring-0"
                        >
                            {isLoading ? "Fetching..." : "Analyze URL"}
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button 
                            onClick={handleConfirm}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full h-14 rounded-2xl font-bold shadow-lg shadow-emerald-100 gap-2 text-sm uppercase tracking-widest outline-none ring-offset-0 focus:ring-0"
                        >
                            Populate Details
                            <Sparkles className="h-4 w-4" />
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
