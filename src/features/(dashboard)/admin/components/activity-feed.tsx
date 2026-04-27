"use client";

import { useQuery } from "@tanstack/react-query";
import { 
    Clock, 
    User, 
    CheckCircle2, 
    AlertCircle, 
    ArrowRight,
    Loader2,
    Shield
} from "lucide-react";
import { adminService } from "@/src/connection/admin-service";
import { motion, AnimatePresence } from "framer-motion";

export function ActivityFeed() {
    const { data, isLoading } = useQuery({
        queryKey: ["admin-global-activity"],
        queryFn: () => adminService.getGlobalActivity(0, 8),
    });

    if (isLoading) {
        return (
            <div className="p-8 flex justify-center">
                <Loader2 className="h-6 w-6 text-primary-500 animate-spin" />
            </div>
        );
    }

    const activities = data?.content || [];

    const getActionIcon = (action: string) => {
        const a = action.toLowerCase();
        if (a.includes('login')) return <Shield className="h-4 w-4 text-blue-500" />;
        if (a.includes('update') || a.includes('edit')) return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
        if (a.includes('delete') || a.includes('remove')) return <AlertCircle className="h-4 w-4 text-rose-500" />;
        return <User className="h-4 w-4 text-primary-500" />;
    };

    const getTimeAgo = (dateStr: string) => {
        try {
            if (!dateStr) return 'Pending...';
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return 'Recently';
            
            const now = new Date();
            const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
            
            if (diffInSeconds < 60) return 'Just now';
            if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
            if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
            return date.toLocaleDateString();
        } catch (e) {
            console.error("Date parsing error in ActivityFeed:", e);
            return 'Recently';
        }
    };

    return (
        <div className="group bg-white p-10 rounded-[3rem] shadow-[0_30px_70px_rgba(0,0,0,0.04)] border border-slate-50 h-full overflow-hidden flex flex-col font-jakarta">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">System <span className="text-indigo-600 font-medium">Activity</span></h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time platform events</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-2.5 text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all duration-300 border border-indigo-100 shadow-sm">
                    View Audit Log <ArrowRight className="h-3 w-3" />
                </button>
            </div>

            <div className="space-y-8 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    {activities.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 py-20">
                            <Clock className="h-12 w-12 opacity-10 animate-pulse" />
                            <p className="text-xs font-extrabold uppercase tracking-widest">Awaiting Live Events...</p>
                        </div>
                    ) : (
                        activities.map((activity, index) => (
                            <motion.div
                                key={activity.userId + activity.timeAndDate}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                className="flex items-start gap-5 relative group/item"
                            >
                                {/* Activity Line */}
                                {index !== activities.length - 1 && (
                                    <div className="absolute left-[15px] top-[30px] bottom-[-32px] w-[2px] bg-slate-50" />
                                )}

                                <div className="z-10 h-8 w-8 rounded-xl bg-white shadow-lg ring-1 ring-slate-100 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                                    {getActionIcon(activity.action)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-sm font-extrabold text-slate-900 truncate tracking-tight">
                                            {activity.fullName}
                                        </p>
                                        <span className="text-[9px] font-extrabold text-slate-400 whitespace-nowrap bg-slate-50 px-3 py-1 rounded-full border border-slate-100 tracking-widest uppercase">
                                            {getTimeAgo(activity.timeAndDate)}
                                        </span>
                                    </div>
                                    <p className="text-[11px] font-medium text-slate-400 mt-1 line-clamp-1 group-hover/item:text-slate-600 transition-colors uppercase tracking-wide">
                                        {activity.action}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
            
            <div className="mt-10 pt-8 border-t border-slate-50">
                <div className="flex items-center justify-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[9px] font-extrabold text-slate-300 uppercase tracking-[0.3em]">
                        Live Sync Operational
                    </p>
                </div>
            </div>
        </div>
    );
}
