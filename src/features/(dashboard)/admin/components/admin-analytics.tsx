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
    Download
} from "lucide-react";
import { adminService } from "../../../../connection/admin-service";
import { motion, AnimatePresence } from "framer-motion";
import { TrafficAnalytics } from "../../../../connection/api-types";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";

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

    if (isSummaryLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-t-2 border-b-2 border-primary-600 animate-spin" />
                    <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary-600" />
                </div>
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
            gradient: "from-blue-600 to-indigo-600",
            lightColor: "bg-blue-500/10"
        },
        {
            title: "Total Mentors",
            value: totalMentors.toLocaleString(),
            change: "+5.2%",
            isPositive: true,
            icon: UserCheck,
            gradient: "from-emerald-600 to-teal-600",
            lightColor: "bg-emerald-500/10"
        },
        {
            title: "Active Courses",
            value: "24",
            change: "+2",
            isPositive: true,
            icon: BookOpen,
            gradient: "from-purple-600 to-pink-600",
            lightColor: "bg-purple-500/10"
        },
        {
            title: "Global Reach",
            value: totalUsers.toLocaleString(),
            change: "-1.4%",
            isPositive: false,
            icon: TrendingUp,
            gradient: "from-orange-600 to-rose-600",
            lightColor: "bg-orange-500/10"
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
        <div className="space-y-8 pb-10">
            {/* Header & Filter Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <AnimatePresence>
                        {hasFilters && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex items-center gap-2"
                            >
                                <Badge className="bg-primary-50 text-primary-700 border-none hover:bg-primary-100 flex items-center gap-2 px-3 py-1 text-xs">
                                    Filtering Active
                                </Badge>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={clearFilters}
                                    className="h-8 text-xs text-gray-400 hover:text-red-500 hover:bg-red-50"
                                >
                                    <XCircle className="h-3.5 w-3.5 mr-1" />
                                    Clear All
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="h-9 px-4 text-xs font-bold rounded-xl bg-white border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-95">
                        <Download className="h-3.5 w-3.5 mr-2" />
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Glassmorphic Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        className="group relative overflow-hidden bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-white/40 ring-1 ring-black/5"
                    >
                        <div className={`absolute top-0 right-0 h-24 w-24 bg-gradient-to-br ${stat.gradient} opacity-[0.03] rounded-bl-full group-hover:scale-150 transition-transform duration-700`} />
                        
                        <div className="flex items-center justify-between mb-6">
                            <div className={`p-3 rounded-2xl ${stat.lightColor} ring-1 ring-white shadow-sm`}>
                                <stat.icon className={`h-6 w-6 bg-clip-text text-transparent bg-gradient-to-br ${stat.gradient}`} />
                            </div>
                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {stat.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                {stat.change}
                            </div>
                        </div>
                        
                        <div className="space-y-1">
                            <h3 className="text-gray-500 text-sm font-semibold tracking-wide uppercase">{stat.title}</h3>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Growth Trends - 2/3 Width */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="lg:col-span-2 bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-gray-200/40 border border-white/50"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Registration Trends</h3>
                            <p className="text-sm text-gray-500 font-medium">Platform growth trajectory</p>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-50/80 backdrop-blur-sm p-1.5 rounded-2xl border border-gray-100">
                            {['7D', '30D', '90D'].map((p) => (
                                <button key={p} className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${p === '7D' ? 'bg-white text-primary-600 shadow-md ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'}`}>
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-72 relative mt-4">
                        <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="gradient-students" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#12ac75" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#12ac75" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path 
                                d="M0,250 C100,220 200,260 300,180 C400,100 500,150 600,80 C700,10 800,90 1000,40 L1000,300 L0,300 Z" 
                                fill="url(#gradient-students)" 
                            />
                            <motion.path 
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                                d="M0,250 C100,220 200,260 300,180 C400,100 500,150 600,80 C700,10 800,90 1000,40" 
                                fill="none" 
                                stroke="#12ac75" 
                                strokeWidth="4"
                                strokeLinecap="round"
                            />
                        </svg>
                        
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                            {[250, 180, 80, 40].map((y, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1.5 + (i * 0.2), type: "spring" }}
                                    style={{ left: `${[0, 30, 60, 100][i]}%`, top: `${y/3}%` }}
                                    className="absolute h-3 w-3 bg-white border-2 border-primary-600 rounded-full shadow-lg -translate-x-1/2 -translate-y-1/2"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between border-t border-gray-100/50 pt-6">
                        <div className="flex gap-8">
                            <div className="flex items-center gap-2.5">
                                <div className="h-3 w-3 bg-emerald-500 rounded-full ring-4 ring-emerald-500/20" />
                                <span className="text-xs font-bold text-gray-600">Students</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="h-3 w-3 bg-indigo-500 rounded-full ring-4 ring-indigo-500/20" />
                                <span className="text-xs font-bold text-gray-600">Mentors</span>
                            </div>
                        </div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Updates Enabled</div>
                    </div>
                </motion.div>

                {/* Traffic Insights - 1/3 Width */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-gray-200/40 border border-white/50"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">Traffic Origins</h3>
                        {isTrafficLoading && <div className="h-4 w-4 border-2 border-primary-600 border-t-transparent animate-spin rounded-full" />}
                    </div>
                    
                    <div className="space-y-8">
                        {/* Device Breakdown */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Devices</span>
                                <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">Interactive</span>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
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
                                            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-300 relative ${
                                                isActive 
                                                ? "bg-primary-50 border-primary-200 shadow-sm ring-1 ring-primary-500/20" 
                                                : "bg-gray-50/50 border-gray-100/50 hover:bg-white hover:border-primary-100"
                                            }`}
                                        >
                                            <Icon className={`h-4 w-4 ${isActive ? "text-primary-600" : "text-gray-400"}`} />
                                            <span className={`text-[10px] font-bold ${isActive ? "text-primary-700" : "text-gray-500"}`}>{device.label}</span>
                                            <span className={`text-sm font-black ${isActive ? "text-primary-900" : "text-gray-900"}`}>{device.percentage}%</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Top Locations */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Top Locations</span>
                                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                            </div>
                            <div className="space-y-3.5">
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
                                            className={`w-full group text-left space-y-1.5 p-2 rounded-xl transition-all ${
                                                isActive ? "bg-primary-50 ring-1 ring-primary-500/10" : "hover:bg-gray-50"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between text-xs font-bold">
                                                <span className={`${isActive ? "text-primary-700" : "text-gray-700"}`}>{loc.label}</span>
                                                <span className={`${isActive ? "text-primary-600" : "text-gray-400"}`}>{loc.percentage}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={false}
                                                    animate={{ 
                                                        width: `${loc.percentage}%`,
                                                        backgroundColor: isActive ? "#10b981" : "#12ac75"
                                                    }}
                                                    transition={{ duration: 1, delay: 0.2 }}
                                                    className="h-full rounded-full"
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
    );
}
