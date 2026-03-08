"use client";

import { useQuery } from "@tanstack/react-query";
import {
    Users,
    UserCheck,
    BookOpen,
    TrendingUp,
    Loader2,
    Calendar,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";
import { adminService } from "../../../../connection/admin-service";
import { motion } from "framer-motion";

export function AdminDashboardAnalytics() {
    const { data: summaryData, isLoading: isSummaryLoading } = useQuery({
        queryKey: ["admin-dashboard-summary"],
        queryFn: () => adminService.getDashboardSummary(),
    });

    const { data: growthData, isLoading: isGrowthLoading } = useQuery({
        queryKey: ["admin-growth-analytics"],
        queryFn: () => adminService.getGrowthAnalytics(7),
    });

    if (isSummaryLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
            </div>
        );
    }

    const summary = summaryData?.responseData;
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
            color: "bg-blue-50 text-blue-600"
        },
        {
            title: "Total Mentors",
            value: totalMentors.toLocaleString(),
            change: "+5.2%",
            isPositive: true,
            icon: UserCheck,
            color: "bg-green-50 text-green-600"
        },
        {
            title: "Active Courses",
            value: "24",
            change: "+2",
            isPositive: true,
            icon: BookOpen,
            color: "bg-purple-50 text-purple-600"
        },
        {
            title: "Overall Growth",
            value: totalUsers.toLocaleString(),
            change: "-1.4%",
            isPositive: false,
            icon: TrendingUp,
            color: "bg-orange-50 text-orange-600"
        }
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg ${stat.color}`}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {stat.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                {stat.change}
                            </div>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Growth Chart Placeholder */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-gray-900">User Growth</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                            <Calendar className="h-3 w-3" />
                            Last 7 Days
                        </div>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-2 px-2">
                        {[40, 65, 45, 90, 75, 55, 85].map((height, i) => (
                            <div key={i} className="flex-1 space-y-2 group relative">
                                <div className="flex gap-1 h-full items-end">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height}%` }}
                                        className="w-full bg-primary-500/20 group-hover:bg-primary-500/40 rounded-t-sm transition-colors"
                                    />
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height * 0.7}%` }}
                                        className="w-full bg-secondary-500/20 group-hover:bg-secondary-500/40 rounded-t-sm transition-colors"
                                    />
                                </div>
                                <div className="text-[10px] text-gray-400 text-center">Day {i + 1}</div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 bg-primary-500 rounded-full" />
                            <span className="text-xs text-gray-600">Students</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 bg-secondary-500 rounded-full" />
                            <span className="text-xs text-gray-600">Mentors</span>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Placeholder */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-gray-900">Global Activity</h3>
                        <button className="text-xs text-primary-600 font-medium hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                            <div key={i} className="flex items-start gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                <div className="h-8 w-8 rounded-full bg-gray-100 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900 truncate">
                                        <span className="font-medium">User {i + 1}</span> updated their profile
                                    </p>
                                    <p className="text-xs text-gray-500">2 minutes ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
