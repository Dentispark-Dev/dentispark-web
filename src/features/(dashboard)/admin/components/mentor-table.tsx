"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    CheckCircle,
    Loader2,
    UserCheck
} from "lucide-react";
import { adminService } from "@/src/connection/admin-service";
import { MentorQuery } from "@/src/connection/api-types";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/src/components/ui/dropdown-menu";
import { Badge } from "@/src/components/ui/badge";
import { toast } from "sonner";
import { InviteMentorModal } from "./invite-mentor-modal";

export function MentorTable() {
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const [query, setQuery] = useState<MentorQuery>({
        page: 0,
        perPage: 10,
        searchKey: "",
        platformMemberCategory: "",
        platformMemberProfileStatus: "",
        verified: undefined
    });

    const [searchInput, setSearchInput] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["admin-mentors", query],
        queryFn: () => adminService.getMentorRecords(query),
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            adminService.updateMentorStatus(id, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-mentors"] });
            toast.success("Mentor status updated successfully");
        },
        onError: () => {
            toast.error("Failed to update mentor status");
        }
    });

    const verifyMentorMutation = useMutation({
        mutationFn: ({ id, verify }: { id: string; verify: boolean }) =>
            adminService.verifyMentor(id, { verify }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-mentors"] });
            toast.success("Mentor verification updated successfully");
        },
        onError: () => {
            toast.error("Failed to update mentor verification");
        }
    });

    const handleSearch = () => {
        setQuery(prev => ({ ...prev, searchKey: searchInput, page: 0 }));
    };

    const handlePageChange = (newPage: number) => {
        setQuery(prev => ({ ...prev, page: newPage }));
    };

    const getStatusBadge = (status: string) => {
        switch (status.toUpperCase()) {
            case "ACTIVE":
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none">Active</Badge>;
            case "INACTIVE":
                return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-none">Inactive</Badge>;
            case "SUSPENDED":
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none">Suspended</Badge>;
            default:
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">{status}</Badge>;
        }
    };

    const paginatedData = data;
    const mentors = paginatedData?.content || [];
    const totalPages = paginatedData?.totalPages || 0;
    const currentPage = paginatedData?.pageNumber || 0;

    return (
        <div className="space-y-4">
            {/* Filters & Actions */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by name, email or HID..."
                        className="pl-10 h-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <Button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="bg-secondary-600 hover:bg-secondary-700 text-white gap-2 h-10"
                    >
                        <UserCheck className="h-4 w-4" />
                        Invite Mentor
                    </Button>
                    <Button variant="outline" className="flex gap-2 h-10 border-gray-200">
                        <Filter className="h-4 w-4" />
                        Filter
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mentor</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">HID</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Specialization</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Verification</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
                                            <p className="text-gray-400 text-sm">Loading mentors...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : mentors.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        No mentors found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                mentors.map((mentor) => (
                                    <tr key={mentor.hid} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-secondary-50 flex items-center justify-center text-secondary-600 font-semibold">
                                                    {mentor.mentorName?.[0] || "?"}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{mentor.mentorName}</p>
                                                    <p className="text-xs text-gray-500">Joined on {new Date(mentor.dateStamped).toLocaleDateString("en-GB")}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                                            {mentor.hid}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {mentor.dentalSchoolGateway || "General Dentistry"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {mentor.verified ? (
                                                <div className="flex items-center gap-1 text-green-600">
                                                    <CheckCircle className="h-4 w-4" />
                                                    <span className="text-xs font-medium">Verified</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-gray-400">
                                                    <UserCheck className="h-4 w-4" />
                                                    <span className="text-xs font-medium">Pending</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(mentor.activationStatus)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => window.location.href = `/admin/mentors/${mentor.hid}`}>
                                                        View Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => verifyMentorMutation.mutate({ id: mentor.hid, verify: !mentor.verified })}>
                                                        {mentor.verified ? "Unverify Mentor" : "Verify Mentor"}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: mentor.hid, status: "ACTIVE" })}>
                                                        Activate Account
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: mentor.hid, status: "INACTIVE" })} className="text-red-600">
                                                        Deactivate Account
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                        <p className="text-sm text-gray-500">
                            Showing <span className="font-medium">{(currentPage * query.perPage!) + 1}</span> to <span className="font-medium">{Math.min((currentPage + 1) * query.perPage!, paginatedData?.totalElements || 0)}</span> of <span className="font-medium">{paginatedData?.totalElements}</span> results
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 0}
                                onClick={() => handlePageChange(currentPage - 1)}
                                className="h-8 px-2 border-gray-200"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage >= totalPages - 1}
                                onClick={() => handlePageChange(currentPage + 1)}
                                className="h-8 px-2 border-gray-200"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            {/* Modal */}
            <InviteMentorModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
            />
        </div>
    );
}
