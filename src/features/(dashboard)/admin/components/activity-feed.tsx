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
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="group bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-gray-200/40 border border-white/50 h-full overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Global Activity</h3>
                    <p className="text-sm text-gray-500 font-medium">Real-time platform events</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-primary-600 hover:bg-primary-50 rounded-2xl transition-all duration-300">
                    Live View <ArrowRight className="h-3 w-3" />
                </button>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    {activities.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3 py-10">
                            <Clock className="h-10 w-10 opacity-20" />
                            <p className="text-sm font-medium">Monitoring platform activity...</p>
                        </div>
                    ) : (
                        activities.map((activity, index) => (
                            <motion.div
                                key={activity.userId + activity.timeAndDate}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                className="flex items-start gap-4 relative group/item"
                            >
                                {/* Activity Line */}
                                {index !== activities.length - 1 && (
                                    <div className="absolute left-[13px] top-[26px] bottom-[-24px] w-[2px] bg-gradient-to-b from-gray-100 to-transparent" />
                                )}

                                <div className="z-10 h-7 w-7 rounded-full bg-white shadow-md ring-1 ring-black/5 flex items-center justify-center flex-shrink-0">
                                    {getActionIcon(activity.action)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-bold text-gray-900 truncate">
                                            {activity.fullName}
                                        </p>
                                        <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100 tracking-tight">
                                            {getTimeAgo(activity.timeAndDate)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1 group-hover/item:text-gray-700 transition-colors">
                                        {activity.action}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100/50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                    Updating every 30s
                </p>
            </div>
        </div>
    );
}
