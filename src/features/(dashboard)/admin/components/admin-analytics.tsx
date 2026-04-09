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

    const { data: summaryData, isLoading: isSummaryLoading } = useQuery({
        queryKey: ["admin-dashboard-summary"],
        queryFn: () => adminService.getDashboardSummary(),
    });

    const { data: trafficData, isLoading: isTrafficLoading } = useQuery({
        queryKey: ["admin-traffic-analytics", selectedDevice, selectedLocation],
        queryFn: () => adminService.getTrafficAnalytics(selectedDevice, selectedLocation),
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
            gradient: "from-blue-600 via-indigo-600 to-violet-600",
            lightColor: "bg-blue-500/10",
            glow: "shadow-blue-500/20"
        },
        {
            title: "Total Mentors",
            value: totalMentors.toLocaleString(),
            change: "+5.2%",
            isPositive: true,
            icon: UserCheck,
            gradient: "from-emerald-600 via-teal-600 to-cyan-600",
            lightColor: "bg-emerald-500/10",
            glow: "shadow-emerald-500/20"
        },
        {
            title: "Active Programs",
            value: "24",
            change: "+2",
            isPositive: true,
            icon: BookOpen,
            gradient: "from-amber-500 via-orange-600 to-rose-600",
            lightColor: "bg-amber-500/10",
            glow: "shadow-amber-500/20"
        },
        {
            title: "Global Traffic",
            value: totalUsers.toLocaleString(),
            change: "-1.4%",
            isPositive: false,
            icon: TrendingUp,
            gradient: "from-rose-600 via-pink-600 to-fuchsia-600",
            lightColor: "bg-rose-500/10",
            glow: "shadow-rose-500/20"
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
        <div className="space-y-12 pb-20">
            {/* Phase 1: Hub Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-gray-100">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary-600 font-bold tracking-widest uppercase text-[10px]">
                        <Activity className="w-3 h-3" />
                        Platform Pulse
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Admin Hub Overview</h1>
                    <p className="text-gray-500 font-medium">Real-time health and registration trajectory for the DentiSpark ecosystem.</p>
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
                                    className="h-10 px-4 text-xs font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl"
                                >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reset View
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <Button variant="outline" size="sm" className="h-10 px-6 text-xs font-bold rounded-xl bg-white border-gray-100 shadow-xl shadow-black/5 hover:shadow-2xl transition-all active:scale-95">
                        <Download className="h-4 w-4 mr-2" />
                        Generate Intelligence Report
                    </Button>
                </div>
            </div>

            {/* Premium Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1, ease: "circOut" }}
                        whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
                        className={cn(
                            "group relative overflow-hidden bg-white p-8 rounded-[2.5rem] shadow-2xl transition-shadow",
                            stat.glow
                        )}
                    >
                        <div className={`absolute top-0 right-0 h-40 w-40 bg-gradient-to-br ${stat.gradient} opacity-[0.04] rounded-bl-full group-hover:scale-125 transition-transform duration-1000`} />
                        <div className={`absolute -bottom-10 -left-10 h-32 w-32 bg-gradient-to-tr ${stat.gradient} opacity-[0.02] rounded-tr-full group-hover:rotate-45 transition-transform duration-1000`} />
                        
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className={`p-4 rounded-[1.25rem] ${stat.lightColor} ring-1 ring-white/50 shadow-inner flex items-center justify-center`}>
                                <stat.icon className={`h-7 w-7 bg-clip-text text-transparent bg-gradient-to-br ${stat.gradient}`} />
                            </div>
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold shadow-sm ${stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {stat.isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                                {stat.change}
                            </div>
                        </div>
                        
                        <div className="space-y-1.5 relative z-10">
                            <h3 className="text-gray-400 text-xs font-bold tracking-[0.1em] uppercase">{stat.title}</h3>
                            <div className="flex items-baseline gap-2">
                                <p className="text-4xl font-extrabold text-gray-900 tracking-tighter leading-none">{stat.value}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Growth Trends - 2/3 Width */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-200/40 border border-gray-50 flex flex-col"
                >
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Registration Pulse</h3>
                            </div>
                            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Global platform trajectory</p>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-100 shadow-inner">
                            {['7D', '30D', '90D', 'ALL'].map((p) => (
                                <button key={p} className={`px-5 py-2 text-xs font-extrabold rounded-xl transition-all ${p === '7D' ? 'bg-white text-primary-600 shadow-xl ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'}`}>
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 h-[320px] relative mt-4">
                        <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="gradient-students" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#12ac75" stopOpacity="0.4" />
                                    <stop offset="70%" stopColor="#12ac75" stopOpacity="0.1" />
                                    <stop offset="100%" stopColor="#12ac75" stopOpacity="0" />
                                </linearGradient>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>
                            
                            {/* Background Mesh/Grid */}
                            <path d="M0,50 L1000,50 M0,100 L1000,100 M0,150 L1000,150 M0,200 L1000,200 M0,250 L1000,250" stroke="#f1f5f9" strokeWidth="1" />
                            
                            <path 
                                d="M0,280 C100,240 200,260 300,180 C400,100 500,150 600,80 C700,20 800,100 1000,50 L1000,300 L0,300 Z" 
                                fill="url(#gradient-students)" 
                            />
                            <motion.path 
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2.5, ease: "circInOut" }}
                                d="M0,280 C100,240 200,260 300,180 C400,100 500,150 600,80 C700,20 800,100 1000,50" 
                                fill="none" 
                                stroke="#12ac75" 
                                strokeWidth="6"
                                strokeLinecap="round"
                                filter="url(#glow)"
                            />
                        </svg>
                        
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                            {[0, 30, 60, 100].map((x, i) => {
                                const yValues = [280, 180, 80, 50];
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 1.8 + (i * 0.25), type: "spring", stiffness: 200 }}
                                        style={{ left: `${x}%`, top: `${yValues[i]}px` }}
                                        className="absolute h-4 w-4 bg-white border-4 border-[#12ac75] rounded-full shadow-[0_0_15px_rgba(18,172,117,0.5)] -translate-x-1/2 -translate-y-1/2 z-20 group-hover:scale-150 transition-transform"
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-12 flex items-center justify-between border-t border-gray-100 pt-8">
                        <div className="flex gap-10">
                            <div className="flex items-center gap-3">
                                <div className="h-4 w-4 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-500/30" />
                                <span className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Qualified Students</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-4 w-4 bg-blue-500 rounded-lg shadow-lg shadow-blue-500/30" />
                                <span className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Verified Mentors</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-extrabold text-primary-600 bg-primary-50 px-4 py-1.5 rounded-full uppercase tracking-widest">
                            <Clock className="w-3 h-3" />
                            Live Telemetry Active
                        </div>
                    </div>
                </motion.div>

                {/* Side Panel: System Context */}
                <div className="space-y-10">
                    {/* Activity Pulse */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 h-64 w-64 bg-primary-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <h3 className="text-xl font-extrabold tracking-tight">Live Activity</h3>
                            <Badge className="bg-emerald-500/20 border-emerald-500/30 text-emerald-400 font-extrabold text-[10px] uppercase">Now</Badge>
                        </div>
                        
                        <div className="space-y-6 relative z-10">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-4 items-start border-l-2 border-white/5 pl-4 pb-2">
                                    <div className="h-2 w-2 rounded-full bg-primary-500 mt-1.5 ring-4 ring-primary-500/20 shrink-0" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-white/90">New Student Registered</p>
                                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">2 Minutes Ago</p>
                                    </div>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-white/40 hover:text-white hover:bg-white/5 text-xs font-bold uppercase tracking-widest py-6 border border-white/5 rounded-2xl">
                                Full Audit Log
                            </Button>
                        </div>
                    </motion.div>

                    {/* Traffic & Origins */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-200/40 border border-gray-50"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Origins</h3>
                            {isTrafficLoading && <div className="h-5 w-5 border-2 border-primary-600 border-t-transparent animate-spin rounded-full shadow-lg" />}
                        </div>
                        
                        <div className="space-y-10">
                            {/* Device Breakdown */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-extrabold text-gray-400 uppercase tracking-[0.2em]">Device Matrix</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {(trafficData?.deviceDistribution || [
                                        {label: 'Desktop', percentage: 65},
                                        {label: 'Mobile', percentage: 30},
                                        {label: 'Tablet', percentage: 5}
                                    ]).map((device: TrafficAnalytics) => {
                                        const Icon = getDeviceIcon(device.label);
                                        const isActive = selectedDevice === device.label;
                                        return (
                                            <button 
                                                key={device.label} 
                                                onClick={() => setSelectedDevice(isActive ? undefined : device.label)}
                                                className={cn(
                                                    "flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-500",
                                                    isActive 
                                                    ? "bg-slate-900 border-slate-900 shadow-2xl scale-105" 
                                                    : "bg-gray-50 border-gray-100 hover:border-gray-300"
                                                )}
                                            >
                                                <Icon className={cn("h-5 w-5", isActive ? "text-primary-500" : "text-gray-400")} />
                                                <div className="text-center">
                                                    <p className={cn("text-[9px] font-extrabold uppercase tracking-widest", isActive ? "text-white/50" : "text-gray-400")}>{device.label}</p>
                                                    <p className={cn("text-lg font-extrabold", isActive ? "text-white" : "text-gray-900")}>{device.percentage}%</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Top Locations */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-extrabold text-gray-400 uppercase tracking-[0.2em]">Geo Distribution</span>
                                </div>
                                <div className="space-y-5">
                                    {(trafficData?.locationDistribution || [
                                        {label: 'United Kingdom', percentage: 60},
                                        {label: 'United States', percentage: 15},
                                        {label: 'India', percentage: 10},
                                        {label: 'Others', percentage: 15}
                                    ]).map((loc: TrafficAnalytics) => {
                                        const isActive = selectedLocation === loc.label;
                                        return (
                                            <button 
                                                key={loc.label} 
                                                onClick={() => setSelectedLocation(isActive ? undefined : loc.label)}
                                                className="w-full group space-y-2 text-left"
                                            >
                                                <div className="flex items-center justify-between text-xs font-extrabold">
                                                    <span className={cn(isActive ? "text-primary-600" : "text-gray-700")}>{loc.label}</span>
                                                    <span className="text-gray-400 font-bold">{loc.percentage}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-gray-100 rounded-xl overflow-hidden shadow-inner">
                                                    <motion.div 
                                                        initial={false}
                                                        animate={{ 
                                                            width: `${loc.percentage}%`,
                                                            backgroundColor: isActive ? "#10b981" : "#12ac75"
                                                        }}
                                                        transition={{ duration: 1.2, ease: "circOut" }}
                                                        className="h-full rounded-xl"
                                                    />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
