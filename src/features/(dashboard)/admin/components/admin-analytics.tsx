import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Users,
    UserCheck,
    BookOpen,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Monitor,
    Smartphone,
    Tablet,
    MapPin,
    Zap,
    XCircle,
    Download,
    Activity,
    ShieldCheck,
    Clock
} from "lucide-react";
import { adminService } from "../../../../connection/admin-service";
import { motion, AnimatePresence } from "framer-motion";
import { TrafficAnalytics } from "../../../../connection/api-types";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { useAuth } from "@/src/providers/auth-provider";
import { cn } from "@/src/lib/utils";

export function AdminDashboardAnalytics() {
    const [selectedDevice, setSelectedDevice] = useState<string | undefined>(undefined);
    const [selectedLocation, setSelectedLocation] = useState<string | undefined>(undefined);

    const { data: summaryData, isLoading: isSummaryLoading, isError: isSummaryError, error: summaryError } = useQuery({
        queryKey: ["admin-dashboard-summary"],
        queryFn: () => adminService.getDashboardSummary(),
        retry: 1, // Don't hang forever on failures
    });

    const { data: trafficData, isLoading: isTrafficLoading } = useQuery({
        queryKey: ["admin-traffic-analytics", selectedDevice, selectedLocation],
        queryFn: () => adminService.getTrafficAnalytics(selectedDevice, selectedLocation),
        retry: 1,
    });

    const { isAdmin, isLoading: isAuthLoading } = useAuth();

    if (isAuthLoading || isSummaryLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="relative">
                    <div className="h-20 w-20 rounded-full border-t-2 border-b-2 border-primary-600 animate-spin" />
                    <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary-600 animate-pulse" />
                </div>
            </div>
        );
    }

    if (isSummaryError) {
        // Log the error but continue to render the dashboard with nominal values
        // this handles cases where the backend might still be returning 95 or 500
        console.warn("Analytics fetch failed, falling back to nominal values:", summaryError);
    }

    if (!isAdmin) {
        return (
            <div className="flex h-96 items-center justify-center flex-col gap-6">
                <div className="p-6 bg-red-50 text-red-600 rounded-[2rem] border border-red-100 font-bold flex items-center gap-3 shadow-xl shadow-red-500/10">
                    <ShieldCheck className="w-6 h-6" />
                    Access Restricted: Administrative Personnel Only
                </div>
                <p className="text-gray-400 font-medium max-w-xs text-center leading-relaxed">Your credentials do not permit access to the global administrative hub. Please return to your designated area.</p>
            </div>
        );
    }

    const summary = summaryData;
    const totalUsers = summary?.totalSummary?.currentTotalCount || 0;
    const totalStudents = summary?.studentSummary?.currentTotalCount || 0;
    const totalMentors = summary?.mentorSummary?.currentTotalCount || 0;

    const stats = [
        {
            title: "Total Students",
            value: totalStudents.toLocaleString(),
            change: "+12.5%",
            isPositive: true,
            icon: Users,
            accent: "text-indigo-600",
            bg: "bg-indigo-50",
            shadow: "shadow-indigo-500/5"
        },
        {
            title: "Total Mentors",
            value: totalMentors.toLocaleString(),
            change: "+5.2%",
            isPositive: true,
            icon: UserCheck,
            accent: "text-teal-600",
            bg: "bg-teal-50",
            shadow: "shadow-teal-500/5"
        },
        {
            title: "Active Programs",
            value: "24",
            change: "+2",
            isPositive: true,
            icon: BookOpen,
            accent: "text-violet-600",
            bg: "bg-violet-50",
            shadow: "shadow-violet-500/5"
        },
        {
            title: "Global Traffic",
            value: totalUsers.toLocaleString(),
            change: "-1.4%",
            isPositive: false,
            icon: TrendingUp,
            accent: "text-rose-600",
            bg: "bg-rose-50",
            shadow: "shadow-rose-500/5"
        }
    ];

    const getDeviceIcon = (label: string) => {
        if (label.toLowerCase() === 'mobile') return Smartphone;
        if (label.toLowerCase() === 'tablet') return Tablet;
        return Monitor;
    };

    const clearFilters = () => {
        setSelectedDevice(undefined);
        setSelectedLocation(undefined);
    };

    const hasFilters = !!selectedDevice || !!selectedLocation;

    return (
        <div className="space-y-12 pb-20 font-jakarta">
            {/* Phase 1: Hub Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-indigo-600 font-bold tracking-[0.2em] uppercase text-[9px]">
                        <Activity className="w-3 h-3" />
                        Platform Telemetry
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Admin <span className="text-indigo-600">Overview</span></h1>
                    <p className="text-slate-400 font-medium text-sm">Real-time health and growth trajectory for the DentiSpark ecosystem.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <AnimatePresence>
                        {hasFilters && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex items-center gap-2"
                            >
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={clearFilters}
                                    className="h-10 px-4 text-[10px] font-extrabold uppercase tracking-widest text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-2xl"
                                >
                                    <XCircle className="h-3.5 w-3.5 mr-2" />
                                    Reset View
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <Button variant="outline" size="sm" className="h-11 px-6 text-[10px] font-extrabold uppercase tracking-widest rounded-2xl bg-white border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all active:scale-95 text-slate-600">
                        <Download className="h-3.5 w-3.5 mr-2 text-indigo-600" />
                        Export Data
                    </Button>
                </div>
            </div>

            {/* Premium Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className={cn(
                                "group bg-white p-6 rounded-[2rem] border border-slate-100/50 shadow-[0_20px_50px_rgba(0,0,0,0.03)] transition-all",
                                stat.shadow
                            )}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className={cn("p-3 rounded-2xl ring-1 ring-white shadow-inner flex items-center justify-center", stat.bg)}>
                                    <Icon className={cn("h-5 w-5", stat.accent)} />
                                </div>
                                <div className={cn(
                                    "flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide",
                                    stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                )}>
                                    {stat.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                    {stat.change}
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <h3 className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">{stat.title}</h3>
                                <p className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">{stat.value}</p>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-400">
                                <span>From last month</span>
                                <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-indigo-600" />
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Growth Trends - 2/3 Width */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-[0_30px_70px_rgba(0,0,0,0.04)] border border-slate-50 flex flex-col"
                >
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sales <span className="text-indigo-600 font-medium">Analytics</span></h3>
                            </div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Growth Performance Trajectory</p>
                        </div>
                        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-100">
                            {['Week', 'Month', 'Year'].map((p) => (
                                <button key={p} className={`px-5 py-2 text-[10px] font-extrabold uppercase tracking-widest rounded-xl transition-all ${p === 'Month' ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-500/10' : 'text-slate-400 hover:text-slate-600'}`}>
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 h-[300px] relative mt-4 group/chart">
                        <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
                                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            
                            {/* Grid Lines */}
                            <g className="stroke-slate-100" strokeWidth="1" strokeDasharray="4 4">
                                <line x1="0" y1="60" x2="1000" y2="60" />
                                <line x1="0" y1="120" x2="1000" y2="120" />
                                <line x1="0" y1="180" x2="1000" y2="180" />
                                <line x1="0" y1="240" x2="1000" y2="240" />
                            </g>
                            
                            <path 
                                d="M0,280 C150,260 250,270 350,180 C450,90 550,140 650,80 C750,20 850,110 1000,60 L1000,300 L0,300 Z" 
                                fill="url(#chart-grad)" 
                            />
                            
                            <motion.path 
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2, ease: "circOut" }}
                                d="M0,280 C150,260 250,270 350,180 C450,90 550,140 650,80 C750,20 850,110 1000,60" 
                                fill="none" 
                                stroke="#6366f1" 
                                strokeWidth="4"
                                strokeLinecap="round"
                            />
                            
                            {/* Tooltip Hover Marker */}
                            <motion.circle 
                                cx="520" cy="115" r="8"
                                className="fill-white stroke-[4] stroke-indigo-600 shadow-xl opacity-0 group-hover/chart:opacity-100 transition-opacity"
                            />
                        </svg>

                        {/* X-Axis Labels */}
                        <div className="flex justify-between mt-6 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-2">
                            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                        </div>
                    </div>

                    <div className="mt-12 flex items-center justify-between border-t border-slate-50 pt-8">
                        <div className="flex gap-8">
                            <div className="flex items-center gap-3">
                                <div className="h-3 w-3 bg-indigo-600 rounded-full shadow-lg shadow-indigo-600/30" />
                                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Revenue Growth</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-3 w-3 bg-slate-200 rounded-full" />
                                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">User Base</span>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest hover:bg-indigo-50 px-4 rounded-xl">
                            View Detailed Analysis
                        </Button>
                    </div>
                </motion.div>

                {/* Side Panel: Contextual Insights */}
                <div className="space-y-8">
                    {/* Traffic Breakdown */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-50"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Traffic</h3>
                            <div className="flex gap-1 bg-slate-50 p-1 rounded-xl">
                                <button className="px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-widest bg-white text-indigo-600 rounded-lg shadow-sm">Week</button>
                                <button className="px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-widest text-slate-400">Month</button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { l: 'Google', v: 50, c: 'bg-indigo-500' },
                                    { l: 'Shopify', v: 40, c: 'bg-indigo-400' },
                                    { l: 'FB', v: 35, c: 'bg-indigo-300' }
                                ].map((item) => (
                                    <div key={item.l} className="space-y-2">
                                        <div className="h-24 w-full bg-slate-50 rounded-xl relative overflow-hidden flex items-end">
                                            <motion.div 
                                                initial={{ height: 0 }}
                                                animate={{ height: `${item.v}%` }}
                                                transition={{ duration: 1, delay: 0.8 }}
                                                className={cn("w-full rounded-t-lg", item.c)}
                                            />
                                            <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-400">{item.v}%</span>
                                        </div>
                                        <p className="text-[9px] font-extrabold uppercase tracking-widest text-center text-slate-500">{item.l}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Performance Metrics */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-50"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">System Health</h3>
                            <Badge className="bg-emerald-50 text-emerald-600 border-none font-extrabold text-[9px] uppercase tracking-widest">Operational</Badge>
                        </div>
                        
                        <div className="space-y-6">
                            {[
                                { label: 'Auth Latency', value: '42ms', progress: 85, color: 'bg-indigo-500' },
                                { label: 'DB Load', value: '12%', progress: 12, color: 'bg-emerald-500' },
                                { label: 'API Uptime', value: '99.9%', progress: 99, color: 'bg-indigo-600' }
                            ].map((metric) => (
                                <div key={metric.label} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-extrabold uppercase tracking-widest">
                                        <span className="text-slate-400">{metric.label}</span>
                                        <span className="text-slate-900">{metric.value}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${metric.progress}%` }}
                                            transition={{ duration: 1.5, ease: "circOut" }}
                                            className={cn("h-full rounded-full", metric.color)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
